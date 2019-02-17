<template>
    <div :class="{'sidenav-toggled': sidenav === true}">
      <!-- 头部 -->
      <header class="app-header"><a class="app-header__logo" href="index.html">Lotterydraw</a>
        <!-- 左上角切换 -->
        <!-- Sidebar toggle button--><a class="app-sidebar__toggle" href="#" data-toggle="sidebar" aria-label="Hide Sidebar" @click="sidebar()"></a>
        <!-- Navbar Right Menu-->
        <ul class="app-nav">
          <li class="app-search">
            <input class="app-search__input" type="search" placeholder="Search">
            <button class="app-search__button"><i class="fa fa-search"></i></button>
          </li>
          <!--Notification Menu-->
          <!-- User Menu-->
          <li class="dropdown"><a class="app-nav__item" href="#" data-toggle="dropdown" aria-label="Open Profile Menu"><i class="fa fa-user fa-lg"></i></a>
            <ul class="dropdown-menu settings-menu dropdown-menu-right">
              <li><a class="dropdown-item" v-on:click.stop="logout()"><i class="fa fa-sign-out fa-lg"></i> 退出</a></li>
            </ul>
          </li>
        </ul>
      </header>
      <!-- Sidebar menu-->
      <div class="app-sidebar__overlay" data-toggle="sidebar"></div>
      <!-- 左边 -->
      <aside class="app-sidebar">
        <div class="app-sidebar__user"><img class="app-sidebar__user-avatar" style="width: 48px;height: 48px;" src="https://www.huizhe.xyz/images/mylogo.jpg" alt="User Image">
          <div>
            <p class="app-sidebar__user-name">Hui Zhe</p>
            <p class="app-sidebar__user-designation">Backend Developer</p>
          </div>
        </div>
        <ul class="app-menu">
          <li><a class="app-menu__item active" href="https://huizhe.xyz"><i class="app-menu__icon fa fa-dashboard"></i><span class="app-menu__label">主页</span></a></li>
          <li class="treeview" :class="{'is-expanded': index === 1}"><a class="app-menu__item" href="#" data-toggle="treeview" @click.stop="treeview(1)"><i class="app-menu__icon fa fa-th-list"></i><span class="app-menu__label">Tables</span><i class="treeview-indicator fa fa-angle-right"></i></a>
            <ul class="treeview-menu">
              <li><router-link :to="{name:'participant'}" class="treeview-item"><i class="icon fa fa-circle-o"></i> &nbsp;&nbsp;参与者信息</router-link></li>
              <li><router-link :to="{name:'activity'}" class="treeview-item"><i class="icon fa fa-circle-o"></i> &nbsp;&nbsp;活动信息</router-link></li>
              <li><router-link :to="{name:'lottery'}" class="treeview-item"><i class="icon fa fa-circle-o"></i> &nbsp;&nbsp;获奖者名单</router-link></li>
            </ul>
          </li>
          <li class="treeview" :class="{'is-expanded': index === 3}"><a class="app-menu__item" href="#" data-toggle="treeview" @click.stop="treeview(3)"><i class="app-menu__icon fa fa-edit"></i><span class="app-menu__label">Forms</span><i class="treeview-indicator fa fa-angle-right"></i></a>
            <ul class="treeview-menu">
              <li>
                <router-link :to="{name:'activityfrom'}" class="treeview-item"><i class="icon fa fa-circle-o"></i> &nbsp;&nbsp;抽奖活动</router-link>
                <router-link :to="{name:'participantfrom'}" class="treeview-item"><i class="icon fa fa-circle-o"></i> &nbsp;&nbsp;活动抽奖</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </aside>
      <!-- 右边 -->
      <router-view></router-view>
    </div>
</template>

<script>
import '../../../static/js/popper.min'
import '../../../static/js/bootstrap.min'
export default {
  name: 'index',
  data: function () {
    return {
      sidenav: false,
      index: 0
    }
  },
  mounted: function () {
    if (!localStorage.companyUser) {
      this.$router.push('/login')
    }
  },
  methods: {
    sidebar () {
      this.sidenav = !this.sidenav
      if (this.sidenav) {
        document.body.className = 'app sidebar-mini rtl pace-done sidenav-toggled'
      } else {
        document.body.className = 'app sidebar-mini rtl pace-done'
      }
    },
    treeview (index) {
      if (this.index === index) {
        this.index = 0
      } else {
        this.index = index
      }
    },
    logout () {
      if (localStorage.companyUser) {
        localStorage.companyUser = ''
      }
      this.$router.push('/login')
    }
  }
}

</script>
<style scoped>
  @import "../../../static/css/main.css";
  @import "../../../static/css/font-awesome.min.css";
  @import "https://unpkg.com/vue-easytable/umd/css/index.css";
</style>
