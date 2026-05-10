// main.js
import App from './App'
import { API } from './utils/api.js'

// ================= 【全局路由守卫配置】 =================
function setupRouterInterceptors() {
  // 定义免登录白名单页面 (无论是否登录都可以访问)
  const whiteList = ['/pages/auth/login']; 

  // 需要拦截的路由跳转方法
  const routingMethods = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'];

  routingMethods.forEach(method => {
    uni.addInterceptor(method, {
      invoke(e) {
        // 获取目标路径 (去除可能携带的参数如 ?id=1)
        const url = e.url.split('?')[0]; 
        
        const token = uni.getStorageSync('token');
        const role = uni.getStorageSync('user_role'); // 预期值: 'student', 'company', 'admin'

        // 1. 未登录拦截：如果不在白名单内，强制去登录页
        if (!token && !whiteList.includes(url)) {
          uni.showToast({ title: '请先登录', icon: 'none' });
          uni.reLaunch({ url: '/pages/auth/login' });
          return false; // 中断跳转
        }

        // 2. 角色越权拦截：已登录状态下的页面权限校验
        if (token && !whiteList.includes(url)) {
          // 管理员专属页面拦截
          if (url.includes('/pages/admin/') && role !== 'admin') {
            uni.showToast({ title: '无权访问总控大盘', icon: 'error' });
            return false;
          }
          // 企业专属页面拦截 (允许 admin 视察)
          if (url.includes('/pages/company/') && role !== 'company' && role !== 'admin') {
            uni.showToast({ title: '仅限企业端访问', icon: 'none' });
            return false;
          }
          // 学生专属页面拦截 (防止企业号误入学生求职页面)
          if (url.includes('/pages/student/') && role !== 'student' && role !== 'admin') {
            uni.showToast({ title: '仅限学生端访问', icon: 'none' });
            return false;
          }
        }
        
        return true; // 允许跳转
      }
    });
  });
}

// 执行路由拦截器注册
setupRouterInterceptors();


// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'

// Vue2 挂载全局 API
Vue.prototype.$api = API;

const app = new Vue({
  ...App
})
app.$mount()
// #endif


// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  
  // Vue3 挂载全局 API
  // 之后在页面中可通过 const { proxy } = getCurrentInstance(); proxy.$api.login() 调用
  app.config.globalProperties.$api = API;
  
  return {
    app
  }
}
// #endif