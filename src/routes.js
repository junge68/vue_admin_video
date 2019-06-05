import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import CustomerManagement from './views/customerManagement/customerManagement.vue'
import BannerList from './views/customerManagement/bannerList.vue'
import ExportExcel from './views/customerManagement/exportExcel.vue'
import user from './views/customerManagement/user.vue'
import messageList from './views/message/messageList.vue'
//import Page5 from './views/message/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '视频管理',
        iconCls: 'fa fa-address-card',//图标样式class
        children: [
        //    { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/customerManagement', component: CustomerManagement, name: '视频列表' },
            { path: '/bannerList', component: BannerList, name: '轮播图管理' },
//          { path: '/user', component: user, name: '列表' },
        ] 	
    },
    
//  {
//      path: '/', 
//      component: Home,
//      name: '短信记录',
//      iconCls: 'el-icon-message',
//      children: [
//          { path: '/messageList', component: messageList, name: '短信记录' },
//          /*{ path: '/page5', component: Page5, name: '页面5' }*/
//      ]
//  },
//  {
//      path: '/',
//      component: Home,
//      name: '',
//      hidden: true,
//      children: [
//          { path: '/page6', component: Page6, }
//      ]
//  },
//  {
//      path: '/', 
//      component: Home, 
//      name: '导出',
//      iconCls: 'fa fa-bar-chart',
//      children: [
//          { path: '/exportExcel', component: ExportExcel, name: '导出' }
//      ]
//  },
//  { 
//      path: '*',     
//      hidden: true,
//      redirect: { path: '/404' }	
//  }
];

export default routes;