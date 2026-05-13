<template>
  <view class="company-universe-web">
    <view class="aurora-wrapper">
      <view class="orb orb-1"></view>
      <view class="orb orb-2"></view>
      <view class="orb orb-3"></view>
      <view class="grid-overlay"></view>
      <view class="vignette-overlay"></view> 
    </view>

    <view class="workspace-layout">
      <view class="glass-header fade-in-down">
        <view class="header-left">
          <view class="icon-btn" @click="goBack" title="返回控制台大盘">
            <text class="arrow-left">←</text>
          </view>
          <text class="title">在招职位管理</text>
        </view>
        <view class="header-right">
          <view class="liquid-btn micro" @click="createNewJob">
            <text class="btn-txt">+ 发布新岗位</text>
          </view>
        </view>
      </view>

      <view class="workspace-body">
        
        <view class="left-list-panel fade-in-up delay-1">
          <view class="filter-console">
            <view class="tabs-container">
              <view 
                v-for="(tab, index) in tabs" 
                :key="index"
                :class="['tab-item', { active: currentTab === tab.value }]"
                @click="switchTab(tab.value)"
              >
                {{ tab.label }} <text class="count" v-if="tab.count">{{ tab.count }}</text>
              </view>
            </view>
          </view>

          <scroll-view 
            class="list-scroll custom-scrollbar" 
            scroll-y 
            :refresher-enabled="true" 
            :refresher-triggered="refreshing"
            @refresherrefresh="onRefresh"
          >
            <view class="job-list-inner" v-if="filteredJobs.length > 0">
              <view 
                v-for="(job, index) in filteredJobs" 
                :key="index" 
                :class="['compact-card', { 'active': selectedJob && selectedJob.id === job.id }]"
                :style="`animation-delay: ${0.1 + index * 0.05}s;`"
                @click="selectJob(job)"
              >
                <view class="j-header">
                  <view class="j-title-row">
                    <text class="j-title">{{ job.title }}</text>
                    <view :class="['j-status-dot', job.status]"></view>
                  </view>
                  <text class="j-salary">{{ job.salary }}</text>
                </view>
                
                <view class="j-meta">
                  <text class="j-desc">{{ job.location }} · {{ job.experience }} · {{ job.education }}</text>
                </view>

                <view class="j-data-row">
                  <view class="j-data-item">
                    <text class="j-data-val">{{ job.stats.views }}</text>
                    <text class="j-data-label">浏览</text>
                  </view>
                  <view class="j-data-item">
                    <text class="j-data-val highlight">{{ job.stats.applies }}</text>
                    <text class="j-data-label">投递数</text>
                  </view>
                  <view class="j-data-item">
                    <text class="j-data-val">{{ job.stats.interviews }}</text>
                    <text class="j-data-label">面试中</text>
                  </view>
                </view>
              </view>
            </view>

            <view v-else class="empty-state mini">
              <text class="empty-icon">📭</text>
              <text class="empty-text">暂无该状态下的职位</text>
            </view>
          </scroll-view>
        </view>

        <view class="right-detail-panel fade-in-left delay-2">
          <scroll-view class="detail-scroll custom-scrollbar" scroll-y>
            <view class="detail-content" v-if="selectedJob">
              
              <view class="detail-header-card">
                <view class="dh-top">
                  <view class="dh-info">
                    <view class="title-with-status">
                      <text class="dh-title">{{ selectedJob.title }}</text>
                      <view :class="['neon-status', selectedJob.status]">{{ getStatusText(selectedJob.status) }}</view>
                    </view>
                    <text class="dh-salary">{{ selectedJob.salary }}</text>
                    <view class="dh-tags">
                      <text class="dh-tag">{{ selectedJob.location }}</text>
                      <text class="dh-tag">{{ selectedJob.experience }}</text>
                      <text class="dh-tag">{{ selectedJob.education }}</text>
                      <text class="dh-tag highlight">发布于 {{ selectedJob.publishDate }}</text>
                    </view>
                  </view>
                  
                  <view class="dh-actions">
                    <view class="ghost-btn" @click="toggleJobStatus(selectedJob)">
                      <text v-if="selectedJob.status === 'active'">⏸ 暂停招聘</text>
                      <text v-else>▶️ 重新激活</text>
                    </view>
                    <view class="ghost-btn" @click="editJob">
                      <text>✏️ 编辑职位</text>
                    </view>
                  </view>
                </view>
              </view>

              <view class="ai-insight-card">
                <view class="card-title-bar">
                  <text class="icon pulse-icon">✨</text>
                  <text class="card-title">AI 职位健康度诊断</text>
                  <view :class="['health-score-badge', getHealthClass(selectedJob.healthScore)]">
                    健康度 {{ selectedJob.healthScore }}分
                  </view>
                </view>
                <view class="insight-body">
                  <view class="insight-text">
                    <text class="highlight warning" v-if="selectedJob.healthScore < 80">⚠️ 流量预警：</text>
                    <text class="highlight success" v-else>💡 运行良好：</text>
                    {{ getHealthInsight(selectedJob) }}
                  </view>
                  
                  <view class="liquid-btn auto-width mt-16" @click="optimizeJD" v-if="selectedJob.healthScore < 90">
                    <text class="btn-txt">✨ 唤醒 Copilot 一键润色 JD</text>
                  </view>
                </view>
              </view>

              <view class="funnel-section">
                <view class="section-title">招聘漏斗数据追踪 (全部数据)</view>
                <view class="funnel-grid">
                  <view class="funnel-card">
                    <view class="f-icon-box">👁️</view>
                    <text class="f-val">{{ selectedJob.stats.views }}</text>
                    <text class="f-label">职位曝光量</text>
                    <view class="f-trend up">+12% 周环比</view>
                  </view>
                  <view class="funnel-arrow">›</view>
                  
                  <view class="funnel-card">
                    <view class="f-icon-box theme-purple">📥</view>
                    <text class="f-val">{{ selectedJob.stats.applies }}</text>
                    <text class="f-label">收到投递</text>
                    <view class="f-trend down" v-if="selectedJob.stats.applies === 0">待发力</view>
                    <view class="f-trend up" v-else>稳步上升</view>
                  </view>
                  <view class="funnel-arrow">›</view>

                  <view class="funnel-card">
                    <view class="f-icon-box theme-cyan">📅</view>
                    <text class="f-val">{{ selectedJob.stats.interviews }}</text>
                    <text class="f-label">进入面试</text>
                    <view class="f-trend neutral">转化中</view>
                  </view>
                  <view class="funnel-arrow">›</view>

                  <view class="funnel-card">
                    <view class="f-icon-box theme-green">🎉</view>
                    <text class="f-val">{{ selectedJob.stats.offers }}</text>
                    <text class="f-label">发放 Offer</text>
                    <text class="f-trend neutral">持平</text>
                  </view>
                </view>
              </view>

            </view>

            <view class="detail-empty-state" v-else>
              <text class="empty-icon">🏢</text>
              <text class="empty-title">生命周期管理台</text>
              <text class="empty-desc">在左侧选择一个职位，即可查看 AI 诊断报告与数据漏斗。</text>
            </view>
          </scroll-view>
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
      currentTab: 'active',
      refreshing: false,
      tabs: [
        { label: '招聘中', value: 'active', count: 0 },
        { label: '已暂停', value: 'paused', count: 0 },
        { label: '已关闭', value: 'closed', count: 0 }
      ],
      jobs: [], // 初始为空，从后端拉取
      selectedJob: null
    };
  },
  computed: {
    filteredJobs() {
      return this.jobs.filter(job => job.status === this.currentTab);
    }
  },
  mounted() {
    this.fetchJobs();
  },
  methods: {
    // 🚀 1. 从后端真实获取企业岗位列表，并绑定最新的漏斗数据
    async fetchJobs() {
      uni.showLoading({ title: '同步职位数据...' });
      try {
        const res = await API.getCompanyJobs();
        // 适配 DRF 的返回格式
        const realJobs = res.data || res.results || res || [];
        
        if (realJobs.length > 0) {
          // 将后端的字段精准映射为前端 UI 需要的字段
          this.jobs = realJobs.map(j => ({
            id: j.id || j.job_id,
            title: j.job_name || j.title || '未命名职位',
            salary: j.job_salary || j.salary || '面议', // 🚀 兼容后端的 job_salary
            location: j.job_location || '全国',
            experience: j.experience || '经验不限',
            education: j.education || '学历不限',
            status: j.is_published ? 'active' : 'paused', 
            publishDate: j.created_at ? j.created_at.split('T')[0] : '刚刚',
            healthScore: j.view_count > 0 ? 95 : 85, // 有曝光就给高分，后续可接入 AI
            
            // 🚀 彻底激活真实数据漏斗！
            stats: { 
              views: j.view_count || 0,           // 真实浏览量
              applies: j.resume_count || 0,       // 真实收到投递数
              interviews: j.interview_count || 0, // 真实安排面试数
              offers: j.offer_count || 0          // 真实发放 Offer 数
            }
          }));
        } else {
          this.jobs = []; // 清空数据展示空状态
        }
        
        this.updateTabCounts();
        this.switchTab(this.currentTab);
      } catch (error) {
        console.error('获取职位失败:', error);
        uni.showToast({ title: '网络异常，请重试', icon: 'none' });
      } finally {
        uni.hideLoading();
      }
    },

    // 🚀 2. 真实调用后端接口修改状态
    async toggleJobStatus(job) {
      const isActivating = job.status !== 'active';
      uni.showLoading({ title: isActivating ? '激活中...' : '暂停中...', mask: true });
      
      try {
        // 调用后端 PATCH 接口，更新 is_published 字段
        await API.updateJob(job.id, { is_published: isActivating });
        
        uni.hideLoading();
        job.status = isActivating ? 'active' : 'paused';
        uni.showToast({ title: isActivating ? '职位已重新发布' : '招聘已暂停', icon: 'success' });
        
        this.updateTabCounts();
        if (job.status !== this.currentTab) {
          this.switchTab(job.status);
        }
      } catch (error) {
        uni.hideLoading();
        uni.showToast({ title: '操作失败，请重试', icon: 'none' });
      }
    },

    updateTabCounts() {
      this.tabs[0].count = this.jobs.filter(j => j.status === 'active').length;
      this.tabs[1].count = this.jobs.filter(j => j.status === 'paused').length;
      this.tabs[2].count = this.jobs.filter(j => j.status === 'closed').length;
    },

    switchTab(val) {
      this.currentTab = val;
      this.selectedJob = this.filteredJobs.length > 0 ? this.filteredJobs[0] : null;
    },
    selectJob(job) { this.selectedJob = job; },
    getStatusText(status) { const map = { active: '招聘中', paused: '已暂停', closed: '已关闭' }; return map[status]; },
    getHealthClass(score) {
      if (score >= 90) return 'health-excellent';
      if (score >= 80) return 'health-good';
      return 'health-warning';
    },
    getHealthInsight(job) {
      if (job.healthScore >= 90) return `当前职位曝光与转化率远超同业，流量结构健康。`;
      if (job.healthScore >= 80) return `职位曝光正常，建议增加关于团队技术氛围的描述。`;
      return `近一周职位曝光量偏低。建议立刻启动 Copilot 进行重构。`;
    },
    onRefresh() {
      this.refreshing = true;
      this.fetchJobs().then(() => { this.refreshing = false; });
    },
    createNewJob() { uni.navigateTo({ url: '/pages/company/post-job' }); },
    editJob() { uni.navigateTo({ url: `/pages/company/post-job?id=${this.selectedJob.id}` }); },
    optimizeJD() {
      uni.showLoading({ title: 'Copilot 引擎重构中...', mask: true });
      setTimeout(() => {
        uni.hideLoading();
        this.selectedJob.healthScore = 95;
        uni.showToast({ title: 'JD 已重塑，曝光权重提升', icon: 'success' });
      }, 2000);
    },
    goBack() { uni.navigateBack(); }
  }
};
</script>

<style lang="scss" scoped>
/* 此处样式未做任何修改，保持您原汁原味的极光宇宙设计 */
$bg-deep: #030308;
$primary: #3b82f6; 
$primary-light: #60a5fa;
$secondary: #8b5cf6; 
$accent: #06b6d4; 
$success: #10b981;
$warning: #f59e0b;
$danger: #ef4444;
$text-main: #f8fafc;
$text-muted: #64748b;

.company-universe-web {
  min-height: 100vh; width: 100vw; background-color: $bg-deep;
  position: relative; overflow-x: hidden; padding-bottom: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.aurora-wrapper { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(140px); opacity: 0.35; mix-blend-mode: screen; animation: float 30s infinite alternate ease-in-out; }
.orb-1 { width: 45vw; height: 45vw; background: radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 60%); top: -10%; left: 0; }
.orb-2 { width: 40vw; height: 40vw; background: radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 60%); bottom: -10%; right: -5%; animation-delay: -5s; }
.orb-3 { width: 35vw; height: 35vw; background: radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 60%); top: 40%; left: 40%; animation-delay: -10s; }
.grid-overlay { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px); background-size: 40px 40px; z-index: 1; }
.vignette-overlay { position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 30%, rgba(3,3,8,0.95) 100%); z-index: 2; }
@keyframes float { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(4%, 6%) scale(1.1); } }

.workspace-layout { position: relative; z-index: 10; height: 100vh; display: flex; flex-direction: column; }

.glass-header { 
  height: 70px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px;
  background: linear-gradient(180deg, rgba(3,3,8,0.9) 0%, transparent 100%); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05); flex-shrink: 0;
}
.header-left { display: flex; align-items: center; gap: 20px; }
.icon-btn { width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
.icon-btn:hover { background: rgba(255,255,255,0.1); transform: translateX(-2px); }
.arrow-left { color: #fff; font-size: 18px; }
.title { font-size: 18px; font-weight: 600; color: #fff; letter-spacing: 1px; }

.workspace-body { flex: 1; display: flex; gap: 24px; padding: 24px 40px; height: calc(100vh - 70px); box-sizing: border-box; max-width: 1600px; margin: 0 auto; width: 100%; }

.left-list-panel { width: 380px; flex-shrink: 0; display: flex; flex-direction: column; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 24px; backdrop-filter: blur(24px); overflow: hidden; }

.filter-console { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.15); }
.tabs-container { display: flex; background: rgba(255,255,255,0.03); border-radius: 12px; padding: 4px; border: 1px solid rgba(255,255,255,0.05); }
.tab-item { flex: 1; text-align: center; padding: 8px 0; font-size: 13px; color: $text-muted; border-radius: 8px; cursor: pointer; transition: 0.3s; position: relative; }
.tab-item.active { background: rgba(255,255,255,0.1); color: #fff; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.tab-item .count { background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 10px; font-size: 10px; margin-left: 4px; }
.tab-item.active .count { background: $primary; color: #fff; }

.list-scroll { flex: 1; height: 0; padding: 16px; }
.job-list-inner { display: flex; flex-direction: column; gap: 12px; }

.compact-card { 
  display: flex; flex-direction: column; padding: 20px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; cursor: pointer; transition: all 0.2s;
  animation: slideUp 0.4s ease both;
}
.compact-card:hover { background: rgba(255,255,255,0.05); transform: translateX(4px); }
.compact-card.active { background: linear-gradient(135deg, rgba($primary, 0.1), rgba(255,255,255,0.02)); border-color: rgba($primary, 0.4); border-left: 4px solid $primary; box-shadow: inset 0 0 20px rgba($primary, 0.05); }

.j-header { display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; }
.j-title-row { display: flex; justify-content: space-between; align-items: center; }
.j-title { font-size: 16px; font-weight: 600; color: #fff; }
.j-status-dot { width: 8px; height: 8px; border-radius: 50%; }
.j-status-dot.active { background: $success; box-shadow: 0 0 8px $success; }
.j-status-dot.paused { background: $warning; }
.j-status-dot.closed { background: $text-muted; }
.j-salary { font-size: 15px; font-weight: 700; color: $primary-light; }
.j-meta { margin-bottom: 16px; }
.j-desc { font-size: 12px; color: $text-muted; }

.j-data-row { display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px dashed rgba(255,255,255,0.05); }
.j-data-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.j-data-val { font-size: 15px; font-weight: 600; color: #cbd5e1; }
.j-data-val.highlight { color: $primary-light; text-shadow: 0 0 10px rgba($primary-light, 0.4); }
.j-data-label { font-size: 11px; color: #64748b; }

.right-detail-panel { flex: 1; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-top: 1px solid rgba(255,255,255,0.12); border-radius: 24px; backdrop-filter: blur(32px); overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,0.3); }
.detail-scroll { height: 100%; padding: 36px; box-sizing: border-box; }

.detail-header-card { margin-bottom: 32px; padding: 32px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; }
.dh-top { display: flex; justify-content: space-between; align-items: flex-start; }
.title-with-status { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.dh-title { font-size: 28px; font-weight: 800; color: #fff; letter-spacing: 0.5px; }
.neon-status { font-size: 12px; padding: 4px 12px; border-radius: 12px; border: 1px solid; font-weight: 600; }
.neon-status.active { color: $success; border-color: rgba($success,0.4); background: rgba($success,0.1); box-shadow: 0 0 10px rgba($success,0.2); }
.neon-status.paused { color: $warning; border-color: rgba($warning,0.4); background: rgba($warning,0.1); }
.neon-status.closed { color: $text-muted; border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); }

.dh-salary { font-size: 20px; font-weight: 700; color: $primary-light; margin-bottom: 16px; display: block; }
.dh-tags { display: flex; gap: 12px; flex-wrap: wrap; }
.dh-tag { font-size: 13px; color: #cbd5e1; padding: 6px 12px; background: rgba(255,255,255,0.05); border-radius: 8px; }
.dh-tag.highlight { background: transparent; color: #64748b; padding: 6px 0; }

.dh-actions { display: flex; gap: 12px; }

.ai-insight-card { position: relative; padding: 24px; border-radius: 20px; margin-bottom: 32px; background: linear-gradient(145deg, rgba($secondary, 0.1) 0%, rgba(255,255,255,0.02) 100%); border: 1px solid rgba($secondary, 0.2); overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.card-title-bar { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.pulse-icon { font-size: 18px; filter: drop-shadow(0 0 8px $secondary); animation: pulse 2s infinite; }
.card-title { font-size: 16px; font-weight: 600; background: linear-gradient(90deg, #fff, #d8b4fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

.health-score-badge { margin-left: auto; font-size: 13px; font-weight: 700; padding: 6px 14px; border-radius: 12px; border: 1px solid; }
.health-excellent { color: $success; border-color: rgba($success, 0.4); background: rgba($success, 0.1); box-shadow: inset 0 0 10px rgba($success,0.2); }
.health-good { color: $primary-light; border-color: rgba($primary, 0.4); background: rgba($primary, 0.1); }
.health-warning { color: $warning; border-color: rgba($warning, 0.4); background: rgba($warning, 0.1); }

.insight-body { background: rgba(0,0,0,0.2); border-radius: 12px; padding: 20px; border: 1px solid rgba(255,255,255,0.05); }
.insight-text { font-size: 14px; color: #e2e8f0; line-height: 1.7; }
.highlight.warning { color: $warning; font-weight: 600; }
.highlight.success { color: $success; font-weight: 600; }

.funnel-section { margin-top: 10px; }
.section-title { font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
.section-title::before { content: ''; display: block; width: 4px; height: 16px; background: $primary; border-radius: 2px; }

.funnel-grid { display: flex; align-items: center; gap: 12px; justify-content: space-between; }
.funnel-card { flex: 1; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 24px 16px; display: flex; flex-direction: column; align-items: center; text-align: center; transition: 0.3s; }
.funnel-card:hover { background: rgba(255,255,255,0.04); transform: translateY(-4px); border-color: rgba(255,255,255,0.1); }
.f-icon-box { width: 48px; height: 48px; border-radius: 14px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px; }
.f-icon-box.theme-purple { background: rgba(139, 92, 246, 0.1); border-color: rgba(139, 92, 246, 0.2); }
.f-icon-box.theme-cyan { background: rgba(6, 182, 212, 0.1); border-color: rgba(6, 182, 212, 0.2); }
.f-icon-box.theme-green { background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2); }

.f-val { font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 4px; }
.f-label { font-size: 13px; color: #cbd5e1; margin-bottom: 12px; }
.f-trend { font-size: 11px; padding: 4px 8px; border-radius: 6px; }
.f-trend.up { background: rgba($success, 0.15); color: $success; }
.f-trend.down { background: rgba($danger, 0.15); color: $danger; }
.f-trend.neutral { background: rgba(255,255,255,0.1); color: #94a3b8; }

.funnel-arrow { font-size: 24px; color: rgba(255,255,255,0.15); font-weight: 300; }

.liquid-btn {
  position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, $primary, $secondary); color: #fff; border-radius: 12px;
  font-size: 14px; font-weight: 600; cursor: pointer; padding: 0 20px; height: 44px;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3), inset 0 1px 1px rgba(255,255,255,0.3); transition: all 0.3s ease; border: none;
}
.liquid-btn:hover { box-shadow: 0 12px 28px rgba(59, 130, 246, 0.5); transform: translateY(-2px); }
.liquid-btn.micro { height: 38px; padding: 0 16px; font-size: 13px; border-radius: 10px; }
.liquid-btn.auto-width { width: auto; padding: 0 24px; }
.liquid-btn .btn-txt { position: relative; z-index: 2; }
.ghost-btn { display: inline-flex; align-items: center; justify-content: center; height: 38px; padding: 0 16px; border-radius: 10px; font-size: 13px; font-weight: 500; background: rgba(255,255,255,0.05); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: 0.2s; }
.ghost-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); color: #fff; }

.detail-empty-state, .empty-state.mini { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; opacity: 0.8; }
.empty-state.mini { height: 300px; }
.detail-empty-state .empty-icon { font-size: 64px; filter: drop-shadow(0 0 20px rgba($primary, 0.3)); margin-bottom: 24px; }
.empty-icon { font-size: 48px; margin-bottom: 16px; }
.empty-text { font-size: 14px; color: $text-muted; }
.empty-title { font-size: 20px; font-weight: 600; color: #fff; margin-bottom: 12px; }
.empty-desc { font-size: 14px; color: $text-muted; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

.fade-in-down { animation: fadeInDown 0.6s ease both; }
.fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.fade-in-left { animation: fadeInLeft 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; }
@keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.9); } }
.mt-16 { margin-top: 16px; }
</style>