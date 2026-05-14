<template>
  <view class="student-universe-web">
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
          <view class="icon-btn" @click="logout" title="退出系统">
            <text class="arrow-left">🚪</text>
          </view>
          
          <view class="logo-box">
            <text class="logo-icon">✨</text>
          </view>
          <view class="title-box">
            <text class="title">AI 职引未来</text>
            <text class="subtitle">Student Portal</text>
          </view>
        </view>

        <view class="header-right">
          <view class="nav-item" @click="goToCommunity">职场情报局</view>
          <view class="nav-item" @click="goToMatchResult">投递记录</view>
          <view class="nav-item active">发现机会</view>
          <view class="profile-btn hover-lift" @click="goToProfile">
            <view class="profile-avatar">
              <text>👤</text>
              <view class="avatar-ring"></view>
            </view>
            <text class="greeting-text">你好，{{ userName }}</text>
          </view>
        </view>
      </view>
      
      <view class="workspace-body">
        
        <view class="left-main-panel">
          <scroll-view class="main-scroll custom-scrollbar" scroll-y>
            <view class="main-content-inner">
              
              <view class="hero-upload-card fade-in-up delay-1" @click="goToUploadResume">
                <view class="hero-bg-glow"></view>
                <view class="hero-content">
                  <view class="hero-text-area">
                    <text class="h-title">构建你的 AI 数字分身</text>
                    <text class="h-desc">上传 PDF 简历，唤醒底层大模型。我将为你精准解析经历亮点，并全网匹配最契合的实习与校招岗位。</text>
                    <view class="liquid-btn micro mt-16">
                      <text class="btn-txt">📄 立即上传 / 更新简历</text>
                    </view>
                  </view>
                  <view class="hero-icon-area">
                    <view class="radar-box">
                      <view class="radar-circle c1"></view>
                      <view class="radar-circle c2"></view>
                      <view class="radar-circle c3"></view>
                      <text class="radar-icon">🧬</text>
                    </view>
                  </view>
                </view>
              </view>
              
              <view class="recommendation-section fade-in-up delay-2">
                <view class="section-header">
                  <view class="section-title-container">
                    <text class="section-icon">💼</text>
                    <text class="section-title">为你精准推荐</text>
                  </view>
                  <view class="ghost-btn outline micro" @click="handleBatchMatch">
                    <text>🔄 重新智能匹配</text>
                  </view>
                </view>
                
                <view class="empty-jobs-state ultra-glass-card" v-if="recommendedJobs.length === 0 && !isLoading">
                  <text class="empty-icon">📭</text>
                  <text class="empty-text">AI 引擎正在待命</text>
                  <text class="empty-sub">请先上传简历，或点击右上角「重新智能匹配」获取机会</text>
                  <view class="liquid-btn micro mt-16" @click="goToUploadResume">
                     <text class="btn-txt">去上传简历</text>
                  </view>
                </view>

                <view class="jobs-grid" v-else>
                  <view 
                    v-for="(job, index) in recommendedJobs" 
                    :key="index" 
                    class="ultra-glass-card job-card hover-lift"
                    :style="`animation-delay: ${0.2 + index * 0.1}s;`"
                    @click="viewJobDetail(job)"
                  >
                    <view class="match-badge" :style="getMatchStyle(job.matchRate)">
                      <view class="match-ring-wrapper">
                        <svg class="ring-svg" viewBox="0 0 36 36">
                          <path class="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="3" />
                          <path class="ring-progress" :stroke-dasharray="`${job.matchRate}, 100`" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" :stroke="getMatchColor(job.matchRate)" stroke-width="3" stroke-linecap="round" />
                        </svg>
                        <text class="match-rate">{{ job.matchRate }}<text class="m-percent">%</text></text>
                      </view>
                      <view class="glow-bg"></view>
                    </view>

                    <view class="j-body">
                      <view class="j-header">
                        <text class="j-title">{{ job.title }}</text>
                        <text class="j-salary">{{ job.salary }}</text>
                      </view>
                      <view class="j-company-info">
                        <text class="c-icon">🏢</text>
                        <text class="c-name">{{ job.company }}</text>
                        <text class="c-type">{{ job.type }}</text>
                      </view>
                      <view class="j-location">
                        <text class="l-icon">📍</text>
                        <text class="l-text">{{ job.location }}</text>
                      </view>
                      <view class="j-skills" v-if="job.tags.length > 0">
                        <view v-for="(tag, tagIndex) in job.tags" :key="tagIndex" class="neon-tag ghost">
                          {{ tag }}
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>

              <view class="safe-area-bottom"></view>
            </view>
          </scroll-view>
        </view>

        <view class="right-sidebar-panel fade-in-left delay-3">
          <view class="liquid-ai-card sticky-sidebar">
            <view class="liquid-bg"></view>
            
            <view class="ai-card-content vertical-mode">
              <view class="assistant-header-v">
                <view class="ai-avatar-glow">
                  <text class="ai-icon">🤖</text>
                </view>
                <text class="assistant-title">AI 职业导师</text>
                <view class="ai-status-badge">
                  <text class="status-dot pulse"></text> 实时辅导中
                </view>
              </view>
              
              <view class="divider"></view>
              
              <scroll-view class="assistant-body-v custom-scrollbar" scroll-y>
                
                <view class="insight-block primary">
                  <view class="insight-title">💡 今日求职洞察</view>
                  <view class="message-text">
                    {{ dailyInsight }}
                  </view>
                </view>

                <view class="tools-section mt-16">
                  <text class="tools-title">⚡ 赋能工具库</text>
                  
                  <view class="tool-card hover-lift" @click="goToAIPolish">
                    <view class="t-icon-box theme-purple"><text>📝</text></view>
                    <view class="t-info">
                      <text class="t-name">简历智能润色</text>
                      <text class="t-desc">一键重写“STAR”法则</text>
                    </view>
                    <text class="t-arrow">›</text>
                  </view>
                  
                  <view class="tool-card hover-lift" @click="goToMatchResult">
                    <view class="t-icon-box theme-cyan"><text>🎯</text></view>
                    <view class="t-info">
                      <text class="t-name">人岗匹配诊断</text>
                      <text class="t-desc">雷达图透视能力短板</text>
                    </view>
                    <text class="t-arrow">›</text>
                  </view>

                  <view class="tool-card hover-lift" @click="goToMockInterview">
                    <view class="t-icon-box theme-green"><text>🎙️</text></view>
                    <view class="t-info">
                      <text class="t-name">Copilot 模拟面试</text>
                      <text class="t-desc">全真题库，语音对练</text>
                    </view>
                    <text class="t-arrow">›</text>
                  </view>
                </view>

              </scroll-view>
              
              <view class="assistant-footer">
                <view class="ai-typing-indicator">导师正在关注市场最新动态...</view>
              </view>
            </view>
          </view>
        </view>
        
      </view>
    </view>
  </view>
</template>

<script>
// 🚀 1. 引入全局 API 接口
import { API } from '../../utils/api.js';

export default {
  data() {
    return {
      userName: '同学',
      recommendedJobs: [], 
      isLoading: false,
      // 🚀 提取静态假数据到状态中，以后随时可以接后端动态接口
      dailyInsight: '完善您的 AI 数字分身，能够提升推荐准确率，并为您解锁更多与您技能相匹配的隐藏高潜岗位。'
    }
  },
  onShow() {
    // 页面每次显示时，刷新用户名和真实岗位列表
    const userInfo = uni.getStorageSync('user_info');
    if (userInfo && userInfo.username) {
      this.userName = userInfo.username;
    }
    this.fetchRecommendedJobs();
  },
  mounted() {
    // 兼容 Web 端的生命周期
    this.fetchRecommendedJobs();
  },
  methods: {
    getMatchStyle(rate) { return { '--match-color': this.getMatchColor(rate) } },
    getMatchColor(rate) {
      if (rate >= 90) return '#10b981';
      if (rate >= 80) return '#3b82f6';
      return '#f59e0b';
    },

    // 🚀 2. 真实数据拉取逻辑：从 Django 获取匹配记录，并装载“万能 ID 提取器”
    async fetchRecommendedJobs() {
      this.isLoading = true;
      try {
        const res = await API.getMatchResults();
        const records = res.data?.data || res.data?.results || res.data || res.results || res || [];

        if (records && records.length > 0) {
          this.recommendedJobs = records.map(item => {
            // 🚀 剔除假关键词兜底
            const keywordArray = item.job_keywords ? item.job_keywords.split(',').slice(0, 3) : [];
            const jobData = item.job || {};
            
            return {
              // 🚀 万能 ID 提取器
              id: (typeof item.job === 'string' ? item.job : null) || jobData?.job_id || jobData?.id || item.job_id || item.id,
              resume_id: item.resume?.resume_id || item.resume?.id || item.resume_id, 
              // 🚀 剔除写死的兜底名称
              title: jobData.job_name || item.job_name || '未知岗位',
              company: jobData.company?.company_name || jobData.company?.username || item.company_name || '未知企业', 
              salary: jobData.salary || item.salary || '面议',
              type: jobData.experience || item.experience || '经验不限',
              location: jobData.job_location || item.job_location || '全国',
              tags: keywordArray,
              matchRate: item.match_score || parseInt(item.sort_weight * 100) || 0
            };
          });
        } else {
          this.recommendedJobs = [];
        }
      } catch (error) {
        console.error('获取岗位失败:', error);
        uni.showToast({ title: '网络开小差了', icon: 'none' });
      } finally {
        this.isLoading = false;
      }
    },

    // 🚀 3. 新增核心功能：一键触发 AI 大模型批量匹配
    async handleBatchMatch() {
      const resumeId = uni.getStorageSync('current_resume_id');
      
      if (!resumeId) {
        uni.showModal({
          title: '温馨提示',
          content: '请先在左侧构建数字分身（上传简历），引擎才能为您精准匹配。',
          confirmText: '去上传',
          success: (res) => { if (res.confirm) this.goToUploadResume(); }
        });
        return;
      }

      uni.showLoading({ title: 'AI引擎全网检索中...', mask: true });
      try {
        const res = await API.batchMatchJobs({ resume_id: resumeId });
        uni.hideLoading();
        
        if (res.code === 200 || res.statusCode === 200) {
           uni.showToast({ title: '匹配成功！', icon: 'success' });
           this.fetchRecommendedJobs();
        } else {
           uni.showToast({ title: res.msg || '匹配失败', icon: 'none' });
        }
      } catch (error) {
        uni.hideLoading();
        console.error('批量匹配报错:', error);
        uni.showToast({ title: '匹配超时，大模型排队中', icon: 'none' });
      }
    },

    logout() {
      uni.showModal({
        title: '退出登录',
        content: '确定要退出当前账号返回登录页吗？',
        confirmColor: '#ef4444',
        success: (res) => {
          if (res.confirm) {
            // 清理缓存
            uni.clearStorageSync();
            uni.reLaunch({ url: '/pages/auth/login' });
          }
        }
      });
    },

    goToCommunity() { uni.navigateTo({ url: '/pages/student/community' }); },
    goToMockInterview() { uni.navigateTo({ url: '/pages/student/mock-interview' }); },
    goToUploadResume() { uni.navigateTo({ url: '/pages/student/upload-resume' }); },
    goToProfile() { uni.navigateTo({ url: '/pages/student/profile' }); },
    goToAIPolish() { uni.navigateTo({ url: '/pages/student/ai-polish' }); },
    goToMatchResult() { uni.navigateTo({ url: '/pages/student/match-result' }); },
    
    // 🚀 安全跳转至详情页逻辑
    viewJobDetail(job) { 
      const targetId = job.id || job.job_id;
      
      if (!targetId || targetId === 'undefined') {
          uni.showToast({ title: '岗位数据异常，无法查看', icon: 'none' });
          console.error("❌ 错误：这个岗位的 ID 是空的！完整数据为：", job);
          return;
      }
      
      uni.navigateTo({
        url: `/pages/student/job-detail?id=${targetId}`
      });
    },
  }
}
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
$danger: #ef4444;
$text-main: #f8fafc;
$text-secondary: #cbd5e1; 
$text-muted: #94a3b8;

/* ==================== 极光背景 ==================== */
.student-universe-web {
  min-height: 100vh; width: 100vw; background-color: $bg-deep; position: relative; overflow-x: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.aurora-wrapper { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(140px); opacity: 0.35; mix-blend-mode: screen; animation: float 30s infinite alternate ease-in-out; }
.orb-1 { width: 50vw; height: 50vw; background: radial-gradient(circle, rgba($primary,0.3) 0%, transparent 60%); top: -10%; left: -10%; }
.orb-2 { width: 45vw; height: 45vw; background: radial-gradient(circle, rgba($secondary,0.2) 0%, transparent 60%); bottom: -10%; right: -5%; animation-delay: -5s; }
.orb-3 { width: 35vw; height: 35vw; background: radial-gradient(circle, rgba($accent,0.15) 0%, transparent 60%); top: 30%; left: 40%; animation-delay: -10s; }
.grid-overlay { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px); background-size: 40px 40px; z-index: 1; }
.vignette-overlay { position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 30%, rgba(3,3,8,0.95) 100%); z-index: 2; }
@keyframes float { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(4%, 6%) scale(1.1); } }

/* ==================== 核心布局 ==================== */
.workspace-layout { position: relative; z-index: 10; height: 100vh; display: flex; flex-direction: column; }

/* 顶部导航 */
.glass-header { 
  height: 70px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px;
  background: linear-gradient(180deg, rgba(3,3,8,0.9) 0%, transparent 100%); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05); flex-shrink: 0;
}
.header-left { display: flex; align-items: center; gap: 12px; }
.icon-btn { width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; color: #fff; font-size: 18px; flex-shrink: 0; }
.icon-btn:hover { background: rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.4); transform: translateX(-2px); color: #ef4444; }
.logo-box { width: 40px; height: 40px; border-radius: 12px; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); display: flex; align-items: center; justify-content: center; }
.logo-icon { font-size: 20px; filter: drop-shadow(0 0 8px $primary); }
.title-box { display: flex; flex-direction: column; }
.title { font-size: 18px; font-weight: 700; color: #fff; letter-spacing: 1px; }
.subtitle { font-size: 11px; color: $primary-light; }

.header-right { display: flex; align-items: center; gap: 32px; }
.nav-item { font-size: 14px; font-weight: 500; color: $text-muted; cursor: pointer; transition: 0.3s; position: relative; }
.nav-item:hover { color: #fff; }
.nav-item.active { color: #fff; }
.nav-item.active::after { content: ''; position: absolute; bottom: -24px; left: 50%; transform: translateX(-50%); width: 24px; height: 3px; background: $primary; border-radius: 2px; box-shadow: 0 -2px 10px $primary; }

.profile-btn { display: flex; align-items: center; gap: 12px; padding: 6px 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 30px; cursor: pointer; transition: 0.3s; }
.greeting-text { font-size: 14px; font-weight: 500; color: #e2e8f0; }
.profile-avatar { width: 32px; height: 32px; border-radius: 50%; background: rgba(59,130,246,0.15); display: flex; align-items: center; justify-content: center; position: relative; font-size: 16px; }
.avatar-ring { position: absolute; inset: -3px; border-radius: 50%; border: 1px dashed rgba(59,130,246,0.5); animation: rotate 4s linear infinite; }
@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* 工作区主体 */
.workspace-body { flex: 1; display: flex; gap: 32px; padding: 24px 40px; height: calc(100vh - 70px); box-sizing: border-box; max-width: 1440px; margin: 0 auto; width: 100%; }

/* ==================== 左侧：求职主舞台 ==================== */
.left-main-panel { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.main-scroll { height: 100%; }
.main-content-inner { padding-right: 16px; display: flex; flex-direction: column; gap: 40px; }

/* Hero Banner：上传简历 */
.hero-upload-card {
  position: relative; border-radius: 24px; padding: 40px; overflow: hidden; cursor: pointer;
  background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
  border: 1px solid rgba(255,255,255,0.06); border-top: 1px solid rgba(255,255,255,0.15);
  box-shadow: 0 16px 40px rgba(0,0,0,0.4); backdrop-filter: blur(20px); transition: 0.3s;
}
.hero-upload-card:hover { transform: translateY(-4px); border-color: rgba(59,130,246,0.3); box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 0 40px rgba(59,130,246,0.1); }
.hero-bg-glow { position: absolute; right: -50px; top: -50px; width: 300px; height: 300px; background: radial-gradient(circle, rgba($primary,0.15) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
.hero-content { display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 2; }
.hero-text-area { flex: 1; display: flex; flex-direction: column; gap: 12px; }
.h-title { font-size: 28px; font-weight: 800; color: #fff; letter-spacing: 0.5px; }
.h-desc { font-size: 15px; color: #cbd5e1; line-height: 1.6; max-width: 80%; }
.radar-box { width: 100px; height: 100px; position: relative; display: flex; align-items: center; justify-content: center; margin-right: 40px; }
.radar-icon { font-size: 40px; z-index: 2; filter: drop-shadow(0 0 10px rgba($primary, 0.5)); }
.radar-circle { position: absolute; inset: 0; border-radius: 50%; border: 1px solid rgba($primary, 0.4); animation: radarPulse 3s infinite; }
.c2 { animation-delay: 1s; } .c3 { animation-delay: 2s; }
@keyframes radarPulse { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(1.8); opacity: 0; } }

/* 推荐岗位区 */
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.section-title-container { display: flex; align-items: center; gap: 12px; }
.section-icon { font-size: 22px; filter: drop-shadow(0 0 8px rgba(255,255,255,0.2)); }
.section-title { font-size: 20px; font-weight: 600; color: #fff; letter-spacing: 0.5px; }

/* 新增的空状态 UI */
.empty-jobs-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 60px 20px; text-align: center; border-radius: 20px;
  background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1);
}
.empty-icon { font-size: 48px; opacity: 0.8; margin-bottom: 16px; filter: drop-shadow(0 0 10px rgba(59,130,246,0.3)); }
.empty-text { font-size: 18px; font-weight: 600; color: #e2e8f0; margin-bottom: 8px; }
.empty-sub { font-size: 14px; color: #94a3b8; max-width: 80%; line-height: 1.6; }

/* 双列网格卡片 */
.jobs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.ultra-glass-card {
  background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
  backdrop-filter: blur(32px); border: 1px solid rgba(255,255,255,0.05);
  border-top: 1px solid rgba(255,255,255,0.1); border-left: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px; position: relative; transition: all 0.3s ease;
}
.hover-lift:hover { transform: translateY(-4px); background: rgba(255,255,255,0.05); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }

.job-card { padding: 24px; display: flex; flex-direction: column; overflow: hidden; cursor: pointer; }
.match-badge { position: absolute; top: -10px; right: -10px; width: 80px; height: 80px; }
.glow-bg { position: absolute; inset: 0; background: radial-gradient(circle, var(--match-color) 0%, transparent 60%); opacity: 0.15; z-index: 0; }
.match-ring-wrapper { position: relative; width: 60px; height: 60px; margin: 10px; z-index: 1; }
.ring-svg { transform: rotate(-90deg); width: 100%; height: 100%; }
.ring-progress { transition: stroke-dasharray 1s ease-out; filter: drop-shadow(0 0 4px var(--match-color)); }
.match-rate { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 15px; font-weight: 700; color: #fff; }
.m-percent { font-size: 10px; opacity: 0.8; }

.j-body { position: relative; z-index: 2; padding-right: 40px; }
.j-header { margin-bottom: 16px; display: flex; flex-direction: column; gap: 6px; }
.j-title { font-size: 18px; font-weight: 600; color: #fff; }
.j-salary { font-size: 15px; font-weight: 700; color: $success; }

.j-company-info, .j-location { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 13px; color: #cbd5e1; }
.c-type { background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 6px; font-size: 11px; border: 1px solid rgba(255,255,255,0.1); }
.j-skills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.neon-tag.ghost { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 8px; font-size: 12px; color: #94a3b8; transition: 0.2s; }
.job-card:hover .neon-tag.ghost { border-color: rgba($primary, 0.3); color: #cbd5e1; }


/* ==================== 右侧：AI 职业导师舱 ==================== */
.right-sidebar-panel { width: 360px; flex-shrink: 0; }
.sticky-sidebar { position: sticky; top: 0; height: 100%; }

.liquid-ai-card {
  position: relative; border-radius: 24px; padding: 1px; box-sizing: border-box; height: 100%;
  background: linear-gradient(135deg, rgba(59,130,246,0.5), rgba(139,92,246,0.5), rgba(6,182,212,0.5));
  background-size: 200% 200%; animation: gradientFlow 6s linear infinite;
  box-shadow: 0 24px 48px -10px rgba(139,92,246,0.2); display: flex; flex-direction: column;
}
@keyframes gradientFlow { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }

.vertical-mode { background: #070A12; border-radius: 23px; display: flex; flex-direction: column; flex: 1; height: 100%; overflow: hidden; }
.assistant-header-v { display: flex; flex-direction: column; align-items: center; padding: 32px 24px 24px; text-align: center; }
.ai-avatar-glow { width: 64px; height: 64px; border-radius: 20px; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 20px rgba(139, 92, 246, 0.2), 0 0 20px rgba(139, 92, 246, 0.1); margin-bottom: 16px; position: relative; }
.ai-icon { font-size: 28px; filter: drop-shadow(0 0 10px rgba(255,255,255,0.6)); }
.assistant-title { font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 12px; letter-spacing: 0.5px; }
.ai-status-badge { font-size: 12px; color: $secondary-light; padding: 6px 14px; background: rgba(139, 92, 246, 0.15); border-radius: 20px; border: 1px solid rgba(139, 92, 246, 0.2); display: flex; align-items: center; gap: 8px; font-weight: 500; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: $secondary-light; }

.divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); }

.assistant-body-v { flex: 1; padding: 24px; height: 0; }
.insight-block { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 20px; margin-bottom: 16px; }
.insight-block.primary { background: linear-gradient(180deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.03) 100%); border-color: rgba(139, 92, 246, 0.2); box-shadow: inset 0 2px 10px rgba(139, 92, 246, 0.05); }
.insight-title { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 12px; }
.message-text { font-size: 14px; color: #cbd5e1; line-height: 1.7; }
.highlight-text { color: #d8b4fe; font-weight: 600; }

.tools-title { font-size: 14px; font-weight: 600; color: #94a3b8; display: block; margin-bottom: 16px; padding-left: 4px; }
.tool-card { display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; margin-bottom: 12px; cursor: pointer; transition: 0.3s; }
.tool-card:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.15); }
.t-icon-box { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
.theme-purple { background: rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.3); }
.theme-cyan { background: rgba(6,182,212,0.1); border-color: rgba(6,182,212,0.3); }
.theme-green { background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.3); }
.t-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.t-name { font-size: 15px; font-weight: 600; color: #e2e8f0; }
.t-desc { font-size: 12px; color: #64748b; }
.t-arrow { color: rgba(255,255,255,0.2); font-size: 20px; transition: 0.3s; }
.tool-card:hover .t-arrow { transform: translateX(4px); color: $primary; }

.assistant-footer { padding: 16px 24px; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.03); text-align: center; }
.ai-typing-indicator { font-size: 12px; color: rgba(255,255,255,0.3); font-style: italic; animation: pulse 2s infinite; }

/* ==================== 通用组件与动画 ==================== */
.liquid-btn {
  display: inline-flex; align-items: center; justify-content: center; height: 40px; padding: 0 20px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; color: #fff;
  background: linear-gradient(135deg, $primary, $secondary); box-shadow: 0 8px 20px rgba($primary, 0.3); transition: 0.3s; border: none;
}
.liquid-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba($primary, 0.5); }
.liquid-btn.micro { height: 38px; padding: 0 20px; font-size: 14px; border-radius: 12px; }
.ghost-btn.outline { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: #cbd5e1; height: 32px; padding: 0 16px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 13px; cursor: pointer; transition: 0.2s; }
.ghost-btn.outline:hover { background: rgba(255,255,255,0.05); color: #fff; border-color: rgba(255,255,255,0.3); }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }

/* 完美动画防丢方案 */
.fade-in-down { animation: fadeInDown 0.6s ease both; }
.fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.fade-in-left { animation: fadeInLeft 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; } .delay-3 { animation-delay: 0.3s; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.9); } }
.mt-16 { margin-top: 16px; }
.safe-area-bottom { height: 40px; }
</style>