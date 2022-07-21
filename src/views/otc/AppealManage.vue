<template>
    <div>
			<Card>
				<p slot="title">
          Apelación de fondo
					<Button type="primary" size="small" @click="refreshPageManual">
						<Icon type="refresh"></Icon> actualizar
					</Button>
				</p>

				<Row class="functionWrapper">
					<div class="searchWrapper clearfix">

					<div class="poptip">
						<Poptip trigger="hover" 
									content="Por favor ingrese la moneda para buscar"
									placement="bottom-start">
							<Input placeholder="Por favor ingrese la moneda para buscar"
										v-model="filterSearch.unit"/> 
							</Input>      
						</Poptip>
					</div>

					<div class="poptip">
						<Poptip trigger="hover" 
									content="Ingrese una búsqueda de reclamante"
									placement="bottom-start">
						<Input placeholder="Ingrese una búsqueda de reclamante"
										v-model="filterSearch.negotiant"/> 
						</Input>      
						</Poptip>
					</div>

					<div class="poptip">
						<Poptip trigger="hover" 
										content="Introduzca la búsqueda de anunciantes"
										placement="bottom-start">
							<Input placeholder="Introduzca la búsqueda de anunciantes"
										v-model="filterSearch.complainant"/> 
							</Input>      
						</Poptip>
					</div>

						<div class="poptip">
							<span>tipo de anuncio：</span>
							<Select v-model="filterSearch.advertiseType">
								<Option v-for="item in orderTypeArr" 
											:value="item.status" 
											:key="item.status">{{ item.text }}</Option>
							</Select>
					</div>

					<div class="poptip">
						<span>Estado del pedido：</span>
						<Select v-model="filterSearch.success">
							<Option v-for="item in orderStatusArr" 
										:value="item.status" 
										:key="item.status">{{ item.text }}</Option>
						</Select>
					</div>

					<div class="btns">
						<Button type="info" size="small" @click="searchByFilter">búsqueda</Button>
					</div>

					</div>
				</Row>	
				
				<Row>
					<Table :loading="ifLoading" 
									:columns="columnsList" 
									:data="cbData.content"
									@on-sort-change="definedOrder"  
									border></Table>
				</Row>

				<Row class="pageWrapper" >
					<Page :total="cbData.totalElements" 
								:current="currentPageIdx"   
								@on-change="changePage" 
								show-elevator></Page>
				</Row>

				<Modal v-model="showEditModal" 
							 width="400"
							 class="modelInfo">
					<h3 slot="header">Información de la queja</h3>
					<ul>
						<li><span>anunciantes：</span>{{ `${modelInner.advertiseCreaterName}(${modelInner.advertiseCreaterUserName})` }}</li>
						<li><span>enterrador：</span>{{`${modelInner.customerUserName}(${modelInner.customerName})`  }}</li>
						<li><span>Número de orden：</span>{{ modelInner.orderSn }}</li>
						<li><span>tiempo de apelación：</span>{{ modelInner.createTime }}</li>
						<li><span>Notas de quejas：</span>{{ modelInner.remark }}</li>
						<li><span>Deshabilitar la cuenta de la parte infractora：</span><Checkbox v-model="forbidden">禁用</Checkbox></li>
					</ul>
					<div slot="footer" align="middle">
						<Button type="primary" @click="coinOperation(true)">放币</Button>
						<Button type="error" @click="coinOperation(false)">取消订单</Button>
					</div>
				</Modal>

			</Card>
    </div>
</template>
<script>
import { queryAppeal, releaseAppealCoin, cancelAppealOrder } from "@/service/getData";

import util from "@/libs/util";
import axios from "axios";
import qs from "qs";
axios.defaults.withCredentials = true;

export default {
  name: "AppealManage",
  data() {
    return {
			orderTypeArr: [
				{ status: 0, text: 'comprar' },
				{ status: 1, text: 'vender' },
				{ status: '', text: 'todos' }
			],
			sortSearch: {
				direction: [],
				property: []
			},
      modelInner: {},
      ifLoading: false,
      cbData: {},
      currentPageIdx: 1,
      filterSearch: {
        account: "",
				success: ""
      },
      orderStatusArr: [
        { status: 0, text: "perder el caso" },
        { status: 1, text: "ganar el caso" },
        { status: "", text: "ganar el caso" }
      ],
      showEditModal: false,
      forbidden: false,
      columnsList: [
        {
          title: "Número de orden",
          width: 108,
          key: "orderSn"
        },
        {
          title: "advertiseType",
          key: "advertiseType",
          render(h, obj) {
            let advertiseType = obj.row.advertiseType;
            return h("span", {}, !advertiseType ? "买入" : "卖出");
          }
        },
        {
          title: "advertiseCreaterName",
          key: "advertiseCreaterName",
          render(h, obj) {
            let userName = obj.row.advertiseCreaterUserName;
            let realName = obj.row.advertiseCreaterName;
            return `${userName}(${realName})`;
          }
        },
        {
          title: "customerUsername",
          key: "customerUsername",
          render(h, obj) {
            let userName = obj.row.customerUserName;
            let realName = obj.row.customerName;
            return `${userName}(${realName})`;
          }
        },
        {
          title: "initiatorName",
          key: "initiatorName"
				},
        {
          title: "coinName",
          key: "coinName"
				},
				
        {
          title: "createTime",
          key: "createTime",
					width: 108,
					sortable: 'custom'
        },
        {
          title: "number",
          key: "number",
          render(h, obj) {
            return h(
              "Tooltip",
              {
                props: {
                  trigger: "hover",
                  placement: "top",
                  content: `tasa de tramitación:${obj.row.fee}${obj.row.coinName}`
                },
                style: {
                  cursor: "pointer"
                }
              },
              obj.row.number
            );
          }
        },
        {
          title: "money(元)",
          key: "money"
        },
        {
          title: "payMode",
          key: "payMode"
				},
				{
          title: "Estado del pedido",
					key: "result",
					render: (h, obj) => {
						let text = 'no procesado';
						if(!obj.row.dealWithTime){
							text = 'no procesado';
						}else{
							if(!obj.row.isSuccess) text = 'Apelación fallida';
							else text = 'Apelación exitosa'
						}
						return h("span", {}, text);
					}	
        },
        // {
        //   title: "订单状态",
        //   key: "orderStatus",
        //   render(h, obj) {
        //     let index = obj.row.orderStatus;
        //     let orderStatus = [
        //       "已取消",
        //       "未付款",
        //       "已付款",
        //       "已完成",
        //       "申诉中"
        //     ];
        //     return h("span", {}, orderStatus[index]);
        //   }
        // },
        {
          title: "操作",
          key: "isSuccess",
          render: (h, obj) => {
            let ifSuccess = obj.row.isSuccess;
            let orderStatus = obj.row.orderStatus;
            let ifDealTime = obj.row.dealWithTime;
            let inner = "";
            let btnType = "primary";
            if (!!ifDealTime && !ifSuccess) {
              inner = "Controlar";
							btnType = "error";
            } else if (!!ifDealTime && ifSuccess === 1) {
              inner = "Controlar";
              btnType = "success";
            } else if (!ifDealTime) {
              btnType = "primary";
              inner = "tratar con";
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
                    if (ifDealTime === null) {
                      this.modelInnerFn(obj);
                    }else if (inner === "查看") {
											this.$router.push({path: '/otc/appealmanage/appealdetail', query: { id: obj.row.appealId }})
										}
                  }
                }
              },
              inner
            );
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
		coinOperation(bol) {
			let subFn = null;
			let title = '';
			let content = '';
			if(bol){
				title = 'Confirmar publicación';
				content = 'Ya sea para liberar monedas？'
				subFn = releaseAppealCoin;
			} else {
				title = 'cancelar orden';
				content = 'Ya sea para cancelar el pedido？'
				subFn = cancelAppealOrder;
			}
			
			this.showEditModal = false;
			let subObj = {
				orderSn: this.modelInner.orderSn,
				appealId: this.modelInner.appealId,
				banned: this.forbidden
			}
			
			this.$Modal.confirm({
				title: title,
				content: content,
				onOk: () => {
					subFn(subObj)
					.then(res => {
						if(!res.code) this.$Message.success(res.message);
						else this.$Message.error(res.message);
						this.refreshPage({ pageNo: this.currentPageIdx, pageSize: 20 })
					})
					.catch( err => console.log(err))
				},
				onCancel: () => {
					this.$Message.info('cancelaste la operación！');
				}
			});
		},
    modelInnerFn(obj) {
			this.modelInner = obj.row;
			this.showEditModal = true;
    },
    searchByFilter() {
			this.currentPageIdx = 1;
			let subObj = { pageNo: 1, pageSize: 20};
      Object.assign(subObj, this.filterSearch);
			this.refreshPage(subObj);
		},
    refreshPageManual() {
			this.currentPageIdx = 1;
			for(let val in this.filterSearch)  {
				this.filterSearch[val] = '';
			}
			for(let val in this.sortSearch)  {
				this.filterSearch[val] = [];
			}

      this.refreshPage();
    },
    changePage(pageIndex) {
			this.currentPageIdx = pageIndex;
			let obj = Object.assign({pageNo: pageIndex, pageSize: 20}, this.filterSearch, this.sortSearch);
      this.refreshPage(obj);
    },
    refreshPage(obj = {}) {
      this.ifLoading = true;
      queryAppeal(obj)
        .then(res => {
          if (!res.code) {
            this.cbData = res.data;
          } else this.$Message.error(res.message);

          this.ifLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.refreshPage();
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
					margin: 0 25px;
					font-weight: 700;
				}
			}
		}
	}
</style>