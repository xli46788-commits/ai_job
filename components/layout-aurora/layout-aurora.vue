<template>
  <view class="aurora-layout">
    <!-- 底层发光球体 -->
    <view class="aurora-orb orb-1"></view>
    <view class="aurora-orb orb-2"></view>
    <!-- 网格蒙版 -->
    <view class="grid-overlay"></view>
    <!-- 暗角蒙版 -->
    <view class="vignette-overlay"></view>

    <!-- 页面内容插槽，自带进场动画 -->
    <view class="main-content fade-in-up delay-1 both page-container">
      <slot></slot>
    </view>
  </view>
</template>

<script setup>
// 全局布局容器，暂无复杂逻辑，主要用于统一样式
</script>

<style lang="scss" scoped>
@import '@/uni.scss';
.aurora-layout {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  background-color: #020205;
  overflow: hidden;

  /* 网格覆盖层 */
  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 2;
    pointer-events: none;
  }

  /* 模糊发光球体 */
  .aurora-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.4;
    z-index: 1;
    pointer-events: none;
  }

  .orb-1 {
    width: 600px; /* PC端适当放大 */
    height: 600px;
    background: radial-gradient(circle, rgba($primary, 0.5) 0%, transparent 70%);
    top: -150px;
    left: -200px;
  }

  .orb-2 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba($secondary, 0.4) 0%, transparent 70%);
    bottom: -100px;
    right: -150px;
  }

  /* 边缘暗角 */
  .vignette-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent 30%, #020205 100%);
    z-index: 3;
    pointer-events: none;
  }

  /* 主体内容区 */
  .main-content {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 100%;
    padding-top: 40px; /* 顶部留白 */
    padding-bottom: 40px;
  }
}
</style>