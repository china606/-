// ==========================================
// 游戏核心逻辑
// ==========================================

class GameLogic {
  constructor() {
    this.state = this.createInitialState();
    this.eventQueue = [];
    this.historicalEventTriggered = new Set();
  }

  createInitialState() {
    return {
      // 基本信息
      year: 1936,
      month: 1,
      isPaused: false,
      speed: 1, // 1x, 2x, 5x
      playerNation: null,
      gameOver: false,
      victoryType: null,

      // 资源
      money: 1000,
      industry: 10,
      food: 50,
      military: 1000,
      happiness: 70,
      population: 1000, // 万
      research: 0,

      // 主义
      ideology: null,
      ideologyUnlocks: [],

      // 省份所有权 { provinceId: nationId }
      provinceOwners: {},
      // 军队位置 { provinceId: { nation, troops } }
      armyPositions: {},
      // 省份数据缓存
      provinceData: {},

      // 科技
      researched: new Set(),
      researchProgress: {},

      // 核武
      nuclearProgress: 0,
      hasNukes: false,

      // 统计
      stats: {
        provincesConquered: 0,
        totalMilitaryProduced: 0,
        totalMoneyEarned: 0,
        battlesWon: 0,
        battlesLost: 0,
        civiliansLost: 0
      }
    };
  }

  initNation(nationId) {
    const nation = GAME_DATA.nations[nationId];
    if (!nation) return;

    this.state.playerNation = nationId;
    this.state.money = nation.startMoney;
    this.state.industry = nation.startIndustry;
    this.state.food = nation.startFood;
    this.state.military = nation.startMilitary;
    this.state.happiness = nation.startHappiness;
    this.state.population = nation.startPop;
    this.state.ideology = nation.ideology;

    // 初始化省份所有权 - 玩家省份
    for (const provId of nation.provinces) {
      this.state.provinceOwners[provId] = nationId;
      this.state.armyPositions[provId] = {
        nation: nationId,
        troops: Math.floor(nation.startMilitary / nation.provinces.length) + 50
      };
      // 复制省份数据
      this.state.provinceData[provId] = { ...GAME_DATA.provinces[provId] };
    }

    // 初始化AI国家
    this.initAINations(nationId);

    // 应用主义效果
    this.applyIdeologyEffects();

    // 标记历史事件
    this.state.historicalEvents = [...nation.historicalEvents];
  }

  initAINations(excludeId) {
    for (const [id, nation] of Object.entries(GAME_DATA.nations)) {
      if (id === excludeId) continue;

      for (const provId of nation.provinces) {
        this.state.provinceOwners[provId] = id;
        const aiMilitary = Math.floor(nation.startMilitary * (0.8 + Math.random() * 0.4) / nation.provinces.length);
        this.state.armyPositions[provId] = {
          nation: id,
          troops: Math.max(50, aiMilitary)
        };
        this.state.provinceData[provId] = { ...GAME_DATA.provinces[provId] };
      }
    }
  }

  applyIdeologyEffects() {
    if (!this.state.ideology) return;
    const ideo = GAME_DATA.ideologies[this.state.ideology];
    if (!ideo) return;

    if (ideo.effects.happiness) this.state.happiness += ideo.effects.happiness;
    if (ideo.effects.money) this.state.money += ideo.effects.money;
    if (ideo.effects.industry) this.state.industry += ideo.effects.industry;
    if (ideo.effects.militaryProd) this.state.militaryProd = (this.state.militaryProd || 0) + ideo.effects.militaryProd;
    if (ideo.effects.research) this.state.research += ideo.effects.research;
    if (ideo.effects.manpower) this.state.manpower = (this.state.manpower || 0) + ideo.effects.manpower;

    this.state.ideologyUnlocks = [...ideo.unlocks];
  }

  // ---- 游戏循环 ----
  update(dt) {
    if (this.state.isPaused || this.state.gameOver) return;

    // 更新时间
    this.state.month += dt * this.state.speed * 0.5;
    if (this.state.month >= 12) {
      this.state.year += Math.floor(this.state.month / 12);
      this.state.month = this.state.month % 12;
      this.onNewYear();
    }

    // 资源产出
    this.produceResources(dt);

    // 检查历史事件
    this.checkHistoricalEvents();

    // AI更新
    this.updateAI(dt);

    // 检查胜利条件
    this.checkVictoryConditions();

    // 叛乱检查
    this.checkRebellions(dt);
  }

  produceResources(dt) {
    const s = this.state;
    const speed = s.speed;

    // 金钱：工业 * 系数
    s.money += s.industry * 0.5 * dt * speed;

    // 粮食：农业产出
    s.food += (s.foodProd || 5) * dt * speed;

    // 军事：工业生产
    const milProd = 1 + (s.militaryProd || 0) / 100;
    s.military += s.industry * 0.3 * milProd * dt * speed;

    // 人口自然增长
    s.population += s.population * GAME_DATA.config.populationGrowthRate * dt * speed;

    // 幸福度自然衰减（回归均值）
    if (s.happiness > 50) {
      s.happiness -= GAME_DATA.config.happinessDecayRate * dt * speed;
    }

    // 粮食消耗
    s.food -= s.population * GAME_DATA.config.foodConsumptionRate * dt * speed;
    if (s.food < 0) {
      s.food = 0;
      s.happiness -= 0.5 * dt * speed;
    }

    // 金钱下限
    if (s.money < 0) s.money = 0;
  }

  onNewYear() {
    // 每年触发
    const s = this.state;
    s.money += 50 * s.industry; // 年度工业收入

    // 随机事件
    if (Math.random() < 0.3) {
      this.triggerRandomEvent();
    }

    // 通知
    if (window.ui) {
      window.ui.notify(`年份推进：${s.year}年`, 'info');
    }
  }

  triggerRandomEvent() {
    const events = [
      { text: "经济大萧条影响，工业产出下降", effect: { industry: -1 }, type: 'warning' },
      { text: "丰收年！粮食产量大增", effect: { food: 20 }, type: 'success' },
      { text: "暴乱事件！幸福度下降", effect: { happiness: -5 }, type: 'danger' },
      { text: "科技人才涌入，研究进展加速", effect: { research: 5 }, type: 'success' },
      { text: "矿产发现！工业提升", effect: { industry: 2 }, type: 'success' },
      { text: "瘟疫蔓延，人口减少", effect: { population: -200 }, type: 'danger' },
      { text: "贸易协定签署，资金增加", effect: { money: 100 }, type: 'success' },
      { text: "军事演习成功，军力提升", effect: { military: 100 }, type: 'success' }
    ];

    const evt = events[Math.floor(Math.random() * events.length)];
    this.applyEffect(evt.effect);

    if (window.ui) {
      window.ui.notify(evt.text, evt.type);
    }
  }

  // ---- 历史事件 ----
  checkHistoricalEvents() {
    for (const [eventId, event] of Object.entries(GAME_DATA.historicalEvents)) {
      if (this.historicalEventTriggered.has(eventId)) continue;
      if (this.state.year < event.year) continue;

      // 检查是否相关国家
      const nation = this.state.playerNation;
      const nationData = GAME_DATA.nations[nation];
      if (nationData && nationData.historicalEvents.includes(eventId)) {
        this.historicalEventTriggered.add(eventId);
        if (window.ui) {
          window.ui.showHistoricalEvent(eventId, event);
        }
        return; // 一次只触发一个
      }
    }
  }

  // ---- 军事行动 ----
  canAttack(fromProvince, toProvince) {
    const s = this.state;
    // 检查省份存在
    if (!s.provinceOwners[fromProvince] || !s.provinceOwners[toProvince]) return false;
    // 检查是否自己的省份
    if (s.provinceOwners[fromProvince] !== s.playerNation) return false;
    // 检查目标不是自己的
    if (s.provinceOwners[toProvince] === s.playerNation) return false;
    // 检查相邻（简化：所有省份可攻击）
    // 检查军队
    if (!s.armyPositions[fromProvince] || s.armyPositions[fromProvince].troops < 100) return false;
    // 检查金钱
    if (s.money < GAME_DATA.config.baseAttackCost) return false;

    return true;
  }

  attackProvince(fromId, toId, troopCount) {
    const s = this.state;
    if (!this.canAttack(fromId, toId)) return false;

    // 扣除费用
    s.money -= GAME_DATA.config.baseAttackCost;
    s.money -= troopCount * 0.1;

    // 获取攻防数据
    const attackerArmy = s.armyPositions[fromId];
    const defenderOwner = s.provinceOwners[toId];
    const defenderArmy = s.armyPositions[toId];

    // 攻击力计算
    const attackPower = troopCount * (1 + (s.militaryProd || 0) / 100);
    const defensePower = defenderArmy ? defenderArmy.troops * 0.8 : GAME_DATA.config.provinceDefenseBase;

    // 省份防御加成
    const provData = s.provinceData[toId];
    const defenseBonus = (provData.industry || 0) * 5 + (provData.military || 0) * 10;

    const totalDefense = defensePower + defenseBonus;

    // 战斗结果
    if (attackPower > totalDefense) {
      // 攻击成功
      this.onAttackSuccess(fromId, toId, troopCount, attackPower, totalDefense);
      return true;
    } else {
      // 攻击失败
      this.onAttackFailure(fromId, toId, troopCount, attackPower, totalDefense);
      return false;
    }
  }

  onAttackSuccess(fromId, toId, troops, attackPower, defense) {
    const s = this.state;
    const defenderOwner = s.provinceOwners[toId];

    // 占领省份
    s.provinceOwners[toId] = s.playerNation;

    // 驻军
    const remainingTroops = Math.floor(troops * 0.6);
    s.armyPositions[toId] = {
      nation: s.playerNation,
      troops: remainingTroops
    };

    // 从出发地扣除军队
    s.armyPositions[fromId].troops -= troops;

    // 获得省份资源
    const provData = s.provinceData[toId];
    s.population += (provData.pop || 0) * 0.1;
    s.industry += (provData.industry || 0) * 0.3;
    s.food += (provData.food || 0) * 0.5;

    // 统计
    s.stats.provincesConquered++;
    s.stats.battlesWon++;
    s.stats.civiliansLost += Math.floor(defense * 0.05);

    // 幸福度影响
    s.happiness += 3;

    // 动画
    if (window.mapRenderer) {
      window.mapRenderer.addExpansionAnimation(toId, s.playerNation);
      window.mapRenderer.addBattleEffect(toId);
    }

    if (window.ui) {
      const provName = GAME_DATA.provinces[toId]?.name || toId;
      window.ui.notify(`成功占领 ${provName}！`, 'success');
      window.ui.updateResources();
    }
  }

  onAttackFailure(fromId, toId, troops, attackPower, defense) {
    const s = this.state;

    // 军队损失
    const loss = Math.floor(troops * 0.5);
    s.armyPositions[fromId].troops -= loss;

    // 统计
    s.stats.battlesLost++;

    // 幸福度下降
    s.happiness -= 5;

    // 动画
    if (window.mapRenderer) {
      window.mapRenderer.addBattleEffect(toId);
    }

    if (window.ui) {
      const provName = GAME_DATA.provinces[toId]?.name || toId;
      window.ui.notify(`进攻 ${GAME_DATA.provinces[toId]?.name || toId} 失败！损失 ${loss} 部队`, 'danger');
      window.ui.updateResources();
    }
  }

  // ---- AI逻辑 ----
  updateAI(dt) {
    for (const [nationId, nation] of Object.entries(GAME_DATA.nations)) {
      if (nationId === this.state.playerNation) continue;

      // 简单AI：随机扩展
      if (Math.random() < 0.02 * dt * this.state.speed) {
        this.aiExpand(nationId);
      }

      // AI省份资源产出
      const aiProvinces = Object.entries(this.state.provinceOwners)
        .filter(([pid, nid]) => nid === nationId);

      for (const [pid] of aiProvinces) {
        const provData = this.state.provinceData[pid];
        if (provData) {
          // AI军队缓慢增长
          if (this.state.armyPositions[pid]) {
            this.state.armyPositions[pid].troops += 0.5 * dt * this.state.speed;
          }
        }
      }
    }
  }

  aiExpand(nationId) {
    // AI选择随机省份尝试扩张
    const aiProvinces = Object.entries(this.state.provinceOwners)
      .filter(([pid, nid]) => nid === nationId)
      .map(([pid]) => pid);

    if (aiProvinces.length === 0) return;

    const fromId = aiProvinces[Math.floor(Math.random() * aiProvinces.length)];
    const allProvinces = Object.keys(GAME_DATA.provinces);
    const targetId = allProvinces[Math.floor(Math.random() * allProvinces.length)];

    if (this.state.provinceOwners[targetId] === nationId) return;

    // 简单战斗
    const attackerArmy = this.state.armyPositions[fromId];
    if (!attackerArmy || attackerArmy.troops < 150) return;

    const attackTroops = Math.floor(attackerArmy.troops * 0.5);
    const attackPower = attackTroops * 0.8;
    const defenderArmy = this.state.armyPositions[targetId];
    const defensePower = defenderArmy ? defenderArmy.troops * 0.8 : GAME_DATA.config.provinceDefenseBase;

    if (attackPower > defensePower) {
      // AI占领
      this.state.provinceOwners[targetId] = nationId;
      this.state.armyPositions[targetId] = {
        nation: nationId,
        troops: Math.floor(attackTroops * 0.5)
      };
      attackerArmy.troops -= attackTroops;

      if (window.mapRenderer) {
        window.mapRenderer.addExpansionAnimation(targetId, nationId);
      }
    } else {
      attackerArmy.troops -= Math.floor(attackTroops * 0.3);
    }
  }

  // ---- 叛乱系统 ----
  checkRebellions(dt) {
    if (this.state.happiness < GAME_DATA.config.rebellionThreshold) {
      if (Math.random() < 0.01 * dt * this.state.speed) {
        this.triggerRebellion();
      }
    }
  }

  triggerRebellion() {
    // 随机丢失一个省份
    const playerProvinces = Object.entries(this.state.provinceOwners)
      .filter(([pid, nid]) => nid === this.state.playerNation);

    if (playerProvinces.length <= 1) return;

    const [lostPid] = playerProvinces[Math.floor(Math.random() * playerProvinces.length)];

    // 变成无主
    delete this.state.provinceOwners[lostPid];
    delete this.state.armyPositions[lostPid];

    this.state.happiness -= 10;

    if (window.ui) {
      const provName = GAME_DATA.provinces[lostPid]?.name || lostPid;
      window.ui.notify(`叛乱爆发！${provName} 脱离控制！`, 'danger');
    }
  }

  // ---- 胜利条件 ----
  checkVictoryConditions() {
    const s = this.state;
    const totalProvinces = Object.keys(GAME_DATA.provinces).length;
    const playerProvinces = Object.values(s.provinceOwners).filter(n => n === s.playerNation).length;

    // 世界统治
    if (playerProvinces / totalProvinces >= GAME_DATA.config.victoryConditions.worldDomination) {
      this.triggerVictory('domination');
      return;
    }

    // 经济胜利
    if (s.money >= GAME_DATA.config.victoryConditions.economicVictory) {
      this.triggerVictory('economic');
      return;
    }

    // 军事胜利
    if (s.military >= GAME_DATA.config.victoryConditions.militaryVictory) {
      this.triggerVictory('military');
      return;
    }

    // 科技胜利
    if (s.research >= GAME_DATA.config.victoryConditions.researchVictory) {
      this.triggerVictory('research');
      return;
    }

    // 时间到
    if (s.year >= GAME_DATA.config.yearEnd) {
      this.triggerDefeat('time');
    }
  }

  triggerVictory(type) {
    s.gameOver = true;
    s.victoryType = type;

    const messages = {
      domination: '世界统治！你征服了大部分领土！',
      economic: '经济霸权！你的国家成为经济霸主！',
      military: '军事霸权！你的军力无人能敌！',
      research: '科技领先！你的科技遥遥领先！'
    };

    if (window.ui) {
      window.ui.showGameOver(true, messages[type]);
    }
  }

  triggerDefeat(reason) {
    s.gameOver = true;
    const messages = {
      time: '时间耗尽，未能达成目标。'
    };
    if (window.ui) {
      window.ui.showGameOver(false, messages[reason] || '游戏结束');
    }
  }

  // ---- 效果应用 ----
  applyEffect(effect) {
    const s = this.state;
    if (effect.money) s.money += effect.money;
    if (effect.industry) s.industry += effect.industry;
    if (effect.food) s.food += effect.food;
    if (effect.military) s.military += effect.military;
    if (effect.happiness) s.happiness += effect.happiness;
    if (effect.population) s.population += effect.population;
    if (effect.research) s.research += effect.research;
    if (effect.militaryProd) s.militaryProd = (s.militaryProd || 0) + effect.militaryProd;
    if (effect.manpower) s.manpower = (s.manpower || 0) + effect.manpower;
    if (effect.foodProd) s.foodProd = (s.foodProd || 0) + effect.foodProd;

    // 限制范围
    s.happiness = Math.max(0, Math.min(100, s.happiness));
    s.money = Math.max(0, s.money);
    s.food = Math.max(0, s.food);
  }

  // ---- 省份间移动军队（可视化拖动） ----
  moveArmy(fromId, toId, troopCount) {
    const s = this.state;
    if (!s.armyPositions[fromId] || s.armyPositions[fromId].troops < troopCount) return false;
    if (s.provinceOwners[fromId] !== s.playerNation) return false;

    // 移动军队
    s.armyPositions[fromId].troops -= troopCount;

    if (s.armyPositions[toId] && s.armyPositions[toId].nation === s.playerNation) {
      // 合并
      s.armyPositions[toId].troops += troopCount;
    } else {
      s.armyPositions[toId] = {
        nation: s.playerNation,
        troops: troopCount
      };
      // 占领空省份
      if (!s.provinceOwners[toId] || s.provinceOwners[toId] !== s.playerNation) {
        s.provinceOwners[toId] = s.playerNation;
      }
    }

    // 动画
    if (window.mapRenderer) {
      window.mapRenderer.addArmyMovement(fromId, toId, troopCount, s.playerNation);
    }

    return true;
  }
}

