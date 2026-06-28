// ==========================================
// 游戏数据：国家、省份、历史事件、科技树
// ==========================================

const GAME_DATA = {
  // ---- 可玩国家 ----
  nations: {
    germany: {
      name: "德意志国", flag: "🇩🇪", color: "#000000",
      startYear: 1936, startMoney: 800, startIndustry: 15, startMilitary: 1500,
      startPop: 6900, startHappiness: 65, startFood: 60,
      ideology: "fascism", leader: "阿道夫·希特勒",
      bonuses: { militaryProd: 1.3, industry: 1.2 },
      historicalEvents: ["rhineland", "anschluss", "munich", "poland_invasion"],
      provinces: ["rheinland", "westphalia", "saxony", "bavaria", "prussia", "pomerania", "silesia", "schleswig", "hanover", "hesse"]
    },
    soviet: {
      name: "苏维埃联盟", flag: "🇷🇺", color: "#CC0000",
      startYear: 1936, startMoney: 600, startIndustry: 12, startMilitary: 2000,
      startPop: 17000, startHappiness: 55, startFood: 80,
      ideology: "communism", leader: "约瑟夫·斯大林",
      bonuses: { manpower: 1.5, industry: 1.1 },
      historicalEvents: ["stalin_constitution", "great_purge", "winter_war", "operation_barbarossa"],
      provinces: ["moscow", "leningrad", "ukraine", "belarus", "caucasus", "siberia", "ural", "volga", "kazakh", "far_east"]
    },
    usa: {
      name: "美利坚合众国", flag: "🇺🇸", color: "#3C3B6E",
      startYear: 1936, startMoney: 1500, startIndustry: 25, startMilitary: 1200,
      startPop: 12800, startHappiness: 75, startFood: 100,
      ideology: "democracy", leader: "富兰克林·罗斯福",
      bonuses: { industry: 1.4, money: 1.2 },
      historicalEvents: ["new_deal", "pearl_harbor", "dday", "manhattan"],
      provinces: ["new_england", "mid_atlantic", "south_atlantic", "midwest", "great_plains", "southwest", "mountain", "pacific", "alaska", "hawaii"]
    },
    uk: {
      name: "大不列颠", flag: "🇬🇧", color: "#C8102E",
      startYear: 1936, startMoney: 1000, startIndustry: 18, startMilitary: 1000,
      startPop: 4700, startHappiness: 70, startFood: 55,
      ideology: "democracy", leader: "乔治六世",
      bonuses: { navy: 1.5, money: 1.1 },
      historicalEvents: ["battle_britain", "north_africa", "dunkirk", "victory_day"],
      provinces: ["england", "scotland", "wales", "northern_ireland", "canada", "australia", "new_zealand", "south_africa", "india", "hong_kong"]
    },
    france: {
      name: "法兰西共和国", flag: "🇫🇷", color: "#002395",
      startYear: 1936, startMoney: 900, startIndustry: 16, startMilitary: 1100,
      startPop: 4200, startHappiness: 60, startFood: 60,
      ideology: "democracy", leader: "爱德华·达拉第",
      bonuses: { army: 1.2, fortification: 1.3 },
      historicalEvents: ["magrinot_line", "fall_france", "vichy", "dday"],
      provinces: ["ile_de_france", "normandy", "brittany", "aquitaine", "midi", "burgundy", "alsace", "champagne", "loire", "provence"]
    },
    japan: {
      name: "大日本帝国", flag: "🇯🇵", color: "#BC002D",
      startYear: 1936, startMoney: 700, startIndustry: 14, startMilitary: 1300,
      startPop: 7200, startHappiness: 60, startFood: 45,
      ideology: "fascism", leader: "昭和天皇",
      bonuses: { navy: 1.4, army: 1.2 },
      historicalEvents: ["mukden", "marco_polo", "pearl_harbor", "hiroshima"],
      provinces: ["honshu", "kyushu", "shikoku", "hokkaido", "korea", "taiwan", "manchuria", "sakhalin", "ryukyu", "bonin"]
    },
    italy: {
      name: "意大利王国", flag: "🇮🇹", color: "#009246",
      startYear: 1936, startMoney: 600, startIndustry: 10, startMilitary: 900,
      startPop: 4300, startHappiness: 55, startFood: 55,
      ideology: "fascism", leader: "贝尼托·墨索里尼",
      bonuses: { army: 1.15, navy: 1.15 },
      historicalEvents: ["ethiopia", "spain_civil", "greece_invasion", "armistice"],
      provinces: ["lombardy", "veneto", "tuscany", "latium", "naples", "sicily", "sardinia", "piedmont", "apulia", "liguria"]
    },
    china: {
      name: "中华民国", flag: "🇨🇳", color: "#FF0000",
      startYear: 1936, startMoney: 400, startIndustry: 6, startMilitary: 1800,
      startPop: 45000, startHappiness: 45, startFood: 90,
      ideology: "democracy", leader: "蒋介石",
      bonuses: { manpower: 1.6, food: 1.3 },
      historicalEvents: ["northern_expedition", "marco_polo", "second_united_front", "civil_war"],
      provinces: ["jiangsu", "zhejiang", "guangdong", "guangxi", "hunan", "hubei", "sichuan", "yunnan", "shaanxi", "shanxi"]
    }
  },

  // ---- 省份数据 ----
  provinces: {
    // 德国省份
    rheinland: { name: "莱茵兰", pop: 800, industry: 3, military: 2, food: 1, x: 48.5, y: 51.0 },
    westphalia: { name: "威斯特法伦", pop: 700, industry: 3, military: 1, food: 1, x: 51.5, y: 51.5 },
    saxony: { name: "萨克森", pop: 500, industry: 2, military: 2, food: 1, x: 50.5, y: 51.0 },
    bavaria: { name: "巴伐利亚", pop: 700, industry: 2, military: 1, food: 2, x: 47.0, y: 51.5 },
    prussia: { name: "普鲁士", pop: 600, industry: 2, military: 3, food: 1, x: 52.5, y: 49.5 },
    pomerania: { name: "波美拉尼亚", pop: 300, industry: 1, military: 1, food: 1, x: 53.5, y: 47.0 },
    silesia: { name: "西里西亚", pop: 400, industry: 2, military: 1, food: 1, x: 51.0, y: 49.0 },
    schleswig: { name: "石勒苏益格", pop: 300, industry: 1, military: 1, food: 1, x: 54.5, y: 49.5 },
    hanover: { name: "汉诺威", pop: 500, industry: 2, military: 1, food: 2, x: 52.0, y: 49.5 },
    hesse: { name: "黑森", pop: 400, industry: 2, military: 1, food: 1, x: 50.0, y: 50.0 },

    // 苏联省份
    moscow: { name: "莫斯科", pop: 4000, industry: 4, military: 3, food: 1, x: 55.8, y: 37.6 },
    leningrad: { name: "列宁格勒", pop: 3000, industry: 3, military: 2, food: 1, x: 59.9, y: 30.3 },
    ukraine: { name: "乌克兰", pop: 3500, industry: 2, military: 1, food: 4, x: 49.0, y: 31.0 },
    belarus: { name: "白俄罗斯", pop: 1000, industry: 1, military: 1, food: 2, x: 53.0, y: 28.0 },
    caucasus: { name: "高加索", pop: 1500, industry: 2, military: 1, food: 1, x: 42.0, y: 45.0 },
    siberia: { name: "西伯利亚", pop: 1000, industry: 2, military: 1, food: 2, x: 60.0, y: 55.0 },
    ural: { name: "乌拉尔", pop: 1200, industry: 3, military: 1, food: 1, x: 56.0, y: 50.0 },
    volga: { name: "伏尔加", pop: 1500, industry: 2, military: 1, food: 2, x: 48.0, y: 44.0 },
    kazakh: { name: "哈萨克", pop: 800, industry: 1, military: 1, food: 1, x: 48.0, y: 67.0 },
    far_east: { name: "远东", pop: 600, industry: 1, military: 2, food: 1, x: 62.0, y: 70.0 },

    // 美国省份
    new_england: { name: "新英格兰", pop: 1500, industry: 4, military: 1, food: 1, x: 42.5, y: -71.5 },
    mid_atlantic: { name: "中大西洋", pop: 2000, industry: 5, military: 1, food: 1, x: 40.0, y: -75.0 },
    south_atlantic: { name: "南大西洋", pop: 1800, industry: 3, military: 1, food: 2, x: 33.0, y: -80.0 },
    midwest: { name: "中西部", pop: 2000, industry: 4, military: 1, food: 3, x: 40.0, y: -88.0 },
    great_plains: { name: "大平原", pop: 800, industry: 2, military: 1, food: 4, x: 44.0, y: -100.0 },
    southwest: { name: "西南部", pop: 1200, industry: 3, military: 1, food: 1, x: 32.0, y: -105.0 },
    mountain: { name: "山区", pop: 500, industry: 2, military: 1, food: 1, x: 39.0, y: -110.0 },
    pacific: { name: "太平洋沿岸", pop: 1500, industry: 4, military: 1, food: 1, x: 37.0, y: -120.0 },
    alaska: { name: "阿拉斯加", pop: 100, industry: 1, military: 2, food: 1, x: 64.0, y: -150.0 },
    hawaii: { name: "夏威夷", pop: 200, industry: 1, military: 2, food: 1, x: 21.3, y: -157.8 },

    // 英国省份
    england: { name: "英格兰", pop: 2500, industry: 5, military: 2, food: 1, x: 52.0, y: -1.0 },
    scotland: { name: "苏格兰", pop: 500, industry: 2, military: 1, food: 1, x: 56.0, y: -4.0 },
    wales: { name: "威尔士", pop: 300, industry: 1, military: 1, food: 1, x: 52.5, y: -3.5 },
    northern_ireland: { name: "北爱尔兰", pop: 200, industry: 1, military: 1, food: 1, x: 54.5, y: -6.0 },
    canada: { name: "加拿大", pop: 1100, industry: 3, military: 1, food: 2, x: 52.0, y: -95.0 },
    australia: { name: "澳大利亚", pop: 700, industry: 2, military: 1, food: 2, x: -25.0, y: 133.0 },
    new_zealand: { name: "新西兰", pop: 200, industry: 1, military: 1, food: 2, x: -40.0, y: 174.0 },
    south_africa: { name: "南非", pop: 400, industry: 1, military: 1, food: 1, x: -30.0, y: 25.0 },
    india: { name: "印度", pop: 3500, industry: 2, military: 2, food: 3, x: 22.0, y: 77.0 },
    hong_kong: { name: "香港", pop: 200, industry: 1, military: 1, food: 1, x: 22.3, y: 114.2 },

    // 法国省份
    ile_de_france: { name: "法兰西岛", pop: 800, industry: 4, military: 2, food: 1, x: 48.9, y: 2.3 },
    normandy: { name: "诺曼底", pop: 500, industry: 2, military: 1, food: 2, x: 49.0, y: -0.5 },
    brittany: { name: "布列塔尼", pop: 400, industry: 1, military: 1, food: 1, x: 48.2, y: -3.0 },
    aquitaine: { name: "阿基坦", pop: 500, industry: 2, military: 1, food: 2, x: 44.5, y: -0.5 },
    midi: { name: "朗格多克", pop: 400, industry: 1, military: 1, food: 2, x: 43.5, y: 3.0 },
    burgundy: { name: "勃艮第", pop: 300, industry: 2, military: 1, food: 1, x: 47.0, y: 4.5 },
    alsace: { name: "阿尔萨斯", pop: 300, industry: 2, military: 1, food: 1, x: 48.5, y: 7.5 },
    champagne: { name: "香槟", pop: 300, industry: 1, military: 1, food: 2, x: 49.0, y: 4.0 },
    loire: { name: "卢瓦尔", pop: 500, industry: 2, military: 1, food: 2, x: 47.5, y: 1.0 },
    provence: { name: "普罗旺斯", pop: 400, industry: 1, military: 1, food: 1, x: 43.5, y: 6.0 },

    // 日本省份
    honshu: { name: "本州", pop: 4500, industry: 5, military: 3, food: 2, x: 36.5, y: 138.0 },
    kyushu: { name: "九州", pop: 1300, industry: 2, military: 1, food: 1, x: 33.0, y: 131.0 },
    shikoku: { name: "四国", pop: 500, industry: 1, military: 1, food: 1, x: 33.5, y: 133.5 },
    hokkaido: { name: "北海道", pop: 400, industry: 1, military: 1, food: 2, x: 43.0, y: 142.0 },
    korea: { name: "朝鲜", pop: 2400, industry: 2, military: 2, food: 2, x: 37.5, y: 127.0 },
    taiwan: { name: "台湾", pop: 600, industry: 1, military: 1, food: 2, x: 23.7, y: 120.8 },
    manchuria: { name: "满洲", pop: 3400, industry: 3, military: 3, food: 3, x: 42.0, y: 125.0 },
    sakhalin: { name: "库页岛", pop: 100, industry: 1, military: 1, food: 1, x: 50.0, y: 143.0 },
    ryukyu: { name: "琉球", pop: 200, industry: 1, military: 1, food: 1, x: 26.5, y: 128.0 },
    bonin: { name: "小笠原", pop: 50, industry: 0, military: 1, food: 0, x: 27.0, y: 142.0 },

    // 意大利省份
    lombardy: { name: "伦巴第", pop: 800, industry: 3, military: 1, food: 1, x: 45.5, y: 9.2 },
    veneto: { name: "威尼托", pop: 500, industry: 2, military: 1, food: 1, x: 45.5, y: 11.5 },
    tuscany: { name: "托斯卡纳", pop: 400, industry: 2, military: 1, food: 1, x: 43.5, y: 11.0 },
    latium: { name: "拉丁姆", pop: 600, industry: 2, military: 2, food: 1, x: 41.9, y: 12.5 },
    naples: { name: "那不勒斯", pop: 700, industry: 2, military: 1, food: 2, x: 40.8, y: 14.2 },
    sicily: { name: "西西里", pop: 500, industry: 1, military: 1, food: 2, x: 37.5, y: 14.0 },
    sardinia: { name: "撒丁岛", pop: 200, industry: 1, military: 1, food: 1, x: 40.0, y: 9.0 },
    piedmont: { name: "皮埃蒙特", pop: 500, industry: 2, military: 1, food: 1, x: 45.0, y: 7.5 },
    apulia: { name: "阿普利亚", pop: 400, industry: 1, military: 1, food: 2, x: 41.0, y: 16.5 },
    liguria: { name: "利古里亚", pop: 300, industry: 1, military: 1, food: 1, x: 44.3, y: 8.5 },

    // 中国省份
    jiangsu: { name: "江苏", pop: 4000, industry: 2, military: 2, food: 3, x: 32.1, y: 118.8 },
    zhejiang: { name: "浙江", pop: 2200, industry: 2, military: 1, food: 2, x: 29.3, y: 120.2 },
    guangdong: { name: "广东", pop: 3200, industry: 2, military: 1, food: 2, x: 23.1, y: 113.3 },
    guangxi: { name: "广西", pop: 1800, industry: 1, military: 1, food: 2, x: 23.8, y: 108.3 },
    hunan: { name: "湖南", pop: 3000, industry: 1, military: 2, food: 3, x: 27.6, y: 111.5 },
    hubei: { name: "湖北", pop: 2800, industry: 2, military: 2, food: 2, x: 30.6, y: 114.3 },
    sichuan: { name: "四川", pop: 5000, industry: 1, military: 2, food: 3, x: 30.6, y: 102.7 },
    yunnan: { name: "云南", pop: 1500, industry: 1, military: 1, food: 2, x: 25.0, y: 102.7 },
    shaanxi: { name: "陕西", pop: 1300, industry: 1, military: 2, food: 1, x: 34.3, y: 108.9 },
    shanxi: { name: "山西", pop: 1200, industry: 2, military: 2, food: 1, x: 37.8, y: 112.5 }
  },

  // ---- 主义路线 ----
  ideologies: {
    democracy: {
      name: "民主主义", icon: "🗽",
      description: "保障民权与自由选举，提高幸福度但降低军事效率",
      effects: { happiness: 15, militaryProd: -10, money: 5, research: 10 },
      unlocks: ["new_deal", "social_security", "free_press", "civil_rights"]
    },
    fascism: {
      name: "法西斯主义", icon: "⚔️",
      description: "极权统治，大幅提高军事生产力但降低幸福度",
      effects: { happiness: -15, militaryProd: 25, industry: 10, money: -5 },
      unlocks: ["total_mobilization", "propaganda_machine", "secret_police", "autarky"]
    },
    communism: {
      name: "共产主义", icon: "☭",
      description: "计划经济，大幅提高工业与人口效率但降低个人自由",
      effects: { happiness: -10, industry: 20, manpower: 30, money: -10 },
      unlocks: ["five_year_plan", "collectivization", "red_army", "gulag"]
    },
    authoritarianism: {
      name: "威权主义", icon: "🏛️",
      description: "军事独裁，平衡军事与工业",
      effects: { happiness: -5, militaryProd: 15, industry: 10, money: 0 },
      unlocks: ["martial_law", "censorship", "state_corporatism", "strongman"]
    },
    liberalism: {
      name: "自由主义", icon: "🕊️",
      description: "自由市场与开放社会，经济高效但防御薄弱",
      effects: { happiness: 20, money: 15, industry: 5, militaryProd: -15 },
      unlocks: ["free_trade", "open_borders", "individualism", "market_reform"]
    }
  },

  // ---- 经济发展选项 ----
  economyOptions: [
    { id: "light_industry", name: "轻工业发展", cost: 100, effect: { industry: 2 }, desc: "发展纺织、食品等轻工业", icon: "🏭" },
    { id: "heavy_industry", name: "重工业建设", cost: 250, effect: { industry: 5, militaryProd: 5 }, desc: "发展钢铁、机械等重工业", icon: "⚙️" },
    { id: "infrastructure", name: "基础设施", cost: 150, effect: { industry: 1, money: 5 }, desc: "修建道路、桥梁、电网", icon: "🛤️" },
    { id: "trade_policy", name: "贸易政策", cost: 80, effect: { money: 10 }, desc: "制定有利贸易政策", icon: "🚢" },
    { id: "resource_extraction", name: "资源开采", cost: 200, effect: { industry: 3, money: 3 }, desc: "开采矿产与能源", icon: "⛏️" },
    { id: "tech_investment", name: "科技投资", cost: 300, effect: { research: 15 }, desc: "投资科学研究", icon: "🔬" },
    { id: "tourism", name: "旅游业", cost: 120, effect: { money: 8, happiness: 5 }, desc: "发展旅游产业", icon: "🏖️" },
    { id: "banking_sector", name: "金融业", cost: 200, effect: { money: 15 }, desc: "发展银行与金融服务", icon: "🏦" }
  ],

  // ---- 民治发展选项 ----
  civilianOptions: [
    { id: "education", name: "教育改革", cost: 100, effect: { happiness: 5, research: 5 }, desc: "普及教育，提高国民素质", icon: "📚" },
    { id: "healthcare", name: "医疗体系", cost: 150, effect: { happiness: 8, population: 200 }, desc: "建立全民医疗体系", icon: "🏥" },
    { id: "social_reform", name: "社会改革", cost: 200, effect: { happiness: 10 }, desc: "改善劳动条件与社会福利", icon: "🤝" },
    { id: "police_force", name: "警察力量", cost: 80, effect: { happiness: -2, military: 100 }, desc: "加强国内治安", icon: "👮" },
    { id: "propaganda", name: "宣传机器", cost: 60, effect: { happiness: 3, military: 50 }, desc: "控制舆论导向", icon: "📢" },
    { id: "spy_network", name: "情报网络", cost: 120, effect: { military: 80 }, desc: "建立情报收集系统", icon: "🕵️" },
    { id: "civil_service", name: "公务员体系", cost: 100, effect: { happiness: 3, money: 3 }, desc: "建立高效行政体系", icon: "📋" },
    { id: "corruption_fight", name: "反腐斗争", cost: 150, effect: { happiness: 5, money: 5 }, desc: "打击腐败现象", icon: "⚖️" }
  ],

  // ---- 农业发展选项 ----
  agricultureOptions: [
    { id: "irrigation", name: "灌溉系统", cost: 80, effect: { food: 10 }, desc: "建设灌溉设施提高产量", icon: "💧" },
    { id: "mechanization", name: "农业机械化", cost: 150, effect: { food: 15, industry: 1 }, desc: "引入农机设备", icon: "🚜" },
    { id: "crop_rotation", name: "轮作制度", cost: 60, effect: { food: 8 }, desc: "科学轮作提高土地利用率", icon: "🌱" },
    { id: "livestock", name: "畜牧业", cost: 100, effect: { food: 12 }, desc: "发展养殖产业", icon: "🐄" },
    { id: "fertilizer", name: "化肥工业", cost: 120, effect: { food: 10, industry: 1 }, desc: "发展化学肥料生产", icon: "🧪" },
    { id: "land_reform", name: "土地改革", cost: 200, effect: { food: 20, happiness: 5 }, desc: "重新分配土地资源", icon: "📜" },
    { id: "greenhouse", name: "温室农业", cost: 180, effect: { food: 8 }, desc: "建设温室延长种植季", icon: "🏠" },
    { id: "fishing", name: "渔业", cost: 70, effect: { food: 6 }, desc: "发展海洋捕捞", icon: "🎣" }
  ],

  // ---- 军事发展选项 ----
  militaryOptions: [
    { id: "infantry", name: "步兵师", cost: 100, effect: { military: 200 }, desc: "训练基础步兵部队", icon: "🔫" },
    { id: "artillery", name: "炮兵部队", cost: 200, effect: { military: 300, militaryProd: 2 }, desc: "组建火炮部队", icon: "💣" },
    { id: "armor", name: "装甲部队", cost: 350, effect: { military: 400, militaryProd: 5 }, desc: "生产坦克与装甲车", icon: "🚂" },
    { id: "air_force", name: "空军", cost: 300, effect: { military: 250, militaryProd: 3 }, desc: "建立空中力量", icon: "✈️" },
    { id: "navy", name: "海军", cost: 400, effect: { military: 350 }, desc: "建造战舰与潜艇", icon: "⚓" },
    { id: "military_academy", name: "军事学院", cost: 150, effect: { militaryProd: 8 }, desc: "培养军官人才", icon: "🎖️" },
    { id: "fortification", name: "防御工事", cost: 120, effect: { military: 100 }, desc: "修建要塞与防线", icon: "🏰" },
    { id: "mobilization", name: "动员体系", cost: 250, effect: { military: 500, manpower: 10 }, desc: "建立战争动员机制", icon: "📯" }
  ],

  // ---- 建设选项 ----
  constructionOptions: [
    { id: "factory", name: "兵工厂", cost: 200, effect: { industry: 3, militaryProd: 3 }, desc: "生产武器与装备", icon: "🏭" },
    { id: "power_plant", name: "发电厂", cost: 250, effect: { industry: 4 }, desc: "供应工业用电", icon: "⚡" },
    { id: "railway", name: "铁路网", cost: 180, effect: { industry: 2, militaryProd: 2 }, desc: "加快物资运输", icon: "🚂" },
    { id: "port", name: "港口", cost: 150, effect: { money: 5, military: 50 }, desc: "扩大海上贸易", icon: "⚓" },
    { id: "airport", name: "机场", cost: 200, effect: { military: 100, militaryProd: 2 }, desc: "建立空中运输枢纽", icon: "🛫" },
    { id: "bunker", name: "地下掩体", cost: 120, effect: { military: 80 }, desc: "防护重要设施", icon: "🏗️" },
    { id: "research_lab", name: "研究所", cost: 300, effect: { research: 20 }, desc: "开展前沿科学研究", icon: "🔬" },
    { id: "dam", name: "水坝", cost: 280, effect: { industry: 3, food: 5 }, desc: "水力发电与灌溉", icon: "🌊" }
  ],

  // ---- 金融选项 ----
  financeOptions: [
    { id: "tax_reform", name: "税制改革", cost: 0, effect: { money: 10 }, desc: "调整税率增加收入", icon: "💰" },
    { id: "gold_standard", name: "金本位", cost: 100, effect: { money: -5, happiness: 3 }, desc: "稳定货币价值", icon: "🥇" },
    { id: "war_bonds", name: "战争债券", cost: 0, effect: { money: 20, happiness: -5 }, desc: "向民众借款筹资", icon: "📄" },
    { id: "foreign_investment", name: "吸引外资", cost: 50, effect: { money: 15, industry: 1 }, desc: "开放外资进入", icon: "🌍" },
    { id: "central_bank", name: "中央银行", cost: 200, effect: { money: 8 }, desc: "控制货币发行", icon: "🏦" },
    { id: "stock_market", name: "股票市场", cost: 150, effect: { money: 12 }, desc: "建立资本市场", icon: "📈" },
    { id: "rationing", name: "配给制度", cost: 0, effect: { food: 10, happiness: -8 }, desc: "战时资源配给", icon: "🍞" },
    { id: "lend_lease", name: "租借法案", cost: 0, effect: { money: -10, military: 200 }, desc: "租借物资给盟友", icon: "🤝" }
  ],

  // ---- 资助选项 ----
  fundingOptions: [
    { id: "partisan_support", name: "支持游击队", cost: 100, desc: "资助敌国境内的抵抗组织", icon: "🔥" },
    { id: "coupe_fund", name: "资助政变", cost: 300, desc: "资助友好势力夺取政权", icon: "💰" },
    { id: "proxy_war", name: "代理人战争", cost: 250, desc: "支持他国代理人武装", icon: "⚔️" },
    { id: "humanitarian", name: "人道主义援助", cost: 80, desc: "向平民提供援助", icon: "🏥" },
    { id: "tech_transfer", name: "技术转让", cost: 200, desc: "向盟友转让军事技术", icon: "🔬" },
    { id: "media_funding", name: "媒体宣传", cost: 60, desc: "资助海外媒体宣传", icon: "📰" },
    { id: "sabotage", name: "破坏活动", cost: 150, desc: "资助敌国基础设施破坏", icon: "💣" },
    { id: "diplomatic_bribe", name: "外交贿赂", cost: 120, desc: "影响他国政策", icon: "🤝" }
  ],

  // ---- 核武器选项 ----
  nuclearOptions: [
    { id: "nuclear_research", name: "核物理研究", cost: 500, desc: "启动核物理理论研究", icon: "⚛️", requires: { research: 30 } },
    { id: "uranium_mining", name: "铀矿开采", cost: 300, desc: "开采浓缩铀原料", icon: "⛏️", requires: { industry: 10 } },
    { id: "reactor", name: "实验反应堆", cost: 800, desc: "建造核反应堆", icon: "☢️", requires: { research: 50, industry: 15 } },
    { id: "bomb_design", name: "原子弹设计", cost: 600, desc: "设计核武器装置", icon: "💣", requires: { research: 60 } },
    { id: "test_detonation", name: "核试验", cost: 400, desc: "进行首次核爆试验", icon: "🌅", requires: { research: 70 } },
    { id: "arsenal", name: "核武库", cost: 1000, desc: "建立战略核武库", icon: "☢️", requires: { research: 80, industry: 20 } },
    { id: "delivery_system", name: "投送系统", cost: 700, desc: "研发导弹投送系统", icon: "🚀", requires: { research: 75 } },
    { id: "thermonuclear", name: "氢弹", cost: 1500, desc: "研发热核武器", icon: "💥", requires: { research: 90, industry: 25 } }
  ],

  // ---- 科技研发 ----
  researchTree: [
    { id: "basic_science", name: "基础科学", cost: 100, effect: { research: 5 }, icon: "🔬", tier: 1 },
    { id: "applied_physics", name: "应用物理", cost: 200, effect: { research: 8 }, icon: "⚛️", tier: 2, requires: ["basic_science"] },
    { id: "chemistry", name: "化学工程", cost: 180, effect: { industry: 3 }, icon: "🧪", tier: 2, requires: ["basic_science"] },
    { id: "electronics", name: "电子技术", cost: 300, effect: { research: 10, militaryProd: 3 }, icon: "💡", tier: 3, requires: ["applied_physics"] },
    { id: "nuclear_physics", name: "核物理", cost: 500, effect: { research: 15 }, icon: "☢️", tier: 3, requires: ["applied_physics"] },
    { id: "jet_engine", name: "喷气引擎", cost: 400, effect: { military: 200, militaryProd: 5 }, icon: "✈️", tier: 3, requires: ["electronics"] },
    { id: "rocketry", name: "火箭技术", cost: 450, effect: { military: 150, research: 10 }, icon: "🚀", tier: 4, requires: ["nuclear_physics", "jet_engine"] },
    { id: "computer", name: "计算机", cost: 600, effect: { research: 20, money: 10 }, icon: "💻", tier: 4, requires: ["electronics"] },
    { id: "genetics", name: "遗传学", cost: 350, effect: { food: 10, population: 500 }, icon: "🧬", tier: 3, requires: ["chemistry"] },
    { id: "materials", name: "新材料", cost: 280, effect: { industry: 5, militaryProd: 3 }, icon: "🔩", tier: 3, requires: ["chemistry"] }
  ],

  // ---- 历史事件 ----
  historicalEvents: {
    rhineland: { year: 1936, title: "莱茵兰再军事化", desc: "德军进入莱茵兰非军事区，违反《凡尔赛条约》。", choices: [
      { text: "派兵进驻（提高威望，增加军力）", effect: { military: 200, happiness: 5 } },
      { text: "谨慎观望（避免冲突）", effect: { money: 50 } }
    ]},
    anschluss: { year: 1938, title: "德奥合并", desc: "德国吞并奥地利，扩大领土与人口。", choices: [
      { text: "推动合并（获得奥地利领土）", effect: { population: 700, industry: 2 } },
      { text: "尊重奥地利独立", effect: { happiness: 3 } }
    ]},
    munich: { year: 1938, title: "慕尼黑协定", desc: "英法同意德国吞并苏台德地区。", choices: [
      { text: "接受领土（获得捷克边境）", effect: { population: 300, military: 100 } },
      { text: "拒绝并备战", effect: { militaryProd: 10, money: -100 } }
    ]},
    poland_invasion: { year: 1939, title: "入侵波兰", desc: "德国入侵波兰，二战爆发。", choices: [
      { text: "全面入侵（占领波兰）", effect: { population: 3500, military: -500 } },
      { text: "寻求外交解决", effect: { money: 100, happiness: 5 } }
    ]},
    stalin_constitution: { year: 1936, title: "斯大林宪法", desc: "通过新宪法，确立社会主义制度。", choices: [
      { text: "推行集体化（提高工业）", effect: { industry: 5, happiness: -10 } },
      { text: "逐步改革", effect: { happiness: 5 } }
    ]},
    great_purge: { year: 1937, title: "大清洗", desc: "斯大林发动大规模政治清洗。", choices: [
      { text: "继续清洗（巩固权力）", effect: { militaryProd: 5, happiness: -15 } },
      { text: "遏制清洗（保留人才）", effect: { military: 200, research: 10 } }
    ]},
    winter_war: { year: 1939, title: "冬季战争", desc: "苏联入侵芬兰。", choices: [
      { text: "全力进攻（占领芬兰）", effect: { population: 400, military: -300 } },
      { text: "谈判停战", effect: { happiness: 5, money: 50 } }
    ]},
    operation_barbarossa: { year: 1941, title: "巴巴罗萨行动", desc: "德国入侵苏联。", choices: [
      { text: "战略撤退（保存实力）", effect: { military: -200, industry: -3 } },
      { text: "坚决抵抗（消耗德军）", effect: { military: -500, happiness: 10 } }
    ]},
    new_deal: { year: 1936, title: "新政延续", desc: "罗斯福新政持续推动经济复苏。", choices: [
      { text: "扩大公共工程", effect: { money: -50, industry: 3, happiness: 5 } },
      { text: "平衡预算", effect: { money: 50, happiness: -3 } }
    ]},
    pearl_harbor: { year: 1941, title: "珍珠港事件", desc: "日本偷袭珍珠港，美国参战。", choices: [
      { text: "全面动员（加入战争）", effect: { military: 500, money: -200 } },
      { text: "仅对日宣战", effect: { military: 300, money: -100 } }
    ]},
    dday: { year: 1944, title: "诺曼底登陆", desc: "盟军登陆诺曼底，开辟第二战场。", choices: [
      { text: "参与登陆（加速胜利）", effect: { military: -300, happiness: 10 } },
      { text: "从南欧进攻", effect: { military: -200 } }
    ]},
    manhattan: { year: 1945, title: "曼哈顿计划", desc: "美国成功研制原子弹。", choices: [
      { text: "投入使用（结束战争）", effect: { military: 1000, happiness: -5 } },
      { text: "仅作为威慑", effect: { research: 20 } }
    ]},
    battle_britain: { year: 1940, title: "不列颠之战", desc: "德国空军大规模轰炸英国。", choices: [
      { text: "坚守领空（防空作战）", effect: { military: -200, happiness: 10 } },
      { text: "加强防空火力", effect: { industry: -2, military: 100 } }
    ]},
    north_africa: { year: 1941, title: "北非战役", desc: "轴心国与盟军在北非交战。", choices: [
      { text: "增兵北非", effect: { military: -300, money: -50 } },
      { text: "战略收缩", effect: { military: -100, money: 50 } }
    ]},
    dunkirk: { year: 1940, title: "敦刻尔克大撤退", desc: "英法联军从敦刻尔克撤退。", choices: [
      { text: "全力救援", effect: { military: 200, money: -50 } },
      { text: "放弃撤退", effect: { military: -300, money: 100 } }
    ]},
    victory_day: { year: 1945, title: "胜利日", desc: "欧洲战场胜利。", choices: [
      { text: "庆祝胜利", effect: { happiness: 20, money: -50 } },
      { text: "继续备战冷战", effect: { military: 300, research: 10 } }
    ]},
    marco_polo: { year: 1937, title: "卢沟桥事变", desc: "中日全面战争爆发。", choices: [
      { text: "全面侵华", effect: { population: 10000, military: -500, money: -200 } },
      { text: "局部冲突", effect: { military: -200 } }
    ]},
    hiroshima: { year: 1945, title: "广岛核爆", desc: "美国在日本投下原子弹。", choices: [
      { text: "投降（战争结束）", effect: { happiness: -20, military: -500 } },
      { text: "继续抵抗", effect: { military: -300, happiness: -10 } }
    ]},
    mukden: { year: 1931, title: "九一八事变", desc: "日本占领中国东北。", choices: [
      { text: "建立满洲国", effect: { population: 3400, industry: 3, money: -100 } },
      { text: "国际抗议", effect: { happiness: 3 } }
    ]},
    ethiopia: { year: 1936, title: "征服埃塞俄比亚", desc: "意大利入侵埃塞俄比亚。", choices: [
      { text: "全力征服", effect: { population: 1000, military: -200, money: -100 } },
      { text: "接受国际制裁", effect: { happiness: -5, money: -50 } }
    ]},
    spain_civil: { year: 1936, title: "西班牙内战", desc: "佛朗哥发动内战。", choices: [
      { text: "支持佛朗哥", effect: { happiness: -3, military: 100 } },
      { text: "保持中立", effect: { money: 20 } }
    ]},
    greece_invasion: { year: 1940, title: "入侵希腊", desc: "意大利入侵希腊遭遇顽强抵抗。", choices: [
      { text: "增兵攻克", effect: { military: -300, population: 700 } },
      { text: "撤军", effect: { happiness: -5, money: 50 } }
    ]},
    armistice: { year: 1943, title: "意大利投降", desc: "盟军登陆西西里后意大利投降。", choices: [
      { text: "投降求和", effect: { happiness: -10, military: -400 } },
      { text: "继续抵抗（北方）", effect: { military: -200, happiness: -5 } }
    ]},
    northern_expedition: { year: 1936, title: "北伐战争后续", desc: "国民政府统一进程。", choices: [
      { text: "继续统一战争", effect: { population: 5000, military: -300 } },
      { text: "先发展经济", effect: { money: 100, industry: 2 } }
    ]},
    second_united_front: { year: 1937, title: "第二次国共合作", desc: "国共联合抗日。", choices: [
      { text: "联合抗日（接受共党）", effect: { military: 500, happiness: 5 } },
      { text: "继续剿共", effect: { military: -200, happiness: -5 } }
    ]},
    civil_war: { year: 1946, title: "国共内战", desc: "抗日战争结束后内战爆发。", choices: [
      { text: "全力剿共", effect: { military: -500, money: -200 } },
      { text: "和谈（失去大陆）", effect: { happiness: -15, population: -30000 } }
    ]}
  },

  // ---- AI行为模板 ----
  aiBehaviors: {
    aggressive: { militaryWeight: 0.5, expansionWeight: 0.4, economyWeight: 0.1 },
    defensive: { militaryWeight: 0.3, expansionWeight: 0.1, economyWeight: 0.4, happinessWeight: 0.2 },
    economic: { militaryWeight: 0.1, expansionWeight: 0.1, economyWeight: 0.6, researchWeight: 0.2 },
    balanced: { militaryWeight: 0.25, expansionWeight: 0.25, economyWeight: 0.25, happinessWeight: 0.15, researchWeight: 0.1 }
  },

  // ---- 游戏配置 ----
  config: {
    yearStart: 1936,
    yearEnd: 1950,
    tickInterval: 3000, // ms per game month
    baseExpansionCost: 50,
    baseAttackCost: 100,
    provinceDefenseBase: 100,
    militaryConsumptionRate: 0.01,
    foodConsumptionRate: 0.005,
    populationGrowthRate: 0.001,
    happinessDecayRate: 0.01,
    rebellionThreshold: 25,
    victoryConditions: {
      worldDomination: 0.8, // 控制世界80%人口
      economicVictory: 5000, // 金钱达到
      militaryVictory: 10000, // 军力达到
      researchVictory: 200 // 研究达到
    }
  }
};

