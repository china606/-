// ==========================================
// 主程序 - 初始化与游戏循环
// ==========================================

// 全局实例
let gameInstance = null;
let mapRenderer = null;
let ui = null;

// 游戏状态
let lastTime = 0;
let accumulator = 0;

// 军队调动状态
let isMovingArmy = false;
let moveFromProvince = null;
let moveFromPos = null;

// ---- 初始化 ----
window.addEventListener('load', () => {
  initGame();
});

function initGame() {
  // 创建实例
  gameInstance = new GameLogic();
  mapRenderer = new MapRenderer('map-canvas');
  ui = new UI();

  // 全局引用
  window.gameInstance = gameInstance;
  window.mapRenderer = mapRenderer;
  window.ui = ui;

  // 渲染国家选择
  ui.renderNationSelect();

  // 初始提示
  setTimeout(() => {
    if (ui) ui.notify('请先选择一个国家开始游戏！', 'info');
  }, 500);

  // 启动游戏循环
  requestAnimationFrame(gameLoop);

  console.log('Virtual Nation Expansion - Initialized');
}

// ---- 游戏循环 ----
function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
  lastTime = timestamp;

  // 更新游戏逻辑
  if (gameInstance && gameInstance.state.playerNation) {
    gameInstance.update(dt);

    // 更新UI
    ui.updateResources();
  }

  // 渲染地图
  if (mapRenderer && gameInstance) {
    mapRenderer.render(gameInstance.state);
  }

  requestAnimationFrame(gameLoop);
}

// ---- 省份点击处理 ----
GameLogic.prototype.onProvinceClicked = function(provinceId, mx, my) {
  const s = this.state;

  // 如果没有选择国家，不处理
  if (!s.playerNation) return;

  // 右键拖动调兵模式
  if (isMovingArmy) {
    this.completeArmyMove(provinceId, mx, my);
    return;
  }

  // 左键选择
  s.selectedProvince = provinceId;

  const owner = s.provinceOwners[provinceId];
  const isOwned = owner === s.playerNation;

  // 显示选择信息
  const prov = GAME_DATA.provinces[provinceId];
  document.getElementById('selected-region').textContent =
    `${prov.name} - ${isOwned ? '我方' : (owner ? GAME_DATA.nations[owner].name : '无主')}`;

  // 如果是自己的省份，开始拖动调兵
  if (isOwned && s.armyPositions[provinceId]) {
    this.startArmyMove(provinceId, mx, my);
  } else if (owner && owner !== s.playerNation) {
    // 敌方省份 - 显示攻击选项
    this.showAttackPanel(provinceId);
  }
};

GameLogic.prototype.startArmyMove = function(provinceId, mx, my) {
  isMovingArmy = true;
  moveFromProvince = provinceId;
  moveFromPos = { x: mx, y: my };

  // 改变光标
  document.getElementById('map-canvas').style.cursor = 'crosshair';

  // 显示军队调动面板
  this.showArmyMovePanel(provinceId);
};

GameLogic.prototype.completeArmyMove = function(targetProvinceId, mx, my) {
  if (!isMovingArmy || !moveFromProvince) return;

  // 检查是否是自己的省份
  const s = this.state;
  const targetOwner = s.provinceOwners[targetProvinceId];
  const isOwned = targetOwner === s.playerNation;

  if (isOwned) {
    // 移动到自己省份 - 合并军队
    const fromArmy = s.armyPositions[moveFromProvince];
    if (fromArmy) {
      const moveTroops = Math.floor(fromArmy.troops * 0.5);
      if (moveTroops > 0) {
        this.moveArmy(moveFromProvince, targetProvinceId, moveTroops);
        ui.notify(`调动 ${moveTroops} 部队到 ${GAME_DATA.provinces[targetProvinceId].name}`, 'info');
      }
    }
  } else {
    // 攻击敌方省份
    const fromArmy = s.armyPositions[moveFromProvince];
    if (fromArmy) {
      const attackTroops = Math.floor(fromArmy.troops * 0.7);
      if (attackTroops > 0) {
        const success = this.attackProvince(moveFromProvince, targetProvinceId, attackTroops);
        if (success) {
          // 动画已在内核中触发
        }
      }
    }
  }

  // 重置
  this.cancelArmyMove();
};

GameLogic.prototype.cancelArmyMove = function() {
  isMovingArmy = false;
  moveFromProvince = null;
  moveFromPos = null;
  document.getElementById('map-canvas').style.cursor = 'grab';
  document.getElementById('army-move-panel').classList.remove('active');
};

GameLogic.prototype.showArmyMovePanel = function(fromId) {
  const panel = document.getElementById('army-move-panel');
  const fromArmy = this.state.armyPositions[fromId];
  const prov = GAME_DATA.provinces[fromId];

  document.getElementById('army-move-info').innerHTML = `
    <div class="army-info-row"><span>出发地</span><span>${prov.name}</span></div>
    <div class="army-info-row"><span>可用部队</span><span>${Math.floor(fromArmy.troops)}</span></div>
    <div class="army-info-row"><span>状态</span><span style="color:#e94560;">点击目标省份进行调动/攻击</span></div>
  `;

  document.getElementById('army-move-actions').innerHTML = `
    <button class="move-btn" onclick="gameInstance.cancelArmyMove()">取消调动</button>
    <div style="font-size:11px; color:#aaa; margin-top:8px; text-align:center;">
      🖱️ 点击地图上的目标省份<br>
      绿色省份 = 调兵 | 红色省份 = 攻击
    </div>
  `;

  panel.classList.add('active');
};

GameLogic.prototype.showAttackPanel = function(provinceId) {
  const prov = GAME_DATA.provinces[provinceId];
  const owner = this.state.provinceOwners[provinceId];
  const ownerName = GAME_DATA.nations[owner]?.name || '未知';

  // 找到最近的己方省份
  let nearestOwn = null;
  let nearestDist = Infinity;
  for (const [pid, nid] of Object.entries(this.state.provinceOwners)) {
    if (nid !== this.state.playerNation) continue;
    const p1 = GAME_DATA.provinces[pid];
    const p2 = GAME_DATA.provinces[provinceId];
    const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
    if (d < nearestDist) {
      nearestDist = d;
      nearestOwn = pid;
    }
  }

  if (nearestOwn && this.state.armyPositions[nearestOwn]) {
    const troops = Math.floor(this.state.armyPositions[nearestOwn].troops * 0.7);
    this.attackProvince(nearestOwn, provinceId, troops);
  }
};

// ---- 省份悬浮 ----
GameLogic.prototype.onProvinceHovered = function(provinceId, mx, my) {
  if (!ui) return;

  if (provinceId) {
    ui.showProvinceTooltip(provinceId, mx, my);

    // 如果正在调兵，高亮显示
    if (isMovingArmy) {
      const owner = this.state.provinceOwners[provinceId];
      document.getElementById('map-canvas').style.cursor =
        (owner === this.state.playerNation) ? 'pointer' : 'crosshair';
    }
  } else {
    ui.hideProvinceTooltip();
  }
};

// ---- 全局控制函数 ----
function togglePause() {
  if (!gameInstance) return;
  gameInstance.state.isPaused = !gameInstance.state.isPaused;
  document.getElementById('pause-btn').textContent =
    gameInstance.state.isPaused ? '▶️ 继续' : '⏸️ 暂停';
}

function toggleSpeed() {
  if (!gameInstance) return;
  const speeds = [1, 2, 5];
  const currentIdx = speeds.indexOf(gameInstance.state.speed);
  gameInstance.state.speed = speeds[(currentIdx + 1) % speeds.length];
  document.getElementById('speed-btn').textContent =
    `⏩ ${gameInstance.state.speed}x`;
}

function restartGame() {
  document.getElementById('game-over').classList.add('hidden');
  document.getElementById('nation-select').classList.add('active');
  document.getElementById('nation-name').textContent = '选择你的国家';

  // 重置
  gameInstance = new GameLogic();
  window.gameInstance = gameInstance;
  ui.renderNationSelect();

  // 关闭所有面板
  document.querySelectorAll('.panel.active').forEach(p => p.classList.remove('active'));
}

// ---- 键盘快捷键 ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (isMovingArmy && gameInstance) {
      gameInstance.cancelArmyMove();
    } else {
      // 关闭所有面板
      document.querySelectorAll('.panel.active').forEach(p => p.classList.remove('active'));
    }
  }
  if (e.key === ' ') {
    e.preventDefault();
    togglePause();
  }
  if (e.key === '1') toggleSpeed();
});

