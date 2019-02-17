<template>
  <main class="app-content">
    <div class="app-title">
      <div>
        <h1><i class="fa fa-th-list"></i> 活动信息</h1>
        <p>活动信息</p>
      </div>
      <ul class="app-breadcrumb breadcrumb side">
        <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
        <li class="breadcrumb-item">Tables</li>
        <li class="breadcrumb-item active"><router-link :to="{name: 'activity'}">活动信息</router-link></li>
      </ul>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="tile">
          <div class="tile-body">
              <v-table
                       is-horizontal-resize
                       is-vertical-resize
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
      time: new Date(),
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
      error: ''
    }
  },
  methods: {
    loadDoc () {
      this.getTableData()
    },
    customCompFunc (params) {
      if (params.type === 'delete') {
        this.$api.delete('/activity/' + params.rowData.activityId, '', msg => {
          if (msg.status === 200) {
            this.$delete(this.tableConfig.tableData, params.index)
          } else {
            this.isTrue = true
            this.error = msg.msg
          }
        })
      }
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
        this.$api.get('/activity/all', params, msg => {
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
              width: 10,
              titleAlign: 'center',
              columnAlign: 'center',
              formatter: function (rowData, rowIndex, pagingIndex, field) {
                return rowIndex + 1
              },
              isResize: true
            },
            {field: 'activityName', title: '活动名', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true, orderBy: 'asc', componentName: 'activityInfo'},
            {field: 'createAt', title: '创建时间', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true},
            {field: 'drawAt',
              title: '结束时间',
              width: 200,
              titleAlign: 'center',
              columnAlign: 'center',
              isResize: true
            },
            {field: 'activityId', title: '参与者名单', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, componentName: 'activityLottery'},
            {field: 'activityId', title: '获奖者名单', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, componentName: 'activityWinner'},
            {field: 'operation', title: '删除', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, componentName: 'deleteOperation'}
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
Vue.component('activityInfo', {
  template: `
  <router-link :to="{name:'activityfrom', params: {'activityInfo': this.rowData}}"><i class="icon fa fa-circle-o"></i> &nbsp;&nbsp;{{rowData.activityName}}</router-link>
  `,
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
  }
})
Vue.component('activityLottery', {
  template: `
  <router-link :to="{name:'participant', params: {'activityInfo': this.rowData}}"><i class="icon fa fa-circle-o"></i> &nbsp;&nbsp;参与者名单</router-link>
  `,
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
  }
})
Vue.component('activityWinner', {
  template: `
  <router-link :to="{name:'lottery', params: {'activityInfo': this.rowData}}"><i class="icon fa fa-circle-o"></i> &nbsp;&nbsp;获奖者名单</router-link>
  `,
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
  }
})
Vue.component('deleteOperation', {
  template: ` <span>
        <a href="" @click.stop.prevent="deleteRow(rowData,index)" style="width: 32px;height: 32px;display: inline-block;background-image: url(../../../static/img/delete.png);margin-top: 5px"></a>
        </span>`,
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
  methods: {
    deleteRow () {
      // 参数根据业务场景随意构造
      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      }
      this.$emit('on-custom-comp', params)
    }
  }
})
</script>

<style scoped>
  @import "../../../static/css/error.css";
</style>
