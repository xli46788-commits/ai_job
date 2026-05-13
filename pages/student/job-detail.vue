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
          <text class="title">职位详情</text>
        </view>
        <view class="header-right">
          <view class="liquid-btn micro" @click="applyJob" v-if="job">
            <text class="btn-txt">🚀 立即投递</text>
          </view>
        </view>
      </view>

      <view class="workspace-body">
        <scroll-view class="detail-scroll custom-scrollbar" scroll-y>
          <view class="detail-body fade-in-up delay-1">
            
            <view class="ultra-glass-card detail-card" v-if="job">
              <view class="job-main-header">
                <view class="title-row">
                  <text class="job-name">{{ job.job_name || '未命名岗位' }}</text>
                  <text class="job-salary">{{ job.salary || '面议' }}</text>
                </view>
                
                <view class="company-row" v-if="job.company">
                  <text class="c-icon">🏢</text>
                  <text class="c-name">{{ job.company.company_name || job.company.username || '知名企业' }}</text>
                </view>

                <view class="meta-row">
                  <view class="m-tag"><text>📍</text> {{ job.job_location || '全国' }}</view>
                  <view class="m-tag"><text>💼</text> {{ job.experience || '经验不限' }}</view>
                  
                  <view class="m-tag contact-tag" v-if="job.contact_info">
                    <text>📞</text> 联系HR：{{ job.contact_info }}
                  </view>
                  
                  <view class="m-tag"><text>🕒</text> {{ formatDate(job.created_at) }}</view>
                </view>
                
                <view class="tags-row" v-if="keywords.length > 0">
                  <view v-for="(tag, index) in keywords" :key="index" class="neon-tag active">{{ tag }}</view>
                </view>
              </view>

              <view class="divider"></view>

              <view class="section">
                <view class="section-title"><text class="icon">📝</text> 职位描述</view>
                <text class="section-content">{{ job.job_description || '暂无详细描述' }}</text>
              </view>

              <view class="section">
                <view class="section-title"><text class="icon">🎯</text> 任职要求</view>
                <text class="section-content">{{ job.job_requirement || '暂无明确要求' }}</text>
              </view>
            </view>

            <view class="loading-state ultra-glass-card" v-else>
              <view class="pulse-loader">🧬</view>
              <text class="loading-text">正在解析职位基因...</text>
            </view>
            
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import { API } from '../../utils/api.js';

export default {
  data() {
    return {
      job: null,
      jobId: ''
    };
  },
  computed: {
    keywords() {
      if (!this.job || !this.job.job_keywords) return ['急招'];
      return this.job.job_keywords.split(',');
    }
  },
  onLoad(options) {
    if (options.id) {
      this.jobId = options.id;
      this.fetchDetail();
    } else {
      uni.showToast({ title: '参数错误，找不到该职位', icon: 'none' });
    }
  },
  methods: {
    async fetchDetail() {
      try {
        const res = await API.getJobDetail(this.jobId);
        // 兼容不同的后端返回结构 (直接返回 data 或包装在 data.data 里)
        this.job = res.data?.data || res.data || res;
      } catch (e) {
        console.error("获取详情报错：", e);
        uni.showToast({ title: '职位信息拉取失败', icon: 'none' });
      }
    },
    
applyJob() {
      uni.showModal({
        title: '确认一键投递',
        content: `确定要使用数字分身向 ${this.job.job_name} 投递简历吗？`,
        confirmColor: '#3b82f6',
        success: async (res) => {
          if (res.confirm) {
            const resumeId = uni.getStorageSync('current_resume_id');
            if (!resumeId) {
                uni.showToast({ title: '请先在首页上传简历', icon: 'none' });
                return;
            }

            uni.showLoading({ title: '数字分身投递中...', mask: true });
            try {
              await API.applyForJob({
                job_id: this.jobId,
                resume_id: resumeId
              });
              uni.hideLoading();
              uni.showToast({ title: '投递成功！', icon: 'success' });
              
            } catch (error) {
              uni.hideLoading();
              
              // 🚀 核心优化：榨出真实的报错原因
              let errorMsg = '网络拥挤，请重试';
              if (error.data && typeof error.data === 'object') {
                  const firstKey = Object.keys(error.data)[0];
                  if (Array.isArray(error.data[firstKey])) {
                      errorMsg = error.data[firstKey][0];
                  } else if (typeof error.data[firstKey] === 'string') {
                      errorMsg = error.data[firstKey];
                  }
              } else if (error.statusCode === 400 || error.statusCode === 500) {
                  errorMsg = '您已经投递过该岗位啦，请勿重复投递';
              }
              
              // 稍微延迟，防止被 hideLoading 吞掉
              setTimeout(() => {
                uni.showToast({ title: errorMsg, icon: 'none', duration: 2500 });
              }, 100);
            }
          }
        }
      });
    },
    
    formatDate(dateStr) {
      if (!dateStr) return '刚刚';
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    
    goBack() { 
      uni.navigateBack(); 
    }
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

.glass-header { 
  height: 70px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px;
  background: linear-gradient(180deg, rgba(3,3,8,0.9) 0%, transparent 100%); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05); flex-shrink: 0;
}
.header-left { display: flex; align-items: center; gap: 20px; }
.icon-btn { width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
.icon-btn:hover { background: rgba(255,255,255,0.1); transform: translateX(-2px); }
.arrow-left { color: #fff; font-size: 18px; }
.title { font-size: 18px; font-weight: 600; color: #fff; letter-spacing: 1px; }

.workspace-body { flex: 1; display: flex; flex-direction: column; height: calc(100vh - 70px); }
.detail-scroll { flex: 1; height: 100%; }

/* ==================== 详情卡片内容 ==================== */
.detail-body { padding: 40px; max-width: 1000px; margin: 0 auto; width: 100%; box-sizing: border-box; }

.ultra-glass-card {
  background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
  backdrop-filter: blur(32px); border: 1px solid rgba(255,255,255,0.06);
  border-top: 1px solid rgba(255,255,255,0.12); border-left: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px; box-shadow: 0 16px 40px -10px rgba(0,0,0,0.5); overflow: hidden;
}

.detail-card { padding: 40px; }

.job-main-header { display: flex; flex-direction: column; gap: 16px; }
.title-row { display: flex; justify-content: space-between; align-items: center; }
.job-name { font-size: 32px; font-weight: 800; color: #fff; letter-spacing: 1px; }
.job-salary { font-size: 28px; font-weight: 700; color: $success; text-shadow: 0 0 20px rgba($success, 0.4); }

.company-row { display: flex; align-items: center; gap: 8px; font-size: 16px; color: #e2e8f0; }
.c-icon { font-size: 18px; }

.meta-row { display: flex; gap: 24px; color: $text-muted; font-size: 14px; margin-top: 8px; }
.m-tag { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.03); padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }

/* 🚀 最小化新增：联系方式发光标签样式 */
.contact-tag {
  color: #60a5fa !important;
  border: 1px solid rgba(59, 130, 246, 0.4) !important;
  background: rgba(59, 130, 246, 0.1) !important;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
}

.tags-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
.neon-tag.active { padding: 6px 14px; border-radius: 10px; font-size: 13px; font-weight: 500; background: rgba($primary, 0.1); color: #bfdbfe; border: 1px solid rgba($primary, 0.3); }

.divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); margin: 40px 0; }

.section { margin-bottom: 40px; }
.section-title { font-size: 20px; font-weight: 600; color: #fff; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
.section-content { font-size: 15px; line-height: 2; color: #cbd5e1; white-space: pre-wrap; }

/* 加载状态 */
.loading-state { padding: 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
.pulse-loader { font-size: 48px; animation: pulse 2s infinite; filter: drop-shadow(0 0 20px rgba($primary, 0.6)); }
.loading-text { font-size: 16px; color: $text-muted; }

/* ==================== 统一按钮与组件 ==================== */
.liquid-btn {
  display: inline-flex; align-items: center; justify-content: center; height: 44px; padding: 0 20px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; color: #fff;
  background: linear-gradient(135deg, $primary, $secondary); box-shadow: 0 8px 20px rgba($primary, 0.3); transition: 0.3s; border: none;
}
.liquid-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba($primary, 0.5); }
.liquid-btn.micro { height: 38px; padding: 0 20px; font-size: 14px; border-radius: 10px; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

.fade-in-down { animation: fadeInDown 0.6s ease both; }
.fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.delay-1 { animation-delay: 0.1s; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }
</style>