import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { workflowData } from './workflowData';
import closeIcon from './assets/close.png';
import templateIcon from './assets/template.png';
import './WorkflowHome.css';
import logo from './assets/react.svg';
import createImg from './assets/createworkflow.png';
import editImg from './assets/editworkflow.png';
import publishImg from './assets/publishworkflow.png';
import BpmnModeler from './BpmnModeler';

// 模板预览组件
const TemplatePreview = ({ template, onClose }) => {
  const [viewMode, setViewMode] = useState('swimlane'); // swimlane, tree, flow

  if (!template || !template.structure) {
    return null;
  }

  const { phases, connections } = template.structure;

  // 泳道图视图
  const SwimlaneView = () => (
    <div className="swimlane-container">
      {phases.map((phase, index) => (
        <div key={phase.id} className="swimlane">
          <div className="swimlane-header">
            <h3>{phase.name}</h3>
            <p>{phase.description}</p>
          </div>
          <div className="swimlane-content">
            {phase.nodes.map((node) => (
              <div 
                key={node.id} 
                className={`swimlane-node ${node.type} ${node.required ? 'required' : 'optional'}`}
              >
                <div className="node-icon">
                  {node.type === 'input' && '📥'}
                  {node.type === 'process' && '⚙️'}
                  {node.type === 'review' && '👁️'}
                  {node.type === 'test' && '🧪'}
                  {node.type === 'config' && '⚙️'}
                  {node.type === 'analysis' && '📊'}
                </div>
                <div className="node-content">
                  <div className="node-name">{node.name}</div>
                  <div className="node-required">
                    {node.required ? '必填' : '可选'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // 树形视图
  const TreeView = () => (
    <div className="tree-container">
      {phases.map((phase, phaseIndex) => (
        <div key={phase.id} className="tree-phase">
          <div className="tree-phase-header">
            <div className="tree-phase-title">{phase.name}</div>
            <div className="tree-phase-desc">{phase.description}</div>
          </div>
          <div className="tree-nodes">
            {phase.nodes.map((node, nodeIndex) => (
              <div key={node.id} className="tree-node-wrapper">
                {nodeIndex > 0 && <div className="tree-connector"></div>}
                <div className={`tree-node ${node.type} ${node.required ? 'required' : 'optional'}`}>
                  <div className="tree-node-icon">
                    {node.type === 'input' && '📥'}
                    {node.type === 'process' && '⚙️'}
                    {node.type === 'review' && '👁️'}
                    {node.type === 'test' && '🧪'}
                    {node.type === 'config' && '⚙️'}
                    {node.type === 'analysis' && '📊'}
                  </div>
                  <div className="tree-node-info">
                    <div className="tree-node-name">{node.name}</div>
                    <div className="tree-node-type">{node.type}</div>
                  </div>
                  <div className="tree-node-status">
                    {node.required ? '必填' : '可选'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {phaseIndex < phases.length - 1 && (
            <div className="tree-phase-connector">
              <div className="connector-line"></div>
              <div className="connector-arrow">↓</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // 流程图视图
  const FlowView = () => (
    <div className="flow-container">
      <div className="flow-phases">
        {phases.map((phase, index) => (
          <div key={phase.id} className="flow-phase">
            <div className="flow-phase-header">
              <div className="flow-phase-title">{phase.name}</div>
              <div className="flow-phase-desc">{phase.description}</div>
            </div>
            <div className="flow-nodes">
              {phase.nodes.map((node, nodeIndex) => (
                <div key={node.id} className="flow-node-wrapper">
                  <div className={`flow-node ${node.type} ${node.required ? 'required' : 'optional'}`}>
                    <div className="flow-node-icon">
                      {node.type === 'input' && '📥'}
                      {node.type === 'process' && '⚙️'}
                      {node.type === 'review' && '👁️'}
                      {node.type === 'test' && '🧪'}
                      {node.type === 'config' && '⚙️'}
                      {node.type === 'analysis' && '📊'}
                    </div>
                    <div className="flow-node-name">{node.name}</div>
                  </div>
                  {nodeIndex < phase.nodes.length - 1 && (
                    <div className="flow-node-arrow">→</div>
                  )}
                </div>
              ))}
            </div>
            {index < phases.length - 1 && (
              <div className="flow-phase-arrow">↓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="modal-mask">
      <div className="modal-content template-preview-modal">
        <div className="modal-header">
          <span style={{fontWeight:'bold',fontSize:18}}>模板预览 - {template.name}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="preview-controls">
          <button 
            className={`preview-btn ${viewMode === 'swimlane' ? 'active' : ''}`}
            onClick={() => setViewMode('swimlane')}
          >
            🏊 泳道图
          </button>
          <button 
            className={`preview-btn ${viewMode === 'tree' ? 'active' : ''}`}
            onClick={() => setViewMode('tree')}
          >
            🌳 节点树
          </button>
          <button 
            className={`preview-btn ${viewMode === 'flow' ? 'active' : ''}`}
            onClick={() => setViewMode('flow')}
          >
            🔄 流程图
          </button>
        </div>

        <div className="preview-content">
          {viewMode === 'swimlane' && <SwimlaneView />}
          {viewMode === 'tree' && <TreeView />}
          {viewMode === 'flow' && <FlowView />}
        </div>

        <div className="preview-footer">
          <div className="template-info">
            <div><strong>模板ID：</strong>{template.templateId}</div>
            <div><strong>适用阶段：</strong>{template.defaultPhaseList.join(' → ')}</div>
            <div><strong>模型绑定：</strong>{template.defaultModelBinding.join('、')}</div>
          </div>
          <div className="preview-actions">
            <button className="modal-template-btn" onClick={onClose}>关闭</button>
            <button 
              className="modal-template-btn"
              style={{background: '#52c41a', color: 'white'}}
              onClick={() => {
                onClose();
                // 这里可以触发使用模板的逻辑
              }}
            >
              使用此模板
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toast通知系统
const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === 'success' && '✅'}
        {type === 'error' && '❌'}
        {type === 'warning' && '⚠️'}
        {type === 'info' && 'ℹ️'}
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => (
  <div className="toast-container">
    {toasts.map(toast => (
      <Toast
        key={toast.id}
        message={toast.message}
        type={toast.type}
        onClose={() => removeToast(toast.id)}
      />
    ))}
  </div>
);

// 快捷操作卡片数据
const quickActions = [
  { icon: '➕', label: '新建系统工程流程', onClick: () => {} },
  { icon: '📂', label: '查看最近使用', onClick: () => {} },
  { icon: '📊', label: '系统建模模板库', onClick: () => {} },
];

const QuickActionBoard = () => (
  <div className="quick-action-board">
    {quickActions.map(action => (
      <div className="quick-action-card" key={action.label} onClick={action.onClick} tabIndex={0} role="button">
        <span className="quick-action-icon">{action.icon}</span>
        <span className="quick-action-label">{action.label}</span>
      </div>
    ))}
  </div>
);

// 静态引导流程内容
const GuideSteps = () => (
  <div className="workflow-guide-bg">
    <div className="workflow-guide-content">
      <div className="guide-header">
        <img src={logo} alt="logo" className="guide-logo" />
        <div className="guide-title">工作流管理平台</div>
        <div className="guide-desc">高效、智能、可视化的流程管理，助力企业数字化转型</div>
      </div>
      {/* 数据总览横向卡片包裹 */}
      <div className="overview-board-wrapper">
        <OverviewBoard />
      </div>
      {/* 快捷操作卡片区 */}
      <QuickActionBoard />
      {/* 静态引导三步流程独立横向卡片 */}
      <div className="guide-steps-card">
        <div className="guide-steps-row">
          <div className="guide-step">
            <img src={createImg} alt="新建" className="step-img" />
            <div className="step-title">新建工作流</div>
            <div className="step-desc">点击"新建工作流"按钮，创建你的第一个流程</div>
          </div>
          <div className="guide-arrow">→</div>
          <div className="guide-step">
            <img src={editImg} alt="编辑" className="step-img" />
            <div className="step-title">设计工作流</div>
            <div className="step-desc">在弹出的建模器中拖拽节点，配置工作流逻辑</div>
          </div>
          <div className="guide-arrow">→</div>
          <div className="guide-step">
            <img src={publishImg} alt="发布" className="step-img" />
            <div className="step-title">发布工作流</div>
            <div className="step-desc">工作流设计完成后可一键发布，正式投入使用</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 渲染状态
const renderStatus = (status) => {
  const statusConfig = {
    '执行中': { color: '#0099ff', bg: '#e6f7ff', icon: '▶️', animation: 'pulse' },
    '已完成': { color: '#52c41a', bg: '#f6ffed', icon: '✅', animation: '' },
    '异常': { color: '#ff4d4f', bg: '#fff2f0', icon: '❌', animation: 'shake' },
    '暂停': { color: '#faad14', bg: '#fffbe6', icon: '⏸️', animation: '' },
    '待发布': { color: '#722ed1', bg: '#f9f0ff', icon: '📋', animation: '' }
  };
  const config = statusConfig[status] || { color: '#666', bg: '#f5f5f5', icon: '📄', animation: '' };
  
  return (
    <span 
      className={`status-tag ${config.animation}`}
      style={{ 
        backgroundColor: config.bg, 
        color: config.color,
        border: `1px solid ${config.color}20`
      }}
    >
      <span className="status-icon">{config.icon}</span>
      {status}
    </span>
  );
};

// 表头
const allColumns = [
  { title: '名称', dataIndex: 'name' },
  { title: '所属系统', dataIndex: 'system' },
  { title: '阶段', dataIndex: 'stage' },
  { title: '描述', dataIndex: 'desc' },
  { title: '状态', dataIndex: 'status' },
  { title: '最新活动', dataIndex: 'activity' },
  { title: '操作', dataIndex: 'actions' },
];

// 数据总览卡片
const overviewData = [
  { label: '总项目数', value: 50, color: '#1976d2' },
  { label: '发布流程数', value: 10, color: '#43a047' },
  { label: '执行中的流程', value: 12, color: '#ffa000' },
  { label: '异常流程', value: 10, color: '#e53935' },
];

const OverviewBoard = () => (
  <div className="overview-board">
    {overviewData.map(item => (
      <div className="overview-card" key={item.label} style={{borderBottom:`3px solid ${item.color}`}}>
        <div className="overview-value">{item.value}</div>
        <div className="overview-label">{item.label}</div>
      </div>
    ))}
  </div>
);

// 模板数据
const templateTags = ['全部', '通用', '业务'];
const templateList = [
  {
    templateId: 'vmodel',
    name: 'INCOSE V-模型',
    description: '经典系统工程V模型，适用于通用系统开发流程。',
    tags: ['通用'],
    defaultPhaseList: ['需求分析', '系统设计', '集成验证'],
    defaultModelBinding: ['需求模型', '设计模型'],
    structure: {
      phases: [
        {
          id: 'requirements',
          name: '需求分析',
          description: '收集和分析系统需求',
          nodes: [
            { id: 'req1', name: '需求收集', type: 'input', required: true },
            { id: 'req2', name: '需求分析', type: 'process', required: true },
            { id: 'req3', name: '需求确认', type: 'review', required: true }
          ]
        },
        {
          id: 'design',
          name: '系统设计',
          description: '基于需求进行系统设计',
          nodes: [
            { id: 'des1', name: '架构设计', type: 'process', required: true },
            { id: 'des2', name: '详细设计', type: 'process', required: true },
            { id: 'des3', name: '设计评审', type: 'review', required: false }
          ]
        },
        {
          id: 'verification',
          name: '集成验证',
          description: '系统集成和验证测试',
          nodes: [
            { id: 'ver1', name: '系统集成', type: 'process', required: true },
            { id: 'ver2', name: '验证测试', type: 'test', required: true },
            { id: 'ver3', name: '验收确认', type: 'review', required: true }
          ]
        }
      ],
      connections: [
        { from: 'requirements', to: 'design' },
        { from: 'design', to: 'verification' }
      ]
    }
  },
  {
    templateId: 'rflp',
    name: 'RFLP流程',
    description: '基于RFLP思想的系统建模流程，适合复杂产品。',
    tags: ['通用'],
    defaultPhaseList: ['需求', '功能', '逻辑', '物理'],
    defaultModelBinding: ['功能模型', '逻辑模型'],
    structure: {
      phases: [
        {
          id: 'requirements',
          name: '需求阶段',
          description: '明确产品需求和约束',
          nodes: [
            { id: 'req1', name: '需求定义', type: 'input', required: true },
            { id: 'req2', name: '需求分析', type: 'process', required: true },
            { id: 'req3', name: '需求验证', type: 'review', required: true }
          ]
        },
        {
          id: 'functional',
          name: '功能阶段',
          description: '定义系统功能架构',
          nodes: [
            { id: 'fun1', name: '功能分解', type: 'process', required: true },
            { id: 'fun2', name: '功能分配', type: 'process', required: true },
            { id: 'fun3', name: '功能验证', type: 'test', required: false }
          ]
        },
        {
          id: 'logical',
          name: '逻辑阶段',
          description: '设计逻辑架构和接口',
          nodes: [
            { id: 'log1', name: '逻辑设计', type: 'process', required: true },
            { id: 'log2', name: '接口设计', type: 'process', required: true },
            { id: 'log3', name: '逻辑验证', type: 'test', required: true }
          ]
        },
        {
          id: 'physical',
          name: '物理阶段',
          description: '实现物理架构和组件',
          nodes: [
            { id: 'phy1', name: '物理设计', type: 'process', required: true },
            { id: 'phy2', name: '组件实现', type: 'process', required: true },
            { id: 'phy3', name: '物理验证', type: 'test', required: true }
          ]
        }
      ],
      connections: [
        { from: 'requirements', to: 'functional' },
        { from: 'functional', to: 'logical' },
        { from: 'logical', to: 'physical' }
      ]
    }
  },
  {
    templateId: 'ac_heat',
    name: '空调热管理模板',
    description: '面向整车空调热管理的业务流程模板。',
    tags: ['业务'],
    defaultPhaseList: ['热负荷分析', '仿真建模', '测试验证'],
    defaultModelBinding: ['热管理模型'],
    structure: {
      phases: [
        {
          id: 'load_analysis',
          name: '热负荷分析',
          description: '分析整车热负荷需求',
          nodes: [
            { id: 'load1', name: '环境条件分析', type: 'input', required: true },
            { id: 'load2', name: '热负荷计算', type: 'process', required: true },
            { id: 'load3', name: '负荷分布分析', type: 'analysis', required: true }
          ]
        },
        {
          id: 'simulation',
          name: '仿真建模',
          description: '建立热管理仿真模型',
          nodes: [
            { id: 'sim1', name: '模型建立', type: 'process', required: true },
            { id: 'sim2', name: '参数设置', type: 'config', required: true },
            { id: 'sim3', name: '仿真运行', type: 'process', required: true },
            { id: 'sim4', name: '结果分析', type: 'analysis', required: true }
          ]
        },
        {
          id: 'testing',
          name: '测试验证',
          description: '验证热管理性能',
          nodes: [
            { id: 'test1', name: '台架测试', type: 'test', required: true },
            { id: 'test2', name: '整车测试', type: 'test', required: true },
            { id: 'test3', name: '性能评估', type: 'review', required: true }
          ]
        }
      ],
      connections: [
        { from: 'load_analysis', to: 'simulation' },
        { from: 'simulation', to: 'testing' }
      ]
    }
  },
  {
    templateId: 'veh_perf',
    name: '整车性能模板',
    description: '整车动力性与性能分析业务流程模板。',
    tags: ['业务'],
    defaultPhaseList: ['性能需求', '仿真分析', '性能验证'],
    defaultModelBinding: ['性能模型'],
    structure: {
      phases: [
        {
          id: 'performance_req',
          name: '性能需求',
          description: '定义整车性能指标',
          nodes: [
            { id: 'perf1', name: '性能指标定义', type: 'input', required: true },
            { id: 'perf2', name: '目标值设定', type: 'config', required: true },
            { id: 'perf3', name: '需求确认', type: 'review', required: true }
          ]
        },
        {
          id: 'simulation_analysis',
          name: '仿真分析',
          description: '进行性能仿真分析',
          nodes: [
            { id: 'sim1', name: '模型构建', type: 'process', required: true },
            { id: 'sim2', name: '工况设置', type: 'config', required: true },
            { id: 'sim3', name: '仿真计算', type: 'process', required: true },
            { id: 'sim4', name: '结果分析', type: 'analysis', required: true }
          ]
        },
        {
          id: 'performance_validation',
          name: '性能验证',
          description: '验证性能指标达成',
          nodes: [
            { id: 'val1', name: '台架验证', type: 'test', required: true },
            { id: 'val2', name: '道路测试', type: 'test', required: true },
            { id: 'val3', name: '性能评估', type: 'review', required: true }
          ]
        }
      ],
      connections: [
        { from: 'performance_req', to: 'simulation_analysis' },
        { from: 'simulation_analysis', to: 'performance_validation' }
      ]
    }
  },
];

const phaseList = [
  '全部', '需求分析', '功能建模', '系统仿真', '仿真验证', '性能测试', '安全仿真', 'NVH分析', '寿命预测'
];

// 最近使用localStorage key
const RECENT_KEY = 'recentWorkflows';

function getRecentWorkflows() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch {
    return [];
  }
}
function setRecentWorkflows(list) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}

// 我的收藏localStorage key
const FAVORITE_KEY = 'favoriteWorkflows';
function getFavoriteWorkflows() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];
  } catch {
    return [];
  }
}
function setFavoriteWorkflows(list) {
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(list));
}

// 面包屑导航组件
function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs">
      {items.map((item, idx) => (
        <span key={item.path}>
          {item.path ? <Link to={item.path}>{item.label}</Link> : <span>{item.label}</span>}
          {idx < items.length - 1 && <span className="breadcrumbs-sep"> / </span>}
        </span>
      ))}
    </nav>
  );
}

// 拖拽初始宽度
const DEFAULT_WIDTHS = {
  name: 180,
  system: 120,
  stage: 120,
  desc: 280,
  status: 100,
  activity: 140,
  actions: 160
};

export default function WorkflowHome({ onCreateWorkflow }) {
  const [data, setData] = useState(workflowData);
  const navigate = useNavigate();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState('全部');
  const [showBpmnModal, setShowBpmnModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState('全部');
  const [showWorkflowDefModal, setShowWorkflowDefModal] = useState(false);
  const [workflowDefForm, setWorkflowDefForm] = useState({
    name: '',
    desc: '',
    stage: phaseList.filter(p => p !== '全部')[0] || ''
  });
  const [recentVisible, setRecentVisible] = useState(false);
  const [recentList, setRecentList] = useState(getRecentWorkflows());
  const [favoriteVisible, setFavoriteVisible] = useState(false);
  const [favoriteList, setFavoriteList] = useState(getFavoriteWorkflows());
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [visibleCols, setVisibleCols] = useState(allColumns.map(col => col.dataIndex));
  const [colWidths, setColWidths] = useState(DEFAULT_WIDTHS);
  const [dragCol, setDragCol] = useState(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartWidth, setDragStartWidth] = useState(0);
  const [sortState, setSortState] = useState({ field: '', order: 'asc' });
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [publishConfirm, setPublishConfirm] = useState({ show: false, workflow: null });
  const [toasts, setToasts] = useState([]);
  const [lastSearchTerm, setLastSearchTerm] = useState('');
  const [moreActionsVisible, setMoreActionsVisible] = useState(null);
  const [moreMenuVisible, setMoreMenuVisible] = useState({});
  const [moreMenuPosition, setMoreMenuPosition] = useState({});
  const [tooltipPosition, setTooltipPosition] = useState({ visible: false, x: 0, y: 0, text: '' });
  const [forceUpdate, setForceUpdate] = useState(0); // 强制重新渲染
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const [showFormGuide, setShowFormGuide] = useState(false);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  // Toast通知函数
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // 模板筛选
  const filteredTemplates = selectedTag === '全部'
    ? templateList
    : templateList.filter(t => t.tags.includes(selectedTag));

  // 表格数据根据阶段筛选
  const filteredData = selectedPhase === '全部'
    ? data
    : data.filter(row => row.stage === selectedPhase);

  // 表格渲染用的列
  const columns = allColumns.filter(col => visibleCols.includes(col.dataIndex));

  // 操作按钮渲染
  const renderActions = (row) => (
    <div className="actions-container">
      <button className="action-btn edit" onClick={() => {
        setSelectedWorkflow(row);
        setShowBpmnModal(true);
      }}>编辑</button>
      <button className="action-btn publish" onClick={() => handlePublish(row)}>发布</button>
      
      {/* 更多操作下拉菜单 */}
      <div className="more-actions-wrapper">
        <button 
          className="action-btn more"
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.target.getBoundingClientRect();
            const dropdownWidth = 120;
            const dropdownHeight = 120;
            
            // 计算最佳位置，避免超出视窗边界
            let left = rect.right - dropdownWidth;
            let top = rect.bottom + 5;
            
            // 如果右侧空间不足，向左调整
            if (left + dropdownWidth > window.innerWidth) {
              left = window.innerWidth - dropdownWidth - 10;
            }
            
            // 如果底部空间不足，向上显示
            if (top + dropdownHeight > window.innerHeight) {
              top = rect.top - dropdownHeight - 5;
            }
            
            // 确保不超出左边界
            if (left < 10) {
              left = 10;
            }
            
            setMoreActionsVisible(moreActionsVisible === row.name ? null : {
              name: row.name,
              top: top,
              left: left
            });
          }}
        >
          更多 ▼
        </button>
        {moreActionsVisible && moreActionsVisible.name === row.name && (
          <div 
            className="more-actions-dropdown-fixed"
            style={{
              top: moreActionsVisible.top,
              left: moreActionsVisible.left
            }}
          >
            <button className="more-action-item" onClick={() => handleCopy(row)}>
              <span className="action-icon">📋</span> 复制
            </button>
            <button className="more-action-item" onClick={() => handleDelete(row)}>
              <span className="action-icon">🗑️</span> 删除
            </button>
            <button className="more-action-item" onClick={() => handleView(row)}>
              <span className="action-icon">👁️</span> 查看
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // 点击外部关闭更多操作菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.more-actions-wrapper')) {
        setMoreActionsVisible(null);
      }
    };

    if (moreActionsVisible) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [moreActionsVisible]);

  // 更多操作处理函数
  const handleCopy = (row) => {
    showToast(`已复制工作流"${row.name}"`, 'success');
    setMoreActionsVisible(null);
  };

  const handleDelete = (row) => {
    if (confirm(`确定要删除工作流"${row.name}"吗？`)) {
      showToast(`已删除工作流"${row.name}"`, 'success');
      setMoreActionsVisible(null);
    }
  };

  const handleView = (row) => {
    showToast(`正在查看工作流"${row.name}"`, 'info');
    setMoreActionsVisible(null);
  };

  // 发布工作流
  const handlePublish = (row) => {
    if (row.status === '已发布') {
      showToast('该工作流已经发布过了！', 'warning');
      return;
    }
    
    setPublishConfirm({ show: true, workflow: row });
  };

  const confirmPublish = () => {
    const { workflow } = publishConfirm;
    
    // 这里应该调用API发布工作流
    console.log('发布工作流:', workflow.name);
    
    // 更新数据状态
    setData(prevData => 
      prevData.map(item => 
        item.name === workflow.name 
          ? { ...item, status: '已发布', activity: '已发布 - 可执行' }
          : item
      )
    );
    
    // 关闭确认对话框
    setPublishConfirm({ show: false, workflow: null });
    
    // 显示成功提示
    showToast(`工作流"${workflow.name}"发布成功！`, 'success');
  };

  const cancelPublish = () => {
    setPublishConfirm({ show: false, workflow: null });
  };

  // 点击流程名称时，记录最近使用
  const handleWorkflowClick = (row) => {
    const now = Date.now();
    const newItem = { name: row.name, system: row.system, stage: row.stage, time: now };
    let list = getRecentWorkflows();
    // 去重，最新在前
    list = [newItem, ...list.filter(item => item.name !== row.name)].slice(0, 8);
    setRecentWorkflows(list);
    setRecentList(list);
    navigate(`/workflow/${encodeURIComponent(row.name)}`);
  };
  // 名称渲染为可点击链接+收藏星标
  const renderName = (row) => (
    <span style={{display:'flex',alignItems:'center',gap:4}}>
      <span
        className="workflow-link"
        onClick={() => handleWorkflowClick(row)}
      >
        {row.name}
      </span>
      <span
        className={isFavorite(row) ? "favorite-star active" : "favorite-star"}
        title={isFavorite(row) ? "取消收藏" : "收藏"}
        onClick={e => { e.stopPropagation(); handleToggleFavorite(row); }}
      >★</span>
    </span>
  );

  // 新建工作流按钮回调
  const handleCreateWorkflow = () => {
    setShowWorkflowDefModal(true);
    setWorkflowDefForm({ name: '', desc: '', stage: phaseList.filter(p => p !== '全部')[0] || '' });
  };
  // 关闭建模器弹窗
  const handleCloseBpmnModal = () => {
    setShowBpmnModal(false);
    setSelectedTemplate(null);
  };

  const isFavorite = (row) => favoriteList.some(item => item.name === row.name);
  const handleToggleFavorite = (row) => {
    let list = getFavoriteWorkflows();
    if (isFavorite(row)) {
      list = list.filter(item => item.name !== row.name);
      showToast(`已取消收藏"${row.name}"`, 'info');
    } else {
      list = [{ name: row.name, system: row.system, stage: row.stage }, ...list].slice(0, 20);
      showToast(`已收藏"${row.name}"`, 'success');
    }
    setFavoriteWorkflows(list);
    setFavoriteList(list);
  };

  // 拖拽事件
  const handleDragStart = (col, e) => {
    console.log('拖拽开始:', col, e.clientX); // 调试信息
    e.preventDefault();
    e.stopPropagation();
    setDragCol(col);
    setDragStartX(e.clientX);
    setDragStartWidth(colWidths[col]);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };
  
  const handleDrag = useCallback((e) => {
    if (!dragCol) return;
    console.log('拖拽中:', dragCol, e.clientX); // 调试信息
    e.preventDefault();
    const delta = e.clientX - dragStartX;
    const newWidth = Math.max(60, dragStartWidth + delta);
    console.log('新宽度:', newWidth); // 调试信息
    console.log('当前colWidths:', colWidths); // 调试信息
    setColWidths(prev => {
      const newWidths = { ...prev, [dragCol]: newWidth };
      console.log('更新后的colWidths:', newWidths); // 调试信息
      return newWidths;
    });
    // 强制重新渲染
    setForceUpdate(prev => prev + 1);
  }, [dragCol, dragStartX, dragStartWidth, colWidths]);
  
  const handleDragEnd = useCallback(() => {
    console.log('拖拽结束:', dragCol); // 调试信息
    setDragCol(null);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [dragCol]);
  
  useEffect(() => {
    if (dragCol) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [dragCol, handleDrag, handleDragEnd]);

  // 排序
  const handleSort = (col) => {
    setSortState(s => {
      if (s.field === col) {
        return { field: col, order: s.order === 'asc' ? 'desc' : 'asc' };
      } else {
        return { field: col, order: 'asc' };
      }
    });
  };
  let sortedData = [...filteredData];
  if (sortState.field) {
    sortedData.sort((a, b) => {
      const v1 = a[sortState.field] || '';
      const v2 = b[sortState.field] || '';
      if (v1 === v2) return 0;
      if (sortState.order === 'asc') return v1 > v2 ? 1 : -1;
      return v1 < v2 ? 1 : -1;
    });
  }

  // 批量操作
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(new Set(sortedData.map((_, idx) => idx)));
    } else {
      setSelectedRows(new Set());
    }
  };
  const handleSelectRow = (idx, checked) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(idx);
    } else {
      newSelected.delete(idx);
    }
    setSelectedRows(newSelected);
  };
  const handleBatchDelete = () => {
    if (selectedRows.size === 0) return;
    if (confirm(`确定要删除选中的 ${selectedRows.size} 个工作流吗？`)) {
      // 这里应该调用API删除
      console.log('批量删除:', Array.from(selectedRows).map(idx => sortedData[idx].name));
      showToast(`成功删除 ${selectedRows.size} 个工作流`, 'success');
      setSelectedRows(new Set());
    }
  };
  const handleBatchPublish = () => {
    if (selectedRows.size === 0) return;
    console.log('批量发布:', Array.from(selectedRows).map(idx => sortedData[idx].name));
    showToast(`成功发布 ${selectedRows.size} 个工作流`, 'success');
    setSelectedRows(new Set());
  };
  const handleBatchExport = () => {
    if (selectedRows.size === 0) return;
    const data = Array.from(selectedRows).map(idx => sortedData[idx]);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflows_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`成功导出 ${selectedRows.size} 个工作流`, 'success');
  };

  // 搜索和分页
  const filteredBySearch = sortedData.filter(row => 
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.system.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredBySearch.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const paginatedData = filteredBySearch.slice(startIdx, endIdx);

  // 搜索反馈
  useEffect(() => {
    if (searchTerm.trim() && searchTerm !== lastSearchTerm) {
      const resultCount = filteredBySearch.length;
      if (resultCount === 0) {
        showToast(`未找到包含"${searchTerm}"的工作流`, 'warning');
      } else if (resultCount < sortedData.length) {
        showToast(`找到 ${resultCount} 个包含"${searchTerm}"的工作流`, 'info');
      }
      setLastSearchTerm(searchTerm);
    } else if (!searchTerm.trim() && lastSearchTerm) {
      showToast('已清除搜索条件', 'info');
      setLastSearchTerm('');
    }
  }, [searchTerm, filteredBySearch.length, sortedData.length, lastSearchTerm]);

  // 工具提示处理
  const handleCellMouseEnter = (e, text) => {
    // 只对td本身判断溢出
    let target = e.target;
    // 如果是td内嵌span/div等，向上找td
    while (target && target.nodeName !== 'TD') {
      target = target.parentElement;
    }
    if (!text || !target || target.scrollWidth <= target.clientWidth) return;
    const rect = target.getBoundingClientRect();
    const tooltipWidth = Math.min(300, text.length * 8 + 24); // 估算工具提示宽度
    const tooltipHeight = 40; // 估算工具提示高度
    let x = rect.left + rect.width / 2;
    let y = rect.top - tooltipHeight - 10;
    if (x + tooltipWidth / 2 > window.innerWidth) {
      x = window.innerWidth - tooltipWidth / 2 - 10;
    }
    if (x - tooltipWidth / 2 < 0) {
      x = tooltipWidth / 2 + 10;
    }
    if (y < 0) {
      y = rect.bottom + 10;
    }
    setTooltipPosition({ x, y, visible: true, text });
  };

  const handleCellMouseLeave = () => {
    setTooltipPosition({ x: 0, y: 0, visible: false, text: '' });
  };

  // 表单校验规则
  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/
    },
    desc: {
      required: true,
      minLength: 10,
      maxLength: 200
    },
    stage: {
      required: true
    }
  };

  // 校验单个字段
  const validateField = (field, value) => {
    const rules = validationRules[field];
    if (!rules) return '';

    if (rules.required && !value.trim()) {
      return '此字段为必填项';
    }

    if (value.trim()) {
      if (rules.minLength && value.length < rules.minLength) {
        return `最少需要${rules.minLength}个字符`;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return `最多允许${rules.maxLength}个字符`;
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        if (field === 'name') {
          return '名称只能包含中文、英文、数字、下划线和连字符';
        }
      }
    }

    return '';
  };

  // 实时校验
  const handleFieldChange = (field, value) => {
    setWorkflowDefForm(f => ({...f, [field]: value}));
    
    // 如果字段已被触摸过，进行实时校验
    if (formTouched[field]) {
      const error = validateField(field, value);
      setFormErrors(prev => ({...prev, [field]: error}));
    }
  };

  // 字段失焦时校验
  const handleFieldBlur = (field) => {
    setFormTouched(prev => ({...prev, [field]: true}));
    const value = workflowDefForm[field];
    const error = validateField(field, value);
    setFormErrors(prev => ({...prev, [field]: error}));
  };

  // 提交前校验
  const validateForm = () => {
    const errors = {};
    Object.keys(validationRules).forEach(field => {
      const value = workflowDefForm[field];
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
      }
    });
    
    setFormErrors(errors);
    setFormTouched(Object.keys(validationRules).reduce((acc, field) => ({...acc, [field]: true}), {}));
    
    return Object.keys(errors).length === 0;
  };

  // 重置表单状态
  const resetFormState = () => {
    setFormErrors({});
    setFormTouched({});
    setShowFormGuide(false);
  };

  return (
    <div className="workflow-home">
      {/* 我的收藏入口 */}
      <div className="favorite-bar">
        <span className="favorite-title" onClick={()=>setFavoriteVisible(v=>!v)}>
          我的收藏
          <span className="favorite-arrow">{favoriteVisible ? '▲' : '▼'}</span>
        </span>
        {favoriteVisible && (
          <div className="favorite-list">
            {favoriteList.length === 0 ? (
              <div className="favorite-empty">暂无收藏流程</div>
            ) : favoriteList.map(item => (
              <div className="favorite-item" key={item.name} onClick={()=>navigate(`/workflow/${encodeURIComponent(item.name)}`)}>
                <span className="favorite-item-name">{item.name}</span>
                <span className="favorite-item-meta">{item.system} / {item.stage}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* 最近使用入口 */}
      <div className="recent-bar">
        <span className="recent-title" onClick={()=>setRecentVisible(v=>!v)}>
          最近使用
          <span className="recent-arrow">{recentVisible ? '▲' : '▼'}</span>
        </span>
        {recentVisible && (
          <div className="recent-list">
            {recentList.length === 0 ? (
              <div className="recent-empty">暂无最近访问流程</div>
            ) : recentList.map(item => (
              <div className="recent-item" key={item.name+item.time} onClick={()=>navigate(`/workflow/${encodeURIComponent(item.name)}`)}>
                <span className="recent-item-name">{item.name}</span>
                <span className="recent-item-meta">{item.system} / {item.stage}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* 上半部分：引导流程（含标题、总览、三步） */}
      <GuideSteps />
      {/* 下半部分：工作流列表 */}
      <div className="workflow-list-section">
        <div className="table-header">
          <div className="table-title">
            <h3>工作流列表</h3>
            <span className="table-count">共 {filteredBySearch.length} 条</span>
          </div>
          <div className="table-actions">
            {/* 新建按钮 */}
            <button onClick={handleCreateWorkflow} className="btn btn-primary">
              <span>➕</span> 新建工作流
            </button>
            <button onClick={() => setShowTemplateModal(true)} className="btn btn-secondary">
              <span>📋</span> 从模板创建
            </button>
            {/* 搜索框 */}
            <div className="search-box">
              <input
                type="text"
                placeholder="搜索工作流名称、系统、描述..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
            {/* 批量操作 */}
            {selectedRows.size > 0 && (
              <div className="batch-actions">
                <span className="batch-count">已选择 {selectedRows.size} 项</span>
                <button onClick={handleBatchPublish} className="btn btn-primary">批量发布</button>
                <button onClick={handleBatchExport} className="btn btn-secondary">批量导出</button>
                <button onClick={handleBatchDelete} className="btn btn-danger">批量删除</button>
                <button onClick={() => setSelectedRows(new Set())} className="btn btn-text">取消选择</button>
              </div>
            )}
            {/* 列配置 */}
            <button onClick={() => setShowColumnConfig(true)} className="btn btn-outline">
              <span>⚙️</span> 列配置
            </button>
          </div>
        </div>
        {/* 列配置弹窗 */}
        {showColumnConfig && (
          <div className="modal-mask">
            <div className="modal-content" style={{minWidth:320,maxWidth:360}}>
              <div className="modal-header">
                <span style={{fontWeight:'bold',fontSize:16}}>表格列显示配置</span>
                <button className="modal-close" onClick={()=>setShowColumnConfig(false)}>×</button>
              </div>
              <div className="modal-form-row">
                {allColumns.map(col => (
                  <label key={col.dataIndex} style={{display:'flex',alignItems:'center',marginBottom:8}}>
                    <input
                      type="checkbox"
                      checked={visibleCols.includes(col.dataIndex)}
                      onChange={e => {
                        if (e.target.checked) {
                          setVisibleCols(cols => [...cols, col.dataIndex]);
                        } else {
                          setVisibleCols(cols => cols.filter(c => c !== col.dataIndex));
                        }
                      }}
                      style={{marginRight:8}}
                    />
                    {col.title}
                  </label>
                ))}
              </div>
              <div style={{marginTop:18,textAlign:'right'}}>
                <button className="modal-template-btn" onClick={()=>setShowColumnConfig(false)}>完成</button>
              </div>
            </div>
          </div>
        )}
        {/* 阶段筛选条 */}
        <div className="phase-filter-bar">
          {phaseList.map(phase => (
            <span
              key={phase}
              className={selectedPhase === phase ? "phase-filter-tag active" : "phase-filter-tag"}
              onClick={() => setSelectedPhase(phase)}
            >
              {phase}
            </span>
          ))}
        </div>
        <table className="workflow-table" key={`table-${forceUpdate}`}>
          <thead>
            <tr>
              <th style={{ width: 50, minWidth: 50 }}>
                <input
                  type="checkbox"
                  checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                  onChange={e => handleSelectAll(e.target.checked)}
                />
              </th>
              {columns.map(col => (
                <th
                  key={col.dataIndex}
                  style={{ width: colWidths[col.dataIndex], minWidth: 60, position: 'relative', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span
                      className={['sortable-th', sortState.field === col.dataIndex ? 'active' : ''].join(' ')}
                      onClick={() => handleSort(col.dataIndex)}
                      style={{ cursor: 'pointer', flex: 1 }}
                    >
                      {col.title}
                      {sortState.field === col.dataIndex && (
                        <span className="sort-arrow">{sortState.order === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </span>
                    <div
                      onMouseDown={e => handleDragStart(col.dataIndex, e)}
                      style={{
                        width: '4px',
                        height: '100%',
                        background: '#ccc',
                        cursor: 'col-resize',
                        marginLeft: '8px',
                        position: 'absolute',
                        right: '0px',
                        top: '0px'
                      }}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr key={startIdx + idx} className={selectedRows.has(startIdx + idx) ? 'selected' : ''}>
                <td style={{ width: 50, minWidth: 50 }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(startIdx + idx)}
                    onChange={e => handleSelectRow(startIdx + idx, e.target.checked)}
                  />
                </td>
                {columns.map(col => {
                  if (col.dataIndex === 'name') return (
                    <td 
                      key={col.dataIndex} 
                      style={{ width: colWidths[col.dataIndex], minWidth: 60 }}
                      onMouseEnter={(e) => handleCellMouseEnter(e, row[col.dataIndex])}
                      onMouseLeave={handleCellMouseLeave}
                    >
                      {renderName(row)}
                    </td>
                  );
                  if (col.dataIndex === 'status') return <td key={col.dataIndex} style={{ width: colWidths[col.dataIndex], minWidth: 60 }}>{renderStatus(row.status)}</td>;
                  if (col.dataIndex === 'actions') return <td key={col.dataIndex} style={{ width: colWidths[col.dataIndex], minWidth: 60 }}>{renderActions(row)}</td>;
                  if (col.dataIndex === 'desc') return (
                    <td 
                      key={col.dataIndex} 
                      style={{ width: colWidths[col.dataIndex], minWidth: 60 }}
                      onMouseEnter={(e) => handleCellMouseEnter(e, row[col.dataIndex])}
                      onMouseLeave={handleCellMouseLeave}
                    >
                      {row[col.dataIndex]}
                    </td>
                  );
                  if (col.dataIndex === 'activity') return (
                    <td 
                      key={col.dataIndex} 
                      style={{ width: colWidths[col.dataIndex], minWidth: 60 }}
                      onMouseEnter={(e) => handleCellMouseEnter(e, row[col.dataIndex])}
                      onMouseLeave={handleCellMouseLeave}
                    >
                      {row[col.dataIndex]}
                    </td>
                  );
                  // 为其他可能被缩略的列添加悬停预览
                  if (col.dataIndex === 'system' || col.dataIndex === 'stage') return (
                    <td 
                      key={col.dataIndex} 
                      style={{ width: colWidths[col.dataIndex], minWidth: 60 }}
                      onMouseEnter={(e) => handleCellMouseEnter(e, row[col.dataIndex])}
                      onMouseLeave={handleCellMouseLeave}
                    >
                      {row[col.dataIndex]}
                    </td>
                  );
                  return <td key={col.dataIndex} style={{ width: colWidths[col.dataIndex], minWidth: 60 }}>{row[col.dataIndex]}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* 分页组件 */}
        <div className="pagination">
          <div className="pagination-info">
            第 {startIdx + 1}-{Math.min(endIdx, filteredBySearch.length)} 条，共 {filteredBySearch.length} 条
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="btn btn-outline"
            >
              首页
            </button>
            <button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
              className="btn btn-outline"
            >
              上一页
            </button>
            <span className="page-info">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-outline"
            >
              下一页
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="btn btn-outline"
            >
              末页
            </button>
          </div>
          <div className="page-size">
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
              <option value={5}>5条/页</option>
              <option value={10}>10条/页</option>
              <option value={20}>20条/页</option>
              <option value={50}>50条/页</option>
            </select>
          </div>
        </div>
      </div>
      {/* 模板选择模态框 */}
      {showTemplateModal && (
        <div className="modal-mask">
          <div className="modal-content">
            <div className="modal-header">
              <span style={{fontWeight:'bold',fontSize:18}}>选择流程模板</span>
              <button className="modal-close" onClick={()=>setShowTemplateModal(false)}>×</button>
            </div>
            <div className="modal-tags">
              {templateTags.map(tag => (
                <span key={tag} className={selectedTag===tag?"modal-tag active":"modal-tag"} onClick={()=>setSelectedTag(tag)}>{tag}</span>
              ))}
            </div>
            <div className="modal-template-list">
              {filteredTemplates.map(tpl => (
                <div className="modal-template-card" key={tpl.templateId}>
                  <div className="modal-template-title">{tpl.name}</div>
                  <div className="modal-template-desc">{tpl.description}</div>
                  <div className="modal-template-tags">
                    {tpl.tags.map(tag=>(<span className="modal-template-tag" key={tag}>{tag}</span>))}
                  </div>
                  <div className="modal-template-phases">阶段：{tpl.defaultPhaseList.join(' / ')}</div>
                  <div className="modal-template-models">模型绑定：{tpl.defaultModelBinding.join('、')}</div>
                  <div className="modal-template-actions">
                    <button 
                      className="modal-template-btn preview-btn"
                      onClick={() => {
                        setPreviewTemplate(tpl);
                        setShowTemplatePreview(true);
                      }}
                    >
                      👁️ 预览
                    </button>
                    <button 
                      className="modal-template-btn"
                      onClick={() => {
                        setShowTemplateModal(false);
                        setSelectedTemplate(tpl);
                        setShowBpmnModal(true);
                      }}
                    >
                      使用该模板
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* BPMN建模器弹窗（只负责顶部模板提示，实际建模器内容在App中） */}
      {showBpmnModal && selectedWorkflow && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:8,boxShadow:'0 4px 24px rgba(0,0,0,0.12)',padding:0,minWidth:1200,minHeight:700,position:'relative'}}>
            <div style={{background:'#e3f0ff',color:'#1976d2',fontWeight:500,padding:'8px 24px',borderRadius:'8px 8px 0 0',fontSize:16,marginBottom:8}}>
              编辑工作流「{selectedWorkflow.name}」
            </div>
            <button style={{position:'absolute',top:18,right:32,zIndex:10,background:'none',border:'none',borderRadius:'50%',width:36,height:36,cursor:'pointer',boxShadow:'none',display:'flex',alignItems:'center',justifyContent:'center',padding:0}} onClick={() => {
              setShowBpmnModal(false);
              setSelectedWorkflow(null);
            }}>
              <img src={closeIcon} alt="关闭" style={{width:20,height:20}} />
            </button>
            <div style={{height:'620px',width:'100%'}}>
              <BpmnModeler workflow={selectedWorkflow} />
            </div>
          </div>
        </div>
      )}
      {/* 新建工作流定义面板 */}
      {showWorkflowDefModal && (
        <div className="modal-mask">
          <div className="modal-content" style={{minWidth: 420, maxWidth: 480}}>
            <div className="modal-header">
              <span style={{fontWeight:'bold',fontSize:18}}>新建工作流</span>
              <button className="modal-close" onClick={() => {
                setShowWorkflowDefModal(false);
                resetFormState();
              }}>×</button>
            </div>
            
            {/* 表单引导信息 */}
            <button 
              className="form-guide-toggle"
              onClick={() => setShowFormGuide(!showFormGuide)}
            >
              {showFormGuide ? '隐藏填写指南' : '显示填写指南'}
            </button>
            
            {showFormGuide && (
              <div className="form-guide">
                <h4>📝 填写指南</h4>
                <ul>
                  <li><strong>工作流名称：</strong>2-50个字符，支持中文、英文、数字、下划线和连字符</li>
                  <li><strong>工作流描述：</strong>10-200个字符，详细描述工作流的功能和用途</li>
                  <li><strong>工作流阶段：</strong>选择工作流所属的业务阶段</li>
                </ul>
              </div>
            )}

            {/* 表单验证状态 */}
            {Object.keys(formTouched).length > 0 && (
              <div className={`form-status ${Object.keys(formErrors).length === 0 ? 'valid' : 'invalid'}`}>
                <div className="form-status-icon">
                  {Object.keys(formErrors).length === 0 ? '✓' : '✗'}
                </div>
                <span>
                  {Object.keys(formErrors).length === 0 
                    ? '表单填写正确，可以提交' 
                    : `还有 ${Object.keys(formErrors).length} 个字段需要修正`
                  }
                </span>
              </div>
            )}

            <div className="modal-form-row">
              <label>工作流名称 <span style={{color: '#ff4d4f'}}>*</span></label>
              <input
                value={workflowDefForm.name}
                onChange={e => handleFieldChange('name', e.target.value)}
                onBlur={() => handleFieldBlur('name')}
                placeholder="请输入工作流名称"
                className={`${formTouched.name ? (formErrors.name ? 'form-field-invalid' : 'form-field-valid') : ''}`}
              />
              {formTouched.name && formErrors.name && <div className="form-error">{formErrors.name}</div>}
              {formTouched.name && !formErrors.name && <div className="form-field-hint">✓ 名称格式正确</div>}
              <div className={`char-count ${workflowDefForm.name.length > 40 ? 'warning' : ''} ${workflowDefForm.name.length > 50 ? 'error' : ''}`}>
                {workflowDefForm.name.length}/50
              </div>
            </div>
            
            <div className="modal-form-row">
              <label>工作流信息 <span style={{color: '#ff4d4f'}}>*</span></label>
              <textarea
                value={workflowDefForm.desc}
                onChange={e => handleFieldChange('desc', e.target.value)}
                onBlur={() => handleFieldBlur('desc')}
                placeholder="请输入工作流描述"
                className={`${formTouched.desc ? (formErrors.desc ? 'form-field-invalid' : 'form-field-valid') : ''}`}
              />
              {formTouched.desc && formErrors.desc && <div className="form-error">{formErrors.desc}</div>}
              {formTouched.desc && !formErrors.desc && <div className="form-field-hint">✓ 描述格式正确</div>}
              <div className={`char-count ${workflowDefForm.desc.length > 150 ? 'warning' : ''} ${workflowDefForm.desc.length > 200 ? 'error' : ''}`}>
                {workflowDefForm.desc.length}/200
              </div>
            </div>
            
            <div className="modal-form-row">
              <label>工作流阶段 <span style={{color: '#ff4d4f'}}>*</span></label>
              <select
                value={workflowDefForm.stage}
                onChange={e => handleFieldChange('stage', e.target.value)}
                onBlur={() => handleFieldBlur('stage')}
                className={`${formTouched.stage ? (formErrors.stage ? 'form-field-invalid' : 'form-field-valid') : ''}`}
              >
                <option value="">请选择工作流阶段</option>
                {phaseList.filter(p => p !== '全部').map(phase => (
                  <option key={phase} value={phase}>{phase}</option>
                ))}
              </select>
              {formTouched.stage && formErrors.stage && <div className="form-error">{formErrors.stage}</div>}
              {formTouched.stage && !formErrors.stage && <div className="form-field-hint">✓ 阶段选择正确</div>}
            </div>
            
            <div style={{marginTop: 24, textAlign: 'right'}}>
              <button className="modal-template-btn" style={{marginRight: 12}} onClick={() => {
                setShowWorkflowDefModal(false);
                resetFormState();
              }}>取消</button>
              <button
                className="modal-template-btn"
                onClick={() => {
                  if (validateForm()) {
                    setShowWorkflowDefModal(false);
                    setShowBpmnModal(false);
                    setSelectedTemplate(null);
                    resetFormState();
                    onCreateWorkflow(workflowDefForm);
                  } else {
                    showToast('请检查表单填写是否正确', 'error');
                  }
                }}
                disabled={!workflowDefForm.name.trim() || !workflowDefForm.desc.trim() || !workflowDefForm.stage}
              >确认</button>
            </div>
          </div>
        </div>
      )}

      {/* 发布确认对话框 */}
      {publishConfirm.show && (
        <div className="modal-mask">
          <div className="modal-content" style={{minWidth: 400, maxWidth: 480}}>
            <div className="modal-header">
              <span style={{fontWeight:'bold',fontSize:18}}>发布确认</span>
              <button className="modal-close" onClick={cancelPublish}>×</button>
            </div>
            <div style={{padding: '20px 0'}}>
              <div style={{marginBottom: 16, fontSize: 16, color: '#262626'}}>
                确定要发布工作流吗？
              </div>
              <div style={{background: '#f5f5f5', padding: 16, borderRadius: 6, marginBottom: 16}}>
                <div style={{fontWeight: 500, marginBottom: 8}}>工作流信息：</div>
                <div style={{color: '#666', fontSize: 14}}>
                  <div><strong>名称：</strong>{publishConfirm.workflow?.name}</div>
                  <div><strong>系统：</strong>{publishConfirm.workflow?.system}</div>
                  <div><strong>阶段：</strong>{publishConfirm.workflow?.stage}</div>
                  <div><strong>当前状态：</strong>{publishConfirm.workflow?.status}</div>
                </div>
              </div>
              <div style={{color: '#ff4d4f', fontSize: 14}}>
                ⚠️ 发布后工作流将变为可执行状态，请确认工作流设计已完成。
              </div>
            </div>
            <div style={{marginTop: 24, textAlign: 'right'}}>
              <button className="modal-template-btn" style={{marginRight: 12}} onClick={cancelPublish}>取消</button>
              <button
                className="modal-template-btn"
                style={{background: '#52c41a', color: 'white'}}
                onClick={confirmPublish}
              >确认发布</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast通知容器 */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* 模板预览弹窗 */}
      {showTemplatePreview && previewTemplate && (
        <TemplatePreview 
          template={previewTemplate}
          onClose={() => {
            setShowTemplatePreview(false);
            setPreviewTemplate(null);
          }}
        />
      )}
      
      {/* 工具提示 */}
      {tooltipPosition.visible && (
        <div
          style={{
            position: 'fixed',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            zIndex: 10001,
            pointerEvents: 'none',
            maxWidth: '300px',
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          {tooltipPosition.text}
        </div>
      )}
    </div>
  );
}