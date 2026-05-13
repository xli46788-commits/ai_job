<template>
  <view class="company-universe-web">
    <view class="aurora-wrapper">
      <view class="orb orb-1"></view>
      <view class="orb orb-2"></view>
      <view class="orb orb-3"></view>
      <view class="grid-overlay"></view>
      <view class="vignette-overlay"></view> 
    </view>

    <view class="main-container">
      <view class="header-section fade-in-down">
        
        <view class="header-left" style="display: flex; align-items: center; gap: 20px;">
          <view class="icon-btn" @click="logout" title="退出系统">
            <text class="arrow-left">🚪</text>
          </view>
          
          <view class="company-info">
            <view class="cyber-badge">
              <text class="dot pulse"></text> AI Command Center
            </view>
            <view class="company-title-container">
              <text class="company-name">企业控制台</text>
            </view>
            <text class="company-subtitle">实时监控您的招聘漏斗与人才资产池</text>
          </view>
        </view>

        <view class="header-right">
          <view class="ultra-glass-avatar hover-lift">
            <text class="avatar-icon">🏢</text>
            <view class="avatar-glow"></view>
          </view>
        </view>
      </view>

      <view class="workspace-body">
        
        <view class="left-main-panel">
          
          <view class="stats-section fade-in-up delay-1">
            <view class="section-header">
              <view class="section-title-container">
                <text class="section-icon">📊</text>
                <text class="section-title">全景数据</text>
              </view>
              <view class="title-line"></view>
            </view>

            <view class="stats-grid">
              <view 
                v-for="(stat, index) in statsList" 
                :key="index" 
                class="ultra-glass-card stat-card hover-lift"
                :class="`stat-theme-${index}`"
              >
                <view class="card-inner-glow"></view>
                <view class="stat-top">
                  <view class="stat-icon-wrapper">
                    <text class="stat-icon">{{ stat.icon }}</text>
                  </view>
                  <view class="trend-indicator" :class="stat.trend">
                    <text class="trend-icon">{{ stat.trendIcon }}</text>
                    <text class="trend-value">{{ stat.trendValue }}</text>
                  </view>
                </view>
                <view class="stat-bottom">
                  <text class="number-value gradient-text">{{ stat.value }}</text>
                  <text class="stat-label">{{ stat.label }}</text>
                </view>
                <view class="cyber-progress-container">
                  <view class="cyber-progress-bar" :style="{ width: `${stat.percentage}%` }">
                    <view class="progress-glow"></view>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <view class="actions-section fade-in-up delay-2">
            <view class="section-header">
              <view class="section-title-container">
                <text class="section-icon">⚡</text>
                <text class="section-title">快捷操作</text>
              </view>
              <view class="title-line"></view>
            </view>

            <view class="actions-grid">
              <view 
                v-for="(action, index) in quickActions" 
                :key="index" 
                class="ultra-glass-card action-card hover-lift"
                @click="handleAction(action.route)"
              >
                <view class="action-icon-wrapper">
                  <text class="action-icon">{{ action.icon }}</text>
                </view>
                <view class="action-info">
                  <text class="action-title">{{ action.title }}</text>
                  <text class="action-desc">{{ action.description }}</text>
                </view>
                <view class="action-arrow">→</view>
              </view>
            </view>
          </view>

          <view class="applications-section fade-in-up delay-3">
            <view class="section-header">
              <view class="section-title-container">
                <text class="section-icon">🎯</text>
                <text class="section-title">今日高潜推荐</text>
              </view>
              <view class="section-actions">
                <view class="cyber-link" @click="goToResumeList">
                  <text>查看完整候选池</text>
                  <text class="arrow-icon">→</text>
                </view>
              </view>
            </view>

            <view class="applications-grid">
              <view 
                v-for="(app, index) in recentApplications" 
                :key="index" 
                class="ultra-glass-card application-card hover-lift"
                @click="viewResume(app)"
              >
                <view class="neon-badge" :style="getMatchBadgeStyle(app.matchRate)">
                  <text class="pulse-dot"></text>
                  <text class="badge-text">{{ app.matchRate }}% 契合</text>
                </view>

                <view class="card-body">
                  <view class="applicant-header">
                    <view class="applicant-avatar-wrap">
                      <view class="applicant-avatar">👤</view>
                    </view>
                    <view class="applicant-info">
                      <text class="applicant-name">{{ app.name }}</text>
                      <view class="applicant-details">
                        <text class="detail-text">{{ app.major }}</text>
                        <text class="detail-divider">·</text>
                        <text class="detail-text highlight">{{ app.school }}</text>
                      </view>
                    </view>
                  </view>

                  <view class="skills-tags">
                    <view v-for="(skill, skillIndex) in app.skills" :key="skillIndex" class="neon-tag">
                      {{ skill }}
                    </view>
                  </view>

                  <view class="application-meta">
                    <view class="meta-item"><text class="meta-icon">⏳</text><text class="meta-text">{{ app.time }}</text></view>
                    <view class="meta-item"><text class="meta-icon">💼</text><text class="meta-text target">{{ app.targetJob }}</text></view>
                  </view>
                </view>

                <view class="card-footer">
                  <view class="status-indicator" :class="`status-${app.backendStatus}`" @click.stop="handleStatus(app)">
                    <text class="status-dot"></text>
                    <text>{{ app.statusText }}</text>
                  </view>
                  <view class="quick-actions">
                    <view class="ghost-text-btn" @click.stop="viewResumeDetail(app)">解析报告</view>
                    <view class="liquid-btn micro" @click.stop="contactApplicant(app)">
                      <text class="btn-txt">直接沟通</text>
                    </view>
                  </view>
                </view>
              </view>
              
              <view v-if="recentApplications.length === 0" style="padding: 40px; text-align: center; grid-column: span 2; color: #64748b;">
                暂无收到的简历投递记录，快去发布岗位吧！🚀
              </view>
              
            </view>
          </view>
          
        </view>

        <view class="right-sidebar-panel fade-in-left delay-4">
          <view class="liquid-ai-card sticky-sidebar">
            <view class="liquid-bg"></view>
            
            <view class="ai-card-content vertical-mode">
              <view class="assistant-header-v">
                <view class="ai-avatar-glow">
                  <text class="ai-icon">✨</text>
                </view>
                <text class="assistant-title">AI Copilot 引擎</text>
                <view class="ai-status-badge">
                  <text class="status-dot pulse"></text> 全局监控中
                </view>
              </view>
              
              <view class="divider"></view>
              
              <scroll-view class="assistant-body-v custom-scrollbar" scroll-y>
                <view class="insight-block primary">
                  <view class="insight-title">🚀 招聘加速建议</view>
                  <view class="message-text">
                    已为您发掘 <text class="highlight-num">{{ recentApplications.length }}</text> 位高潜力候选人。能力模型与核心缺口高度重合，建议立即发起邀约，抢占人才先机！
                  </view>
                  <view class="liquid-btn fill-width mt-16" @click="autoScheduleInterviews">
                    <text class="btn-txt">⚡ 一键智能排面</text>
                  </view>
                </view>

                <view class="insight-block">
                  <view class="insight-title">📊 行业供需异动</view>
                  <view class="message-text small">
                    过去 24 小时内，<text class="highlight-text">算法工程师</text> 岗位的投递热度环比下降 15%。建议适当放宽 JD 限制或提升薪资预算边界。
                  </view>
                  <view class="ghost-btn outline fill-width mt-12" @click="handleAction('/pages/company/post-job')">
                    <text>优化岗位 JD</text>
                  </view>
                </view>
              </scroll-view>
              
              <view class="assistant-footer">
                <view class="ai-typing-indicator">
                  AI 正在实时分析入库简历...
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
// 🚀 引入真实接口
import { API } from '../../utils/api.js';

export default {
  data() {
    return {
      statsList: [
        { icon: '📄', value: 0, label: '收到简历', trend: 'up', trendIcon: '↗', trendValue: '12%', percentage: 85 },
        { icon: '🚀', value: 0, label: '发布岗位', trend: 'up', trendIcon: '↗', trendValue: '3%', percentage: 60 },
        { icon: '📅', value: 0, label: '安排面试', trend: 'up', trendIcon: '↗', trendValue: '8%', percentage: 45 },
        { icon: '🎉', value: 0, label: '成功录用', trend: 'up', trendIcon: '↗', trendValue: '5%', percentage: 25 }
      ],
      recentApplications: [], // 🚀 初始为空，由后端真实数据填充
      quickActions: [
        { icon: '✏️', title: '发布新岗位', description: 'AI智能润色JD', route: '/pages/company/post-job' },
        { icon: '🗂️', title: '人才资产库', description: '激活沉淀简历', route: '/pages/company/resume-list' }, // 指向筛选页
        { icon: '🏢', title: '在招职位管理', description: '调整岗位生命周期', route: '/pages/company/job-list' },
        { icon: '📈', title: '全景漏斗分析', description: '生成多维数据报表', route: '/pages/company/analytics' }
      ]
    };
  },
  mounted() {
    this.fetchDashboardStats();
    this.fetchRecentApplications(); // 🚀 新增：拉取真实投递列表
  },
  methods: {
    // 🚀 1. 真实：拉取全景大盘数据
    async fetchDashboardStats() {
      try {
        const res = await API.getEnterpriseStats();
        if (res.data) {
          const stats = res.data;
          this.statsList[0].value = stats.received_resumes || 0;
          this.statsList[1].value = stats.published_jobs || 0;
          this.statsList[2].value = stats.interviews || 0;
          this.statsList[3].value = stats.hired || 0;
        }
      } catch (error) {
        console.error('全景数据拉取失败，请检查接口', error);
      }
    },

    // 🚀 2. 真实：拉取今日高潜推荐（最新收到的简历）
    async fetchRecentApplications() {
      try {
        const res = await API.getCompanyDeliveries();
        const records = res.data?.results || res.data || res.results || res || [];
        
        if (records.length > 0) {
          // 只取前 4 个最新投递作为推荐
          this.recentApplications = records.slice(0, 4).map(r => {
            // 解析 AI 返回的 JSON 洞察，提取出技能
            let parsedInsight = {};
            try { parsedInsight = r.ai_insight ? JSON.parse(r.ai_insight) : {}; } catch(e) {}
            
            // 映射中文状态
            const statusMap = { 'pending': '待处理', 'viewed': '已查看', 'interview': '面试中', 'rejected': '已淘汰' };

            return {
              id: r.application_id, 
              name: r.student_name || '求职者',
              major: '计算机/软件相关', // 临时兜底，如果简历模型里有可以替换
              school: '匹配高校',
              matchRate: r.match_score || 85,
              skills: parsedInsight.skills || ['Python', '前端', '沟通能力'],
              time: this.formatTime(r.created_at),
              targetJob: r.job_name || '目标岗位',
              backendStatus: r.status, // 用于渲染指示器颜色
              statusText: statusMap[r.status] || '待处理'
            };
          });
        }
      } catch (error) {
        console.error('高潜推荐拉取失败', error);
      }
    },

    // 辅助方法：格式化投递时间为“刚刚”、“xx分钟前”
    formatTime(dateStr) {
      if (!dateStr) return '刚刚';
      const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
      if (diff < 60) return '刚刚';
      if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
      return `${Math.floor(diff / 86400)} 天前`;
    },

    // 🚀 3. 真实：点击高潜简历，跳转到“智能简历筛选页”并携带 ID
    viewResume(app) { 
      // 携带此投递记录的 id 跳转，方便目标页直接选中他
      uni.navigateTo({ url: `/pages/company/resume-list?id=${app.id}` }); 
    },
    
    viewResumeDetail(app) { 
      uni.showActionSheet({ 
        itemList: ['深度解析报告', '下载原版 PDF', '标为高潜'], 
        success: (res) => { if (res.tapIndex === 0) this.viewResume(app); } 
      }); 
    },

    getMatchBadgeStyle(matchRate) {
      if (matchRate >= 90) return { '--theme': '#10b981', '--bg': 'rgba(16, 185, 129, 0.1)', '--glow': 'rgba(16, 185, 129, 0.4)' };
      if (matchRate >= 80) return { '--theme': '#3b82f6', '--bg': 'rgba(59, 130, 246, 0.1)', '--glow': 'rgba(59, 130, 246, 0.4)' };
      return { '--theme': '#f59e0b', '--bg': 'rgba(245, 158, 11, 0.1)', '--glow': 'rgba(245, 158, 11, 0.4)' };
    },

    logout() {
      uni.showModal({
        title: '退出登录',
        content: '确定要退出企业控制台吗？',
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
    },

    handleStatus(app) { uni.showToast({ title: '请在详情页进行状态流转', icon: 'none' }); },
    contactApplicant(app) { uni.showActionSheet({ itemList: ['AI生成邀约话术', '发送站内信'], success: () => { uni.showToast({ title: '已触达', icon: 'success' }); } }); },
    handleAction(route) { uni.navigateTo({ url: route }); },
    autoScheduleInterviews() {
      uni.showLoading({ title: '引擎运转中...', mask: true });
      setTimeout(() => { uni.hideLoading(); uni.showToast({ title: '已锁定档期', icon: 'success' }); }, 1500);
    },
    goToResumeList() { uni.navigateTo({ url: '/pages/company/resume-list' }); }
  }
};
</script>

<style lang="scss" scoped>
/* ==================== 宇宙色彩体系 ==================== */
$bg-deep: #030308;
$primary: #3b82f6; 
$primary-light: #60a5fa;
$secondary: #8b5cf6; 
$secondary-light: #a78bfa;
$accent: #06b6d4; 
$success: #10b981;
$warning: #f59e0b;
$text-main: #f8fafc;
$text-muted: #94a3b8;

/* ==================== 极光背景 ==================== */
.company-universe-web {
  min-height: 100vh; width: 100vw; background-color: $bg-deep;
  position: relative; overflow-x: hidden; padding-bottom: 60px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.aurora-wrapper { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(140px); opacity: 0.35; mix-blend-mode: screen; animation: float 30s infinite alternate ease-in-out; }
.orb-1 { width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 60%); top: -10%; left: -10%; }
.orb-2 { width: 45vw; height: 45vw; background: radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 60%); bottom: -10%; right: -5%; animation-delay: -5s; }
.orb-3 { width: 35vw; height: 35vw; background: radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 60%); top: 30%; left: 40%; animation-delay: -10s; }
.grid-overlay { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px); background-size: 40px 40px; z-index: 1; }
.vignette-overlay { position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 40%, rgba(3,3,8,0.9) 100%); z-index: 2; }
@keyframes float { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(4%, 6%) scale(1.1); } }

/* ==================== 核心布局 ==================== */
.main-container { width: 100%; max-width: 1440px; margin: 0 auto; padding: 0 40px; position: relative; z-index: 10; box-sizing: border-box; }

/* 头部 */
.header-section { display: flex; justify-content: space-between; align-items: flex-end; padding: 48px 0 40px; }
.icon-btn { width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; color: #fff; font-size: 18px; flex-shrink: 0; }
.icon-btn:hover { background: rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.4); transform: translateX(-2px); color: #ef4444; }
.cyber-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; color: #cbd5e1; font-size: 13px; letter-spacing: 1px; margin-bottom: 16px; box-shadow: inset 0 0 10px rgba(255,255,255,0.02); }
.cyber-badge .dot { width: 6px; height: 6px; background: $success; border-radius: 50%; box-shadow: 0 0 10px $success; }
.company-name { font-size: 40px; font-weight: 800; line-height: 1.2; color: #fff; text-shadow: 0 0 30px rgba(255,255,255,0.2); letter-spacing: 1px; }
.company-subtitle { font-size: 15px; color: $text-muted; margin-top: 10px; display: block; }
.ultra-glass-avatar { width: 64px; height: 64px; border-radius: 20px; position: relative; background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 28px; cursor: pointer; }
.ultra-glass-avatar .avatar-glow { position: absolute; inset: -5px; background: linear-gradient(135deg, $primary, $secondary); filter: blur(15px); opacity: 0.4; z-index: -1; border-radius: inherit; transition: 0.3s; }
.ultra-glass-avatar:hover .avatar-glow { opacity: 0.7; filter: blur(20px); }

/* 左右双舱核心容器 */
.workspace-body { display: flex; gap: 32px; align-items: flex-start; }

/* 左侧主舱 */
.left-main-panel { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 40px; }

/* 右侧侧边栏 */
.right-sidebar-panel { width: 400px; flex-shrink: 0; }
.sticky-sidebar { position: sticky; top: 32px; height: calc(100vh - 64px); } 

/* ==================== 公共组件库 ==================== */
.ultra-glass-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
  backdrop-filter: blur(32px) saturate(120%); border: 1px solid rgba(255, 255, 255, 0.06);
  border-top: 1px solid rgba(255, 255, 255, 0.12); border-left: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px; box-shadow: 0 16px 40px -10px rgba(0, 0, 0, 0.5); position: relative; overflow: hidden; transition: all 0.3s ease;
}
.hover-lift:hover { transform: translateY(-4px); border-top-color: rgba(255, 255, 255, 0.2); box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.1); }

.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.section-title-container { display: flex; align-items: center; gap: 12px; }
.section-icon { font-size: 20px; filter: drop-shadow(0 0 8px rgba(255,255,255,0.2)); }
.section-title { font-size: 18px; font-weight: 600; color: #fff; letter-spacing: 0.5px; }
.title-line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.06), transparent); margin-left: 20px; }
.cyber-link { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; color: $text-muted; cursor: pointer; transition: 0.2s; &:hover { color: #fff; transform: translateX(2px); } }

/* ==================== 左侧：数据面板 ==================== */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.stat-card { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.card-inner-glow { position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; border-radius: 50%; filter: blur(40px); opacity: 0.15; z-index: 0; pointer-events: none; }
.stat-theme-0 .card-inner-glow { background: $primary; } .stat-theme-1 .card-inner-glow { background: $secondary; }
.stat-theme-2 .card-inner-glow { background: $accent; } .stat-theme-3 .card-inner-glow { background: $success; }
.stat-top { display: flex; justify-content: space-between; align-items: flex-start; position: relative; z-index: 1; }
.stat-icon-wrapper { width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; font-size: 18px; border: 1px solid rgba(255,255,255,0.08); }
.trend-indicator { display: flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 8px; font-size: 12px; font-weight: 600; }
.trend-indicator.up { color: $success; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); }
.stat-bottom { position: relative; z-index: 1; display: flex; flex-direction: column; }
.number-value.gradient-text { font-size: 36px; font-weight: 800; line-height: 1.2; margin-bottom: 2px; background: linear-gradient(135deg, #fff 20%, $primary-light 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.stat-theme-1 .number-value.gradient-text { background: linear-gradient(135deg, #fff 20%, $secondary-light 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.stat-theme-3 .number-value.gradient-text { background: linear-gradient(135deg, #fff 20%, #6ee7b7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.stat-label { font-size: 13px; color: $text-muted; font-weight: 500; }
.cyber-progress-container { width: 100%; height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; margin-top: auto; position: relative; z-index: 1; overflow: hidden; }
.cyber-progress-bar { height: 100%; background: $primary; border-radius: 2px; position: relative; }
.stat-theme-1 .cyber-progress-bar { background: $secondary; } .stat-theme-2 .cyber-progress-bar { background: $accent; } .stat-theme-3 .cyber-progress-bar { background: $success; }

/* ==================== 左侧：快捷操作 ==================== */
.actions-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; } 
.action-card { padding: 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; }
.action-icon-wrapper { width: 48px; height: 48px; border-radius: 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; font-size: 20px; transition: 0.3s; }
.action-card:hover .action-icon-wrapper { background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.3); box-shadow: inset 0 0 10px rgba(59,130,246,0.2); }
.action-info { flex: 1; }
.action-title { display: block; font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 4px; }
.action-desc { font-size: 13px; color: $text-muted; }
.action-arrow { color: rgba(255,255,255,0.1); font-size: 18px; transition: 0.3s; }
.action-card:hover .action-arrow { transform: translateX(4px); color: $primary; }

/* ==================== 左侧：高匹配人才 (网格化) ==================== */
.applications-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; } 
.application-card { display: flex; flex-direction: column; cursor: pointer; }
.neon-badge { position: absolute; top: 16px; right: 16px; padding: 6px 12px; background: var(--bg); border: 1px solid var(--theme); color: var(--theme); border-radius: 14px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px; z-index: 2; box-shadow: 0 0 12px var(--glow); backdrop-filter: blur(4px); }
.pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--theme); box-shadow: 0 0 8px var(--theme); }
.pulse { animation: breathe 2s infinite; }
@keyframes breathe { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

.card-body { padding: 24px; flex: 1; }
.applicant-header { display: flex; gap: 16px; margin-bottom: 20px; }
.applicant-avatar-wrap { width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.05); padding: 1px; background-image: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0)); }
.applicant-avatar { width: 100%; height: 100%; background: rgba(10,15,30,0.8); border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.applicant-name { font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 4px; display: block; }
.applicant-details { font-size: 13px; color: $text-muted; display: flex; align-items: center; gap: 8px; }
.highlight { color: #cbd5e1; }

.skills-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
.neon-tag { padding: 4px 10px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; font-size: 12px; color: #94a3b8; transition: 0.2s; }
.application-card:hover .neon-tag { border-color: rgba(59, 130, 246, 0.3); color: #cbd5e1; }

.application-meta { display: flex; gap: 16px; }
.meta-item { font-size: 12px; color: $text-muted; display: flex; align-items: center; gap: 4px; }
.target { color: $primary-light; }

.card-footer { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.03); }
.status-indicator { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; }
.status-pending { color: $warning; .status-dot { background: $warning; box-shadow: 0 0 8px $warning; } }
.status-interview { color: $primary; .status-dot { background: $primary; box-shadow: 0 0 8px $primary; } }
.status-rejected { color: $text-muted; .status-dot { background: $text-muted; } }
.quick-actions { display: flex; gap: 12px; align-items: center; }
.ghost-text-btn { font-size: 13px; color: $text-muted; cursor: pointer; transition: 0.2s; &:hover { color: #fff; } }

/* ==================== 右侧：AI Copilot 侧边栏 ==================== */
.liquid-ai-card {
  position: relative; border-radius: 24px; padding: 1px; box-sizing: border-box;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(139, 92, 246, 0.5), rgba(6, 182, 212, 0.5));
  background-size: 200% 200%; animation: gradientFlow 6s linear infinite;
  box-shadow: 0 24px 48px -10px rgba(139, 92, 246, 0.2); display: flex; flex-direction: column;
}

.vertical-mode { background: #070A12; border-radius: 23px; display: flex; flex-direction: column; flex: 1; height: 100%; overflow: hidden; }
.assistant-header-v { display: flex; flex-direction: column; align-items: center; padding: 32px 24px 24px; text-align: center; }
.ai-avatar-glow { width: 64px; height: 64px; border-radius: 20px; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 20px rgba(139, 92, 246, 0.2), 0 0 20px rgba(139, 92, 246, 0.1); margin-bottom: 16px; position: relative; }
.ai-avatar-glow .ai-icon { font-size: 28px; filter: drop-shadow(0 0 10px rgba(255,255,255,0.6)); }
.assistant-header-v .assistant-title { font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 12px; letter-spacing: 0.5px; }
.ai-status-badge { font-size: 12px; color: $secondary-light; padding: 6px 14px; background: rgba(139, 92, 246, 0.15); border-radius: 20px; border: 1px solid rgba(139, 92, 246, 0.2); display: flex; align-items: center; gap: 8px; font-weight: 500; }

.divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); }

.assistant-body-v { flex: 1; padding: 24px; height: 0; }
.insight-block { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 20px; margin-bottom: 16px; }
.insight-block.primary { background: linear-gradient(180deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.03) 100%); border-color: rgba(139, 92, 246, 0.2); box-shadow: inset 0 2px 10px rgba(139, 92, 246, 0.05); }
.insight-title { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
.message-text { font-size: 14px; color: #cbd5e1; line-height: 1.6; }
.message-text.small { font-size: 13px; color: #94a3b8; }
.highlight-num { font-size: 20px; font-weight: 700; color: #d8b4fe; margin: 0 4px; }
.highlight-text { color: #e2e8f0; font-weight: 500; }
.mt-16 { margin-top: 16px; } .mt-12 { margin-top: 12px; }

.assistant-footer { padding: 16px 24px; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.03); text-align: center; }
.ai-typing-indicator { font-size: 12px; color: rgba(255,255,255,0.3); font-style: italic; animation: pulse 2s infinite; }

/* ==================== 统一按钮 ==================== */
.liquid-btn {
  position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, $primary, $secondary); color: #fff; border-radius: 12px;
  font-size: 14px; font-weight: 600; cursor: pointer; padding: 0 20px; height: 44px;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3), inset 0 1px 1px rgba(255,255,255,0.3); transition: all 0.3s ease; border: none;
}
.liquid-btn:hover { box-shadow: 0 12px 28px rgba(59, 130, 246, 0.5); transform: translateY(-2px); }
.liquid-btn.micro { height: 36px; padding: 0 16px; font-size: 13px; border-radius: 10px; }
.liquid-btn.fill-width { width: 100%; box-sizing: border-box; }
.liquid-btn .btn-txt { position: relative; z-index: 2; }
.ghost-btn.outline { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: #cbd5e1; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 13px; cursor: pointer; transition: 0.2s; }
.ghost-btn.outline:hover { background: rgba(255,255,255,0.05); color: #fff; border-color: rgba(255,255,255,0.3); }

/* 细长滚动条 */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

/* ==================== 动画序列修复 ==================== */
.fade-in-down { animation: fadeInDown 0.6s ease both; }
.fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.fade-in-left { animation: fadeInLeft 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }

.delay-1 { animation-delay: 0.1s; } 
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }

@keyframes fadeInDown { 
  from { opacity: 0; transform: translateY(-20px); } 
  to { opacity: 1; transform: translateY(0); } 
}
@keyframes fadeInUp { 
  from { opacity: 0; transform: translateY(30px); } 
  to { opacity: 1; transform: translateY(0); } 
}
@keyframes fadeInLeft { 
  from { opacity: 0; transform: translateX(30px); } 
  to { opacity: 1; transform: translateX(0); } 
}
@keyframes gradientFlow { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
</style>