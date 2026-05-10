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
          <view class="logo-box admin-theme"><text class="logo-icon">👁️</text></view>
          <view class="title-box">
            <text class="title">AI 职引未来 · 总控中心</text>
            <text class="subtitle">System Overlord</text>
          </view>
        </view>
        <view class="header-right">
          <view class="status-badge processing">
            <text class="dot pulse"></text> 系统运行状态：健康
          </view>
          <view class="logout-btn hover-lift" @click="logout"><text>退出总控</text></view>
        </view>
      </view>
      
      <view class="workspace-body">
        <view class="left-sidebar-panel fade-in-up delay-1">
          <view class="ultra-glass-card sidebar-card h-full">
            <view class="nav-menu">
              <view class="menu-item active">
                <text class="m-icon">📊</text>
                <text class="m-text">实时数据大盘</text>
              </view>
              <view class="menu-item hover-lift" @click="goTo('audit')">
                <text class="m-icon">🛡️</text>
                <text class="m-text">内容安全审核</text>
                <view class="badge danger">{{ stats.pendingAudit || 12 }}</view>
              </view>
              <view class="menu-item hover-lift" @click="goTo('users')">
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

        <view class="right-dashboard-panel fade-in-left delay-2">
          <scroll-view class="dashboard-scroll custom-scrollbar" scroll-y>
            <view class="dashboard-inner">
              
              <view class="metrics-grid mb-24">
                <view class="ultra-glass-card metric-card">
                  <view class="mc-header">
                    <text class="mc-title">平台总用户数</text>
                    <text class="mc-icon theme-blue">👥</text>
                  </view>
                  <view class="mc-body">
                    <text class="mc-value">{{ stats.totalUsers }}</text>
                    <view class="mc-trend up"><text>↑</text> 实时计算</view>
                  </view>
                </view>
                <view class="ultra-glass-card metric-card">
                  <view class="mc-header">
                    <text class="mc-title">入驻企业数</text>
                    <text class="mc-icon theme-purple">🏢</text>
                  </view>
                  <view class="mc-body">
                    <text class="mc-value">{{ stats.companies }}</text>
                    <view class="mc-trend up"><text>↑</text> 实时计算</view>
                  </view>
                </view>
                <view class="ultra-glass-card metric-card">
                  <view class="mc-header">
                    <text class="mc-title">待审核高危内容</text>
                    <text class="mc-icon theme-red">⚠️</text>
                  </view>
                  <view class="mc-body">
                    <text class="mc-value danger-text">{{ stats.pendingAudit }}</text>
                    <text class="mc-sub">拦截队列积压</text>
                  </view>
                </view>
                <view class="ultra-glass-card metric-card">
                  <view class="mc-header">
                    <text class="mc-title">AI 引擎调用次数</text>
                    <text class="mc-icon theme-cyan">🧠</text>
                  </view>
                  <view class="mc-body">
                    <text class="mc-value">{{ stats.aiCalls }}</text>
                    <view class="mc-trend up"><text>↑</text> 34% 较上周</view>
                  </view>
                </view>
              </view>

              <view class="monitor-grid">
                <view class="ultra-glass-card monitor-card">
                  <view class="card-title-bar">
                    <text class="bar-icon">🚨</text>
                    <text class="bar-title">最新风控拦截预警</text>
                  </view>
                  <view class="alert-list">
                    <view class="alert-item" v-for="(alert, index) in alerts" :key="index">
                      <view class="ai-status">{{ alert.status }}</view>
                      <view class="ai-info">
                        <text class="ai-title">{{ alert.title }}</text>
                        <text class="ai-time">{{ alert.time }} · 自动拦截</text>
                      </view>
                      <view class="ghost-btn outline micro danger-theme" @click="goTo('audit')">去处理</view>
                    </view>
                  </view>
                </view>

                <view class="ultra-glass-card monitor-card">
                  <view class="card-title-bar">
                    <text class="bar-icon">🖥️</text>
                    <text class="bar-title">AI 大模型节点监控</text>
                  </view>
                  <view class="server-list">
                    <view class="server-item">
                      <view class="si-info">
                        <text class="si-name">简历解析引擎 (Node-01)</text>
                        <text class="si-load">负载 45%</text>
                      </view>
                      <view class="progress-bg"><view class="progress-fill" style="width: 45%; background: #10b981;"></view></view>
                    </view>
                    <view class="server-item">
                      <view class="si-info">
                        <text class="si-name">模拟面试语音引擎 (Node-02)</text>
                        <text class="si-load warning">负载 82%</text>
                      </view>
                      <view class="progress-bg"><view class="progress-fill" style="width: 82%; background: #f59e0b;"></view></view>
                    </view>
                  </view>
                </view>
              </view>

            </view>
          </scroll-view>
        </view>
        
      </view>
    </view>
  </view>
</template>

<script>
// 🚀 引入 API
import { API } from '../../utils/api.js';

export default {
  data() {
    return {
      stats: {
        totalUsers: 0,
        companies: 0,
        pendingAudit: 0,
        aiCalls: '0'
      },
      alerts: []
    }
  },
  mounted() {
    this.fetchDashboardData();
  },
  methods: {
    // 🚀 向后端拉取真实统计数据
    async fetchDashboardData() {
      try {
        const res = await API.getSystemAnalytics();
        if (res.data) {
          this.stats = res.data.stats;
          this.alerts = res.data.alerts;
        }
      } catch (error) {
        console.error("获取大盘数据失败", error);
      }
    },
    goTo(path) {
      if (path === 'home') uni.redirectTo({ url: '/pages/admin/home' });
      else if (path === 'audit') uni.redirectTo({ url: '/pages/admin/audit' });
      else if (path === 'users') uni.redirectTo({ url: '/pages/admin/users' });
      else if (path === 'settings') uni.showToast({ title: 'AI引擎配置模块开发中...', icon: 'none' });
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
/* 这里的 CSS 代码请保持与您上一条消息中的完全一致，不需要修改任何样式 */
$bg-deep: #020205; 
$primary: #3b82f6;
$primary-light: #60a5fa;   
$secondary: #8b5cf6;
$accent: #06b6d4;
$success: #10b981;
$warning: #f59e0b;
$danger: #ef4444;
$text-main: #f8fafc;
$text-secondary: #cbd5e1; 
$text-muted: #94a3b8;

.student-universe-web { min-height: 100vh; width: 100vw; background-color: $bg-deep; position: relative; overflow-x: hidden; font-family: -apple-system, sans-serif; }
.aurora-wrapper { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
.admin-orb { position: absolute; border-radius: 50%; filter: blur(150px); opacity: 0.15; animation: float 30s infinite alternate ease-in-out; }
.orb-1 { width: 50vw; height: 50vw; background: radial-gradient(circle, rgba($danger,0.4) 0%, transparent 60%); top: -20%; left: -10%; }
.orb-2 { width: 45vw; height: 45vw; background: radial-gradient(circle, rgba($primary,0.3) 0%, transparent 60%); bottom: -10%; right: -5%; }
.grid-overlay { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px); background-size: 30px 30px; z-index: 1; }
.vignette-overlay { position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 20%, rgba(2,2,5,0.95) 100%); z-index: 2; }
@keyframes float { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(4%, 6%) scale(1.1); } }

.workspace-layout { position: relative; z-index: 10; height: 100vh; display: flex; flex-direction: column; }
.glass-header { height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; background: linear-gradient(180deg, rgba(2,2,5,0.95) 0%, transparent 100%); border-bottom: 1px solid rgba(255,255,255,0.03); flex-shrink: 0; }
.header-left { display: flex; align-items: center; gap: 16px; }
.logo-box.admin-theme { width: 36px; height: 36px; border-radius: 10px; background: rgba($danger, 0.1); border: 1px solid rgba($danger, 0.3); display: flex; align-items: center; justify-content: center; }
.title-box { display: flex; flex-direction: column; }
.title { font-size: 16px; font-weight: 700; color: #fff; letter-spacing: 1px; }
.subtitle { font-size: 10px; color: $danger; font-family: monospace; letter-spacing: 1px; }

.header-right { display: flex; align-items: center; gap: 24px; }
.status-badge { display: flex; align-items: center; gap: 8px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; background: rgba($success, 0.1); border: 1px solid rgba($success, 0.3); color: $success; }
.dot.pulse { width: 6px; height: 6px; border-radius: 50%; background: $success; box-shadow: 0 0 8px $success; animation: pulse 2s infinite; }
.logout-btn { font-size: 13px; color: $text-muted; cursor: pointer; transition: 0.2s; }
.logout-btn:hover { color: $danger; }

.workspace-body { flex: 1; display: flex; gap: 24px; padding: 24px 32px; height: calc(100vh - 60px); box-sizing: border-box; max-width: 100%; }
.ultra-glass-card { background: rgba(255,255,255,0.02); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); border-top: 1px solid rgba(255,255,255,0.08); border-radius: 16px; position: relative; }
.hover-lift { transition: all 0.3s ease; cursor: pointer; }
.hover-lift:hover { transform: translateY(-2px); background: rgba(255,255,255,0.04); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.h-full { height: 100%; }

.left-sidebar-panel { width: 260px; flex-shrink: 0; }
.sidebar-card { padding: 24px 16px; }
.nav-menu { display: flex; flex-direction: column; gap: 8px; }
.menu-item { display: flex; align-items: center; gap: 12px; padding: 16px; border-radius: 12px; position: relative; cursor: pointer;}
.menu-item.active { background: linear-gradient(90deg, rgba($primary, 0.1), transparent); border-left: 3px solid $primary; }
.m-icon { font-size: 18px; opacity: 0.8; }
.m-text { font-size: 14px; font-weight: 500; color: $text-secondary; flex: 1; }
.menu-item.active .m-text { color: #fff; font-weight: 600; }
.menu-item .badge { padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: bold; background: rgba($danger, 0.2); color: $danger; border: 1px solid rgba($danger, 0.4); }

.right-dashboard-panel { flex: 1; min-width: 0; }
.dashboard-scroll { height: 100%; }
.dashboard-inner { padding-right: 16px; padding-bottom: 32px; }
.mb-24 { margin-bottom: 24px; }

.metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.metric-card { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.mc-header { display: flex; justify-content: space-between; align-items: center; }
.mc-title { font-size: 13px; color: $text-muted; }
.mc-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.theme-blue { background: rgba($primary, 0.1); border: 1px solid rgba($primary, 0.2); }
.theme-purple { background: rgba($secondary, 0.1); border: 1px solid rgba($secondary, 0.2); }
.theme-red { background: rgba($danger, 0.1); border: 1px solid rgba($danger, 0.2); }
.theme-cyan { background: rgba($accent, 0.1); border: 1px solid rgba($accent, 0.2); }
.mc-body { display: flex; flex-direction: column; gap: 4px; }
.mc-value { font-size: 28px; font-weight: 800; color: #fff; line-height: 1; }
.danger-text { color: $danger; }
.mc-sub { font-size: 12px; color: $text-muted; margin-top: 4px; }
.mc-trend { font-size: 12px; display: flex; align-items: center; gap: 4px; }
.mc-trend.up { color: $success; }

.monitor-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.monitor-card { padding: 24px; }
.card-title-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 16px; }
.bar-icon { font-size: 18px; }
.bar-title { font-size: 15px; font-weight: 600; color: #fff; }

.alert-list { display: flex; flex-direction: column; gap: 12px; }
.alert-item { display: flex; align-items: center; gap: 16px; padding: 12px; background: rgba(0,0,0,0.2); border-radius: 10px; border-left: 2px solid $danger; }
.ai-status { font-size: 11px; padding: 2px 6px; background: rgba($danger, 0.15); color: $danger; border-radius: 4px; flex-shrink: 0; }
.ai-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.ai-title { font-size: 13px; color: #fff; }
.ai-time { font-size: 11px; color: $text-muted; }

.server-list { display: flex; flex-direction: column; gap: 20px; }
.server-item { display: flex; flex-direction: column; gap: 8px; }
.si-info { display: flex; justify-content: space-between; font-size: 13px; }
.si-name { color: #cbd5e1; }
.si-load { color: $success; font-weight: 600; }
.si-load.warning { color: $warning; }
.progress-bg { width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 3px; }

.ghost-btn.outline { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: #cbd5e1; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
.ghost-btn.outline.micro { height: 28px; padding: 0 12px; font-size: 12px; border-radius: 6px; }
.ghost-btn.outline.danger-theme { border-color: rgba($danger, 0.3); color: $danger; }
.ghost-btn.outline.danger-theme:hover { background: rgba($danger, 0.1); border-color: $danger; }

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