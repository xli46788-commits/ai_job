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
          <view class="icon-btn" @click="goBack" title="返回">
            <text class="arrow-left">←</text>
          </view>
          <text class="title">岗位详情大厅</text>
        </view>
        <view class="header-right">
          <view class="status-badge" :class="jobDetail.is_published ? 'success' : 'standby'">
            <text class="dot pulse"></text> 
            {{ jobDetail.is_published ? '火热招聘中' : '已停止收卷' }}
          </view>
        </view>
      </view>
      
      <scroll-view class="workspace-body custom-scrollbar" scroll-y>
        <view class="detail-container fade-in-up delay-1">
          
          <view class="ultra-glass-card main-info-card">
            <view class="info-primary">
              <text class="job-name">{{ jobDetail.job_name || '高级岗位' }}</text>
              <text class="job-salary">{{ formatSalary(jobDetail.job_salary || jobDetail.salary) }}</text>
            </view>
            
            <view class="info-meta mt-16">
              <view class="meta-item"><text class="icon">🏢</text>{{ jobDetail.company?.company_name || jobDetail.company?.username || '神秘大厂' }}</view>
              <view class="divider-y"></view>
              <view class="meta-item"><text class="icon">📍</text>{{ jobDetail.job_location || '全国' }}</view>
              <view class="divider-y"></view>
              <view class="meta-item"><text class="icon">👨‍🎓</text>{{ jobDetail.education_cutoff || '学历不限' }}</view>
            </view>

            <view class="tags-row mt-24" v-if="keywordTags.length > 0">
              <view v-for="(tag, index) in keywordTags" :key="index" class="neon-tag ghost">
                {{ tag }}
              </view>
            </view>
          </view>

          <view class="ultra-glass-card content-section-card mt-24">
            <view class="section-title-bar">
              <text class="icon">🎯</text>
              <text class="section-title">岗位描述与核心职责</text>
            </view>
            <view class="section-content">
              <text class="text-block">{{ jobDetail.job_description || '招聘方走得太急，暂未留下具体的职责要求...' }}</text>
            </view>
          </view>

          <view class="ultra-glass-card content-section-card mt-24">
            <view class="section-title-bar">
              <text class="icon">🛠️</text>
              <text class="section-title">任职资格与技能要求</text>
            </view>
            <view class="section-content">
              <text class="text-block">{{ jobDetail.job_requirements || '具备极强的自驱力、快速学习能力及团队协作底色。' }}</text>
            </view>
          </view>

          <view class="safe-area-bottom"></view>
        </view>
      </scroll-view>

      <view class="bottom-action-dock fade-in-up delay-2">
        <view class="dock-inner">
          
          <view class="favorite-toggle-btn" :class="{ 'is-active': isFavorited }" @click="toggleFavorite">
            <text class="heart-icon">{{ isFavorited ? '❤️' : '🤍' }}</text>
            <text class="dock-label">{{ isFavorited ? '已入收藏储备' : '加入收藏' }}</text>
          </view>
          
          <view class="liquid-btn launch-apply-btn" :class="{ 'applied-theme': isApplied }" @click="handleApplyJob">
            <view class="btn-content">
              <text class="btn-icon">{{ isApplied ? '❌' : '🚀' }}</text>
              <text class="btn-txt">{{ isApplied ? '撤回数字分身投递记录' : '一键数字分身加密投递' }}</text>
            </view>
            <view class="shimmer-effect" v-if="!isApplied"></view>
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
      jobId: '',
      jobDetail: {},
      isFavorited: false, // 动态收藏状态
      isApplied: false,   // 动态投递状态
      keywordTags: []
    }
  },
  onLoad(options) {
    if (options.id) {
      this.jobId = options.id;
      this.fetchJobData();
    } else {
      uni.showToast({ title: '参数非法', icon: 'none' });
      setTimeout(() => { this.goBack(); }, 1000);
    }
  },
methods: {
    // 1. 同步拉取岗位物理详情
    async fetchJobData() {
      uni.showLoading({ title: '正在同步量子岗位详情...' });
      try {
        const res = await API.getJobDetail(this.jobId);
        this.jobDetail = res.data || res || {};
        
        if (this.jobDetail.job_keywords) {
          this.keywordTags = this.jobDetail.job_keywords.split(',').slice(0, 4);
        } else if (this.jobDetail.tags) {
          this.keywordTags = this.jobDetail.tags;
        }
        
        // 进入详情页，立刻刷新微章和红心状态
        await this.checkCurrentStatus();
      } catch (e) {
        console.error("同步岗位失败:", e);
        uni.showToast({ title: '岗位数据已被移除', icon: 'none' });
      } finally {
        uni.hideLoading();
      }
    },

    formatSalary(salaryStr) {
      if (!salaryStr) return '高薪具竞争力';
      const forbiddenWords = ['面议', '薪资面议', '待定', 'null'];
      if (forbiddenWords.includes(String(salaryStr).trim().toLowerCase())) {
        return '高薪具竞争力';
      }
      return salaryStr;
    },

    // 2. 摸底当前状态，阻断任何偏移
    async checkCurrentStatus() {
      try {
        // A. 摸底收藏
        const favRes = await API.getFavorites();
        const favRecords = favRes.data?.results || favRes.data || favRes.results || [];
        this.isFavorited = favRecords.some(item => {
          const tid = item.job?.job_id || item.job?.id || item.job_id;
          return tid === this.jobId;
        });

        // B. 摸底投递
        const delRes = await API.getDeliveries();
        const delRecords = delRes.data?.results || delRes.data || delRes.results || [];
        this.isApplied = delRecords.some(item => {
          const tid = item.job?.job_id || item.job?.id || item.job_id;
          return tid === this.jobId;
        });
      } catch(e) { console.log("探测状态失败:", e); }
    },

    // 🌟 1. 规范对齐后的加入/取消收藏映射逻辑
        async toggleFavorite() {
          try {
            if (this.isFavorited) {
              // 走我们刚才在 jobs/urls.py 焊死的静态专线
              await API.deleteFavorite(this.jobId);
              this.isFavorited = false;
              uni.showToast({ title: '已安全移出收藏储备', icon: 'none' });
            } else {
              await API.addFavorite({ job_id: this.jobId });
              this.isFavorited = true;
              uni.showToast({ title: '已成功加入收藏储备！', icon: 'success' });
            }
          } catch (e) { 
            console.error(e);
            uni.showToast({ title: '收藏操作受限，请稍后重试', icon: 'none' }); 
          }
        },
    
        // 🌟 2. 规范对齐后的加密投递/一键撤回答案
        async handleApplyJob() {
          const activeResumeId = uni.getStorageSync('current_resume_id');
          if (!activeResumeId) {
            uni.showToast({ title: '请先前往首页解析简历，激活数字分身凭证', icon: 'none' });
            return;
          }
    
          if (this.isApplied) {
            uni.showModal({
              title: '回收投递确认',
              content: '您已向该岗位发起投递，确定要远程撤回回收您的简历分身吗？企业端将不再可见。',
              confirmColor: '#ef4444',
              success: async (res) => {
                if (res.confirm) {
                  uni.showLoading({ title: '正在回收数字分身...' });
                  try {
                    // 走我们刚才在 jobs/urls.py 焊死的静态专线
                    await API.deleteDelivery(this.jobId);
                    this.isApplied = false;
                    uni.showToast({ title: '已成功撤回简历投递', icon: 'none' });
                  } catch (e) {
                    console.error(e);
                    uni.showToast({ title: '撤回失败，可能已被企业锁卷', icon: 'none' });
                  } finally { uni.hideLoading(); }
                }
              }
            });
          } else {
            // 未投递 -> 点击触发一键智能加密投递
            uni.showModal({
              title: '加密投递确认',
              content: `确定要向该岗位一键投递数字分身吗？`,
              confirmColor: '#3b82f6',
              success: async (res) => {
                if (res.confirm) {
                  uni.showLoading({ title: '安全投递传输中...', mask: true });
                  try {
                    await API.applyForJob({
                      job_id: this.jobId,
                      resume_id: activeResumeId
                    });
                    this.isApplied = true;
                    uni.showToast({ title: '投递成功！已切入追踪矩阵', icon: 'success' });
                  } catch (error) {
                    uni.showToast({ title: '投递受阻，请稍后重试', icon: 'none' });
                  } finally { uni.hideLoading(); }
                }
              }
            });
          }
        },

    goBack() { uni.navigateBack(); }
  }
}
</script>

<style lang="scss" scoped>
/* ==================== 极光宇宙色彩 ==================== */
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

.student-universe-web {
  min-height: 100vh; width: 100vw; background-color: $bg-deep;
  position: relative; overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}
.aurora-wrapper { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(140px); opacity: 0.35; mix-blend-mode: screen; animation: float 30s infinite alternate ease-in-out; }
.orb-1 { width: 50vw; height: 50vw; background: radial-gradient(circle, rgba($primary,0.3) 0%, transparent 60%); top: -10%; left: -10%; }
.orb-2 { width: 45vw; height: 45vw; background: radial-gradient(circle, rgba($secondary,0.2) 0%, transparent 60%); bottom: -10%; right: -5%; }
.orb-3 { width: 35vw; height: 35vw; background: radial-gradient(circle, rgba($accent,0.15) 0%, transparent 60%); top: 30%; left: 40%; }
.grid-overlay { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px); background-size: 40px 40px; }
.vignette-overlay { position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 30%, rgba(3,3,8,0.95) 100%); }

@keyframes float { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(4%, 6%) scale(1.05); } }

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

.status-badge { display: flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; border: 1px solid; }
.status-badge.standby { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #cbd5e1; .dot { background: #cbd5e1; } }
.status-badge.success { background: rgba($success, 0.1); border-color: rgba($success, 0.3); color: $success; .dot { background: $success; box-shadow: 0 0 8px $success; } }
.dot { width: 6px; height: 6px; border-radius: 50%; }

.workspace-body { flex: 1; height: 0; box-sizing: border-box; }
.detail-container { max-width: 800px; margin: 0 auto; padding: 32px 20px 120px; width: 100%; box-sizing: border-box; }

.ultra-glass-card {
  background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
  backdrop-filter: blur(32px); border: 1px solid rgba(255,255,255,0.06);
  border-top: 1px solid rgba(255,255,255,0.12); border-left: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px; box-shadow: 0 16px 40px -10px rgba(0,0,0,0.5); overflow: hidden; position: relative;
}

.main-info-card { padding: 32px; }
.info-primary { display: flex; justify-content: space-between; align-items: flex-start; }
.job-name { font-size: 26px; font-weight: 700; color: #fff; line-height: 1.3; }
.job-salary { font-size: 24px; font-weight: 800; color: $success; text-shadow: 0 0 15px rgba($success,0.3); }

.info-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 16px; }
.meta-item { font-size: 14px; color: #cbd5e1; display: flex; align-items: center; gap: 6px; }
.meta-item .icon { font-size: 16px; }
.divider-y { width: 1px; height: 14px; background: rgba(255,255,255,0.15); }

.tags-row { display: flex; flex-wrap: wrap; gap: 8px; }
.neon-tag.ghost { padding: 6px 14px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; font-size: 13px; color: #94a3b8; }

.content-section-card { padding: 28px; }
.section-title-bar { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px; }
.section-title-bar .icon { font-size: 20px; }
.section-title { font-size: 16px; font-weight: 600; color: #fff; }
.text-block { font-size: 15px; color: #cbd5e1; line-height: 1.8; white-space: pre-line; display: block; }

.bottom-action-dock {
  position: fixed; bottom: 0; left: 0; width: 100vw; z-index: 100;
  background: linear-gradient(360deg, rgba(3,3,8,0.95) 60%, transparent 100%);
  padding: 24px 20px 40px; box-sizing: border-box; backdrop-filter: blur(8px);
}
.dock-inner { max-width: 800px; margin: 0 auto; display: flex; gap: 20px; width: 100%; align-items: center; }

.favorite-toggle-btn {
  width: 130px; height: 52px; border-radius: 16px; background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 2px; cursor: pointer; transition: 0.3s;
}
.favorite-toggle-btn:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.2); }
.favorite-toggle-btn.is-active {
  background: rgba($danger, 0.08) !important; border-color: rgba($danger, 0.3) !important;
  .dock-label { color: $danger !important; font-weight: 600; }
}
.heart-icon { font-size: 18px; line-height: 1; }
.dock-label { font-size: 12px; color: $text-muted; }

.liquid-btn.launch-apply-btn {
  flex: 1; height: 52px; border-radius: 16px; border: none;
  background: linear-gradient(135deg, $primary, $secondary); box-shadow: 0 8px 20px rgba($primary, 0.3);
  position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s;
}
.liquid-btn.launch-apply-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba($primary, 0.5); }
.liquid-btn.launch-apply-btn.applied-theme {
  background: linear-gradient(135deg, rgba($danger, 0.15), rgba($danger, 0.3)) !important;
  border: 1px solid rgba($danger, 0.4) !important;
  box-shadow: none !important;
}
.liquid-btn.launch-apply-btn.applied-theme:hover {
  background: linear-gradient(135deg, rgba($danger, 0.25), rgba($danger, 0.4)) !important;
}
.btn-content { display: flex; align-items: center; gap: 8px; color: #fff; font-size: 15px; font-weight: 600; position: relative; z-index: 2; }
.shimmer-effect { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transform: skewX(-20deg); animation: shimmerBtn 3.5s infinite; }

@keyframes shimmerBtn { 100% { left: 200%; } }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

.fade-in-down { animation: fadeInDown 0.5s ease both; }
.fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-15px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(0); } }

.mt-24 { margin-top: 24px; } .mt-16 { margin-top: 16px; } .safe-area-bottom { height: 40px; }
</style>