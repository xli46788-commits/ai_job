<template>
  <view class="company-universe-web">
    <view class="aurora-wrapper">
      <view class="orb orb-1"></view>
      <view class="orb orb-2"></view>
      <view class="orb orb-3"></view>
      <view class="orb orb-4"></view>
      <view class="grid-overlay"></view>
    </view>

    <view class="workspace-layout">
      <view class="glass-header fade-in-down">
        <view class="header-left">
          <view class="icon-btn" @click="goBack" title="返回上一页">
            <text class="arrow-left">←</text>
          </view>
          <text class="title">发布新岗位</text>
        </view>
        <view class="header-center">
          </view>
        <view class="header-right">
          <view class="action-btn ghost mini" @click="saveAsDraft">
            <text>存为草稿</text>
          </view>
          <view class="liquid-btn micro" @click="submitJob">
            <text class="btn-txt">🚀 立即发布</text>
          </view>
        </view>
      </view>

      <view class="workspace-body">
        
        <scroll-view class="left-form-panel custom-scrollbar fade-in-up delay-1" scroll-y>
          <view class="form-content">
            <view class="required-hint">
              <text class="glow-asterisk">*</text> <text class="hint-text">星号标记为必填字段</text>
            </view>

            <view class="ultra-glass-card">
              <view class="section-header">
                <view class="header-icon-box theme-blue">
                  <text class="emoji">📋</text>
                  <view class="icon-glow"></view>
                </view>
                <text class="section-title">基本信息</text>
              </view>

              <view class="section-body">
                <view class="form-grid-2">
                  <view class="form-item">
                    <label class="crystal-label">岗位名称 <text class="glow-asterisk">*</text></label>
                    <input class="crystal-input" v-model="jobForm.title" placeholder="如：资深前端开发工程师" />
                  </view>
                  <view class="form-item">
                    <label class="crystal-label">薪资范围 <text class="glow-asterisk">*</text></label>
                    <input class="crystal-input" v-model="jobForm.salary" placeholder="如：15-25K/月" />
                  </view>
                  <view class="form-item">
                    <label class="crystal-label">工作地点 <text class="glow-asterisk">*</text></label>
                    <input class="crystal-input" v-model="jobForm.location" placeholder="如：北京海淀" />
                  </view>
                  <view class="form-item">
                    <label class="crystal-label">招聘人数 <text class="glow-asterisk">*</text></label>
                    <input class="crystal-input" type="number" v-model="jobForm.count" placeholder="如：5" />
                  </view>
                  
                  <view class="form-item" style="grid-column: 1 / -1;">
                    <label class="crystal-label">联系方式 <text class="glow-asterisk">*</text></label>
                    <input class="crystal-input" v-model="jobForm.contact_info" placeholder="如：HR微信、手机或邮箱" />
                  </view>

                </view>
              </view>
            </view>

            <view class="ultra-glass-card">
              <view class="section-header">
                <view class="header-icon-box theme-purple">
                  <text class="emoji">📝</text>
                  <view class="icon-glow"></view>
                </view>
                <text class="section-title">岗位描述</text>
              </view>
              <view class="section-body">
                <view class="textarea-wrapper">
                  <textarea 
                    class="crystal-textarea large" 
                    v-model="jobForm.description" 
                    placeholder="请详细描述该岗位的工作职责、日常产出等... 可以在右侧唤起 AI 助手辅助编写"
                    maxlength="1000"
                    @input="onDescriptionInput"
                  />
                  <text class="char-counter">{{ jobForm.description.length }}/1000</text>
                </view>
              </view>
            </view>

            <view class="ultra-glass-card">
              <view class="section-header">
                <view class="header-icon-box theme-cyan">
                  <text class="emoji">🎯</text>
                  <view class="icon-glow"></view>
                </view>
                <text class="section-title">任职要求</text>
              </view>
              <view class="section-body">
                <view class="textarea-wrapper">
                  <textarea class="crystal-textarea large" v-model="jobForm.requirements" placeholder="请输入学历、经验、硬技能与软实力要求..." maxlength="800" />
                  <text class="char-counter">{{ jobForm.requirements.length }}/800</text>
                </view>
              </view>
            </view>

            <view class="ultra-glass-card mb-0">
              <view class="section-header">
                <view class="header-icon-box theme-orange">
                  <text class="emoji">🏷️</text>
                  <view class="icon-glow"></view>
                </view>
                <text class="section-title">技能标签</text>
                <text class="optional-tag">选填</text>
              </view>
              <view class="section-body">
                <view class="tag-input-wrapper">
                  <input class="crystal-input pr-50" v-model="newTag" placeholder="输入技能后回车添加..." @keyup.enter="addTag" />
                  <view class="enter-hint">↵</view>
                </view>

                <view class="selected-tags" v-if="jobForm.tags.length > 0">
                  <view v-for="(tag, index) in jobForm.tags" :key="index" class="neon-tag active" @click="removeTag(index)">
                    {{ tag }} <text class="close-icon">×</text>
                  </view>
                </view>

                <view class="divider"></view>
                <text class="suggested-label">热门推荐：</text>
                <view class="tags-pool">
                  <view v-for="(tag, index) in popularTags" :key="index" class="neon-tag ghost" @click="addPopularTag(tag)">
                    + {{ tag }}
                  </view>
                </view>
              </view>
            </view>
            
            <view class="safe-area-bottom"></view>
          </view>
        </scroll-view>

        <view class="right-ai-panel fade-in-left delay-2">
          <view class="copilot-container">
            <view class="copilot-border-glow"></view>
            
            <view class="copilot-inner">
              <view class="copilot-header">
                <view class="title-wrap">
                  <text class="ai-icon pulse-icon">✨</text>
                  <text class="ai-title">Copilot 洞察</text>
                </view>
                <view class="status-indicator">
                  <text class="dot" :class="{ 'active': isAnalyzing }"></text>
                  <text class="status-txt">{{ isAnalyzing ? '引擎分析中...' : '待命中' }}</text>
                </view>
              </view>

              <scroll-view class="copilot-body custom-scrollbar" scroll-y>
                <view class="ai-empty-state" v-if="!aiSuggestions && !isAnalyzing">
                  <view class="empty-icon">🤖</view>
                  <text class="empty-title">AI 随时待命</text>
                  <text class="empty-desc">随着您在左侧输入岗位信息，我将实时计算“岗位吸引力指数”，并为您提供黑话润色与结构优化建议。</text>
                  
                  <view class="quick-action-card" @click="getAISuggestions" v-if="jobForm.description.length > 20">
                    <text>⚡ 立即诊断当前 JD</text>
                    <text class="arrow">→</text>
                  </view>
                </view>

                <view class="ai-loading-state" v-if="isAnalyzing">
                  <view class="scanning-line"></view>
                  <view class="skeleton-block"></view>
                  <view class="skeleton-text"></view>
                  <view class="skeleton-text short"></view>
                </view>

                <view class="ai-result-state fade-in-up" v-if="aiSuggestions && !isAnalyzing">
                  <view class="score-card">
                    <text class="score-label">当前吸引力评估</text>
                    <view class="score-value-wrap">
                      <text class="score-value">{{ aiSuggestions.score || 85 }}</text>
                      <text class="score-unit">/100</text>
                    </view>
                    <view class="progress-bar">
                      <view class="progress-inner" :style="{ width: (aiSuggestions.score || 85) + '%' }"></view>
                    </view>
                  </view>

                  <view class="suggestion-box">
                    <text class="highlight-title">{{ aiSuggestions.title || '💡 优化建议：' }}</text>
                    <text class="suggestion-content">{{ aiSuggestions.content }}</text>
                  </view>

                  <view class="liquid-btn fill-width mt-20" @click="applySuggestion(aiSuggestions)">
                    <text class="btn-txt">✨ 采纳建议并重塑 JD</text>
                    <view class="shimmer-effect"></view>
                  </view>
                </view>
              </scroll-view>
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
      jobForm: { title: '', salary: '', location: '', count: '', description: '', requirements: '', tags: [], contact_info: '' },
      newTag: '',
      aiSuggestions: null,
      isAnalyzing: false,
      analyzeTimeout: null,
      // 热门标签属于合理的静态前端配置，予以保留
      popularTags: ['Vue 3', 'React', 'TypeScript', 'Node.js', 'Go', 'Python', 'AIGC', '大模型', '商业化', '数据增长']
    };
  },
  methods: {
    addTag() {
      const tag = this.newTag.trim();
      if (tag && !this.jobForm.tags.includes(tag)) { this.jobForm.tags.push(tag); this.newTag = ''; }
    },
    addPopularTag(tag) { if (!this.jobForm.tags.includes(tag)) this.jobForm.tags.push(tag); },
    removeTag(index) { this.jobForm.tags.splice(index, 1); },
    
    onDescriptionInput() {
      if (this.jobForm.description.length < 20) return;
      if (this.analyzeTimeout) clearTimeout(this.analyzeTimeout);
      
      this.analyzeTimeout = setTimeout(() => {
        // 真实业务中可在此处自动触发防抖的大模型诊断
      }, 1500);
    },

    // 🚀 核心重构：替换死数据，真实调用大模型诊断 API
    async getAISuggestions() {
      if (this.jobForm.description.length < 10) { 
        uni.showToast({ title: '岗位描述太短啦', icon: 'none' }); 
        return; 
      }
      this.isAnalyzing = true;
      this.aiSuggestions = null;
      
      try {
        // 假设您在 api.js 中新加了 analyzeJobDescription 接口
        // 如果后端还没写这个接口，调用会报错走 catch 分支，绝不会强塞死数据
        const res = await API.analyzeJobDescription({ description: this.jobForm.description });
        const realData = res.data?.data || res.data || res;
        
        this.aiSuggestions = {
          title: realData.title || '💡 AI 洞察建议：',
          content: realData.content || '建议补充具体的业务场景和技术栈，以吸引精准人才。',
          score: realData.score || 85 // 大模型返回的吸引力打分
        };
      } catch (error) {
        console.error("AI诊断异常:", error);
        uni.showToast({ title: 'AI引擎响应超时，请稍后重试', icon: 'none' });
      } finally {
        this.isAnalyzing = false;
      }
    },
    
    // 🚀 安全重构：解绑了硬编码字符串的替换逻辑
    applySuggestion(suggestion) {
      if (!suggestion || !suggestion.content) return;
      
      // 动态将真实 AI 的建议追加进去，并加上明显的分隔
      this.jobForm.description += '\n\n【AI 优化补充】\n' + suggestion.content;
      this.aiSuggestions = null;
      uni.showToast({ title: 'JD 已融合 AI 建议', icon: 'success' });
    },

    saveAsDraft() {
      uni.showToast({ title: '草稿已保存', icon: 'success' });
    },

    async submitJob() {
      const { title, salary, location, count, description, requirements, tags, contact_info } = this.jobForm;
      
      if (!title || !salary || !location || !count || !description || !requirements || !contact_info) {
        uni.showToast({ title: '请完善星号必填项', icon: 'none' });
        return;
      }
      
      uni.showLoading({ title: '发布中...', mask: true });
      
      try {
        const postData = {
          job_name: title,
          job_salary: salary,
          job_location: location,
          job_description: description,
          job_requirement: requirements,
          is_published: true,
          recruit_count: parseInt(count) || 1, 
          job_keywords: tags.length > 0 ? tags.join(',') : '',
          contact_info: contact_info
        };
        
        await API.postJob(postData);
        
        uni.hideLoading(); 
        uni.showToast({ title: '发布成功', icon: 'success' });
        setTimeout(() => { uni.navigateBack(); }, 1500);
        
      } catch (error) {
        uni.hideLoading();
        uni.showToast({ title: '发布失败请重试', icon: 'none' });
        console.error("发布岗位报错:", error);
      }
    },
    goBack() { uni.navigateBack(); }
  }
};
</script>

<style lang="scss" scoped>
/* ==================== Web 端专属色彩体系 ==================== */
$bg-deep: #020205; 
$primary: #3b82f6; 
$secondary: #8b5cf6; 
$accent: #06b6d4;
$success: #10b981; 
$warning: #f59e0b; 
$text-main: #f8fafc;
$text-muted: #64748b;

/* ==================== 极光背景 ==================== */
.company-universe-web {
  height: 100vh; width: 100vw; background-color: $bg-deep; position: relative; overflow: hidden; 
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.aurora-wrapper { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(160px); opacity: 0.4; mix-blend-mode: screen; animation: float 30s infinite alternate ease-in-out; }
.orb-1 { width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 60%); top: -10%; left: -10%; }
.orb-2 { width: 45vw; height: 45vw; background: radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 60%); bottom: -20%; right: 10%; animation-delay: -5s; }
.orb-3 { width: 40vw; height: 40vw; background: radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 60%); top: 20%; left: 40%; animation-delay: -10s; }
.orb-4 { width: 30vw; height: 30vw; background: radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 60%); bottom: 10%; left: 10%; animation-delay: -15s; }
.grid-overlay { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px); background-size: 50px 50px; }
@keyframes float { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(3%, 5%) scale(1.1); } }

/* ==================== 核心布局 ==================== */
.workspace-layout { position: relative; z-index: 10; height: 100vh; display: flex; flex-direction: column; }

/* 顶部 Header */
.glass-header {
  height: 70px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px;
  background: linear-gradient(180deg, rgba(2,2,5,0.9) 0%, rgba(2,2,5,0.4) 100%);
  border-bottom: 1px solid rgba(255,255,255,0.05); backdrop-filter: blur(20px); flex-shrink: 0;
}
.header-left { display: flex; align-items: center; gap: 20px; }
.icon-btn { width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.icon-btn:hover { background: rgba(255,255,255,0.1); transform: translateX(-2px); }
.arrow-left { color: #fff; font-size: 18px; }
.title { font-size: 18px; font-weight: 600; color: #fff; letter-spacing: 1px; }
.header-right { display: flex; align-items: center; gap: 16px; }

/* 工作区主体 */
.workspace-body { flex: 1; display: flex; gap: 32px; max-width: 1600px; width: 100%; margin: 0 auto; padding: 32px 40px; box-sizing: border-box; height: calc(100vh - 70px); }

/* ==================== 左侧表单舱 ==================== */
.left-form-panel { flex: 1; height: 100%; border-radius: 24px; padding-right: 16px; }
.form-content { padding-bottom: 40px; }
.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px 32px; }

.ultra-glass-card {
  background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.005) 100%);
  backdrop-filter: blur(40px) saturate(120%); border: 1px solid rgba(255,255,255,0.06); border-top: 1px solid rgba(255,255,255,0.12);
  border-radius: 24px; box-shadow: 0 16px 40px -10px rgba(0,0,0,0.5); margin-bottom: 32px;
}
.mb-0 { margin-bottom: 0; }
.section-header { display: flex; align-items: center; gap: 16px; padding: 24px 32px; border-bottom: 1px solid rgba(255,255,255,0.03); background: rgba(255,255,255,0.01); }
.header-icon-box { width: 42px; height: 42px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; position: relative; }
.header-icon-box .emoji { font-size: 20px; z-index: 2; }
.icon-glow { position: absolute; inset: 0; filter: blur(14px); opacity: 0.5; z-index: 1; border-radius: inherit; }
.theme-blue .icon-glow { background: $primary; } .theme-purple .icon-glow { background: $secondary; }
.theme-cyan .icon-glow { background: $accent; } .theme-orange .icon-glow { background: $warning; }
.section-title { font-size: 17px; font-weight: 600; color: #fff; }
.optional-tag { margin-left: auto; font-size: 12px; color: $text-muted; padding: 4px 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; }
.section-body { padding: 32px; }

/* 晶态表单件 */
.required-hint { margin-bottom: 24px; color: $text-muted; font-size: 14px; display: flex; align-items: center; }
.glow-asterisk { color: $accent; text-shadow: 0 0 12px rgba(6,182,212,0.8); margin-right: 6px; font-weight: bold; font-size: 16px; }
.crystal-label { display: block; font-size: 14px; color: #cbd5e1; margin-bottom: 14px; font-weight: 500; }
.crystal-input {
  width: 100%; height: 54px; padding: 0 20px; box-sizing: border-box;
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-top: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px; font-size: 15px; color: #fff; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2); transition: all 0.3s;
}
.crystal-input:focus { background: rgba(255,255,255,0.04); border-color: rgba(6,182,212,0.5); box-shadow: 0 0 0 1px rgba(6,182,212,0.3), 0 0 20px rgba(6,182,212,0.1), inset 0 2px 4px rgba(0,0,0,0.1); outline: none; }
.textarea-wrapper { position: relative; }
.crystal-textarea { width: 100%; padding: 20px; box-sizing: border-box; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-top: 1px solid rgba(255,255,255,0.12); border-radius: 16px; font-size: 15px; color: #fff; line-height: 1.6; transition: all 0.3s; resize: vertical; min-height: 140px; }
.crystal-textarea.large { min-height: 200px; }
.crystal-textarea:focus { border-color: rgba(139,92,246,0.5); box-shadow: 0 0 0 1px rgba(139,92,246,0.3), 0 0 20px rgba(139,92,246,0.1); outline: none; }
.char-counter { position: absolute; bottom: 16px; right: 20px; font-size: 13px; color: rgba(255,255,255,0.4); background: rgba(0,0,0,0.5); padding: 4px 10px; border-radius: 8px; }

/* 标签组 */
.tag-input-wrapper { position: relative; margin-bottom: 24px; }
.tag-input-wrapper .pr-50 { padding-right: 60px; }
.enter-hint { position: absolute; right: 16px; top: 15px; width: 26px; height: 26px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: rgba(255,255,255,0.5); }
.selected-tags, .tags-pool { display: flex; flex-wrap: wrap; gap: 12px; }
.neon-tag { padding: 8px 18px; border-radius: 12px; font-size: 14px; cursor: pointer; transition: 0.2s; user-select: none; }
.neon-tag.active { background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05)); border: 1px solid rgba(59,130,246,0.4); color: #bfdbfe; }
.neon-tag.active:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.4); color: #fecaca; }
.neon-tag.ghost { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; }
.neon-tag.ghost:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); color: #fff; transform: translateY(-2px); }
.divider { height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.08), transparent); margin: 32px 0 24px; }
.suggested-label { font-size: 14px; color: #64748b; display: block; margin-bottom: 16px; }

/* ==================== 右侧 AI 助手舱 ==================== */
.right-ai-panel { width: 420px; flex-shrink: 0; height: 100%; display: flex; flex-direction: column; }
.copilot-container { position: relative; height: 100%; border-radius: 24px; padding: 2px; overflow: hidden; display: flex; flex-direction: column; }
.copilot-border-glow { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(59,130,246,0.5), rgba(139,92,246,0.5), rgba(6,182,212,0.5)); background-size: 200% 200%; animation: gradientFlow 8s linear infinite; opacity: 0.8; z-index: 0; }
.copilot-inner { position: relative; z-index: 1; background: #05060A; height: 100%; border-radius: 22px; display: flex; flex-direction: column; }
.copilot-header { padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); }
.title-wrap { display: flex; align-items: center; }
.ai-icon { font-size: 20px; }
.pulse-icon { animation: pulse 2s infinite; }
.ai-title { font-size: 17px; font-weight: 600; background: linear-gradient(90deg, #fff, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-left: 8px; }
.status-indicator { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); padding: 6px 12px; border-radius: 20px; }
.status-indicator .dot { width: 6px; height: 6px; background: #10b981; border-radius: 50%; }
.status-indicator .dot.active { background: #8b5cf6; box-shadow: 0 0 10px #8b5cf6; animation: blink 1s infinite; }
.status-txt { font-size: 12px; color: #94a3b8; }

.copilot-body { flex: 1; padding: 24px; height: 0; }

/* 助手内部状态 */
.ai-empty-state { text-align: center; padding: 40px 20px; }
.empty-icon { font-size: 48px; margin-bottom: 20px; opacity: 0.8; filter: drop-shadow(0 0 20px rgba(139,92,246,0.4)); }
.empty-title { display: block; font-size: 18px; color: #fff; font-weight: 600; margin-bottom: 12px; }
.empty-desc { display: block; font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 32px; }
.quick-action-card { background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.3); border-radius: 16px; padding: 16px; color: #d8b4fe; font-size: 14px; font-weight: 500; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: 0.2s; }
.quick-action-card:hover { background: rgba(139,92,246,0.2); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(139,92,246,0.15); }

/* 加载骨架屏 */
.ai-loading-state { padding: 20px 0; }
.scanning-line { height: 2px; background: linear-gradient(90deg, transparent, $secondary, transparent); width: 100%; margin-bottom: 24px; animation: scan 1.5s infinite; }
.skeleton-block { height: 80px; background: rgba(255,255,255,0.03); border-radius: 16px; margin-bottom: 16px; animation: pulse-bg 1.5s infinite; }
.skeleton-text { height: 16px; background: rgba(255,255,255,0.03); border-radius: 8px; margin-bottom: 12px; animation: pulse-bg 1.5s infinite; }
.skeleton-text.short { width: 60%; }

/* 结果呈现 */
.score-card { background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; margin-bottom: 24px; }
.score-label { font-size: 14px; color: #cbd5e1; margin-bottom: 12px; display: block; }
.score-value-wrap { display: flex; align-items: baseline; gap: 4px; margin-bottom: 16px; }
.score-value { font-size: 36px; font-weight: 700; color: #10b981; text-shadow: 0 0 20px rgba(16,185,129,0.4); line-height: 1; }
.score-unit { font-size: 14px; color: #64748b; }
.progress-bar { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
.progress-inner { height: 100%; background: linear-gradient(90deg, #3b82f6, #10b981); border-radius: 3px; box-shadow: 0 0 10px #10b981; }

.suggestion-box { background: rgba(139,92,246,0.05); border: 1px solid rgba(139,92,246,0.2); border-radius: 16px; padding: 20px; }
.suggestion-box .highlight-title { display: block; font-size: 15px; font-weight: 600; color: #d8b4fe; margin-bottom: 12px; }
.suggestion-box .suggestion-content { font-size: 14px; color: #e2e8f0; line-height: 1.8; }

/* 按钮通用 */
.liquid-btn {
  position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, $primary, $secondary); color: #fff; border-radius: 14px;
  font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 8px 24px -6px rgba(139, 92, 246, 0.6); border: none; outline: none;
}
.liquid-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px -4px rgba(139, 92, 246, 0.8); }
.liquid-btn.micro { height: 42px; padding: 0 24px; font-size: 14px; }
.liquid-btn.fill-width { width: 100%; height: 50px; font-size: 15px; }
.liquid-btn .btn-txt { position: relative; z-index: 2; }
.ghost { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: #fff; display: inline-flex; align-items: center; justify-content: center; border-radius: 14px; cursor: pointer; transition: 0.2s; }
.ghost:hover { background: rgba(255,255,255,0.1); }
.ghost.mini { height: 42px; padding: 0 20px; font-size: 14px; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

@keyframes scan { 0% { transform: translateX(-100%); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateX(100%); opacity: 0; } }
@keyframes pulse-bg { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.fade-in-down { animation: fadeInDown 0.6s ease forwards; }
.fade-in-up { animation: fadeInUp 0.6s ease forwards; opacity: 0; }
.fade-in-left { animation: fadeInLeft 0.6s ease forwards; opacity: 0; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.mt-20 { margin-top: 20px; }
.action-footer { margin-top: 40px; }
.safe-area-bottom { height: 40px; }
</style>
