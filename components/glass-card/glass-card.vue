<template>
  <view class="glass-card hover-lift" :style="customStyle">
    <slot></slot>
  </view>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  customStyle: {
    type: [String, Object],
    default: ''
  }
});
</script>

<style lang="scss" scoped>
@import '@/uni.scss';
.glass-card {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px); // 兼容 Safari
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px; // PC 端多用 px
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  color: #ffffff;
}

.hover-lift {
  cursor: pointer;
  
  // 结合您的 PC 适配，这里加上真正的 :hover 和 :active
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    border-color: rgba($primary, 0.4); // 悬浮时边框透出科技蓝
  }
  
  &:active {
    transform: translateY(-2px);
  }
}
</style>