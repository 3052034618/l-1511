export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/contacts/index',
    'pages/tracks/index',
    'pages/mine/index',
    'pages/contact-edit/index',
    'pages/sos/index',
    'pages/safe-zones/index',
    'pages/track-detail/index',
    'pages/notifications/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '安全守护',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f5f6f7'
  },
  tabBar: {
    color: '#86909c',
    selectedColor: '#165dff',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/contacts/index',
        text: '联系人'
      },
      {
        pagePath: 'pages/tracks/index',
        text: '轨迹'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
