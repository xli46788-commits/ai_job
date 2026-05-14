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
          <text class="title">AI 简历润色引擎</text>
        </view>
        <view class="header-right">
          <view class="status-badge" :class="isPolishing ? 'processing' : (polishedContent ? 'success' : 'standby')">
            <text class="dot pulse"></text> 
            {{ isPolishing ? 'Copilot 润色中...' : (polishedContent ? '优化完成' : '引擎待命中') }}
          </view>
        </view>
      </view>
      
      <view class="workspace-body">
        
        <view class="left-editor-panel fade-in-up delay-1">
          <view class="ultra-glass-card editor-card">
            
            <view class="input-section">
              <view class="section-header">
                <view class="header-left">
                  <text class="section-icon">✍️</text>
                  <text class="section-title">原始经历描述</text>
                </view>
                <text class="char-count" :class="{ 'warning-text': originalContent.length > 1800 }">
                  {{ originalContent.length }}/2000
                </text>
              </view>
              
              <view class="textarea-wrapper">
                <textarea 
                  class="custom-textarea custom-scrollbar" 
                  v-model="originalContent" 
                  placeholder="在此贴入需要润色的段落。例如：'我负责了公司的前端开发，用了 Vue，把页面速度提升了...'"
                  placeholder-class="textarea-placeholder"
                  maxlength="2000"
                />
              </view>
            </view>
            
            <view class="style-section">
              <view class="section-header">
                <view class="header-left">
                  <text class="section-icon">🎨</text>
                  <text class="section-title">目标语境风格</text>
                </view>
              </view>
              
              <view class="style-grid">
                <view 
                  v-for="(style, index) in polishStyles" 
                  :key="index" 
                  class="style-card"
                  :class="{ active: selectedStyle === style.value }"
                  @click="selectedStyle = style.value"
                >
                  <view class="s-icon-box">{{ style.icon }}</view>
                  <view class="s-info">
                    <text class="s-name">{{ style.label }}</text>
                    <text class="s-desc">{{ style.description }}</text>
                  </view>
                  <view class="s-check" v-if="selectedStyle === style.value">✓</view>
                </view>
              </view>
            </view>
            
            <view class="action-section">
              <view class="liquid-btn fill-width large" :class="{ disabled: !originalContent.trim() || isPolishing }" @click="startPolish">
                <view v-if="isPolishing" class="btn-content">
                  <view class="spinner"></view>
                  <text class="btn-txt">大模型重构中 (需5-10秒)...</text>
                </view>
                <view v-else class="btn-content">
                  <text class="btn-icon">✨</text>
                  <text class="btn-txt">唤醒大模型开始润色 (消耗 50 积分)</text>
                </view>
                <view class="shimmer-effect" v-if="!isPolishing && originalContent.trim()"></view>
              </view>
            </view>
            
          </view>
        </view>

        <view class="right-result-panel fade-in-left delay-2">
          
          <view class="ultra-glass-card h-full empty-state-card" v-if="!polishedContent && !isPolishing">
            <view class="empty-content">
              <view class="radar-box">
                <view class="radar-circle c1"></view>
                <view class="radar-circle c2"></view>
                <text class="e-icon">🤖</text>
              </view>
              <text class="e-title">AI 润色引擎已就绪</text>
              <text class="e-desc">左侧输入原文，右侧将实时调用 DeepSeek 大模型为您进行大师级重构。</text>
            </view>

            <view class="capabilities-grid">
              <view class="cap-item">
                <text class="c-icon">📊</text>
                <view class="c-text">
                  <text class="c-name">STAR 法则重构</text>
                  <text class="c-sub">自动补全情境、任务、行动与结果</text>
                </view>
              </view>
              <view class="cap-item">
                <text class="c-icon">🎯</text>
                <view class="c-text">
                  <text class="c-name">核心关键词提取</text>
                  <text class="c-sub">命中大厂 HR 筛书系统的核心词汇</text>
                </view>
              </view>
              <view class="cap-item">
                <text class="c-icon">📈</text>
                <view class="c-text">
                  <text class="c-name">数据量化增强</text>
                  <text class="c-sub">引导并强化项目成果的数字说服力</text>
                </view>
              </view>
            </view>
          </view>

          <view class="ultra-glass-card h-full skeleton-card" v-else-if="isPolishing">
            <view class="s-header">
              <view class="s-icon shimmer"></view>
              <view class="s-title shimmer"></view>
            </view>
            <view class="s-content mt-24">
              <view class="s-line shimmer"></view>
              <view class="s-line shimmer"></view>
              <view class="s-line shimmer short"></view>
              <view class="s-line shimmer mt-16"></view>
              <view class="s-line shimmer"></view>
            </view>
            <view class="scanning-line"></view>
            <text class="loading-text pulse">呼叫大模型中，请耐心等待...</text>
          </view>

          <view class="ultra-glass-card h-full result-card" v-else>
            <scroll-view class="result-scroll custom-scrollbar" scroll-y>
              <view class="result-inner">
                
                <view class="result-header">
                  <view class="r-title-box">
                    <text class="icon">✨</text>
                    <text class="title">专家级润色结果</text>
                  </view>
                  <view class="r-stats">
                    <view class="stat-badge">模型推理耗时 <text class="highlight">{{ optimizationTime }}s</text></view>
                  </view>
                </view>

                <view class="polished-text-box">
                  <text class="parsed-content">{{ polishedContent }}</text>
                </view>

                <view class="result-actions mt-24">
                  <view class="ghost-btn outline" @click="copyResult">
                    <text>📋 复制全文</text>
                  </view>
                  <view class="ghost-btn outline warning-theme" @click="replaceContent">
                    <text>🔄 替换至左侧</text>
                  </view>
                </view>

                <view class="ai-suggestions-panel mt-32" v-if="polishTips.length > 0">
                  <text class="panel-title">💡 引擎分析报告</text>
                  <view class="tips-list">
                    <view class="tip-item" v-for="(tip, index) in polishTips" :key="index">
                      <view class="tip-icon">{{ tip.icon }}</view>
                      <view class="tip-text">
                        <text class="t-name">{{ tip.title }}</text>
                        <text class="t-desc">{{ tip.description }}</text>
                      </view>
                    </view>
                  </view>
                </view>

              </view>
            </scroll-view>
          </view>
          
        </view>
        
      </view>
    </view>
  </view>
</template>

<script>
// 🚀 引入全局 API 接口
import { API } from '../../utils/api.js';

export default {
  data() {
    return {
      originalContent: '',
      polishedContent: '',
      isPolishing: false,
      selectedStyle: 'professional',
      optimizationTime: 0,
      
      // 这里的风格配置属于系统级常量选项，不算假数据，安全保留
      polishStyles: [
        { label: '专业正式', value: 'professional', icon: '👔', description: '严谨专业，适合大厂投递' },
        { label: '精炼干脆', value: 'concise', icon: '⚡', description: '剔除冗余，STAR法则凸显' },
        { label: '活力创新', value: 'creative', icon: '🚀', description: '富有激情，适合初创与外企' }
      ],
      
      polishTips: []
    }
  },
  methods: {
    startPolish() {
      if (this.isPolishing || !this.originalContent.trim()) return;
      
      let that = this;
      uni.showModal({
        title: '引擎启动确认',
        content: '即将呼叫真实 AI 大模型进行润色，是否继续？',
        success: async function (res) {
          if (res.confirm) {
            // 重置状态
            that.isPolishing = true;
            that.polishedContent = '';
            that.optimizationTime = 0;
            that.polishTips = [];
            
            const startTime = Date.now();
            
            try {
              // 🚀 发送真实网络请求给 Django 后端
              const resData = await API.polishResumeText({
                content: that.originalContent,
                style: that.selectedStyle
              });
              
              // 记录 AI 推理耗费的时间
              that.optimizationTime = ((Date.now() - startTime) / 1000).toFixed(1);
              
              // 解析后端的返回结构 (兼容不同的拦截器包装)
              const realData = resData.data || resData;

              if (resData.code === 200 || realData.code === 200) {
                 // 成功获取 AI 回复！
                 that.polishedContent = realData.polishedContent || realData.data?.polishedContent;
                 // 拿到真实的分析建议，如果没有传则兜底系统默认建议
                 that.polishTips = realData.tips || realData.data?.tips || that.getDefaultTips();
                 uni.showToast({ title: 'AI润色完成！', icon: 'success' });
              } else {
                 // 接口通了，但后端业务报错
                 throw new Error(realData.msg || resData.msg || '后端返回异常');
              }
              
            } catch (error) {
              console.error("AI 接口请求异常:", error);
              // 🚀 真实错误处理：明确告诉用户失败了，拒绝假数据兜底
              const errMsg = error.message || 'AI 响应超时或服务异常，请稍后重试';
              uni.showToast({ title: errMsg, icon: 'none', duration: 3000 });
              
              // 重置状态，保持在编辑页面
              that.polishedContent = '';
              that.optimizationTime = 0;
            } finally {
              // 关闭骨架屏加载动画
              that.isPolishing = false;
            }
          }
        }
      });
    },
    
    // 获取基础的提示列表（当后端AI只返回文本没有返回tips时，优雅降级的占位话术）
    getDefaultTips() {
      return [
        { icon: '🤖', title: '大模型重构', description: '已通过深度学习模型对原始语段进行了语义重构。' },
        { icon: '🎯', title: '逻辑梳理', description: '采用 STAR 法则，使背景、任务、行动与结果层次分明。' }
      ];
    },

    copyResult() {
      uni.setClipboardData({
        data: this.polishedContent,
        success: () => { uni.showToast({ title: '已复制到剪贴板', icon: 'success' }); }
      });
    },
    
    replaceContent() {
      this.originalContent = this.polishedContent;
      uni.showToast({ title: '原文已替换', icon: 'success' });
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

.status-badge { display: flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; border: 1px solid; }
.status-badge.standby { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #cbd5e1; .dot { background: #cbd5e1; } }
.status-badge.processing { background: rgba($primary, 0.1); border-color: rgba($primary, 0.3); color: $primary-light; .dot { background: $primary-light; box-shadow: 0 0 8px $primary; } }
.status-badge.success { background: rgba($success, 0.1); border-color: rgba($success, 0.3); color: $success; .dot { background: $success; box-shadow: 0 0 8px $success; } }
.dot { width: 6px; height: 6px; border-radius: 50%; }

/* 工作区主体 */
.workspace-body { flex: 1; display: flex; gap: 32px; padding: 32px 40px; height: calc(100vh - 70px); box-sizing: border-box; max-width: 1500px; margin: 0 auto; width: 100%; }

/* 公用组件 */
.ultra-glass-card {
  background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
  backdrop-filter: blur(32px); border: 1px solid rgba(255,255,255,0.06);
  border-top: 1px solid rgba(255,255,255,0.12); border-left: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px; box-shadow: 0 16px 40px -10px rgba(0,0,0,0.5); overflow: hidden; position: relative;
}

/* ==================== 左侧：编辑控制舱 ==================== */
.left-editor-panel { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.editor-card { display: flex; flex-direction: column; height: 100%; padding: 32px; box-sizing: border-box; }

.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.header-left { display: flex; align-items: center; gap: 10px; }
.section-icon { font-size: 20px; }
.section-title { font-size: 16px; font-weight: 600; color: #fff; }
.char-count { font-size: 13px; color: $text-muted; }
.warning-text { color: $warning; font-weight: 600; }

.input-section { flex: 1; display: flex; flex-direction: column; min-height: 0; margin-bottom: 32px; }
.textarea-wrapper { flex: 1; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 20px; transition: 0.3s; }
.textarea-wrapper:focus-within { border-color: rgba($primary, 0.4); box-shadow: inset 0 0 20px rgba($primary, 0.05); }
.custom-textarea { width: 100%; height: 100%; color: #fff; font-size: 15px; line-height: 1.7; background: transparent; outline: none; border: none; resize: none; }
.textarea-placeholder { color: rgba(255,255,255,0.2); }

.style-section { margin-bottom: 32px; flex-shrink: 0; }
.style-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.style-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: 0.3s; position: relative; }
.style-card:hover { background: rgba(255,255,255,0.05); transform: translateY(-2px); }
.style-card.active { background: rgba($primary, 0.1); border-color: rgba($primary, 0.4); }
.s-icon-box { font-size: 24px; filter: drop-shadow(0 0 8px rgba(255,255,255,0.2)); }
.s-info { display: flex; flex-direction: column; gap: 4px; }
.s-name { font-size: 14px; font-weight: 600; color: #fff; }
.s-desc { font-size: 11px; color: $text-muted; }
.s-check { position: absolute; top: 12px; right: 12px; width: 20px; height: 20px; border-radius: 50%; background: $primary; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; }

.action-section { flex-shrink: 0; }

/* ==================== 右侧：AI 结果诊断舱 ==================== */
.right-result-panel { width: 500px; flex-shrink: 0; }
.h-full { height: 100%; }

/* 状态 1: 空状态 */
.empty-state-card { display: flex; flex-direction: column; padding: 40px; box-sizing: border-box; }
.empty-content { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.radar-box { width: 100px; height: 100px; position: relative; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
.e-icon { font-size: 40px; z-index: 2; filter: drop-shadow(0 0 10px rgba($primary, 0.5)); }
.radar-circle { position: absolute; inset: 0; border-radius: 50%; border: 1px solid rgba($primary, 0.3); animation: radarPulse 3s infinite; }
.c2 { animation-delay: 1.5s; }
@keyframes radarPulse { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
.e-title { font-size: 20px; font-weight: 600; color: #fff; margin-bottom: 12px; }
.e-desc { font-size: 14px; color: $text-muted; line-height: 1.6; max-width: 80%; }

.capabilities-grid { display: flex; flex-direction: column; gap: 16px; margin-top: auto; }
.cap-item { display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(255,255,255,0.02); border-radius: 16px; border: 1px dashed rgba(255,255,255,0.1); }
.c-icon { font-size: 24px; }
.c-text { display: flex; flex-direction: column; gap: 4px; }
.c-name { font-size: 14px; font-weight: 600; color: #cbd5e1; }
.c-sub { font-size: 12px; color: $text-muted; }

/* 状态 2: 骨架屏 */
.skeleton-card { padding: 40px; display: flex; flex-direction: column; position: relative; }
.shimmer { background: rgba(255,255,255,0.03); position: relative; overflow: hidden; border-radius: 8px; }
.shimmer::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent); animation: shimmer-scan 1.5s infinite; transform: skewX(-20deg); }
@keyframes shimmer-scan { 100% { left: 200%; } }
.s-header { display: flex; align-items: center; gap: 16px; }
.s-icon { width: 40px; height: 40px; border-radius: 50%; }
.s-title { width: 40%; height: 20px; }
.s-content { flex: 1; display: flex; flex-direction: column; gap: 16px; }
.s-line { height: 14px; width: 100%; }
.s-line.short { width: 60%; }
.scanning-line { position: absolute; left: 0; top: 0; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, $primary, transparent); animation: scanDown 2s infinite ease-in-out; box-shadow: 0 0 10px $primary; }
@keyframes scanDown { 0% { top: 10%; opacity: 0; } 50% { opacity: 1; } 100% { top: 90%; opacity: 0; } }
.loading-text { font-size: 14px; color: $primary-light; text-align: center; margin-top: auto; }

/* 状态 3: 结果展示 */
.result-card { padding: 0; display: flex; flex-direction: column; }
.result-scroll { flex: 1; height: 100%; }
.result-inner { padding: 32px; display: flex; flex-direction: column; }

.result-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 24px; }
.r-title-box { display: flex; align-items: center; gap: 10px; }
.r-title-box .icon { font-size: 22px; filter: drop-shadow(0 0 8px $warning); }
.r-title-box .title { font-size: 18px; font-weight: 600; color: #fff; background: linear-gradient(90deg, #fff, #fde047); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.r-stats { display: flex; gap: 12px; }
.stat-badge { font-size: 12px; color: $text-muted; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 8px; }
.stat-badge .highlight { color: $success; font-weight: 600; }

.polished-text-box { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; }
.parsed-content { font-size: 15px; color: #e2e8f0; line-height: 1.8; white-space: pre-line; }

.result-actions { display: flex; gap: 12px; }

.ai-suggestions-panel { background: rgba($primary, 0.05); border: 1px solid rgba($primary, 0.15); border-radius: 16px; padding: 20px; }
.panel-title { font-size: 15px; font-weight: 600; color: $primary-light; display: block; margin-bottom: 16px; }
.tips-list { display: flex; flex-direction: column; gap: 16px; }
.tip-item { display: flex; gap: 12px; align-items: flex-start; }
.tip-icon { font-size: 18px; line-height: 1.2; }
.tip-text { display: flex; flex-direction: column; gap: 4px; }
.t-name { font-size: 14px; font-weight: 600; color: #fff; }
.t-desc { font-size: 13px; color: #cbd5e1; line-height: 1.5; }

/* ==================== 统一按钮组件 ==================== */
.liquid-btn {
  position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, $primary, $secondary); color: #fff; border-radius: 14px;
  font-size: 15px; font-weight: 600; cursor: pointer; padding: 0 24px; height: 48px; border: none;
  box-shadow: 0 8px 20px rgba($primary, 0.3), inset 0 1px 1px rgba(255,255,255,0.3); transition: all 0.3s;
}
.liquid-btn:hover { box-shadow: 0 12px 28px rgba($primary, 0.5); transform: translateY(-2px); }
.liquid-btn.disabled { opacity: 0.5; filter: grayscale(50%); cursor: not-allowed; box-shadow: none; pointer-events: none; }
.liquid-btn.large { height: 56px; font-size: 16px; border-radius: 16px; }
.liquid-btn.micro { height: 40px; font-size: 13px; border-radius: 12px; padding: 0 16px; }
.liquid-btn.fill-width { width: 100%; box-sizing: border-box; }
.btn-content { display: flex; align-items: center; gap: 8px; position: relative; z-index: 2; }
.btn-icon { font-size: 18px; }

.ghost-btn.outline { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: #cbd5e1; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex: 1; font-size: 13px; cursor: pointer; transition: 0.2s; }
.ghost-btn.outline:hover { background: rgba(255,255,255,0.05); color: #fff; border-color: rgba(255,255,255,0.3); }
.ghost-btn.outline.warning-theme:hover { background: rgba($warning, 0.1); color: $warning; border-color: rgba($warning, 0.3); }

.spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.shimmer-effect { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); transform: skewX(-20deg); animation: shimmerBtn 3s infinite; }
@keyframes shimmerBtn { 100% { left: 200%; } }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

/* 动画防丢 */
.fade-in-down { animation: fadeInDown 0.6s ease both; }
.fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.fade-in-left { animation: fadeInLeft 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.9); } }
.mt-32 { margin-top: 32px; } .mt-24 { margin-top: 24px; } .mt-16 { margin-top: 16px; } .mt-10 { margin-top: 10px; }
</style>