<template>
	<div>
		<Card>
			<p slot="title">
        actualizar
				<Button type="primary" size="small" @click="refreshPageManual">
					<Icon type="refresh"></Icon>
          actualizar
				</Button>
			</p>
			<Row class="functionWrapper">
				<div class="btnsWrapper clearfix ">
					<Button type="error" @click="ifPassAll(true)">La verificación con un clic falló</Button>
					<Button type="success" @click="ifPassCoin = true">Lanzamiento de monedas con un solo clic</Button>
				</div>

				<div class="searchWrapper clearfix">
					<div class="poptip">
						<Poptip trigger="hover" content="Por favor ingrese apodo/nombre real para buscar" placement="bottom-start">
							<Input placeholder="Por favor ingrese apodo/nombre real Buscar" v-model="filterSearch.account" />
							</Input>
						</Poptip>
					</div>

					<div class="poptip">
						<Poptip trigger="hover" content="Ingrese su identificación de miembro para buscar" placement="bottom-start">
							<Input placeholder="Ingrese su identificación de miembro para buscar" v-model="filterSearch.memberId" />
							</Input>
						</Poptip>
					</div>

					<div class="poptip">
						<Poptip trigger="hover" content="Ingrese la dirección de retiro para buscar" placement="bottom-start">
							<Input placeholder="Ingrese la dirección de retiro para buscar" v-model="filterSearch.address" />
							</Input>
						</Poptip>
					</div>

					<div class="poptip">
						<Poptip trigger="hover" content="Ingrese la unidad monetaria para buscar" placement="bottom-start">
							<Input placeholder="Ingrese la unidad monetaria para buscar" v-model="filterSearch.unit" />
							</Input>
						</Poptip>
					</div>

					<div class="poptip">
						<Poptip trigger="hover" content="Por favor, introduzca el número de seguimiento para buscar" placement="bottom-start">
							<Input placeholder="Por favor, introduzca el número de seguimiento para buscar" v-model="filterSearch.orderSn" />
							</Input>
						</Poptip>
					</div>
					<br>
					<div class="poptip">
						<span>método de retiro：</span>
						<Select v-model="filterSearch.isAuto">
							<Option v-for="item in orderAutoArr" :value="item.status" :key="item.status">{{ item.text }}</Option>
						</Select>
					</div>

					<div class="poptip">
						<span>estado：</span>
						<Select v-model="filterSearch.status">
							<Option v-for="item in orderStatusArr" :value="item.status" :key="item.status">{{ item.text }}</Option>
						</Select>
					</div>

					<div class="btns">
						<Button type="info" size="small" @click="searchByFilter">búsqueda</Button>
					</div>

				</div>
			</Row>

			<Row class="tableWrapper">
				<Table :columns="columns_first" :data="userpageCopy" border :loading="ifLoading" @on-selection-change="selectionChange">
				</Table>
			</Row>
			<Row class="pageWrapper">
				<Page :total="pageNum" :current="currentPageIndex" @on-change="changePage" show-elevator>
				</Page>
			</Row>

			<Modal width="400" title="Lanzamiento de monedas con un solo clic" v-model="ifPassCoin" @on-ok="confrimPass">
				<Row>
					<p>Sugerencia: está realizando una operación de depósito con una sola tecla, esta función requiere una contraseña de inicio de sesión</p>
				</Row>
				<br>
				<Form v-model="passAllCoin">
					<FormItem>
						<Input type="password" placeholder="Por favor, introduzca su contraseña..." v-model="passAllCoin.password"></Input>
					</FormItem>
					<FormItem>
						<Input placeholder="Por favor ingrese agua corriente..." type="textarea" v-model="passAllCoin.transactionNum"></Input>
					</FormItem>
				</Form>
			</Modal>

		</Card>
	</div>
</template>

<script>
import {withdrawManage,auditNoPass,passCoin} from "@/service/getData";
import { setStore, getStore, removeStore } from "@/config/storage";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      ifPassCoin: false,
      passAllCoin: {
        transactionNumber: "",
        password: ""
      },
      filterSearch: {
        pageNo: 1,
        pageSize: 20,
        account: "",
        memberId: "",
        address: "",
        unit: "",
        isAuto: "",
        status: "",
        orderSn: ""
        // direction: '1',
        // property: 'status'
      },
      currentPageIndex: 1,

      ifLoading: true,
      pageNum: null,
      orderAutoArr: [
        { status: 0, text: "Revisión manual de retiros" },
        { status: 1, text: "Retiro automático" },
        { status: "", text: "todos" }
      ],
      orderStatusArr: [
        { status: 0, text: "bajo revisión" },
        { status: 1, text: "esperando el lanzamiento" },
        { status: 2, text: "fallar" },
        { status: 3, text: "éxito" },
        { status: "", text: "todos" }
      ],
      userpage: [],
      userpageCopy: [],
      selectedNumArr: [],
      columns_first: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "coin",
          key: "coin",
          width: 100,
          render: (h, obj) => {
            let unit = obj.row.unit;
            return h("span", {}, unit);
          }
        },
        {
          title: "address",
          key: "address",
          width: 180
        },
        {
          title: "Memo",
          key: "remark",
          width: 100
        },
        {
          title: "createTime",
          key: "createTime",
          width: 140
        },
        {
          title: "totalAmount",
          key: "totalAmount",
          width: 100
        },
        {
          title: "arrivedAmount",
          key: "arrivedAmount",
          width: 100
        },
        {
          title: "status",
          key: "status",
          width: 100,
          render: (h, obj) => {
            let status = obj.row.status * 1;
            let statusInner = String;

            if (status === 0) statusInner = "revisión pendiente";
            else if (status === 1) statusInner = "esperando el lanzamiento";
            else if (status === 2) statusInner = "fallar";
            else if (status === 3) statusInner = "éxito";

            return h("span", {}, statusInner);
          }
        },
        {
          title: "método de retiro",
          width: 110,
          render: (h, obj) => {
            const isAuto =
              obj.row.isAuto * 1 === 0 ? "Revisión manual de retiros" : "Retiro automático";

            return h("span", {}, isAuto);
          }
        },
        {
          title: "fee",
          key: "fee",
          width: 100,
          render: (h, obj) => {
            let fee = obj.row.fee;
            let unit = obj.row.unit;

            return h("span", {}, fee + unit);
          }
        },
        {
          title: "TXID",
          key: "transactionNumber",
          width: 180
        },
        {
          title: "memberUsername",
          key: "memberUsername",
          width: 100
        },
        {
          title: "memberId",
          key: "memberId",
          width: 100
        },
        {
          title: "funcionar",
          fixed: 'right',
          width: 100,
          key: "action",
          render: (h, obj) => {
            let status = obj.row.status;
            let statusInner = String;
            let btnType = "info";

            if (status === 0) {
              statusInner = "审核";
              btnType = "info";
            } else {
              statusInner = "查看";
              btnType = "success";
            }

            return h(
              "Button",
              {
                props: {
                  type: btnType,
                  size: "small"
                },
                on: {
                  click: () => {
                    Cookies.set("financePage", this.filterSearch.pageNo);
                    this.$router.push({ path: "/finance/auditdetail" });
                    removeStore("userDetails");
                    setStore("userDetails", obj.row);
                  }
                }
              },
              statusInner
            );
          }
        }
      ]
    };
  },
  methods: {
    confrimPass() {
      this.ifPassAll(false);
    },
    checkable() {
	  this.userpageCopy = [];
	  console.log(this.userpage)
      this.userpage.forEach(item => {
        if (item.status !== 1) {
			item._disabled = true;
		}else{
			item._disabled = false;
		}
        this.userpageCopy.push(item);
      });
    },

    ifPassAll(bol) {
      if (!this.selectedNumArr.length) {
        this.$Message.warning("Ningún elemento seleccionado");
      } else {
        let fn = "";
        let obj = { ids: this.selectedNumArr };
        if (bol) {
          fn = auditNoPass;
        } else {
          fn = passCoin;
          Object.assign(obj, this.passAllCoin);
		}
        fn(obj).then(res => {
          if (!res.code) {
            this.$Message.success(res.message);
          } else this.$Message.error(res.message);
          withdrawManage({ pageNo: this.pageIndex, pageSize: 20 }).then(res => {
            this.userpage = res.data.content;
            this.checkable();
          });
        });
      }
    },
    selectionChange(selection) {
      this.selectedNumArr = [];
      selection.forEach(item => {
        this.selectedNumArr.push(item.id);
      });
    },
    searchByFilter() {
      let reg = /\D/;
      if (reg.test(this.filterSearch.memberId)) {
        this.$Message.warning("Ingrese la identificación de miembro correcta");
        return;
      }
      this.resetTableContain(1);
    },
    refreshPageManual() {
      this.currentPageIndex = 1;
      for (let val in this.filterSearch) {
        this.filterSearch[val] = "";
      }
      this.resetTableContain(1);
    },
    changePage(pageIndex) {
      this.currentPageIndex = pageIndex;
      this.resetTableContain(pageIndex);
    },
    refreshPage(obj = {}) {
      this.ifLoading = true;
      withdrawManage(obj).then(res => {
        if (!res.code) {
          this.ifLoading = false;
          this.userpage = res.data.content;
          this.pageNum = res.data.totalElements;
          this.userpageCopy = [...this.userpage];
          this.checkable();
		} else{
			this.$Message.error(res.message);
		}
      });
    },
    resetTableContain(pageNo) {
      this.filterSearch.pageNo = pageNo;
      this.filterSearch.pageSize = 10;
      this.refreshPage(this.filterSearch);
    }
  },
  created() {
    if (!!Cookies.get("financePage")) {
      this.currentPageIndex = this.filterSearch.pageNo = Number(Cookies.get("financePage"));
    }
    this.refreshPage(this.filterSearch);
    Cookies.remove("financePage");
  }
};
</script>

<style scoped>
</style>
