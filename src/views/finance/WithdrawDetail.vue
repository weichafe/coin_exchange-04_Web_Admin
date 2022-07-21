<template>
  <div>
    <Card>
      <p slot="title">
        Detalles de retiro
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          actualizar
        </Button>
      </p>

      <Row class="functionWrapper">
				<div class="searchWrapper clearfix">
					<!-- <div class="poptip">
						<Poptip trigger="hover"
										content="请输入用户昵称查询"
										placement="bottom-start">
							<Input placeholder="请输入用户昵称查询"
										v-model="filterSearch.memberUsername"/>
							</Input>
						</Poptip>
					</div> -->

					<div class="poptip">
						<Poptip trigger="hover"
										content="Ingrese el nombre real o el apodo del usuario para consultar"
										placement="bottom-start">
							<Input placeholder="Ingrese el nombre real o el apodo del usuario para consultar" style="width:200px"
										v-model="filterSearch.account"/>
							</Input>
						</Poptip>
					</div>

					<div class="poptip">
						<Poptip trigger="hover"
										content="Por favor, introduzca su número de teléfono móvil para consultar"
										placement="bottom-start">
							<Input placeholder="Por favor, introduzca su número de teléfono móvil para consultar"
										v-model="filterSearch.mobilePhone"/>
							</Input>
						</Poptip>
					</div>

					<div class="poptip">
						<span>divisa：</span>
						<Select v-model="filterSearch.unit">
							<Option v-for="(item, index) in coinSearchArr" :value="item.unit" :key="item.unit">{{ item.unit }}</Option>
						</Select>
					</div>

					<div class="btns">
						<Button type="info" size="small" @click="searchByFilter">búsqueda</Button>
					</div>

				</div>
			</Row>

      <Row class="tableWrapper">
        <Table :columns="columns_first"
							@on-sort-change="definedOrder"
							:data="userpage" border
							:loading="ifLoading">
				</Table>
      </Row>

      <Row class="pageWrapper" >
        <Page :total="pageNum" :current="currentPageIdx" @on-change="changePage" show-elevator></Page>
      </Row>

    </Card>
  </div>
</template>

<script>
import { getCoinName, withdrawManage  } from '@/service/getData';
  export default{
    data () {
      return {
				coinSearchArr: [],
				filterSearch: {
					pageNo: 1,
					pageSize: 20,
					property: [],
					direction: [],
					// memberUsername: '',
					// memberRealName: '',
					account:"",
					mobilePhone: '',
					unit: ''
				},
        currentPageIdx: 1,
        ifLoading: true,
        pageNum: null,
        userpage: [],
        columns_first: [
          {
            title: 'TXID',
            key: 'transactionNumber'
          },
		  {
            title: 'nombre de la moneda',
            key: 'unit'
          },
          {
            title: 'Número de monedas retiradas',
            key: 'totalAmount'
          },
          {
						title: 'Llegadas reales',
						key: 'arrivedAmount'
          },
          {
						title: 'Cargo por retiro',
						key: 'fee'
          },
          {
            title: 'cargo por retiro',
            key: 'createTime'
          },
          {
            title: 'Apodo del usuario',
            key: 'memberUsername'
          },
          {
            title: 'Correo',
            key: 'email'
          },
          {
            title: 'Número de teléfono',
            key: 'phone'
          },
          {
            title: 'nombre real',
            key: 'memberRealName'
          },
          {
            title: 'dirección de la billetera',
            key: 'address'
          },
          {
            title: 'Tiempo de revisión',
            key: 'dealTime'
          },

        ]
      }
    },
    methods: {
			definedOrder(obj) {
				let direction = obj.order==='desc' ? 1 : 0;
				let propertyIndex = this.filterSearch.property.indexOf(obj.key);

				if(propertyIndex!==-1){
					this.filterSearch.direction[propertyIndex] = direction;
				}else{
					this.filterSearch.property.push(obj.key);
					this.filterSearch.direction.push(direction);
				}

				this.refreshPage(this.filterSearch);
			},
			searchByFilter() {
				let reg = /1[3456789]\d{9}/g;
				let phone = this.filterSearch.mobilePhone;
				if(phone && !reg.test(phone)){
						this.$Message.error("请输入正确的手机号")
				}else{
					this.currentPageIdx = 1;
					this.filterSearch.pageNo = 1;
					this.refreshPage(this.filterSearch)
				}
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
        withdrawManage(obj).then( res => {
          if(!res.code) {
            this.ifLoading = false;
            this.pageNum = res.data.totalElements;
            this.userpage = res.data.content;
          }else this.$Message.error(res.message)
				})
      }
    },
    created () {
			getCoinName()
			.then(res => {
				if (!res.code) {
					this.coinSearchArr = res.data;
					// this.coinSearchArr.push({ name: '全部', unit: '' })
				} else this.$Message.error(res.message);
			})
			.catch(err => {
				console.log(err);
			});
      this.refreshPage();
    }
  }
</script>

<style>
/* .ivu-select-item-selected, .ivu-select-item-selected:hover{
	background: #fff;
	color: #000;
} */
</style>
