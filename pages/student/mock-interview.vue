<template>
  <view class="student-universe-web">
    <!-- 极光背景层 -->
    <view class="aurora-wrapper">
      <view class="orb orb-1"></view>
      <view class="orb orb-2"></view>
      <view class="orb orb-3"></view>
      <view class="grid-overlay"></view>
      <view class="vignette-overlay"></view>
    </view>
    
    <!-- 主容器 -->
    <view class="workspace-layout">
      <!-- 顶部导航 -->
      <view class="glass-header fade-in-down">
        <view class="header-left">
          <view class="icon-btn" @click="goBack" title="结束面试">
            <text class="arrow-left">←</text>
          </view>
          <view class="title-box">
            <text class="title">Copilot 模拟面试舱</text>
            <view class="live-badge">
              <text class="dot pulse"></text>
              <text>LIVE · 录音中</text>
            </view>
          </view>
        </view>
        <view class="header-right">
          <view class="ghost-btn outline danger-theme micro" @click="endInterview">
            <text>结束本次对练</text>
          </view>
        </view>
      </view>
      
      <!-- 双舱工作区 -->
      <view class="workspace-body">
        
        <!-- ==================== 左侧：全息虚拟人舱 ==================== -->
        <view class="left-avatar-panel fade-in-up delay-1">
          <view class="ultra-glass-card holographic-card h-full">
            
            <!-- 顶部：性格切换器 -->
            <view class="personality-switcher">
              <view 
                class="switcher-item" 
                :class="{ active: personality === 'gentle' }" 
                @click="switchPersonality('gentle')"
              >
                <text class="s-icon">☕</text> 循循善诱 (温柔)
              </view>
              <view 
                class="switcher-item" 
                :class="{ active: personality === 'strict' }" 
                @click="switchPersonality('strict')"
              >
                <text class="s-icon">⚡</text> 压力测试 (严厉)
              </view>
            </view>

            <!-- 核心：虚拟人展示区 -->
            <view class="avatar-stage">
              <!-- 声波光环 (AI说话或录音时激活) -->
              <view class="voice-rings" :class="{ 'speaking': state === 'ai-speaking', 'listening': state === 'user-recording' }">
                <view class="ring r1"></view>
                <view class="ring r2"></view>
                <view class="ring r3"></view>
              </view>
              
              <!-- 虚拟人模型 (这里使用炫酷的科技Emoji组合代替，实际可换成3D模型或视频流) -->
              <view class="virtual-human" :class="personality">
                <view class="human-inner">
                  <text class="h-face" v-if="personality === 'gentle'">👩‍💻</text>
                  <text class="h-face" v-else>👨‍💼</text>
                </view>
                <view class="scan-line" v-if="state === 'ai-analyzing'"></view>
              </view>

              <!-- 面试官名牌 -->
              <view class="interviewer-nameplate">
                <text class="i-name">AIDA · 资深技术总监</text>
                <text class="i-status" v-if="state === 'ai-speaking'">正在提问...</text>
                <text class="i-status highlight" v-else-if="state === 'user-recording'">聆听中...</text>
                <text class="i-status" v-else-if="state === 'ai-analyzing'">深度分析中...</text>
                <text class="i-status" v-else>等待响应</text>
              </view>
            </view>

            <!-- 底部：实时分析波形 -->
            <view class="audio-visualizer">
              <view class="bar" v-for="i in 15" :key="i" :style="`animation-delay: ${Math.random()}s`" :class="{ active: state !== 'idle' }"></view>
            </view>

          </view>
        </view>

        <!-- ==================== 右侧：场控与速记舱 ==================== -->
        <view class="right-transcript-panel fade-in-left delay-2">
          <view class="ultra-glass-card transcript-card h-full">
            
            <view class="panel-header">
              <text class="ph-title">实时速记与复盘</text>
              <text class="ph-meta">第 {{ currentRound }} 轮问答</text>
            </view>

            <!-- 聊天记录流 (Transcript) -->
            <scroll-view class="chat-scroll custom-scrollbar" scroll-y :scroll-into-view="scrollInto">
              <view class="chat-container">
                
                <view 
                  v-for="(msg, index) in chatHistory" 
                  :key="index" 
                  class="message-row"
                  :class="msg.role"
                  :id="`msg-${index}`"
                >
                  <!-- AI 消息 -->
                  <template v-if="msg.role === 'ai'">
                    <view class="msg-avatar ai-avatar">🤖</view>
                    <view class="msg-bubble ai-bubble">
                      <text class="msg-text">{{ msg.text }}</text>
                    </view>
                  </template>

                  <!-- 用户消息 -->
                  <template v-if="msg.role === 'user'">
                    <view class="msg-bubble user-bubble">
                      <text class="msg-text">{{ msg.text }}</text>
                    </view>
                    <view class="msg-avatar user-avatar">👤</view>
                  </template>

                  <!-- 系统提示/点评 -->
                  <template v-if="msg.role === 'system'">
                    <view class="system-bubble">
                      <text class="sys-icon">💡</text>
                      <view class="sys-text-wrap">
                        <text class="sys-title">AI 即时点评</text>
                        <text class="sys-text">{{ msg.text }}</text>
                      </view>
                    </view>
                  </template>
                </view>

                <!-- 正在录音的脉冲提示 -->
                <view class="recording-indicator" v-if="state === 'user-recording'">
                  <view class="dot-typing">
                    <text class="d1"></text><text class="d2"></text><text class="d3"></text>
                  </view>
                  <text class="r-time">{{ formatTime(recordSeconds) }}</text>
                </view>

              </view>
            </scroll-view>

            <!-- 底部：麦克风场控台 -->
            <view class="control-dock">
              <view class="dock-actions">
                <view class="ghost-btn outline" @click="nextQuestion" :class="{ disabled: state === 'user-recording' }">
                  <text>⏭ 下一题</text>
                </view>
              </view>

              <!-- 核心主按钮 -->
              <view class="main-record-wrap">
                <view 
                  class="record-btn-core" 
                  :class="{ 'is-recording': state === 'user-recording' }"
                  @click="toggleRecording"
                >
                  <view class="record-ring"></view>
                  <text class="r-icon" v-if="state !== 'user-recording'">🎙️</text>
                  <text class="r-icon stop" v-else>⏹</text>
                </view>
                <text class="record-hint">{{ state === 'user-recording' ? '点击结束作答' : '点击开始回答' }}</text>
              </view>

              <view class="dock-actions right">
                <view class="liquid-btn micro" @click="getAIFeedback" :class="{ disabled: state === 'user-recording' || chatHistory.length < 2 }">
                  <text class="btn-txt">✨ 查看 AI 点评</text>
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
// 🚀 1. 引入接口
import { API } from '../../utils/api.js';

export default {
  data() {
    return {
      state: 'idle', // 'idle', 'ai-speaking', 'user-recording', 'ai-analyzing'
      personality: 'gentle', // 'gentle', 'strict'
      currentRound: 1,
      recordSeconds: 0,
      recordTimer: null,
      scrollInto: '',
      chatHistory: [] // 初始为空，由后端下发第一题
    }
  },
  mounted() {
    this.startInterview();
  },
  methods: {
    // 🚀 核心联调：初始化面试，获取第一题
    async startInterview() {
      this.state = 'ai-analyzing';
      try {
        const res = await API.mockInterview({
          action: 'start',
          personality: this.personality
        });
        
        this.state = 'ai-speaking';
        this.addMessage('ai', res.data?.text || '你好，我是 AI 面试官。我们现在开始面试。');
        
        setTimeout(() => { this.state = 'idle'; }, 1500);
      } catch (error) {
        // 兜底数据
        this.addMessage('ai', '【兜底模式】你好！我是今天的面试官。请问你平时如何处理高并发？');
        this.state = 'idle';
      }
    },

    // 🚀 核心联调：切换性格并向后端请求新的话术
    async switchPersonality(type) {
      if (this.state === 'user-recording') return;
      this.personality = type;
      uni.showToast({ title: type === 'gentle' ? '已切换至引导模式' : '已切换至压力测试', icon: 'none' });
      
      this.state = 'ai-analyzing';
      try {
        const res = await API.mockInterview({
          action: 'switch_personality',
          personality: this.personality
        });
        this.addMessage('ai', res.data?.text || `系统切入${type}模式。`);
      } catch(e) {
        this.addMessage('ai', type === 'gentle' ? '别紧张，我们慢慢聊。' : '你的回答太单薄了，能深入点吗？');
      } finally {
        this.state = 'idle';
      }
    },

    toggleRecording() {
      if (this.state === 'ai-speaking' || this.state === 'ai-analyzing') return;

      if (this.state !== 'user-recording') {
        // 开始录音
        this.state = 'user-recording';
        this.recordSeconds = 0;
        this.recordTimer = setInterval(() => {
          this.recordSeconds++;
        }, 1000);
        this.scrollToBottom();
      } else {
        // 结束录音
        clearInterval(this.recordTimer);
        this.state = 'ai-analyzing';
        
        // 模拟语音转文字，并发送给后端
        const mockUserAnswer = '在之前的项目中，我使用了 Python 的 asyncio 结合 FastAPI 框架。为了最大化单机并发性能，我引入了 uvloop...';
        this.addMessage('user', mockUserAnswer);
        
        this.submitUserAnswer(mockUserAnswer);
      }
    },

    // 🚀 核心联调：提交用户回答给后端，获取下一题或追问
    async submitUserAnswer(answerText) {
      try {
        const res = await API.mockInterview({
          action: 'submit_answer',
          personality: this.personality,
          answer: answerText,
          // 携带之前的历史记录给后端大模型
          history: this.chatHistory 
        });
        
        this.state = 'ai-speaking';
        this.currentRound++;
        
        // 后端可能同时返回“对刚才回答的点评”和“下一个问题”
        if (res.data?.feedback) {
          this.addMessage('system', res.data.feedback);
        }
        if (res.data?.next_question) {
          this.addMessage('ai', res.data.next_question);
        }
        
      } catch (error) {
        // 兜底
        this.addMessage('system', '亮点：提到了 uvloop 替换事件循环。');
        this.addMessage('ai', '好的，那么下一个问题，能讲讲心跳包机制吗？');
        this.currentRound++;
      } finally {
        setTimeout(() => { this.state = 'idle'; }, 1500);
      }
    },

    // 强制获取 AI 对全盘的反馈
    getAIFeedback() {
      if (this.state === 'user-recording') return;
      this.addMessage('system', '【总体点评】你的技术栈很扎实，但在表述时缺乏具体的业务数据支撑。建议采用 STAR 法则，多提你的行动带来了百分之多少的效率提升。');
    },

    nextQuestion() {
      if (this.state === 'user-recording') return;
      this.state = 'ai-analyzing';
      setTimeout(() => {
        this.submitUserAnswer('候选人跳过了上一题');
      }, 500);
    },

    addMessage(role, text) {
      this.chatHistory.push({ role, text });
      this.scrollToBottom();
    },
    scrollToBottom() {
      setTimeout(() => {
        this.scrollInto = `msg-${this.chatHistory.length - 1}`;
      }, 100);
    },
    formatTime(seconds) {
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    },
    endInterview() {
      uni.showModal({
        title: '结束对练',
        content: '确定要结束本次模拟面试并生成评估报告吗？',
        confirmColor: '#ef4444',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '生成报告中...' });
            setTimeout(() => {
              uni.hideLoading();
              uni.navigateBack();
            }, 1000);
          }
        }
      });
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
$text-secondary: #cbd5e1; 
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

.title-box { display: flex; align-items: center; gap: 16px; }
.title { font-size: 18px; font-weight: 600; color: #fff; letter-spacing: 1px; }
.live-badge { display: flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba($danger, 0.15); border: 1px solid rgba($danger, 0.3); border-radius: 12px; font-size: 12px; font-weight: 600; color: #fca5a5; }
.pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: $danger; box-shadow: 0 0 8px $danger; animation: pulse 1.5s infinite; }

/* 工作区主体：双舱结构 */
.workspace-body { flex: 1; display: flex; gap: 32px; padding: 32px 40px; height: calc(100vh - 70px); box-sizing: border-box; max-width: 1600px; margin: 0 auto; width: 100%; }

/* 公用卡片 */
.ultra-glass-card {
  background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
  backdrop-filter: blur(32px); border: 1px solid rgba(255,255,255,0.06);
  border-top: 1px solid rgba(255,255,255,0.12); border-left: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px; box-shadow: 0 16px 40px -10px rgba(0,0,0,0.5); overflow: hidden; position: relative;
}
.h-full { height: 100%; display: flex; flex-direction: column; }

/* ==================== 左侧：全息虚拟人舱 ==================== */
.left-avatar-panel { width: 45%; flex-shrink: 0; }
.holographic-card { background: radial-gradient(circle at center, rgba(59,130,246,0.08) 0%, rgba(3,3,8,0.6) 100%); padding: 32px; align-items: center; justify-content: space-between; }

/* 性格切换器 */
.personality-switcher { display: flex; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 4px; width: 100%; max-width: 320px; z-index: 10; }
.switcher-item { flex: 1; text-align: center; padding: 8px 0; font-size: 13px; color: $text-muted; border-radius: 16px; cursor: pointer; transition: 0.3s; display: flex; justify-content: center; align-items: center; gap: 6px; }
.switcher-item.active { background: rgba(255,255,255,0.1); color: #fff; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.s-icon { font-size: 16px; }

/* 虚拟人舞台 */
.avatar-stage { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; width: 100%; }
.voice-rings { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 280px; height: 280px; pointer-events: none; }
.ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid transparent; transition: 0.5s; opacity: 0; }
.speaking .ring { border-color: rgba($primary, 0.4); animation: ripple 2s infinite ease-out; }
.listening .ring { border-color: rgba($success, 0.4); animation: ripple 2.5s infinite ease-out; }
.r2 { animation-delay: 0.6s !important; } .r3 { animation-delay: 1.2s !important; }
@keyframes ripple { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }

.virtual-human { width: 200px; height: 200px; border-radius: 50%; background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; position: relative; z-index: 2; box-shadow: 0 20px 50px rgba(0,0,0,0.4), inset 0 0 40px rgba(255,255,255,0.05); transition: 0.5s; }
.virtual-human.gentle { border-color: rgba($primary, 0.3); box-shadow: 0 20px 50px rgba($primary,0.1), inset 0 0 40px rgba($primary,0.1); }
.virtual-human.strict { border-color: rgba($danger, 0.3); box-shadow: 0 20px 50px rgba($danger,0.1), inset 0 0 40px rgba($danger,0.1); }
.human-inner { font-size: 80px; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.5)); transition: 0.3s; }
.scan-line { position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: $accent; box-shadow: 0 0 15px $accent; border-radius: 50%; animation: scanAvatar 1.5s infinite linear; }
@keyframes scanAvatar { 0% { top: 0; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }

.interviewer-nameplate { margin-top: 40px; display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 2; }
.i-name { font-size: 20px; font-weight: 700; color: #fff; letter-spacing: 1px; }
.i-status { font-size: 14px; color: $text-muted; padding: 4px 16px; background: rgba(0,0,0,0.3); border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
.i-status.highlight { color: $success; border-color: rgba($success, 0.3); background: rgba($success, 0.1); }

/* 音频可视化波形 */
.audio-visualizer { display: flex; align-items: flex-end; gap: 4px; height: 60px; padding: 0 40px; width: 100%; box-sizing: border-box; justify-content: center; }
.audio-visualizer .bar { width: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; height: 10%; transition: 0.2s; }
.audio-visualizer .bar.active { background: linear-gradient(180deg, $primary, $secondary); animation: soundWave 1s infinite alternate; }
@keyframes soundWave { 0% { height: 10%; } 100% { height: 80%; } }


/* ==================== 右侧：场控与速记舱 ==================== */
.right-transcript-panel { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.transcript-card { padding: 0; overflow: hidden; }

.panel-header { padding: 24px 32px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); }
.ph-title { font-size: 16px; font-weight: 600; color: #fff; }
.ph-meta { font-size: 13px; color: $primary-light; background: rgba($primary, 0.1); padding: 4px 12px; border-radius: 12px; }

/* 聊天记录区 */
.chat-scroll { flex: 1; height: 0; padding: 24px 32px; box-sizing: border-box; background: radial-gradient(circle at top right, rgba(255,255,255,0.02), transparent 70%); }
.chat-container { display: flex; flex-direction: column; gap: 24px; padding-bottom: 20px; }

.message-row { display: flex; align-items: flex-start; gap: 16px; width: 100%; animation: fadeInUp 0.4s ease both; }
.message-row.user { justify-content: flex-end; }
.message-row.system { justify-content: center; margin: 16px 0; }

.msg-avatar { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.ai-avatar { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
.user-avatar { background: rgba($primary, 0.2); border: 1px solid rgba($primary, 0.4); }

.msg-bubble { padding: 16px 20px; border-radius: 16px; max-width: 75%; position: relative; }
.msg-text { font-size: 15px; color: #e2e8f0; line-height: 1.7; }
.ai-bubble { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-top-left-radius: 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
.user-bubble { background: linear-gradient(135deg, rgba($primary, 0.2), rgba($secondary, 0.1)); border: 1px solid rgba($primary, 0.3); border-top-right-radius: 4px; box-shadow: 0 4px 20px rgba($primary, 0.1); }

.system-bubble { display: flex; gap: 12px; padding: 16px 24px; background: rgba($warning, 0.05); border: 1px dashed rgba($warning, 0.3); border-radius: 16px; max-width: 85%; }
.sys-icon { font-size: 20px; }
.sys-text-wrap { display: flex; flex-direction: column; gap: 6px; }
.sys-title { font-size: 14px; font-weight: 600; color: $warning; }
.sys-text { font-size: 14px; color: #cbd5e1; line-height: 1.6; white-space: pre-wrap; }

/* 录音打字指示器 */
.recording-indicator { display: flex; align-items: center; gap: 16px; align-self: flex-end; margin-top: -8px; margin-right: 56px; }
.dot-typing { display: flex; gap: 4px; padding: 10px 16px; background: rgba($primary, 0.1); border-radius: 16px; border: 1px solid rgba($primary, 0.2); }
.dot-typing text { width: 6px; height: 6px; border-radius: 50%; background: $primary-light; animation: jump 1.5s infinite; }
.d2 { animation-delay: 0.2s !important; } .d3 { animation-delay: 0.4s !important; }
@keyframes jump { 0%, 100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-4px); opacity: 1; } }
.r-time { font-size: 13px; font-family: monospace; color: $primary-light; }

/* 底部场控台 */
.control-dock { padding: 24px 32px; background: rgba(0,0,0,0.4); border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; backdrop-filter: blur(20px); }
.dock-actions { flex: 1; display: flex; }
.dock-actions.right { justify-content: flex-end; }

/* 核心录音按钮 */
.main-record-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.record-btn-core { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, $primary, $secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; box-shadow: 0 10px 30px rgba($primary, 0.4); transition: 0.3s; z-index: 2; border: 2px solid transparent; }
.record-btn-core:hover { transform: scale(1.05); }
.record-btn-core.is-recording { background: transparent; border-color: $danger; box-shadow: inset 0 0 20px rgba($danger, 0.3), 0 0 30px rgba($danger, 0.4); }
.record-ring { position: absolute; inset: -6px; border-radius: 50%; border: 2px solid rgba($primary, 0.5); pointer-events: none; }
.record-btn-core.is-recording .record-ring { border-color: $danger; animation: rippleRecord 1.5s infinite; }
@keyframes rippleRecord { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }

.r-icon { font-size: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
.r-icon.stop { font-size: 24px; color: $danger; }
.record-hint { font-size: 13px; color: $text-muted; }


/* ==================== 通用组件与动画 ==================== */
.liquid-btn {
  position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, $primary, $secondary); color: #fff; border-radius: 12px;
  font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.3s; border: none;
  box-shadow: 0 4px 15px rgba($primary, 0.3);
}
.liquid-btn:hover { box-shadow: 0 8px 25px rgba($primary, 0.5); transform: translateY(-2px); }
.liquid-btn.micro { height: 40px; padding: 0 20px; font-size: 13px; border-radius: 12px; }
.liquid-btn.disabled { opacity: 0.4; pointer-events: none; filter: grayscale(80%); }
.liquid-btn .btn-txt { position: relative; z-index: 2; }

.ghost-btn.outline { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: #cbd5e1; height: 40px; padding: 0 20px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; cursor: pointer; transition: 0.2s; }
.ghost-btn.outline:hover { background: rgba(255,255,255,0.05); color: #fff; border-color: rgba(255,255,255,0.3); }
.ghost-btn.outline.danger-theme { border-color: rgba($danger, 0.3); color: $danger; }
.ghost-btn.outline.danger-theme:hover { background: rgba($danger, 0.1); border-color: $danger; }
.ghost-btn.outline.micro { height: 32px; padding: 0 16px; border-radius: 8px; }
.ghost-btn.outline.disabled { opacity: 0.4; pointer-events: none; }

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
</style>