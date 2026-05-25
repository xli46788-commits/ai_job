import { request } from './request.js';
export const BASE_URL = 'http://127.0.0.1:8000/api/v1'; 

export const API = {
  // ================= 【公共/学生端常规模块】 =================
  login: (data) => request({ url: '/accounts/login/', method: 'POST', data }),
  register: (data) => request({ url: '/accounts/register/', method: 'POST', data }),
  getUserProfile: () => request({ url: '/accounts/profile/', method: 'GET' }),
  uploadResume: (data) => request({ url: '/resumes/upload/', method: 'POST', data }),
  getResumes: () => request({ url: '/resumes/', method: 'GET' }),
  deleteResume: (id) => request({ url: `/resumes/${id}/`, method: 'DELETE' }),
  polishResumeText: (data) => request({ url: '/resumes/ai_polish/', method: 'POST', data }),
  getJobDetail: (id) => request({ url: `/jobs/${id}/`, method: 'GET' }),
  savePolishedResume: (data) => request({ url: '/resumes/save_polished/', method: 'POST', data }),
  downloadResumeFile: (id) => `${BASE_URL}/resumes/${id}/download/`, 

  // ================= 【🌟 绝杀加固：投递与收藏专用接口矩阵 🌟】 =================
  getMatchResults: () => request({ url: '/matching/results/', method: 'GET' }),
  batchMatchJobs: (data) => request({ url: '/matching/results/batch_match/', method: 'POST', data }),
  
  // 1. 投递控制链
  applyForJob: (data) => request({ url: '/jobs/applications/', method: 'POST', data }),
  getDeliveries: () => request({ url: '/jobs/applications/', method: 'GET' }), 
  deleteDelivery: (jobId) => request({ url: '/jobs/applications/cancel_apply/', method: 'POST', data: { job_id: jobId } }), // 🌟 纠正：走安全无错的专属 Action

  // 2. 收藏控制链
  getFavorites: () => request({ url: '/jobs/favorites/', method: 'GET' }),      
  addFavorite: (data) => request({ url: '/jobs/favorites/', method: 'POST', data }),
  deleteFavorite: (jobId) => request({ url: '/jobs/favorites/cancel_favorite/', method: 'POST', data: { job_id: jobId } }), // 🌟 纠正：走安全无错的专属 Action
  
  mockInterview: (data) => request({ url: '/matching/mock_interview/', method: 'POST', data }),
  getPointRecords: () => request({ url: '/accounts/point-records/', method: 'GET' }),
  getCommunityPosts: (params) => request({ url: '/community/posts/', method: 'GET', data: params }),
  getRechargeOptions: () => request({ url: '/accounts/recharge-packages/', method: 'GET' }),
  rechargePoints: (data) => request({ url: '/accounts/point-records/recharge/', method: 'POST', data }),

  // ================= 【企业与管理后台】 =================
  postJob: (data) => request({ url: '/jobs/', method: 'POST', data }),
  getCompanyJobs: () => request({ url: '/jobs/', method: 'GET' }),
  updateJob: (id, data) => request({ url: `/jobs/${id}/`, method: 'PATCH', data }),
  analyzeJobDescription: (data) => request({ url: '/jobs/analyze/', method: 'POST', data }),
  getCompanyDeliveries: () => request({ url: '/jobs/applications/', method: 'GET' }),
  updateDeliveryStatus: (applicationId, data) => request({ url: `/jobs/applications/${applicationId}/`, method: 'PATCH', data }),
  getEnterpriseStats: () => request({ url: '/jobs/stats/', method: 'GET' }),
  getSystemAnalytics: () => request({ url: '/accounts/admin/analytics/', method: 'GET' }),
  getAuditList: () => request({ url: '/accounts/admin/audit/list/', method: 'GET' }),
  handleAuditAction: (data) => request({ url: '/accounts/admin/audit/action/', method: 'POST', data }), 
  getAdminUsers: () => request({ url: '/accounts/admin/users/list/', method: 'GET' }),
  handleUserStatus: (data) => request({ url: '/accounts/admin/users/status/', method: 'POST', data })
};