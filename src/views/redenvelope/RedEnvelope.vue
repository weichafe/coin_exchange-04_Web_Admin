<template>
  <div>
      <Row>
          <Card>
                <p slot="title">
                  Gestión de paquetes rojos
                    <Button type="primary" size="small" @click="refreshPageManual">
                        <Icon type="refresh"></Icon>actualizar
                    </Button>
                </p>

                <Row class="functionWrapper">
                    <div class="btnsWrapper clearfix">
                        <Button type="primary" @click="newRedEnvelope">Nuevo sobre rojo</Button>
                    </div>
                </Row>
                <Row>
                    <Table
                        :columns="columns"
                        :data="list"
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
            v-model="showDetailModel"
            title="领取详情"
            width="500"
            @on-cancle=""
            @on-ok="">
            <Row>
                <Table
                    :columns="columnsDetail"
                    :data="receiveList"
                    border
                    :loading="ifLoading">
                </Table>
            </Row>
            <div class="pageWrapper">
                <Page
                    :total="pageNumDetail"
                    :current="currentPageIdxDetail"
                    @on-change="changePageDetail"
                    size="small"
                    show-elevator>
                </Page>
            </div>
     </Modal>
     <div class="circleWrapper" v-show="uploading">
      <p>carga de imagen...</p>
     </div>
  </div>
</template>

<script>
  import { envelopeList, envelopeDetail, envelopeReceiveDetail, envelopeAdd, envelopeModify, BASICURL } from '@/service/getData';
  import { getStore, removeStore, setStore } from '@/config/storage';

  export default {
    data () {
      return {
        uploading: false,
        showDetailModel: false,
        envelopeForm: {
            type: "0",
            invite: "0",
            plateform: "0",
            maxRand: "",
            totalAmount: "",
            count: "",
            logoImage: "",
            bgImage: "",
            name: "",
            detail: "",
            unit: "",
            expiredHours: ""
        },
        id: null,
        basicUrl: BASICURL,
        filterSearch: {
            pageNo: 1,
            pageSize: 20
        },
        filterSearchDetail: {
            envelopeId: null,
            pageNo: 0,
            pageSize: 30
        },
        currentPageIdx: 1,
        currentPageIdxDetail: 1,
        ifLoading: true,
        ifLoadingDetail: true,
        pageNum: null,
        pageNumDetail: null,
        columns: [
          {
            title: 'ID',
            key:"memberId",
            width: 50
          },
          {
            title: 'envelopeNo',
            key:"envelopeNo",
            width: 135
          },
          {
            title: 'unit',
            width: 60,
            key:"unit"
          },
          {
            title: 'name',
            width: 200,
            key:"name"
          },
          {
            title: 'memberId',
            key:"memberId",
            width: 85
          },
          {
            title: 'Tipo de paquete rojo',
            width: 60,
            render: (h ,obj) => {
              let type =  obj.row.type;
              let txt = "aleatorio";
              let color = "#000";
              if(type == 0) {txt = "aleatorio";color = "#FF0000";}
              if(type == 1) {txt = "cuota";color = "#19be6b";}

              return h('span',{
                style:{
                  color: color
                }
              },txt)
            }
          },
          {
            title: 'totalAmount',
            width: 60,
            key:"totalAmount"
          },
          {
            title: 'count',
            width: 60,
            key:"count"
          },
          {
            title: 'maxRand',
            width: 95,
            key:"maxRand"
          },
          {
            title: 'receiveCount',
            width: 75,
            key:"receiveCount"
          },
          {
            title: 'receiveAmount',
            width: 120,
            key:"receiveAmount"
          },
          {
            title: 'invitación a dividir',
            width: 60,
            render: (h ,obj) => {
              let invite =  obj.row.invite;
              let txt = "否";
              let color = "#000";
              if(invite == 0) {txt = "否";color = "#FF0000";}
              if(invite == 1) {txt = "是";color = "#19be6b";}

              return h('span',{
                style:{
                  color: color
                }
              },txt)
            }
          },
          {
            title: 'Sobres rojos plataforma',
            width: 60,
            render: (h ,obj) => {
              let plateform =  obj.row.plateform;
              let txt = "否";
              let color = "#000";
              if(plateform == 0) {txt = "否";color = "#FF0000";}
              if(plateform == 1) {txt = "是";color = "#19be6b";}

              return h('span',{
                style:{
                  color: color
                }
              },txt)
            }
          },
          {
            title: 'estado',
            width: 80,
            render: (h ,obj) => {
              let state =  obj.row.state;
              let txt = "领取中";
              let color = "#000";
              if(state == 1) {txt = "已领完";color = "#19be6b";}
              if(state == 2) {txt = "过期";color = "#FF0000";}

              return h('span',{
                style:{
                  color: color
                }
              },txt)
            }
          },
          {
              title: "funcionar",
              key: "xx",
              fixed: 'right',
              width: 150,
              render: (h, obj) => {
                let showProgress = "("+obj.row.progress+")";
                let disabled = true;
                if(obj.row.state == 0){
                  disabled = false;
                }
                return h("div", [
                  h(
                    "Button",
                    {
                      props: {type: "success",size: "small",disabled: disabled},
                      style: {marginRight: "5px"},
                      on: {
                        click: () => {
                          removeStore('manageID');
                          setStore('manageID',  obj.row.id);
                          this.$router.push('/envelope/addEnvelope');
                        }
                      }
                    },
                    "Revisar"
                  ),
                  h(
                    "Button",
                    {
                      props: {type: "primary", size: "small"},
                      style: {marginRight: "5px"},
                      on: {
                        click: () => {
                          this.filterSearchDetail.envelopeId = obj.row.id;
                          this.filterSearchDetail.pageNo = 0;
                          this.showDetailModel = true;
                          this.refreshPageDetail();
                        }
                      }
                    },
                    "Obtén detalles"
                  ),
                ]);
              }
          }
        ],
        list: [],
        columnsDetail: [
          {
            title: 'memberId',
            width: 100,
            key:"memberId"
          },
          {
            title: 'userIdentify',
            width: 120,
            key:"userIdentify"
          },
          {
            title: 'amount',
            width: 120,
            key:"amount"
          },
          {
            title: 'es un robot',
            render: (h ,obj) => {
              let cate =  obj.row.cate;
              let txt = "否";
              let color = "#000";
              if(cate == 0) {txt = "否";color = "#FF0000";}
              if(cate == 1) {txt = "是";color = "#19be6b";}

              return h('span',{
                style:{
                  color: color
                }
              },txt)
            }
          }
        ],
        receiveList: []
      }
    },
    methods: {
      ifUploading(val) {
        this.uploading = val;
      },
      refreshPageManual() {
        this.currentPageIdx = 1;
        for(let key in this.filterSearch) {
            this.filterSearch[key] = '';
        }
        this.filterSearch.pageNo = 1;
        this.filterSearch.pageSize = 10;
        this.refreshPage();
      },
      changePage(pageIndex) {
        this.currentPageIdx = pageIndex;
        this.filterSearch.pageNo = pageIndex;
        this.refreshPage();
      },
      changePageDetail(pageIndex) {
        this.currentPageIdxDetail = pageIndex;
        this.filterSearchDetail.pageNo = pageIndex;
        this.refreshPageDetail();
      },
      refreshPage() {
        this.ifLoading = true;
        envelopeList(this.filterSearch).then( res => {
          if(!res.code) {
                this.ifLoading = false;
                this.pageNum = (res.data && res.data.totalElements) || 1;
                this.list = (res.data && res.data.content) || [];
          }else{
                this.$Message.error(res.message)
          }
        })
      },
      refreshPageDetail() {
        this.ifLoadingDetail = true;
        envelopeReceiveDetail(this.filterSearchDetail).then( res => {
          if(!res.code) {
              this.ifLoadingDetail = false;
              this.pageNumDetail = (res.data && res.data.totalElements) || 1;
              this.receiveList = (res.data && res.data.content) || [];
          }else{
              this.$Message.error(res.message);
          }
        })
      },
      newRedEnvelope(){
        removeStore('manageID');
        this.$router.push('/envelope/addEnvelope');
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
<style lang="less" scoped>
  .auditModel{
    ul {
      padding-left: 20px;
      li {
        position: relative;
        margin-bottom: 18px;
        span{
          position: absolute;
          top: 0;
          left: 0;
          display: inline-block;
          width: 95px;
          text-align: right;
          i{
            font-size: 14px;
            font-weight: 700;
            color: #ec0909;
          }
        }
        p{
          padding-left: 100px;
          min-width: 200px;
          line-height: 32px;
          em{
            position: static;
            color: unset;
          }
        }
      }
    }
  }
  .setting-title{
    font-size:14px;font-weight:bold;padding-bottom:20px;
  }
.auditModel ul li>em{
    position: absolute;
    bottom: -15px;
    font-size:10px;
    margin-left: 100px;
    line-height:12px;
    font-style: normal;
    color: #ec0909;
  }
</style>
