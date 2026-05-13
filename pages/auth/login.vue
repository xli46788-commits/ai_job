<template>
  <view class="login-universe">
    <view class="aurora-wrapper">
      <view class="orb orb-1"></view>
      <view class="orb orb-2"></view>
      <view class="orb orb-3"></view>
      <view class="grid-overlay"></view>
    </view>

    <view class="content-layer">
      <view class="brand-floating fade-in-up delay-1">
        <text class="app-name">AI职引未来</text>
        <text class="slogan">重塑简历基因，精准链接触达</text>
        
        <view class="stats-row">
          <view class="stat-item">
            <text class="stat-num">10x</text>
            <text class="stat-desc">匹配效率</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-num">98%</text>
            <text class="stat-desc">算法准确率</text>
          </view>
        </view>
      </view>

      <view class="glass-card fade-in-up delay-2">
        <view class="card-header">
          <text class="greeting">探索您的职业边界</text>
          <text class="sub-greeting">登录以继续您的旅程</text>
        </view>

        <view class="role-switcher">
          <view class="switcher-bg" :class="selectedRole"></view>
          <view 
            class="switch-item" 
            :class="{ active: selectedRole === 'student' }"
            @click="selectRole('student')"
          >
            <text class="icon">🎓</text>
            <text>学生端</text>
          </view>
          <view 
            class="switch-item" 
            :class="{ active: selectedRole === 'company' }"
            @click="selectRole('company')"
          >
            <text class="icon">🏢</text>
            <text>企业端</text>
          </view>
        </view>

        <view class="form-container">
          <view class="input-wrapper">
            <text class="floating-label" :class="{ 'active-label': form.username }">账号</text>
            <input 
              class="glass-input" 
              type="text" 
              v-model="form.username" 
              placeholder="请输入您的账号"
              placeholder-style="color: rgba(255,255,255,0.2)"
            />
          </view>
          
          <view class="input-wrapper">
            <text class="floating-label" :class="{ 'active-label': form.password }">密码</text>
            <input 
              class="glass-input" 
              type="password" 
              v-model="form.password" 
              placeholder="请输入您的密码"
              placeholder-style="color: rgba(255,255,255,0.2)"
              @confirm="login"
            />
          </view>

          <view class="action-row">
            <text class="text-btn">忘记密码？</text>
          </view>
          
          <view class="shimmer-btn" @click="login">
            <text class="btn-text">登 录</text>
            <view class="shimmer-effect"></view>
          </view>
          
          <view class="bottom-action">
            <text class="desc">首次来到这里？</text>
            <text class="text-btn primary" @click="showRegister = true">创建账号</text>
          </view>

          <view class="admin-divider">
            <view class="line"></view>
            <text class="text">System Access</text>
            <view class="line"></view>
          </view>
          
          <view class="admin-entry" :class="{ 'admin-active': selectedRole === 'admin' }" @click="goToAdmin">
            <text class="shield-icon">🛡️</text>
            <text class="admin-text">{{ selectedRole === 'admin' ? '当前处于超管登录模式' : '切换至总控管理员通道' }}</text>
            <text class="arr-icon">→</text>
          </view>

        </view>
      </view>
    </view>

    <view class="register-modal" v-if="showRegister">
      <view class="modal-backdrop" @click="showRegister = false"></view>
      <view class="glass-modal pop-in">
        <text class="modal-title">加入 AI 职引未来</text>
        <view class="input-wrapper"><input class="glass-input" type="text" v-model="registerForm.username" placeholder="设置账号" placeholder-style="color: rgba(255,255,255,0.3)"/></view>
        <view class="input-wrapper"><input class="glass-input" type="password" v-model="registerForm.password" placeholder="设置密码" placeholder-style="color: rgba(255,255,255,0.3)"/></view>
        <view class="input-wrapper"><input class="glass-input" type="password" v-model="registerForm.confirmPassword" placeholder="确认密码" placeholder-style="color: rgba(255,255,255,0.3)"/></view>
        <view class="modal-btns">
          <view class="ghost-btn" @click="showRegister = false">取消</view>
          <view class="shimmer-btn mini" @click="register"><text class="btn-text">注 册</text></view>
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
      selectedRole: 'student', 
      showRegister: false,
      form: { username: '', password: '' },
      registerForm: { username: '', password: '', confirmPassword: '' }
    };
  },
  methods: {
    selectRole(role) {
      this.selectedRole = role;
    },
    
    // 🚀 真实登录请求
    async login() {
      if (!this.form.username || !this.form.password) {
        uni.showToast({ title: '请输入账号和密码', icon: 'none' });
        return;
      }
      uni.showLoading({ title: '正在连接 AI 引擎...' });
      
      try {
        const res = await API.login({
          username: this.form.username,
          password: this.form.password
        });

        // 存储 Token 
        uni.setStorageSync('token', res.access || res.token);
        
        // 存储后端的真实角色
        const userRole = res.role; 
        uni.setStorageSync('user_role', userRole);
        uni.setStorageSync('user_info', { username: this.form.username });
        
        uni.hideLoading();
        uni.showToast({ title: '登录成功', icon: 'success' });

        // 根据真实角色跳转
        setTimeout(() => {
          if (userRole === 'admin') uni.reLaunch({ url: '/pages/admin/home' });
          else if (userRole === 'company') uni.reLaunch({ url: '/pages/company/home' });
          else uni.reLaunch({ url: '/pages/student/home' });
        }, 800);

      } catch (error) {
        uni.hideLoading();
        console.error("登录失败", error);
      }
    },
    
    // 🚀 真实注册请求
    async register() {
      if (!this.registerForm.username || !this.registerForm.password) {
        uni.showToast({ title: '请填写完整', icon: 'none' }); return;
      }
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        uni.showToast({ title: '两次密码不一致', icon: 'none' }); return;
      }
      if (this.selectedRole === 'admin') {
        uni.showToast({ title: '超管账号无法通过外部注册', icon: 'none' }); return;
      }

      uni.showLoading({ title: '创建档案中...' });
      
      try {
        await API.register({
          username: this.registerForm.username,
          password: this.registerForm.password,
          role: this.selectedRole 
        });
        
        uni.hideLoading();
        uni.showToast({ title: '欢迎加入', icon: 'success' });
        this.showRegister = false;
        
        // 自动回填
        this.form.username = this.registerForm.username;
        this.form.password = this.registerForm.password;
        this.registerForm = { username: '', password: '', confirmPassword: '' };
        
      } catch (error) {
        uni.hideLoading();
      }
    },
    
    // 🚀 修复管理员通道漏洞（改为切换角色而不是直接免密进入）
    goToAdmin() {
      this.selectedRole = 'admin';
      uni.showToast({ title: '已进入超管模式，请输入特权密码', icon: 'none' });
    }
  }
};
</script>

<style lang="scss" scoped>
/* ==================== 宇宙级色彩定义 ==================== */
$bg-deep: #020617; 
$primary: #3b82f6; 
$secondary: #8b5cf6; 
$accent: #06b6d4; 
$danger: #ef4444; 

/* ==================== 容器与背景 ==================== */
.login-universe {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: $bg-deep;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.aurora-wrapper {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  overflow: hidden; z-index: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.6;
  animation: float 20s infinite alternate ease-in-out;
}

.orb-1 { width: 60vw; height: 60vw; background: radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 60%); top: -20%; left: -10%; }
.orb-2 { width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 60%); bottom: -20%; right: -10%; animation-delay: -5s; }
.orb-3 { width: 40vw; height: 40vw; background: radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 60%); top: 40%; left: 30%; animation-delay: -10s; }

.grid-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-image: 
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 1;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(5%, 5%) scale(1.1); }
  100% { transform: translate(-5%, 10%) scale(0.9); }
}

.content-layer {
  position: relative; z-index: 10; width: 100%; max-width: 1200px; display: flex; justify-content: space-between; align-items: center; padding: 0 40px;
  @media (max-width: 900px) { flex-direction: column; justify-content: center; gap: 40px; padding: 20px; }
}

.fade-in-up { opacity: 0; animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.4s; }

@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

.brand-floating { flex: 1; max-width: 500px; @media (max-width: 900px) { text-align: center; display: flex; flex-direction: column; align-items: center; } }
.badge { display: inline-block; padding: 6px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; color: #94a3b8; font-size: 13px; letter-spacing: 1px; margin-bottom: 24px; backdrop-filter: blur(10px); }
.app-name { display: block; font-size: 64px; font-weight: 900; color: #fff; letter-spacing: -1px; line-height: 1.1; margin-bottom: 16px; background: linear-gradient(to right, #ffffff 30%, #a5b4fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.slogan { display: block; font-size: 20px; color: #cbd5e1; margin-bottom: 40px; font-weight: 300; }
.stats-row { display: flex; align-items: center; gap: 32px; }
.stat-item { display: flex; flex-direction: column; }
.stat-num { font-size: 32px; font-weight: 700; color: #fff; }
.stat-desc { font-size: 14px; color: #64748b; margin-top: 4px; }
.stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.1); }

.glass-card {
  width: 100%; max-width: 440px; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; padding: 40px; box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1);
}
.card-header { margin-bottom: 32px; }
.greeting { display: block; font-size: 24px; font-weight: 600; color: #fff; margin-bottom: 6px; }
.sub-greeting { display: block; font-size: 14px; color: #94a3b8; }

.role-switcher { position: relative; display: flex; background: rgba(0, 0, 0, 0.3); border-radius: 16px; padding: 6px; margin-bottom: 32px; border: 1px solid rgba(255,255,255,0.05); }
.switcher-bg { position: absolute; top: 6px; bottom: 6px; width: calc(50% - 6px); background: rgba(255, 255, 255, 0.1); border-radius: 12px; transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1); box-shadow: 0 4px 12px rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); }
.switcher-bg.student { transform: translateX(0); }
.switcher-bg.company { transform: translateX(100%); }
.switcher-bg.admin { opacity: 0; }

.switch-item { flex: 1; position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; height: 44px; font-size: 15px; font-weight: 500; color: #64748b; cursor: pointer; transition: color 0.3s; .icon { margin-right: 8px; font-size: 18px; } &.active { color: #fff; } }

.input-wrapper { position: relative; margin-bottom: 24px; }
.floating-label { display: block; font-size: 13px; color: #94a3b8; margin-bottom: 8px; padding-left: 4px; transition: all 0.3s ease; }
.active-label { color: $primary; }
.glass-input { width: 100%; height: 56px; padding: 0 20px; box-sizing: border-box; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; font-size: 15px; color: #fff; transition: all 0.3s ease; &:focus { background: rgba(255, 255, 255, 0.05); border-color: rgba(59, 130, 246, 0.5); box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); } }

.action-row { display: flex; justify-content: flex-end; margin-bottom: 24px; }
.text-btn { font-size: 14px; color: #94a3b8; cursor: pointer; transition: color 0.2s; &:hover { color: #fff; } &.primary { color: $primary; font-weight: 500; } &.primary:hover { color: #60a5fa; } }

.shimmer-btn { position: relative; overflow: hidden; width: 100%; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, $primary, $secondary); cursor: pointer; box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3); transition: transform 0.2s; &:active { transform: scale(0.98); } .btn-text { position: relative; z-index: 2; color: #fff; font-size: 16px; font-weight: 600; letter-spacing: 2px; } }
.shimmer-effect { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); transform: skewX(-20deg); z-index: 1; animation: shimmer 3s infinite; }
@keyframes shimmer { 100% { left: 200%; } }

.bottom-action { margin-top: 24px; text-align: center; .desc { font-size: 14px; color: #64748b; margin-right: 8px; } }

.admin-divider { display: flex; align-items: center; justify-content: center; margin: 32px 0 16px; opacity: 0.6; .line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); } .text { font-size: 11px; color: #64748b; margin: 0 12px; font-family: monospace; letter-spacing: 1px; } }
.admin-entry { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; border-radius: 14px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.1); cursor: pointer; transition: all 0.3s; &:hover { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); transform: translateY(-2px); } .shield-icon { font-size: 16px; } .admin-text { font-size: 13px; color: #fca5a5; font-weight: 500; letter-spacing: 0.5px; flex: 1; text-align: center; } .arr-icon { font-size: 14px; color: #fca5a5; transition: transform 0.3s; } &:hover .arr-icon { transform: translateX(4px); } }
.admin-active { background: rgba(59, 130, 246, 0.1) !important; border-color: rgba(59, 130, 246, 0.4) !important; .admin-text, .arr-icon { color: #60a5fa !important; } }

.register-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 100; display: flex; align-items: center; justify-content: center; }
.modal-backdrop { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); }
.glass-modal { position: relative; z-index: 101; width: 90%; max-width: 400px; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 32px; }
.pop-in { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes popIn { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
.modal-title { display: block; font-size: 20px; font-weight: 600; color: #fff; margin-bottom: 24px; text-align: center; }
.modal-btns { display: flex; gap: 16px; margin-top: 32px; }
.ghost-btn { flex: 1; height: 48px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.shimmer-btn.mini { flex: 1; height: 48px; box-shadow: none; }
</style>