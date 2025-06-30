import { useState } from 'react';
import BpmnModeler from './BpmnModeler.jsx';
import { initialNodes } from './workflowData';
import './App.css';
import WorkflowHome from './WorkflowHome.jsx';
import './WorkflowHome.css';
import closeIcon from './assets/close.png';

// 针对"链接需求服务"节点的属性卡片
function RestConnectorProperties({ element }) {
  const [isLinking, setIsLinking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Camunda风格分组，字段更贴近真实属性
  const bo = element;
  
  // 处理链接按钮点击
  const handleLinkClick = () => {
    setIsLinking(true);
    // 模拟链接过程
    setTimeout(() => {
      setIsLinking(false);
      setShowSuccess(true);
      // 3秒后隐藏成功提示
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div style={{padding: 0, fontFamily: 'Inter, Arial, sans-serif', fontSize: 14, background: '#fff', position: 'relative'}}>
      {/* 标题栏 */}
      <div style={{padding: '16px 20px 8px 20px', borderBottom: '1px solid #eee', background: '#f7f8fa'}}>
        <div style={{fontWeight:'bold',fontSize:17,marginBottom:2}}>REST Outbound Connector</div>
        <div style={{color:'#888',fontSize:13}}>{bo.name || '链接需求服务'}</div>
      </div>
      {/* General 分组 */}
      <div style={{padding: '16px 20px 8px 20px', borderBottom:'1px solid #eee'}}>
        <div style={{fontWeight:'bold',marginBottom:8}}>General</div>
        <div style={{marginBottom:6}}>
          <div style={{fontSize:13, color:'#222'}}>Name</div>
          <input style={{width:'100%',marginBottom:4}} value={bo.name||''} readOnly />
        </div>
        <div>
          <div style={{fontSize:13, color:'#222'}}>ID</div>
          <input style={{width:'100%'}} value={bo.id||''} readOnly />
        </div>
      </div>
      {/* Template 分组 */}
      <div style={{padding: '16px 20px 8px 20px', borderBottom:'1px solid #eee'}}>
        <div style={{fontWeight:'bold',marginBottom:8}}>Template <span style={{color:'#1976d2',fontWeight:'normal',fontSize:12}}>Applied</span></div>
        <div style={{fontSize:13}}>Name: <span style={{color:'#333'}}>REST Outbound Connector</span></div>
        <div style={{fontSize:13}}>Version: <span style={{color:'#333'}}>10</span></div>
        <div style={{fontSize:13}}>Description: <span style={{color:'#333'}}>Invoke REST API</span></div>
      </div>
      {/* Authentication 分组 */}
      <div style={{padding: '16px 20px 8px 20px', borderBottom:'1px solid #eee'}}>
        <div style={{fontWeight:'bold',marginBottom:8}}>Authentication</div>
        <div style={{fontSize:13, color:'#222'}}>Type</div>
        <select style={{width:'100%',marginBottom:4}} value="None" disabled>
          <option>None</option>
        </select>
        <div style={{fontSize:12,color:'#222'}}>Choose the authentication type. Select 'None' if no authentication is necessary</div>
      </div>
      {/* HTTP endpoint 分组 */}
      <div style={{padding: '16px 20px 8px 20px', borderBottom:'1px solid #eee'}}>
        <div style={{fontWeight:'bold',marginBottom:8}}>HTTP endpoint</div>
        <div style={{fontSize:13, color:'#222'}}>Method</div>
        <select style={{width:'100%',marginBottom:4}} value={bo.method||'GET'} disabled>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
        <div style={{fontSize:13, color:'#222'}}>URL <span style={{color:'red'}}>*</span></div>
        <input style={{width:'100%',marginBottom:4,borderColor:'#ccc'}} value={bo.url||''} placeholder="URL must not be empty." readOnly />
        <div style={{fontSize:12,color:'#222'}}>URL must not be empty.</div>
      </div>
      
      {/* 链接按钮区域 */}
      <div style={{padding: '16px 20px', borderTop: '1px solid #eee', background: '#fafafa'}}>
        <button
          onClick={handleLinkClick}
          disabled={isLinking}
          style={{
            background: isLinking ? '#ccc' : '#1890ff',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: isLinking ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isLinking ? (
            <>
              <div style={{
                width: '12px',
                height: '12px',
                border: '2px solid #fff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              链接中...
            </>
          ) : (
            '链接'
          )}
        </button>
      </div>
      
      {/* 成功提示 */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#52c41a',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideIn 0.3s ease'
        }}>
          <span style={{fontSize: '16px'}}>✓</span>
          <span>链接成功</span>
        </div>
      )}
      
      {/* 添加CSS动画 */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// 需求创建节点配置组件
function RequirementCreationProperties({ element }) {
  const [activeTab, setActiveTab] = useState('import'); // 'import' | 'create'
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPolarionModal, setShowPolarionModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRequirement, setNewRequirement] = useState({
    title: '',
    description: '',
    priority: 'medium',
    type: 'functional',
    assignee: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 模拟Polarion工作项数据
  const polarionItems = [
    {
      id: 'REQ-001',
      title: '系统应支持用户登录功能',
      type: 'Functional',
      priority: 'High',
      status: 'In Progress',
      assignee: '张三',
      created: '2024-01-15',
      description: '用户应能够通过用户名和密码登录系统，系统应验证用户身份并授予相应权限。'
    },
    {
      id: 'REQ-002',
      title: '系统应支持数据导出功能',
      type: 'Functional',
      priority: 'Medium',
      status: 'Open',
      assignee: '李四',
      created: '2024-01-16',
      description: '用户应能够将系统中的数据导出为Excel、PDF等格式。'
    },
    {
      id: 'REQ-003',
      title: '系统响应时间应小于2秒',
      type: 'Non-Functional',
      priority: 'High',
      status: 'In Review',
      assignee: '王五',
      created: '2024-01-17',
      description: '系统的主要功能响应时间应控制在2秒以内，确保良好的用户体验。'
    },
    {
      id: 'REQ-004',
      title: '系统应支持多语言',
      type: 'Functional',
      priority: 'Low',
      status: 'Open',
      assignee: '赵六',
      created: '2024-01-18',
      description: '系统界面应支持中文、英文等多种语言切换。'
    },
    {
      id: 'REQ-005',
      title: '系统应支持数据备份',
      type: 'Functional',
      priority: 'High',
      status: 'In Progress',
      assignee: '钱七',
      created: '2024-01-19',
      description: '系统应提供自动和手动数据备份功能，确保数据安全。'
    }
  ];

  // 过滤工作项
  const filteredItems = polarionItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 处理选择工作项
  const handleSelectItem = (item) => {
    if (selectedItems.find(selected => selected.id === item.id)) {
      setSelectedItems(selectedItems.filter(selected => selected.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // 处理载入按钮
  const handleLoadItems = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setShowPolarionModal(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  // 处理新建需求
  const handleCreateRequirement = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setShowCreateModal(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  // 处理在Polarion中打开
  const handleOpenInPolarion = () => {
    setShowPolarionModal(true);
  };

  return (
    <div style={{padding: 0, fontFamily: 'Inter, Arial, sans-serif', fontSize: 14, background: '#fff', position: 'relative'}}>
      {/* 标题栏 */}
      <div style={{padding: '16px 20px 8px 20px', borderBottom: '1px solid #eee', background: '#f7f8fa'}}>
        <div style={{fontWeight:'bold',fontSize:17,marginBottom:2}}>需求创建</div>
        <div style={{color:'#888',fontSize:13}}>{element.name || '需求创建'}</div>
      </div>

      {/* 选项卡 */}
      <div style={{display: 'flex', borderBottom: '1px solid #eee'}}>
        <button
          onClick={() => setActiveTab('import')}
          style={{
            flex: 1,
            padding: '12px 16px',
            border: 'none',
            background: activeTab === 'import' ? '#1890ff' : '#f5f5f5',
            color: activeTab === 'import' ? 'white' : '#666',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          📥 从Polarion导入
        </button>
        <button
          onClick={() => setActiveTab('create')}
          style={{
            flex: 1,
            padding: '12px 16px',
            border: 'none',
            background: activeTab === 'create' ? '#1890ff' : '#f5f5f5',
            color: activeTab === 'create' ? 'white' : '#666',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          ✏️ 在线新建
        </button>
      </div>

      {/* 内容区域 */}
      <div style={{padding: '16px 20px'}}>
        {activeTab === 'import' ? (
          <div>
            <div style={{marginBottom: '16px'}}>
              <input
                type="text"
                placeholder="搜索需求..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div style={{marginBottom: '16px'}}>
              <div style={{fontSize: '12px', color: '#666', marginBottom: '8px'}}>
                已选择 {selectedItems.length} 项
              </div>
              <div style={{maxHeight: '300px', overflowY: 'auto', border: '1px solid #e8e8e8', borderRadius: '4px'}}>
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer',
                      background: selectedItems.find(selected => selected.id === item.id) ? '#e6f7ff' : 'white',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px'}}>
                      <div style={{fontWeight: '500', fontSize: '13px', color: '#1890ff'}}>{item.id}</div>
                      <div style={{
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '11px',
                        background: item.priority === 'High' ? '#ff4d4f' : item.priority === 'Medium' ? '#faad14' : '#52c41a',
                        color: 'white'
                      }}>
                        {item.priority}
                      </div>
                    </div>
                    <div style={{fontSize: '13px', fontWeight: '500', marginBottom: '4px'}}>{item.title}</div>
                    <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>{item.description}</div>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#999'}}>
                      <span>类型: {item.type}</span>
                      <span>状态: {item.status}</span>
                      <span>负责人: {item.assignee}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{display: 'flex', gap: '8px'}}>
              <button
                onClick={handleLoadItems}
                disabled={selectedItems.length === 0 || isLoading}
                style={{
                  background: selectedItems.length === 0 || isLoading ? '#ccc' : '#52c41a',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: selectedItems.length === 0 || isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      border: '2px solid #fff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    载入中...
                  </>
                ) : (
                  '载入选中项'
                )}
              </button>
              <button
                onClick={handleOpenInPolarion}
                style={{
                  background: '#1890ff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                在Polarion中打开
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{marginBottom: '16px'}}>
              <div style={{marginBottom: '8px'}}>
                <label style={{fontSize: '13px', color: '#222', fontWeight: '500'}}>需求标题 *</label>
                <input
                  type="text"
                  value={newRequirement.title}
                  onChange={(e) => setNewRequirement({...newRequirement, title: e.target.value})}
                  placeholder="请输入需求标题"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginTop: '4px'
                  }}
                />
              </div>
              
              <div style={{marginBottom: '8px'}}>
                <label style={{fontSize: '13px', color: '#222', fontWeight: '500'}}>需求描述 *</label>
                <textarea
                  value={newRequirement.description}
                  onChange={(e) => setNewRequirement({...newRequirement, description: e.target.value})}
                  placeholder="请详细描述需求内容"
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginTop: '4px',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{display: 'flex', gap: '12px', marginBottom: '8px'}}>
                <div style={{flex: 1}}>
                  <label style={{fontSize: '13px', color: '#222', fontWeight: '500'}}>优先级</label>
                  <select
                    value={newRequirement.priority}
                    onChange={(e) => setNewRequirement({...newRequirement, priority: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '4px',
                      fontSize: '14px',
                      marginTop: '4px'
                    }}
                  >
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                  </select>
                </div>
                <div style={{flex: 1}}>
                  <label style={{fontSize: '13px', color: '#222', fontWeight: '500'}}>需求类型</label>
                  <select
                    value={newRequirement.type}
                    onChange={(e) => setNewRequirement({...newRequirement, type: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '4px',
                      fontSize: '14px',
                      marginTop: '4px'
                    }}
                  >
                    <option value="functional">功能需求</option>
                    <option value="non-functional">非功能需求</option>
                    <option value="business">业务需求</option>
                  </select>
                </div>
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <label style={{fontSize: '13px', color: '#222', fontWeight: '500'}}>负责人</label>
                <input
                  type="text"
                  value={newRequirement.assignee}
                  onChange={(e) => setNewRequirement({...newRequirement, assignee: e.target.value})}
                  placeholder="请输入负责人姓名"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginTop: '4px'
                  }}
                />
              </div>
            </div>

            <div style={{display: 'flex', gap: '8px'}}>
              <button
                onClick={handleCreateRequirement}
                disabled={!newRequirement.title || !newRequirement.description || isLoading}
                style={{
                  background: !newRequirement.title || !newRequirement.description || isLoading ? '#ccc' : '#52c41a',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: !newRequirement.title || !newRequirement.description || isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      border: '2px solid #fff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    同步中...
                  </>
                ) : (
                  '同步至Polarion'
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Polarion模态框 */}
      {showPolarionModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '1200px',
            height: '80%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{fontWeight: 'bold', fontSize: '18px'}}>Polarion - 需求管理系统</div>
              <button
                onClick={() => setShowPolarionModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{
              flex: 1,
              padding: '24px',
              overflow: 'auto',
              background: '#f5f5f5'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px',
                  padding: '16px',
                  background: '#f0f8ff',
                  borderRadius: '6px',
                  border: '1px solid #91d5ff'
                }}>
                  <div style={{fontSize: '24px'}}>📋</div>
                  <div>
                    <div style={{fontWeight: 'bold', fontSize: '16px', color: '#1890ff'}}>REQ-006</div>
                    <div style={{fontSize: '14px', color: '#666'}}>新创建的需求</div>
                  </div>
                </div>
                
                <div style={{marginBottom: '16px'}}>
                  <div style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '8px'}}>需求标题</div>
                  <div style={{padding: '12px', background: '#fafafa', borderRadius: '4px', fontSize: '14px'}}>
                    {newRequirement.title || '示例需求标题'}
                  </div>
                </div>
                
                <div style={{marginBottom: '16px'}}>
                  <div style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '8px'}}>需求描述</div>
                  <div style={{padding: '12px', background: '#fafafa', borderRadius: '4px', fontSize: '14px', lineHeight: '1.6'}}>
                    {newRequirement.description || '这是一个示例需求描述，详细说明了需求的具体内容和要求。'}
                  </div>
                </div>
                
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'}}>
                  <div>
                    <div style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '8px'}}>优先级</div>
                    <div style={{
                      padding: '8px 12px',
                      background: '#fafafa',
                      borderRadius: '4px',
                      fontSize: '14px',
                      display: 'inline-block',
                      color: newRequirement.priority === 'high' ? '#ff4d4f' : newRequirement.priority === 'medium' ? '#faad14' : '#52c41a'
                    }}>
                      {newRequirement.priority === 'high' ? '高' : newRequirement.priority === 'medium' ? '中' : '低'}
                    </div>
                  </div>
                  <div>
                    <div style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '8px'}}>需求类型</div>
                    <div style={{
                      padding: '8px 12px',
                      background: '#fafafa',
                      borderRadius: '4px',
                      fontSize: '14px',
                      display: 'inline-block'
                    }}>
                      {newRequirement.type === 'functional' ? '功能需求' : newRequirement.type === 'non-functional' ? '非功能需求' : '业务需求'}
                    </div>
                  </div>
                  <div>
                    <div style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '8px'}}>负责人</div>
                    <div style={{
                      padding: '8px 12px',
                      background: '#fafafa',
                      borderRadius: '4px',
                      fontSize: '14px',
                      display: 'inline-block'
                    }}>
                      {newRequirement.assignee || '待分配'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 成功提示 */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#52c41a',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideIn 0.3s ease'
        }}>
          <span style={{fontSize: '16px'}}>✓</span>
          <span>{activeTab === 'import' ? '需求载入成功' : '需求创建成功'}</span>
        </div>
      )}
    </div>
  );
}

function App() {
  // 状态：当前显示的主节点id（null为主流程）
  const [showSubProcessOf, setShowSubProcessOf] = useState(null);
  // 状态：当前选中的节点（主节点或子节点）
  const [selectedNode, setSelectedNode] = useState(null);
  // 新增：控制BPMN建模器弹窗显示
  const [showBpmnModal, setShowBpmnModal] = useState(false);
  // 新增：保存新建工作流定义信息
  const [workflowDef, setWorkflowDef] = useState(null);

  // 处理BPMN节点点击，兼容 bpmn-js 业务对象
  const handleNodeClick = (element) => {
    const bo = element.businessObject || element;
    console.log('[handleNodeClick] element:', element);
    console.log('[handleNodeClick] bo:', bo);
    // 兼容bpmn-js ModdleElement的类型判断
    const isServiceTask = (bo.$type === 'bpmn:ServiceTask' || bo.type === 'bpmn:serviceTask' || (typeof bo.$instanceOf === 'function' && bo.$instanceOf('bpmn:ServiceTask')));
    const isTask = (bo.$type === 'bpmn:Task' || bo.type === 'bpmn:task' || (typeof bo.$instanceOf === 'function' && bo.$instanceOf('bpmn:Task')));
    // 专属配置：链接需求服务
    if (
      isServiceTask &&
      (bo.name === '链接需求服务' || bo.id === 'Activity_1450w8g')
    ) {
      setSelectedNode({ type: 'bpmn:serviceTask', node: bo });
      return;
    }
    // 专属配置：需求同步
    if (
      isServiceTask &&
      (bo.name === '需求同步' || bo.name === '同步需求')
    ) {
      setSelectedNode({ type: 'bpmn:serviceTask', node: bo });
      return;
    }
    // 专属配置：需求创建
    if (
      isTask &&
      (bo.name === '需求创建' || bo.id === 'Activity_0g4gw4o')
    ) {
      setSelectedNode({ type: 'bpmn:task', node: bo });
      return;
    }
    // 其它 BPMN 节点通用处理
    if ((bo.$type || bo.type) && bo.id) {
      setSelectedNode({ type: (bo.$type || bo.type).replace('bpmn:', 'bpmn:'), node: bo });
      return;
    }
    // 兼容旧数据结构
    if (!showSubProcessOf) {
      const node = initialNodes.find(n => n.id === element.id);
      if (node) setSelectedNode({ type: 'main', node });
    } else {
      const main = initialNodes.find(n => n.id === showSubProcessOf);
      if (main) {
        const sub = (main.data.subNodes || []).find(sn => sn.id === element.id);
        if (sub) setSelectedNode({ type: 'sub', node: sub, main });
      }
    }
  };

  // 处理BPMN节点双击
  const handleNodeDoubleClick = (element) => {
    if (!showSubProcessOf) {
      // 主流程：双击主节点，切换到子流程
      const node = initialNodes.find(n => n.id === element.id);
      if (node && node.data && node.data.subNodes) {
        setShowSubProcessOf(node.id);
        setSelectedNode(null);
      }
    } else {
      // 子流程：双击无操作
    }
  };

  // 返回主流程
  const handleBack = () => {
    setShowSubProcessOf(null);
    setSelectedNode(null);
  };

  // 属性面板内容
  let panelContent = <div style={{padding: 16, color: '#222'}}>请选择主节点或子节点</div>;
  if (selectedNode) {
    console.log('[属性面板] selectedNode:', selectedNode);
    // 针对 BPMN 画布节点，按类型弹出不同配置卡片
    const bo = selectedNode.node;
    if (selectedNode.type === 'bpmn:serviceTask') {
      // 针对"链接需求服务"节点展示专属配置，其它服务任务展示通用卡片
      if (bo.name === '链接需求服务' || bo.id === 'Activity_1450w8g') {
        panelContent = <RestConnectorProperties element={bo} />;
      } else if (bo.name === '需求同步' || bo.name === '同步需求') {
        // 新增：BPMN画布点击需求同步节点时弹出专属配置
        panelContent = <SyncRequirementConfig />;
      } else {
        panelContent = (
          <div style={{padding: 20}}>
            <div style={{fontWeight:'bold',fontSize:16,marginBottom:8}}>服务任务</div>
            <div style={{marginBottom:8}}>名称：<input style={{width:'80%'}} value={bo.name||''} readOnly /></div>
            <div style={{marginBottom:8}}>ID：<input style={{width:'80%'}} value={bo.id||''} readOnly /></div>
          </div>
        );
      }
    } else if (selectedNode.type === 'bpmn:task') {
      // 针对"需求创建"节点展示专属配置，其它任务展示通用卡片
      if (bo.name === '需求创建' || bo.id === 'Activity_0g4gw4o') {
        panelContent = <RequirementCreationProperties element={bo} />;
      } else {
        panelContent = (
          <div style={{padding: 20}}>
            <div style={{fontWeight:'bold',fontSize:16,marginBottom:8}}>任务</div>
            <div style={{marginBottom:8}}>名称：<input style={{width:'80%'}} value={bo.name||''} readOnly /></div>
            <div style={{marginBottom:8}}>ID：<input style={{width:'80%'}} value={bo.id||''} readOnly /></div>
          </div>
        );
      }
    } else if (bo.$type === 'bpmn:UserTask' || bo.type === 'bpmn:UserTask') {
      panelContent = (
        <div style={{padding: 20}}>
          <div style={{fontWeight:'bold',fontSize:16,marginBottom:8}}>用户任务</div>
          <div style={{marginBottom:8}}>名称：<input style={{width:'80%'}} value={bo.name||''} readOnly /></div>
          <div style={{marginBottom:8}}>ID：<input style={{width:'80%'}} value={bo.id||''} readOnly /></div>
          <div style={{marginBottom:8}}>Assignee：<input style={{width:'80%'}} value={bo.assignee||''} readOnly /></div>
        </div>
      );
    } else if (bo.$type === 'bpmn:StartEvent' || bo.type === 'bpmn:StartEvent') {
      panelContent = (
        <div style={{padding: 20}}>
          <div style={{fontWeight:'bold',fontSize:16,marginBottom:8}}>开始事件</div>
          <div style={{marginBottom:8}}>名称：<input style={{width:'80%'}} value={bo.name||''} readOnly /></div>
          <div style={{marginBottom:8}}>ID：<input style={{width:'80%'}} value={bo.id||''} readOnly /></div>
        </div>
      );
    } else if (bo.$type === 'bpmn:EndEvent' || bo.type === 'bpmn:EndEvent') {
      panelContent = (
        <div style={{padding: 20}}>
          <div style={{fontWeight:'bold',fontSize:16,marginBottom:8}}>结束事件</div>
          <div style={{marginBottom:8}}>名称：<input style={{width:'80%'}} value={bo.name||''} readOnly /></div>
          <div style={{marginBottom:8}}>ID：<input style={{width:'80%'}} value={bo.id||''} readOnly /></div>
        </div>
      );
    } else if (bo.$type === 'bpmn:SubProcess' || bo.type === 'bpmn:SubProcess') {
      panelContent = (
        <div style={{padding: 20}}>
          <div style={{fontWeight:'bold',fontSize:16,marginBottom:8}}>子流程</div>
          <div style={{marginBottom:8}}>名称：<input style={{width:'80%'}} value={bo.name||''} readOnly /></div>
          <div style={{marginBottom:8}}>ID：<input style={{width:'80%'}} value={bo.id||''} readOnly /></div>
        </div>
      );
    } else if (selectedNode.type === 'main') {
      const n = selectedNode.node;
      // 新增：功能与架构设计主节点专属配置
      if (n.data?.label === '🛠 功能与架构设计') {
        panelContent = (
          <div style={{padding: 20}}>
            <div style={{fontWeight:'bold',fontSize:18,marginBottom:8}}>功能与架构设计配置</div>
            <div style={{marginBottom:8}}>此处可配置架构设计相关参数、说明等内容。</div>
            <div style={{marginBottom:8}}>主节点ID：<input style={{width:'80%'}} value={n.id||''} readOnly /></div>
          </div>
        );
      } else {
        panelContent = (
          <div style={{padding: 16}}>
            <h3>{n.data?.label || n.name}</h3>
            <div>主节点ID: {n.id}</div>
          </div>
        );
      }
    } else if (selectedNode.type === 'sub') {
      const sn = selectedNode.node;
      // 修正：支持'需求同步'和'同步需求'都弹出配置
      if (sn.label === '同步需求' || sn.label === '需求同步') {
        panelContent = <SyncRequirementConfig />;
      } else {
        panelContent = (
          <div style={{padding: 16}}>
            <h3>{sn.label || sn.name}</h3>
            <div>子节点ID: {sn.id}</div>
          </div>
        );
      }
    }
  }

  // 新建工作流按钮回调
  const handleCreateWorkflow = (def) => {
    setWorkflowDef(def || null);
    setShowBpmnModal(true);
  };
  // 关闭建模器弹窗
  const handleCloseBpmnModal = () => {
    setShowBpmnModal(false);
    setShowSubProcessOf(null);
    setSelectedNode(null);
    setWorkflowDef(null);
  };

  // 首页内容
  return (
    <div>
      <WorkflowHome onCreateWorkflow={handleCreateWorkflow} />
      {/* BPMN建模器弹窗 */}
      {showBpmnModal && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:8,boxShadow:'0 4px 24px rgba(0,0,0,0.12)',padding:0,minWidth:1200,minHeight:700,position:'relative'}}>
            {/* 新建工作流定义信息提示 */}
            {workflowDef && (
              <div style={{background:'#e3f0ff',color:'#1976d2',fontWeight:500,padding:'8px 24px',borderRadius:'8px 8px 0 0',fontSize:16,marginBottom:8}}>
                新建工作流：{workflowDef.name}（阶段：{workflowDef.stage}）
              </div>
            )}
            <button style={{position:'absolute',top:18,right:32,zIndex:10,background:'none',border:'none',borderRadius:'50%',width:36,height:36,cursor:'pointer',boxShadow:'none',display:'flex',alignItems:'center',justifyContent:'center',padding:0}} onClick={handleCloseBpmnModal}>
              <img src={closeIcon} alt="关闭" style={{width:20,height:20}} />
            </button>
            <div className="bpmn-main-area" style={{height:'680px'}}>
              <div className="bpmn-canvas-area">
                <BpmnModeler
                  showSubProcessOf={showSubProcessOf}
                  onNodeClick={handleNodeClick}
                  onNodeDoubleClick={handleNodeDoubleClick}
                />
              </div>
              <div className="bpmn-properties-panel">
                {panelContent}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 新增：同步需求节点配置组件
function SyncRequirementConfig() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // 假数据
  const [source, setSource] = useState('Polarion');
  const [syncId, setSyncId] = useState('REQ-101');
  const [syncType, setSyncType] = useState('全量同步');
  const [owner, setOwner] = useState('张三');
  const [remark, setRemark] = useState('');

  const sourceOptions = [
    { value: 'Polarion', label: 'Polarion' },
    { value: 'Doors', label: 'Doors' }
  ];
  const syncTypeOptions = [
    { value: '全量同步', label: '全量同步' },
    { value: '增量同步', label: '增量同步' },
    { value: '手动选择', label: '手动选择' }
  ];
  const idOptions = source === 'Polarion'
    ? [
        { value: 'REQ-101', label: '动力电池包需求' },
        { value: 'REQ-102', label: '整车热管理需求' },
        { value: 'REQ-104', label: '整车能耗需求' },
        { value: 'REQ-105', label: '软件功能需求' },
        { value: 'REQ-107', label: '整车安全等级' }
      ]
    : [
        { value: 'REQ-103', label: '高压安全需求' },
        { value: 'REQ-106', label: '硬件接口需求' },
        { value: 'REQ-108', label: '诊断功能需求' }
      ];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 1200);
  };

  return (
    <div style={{padding: 0, fontFamily: 'Inter, Arial, sans-serif', fontSize: 14, background: '#fff', position: 'relative'}}>
      {/* 标题栏 */}
      <div style={{padding: '16px 20px 8px 20px', borderBottom: '1px solid #eee', background: '#f7f8fa'}}>
        <div style={{fontWeight:'bold',fontSize:17,marginBottom:2}}>需求同步</div>
        <div style={{color:'#888',fontSize:13}}>配置需求同步属性</div>
      </div>
      {/* General 分组 */}
      <div style={{padding: '16px 20px 8px 20px', borderBottom:'1px solid #eee'}}>
        <div style={{fontWeight:'bold',marginBottom:8}}>General</div>
        <div style={{marginBottom:6}}>
          <div style={{fontSize:13, color:'#222'}}>需求源</div>
          <select style={{width:'100%',marginBottom:4}} value={source} onChange={e=>setSource(e.target.value)}>
            {sourceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div style={{marginBottom:6}}>
          <div style={{fontSize:13, color:'#222'}}>需求编号</div>
          <select style={{width:'100%',marginBottom:4}} value={syncId} onChange={e=>setSyncId(e.target.value)}>
            {idOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}（{opt.value}）</option>)}
          </select>
        </div>
        <div style={{marginBottom:6}}>
          <div style={{fontSize:13, color:'#222'}}>同步方式</div>
          <select style={{width:'100%',marginBottom:4}} value={syncType} onChange={e=>setSyncType(e.target.value)}>
            {syncTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>
      {/* Owner 分组 */}
      <div style={{padding: '16px 20px 8px 20px', borderBottom:'1px solid #eee'}}>
        <div style={{fontWeight:'bold',marginBottom:8}}>负责人</div>
        <input style={{width:'100%',marginBottom:4}} value={owner} onChange={e=>setOwner(e.target.value)} placeholder="请输入负责人" />
      </div>
      {/* 备注分组 */}
      <div style={{padding: '16px 20px 8px 20px', borderBottom:'1px solid #eee'}}>
        <div style={{fontWeight:'bold',marginBottom:8}}>备注</div>
        <input style={{width:'100%',marginBottom:4}} value={remark} onChange={e=>setRemark(e.target.value)} placeholder="可填写备注" />
      </div>
      {/* 操作按钮区域 */}
      <div style={{padding: '16px 20px', borderTop: '1px solid #eee', background: '#fafafa'}}>
        <button
          onClick={handleSync}
          disabled={isSyncing || !syncId || !owner}
          style={{
            background: isSyncing || !syncId || !owner ? '#ccc' : '#1890ff',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: isSyncing || !syncId || !owner ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isSyncing ? (
            <>
              <div style={{
                width: '12px',
                height: '12px',
                border: '2px solid #fff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              同步中...
            </>
          ) : (
            '同步需求'
          )}
        </button>
      </div>
      {/* 成功提示 */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#52c41a',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideIn 0.3s ease'
        }}>
          <span style={{fontSize: '16px'}}>✓</span>
          <span>需求同步成功</span>
        </div>
      )}
      {/* CSS动画 */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
