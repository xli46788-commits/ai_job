<template>
  <view class="resume-screening-web">
    <view class="animated-bg">
      <view class="gradient-orb orb-1"></view>
      <view class="gradient-orb orb-2"></view>
      <view class="gradient-orb orb-3"></view>
      <view class="grid-overlay"></view>
    </view>
    
    <view class="workspace-layout">
      <view class="glass-header fade-in-down">
        <view class="header-left">
          <view class="icon-btn" @click="goBack" title="返回">
            <text class="arrow-left">←</text>
          </view>
          <text class="title">智能简历筛选</text>
        </view>
        <view class="header-right">
          <view class="stats-badge">
            <text class="stats-icon">⚡</text>
            <text class="stats-text">平均匹配度 {{ avgMatchRate }}%</text>
          </view>
        </view>
      </view>
      
      <view class="workspace-body">
        
        <view class="left-list-panel fade-in-up delay-1">
          <view class="filter-console">
            <view class="filter-row">
              <view class="filter-btn sort" @click="toggleSortModal">
                <text class="icon">📊</text>
                <text class="f-text">{{ sortOptions[sortIndex] }}</text>
                <text class="arrow">▼</text>
              </view>
              <view class="filter-btn status" @click="toggleStatusModal">
                <text class="icon">🏷️</text>
                <text class="f-text">{{ statusOptions[statusIndex] }}</text>
                <text class="arrow">▼</text>
              </view>
            </view>
            <view class="list-meta">
              <text class="meta-text">检索到 {{ filteredResumes.length }} 份简历</text>
            </view>
          </view>
          
          <scroll-view 
            class="list-scroll custom-scrollbar" 
            scroll-y 
            :refresher-enabled="true" 
            :refresher-triggered="refreshing"
            @refresherrefresh="onRefresh"
          >
            <view class="resume-list-inner" v-if="filteredResumes.length > 0">
              <view 
                v-for="(resume, index) in filteredResumes" 
                :key="index" 
                :class="['compact-card', { 'active': selectedResume && selectedResume.id === resume.id }]"
                :style="cardStyle(index)"
                @click="selectResume(resume)"
              >
                <view class="c-avatar-wrap">
                  <view class="c-avatar">👤</view>
                  <view class="c-status-dot" :class="resume.status"></view>
                </view>
                <view class="c-info">
                  <view class="c-name-row">
                    <text class="c-name">{{ resume.name }}</text>
                    <text class="c-tag" :class="resume.status">{{ resume.statusText }}</text>
                  </view>
                  <text class="c-desc">应聘：{{ resume.jobName }}</text>
                </view>
                <view class="c-match" :style="getMatchStyle(resume.matchRate)">
                  <text class="m-val">{{ resume.matchRate }}</text>
                  <text class="m-unit">%</text>
                </view>
              </view>
            </view>
            
            <view v-else class="empty-state mini">
              <text class="empty-icon">📂</text>
              <text class="empty-text">暂无符合条件的简历</text>
            </view>
          </scroll-view>
        </view>

        <view class="right-detail-panel fade-in-left delay-2">
          <scroll-view class="detail-scroll custom-scrollbar" scroll-y>
            <view class="detail-content" v-if="selectedResume">
              
              <view class="detail-header-card">
                <view class="dh-top">
                  <view class="dh-profile">
                    <view class="dh-avatar">👤</view>
                    <view class="dh-base">
                      <view class="dh-name-line">
                        <text class="dh-name">{{ selectedResume.name }}</text>
                        <text class="neon-status" :class="selectedResume.status">{{ selectedResume.statusText }}</text>
                      </view>
                      <text class="dh-school">应聘岗位：{{ selectedResume.jobName }}</text>
                    </view>
                  </view>
                  <view class="dh-actions">
                    <view class="ghost-btn" @click="showStatusOptions(selectedResume)">
                      <text>流转状态 ▼</text>
                    </view>
                    <view class="liquid-btn success" @click="contactApplicant(selectedResume)">
                      <text class="btn-txt">💬 立即沟通</text>
                    </view>
                  </view>
                </view>
              </view>

              <view class="ai-insight-card">
                <view class="card-title-bar">
                  <text class="icon pulse-icon">✨</text>
                  <text class="card-title">AI Copilot 匹配洞察</text>
                  <view class="match-score-badge" :style="getMatchStyle(selectedResume.matchRate)">
                    综合匹配度 {{ selectedResume.matchRate }}%
                  </view>
                </view>
                <view class="insight-body">
                  <view class="insight-text">
                    <text class="highlight">💡 核心优势：</text>
                    {{ selectedResume.insight.advantages || '暂未提取到核心优势数据。' }}
                  </view>
                  <view class="insight-text mt-10">
                    <text class="highlight warning">⚠️ 风险提示：</text>
                    {{ selectedResume.insight.risks || '暂未提取到相关风险数据。' }}
                  </view>
                </view>
              </view>

              <view class="info-grid">
                <view class="glass-block">
                  <view class="block-title">AI 提取专业技能</view>
                  <view class="skills-wrapper" v-if="selectedResume.insight.skills && selectedResume.insight.skills.length > 0">
                    <view v-for="(skill, index) in selectedResume.insight.skills" :key="index" class="neon-tag active">
                      {{ skill }}
                    </view>
                  </view>
                  <view class="skills-wrapper" v-else>
                    <view class="neon-tag ghost">暂未提取到专业技能</view>
                  </view>
                </view>
                
                <view class="glass-block span-2">
                  <view class="block-title">履历与经验摘要</view>
                  <view class="exp-content">
                    <text class="p-text">{{ selectedResume.insight.experience_summary || '暂未提取到履历与经验摘要数据。' }}</text>
                  </view>
                </view>
              </view>

            </view>

            <view class="detail-empty-state" v-else>
              <text class="empty-icon">🤖</text>
              <text class="empty-title">AI 引擎待命</text>
              <text class="empty-desc">请在左侧选择一份简历，我将为您生成深度的“人岗匹配分析报告”。</text>
            </view>
          </scroll-view>
        </view>
        
      </view>
      
      <view v-if="showSortModal" class="modal-overlay" @click="showSortModal = false">
        <view class="modal-box" @click.stop>
          <view class="modal-header">
            <text class="modal-title">排序方式</text>
            <text class="modal-close" @click="showSortModal = false">×</text>
          </view>
          <view class="modal-body">
            <view v-for="(option, index) in sortOptions" :key="index" :class="['modal-item', { active: sortIndex === index }]" @click="selectSort(index)">
              <text class="item-text">{{ option }}</text>
              <view v-if="sortIndex === index" class="check-mark">✓</view>
            </view>
          </view>
        </view>
      </view>
      
      <view v-if="showStatusModal" class="modal-overlay" @click="showStatusModal = false">
        <view class="modal-box" @click.stop>
          <view class="modal-header">
            <text class="modal-title">筛选状态</text>
            <text class="modal-close" @click="showStatusModal = false">×</text>
          </view>
          <view class="modal-body">
            <view v-for="(option, index) in statusOptions" :key="index" :class="['modal-item', { active: statusIndex === index }]" @click="selectStatus(index)">
              <text class="item-text">{{ option }}</text>
              <view v-if="statusIndex === index" class="check-mark">✓</view>
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
      sortIndex: 0,
      statusIndex: 0,
      showSortModal: false,
      showStatusModal: false,
      refreshing: false,
      
      // 这些是 UI 筛选项配置，不是假数据，正常保留
      sortOptions: ['匹配度从高到低', '匹配度从低到高', '最新投递'],
      statusOptions: ['全部状态', '待处理', '面试中', '不合适'],
      
      resumes: [], 
      filteredResumes: [],
      selectedResume: null,
      
      // 状态映射字典（与后端逻辑一致）
      statusMap: {
        'pending': { str: 'pending', text: '待处理' },
        'viewed': { str: 'interview', text: '已查看' },
        'interview': { str: 'interview', text: '面试中' },
        'rejected': { str: 'rejected', text: '不合适' }
      }
    }
  },
  
  computed: {
    avgMatchRate() {
      if (this.filteredResumes.length === 0) return 0
      const total = this.filteredResumes.reduce((sum, r) => sum + r.matchRate, 0)
      return Math.round(total / this.filteredResumes.length)
    }
  },
  
  mounted() {
    this.fetchDeliveries(); 
  },
  
  methods: {
    async fetchDeliveries() {
      uni.showLoading({ title: '扫描人才库...' });
      try {
        const res = await API.getCompanyDeliveries();
        const records = res.data?.results || res.data || res.results || res || [];
        
        if (records.length > 0) {
          // 真实数据结构映射，解析后端传来的 ai_insight JSON 数据
          this.resumes = records.map(r => {
            const statObj = this.statusMap[r.status] || this.statusMap['pending'];
            
            // 安全解析 JSON
            let parsedInsight = {};
            try {
               parsedInsight = r.ai_insight ? JSON.parse(r.ai_insight) : {};
            } catch (e) {
               console.error("AI 报告解析失败", e);
            }

            return {
              id: r.application_id, 
              // 🚀 替换为更严谨的占位符
              name: r.student_name || '未知候选人',
              jobName: r.job_name || '未知岗位',
              matchRate: r.match_score || 0, 
              status: statObj.str,
              statusText: statObj.text,
              backendStatus: r.status, 
              insight: parsedInsight   
            };
          });
        } else {
          this.resumes = []; 
        }
        
        this.filterByStatus();
      } catch (error) {
        console.error("获取简历失败", error);
        uni.showToast({ title: '拉取数据失败', icon: 'none' });
        this.resumes = [];
        this.filterByStatus();
      } finally {
        uni.hideLoading();
      }
    },

    selectResume(resume) {
      this.selectedResume = resume;
    },
    
    cardStyle(index) {
      return { animationDelay: `${index * 0.05}s` }
    },
    
    getMatchStyle(rate) {
      if (rate >= 90) return { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }
      else if (rate >= 70) return { background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.4)' }
      else return { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }
    },
    
    sortResumes() {
      if (this.sortIndex === 0) this.filteredResumes.sort((a, b) => b.matchRate - a.matchRate)
      else if (this.sortIndex === 1) this.filteredResumes.sort((a, b) => a.matchRate - b.matchRate)
      // 注意：'最新投递' 需要后端配合按时间排序，如果只在前端，且未存储时间，则保留原始顺序或依靠后端默认序
    },
    
    filterByStatus() {
      if (this.statusIndex === 0) {
        this.filteredResumes = [...this.resumes]
      } else {
        const filterStrMap = { 1: 'pending', 2: 'interview', 3: 'rejected' }
        const status = filterStrMap[this.statusIndex]
        this.filteredResumes = this.resumes.filter(r => r.status === status)
      }
      this.sortResumes()
      this.selectedResume = this.filteredResumes.length > 0 ? this.filteredResumes[0] : null
    },
    
    toggleSortModal() { this.showSortModal = !this.showSortModal; this.showStatusModal = false; },
    toggleStatusModal() { this.showStatusModal = !this.showStatusModal; this.showSortModal = false; },
    selectSort(index) { this.sortIndex = index; this.sortResumes(); this.showSortModal = false; },
    selectStatus(index) { this.statusIndex = index; this.filterByStatus(); this.showStatusModal = false; },
    
    onRefresh() {
      this.refreshing = true
      this.fetchDeliveries().then(() => { this.refreshing = false; })
    },
    
    contactApplicant(resume) {
      uni.showToast({ title: '即将唤起 IM...', icon: 'none' })
    },
    
    showStatusOptions(resume) {
      uni.showActionSheet({
        itemList: ['标记为：待处理', '标记为：面试中', '标记为：不合适'],
        success: async (res) => {
          const backendStatusStr = ['pending', 'interview', 'rejected'][res.tapIndex]; 
          
          uni.showLoading({ title: '状态流转中...' });
          try {
            await API.updateDeliveryStatus(resume.id, { status: backendStatusStr });
            
            // 更新当前 UI
            const newStatus = this.statusMap[backendStatusStr];
            resume.status = newStatus.str;
            resume.statusText = newStatus.text;
            resume.backendStatus = backendStatusStr;
            
            uni.hideLoading();
            uni.showToast({ title: '简历流转成功', icon: 'success' });
            
            // 重新刷新列表分布
            if (this.statusIndex !== 0) {
              this.filterByStatus();
            }
          } catch (error) {
            uni.hideLoading();
            uni.showToast({ title: '流转失败请重试', icon: 'none' });
          }
        }
      })
    },
    
    goBack() { uni.navigateBack() }
  }
}
</script>

<style lang="scss" scoped>
/* ==================== 宇宙色彩体系 ==================== */
$bg-deep: #030308;
$primary: #3b82f6;
$secondary: #8b5cf6;
$accent: #06b6d4;
$success: #10b981;
$warning: #f59e0b;
$danger: #ef4444;
$info: #06b6d4; 
$text-main: #f8fafc;
$text-muted: #64748b;

/* ==================== 基础与极光背景 ==================== */
.resume-screening-web {
  height: 100vh; width: 100vw; background-color: $bg-deep; position: relative; overflow: hidden;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.animated-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.gradient-orb { position: absolute; border-radius: 50%; filter: blur(140px); opacity: 0.4; mix-blend-mode: screen; animation: float 25s infinite alternate ease-in-out; }
.orb-1 { width: 50vw; height: 50vw; background: radial-gradient(circle, rgba($primary,0.3) 0%, transparent 70%); top: -10%; left: -10%; }
.orb-2 { width: 45vw; height: 45vw; background: radial-gradient(circle, rgba($secondary,0.25) 0%, transparent 70%); bottom: -20%; right: 5%; animation-delay: -5s; }
.orb-3 { width: 40vw; height: 40vw; background: radial-gradient(circle, rgba($accent,0.15) 0%, transparent 70%); top: 30%; left: 30%; animation-delay: -10s; }
.grid-overlay { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px); background-size: 40px 40px; }
@keyframes float { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(4%, 6%) scale(1.1); } }

/* ==================== 核心布局 ==================== */
.workspace-layout { position: relative; z-index: 10; height: 100vh; display: flex; flex-direction: column; }

/* 顶部导航 */
.glass-header { 
  height: 70px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px;
  background: linear-gradient(180deg, rgba(3,3,8,0.85) 0%, transparent 100%); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05); flex-shrink: 0;
}
.header-left { display: flex; align-items: center; gap: 20px; }
.icon-btn { width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
.icon-btn:hover { background: rgba(255,255,255,0.1); transform: translateX(-2px); }
.arrow-left { color: #fff; font-size: 18px; }
.title { font-size: 18px; font-weight: 600; color: #fff; letter-spacing: 1px; }
.stats-badge { display: flex; align-items: center; gap: 8px; padding: 6px 16px; background: rgba($primary, 0.1); border: 1px solid rgba($primary, 0.2); border-radius: 20px; }
.stats-icon { font-size: 14px; } .stats-text { font-size: 13px; font-weight: 600; color: #bfdbfe; }

/* 工作区主体 */
.workspace-body { flex: 1; display: flex; gap: 24px; padding: 24px 40px; height: calc(100vh - 70px); box-sizing: border-box; max-width: 1600px; margin: 0 auto; width: 100%; }

/* ==================== 左侧：简历列表舱 ==================== */
.left-list-panel { width: 380px; flex-shrink: 0; display: flex; flex-direction: column; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 24px; backdrop-filter: blur(24px); overflow: hidden; }
.filter-console { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.15); }
.filter-row { display: flex; gap: 12px; margin-bottom: 16px; }
.filter-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; cursor: pointer; transition: 0.2s; }
.filter-btn:hover { background: rgba(255,255,255,0.08); }
.f-text { font-size: 13px; color: #cbd5e1; } .arrow { font-size: 10px; color: $text-muted; }
.filter-btn.sort { border-color: rgba($primary, 0.3); background: rgba($primary, 0.05); .f-text { color: #bfdbfe; } }
.list-meta { font-size: 12px; color: $text-muted; padding-left: 4px; }

.list-scroll { flex: 1; height: 0; padding: 12px; }
.resume-list-inner { display: flex; flex-direction: column; gap: 10px; }

/* 紧凑型卡片 */
.compact-card { 
  display: flex; align-items: center; gap: 12px; padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; cursor: pointer; transition: all 0.2s;
  animation: slideUp 0.4s ease backwards;
}
.compact-card:hover { background: rgba(255,255,255,0.05); transform: translateX(4px); }
.compact-card.active { background: linear-gradient(90deg, rgba($primary, 0.15), rgba(255,255,255,0.02)); border-color: rgba($primary, 0.4); border-left: 4px solid $primary; box-shadow: inset 0 0 20px rgba($primary, 0.05); }

.c-avatar-wrap { position: relative; }
.c-avatar { width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 20px; }
.c-status-dot { position: absolute; bottom: -2px; right: -2px; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #0f121b; }
.c-status-dot.pending { background: $warning; } .c-status-dot.interview { background: $info; } .c-status-dot.rejected { background: $danger; }

.c-info { flex: 1; min-width: 0; }
.c-name-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.c-name { font-size: 15px; font-weight: 600; color: #fff; }
.c-tag { font-size: 10px; padding: 2px 6px; border-radius: 6px; }
.c-tag.pending { color: $warning; background: rgba($warning, 0.15); } .c-tag.interview { color: $info; background: rgba($info, 0.15); } .c-tag.rejected { color: $danger; background: rgba($danger, 0.15); }
.c-desc { font-size: 12px; color: $text-muted; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.c-match { display: flex; align-items: baseline; gap: 2px; padding: 6px 10px; border-radius: 10px; border: 1px solid; }
.m-val { font-size: 16px; font-weight: 700; } .m-unit { font-size: 10px; }

/* ==================== 右侧：AI 详情分析舱 ==================== */
.right-detail-panel { flex: 1; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-top: 1px solid rgba(255,255,255,0.12); border-radius: 24px; backdrop-filter: blur(32px); overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,0.3); }
.detail-scroll { height: 100%; padding: 36px; box-sizing: border-box; }

/* 详情卡片结构 */
.detail-header-card { margin-bottom: 28px; }
.dh-top { display: flex; justify-content: space-between; align-items: flex-start; }
.dh-profile { display: flex; gap: 20px; }
.dh-avatar { width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, rgba($primary,0.2), rgba($secondary,0.2)); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 32px; box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
.dh-name-line { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; margin-top: 4px; }
.dh-name { font-size: 24px; font-weight: 700; color: #fff; }
.neon-status { font-size: 12px; padding: 4px 10px; border-radius: 8px; border: 1px solid; }
.neon-status.pending { color: $warning; border-color: rgba($warning,0.4); box-shadow: 0 0 10px rgba($warning,0.2); }
.neon-status.interview { color: $info; border-color: rgba($info,0.4); box-shadow: 0 0 10px rgba($info,0.2); }
.neon-status.rejected { color: $danger; border-color: rgba($danger,0.4); }
.dh-school { font-size: 14px; color: #cbd5e1; }

.dh-actions { display: flex; gap: 12px; }

/* AI 洞察面板 */
.ai-insight-card { position: relative; padding: 24px; border-radius: 20px; margin-bottom: 28px; background: linear-gradient(145deg, rgba($secondary, 0.1) 0%, rgba(255,255,255,0.02) 100%); border: 1px solid rgba($secondary, 0.2); overflow: hidden; }
.card-title-bar { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.pulse-icon { font-size: 18px; filter: drop-shadow(0 0 8px rgba($secondary,0.8)); animation: pulse 2s infinite; }
.card-title { font-size: 16px; font-weight: 600; background: linear-gradient(90deg, #fff, #d8b4fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.match-score-badge { margin-left: auto; font-size: 13px; font-weight: 600; padding: 4px 12px; border-radius: 12px; border: 1px solid; }
.insight-body { background: rgba(0,0,0,0.2); border-radius: 12px; padding: 16px; border: 1px solid rgba(255,255,255,0.05); }
.insight-text { font-size: 14px; color: #e2e8f0; line-height: 1.6; }
.highlight { color: #d8b4fe; font-weight: 600; } .warning { color: $warning; } .mt-10 { margin-top: 10px; }

/* 基础信息网格 */
.info-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
.glass-block { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-top: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; }
.block-title { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
.block-title::before { content: ''; display: block; width: 4px; height: 14px; background: $primary; border-radius: 2px; }

.skills-wrapper { display: flex; flex-wrap: wrap; gap: 10px; }
.neon-tag { padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 500; background: rgba(255,255,255,0.03); color: #cbd5e1; border: 1px solid rgba(255,255,255,0.08); transition: 0.2s; }
.neon-tag.active { background: rgba($primary, 0.1); color: #bfdbfe; border-color: rgba($primary, 0.3); }
.neon-tag.ghost { background: transparent; border: 1px dashed rgba(255,255,255,0.2); }

.p-text { font-size: 14px; color: #cbd5e1; line-height: 1.8; }

/* 按钮通用 */
.liquid-btn {
  display: inline-flex; align-items: center; justify-content: center; height: 40px; padding: 0 20px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.2s; color: #fff;
  &.success { background: linear-gradient(135deg, $success, #059669); box-shadow: 0 4px 12px rgba($success, 0.3); border: 1px solid rgba(255,255,255,0.2); }
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba($success, 0.4); }
}
.ghost-btn { display: inline-flex; align-items: center; justify-content: center; height: 40px; padding: 0 16px; border-radius: 12px; font-size: 14px; background: rgba(255,255,255,0.05); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: 0.2s; }
.ghost-btn:hover { background: rgba(255,255,255,0.1); }

/* 空状态 */
.detail-empty-state, .empty-state.mini { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; opacity: 0.8; }
.empty-state.mini { height: 200px; }
.detail-empty-state .empty-icon { font-size: 64px; filter: drop-shadow(0 0 20px rgba($primary, 0.5)); margin-bottom: 24px; }
.empty-text { font-size: 14px; color: $text-muted; }
.empty-title { font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 12px; }
.empty-desc { font-size: 14px; color: $text-muted; }

/* 滚动条定制 */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

/* 模态框修正 */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 100; display: flex; align-items: center; justify-content: center; }
.modal-box { width: 320px; background: rgba(15,23,42,0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
.modal-header { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
.modal-title { color: #fff; font-weight: 600; }
.modal-close { color: $text-muted; font-size: 20px; cursor: pointer; transition: 0.2s; }
.modal-close:hover { color: #fff; }
.modal-body { padding: 12px; }
.modal-item { padding: 14px 16px; border-radius: 12px; display: flex; justify-content: space-between; cursor: pointer; color: #cbd5e1; transition: 0.2s; }
.modal-item:hover { background: rgba(255,255,255,0.05); }
.modal-item.active { background: rgba($primary, 0.15); color: $primary; font-weight: 500; }

/* 动画序列 */
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.9); } }
.fade-in-down { animation: fadeInDown 0.6s ease forwards; }
.fade-in-up { animation: fadeInUp 0.6s ease forwards; opacity: 0; }
.fade-in-left { animation: fadeInLeft 0.6s ease forwards; opacity: 0; }
.delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
</style>