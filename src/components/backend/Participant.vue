<template>
  <main class="app-content">
    <div class="app-title">
      <div>
        <h1><i class="fa fa-th-list"></i> 公司HR信息</h1>
        <p>公司HR信息</p>
      </div>
      <ul class="app-breadcrumb breadcrumb side">
        <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
        <li class="breadcrumb-item">Tables</li>
        <li class="breadcrumb-item active"><router-link :to="{name: 'participant'}">参与者信息</router-link></li>
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
                       :cell-edit-done="cellEditDone"
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
      this.url = '/participant/all'
      if (this.$route.params.activityInfo) {
        this.url = '/participant/all/' + this.$route.params.activityInfo.activityId
      }
      this.getTableData()
    },
    cellEditDone (newValue, oldValue, rowIndex, rowData, field) {
      this.tableConfig.tableData[rowIndex][field] = newValue
      if (newValue !== oldValue) {
        let par = Object.assign({}, this.tableConfig.tableData[rowIndex])
        par.updateAt = null
        par.createAt = null
        if (field === 'phone') {
          if (!(/^1[34578]\d{9}$/.test(newValue))) {
            this.tableConfig.tableData[rowIndex][field] = oldValue
            this.isTrue = true
            this.error = '手机号码格式有误'
            return ''
          }
        } else {
          par.phone = null
        }
        this.$api.put('/participant/' + par.participantsId, par, msg => {
          if (msg.status === 200) {
          } else {
            this.isTrue = true
            this.error = msg.msg
            this.tableConfig.tableData[rowIndex][field] = oldValue
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
        this.$api.get(this.url, params, msg => {
          if (msg.status === 200) {
            this.pageConfig.pageIndex = msg.data.pages
            this.pageConfig.pageSize = msg.data.pageSize
            this.pageConfig.total = msg.data.total
            this.tableConfig.tableData = msg.data.list
          } else {
          }
          this.tableConfig.columns = [
            {
              field: 'custome',
              title: '序号',
              width: 30,
              titleAlign: 'center',
              columnAlign: 'center',
              formatter: function (rowData, rowIndex, pagingIndex, field) {
                return rowIndex + 1
              },
              isResize: true
            },
            {field: 'activityId', title: '活动序号', width: 40, titleAlign: 'center', columnAlign: 'center', isResize: true},
            {field: 'username', title: '姓名', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true, orderBy: 'asc'},
            {field: 'phone', title: '手机号码', width: 30, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true},
            {field: 'nickname', title: '昵称', width: 30, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true},
            {field: 'avatarUrl',
              title: '头像',
              width: 40,
              titleAlign: 'center',
              columnAlign: 'center',
              isResize: true,
              formatter: function (rowData, rowIndex, pagingIndex, field) {
                return '<img src="' + rowData.avatarUrl + '" style="width:32px;height:32px;border-radius:50%;" />'
              }
            },
            {field: 'type', title: '部门/学校', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true}
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
</script>

<style scoped>
  @import "../../../static/css/error.css";
</style>
