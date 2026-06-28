// ==========================================
// 地图渲染器 - 仿 Dummy Nation 可视化风格
// ==========================================

class MapRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight - 100;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // 相机控制
    this.camera = { x: 0, y: 0, zoom: 1.0, targetZoom: 1.0 };
    this.isDragging = false;
    this.lastMouse = { x: 0, y: 0 };

    // 省份渲染数据（像素坐标）
    this.provincePixels = {};
    // 扩张动画
    this.expansionAnimations = [];
    // 军队移动动画
    this.armyAnimations = [];
    // 战斗动画
    this.battleAnimations = [];

    // 省份轮廓（简化多边形）
    this.provinceOutlines = {};

    this.initProvinceOutlines();
    this.setupEvents();
    this.calculateProvincePixels();
  }

  initProvinceOutlines() {
    // 为每个省份创建简化的多边形轮廓
    // 使用六边形近似每个省份的位置
    const gameProvinces = GAME_DATA.provinces;

    for (const [id, prov] of Object.entries(gameProvinces)) {
      this.provinceOutlines[id] = this.createHexOutline(prov.x, prov.y, 2.5);
    }
  }

  createHexOutline(cx, cy, size) {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      points.push({
        x: cx + size * Math.cos(angle),
        y: cy + size * Math.sin(angle)
      });
    }
    return points;
  }

  calculateProvincePixels() {
    for (const [id, outline] of Object.entries(this.provinceOutlines)) {
      const pixels = outline.map(p => this.worldToScreen(p.x, p.y));
      this.provincePixels[id] = pixels;
    }
  }

  worldToScreen(wx, wy) {
    // 将经纬度映射到屏幕坐标
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const scale = Math.min(this.width, this.height) / 180 * this.camera.zoom;

    const sx = (wx + 180) * (this.width / 360) * this.camera.zoom - this.camera.x;
    const sy = (90 - wy) * (this.height / 180) * this.camera.zoom - this.camera.y;

    return { x: sx, y: sy };
  }

  screenToWorld(sx, sy) {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const scale = Math.min(this.width, this.height) / 180 * this.camera.zoom;

    const wx = (sx + this.camera.x) / (this.width / 360) / this.camera.zoom - 180;
    const wy = 90 - (sy + this.camera.y) / (this.height / 180) / this.camera.zoom;

    return { x: wx, y: wy };
  }

  setupEvents() {
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    this.canvas.addEventListener('wheel', (e) => this.onWheel(e));
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // 触摸事件
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.onMouseDown({ clientX: touch.clientX, clientY: touch.clientY, button: 0 });
    });
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    });
    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.onMouseUp({});
    });

    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight - 100;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.calculateProvincePixels();
  }

  onMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (e.button === 0) {
      // 左键 - 选择省份
      const province = this.getProvinceAt(mx, my);
      if (province) {
        this.onProvinceClick(province, mx, my);
      }
    } else if (e.button === 2) {
      // 右键 - 开始拖动地图
      this.isDragging = true;
      this.lastMouse = { x: mx, y: my };
    }
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (this.isDragging) {
      const dx = mx - this.lastMouse.x;
      const dy = my - this.lastMouse.y;
      this.camera.x -= dx;
      this.camera.y -= dy;
      this.lastMouse = { x: mx, y: my };
      this.calculateProvincePixels();
    } else {
      // 悬浮提示
      const province = this.getProvinceAt(mx, my);
      this.onProvinceHover(province, mx, my);
    }
  }

  onMouseUp(e) {
    this.isDragging = false;
  }

  onWheel(e) {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    this.camera.zoom = Math.max(0.3, Math.min(5, this.camera.zoom * zoomFactor));
    this.calculateProvincePixels();
  }

  getProvinceAt(sx, sy) {
    // 检查点击了哪个省份
    for (const [id, pixels] of Object.entries(this.provincePixels)) {
      if (this.isPointInPolygon(sx, sy, pixels)) {
        return id;
      }
    }
    return null;
  }

  isPointInPolygon(px, py, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      const intersect = ((yi > py) !== (yj > py)) &&
        (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  onProvinceClick(provinceId, mx, my) {
    if (window.gameInstance) {
      window.gameInstance.onProvinceClicked(provinceId, mx, my);
    }
  }

  onProvinceHover(provinceId, mx, my) {
    if (window.gameInstance) {
      window.gameInstance.onProvinceHovered(provinceId, mx, my);
    }
  }

  // ---- 渲染主循环 ----
  render(gameState) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 绘制背景
    this.drawBackground(ctx);

    // 绘制省份
    this.drawProvinces(ctx, gameState);

    // 绘制扩张动画
    this.drawExpansionAnimations(ctx, gameState);

    // 绘制军队
    this.drawArmies(ctx, gameState);

    // 绘制军队移动动画
    this.drawArmyMovements(ctx, gameState);

    // 绘制战斗效果
    this.drawBattleEffects(ctx, gameState);

    // 绘制边界
    this.drawBorders(ctx, gameState);

    // 绘制省份名称
    this.drawProvinceNames(ctx, gameState);

    // 绘制小地图
    this.drawMinimap(ctx, gameState);
  }

  drawBackground(ctx) {
    // 深色海洋背景
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, this.width, this.height);

    // 网格线（模拟经纬线）
    ctx.strokeStyle = 'rgba(30, 60, 100, 0.3)';
    ctx.lineWidth = 0.5;

    const gridSpacing = 30 * this.camera.zoom;
    const offsetX = this.camera.x % gridSpacing;
    const offsetY = this.camera.y % gridSpacing;

    for (let x = offsetX; x < this.width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = offsetY; y < this.height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }
  }

  drawProvinces(ctx, gameState) {
    const time = Date.now() / 1000;

    for (const [id, prov] of Object.entries(GAME_DATA.provinces)) {
      const pixels = this.provincePixels[id];
      if (!pixels) continue;

      const owner = gameState.provinceOwners[id];
      const nationData = owner ? GAME_DATA.nations[owner] : null;
      const baseColor = nationData ? nationData.color : '#1a2a3a';

      // 基础颜色
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.moveTo(pixels[0].x, pixels[0].y);
      for (let i = 1; i < pixels.length; i++) {
        ctx.lineTo(pixels[i].x, pixels[i].y);
      }
      ctx.closePath();
      ctx.fill();

      // 光泽效果
      const gradient = ctx.createLinearGradient(
        pixels[0].x, pixels[0].y,
        pixels[2].x, pixels[2].y
      );
      gradient.addColorStop(0, 'rgba(255,255,255,0.05)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.2)');
      ctx.fillStyle = gradient;
      ctx.fill();

      // 选中效果
      if (gameState.selectedProvince === id) {
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // 所属国闪烁（正在被攻击的省份）
      if (gameState.attackedProvince === id) {
        const flash = 0.3 + 0.3 * Math.sin(time * 8);
        ctx.fillStyle = `rgba(255, 0, 0, ${flash})`;
        ctx.fill();
      }
    }
  }

  drawBorders(ctx, gameState) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;

    for (const [id, pixels] of Object.entries(this.provincePixels)) {
      ctx.beginPath();
      ctx.moveTo(pixels[0].x, pixels[0].y);
      for (let i = 1; i < pixels.length; i++) {
        ctx.lineTo(pixels[i].x, pixels[i].y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  drawProvinceNames(ctx, gameState) {
    ctx.font = `${11 * this.camera.zoom}px 'Segoe UI', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const [id, prov] of Object.entries(GAME_DATA.provinces)) {
      const center = this.worldToScreen(prov.x, prov.y);
      // 只显示可见范围内的
      if (center.x < -50 || center.x > this.width + 50) continue;
      if (center.y < -50 || center.y > this.height + 50) continue;

      const owner = gameState.provinceOwners[id];
      ctx.fillStyle = owner ? '#ffffff' : '#667788';
      ctx.fillText(prov.name, center.x, center.y);
    }
  }

  drawArmies(ctx, gameState) {
    const time = Date.now() / 1000;

    for (const [provId, army] of Object.entries(gameState.armyPositions)) {
      const prov = GAME_DATA.provinces[provId];
      if (!prov) continue;

      const center = this.worldToScreen(prov.x, prov.y);

      // 军队图标 - 脉冲效果
      const pulse = 1 + 0.15 * Math.sin(time * 4);

      // 底色圆
      ctx.fillStyle = army.nation === gameState.playerNation ? '#e94560' : '#ff6600';
      ctx.beginPath();
      ctx.arc(center.x, center.y, 8 * pulse * this.camera.zoom, 0, Math.PI * 2);
      ctx.fill();

      // 军队数量文字
      if (this.camera.zoom > 0.6) {
        ctx.fillStyle = '#fff';
        ctx.font = `${10 * this.camera.zoom}px 'Segoe UI', sans-serif`;
        ctx.fillText(this.formatNumber(army.troops), center.x, center.y - 15 * this.camera.zoom);
      }

      // 军徽标志
      ctx.fillStyle = '#fff';
      ctx.font = `${14 * this.camera.zoom}px 'Segoe UI', sans-serif`;
      ctx.fillText('⚔️', center.x - 7 * this.camera.zoom, center.y + 4 * this.camera.zoom);
    }
  }

  drawArmyMovements(ctx, gameState) {
    const time = Date.now() / 1000;

    for (const anim of this.armyAnimations) {
      if (anim.progress >= 1) continue;

      const fromProv = GAME_DATA.provinces[anim.from];
      const toProv = GAME_DATA.provinces[anim.to];
      if (!fromProv || !toProv) continue;

      const from = this.worldToScreen(fromProv.x, fromProv.y);
      const to = this.worldToScreen(toProv.x, toProv.y);

      // 进度
      const t = anim.progress;
      const x = from.x + (to.x - from.x) * t;
      const y = from.y + (to.y - from.y) * t;

      // 移动轨迹线
      ctx.strokeStyle = `rgba(233, 69, 96, ${0.5 * (1 - t)})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // 移动的军队图标
      const size = 10 * this.camera.zoom;
      ctx.fillStyle = anim.nation === gameState.playerNation ? '#e94560' : '#ff6600';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      // 发光效果
      const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
      glow.addColorStop(0, `rgba(233, 69, 96, 0.3)`);
      glow.addColorStop(1, 'rgba(233, 69, 96, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, size * 2, 0, Math.PI * 2);
      ctx.fill();

      // 军队数量
      ctx.fillStyle = '#fff';
      ctx.font = `${10 * this.camera.zoom}px 'Segoe UI', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(this.formatNumber(anim.troops), x, y - 15 * this.camera.zoom);

      // 进度更新
      anim.progress += 0.008;
    }

    // 清除完成的动画
    this.armyAnimations = this.armyAnimations.filter(a => a.progress < 1);
  }

  drawExpansionAnimations(ctx, gameState) {
    const time = Date.now() / 1000;

    for (const anim of this.expansionAnimations) {
      if (anim.progress >= 1) continue;

      const prov = GAME_DATA.provinces[anim.provinceId];
      if (!prov) continue;

      const center = this.worldToScreen(prov.x, prov.y);
      const nationData = GAME_DATA.nations[anim.nation];

      // 扩张波纹效果
      const radius = (20 + 30 * anim.progress) * this.camera.zoom;
      const alpha = 0.6 * (1 - anim.progress);

      // 外圈波纹
      ctx.strokeStyle = `rgba(${anim.r}, ${anim.g}, ${anim.b}, ${alpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
      ctx.stroke();

      // 填充
      ctx.fillStyle = `rgba(${anim.r}, ${anim.g}, ${anim.b}, ${alpha * 0.3})`;
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius * 0.8, 0, Math.PI * 2);
      ctx.fill();

      // 星形爆炸效果
      if (anim.progress > 0.3) {
        const starAlpha = 0.8 * (1 - anim.progress);
        ctx.fillStyle = `rgba(255, 255, 200, ${starAlpha})`;
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 / 8) * i + time * 2;
          const sx = center.x + Math.cos(angle) * radius * 0.7;
          const sy = center.y + Math.sin(angle) * radius * 0.7;
          ctx.beginPath();
          ctx.arc(sx, sy, 3 * this.camera.zoom, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      anim.progress += 0.015;
    }

    this.expansionAnimations = this.expansionAnimations.filter(a => a.progress < 1);
  }

  drawBattleEffects(ctx, gameState) {
    for (const effect of this.battleAnimations) {
      if (effect.progress >= 1) continue;

      const prov = GAME_DATA.provinces[effect.provinceId];
      if (!prov) continue;

      const center = this.worldToScreen(prov.x, prov.y);

      // 爆炸效果
      const radius = 15 + 25 * effect.progress;
      const alpha = 0.8 * (1 - effect.progress);

      // 火光
      const gradient = ctx.createRadialGradient(
        center.x, center.y, 0,
        center.x, center.y, radius * this.camera.zoom
      );
      gradient.addColorStop(0, `rgba(255, 200, 50, ${alpha})`);
      gradient.addColorStop(0.5, `rgba(255, 100, 0, ${alpha * 0.6})`);
      gradient.addColorStop(1, `rgba(100, 0, 0, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius * this.camera.zoom, 0, Math.PI * 2);
      ctx.fill();

      // 碎片
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 / 6) * i;
        const dist = radius * 0.5 * effect.progress;
        const fx = center.x + Math.cos(angle) * dist * this.camera.zoom;
        const fy = center.y + Math.sin(angle) * dist * this.camera.zoom;
        ctx.fillStyle = `rgba(200, 200, 200, ${alpha})`;
        ctx.beginPath();
        ctx.arc(fx, fy, 2 * this.camera.zoom, 0, Math.PI * 2);
        ctx.fill();
      }

      effect.progress += 0.02;
    }

    this.battleAnimations = this.battleAnimations.filter(e => e.progress < 1);
  }

  drawMinimap(ctx, gameState) {
    // 右下角小地图
    const mw = 160;
    const mh = 100;
    const mx = this.width - mw - 15;
    const my = this.height - mh - 65;

    ctx.fillStyle = 'rgba(10, 20, 40, 0.9)';
    ctx.strokeStyle = 'rgba(233, 69, 96, 0.5)';
    ctx.lineWidth = 1;
    ctx.fillRect(mx, my, mw, mh);
    ctx.strokeRect(mx, my, mw, mh);

    // 绘制省份在小地图上
    const scaleX = mw / 360;
    const scaleY = mh / 180;

    for (const [id, prov] of Object.entries(GAME_DATA.provinces)) {
      const owner = gameState.provinceOwners[id];
      const nationData = owner ? GAME_DATA.nations[owner] : null;
      ctx.fillStyle = nationData ? nationData.color : '#1a2a3a';

      const px = mx + (prov.x + 180) * scaleX;
      const py = my + (90 - prov.y) * scaleY;

      ctx.fillRect(px - 2, py - 2, 4, 4);
    }

    // 玩家省份高亮
    if (gameState.playerNation) {
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 1;
      for (const [id, prov] of Object.entries(GAME_DATA.provinces)) {
        if (gameState.provinceOwners[id] === gameState.playerNation) {
          const px = mx + (prov.x + 180) * scaleX;
          const py = my + (90 - prov.y) * scaleY;
          ctx.strokeRect(px - 3, py - 3, 6, 6);
        }
      }
    }
  }

  // ---- 动画触发 ----
  addExpansionAnimation(provinceId, nation) {
    const nationData = GAME_DATA.nations[nation];
    const color = nationData ? nationData.color : '#e94560';
    const rgb = this.hexToRgb(color);

    this.expansionAnimations.push({
      provinceId,
      nation,
      r: rgb.r, g: rgb.g, b: rgb.b,
      progress: 0,
      startTime: Date.now()
    });
  }

  addArmyMovement(fromId, toId, troops, nation) {
    this.armyAnimations.push({
      from: fromId,
      to: toId,
      troops,
      nation,
      progress: 0
    });
  }

  addBattleEffect(provinceId) {
    this.battleAnimations.push({
      provinceId,
      progress: 0
    });
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 233, g: 69, b: 96 };
  }

  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  // 聚焦到某个省份
  focusOnProvince(provinceId) {
    const prov = GAME_DATA.provinces[provinceId];
    if (!prov) return;

    const target = this.worldToScreen(prov.x, prov.y);
    this.camera.x = target.x - this.width / 2;
    this.camera.y = target.y - this.height / 2;
    this.calculateProvincePixels();
  }
}

