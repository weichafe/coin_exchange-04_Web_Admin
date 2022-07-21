<template>
  <div>
    <Card>
      <p slot="title">
        ayudar a administrar
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          actualizar
        </Button>
      </p>

      <Row class="manageRow clearfix">
        <div class="manageWrapper">
          <Button type="error" @click="delManage">Eliminar</Button>
          <Button type="info" @click="addManage">Añadir</Button>
        </div>
      </Row>

      <Modal
      class="manageModal"
      v-model="manageModal"
      title="Añadir gestión"
      width="430">
        <p slot="header" style="color:#5cadff;text-align:center">
          <Icon type="information-circled"></Icon>
          <span style="padding-left: 5px;" >Añadir gestión</span>
        </p>

        <p> <span>título<i>*</i>：</span>
          <Input v-model="manageTitle" ></Input>
        </p>
        <div><span>Clasificación<i>*</i>：</span>
          <Select v-model="manageClass" style="width:200px">
            <Option v-for=" item in manageClassArr" v-model="item.status" :key="item.status">
              {{ item.klassName }}
            </Option>
          </Select>
        </div>

        <p><span>la direccion del mapa<i>*</i>：</span>
          <Input v-model="imgUrl" ></Input>
        </p>
        <p><span>clasificar：</span>
          <Input v-model="sort" ></Input>
        </p>
        <div>idioma：
          <RadioGroup v-model="lang">
            <Radio label="zh_CN">
              <span>Chino</span>
            </Radio>
            <Radio label="en_US">
              <span>English</span>
            </Radio>
            <Radio label="ja_JP">
              <span>japonés</span>
            </Radio>
            <Radio label="ko_KR">
              <span>coreano</span>
            </Radio>
            <Radio label="de_DE">
              <span>Alemán</span>
            </Radio>
            <Radio label="fr_FR">
              <span>Francés</span>
            </Radio>
            <Radio label="it_IT">
              <span>Italia</span>
            </Radio>
            <Radio label="es_ES">
              <span>España</span>
            </Radio>
            <Radio label="zh_HK">
              <span>Chino tradicional</span>
            </Radio>
          </RadioGroup>
        </div>
        <div><span>tiempo de liberación<i>*</i>：</span>
          <DatePicker v-model="createTime"
                      type="date" format="yyyy-MM-dd HH:mm:ss"
                      placeholder="Por favor selecciona una hora" style="width: 200px">
          </DatePicker>
        </div>

        <div><span>ya sea para mostrar<i>*</i>：</span>
          <Select v-model="ifSHow" style="width:200px">
            <Option v-for=" item in ifShowArr" v-model="item.status" :key="item.status">
              {{ item.klassName }}
            </Option>
          </Select>
        </div>

        <div slot="footer" style="color:#5cadff;text-align:right">
          <div v-if="!ifUpdateBtn">
            <Button type="text" @click="cancelAdd">Cancelar</Button>
            <Button type="info" @click="addManage">Confirmar</Button>
          </div>

          <div v-if="ifUpdateBtn">
            <Button type="text" @click="cancelAdd">Cancelar</Button>
            <Button type="info" @click="updateManage">Renovar</Button>
          </div>
        </div>

      </Modal>

      <Row class="test">
        <Table border
              :columns="columns_first"
              :data="helpManageArr"
              :loading="ifLoading"
              @on-selection-change="select">

        </Table>
      </Row>

      <Row class="pageWrapper">
        <Page :total="totalNum"
          class="buttomPage"
          :current="current"
          @on-change="changePage"
          show-elevator>
        </Page>
      </Row>


      <Modal
        v-model="ifDelete"
        title="Eliminar"
        @on-ok="confirmDel"
        @on-cancel="cancelDel">
        <p>si eliminar lo seleccionado{{ selectedArr.length }}artículo</p>
      </Modal>


    </Card>
  </div>
</template>

<script>

import qs from 'qs';
import { stickTopHelp, helpManage, addHelpManage, delHelpManage, helpManageDetail, updateHelpManage,helpDown  } from '@/service/getData';
import { formatDate } from '@/caculate/caculate';
import { setStore, removeStore } from '@/config/storage';


  export default {
    data () {
      return {
        currentPageIdx: 1,
        delArr: [],
        ifDelete: false,
        ifLoading: true,
        id: null,
        ifUpdateBtn: false,
        selectedArr: [],
        helpManageArr: [],
        current: 1,
        totalNum: null,
        manageModal: false,
        manageTitle: null,
        manageClass: null,
        manageClassArr: [
          { status: 0,  klassName: 'Guía para principiantes' },
          { status: 1,  klassName: 'problema comun' },
          { status: 2,  klassName: 'Guía de recarga' },
          { status: 3,  klassName: 'Guía comercial' }
        ],
        imgUrl: null,
        createTime: null,
        lang: "zh_CN",
        sort: null,
        ifSHow: null,
        ifShowArr: [
          { status: 0,  klassName: 'mostrar' },
          { status: 1,  klassName: 'No mostrar' },
        ],
        columns_first: [
          {
            type: 'selection',
            width: 60
          },
          {
           	title: 'id',
            key: 'id',
            width: 60
          },
          {
           	title: 'title',
						key: 'title',
          },
           {
           	title: 'Clasificación',
            render: (h, obj) => {
              let text = null;
              let status = obj.row.sysHelpClassification*1;
              if (status === 0) text = 'Guía para principiantes';
              else if (status === 1) text = 'problema comun';
              else if (status === 2) text = 'Guía comercial';
              else if (status === 3) text = 'Información de moneda';
              else if (status === 4) text = 'Cotizar tecnología';
              else if (status === 5) text = 'acuerdo de términos';
              else if (status === 6) text = 'otro';

              return h ( 'span', {
              }, text)
            }
          },
          {
            title: 'lang',
            key: 'lang',
            width: 60
          },
          {
            title: 'sort',
            key: 'sort',
            width: 60
          },
           {
           	title: 'status',
            key: 'status',
            width:60,
            render: (h, obj) => {
              let text = null;
              if (obj.row.status===0) text = 'Sí';
              else text = 'no';
              return h ( 'span', {
              }, text)
            }
          },
           {
           	title: 'parte superior',
            // key: 'isTop',
            width:60,
            render: (h, obj) => {
              let text = null;
              if (obj.row.isTop==="0") text = 'Sí';
              else text = 'no';
              return h ( 'span', {
              }, text)
            }
          },
          {
            title: 'createTime',
            key: 'createTime',
          },
					{
           	title: 'funcionar',
            	render: (h, obj) => {
                return h ('div',[
                    h('Button', {
                      props: {
                        type: 'info',
                        size: 'small'
											},
											style: {
												'marginRight': '5px'
											},
                      on: {
                        click:() => {
                          removeStore('manageID');
                          setStore('manageID',  obj.row.id);
                          this.$router.push('/content/helpManage/addhelpmanage');
                        }
                      }
										},'Ver/edición'),
										h('Button', {
                      props: {
                        type: 'error',
                        size: 'small'
                      },
                      on: {
                        click:() => {
													stickTopHelp({id: obj.row.id})
													.then(res => {
														if(!res.code) {
															this.$Message.success(res.message);
															this.refreshPage();
														}else this.$Message.error(res.message)
													})
													.catch(err => console.log(err))
                        }
                      }
                    },'parte/superior'),
										h('Button', {
                      props: {
                        type: 'error',
                        size: 'small'
                      },
                      style:{
                        marginLeft:'6px',
                      },
                      on: {
                        click:() => {
													helpDown({id: obj.row.id})
													.then(res => {
														if(!res.code) {
															this.$Message.success(res.message);
															this.refreshPage();
														}else this.$Message.error(res.message)
													})
													.catch(err => console.log(err))
                        }
                      }
                    },'desprender')



                  ])
              }
          },
			  ],
      }
    },
    methods: {
      refreshPageManual() {
        this.ifLoading = true;
        this.refreshPage({ pageNo: this.currentPageIdx, pageSize: 20 });
      },
      confirmDel() {
         let delArr = [];
        this.selectedArr.forEach( item => {
          delArr.push(item.id);
        })
        let formatArr =  qs.stringify({ ids: delArr }, { arrayFormat: 'repeat' });

        delHelpManage({ ids: delArr })
        .then( res => {
          this.ifDelete = false;
          if(!res.code) {
            this.refreshPage({ pageNo: 1, pageSize: 20 });
            this.$Message.success('eliminado con éxito!');
          }else{
            this.$Message.error('no se pudo eliminar!');
          }
        })
      },
      cancelDel() {
        this.$Message.success('Cancelado!');
      },
      updateManage() {

        let updateObj = {
          id:  this.id,
          title: this.manageTitle,
          sysHelpClassification: this.manageClass,
          imgUrl: this.imgUrl,
          status: this.ifSHow,
          lang: this.lang,
          createTime: formatDate(this.createTime)
        }
        // console.log(this.createTime);
        // console.log(formatDate(this.createTime))

        updateHelpManage(updateObj)
        .then(res => {
          if (!res.code) {
            this.manageModal = false;
            this.$Message.success('actualización completada!');
            this.refreshPage();
          }else{
             this.$Message.error('Anormal!');
          }
        })
      },
      delManage() {
        if(!!this.selectedArr.length) {
          this.ifDelete = true;
        }else this.$Message.warning("Seleccione lo que desea eliminar！")
      },
      cancelAdd() {
        this.manageModal = false;
      },
      showModel() {
        this.manageModal = true;
      },
      addManage() {
        removeStore('manageID');
        this.$router.push('/content/helpManage/addhelpmanage');
      },
      select(selection) {
        this.selectedArr = selection;
      },
      changePage(pageIndex) {
        this.ifLoading = true;
        this.currentPageIdx = pageIndex;
        this.refreshPage({ pageNo: pageIndex, pageSize: 20 });
      },
      refreshPage(obj) {
        removeStore('manageID');
        helpManage(obj)
        .then( res => {
          this.ifLoading = false;
          this.helpManageArr = res.data.content;
          this.totalNum = res.data.totalElements;
        })
      }
    },
    created() {
      this.refreshPage({ pageNo: 1, pageSize: 20 });
    }
  }
</script>

<style lang="less" scoped>
  .manageRow{
    height: 45px;
  }
  .pageWrapper{
    text-align: right;
    margin: 25px;
  }
  .manageWrapper{
    text-align: right;
    Button {
      margin-right: 10px;
    }
  }

  .manageModal{
    p,div{
      margin-bottom: 10px;
    }
    p,div{
      span {
        display: inline-block;
        font-size: 15px;
        text-align: right;

        i{
          color: red;
          font-weight: 700;
          font-style: normal;
        }
      }
    }
    .ivu-input-wrapper.ivu-input-type{
      width: 70%;
    }
  }
</style>
<style lang="less">
.test .ivu-table-wrapper .ivu-table.ivu-table-border .ivu-table-body .ivu-table-tbody .ivu-table-row {
.ivu-table-cell{
  padding:0
}
}
</style>

