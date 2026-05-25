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
          <view class="icon-btn" @click="goBack" title="返回主页">
            <text class="arrow-left">←</text>
          </view>
          <text class="title">个人中心</text>
        </view>
        <view class="header-right">
          <view class="logout-btn hover-lift" @click="logout">
            <text class="logout-icon">🚪</text>
            <text>退出登录</text>
          </view>
        </view>
      </view>
      
      <view class="workspace-body">
        
        <view class="left-control-panel fade-in-up delay-1">
          <scroll-view class="left-scroll custom-scrollbar" scroll-y>
            <view class="left-content-inner">
              
              <view class="ultra-glass-card user-profile-card">
                <view class="avatar-wrapper">
                  <view class="avatar-ring"></view>
                  <view class="avatar-glow"></view>
                  <text class="avatar-icon">👤</text>
                </view>
                <view class="user-details">
                  <text class="user-name">{{ userInfo.username || '学生用户' }}</text>
                  <view class="name-line"></view>
                  <view class="user-id-box">
                    <text class="id-dot pulse"></text>
                    <text>ID: {{ userInfo.id || '--' }}</text>
                  </view>
                </view>
              </view>

              <view class="ultra-glass-card asset-card hover-lift" @click="goToRecharge">
                <view class="asset-shine"></view>
                <view class="asset-header">
                  <view class="asset-icon-box">
                    <text>💎</text>
                  </view>
                  <text class="asset-label">当前可用积分</text>
                </view>
                <view class="asset-body">
                  <text class="asset-amount">{{ userInfo.points || 0 }}</text>
                  <view class="asset-action">
                    <text>积分明细</text>
                    <text class="arr">›</text>
                  </view>
                </view>
              </view>
              
              <view class="ultra-glass-card nav-menu-card">
                <view 
                  v-for="(tab, index) in tabs" 
                  :key="index"
                  class="nav-menu-item"
                  :class="{ active: activeTab === tab.value }"
                  @click="switchTab(tab.value)"
                >
                  <view class="menu-icon-box" :class="{ 'active-glow': activeTab === tab.value }">
                    <text>{{ tab.icon }}</text>
                  </view>
                  <text class="menu-label">{{ tab.label }}</text>
                  <view class="menu-indicator" v-if="activeTab === tab.value"></view>
                </view>
              </view>

            </view>
          </scroll-view>
        </view>

        <view class="right-content-panel fade-in-left delay-2">
          <view class="ultra-glass-card content-card h-full">
            
            <view class="content-header">
              <text class="content-title">{{ currentTabLabel }}</text>
              <text class="content-subtitle" v-if="activeTab === 'applications'">实时追踪您的求职进度</text>
              <text class="content-subtitle" v-if="activeTab === 'favorites'">查看您已入库的潜力储备卡槽</text>
              <text class="content-subtitle" v-if="activeTab === 'resumes'">唤醒 AI Copilot 全景管理简历基因资产</text>
              <text class="content-subtitle" v-if="activeTab === 'points'">查看积分流水与消费记录</text>
            </view>

            <scroll-view class="detail-scroll custom-scrollbar" scroll-y>
              <view class="detail-inner">
                
                <view v-if="activeTab === 'applications'" class="tab-module fade-in-up">
                  <view v-if="applications.length === 0" class="empty-state">
                    <text class="empty-icon">📭</text>
                    <text class="empty-title">暂无投递追踪记录</text>
                    <text class="empty-desc">在岗位大厅一键数字分身加密投递后，求职状态会在此显示</text>
                  </view>
                  
                  <view v-else class="list-grid-vertical">
                    <view v-for="(app, index) in applications" :key="index" class="data-card resume-style-card hover-lift" @click="goToJobDetailFromTab(app.jobId)">
                      <view class="card-badge-icon">💼</view>
                      <view class="resume-info">
                        <text class="r-name">{{ app.jobTitle }}</text>
                        <view class="r-meta">
                          <text>🏢 {{ app.company }}</text>
                          <text class="divider">·</text>
                          <text>🕐 {{ app.time }}</text>
                        </view>
                      </view>
                      <view class="status-badge-neon" :class="app.statusStyle">
                        <text class="dot"></text>{{ app.statusText }}
                      </view>
                    </view>
                  </view>
                </view>
                
                <view v-if="activeTab === 'favorites'" class="tab-module fade-in-up">
                  <view v-if="favorites.length === 0" class="empty-state">
                    <text class="empty-icon">❤️</text>
                    <text class="empty-title">暂无收藏储备岗位</text>
                    <text class="empty-desc">遇到心仪的高潜岗位，点击收藏图标可收纳到这里</text>
                  </view>
                  
                  <view v-else class="list-grid-vertical">
                    <view v-for="(job, index) in favorites" :key="index" class="data-card resume-style-card hover-lift" @click="goToJobDetailFromTab(job.jobId)">
                      <view class="card-badge-icon icon-fav">⭐</view>
                      <view class="resume-info">
                        <text class="r-name">{{ job.title }}</text>
                        <view class="r-meta">
                          <text>🏢 {{ job.company }}</text>
                          <text class="divider">·</text>
                          <text style="color: #10b981; font-weight: 700;">💰 {{ formatSalary(job.salary) }}</text>
                        </view>
                      </view>
                      <view class="delete-action-btn" @click.stop="unfavorite(job)">
                        <text>×</text>
                      </view>
                    </view>
                  </view>
                </view>
                
                <view v-if="activeTab === 'resumes'" class="tab-module fade-in-up">
                  <view class="action-bar mb-24 asset-btn-row">
                    <view class="liquid-btn" @click="goToUploadResume">
                      <text class="btn-txt">📤 上传新简历</text>
                    </view>
                    <view class="liquid-btn download-theme" :class="{ disabled: resumes.length === 0 }" @click="downloadSelectedResume">
                      <text class="btn-txt">📥 一键下载最近简历</text>
                    </view>
                  </view>

                  <view v-if="resumes.length === 0" class="empty-state">
                    <text class="empty-icon">📄</text>
                    <text class="empty-title">简历库空空如也</text>
                    <text class="empty-desc">上传简历，唤醒 AI Copilot 为你深度分析</text>
                  </view>
                  
                  <view v-else class="list-grid">
                    <view v-for="(resume, index) in resumes" :key="index" class="data-card resume-card hover-lift">
                      <view class="resume-icon-box">📄</view>
                      <view class="resume-info">
                        <text class="r-name">{{ resume.name }}</text>
                        <view class="r-meta">
                          <text class="divider" v-if="resume.size">·</text>
                          <text>{{ resume.uploadDate }}</text>
                        </view>
                      </view>
                      <view class="delete-action" @click.stop="deleteResume(resume)" title="删除文件">
                        <text>×</text>
                      </view>
                    </view>
                  </view>
                </view>
                
                <view v-if="activeTab === 'points'" class="tab-module fade-in-up">
                  <view class="points-guide-panel mb-32">
                    <text class="panel-sm-title">积分赋能矩阵</text>
                    <view class="guide-grid">
                      <view class="guide-item">
                        <view class="g-icon theme-purple">✨</view>
                        <view class="g-text">
                          <text class="g-title">AI 简历专家润色</text>
                          <text class="g-cost">50 积分 / 次</text>
                        </view>
                      </view>
                      <view class="guide-item">
                        <view class="g-icon theme-cyan">🎯</view>
                        <view class="g-text">
                          <text class="g-title">全景人岗匹配分析</text>
                          <text class="g-cost">100 积分 / 次</text>
                        </view>
                      </view>
                      <view class="guide-item">
                        <view class="g-icon theme-green">🚀</view>
                        <view class="g-text">
                          <text class="g-title">企业库优先极速推荐</text>
                          <text class="g-cost">200 积分 / 周</text>
                        </view>
                      </view>
                    </view>
                  </view>
                  
                  <view class="history-panel">
                    <text class="panel-sm-title">近期流水记录</text>
                    <view v-if="pointRecords.length === 0" class="empty-state" style="padding: 40px 0;">
                      <text class="empty-icon" style="font-size: 40px;">💳</text>
                      <text class="empty-desc">暂无积分变动记录</text>
                    </view>
                    <view class="history-list" v-else>
                      <view v-for="(record, index) in pointRecords" :key="record.id" class="history-item hover-lift" :class="record.type" :style="`animation-delay: ${index * 0.05}s;`">
                        <view class="h-icon">
                          <text v-if="record.type === 'earn'">💰</text>
                          <text v-else>💳</text>
                        </view>
                        <view class="h-info">
                          <text class="h-desc">{{ record.description }}</text>
                          <text class="h-date">{{ record.date }}</text>
                        </view>
                        <view class="h-amount" :class="record.type">
                          <text class="sign">{{ record.type === 'earn' ? '+' : '-' }}</text>
                          <text class="val">{{ record.amount }}</text>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>

              </view>
              <view class="safe-area-bottom"></view>
            </scroll-view>
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
      activeTab: 'applications',
      tabs: [
        { label: '投递进度追踪', value: 'applications', icon: '📋' },
        { label: '我的收藏储备', value: 'favorites', icon: '❤️' },
        { label: '简历资产管理', value: 'resumes', icon: '📄' },
        { label: '积分与权益', value: 'points', icon: '💎' }
      ],
      userInfo: { username: '', id: '', points: 0 },
      applications: [],
      favorites: [],
      resumes: [],
      pointRecords: []
    }
  },
  computed: {
    currentTabLabel() {
      const tab = this.tabs.find(t => t.value === this.activeTab);
      return tab ? tab.label : '';
    }
  },
  onShow() {
    this.initData();
  },
  mounted() {
    this.initData();
  },
  methods: {
    downloadSelectedResume() {
      if (this.resumes.length === 0) {
        uni.showToast({ title: '您的资产库里还没有简历可供下载', icon: 'none' });
        return;
      }
      const targetResume = this.resumes[0];
      uni.showLoading({ title: '正在准备下载文件流...' });
      const downloadUrl = API.downloadResumeFile(targetResume.id);
      
      // #ifdef H5
      window.location.href = downloadUrl;
      uni.hideLoading();
      // #endif
      
      // #ifndef H5
      uni.downloadFile({
        url: downloadUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: (saveRes) => {
                uni.showModal({
                  title: '下载成功',
                  content: '简历已成功保存到本地路径：' + saveRes.savedFilePath,
                  showCancel: false
                });
              }
            });
          }
        },
        fail: (err) => {
          uni.showToast({ title: '下载失败，请检查后端网络', icon: 'none' });
        },
        complete: () => { uni.hideLoading(); }
      });
      // #endif
    },

    async initData() {
      const localUser = uni.getStorageSync('user_info');
      if (localUser) this.userInfo.username = localUser.username;
      await this.fetchUserProfile();
      this.loadTabData(this.activeTab);
    },
    
    switchTab(tabValue) {
      if (this.activeTab === tabValue) return;
      this.activeTab = tabValue;
      this.loadTabData(tabValue);
    },

    async loadTabData(tab) {
      uni.showLoading({ title: '加载中...', mask: true });
      try {
        if (tab === 'applications') await this.fetchApplications();
        else if (tab === 'favorites') await this.fetchFavorites();
        else if (tab === 'resumes') await this.fetchResumes();
        else if (tab === 'points') await this.fetchPointRecords();
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

    async fetchUserProfile() {
      try {
        const res = await API.getUserProfile();
        const data = res.data || res;
        if (data) {
          this.userInfo = {
            username: data.username || this.userInfo.username || '未设置昵称',
            id: data.id || data.user_id || '--',
            points: data.points || 0
          };
        }
      } catch (e) { console.error("获取个人信息失败", e); }
    },

    async fetchApplications() {
      try {
        const res = await API.getDeliveries();
        const records = res.data?.results || res.data || res.results || [];
        
        const statusMap = {
          1: { text: '企业待处理', style: 'pending' },
          2: { text: '企业已查看', style: 'interview' },
          3: { text: '进入面试流程', style: 'interview' },
          4: { text: '流程结束', style: 'rejected' }
        };

        this.applications = records.map(item => {
          const statusObj = statusMap[item.delivery_status] || { text: '企业待处理', style: 'pending' };
          return {
            id: item.id || item.delivery_id,
            jobId: item.job?.job_id || item.job?.id || item.job_id, 
            jobTitle: item.job?.job_name || '高级岗位',
            company: item.job?.company?.company_name || item.job?.company?.username || '神秘大厂',
            time: this.formatDate(item.delivery_time || item.created_at),
            status: item.delivery_status,
            statusText: statusObj.text,
            statusStyle: statusObj.style
          };
        });
      } catch (e) { console.error("获取投递记录失败", e); }
    },

    async fetchFavorites() {
      try {
        const res = await API.getFavorites();
        const records = res.data?.results || res.data || res.results || [];
        this.favorites = records.map(item => ({
          favoriteId: item.favorite_id || item.id,
          jobId: item.job?.job_id || item.job?.id || item.job_id, 
          title: item.job?.job_name || '高级岗位',
          company: item.job?.company?.company_name || item.job?.company?.username || '神秘大厂',
          salary: item.job?.job_salary || item.job?.salary || '高薪具竞争力',
          tags: item.job?.job_keywords ? item.job.job_keywords.split(',').slice(0, 3) : []
        }));
      } catch (e) { console.error("获取收藏记录失败", e); }
    },

    async fetchResumes() {
      try {
        const res = await API.getResumes();
        const records = res.data?.data?.results || res.data?.results || res.data?.data || res.data || res.results || [];
        
        this.resumes = records.map(item => ({
          id: item.id || item.resume_id,
          name: item.resume_name || '我的简历.pdf',
          uploadDate: this.formatDate(item.created_at)
        }));
      } catch (e) { console.error("获取简历失败", e); }
    },

    async fetchPointRecords() {
      try {
        const res = await API.getPointRecords();
        const records = res.data?.results || res.data || [];
        this.pointRecords = records.map((item, index) => ({
          id: item.id || index,
          type: item.record_type === 1 || item.amount > 0 ? 'earn' : 'spend',
          amount: Math.abs(item.points || item.amount || 0),
          description: item.description || item.reason || '系统积分变动',
          date: this.formatDate(item.created_at)
        }));
      } catch (e) { console.error("获取积分流水失败", e); }
    },

    // 🌟 完美反向互击：点击主页的长条卡片，直接流畅跨回岗位大厅
    goToJobDetailFromTab(jobId) {
      if (jobId && jobId !== 'undefined') {
        uni.navigateTo({ url: `/pages/student/job-detail?id=${jobId}` });
      } else {
        uni.showToast({ title: '岗位文件已被大厂下架', icon: 'none' });
      }
    },

    viewJobDetail(job) { 
      if (job.jobId) this.goToJobDetailFromTab(job.jobId);
    },
    
    goToUploadResume() { uni.navigateTo({ url: '/pages/student/upload-resume' }); },
    goToRecharge() { uni.navigateTo({ url: '/pages/student/points-recharge' }); },
    
    // 🌟 一键取消收藏储备（精准利用岗位ID做物理注销）
    async unfavorite(job) {
      try {
        await API.deleteFavorite(job.jobId);
        uni.showToast({ title: '已安全移出储备卡槽', icon: 'success' });
        this.fetchFavorites(); // 刷新列表
      } catch (e) {
        uni.showToast({ title: '操作失败', icon: 'none' });
      }
    },

    deleteResume(resume) {
      uni.showModal({
        title: '销毁确认',
        content: '确定要从资产库中永久删除这份简历吗？',
        confirmColor: '#ef4444',
        success: async (res) => {
          if (res.confirm) {
            try {
              await API.deleteResume(resume.id);
              uni.showToast({ title: '已安全销毁', icon: 'success' });
              const currentId = uni.getStorageSync('current_resume_id');
              if (currentId == resume.id) uni.removeStorageSync('current_resume_id');
              this.fetchResumes(); 
            } catch (e) { uni.showToast({ title: '删除失败', icon: 'none' }); }
          }
        }
      });
    },

    logout() {
      uni.showModal({
        title: '断开连接',
        content: '确定要退出当前账号吗？',
        confirmColor: '#ef4444',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '注销中...', mask: true });
            setTimeout(() => {
              uni.clearStorageSync();
              uni.hideLoading();
              uni.redirectTo({ url: '/pages/auth/login' });
            }, 800);
          }
        }
      });
    },

    goBack() { uni.navigateBack(); },

    formatDate(dateString) {
      if (!dateString) return '--';
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
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

.logout-btn { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba($danger, 0.1); border: 1px solid rgba($danger, 0.2); border-radius: 12px; color: $danger; font-size: 14px; font-weight: 500; cursor: pointer; transition: 0.2s; }
.logout-btn:hover { background: rgba($danger, 0.15); border-color: rgba($danger, 0.3); transform: scale(1.02); }

.workspace-body { flex: 1; display: flex; gap: 32px; padding: 32px 40px; height: calc(100vh - 70px); box-sizing: border-box; max-width: 1400px; margin: 0 auto; width: 100%; }

.ultra-glass-card {
  background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
  backdrop-filter: blur(32px); border: 1px solid rgba(255,255,255,0.06);
  border-top: 1px solid rgba(255,255,255,0.12); border-left: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px; box-shadow: 0 16px 40px -10px rgba(0,0,0,0.5); overflow: hidden; position: relative;
}
.hover-lift { transition: all 0.3s ease; cursor: pointer; }
.hover-lift:hover { transform: translateY(-4px); background: rgba(255,255,255,0.05); box-shadow: 0 20px 48px -10px rgba(0,0,0,0.6), 0 0 20px rgba(59,130,246,0.1); }

.left-control-panel { width: 380px; flex-shrink: 0; display: flex; flex-direction: column; }
.left-scroll { height: 100%; }
.left-content-inner { display: flex; flex-direction: column; gap: 24px; padding-right: 16px; }

.user-profile-card { padding: 32px; display: flex; flex-direction: column; align-items: center; text-align: center; }
.avatar-wrapper { position: relative; width: 88px; height: 88px; margin-bottom: 20px; }
.avatar-icon { width: 100%; height: 100%; border-radius: 50%; background: linear-gradient(135deg, rgba($primary,0.2), rgba($secondary,0.2)); display: flex; align-items: center; justify-content: center; font-size: 40px; position: relative; z-index: 2; border: 1px solid rgba($primary,0.4); }
.avatar-ring { position: absolute; inset: -6px; border-radius: 50%; border: 1px dashed rgba($primary, 0.5); animation: rotate 6s linear infinite; }
.avatar-glow { position: absolute; inset: -10px; border-radius: 50%; background: radial-gradient(circle, rgba($primary,0.3), transparent 70%); animation: pulse 3s infinite; }
@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.user-name { font-size: 24px; font-weight: 700; color: #fff; display: block; }
.name-line { width: 40px; height: 3px; background: linear-gradient(90deg, $primary, $secondary); border-radius: 2px; margin: 8px auto 12px; }
.user-id-box { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; color: $text-muted; background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 12px; }
.id-dot { width: 6px; height: 6px; border-radius: 50%; background: $secondary-light; box-shadow: 0 0 8px $secondary; }

.asset-card { padding: 24px; background: linear-gradient(135deg, rgba($success, 0.1), rgba(16,185,129,0.02)); border-color: rgba($success, 0.3); }
.asset-card:hover { border-color: rgba($success, 0.5); box-shadow: 0 16px 30px rgba($success, 0.15); }
.asset-shine { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); transform: skewX(-20deg); animation: shimmerBtn 4s infinite; }
.asset-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.asset-icon-box { font-size: 20px; filter: drop-shadow(0 0 8px rgba($success,0.5)); }
.asset-label { font-size: 14px; font-weight: 500; color: #cbd5e1; }
.asset-body { display: flex; justify-content: space-between; align-items: flex-end; }
.asset-amount { font-size: 36px; font-weight: 800; color: $success; line-height: 1; text-shadow: 0 0 20px rgba($success,0.4); }
.asset-action { display: flex; align-items: center; gap: 4px; font-size: 13px; color: $success; background: rgba($success, 0.15); padding: 6px 12px; border-radius: 10px; font-weight: 600; }
.asset-action .arr { font-size: 16px; transition: 0.2s; }
.asset-card:hover .asset-action .arr { transform: translateX(4px); }

.nav-menu-card { padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.nav-menu-item { display: flex; align-items: center; gap: 16px; padding: 16px 20px; border-radius: 16px; cursor: pointer; transition: 0.3s; position: relative; border: 1px solid transparent; }
.nav-menu-item:hover { background: rgba(255,255,255,0.03); }
.nav-menu-item.active { background: linear-gradient(90deg, rgba($primary, 0.15), transparent); border-color: rgba($primary, 0.2); }
.menu-icon-box { width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 18px; transition: 0.3s; }
.menu-icon-box.active-glow { background: rgba($primary, 0.2); border: 1px solid rgba($primary, 0.4); box-shadow: 0 0 12px rgba($primary, 0.3); }
.menu-label { font-size: 15px; font-weight: 500; color: #cbd5e1; transition: 0.3s; }
.nav-menu-item.active .menu-label { color: #fff; font-weight: 600; }
.menu-indicator { position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 4px; height: 24px; background: $primary; border-radius: 0 4px 4px 0; box-shadow: 0 0 10px $primary; }

.right-content-panel { flex: 1; min-width: 0; }
.h-full { height: 100%; display: flex; flex-direction: column; }
.content-header { padding: 32px 40px 24px; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.1); }
.content-title { font-size: 24px; font-weight: 700; color: #fff; display: block; margin-bottom: 8px; }
.content-subtitle { font-size: 14px; color: $text-muted; }

.detail-scroll { flex: 1; height: 0; }
.detail-inner { padding: 32px 40px; }

/* 🌟 纵向卡片线性铺开核心 */
.list-grid-vertical { display: flex; flex-direction: column; gap: 16px; width: 100%; }
.list-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.data-card { padding: 24px; display: flex; flex-direction: column; border-radius: 20px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); }

/* 🌟 极致对齐：微光磨砂玻璃卡片拟物骨架 */
.resume-style-card { 
  display: flex; flex-direction: row !important; align-items: center; gap: 20px; 
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); 
  border-radius: 20px; padding: 20px; position: relative; width: 100%; box-sizing: border-box;
}
.card-badge-icon { 
  width: 48px; height: 48px; border-radius: 12px; 
  background: linear-gradient(135deg, rgba($primary,0.15), rgba($secondary,0.15)); 
  border: 1px solid rgba($primary, 0.3); display: flex; align-items: center; justify-content: center; 
  font-size: 22px; flex-shrink: 0; 
}
.card-badge-icon.icon-fav { 
  background: linear-gradient(135deg, rgba($warning,0.15), rgba($secondary,0.15)); 
  border-color: rgba($warning, 0.3); 
}

/* 霓虹胶囊状态机 */
.status-badge-neon { 
  padding: 6px 14px; border-radius: 12px; font-size: 12px; font-weight: 600; 
  border: 1px solid; display: flex; align-items: center; gap: 6px; flex-shrink: 0; margin-left: auto;
}
.status-badge-neon.pending { 
  color: $warning; background: rgba($warning, 0.08); border-color: rgba($warning, 0.2); 
  .dot { width: 5px; height: 5px; background: $warning; border-radius: 50%; box-shadow: 0 0 8px $warning; } 
}
.status-badge-neon.interview { 
  color: $primary-light; background: rgba($primary, 0.08); border-color: rgba($primary, 0.2); 
  .dot { width: 5px; height: 5px; background: $primary-light; border-radius: 50%; box-shadow: 0 0 8px $primary; } 
}
.status-badge-neon.rejected { 
  color: $text-muted; background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); 
  .dot { width: 5px; height: 5px; background: $text-muted; border-radius: 50%; } 
}

/* 移出小叉号按钮组件 */
.delete-action-btn { 
  width: 32px; height: 32px; border-radius: 10px; background: rgba($danger, 0.08); 
  border: 1px solid rgba($danger, 0.15); color: $danger; display: flex; align-items: center; 
  justify-content: center; font-size: 18px; cursor: pointer; transition: 0.2s; margin-left: auto;
}
.delete-action-btn:hover { background: rgba($danger, 0.15); transform: scale(1.08); }

/* 原本简历卡片 */
.resume-card { flex-direction: row; align-items: center; gap: 20px; }
.resume-icon-box { width: 56px; height: 56px; border-radius: 14px; background: linear-gradient(135deg, rgba($primary,0.15), rgba($secondary,0.15)); border: 1px solid rgba($primary, 0.3); display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
.resume-info { flex: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0; text-align: left; }
.r-name { font-size: 17px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.r-meta { display: flex; align-items: center; gap: 8px; font-size: 13px; color: $text-muted; }
.r-meta .divider { opacity: 0.5; margin: 0 4px; }
.delete-action { width: 32px; height: 32px; border-radius: 8px; background: rgba($danger, 0.1); border: 1px solid rgba($danger, 0.2); color: $danger; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: 0.2s; cursor: pointer; }
.delete-action:hover { background: rgba($danger, 0.2); transform: scale(1.1); }

.panel-sm-title { font-size: 16px; font-weight: 600; color: #fff; display: block; margin-bottom: 16px; padding-left: 12px; position: relative; }
.panel-sm-title::before { content: ''; position: absolute; left: 0; top: 4px; bottom: 4px; width: 4px; background: $primary; border-radius: 2px; }
.guide-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.guide-item { padding: 20px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; display: flex; align-items: center; gap: 16px; }
.g-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; border: 1px solid; }
.theme-purple { background: rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.3); }
.theme-cyan { background: rgba(6,182,212,0.1); border-color: rgba(6,182,212,0.3); }
.theme-green { background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.3); }
.g-text { display: flex; flex-direction: column; gap: 4px; }
.g-title { font-size: 15px; font-weight: 600; color: #e2e8f0; }
.g-cost { font-size: 13px; color: $warning; font-weight: 500; }

.history-list { display: flex; flex-direction: column; gap: 12px; }
.history-item { padding: 20px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; display: flex; align-items: center; gap: 16px; border-left: 4px solid transparent; }
.history-item.earn { border-left-color: $success; } .history-item.spend { border-left-color: $danger; }
.h-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 20px; }
.h-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.h-desc { font-size: 15px; font-weight: 600; color: #fff; }
.h-date { font-size: 12px; color: $text-muted; }
.h-amount { font-size: 18px; font-weight: 700; padding: 6px 16px; border-radius: 10px; }
.h-amount.earn { color: $success; background: rgba($success, 0.1); } .h-amount.spend { color: $danger; background: rgba($danger, 0.1); }

.empty-state { padding: 80px 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%; }
.empty-icon { font-size: 64px; filter: drop-shadow(0 0 20px rgba(255,255,255,0.1)); margin-bottom: 24px; }
.empty-title { font-size: 20px; font-weight: 600; color: #fff; margin-bottom: 12px; }
.empty-desc { font-size: 14px; color: $text-muted; }

.liquid-btn {
  position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, $primary, $secondary); color: #fff; border-radius: 14px;
  font-size: 15px; font-weight: 600; cursor: pointer; padding: 0 24px; height: 48px; border: none;
  box-shadow: 0 8px 20px rgba($primary, 0.3), inset 0 1px 1px rgba(255,255,255,0.3); transition: all 0.3s;
}
.liquid-btn:hover { box-shadow: 0 12px 28px rgba($primary, 0.5); transform: translateY(-2px); }
.liquid-btn .btn-txt { position: relative; z-index: 2; }

.ghost-btn.outline { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: #cbd5e1; height: 36px; padding: 0 16px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; cursor: pointer; transition: 0.2s; }
.ghost-btn.outline:hover { background: rgba(255,255,255,0.05); color: #fff; border-color: rgba(255,255,255,0.3); }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

.fade-in-down { animation: fadeInDown 0.6s ease both; }
.fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.fade-in-left { animation: fadeInLeft 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.9); } }
.safe-area-bottom { height: 40px; }
.asset-btn-row { display: flex; gap: 16px; align-items: center; }
.download-theme { background: linear-gradient(135deg, #06b6d4, #0891b2) !important; box-shadow: 0 8px 20px rgba(6,182,212, 0.3) !important; }
.download-theme:hover { box-shadow: 0 12px 28px rgba(6,182,212, 0.5) !important; }
</style>