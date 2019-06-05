import axios from 'axios';
import qs from 'qs'

let base = 'http://api.wushichaozhen.com/home'; //'http://localhost:8889/api' 'http://198.198.198.40:8889/api'
//let base ='http://198.198.198.40:8889/api';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

//export const requestLogin = params => { return axios.post(`/api/login`, qs.stringify(params)).then(res => res.data); }; //登录(线上)

export const requestLogin = params => { return axios.post(`${base}/login`, qs.stringify(params)).then(res => res.data); }; //登录

//export const getUserList = params => { return axios.get(`/api/user/list`, qs.stringify(params)); }; //用户管理(线上)

export const getUserList = params => { return axios.get(`${base}/index/index`, qs.stringify(params)); }; //用户管理(线上)

export const updataVideo = params => { return axios.post(`${base}/index/savevideo`, qs.stringify(params)); }; //视频编辑

export const updataBanner = params => { return axios.post(`${base}/api/banneredit`, qs.stringify(params)); };

export const deleteVideo = params => { return axios.get(`${base}/index/delvideo`,  { params: params }); }; 

export const bannerList = params => { return axios.get(`${base}/index/banner`, qs.stringify(params)); };

export const addvideo = params => { return axios.post(`${base}/index/addvideo`, qs.stringify(params)); }; //用户编辑

export const videoUpload = params => { return axios.post(`${base}/index/upload`, qs.stringify(params)); }; //修改密码

export const deleteBanner = params => { return axios.get(`${base}/Api/banneredelete`,  { params: params }); };    //删除banner

//export const exportExcl = params => { return axios.get(`http://60.205.152.103:8080/mockjsdata/5/api/export`, qs.stringify(params)); };

export const addBanner = params => { return axios.post(`${base}/index/banneradd `,  qs.stringify(params)); }//新增banner