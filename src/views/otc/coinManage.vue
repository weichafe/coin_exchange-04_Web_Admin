<template>
	<div>
		<Card>
			<p slot="title">
        Gestión de divisas
				<Button type="primary" size="small" @click="refreshPageManual">
					<Icon type="refresh"></Icon> actualizar
				</Button>
			</p>

			<Row class="functionWrapper">
				<div class="btnsWrapper clearfix">
					<Button type="error" @click="delCoin">Eliminar</Button>
					<Button type="info" @click="addCoin">añadir</Button>
				</div>
			</Row>

			<Row>
				<Table :loading="ifloading" 
								:columns="columnsList" 
								:data="cbData.content"
								@on-selection-change="selectionChange"
								border>
				</Table>
			</Row>

			<Row class="pageWrapper" >
				<Page :total="cbData.totalElements" 
							:current="currentPageIdx"   
							@on-change="changePage" 
							show-elevator>
				</Page>
			</Row>	

			<Modal v-model="showEditModal" 
						:mask-closable='false' 
						:width="450"
						@on-ok="saveEditPass"
						@on-cancel="cancelEdit"
						title="编辑币种">
				<Form :model="coinInformation" 
							:rules="ruleValidate" 
							:label-width="100" 
							label-position="right">
					<FormItem label="número de moneda：" prop="id" v-show="false">
						<Input v-model="coinInformation.id" ></Input>
					</FormItem>
					<FormItem label="nombre de la moneda：" prop="nameCn">
						<Input v-model="coinInformation.nameCn"></Input>
					</FormItem>
					<FormItem label="nombre inglés：" prop="name">
						<Input v-model="coinInformation.name"></Input>
					</FormItem>
					<FormItem label="Unidad monetaria：" prop="unit">
						<Input v-model="coinInformation.unit"></Input>
					</FormItem>
					<FormItem label="tasa de tarifa de transacción（%）：" prop="jyRate">
						<Input v-model="coinInformation.jyRate"></Input>
					</FormItem>
					<FormItem label="Número mínimo de anuncios para vender：" prop="sellMinAmount">
						<Input v-model="coinInformation.sellMinAmount"></Input>
					</FormItem>
					<FormItem label="Cantidad mínima de publicación de anuncios de compra：" prop="buyMinAmount">
						<Input v-model="coinInformation.buyMinAmount"></Input>
					</FormItem>
					<FormItem label="estado：" prop="status">
						<i-switch v-model="switchStatus" size="large">
						  <span slot="open">normal</span>
							<span slot="close">inválido</span>
						</i-switch>
					</FormItem>
				</Form>
			</Modal>
		</Card>
	</div>
</template>
<script>

import { queryOtcCoin, addOtcCoin, updateOtcCoin, delOtcCoin } from "@/service/getData";

export default {
  name: "CoinManage",
  data() {
    return {
			selectArr: [],
			createOrUpdate: true,
			cbData: {},
			ifloading: false,
			currentPageIdx: 1,
			showEditModal: false,
			switchStatus: true,
			coinInformation: {
        id: null,
        nameCn: '',
        name: '',
        unit: '',
        jyRate: '',
        sellMinAmount: '',
        buyMinAmount: '',
        status: 0
      },
      ruleValidate: {
        nameCn: [
          { required: true, message: 'El nombre de la moneda no puede estar vacío', trigger: 'blur' }
        ],
        name: [
          { required: true, message: 'El nombre en inglés no puede estar vacío',trigger: 'blur' }
        ],
        unit: [
          { required: true, message: 'La unidad monetaria no puede estar vacía',trigger: 'blur'}
        ],
        jyRate: [
          { required: true, message: 'La tasa de tarifa de transacción no puede estar vacía',trigger: 'blur'}
        ],
        sellMinAmount: [
          { required: true, message: 'El número mínimo de anuncios a vender no puede estar vacío',trigger: 'blur' }
        ],
        buyMinAmount: [
          { required: true,message: 'El número mínimo de anuncios a publicar no puede estar vacío',trigger: 'blur'}
        ],
        status: [
          { required: true, message: 'El estado no puede estar vacío', trigger: 'blur' }
        ]
      },
      columnsList: [
        {
          type: "selection",
          width: 60,
        },
        {
          title: "número de moneda",
          key: "id"
        },
        {
          title: "nombre de la moneda",
          key: "nameCn"
        },
        {
          title: "nombre inglés",
          key: "name"
        },
        {
          title: "Unidad monetaria",
          key: "unit"
        },
        {
          title: "tasa de tarifa de transacción",
          key: "jyRate",
          render(h, params) {
            const row = params.row;
            return h("span", {}, row.jyRate + "%");
          }
        },
        {
          title: "Número mínimo de anuncios para vender",
          width: 180,
          key: "sellMinAmount"
        },
        {
          title: "Cantidad mínima de publicación de anuncios de compra",
          width: 180,
          key: "buyMinAmount"
        },
        {
          title: "状态",
          key: "status",
          render(h, params) {
            const row = params.row;
            return h("span", {}, !row.status ? "正常" : "失效");
          }
        },
        {
          title: "操作",
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
                  on: {
                    click: () => {
											this.showEditModal = true;
											this.createOrUpdate = false;
											for (let val in this.coinInformation) {
												this.coinInformation[val] = obj.row[val];
											}
											!obj.row.status ? this.switchStatus = true : this.switchStatus = false;
                    }
                  }
                },
                "Revisar"
              )
            ]);
          }
        }
      ],
    };
  },
  methods: {
		selectionChange(selection) {
			this.selectArr = selection;
		},
		refreshPageManual() {
			this.refreshPage()
		},
    delCoin() {
			let ids = [];
			this.selectArr.forEach(item => {
				ids.push(item.id);
			})
			if(!ids.length) {
				this.$Message.warning('Por favor, seleccione el elemento para eliminar！')
			}else{
				this.$Modal.confirm({
						title: '删除币种',
						content: `<p>是否删除选中的${this.selectArr.length}项</p>`,
						onOk: () => {
							delOtcCoin({ids: ids})
							.then(res => {
								if(!res.code) {
									this.$Message.success(res.message);
								}else this.$Message.error(res.message);
								this.refreshPage();
							})
							.catch(err => console.log(err))
						},
						onCancel: () => {
							this.$Message.info('Cancelado！');
						}
				});
			}
    },
    changePage(pageIndex) {
			this.currentPageIdx = pageIndex;
			this.refreshPage({ pageNo: pageIndex, pageSize: 20 });
    },
    addCoin() {
			this.createOrUpdate = true;
      this.showEditModal = true;
    },
    cancelEdit() {
			for(let val in this.coinInformation) {
				this.coinInformation[val] = '';
			}
			this.coinInformation.id = null;
			this.switchStatus = this.coinInformation.status = true;
    },
    saveEditPass() {
			this.switchStatus ? this.coinInformation.status = 0 : this.coinInformation.status = 1;
			let subFn = '';
			this.createOrUpdate ? subFn = addOtcCoin :  subFn = updateOtcCoin;
			subFn(this.coinInformation)
			.then(res => {
				if(!res.code) {
					this.refreshPage();
					this.$Message.success(res.message);
				}else this.$Message.error(res.message);
				this.cancelEdit();
			})
			.catch(err => {console.log(res.message)	})
    },
		refreshPage(obj = {}) {
      this.ifloading = true;
      queryOtcCoin(obj)
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
		this.refreshPage();
  },
}
</script>