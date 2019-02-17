<template>
  <main class="app-content">
    <div class="app-title">
      <div>
        <h1><i class="fa fa-th-list"></i> 获奖者信息</h1>
        <p>获奖者信息</p>
      </div>
      <ul class="app-breadcrumb breadcrumb side">
        <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
        <li class="breadcrumb-item">Tables</li>
        <li class="breadcrumb-item active"><router-link :to="{name: 'lottery'}">获奖者信息</router-link></li>
      </ul>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="tile">
          <div class="tile-body">
              <v-table
                       is-horizontal-resize
                       style="width:100%;line-height:38px;"
                       class="table-hover"
                       multiple-sort
                       :columns="tableConfig.columns"
                       :table-data="tableConfig.tableData"
                       row-hover-color="#eee" row-click-color="#edf7ff"
                       @on-custom-comp="customCompFunc"
                       @sort-change="sortChange"
                       :paging-index="(pageConfig.pageIndex-1)*pageConfig.pageSize"
                       :show-vertical-border='true'
                       column-width-drag
              >
              </v-table>
              <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="pageConfig.total" :page-size="pageConfig.pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']" style="margin-top: 10px"></v-pagination>
          </div>
        </div>
      </div>
    </div>
    <div :class="{'display': isTrue === false}" class="error"><i class="bgclose" @click="isTrue = false"></i><span>{{error}}</span></div>
  </main>
</template>

<script>
import Vue from 'vue'
import {VTable, VPagination} from 'vue-easytable'

export default {
  name: 'Table',
  components: {VTable, VPagination},
  mounted: function () {
    this.loadDoc()
  },
  data: function () {
    return {
      pageConfig: {
        pageIndex: 1,
        pageSize: 10,
        total: 1
      },
      tableConfig: {
        tableData: [],
        columns: []
      },
      requestPage: {
        pageNum: 1,
        pageSize: 10
      },
      isTrue: false,
      error: '',
      url: ''
    }
  },
  methods: {
    loadDoc () {
      this.url = '/lottery/all'
      if (this.$route.params.activityInfo) {
        this.url = '/lottery/activity/' + this.$route.params.activityInfo.activityId
      }
      this.getTableData()
    },
    customCompFunc (params) {
      let par = {
        lotteryId: params.rowData.lotteryId,
        award: params.rowData.award
      }
      this.$api.put('/lottery/' + par.lotteryId, par, msg => {
        if (msg.status === 200) {
        } else {
          this.error = msg.msg
          this.isTrue = true
        }
      })
    },
    sortChange (params) {
      if (params.height.length > 0) {
        this.tableConfig.tableData.sort(function (a, b) {
          if (params.height === 'asc') {
            return a.height - b.height
          } else if (params.height === 'desc') {
            return b.height - a.height
          } else {
            return 0
          }
        })
      }
    },
    getTableData () {
      if (localStorage.companyUser) {
        let params = new URLSearchParams()
        params.append('pageNum', this.requestPage.pageNum)
        params.append('pageSize', this.requestPage.pageSize)
        this.$api.get(this.url, params, msg => {
          if (msg.status === 200) {
            this.pageConfig.pageIndex = msg.data.pages
            this.pageConfig.pageSize = msg.data.pageSize
            this.pageConfig.total = msg.data.total
            this.tableConfig.tableData = msg.data.list
            this.tableConfig.tableData.forEach((item) => {
              let date = new Date(item.createAt)
              item.createAt = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
              date = new Date(item.drawAt)
              item.drawAt = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
            })
          } else {
          }
          this.tableConfig.columns = [
            {
              field: 'custome',
              title: '序号',
              width: 25,
              titleAlign: 'center',
              columnAlign: 'center',
              formatter: function (rowData, rowIndex, pagingIndex, field) {
                return rowIndex + 1
              },
              isResize: true
            },
            {field: 'activityName', title: '活动名', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true},
            {field: 'createAt', title: '创建时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true},
            {field: 'drawAt', title: '结束时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true},
            {field: 'nickname', title: '昵称', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true, orderBy: 'asc'},
            {field: 'phone', title: '联系方式', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true},
            {field: 'avatarUrl',
              title: '头像',
              width: 50,
              titleAlign: 'center',
              columnAlign: 'center',
              isResize: true,
              formatter: function (rowData, rowIndex, pagingIndex, field) {
                return '<img src="' + rowData.avatarUrl + '" style="width:32px;height:32px;border-radius:50%;" />'
              }},
            {field: 'award', title: '获奖名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, componentName: 'changeAward'}
          ]
        })
      }
    },
    pageChange (pageIndex) {
      if (pageIndex > this.pageConfig.total) {
        pageIndex = this.pageConfig.total
      }
      this.tableConfig.columns = []
      this.pageConfig.pageIndex = pageIndex
      this.requestPage.pageNum = pageIndex
      this.getTableData()
    },
    pageSizeChange (pageSize) {
      this.pageConfig.pageIndex = 1
      this.requestPage.pageNum = 1
      this.pageConfig.pageSize = pageSize
      this.requestPage.pageSize = pageSize
      this.getTableData()
    }
  }
}
Vue.component('changeAward', {
  template: `
    <select class="form-control" @change="change()" v-model="selected">
                      <option v-for="option in options" v-bind:value="option.value">{{option.value}}</option>
                    </select>
  `,
  data: function () {
    return {
      selected: '',
      options: [
        {value: '特等奖'},
        {value: '一等奖'},
        {value: '二等奖'},
        {value: '三等奖'},
        {value: '安慰奖'},
        {value: '参与奖'},
        {value: '其他'}
      ]
    }
  },
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  mounted: function () {
    this.loadDocSelect()
  },
  methods: {
    change () {
      this.rowData.award = this.selected
      // 参数根据业务场景随意构造
      let params = {
        type: 'change',
        index: this.index,
        rowData: this.rowData,
        field: this.field
      }
      this.$emit('on-custom-comp', params)
    },
    loadDocSelect () {
      this.selected = this.rowData.award
    }
  }
})
</script>
<style scoped>
  @import "../../../static/css/error.css";
</style>
