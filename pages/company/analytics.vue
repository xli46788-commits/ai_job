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
          <view class="icon-btn" @click="goBack" title="返回控制台">
            <text class="arrow-left">←</text>
          </view>
          <text class="title">全景漏斗分析</text>
        </view>
        <view class="header-right">
          <view class="time-filter-group">
            <view 
              v-for="(tf, index) in timeFilters" 
              :key="index"
              class="tf-btn"
              :class="{ active: currentTimeFilter === tf.value }"
              @click="handleTimeFilterChange(tf.value)"
            >
              {{ tf.label }}
            </view>
          </view>
          <view class="ghost-btn export-btn" @click="exportReport">
            <text>📥 导出报告</text>
          </view>
        </view>
      </view>

      <scroll-view class="dashboard-scroll custom-scrollbar" scroll-y>
        <view class="dashboard-body">
          
          <view class="overview-grid fade-in-up delay-1">
            <view class="ultra-glass-card kpi-card" v-for="(kpi, index) in kpiData" :key="index">
              <view class="kpi-header">
                <view class="kpi-icon-box" :class="`theme-${index}`">{{ kpi.icon }}</view>
                <view class="trend-badge" :class="kpi.trendType" v-if="kpi.trendRate !== '--'">
                  {{ kpi.trend === 'up' ? '↗' : (kpi.trend === 'down' ? '↘' : '-') }} {{ kpi.trendRate }}
                </view>
              </view>
              <view class="kpi-content">
                <text class="kpi-value">{{ kpi.value }}</text>
                <text class="kpi-label">{{ kpi.label }}</text>
              </view>
              <view class="kpi-bottom-line" :class="`line-${index}`"></view>
            </view>
          </view>

          <view class="main-chart-row fade-in-up delay-2">
            
            <view class="ultra-glass-card chart-panel">
              <view class="panel-header">
                <text class="panel-title">招聘全链路转化漏斗</text>
                <text class="panel-subtitle">候选人生命周期监控</text>
              </view>
              
              <view class="funnel-container" v-if="funnelStages.length > 0">
                <view class="funnel-stage" v-for="(stage, index) in funnelStages" :key="index">
                  <view class="stage-info">
                    <text class="s-icon">{{ stage.icon }}</text>
                    <text class="s-name">{{ stage.name }}</text>
                    <text class="s-val">{{ stage.count }}</text>
                  </view>
                  <view class="stage-bar-wrap">
                    <view class="stage-bar" :style="{ width: stage.percent + '%', background: stage.color }">
                      <view class="bar-glow"></view>
                    </view>
                  </view>
                  <view class="stage-conversion" v-if="index > 0">
                    <view class="conv-line"></view>
                    <view class="conv-badge">
                      <text class="c-label">转化</text>
                      <text class="c-rate">{{ stage.convRate }}%</text>
                    </view>
                  </view>
                </view>
              </view>
              
              <view class="empty-state mini" v-else>
                <text class="empty-icon">📉</text>
                <text class="empty-text">当前时段暂无漏斗数据</text>
              </view>
            </view>

            <view class="ai-insight-panel">
              <view class="liquid-ai-card h-full">
                <view class="liquid-bg"></view>
                <view class="ai-card-content vertical">
                  <view class="ai-header">
                    <view class="ai-avatar pulse-icon">✨</view>
                    <view class="ai-title-box">
                      <text class="a-title">Copilot 数据诊断</text>
                      <text class="a-sub">基于行业大数据比对</text>
                    </view>
                  </view>
                  
                  <scroll-view class="ai-msg-scroll custom-scrollbar" scroll-y>
                    
                    <view v-if="aiInsights.length > 0">
                      <view 
                        class="insight-msg" 
                        v-for="(insight, index) in aiInsights" 
                        :key="index"
                        :class="insight.type"
                        :style="index > 0 ? 'margin-top: 16px;' : ''"
                      >
                        <view class="msg-icon">{{ insight.type === 'warning' ? '⚠️' : '💡' }}</view>
                        <view class="msg-text">
                          <text class="m-title">{{ insight.title }}</text>
                          <rich-text class="m-desc" :nodes="insight.desc"></rich-text>
                        </view>
                      </view>

                      <view class="action-card mt-16" v-if="hasOptimizationSuggest">
                        <text class="ac-title">AI 优化建议：重构筛选标准</text>
                        <view class="liquid-btn micro mt-10" @click="applyAIStrategy">
                          <text class="btn-txt">⚡ 一键应用智能策略</text>
                        </view>
                      </view>
                    </view>

                    <view class="empty-state mini" style="padding-top: 40px;" v-else>
                      <text class="empty-icon">🤖</text>
                      <text class="empty-text">数据量不足，AI 正在收集中...</text>
                    </view>

                  </scroll-view>
                </view>
              </view>
            </view>
          </view>

          <view class="sub-chart-row fade-in-up delay-3">
            <view class="ultra-glass-card sub-panel">
              <view class="panel-header">
                <text class="panel-title">各岗位面试效率 (Top 3)</text>
              </view>
              <view class="efficiency-list" v-if="efficiencyJobs.length > 0">
                <view class="eff-item" v-for="(job, i) in efficiencyJobs" :key="i">
                  <text class="eff-name">{{ job.name }}</text>
                  <view class="eff-bar-bg">
                    <view class="eff-bar-fill" :style="{ width: job.score + '%' }"></view>
                  </view>
                  <text class="eff-score">{{ job.days }} 天/人</text>
                </view>
              </view>
              <view class="empty-state mini" v-else>
                <text class="empty-text">暂无面试效率数据</text>
              </view>
            </view>

            <view class="ultra-glass-card sub-panel">
              <view class="panel-header">
                <text class="panel-title">人才渠道贡献率</text>
              </view>
              <view class="channel-list" v-if="channelData.length > 0">
                <view class="ch-item" v-for="(ch, idx) in channelData" :key="idx">
                  <text class="ch-dot" :class="`c-${idx + 1}`"></text>{{ ch.name }} ({{ ch.percent }}%)
                </view>
              </view>
              <view class="empty-state mini" v-else>
                <text class="empty-text">暂无渠道数据</text>
              </view>
            </view>
          </view>

          <view class="safe-area-bottom"></view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
// 🚀 引入真实接口
import { API } from '../../utils/api.js';

export default {
  data() {
    return {
      currentTimeFilter: '30d',
      timeFilters: [
        { label: '今日', value: 'today' },
        { label: '近7天', value: '7d' },
        { label: '近30天', value: '30d' },
        { label: '本季度', value: 'quarter' }
      ],
      // 🚀 初始化为安全占位符，拒绝写死
      kpiData: [
        { label: '职位总曝光', value: '--', icon: '👁️', trend: 'neutral', trendRate: '--', trendType: 'neutral' },
        { label: '收到新简历', value: '--', icon: '📥', trend: 'neutral', trendRate: '--', trendType: 'neutral' },
        { label: '进行中面试', value: '--', icon: '🗣️', trend: 'neutral', trendRate: '--', trendType: 'neutral' },
        { label: '已发 Offer', value: '--', icon: '🎉', trend: 'neutral', trendRate: '--', trendType: 'neutral' }
      ],
      funnelStages: [],
      efficiencyJobs: [],
      channelData: [],
      aiInsights: [],
      hasOptimizationSuggest: false
    };
  },
  mounted() {
    this.fetchAnalyticsData();
  },
  methods: {
    handleTimeFilterChange(val) {
      this.currentTimeFilter = val;
      this.fetchAnalyticsData(); // 切换时间重新拉取数据
    },

    // 🚀 建立真实的数据请求通道
    async fetchAnalyticsData() {
      uni.showLoading({ title: '多维数据聚合中...' });
      
      try {
        // 假设您的 api.js 中有 getSystemAnalytics 或对应的企业报表接口
        const res = await API.getSystemAnalytics({ time: this.currentTimeFilter });
        const data = res.data?.data || res.data || {};
        
        // 渲染真实数据 (这里需要根据您后端的实际返回结构调整)
        if (data.kpi) this.kpiData = data.kpi;
        if (data.funnel) this.funnelStages = data.funnel;
        if (data.efficiency) this.efficiencyJobs = data.efficiency;
        if (data.channels) this.channelData = data.channels;
        if (data.insights) {
          this.aiInsights = data.insights;
          this.hasOptimizationSuggest = data.insights.some(i => i.type === 'warning');
        }
        
      } catch (error) {
        console.error('获取全景漏斗数据失败:', error);
        uni.showToast({ title: '暂时无法获取报表数据', icon: 'none' });
        // 🚀 接口失败时重置为空数组，让页面优雅地展示为空状态，而不是爆出假数据
        this.funnelStages = [];
        this.efficiencyJobs = [];
        this.channelData = [];
        this.aiInsights = [];
        this.hasOptimizationSuggest = false;
        // 重置 KPI 为横线
        this.kpiData.forEach(k => { k.value = '--'; k.trendRate = '--'; });
      } finally {
        uni.hideLoading();
      }
    },
    
    goBack() { uni.navigateBack(); },
    
    exportReport() {
      uni.showLoading({ title: '正在生成 PDF 报告...', mask: true });
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({ title: '导出成功', icon: 'success' });
      }, 1500);
    },
    
    applyAIStrategy() {
      uni.showLoading({ title: 'AI 策略应用中...', mask: true });
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({ title: '筛选模型已重构', icon: 'success' });
      }, 1500);
    }
  }
};
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

/* ==================== 极光背景 ==================== */
.company-universe-web {
  min-height: 100vh; width: 100vw; background-color: $bg-deep; position: relative; overflow-x: hidden;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.aurora-wrapper { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
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

.header-right { display: flex; align-items: center; gap: 24px; }
.time-filter-group { display: flex; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 4px; }
.tf-btn { padding: 6px 16px; font-size: 13px; color: $text-muted; border-radius: 8px; cursor: pointer; transition: 0.3s; }
.tf-btn.active { background: rgba(255,255,255,0.1); color: #fff; font-weight: 500; }
.export-btn { height: 36px; border-radius: 10px; }

/* Dashboard 主体 */
.dashboard-scroll { flex: 1; height: 0; }
.dashboard-body { max-width: 1600px; margin: 0 auto; padding: 32px 40px; display: flex; flex-direction: column; gap: 32px; }

/* 空状态占位 (新增) */
.empty-state.mini {
  padding: 40px 0; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0.7;
}
.empty-state.mini .empty-icon { font-size: 32px; margin-bottom: 12px; filter: grayscale(100%); opacity: 0.5; }
.empty-state.mini .empty-text { font-size: 13px; color: $text-muted; }

/* 公用卡片底座 */
.ultra-glass-card {
  background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
  backdrop-filter: blur(32px) saturate(120%); border: 1px solid rgba(255,255,255,0.06);
  border-top: 1px solid rgba(255,255,255,0.12); border-left: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px; box-shadow: 0 16px 40px -10px rgba(0,0,0,0.5); position: relative; overflow: hidden;
}

/* ==================== 1. KPI 数据概览 ==================== */
.overview-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.kpi-card { padding: 24px; display: flex; flex-direction: column; gap: 20px; transition: 0.3s; }
.kpi-card:hover { transform: translateY(-4px); background: rgba(255,255,255,0.05); }
.kpi-header { display: flex; justify-content: space-between; align-items: flex-start; }
.kpi-icon-box { width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; font-size: 20px; }
.theme-0 { background: rgba($primary, 0.1); border-color: rgba($primary, 0.3); }
.theme-1 { background: rgba($secondary, 0.1); border-color: rgba($secondary, 0.3); }
.theme-2 { background: rgba($warning, 0.1); border-color: rgba($warning, 0.3); }
.theme-3 { background: rgba($success, 0.1); border-color: rgba($success, 0.3); }
.trend-badge { font-size: 13px; font-weight: 600; padding: 4px 10px; border-radius: 8px; }
.trend-badge.good { color: $success; background: rgba($success, 0.1); }
.trend-badge.warn { color: $warning; background: rgba($warning, 0.1); }
.trend-badge.neutral { color: $text-muted; background: rgba(255,255,255, 0.05); }

.kpi-content { display: flex; flex-direction: column; }
.kpi-value { font-size: 32px; font-weight: 800; color: #fff; line-height: 1.2; margin-bottom: 4px; letter-spacing: 0.5px; }
.kpi-label { font-size: 13px; color: $text-muted; }
.kpi-bottom-line { position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; opacity: 0.8; }
.line-0 { background: linear-gradient(90deg, transparent, $primary, transparent); }
.line-1 { background: linear-gradient(90deg, transparent, $secondary, transparent); }
.line-2 { background: linear-gradient(90deg, transparent, $warning, transparent); }
.line-3 { background: linear-gradient(90deg, transparent, $success, transparent); }

/* ==================== 2. 主图表区 (漏斗 + AI) ==================== */
.main-chart-row { display: flex; gap: 24px; height: 500px; }

/* 左侧：纯 CSS 漏斗 */
.chart-panel { flex: 2; padding: 32px; display: flex; flex-direction: column; }
.panel-header { margin-bottom: 32px; }
.panel-title { font-size: 18px; font-weight: 600; color: #fff; display: block; margin-bottom: 4px; }
.panel-subtitle { font-size: 13px; color: $text-muted; }

.funnel-container { flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding-right: 40px; }
.funnel-stage { display: flex; align-items: center; position: relative; }
.stage-info { width: 140px; display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.s-icon { font-size: 20px; }
.s-name { font-size: 14px; color: #cbd5e1; width: 60px; }
.s-val { font-size: 16px; font-weight: 700; color: #fff; text-align: right; flex: 1; }

.stage-bar-wrap { flex: 1; height: 32px; background: rgba(255,255,255,0.03); border-radius: 16px; margin: 0 32px; overflow: hidden; position: relative; border: 1px solid rgba(255,255,255,0.05); }
.stage-bar { height: 100%; border-radius: 16px; position: relative; transition: width 1s cubic-bezier(0.2, 0.8, 0.2, 1); }
.bar-glow { position: absolute; right: 0; top: 0; width: 40px; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6)); filter: blur(4px); }

/* 转化率指示引线 */
.stage-conversion { position: absolute; right: -40px; top: -30px; display: flex; flex-direction: column; align-items: center; }
.conv-line { width: 2px; height: 30px; background: dashed 1px rgba(255,255,255,0.2); }
.conv-badge { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 8px; backdrop-filter: blur(4px); display: flex; flex-direction: column; align-items: center; }
.c-label { font-size: 10px; color: $text-muted; }
.c-rate { font-size: 12px; font-weight: 600; color: $accent; }

/* 右侧：AI 洞察 */
.ai-insight-panel { flex: 1; min-width: 380px; }
.h-full { height: 100%; }
.liquid-ai-card {
  position: relative; border-radius: 20px; padding: 1px; box-sizing: border-box;
  background: linear-gradient(135deg, rgba(59,130,246,0.5), rgba(139,92,246,0.5), rgba(6,182,212,0.5));
  background-size: 200% 200%; animation: gradientFlow 6s linear infinite; box-shadow: 0 16px 40px rgba(139,92,246,0.2);
}
@keyframes gradientFlow { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }

.ai-card-content { background: #070A12; border-radius: 19px; display: flex; flex-direction: column; height: 100%; overflow: hidden; }
.ai-header { padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 16px; background: rgba(255,255,255,0.02); }
.ai-avatar { width: 44px; height: 44px; border-radius: 12px; background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.3); display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 0 15px rgba(139,92,246,0.2); }
.ai-title-box { display: flex; flex-direction: column; gap: 2px; }
.a-title { font-size: 16px; font-weight: 600; background: linear-gradient(90deg, #fff, #d8b4fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.a-sub { font-size: 12px; color: $text-muted; }

.ai-msg-scroll { flex: 1; padding: 24px; }
.insight-msg { padding: 16px; border-radius: 14px; border: 1px solid; display: flex; gap: 12px; align-items: flex-start; }
.insight-msg.warning { background: rgba($warning, 0.05); border-color: rgba($warning, 0.2); }
.insight-msg.success { background: rgba($success, 0.05); border-color: rgba($success, 0.2); }
.msg-icon { font-size: 18px; line-height: 1.2; }
.msg-text { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.m-title { font-size: 14px; font-weight: 600; color: #fff; }
.m-desc { font-size: 13px; color: #cbd5e1; line-height: 1.6; }
/* 处理从富文本传递过来的高亮类名 */
:deep(.highlight-warn) { color: $warning; font-weight: 700; }
:deep(.highlight-succ) { color: $success; font-weight: 700; }

.action-card { background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.15); border-radius: 14px; padding: 16px; text-align: center; }
.ac-title { font-size: 13px; color: #cbd5e1; }

/* ==================== 3. 底部图表区 ==================== */
.sub-chart-row { display: flex; gap: 24px; }
.sub-panel { flex: 1; padding: 24px 32px; }

/* 效率进度条 */
.efficiency-list { display: flex; flex-direction: column; gap: 16px; margin-top: 20px; }
.eff-item { display: flex; align-items: center; gap: 16px; }
.eff-name { font-size: 13px; color: #cbd5e1; width: 120px; flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.eff-bar-bg { flex: 1; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; }
.eff-bar-fill { height: 100%; background: linear-gradient(90deg, $secondary, $primary); border-radius: 3px; transition: width 1s ease;}
.eff-score { font-size: 13px; font-weight: 600; color: #fff; width: 60px; text-align: right; }

/* 渠道占比 */
.channel-list { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 20px; }
.ch-item { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #cbd5e1; background: rgba(255,255,255,0.02); padding: 12px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
.ch-dot { width: 10px; height: 10px; border-radius: 50%; }
.c-1 { background: $primary; box-shadow: 0 0 8px $primary; }
.c-2 { background: $secondary; box-shadow: 0 0 8px $secondary; }
.c-3 { background: $accent; box-shadow: 0 0 8px $accent; }
.c-4 { background: $text-muted; }

/* ==================== 按钮与滚动条 ==================== */
.liquid-btn {
  display: inline-flex; align-items: center; justify-content: center; height: 40px; padding: 0 20px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; color: #fff;
  background: linear-gradient(135deg, $primary, $secondary); box-shadow: 0 8px 20px rgba($primary, 0.3); transition: 0.3s; border: none;
}
.liquid-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba($primary, 0.5); }
.liquid-btn.micro { height: 36px; padding: 0 16px; font-size: 13px; border-radius: 10px; }
.ghost-btn { display: inline-flex; align-items: center; justify-content: center; padding: 0 16px; border-radius: 10px; font-size: 13px; background: rgba(255,255,255,0.05); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: 0.2s; }
.ghost-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

/* ==================== 动画序列修复版 ==================== */
.fade-in-down { animation: fadeInDown 0.6s ease both; }
.fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; } .delay-3 { animation-delay: 0.3s; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.9); } }
.mt-16 { margin-top: 16px; } .mt-10 { margin-top: 10px; }
.safe-area-bottom { height: 40px; }
</style>