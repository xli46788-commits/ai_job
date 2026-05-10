<template>
  <view class="student-universe-web admin-mode">
    <!-- 极光背景层 (深邃暗红/深蓝交织，凸显风控警示感) -->
    <view class="aurora-wrapper">
      <view class="orb orb-1 admin-orb"></view>
      <view class="orb orb-2 admin-orb"></view>
      <view class="grid-overlay"></view>
      <view class="vignette-overlay"></view>
    </view>
    
    <view class="workspace-layout">
      <!-- 顶部全局导航 -->
      <view class="glass-header fade-in-down">
        <view class="header-left">
          <view class="logo-box admin-theme">
            <text class="logo-icon">🛡️</text>
          </view>
          <view class="title-box">
            <text class="title">AI 职引未来 · 内容审核台</text>
            <text class="subtitle">Security & Audit Center</text>
          </view>
        </view>
        <view class="header-right">
          <view class="status-badge alert">
            <text class="dot pulse"></text> 风控拦截中：12 条高危待办
          </view>
          <view class="logout-btn hover-lift" @click="logout">
            <text>退出总控</text>
          </view>
        </view>
      </view>
      
      <!-- 双舱工作区 -->
      <view class="workspace-body">
        
        <!-- ==================== 外层左侧：系统侧边栏 ==================== -->
        <view class="left-sidebar-panel fade-in-up delay-1">
          <view class="ultra-glass-card sidebar-card h-full">
            <view class="nav-menu">
              <view class="menu-item hover-lift" @click="goTo('home')">
                <text class="m-icon">📊</text>
                <text class="m-text">实时数据大盘</text>
              </view>
              <view class="menu-item active">
                <text class="m-icon">🛡️</text>
                <text class="m-text">内容安全审核</text>
                <view class="badge danger">12</view>
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

        <!-- ==================== 外层右侧：审核工作台 ==================== -->
        <view class="right-workspace-panel fade-in-left delay-2">
          
          <view class="ultra-glass-card audit-container h-full">
            
            <!-- 顶部类型切换标签 -->
            <view class="audit-tabs">
              <view 
                class="tab-item" 
                :class="{ active: activeTab === 'post' }"
                @click="activeTab = 'post'"
              >
                社区动态 (8)
              </view>
              <view 
                class="tab-item" 
                :class="{ active: activeTab === 'jd' }"
                @click="activeTab = 'jd'"
              >
                企业职位 (4)
              </view>
              <view 
                class="tab-item" 
                :class="{ active: activeTab === 'resume' }"
                @click="activeTab = 'resume'"
              >
                在线简历 (0)
              </view>
            </view>

            <!-- 内层分屏布局 -->
            <view class="audit-split-view">
              
              <!-- 内层左侧：任务队列舱 -->
              <view class="queue-panel">
                <view class="queue-header">
                  <text class="q-title">待处理队列</text>
                  <view class="filter-icon">⬇️ 风险等级降序</view>
                </view>
                <scroll-view class="queue-scroll custom-scrollbar" scroll-y>
                  <view class="queue-list">
                    <view 
                      v-for="item in currentQueue" 
                      :key="item.id"
                      class="queue-item"
                      :class="{ 
                        'active': selectedItem && selectedItem.id === item.id,
                        'high-risk': item.riskLevel === 'high',
                        'medium-risk': item.riskLevel === 'medium'
                      }"
                      @click="selectItem(item)"
                    >
                      <view class="qi-header">
                        <text class="qi-type">[{{ item.type }}]</text>
                        <text class="qi-time">{{ item.time }}</text>
                      </view>
                      <text class="qi-title">{{ item.title || item.contentPreview }}</text>
                      <view class="qi-footer">
                        <text class="author">By: {{ item.author }}</text>
                        <view class="risk-badge" :class="item.riskLevel">
                          {{ item.riskLevel === 'high' ? '高危拦截' : '疑似违规' }}
                        </view>
                      </view>
                    </view>
                  </view>
                </scroll-view>
              </view>

              <!-- 内层右侧：审查与判决舱 -->
              <view class="detail-panel">
                
                <!-- 空状态 -->
                <view class="empty-state" v-if="!selectedItem">
                  <text class="e-icon">📋</text>
                  <text class="e-text">请在左侧列表中选择一项进行审核</text>
                </view>

                <!-- 审核详情内容 -->
                <view class="detail-content" v-else>
                  <scroll-view class="detail-scroll custom-scrollbar" scroll-y>
                    <view class="detail-inner">
                      
                      <!-- AI 风控报告 (核心亮点) -->
                      <view class="ai-risk-report" :class="selectedItem.riskLevel">
                        <view class="report-header">
                          <text class="r-icon">🤖</text>
                          <text class="r-title">AI 风控引擎诊断报告</text>
                        </view>
                        <view class="report-body">
                          <text class="reason-label">触发风控规则：</text>
                          <text class="reason-text">{{ selectedItem.aiReason }}</text>
                        </view>
                      </view>

                      <!-- 内容展示区 -->
                      <view class="content-display-box">
                        <view class="author-banner">
                          <view class="ab-left">
                            <view class="ab-avatar">👤</view>
                            <view class="ab-info">
                              <text class="ab-name">{{ selectedItem.author }}</text>
                              <text class="ab-meta">ID: {{ selectedItem.authorId }} · IP属地: 广东</text>
                            </view>
                          </view>
                          <text class="ab-history">历史违规: {{ selectedItem.historyViolations }} 次</text>
                        </view>

                        <view class="post-content-area">
                          <text class="post-title" v-if="selectedItem.title">{{ selectedItem.title }}</text>
                          <text class="post-text" v-html="highlightSuspectText(selectedItem.content, selectedItem.suspectWords)"></text>
                          
                          <view class="post-images" v-if="selectedItem.hasImage">
                            <view class="mock-image risk-image">
                              <text class="img-hint">疑似包含引流二维码</text>
                            </view>
                          </view>
                        </view>
                      </view>

                    </view>
                  </scroll-view>

                  <!-- 底部：判决操作台 -->
                  <view class="action-dock">
                    <view class="action-left">
                      <view class="ghost-btn outline warning-theme" @click="banUser">
                        <text>🚫 封禁账号</text>
                      </view>
                    </view>
                    <view class="action-right">
                      <view class="ghost-btn outline success-theme" @click="approveItem">
                        <text>✅ 标记安全通过</text>
                      </view>
                      <view class="liquid-btn danger-btn" @click="rejectItem">
                        <view class="btn-content">
                          <text class="btn-icon">🗑️</text>
                          <text class="btn-txt">确认违规并删除</text>
                        </view>
                      </view>
                    </view>
                  </view>

                </view>
              </view>

            </view>
          </view>
        </view>
        
      </view>
    </view>
  </view>
</template>

<script>
import { API } from '../../utils/api.js'; // 引入接口

export default {
  data() {
    return {
      activeTab: 'post',
      selectedItem: null,
      auditQueue: [] // 初始清空假数据
    }
  },
  computed: {
    currentQueue() {
      return this.auditQueue.filter(item => item.tab === this.activeTab);
    }
  },
  mounted() {
    this.fetchAuditData(); // 页面加载时拉取真实数据
  },
  methods: {
    // 🚀 [新] 从后端获取待审核列表
    async fetchAuditData() {
      uni.showLoading({ title: '加载风控队列...' });
      try {
        const res = await API.getAuditList();
        // 假设后端返回的数据在 res.data 中
        this.auditQueue = res.data || [];
      } catch (error) {
        console.error('获取审核列表失败:', error);
      } finally {
        uni.hideLoading();
      }
    },

    selectItem(item) {
      this.selectedItem = item;
    },

    highlightSuspectText(text, suspectWords) {
      let result = text;
      if (suspectWords && suspectWords.length > 0) {
        suspectWords.forEach(word => {
          const regex = new RegExp(word, 'g');
          result = result.replace(regex, `<span class="highlight-risk">${word}</span>`);
        });
      }
      return result;
    },

    // 🚀 [改] 对接真实通过接口
    async approveItem() {
      uni.showLoading({ title: '处理中...' });
      try {
        await API.handleAuditAction({ id: this.selectedItem.id, action: 'approve' });
        uni.hideLoading();
        uni.showToast({ title: '已标记为安全', icon: 'success' });
        this.removeItemFromQueue();
      } catch (error) {
        uni.hideLoading();
      }
    },

    // 🚀 [改] 对接真实驳回/删除接口
    async rejectItem() {
      uni.showLoading({ title: '清理中...' });
      try {
        await API.handleAuditAction({ id: this.selectedItem.id, action: 'reject' });
        uni.hideLoading();
        uni.showToast({ title: '违规内容已清理', icon: 'success' });
        this.removeItemFromQueue();
      } catch (error) {
        uni.hideLoading();
      }
    },

    // 🚀 [改] 对接真实封禁接口
    banUser() {
      uni.showModal({
        title: '风险操作',
        content: `确定要永久封禁用户 ${this.selectedItem.author} 吗？`,
        confirmColor: '#ef4444',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '封禁中...' });
            try {
              // 调用用户治理接口封禁该作者
              await API.handleUserStatus({ id: this.selectedItem.authorId, status: 'banned' });
              uni.hideLoading();
              uni.showToast({ title: '账号已封禁', icon: 'success' });
              this.removeItemFromQueue();
            } catch (error) {
              uni.hideLoading();
            }
          }
        }
      });
    },

    removeItemFromQueue() {
      if (this.selectedItem) {
        this.auditQueue = this.auditQueue.filter(item => item.id !== this.selectedItem.id);
        this.selectedItem = null;
      }
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
            // 清理缓存
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

<style lang="scss">
/* 注意：这里使用非 scoped 以便渲染 v-html 中的高亮类 */
.highlight-risk {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.2);
  padding: 0 4px;
  border-radius: 4px;
  font-weight: bold;
}
</style>

<style lang="scss" scoped>
/* ==================== 宇宙色彩体系 (Admin 专属深色权威主题) ==================== */
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
.logo-box.admin-theme { width: 36px; height: 36px; border-radius: 10px; background: rgba($danger, 0.1); border: 1px solid rgba($danger, 0.3); display: flex; align-items: center; justify-content: center; }
.title-box { display: flex; flex-direction: column; }
.title { font-size: 16px; font-weight: 700; color: #fff; letter-spacing: 1px; }
.subtitle { font-size: 10px; color: $danger; font-family: monospace; letter-spacing: 1px; }

.header-right { display: flex; align-items: center; gap: 24px; }
.status-badge { display: flex; align-items: center; gap: 8px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
.status-badge.alert { background: rgba($danger, 0.1); border: 1px solid rgba($danger, 0.3); color: #fca5a5; }
.dot.pulse { width: 6px; height: 6px; border-radius: 50%; background: $danger; box-shadow: 0 0 8px $danger; animation: pulse 2s infinite; }
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


/* ==================== 外层右侧：审核工作台 ==================== */
.right-workspace-panel { flex: 1; min-width: 0; }
.audit-container { display: flex; flex-direction: column; overflow: hidden; }

/* 顶部分类 Tab */
.audit-tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2); }
.tab-item { padding: 20px 32px; font-size: 15px; color: $text-muted; font-weight: 500; cursor: pointer; border-bottom: 2px solid transparent; transition: 0.3s; }
.tab-item:hover { color: #fff; }
.tab-item.active { color: $primary-light; border-bottom-color: $primary-light; background: rgba($primary, 0.05); }

/* 内层左右分屏 */
.audit-split-view { flex: 1; display: flex; height: 0; }

/* 内层左半边：队列 */
.queue-panel { width: 35%; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; background: rgba(255,255,255,0.01); }
.queue-header { padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.03); }
.q-title { font-size: 14px; font-weight: 600; color: #fff; }
.filter-icon { font-size: 12px; color: $text-muted; cursor: pointer; }
.queue-scroll { flex: 1; height: 0; }
.queue-list { display: flex; flex-direction: column; padding: 16px; gap: 12px; }

.queue-item { padding: 16px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: 0.2s; position: relative; overflow: hidden; }
.queue-item:hover { background: rgba(255,255,255,0.06); }
.queue-item.active { background: rgba($primary, 0.1); border-color: rgba($primary, 0.3); }

/* 危险等级标识 (左侧竖线) */
.queue-item::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: transparent; }
.queue-item.high-risk::before { background: $danger; }
.queue-item.medium-risk::before { background: $warning; }

.qi-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
.qi-type { font-size: 12px; color: $text-secondary; font-weight: 600; }
.qi-time { font-size: 11px; color: $text-muted; }
.qi-title { font-size: 14px; color: #fff; line-height: 1.5; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; margin-bottom: 12px; }
.qi-footer { display: flex; justify-content: space-between; align-items: center; }
.qi-footer .author { font-size: 12px; color: $text-muted; }
.risk-badge { font-size: 11px; padding: 2px 8px; border-radius: 6px; font-weight: 600; }
.risk-badge.high { background: rgba($danger, 0.15); color: #fca5a5; border: 1px solid rgba($danger, 0.3); }
.risk-badge.medium { background: rgba($warning, 0.15); color: #fcd34d; border: 1px solid rgba($warning, 0.3); }


/* 内层右半边：详情与审核 */
.detail-panel { flex: 1; min-width: 0; display: flex; flex-direction: column; background: rgba(0,0,0,0.1); }

/* 空状态 */
.empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0.6; }
.e-icon { font-size: 60px; margin-bottom: 16px; filter: grayscale(100%); opacity: 0.5; }
.e-text { font-size: 14px; color: $text-muted; }

/* 审核详情区 */
.detail-content { flex: 1; display: flex; flex-direction: column; height: 100%; }
.detail-scroll { flex: 1; height: 0; }
.detail-inner { padding: 32px; display: flex; flex-direction: column; gap: 24px; }

/* AI 诊断报告框 */
.ai-risk-report { padding: 20px; border-radius: 12px; background: rgba(0,0,0,0.3); border: 1px dashed; position: relative; }
.ai-risk-report.high { border-color: rgba($danger, 0.5); background: linear-gradient(135deg, rgba($danger,0.05), transparent); }
.ai-risk-report.medium { border-color: rgba($warning, 0.5); background: linear-gradient(135deg, rgba($warning,0.05), transparent); }
.report-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.r-title { font-size: 16px; font-weight: 600; color: #fff; }
.report-body { font-size: 14px; line-height: 1.6; }
.reason-label { color: $text-secondary; }
.ai-risk-report.high .reason-text { color: #fca5a5; font-weight: 500; }
.ai-risk-report.medium .reason-text { color: #fcd34d; font-weight: 500; }

/* 内容展示卡 */
.content-display-box { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; }
.author-banner { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 20px; }
.ab-left { display: flex; align-items: center; gap: 12px; }
.ab-avatar { width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 20px; }
.ab-info { display: flex; flex-direction: column; gap: 4px; }
.ab-name { font-size: 15px; font-weight: 600; color: #fff; }
.ab-meta { font-size: 12px; color: $text-muted; }
.ab-history { font-size: 12px; padding: 4px 10px; border-radius: 12px; background: rgba($warning, 0.1); color: $warning; border: 1px solid rgba($warning, 0.2); }

.post-content-area { display: flex; flex-direction: column; gap: 16px; }
.post-title { font-size: 18px; font-weight: 700; color: #fff; }
.post-text { font-size: 15px; color: #e2e8f0; line-height: 1.8; white-space: pre-wrap; }
.risk-image { background: rgba($danger, 0.1); border-color: rgba($danger, 0.3); height: 200px; width: 100%; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.img-hint { color: #fca5a5; font-size: 14px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }

/* 底部操作台 */
.action-dock { padding: 24px 32px; background: rgba(0,0,0,0.4); border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; backdrop-filter: blur(20px); }
.action-right { display: flex; gap: 16px; }

/* 按钮样式 */
.liquid-btn {
  position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center;
  color: #fff; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; padding: 0 24px; height: 44px; border: none;
  transition: all 0.3s;
}
.liquid-btn.danger-btn { background: linear-gradient(135deg, #ef4444, #b91c1c); box-shadow: 0 4px 15px rgba($danger, 0.3); }
.liquid-btn.danger-btn:hover { box-shadow: 0 8px 25px rgba($danger, 0.5); transform: translateY(-2px); }
.btn-content { display: flex; align-items: center; gap: 8px; position: relative; z-index: 2; }

.ghost-btn.outline { background: transparent; border: 1px solid rgba(255,255,255,0.15); height: 44px; padding: 0 20px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; transition: 0.2s; font-weight: 500; }
.ghost-btn.outline.success-theme { border-color: rgba($success, 0.4); color: $success; }
.ghost-btn.outline.success-theme:hover { background: rgba($success, 0.1); border-color: $success; }
.ghost-btn.outline.warning-theme { border-color: rgba($warning, 0.4); color: $warning; }
.ghost-btn.outline.warning-theme:hover { background: rgba($warning, 0.1); border-color: $warning; }
.ghost-btn.outline.micro { height: 28px; padding: 0 12px; font-size: 12px; border-radius: 6px; }

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