// utils/request.js

// 本地开发时，请确保 Django 后端运行在此地址。
// 如果您是用手机真机预览或模拟器，请将 127.0.0.1 替换为您电脑的局域网 IP (例如 192.168.x.x)
const BASE_URL = 'http://127.0.0.1:8000/api/v1';

export const request = (options) => {
  return new Promise((resolve, reject) => {
    // 1. 获取本地存储的 token
    const token = uni.getStorageSync('token');
    
    // 2. 组装请求头
    const headers = {
      'Content-Type': 'application/json',
      ...options.header
    };
    
    // 如果存在 token，则按照 DRF SimpleJWT 的标准格式注入
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // 3. 发起请求
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: headers,
      timeout: 10000, // 10秒超时
      success: (res) => {
        const { statusCode, data } = res;
        
        // HTTP 状态码 2xx 表示成功
        if (statusCode >= 200 && statusCode < 300) {
          resolve(data);
        } 
        // HTTP 状态码 401 表示未授权或 Token 过期
        else if (statusCode === 401) {
          uni.showToast({ title: '登录已过期，请重新登录', icon: 'none', duration: 2000 });
          uni.removeStorageSync('token');
          uni.removeStorageSync('user_role');
          uni.removeStorageSync('user_info');
          
          // 延迟跳转，让 Toast 显示完毕
          setTimeout(() => {
            uni.reLaunch({ url: '/pages/auth/login' });
          }, 1500);
          reject(res);
        } 
        // 其他后端抛出的业务/校验错误 (对接 custom_exception_handler)
        else {
          let errorMsg = '请求异常';
          
          if (data && typeof data === 'object') {
            // 优先读取我们自定义的 data.msg，如果没有则兼容 DRF 默认的 detail 或取第一个字段的错误
            errorMsg = data.msg || data.detail || (Object.values(data)[0] ? Object.values(data)[0][0] : '操作失败');
          }
          
          // 使用 duration: 3000 让错误提示停留稍微久一点，方便看清
          uni.showToast({ title: errorMsg, icon: 'none', duration: 3000 });
          reject(res);
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络连接失败，请检查服务', icon: 'none' });
        reject(err);
      }
    });
  });
};