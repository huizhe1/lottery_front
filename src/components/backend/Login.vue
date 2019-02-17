<template id="login">
  <div>
    <section class="material-half-bg">
      <div class="cover"></div>
    </section>
    <section class="login-content">
      <div class="logo">
        <h1>聘多多</h1>
      </div>
      <div class="login-box" ref="login">
        <!-- 登录模块 -->
        <form class="login-form" v-on:submit.prevent="login(userinfo)">
          <h3 class="login-head"><i class="fa fa-lg fa-fw fa-user"></i>登录</h3>
          <div class="form-group">
            <label class="control-label">用户名</label>
            <input class="form-control" type="text" placeholder="username" autofocus v-model="userinfo.username">
          </div>
          <div class="form-group">
            <label class="control-label">密码</label>
            <input class="form-control" type="password" placeholder="Password" v-model="userinfo.password">
          </div>
          <div class="form-group">
            <div class="utility">
              <div class="animated-checkbox">
                <label>
                  <input type="checkbox" v-model="userinfo.status"><span class="label-text">记住登录状态</span>
                </label>
              </div>
            </div>
          </div>
          <div class="form-group btn-container">
            <button class="btn btn-primary btn-block"><i class="fa fa-sign-in fa-lg fa-fw"></i>登录</button>
          </div>
        </form>
      </div>
      <label class="error">{{error}}</label>
    </section>
  </div>
</template>
<script>

export default {
  name: 'login',
  data: function () {
    return {
      userinfo: {
        username: '',
        password: '',
        status: false
      },
      resetData: {
        phone: '',
        code: '',
        password: ''
      },
      error: '',
      isFlipped: false
    }
  },
  mounted: function () {
    this.loadDoc()
  },
  methods: {
    login (userinfo) {
      let params = new URLSearchParams()
      params.append('username', userinfo.username.trim())
      params.append('password', userinfo.password.trim())
      this.$api.post('/user/login', params, msg => {
        if (msg.status === 200) {
          localStorage.setItem('companyUser', JSON.stringify({'username': userinfo.username.trim()}))
          this.$router.push('/')
        } else {
          this.error = msg.msg
        }
      })
    },
    loadDoc () {
      if (localStorage.companyUser) {
        this.userinfo.username = JSON.parse(localStorage.companyUser).username
      }
    }
  }
}
</script>
<style scoped>
  /*Main CSS*/
  @import "../../../static/css/main.css";
  @import "../../../static/css/font-awesome.min.css";
  .error {
    display: inline-block;
    color: red;
    font-size: 14px;
    position: absolute;
    bottom: 273px;
  }
</style>
