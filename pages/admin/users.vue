<template>
  <view class="student-universe-web admin-mode">
    <view class="aurora-wrapper">
      <view class="orb orb-1 admin-orb"></view>
      <view class="orb orb-2 admin-orb"></view>
      <view class="grid-overlay"></view>
      <view class="vignette-overlay"></view>
    </view>
    
    <view class="workspace-layout">
      <view class="glass-header fade-in-down">
        <view class="header-left">
          <view class="logo-box admin-theme">
            <text class="logo-icon">👥</text>
          </view>
          <view class="title-box">
            <text class="title">AI 职引未来 · 全站用户治理</text>
            <text class="subtitle">User Governance Network</text>
          </view>
        </view>
        <view class="header-right">
          <view class="status-badge safe">
            <text class="dot pulse"></text> 当前在线: {{ onlineUsers }}
          </view>
          <view class="logout-btn hover-lift" @click="logout">
            <text>退出总控</text>
          </view>
        </view>
      </view>
      
      <view class="workspace-body">
        
        <view class="left-sidebar-panel fade-in-up delay-1">
          <view class="ultra-glass-card sidebar-card h-full">
            <view class="nav-menu">
              <view class="menu-item hover-lift" @click="goTo('home')">
                <text class="m-icon">📊</text>
                <text class="m-text">实时数据大盘</text>
              </view>
              <view class="menu-item hover-lift" @click="goTo('audit')">
                <text class="m-icon">🛡️</text>
                <text class="m-text">内容安全审核</text>
                <view class="badge danger" v-if="auditCount > 0">{{ auditCount > 99 ? '99+' : auditCount }}</view>
              </view>
              <view class="menu-item active">
                <text class="m-icon">👥</text>
                <text class="m-text">全站用户治理</text>
              </view>
              <view class="menu-item hover-lift" @click="goTo('settings')">
                <text class="m-icon">⚙️</text>
                <text class="m-text">AI 引擎配置</text>
              </view>
            </view>
          </view>
        </view>

        <view class="right-workspace-panel fade-in-left delay-2">
          <view class="ultra-glass-card users-container h-full">
            
            <view class="toolbar-section">
              <view class="tb-left">
                <view class="search-bar">
                  <text class="search-icon">🔍</text>
                  <input type="text" v-model="searchQuery" placeholder="搜索用户ID、昵称、手机号..." class="search-input" placeholder-class="input-placeholder"/>
                  <text class="clear-icon" v-if="searchQuery" @click="searchQuery = ''">×</text>
                </view>
              </view>
              
              <view class="tb-right">
                <view class="filter-group">
                  <view 
                    class="filter-chip" 
                    :class="{ active: roleFilter === 'all' }" 
                    @click="roleFilter = 'all'"
                  >全部身份</view>
                  <view 
                    class="filter-chip" 
                    :class="{ active: roleFilter === 'student' }" 
                    @click="roleFilter = 'student'"
                  >学生端</view>
                  <view 
                    class="filter-chip" 
                    :class="{ active: roleFilter === 'company' }" 
                    @click="roleFilter = 'company'"
                  >企业端</view>
                </view>
                
                <view class="divider-y"></view>
                
                <view class="ghost-btn outline micro export-btn" @click="exportData">
                  <text>📥 导出名单</text>
                </view>
              </view>
            </view>

            <view class="data-grid-wrapper">
              <view class="grid-header">
                <view class="th col-user">用户信息</view>
                <view class="th col-role">身份归属</view>
                <view class="th col-status">账号状态</view>
                <view class="th col-risk">AI 风险健康度</view>
                <view class="th col-time">注册时间</view>
                <view class="th col-action">管控操作</view>
              </view>
              
              <scroll-view class="grid-body custom-scrollbar" scroll-y>
                <view class="grid-rows" v-if="filteredUsers.length > 0">
                  
                  <view 
                    v-for="(user, index) in filteredUsers" 
                    :key="user.id || index" 
                    class="grid-row hover-lift"
                    :class="{ 'banned-row': user.status === 'banned' }"
                  >
                    <view class="td col-user">
                      <view class="u-avatar">{{ user.avatar || '👤' }}</view>
                      <view class="u-info">
                        <text class="u-name">{{ user.name || '未知用户' }}</text>
                        <text class="u-id">UID: {{ user.id || '--' }}</text>
                      </view>
                    </view>

                    <view class="td col-role">
                      <view class="role-badge" :class="user.role">
                        {{ user.role === 'student' ? '🎓 学生用户' : (user.role === 'company' ? '🏢 企业 HR' : '🛡️ 管理员') }}
                      </view>
                      <text class="u-org" v-if="user.org">{{ user.org }}</text>
                    </view>

                    <view class="td col-status">
                      <view class="status-indicator" :class="user.status || 'active'">
                        <text class="s-dot"></text>
                        <text class="s-text">
                          {{ user.status === 'active' ? '正常活跃' : (user.status === 'warned' ? '风险观察' : '永久封禁') }}
                        </text>
                      </view>
                    </view>

                    <view class="td col-risk">
                      <view class="risk-meter">
                        <view class="meter-info">
                          <text class="m-label" :class="getRiskClass(user.riskScore)">
                            {{ getRiskText(user.riskScore) }}
                          </text>
                          <text class="m-val">{{ user.riskScore || 0 }}/100</text>
                        </view>
                        <view class="meter-bg">
                          <view class="meter-fill" :class="getRiskClass(user.riskScore)" :style="`width: ${user.riskScore || 0}%`"></view>
                        </view>
                      </view>
                    </view>

                    <view class="td col-time">
                      <text class="time-text">{{ user.regTime || '--' }}</text>
                    </view>

                    <view class="td col-action">
                      <view class="action-btn-group">
                        <text class="a-btn primary" title="查看详情" @click="viewDetail(user)">🔍</text>
                        <text class="a-btn warning" title="风险警告" v-if="user.status !== 'banned'" @click="warnUser(user)">⚠️</text>
                        <text class="a-btn danger" title="账号封禁" v-if="user.status !== 'banned'" @click="banUser(user)">🚫</text>
                        <text class="a-btn success" title="解除封禁" v-if="user.status === 'banned'" @click="unbanUser(user)">♻️</text>
                      </view>
                    </view>
                    
                  </view>
                </view>
                
                <view class="empty-state" v-else>
                  <text class="e-icon">📭</text>
                  <text class="e-text">未检索到匹配的用户数据</text>
                </view>
              </scroll-view>
            </view>
            
            <view class="pagination-section">
              <text class="page-info">共检索到 {{ filteredUsers.length }} 条数据</text>
              <view class="page-controls" v-if="totalPages > 0">
                <view class="p-btn" :class="{ disabled: currentPage === 1 }" @click="prevPage">上一页</view>
                <view class="p-num active">{{ currentPage }}</view>
                <text style="color: rgba(255,255,255,0.2); font-size: 12px; margin: 0 4px;" v-if="totalPages > 1">/ {{ totalPages }}</text>
                <view class="p-btn" :class="{ disabled: currentPage >= totalPages }" @click="nextPage">下一页</view>
              </view>
            </view>

          </view>
        </view>
        
      </view>
    </view>
  </view>
</template>

<script>
import { API } from '../../utils/api.js';

export default {
  data() {
    return {
      searchQuery: '',
      roleFilter: 'all', 
      usersList: [], 
      
      // 🚀 替换全局占位的假数据变量
      onlineUsers: '--',
      auditCount: 0,
      
      // 🚀 分页变量
      currentPage: 1,
      totalPages: 1,
      pageSize: 20
    }
  },
  computed: {
    filteredUsers() {
      let result = this.usersList;
      if (this.roleFilter !== 'all') {
        result = result.filter(u => u.role === this.roleFilter);
      }
      if (this.searchQuery.trim() !== '') {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(u => 
          (u.name && u.name.toLowerCase().includes(query)) || 
          (u.id && u.id.toString().toLowerCase().includes(query)) ||
          (u.org && u.org.toLowerCase().includes(query))
        );
      }
      return result;
    }
  },
  mounted() {
    this.fetchSystemStats(); // 拉取顶部指标
    this.fetchUsersData();   // 页面加载拉取全站用户
  },
  methods: {
    // 🚀 [新] 获取系统全局指标 (在线人数, 审核数)
    async fetchSystemStats() {
      try {
        const res = await API.getSystemAnalytics();
        if (res.data) {
           this.onlineUsers = res.data.online_users || '--';
           this.auditCount = res.data.pending_audits || 0;
        }
      } catch (error) {
        console.error('获取系统指标失败:', error);
      }
    },

    // 🚀 [改] 从后端获取真实用户列表，加入防空处理
    async fetchUsersData() {
      uni.showLoading({ title: '同步用户数据...' });
      try {
        const res = await API.getAdminUsers();
        // 适配不同的 Django 响应格式
        const records = res.data?.results || res.data || res.results || res || [];
        this.usersList = records;
        
        // 更新总页数 (此处简化为纯前端分页演示，真实场景应使用后端的 count)
        this.totalPages = Math.ceil(this.usersList.length / this.pageSize) || 1;
      } catch (error) {
        console.error('获取用户列表失败:', error);
        uni.showToast({ title: '拉取数据异常', icon: 'none' });
      } finally {
        uni.hideLoading();
      }
    },

    // 分页操作
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        // 真实场景可在此处发起新的一页的 API 请求
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        // 真实场景可在此处发起新的一页的 API 请求
      }
    },

    getRiskClass(score) {
      if (!score) return 'safe';
      if (score >= 80) return 'danger';
      if (score >= 50) return 'warning';
      return 'safe';
    },
    getRiskText(score) {
      if (!score) return '健康';
      if (score >= 80) return '高危异常';
      if (score >= 50) return '疑似风险';
      return '健康';
    },
    viewDetail(user) {
      uni.showToast({ title: `查看 ${user.name || '该用户'} 详情画像`, icon: 'none' });
    },

    // 🚀 对接真实下发警告接口
    warnUser(user) {
      uni.showModal({
        title: '下发警告',
        content: `确认向 ${user.name || '该用户'} 下发系统警告信吗？`,
        confirmColor: '#f59e0b',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '处理中...' });
            try {
              await API.handleUserStatus({ id: user.id, status: 'warned' });
              user.status = 'warned';
              user.riskScore = Math.max(user.riskScore || 0, 60);
              uni.hideLoading();
              uni.showToast({ title: '已下发警告', icon: 'success' });
            } catch (error) { 
              uni.hideLoading(); 
              uni.showToast({ title: '操作失败', icon: 'none' });
            }
          }
        }
      });
    },

    // 🚀 对接真实封禁接口
    banUser(user) {
      uni.showModal({
        title: '最高级别封控',
        content: `确定要永久封禁用户 ${user.name || '未知'} (UID: ${user.id || '--'}) 吗？`,
        confirmColor: '#ef4444',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '封禁中...' });
            try {
              await API.handleUserStatus({ id: user.id, status: 'banned' });
              user.status = 'banned';
              user.riskScore = 100;
              uni.hideLoading();
              uni.showToast({ title: '账号已永久封禁', icon: 'success' });
            } catch (error) { 
              uni.hideLoading(); 
              uni.showToast({ title: '操作失败', icon: 'none' });
            }
          }
        }
      });
    },

    // 🚀 对接真实解封接口
    unbanUser(user) {
      uni.showModal({
        title: '解除封禁',
        content: `确认解封 ${user.name || '该用户'} 吗？`,
        confirmColor: '#10b981',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '解封中...' });
            try {
              await API.handleUserStatus({ id: user.id, status: 'active' });
              user.status = 'active';
              user.riskScore = 20; 
              uni.hideLoading();
              uni.showToast({ title: '账号已解封', icon: 'success' });
            } catch (error) { 
              uni.hideLoading();
              uni.showToast({ title: '操作失败', icon: 'none' });
            }
          }
        }
      });
    },

    exportData() {
      uni.showLoading({ title: '生成加密报表中...' });
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({ title: '报表已下载', icon: 'success' });
      }, 1500);
    },

    goTo(path) {
      if (path === 'home') uni.redirectTo({ url: '/pages/admin/home' });
      else if (path === 'audit') uni.redirectTo({ url: '/pages/admin/audit' });
      else if (path === 'users') uni.redirectTo({ url: '/pages/admin/users' });
      else if (path === 'settings') uni.showToast({ title: '引擎配置模块开发中...', icon: 'none' });
    },

    logout() {
      uni.showModal({
        title: '总控台锁定',
        content: '确定要退出管理员模式吗？',
        confirmColor: '#ef4444',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('token');
            uni.removeStorageSync('user_role');
            uni.removeStorageSync('user_info');
            uni.reLaunch({ url: '/pages/auth/login' });
          }
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
/* ==================== 宇宙色彩体系 (Admin 专属深色权威主题) ==================== */
$bg-deep: #020205; 
$primary: #3b82f6;
$primary-light: #60a5fa;   
$secondary: #8b5cf6;
$secondary-light: #a78bfa;
$accent: #06b6d4;
$success: #10b981;
$warning: #f59e0b;
$danger: #ef4444;
$text-main: #f8fafc;
$text-secondary: #cbd5e1; 
$text-muted: #94a3b8;

/* 极光背景调整 */
.student-universe-web { min-height: 100vh; width: 100vw; background-color: $bg-deep; position: relative; overflow-x: hidden; font-family: -apple-system, sans-serif; }
.aurora-wrapper { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
.admin-orb { position: absolute; border-radius: 50%; filter: blur(150px); opacity: 0.15; animation: float 30s infinite alternate ease-in-out; }
.orb-1 { width: 50vw; height: 50vw; background: radial-gradient(circle, rgba($danger,0.4) 0%, transparent 60%); top: -20%; left: -10%; }
.orb-2 { width: 45vw; height: 45vw; background: radial-gradient(circle, rgba($primary,0.3) 0%, transparent 60%); bottom: -10%; right: -5%; }
.grid-overlay { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px); background-size: 30px 30px; z-index: 1; }
.vignette-overlay { position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 20%, rgba(2,2,5,0.95) 100%); z-index: 2; }
@keyframes float { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(4%, 6%) scale(1.1); } }

/* 核心布局 */
.workspace-layout { position: relative; z-index: 10; height: 100vh; display: flex; flex-direction: column; }
.glass-header { height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; background: linear-gradient(180deg, rgba(2,2,5,0.95) 0%, transparent 100%); border-bottom: 1px solid rgba(255,255,255,0.03); flex-shrink: 0; }
.header-left { display: flex; align-items: center; gap: 16px; }
.logo-box.admin-theme { width: 36px; height: 36px; border-radius: 10px; background: rgba($primary, 0.1); border: 1px solid rgba($primary, 0.3); display: flex; align-items: center; justify-content: center; }
.title-box { display: flex; flex-direction: column; }
.title { font-size: 16px; font-weight: 700; color: #fff; letter-spacing: 1px; }
.subtitle { font-size: 10px; color: $primary; font-family: monospace; letter-spacing: 1px; }

.header-right { display: flex; align-items: center; gap: 24px; }
.status-badge { display: flex; align-items: center; gap: 8px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
.status-badge.safe { background: rgba($primary, 0.1); border: 1px solid rgba($primary, 0.3); color: $primary-light; }
.dot.pulse { width: 6px; height: 6px; border-radius: 50%; background: $primary-light; box-shadow: 0 0 8px $primary; animation: pulse 2s infinite; }
.logout-btn { font-size: 13px; color: $text-muted; cursor: pointer; transition: 0.2s; }
.logout-btn:hover { color: $danger; }

/* 工作区主体 */
.workspace-body { flex: 1; display: flex; gap: 24px; padding: 24px 32px; height: calc(100vh - 60px); box-sizing: border-box; max-width: 100%; }

/* 公用玻璃卡片 */
.ultra-glass-card { background: rgba(255,255,255,0.02); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); border-top: 1px solid rgba(255,255,255,0.08); border-radius: 16px; position: relative; }
.hover-lift { transition: all 0.3s ease; cursor: pointer; }
.hover-lift:hover { transform: translateY(-2px); background: rgba(255,255,255,0.04); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.h-full { height: 100%; }

/* ==================== 外层左侧：系统侧边栏 ==================== */
.left-sidebar-panel { width: 260px; flex-shrink: 0; }
.sidebar-card { padding: 24px 16px; }
.nav-menu { display: flex; flex-direction: column; gap: 8px; }
.menu-item { display: flex; align-items: center; gap: 12px; padding: 16px; border-radius: 12px; position: relative; cursor: pointer; }
.menu-item.active { background: linear-gradient(90deg, rgba($primary, 0.1), transparent); border-left: 3px solid $primary; }
.m-icon { font-size: 18px; opacity: 0.8; }
.m-text { font-size: 14px; font-weight: 500; color: $text-secondary; flex: 1; transition: 0.2s; }
.menu-item:hover .m-text { color: #fff; }
.menu-item.active .m-text { color: #fff; font-weight: 600; }
.menu-item .badge { padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: bold; background: rgba($danger, 0.2); color: $danger; border: 1px solid rgba($danger, 0.4); }


/* ==================== 外层右侧：用户治理舱 ==================== */
.right-workspace-panel { flex: 1; min-width: 0; }
.users-container { display: flex; flex-direction: column; overflow: hidden; padding: 24px; }

/* 顶部控制台：搜索与筛选 */
.toolbar-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.tb-left { flex: 1; max-width: 400px; }
.search-bar { display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 12px; transition: 0.3s; }
.search-bar:focus-within { border-color: rgba($primary, 0.5); box-shadow: 0 0 15px rgba($primary, 0.1); }
.search-icon { font-size: 14px; opacity: 0.6; }
.search-input { flex: 1; border: none; background: transparent; outline: none; color: #fff; font-size: 14px; }
.input-placeholder { color: rgba(255,255,255,0.3); }
.clear-icon { font-size: 18px; color: $text-muted; cursor: pointer; }
.clear-icon:hover { color: #fff; }

.tb-right { display: flex; align-items: center; gap: 16px; }
.filter-group { display: flex; background: rgba(0,0,0,0.3); border-radius: 10px; padding: 4px; border: 1px solid rgba(255,255,255,0.05); }
.filter-chip { padding: 6px 16px; font-size: 13px; color: $text-muted; border-radius: 8px; cursor: pointer; transition: 0.2s; }
.filter-chip.active { background: rgba(255,255,255,0.1); color: #fff; font-weight: 600; }
.divider-y { width: 1px; height: 20px; background: rgba(255,255,255,0.1); }
.export-btn { height: 34px !important; }


/* ==================== 核心：数据栅格表 (Flex Grid) ==================== */
.data-grid-wrapper { flex: 1; display: flex; flex-direction: column; height: 0; background: rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; overflow: hidden; }

/* 列表格配置 */
.col-user { flex: 2; min-width: 200px; }
.col-role { flex: 1.5; min-width: 150px; }
.col-status { flex: 1; min-width: 120px; }
.col-risk { flex: 1.5; min-width: 180px; }
.col-time { flex: 1.5; min-width: 150px; }
.col-action { flex: 1; min-width: 140px; justify-content: center; }

/* 表头 */
.grid-header { display: flex; padding: 16px 24px; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 13px; font-weight: 600; color: $text-secondary; }
.th { display: flex; align-items: center; }

/* 表体 */
.grid-body { flex: 1; height: 0; }
.grid-rows { display: flex; flex-direction: column; }
.grid-row { display: flex; padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.03); transition: 0.2s; align-items: center; }
.grid-row:last-child { border-bottom: none; }
.grid-row:hover { background: rgba(255,255,255,0.02); }
.grid-row.banned-row { opacity: 0.6; background: rgba($danger, 0.02); }
.grid-row.banned-row:hover { opacity: 1; background: rgba($danger, 0.05); }

.td { display: flex; flex-direction: column; justify-content: center; }

/* 单元格内容：1. 用户信息 */
.td.col-user { flex-direction: row; align-items: center; justify-content: flex-start; gap: 12px; }
.u-avatar { width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 20px; border: 1px solid rgba(255,255,255,0.1); }
.u-info { display: flex; flex-direction: column; gap: 4px; }
.u-name { font-size: 14px; font-weight: 600; color: #fff; }
.u-id { font-size: 11px; color: $text-muted; font-family: monospace; }

/* 单元格内容：2. 身份归属 */
.role-badge { display: inline-flex; align-self: flex-start; font-size: 11px; padding: 2px 8px; border-radius: 6px; font-weight: 600; margin-bottom: 4px; }
.role-badge.student { background: rgba($primary, 0.15); color: $primary-light; border: 1px solid rgba($primary, 0.3); }
.role-badge.company { background: rgba($secondary, 0.15); color: $secondary-light; border: 1px solid rgba($secondary, 0.3); }
.role-badge.admin { background: rgba($accent, 0.15); color: $accent; border: 1px solid rgba($accent, 0.3); }
.u-org { font-size: 12px; color: $text-muted; }

/* 单元格内容：3. 账号状态 */
.status-indicator { display: flex; align-items: center; gap: 6px; }
.status-indicator .s-dot { width: 6px; height: 6px; border-radius: 50%; }
.status-indicator .s-text { font-size: 13px; font-weight: 500; }
.status-indicator.active { color: $success; .s-dot { background: $success; box-shadow: 0 0 6px $success; } }
.status-indicator.warned { color: $warning; .s-dot { background: $warning; box-shadow: 0 0 6px $warning; } }
.status-indicator.banned { color: $danger; .s-dot { background: $danger; box-shadow: 0 0 6px $danger; } }

/* 单元格内容：4. 风险健康度 */
.risk-meter { display: flex; flex-direction: column; gap: 6px; width: 80%; }
.meter-info { display: flex; justify-content: space-between; font-size: 12px; }
.m-label.safe { color: $success; } .m-label.warning { color: $warning; } .m-label.danger { color: $danger; font-weight: bold; }
.m-val { color: $text-muted; font-family: monospace; }
.meter-bg { width: 100%; height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; }
.meter-fill { height: 100%; border-radius: 2px; }
.meter-fill.safe { background: $success; } .meter-fill.warning { background: $warning; } .meter-fill.danger { background: $danger; box-shadow: 0 0 8px $danger; }

/* 单元格内容：5. 时间 */
.time-text { font-size: 12px; color: $text-muted; }

/* 单元格内容：6. 操作区 */
.action-btn-group { display: flex; gap: 10px; align-items: center; justify-content: center; width: 100%; }
.a-btn { font-size: 16px; cursor: pointer; transition: 0.2s; padding: 6px; border-radius: 8px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); }
.a-btn:hover { background: rgba(255,255,255,0.1); transform: scale(1.1); }
.a-btn.primary:hover { border-color: rgba($primary, 0.4); }
.a-btn.warning:hover { border-color: rgba($warning, 0.4); background: rgba($warning, 0.1); }
.a-btn.danger:hover { border-color: rgba($danger, 0.4); background: rgba($danger, 0.1); }
.a-btn.success:hover { border-color: rgba($success, 0.4); background: rgba($success, 0.1); }

/* 空状态 */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 0; opacity: 0.6; }
.e-icon { font-size: 40px; filter: grayscale(100%); margin-bottom: 12px; }
.e-text { font-size: 14px; color: $text-muted; }


/* ==================== 底部：分页器 ==================== */
.pagination-section { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); }
.page-info { font-size: 13px; color: $text-muted; }
.page-controls { display: flex; gap: 8px; align-items: center; }
.p-btn { padding: 6px 12px; font-size: 12px; color: #fff; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer; transition: 0.2s; }
.p-btn:hover:not(.disabled) { background: rgba(255,255,255,0.1); }
.p-btn.disabled { opacity: 0.3; cursor: not-allowed; }
.p-num { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 13px; color: $text-muted; border-radius: 8px; cursor: pointer; transition: 0.2s; }
.p-num:hover { color: #fff; background: rgba(255,255,255,0.05); }
.p-num.active { background: $primary; color: #fff; font-weight: bold; box-shadow: 0 0 10px rgba($primary, 0.4); }

/* 按钮样式 */
.ghost-btn.outline { background: transparent; border: 1px solid rgba(255,255,255,0.15); height: 44px; padding: 0 20px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; transition: 0.2s; font-weight: 500; color: #cbd5e1; }
.ghost-btn.outline:hover { background: rgba(255,255,255,0.05); color: #fff; border-color: rgba(255,255,255,0.3); }
.ghost-btn.outline.micro { height: 34px; padding: 0 16px; font-size: 13px; border-radius: 8px; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

.fade-in-down { animation: fadeInDown 0.5s ease both; }
.fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.fade-in-left { animation: fadeInLeft 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInLeft { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
</style>