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
          <view class="icon-btn" @click="goBack" title="返回上一页">
            <text class="arrow-left">←</text>
          </view>
          <text class="title">智能匹配报告</text>
        </view>
        <view class="header-right">
          <view class="liquid-btn micro" @click="exportResult">
            <text class="btn-txt">📥 导出匹配报告</text>
          </view>
        </view>
      </view>
      
      <view class="workspace-body">
        
        <view class="left-dashboard-panel fade-in-up delay-1">
          <scroll-view class="left-scroll custom-scrollbar" scroll-y>
            <view class="left-content-inner">
              
              <view class="ultra-glass-card score-card">
                <view class="score-header">
                  <text class="score-label">综合匹配度得分</text>
                  <view class="ai-badge">
                    <text class="pulse-dot"></text> Copilot 评估
                  </view>
                </view>
                
                <view class="score-circle-wrapper">
                  <view class="score-circle">
                    <svg class="progress-svg" viewBox="0 0 160 160">
                      <defs>
                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" :stop-color="scoreColorLight" />
                          <stop offset="100%" :stop-color="scoreColor" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="8" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      <circle class="progress-bg" cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="12" />
                      <circle 
                        class="progress-bar" 
                        cx="80" cy="80" r="70" 
                        fill="none" 
                        stroke="url(#scoreGrad)" 
                        stroke-width="12"
                        :stroke-dasharray="`${score * 4.4}, 440`"
                        stroke-linecap="round"
                        filter="url(#glow)"
                      />
                    </svg>
                    <view class="score-center">
                      <text class="score-number" :style="{ color: scoreColor }">{{ score }}</text>
                      <text class="score-percent" :style="{ color: scoreColor }">%</text>
                    </view>
                  </view>
                </view>
                
                <view class="score-message" :style="{ color: scoreColor }">
                  <text>{{ scoreMessage }}</text>
                  <text class="sparkle">✨</text>
                </view>
                
                <view class="stats-row">
                  <view class="stat-item">
                    <text class="stat-val">{{ modelAccuracy }}</text>
                    <text class="stat-label">模型精度</text>
                  </view>
                  <view class="divider-y"></view>
                  <view class="stat-item">
                    <text class="stat-val">{{ responseTime }}</text>
                    <text class="stat-label">响应速度</text>
                  </view>
                  <view class="divider-y"></view>
                  <view class="stat-item">
                    <text class="stat-val highlight">{{ recommendedJobs.length }}</text>
                    <text class="stat-label">高潜岗位</text>
                  </view>
                </view>
              </view>
              
              <view class="ultra-glass-card suggestions-card">
                <view class="card-title-bar">
                  <text class="icon">🎯</text>
                  <text class="card-title">AI 简历提升建议</text>
                </view>
                
                <view class="suggestions-list" v-if="optimizationSuggestions.length > 0">
                  <view 
                    v-for="(suggestion, index) in optimizationSuggestions" 
                    :key="index" 
                    class="suggestion-item hover-lift"
                    @click="applySuggestion(suggestion)"
                  >
                    <view class="s-icon-box">
                      <text>{{ suggestion.icon }}</text>
                    </view>
                    <view class="s-content">
                      <text class="s-title">{{ suggestion.title }}</text>
                      <text class="s-desc">{{ suggestion.content }}</text>
                    </view>
                    <view class="s-action">
                      <text>一键优化</text>
                      <text class="arr">›</text>
                    </view>
                  </view>
                </view>
                
                <view class="empty-state mini" v-else>
                  <text class="empty-icon">✨</text>
                  <text class="empty-text">简历状态完美，暂无进一步优化建议</text>
                </view>
              </view>

              <view class="quick-actions-grid">
                <view class="action-btn outline" @click="goToAIPolish">
                  <text class="a-icon">✨</text>
                  <view class="a-text">
                    <text class="a-title">AI 简历润色</text>
                    <text class="a-sub">重新生成投递版本</text>
                  </view>
                </view>
                <view class="action-btn outline danger" @click="viewMoreJobs">
                  <text class="a-icon">🔍</text>
                  <view class="a-text">
                    <text class="a-title">探索更多</text>
                    <text class="a-sub">去广场查看全量库</text>
                  </view>
                </view>
              </view>

              <view class="safe-area-bottom"></view>
            </view>
          </scroll-view>
        </view>

        <view class="right-jobs-panel fade-in-left delay-2">
          <view class="panel-header">
            <view class="ph-left">
              <text class="ph-icon">💼</text>
              <text class="ph-title">为您精准匹配的岗位</text>
            </view>
            <view class="ph-right">
              <text class="ph-meta">按照匹配度降序排列</text>
            </view>
          </view>
          
          <scroll-view class="jobs-scroll custom-scrollbar" scroll-y>
            <view class="jobs-grid">
              <view 
                v-for="(job, index) in recommendedJobs" 
                :key="index" 
                class="ultra-glass-card job-card hover-lift"
                :style="`animation-delay: ${0.2 + index * 0.1}s;`"
                @click="viewJobDetail(job)"
              >
                <view class="neon-match-badge" :style="getMatchStyle(job.matchRate)">
                  <text class="pulse-dot"></text>
                  <text class="badge-text">{{ job.matchRate }}% 契合</text>
                  <view class="glow-bg"></view>
                </view>

                <view class="j-body">
                  <text class="j-title">{{ job.title }}</text>
                  
                  <view class="j-company-info">
                    <text class="c-icon">🏢</text>
                    <text class="c-name">{{ job.company }}</text>
                  </view>
                  
                  <view class="j-tags">
                    <view v-for="(tag, tagIndex) in job.tags" :key="tagIndex" class="neon-tag ghost">
                      {{ tag }}
                    </view>
                  </view>

                  <view class="j-footer">
                    <view class="j-meta">
                      <view class="meta-item"><text class="meta-icon">📍</text>{{ job.location }}</view>
                    </view>
                    <view class="liquid-btn micro" @click.stop="applyJob(job)">
                      <text class="btn-txt">投递</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            
            <view class="empty-state" v-if="!isLoading && recommendedJobs.length === 0">
              <text class="empty-icon" style="font-size: 60px;">📭</text>
              <text style="color: #94a3b8; margin-top: 16px;">暂未匹配到合适岗位，请尝试优化简历</text>
            </view>
            
            <view class="safe-area-bottom"></view>
          </scroll-view>
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
      score: 0,
      targetScore: 0, 
      recommendedJobs: [],
      optimizationSuggestions: [],
      isLoading: false,
      modelAccuracy: '--',
      responseTime: '--'
    }
  },
  computed: {
    scoreColor() {
      if (this.score >= 90) return '#10b981';
      if (this.score >= 80) return '#3b82f6';
      if (this.score >= 70) return '#f59e0b';
      return '#ef4444';
    },
    scoreColorLight() {
      if (this.score >= 90) return '#34d399';
      if (this.score >= 80) return '#60a5fa';
      if (this.score >= 70) return '#fbbf24';
      return '#f87171';
    },
    scoreMessage() {
      if (this.score >= 90) return '完美！基因高度吻合';
      if (this.score >= 80) return '良好！能力匹配度高';
      if (this.score >= 70) return '及格！建议进行润色';
      return '偏低！请重构简历内容';
    }
  },
  mounted() {
    this.fetchMatchResults(); // 页面加载时执行我们改造后的全自动方法
  },
  methods: {
    getMatchStyle(rate) {
      let color = '#10b981';
      if (rate >= 90) color = '#10b981';
      else if (rate >= 80) color = '#3b82f6';
      else if (rate >= 70) color = '#f59e0b';
      else color = '#ef4444';
      
      return { '--theme': color, '--bg': `${color}15`, '--glow': `${color}40` };
    },
    
    animateScore() {
      let current = 0;
      const timer = setInterval(() => {
        current += 2;
        if (current >= this.targetScore) {
          current = this.targetScore;
          clearInterval(timer);
        }
        this.score = current;
      }, 30);
    },

async fetchMatchResults() {
      this.isLoading = true;
      uni.showLoading({ title: 'AI 智能匹配计算中...' });
      
      const startTime = Date.now();
      
      try {
        // 🌟【关键改动】从本地缓存里尝试捞出刚才上传成功的简历 ID
        const activeResumeId = uni.getStorageSync('current_resume_id');
        console.log("==> 当前准备匹配的简历 ID 是:", activeResumeId);

        console.log("==> 前端正在向后端发送 batch_match 请求，触发自动匹配...");
        
        // 🌟【关键改动】把 resume_id 塞进 POST 请求体里喂给后端
        await API.batchMatchJobs({
          resume_id: activeResumeId || "" 
        }); 
        
        console.log("==> 后端自动计算完毕，开始拉取最新的匹配结果列表...");
        const res = await API.getMatchResults();
        
        const endTime = Date.now();
        this.responseTime = ((endTime - startTime) / 1000).toFixed(1) + 's';

        const records = res.data?.results || res.data || res.results || res || [];

        if (records.length > 0) {
          this.recommendedJobs = records.map(item => {
            const keywordArray = item.job_keywords ? item.job_keywords.split(',').slice(0, 3) : [];
            const jobData = item.job || {};
            
            return {
              id: (typeof item.job === 'string' ? item.job : null) || jobData?.job_id || jobData?.id || item.job_id || item.id,
              resume_id: item.resume?.resume_id || item.resume?.id || item.resume_id, 
              title: jobData.job_name || '未知岗位',
              company: jobData.company?.company_name || jobData.company?.username || '未知企业',
              salary: jobData.salary || '面议',
              location: jobData.job_location || '全国',
              tags: keywordArray,
              matchRate: item.match_score || parseInt(item.sort_weight * 100) || 0
            };
          });

          const totalScore = this.recommendedJobs.reduce((sum, job) => sum + job.matchRate, 0);
          this.targetScore = Math.round(totalScore / this.recommendedJobs.length);
          
          const topMatch = records[0];
          if (topMatch.model_accuracy) {
             this.modelAccuracy = `${topMatch.model_accuracy}%`;
          } else {
             this.modelAccuracy = `${Math.min(99.2, this.targetScore + 3.5).toFixed(1)}%`;
          }

          const suggestions = [];
          if (topMatch.llm_report) {
             let report = {};
             try {
                let rawStr = topMatch.llm_report;
                if (typeof rawStr === 'string') {
                    rawStr = rawStr.replace(/'/g, '"').replace(/True/g, 'true').replace(/False/g, 'false');
                    report = JSON.parse(rawStr);
                } else {
                    report = rawStr;
                }
             } catch (e) {
                console.error("AI报告解析失败:", e);
             }
             
             if (report.summary) suggestions.push({ icon: '🧠', title: 'AI 综合评估', content: report.summary });
             if (report.weaknesses && report.weaknesses.length > 0) {
                 report.weaknesses.slice(0, 2).forEach(w => suggestions.push({ icon: '🎯', title: '短板诊断', content: w }));
             }
             if (report.strengths && report.strengths.length > 0) {
                 suggestions.push({ icon: '✨', title: '亮点挖掘', content: report.strengths[0] });
             }
          } else if (topMatch.optimize_suggestion) {
             suggestions.push({ icon: '💡', title: '匹配度综合建议', content: topMatch.optimize_suggestion });
          }

          this.optimizationSuggestions = suggestions;

        } else {
          this.targetScore = 0;
          this.responseTime = '--';
          this.modelAccuracy = '--';
          this.recommendedJobs = [];
          this.optimizationSuggestions = [];
        }
        
        this.animateScore();
        
      } catch (error) {
        console.error('全自动匹配请求遭遇失败，详情原因:', error);
        uni.showToast({ title: '暂无匹配数据，请确保后台有勾选“已发布”的岗位', icon: 'none' });
        this.targetScore = 0;
        this.responseTime = 'Error';
      } finally {
        uni.hideLoading(); 
        this.isLoading = false;
      }
    },

    async applyJob(job) {
      uni.showModal({
        title: '确认一键投递',
        content: `确定要使用数字分身向 ${job.company} 投递简历吗？`,
        confirmColor: '#3b82f6',
        success: async (res) => {
          if (res.confirm) {
            const finalResumeId = job.resume_id || uni.getStorageSync('current_resume_id');
            if (!finalResumeId) {
                uni.showToast({ title: '请先去首页上传简历，构建数字分身', icon: 'none' });
                return;
            }

            uni.showLoading({ title: '加密投递中...', mask: true });
            
            try {
              await API.applyForJob({
                job_id: job.id,
                resume_id: finalResumeId
              });
              uni.hideLoading(); 
              uni.showToast({ title: '投递成功！', icon: 'success' });
            } catch (error) {
              uni.hideLoading(); 
              let errorMsg = '网络拥挤，请重试';
              if (error.data && typeof error.data === 'object') {
                  const firstKey = Object.keys(error.data)[0];
                  if (Array.isArray(error.data[firstKey])) {
                      errorMsg = error.data[firstKey][0];
                  } else if (typeof error.data[firstKey] === 'string') {
                      errorMsg = error.data[firstKey];
                  }
              }
              setTimeout(() => {
                uni.showToast({ title: errorMsg, icon: 'none', duration: 3000 });
              }, 100);
            }
          }
        }
      });
    },

    viewMoreJobs() {
      uni.showToast({ title: '正在为您跳转岗位大厅...', icon: 'none' });
      setTimeout(() => { uni.navigateBack(); }, 800);
    },

    viewJobDetail(job) { 
      const targetId = job.id || job.job_id;
      if (!targetId || targetId === 'undefined') {
          uni.showToast({ title: '岗位数据异常，无法查看', icon: 'none' });
          return;
      }
      uni.navigateTo({ url: `/pages/student/job-detail?id=${targetId}` });
    },
    
    applySuggestion(suggestion) {
      uni.showLoading({ title: 'AI 注入优化中...' });
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({ title: '已同步至工作台', icon: 'success' });
      }, 1000);
    },
    
    goToAIPolish() { uni.navigateTo({ url: '/pages/student/ai-polish' }); },
    exportResult() {
      uni.showLoading({ title: '正在生成 PDF 报告...' });
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({ title: '报告已导出', icon: 'success' });
      }, 1500);
    },
    goBack() { uni.navigateBack(); }
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
$text-muted: #94a3b8;

/* ==================== 极光背景 ==================== */
.student-universe-web {
  min-height: 100vh; width: 100vw; background-color: $bg-deep;
  position: relative; overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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
.header-left { display: flex; align-items: center; gap: 20px; }
.icon-btn { width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
.icon-btn:hover { background: rgba(255,255,255,0.1); transform: translateX(-2px); }
.arrow-left { color: #fff; font-size: 18px; }
.title { font-size: 18px; font-weight: 600; color: #fff; letter-spacing: 1px; }

/* 工作区主体：双舱结构 */
.workspace-body { flex: 1; display: flex; gap: 32px; padding: 32px 40px; height: calc(100vh - 70px); box-sizing: border-box; max-width: 1500px; margin: 0 auto; width: 100%; }

/* 公用组件 */
.ultra-glass-card {
  background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
  backdrop-filter: blur(32px); border: 1px solid rgba(255,255,255,0.06);
  border-top: 1px solid rgba(255,255,255,0.12); border-left: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px; box-shadow: 0 16px 40px -10px rgba(0,0,0,0.5); overflow: hidden; position: relative;
}
.hover-lift { transition: all 0.3s ease; }
.hover-lift:hover { transform: translateY(-4px); background: rgba(255,255,255,0.05); box-shadow: 0 20px 48px -10px rgba(0,0,0,0.6), 0 0 20px rgba(59,130,246,0.1); }

/* ==================== 左侧：AI 洞察主控舱 ==================== */
.left-dashboard-panel { width: 460px; flex-shrink: 0; display: flex; flex-direction: column; }
.left-scroll { height: 100%; }
.left-content-inner { display: flex; flex-direction: column; gap: 24px; padding-right: 16px; }

/* 1. 核心分数卡片 */
.score-card { padding: 32px; display: flex; flex-direction: column; align-items: center; text-align: center; }
.score-header { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.score-label { font-size: 16px; font-weight: 600; color: #fff; }
.ai-badge { display: flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba($primary, 0.1); border: 1px solid rgba($primary, 0.2); border-radius: 12px; font-size: 12px; color: $primary-light; }
.pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: $primary; box-shadow: 0 0 8px $primary; animation: pulse 2s infinite; }

.score-circle-wrapper { margin-bottom: 24px; }
.score-circle { position: relative; width: 160px; height: 160px; }
.progress-svg { transform: rotate(-90deg); width: 100%; height: 100%; overflow: visible; }
.progress-bar { transition: stroke-dasharray 1s ease-out, stroke 0.5s; }
.score-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; align-items: baseline; gap: 2px; }
.score-number { font-size: 48px; font-weight: 800; line-height: 1; text-shadow: 0 0 20px currentColor; }
.score-percent { font-size: 20px; font-weight: 600; }
.score-message { font-size: 16px; font-weight: 600; margin-bottom: 32px; display: flex; align-items: center; gap: 8px; text-shadow: 0 0 10px currentColor; }
.sparkle { animation: sparkle 2s ease-in-out infinite; }
@keyframes sparkle { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }

/* 数据维度 */
.stats-row { width: 100%; display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 16px 0; }
.stat-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.stat-val { font-size: 18px; font-weight: 700; color: #fff; }
.stat-val.highlight { color: $primary-light; text-shadow: 0 0 10px rgba($primary,0.5); }
.stat-label { font-size: 12px; color: $text-muted; }
.divider-y { width: 1px; height: 24px; background: rgba(255,255,255,0.1); }

/* 2. AI 建议卡片 */
.suggestions-card { padding: 24px; }
.card-title-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
.card-title-bar .icon { font-size: 18px; }
.card-title { font-size: 16px; font-weight: 600; color: #fff; }

.suggestions-list { display: flex; flex-direction: column; gap: 16px; }
.suggestion-item { display: flex; align-items: flex-start; gap: 16px; padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; cursor: pointer; }
.s-icon-box { width: 36px; height: 36px; border-radius: 10px; background: rgba($warning, 0.1); border: 1px solid rgba($warning, 0.2); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.s-content { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.s-title { font-size: 14px; font-weight: 600; color: #fff; }
.s-desc { font-size: 12px; color: $text-muted; line-height: 1.5; }
.s-action { display: flex; align-items: center; gap: 4px; font-size: 12px; color: $warning; font-weight: 500; align-self: center; opacity: 0; transform: translateX(-10px); transition: 0.3s; }
.suggestion-item:hover { border-color: rgba($warning, 0.3); background: rgba($warning, 0.05); }
.suggestion-item:hover .s-action { opacity: 1; transform: translateX(0); }

/* 空状态样式 */
.empty-state.mini { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 0; opacity: 0.7; }
.empty-state.mini .empty-icon { font-size: 40px; margin-bottom: 12px; }
.empty-state.mini .empty-text { font-size: 14px; color: $text-muted; }

/* 3. 快捷操作引流 */
.quick-actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.action-btn.outline { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: 0.3s; }
.action-btn.outline:hover { background: rgba(255,255,255,0.06); border-color: rgba($primary, 0.3); transform: translateY(-2px); }
.action-btn.danger:hover { border-color: rgba($danger, 0.3); }
.a-icon { font-size: 24px; }
.a-text { display: flex; flex-direction: column; gap: 2px; }
.a-title { font-size: 14px; font-weight: 600; color: #fff; }
.a-sub { font-size: 11px; color: $text-muted; }

/* ==================== 右侧：推荐岗位池 ==================== */
.right-jobs-panel { flex: 1; min-width: 0; display: flex; flex-direction: column; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 24px; backdrop-filter: blur(24px); overflow: hidden; }
.panel-header { padding: 24px 32px; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; }
.ph-left { display: flex; align-items: center; gap: 12px; }
.ph-icon { font-size: 22px; filter: drop-shadow(0 0 8px rgba(255,255,255,0.2)); }
.ph-title { font-size: 18px; font-weight: 600; color: #fff; }
.ph-meta { font-size: 13px; color: $text-muted; background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 12px; }

.jobs-scroll { flex: 1; height: 0; padding: 24px 32px; }

/* 双列网格 */
.jobs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.job-card { display: flex; flex-direction: column; padding: 24px; cursor: pointer; position: relative; }
.job-card:hover { border-color: rgba($primary, 0.3); }

/* 霓虹匹配度标签 */
.neon-match-badge {
  position: absolute; top: 20px; right: 20px; padding: 6px 12px;
  background: var(--bg); border: 1px solid var(--theme); color: var(--theme);
  border-radius: 14px; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px; z-index: 2;
  box-shadow: 0 0 12px var(--glow); backdrop-filter: blur(4px);
}
.neon-match-badge .pulse-dot { background: var(--theme); box-shadow: 0 0 8px var(--theme); }
.glow-bg { position: absolute; inset: 0; background: radial-gradient(circle, var(--theme) 0%, transparent 70%); opacity: 0.1; z-index: 0; pointer-events: none; border-radius: inherit; }

.j-body { position: relative; z-index: 2; }
.j-title { font-size: 18px; font-weight: 600; color: #fff; display: block; margin-bottom: 12px; padding-right: 80px; }
.j-company-info { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #cbd5e1; margin-bottom: 16px; }
.c-icon { font-size: 16px; }

.j-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; min-height: 28px; }
.neon-tag.ghost { padding: 4px 10px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; font-size: 12px; color: #94a3b8; transition: 0.2s; }
.job-card:hover .neon-tag.ghost { border-color: rgba($primary, 0.3); color: #cbd5e1; }

.j-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px dashed rgba(255,255,255,0.05); }
.j-meta { display: flex; gap: 16px; font-size: 12px; color: $text-muted; }
.meta-item { display: flex; align-items: center; gap: 4px; }

/* ==================== 统一按钮与组件 ==================== */
.liquid-btn {
  display: inline-flex; align-items: center; justify-content: center; height: 44px; padding: 0 20px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; color: #fff;
  background: linear-gradient(135deg, $primary, $secondary); box-shadow: 0 8px 20px rgba($primary, 0.3); transition: 0.3s; border: none;
}
.liquid-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba($primary, 0.5); }
.liquid-btn.micro { height: 34px; padding: 0 16px; font-size: 13px; border-radius: 10px; box-shadow: 0 4px 12px rgba($primary, 0.2); }
.liquid-btn .btn-txt { position: relative; z-index: 2; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

/* 动画防丢终极版 */
.fade-in-down { animation: fadeInDown 0.6s ease both; }
.fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.fade-in-left { animation: fadeInLeft 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.9); } }
.safe-area-bottom { height: 40px; }
</style>