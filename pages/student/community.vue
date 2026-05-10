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
          <view class="icon-btn" @click="goBack" title="返回主页">
            <text class="arrow-left">←</text>
          </view>
          <view class="title-box">
            <text class="title">职场情报局</text>
            <text class="subtitle">AI Guide Community</text>
          </view>
        </view>
        <view class="header-right">
          <view class="search-bar">
            <text class="search-icon">🔍</text>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="搜索面经、内推代码..." 
              class="search-input" 
              placeholder-class="input-placeholder"
            />
            <text class="clear-icon" v-if="searchQuery" @click="searchQuery = ''">×</text>
          </view>
          <view class="liquid-btn micro ml-16" @click="openPublishModal">
            <text class="btn-txt">✍️ 发布动态</text>
          </view>
        </view>
      </view>
      
      <view class="workspace-body">
        
        <view class="left-radar-panel fade-in-up delay-1">
          <scroll-view class="left-scroll custom-scrollbar" scroll-y>
            <view class="left-content-inner">
              
              <view class="channel-nav">
                <view 
                  v-for="(channel, index) in channels" 
                  :key="index"
                  class="channel-item"
                  :class="{ active: activeChannel === channel.id }"
                  @click="activeChannel = channel.id"
                >
                  <text class="c-icon">{{ channel.icon }}</text>
                  <text class="c-name">{{ channel.name }}</text>
                  <view class="c-indicator" v-if="activeChannel === channel.id"></view>
                </view>
              </view>

              <view class="ultra-glass-card referral-card hover-lift mt-24">
                <view class="referral-glow"></view>
                <view class="rc-header">
                  <view class="title-box">
                    <text class="icon pulse-icon">🚀</text>
                    <text class="r-title">内推直达专区</text>
                  </view>
                  <text class="r-badge">极速响应</text>
                </view>
                <view class="rc-body">
                  <view class="company-tag" v-for="(company, index) in hotReferrals" :key="index">
                    <text class="ct-name">{{ company.name }}</text>
                    <text class="ct-count">{{ company.count }} 在招</text>
                  </view>
                </view>
                <view class="rc-footer" @click="filterReferrals">
                  <text>查看全部内推岗位</text>
                  <text class="arr">→</text>
                </view>
              </view>

              <view class="ultra-glass-card trending-card mt-24">
                <view class="tc-header">
                  <text class="t-icon">🔥</text>
                  <text class="t-title">热门话题榜</text>
                </view>
                <view class="tc-list">
                  <view 
                    v-for="(topic, index) in trendingTopics" 
                    :key="index"
                    class="topic-item hover-lift"
                    @click="searchQuery = topic.name"
                  >
                    <text class="rank-num" :class="`rank-${index + 1}`">{{ index + 1 }}</text>
                    <view class="topic-info">
                      <text class="topic-name">#{{ topic.name }}#</text>
                      <text class="topic-heat">{{ topic.heat }} 讨论</text>
                    </view>
                    <text class="trend-icon" v-if="index < 2">↗</text>
                  </view>
                </view>
              </view>

              <view class="safe-area-bottom"></view>
            </view>
          </scroll-view>
        </view>

        <view class="right-feed-panel fade-in-left delay-2">
          
          <view class="publish-trigger-card">
            <view class="user-avatar-mini">👤</view>
            <view class="trigger-input" @click="openPublishModal">
              <text class="trigger-text">分享你的面经、求职进展或内推机会...</text>
              <view class="trigger-actions">
                <text class="ta-icon" title="插入图片">🖼️</text>
                <text class="ta-icon" title="发起投票">📊</text>
                <text class="ta-icon" title="添加话题">#</text>
              </view>
            </view>
          </view>

          <scroll-view class="feed-scroll custom-scrollbar" scroll-y>
            <view class="feed-list">
              <view 
                v-for="(post, index) in filteredPosts" 
                :key="post.id"
                :class="['ultra-glass-card', 'post-card', 'fade-in-up']"
                :style="`animation-delay: ${0.1 + (index % 5) * 0.1}s;`"
              >
                <view class="post-header">
                  <view class="author-avatar">{{ post.avatar }}</view>
                  <view class="author-info">
                    <view class="name-line">
                      <text class="author-name">{{ post.author }}</text>
                      <view :class="['author-badge', post.badgeType]" v-if="post.badge">
                        {{ post.badge }}
                      </view>
                    </view>
                    <text class="post-time">{{ post.time }}</text>
                  </view>
                  <view class="post-options">···</view>
                </view>

                <view class="post-body">
                  <text class="post-title" v-if="post.title">{{ post.title }}</text>
                  <text class="post-content">{{ post.content }}</text>
                  <view class="post-tags" v-if="post.tags && post.tags.length > 0">
                    <text v-for="(tag, tIdx) in post.tags" :key="tIdx" class="p-tag" @click="searchQuery = tag">#{{ tag }}</text>
                  </view>
                  <view class="post-images" v-if="post.hasImage">
                    <view class="mock-image">
                      <text class="img-icon">📊 配图展示.png</text>
                    </view>
                  </view>
                </view>

                <view class="post-footer">
                  <view class="interaction-group">
                    <view :class="['interact-btn', 'hover-color', { 'liked': post.isLiked }]" @click="toggleLike(post)">
                      <text class="i-icon">{{ post.isLiked ? '❤️' : '🤍' }}</text>
                      <text class="i-count">{{ post.likes }}</text>
                    </view>
                    <view class="interact-btn hover-color" @click="viewPost(post)">
                      <text class="i-icon">💬</text>
                      <text class="i-count">{{ post.comments }}</text>
                    </view>
                    <view class="interact-btn hover-color" @click="sharePost(post)">
                      <text class="i-icon">🔗</text>
                      <text class="i-count">{{ post.shares }}</text>
                    </view>
                  </view>
                  <view class="referral-action" v-if="post.channelId === 'referral'">
                    <view class="liquid-btn micro" @click="applyReferral(post)">
                      <text class="btn-txt">投递内推</text>
                    </view>
                  </view>
                </view>

              </view>
              
              <view class="feed-loading" v-if="filteredPosts.length > 0 && isLoading">
                <view class="spinner"></view>
                <text>正在检索更多情报...</text>
              </view>
              
              <view class="feed-empty-state fade-in-up" v-if="filteredPosts.length === 0">
                <text class="empty-icon">📭</text>
                <text class="empty-title">暂无相关情报</text>
                <text class="empty-desc">换个搜索词，或者成为第一个发布的人吧！</text>
              </view>
            </view>
          </scroll-view>
        </view>
        
      </view>
    </view>

    <view class="modal-overlay" v-if="showPublishModal" @click="closePublishModal">
      <view class="ultra-glass-card publish-modal-card fade-in-up" @click.stop>
        
        <view class="modal-header">
          <text class="m-title">✨ 发现新情报</text>
          <text class="m-close" @click="closePublishModal">×</text>
        </view>
        
        <scroll-view class="modal-body custom-scrollbar" scroll-y>
          <view class="form-group">
            <text class="form-label">发布至板块</text>
            <view class="channel-selector">
              <view 
                v-for="ch in channels.slice(1)" 
                :key="ch.id"
                :class="['ch-pill', { active: newPost.channelId === ch.id }]"
                @click="newPost.channelId = ch.id"
              >
                {{ ch.icon }} {{ ch.name }}
              </view>
            </view>
          </view>
          
          <view class="form-group">
            <text class="form-label">标题 (选填)</text>
            <input class="crystal-input" v-model="newPost.title" placeholder="加个响亮的标题，更容易被看见" placeholder-class="input-placeholder"/>
          </view>

          <view class="form-group">
            <text class="form-label">正文内容 <text class="required">*</text></text>
            <view class="textarea-wrapper">
              <textarea 
                class="crystal-textarea" 
                v-model="newPost.content" 
                placeholder="分享你的求职经验、内推信息或职场见闻..."
                placeholder-class="input-placeholder"
                maxlength="1000"
              />
              <text class="char-counter">{{ newPost.content.length }}/1000</text>
            </view>
          </view>
        </scroll-view>

        <view class="modal-footer">
          <view class="ghost-btn outline" @click="closePublishModal">
            <text>取消</text>
          </view>
          <view :class="['liquid-btn', { disabled: !newPost.content.trim() }]" @click="submitPost">
            <text class="btn-txt">🚀 立即发布</text>
            <view class="shimmer-effect" v-if="newPost.content.trim()"></view>
          </view>
        </view>

      </view>
    </view>
  </view>
</template>

<script>
// 🚀 引入 API
import { API } from '../../utils/api.js';

export default {
  data() {
    return {
      activeChannel: 'all',
      searchQuery: '', 
      showPublishModal: false, 
      isLoading: false,
      newPost: {
        channelId: 'interview', 
        title: '',
        content: ''
      },
      channels: [
        { id: 'all', name: '全部动态', icon: '🌍' },
        { id: 'interview', name: '面经分享', icon: '📝' },
        { id: 'referral', name: '企业内推', icon: '🚀' },
        { id: 'salary', name: '薪资爆料', icon: '💰' },
        { id: 'vent', name: '职场吐槽', icon: '☕' }
      ],
      hotReferrals: [
        { name: '字节跳动', count: 125 },
        { name: '腾讯 WXG', count: 42 },
        { name: '美团到店', count: 88 }
      ],
      trendingTopics: [
        { name: '2026秋招提前批', heat: '3.2w' },
        { name: '大厂实习转正率', heat: '2.8w' },
        { name: '简历如何写STAR法则', heat: '1.5w' },
        { name: 'AI岗薪资开挂了吗', heat: '9800' },
        { name: '反向背调公司名单', heat: '7200' }
      ],
      posts: [] // 初始化为空，准备从后端接收
    }
  },
  computed: {
    filteredPosts() {
      let result = this.posts;
      if (this.activeChannel !== 'all') {
        result = result.filter(post => post.channelId === this.activeChannel);
      }
      if (this.searchQuery.trim() !== '') {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(post => {
          const matchTitle = post.title && post.title.toLowerCase().includes(query);
          const matchContent = post.content && post.content.toLowerCase().includes(query);
          const matchTags = post.tags && post.tags.some(tag => tag.toLowerCase().includes(query));
          return matchTitle || matchContent || matchTags;
        });
      }
      return result;
    }
  },
  mounted() {
    // 页面加载时触发
    this.fetchPosts();
  },
  methods: {
    // 🚀 核心柔性对接方法：尝试请求 API，失败则加载兜底数据
    async fetchPosts() {
      this.isLoading = true;
      try {
        const res = await API.getCommunityPosts();
        if (res && res.data && res.data.length > 0) {
          this.posts = res.data;
        } else {
          this.loadMockData(); // 后端没数据时走兜底
        }
      } catch (error) {
        console.log("社区后端尚未实装，已切入静态展示模式");
        this.loadMockData(); // 接口报错走兜底
      } finally {
        this.isLoading = false;
      }
    },

    toggleLike(post) {
      post.isLiked = !post.isLiked;
      post.isLiked ? post.likes++ : post.likes--;
    },
    openPublishModal() {
      this.showPublishModal = true;
    },
    closePublishModal() {
      this.showPublishModal = false;
      this.newPost = { channelId: 'interview', title: '', content: '' };
    },
    
    // 🚀 发布帖子：尝试请求 API，失败则直接本地更新 UI
    async submitPost() {
      if (!this.newPost.content.trim()) return;
      uni.showLoading({ title: '情报发送中...', mask: true });
      
      const createdPost = {
        id: Date.now(),
        channelId: this.newPost.channelId,
        avatar: '👤',
        author: uni.getStorageSync('user_info')?.username || '学生用户',
        badge: '职场萌新',
        badgeType: 'student',
        time: '刚刚',
        title: this.newPost.title.trim(),
        content: this.newPost.content.trim(),
        tags: [], 
        hasImage: false,
        isReferral: this.newPost.channelId === 'referral',
        likes: 0, comments: 0, shares: 0, isLiked: false
      };

      try {
        // 如果我们未来写好了后端，就在这里把新帖子数据 POST 过去
        // await API.createCommunityPost(createdPost);
        
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        this.posts.unshift(createdPost);
        this.activeChannel = this.newPost.channelId; 
        this.searchQuery = ''; 
        
        uni.hideLoading();
        this.closePublishModal();
        uni.showToast({ title: '发布成功', icon: 'success' });
      } catch (error) {
        uni.hideLoading();
        uni.showToast({ title: '发布失败，请检查网络', icon: 'none' });
      }
    },
    
    viewPost(post) { uni.showToast({ title: `查看帖子详情`, icon: 'none' }); },
    sharePost(post) { uni.showToast({ title: '分享链接已复制', icon: 'success' }); },
    applyReferral(post) {
      uni.showModal({
        title: '内推投递',
        content: `确定使用“数字分身”简历向 ${post.author} 发起内推申请吗？`,
        confirmColor: '#3b82f6',
        success: (res) => {
          if (res.confirm) uni.showToast({ title: '内推投递成功！', icon: 'success' });
        }
      });
    },
    filterReferrals() { 
      this.activeChannel = 'referral';
      this.searchQuery = '';
    },
    goBack() { uni.navigateBack(); },

    // 兜底数据
    loadMockData() {
      this.posts = [
        {
          id: 1, channelId: 'referral',
          avatar: '👨‍💻', author: '字节跳动 前端Leader', badge: '认证内推人', badgeType: 'company', time: '10分钟前',
          title: '【字节跳动】2026届秋招提前批内推！直通笔试！',
          content: '团队急招前端/Node.js方向实习生和校招生。核心业务部门，不卷，技术氛围极好。使用我的内推码投递，进度全程可查，直接安排机试环节。简历发我直接内推！',
          tags: ['字节跳动', '前端开发', '内推码'], hasImage: false, isReferral: true,
          likes: 342, comments: 89, shares: 156, isLiked: false
        },
        {
          id: 2, channelId: 'interview',
          avatar: '👩‍🎓', author: 'Offer收割机', badge: '求职达人', badgeType: 'student', time: '半小时前',
          title: '腾讯 WXG 微信支付 前端一二面面经 (已OC)',
          content: '刚收到意向书来还愿！整体难度中等偏上，一面注重基础（手写Promise、Event Loop机制），二面注重项目深度和前端工程化。详细的面经我已经整理好啦，需要的同学自取~',
          tags: ['腾讯面经', '前端面试', '秋招'], hasImage: false, isReferral: false,
          likes: 856, comments: 210, shares: 430, isLiked: true
        },
        {
          id: 3, channelId: 'salary',
          avatar: '🧑‍💼', author: '打工人小王', badge: null, badgeType: '', time: '2小时前',
          title: '爆料！某新能源车企自动驾驶算法岗薪资',
          content: '坐标上海，985硕。今天刚开的奖，总包大概在 45w 左右（包含签字费和股票）。想问一下各位大佬这个包裹在今年算什么水平？能不能签？',
          tags: ['薪资爆料', '自动驾驶', '选Offer'], hasImage: true, isReferral: false,
          likes: 124, comments: 345, shares: 22, isLiked: false
        },
        {
          id: 4, channelId: 'vent',
          avatar: '🤡', author: '深夜emo选手', badge: null, badgeType: '', time: '5小时前',
          title: '受不了现在的组长了，想提桶跑路',
          content: '每天下班前准时开会，周报要求写到上厕所的时间。各位大佬，秋招刚结束我现在跑路还来得及参加春招吗？',
          tags: ['职场吐槽', '跑路', '春招'], hasImage: false, isReferral: false,
          likes: 542, comments: 128, shares: 12, isLiked: true
        }
      ];
    }
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
.orb-3 { width: 35vw; height: 35vw; background: radial-gradient(circle, rgba($accent,0.15) 0%, transparent 60%); top: 30%; left: 40%; animation-delay: -10s; }
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
.title-box { display: flex; flex-direction: column; }
.title { font-size: 18px; font-weight: 600; color: #fff; letter-spacing: 1px; }
.subtitle { font-size: 11px; color: $primary-light; letter-spacing: 0.5px; }

.header-right { display: flex; align-items: center; gap: 16px; }
.search-bar { display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 20px; width: 280px; transition: 0.3s; position: relative; }
.search-bar:focus-within { border-color: rgba($primary, 0.5); box-shadow: 0 0 15px rgba($primary, 0.1); width: 320px; }
.search-icon { font-size: 14px; opacity: 0.6; }
.search-input { flex: 1; border: none; background: transparent; outline: none; color: #fff; font-size: 14px; }
.input-placeholder { color: rgba(255,255,255,0.3); }
.clear-icon { font-size: 18px; color: $text-muted; cursor: pointer; width: 24px; text-align: center; }
.clear-icon:hover { color: #fff; }
.ml-16 { margin-left: 16px; }

/* 工作区主体：双舱结构 */
.workspace-body { flex: 1; display: flex; gap: 32px; padding: 24px 40px 0; height: calc(100vh - 70px); box-sizing: border-box; max-width: 1400px; margin: 0 auto; width: 100%; }

/* 公用组件 */
.ultra-glass-card {
  background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
  backdrop-filter: blur(32px); border: 1px solid rgba(255,255,255,0.06);
  border-top: 1px solid rgba(255,255,255,0.12); border-left: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px; box-shadow: 0 16px 40px -10px rgba(0,0,0,0.5); overflow: hidden; position: relative;
}
.hover-lift { transition: all 0.3s ease; cursor: pointer; }
.hover-lift:hover { transform: translateY(-4px); box-shadow: 0 20px 48px -10px rgba(0,0,0,0.6), 0 0 20px rgba(59,130,246,0.1); }

/* ==================== 左侧：雷达监测舱 ==================== */
.left-radar-panel { width: 340px; flex-shrink: 0; display: flex; flex-direction: column; }
.left-scroll { height: 100%; }
.left-content-inner { display: flex; flex-direction: column; padding-right: 16px; padding-bottom: 40px; }

/* 频道导航 */
.channel-nav { display: flex; flex-direction: column; gap: 8px; }
.channel-item { display: flex; align-items: center; gap: 16px; padding: 16px 20px; border-radius: 16px; cursor: pointer; transition: 0.3s; position: relative; }
.channel-item:hover { background: rgba(255,255,255,0.03); }
.channel-item.active { background: linear-gradient(90deg, rgba($primary, 0.15), transparent); }
.c-icon { font-size: 18px; width: 24px; text-align: center; }
.c-name { font-size: 15px; font-weight: 500; color: #cbd5e1; transition: 0.3s; }
.channel-item.active .c-name { color: #fff; font-weight: 600; }
.c-indicator { position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 4px; height: 24px; background: $primary; border-radius: 0 4px 4px 0; box-shadow: 0 0 10px $primary; }

/* 内推专区卡片 */
.referral-card { padding: 24px; border-color: rgba($warning, 0.3); background: linear-gradient(135deg, rgba($warning, 0.05), transparent); }
.referral-glow { position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: radial-gradient(circle, rgba($warning, 0.2), transparent 70%); border-radius: 50%; z-index: 0; pointer-events: none; }
.rc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; position: relative; z-index: 1; }
.rc-header .title-box { display: flex; align-items: center; gap: 8px; }
.pulse-icon { font-size: 20px; animation: pulse 2s infinite; filter: drop-shadow(0 0 8px $warning); }
.r-title { font-size: 16px; font-weight: 600; color: #fff; }
.r-badge { font-size: 11px; padding: 4px 8px; border-radius: 8px; background: rgba($warning, 0.15); color: $warning; border: 1px solid rgba($warning, 0.3); }
.rc-body { display: flex; flex-direction: column; gap: 12px; position: relative; z-index: 1; }
.company-tag { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; }
.ct-name { font-size: 14px; color: #e2e8f0; font-weight: 500; }
.ct-count { font-size: 12px; color: $warning; }
.rc-footer { margin-top: 16px; padding-top: 16px; border-top: 1px dashed rgba(255,255,255,0.1); display: flex; justify-content: center; align-items: center; gap: 6px; font-size: 13px; color: $text-muted; transition: 0.3s; position: relative; z-index: 1; cursor: pointer;}
.referral-card:hover .rc-footer { color: $warning; }
.referral-card:hover .rc-footer .arr { transform: translateX(4px); }

/* 热门话题卡片 */
.trending-card { padding: 24px; }
.tc-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 16px; }
.t-icon { font-size: 20px; }
.t-title { font-size: 16px; font-weight: 600; color: #fff; }
.tc-list { display: flex; flex-direction: column; gap: 16px; }
.topic-item { display: flex; align-items: center; gap: 16px; position: relative; padding: 8px 0; }
.topic-item:hover .topic-name { color: $primary-light; }
.rank-num { font-size: 16px; font-weight: 800; font-style: italic; width: 24px; text-align: center; color: rgba(255,255,255,0.2); }
.rank-1 { color: #ef4444; text-shadow: 0 0 10px rgba(#ef4444, 0.5); font-size: 18px; }
.rank-2 { color: #f59e0b; text-shadow: 0 0 10px rgba(#f59e0b, 0.5); font-size: 17px; }
.rank-3 { color: #3b82f6; text-shadow: 0 0 10px rgba(#3b82f6, 0.5); }
.topic-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.topic-name { font-size: 14px; font-weight: 500; color: #e2e8f0; transition: 0.3s; }
.topic-heat { font-size: 11px; color: $text-muted; }
.trend-icon { font-size: 14px; color: $danger; }


/* ==================== 右侧：情报信息流舱 ==================== */
.right-feed-panel { flex: 1; min-width: 0; display: flex; flex-direction: column; }

/* 发布触发器 */
.publish-trigger-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 16px 24px; display: flex; align-items: center; gap: 16px; margin-bottom: 24px; flex-shrink: 0; backdrop-filter: blur(10px); }
.user-avatar-mini { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, rgba($primary,0.3), rgba($secondary,0.3)); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 20px; }
.trigger-input { flex: 1; height: 48px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; cursor: pointer; transition: 0.3s; }
.trigger-input:hover { border-color: rgba($primary, 0.4); background: rgba(0,0,0,0.4); }
.trigger-text { font-size: 14px; color: rgba(255,255,255,0.3); }
.trigger-actions { display: flex; gap: 16px; }
.ta-icon { font-size: 16px; opacity: 0.6; transition: 0.2s; }
.ta-icon:hover { opacity: 1; transform: scale(1.1); }

/* 瀑布流 */
.feed-scroll { flex: 1; height: 0; }
.feed-list { display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px; }

/* 空状态 */
.feed-empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 0; opacity: 0.6; }
.empty-icon { font-size: 64px; filter: drop-shadow(0 0 20px rgba(255,255,255,0.1)); margin-bottom: 24px; }
.empty-title { font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 8px; }
.empty-desc { font-size: 14px; color: $text-muted; }

/* 帖子卡片 */
.post-card { padding: 24px 32px; display: flex; flex-direction: column; gap: 16px; }
.post-header { display: flex; align-items: center; gap: 16px; }
.author-avatar { width: 48px; height: 48px; border-radius: 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 24px; }
.author-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.name-line { display: flex; align-items: center; gap: 10px; }
.author-name { font-size: 15px; font-weight: 600; color: #fff; }
.author-badge { font-size: 11px; padding: 2px 8px; border-radius: 6px; font-weight: 600; }
.author-badge.company { background: rgba($warning, 0.15); color: $warning; border: 1px solid rgba($warning, 0.3); }
.author-badge.student { background: rgba($primary, 0.15); color: $primary-light; border: 1px solid rgba($primary, 0.3); }
.post-time { font-size: 12px; color: $text-muted; }
.post-options { font-size: 20px; color: $text-muted; cursor: pointer; letter-spacing: 2px; }

.post-body { display: flex; flex-direction: column; gap: 12px; }
.post-title { font-size: 16px; font-weight: 700; color: #fff; }
.post-content { font-size: 14px; color: #cbd5e1; line-height: 1.7; white-space: pre-wrap; }
.post-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.p-tag { font-size: 13px; color: $primary-light; cursor: pointer; transition: 0.2s; }
.p-tag:hover { color: #fff; text-decoration: underline; }

.post-images { margin-top: 12px; }
.mock-image { height: 160px; max-width: 300px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s; }
.mock-image:hover { opacity: 0.8; }
.img-icon { font-size: 14px; color: $text-muted; }

.post-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); }
.interaction-group { display: flex; gap: 32px; }
.interact-btn { display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.3s; opacity: 0.7; }
.interact-btn:hover { opacity: 1; transform: translateY(-1px); }
.interact-btn.liked { opacity: 1; .i-count { color: #ef4444; font-weight: 600; } }
.i-icon { font-size: 18px; }
.i-count { font-size: 14px; color: #cbd5e1; }

.referral-action { flex-shrink: 0; }

/* 底部加载提示 */
.feed-loading { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 24px 0; color: $text-muted; font-size: 13px; }

/* ==================== 沉浸式发布弹窗 ==================== */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 40px; }
.publish-modal-card { width: 100%; max-width: 700px; max-height: 85vh; display: flex; flex-direction: column; background: rgba(10,15,30,0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; box-shadow: 0 30px 60px rgba(0,0,0,0.8); }

.modal-header { padding: 24px 32px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
.m-title { font-size: 20px; font-weight: 600; color: #fff; }
.m-close { font-size: 24px; color: $text-muted; cursor: pointer; transition: 0.2s; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
.m-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

.modal-body { flex: 1; padding: 32px; display: flex; flex-direction: column; gap: 24px; }
.form-group { display: flex; flex-direction: column; gap: 12px; }
.form-label { font-size: 14px; color: #cbd5e1; font-weight: 500; }
.required { color: $danger; margin-left: 4px; }

.channel-selector { display: flex; flex-wrap: wrap; gap: 12px; }
.ch-pill { padding: 8px 16px; border-radius: 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); font-size: 14px; color: $text-muted; cursor: pointer; transition: 0.2s; }
.ch-pill:hover { background: rgba(255,255,255,0.1); color: #fff; }
.ch-pill.active { background: rgba($primary, 0.15); border-color: rgba($primary, 0.4); color: $primary-light; font-weight: 600; box-shadow: inset 0 0 10px rgba($primary, 0.1); }

.crystal-input { height: 50px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 0 16px; color: #fff; font-size: 15px; transition: 0.3s; }
.crystal-input:focus { border-color: $primary; box-shadow: 0 0 0 1px rgba($primary, 0.3); }

.textarea-wrapper { position: relative; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; transition: 0.3s; padding: 16px; }
.textarea-wrapper:focus-within { border-color: $primary; box-shadow: 0 0 0 1px rgba($primary, 0.3); }
.crystal-textarea { width: 100%; height: 180px; color: #fff; font-size: 15px; line-height: 1.6; outline: none; border: none; background: transparent; }
.char-counter { position: absolute; bottom: 12px; right: 16px; font-size: 12px; color: $text-muted; }

.modal-footer { padding: 24px 32px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: flex-end; gap: 16px; background: rgba(0,0,0,0.2); }

/* ==================== 统一按钮组件 ==================== */
.liquid-btn {
  position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, $primary, $secondary); color: #fff; border-radius: 12px;
  font-size: 14px; font-weight: 600; cursor: pointer; padding: 0 24px; height: 44px; border: none;
  box-shadow: 0 4px 15px rgba($primary, 0.3); transition: 0.3s;
}
.liquid-btn:hover { box-shadow: 0 8px 25px rgba($primary, 0.5); transform: translateY(-2px); }
.liquid-btn.micro { height: 34px; padding: 0 16px; font-size: 13px; border-radius: 10px; }
.liquid-btn.disabled { opacity: 0.5; filter: grayscale(80%); cursor: not-allowed; pointer-events: none; }
.liquid-btn .btn-txt { position: relative; z-index: 2; }
.shimmer-effect { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); transform: skewX(-20deg); animation: shimmerBtn 3s infinite cubic-bezier(0.4, 0, 0.2, 1); }

.ghost-btn.outline { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: #cbd5e1; height: 44px; padding: 0 24px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; transition: 0.2s; }
.ghost-btn.outline:hover { background: rgba(255,255,255,0.05); color: #fff; border-color: rgba(255,255,255,0.3); }

.spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.1); border-top-color: $primary; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

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
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.9); } }
@keyframes shimmerBtn { 100% { left: 200%; } }
.mt-24 { margin-top: 24px; }
.safe-area-bottom { height: 40px; }
</style>