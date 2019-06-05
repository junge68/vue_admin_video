<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="Ascending">升序</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="Descending">降序</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
			<el-table :data="tableData" border style="width: 100%">
			    <el-table-column 
			    	prop="mobile" 
			    	label="推送的手机号"  
			    	width="180">
				</el-table-column>
			    <el-table-column 
			    	prop="alert" 
			    	label="推送的消息" 
			    	width="180">
			    </el-table-column>
			    <el-table-column 
			    	prop="sendTime" 
			    	label="发送的日期时间">
			    </el-table-column>
			    <el-table-column 
			    	prop="sendStatus" 
			    	label="发送是否成功">
			    </el-table-column>
			    <el-table-column 
			    	prop="errorInfo" 
			    	label="发送失败说明" >
			    </el-table-column>
			</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
		    <div class="block" style="float: right;">
			    <el-pagination
			      @current-change="handleCurrentChange"
			      :current-page.sync="currentPage1"
			      :page-size="10"
			      layout="total, prev, pager, next"
			      :total="total">
			    </el-pagination>
			</div>
		</el-col>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import { messageList, exportExcl} from '../../api/api';

	export default {
		data() {
			return {
				pageNum: 1,
				users: [],
				total: 1,
				page: 1,
				listLoading: false,				
				tableData: [],
				mobile: '',
				alert: '',
				
				sendTime: '',
				sendStatus: '',
				errorInfo: '',
				currentPage1: 1,
				
				value3: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.pageNum = val;
				this.getMessageList(this.pageNum,0);
			},
			Ascending(){
				/*let para = {
					pageNum: this.pageNum,
					sortStaut: 1
				};*/
				
				this.getMessageList(this.pageNum,1);
			},
			Descending(){
				this.getMessageList(this.pageNum,0);
			},
			exportExcl(){
				exportExcl().then((res) => {
					console.log(res.data.code)
					if(res.data.code == 1){					
						this.tableData = res.data.data.bizData;
						this.total = res.data.data.pageCursor.all
						/*this.$message({
							message: res.data.msg,
							type: 'success'
						});*/
						this.listLoading = false;
					}
				});
			},
			//获取用户列表
			getMessageList(pageNum,sortStaut) {
				let para = {
					pageNum: this.pageNum,
					sortStaut: sortStaut
				};
				this.listLoading = true;
				messageList(para).then((res) => {
					if(res.data.code == 1){
						var dataList = res.data.data.bizData;
//						console.log(res.data.data.bizData[1].sendStatus)
						for(var i = 0;i<=dataList.length;i++){
							if(dataList[i].sendTime > 0){
								dataList[i].sendTime = this.getLocalTime(dataList[i].sendTime).substring(0,9)
								this.tableData = dataList;
							}
							if(dataList[i].sendStatus == 1){
								dataList[i].sendStatus = "是";
								this.tableData = dataList;
							}else{
								dataList[i].sendStatus = "否";
								this.tableData = dataList;
							}							
							this.total = res.data.data.pageCursor.all
						}							
					}
				});
			},
			getLocalTime(nS) { 
		       return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' '); 
		   },
		},
		mounted() {
			this.getMessageList();
			
		},
		watch:{
			pageNum(oldVal,curVal){
				console.log(oldVal,curVal)
				let page = {pageNum: this.pageNum}
				messageList(page).then((res) => {
					if(res.data.code == 1){
						this.total = res.data.data.pageCursor.all
						this.listLoading = false;
					}
				});
			}
		}
	}

</script>

<style scoped>
	.block{
		float: left;
	}
</style>