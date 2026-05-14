import { request } from './request.js';
export const BASE_URL = 'http://127.0.0.1:8000/api/v1'; // 注意：结尾不要带斜杠

export const API = {
  // ================= 【公共/认证模块 Auth】 =================
  login: (data) => request({ url: '/accounts/login/', method: 'POST', data }),
  register: (data) => request({ url: '/accounts/register/', method: 'POST', data }),
  getUserProfile: () => request({ url: '/accounts/profile/', method: 'GET' }),

  // ================= 【学生端模块 Student】 =================
  uploadResume: (data) => request({ url: '/resumes/upload/', method: 'POST', data }),
  getResumes: () => request({ url: '/resumes/', method: 'GET' }),
  deleteResume: (id) => request({ url: `/resumes/${id}/`, method: 'DELETE' }),
  polishResumeText: (data) => request({ url: '/resumes/ai_polish/', method: 'POST', data }),
  getJobDetail: (id) => request({ url: `/jobs/${id}/`, method: 'GET' }),
  
  // 🚀 将匹配相关的接口统一放在这里，并确保每行末尾都有逗号
  getMatchResults: () => request({ url: '/matching/results/', method: 'GET' }),
  batchMatchJobs: (data) => request({ url: '/matching/results/batch_match/', method: 'POST', data }),
  applyForJob: (data) => request({ url: '/jobs/applications/', method: 'POST', data }),
  getDeliveries: () => request({ url: '/matching/deliveries/', method: 'GET' }),
  getFavorites: () => request({ url: '/jobs/favorites/', method: 'GET' }),
  deleteFavorite: (id) => request({ url: `/jobs/favorites/${id}/`, method: 'DELETE' }),
  mockInterview: (data) => request({ url: '/matching/mock_interview/', method: 'POST', data }),
  // 5. 获取积分流水 (路由暂时留着)
    getPointRecords: () => request({ url: '/accounts/point-records/', method: 'GET' }),
  // 社群模块 (暂无后端，留作占位)
  getCommunityPosts: (params) => request({ url: '/community/posts/', method: 'GET', data: params }),

  // 获取积分套餐列表（后端可以建一个专门的配置表，也可以让它返回404，前端会自动用默认的）
    getRechargeOptions: () => request({ url: '/accounts/recharge-packages/', method: 'GET' }),
    
    // 提交充值请求
    rechargePoints: (data) => request({ url: '/accounts/point-records/recharge/', method: 'POST', data }),
  // ================= 【企业端模块 Company】 =================
  postJob: (data) => request({ url: '/jobs/', method: 'POST', data }),
  getCompanyJobs: () => request({ url: '/jobs/', method: 'GET' }),
  updateJob: (id, data) => request({ url: `/jobs/${id}/`, method: 'PATCH', data }),
  analyzeJobDescription: (data) => request({ url: '/jobs/analyze/', method: 'POST', data }),
  // 1. 企业拉取收到的所有简历投递
  getCompanyDeliveries: () => request({ url: '/jobs/applications/', method: 'GET' }),
  
  // 2. 企业更新简历的处理状态（待处理、面试中、已拒绝）
  updateDeliveryStatus: (applicationId, data) => request({ url: `/jobs/applications/${applicationId}/`, method: 'PATCH', data }),
  // 🚀 新增：企业端获取全景统计数据
  getEnterpriseStats: () => request({ url: '/jobs/stats/', method: 'GET' }),
  // ================= 【管理员模块 Admin】 =================
  getSystemAnalytics: () => request({ url: '/accounts/admin/analytics/', method: 'GET' }),
  getAuditList: () => request({ url: '/accounts/admin/audit/list/', method: 'GET' }),
  handleAuditAction: (data) => request({ url: '/accounts/admin/audit/action/', method: 'POST', data }), 
  getAdminUsers: () => request({ url: '/accounts/admin/users/list/', method: 'GET' }),
  handleUserStatus: (data) => request({ url: '/accounts/admin/users/status/', method: 'POST', data })
};