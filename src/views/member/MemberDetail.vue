<template>
  <div class="memberDetail">
    <Row class="firstLine">
			<Card class="rightArea clearfix">
				<p slot="title" class="lineTitle">
					<Icon type="bookmark"></Icon>Información básica
				</p>
				<div class="baseInfo">
					<Row>
						<Col span="6">
							<p>nivel de membresía：<span style="color: #ec0909">{{ getlevel(memberInfo.memberLevel) }}</span></p>
						</Col>
						<Col span="6">
							<p>estado de miembro：<span style="color: #2d8cf0">{{ !memberInfo.status ? 'normal' : 'desactivado'}}</span></p>
						</Col>
						<Col span="6">
							<p>Apodo de miembro：<span>{{ memberInfo.username }}</span></p>
						</Col>
						<Col span="6">
							<p>Identificación de usuario：<span>{{ memberInfo.id }}</span></p>
						</Col>
					</Row>
					<Row>
						<Col span="6">
							<p>nombre real：<span>{{ memberInfo.realName }}</span></p>
						</Col>
						<Col span="6">
							<p>Número de móvil del miembro：<span>{{ memberInfo.mobilePhone }}</span></p>
						</Col>
						<Col span="6">
							<p>numero de identidad：<span>{{ memberInfo.idNumber }}</span></p>
						</Col>
						<Col span="6">
							<p>Correo：<span>{{ memberInfo.email }}</span></p>
						</Col>
					</Row>
					<Row>
						<Col span="6">
							<p>tiempo de registro：<span>{{ memberInfo.registrationTime }}</span></p>
						</Col>
						<Col span="6">
							<p>Última hora de inicio de sesión：<span>{{ memberInfo.lastLoginTime }}</span></p>
						</Col>
					</Row>
				</div>
			</Card>

    </Row>
    <Row class="secLine">
      <Card>
        <p class="lineTitle" slot="title">
          <Icon type="bookmark"></Icon>Activos de usuario
        </p>

        <div class="tableWrapper">
          <Table :columns="assetColumns" :data="assetRows"></Table>
        </div>

        <Modal
					class="manualPay"
					width="400"
					v-model="ifManualPay"
					@on-ok="confrimPay"
					@on-cancel="$Message.info('Cancelado！')">
          <h3 class="header" slot="header">
            <Icon type="information-circled"></Icon>
            <span>Depósito manual</span>
          </h3>
          <p>divisa：<span>{{ payUnit }}</span></p>
          <p>dirección de recarga：<span>{{ payAddress }}</span></p>
          <p>Monto de recarga：<span><Input v-model="payAmount"></Input></span></p>
        </Modal>

        <Modal
          class="manualPay"
          width="400"
          v-model="lockCoinModal"
          @on-ok="confrimLockCoin"
          @on-cancel="$Message.info('Cancelado！')">
          <h3 class="header" slot="header">
            <Icon type="information-circled"></Icon>
            <span> encerrar</span>
          </h3>
          <p>divisa：<span>{{ lockUnit }}</span></p>

          <p>Seleccionar actividad de bloqueo：
              <Select v-model="lockedActivityId">
                <Option v-for="(item, index) in lockActivityArr" :key="item.id" :value="item.id">
                  {{ item.title }}
                </Option>
              </Select>
          </p>
          <p>Cantidad bloqueada：<br><Input v-model="lockAmount"></Input></p>
        </Modal>
      </Card>
    </Row>
    <Row class="triLine">
      <Card>
        <p class="lineTitle" slot="title">
          <Icon type="bookmark"></Icon>Registro de la transacción
        </p>

				<Row class="functionWrapper">
					<div class="searchWrapper clearfix">
						<div class="poptip">
							<span>tipo de transacción：</span>
							<Select v-model="filterSearch.type">
								<Option v-for="(item, index) in typeArr" :key="item" :value="index==15?' ':index">
									{{ item }}
								</Option>
							</Select>
						</div>
						<div class="poptip">
							<span>divisa：</span>
							<Select v-model="filterSearch.symbol">
								<Option v-for="(item, index) in allSymbol" :key="item.unit" :value="item.unit">
									{{ item.unit }}
								</Option>
							</Select>
						</div>

						<div class="poptip">
								<!-- :value="timeRange" -->
							<DatePicker type="daterange"
								@on-change="handelChange"
								placement="bottom-end"
								placeholder="Seleccione un intervalo de tiempo para buscar">
							</DatePicker>
						</div>

					<div class="btns">
            <Button type="info" size="small" @click="searchByFilter">búsqueda</Button>
          </div>

					</div>
				</Row>

        <Row>
          <Table :columns="columnsList"
                :loading="ifLoading"
                :data="trade_data">
          </Table>
        </Row>

				<Row class="pageWrapper" >
					<Page :total="totalNum"
								:current="currentPageIdx"
								@on-change="changePage"
								show-elevator>
					</Page>
				</Row>

      </Card>
    </Row>
  </div>
</template>

<script>
import { getCoinName, memberDetail, perTradeAll, manualPay, lockWallet, unlockWallet, resetMemberAddr, lockedActivityList, lockMemberCoin } from "@/service/getData";
import { setStore, getStore, removeStore } from "@/config/storage";

export default {
  data() {
    return {
			currentPageIdx: 1,
			cbData: {},
			allSymbol: [],
      lockCoinModal: false,
      lockUnit: "",
      lockAmount: "",
      lockActivityArr:[],
      lockedActivityId: null,
			filterSearch: {
				pageNo: 1,
				pageSize: 20,
				memberId: '',
				symbol: '',
				type: '',
				startTime: '',
				endTime: ''
			},
			typeArr: [
				"recargar",
				"retirar",
				"transferir",
				"comercio de divisas",
				"Compra de moneda fiduciaria",
        "Venta de moneda fiduciaria",
        "Premio Actividad",
				"Recompensa de promoción",
        "Dividendo",
				"votar",
        "recarga manual",
        "par",
        "intercambio de eventos",
        "comprar CTC",
        "venta CTC",
        "sobres rojos",
        "Recibe un sobre rojo",
        "código de retiro",
        "Recarga de código de retiro",
        "Tarifa del contrato",
        "beneficio del contrato",
        "pérdida de contrato",
        "Contrato de opciones fallido",
        "Tarifa de contrato de opciones",
        "Bonos de contratos de opciones",
        "Margen de apertura del contrato",
        "todos"
			],
			memberInfo: {},
      ifLoading: true,
      payAmount: null,
      payAddress: null,
      payUnit: null,
      ifManualPay: false,
      userID: null,
      totalNum: null,
       columnsList: [
          {
            title: 'Identificación de miembro',
            key:"memberId"
          },
          {
            title: 'tipo de transacción',
            render: (h ,obj) => {
              let  type =  obj.row.type;
              return h('span',{
              },this.typeArr[type])
            }
          },
          {
            title: 'Monto de la transacción',
            render: (h ,obj) => {
              let  amount =  obj.row.amount;
              let  symbol =  obj.row.symbol;
              return h('span',{
              },amount+' '+symbol)
            }
          },
          {
            title: 'Tarifas de transacción',
            key:"fee"
          },
          {
            title: 'Hora de transacción',
            key:"createTime"
          },

        ],
      trade_data: [],
      assetColumns: [
        {
          title: "divisa",
          width: 100,
          render: (h, param) => {
            return h('span', {}, param.row.coin.unit);
          }
        },
        {
          title: "disponible",
          key: "balance",
          render:(h,param)=>{
            return h('span', param.row.balance)
          }
        },
        {
          title: "congelar",
          // width: 100,
          key: "frozenBalance",
          render:(h,param)=>{
            return h('span', param.row.frozenBalance)
          }
        },
        {
          title: "Activos a liberar",
          // width: 100,
          key: "toReleased",
          render:(h,param)=>{
            return h('span', param.row.toReleased)
          }
        },
        {
          title: "Dirección",
          key: "address"
        },
        {
					title: "funcionar",
					width: 240,
          render: (h, param) => {
						let btnTxt = '';
						let btnType = '';
						if(!param.row.isLock) {
							btnTxt = 'cierre'
							btnType = 'error';
						}else {
							btnTxt = 'desbloquear'
							btnType = 'success';
						}
						return h('div', {}, [
              h("Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.showLockCoin(param.row.coin.unit);
                    },
                  },
                  style: {
                    marginRight: "8px"
                  }
                },
                "encerrar"
              ),
							h("Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.showManualPay(param.row);
                    }
                  },
                  style: {
                    marginRight: "8px"
                  }
                },
                "depósito"
							),
							h("Button",
								{
									props: {
										type: btnType,
										size: "small"
									},
									on: {
										click: () => {
											if(!param.row.isLock) {
												this.lockWallet(param.row.coin.unit);
											}else {
												this.unlockWallet(param.row.coin.unit);
											}
										},
									},
									style: {
										marginRight: "8px"
									}
								},
								btnTxt
							),
							h("Button",
								{
									props: {
										type: 'info',
										size: "small"
									},
									on: {
										click: () => {
											resetMemberAddr({unit: param.row.coin.unit, uid: this.userID})
											.then(res => {
												if(!res.code) {
													this.$Message.success(res.message);
												} else this.$Message.error(res.message)
												this.refreshPage();
											})
											.catch(err => console.log(err))
										}
									}
								},'restablecer dirección'
							)
						])
          }
        }
      ],
      assetRows:[]
    };
  },
  methods: {
		handelChange(timeRange) {
      if(timeRange[0]){
        this.filterSearch.startTime = timeRange[0] + " 00:00:00";
			  this.filterSearch.endTime = timeRange[1] + " 00:00:00";;
      }else{
        this.filterSearch.startTime = "";
			  this.filterSearch.endTime = "";
      }

    },
     getlevel(str){
      let memberLevelTxt = ""
      if (!str) memberLevelTxt = 'Miembro ordinario'
      else if (str===1) memberLevelTxt = 'nombre real'
      else if (str===2) memberLevelTxt = 'Certificación'
      return memberLevelTxt
    },
		searchByFilter() {
      this.currentPageIdx = 1;
      this.filterSearch.pageNo = 1;
			this.personRecode(this.filterSearch);
		},
    confrimPay() {
      let subObj = {
        unit: this.payUnit,
        uid: this.userID,
        amount: this.payAmount
      };

    manualPay(subObj)
        .then(res => {
          if (!res.code) {
            this.$Message.success(res.message);
            let obj = {
              memberId: getStore("memberID"),
              pageNo: 1,
              pageSize: 20
            };

            this.personRecode(obj);
          } else this.$Message.error(res.message);
          this.payAmount = null;
        })
        .catch(err => {
          console.log(err);
        });
    },
    lockWallet(unit){
			lockWallet({uid:this.userID,unit:unit})
			.then(res=>{
				if(res.code == 0){
					this.$Message.success(res.message);
					this.refreshPage();
				}else this.$Message.error(res.message);
			})
    },
    unlockWallet(unit){
			unlockWallet({uid:this.userID,unit:unit})
			.then(res=>{
				if(res.code == 0){
					this.$Message.success(res.message);
					this.refreshPage();
				}else this.$Message.error(res.message);
			})
    },
    showLockCoin(unit){
      this.lockCoinModal = true;
      this.lockUnit = unit;
      this.lockAmount = 0;
    },
    confrimLockCoin(){
      lockMemberCoin({memberId: this.userID, activityId: this.lockedActivityId, unit: this.lockUnit, amount: this.lockAmount}).then(res => {
        if(res.code == 0){
          this.$Message.success(res.message);
          this.lockCoinModal = false;
        }else this.$Message.error(res.message);
      });
    },
    showManualPay(wallet) {
      this.ifManualPay = true;
      this.payAddress = wallet.address;
      this.payUnit = wallet.coin.unit;
    },
    changePage(pageIndex) {
			this.filterSearch.pageNo = pageIndex;
			this.currentPageIdx = pageIndex;
      this.personRecode(this.filterSearch);
    },
    personRecode(obj) {
      this.ifLoading = true;
      console.log(obj)
      //个人交易记录
			perTradeAll(obj).then(res => {
        this.ifLoading = false;
        if (!res.code) {
          this.totalNum = (res.data && res.data.totalElements) || 1;
					this.trade_data = (res.data && res.data.content) || [];
				}
      });
    },
    refreshPage(){
			memberDetail({ id: getStore("memberID") }).then(res => {
        if (!res.code) {
					this.memberInfo = res.data.member;
					this.assetRows = res.data.list;
					this.filterSearch.memberId = getStore("memberID");
					this.userID = getStore("memberID");
					this.personRecode( this.filterSearch );
        } else   this.$Message.err("No se pudo obtener el perfil!");
      });

      // 获取锁仓列表
      lockedActivityList().then(res => {
        if(!res.code) {
          this.lockActivityArr = res.data;
        }
      });
    }
  },
  created() {
		getCoinName().then(res => {
			if(!res.code) {
				this.allSymbol = res.data;
				// this.allSymbol.push({ name: '', unit: '全部' })
			}else this.$Message.error(res.message)
		})
		.catch(err => {console.log(err)})
    this.refreshPage();
  },
};
</script>

<style lang="less" scoped>
@borderBottom: 1px solid #e2e2e2;
@thBg: rgb(228, 228, 228);
@tdthBorder: 1px solid rgb(240, 240, 240);

.firstLine,
.secLine,
.triLine {
  margin-bottom: 30px;
}

.manualPay {
  .header {
    color: #5cadff;
    text-align: center;
  }
  p {
    margin: 10px 0;
    color: #5cadff;
    font-weight: 700;
    span {
      display: inline-block;
      width: 300px;
      color: #333;
    }
  }
}

.memberDetail {
  .tableWrapper {
    margin-bottom: 30px;
  }
  padding: 10px 35px;
  .firstLine {
    table {
      th,
      td {
        padding: 3px 6px;
      }
    }
    border-bottom: @borderBottom;
    .leftArea {
      // float: left;
      padding: 10px;
      width: 120px;
      img {
        display: inline-block;
        width: 100%;
        height: 70px;
        background: #03a9f4;
      }
      .level {
        margin: auto;
        width: 65px;
        padding: 2px;
        text-align: center;
        color: #fff;
        border-radius: 10px;
        background: #f44336;
      }

      .rightArea {
        // float: left;
        table {
          font-size: 14px;
          background-color: @thBg;
          th {
            padding: 0 40px;
          }
          td {
            padding: 5px 40px;
          }
        }
      }
    }
    .bottomLine {
      table {
        font-size: 15px;
        th {
          padding: 5px 15px;
          border: @tdthBorder;
          background: @thBg;
        }
        td {
          padding: 5px 15px;
          border: @tdthBorder;
          background: #fff;
        }
      }
      .leftArea {
        float: left;
      }
      .rightArea {
        padding-right: 100px;
        float: right;
      }
    }
  }
  .secLine {
    border-bottom: @borderBottom;

    .tableWrapper {
      td {
        padding: 5px;
        border: @tdthBorder;
      }
      td.name {
        width: 100px;
        background: @thBg;
      }
      td.value {
        width: 480px;
        background: #fff;
      }
    }
  }

  .triLine {
    .tableWrapper {
      text-align: right;
      .ivu-page {
        padding: 25px;
      }
    }
  }
  .lineTitle {
    padding: 20px;
    padding-left: 0;
    font-size: 14px;
    .ivu-icon-bookmark {
      margin-right: 5px;
      font-size: 20px;
      vertical-align: middle;
    }
  }
}
</style>
