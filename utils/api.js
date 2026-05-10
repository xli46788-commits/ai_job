import { request } from './request.js';

export const API = {
  // ================= 【公共/认证模块 Auth】 =================
  login: (data) => request({ url: '/accounts/login/', method: 'POST', data }),
  register: (data) => request({ url: '/accounts/register/', method: 'POST', data }),
  getUserProfile: () => request({ url: '/accounts/profile/', method: 'GET' }),
  rechargePoints: (data) => request({ url: '/accounts/recharge/', method: 'POST', data }),

  // ================= 【学生端模块 Student】 =================
  uploadResume: (data) => request({ url: '/resumes/upload/', method: 'POST', data }),
  getResumes: () => request({ url: '/resumes/', method: 'GET' }),
  deleteResume: (id) => request({ url: `/resumes/${id}/`, method: 'DELETE' }),
  polishResumeText: (data) => request({ url: '/resumes/ai_polish/', method: 'POST', data }),
  
  getMatchResults: () => request({ url: '/matching/results/', method: 'GET' }),
  applyForJob: (data) => request({ url: '/matching/deliveries/', method: 'POST', data }),
  getDeliveries: () => request({ url: '/matching/deliveries/', method: 'GET' }),
  getFavorites: () => request({ url: '/matching/favorites/', method: 'GET' }),
  deleteFavorite: (id) => request({ url: `/matching/favorites/${id}/`, method: 'DELETE' }),
  mockInterview: (data) => request({ url: '/matching/mock_interview/', method: 'POST', data }),
  
  // 社群模块 (暂无后端，留作占位)
  getCommunityPosts: (params) => request({ url: '/community/posts/', method: 'GET', data: params }),

  // ================= 【企业端模块 Company】 =================
  postJob: (data) => request({ url: '/jobs/', method: 'POST', data }),
  getCompanyJobs: () => request({ url: '/jobs/', method: 'GET' }),
  updateJob: (id, data) => request({ url: `/jobs/${id}/`, method: 'PATCH', data }),
  getCompanyDeliveries: () => request({ url: '/matching/deliveries/', method: 'GET' }),
  updateDeliveryStatus: (deliveryId, data) => request({ url: `/matching/deliveries/${deliveryId}/update_status/`, method: 'POST', data }),

  // ================= 【管理员模块 Admin】 =================
  getSystemAnalytics: () => request({ url: '/accounts/admin/analytics/', method: 'GET' }),
  getAuditList: () => request({ url: '/accounts/admin/audit/list/', method: 'GET' }),
  handleAuditAction: (data) => request({ url: '/accounts/admin/audit/action/', method: 'POST', data }), 
  getAdminUsers: () => request({ url: '/accounts/admin/users/list/', method: 'GET' }),
  handleUserStatus: (data) => request({ url: '/accounts/admin/users/status/', method: 'POST', data }) 
};