<template>
	<div>
		<section>
			<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<el-input v-model="filters.name" placeholder="姓名"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" v-on:click="serachVideo">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleAdd">添加</el-button>
					</el-form-item>
				</el-form>
			</el-col>

			<!--列表-->
			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="title" label="标题" width="180">
				</el-table-column>
				<el-table-column prop="code" label="编码" width="180">
				</el-table-column>
				<el-table-column prop="url" label="视频路径" width="180">
				</el-table-column>
				<el-table-column prop="time" label="上传日期" width="180">
				</el-table-column>
				<el-table-column prop="desc" label="视频描述" width="180">
				</el-table-column>

				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
				</el-pagination>
			</el-col>

			<!--编辑界面-->
			<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
				<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
					<el-form-item label="标题" prop="name">
						<el-input v-model="editForm.title" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="编码" prop="code">
						<el-input v-model="editForm.code" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="上传视频">
						<el-form-item label="添加视频" class="video-upload">
							<el-upload class="avatar-uploader" 
								action="http://api.wushichaozhen.com/home/index/upload_radio" 
								accept='.mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb' 
								:data="paramsdata" 
								:show-file-list="true" 
								:before-upload="beforeUploadVideo" 
								:on-success="handleVideoSuccess" 
								:on-progress="uploadVideoProcess">
								<video v-if="editForm.url !='' && videoFlag == false" 
									:src="editForm.url" width="350" height="180" 
									controls="controls">您的浏览器不支持视频播放</video>
								<i v-else-if="editForm.url =='' && videoFlag == false" class="el-icon-plus avatar-uploader-icon"></i>
								<el-progress v-if="videoFlag == true" type="circle" :percentage="videoUploadPercent" style="margin-top:30px"></el-progress>
							</el-upload>
						</el-form-item>
					</el-form-item>
					<el-form-item label="日期">
						<el-date-picker type="date" placeholder="选择日期" v-model="editForm.time"></el-date-picker>
					</el-form-item>
					<el-form-item label="视频描述">
						<el-input type="textarea" v-model="editForm.desc"></el-input>
					</el-form-item>
					<el-form-item label="视频封面">
						<el-upload class="avatar-uploader" action="http://api.wushichaozhen.com/home/index/upload_image" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
							<img v-if="editForm.poster" :src="editForm.poster" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="editFormVisible = false">取消</el-button>
					<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
				</div>
			</el-dialog>

			<!--添加界面-->
			<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
				<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
					<el-form-item label="标题" prop="title">
						<el-input v-model="addForm.title" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="编码" prop="code">
						<el-input v-model="addForm.code" auto-complete="off"></el-input>
					</el-form-item>
					<!--<el-form-item label="视频路径" prop="url">
					<el-input v-model="addForm.url" auto-complete="off"></el-input>
				</el-form-item>-->
					<el-form-item label="上传视频">

						<el-form-item label="添加视频" class="video-upload">
							<el-upload class="avatar-uploader" 
								action="http://api.wushichaozhen.com/home/index/upload_radio" 
								accept='.mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb' :data="paramsdata" 
								:show-file-list="true" :before-upload="beforeUploadVideo" 
								:on-success="handleVideoSuccess" 
								:on-progress="uploadVideoProcess">
								<video v-if="addForm.url !='' && videoFlag == false" 
									:src="addForm.url" width="350" height="180" 
									controls="controls">您的浏览器不支持视频播放</video>
								<i v-else-if="addForm.url =='' && videoFlag == false" 
									class="el-icon-plus avatar-uploader-icon"></i>
								<el-progress v-if="videoFlag == true" type="circle" 
									:percentage="videoUploadPercent" style="margin-top:30px"></el-progress>
							</el-upload>
						</el-form-item>

					</el-form-item>
					<el-form-item label="上传日期" prop="time">
						<!--<el-input type="date" v-model="addForm.time" auto-complete="off"></el-input>-->
						<el-date-picker v-model="addForm.time" type="date" placeholder="选择日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="视频描述" prop="desc">
						<el-input v-model="addForm.desc" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="视频封面">
						<el-upload class="avatar-uploader" action=" http://api.wushichaozhen.com/home/index/upload_image" :show-file-list="false" :on-success="handleAvatarAddSuccess" :before-upload="beforeAvatarUpload">
							<img v-if="addForm.poster" :src="addForm.poster" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="addFormVisible = false">取消</el-button>
					<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
				</div>
			</el-dialog>
		</section>
	</div>
</template>

<script>
	import util from '../../common/js/util'
	 import { getUserList } from '../../api/api';
	//import NProgress from 'nprogress'
	import { getUserListPage, bannerList, addvideo, deleteBanner, addBanner } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				//sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				name: '',
				email: '',
				mobile: '',
				tel: '',
				is_admin: '',
				is_active: '',
				push: '',
				formLabelWidth: '80px',
				tableData: [],
				//编辑界面数据
				editForm: {
					title: '',
					poster: '',
					code: '',
					url: '',
					desc: '',
					time: '',
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					title: '',
					poster: '',
					code: '',
					url: '',
					desc: '',
					time: '',
				},
				videoFlag:false,      //刚开始的时候显示为flase
		        videoUploadPercent: '0%',  //进度条刚开始的时候为0%
		        paramsdata:{
		            '参数': '参数值'    //添加其他参数
		        },

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取轮播图列表
			bannerList(){
				bannerList().then(data => {					
					//console.log(data.data.data)
					this.tableData = data.data.data					
				})
			},
			//删除
			handleDelete: function (index, row) {
				console.log(row)
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					deleteBanner(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.bannerList();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				
				console.log(row)
				this.editForm = row;				
				this.editFormVisible = true;				
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				/*this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					
				};*/
			},
			//编辑
			editSubmit: function () {
				console.log(this.editForm)
//				this.$refs.editForm.validate((valid) => {
//					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = this.editForm;
							console.log(para)
						//	para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							updataVideo(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUserList();
							});
						});
//					}
//				});
			},
			//添加
			addSubmit: function () {
//				this.$refs.addForm.validate((valid) => {
//					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							//let para = this.addForm
							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addBanner(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								
								console.log(res.data.msg)
								this.$message({
									message: res.data.msg,
									type: 'success'
								});
								//this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.bannerList();
							});
						});
//					}
//				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
		    beforeAvatarUpload(file) {
		        const isJPG = file.type === 'image/jpeg';
		        const isLt2M = file.size / 1024 / 1024 < 2;
		
		        if (!isJPG) {
		          this.$message.error('上传头像图片只能是 JPG 格式!');
		        }
		        if (!isLt2M) {
		          this.$message.error('上传头像图片大小不能超过 2MB!');
		        }
		        return isJPG && isLt2M;
		    },
		    handleAvatarSuccess(res, file) {
				
		        this.editForm.poster = URL.createObjectURL(file.raw);
		        console.log( this.editForm.poster)
		    },
			handleAvatarAddSuccess(res, file) {
				
		        this.addForm.poster = URL.createObjectURL(file.raw);
		        console.log( this.addForm.poster)
		   },
		   beforeUploadVideo(file) {          //视频上传之前判断他的大小
		      const isLt10M = file.size / 1024 / 1024  < 2000;
		      if (!isLt10M) {
		        this.$message.error('上传视频大小不能超过2000MB哦!');
		        return false;
		      }
		    },
		    uploadVideoProcess(event, file, fileList){    //视频上传的时候获取上传进度传给进度条
		      this.videoFlag = true;
		      this.videoUploadPercent = parseInt(file.percentage);
		      console.log(this.videoUploadPercent)
		    },
		    handleVideoSuccess(res, file) {           //视频上传成功之后返回视频地址
		      this.videoFlag = false;
		      this.videoUploadPercent = 0;
		      console.log(file) 
		      this.addForm.url = file.url;
		    },
		    serachVideo(){
		    	
		    }
		},
		mounted() {
			this.bannerList();
		}
	}

</script>

<style scoped="scoped">
	.avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	  }
	  .avatar-uploader .el-upload:hover {
	    border-color: #409EFF;
	  }
	  .avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 178px;
	    height: 178px;
	    line-height: 178px;
	    text-align: center;
	  }
	  .avatar {
	    width: 178px;
	    height: 178px;
	    display: block;
	  }
</style>