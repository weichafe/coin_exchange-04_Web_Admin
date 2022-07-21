<template>
  <div>
      <Row>
          <Card>
                <p slot="title">
                C2C Gestión de aceptantes
                    <Button type="primary" size="small" @click="refreshPageManual">
                        <Icon type="refresh"></Icon>actualizar
                    </Button>
                </p>
                <Row>
                    <Table
                        :columns="columns"
                        :data="acceptorList"
                        border
                        :loading="ifLoading">
                    </Table>
                </Row>
                <div class="pageWrapper">
                    <Page
                        :total="pageNum"
                        :current="currentPageIdx"
                        @on-change="changePage"
                        show-elevator>
                    </Page>
                </div>
          </Card>
      </Row>
      <Modal
            class="auditModel"
            v-model="loginPassModal"
            title="Por favor, introduzca su contraseña"
            width="350"
            @on-cancle="loginPW = ''"
            @on-ok="confirmLoginPass">
            <Input v-model="loginPW" type="password" placeholder="Por favor, introduzca su contraseña"></Input>
       </Modal>
  </div>
</template>

<script>

  import { ctcAcceptorList, ctcAcceptorSwitch, BASICURL } from '@/service/getData';
  import { getStore, removeStore, setStore } from '@/config/storage';

  export default{
    data () {
      const self = this;
      return {
        loginPassModal: false,
        btnEvent: "",
        btnEventString: "",
        loginPW: '',
        basicUrl: BASICURL,
        filterSearch: {
            pageNo: 1,
            pageSize: 20
        },
        currentPageIdx: 1,
        ifLoading: true,
        pageNum: null,
        acceptorList: [],
        selectedAcceptor: null,
        columns: [
          {
            title: "ID",
            key: "id",
            minWidth: 50,
            render: (h, params) => {
              return h("span", {}, params.row.id);
            }
          },
          {
            title: "createTime",
            key: "createTime",
            minWidth: 145,
            render: (h, params) => {
              return h("span", {}, params.row.member.realName + "-" + params.row.member.mobilePhone);
            }
          },
          {
            title: "createTime",
            key: "createTime",
            minWidth: 140,
            render: (h, params) => {
              return h("span", {}, params.row.member.bankInfo.bank + "(" + params.row.member.bankInfo.branch + ")");
            }
          },
          {
            title: "createTime",
            key: "createTime",
            minWidth: 140,
            render: (h, params) => {
              return h("span", {}, params.row.member.bankInfo.cardNo);
            }
          },
          {
            title: "createTime",
            key: "createTime",
            minWidth: 140,
            render: (h, params) => {
              return h("span", {}, params.row.member.alipay.aliNo);
            }
          },
          {
            title: "createTime",
            key: "createTime",
            minWidth: 140,
            render: (h, params) => {
              return h("span", {}, params.row.member.wechatPay.wechat);
            }
          },
          {
            title: "status",
            key: "status",
            minWidth: 95,
            render: (h, params) => {
              let sta = "inválido";
              if(params.row.status == 1){
                sta = "inválido";
              }
              return h("span", {}, sta);
            }
          },
          {
            title: "Salida/entrada de USDT",
            key: "usdtOut",
            minWidth: 140,
            render: (h, params) => {
              return h("span", {}, params.row.usdtOut + " / " + params.row.usdtIn);
            }
          },
          {
            title: "Entrada/salida CNY",
            key: "cnyOut",
            minWidth: 140,
            render: (h, params) => {
              return h("span", {}, params.row.cnyOut + " / " + params.row.cnyIn);
            }
          },
          {
            title: "funcionar",
            key: "id",
            align: 'center',
            fixed: 'right',
            minWidth: 100,
            render: (h, params) => {
              if(params.row.status == 0) { // 切换为有效
                return h("div", [
                  h(
                    "Button",
                    {
                      props: {type: "success",size: "small"}, style: {marginRight: "10px"},
                      on: {
                        click: () => {
                          this.loginPassModal = true;
                          this.selectedAcceptor = params.row;
                        }
                      }
                    },
                    "有效"
                  )
                ]);
              }
              if(params.row.status == 1){ // 切换为无效
                return h("div", [
                  h(
                    "Button",
                    {
                      props: {type: "error",size: "small"}, style: {marginRight: "10px"},
                      on: {
                        click: () => {
                          this.loginPassModal = true;
                          this.selectedAcceptor = params.row;
                        }
                      }
                    },
                    "inválido"
                  )
                ]);
              }
            }
          }
        ]
      }
    },
    methods: {
      refreshPageManual() {
                this.currentPageIdx = 1;
                for(let key in this.filterSearch) {
                    this.filterSearch[key] = '';
                }
                this.filterSearch.pageNo = 1;
                this.filterSearch.pageSize = 20;
                this.refreshPage(this.filterSearch);
      },
      changePage(pageIndex) {
                this.currentPageIdx = pageIndex;
                this.filterSearch.pageNo = pageIndex;
                this.refreshPage(this.filterSearch)
      },
      refreshPage(obj) {
        this.ifLoading = true;
        ctcAcceptorList(this.filterSearch).then( res => {
          if(!res.code) {
                this.ifLoading = false;
                this.pageNum = (res.data && res.data.totalElements) || 1;
                this.acceptorList = (res.data && res.data.content) || [];
          }else{
                this.$Message.error(res.message)
          }
        })
      },
      closeDetail(){
        this.showDetailModal = false;
      },
      confirmLoginPass(){
        if(this.loginPW == "") {
          this.$Message.error("Por favor, introduzca su contraseña")
          return;
        }
        let params = {};
        params.id = this.selectedAcceptor.id;
        params.password = this.loginPW;

        this.$Spin.show();
        ctcAcceptorSwitch(params).then( res => {
            if(!res.code) {
                  this.$Message.success("Cambio de estado exitoso！");
                  this.refreshPage(this.filterSearch);
                  this.loginPassModal = false;
            }else{
                  this.$Message.error(res.message)
            }
            this.$Spin.hide();
          });
      }
    },
    created () {
      this.refreshPage();
    }
  }
</script>

<style scoped>
  .ivu-upload{
    display: inline-block;
  }
</style>
