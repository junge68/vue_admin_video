<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<div class="block">
				    <el-date-picker
				      v-model="dataVal"
				      align="right"
				      type="date"
				      @change="changeDate"
				      :editable="editable"
				      placeholder="选择日期"
				      :picker-options="pickerOptions1">
				    </el-date-picker>
				</div>
				<el-form-item style="margin-left: 1%;"> 
					<el-button type="primary" v-on:click="handleDownload" >导出</el-button>
				</el-form-item>
			</el-form>
		</el-col>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import { exportExcl } from '../../api/api';

	export default {
		data() {
			return {
				pickerOptions1: {
		          shortcuts: [{
		            text: '今天',
		            onClick(picker) {
		              picker.$emit('pick', new Date());
		            }
		          }, {
		            text: '昨天',
		            onClick(picker) {
		              const date = new Date();
		              date.setTime(date.getTime() - 3600 * 1000 * 24);
		              picker.$emit('pick', date);
		            }
		          }, {
		            text: '一周前',
		            onClick(picker) {
		              const date = new Date();
		              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
		              picker.$emit('pick', date);
		            }
		          }]
		        },
				dataVal: '',
				tableData: [],
				loading: true,
				excelTime: '', //excel导出时间
				tableList: [],
				list: [],
				editable: false,
				fullscreenLoading: false,
			}
		},
		mounted(){
			var d = new Date();
			var str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
			this.excelTime = str
		},
		methods: {
			//改变日期的方法
			changeDate(){
				this.openFullScreen()
				this.getTaskTime(this.dataVal)
			    let para = { createTime: this.getTaskTime(this.dataVal).substring(0,10) }
				exportExcl(para).then((res) => {
					console.log(res.data.data)
					if(res.data.code == 1){	
						this.openFullScreenData()
						this.tableData = res.data.data;
						//this.listLoading = false;
					}
				});
			},
			getTaskTime(strDate) {  
				  //  console.log("原始时间格式："+strDate);  
				    var date = new Date(strDate);  
				    var y = date.getFullYear();   
				    var m = date.getMonth() + 1;    
				    m = m < 10 ? ('0' + m) : m;    
				    var d = date.getDate();    
				    d = d < 10 ? ('0' + d) : d;    
				    var h = date.getHours();    
				    var minute = date.getMinutes();    
				    minute = minute < 10 ? ('0' + minute) : minute;  
				    var str = y+"-"+m+"-"+d+" "+h+":"+minute;  
				    console.log("转换时间格式："+str);  
				    return str;  
			},
			handleDownload() {
				//console.log(this.tableData.length)
				console.log(this.dataVal)
			if(this.dataVal === ''){
					this.$message.error('请选择日期');
			}else{
				this.openExcelFullScreen()
				if(this.tableData.length  > 60000){
					if(this.tableData.length % 60000 === 0 ){
						var reques = this.tableData.length / 60000;
						for(let i = 1; i<= reques; i++){
							 this.tableList = this.tableData.slice(0,60000)
							this.listLoading = false;
							this.downloadExcel(this.tableList);
							//this.tableList.splice(0,60000)
							this.tableList = this.tableData.splice(0,60000)
							alert("6万的整数倍")
						}
					}else{
						var request = this.tableData.length / 60000;
						for(let i = 1; i<= request+1; i++){
							 this.tableList = this.tableData.slice(0,60000)
							 //console.log(this.tableList)
							 this.listLoading = false;
							this.downloadExcel(this.tableList);
							//this.openFullScreenData()
							/*console.log(this.tableList)*/
							this.tableList = this.tableData.splice(0,60000)
							console.log(this.tableList)
							//alert("不是6万的整数倍")
						}
					}
				}else{
					this.downloadExcel(this.tableData)
				}
			}
			
		    },
		    //下载excel的方法
		    downloadExcel(list){
				console.log("正在下载excel")
		        require.ensure([], () => {
		　　　　　　 const { export_json_to_excel } = require('@/vendor/Export2Excel');
		　　　　　　 const tHeader = ['created', 'transferCode', 'deciceCode','rawMsg','pipeGain1','pipeGain2','pipeGain3','pipeGain4','particle1','particle2','particle3','particle4'];
		　　　　　　 const filterVal = ['created', 'transferCode', 'deciceCode','rawMsg','pipeGain1','pipeGain2','pipeGain3','pipeGain4','particle1','particle2','particle3','particle4'];
//		　　　　　　 const list = this.tableList;
				   console.log(list)
		　　　　　　 const data = this.formatJson(filterVal, list);
		　　　　　　 export_json_to_excel(tHeader, data, this.excelTime);
　　　　　　		})
			},
		    formatJson(filterVal, jsonData) {
	　　　　　　return jsonData.map(v => filterVal.map(j => v[j]))
	　　　　 },
			//点击loading...
			openFullScreen() {
				console.log("调了方法")
		        const loading = this.$loading({
		          lock: true,
		          text: '正在加载数据...',
		          spinner: 'el-icon-loading',
		          background: 'rgba(0, 0, 0, 0.7)'
		        });
		        /*setTimeout(() => {
		          loading.close();
		        }, 2000);
*/		     },
			openExcelFullScreen() {
				
		        const loading = this.$loading({
		          lock: true,
		          text: '正在下载Excel',
		          spinner: 'el-icon-loading',
		          background: 'rgba(0, 0, 0, 0.7)'
		        });
		        setTimeout(() => {
		          loading.close();
		        }, 5000);
		     },
			//数据loading..
			openFullScreenData() {
		        const loading = this.$loading({
		          lock: true,
		          text: '正在加载数据Loading...',
		          spinner: 'el-icon-loading',
		          background: 'rgba(0, 0, 0, 0.7)'
		        });
		        setTimeout(() => {
		          loading.close();
		        }, 1);
		     },
		     openExcelFullScreenData() {
		        const loading = this.$loading({
		          lock: true,
		          text: '正在加载数据...',
		          spinner: 'el-icon-loading',
		          background: 'rgba(0, 0, 0, 0.7)'
		        });
		        /*setTimeout(() => {
		          loading.close();
		        }, 2000);
*/		     },
		},
	
	}

</script>

<style scoped>
	.block{
		float: left;
	}
</style>