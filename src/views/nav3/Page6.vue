<template>
	<section>
		<div class="block">	
			<el-form :model="updatePasswordForm" :rules="passwordRules" ref="updatePasswordForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="账户名称" prop="name" style="margin-top: 5%; margin-right: 5%;">
				    <el-input v-model.number="updatePasswordForm.name" :disabled="true"></el-input>
				</el-form-item>
			    <el-form-item label="原密码" prop="oldPassword" style="margin-right: 5%;">
				    <el-input type="password" v-model.number="updatePasswordForm.oldPassword"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password" style="margin-right: 5%;">
				    <el-input type="password" v-model="updatePasswordForm.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPass" style="margin-right: 5%;">
				    <el-input type="password" v-model="updatePasswordForm.checkPass" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item>
				    <el-button type="primary" @click="submitForm('updatePasswordForm')">提交</el-button>
				    <el-button @click="resetForm('updatePasswordForm')">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</section>
</template>
<script>
    import { updatePassword } from '../../api/api';
	export default {
		data() {
		    var checkOldPassword = (rule, value, callback) => {
		        if (!value) {
		          return callback(new Error('原密码不能为空'));
		        }
		         setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            }
          }
        }, 1000);
		    };
		    var validatePass = (rule, value, callback) => {
		        if (value === '') {
		          callback(new Error('请输入密码'));
		        } else {
		          if (this.updatePasswordForm.checkPass !== '') {
		            this.$refs.updatePasswordForm.validateField('checkPass');
		          }
		          callback();
		        }
		    };
		    var validatePass2 = (rule, value, callback) => {
		        if (value === '') {
		          callback(new Error('请再次输入密码'));
		        } else if (value !== this.updatePasswordForm.password) {
		          callback(new Error('两次输入密码不一致!'));
		        } else {
		          callback();
		        }
		    };
		    return {
		        updatePasswordForm: {
		            name: '',
					oldPassword: '',
					password: '',
					checkPass: '',
		        },
		        passwordRules: {
		          password: [
		            { validator: validatePass, trigger: 'blur' }
		          ],
		          checkPass: [
		            { validator: validatePass2, trigger: 'blur' }
		          ],
		          oldPassword: [
		            { validator: checkOldPassword, trigger: 'blur' }
		          ],
		        }
		    };
    	},
    	mounted: function(){
    		var username = JSON.parse(sessionStorage.getItem('user'))
    		this.updatePasswordForm.name = username
    	},
		methods: {
			submitForm(updatePasswordForm) {
				console.log(updatePasswordForm)
		        this.$refs[updatePasswordForm].validate((valid) => {
		          if (valid) {
		          	console.log(valid)
		            alert('submit!');
		            let userList = { name: this.updatePasswordForm.name, passwd: this.updatePasswordForm.checkPass }
			          updatePassword(userList).then(data => {
					    if(data.data.code == 0){
					    	this.$message({
							message: data.data.msg,
							type: 'success'
						});
					    }
					  })
		          } else {
		            console.log('error submit!!');
		            return false;
		          }
		        });
		    },
		    resetForm(formName) {
		        this.$refs[formName].resetFields();
		    }
		}
	}
</script>
<style scoped="scoped">
	section{
		width: 450px;
		height: 350px;
		text-align: center;
		margin: 0 auto;
		border: 1px solid deepskyblue;
		border-radius: 10px;
	}
</style>