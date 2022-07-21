<template>
    <div >
      <Card>
        <p slot="title">
          Gestión de departamentos
          <Button type="primary" size="small" @click="refreshPageManual">
            <Icon type="refresh"></Icon>
            actualizar
          </Button>
        </p>

        <Row class="functionWrapper">
          <div class="btnsWrapper clearfix">
            <Button type="primary" @click="addDepartBtn">Agregar departamento</Button>
          </div>
        </Row>

        <Modal
          class="addDepartModal"
          v-model="showAddDepart"
          title="Agregar departamento"
          @on-ok="addDepart">

          <p><span>Nombre de Departamento <i>*</i>：</span><Input v-model="departName"></Input></p>
          <p><span>ID de líder：</span><Input v-model="leaderID"></Input></p>
          <p><span>Departamento Descripción：</span><Input type="textarea" v-model="departDscrp"> </Input></p>

        </Modal>

        <Row >
          <!-- @on-selection-change="selected" -->
          <Table 
          :columns="column_frist" 
          :data="userpage" 
          :loading="ifLoading"
          border>
          </Table>
        </Row>

        <Modal
          class="addDepartModal departDetailModal"
          v-model="showDepartDetail"
          title="Detalles del Departamento"
          @on-ok="updateDepart"
          @on-cancel="$Message.info('Cancelado！')">

          <p><span><em>cuello</em>ID：</span><Input v-model="departmentDetail.leaderId"></Input></p>
          <p><span><em>Departamento</em>门：</span><Input v-model="departmentDetail.name"></Input></p>
          <p><span>tiempo de actualizacion：</span><Input disabled v-model="departmentDetail.updateTime"></Input></p>
          <p><span>tiempo de creación：</span><Input disabled v-model="departmentDetail.createTime"></Input></p>
          <p><span><em>preparar</em>Nota：</span><Input type="textarea" v-model="departmentDetail.remark"></Input></p>

        </Modal>

        <Modal
        v-model="ifDelete"
        title="eliminar departamento"
        @on-ok="confirmDel"
        @on-cancel="$Message.info('已取消！')">
        <p>si eliminar el elemento seleccionado?</p>
       </Modal>

       <Row class="pageWrapper" >
          <Page :total="totalNum" 
            style='margin-top:8px' 
            :current="currentPageIdx"   
            @on-change="changePage" 
            show-elevator></Page>
        </Row> 
        

      </Card>
    </div>
</template>

<script>

import { departmentManage, addAuditDepart, departDetail, delDepart } from '@/service/getData'

export default {
  data() {
    return {
      totalNum: null,
      currentPageIdx: 1,
      ifLoading: true,
      ifDelete: false,
      delDepartID: null,

      deleteArr: [],
      departmentID: null,
      departmentDetail: {},
      showDepartDetail: false,
      leaderID: null,
      showAddDepart: false,
      departName: null,
      departDscrp: null,
      
      column_frist: [
        // {
        //   type: 'selection',
        //   width: 80,
        //   align: 'center'
        // },
        {
          title: 'ID',
          key: 'id',
          width: 80
        },
        {
          title: 'name',
          key: 'name'
        },
        {
          title: 'createTime',
          key: 'createTime'
        },
        {
          title: 'remark',
          key: 'remark'
        },
         {
          title: 'funcionar',
          render: (h, obj) => {
            return ('div', [
              h('Button',{
                 props: {
                   type: 'info',
                   size: 'small'
                 },
                 style: {
                   'marginRight': '5px'
                 },
                 on: {
                   click: () => {
   
                     this.showDepartDetail = true;
   
                     this.departmentID = obj.row.id;
   
                     departDetail({ departmentId: obj.row.id })
                     .then( res => {
                       if(!res.code) {
                         console.log(res.data);
                         this.departmentDetail = res.data;
                         
                       }else this.$Message.error('Error al obtener datos！')
                     })
   
                   }
                 }
               },'Ver/edición'),
                h('Button',{
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.ifDelete = true;
                      this.delDepartID = obj.row.id;
                    }
                  }
                }, 'Eliminar')

            ])
          
          }
        },
      ],  
      userpage: []
    }
  },

  methods: {
    changePage() {
      this.freshPage({ pageNo: this.currentPageIdx, pageSize: 20 })
    },
    confirmDel() {
      delDepart({id: this.delDepartID})
        .then( res => {
        if(!res.code) {
          this.freshPage();
          this.$Message.success(res.message);
        }else this.$Message.error(res.message);
      })
    },
    addDepartBtn() {
      this.showAddDepart = true;
    },
    updateDepart() {
      if(this.departmentDetail.name === '' || !this.departmentDetail.name) {
        this.$Message.warning('El nombre del departamento no puede estar vacío！');
      }else{

        addAuditDepart(this.departmentDetail)
        .then( res => {
          if (!res.code) {
            this.$Message.success(res.message);
            this.freshPage();
          }else this.$Message.error(res.message);
            
        })
      }
    },
    addDepart() {
      if(this.departName === '' || !this.departName) {
        this.$Message.warning('El nombre del departamento no puede estar vacío！');
      }else{

        let updateObj = {
          name: this.departName, 
          leaderId: this.leaderID,
          remark: this.departDscrp
        }

        addAuditDepart(updateObj)
        .then( res => {
          if (!res.code) {
            this.departName = null;
            this.leaderID = null;
            this.departDscrp = null;

            this.$Message.success(res.message);
            this.freshPage();
          }else{
            this.$Message.error(res.message);
          }
        })
      }

    },
    refreshPageManual() {
      this.freshPage();
    },
    freshPage(obj) {
      this.ifLoading = true;
      departmentManage(obj)
      .then( res => {
        if(!res.code){
          this.userpage =  res.data.content;
          this.ifLoading = false;
          this.totalNum = res.data.totalElements;
        }else this.$Message.error(res.message)
      }, err => {
        console.log(err);
      })
    }
  },
  created () {
    this.freshPage();
  }
}
</script>

<style lang="less" scoped>

  .addDepartModal{
    p{
      position: relative;
      padding-left: 85px;
      margin-bottom: 10px;
      width: 400px;

      span{
        position: absolute;
        top: 0;
        left: 0;
        font-size: 14px;
        line-height: 32px;
        i{
          font-size: 16px;
          font-weight: 700;
          color: #ec0909;
        }
      }
    }
  }
  .departDetailModal{
    p{
      span {
        em{
          font-style: normal;
          letter-spacing: 28px;
        }
      }
    }
  }
</style>