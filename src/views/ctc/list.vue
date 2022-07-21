<template>
  <div>
      <Row>
          <Card>
                <p slot="title">
                  Gestión de pedidos C2C
                    <Button type="primary" size="small" @click="refreshPageManual">
                        <Icon type="refresh"></Icon>actualizar
                    </Button>
                </p>
                <Row>
                    <Table
                        :columns="columns"
                        :data="orderList"
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
            <p style="font-size: 16px;color:#FF0000;margin-bottom: 15px;">{{btnEventString}}</p>
            <Input v-model="loginPW" type="password" placeholder="Por favor, introduzca su contraseña"></Input>
       </Modal>

       <Modal
            class="auditModel"
            v-model="showDetailModal"
            title="Detalles del pago"
            width="450"
            @on-cancle=""
            @on-ok="closeDetail">
            <p v-if="detailOrder.direction == 0">nombre real de la cuenta：{{detailOrder.realName}}(Aceptador)</p>
            <p v-if="detailOrder.direction == 1">nombre real de la cuenta：{{detailOrder.realName}}(usuario)</p>
            <div v-if="detailOrder.payMode == 'bank'">
              <p>banco depositario：{{detailOrder.bankInfo.bank}}</p>
              <p>sucursal de apertura de cuenta：{{detailOrder.bankInfo.branch}}</p>
              <p>número de tarjeta bancaria：{{detailOrder.bankInfo.cardNo}}</p>
            </div>
            <div v-if="detailOrder.payMode == 'alipay'">
              <p>cuenta Alipay：{{detailOrder.alipay.aliNo}}</p>
              <p>Código de recibo：</p>
              <div style="width: 100%;text-align:center;"><img style="width: 300px;height:400px;" :src="detailOrder.alipay.qrCodeUrl"></img></div>
            </div>
            <div v-if="detailOrder.payMode == 'wechatpay'">
              <p>cuenta WeChat：{{detailOrder.wechatPay.wechat}}</p>
              <p>Código de recibo：</p>
              <div style="width: 100%;text-align:center;"><img :src="detailOrder.wechatPay.qrWeCodeUrl" style="width: 300px;height:400px;"></img></div>
            </div>
       </Modal>
  </div>
</template>

<script>

  import { ctcOrderList, ctcOrderDetail, modifyActivity, ctcOrderConfirm, ctcOrderPay, ctcOrderCancel, ctcOrderComplete, BASICURL } from '@/service/getData';
  import { getStore, removeStore, setStore } from '@/config/storage';

  export default{
    data () {
      const self = this;
      return {
        loginPassModal: false,
        showDetailModal: false,
        btnEvent: "",
        btnEventString: "",
        loginPW: '',
        basicUrl: BASICURL,
        filterSearch: {
            pageNo: 1,
            pageSize: 20
        },
        detailOrder: {},
        currentPageIdx: 1,
        ifLoading: true,
        pageNum: null,
        orderList: [],
        columns: [
          {
            type: "index",
            width: 30,
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  skin: params.row.skin,
                  rows: params.row.detail
                }
              });
            }
          },
          {
            title: "createTime",
            key: "createTime",
            minWidth: 140,
            render: (h, params) => {
              return h("span", {}, params.row.createTime);
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
            title: "orderSn",
            key: "orderSn",
            minWidth: 155,
            render: (h, params) => {
              return h("span", {}, params.row.orderSn);
            }
          },
          {
            title: "status",
            key: "status",
            minWidth: 95,
            render: (h, params) => {
              let sta = "Sin orden";
              if(params.row.status == 1 && params.row.direction == 0){
                return h("div", {}, [
                        h("span", {}, "已接单")
                      ]);
              }
              if(params.row.status == 1 && params.row.direction == 1){
                return h("div", {}, [
                        h("span", {}, "已接单")
                      ]);
              }
              if(params.row.status == 2) sta = "★已付款★";
              if(params.row.status == 3) sta = "交易完成";
              if(params.row.status == 4) sta = "已取消";
              return h("span", {}, sta);
            }
          },
          {
            title: "direction",
            key: "direction",
            minWidth: 70,
            render: (h, params) => {
              let dir = params.row.direction == 0 ? "买入" : "卖出";
              const txtColor = params.row.direction == 0 ? "#42b983" : "#FF0000";
              return h("div", {
                      style:{
                        color: txtColor
                      }
                    }, [
                      h("span", {}, dir)
                    ]);
            }
          },
          {
            title: "amount (USDT)",
            key: "amount",
            minWidth: 115,
            render: (h, params) => {
              return h("span", {}, params.row.amount);
            }
          },
          {
            title: "price(CNY)",
            key: "price",
            minWidth: 105,
            render: (h, params) => {
              return h("span", {}, params.row.price);
            }
          },
          {
            title: "money(CNY)",
            key: "money",
            minWidth: 105,
            render: (h, params) => {
              return h("span", {}, params.row.money.toFixed(2));
            }
          },
          {
            title: "payMode",
            key: "payMode",
            minWidth: 95,
            render: (h, params) => {
              let pt = "银行卡";
              if(params.row.payMode == "alipay"){
                pt = "支付宝";
              }
              if(params.row.payMode == "wechatpay"){
                pt = "微信支付";
              }
              return h("span", {}, pt);
            }
          },
          {
            title: "realName",
            key: "realName",
            minWidth: 155,
            render: (h, params) => {
              let name = params.row.realName;
              if(params.row.direction == 0){
                name = name+"("+"承兑商)";
              }
              if(params.row.direction == 1){
                name = name+"("+"用户)";
              }
              return h("span", {}, name);
            }
          },
          {
            title: "id",
            key: "id",
            align: 'center',
            fixed: 'right',
            minWidth: 245,
            render: (h, params) => {
              let detailShow = "inline-block";
              let confirmShow = "none";
              let payShow = "none";
              let completeShow = "none";
              let cancelShow = "none";
              if(params.row.status == 0) { // 待接单
                confirmShow = "inline-block";
              }
              if(params.row.status == 1){ // 已接单
                cancelShow = "inline-block";
                if(params.row.direction == 1){ // 用户卖出，则后台可标记付款
                  payShow = "inline-block";
                }
              }
              if(params.row.status == 2){ // 已付款
                completeShow = "inline-block";
                cancelShow = "inline-block";
              }
              return h("div", [
                h(
                  "Button",
                  {
                    props: {type: "info",size: "small"},
                    style: {marginRight: "10px"},
                    on: {
                      click: () => {
                        this.detailOrder = params.row;
                        this.showDetailModal = true;
                      }
                    }
                  },
                  "Detalles del pago"
                ),
                h(
                  "Button",
                  {
                    props: {type: "primary",size: "small"},
                    style: {marginRight: "10px", display: confirmShow},
                    on: {
                      click: () => {
                        this.detailOrder = params.row;
                        this.btnEvent = "confirm";
                        this.btnEventString = "¿Estás seguro de que quieres tomar el pedido?？ ======> ¥ " + params.row.money;
                        this.loginPassModal = true;
                      }
                    }
                  },
                  "Pedidos"
                ),
                h(
                  "Button",
                  {
                    props: {type: "warning",size: "small"},
                    style: {marginRight: "10px", display: payShow},
                    on: {
                      click: () => {
                        this.detailOrder = params.row;
                        this.btnEvent = "pay";
                        this.btnEventString = "确定标记已付款吗？ ======> ¥ " + params.row.money;
                        this.loginPassModal = true;
                      }
                    }
                  },
                  "marcar el pago"
                ),
                h(
                  "Button",
                  {
                    props: {type: "success",size: "small"},
                    style: {marginRight: "10px", display: completeShow},
                    on: {
                      click: () => {
                        this.detailOrder = params.row;
                        this.btnEvent = "complete";
                        this.btnEventString = "¿Estás seguro de que has terminado de liberar/deducir monedas? ======> ¥ " + params.row.money;
                        this.loginPassModal = true;
                      }
                    }
                  },
                  "Completa el lanzamiento de monedas."
                ),
                h(
                  "Button",
                  {
                    props: {type: "error",size: "small"},
                    style: {marginRight: "10px", display: cancelShow},
                    on: {
                      click: () => {
                        this.detailOrder = params.row;
                        this.btnEvent = "cancel";
                        this.btnEventString = "¿Estás seguro de que quieres forzar la cancelación del pedido? ======> ¥ " + params.row.money;
                        this.loginPassModal = true;
                      }
                    }
                  },
                  "Forzar cancelación"
                )
              ]);
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
                this.filterSearch.pageSize = 10;
                this.refreshPage(this.filterSearch);
      },
      changePage(pageIndex) {
                this.currentPageIdx = pageIndex;
                this.filterSearch.pageNo = pageIndex;
                this.refreshPage(this.filterSearch)
      },
      refreshPage(obj) {
        this.ifLoading = true;
        ctcOrderList(this.filterSearch).then( res => {
          if(!res.code) {
                this.ifLoading = false;
                this.pageNum = (res.data && res.data.totalElements) || 1;
                this.orderList = (res.data && res.data.content) || [];
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
        params.id = this.detailOrder.id;
        params.password = this.loginPW;
        if(this.btnEvent == "confirm") {
          this.$Spin.show();
          ctcOrderConfirm(params).then( res => {
            if(!res.code) {
                  this.$Message.success("El pedido se ha realizado correctamente, complete el pago lo antes posible.")
                  this.refreshPage(this.filterSearch);
                  this.loginPassModal = false;
            }else{
                  this.$Message.error(res.message)
            }
            this.$Spin.hide();
          });
        }
        if(this.btnEvent == "pay") {
          this.$Spin.show();
          ctcOrderPay(params).then( res => {
            if(!res.code) {
                  this.$Message.success("Marcar pago exitoso！")
                  this.refreshPage(this.filterSearch);
                  this.loginPassModal = false;
            }else{
                  this.$Message.error(res.message)
            }
            this.$Spin.hide();
          });
        }
        if(this.btnEvent == "complete") {
          this.$Spin.show();
          ctcOrderComplete(params).then( res => {
            if(!res.code) {
                  this.$Message.success("Completa con éxito el lanzamiento de monedas.！")
                  this.refreshPage(this.filterSearch);
                  this.loginPassModal = false;
            }else{
                  this.$Message.error(res.message)
            }
            this.$Spin.hide();
          });
        }
        if(this.btnEvent == "cancel") {
          this.$Spin.show();
          ctcOrderCancel(params).then( res => {
            if(!res.code) {
                  this.$Message.success("Cancelar pedido con éxito！")
                  this.refreshPage(this.filterSearch);
                  this.loginPassModal = false;
            }else{
                  this.$Message.error(res.message)
            }
            this.$Spin.hide();
          });
        }
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
