// ==========================================
// UI管理器
// ==========================================

class UI {
  constructor() {
    this.activePanel = null;
    this.tooltip = null;
    this.initTooltip();
  }

  initTooltip() {
    // 创建悬浮提示框
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'province-tooltip';
    document.getElementById('game-container').appendChild(this.tooltip);
  }

  // ---- 国家选择面板 ----
  renderNationSelect() {
    const grid = document.getElementById('nation-grid');
    grid.innerHTML = '';

    for (const [id, nation] of Object.entries(GAME_DATA.nations)) {
      const card = document.createElement('div');
      card.className = 'nation-card';
      card.innerHTML = `
        <div class="flag">${nation.flag}</div>
        <div class="nation-name-text">${nation.name}</div>
        <div class="nation-stats">
          人口: ${nation.startPop}万<br>
          工业: ${nation.startIndustry}<br>
          军力: ${nation.startMilitary}<br>
          金钱: ${nation.startMoney}<br>
          幸福: ${nation.startHappiness}%<br>
          领袖: ${nation.leader}
        </div>
      `;
      card.addEventListener('click', () => this.selectNation(id));
      grid.appendChild(card);
    }
  }

  selectNation(nationId) {
    if (window.gameInstance) {
      window.gameInstance.initNation(nationId);
      document.getElementById('nation-select').classList.remove('active');
      document.getElementById('nation-name').textContent = GAME_DATA.nations[nationId].name;
      this.notify(`你选择了 ${GAME_DATA.nations[nationId].name}`, 'success');
      this.updateResources();
    }
  }

  // ---- 面板管理 ----
  showPanel(panelName) {
    // 关闭当前面板
    if (this.activePanel) {
      document.getElementById(this.activePanel + '-panel').classList.remove('active');
    }

    // 显示新面板
    const panel = document.getElementById(panelName + '-panel');
    panel.classList.add('active');
    this.activePanel = panelName;

    // 渲染面板内容
    this.renderPanelContent(panelName);
  }

  closePanel(panelName) {
    document.getElementById(panelName + '-panel').classList.remove('active');
    if (this.activePanel === panelName) {
      this.activePanel = null;
    }
  }

  renderPanelContent(panelName) {
    switch (panelName) {
      case 'ideology': this.renderIdeologyPanel(); break;
      case 'economy': this.renderEconomyPanel(); break;
      case 'civilian': this.renderCivilianPanel(); break;
      case 'agriculture': this.renderAgriculturePanel(); break;
      case 'military': this.renderMilitaryPanel(); break;
      case 'construction': this.renderConstructionPanel(); break;
      case 'finance': this.renderFinancePanel(); break;
      case 'funding': this.renderFundingPanel(); break;
      case 'nuclear': this.renderNuclearPanel(); break;
      case 'diplomacy': this.renderDiplomacyPanel(); break;
      case 'research': this.renderResearchPanel(); break;
    }
  }

  // ---- 主义面板 ----
  renderIdeologyPanel() {
    const container = document.getElementById('ideology-content');
    container.innerHTML = '<div style="margin-bottom:10px; font-size:12px; color:#aaa;">选择一个主义路线（不可更改）</div>';

    for (const [id, ideo] of Object.entries(GAME_DATA.ideologies)) {
      const currentIdeo = window.gameInstance?.state.ideology;
      const selected = currentIdeo === id;
      const disabled = currentIdeo && !selected;

      const btn = document.createElement('button');
      btn.className = `option-btn ${selected ? 'selected' : ''}`;
      btn.disabled = disabled;
      btn.innerHTML = `
        <span>${ideo.icon} ${ideo.name}</span>
        <span class="cost">${selected ? '✓ 已选择' : ''}</span>
        <span class="desc">${ideo.description}</span>
      `;
      btn.addEventListener('click', () => this.selectIdeology(id));
      container.appendChild(btn);
    }
  }

  selectIdeology(ideoId) {
    if (window.gameInstance && !window.gameInstance.state.ideology) {
      window.gameInstance.state.ideology = ideoId;
      window.gameInstance.applyIdeologyEffects();
      this.notify(`主义路线已选择：${GAME_DATA.ideologies[ideoId].name}`, 'success');
      this.renderIdeologyPanel();
      this.updateResources();
    }
  }

  // ---- 经济面板 ----
  renderEconomyPanel() {
    this.renderOptionList('economy-content', GAME_DATA.economyOptions, (opt) => {
      return window.gameInstance.state.money >= opt.cost;
    }, (opt) => this.purchaseOption(opt, 'economy'));
  }

  // ---- 民治面板 ----
  renderCivilianPanel() {
    this.renderOptionList('civilian-content', GAME_DATA.civilianOptions, (opt) => {
      return window.gameInstance.state.money >= opt.cost;
    }, (opt) => this.purchaseOption(opt, 'civilian'));
  }

  // ---- 农业面板 ----
  renderAgriculturePanel() {
    this.renderOptionList('agriculture-content', GAME_DATA.agricultureOptions, (opt) => {
      return window.gameInstance.state.money >= opt.cost;
    }, (opt) => this.purchaseOption(opt, 'agriculture'));
  }

  // ---- 军事面板 ----
  renderMilitaryPanel() {
    this.renderOptionList('military-content', GAME_DATA.militaryOptions, (opt) => {
      return window.gameInstance.state.money >= opt.cost;
    }, (opt) => this.purchaseOption(opt, 'military'));
  }

  // ---- 建设面板 ----
  renderConstructionPanel() {
    this.renderOptionList('construction-content', GAME_DATA.constructionOptions, (opt) => {
      return window.gameInstance.state.money >= opt.cost;
    }, (opt) => this.purchaseOption(opt, 'construction'));
  }

  // ---- 金融面板 ----
  renderFinancePanel() {
    this.renderOptionList('finance-content', GAME_DATA.financeOptions, (opt) => {
      return window.gameInstance.state.money >= Math.abs(opt.cost || 0);
    }, (opt) => this.purchaseOption(opt, 'finance'));
  }

  // ---- 资助面板 ----
  renderFundingPanel() {
    this.renderOptionList('funding-content', GAME_DATA.fundingOptions, (opt) => {
      return window.gameInstance.state.money >= opt.cost;
    }, (opt) => this.purchaseFunding(opt));
  }

  // ---- 核武面板 ----
  renderNuclearPanel() {
    const container = document.getElementById('nuclear-content');
    const s = window.gameInstance.state;

    let html = `
      <div style="margin-bottom:15px; padding:10px; background:rgba(255,150,0,0.1); border-radius:8px; font-size:12px; color:#f39c12;">
        核武器研发是最高机密项目。需要大量研究和工业投入。<br>
        当前核研发进度：${s.nuclearProgress || 0}% | 拥有核武：${s.hasNukes ? '是 ☢️' : '否'}
      </div>
      <div class="progress-bar" style="margin-bottom:15px;">
        <div class="progress-fill yellow" style="width:${(s.nuclearProgress || 0)}%;"></div>
      </div>
    `;
    container.innerHTML = html;

    for (const opt of GAME_DATA.nuclearOptions) {
      const canBuy = this.checkNuclearRequirements(opt);
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.disabled = !canBuy;
      btn.innerHTML = `
        <span>${opt.icon} ${opt.name}</span>
        <span class="cost">${opt.cost}💰</span>
        <span class="desc">${opt.desc}</span>
      `;
      btn.addEventListener('click', () => this.purchaseNuclear(opt));
      container.appendChild(btn);
    }
  }

  checkNuclearRequirements(opt) {
    const s = window.gameInstance.state;
    if (s.money < opt.cost) return false;
    if (opt.requires) {
      if (opt.requires.research && s.research < opt.requires.research) return false;
      if (opt.requires.industry && s.industry < opt.requires.industry) return false;
    }
    return true;
  }

  purchaseNuclear(opt) {
    const s = window.gameInstance.state;
    if (!this.checkNuclearRequirements(opt)) {
      this.notify('条件不满足', 'warning');
      return;
    }

    s.money -= opt.cost;
    s.nuclearProgress = (s.nuclearProgress || 0) + 15;

    if (s.nuclearProgress >= 100) {
      s.hasNukes = true;
      s.nuclearProgress = 100;
      this.notify('☢️ 核武器研发完成！你拥有了核威慑力量！', 'success');
    } else {
      this.notify(`核研发进度：${s.nuclearProgress}%`, 'info');
    }

    this.renderNuclearPanel();
    this.updateResources();
  }

  // ---- 外交面板 ----
  renderDiplomacyPanel() {
    const container = document.getElementById('diplomacy-content');
    const s = window.gameInstance.state;

    let html = '<div style="margin-bottom:10px; font-size:12px; color:#aaa;">与其他国家的关系</div>';
    container.innerHTML = html;

    for (const [id, nation] of Object.entries(GAME_DATA.nations)) {
      if (id === s.playerNation) continue;

      const rel = s.diplomacy?.[id] || 50;
      const relColor = rel > 70 ? '#2ecc71' : rel > 30 ? '#f39c12' : '#e74c3c';

      const div = document.createElement('div');
      div.className = 'army-info-row';
      div.innerHTML = `
        <span>${nation.flag} ${nation.name}</span>
        <span style="color:${relColor}">关系: ${rel}</span>
      `;

      const actions = document.createElement('div');
      actions.style.marginTop = '5px';
      actions.innerHTML = `
        <button class="option-btn" style="display:inline-block;width:auto;margin:2px;padding:5px 10px;font-size:11px;"
          onclick="window.ui.diplomaticAction('${id}', 'improve')">改善关系 (-50💰)</button>
        <button class="option-btn" style="display:inline-block;width:auto;margin:2px;padding:5px 10px;font-size:11px;"
          onclick="window.ui.diplomaticAction('${id}', 'demand')">索要领土</button>
        <button class="option-btn" style="display:inline-block;width:auto;margin:2px;padding:5px 10px;font-size:11px;"
          onclick="window.ui.diplomaticAction('${id}', 'alliance')">结盟 (-100💰)</button>
      `;

      div.appendChild(actions);
      container.appendChild(div);
    }
  }

  diplomaticAction(targetId, action) {
    const s = window.gameInstance.state;
    if (!s.diplomacy) s.diplomacy = {};

    switch (action) {
      case 'improve':
        if (s.money < 50) { this.notify('金钱不足', 'warning'); return; }
        s.money -= 50;
        s.diplomacy[targetId] = (s.diplomacy[targetId] || 50) + 10;
        this.notify(`与${GAME_DATA.nations[targetId].name}关系改善`, 'success');
        break;
      case 'demand':
        s.diplomacy[targetId] = (s.diplomacy[targetId] || 50) - 20;
        this.notify(`向${GAME_DATA.nations[targetId].name}索要领土，关系恶化`, 'warning');
        break;
      case 'alliance':
        if (s.money < 100) { this.notify('金钱不足', 'warning'); return; }
        s.money -= 100;
        s.diplomacy[targetId] = (s.diplomacy[targetId] || 50) + 25;
        this.notify(`与${GAME_DATA.nations[targetId].name}结成同盟`, 'success');
        break;
    }

    this.renderDiplomacyPanel();
    this.updateResources();
  }

  // ---- 科技面板 ----
  renderResearchPanel() {
    const container = document.getElementById('research-content');
    const s = window.gameInstance.state;

    let html = `
      <div style="margin-bottom:10px; font-size:12px; color:#aaa;">
        当前研究点数: ${Math.floor(s.research)}
      </div>
    `;
    container.innerHTML = html;

    for (const tech of GAME_DATA.researchTree) {
      const researched = s.researched.has(tech.id);
      const canResearch = this.canResearch(tech);

      const btn = document.createElement('button');
      btn.className = `option-btn ${researched ? 'selected' : ''}`;
      btn.disabled = researched || !canResearch;
      btn.innerHTML = `
        <span>${tech.icon} ${tech.name} (T${tech.tier})</span>
        <span class="cost">${tech.cost}💰</span>
        <span class="desc">${researched ? '已研发 ✓' : ''}</span>
      `;
      btn.addEventListener('click', () => this.researchTech(tech));
      container.appendChild(btn);
    }
  }

  canResearch(tech) {
    const s = window.gameInstance.state;
    if (s.researched.has(tech.id)) return false;
    if (s.money < tech.cost) return false;
    if (tech.requires) {
      for (const req of tech.requires) {
        if (!s.researched.has(req)) return false;
      }
    }
    return true;
  }

  researchTech(tech) {
    const s = window.gameInstance.state;
    if (!this.canResearch(tech)) return;

    s.money -= tech.cost;
    s.researched.add(tech.id);

    if (tech.effect.research) s.research += tech.effect.research;
    if (tech.effect.industry) s.industry += tech.effect.industry;
    if (tech.effect.militaryProd) s.militaryProd = (s.militaryProd || 0) + tech.effect.militaryProd;
    if (tech.effect.food) s.foodProd = (s.foodProd || 0) + tech.effect.food;
    if (tech.effect.population) s.population += tech.effect.population;
    if (tech.effect.money) s.money += tech.effect.money;

    this.notify(`科技研发完成：${tech.name}！`, 'success');
    this.renderResearchPanel();
    this.updateResources();
  }

  // ---- 通用选项购买 ----
  renderOptionList(containerId, options, enableCheck, onClick) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    for (const opt of options) {
      const enabled = enableCheck(opt);
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.disabled = !enabled;
      btn.innerHTML = `
        <span>${opt.icon} ${opt.name}</span>
        <span class="cost">${opt.cost}💰</span>
        <span class="desc">${opt.desc}</span>
      `;
      btn.addEventListener('click', () => onClick(opt));
      container.appendChild(btn);
    }
  }

  purchaseOption(opt, category) {
    const s = window.gameInstance.state;
    if (s.money < opt.cost) {
      this.notify('金钱不足！', 'warning');
      return;
    }

    s.money -= opt.cost;

    if (opt.effect) {
      s.military += (opt.effect.military || 0);
      s.industry += (opt.effect.industry || 0);
      s.food += (opt.effect.food || 0);
      s.happiness += (opt.effect.happiness || 0);
      s.population += (opt.effect.population || 0);
      s.research += (opt.effect.research || 0);
      s.money += (opt.effect.money || 0);
      s.militaryProd = (s.militaryProd || 0) + (opt.effect.militaryProd || 0);
      s.manpower = (s.manpower || 0) + (opt.effect.manpower || 0);
      s.foodProd = (s.foodProd || 0) + (opt.effect.foodProd || 0);
    }

    s.happiness = Math.max(0, Math.min(100, s.happiness));

    this.notify(`${opt.icon} ${opt.name} 已完成！`, 'success');
    this.renderPanelContent(category);
    this.updateResources();
  }

  purchaseFunding(opt) {
    const s = window.gameInstance.state;
    if (s.money < opt.cost) {
      this.notify('金钱不足！', 'warning');
      return;
    }

    s.money -= opt.cost;

    // 资助效果
    switch (opt.id) {
      case 'partisan_support':
        s.happiness -= 2;
        this.notify('资助了敌国游击队，国际关系恶化', 'warning');
        break;
      case 'coupe_fund':
        s.money -= 100;
        this.notify('资助政变行动，效果未知...', 'info');
        break;
      case 'proxy_war':
        s.military += 100;
        this.notify('代理人战争进行中，获得经验', 'info');
        break;
      case 'humanitarian':
        s.happiness += 5;
        this.notify('人道主义援助提升了国际声望', 'success');
        break;
      case 'tech_transfer':
        s.research += 10;
        this.notify('技术转让完成', 'success');
        break;
      case 'media_funding':
        s.happiness += 2;
        this.notify('媒体宣传影响了舆论', 'info');
        break;
      case 'sabotage':
        s.money -= 50;
        this.notify('破坏行动执行中...', 'warning');
        break;
      case 'diplomatic_bribe':
        s.money -= 70;
        this.notify('外交贿赂已送达', 'info');
        break;
    }

    this.updateResources();
  }

  // ---- 资源更新 ----
  updateResources() {
    const s = window.gameInstance.state;
    document.getElementById('money').textContent = Math.floor(s.money);
    document.getElementById('industry').textContent = Math.floor(s.industry);
    document.getElementById('food').textContent = Math.floor(s.food);
    document.getElementById('military').textContent = Math.floor(s.military);
    document.getElementById('happiness').textContent = Math.floor(s.happiness);
    document.getElementById('population').textContent = Math.floor(s.population) + '万';
    document.getElementById('year-display').textContent = `${s.year}年${Math.floor(s.month)}月`;
  }

  // ---- 省份悬浮提示 ----
  showProvinceTooltip(provinceId, mx, my) {
    const prov = GAME_DATA.provinces[provinceId];
    if (!prov) { this.hideProvinceTooltip(); return; }

    const s = window.gameInstance.state;
    const owner = s.provinceOwners[provinceId];
    const ownerName = owner ? GAME_DATA.nations[owner]?.name : '无主';
    const army = s.armyPositions[provinceId];

    this.tooltip.innerHTML = `
      <div class="province-name">${prov.name}</div>
      <div class="province-owner" style="color:${owner ? GAME_DATA.nations[owner].color : '#888'}">
        ${owner ? GAME_DATA.nations[owner].flag + ' ' : ''}${ownerName}
      </div>
      <div class="province-stat"><span>人口</span><span>${prov.pop || 0}万</span></div>
      <div class="province-stat"><span>工业</span><span>${prov.industry || 0}</span></div>
      <div class="province-stat"><span>军力</span><span>${prov.military || 0}</span></div>
      <div class="province-stat"><span>粮食</span><span>${prov.food || 0}</span></div>
      ${army ? `<div class="province-stat"><span>驻军</span><span>${Math.floor(army.troops)} ⚔️</span></div>` : ''}
      ${owner === s.playerNation ? '<div style="color:#e94560;margin-top:5px;">🖱️ 左键选择 | 右键拖动调兵</div>' : ''}
    `;

    this.tooltip.style.display = 'block';
    this.tooltip.style.left = (mx + 15) + 'px';
    this.tooltip.style.top = (my - 50) + 'px';
  }

  hideProvinceTooltip() {
    this.tooltip.style.display = 'none';
  }

  // ---- 历史事件弹窗 ----
  showHistoricalEvent(eventId, event) {
    const overlay = document.getElementById('historical-event');
    overlay.classList.remove('hidden');

    document.getElementById('event-title').textContent = event.title;
    document.getElementById('event-description').textContent = event.desc;

    const choicesDiv = document.getElementById('event-choices');
    choicesDiv.innerHTML = '';

    for (const choice of event.choices) {
      const btn = document.createElement('button');
      btn.className = 'event-choice-btn';
      btn.textContent = choice.text;
      btn.addEventListener('click', () => {
        this.makeEventChoice(eventId, choice);
      });
      choicesDiv.appendChild(btn);
    }
  }

  makeEventChoice(eventId, choice) {
    if (window.gameInstance) {
      window.gameInstance.applyEffect(choice.effect);
    }

    document.getElementById('historical-event').classList.add('hidden');
    this.updateResources();
    this.notify(`历史抉择已做出`, 'info');
  }

  // ---- 通知 ----
  notify(text, type = 'info') {
    const container = document.getElementById('notifications');
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = text;
    container.appendChild(notif);

    setTimeout(() => {
      if (notif.parentNode) notif.parentNode.removeChild(notif);
    }, 4000);
  }

  // ---- 游戏结束 ----
  showGameOver(isVictory, message) {
    const overlay = document.getElementById('game-over');
    overlay.classList.remove('hidden');

    document.getElementById('game-over-title').textContent = isVictory ? '🎉 胜利！' : '💀 失败';
    document.getElementById('game-over-title').style.color = isVictory ? '#2ecc71' : '#e94560';

    const s = window.gameInstance.state;
    document.getElementById('game-over-stats').innerHTML = `
      游戏时间：${s.year}年${Math.floor(s.month)}月<br>
      控制省份：${Object.values(s.provinceOwners).filter(n => n === s.playerNation).length}<br>
      人口：${Math.floor(s.population)}万<br>
      金钱：${Math.floor(s.money)}<br>
      军力：${Math.floor(s.military)}<br>
      研究：${Math.floor(s.research)}<br>
      战斗胜利：${s.stats.battlesWon} 次<br>
      战斗失败：${s.stats.battlesLost} 次<br>
      ${message}
    `;
  }
}

