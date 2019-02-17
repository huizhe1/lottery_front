<template>
  <main class="app-content">
    <div class="app-title">
      <div>
        <h1><i class="fa fa-edit"></i> 活动</h1>
        <p>活动信息</p>
      </div>
      <ul class="app-breadcrumb breadcrumb">
        <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
        <li class="breadcrumb-item">Forms</li>
        <li class="breadcrumb-item"><a href="#">活动信息</a></li>
      </ul>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="tile">
          <div class="row">
            <div class="col-lg-6 col-center-block">
              <form v-on:submit.prevent="Activity">
                <div class="form-group">
                  <label for="activityName">活动名称</label>
                  <input class="form-control" type="text" id="activityName" autofocus placeholder="请输入活动名称" v-model="activityInfo.activityName">
                </div>
                <div class="form-group">
                  <label for="Select1">活动类型</label>
                  <select class="form-control" id="Select1" v-model="activityInfo.type">
                    <option v-for="option in options" v-bind:value="option.status" :key="option.status">{{option.value}}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>活动截止时间</label>
                  <date-picker style="padding: 0" class="form-control" v-model="activityInfo.drawAt" lang="en" type="date" format="YYYY-MM-DD"></date-picker>
                </div>
                <div class="tile-footer">
                  <button class="btn btn-primary col-center-block" type="submit" style="width: 135px;">{{submitMsg}}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="{'display': isTrue === false}" class="error"><i class="bgclose" @click="isTrue = false"></i><span>{{error}}</span></div>
  </main>
</template>

<script>
import DatePicker from 'vue2-datepicker'

export default {
  name: 'Form',
  components: {DatePicker},
  data: function () {
    return {
      options: [
        {status: 1, value: '学校'},
        {status: 2, value: '公司'}
      ],
      activityInfo: {
        activityId: null,
        activityName: '',
        type: 2,
        drawAt: new Date()
      },
      isTrue: false,
      error: '',
      submitMsg: '添加抽奖活动'
    }
  },
  mounted: function () {
    this.loadDoc()
  },
  methods: {
    addActivity () {
      let params = new URLSearchParams()
      params.append('activityName', this.activityInfo.activityName.trim())
      params.append('type', this.activityInfo.type)
      params.append('drawAt', this.activityInfo.drawAt)
      this.$api.post('/activity/', params, msg => {
        this.isTrue = true
        this.error = msg.msg
      })
    },
    updateActivity () {
      this.activityInfo.activityId = this.$route.params.activityInfo.activityId
      this.activityInfo.createAt = null
      this.$api.put('/activity/' + this.activityInfo.activityId, this.activityInfo, msg => {
        this.isTrue = true
        this.error = msg.msg
      })
    },
    Activity () {
      this.checkData()
      if (this.isTrue) {
        return ''
      }
      if (this.$route.params.activityInfo) {
        this.updateActivity()
      } else {
        this.addActivity()
      }
    },
    checkData () {
      if (this.activityInfo.activityName === '') {
        this.isTrue = true
        this.error = '活动名称为必填项'
        return ''
      }
      if (this.activityInfo.drawAt === '') {
        this.isTrue = true
        this.error = '活动截止时间为必填项'
      }
    },
    loadDoc () {
      if (this.$route.params.activityInfo) {
        this.activityInfo = this.$route.params.activityInfo
        this.submitMsg = '修改抽奖活动'
      }
    }
  }
}
</script>

<style scoped>
  @import "../../../static/css/main.css";
  @import "../../../static/css/font-awesome.min.css";
  @import "../../../static/css/error.css";
</style>
