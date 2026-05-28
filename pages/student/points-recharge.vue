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
          <view class="icon-btn" @click="goBack" title="返回个人中心">
            <text class="arrow-left">←</text>
          </view>
          <text class="title">资产充值中心</text>
        </view>
        <view class="header-right">
          <view class="status-badge standby">
            <text class="dot"></text> 当前账户积分: <text class="highlight-text ml-4">{{ currentPoints }}</text>
          </view>
        </view>
      </view>
      
      <view class="workspace-body">
        
        <view class="left-selection-panel fade-in-up delay-1">
          <scroll-view class="selection-scroll custom-scrollbar" scroll-y>
            <view class="selection-content-inner">
              
              <view class="packages-section">
                <view class="section-header">
                  <view class="header-icon-box theme-primary">
                    <text>💎</text>
                  </view>
                  <text class="section-title">选择积分套餐</text>
                </view>
                
                <view class="packages-grid" v-if="rechargeOptions.length > 0">
                  <view 
                    v-for="option in rechargeOptions" 
                    :key="option.id"
                    class="ultra-glass-card package-card hover-lift"
                    :class="{ active: selectedOption === option.id && !customAmount }"
                    @click="selectOption(option.id)"
                  >
                    <view class="package-glow" v-if="selectedOption === option.id && !customAmount"></view>
                    
                    <view v-if="option.discount" class="discount-badge">
                      <text>{{ option.discount }}折特惠</text>
                    </view>

                    <view class="package-content">
                      <view class="points-display">
                        <text class="p-val">{{ option.points }}</text>
                        <text class="p-unit">积分</text>
                      </view>
                      <view class="price-display">
                        <text class="pr-sym">¥</text>
                        <text class="pr-val">{{ option.price }}</text>
                      </view>
                    </view>
                  </view>
                </view>

                <view class="empty-state mini" v-else>
                  <text class="empty-icon">📭</text>
                  <text class="empty-text">暂无可用的积分套餐，请使用下方自定义金额</text>
                </view>
              </view>
              
              <view class="custom-section mt-40">
                <view class="section-header">
                  <view class="header-icon-box theme-secondary">
                    <text>✏️</text>
                  </view>
                  <text class="section-title">自定义充值金额</text>
                </view>
                
                <view class="ultra-glass-card custom-input-card" :class="{ 'active-border': customAmount > 0 }">
                  <view class="input-wrapper">
                    <text class="input-symbol">¥</text>
                    <input 
                      type="number" 
                      v-model="customAmount" 
                      class="custom-input"
                      placeholder="请输入自定义金额 (最少 10 元)"
                      placeholder-class="input-placeholder"
                      @input="handleCustomInput"
                    />
                  </view>
                  
                  <view class="conversion-preview" v-if="customAmount > 0">
                    <text class="c-label">预计可得</text>
                    <view class="c-result">
                      <text class="c-icon">✨</text>
                      <text class="c-points">{{ customPoints }}</text>
                      <text class="c-unit">积分</text>
                    </view>
                  </view>
                </view>
              </view>

              <view class="safe-area-bottom"></view>
            </view>
          </scroll-view>
        </view>

        <view class="right-checkout-panel fade-in-left delay-2">
          <view class="ultra-glass-card checkout-card h-full">
            
            <view class="checkout-container">
              
              <scroll-view class="checkout-scroll custom-scrollbar" scroll-y>
                <view class="checkout-scroll-content">
                  
                  <view class="payment-section">
                    <text class="panel-sm-title">支付方式</text>
                    <view class="payment-list">
                      <view 
                        v-for="method in paymentMethods" 
                        :key="method.id"
                        class="payment-item hover-lift"
                        :class="{ active: selectedPayment === method.id }"
                        @click="selectPayment(method.id)"
                      >
                        <view class="p-icon-box" :class="method.themeClass">
                          <text>{{ method.icon }}</text>
                        </view>
                        <text class="p-name">{{ method.name }}</text>
                        <view class="p-check" v-if="selectedPayment === method.id">✓</view>
                      </view>
                    </view>
                  </view>
                  
                  <view class="divider mt-24 mb-24"></view>

                  <view class="benefits-section">
                    <text class="panel-sm-title">尊享权益保障</text>
                    <view class="benefits-list">
                      <view class="benefit-item">
                        <view class="b-icon-wrap"><text>⚡</text></view>
                        <view class="b-text">
                          <text class="b-title">极速到账</text>
                          <text class="b-desc">支付成功后积分秒级到账</text>
                        </view>
                      </view>
                      <view class="benefit-item">
                        <view class="b-icon-wrap"><text>🔒</text></view>
                        <view class="b-text">
                          <text class="b-title">安全保障</text>
                          <text class="b-desc">采用金融级加密技术保障交易</text>
                        </view>
                      </view>
                      <view class="benefit-item">
                        <view class="b-icon-wrap"><text>🎁</text></view>
                        <view class="b-text">
                          <text class="b-title">首充福利</text>
                          <text class="b-desc">单笔满 100 元额外获赠 10%</text>
                        </view>
                      </view>
                    </view>
                  </view>
                  
                </view>
              </scroll-view>

              <view class="checkout-footer-fixed">
                <view class="total-summary">
                  <text class="summary-label">总计需支付</text>
                  <view class="summary-price">
                    <text class="s-sym">¥</text>
                    <text class="s-val">{{ totalPrice }}</text>
                  </view>
                </view>
                <view class="liquid-btn large fill-width mt-16" :class="{ disabled: totalPrice <= 0 }" @click="confirmRecharge">
                  <view class="btn-content">
                    <text class="btn-txt">立即安全支付</text>
                  </view>
                  <view class="shimmer-effect" v-if="totalPrice > 0"></view>
                </view>
                <text class="secure-hint">🔐 支付即代表同意《用户充值协议》</text>
              </view>

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
      currentPoints: 0, // 真实动态账户积分
      selectedOption: null, 
      selectedPayment: 1, // 1 代表微信支付，2 代表支付宝
      customAmount: '',
      customPoints: 0,
      rechargeOptions: [], 
      paymentMethods: [
        { id: 1, name: '微信支付', icon: '💬', themeClass: 'wechat' }, 
        { id: 2, name: '支付宝', icon: '💳', themeClass: 'alipay' },
        { id: 3, name: '银行卡快捷支付', icon: '🏦', themeClass: 'bank' }
      ]
    }
  },
  computed: {
    totalPrice() {
      // 优先计算自定义金额
      if (this.customAmount > 0) {
        return parseFloat(this.customAmount).toFixed(2);
      }
      // 如果没有选择任何套餐，返回 '0.00'
      if (!this.selectedOption || this.rechargeOptions.length === 0) {
        return '0.00';
      }
      const option = this.rechargeOptions.find(opt => opt.id === this.selectedOption);
      return option ? option.price.toFixed(2) : '0.00';
    }
  },
  mounted() {
    // 页面加载时无感拉取真实资产余额与商户套餐
    this.fetchUserPoints();
    this.fetchRechargePackages();
  },
  methods: {
    // 1. 真实拉取扩展表中的可用积分余额
    async fetchUserPoints() {
      try {
        const res = await API.getUserProfile();
        const userData = res.data || res;
        // 精准提取
        this.currentPoints = userData.profile?.points || userData.points || 0;
      } catch (error) {
        console.error("同步积分失败:", error);
        this.currentPoints = 0; 
      }
    },

    // 2. 真实拉取后台充值套餐
    async fetchRechargePackages() {
      try {
        const res = await API.getRechargeOptions();
        const packages = res.data?.results || res.data || [];
        if (packages.length > 0) {
          this.rechargeOptions = packages;
          this.selectedOption = packages[0].id; // 默认挂载第一个高性价比套餐
        } else {
          this.rechargeOptions = []; 
        }
      } catch (error) {
        console.error("加载套餐失败:", error);
        this.rechargeOptions = []; 
      }
    },

    selectOption(id) {
      this.selectedOption = id;
      this.customAmount = ''; 
      this.customPoints = 0;
    },
    
    selectPayment(id) { 
      this.selectedPayment = id; 
    },
    
    handleCustomInput(e) {
      let val = e.detail.value;
      if (val > 0) {
        // 自定义金额换算：1元 = 10积分，多充多送额外赠 10%
        this.customPoints = Math.floor(parseFloat(val) * 10 * 1.1);
        this.selectedOption = null; 
      } else {
        this.customPoints = 0;
      }
    },

    // 🌟 核心绝杀：点击立即安全支付，联动后端分布式记账事务，并携带参数秒级跃迁至收银台
    confirmRecharge() {
      if (Number(this.totalPrice) <= 0) {
        uni.showToast({ title: '请输入有效的充值金额', icon: 'none' });
        return;
      }

      // 计算本次充值应当到账的虚拟积分数额
      let pointsToAdd = 0;
      if (this.customAmount > 0) {
        pointsToAdd = this.customPoints;
      } else {
        const option = this.rechargeOptions.find(opt => opt.id === this.selectedOption);
        if (!option) {
          uni.showToast({ title: '请选择积分套餐', icon: 'none' });
          return;
        }
        pointsToAdd = option.points;
      }
      
      // 判定收银台路由跃迁终点
      let channelKeyword = 'wechat';
      let targetPage = 'wx-pay'; // 对应 pages/student/wx-pay.vue
      
      if (this.selectedPayment === 2) {
        channelKeyword = 'alipay';
        targetPage = 'ali-pay';  // 对应 pages/student/ali-pay.vue
      } else if (this.selectedPayment === 3) {
        uni.showToast({ title: '银行卡快捷通道维护中，请切换微信或支付宝', icon: 'none' });
        return;
      }
      
      uni.showModal({
        title: '数字资产清算确认',
        content: `确认发起安全充值 ¥${this.totalPrice} 元，增加 ${pointsToAdd} 求职专属积分？`,
        confirmColor: '#3b82f6',
        success: async (modalRes) => {
          if (modalRes.confirm) {
            uni.showLoading({ title: '正在建立加密对账流水...', mask: true });
            
            try {
              // 1. 直击后端：呼叫我们在 accounts/urls.py 焊死的新静态专线
              await API.rechargePoints({
                points: pointsToAdd,
                pay_type: channelKeyword
              });
              
              uni.hideLoading();
              
              // 2. 数据库落库、流水生成成功！携金流参数秒级跳转到对应的微信/支付宝收银台
              uni.navigateTo({
                url: `/pages/student/${targetPage}?price=${this.totalPrice}&points=${pointsToAdd}`
              });
              
            } catch (error) {
              uni.hideLoading();
              console.error("记账中枢通信折损:", error);
              uni.showToast({ title: '网络通信微瑕，订单创建受限', icon: 'none' });
            }
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
.orb-3 { width: 35vw; height: 35vw; background: radial-gradient(circle, rgba($success,0.15) 0%, transparent 60%); top: 30%; left: 40%; animation-delay: -10s; }
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
.status-badge.standby { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #cbd5e1; .dot { background: $success; box-shadow: 0 0 8px $success;} }
.highlight-text { color: $success; font-weight: 700; font-size: 15px; }
.ml-4 { margin-left: 4px; }
.dot { width: 6px; height: 6px; border-radius: 50%; }

/* 工作区主体 */
.workspace-body { flex: 1; display: flex; gap: 32px; padding: 32px 40px; height: calc(100vh - 70px); box-sizing: border-box; max-width: 1400px; margin: 0 auto; width: 100%; }

/* 公用组件 */
.ultra-glass-card {
  background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
  backdrop-filter: blur(32px); border: 1px solid rgba(255,255,255,0.06);
  border-top: 1px solid rgba(255,255,255,0.12); border-left: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px; box-shadow: 0 16px 40px -10px rgba(0,0,0,0.5); overflow: hidden; position: relative;
}
.hover-lift { transition: all 0.3s ease; cursor: pointer; }
.hover-lift:hover { transform: translateY(-4px); box-shadow: 0 20px 48px -10px rgba(0,0,0,0.6); }

.section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
.header-icon-box { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 1px solid; }
.header-icon-box.theme-primary { background: rgba($primary, 0.15); border-color: rgba($primary, 0.3); }
.header-icon-box.theme-secondary { background: rgba($secondary, 0.15); border-color: rgba($secondary, 0.3); }
.section-title { font-size: 18px; font-weight: 600; color: #fff; }

/* ==================== 左侧：面额选择舱 ==================== */
.left-selection-panel { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.selection-scroll { height: 100%; }
.selection-content-inner { padding-right: 16px; padding-bottom: 40px; }

/* 充值套餐网格 */
.packages-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.package-card { padding: 32px 24px; text-align: center; border: 2px solid transparent; background: rgba(255,255,255,0.02); }
.package-card:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); }
.package-card.active { border-color: $primary; background: linear-gradient(135deg, rgba($primary, 0.1), rgba($secondary, 0.05)); }
.package-glow { position: absolute; inset: 0; background: radial-gradient(circle at top left, rgba($primary, 0.3), transparent 60%); z-index: 0; pointer-events: none; }

.discount-badge { position: absolute; top: 0; right: 0; background: linear-gradient(135deg, $warning, #d97706); color: #fff; font-size: 12px; font-weight: 600; padding: 4px 16px; border-bottom-left-radius: 16px; z-index: 2; box-shadow: -2px 2px 10px rgba($warning, 0.3); }

.package-content { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 16px; align-items: center; }
.points-display { display: flex; align-items: baseline; gap: 4px; }
.p-val { font-size: 36px; font-weight: 800; color: #fff; letter-spacing: 1px; }
.p-unit { font-size: 14px; color: $text-muted; font-weight: 500; }
.price-display { background: rgba(0,0,0,0.3); padding: 8px 24px; border-radius: 20px; display: flex; align-items: baseline; gap: 2px; border: 1px solid rgba(255,255,255,0.05); }
.package-card.active .price-display { background: rgba($primary, 0.2); border-color: rgba($primary, 0.4); }
.pr-sym { font-size: 14px; color: $primary-light; }
.pr-val { font-size: 20px; font-weight: 700; color: $primary-light; }

/* 自定义金额 */
.custom-input-card { padding: 24px; border: 2px solid transparent; background: rgba(255,255,255,0.02); transition: 0.3s; }
.custom-input-card.active-border { border-color: $secondary; background: linear-gradient(135deg, rgba($secondary, 0.1), transparent); }
.input-wrapper { display: flex; align-items: center; gap: 16px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); padding: 16px 24px; border-radius: 16px; transition: 0.3s; }
.input-wrapper:focus-within { border-color: $secondary; box-shadow: inset 0 0 15px rgba($secondary, 0.1); }
.input-symbol { font-size: 24px; font-weight: 700; color: $secondary-light; }
.custom-input { flex: 1; height: 30px; font-size: 20px; color: #fff; font-weight: 600; outline: none; border: none; background: transparent; }
.input-placeholder { color: rgba(255,255,255,0.2); font-weight: 400; font-size: 15px; }

.conversion-preview { margin-top: 20px; display: flex; align-items: center; justify-content: center; gap: 12px; background: rgba($success, 0.1); padding: 12px; border-radius: 12px; border: 1px dashed rgba($success, 0.3); }
.c-label { font-size: 14px; color: $text-secondary; }
.c-result { display: flex; align-items: baseline; gap: 4px; }
.c-icon { font-size: 16px; }
.c-points { font-size: 24px; font-weight: 800; color: $success; text-shadow: 0 0 10px rgba($success, 0.4); }
.c-unit { font-size: 13px; color: $success; opacity: 0.8; }

/* 空状态样式 */
.empty-state.mini { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 0; opacity: 0.7; }
.empty-state.mini .empty-icon { font-size: 40px; margin-bottom: 12px; }
.empty-state.mini .empty-text { font-size: 14px; color: $text-muted; }

/* ==================== 右侧：收银与权益舱 ==================== */
.right-checkout-panel { width: 420px; flex-shrink: 0; }
.h-full { height: 100%; display: flex; flex-direction: column; }

/* 新增的内部 Flex 控制器 */
.checkout-container { display: flex; flex-direction: column; height: 100%; }

/* 上半部分可滚动 */
.checkout-scroll { flex: 1; height: 0; } 
.checkout-scroll-content { padding: 32px 32px 24px 32px; }

.panel-sm-title { font-size: 15px; font-weight: 600; color: #fff; display: block; margin-bottom: 20px; }

/* 支付方式 */
.payment-list { display: flex; flex-direction: column; gap: 12px; }
.payment-item { display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; position: relative; }
.payment-item:hover { background: rgba(255,255,255,0.06); }
.payment-item.active { background: rgba($primary, 0.1); border-color: rgba($primary, 0.4); }
.p-icon-box { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 24px; background: rgba(255,255,255,0.1); }
.wechat { color: #10b981; } .alipay { color: #0ea5e9; } .bank { color: #f59e0b; }
.p-name { font-size: 15px; font-weight: 500; color: #e2e8f0; }
.p-check { position: absolute; right: 20px; width: 22px; height: 22px; border-radius: 50%; background: $primary; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; box-shadow: 0 0 10px rgba($primary, 0.5); }

.divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); }

/* 权益展示 */
.benefits-section { flex: 1; }
.benefits-list { display: flex; flex-direction: column; gap: 16px; }
.benefit-item { display: flex; align-items: flex-start; gap: 16px; }
.b-icon-wrap { width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.b-text { display: flex; flex-direction: column; gap: 4px; padding-top: 2px; }
.b-title { font-size: 14px; font-weight: 600; color: #fff; }
.b-desc { font-size: 12px; color: $text-muted; line-height: 1.4; }

/* 下半部分强制固定吸底 */
.checkout-footer-fixed { 
  padding: 24px 32px 32px 32px; 
  border-top: 1px solid rgba(255,255,255,0.08); 
  background: rgba(3, 3, 8, 0.6); 
  backdrop-filter: blur(10px);
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  flex-shrink: 0; 
}
.total-summary { width: 100%; display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; }
.summary-label { font-size: 15px; color: #cbd5e1; font-weight: 500; }
.summary-price { display: flex; align-items: baseline; gap: 4px; }
.s-sym { font-size: 18px; color: $primary-light; font-weight: 600; }
.s-val { font-size: 36px; font-weight: 800; color: #fff; line-height: 1; }

.secure-hint { font-size: 12px; color: $text-muted; margin-top: 16px; opacity: 0.8; }

/* ==================== 统一按钮组件 ==================== */
.liquid-btn {
  position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, $primary, $secondary); color: #fff; border-radius: 16px;
  font-size: 16px; font-weight: 600; cursor: pointer; padding: 0 24px; height: 56px; border: none;
  box-shadow: 0 8px 24px rgba($primary, 0.4), inset 0 1px 1px rgba(255,255,255,0.3); transition: all 0.3s;
}
.liquid-btn:hover { box-shadow: 0 12px 32px rgba($primary, 0.6); transform: translateY(-2px); }
.liquid-btn.disabled { opacity: 0.5; filter: grayscale(80%); cursor: not-allowed; box-shadow: none; pointer-events: none; }
.liquid-btn.fill-width { width: 100%; box-sizing: border-box; }
.btn-content { display: flex; align-items: center; gap: 8px; position: relative; z-index: 2; letter-spacing: 1px; }

.shimmer-effect { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); transform: skewX(-20deg); animation: shimmerBtn 3s infinite cubic-bezier(0.4, 0, 0.2, 1); }
@keyframes shimmerBtn { 100% { left: 200%; } }

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
.mt-40 { margin-top: 40px; } .mt-24 { margin-top: 24px; } .mt-16 { margin-top: 16px; } .mb-24 { margin-bottom: 24px; }
.safe-area-bottom { height: 40px; }
</style>