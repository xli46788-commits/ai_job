<template>
  <view class="pay-container">
    <view class="pay-card">
      <view class="wx-header">
        <text class="wx-icon">🟢</text>
        <text class="wx-title">微信扫码支付</text>
      </view>
      <view class="divider"></view>
      <view class="amount-box">
        <text class="currency">¥</text>
        <text class="price">{{ price }}</text>
      </view>
      <view class="qr-wrapper">
        <image class="qr-code" src="/static/images/wx_qr.png" mode="aspectFit"></image>
      </view>
      <view class="pay-tips">
        <view class="scan-icon">🔍</view>
        <text>请使用手机微信“扫一扫”<br/>扫描二维码完成安全支付</text>
      </view>
      <button class="success-done-btn" @click="completePayment">我已支付成功</button>
    </view>
  </view>
</template>

<script>
export default {
  data() { return { price: '0.00', points: 0 } },
  onLoad(options) {
    if (options.price) {
      this.price = Number(options.price).toFixed(2);
      this.points = options.points;
    }
  },
  methods: {
    completePayment() {
      uni.showToast({ title: '安全清算完成，资产已到账！', icon: 'success' });
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/student/profile' }); // 跳回个人中心刷新
      }, 1200);
    }
  }
}
</script>

<style scoped>
.pay-container { min-height: 100vh; background-color: #f4f6f9; display: flex; align-items: center; justify-content: center; padding: 40rpx; box-sizing: border-box; }
.pay-card { width: 100%; max-width: 600rpx; background: #ffffff; border-radius: 24rpx; box-shadow: 0 10rpx 40rpx rgba(0,0,0,0.06); padding: 40rpx; box-sizing: border-box; text-align: center; }
.wx-header { display: flex; align-items: center; justify-content: center; gap: 12rpx; margin-bottom: 30rpx; }
.wx-icon { font-size: 36rpx; }
.wx-title { font-size: 32rpx; font-weight: bold; color: #1cb126; }
.divider { height: 2rpx; background-color: #f1f5f9; margin-bottom: 40rpx; }
.amount-box { margin-bottom: 40rpx; }
.currency { font-size: 36rpx; font-weight: bold; color: #1e293b; margin-right: 6rpx; }
.price { font-size: 56rpx; font-weight: 800; color: #1e293b; }
.qr-wrapper { width: 340rpx; height: 340rpx; margin: 0 auto 40rpx; background-color: #fafafa; border: 2rpx solid #e2e8f0; border-radius: 16rpx; padding: 20rpx; box-sizing: border-box; display: flex; align-items: center; justify-content: center; }
.qr-code { width: 100%; height: 100%; }
.pay-tips { display: flex; align-items: center; justify-content: center; gap: 16rpx; font-size: 24rpx; color: #64748b; line-height: 1.5; margin-bottom: 50rpx; text-align: left; }
.scan-icon { font-size: 40rpx; }
.success-done-btn { background-color: #1cb126; color: #ffffff; border-radius: 50rpx; font-size: 28rpx; font-weight: bold; height: 84rpx; line-height: 84rpx; width: 100%; border: none; box-shadow: 0 6rpx 20rpx rgba(28,177,38,0.3); }
</style>