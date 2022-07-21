<template>
    <div >
      <Card>
        <p slot="title">
          Gestión de usuarios
          <Button type="primary" size="small" @click="refreshPageManual">
            <Icon type="refresh"></Icon>
            actualizar
          </Button>
        </p>

        <Row class="functionWrapper">
          <div class="btnsWrapper clearfix">
            <Button type="error" @click="ifDelete = true">eliminar usuarios</Button>
            <Button type="primary" @click="addUserBtn">Agregar usuario</Button>
          </div>
        </Row>

        <Row >
          <Table 
            :columns="column_frist" 
            :data="userpage" 
            :loading="ifLoading"
            @on-selection-change="select"
            border>
          </Table>
        </Row>

        <Row class="pageWrapper">
          <Page :total="pageNum" 
                class="buttomPage"
                @on-change="changePage"
								:current="currentPageIdx"
                show-elevator></Page>
        </Row>

        <Modal
          v-model="ifDelete"
          title="eliminar usuarios"
          @on-ok="confirmDel"
          @on-cancel="$Message.info('Cancelado！')">
          <p>si eliminar lo seleccionado{{ delArr.length }}artículo?</p>
       </Modal>
      </Card>
    </div>
</template>

<script>
import { setStore, getStore, removeStore } from '@/config/storage';
import { queryEmployee, addAuditEmployee, employeeDetail, delEmployee, departmentManage } from "@/service/getData";


export default {
  data() {
    return {
      currentPageIdx: 1,
      pageNum: null,
      delArr: [],

      ifLoading: true,
      ifDelete: false,

      departName: null,

      column_frist: [
        {
          type: "selection",
          width: 80,
          align: "center"
        },
        {
          title: "ID",
          key: "id",
          width: 80
        },
        {
          title: "nombre de usuario",
          key: "username"
        },
        {
          title: "nombre real",
          key: "realName"
        },
        {
          title: "Departamento",
          render: (h, obj) => {
            let departName = obj.row.department.name;
            return "span", {}, departName;
          }
        },
        {
          title: "roleName",
          key: "roleName"
        },
        {
          title: "mobilePhone",
          key: "mobilePhone"
        },
        {
          title: "email",
          key: "email"
        },
        {
          title: "enable",
          key: "enable",
          render: (h, obj) => {
            let enable = obj.row.enable;
            let status = "";
            let btnType = "success";
            if (!enable) {
              status = "normal";
            } else {
              status = "desactivado ";
              btnType = "error";
            }
            return h(
              "Button",
              {
                props: {
                  type: btnType,
                  size: "small"
                }
              },
              status
            );
          }
        },

        {
          title: "funcionar",
          render: (h, obj) => {
            return (
              "div",
              [
                h(
                  "Button",
                  {
                    props: {
                      type: "info",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        removeStore('employeeID');
												setStore('employeeID', obj.row.id);
                        this.$router.push("/system/employee/auditEmployee");
                      }
                    }
                  },
                  "查看 / 编辑"
                )
              ]
            );
          }
        }
      ],
      userpage: []
    }
  },
  methods: {
    changePage(pageIndex) {
      this.currentPageIdx = pageIndex;
      this.freshPage({ pageNo: pageIndex, pageSize: 20 });
    },
    select(solutions) {
      this.delArr = [];
      solutions.forEach(item => {
        this.delArr.push(item.id);
      });
      console.log(solutions);
    },
    addUserBtn () {
      this.$router.push("/system/employee/auditEmployee");
    },
    confirmDel() {
      delEmployee({ ids: this.delArr })
      .then(res => {
        if (!res.code) {
          this.freshPage();
          this.$Message.success("eliminado con éxito！");
        } else this.$Message.error("no se pudo eliminar！");
      })
      .catch( err =>{ console.log(err)})
    },
   
    refreshPageManual() {
      this.freshPage({ pageNo: this.currentPageIdx, pageSize: 20 });
    },
    freshPage(obj) {
      this.ifLoading = true;
      queryEmployee(obj)
      .then(res => {
        console.log(res);
        
        if (!res.code) {
          this.userpage = res.data.content;
          this.ifLoading = false;
          this.pageNum = res.data.totalElements;
        } else this.$Message.error(res.message);
      })
      .catch( err => console.log( err ));
    }
  },
  created() {
    removeStore('employeeID');
    this.freshPage({ pageNo: 1, pageSize: 20 });
  }
};
</script>

<style lang="less" scoped></style>