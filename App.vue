<script>
export default {
  onLaunch: function() {
    console.log('App Launch');
    // 🚀 核心修改：检查真实的 JWT Token 和用户角色
    const token = uni.getStorageSync('token');
    const userRole = uni.getStorageSync('user_role');
    
    // 如果已登录，根据角色直接跳转到对应大盘
    if (token && userRole) {
      if (userRole === 'student') {
        uni.reLaunch({ url: '/pages/student/home' });
      } else if (userRole === 'company') {
        uni.reLaunch({ url: '/pages/company/home' });
      } else if (userRole === 'admin') {
        uni.reLaunch({ url: '/pages/admin/home' });
      }
    }
  },
  onShow: function() {
    console.log('App Show');
  },
  onHide: function() {
    console.log('App Hide');
  }
}
</script>

<style lang="scss">
/* 每个页面公共css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 🔑 关键修改：PC 端适配 */
html, body {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  
  /* 深色主题（与你项目一致） */
  background-color: #0a0f1a;
  color: #e0e0e0;
  
  /* PC 端字体优化 */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 15px;
  line-height: 1.6;
}

/* 移除 uni-app 默认的缩放和宽度限制 */
#app,
.uni-page,
.uni-page-wrapper {
  width: 100% !important;
  max-width: none !important;
  transform: none !important;
}

/* PC 端主容器：居中 + 最大宽度 */
.page-container,
.uni-page-body,
.content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
}

/* 按钮优化 */
button {
  font-family: inherit;
  font-size: 15px;
  cursor: pointer;
  border: none;
  outline: none;
  
  /* PC 端按钮高度优化 */
  min-height: 44px;
  padding: 12px 24px;
}

/* 表单元素优化 */
input, textarea {
  font-family: inherit;
  font-size: 15px;
  outline: none;
  border: 1px solid rgba(100, 255, 218, 0.2);
  background: rgba(30, 35, 50, 0.6);
  color: #fff;
  padding: 12px 16px;
  border-radius: 6px;
  
  /* PC 端输入框高度 */
  min-height: 44px;
}

input::placeholder,
textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

/* 链接优化 */
a {
  color: #64ffda;
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
}

/* 自定义滚动条（深色主题） */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(100, 255, 218, 0.3);
  border-radius: 4px;
  
  &:hover {
    background: rgba(100, 255, 218, 0.5);
  }
}

/* 通用工具类 */
.text-primary {
  color: #64ffda;
}

.text-secondary {
  color: #8892b0;
}

.text-muted {
  color: rgba(255, 255, 255, 0.5);
}

.bg-dark {
  background-color: #0a0f1a;
}

.bg-card {
  background: rgba(20, 25, 40, 0.7);
  border: 1px solid rgba(100, 255, 218, 0.1);
  border-radius: 8px;
}

/* 响应式适配（可选） */
@media (max-width: 768px) {
  .page-container {
    padding: 0 16px;
  }
  
  button, input {
    min-height: 40px;
  }
}
</style>