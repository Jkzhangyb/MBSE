export const initialNodes = [
  {
    id: 'N1',
    position: { x: 0, y: 0 },
    data: {
      label: '📋 需求管理与同步',
      active: true,
      subNodes: [
        { id: 'link', label: '链接需求服务', active: true, required: true, tool: 'Polarion', url: 'https://polarion.example.com', desc: '创建与Polarion或Doors的同步关系' },
        { id: 'create', label: '需求创建', active: true, required: true, tool: 'Polarion', desc: '导入文档或livedoc新建' },
        { id: 'edit', label: '需求编辑', active: false, required: false, tool: 'Polarion' },
        { id: 'review', label: '需求评审', active: false, required: false, tool: 'Polarion' },
        { id: 'flow', label: '需求流转', active: false, required: false, tool: 'EA', desc: '同步到EA' }
      ],
      subEdges: [
        { id: 'link-create', source: 'link', target: 'create' },
        { id: 'create-edit', source: 'create', target: 'edit' },
        { id: 'edit-review', source: 'edit', target: 'review' },
        { id: 'review-flow', source: 'review', target: 'flow' }
      ]
    }
  },
  {
    id: 'N2',
    position: { x: 250, y: 0 },
    data: {
      label: '🛠 功能与架构设计',
      active: true,
      subNodes: [
        { id: 'sync', label: '需求同步', active: true, required: true, tool: 'EA' },
        { id: 'design', label: '功能与架构设计', active: true, required: true, tool: 'EA' },
        { id: 'review', label: '系统架构评审', active: false, required: false, tool: 'WebCollaboration' },
        { id: 'publish', label: '模型发布', active: false, required: false, tool: 'EA' }
      ],
      subEdges: [
        { id: 'sync-design', source: 'sync', target: 'design' },
        { id: 'design-review', source: 'design', target: 'review' },
        { id: 'review-publish', source: 'review', target: 'publish' }
      ]
    }
  },
  {
    id: 'N3',
    position: { x: 500, y: 0 },
    data: {
      label: '🧩 系统集成和仿真',
      active: true,
      subNodes: [
        { id: 'import', label: '系统架构录入', active: true, required: true },
        { id: 'dispatch', label: '模型派发配置', active: true, required: true },
        { id: 'upload', label: '模型上传与校验', active: false, required: false },
        { id: 'instantiate', label: '模型实例生成', active: false, required: false },
        { id: 'config', label: '方案参数配置', active: true, required: true },
        { id: 'doe', label: '设计变量与DOE设置', active: false, required: false },
        { id: 'schedule', label: '仿真任务调度', active: true, required: true },
        { id: 'preview', label: '结果预览与KPI分析', active: false, required: false },
        { id: 'review', label: '系统模型评审', active: false, required: false },
        { id: 'report', label: '权衡分析报告输出', active: false, required: false },
        { id: 'archive', label: '评审结论与归档', active: false, required: false }
      ],
      subEdges: [
        { id: 'import-dispatch', source: 'import', target: 'dispatch' },
        { id: 'dispatch-upload', source: 'dispatch', target: 'upload' },
        { id: 'upload-instantiate', source: 'upload', target: 'instantiate' },
        { id: 'instantiate-config', source: 'instantiate', target: 'config' },
        { id: 'config-doe', source: 'config', target: 'doe' },
        { id: 'doe-schedule', source: 'doe', target: 'schedule' },
        { id: 'schedule-preview', source: 'schedule', target: 'preview' },
        { id: 'preview-review', source: 'preview', target: 'review' },
        { id: 'review-report', source: 'review', target: 'report' },
        { id: 'report-archive', source: 'report', target: 'archive' }
      ]
    }
  },
  {
    id: 'N4',
    position: { x: 750, y: 0 },
    data: {
      label: '🔎 设计追溯',
      active: true,
      subNodes: [
        { id: 'trace', label: '建立追溯关系链', active: true, required: true },
        { id: 'analysis', label: '需求覆盖度分析', active: false, required: false }
      ],
      subEdges: [
        { id: 'trace-analysis', source: 'trace', target: 'analysis' }
      ]
    }
  }
];

export const initialEdges = [
  { id: 'e1-2', source: 'N1', target: 'N2' },
  { id: 'e2-3', source: 'N2', target: 'N3' },
  { id: 'e3-4', source: 'N3', target: 'N4' }
];

// 工作流数据
export const workflowData = [
  // 原有数据
  {
    name: "空调系统热管理流程",
    system: "空调系统",
    stage: "需求分析",
    desc: "空调系统的热管理流程设计，包括制冷、制热、除湿等功能",
    status: "执行中",
    activity: "正在分析热负荷需求",
    favorite: false
  },
  {
    name: "发动机控制系统设计",
    system: "发动机系统",
    stage: "系统设计",
    desc: "发动机控制系统的设计流程，包括燃油喷射、点火控制等",
    status: "已完成",
    activity: "系统设计已完成，等待评审",
    favorite: true
  },
  {
    name: "制动系统安全验证",
    system: "制动系统",
    stage: "验证测试",
    desc: "制动系统的安全验证流程，确保制动性能符合标准",
    status: "异常",
    activity: "制动距离测试未通过",
    favorite: false
  },
  {
    name: "车身结构强度分析",
    system: "车身系统",
    stage: "分析设计",
    desc: "车身结构强度分析流程，包括碰撞安全、刚度分析等",
    status: "暂停",
    activity: "等待材料参数确认",
    favorite: true
  },
  {
    name: "电气系统集成测试",
    system: "电气系统",
    stage: "集成测试",
    desc: "电气系统的集成测试流程，验证各模块协同工作",
    status: "待发布",
    activity: "测试用例编写中",
    favorite: false
  },
  
  // 新增数据 - 空调系统相关
  {
    name: "空调压缩机控制流程",
    system: "空调系统",
    stage: "控制设计",
    desc: "空调压缩机控制算法设计，实现高效节能运行",
    status: "执行中",
    activity: "控制算法优化中",
    favorite: false
  },
  {
    name: "空调管路设计验证",
    system: "空调系统",
    stage: "设计验证",
    desc: "空调管路系统设计验证，确保制冷剂流动效率",
    status: "已完成",
    activity: "管路设计验证通过",
    favorite: true
  },
  {
    name: "空调出风口优化",
    system: "空调系统",
    stage: "优化改进",
    desc: "空调出风口设计优化，提升用户体验",
    status: "异常",
    activity: "风量分布不均匀",
    favorite: false
  },
  {
    name: "空调传感器校准",
    system: "空调系统",
    stage: "校准测试",
    desc: "空调系统传感器校准流程，确保测量精度",
    status: "暂停",
    activity: "等待校准设备",
    favorite: false
  },
  
  // 发动机系统相关
  {
    name: "发动机燃油喷射优化",
    system: "发动机系统",
    stage: "性能优化",
    desc: "发动机燃油喷射系统优化，提升燃烧效率",
    status: "执行中",
    activity: "喷射参数调整中",
    favorite: true
  },
  {
    name: "发动机冷却系统设计",
    system: "发动机系统",
    stage: "系统设计",
    desc: "发动机冷却系统设计，确保温度控制",
    status: "已完成",
    activity: "冷却系统设计完成",
    favorite: false
  },
  {
    name: "发动机排放控制",
    system: "发动机系统",
    stage: "环保设计",
    desc: "发动机排放控制系统设计，满足环保标准",
    status: "异常",
    activity: "排放测试超标",
    favorite: false
  },
  {
    name: "发动机振动分析",
    system: "发动机系统",
    stage: "振动分析",
    desc: "发动机振动特性分析，优化NVH性能",
    status: "待发布",
    activity: "振动模型建立中",
    favorite: true
  },
  
  // 制动系统相关
  {
    name: "制动盘热分析",
    system: "制动系统",
    stage: "热分析",
    desc: "制动盘热分析流程，评估制动性能",
    status: "执行中",
    activity: "热分析计算中",
    favorite: false
  },
  {
    name: "制动液管路设计",
    system: "制动系统",
    stage: "管路设计",
    desc: "制动液管路系统设计，确保制动响应",
    status: "已完成",
    activity: "管路设计验证通过",
    favorite: false
  },
  {
    name: "制动助力器测试",
    system: "制动系统",
    stage: "功能测试",
    desc: "制动助力器功能测试，验证助力效果",
    status: "异常",
    activity: "助力效果不达标",
    favorite: false
  },
  {
    name: "制动系统集成",
    system: "制动系统",
    stage: "系统集成",
    desc: "制动系统各组件集成测试",
    status: "暂停",
    activity: "等待组件到货",
    favorite: true
  },
  
  // 车身系统相关
  {
    name: "车身轻量化设计",
    system: "车身系统",
    stage: "轻量化设计",
    desc: "车身轻量化设计流程，降低整车重量",
    status: "执行中",
    activity: "材料选择优化中",
    favorite: true
  },
  {
    name: "车身防腐设计",
    system: "车身系统",
    stage: "防腐设计",
    desc: "车身防腐设计流程，提升耐久性",
    status: "已完成",
    activity: "防腐方案确定",
    favorite: false
  },
  {
    name: "车身密封性测试",
    system: "车身系统",
    stage: "密封测试",
    desc: "车身密封性测试流程，防止漏水",
    status: "异常",
    activity: "密封条老化测试失败",
    favorite: false
  },
  {
    name: "车身NVH优化",
    system: "车身系统",
    stage: "NVH优化",
    desc: "车身NVH性能优化，降低噪音振动",
    status: "待发布",
    activity: "声学模型建立中",
    favorite: true
  },
  
  // 电气系统相关
  {
    name: "车载娱乐系统集成",
    system: "电气系统",
    stage: "系统集成",
    desc: "车载娱乐系统集成流程，提供多媒体功能",
    status: "执行中",
    activity: "系统兼容性测试中",
    favorite: false
  },
  {
    name: "车载网络通信",
    system: "电气系统",
    stage: "通信设计",
    desc: "车载网络通信系统设计，实现模块间通信",
    status: "已完成",
    activity: "通信协议确定",
    favorite: true
  },
  {
    name: "车载诊断系统",
    system: "电气系统",
    stage: "诊断设计",
    desc: "车载诊断系统设计，实现故障检测",
    status: "异常",
    activity: "诊断算法调试中",
    favorite: false
  },
  {
    name: "车载安全系统",
    system: "电气系统",
    stage: "安全设计",
    desc: "车载安全系统设计，提升行车安全",
    status: "暂停",
    activity: "安全标准更新中",
    favorite: true
  },
  
  // 底盘系统相关
  {
    name: "悬架系统调校",
    system: "底盘系统",
    stage: "性能调校",
    desc: "悬架系统性能调校，优化操控性",
    status: "执行中",
    activity: "悬架参数调整中",
    favorite: true
  },
  {
    name: "转向系统设计",
    system: "底盘系统",
    stage: "系统设计",
    desc: "转向系统设计流程，确保转向精度",
    status: "已完成",
    activity: "转向系统设计完成",
    favorite: false
  },
  {
    name: "轮胎性能测试",
    system: "底盘系统",
    stage: "性能测试",
    desc: "轮胎性能测试流程，评估抓地力",
    status: "异常",
    activity: "湿滑路面测试失败",
    favorite: false
  },
  {
    name: "底盘NVH分析",
    system: "底盘系统",
    stage: "NVH分析",
    desc: "底盘NVH性能分析，降低振动噪音",
    status: "待发布",
    activity: "振动模型建立中",
    favorite: true
  },
  
  // 传动系统相关
  {
    name: "变速箱换挡优化",
    system: "传动系统",
    stage: "换挡优化",
    desc: "变速箱换挡逻辑优化，提升平顺性",
    status: "执行中",
    activity: "换挡算法优化中",
    favorite: false
  },
  {
    name: "离合器设计验证",
    system: "传动系统",
    stage: "设计验证",
    desc: "离合器设计验证流程，确保可靠性",
    status: "已完成",
    activity: "离合器设计验证通过",
    favorite: true
  },
  {
    name: "传动轴动平衡",
    system: "传动系统",
    stage: "动平衡",
    desc: "传动轴动平衡测试，降低振动",
    status: "异常",
    activity: "动平衡测试未通过",
    favorite: false
  },
  {
    name: "差速器性能测试",
    system: "传动系统",
    stage: "性能测试",
    desc: "差速器性能测试流程，验证差速功能",
    status: "暂停",
    activity: "等待测试设备",
    favorite: false
  },
  
  // 安全系统相关
  {
    name: "安全气囊触发逻辑",
    system: "安全系统",
    stage: "逻辑设计",
    desc: "安全气囊触发逻辑设计，确保及时触发",
    status: "执行中",
    activity: "触发算法优化中",
    favorite: true
  },
  {
    name: "安全带预紧器测试",
    system: "安全系统",
    stage: "功能测试",
    desc: "安全带预紧器功能测试，验证预紧效果",
    status: "已完成",
    activity: "预紧器测试通过",
    favorite: false
  },
  {
    name: "碰撞传感器校准",
    system: "安全系统",
    stage: "传感器校准",
    desc: "碰撞传感器校准流程，确保检测精度",
    status: "异常",
    activity: "传感器响应异常",
    favorite: false
  },
  {
    name: "安全系统集成测试",
    system: "安全系统",
    stage: "集成测试",
    desc: "安全系统集成测试，验证协同工作",
    status: "待发布",
    activity: "集成测试准备中",
    favorite: true
  },
  
  // 舒适系统相关
  {
    name: "座椅加热控制",
    system: "舒适系统",
    stage: "控制设计",
    desc: "座椅加热控制系统设计，提供舒适体验",
    status: "执行中",
    activity: "温度控制算法优化中",
    favorite: false
  },
  {
    name: "车窗防夹功能",
    system: "舒适系统",
    stage: "功能设计",
    desc: "车窗防夹功能设计，确保使用安全",
    status: "已完成",
    activity: "防夹功能验证通过",
    favorite: true
  },
  {
    name: "天窗密封性测试",
    system: "舒适系统",
    stage: "密封测试",
    desc: "天窗密封性测试流程，防止漏水",
    status: "异常",
    activity: "密封性测试失败",
    favorite: false
  },
  {
    name: "车内氛围灯设计",
    system: "舒适系统",
    stage: "照明设计",
    desc: "车内氛围灯设计，提升内饰品质",
    status: "暂停",
    activity: "等待LED组件",
    favorite: false
  }
];
