<template>
  <div class="page-login">
    <div class="login-box">
      <Form ref="form" :model="form" :rules="rule" :label-width="70" @submit.native="login">
        <FormItem label="用户名" prop="username">
          <Input v-model="form.username" placeholder="请输入用户名" />
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="password" v-model="form.password" placeholder="请输入密码" />
        </FormItem>
        <Button type="primary" html-type="submit" class="btn-login" >登录</Button>
      </Form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data(){
    return {
      form: {
        username: '',
        password: ''
      },
      rule: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    login(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$router.push('/')
        } else {
          this.$Message.error('Fail!');
        }
      })
      
    }
  }
}
</script>

<style lang="scss">
.page-login{
  position: relative;
  min-height: 100vh;
  background: #ccc;
  .login-box{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 400px;
    padding: 20px;
    background: rgba(0,0,0,.8);
    border-radius: 10px;
    .btn-login{
      display: block;
      margin: 0 auto auto auto;
      width: 80px;
      height: 30px;
    }
  }
}
</style>
