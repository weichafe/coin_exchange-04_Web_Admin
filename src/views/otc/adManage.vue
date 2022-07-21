<template>
	<div>
		<Card>
				<p slot="title">
          publicidad de fondo
					<Button type="primary" size="small" @click="refreshPageManual">
						<Icon type="refresh"></Icon> actualizar
					</Button>
				</p>
			
				<Row class="functionWrapper">
					<div class="btnsWrapper">
						<Button type="error" @click="batchDel">eliminación por lotes</Button>
					</div>

					<div class="searchWrapper clearfix">
						<div class="poptip">
							<Poptip trigger="hover" 
											content="Ingrese el número de teléfono móvil, el nombre real o el nombre del miembro para buscar"
											placement="bottom-start">
								<Input placeholder="Ingrese el número de teléfono móvil, el nombre real o el nombre del miembro para buscar"
											v-model="filterSearch.account"/> 
								</Input>      
							</Poptip>
						</div>

						<div class="poptip">
								<Poptip trigger="hover" 
											content="Ingrese el método de pago para buscar"
											placement="bottom-start">
								<Input placeholder="Ingrese el método de pago para buscar"
											v-model="filterSearch.payModel"/> 
								</Input>      
							</Poptip>
						</div>

						<div class="poptip">
							<span>escribe：</span>
							<Select v-model="filterSearch.advertiseType">
								<Option v-for="item in advertiseTypeArr" 
											:value="item.status" 
											:key="item.status">{{ item.text }}</Option>
							</Select>
						</div>

						<div class="poptip">
							<span>estado：</span>
							<Select v-model="filterSearch.status">
								<Option v-for="item in advertiseStatusArr" 
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
					<Table :loading="ifloading" 
							 	 :columns="columnsList" 
							 	 :data="cbData.content"
								 @on-selection-change="selectionChange" 
								 border></Table>
				</Row>

				<Row class="pageWrapper" >
					<Page :total="cbData.totalElements" 
								:current="currentPageIdx"   
								@on-change="changePage" 
								show-elevator></Page>
				</Row>
		</Card>
	</div>
</template>
<script>
import { queryOtcAdv, upDownAdv } from "@/service/getData";

export default {
  data() {
    return {
			selection: [],
      cbData: {},
      currentPageIdx: 1,
      filterSearch: {
        account: "",
				advertiseType: "",
				status: "",
        payModel: ""
      },
      advertiseTypeArr: [
        { status: 0, text: "comprar" },
        { status: 1, text: "vender" },
        { status: "", text: "todos" }
			],
			advertiseStatusArr: [
        { status: 0, text: "en la repisa" },
        { status: 1, text: "Derribar" },
        { status: "", text: "todos" }
      ],
      ifloading: false,
      columnsList: [
        {
          type: "selection",
          width: 60
        },
        {
          title: "número de anuncio",
          width: 108,
          key: "id"
        },
        {
          title: "tiempo de creación",
          key: "createTime"
        },
        {
          title: "fundador",
          render: (h, obj) => {
            let member = obj.row.member;
            return `${member.username}(${member.realName})`;
          }
        },
        {
          title: "fundador",
          render: (h, obj) => {
            return obj.row.coin.unit;
          }
        },
        {
          title: "número de anuncios",
          key: "number"
        },
        {
          title: "Cantidad de publicidad",
          key: "price"
        },
        {
          title: "límite de anuncios",
          align: "center",
          render: (h, obj) => {
            return `${obj.row.minLimit}-${obj.row.maxLimit}`;
          }
        },
        {
          title: "escribe",
          key: "advertiseType",
          render(h, params) {
            const row = params.row;
            return h("span", {}, row.advertiseType === 0 ? "comprar" : "vender");
          }
        },
        {
          title: "método de pago",
          key: "payMode"
        },
        {
          title: "status",
          key: "status",
          render(h, params) {
            const row = params.row;
            return h("span", {}, !row.status ? "En estantería" : "Fuera de estantería");
          }
        },
        {
          title: "center",
          align: "center",
          width: 150,
          key: "handle",
          render: (h, obj) => {
            let advStatus = obj.row.status;
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    size: "small",
                    type: "primary",
                    disabled: !!advStatus ? true : false
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.operation({ ids: [obj.row.id], status: 1 });
                    }
                  }
                },
                "Derribar"
							),
							h('Button', {
								props: {
									type: 'info',
									size: 'small'
								},
								on: {
									click: () => {
										this.$router.push({name: 'otc:adManage:advertisedetail', query: {advID : obj.row.id}})
									}
								}
							}, 'Detalles')

            ]);
          }
        }
      ]
    };
  },
  methods: {
		selectionChange(selection) {
			this.selection = selection;
		},
		batchDel() {
			let ids = [];
      console.log(this.selection)
			this.selection.forEach(item => {
				ids.push(item.id);
			})
			this.operation({ ids: ids, status: 2 });
		},
    operation(obj) {
      upDownAdv(obj).then(res => {
          if (!res.code) {
            this.$Message.success(res.message);
            this.refreshPage({ pageNo: this.currentPageIdx, pageSize: 20 });
          } else this.$Message.error(res.message);
        }).catch(err => console.log(err));
    },
    searchByFilter() {
			this.currentPageIdx = 1;
      let obj = Object.assign(this.filterSearch, { pageNo: 1, pageSize: 20 });
      this.refreshPage(obj);
    },
    refreshPageManual() {
      for (let key in this.filterSearch) {
        this.filterSearch[key] = "";
      }
      this.refreshPage();
    },
    changePage(pageIndex) {
      this.currentPageIdx = pageIndex;
      let obj = Object.assign(this.filterSearch, {
        pageNo: pageIndex,
        pageSize: 20
      });
      this.refreshPage(obj);
    },

    refreshPage(obj = {}) {
      this.ifloading = true;
      queryOtcAdv(obj).then(res => {
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
  }
};
</script>

<style lang="less" scoped>

</style>