<template>
  <div>
    <Card>
      <p slot="title">
        Detalles de la transacción
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          actualizar
        </Button>
      </p>

      <Row class="functionWrapper">
				<div class="searchWrapper clearfix">

					<div class="poptip">
						<Poptip trigger="hover"
										content="Por favor ingrese ID de miembro"
										placement="bottom-start">
							<Input placeholder="Por favor ingrese ID de miembro"
										v-model="filterSearch.memberId"/>
							</Input>
						</Poptip>
					</div>

					<!-- <div class="poptip">
						<Poptip trigger="hover"
										content="请输入会员昵称"
										placement="bottom-start">
							<Input placeholder="请输入会员昵称"
										v-model="filterSearch.account"/>
							</Input>
						</Poptip>
					</div> -->

					<div class="poptip">
						<span>tipo de transacción：</span>
						<Select v-model="filterSearch.type">
							<Option v-for="(item, index) in tradeTypeArr"
										:value="index"
										:key="item">{{ item }}</Option>
						</Select>
					</div>
					<br>
					<div class="poptip range">
						<Poptip trigger="hover"
										content="Búsqueda de monto mínimo de transacción"
										placement="bottom-start">
							<Input placeholder="Búsqueda de monto mínimo de transacción"
										v-model="filterSearch.minMoney"/>
							</Input>
						</Poptip>
						~
						<Poptip trigger="hover"
										content="Búsqueda de monto máximo de transacción"
										placement="bottom-start">
							<Input placeholder="Búsqueda de monto máximo de transacción"
										v-model="filterSearch.maxMoney"/>
							</Input>
						</Poptip>
					</div>

					<div class="poptip range">
						<Poptip trigger="hover"
										content="Búsqueda de tarifa más baja"
										placement="bottom-start">
							<Input placeholder="Búsqueda de tarifa más baja"
										v-model="filterSearch.minFee"/>
							</Input>
						</Poptip>
						~
						<Poptip trigger="hover"
										content="Búsqueda de tarifa más alta"
										placement="bottom-start">
							<Input placeholder="Búsqueda de tarifa más alta"
										v-model="filterSearch.maxFee"/>
							</Input>
						</Poptip>
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

      <Row class="tableWrapper">
        <Table :columns="columns_first" :data="userpage" border :loading="ifLoading"></Table>
      </Row>

      <Row class="pageWrapper" >
        <Page :total="pageNum" :current="currentPageIdx" @on-change="changePage" show-elevator></Page>
      </Row>

    </Card>
  </div>
</template>

<script>
import { perTradeAll  } from '@/service/getData';
  export default{
    data () {
      return {
		filterSearch: {
			pageNo: 1,
			pageSize: 20,
			memberId: '',
			type: '',
			minMoney: '',
			maxMoney: '',
			minFee: '',
			maxFee: '',
			startTime: '',
			endTime: ''
		},
		tradeTypeArr: [ 'recargar', 'retiro', 'transferencia', 'transacción de divisas', 'compra fiduciaria', 'venta fiduciaria', 'recompensa de evento', 'recompensa de promoción', 'dividendo', 'votación', 'recarga manual', 'emparejamiento',
      "Intercambio de eventos", "Compra C2C", "Venta C2C", "Emisión de paquete rojo", "Recibo de paquete rojo", "Código de retiro", "Depósito de código de retiro", "Tarifa de contrato perpetuo", "Contrato perpetuo", "Beneficio del contrato ", "Pérdida perpetua del contrato", "Fracaso del contrato de opción", "Tarifa del contrato de opción", "Bonificación del contrato de opción", "Reembolso de contrato", "Recompensa de nivel", "Ingreso de tarifa de plataforma" ],
        currentPageIdx: 1,
        ifLoading: true,
        pageNum: null,
        userpage: [],
        columns_first: [
          {
            title: 'ID',
            key:"memberId"
          },
          {
            title: 'tipo de transacción',
            render: (h ,obj) => {
              let type =  obj.row.type;
              return h('span',{
              },this.tradeTypeArr[type])
            }
          },
          {
            title: 'Monto de la transacción',
            render: (h ,obj) => {
              let  amount =  obj.row.amount;
              let  symbol =  obj.row.symbol;
              return h('span',{},amount+' '+symbol)
            }
          },
          {
            title: 'fee',
            key:"fee"
          },
          {
            title: 'createTime',
            key:"createTime"
          },

        ]
      }
    },
    methods: {
			searchByFilter() {
				let reg = /\D/;
				if(reg.test(this.filterSearch.memberId)) {
					this.$Message.warning('请输入正确的会员ID!');
					return;
				}
				this.currentPageIdx = 1;
				this.filterSearch.pageNo = 1;
				this.refreshPage(this.filterSearch)
			},
			dateRange(val) {
				this.filterSearch.startTime = val[0] + " 00:00:00";
				this.filterSearch.endTime = val[1] + " 00:00:00";
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
        perTradeAll(obj).then( res => {
          if(!res.code) {
						this.ifLoading = false;
						this.pageNum = (res.data && res.data.totalElements) || 1;
						this.userpage = (res.data && res.data.content) || [];
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

<style lang="less" scoped>

</style>
