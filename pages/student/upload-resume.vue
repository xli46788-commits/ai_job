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
          <text class="title">构建数字分身</text>
        </view>
        <view class="header-right">
          <view class="status-badge" :class="parseComplete ? 'success' : (isParsing ? 'processing' : 'standby')">
            <text class="dot pulse"></text> 
            {{ parseComplete ? '解析完成' : (isParsing ? '引擎运转中' : '等待上传') }}
          </view>
        </view>
      </view>
      
      <view class="workspace-body">
        
        <view class="left-control-panel fade-in-up delay-1">
          
          <view class="upload-zone" v-if="!uploadedFile" @click="selectFile">
            <view class="upload-zone-inner">
              <view class="upload-icon-wrapper">
                <view class="icon-circle">
                  <text class="upload-icon">📁</text>
                </view>
                <view class="pulse-ring"></view>
              </view>
              <text class="upload-title">点击上传你的简历</text>
              <text class="upload-desc">支持 PDF、Word 格式，最大 20MB</text>
              <view class="liquid-btn micro mt-20">
                <text class="btn-txt">选择文件</text>
              </view>
            </view>
            <view class="upload-tips">
              <view class="tip-item"><text class="tip-icon">✨</text><text>AI 智能提取关键信息</text></view>
              <view class="tip-item"><text class="tip-icon">🔒</text><text>严格保护个人隐私数据</text></view>
            </view>
          </view>
          
          <view class="file-status-card ultra-glass-card" v-else>
            <view class="file-header">
              <view class="file-type-icon">📄</view>
              <view class="file-info">
                <text class="file-name" :title="uploadedFile.name">{{ uploadedFile.name }}</text>
                <text class="file-meta">{{ formatFileSize(uploadedFile.size) }} · {{ getCurrentTime() }}</text>
              </view>
              <view class="reupload-btn" @click="reupload" v-if="!isParsing && !parseComplete" title="重新上传">
                <text>🔄</text>
              </view>
            </view>

            <view class="action-row" v-if="!isParsing && !parseComplete">
              <view class="liquid-btn fill-width" @click="startParsing">
                <text class="btn-txt">🚀 唤醒 AI 引擎开始解析</text>
              </view>
            </view>

            <view class="parsing-container" v-if="isParsing || parseComplete">
              <view class="progress-header">
                <text class="progress-label">{{ parseComplete ? '解析成功' : 'AI 深度分析中...' }}</text>
                <text class="progress-value" :class="{ 'success-text': parseComplete }">{{ progress }}%</text>
              </view>
              
              <view class="progress-bar-bg">
                <view class="progress-bar-fill" :style="{ width: progress + '%' }">
                  <view class="progress-shine" v-if="!parseComplete"></view>
                </view>
              </view>
              
              <view class="parsing-steps" v-if="!parseComplete">
                <view v-for="(step, index) in parsingSteps" :key="index" class="step-item" :class="{ active: progress >= step.progress, completed: progress > step.progress }">
                  <view class="step-icon">{{ step.icon }}</view>
                  <text class="step-text">{{ step.text }}</text>
                </view>
              </view>
              
              <view class="success-message" v-if="parseComplete">
                <text>🎉 简历基因提取完毕，请在右侧核对信息。</text>
                <view class="ghost-btn outline fill-width mt-16" @click="reupload">重新上传</view>
              </view>
            </view>
          </view>
          
        </view>

        <view class="right-preview-panel fade-in-left delay-2">
          <view class="ultra-glass-card preview-card h-full">
            <scroll-view class="preview-scroll custom-scrollbar" scroll-y>
              
              <view class="preview-empty-state" v-if="!isParsing && !parseComplete">
                <view class="empty-icon-box">
                  <text class="e-icon pulse">🧬</text>
                </view>
                <text class="empty-title">等待注入简历基因</text>
                <text class="empty-desc">在左侧上传简历后，AI Copilot 将为你生成结构化的数字分身报告，并基于此为你匹配最契合的岗位。</text>
              </view>

              <view class="skeleton-container" v-if="isParsing">
                <view class="skeleton-header">
                  <view class="s-avatar shimmer"></view>
                  <view class="s-lines">
                    <view class="s-line title shimmer"></view>
                    <view class="s-line shimmer"></view>
                  </view>
                </view>
                <view class="s-block shimmer mt-32"></view>
                <view class="s-line shimmer mt-16"></view>
                <view class="s-line short shimmer mt-10"></view>
                
                <view class="s-block shimmer mt-32"></view>
                <view class="s-tags mt-16">
                  <view class="s-tag shimmer" v-for="i in 5" :key="i"></view>
                </view>
              </view>

              <view class="parsed-result-content" v-if="parseComplete">
                <view class="result-header fade-in-up">
                  <view class="r-avatar">
                    <text>👤</text>
                    <view class="r-avatar-ring"></view>
                  </view>
                  <view class="r-base-info">
                    <text class="r-name">{{ resumeInfo.name }}</text>
                    <text class="r-sub">{{ resumeInfo.education }} · {{ resumeInfo.major }}</text>
                  </view>
                </view>

                <view class="info-grid fade-in-up delay-1">
                  <view class="glass-block">
                    <view class="block-title"><text class="b-icon">🎯</text>求职意向</view>
                    <view class="info-row"><text class="i-label">目标岗位</text><text class="i-val highlight">{{ resumeInfo.target }}</text></view>
                    <view class="info-row"><text class="i-label">经验年限</text><text class="i-val">{{ resumeInfo.experience }}</text></view>
                  </view>

                  <view class="glass-block">
                    <view class="block-title"><text class="b-icon">🧬</text>技能图谱</view>
                    <view class="skill-tags">
                      <view v-for="(skill, index) in resumeInfo.skills" :key="index" class="neon-tag active">
                        {{ skill }}
                      </view>
                    </view>
                  </view>
                </view>

                <view class="result-actions fade-in-up delay-2">
                  <view class="action-banner">
                    <text class="banner-icon">✨</text>
                    <view class="banner-text">
                      <text class="b-title">简历已就绪，立即匹配机会！</text>
                      <text class="b-desc">基于提取出的能力模型，我们为您找到了高匹配度岗位。</text>
                    </view>
                  </view>
                  <view class="liquid-btn large fill-width mt-16" @click="goToMatchResult">
                    <text class="btn-txt">查看智能匹配结果 ➔</text>
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
// 🚀 引入 API 接口和基础地址
import { BASE_URL } from '../../utils/api.js';

export default {
  data() {
    return {
      uploadedFile: null,
      isParsing: false,
      parseComplete: false,
      progress: 0,
      parsingSteps: [
        { icon: '📄', text: '抽取文档内容', progress: 20 },
        { icon: '🧠', text: '大模型语义理解', progress: 60 },
        { icon: '🏷️', text: '生成技能图谱', progress: 90 }
      ],
      // 初始化为空，等待真实数据注入
      resumeInfo: {
        name: '未知', major: '解析中', education: '解析中',
        experience: '解析中', target: '解析中',
        skills: []
      }
    }
  },
  methods: {
    selectFile() {
      // 真实唤起设备文件选择器
      uni.chooseFile({
        count: 1,
        extension: ['.pdf', '.doc', '.docx'],
        success: (res) => {
          const file = res.tempFiles[0];
          this.uploadedFile = {
            name: file.name || '未命名简历.pdf',
            size: file.size,
            path: file.path || file.tempFilePath
          };
        },
        fail: () => {
          // 在不支持 chooseFile 的环境下(如某些PC浏览器预览)使用模拟文件兜底
          uni.showToast({ title: '启用了本地演示文件', icon: 'none' });
          this.uploadedFile = { 
            name: '2026_前端实习简历_测试.pdf', 
            size: 1048576, 
            path: 'mock_path' 
          };
        }
      });
    },

    // 🚀 核心联调：真实的文件上传与解析流程
    startParsing() {
      if (!this.uploadedFile) return;

      this.isParsing = true;
      this.progress = 0;
      this.parseComplete = false;

      // 1. 制造一个“假进度条”跑到 80%，掩盖后端的网络和 AI 解析延迟
      const timer = setInterval(() => {
        if (this.progress < 85) {
          this.progress += Math.floor(Math.random() * 5) + 1;
        }
      }, 300);

      // 如果是 mock_path 说明是在不支持文件上传的浏览器里兜底，直接触发假完成
      if (this.uploadedFile.path === 'mock_path') {
        setTimeout(() => this.finishParsing(timer, null), 2500);
        return;
      }

      // 2. 拿到用户的合法身份证 (Token)
      const token = uni.getStorageSync('token');

      // 3. 真实发起 Multipart/form-data 文件上传
      uni.uploadFile({
        url: `${BASE_URL}/resumes/`, // 使用统一管理的 BASE_URL
        filePath: this.uploadedFile.path,
        name: 'resume_file', // 必须与后端 Serializer 期待的字段名严格一致
        formData: {
          'resume_name': this.uploadedFile.name
        },
        header: {
          'Authorization': `Bearer ${token}` // 携带 Token 证明学生身份
        },
        success: (uploadRes) => {
          clearInterval(timer);
          if (uploadRes.statusCode === 201 || uploadRes.statusCode === 200) {
            const resData = JSON.parse(uploadRes.data);
            // 上传且解析成功，把后端的全套数据发给收尾方法
            this.finishParsing(null, resData);
          } else {
            console.error("【后端拒绝了上传】状态码:", uploadRes.statusCode);
            console.error("【后端报错详情】:", uploadRes.data);
            this.handleUploadFail(timer);
          }
        },
        fail: (err) => {
          console.error("【彻底断网/未连接到后端】:", err);
          this.handleUploadFail(timer);
        }
      });
    },

    // 🚀 解析成功后的收尾动作（全栈联调核心）
    finishParsing(timer, backendData) {
      if (timer) clearInterval(timer);
      this.progress = 100;
      
      // 判断后端是否成功传回了 AI 解析的数据
      if (backendData && (backendData.code === 201 || backendData.code === 200)) {
         
         const realData = backendData.data.parsed_info; // 获取后端的结构化字典
         
         // 🚀 把 AI 提取的真实数据赋值给前端 UI！
         this.resumeInfo = {
            name: realData.name !== '未知' ? realData.name : (uni.getStorageSync('user_info')?.username || '同学'),
            major: realData.major || '未提取到专业',
            education: realData.education || '未提供学历',
            experience: realData.experience || '无经验信息',
            target: realData.target || '未提供求职目标',
            // 如果提取到了技能数组，就展示，否则展示兜底
            skills: (realData.skills && realData.skills.length > 0) ? realData.skills : ['暂未提取到核心技能']
         };

         // 🚀 极其关键：将真实的简历 ID 存入本地缓存，这是下一步去匹配岗位的“入场券”！
         uni.setStorageSync('current_resume_id', backendData.data.resume_id);
      } else {
         // 这是用于无网测试时的兜底假数据
         this.resumeInfo = {
            name: uni.getStorageSync('user_info')?.username || '测试同学',
            major: '计算机科学', education: '本科', experience: '1年经验', target: '前端开发',
            skills: ['Vue', 'JavaScript', '兜底测试技能']
         };
      }

      setTimeout(() => {
        this.isParsing = false;
        this.parseComplete = true;
        uni.showToast({ title: '数字分身构建完成', icon: 'success' });
      }, 400);
    },

    // 失败兜底，保证演示不中断
    handleUploadFail(timer) {
      clearInterval(timer);
      uni.showToast({ title: '网络异常，启用本地演示模式', icon: 'none' });
      this.finishParsing(null, null);
    },

    reupload() {
      this.uploadedFile = null;
      this.isParsing = false;
      this.parseComplete = false;
      this.progress = 0;
    },
    goToMatchResult() {
      // 判断是否拿到了刚刚上传成功的简历 ID，如果没有拿到说明上传失败了
      const resumeId = uni.getStorageSync('current_resume_id');
      if (!resumeId) {
          uni.showToast({ title: '找不到真实简历数据，无法匹配', icon: 'none' });
          return;
      }
      uni.navigateTo({ url: '/pages/student/match-result' });
    },
    formatFileSize(size) {
      if (!size) return '未知大小';
      if (size < 1024) return size + ' B';
      if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
      return (size / (1024 * 1024)).toFixed(2) + ' MB';
    },
    getCurrentTime() {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
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

/* ==================== 极光背景 (Web端优化) ==================== */
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
.header-left { display: flex; align-items: center; gap: 16px; }
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
.workspace-body { flex: 1; display: flex; gap: 32px; padding: 32px 40px; height: calc(100vh - 70px); box-sizing: border-box; max-width: 1400px; margin: 0 auto; width: 100%; }

/* 公用玻璃卡片 */
.ultra-glass-card {
  background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
  backdrop-filter: blur(32px); border: 1px solid rgba(255,255,255,0.06);
  border-top: 1px solid rgba(255,255,255,0.12); border-left: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px; box-shadow: 0 16px 40px -10px rgba(0,0,0,0.5); overflow: hidden;
}

/* ==================== 左侧：上传与状态控制舱 ==================== */
.left-control-panel { width: 440px; flex-shrink: 0; display: flex; flex-direction: column; }

/* 状态1：未上传 拖拽区 */
.upload-zone {
  flex: 1; border: 2px dashed rgba(255,255,255,0.15); border-radius: 24px; background: rgba(255,255,255,0.02);
  display: flex; flex-direction: column; justify-content: center; padding: 40px; cursor: pointer; transition: all 0.3s ease;
}
.upload-zone:hover { border-color: rgba($primary, 0.5); background: rgba($primary, 0.05); box-shadow: inset 0 0 30px rgba($primary, 0.1); transform: translateY(-4px); }
.upload-zone-inner { text-align: center; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.upload-icon-wrapper { position: relative; width: 80px; height: 80px; margin-bottom: 24px; }
.icon-circle { width: 100%; height: 100%; border-radius: 50%; background: linear-gradient(135deg, rgba($primary, 0.2), rgba($secondary, 0.2)); border: 2px solid rgba($primary, 0.3); display: flex; align-items: center; justify-content: center; font-size: 36px; z-index: 2; position: relative; }
.pulse-ring { position: absolute; inset: -8px; border-radius: 50%; border: 2px solid rgba($primary, 0.3); animation: pulse 2s ease-in-out infinite; }
.upload-title { font-size: 20px; font-weight: 600; color: #fff; margin-bottom: 8px; }
.upload-desc { font-size: 13px; color: $text-muted; margin-bottom: 8px; }
.upload-tips { display: flex; flex-direction: column; gap: 8px; background: rgba(0,0,0,0.2); padding: 16px; border-radius: 12px; margin-top: auto; border: 1px solid rgba(255,255,255,0.03); }
.tip-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #cbd5e1; }
.tip-icon { font-size: 14px; }

/* 状态2：文件已选/解析中 卡片 */
.file-status-card { padding: 32px; display: flex; flex-direction: column; gap: 24px; }
.file-header { display: flex; align-items: center; gap: 16px; padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.05); }
.file-type-icon { width: 56px; height: 56px; border-radius: 14px; background: rgba($primary, 0.1); border: 1px solid rgba($primary, 0.2); display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
.file-info { flex: 1; min-width: 0; }
.file-name { font-size: 16px; font-weight: 600; color: #fff; display: block; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-meta { font-size: 12px; color: $text-muted; }
.reupload-btn { width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; font-size: 14px; }
.reupload-btn:hover { background: rgba(255,255,255,0.15); transform: rotate(90deg); }

.action-row { width: 100%; }

.parsing-container { display: flex; flex-direction: column; gap: 16px; }
.progress-header { display: flex; justify-content: space-between; align-items: center; }
.progress-label { font-size: 14px; font-weight: 500; color: #e2e8f0; }
.progress-value { font-size: 20px; font-weight: 800; color: $primary-light; }
.progress-value.success-text { color: $success; }
.progress-bar-bg { width: 100%; height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; }
.progress-bar-fill { height: 100%; background: linear-gradient(90deg, $primary, $secondary); border-radius: 4px; transition: width 0.1s linear; position: relative; }
.progress-shine { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); animation: shine 1.5s infinite; }
@keyframes shine { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

.parsing-steps { display: flex; justify-content: space-between; margin-top: 16px; }
.step-item { display: flex; flex-direction: column; align-items: center; gap: 8px; opacity: 0.4; transition: 0.3s; flex: 1; }
.step-item.active { opacity: 0.8; }
.step-item.completed { opacity: 1; }
.step-icon { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 16px; transition: 0.3s; }
.step-item.active .step-icon { background: rgba($primary, 0.2); border: 1px solid rgba($primary, 0.4); transform: scale(1.1); box-shadow: 0 0 10px rgba($primary,0.2); }
.step-item.completed .step-icon { background: rgba($success, 0.15); border: 1px solid rgba($success, 0.3); }
.step-text { font-size: 12px; color: #cbd5e1; text-align: center; }

.success-message { text-align: center; font-size: 14px; color: $success; margin-top: 10px; line-height: 1.6; }

/* ==================== 右侧：解析结果预览舱 ==================== */
.right-preview-panel { flex: 1; min-width: 0; }
.h-full { height: 100%; display: flex; flex-direction: column; }
.preview-scroll { flex: 1; height: 0; padding: 40px; box-sizing: border-box; }

/* 空状态 */
.preview-empty-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; opacity: 0.7; }
.empty-icon-box { width: 100px; height: 100px; border-radius: 50%; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: inset 0 0 20px rgba(0,0,0,0.5); }
.e-icon { font-size: 40px; filter: drop-shadow(0 0 10px rgba($primary, 0.4)); }
.empty-title { font-size: 20px; font-weight: 600; color: #fff; margin-bottom: 12px; }
.empty-desc { font-size: 14px; color: $text-muted; max-width: 360px; line-height: 1.6; }

/* 骨架屏 (解析中动画) */
.skeleton-container { width: 100%; }
.shimmer { background: rgba(255,255,255,0.03); position: relative; overflow: hidden; border-radius: 8px; }
.shimmer::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent); animation: shimmer-scan 1.5s infinite; transform: skewX(-20deg); }
@keyframes shimmer-scan { 100% { left: 200%; } }
.skeleton-header { display: flex; gap: 20px; align-items: center; }
.s-avatar { width: 80px; height: 80px; border-radius: 20px; }
.s-lines { flex: 1; display: flex; flex-direction: column; gap: 16px; }
.s-line { height: 16px; width: 80%; }
.s-line.title { height: 24px; width: 40%; }
.s-line.short { width: 50%; }
.s-block { height: 100px; width: 100%; border-radius: 16px; }
.s-tags { display: flex; gap: 12px; flex-wrap: wrap; }
.s-tag { width: 80px; height: 32px; border-radius: 10px; }
.mt-32 { margin-top: 32px; }

/* 结果展示 */
.parsed-result-content { display: flex; flex-direction: column; gap: 32px; }
.result-header { display: flex; align-items: center; gap: 24px; padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.05); }
.r-avatar { width: 80px; height: 80px; border-radius: 20px; background: linear-gradient(135deg, rgba($primary,0.15), rgba($secondary,0.15)); border: 1px solid rgba($primary, 0.3); display: flex; align-items: center; justify-content: center; font-size: 40px; position: relative; }
.r-avatar-ring { position: absolute; inset: -4px; border-radius: 24px; border: 1px dashed rgba($primary, 0.4); animation: rotate 6s linear infinite; }
.r-base-info { display: flex; flex-direction: column; gap: 8px; }
.r-name { font-size: 32px; font-weight: 800; color: #fff; letter-spacing: 1px; }
.r-sub { font-size: 15px; color: $text-muted; }

.info-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
.glass-block { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; }
.block-title { font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
.b-icon { font-size: 18px; }
.info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed rgba(255,255,255,0.05); &:last-child { border: none; padding-bottom: 0; } }
.i-label { font-size: 14px; color: $text-muted; }
.i-val { font-size: 15px; font-weight: 500; color: #e2e8f0; }
.i-val.highlight { color: $primary-light; font-weight: 600; }

.skill-tags { display: flex; flex-wrap: wrap; gap: 12px; }
.neon-tag { padding: 6px 14px; border-radius: 10px; font-size: 13px; font-weight: 500; background: rgba(255,255,255,0.03); color: #cbd5e1; border: 1px solid rgba(255,255,255,0.08); }
.neon-tag.active { background: rgba($primary, 0.1); color: #bfdbfe; border-color: rgba($primary, 0.3); }

.action-banner { display: flex; align-items: center; gap: 16px; padding: 20px; background: linear-gradient(90deg, rgba($primary,0.1), transparent); border-left: 4px solid $primary; border-radius: 12px; }
.banner-icon { font-size: 24px; animation: pulse 2s infinite; }
.banner-text { display: flex; flex-direction: column; gap: 4px; }
.b-title { font-size: 15px; font-weight: 600; color: #fff; }
.b-desc { font-size: 13px; color: $text-muted; }

/* ==================== 统一组件与滚动条 ==================== */
.liquid-btn {
  display: inline-flex; align-items: center; justify-content: center; height: 48px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; color: #fff;
  background: linear-gradient(135deg, $primary, $secondary); box-shadow: 0 8px 20px rgba($primary, 0.3); transition: 0.3s; border: none;
}
.liquid-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba($primary, 0.5); }
.liquid-btn.micro { height: 38px; padding: 0 24px; font-size: 14px; border-radius: 10px; box-shadow: none; }
.liquid-btn.large { height: 56px; font-size: 16px; border-radius: 14px; }
.liquid-btn.fill-width { width: 100%; box-sizing: border-box; }
.liquid-btn .btn-txt { position: relative; z-index: 2; }

.ghost-btn.outline { background: transparent; border: 1px dashed rgba(255,255,255,0.2); color: #cbd5e1; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; transition: 0.2s; }
.ghost-btn.outline:hover { background: rgba(255,255,255,0.05); color: #fff; border-style: solid; border-color: rgba(255,255,255,0.4); }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

/* 动画序列修复版 */
.fade-in-down { animation: fadeInDown 0.6s ease both; }
.fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.fade-in-left { animation: fadeInLeft 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; } 
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.9); } }
.mt-20 { margin-top: 20px; } .mt-16 { margin-top: 16px; } .mt-10 { margin-top: 10px; }
</style>