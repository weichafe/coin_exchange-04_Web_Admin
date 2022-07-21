<template>
  <div>
      <Row>
          <Card>
                <p slot="title">
                  gestión de eventos
                    <Button type="primary" size="small" @click="refreshPageManual">
                        <Icon type="refresh"></Icon>actualizar
                    </Button>
                </p>

                <Row class="functionWrapper">
                    <div class="btnsWrapper clearfix">
                        <Button type="primary" @click="newActivity">Nuevo evento</Button>
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
                <div style="font-size:12px;">
                  <p>Nota: El nuevo evento en esta página es solo para agregar todos los eventos para su visualización, el negocio del evento real no tiene nada que ver con esto.</p>
                  <p>Condiciones previas para el lanzamiento del evento：</p>
                  <p>[Comprar] y [Asignación] deben establecer la actividad al crear un nuevo par de transacciones en [Configuración de monedas]</p>
                  <p>[Posicionar y compartir] y [Suscripción] necesitan crear un nuevo evento en [Gestión de eventos]</p>
                  <br>
                  <p>1. Compra instantánea: Todos los usuarios pueden [Comprar] la cantidad especificada de monedas. El primer par comercial en línea puede especificar esta categoría. Es necesario determinar el contenido de la actividad al agregar un nuevo par comercial en [Configuración de moneda moneda].</p>
                  <p>2. Asignación: todos los usuarios [comparten equitativamente] el número especificado de monedas. El primer par comercial en línea puede especificar esta categoría. Es necesario determinar el contenido de la actividad al agregar un nuevo par comercial en [Configuración de moneda].</p>
                  <p>3. Posición compartida: una actividad que se puede iniciar en cualquier momento. Antes del evento, se tomará una instantánea de la posición del usuario y la cantidad especificada de monedas se dividirá según la posición del usuario.</p>
                  <p>4. Suscripción: generalmente realice el primer tipo de actividades, perteneciente al tipo de suscripción IEO, todos los usuarios obtienen una cantidad específica de monedas</p>
                </div>
          </Card>

      </Row>
      <Modal
            class="auditModel"
            v-model="showProgressModel"
            title="Por favor ingrese el progreso"
            width="550"
            @on-cancle="progress = ''"
            @on-ok="submitProgress">
            <Input v-model="progress" type="text" placeholder="Introduzca un valor de progreso"></Input>
     </Modal>
     <Modal
            class="auditModel"
            v-model="showDetailModel"
            title="Detalles de participación"
            width="750"
            @on-cancle=""
            @on-ok="">
            <Row>
                <Table
                    :columns="columnsDetail"
                    :data="orderList"
                    border
                    :loading="ifLoading">
                </Table>
            </Row>
     </Modal>
  </div>
</template>

<script>

  import { activityList, addActivity, modifyActivity, modifyActivityProgress,activityOrderList, distributeOrder, BASICURL } from '@/service/getData';
  import { getStore, removeStore, setStore } from '@/config/storage';

  export default{
    data () {
      return {
        loginPassModal: false,
        showProgressModel: false,
        showDetailModel: false,
        progress: "",
        loginPW: '',
        activityForm:{
            title: "",
            detail: "",
            activityLink: "",
            noticeLink: "",
            settings: "",
            step: "0",
            type: "1",
            status: "0",
            imageUrl: ""
        },
        id: null,
        type: 0,
        ifShowPercentCircle: false,
        percentage: 0,
        picUrl: "",
        picUrlIcon: false,
        basicUrl: BASICURL,
        filterSearch: {
            pageNo: 1,
            pageSize: 20
        },
        currentPageIdx: 1,
        ifLoading: true,
        pageNum: null,
        orderList: [],
        columnsDetail: [
          {
            title: 'ID',
            key:"memberId",
            width: 120
          },
          {
            title: 'amount',
            key:"amount"
          },
          {
            title: 'freezeAmount',
            key:"freezeAmount"
          },
          {
            title: 'turnover',
            key:"turnover",
            width: 140
          },
          {
            title: '状态',
            render: (h ,obj) => {
              let state =  obj.row.state;
              let txt = "临时";
              let color = "#000";
              if(state == 1) {txt = "no comercializado";color = "#FF0000";}
              if(state == 2) {txt = "Trato hecho";color = "#19be6b";}
              if(state == 3) {txt = "revocado";color = "#EEE";}

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
                if(obj.row.state == 1){
                  disabled = false;
                }
                let btnText = "Distribuir monedas de actividad";
                if(this.type == 5) {
                  btnText = "Implementar mineros";
                }
                if(this.type == 6) {
                  btnText = "aceptar bloquear";
                }
                return h("div", [
                  h(
                    "Button",
                    {
                      props: {type: "success",size: "small",disabled: disabled},
                      style: {marginRight: "5px"},
                      on: {
                        click: () => {
                          let param = {};
                          param["oid"] = obj.row.id;
                          console.log(param);
                          distributeOrder(param).then( res => {
                            if(!res.code) {
                                this.$Message.success(res.message);
                                this.getDetailOrderList();
                            }else{
                                this.$Message.error(res.message);
                            }
                          });
                        }
                      }
                    },
                    btnText
                  )
                ]);
              }
           }
        ],
        list: [],
        columns: [
          {
            title: 'título',
            key:"title",
            width: 300
          },
          {
            title: 'Miniatura',
            width:70,
            render:(h, obj) => {
              let smallImageUrl = obj.row.smallImageUrl;
              return  h('img',{
                attrs: {src: smallImageUrl},
                style: {height: "45px", padding:"5px 0px"}
              },"");
            }
          },
          {
            title: 'mostrar',
            width: 60,
            render: (h ,obj) => {
              let status =  obj.row.status;
              let txt = status == 1 ? "显示":"隐藏";
              let color = status == 1 ? "#19be6b":"#FF0000";
              return h('span',{
                style:{
                  color: color
                }
              },txt)
            }
          },
          {
            title: 'estado',
            width: 75,
            render: (h ,obj) => {
              let step =  obj.row.step;
              let txt = "筹备中";
              let color = "#2db7f5";
              if(step == 1) {txt = "进行中";color="#19be6b";}
              if(step == 2) {txt = "派发中";color="#F90";}
              if(step == 3) {txt = "已结束";color="#AFAFAF";}

              return h('span',{
                style:{
                  color: color
                }
              },txt)
            }
          },
          {
            title: 'invitación de primera clase',
            key:"leveloneCount",
            width: 60
          },
          {
            title: 'escribe',
            width: 115,
            render: (h ,obj) => {
              let type =  obj.row.type;
              let txt = "Actividad desconocida";
              if(type == 1) txt = "Primer lanzamiento (compra instantánea)";
              if(type == 2) txt = "Primero en línea (dividido en partes iguales)";
              if(type == 3) txt = "compartir posición";
              if(type == 4) txt = "Suscripción gratuita";
              if(type == 5) txt = "Suscripción a máquina de minería";
              if(type == 6) txt = "Actividad de bloqueo";
              return h('span',{
              },txt)
            }
          },
          {
            title: '量/价',
            width: 160,
            render: (h ,obj) => {
              return h('span',{
              },obj.row.totalSupply + " / " + obj.row.price + obj.row.acceptUnit)
            }
          },
          {
            title: 'startTime',
            key:"startTime",
            width: 140,
            render: (h ,obj) => {
              let sTime = obj.row.startTime.substr(0, 10) + " " + obj.row.startTime.substr(11, 8);
              let curTime = new Date().Format("yyyy-MM-dd HH:mm:ss");
              let text = "即将开始";
              if(sTime < curTime) {
                text = "已开始";
              }
              return h('span',{
              },sTime + text);
            }
          },
          {
            title: 'endTime',
            key:"endTime",
            width: 140,
            render: (h ,obj) => {
              let eTime = obj.row.endTime.substr(0, 10) + " " + obj.row.endTime.substr(11, 8);
              let curTime = new Date().Format("yyyy-MM-dd HH:mm:ss");
              let color = "#19be6b";
              let text = "未结束";
              if(eTime < curTime) {
                text = "已结束";
                color = "#000";
              }
              return h('span',{
                style:{
                  color: color
                }
              },eTime + text);
            }
          },
          {
            title: 'Enlace de anuncio',
            width: 90,
            render: (h ,obj) => {

              return h('a',{
                attrs: {
                    href: obj.row.noticeLink,
                    target: "_blank"
                }
              },"Ver anuncio");
            }
          },
          {
            title: 'Enlace del evento',
            width: 90,
            render: (h ,obj) => {

              return h('a',{
                attrs: {
                    href: obj.row.activityLink,
                    target: "_blank"
                }
              },"página del evento");
            }
          },
          {
            title: 'tiempo de creación',
            key:"createTime",
            width: 140
          },
          {
              title: "funcionar",
              key: "xx",
              fixed: 'right',
              width: 220,
              render: (h, obj) => {
                let showProgress = "("+obj.row.progress+")";
                let disabled = true;
                if(obj.row.type == 3 || obj.row.type == 4 || obj.row.type == 5 || obj.row.type == 6){
                  disabled = false;
                }
                return h("div", [
                  h(
                    "Button",
                    {
                      props: {type: "info",size: "small"},
                      style: {marginRight: "5px"},
                      on: {
                        click: () => {
                          removeStore('manageID');
                          setStore('manageID',  obj.row.id);
                          this.$router.push('/activity/activity/addActivity');
                        }
                      }
                    },
                    "Revisar"
                  ),
                  h(
                    "Button",
                    {
                      props: {type: "error",size: "small"},
                      style: {marginRight: "5px"},
                      on: {
                        click: () => {
                          this.showProgressModel = true;
                          this.id = obj.row.id;
                          this.progress = obj.row.progress;
                        }
                      }
                    },
                    "进度"+showProgress
                  ),
                  h(
                    "Button",
                    {
                      props: {type: "success",size: "small",disabled: disabled},
                      style: {marginRight: "5px"},
                      on: {
                        click: () => {
                          this.showDetailModel = true;
                          this.id = obj.row.id;
                          this.type = obj.row.type;
                          this.getDetailOrderList();
                        }
                      }
                    },
                    "Detalles de participación"
                  )
                ]);
              }
           }
        ]
      }
    },
    methods: {
      getDetailOrderList(){
        activityOrderList(this.id)
        .then(res => {
          this.orderList = res.data;
        });
      },
      submitProgress(){
        let param = {};
        param["id"] = this.id;
        param["progress"] = this.progress;
        modifyActivityProgress(param).then( res => {
          if(!res.code) {
                this.showProgressModel = false;
                this.$Message.success("修改成功");
                this.refreshPage(1);
          }else{
                this.$Message.error(res.message)
          }
        })
      },
      newActivity(){
        removeStore('manageID');
        this.$router.push('/activity/activity/addActivity');
      },
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
        activityList(this.filterSearch).then( res => {
          if(!res.code) {
                this.ifLoading = false;
                this.pageNum = (res.data && res.data.totalElements) || 1;
                this.list = (res.data && res.data.content) || [];
          }else{
                this.$Message.error(res.message)
          }
        })
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
