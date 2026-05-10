<template>
  <button class="liquid-btn" :class="[size, type]" @click="handleClick" :disabled="disabled">
    <text class="btn-text"><slot></slot></text>
    <view class="shimmer" v-if="!disabled"></view>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'default' // 'small', 'default', 'large'
  },
  type: {
    type: String,
    default: 'primary' // 'primary', 'secondary', 'danger'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

const handleClick = (e) => {
  if (!props.disabled) {
    emit('click', e);
  }
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';
.liquid-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 100px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  box-sizing: border-box;
  
  /* 去除 uni-app button 默认边框 */
  &::after {
    display: none;
  }

  &:hover:not(:disabled) {
    transform: scale(1.02);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-text {
    color: #ffffff;
    font-weight: 600;
    position: relative;
    z-index: 2;
    letter-spacing: 1px;
  }

  /* 扫光动效 */
  .shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
    transform: skewX(-25deg);
    animation: shimmer-sweep 3s infinite;
    z-index: 1;
    pointer-events: none;
  }
}

/* 尺寸变体 */
.small {
  height: 32px;
  padding: 0 16px;
  .btn-text { font-size: 13px; }
}
.default {
  height: 44px;
  padding: 0 32px;
  .btn-text { font-size: 16px; }
}
.large {
  width: 100%; // 通常大按钮占满整行
  height: 54px;
  .btn-text { font-size: 18px; }
}

/* 颜色变体 */
.primary {
  background: linear-gradient(135deg, $primary, $secondary);
  box-shadow: 0 8px 24px rgba($primary, 0.4);
}
.secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}
.danger {
  background: linear-gradient(135deg, $danger, #b91c1c);
  box-shadow: 0 8px 24px rgba($danger, 0.4);
}

@keyframes shimmer-sweep {
  0% { left: -100%; }
  20% { left: 200%; }
  100% { left: 200%; }
}
</style>