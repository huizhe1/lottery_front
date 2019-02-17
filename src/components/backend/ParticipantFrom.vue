<template>
  <main class="app-content">
    <div class="app-title">
      <div>
        <h1><i class="fa fa-edit"></i> 活动抽奖</h1>
        <p>在此选择未截止的活动，并进行抽奖</p>
      </div>
      <ul class="app-breadcrumb breadcrumb">
        <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
        <li class="breadcrumb-item">Froms</li>
        <li class="breadcrumb-item"><a href="#">活动抽奖</a></li>
      </ul>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="tile">
          <div class="row">
            <div class="col-lg-6 col-center-block">
                <div class="form-group">
                  <label for="Select1">活动名称</label>
                  <select class="form-control" id="Select1" v-model="activityId" @change="getParticipanyByActivity(activityId)">
                    <option v-for="option in options" v-bind:value="option.activityId" :key="option.activityName">{{option.activityName}}</option>
                  </select>
                </div>
              <div class="tile-footer" style="text-align: center" :class="{'display': showAward === false}">
                <label for="awardSelect">奖项名称</label>
                <select class="form-control margin-bottom" v-model="selected" id="awardSelect">
                    <option v-for="award in awards" v-bind:value="award.value" :key="award.value">{{award.value}}</option>
                </select>
                <!-- 抽奖按钮 -->
                <button class="btn btn-primary" type="submit" style="width: 135px;margin-right: 36px;" @click="move">开始抽奖</button>
                <button class="btn btn-info" type="submit" style="width: 135px;" @click="stop">抽奖结束</button>
                <!-- 抽奖名单 -->
                <section class="slider-banner">
                  <ul>
                    <li v-for="(participant, index) in participantArray" v-bind:value="participant.participantsId" :key="participant.participantsId">
                      <div :class="{'participant': participantIndex === index}">
                        <img v-bind:src="participant.avatarUrl" alt="头像" class="" />
                        <span class="nick-name">{{participant.nickname}}</span>
                        <span :class="{'display': participantIndex !== index}">{{participant.phone.substr(0,3) + '***' + participant.phone.substr(-3)}}</span>
                      </div>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="{'display': isTrue === false}" class="error"><i class="bgclose" @click="isTrue = false"></i><span>{{error}}</span></div>
  </main>
</template>

<script>
export default {
  name: 'Form',
  data: function () {
    return {
      options: [],
      participantArray: [],
      activityId: null,
      isTrue: false,
      error: '',
      selected: '特等奖',
      awards: [
        {value: '特等奖'},
        {value: '一等奖'},
        {value: '二等奖'},
        {value: '三等奖'},
        {value: '安慰奖'},
        {value: '参与奖'},
        {value: '其他'}
      ],
      showAward: false,
      participantIndex: -1,
      timeSet: '',
      partArrayLength: 0
    }
  },
  mounted: function () {
    this.loadDoc()
  },
  updated: function () {
  },
  created () {
  },
  beforeDestroy () {
    clearInterval(this.timeSet)
  },
  methods: {
    move: function () {
      if (!this.timeSet) {
        let that = this
        this.timeSet = setInterval(function () {
          that.participantIndex = Math.round(Math.random() * that.partArrayLength)
          that.participantIndex = that.participantIndex === that.partArrayLength ? that.partArrayLength - 1 : that.participantIndex
        }, 50)
      }
    },
    stop: function () {
      if (this.timeSet) {
        clearInterval(this.timeSet)
        this.timeSet = null
        let params = new URLSearchParams()
        params.append('activityId', this.participantArray[this.participantIndex].activityId)
        params.append('participantId', this.participantArray[this.participantIndex].participantsId)
        params.append('award', this.selected)
        this.$api.post('/lottery/', params, msg => {
          this.isTrue = true
          if (msg.status !== 200) {
            this.error = msg.msg
          } else {
            this.error = '抽奖成功'
          }
        })
      }
    },
    loadDoc () {
      this.$api.get('/activity/all/nowinner', '', msg => {
        this.options = msg.data
        this.activityId = msg.data[0].activityId
        this.getParticipanyByActivity(this.activityId)
      })
    },
    getParticipanyByActivity (activityId) {
      this.$api.get('/participant/all/' + activityId, '', msg => {
        if (msg.data.total === 0) {
          this.error = '暂时无人参与活动'
          this.isTrue = true
          this.showAward = false
        } else {
          let params = new URLSearchParams()
          this.partArrayLength = msg.data.total
          params.append('pageSize', msg.data.total)
          this.$api.get('/participant/all/' + activityId, params, msg => {
            this.participantArray = msg.data.list
            this.showAward = true
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  @import "../../../static/css/main.css";
  @import "../../../static/css/font-awesome.min.css";
  @import "../../../static/css/error.css";

  .participant{
    border: 1px solid #4affee;
    border-radius: 25px;
    box-shadow: 10px 10px 5px #888888;
    padding-top: 5px;
    box-sizing: border-box;
  }
  .margin-bottom{
    margin-bottom: 10px;
  }
  .slider-banner {
    width: 100%;
    height: 120px;
    margin-top: 10px;
  }
  .slider-banner ul{
    width: 100%;
    height: 120px;
    position: relative;
    list-style: none;
    text-align: center;
    padding: 10px 10px;
    margin-top: -15px;
  }
  .slider-banner ul li{
    width: 120px;
    height: 120px;
    float: left;
    padding-top: 10px;
    text-align: center;
    margin-right: 12px;
    box-sizing: border-box;
  }
  .slider-banner ul li img{
    width: 64px;
    height: 64px;
    border-radius: 50%;
  }
  .nick-name {
    display: block;
    margin-bottom: 0.1rem;
  }
</style>
