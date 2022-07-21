<template>
	<div>
		<Card>
			<p slot="title">
        Gestión de pedidos
				<Button type="primary" size="small" @click="refreshPageManual">
					<Icon type="refresh"></Icon> actualizar
				</Button>
			</p>
			<Row class="functionWrapper">
				<!-- <div class="btnsWrapper clearfix">
					<a :href="aLink" target="_self">
						<Button type="success" @click="outExcel">
								导出
						</Button>
					</a>
				</div> -->

				<div class="searchWrapper clearfix">

					<div class="poptip">
						<Poptip trigger="hover" 
										content="Por favor, introduzca el número de pedido para buscar"
										placement="bottom-start">
							<Input placeholder="Por favor, introduzca el número de pedido para buscar"
										v-model="filterSearch.orderSn"/> 
							</Input>      
						</Poptip>
					</div>	

					<div class="poptip">
						<Poptip trigger="hover" 
										content="Introduzca la búsqueda de comerciantes"
										placement="bottom-start">
							<Input placeholder="Introduzca la búsqueda de comerciantes"
										v-model="filterSearch.customerName"/> 
							</Input>      
						</Poptip>
					</div>

					<div class="poptip">
						<Poptip trigger="hover" 
										content="Ingrese la búsqueda del creador"
										placement="bottom-start">
							<Input placeholder="Ingrese la búsqueda del creador"
										v-model="filterSearch.memberName"/> 
							</Input>      
						</Poptip>
					</div>

					<div class="poptip">
						<span>divisa：</span>
						<Select v-model="filterSearch.unit">
							<Option v-for="(item, index) in coinSearchArr" 
										:value="item.unit=='全部'?'':item.unit" 
										:key="item.unit">{{ item.unit }}</Option>
						</Select>
					</div>

					<div class="poptip">
						<span>escribe：</span>
						<Select v-model="filterSearch.advertiseType">
							<Option v-for="item in advertiseArr" 
										:value="item.status" 
										:key="item.status">{{ item.text }}</Option>
						</Select>
					</div>
					<br>

					<div class="poptip range">
						<Poptip trigger="hover" 
										content="Búsqueda de cantidad mínima de pedido"
										placement="bottom-start">
							<Input placeholder="Búsqueda de cantidad mínima de pedido"
										v-model="filterSearch.minNumber"/> 
							</Input> 
						</Poptip>
						~
						<Poptip trigger="hover" 
										content="Búsqueda de número máximo de pedidos"
										placement="bottom-start">
							<Input placeholder="Búsqueda de número máximo de pedidos"
										v-model="filterSearch.maxNumber"/> 
							</Input> 
						</Poptip>
					</div>

					<div class="poptip range">
						<Poptip trigger="hover" 
										content="Búsqueda de cantidad mínima de pedido"
										placement="bottom-start">
							<Input placeholder="Búsqueda de cantidad mínima de pedido"
										v-model="filterSearch.minMoney"/> 
							</Input> 
						</Poptip>
						~
						<Poptip trigger="hover" 
										content="Búsqueda de cantidad máxima de pedido"
										placement="bottom-start">
							<Input placeholder="Búsqueda de cantidad máxima de pedido"
										v-model="filterSearch.maxMoney"/> 
							</Input> 
						</Poptip>
					</div>

					<div class="poptip">
						<span>Estado del pedido：</span>
						<Select v-model="filterSearch.status">
							<Option v-for="item in orderStatusArr" 
										:value="item.status" 
										:key="item.status">{{ item.text }}</Option>
						</Select>
					</div>

					<div class="poptip">
						<DatePicker 
							type="daterange" 
							placement="bottom-end" 
							@on-change="dateRange"
							placeholder="Elige un intervalo de tiempo">
						</DatePicker>
					</div>

					<div class="btns">
						<Button type="info" size="small" @click="searchByFilter">búsqueda</Button>
					</div>

				</div>
			</Row>

			<Row>
				<Table :loading="ifloading" 
								:columns="columnsList" 
								:data="cbData.content"
								@on-selection-change="selectionChange"
								@on-sort-change="definedOrder" 
								border></Table>
			</Row>

			<Row class="pageWrapper" >
				<Page :total="cbData.totalElements" 
							:current="currentPageIdx"   
							@on-change="changePage" 
							show-elevator></Page>
			</Row>
				
			<Modal v-model="showModal" :width="500" class="modelInfo">
					<h3 slot="header">订单信息</h3>
						<ul>
							<li><span>Número de orden：</span>{{ modelInner.orderSn }}</li>
							<li><span>Hora de transacción：</span>{{ modelInner.createTime }}</li>
							<li><span>Comerciante：</span>{{ modelInner.customerName }}</li>
							<li><span>Fundador：</span>{{ modelInner.memberName }}</li>
							<li><span>Divisa：</span>{{ modelInner.unit }}</li>
							<li><span>Escribe：</span>{{ !modelInner.advertiseType ? '购买':'出售' }}</li>
							<li><span>Cantidad de pedido：</span>{{ modelInner.number }}</li>
							<li><span>Total de la orden：</span>{{ modelInner.money }}</li>
							<li><span>Tasa de tramitación：</span>{{ ''+modelInner.fee }}</li>
							<li><span>Método de pago：</span>{{ modelInner.payMode }}</li>
							<li><span>Estado del pedido：</span>{{ modelInner.status | filterOrderStatus }}</li>
							<li><span>Tiempo de pago：</span>{{ modelInner.payTime }}</li>
							<li><span>Tiempo de cancelación de pedido：</span>{{ !modelInner.cancelTime ? '--' : modelInner.cancelTime }}</li>
							<li><span>Tiempo de liberación：</span>{{ !modelInner.releaseTime ? '--' : modelInner.releaseTime }}</li>
						</ul>
					<div slot="footer">
					</div>
			</Modal>
		</Card>
	</div>
</template>
<script>
import qs from 'qs';
import { setStore, getStore, removeStore } from "@/config/storage.js";
import { queryOtcOrder, coinOutExcel, BASICURL, getCoinName } from "@/service/getData";

export default {
  name: "OrderManage",
  data() {
    return {
			aLink: `${BASICURL}admin/otc/order/out-excel`,
			coinSearchArr: [],
			sortSearch: {
				direction: [],
				property: []
			},
			orderStatusArr: [
				{ status: 0, text: 'Cancelado' },
				{ status: 1, text: 'No pagado' },
				{ status: 2, text: 'Pagado' },
				{ status: 3, text: 'terminado' },
				{ status: 4, text: 'bajo apelación' },
				{ status: '', text: 'todos' }
			],
			advertiseArr: [
				{ status: 0, text: 'comprar' },
				{ status: 1, text: 'vender' },
				{ status: '', text: 'todos' }
			],
			filterSearch: {
				status: '',
				unit: '',
				memberName: '',
				customerName: '',
				orderSn: '',
				minMoney: '',
				maxMoney: '',
				minNumber: '',
				maxNumber: '',
				advertiseType: ''
			},
			modelInner: {},
			cbData: {},
			ifloading: false,
			currentPageIdx: 1,
      orderStatus: null,
      showModal: false,
      saveLoading: false,
      columnsList: [
        {
          type: "selection",
          width: 60,
        },
        {
          title: "Número de orden",
          width: 90,
          key: "orderSn"
        },
        {
          title: "createTime",
          width: 105,
					key: "createTime",
					sortable: 'custom'
        },
        {
          title: "customerName",
          key: "customerName"
        },
        {
          title: "memberName",
          key: "memberName"
        },
        {
          title: "unit",
          key: "unit"
        },
        {
          title: "advertiseType",
          key: "advertiseType",
          render(h, obj) {
            return h("span", {}, obj.row.advertiseType === 0 ? "buy" : "sell");
          }
        },
        {
          title: "number",
          key: "number"
        },
        {
          title: "money",
          key: "money"
        },
        {
          title: "fee",
          key: "fee"
        },
        {
          title: "payMode",
          key: "payMode"
        },
        {
          title: "订单状态",
          key: "status",
          render(h, params) {
            let status = params.row.status;
						let arr = ['Cancelado', 'No pagado', 'Pagado', 'Completado', 'Apelando'];
            return h("span", {}, arr[status]);
          }
        },
        {
          title: "funcionar",
          align: "center",
          key: "handle",
          render: (h, obj) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      this.showInfoModal(obj);
                    }
                  }
                },
                "Controlar"
              )
            ]);
          }
        }
      ]
    };
  },
  methods: {
		definedOrder(obj) {
			let direction = obj.order==='desc' ? 1 : 0;
			let propertyIndex = this.sortSearch.property.indexOf(obj.key);

			if(propertyIndex!==-1){
				this.sortSearch.direction[propertyIndex] = direction;
			}else{
				this.sortSearch.property.push(obj.key);
				this.sortSearch.direction.push(direction);
			}

			let subObj = { pageNo: 1, pageSize: 20};
      Object.assign(subObj, this.filterSearch, this.sortSearch);
			
			this.refreshPage(subObj)
		},
		dateRange(val) {
			this.filterSearch.startTime = val[0];
			this.filterSearch.endTime = val[1];
		},
		searchByFilter() {
			let obj = Object.assign({ pageNo: 1, pageSize: 20}, this.filterSearch);
			this.aLink = `${BASICURL}admin/otc/order/out-excel?${qs.stringify(obj)}`;
			this.refreshPage(obj)
		},
		selectionChange(selection) {

		},
		refreshPageManual() {
			this.currentPageIdx = 1;
			for(let val in this.filterSearch)  {
				this.filterSearch[val] = '';
			}
			this.refreshPage();
		},
    changePage(pageIndex) {
			this.currentPageIdx = pageIndex;
			let obj = Object.assign({pageNo: pageIndex, pageSize: 20}, this.filterSearch, this.sortSearch);
     	this.refreshPage(obj);
    },
    showInfoModal(obj) {
			this.showModal = true;
			this.modelInner = obj.row;
			console.log(obj);
			
		},
    queryStatus(obj) {
      if (obj.query.status === undefined) {
        this.orderStatus = null;
      } else {
        this.orderStatus = obj.query.status;
      }
      this.getData();
		},
		refreshPage(obj = {}) {
      this.ifloading = true;
      queryOtcOrder(obj)
        .then(res => {
          if (!res.code) {
						this.cbData = res.data;
          } else this.$Message.error(res.message);
          this.ifloading = false;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
		getCoinName()
		.then(res => {
			if (!res.code) {
				this.coinSearchArr = res.data;
				this.coinSearchArr.push({ name: 'todos', unit: 'todos' })
			} else this.$Message.error(res.message);
		})
		.catch(err => {
			console.log(err);
		});
    this.refreshPage();
	},
	filters: {
		filterOrderStatus (val) {
			let arr = ['Cancelado', 'No pagado', 'Pagado', 'terminado', 'bajo apelación'];
			return arr[val];
		},
	},
  watch: {
    $route(to, from) {
      this.queryStatus(to);
    }
  }
};
</script>

<style lang="less">
	.modelInfo{
		h3{
			color: #2D8CF0;
		}
		ul{
			li {
				margin: 5px 0;
				font-size: 14px;
				&>span{
					display: inline-block;
					margin-left: 25px;
					width: 100px;
					font-weight: 700;
				}
			}
		}
	}
</style>