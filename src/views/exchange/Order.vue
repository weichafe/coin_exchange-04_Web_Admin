<template>
  <div>
    <Card>
      <div slot="title" style="min-height:30px;width: 100%;">
        <div style="display:inline-block;float:left;" class="clearfix">
          <Button :type="btnType===0 ? 'primary' : 'ghost'" @click="localEnsure">mandato actual</Button>
          <Button :type="btnType===1 ? 'primary' : 'ghost'" @click="hisEnsure" style="margin-left: 20px;">comisión histórica</Button>
        </div>
        <Button type="primary" @click="refreshPageManual" style="float:right;">
          <Icon type="refresh"></Icon>actualizar
        </Button>
      </div>
      <Row class="priceSectionWrapper clearfix" >

        <div class="priceSection">el rango de precios：<Input v-model="filterSearch.minPrice"></Input> ~
          <Input v-model="filterSearch.maxPrice"></Input>
        </div>

        <div class="orderStatus">
          <span>Estado del pedido：</span>
          <Select v-model="filterSearch.status">
            <Option v-for="item in orderStatus"
                  :value="item.status"
                  :key="item.status">{{ item.text }}</Option>
          </Select>
        </div>

        <div class="orderStatus">
          <span>orden de direccion：</span>
          <Select v-model="filterSearch.orderDirection">
            <Option v-for="item in orderDirArr"
                  :value="item.status"
                  :key="item.status">{{ item.text }}</Option>
          </Select>
        </div>

        <div class="orderStatus">
          <span>Tipo de orden pendiente：</span>
          <Select v-model="filterSearch.type" style="width:80px">
            <Option v-for="item in typeArr"
                  :value="item.status"
                  :key="item.status">{{ item.text }}</Option>
          </Select>
        </div>

        <div class="orderStatus">
          <span>robot：</span>
          <Select v-model="filterSearch.robotOrder" >
            <Option v-for="item in robotOrderArr"
                  :value="item.status"
                  :key="item.status">{{ item.text }}</Option>
          </Select>
        </div>
      </Row>
      <Row class="functionWrapper">
        <div class="searchWrapper clearfix" style="width:100%;">
          <Poptip trigger="hover" content="Ingrese la unidad monetaria para buscar" placement="bottom-start">
            <Input placeholder="Ingrese la unidad monetaria para buscar"
                  v-model="filterSearch.coinSymbol"
                  />
            </Input>
          </Poptip>

          <Poptip trigger="hover" content="Por favor, introduzca el número de pedido para buscar" placement="bottom-start">
            <Input placeholder="Por favor, introduzca el número de pedido para buscar"
                  v-model="filterSearch.orderId"
                  />
            </Input>
          </Poptip>
          <Poptip trigger="hover" content="Por favor ingrese ID de usuario para buscar" placement="bottom-start">
            <Input placeholder="Por favor ingrese ID de usuario para buscar"
                  v-model="filterSearch.memberId"
                  />
            </Input>
          </Poptip>

          <Poptip trigger="hover" content="Ingrese la unidad de facturación para buscar" placement="bottom-start">
            <Input placeholder="Ingrese la unidad de facturación para buscar"
                  v-model="filterSearch.baseSymbol"
                  />
            </Input>
          </Poptip>

          <div class="btns" style="float:right;">
            <Button type="info" @click="searchByFilter">búsqueda</Button>
          </div>
        </div>
      </Row>



			<Row>
        <Table
          :columns="columns_first"
          :data="userpage"
          :loading="ifLoading">
				</Table>
			</Row>

			<Row class="pageWrapper" >
				<Page :total="totalNum"
					style='margin-top:8px'
					:current="current"
					@on-change="changePage"
					show-elevator></Page>
			</Row>
    </Card>
  </div>

</template>

<script>

import dtime from 'time-formater'
import { queryBBOrder,cancelOrder } from '@/service/getData';
import { setStore, getStore, removeStore } from '@/config/storage';

export default {
  data() {
    return {
			btnType: 0,
      filterSearch: {
        robotOrder:'',
				coinSymbol: '',
        orderDirection: '',
        type: '',
        orderId: '',
        memberId: '',
        baseSymbol: '',
        minPrice: '',
        maxPrice: '',
        status: '',
        pageNo: 1,
				pageSize: 20,
				completed: 0
      },
      robotOrderArr:[
        { status: 0, text: 'Ver robots' },
        { status: 1, text: 'no mires al robot' },
        { status: '', text: 'todos' }
      ],
      typeArr: [
        { status: 0, text: 'precio de mercado' },
        { status: 1, text: 'precio límite' },
        { status: '', text: 'todos' }
      ],
      orderDirArr: [
        { status: 0, text: 'comprar' },
        { status: 1, text: 'vender' },
        { status: '', text: 'todos' }
      ],
      priceRange: '',
      orderStatusModel: null,
      orderStatus: [
        { status: 0, text: 'en transacción' },
        { status: 1, text: 'terminado' },
        { status: 2, text: 'Cancelado' },
        { status: 3, text: 'se acabó el tiempo' },
        { status: '', text: 'todos' },
      ],
      totalNum: null,
      current:　1,
      priceSecPass: false,
      priceLow: null,
      priceHeight: null,
      coinSymbol: null,
      orderDirection: null,
      orderType: null,
      orderId: null,
      memberId: null,
      baseSymbol: null,
      currentPageIdx: 1,
      ifLoading: true,
      columns_first: [
        {
          title: "orderId",
          key: "orderId",
          width: 180
				},
        {
          title: "memberId",
          key: "memberId",
				},
        {
          title: "symbol",
          key: "symbol"
        },
        {
          title: "amount",
          key: "amount"
        },
        {
          title: "tradedAmount",
          key: "tradedAmount"
        },
        {
          title: "type",
          key: "type",
          render: (h, params) => {
            const row = params.row;

            const type = row.type == "MARKET_PRICE" ? "market" : "limit";
            return h("span", {}, type);
          }
        },
        {
          title: "orden de direccion",
          key: "direction",
          render: (h, params) => {
            const row = params.row;
            const direction = row.direction == "BUY" ? "buy" : "sell";
            return h("span", {}, direction);
          }
        },
        {
          title: "precio de orden pendiente",
          key: "price"
        },
        {
          title: "tiempo de orden pendiente",
          width: 100,
          render: (h, obj) => {
            let formatTime = dtime(obj.row.time).format('YYYY-MM-DD HH:mm:ss')
            return h('span',{},formatTime)
          }
        },
        {
          title: "estado",
          key: "status",
          render: (h, params) => {
            const row = params.row;
            var direction = '';
            if(row.status == 'TRADING'){
                direction = 'en transacción';
            }
            else if(row.status == 'COMPLETED'){
                direction = 'terminado'
            }
            else if(row.status == 'CANCELED'){
                direction = 'Cancelado'
            }
            return h("span", {}, direction);
          }
        },
        {
          title: "funcionar",
          key: "age",
          width: 150,
          render: (h, obj) => {
            var actions = [];
            actions.push(h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
                  },
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      this.$router.push('/exchange/bborder/detail');
                      removeStore('exchangeOrderId');
                      removeStore("completed")
                      setStore('exchangeOrderId',obj.row.orderId);
                      setStore('completed',obj.row.completed);
                    }
                  }
                },
                "Detalles"));
            if(obj.row.status == 'TRADING'){
             actions.push( h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.cancelOrder(obj.row.orderId)
                    }
                  }
                },
                "revocar"));
            }
            return h("div", actions);
          }
        }
      ],
      userpage: []
    };
  },
  methods: {
		// switchEnsure() {

		// },
		localEnsure() {
			this.filterSearch.pageNo = 1;
			this.current = 1;
			this.btnType = 0;
			this.filterSearch.completed = 0;
			this.refreshPage(this.filterSearch);
		},
		hisEnsure () {
			this.filterSearch.pageNo = 1;
			this.current = 1;
			this.btnType = 1;
			this.filterSearch.completed = 1;
			this.refreshPage(this.filterSearch);
		},
    searchByFilter() {
			let reg = /[^0-9]/;
      // alert(this.memberId)
      this.current = 1
			let bol = reg.test(this.memberId);
			if(bol&&(!!this.memberId)) {
				this.$Message.warning('请输入正确的id！')
				return;
			}

      if(isNaN(this.priceLow*1) ||　isNaN(this.priceHeight*1)) {
        this.$Message.warning('请输入正确的价格！')
      }else if(this.priceLow*1<0 || this.priceHeight*1<0) {
        this.$Message.warning('价格应该大于等于零！')
      } else {
        if(this.priceLow*1>this.priceHeight*1) {
          this.$Message.warning('最低价格不能高于最高价格')
        }else{
					this.$store.commit('switchLoading', true);
          this.refreshPage(this.filterSearch);
        }
      }
    },
    refreshPageManual() {
			for(let key in this.filterSearch)  {
				this.filterSearch[key] = '';
			}
      this.currentPageIdx = 1;
      this.current = 1;
			this.btnType = 0;
			this.filterSearch.pageNo = 1;
			this.filterSearch.pageSize = 10;
			this.filterSearch.completed = 0;
      this.refreshPage(this.filterSearch);
    },
   changePage(pageIndex) {
			this.current= pageIndex;
			this.filterSearch.pageNo = pageIndex;
      this.refreshPage( this.filterSearch);
    },
    refreshPage(obj) {
      this.ifLoading = true;
      queryBBOrder(obj).then(res => {
        this.userpage = res.data.content;
        this.totalNum = res.data.totalElements;
				this.ifLoading = false;
				this.$store.commit('switchLoading', false);
      });
    },
    cancelOrder(orderId){
			cancelOrder({orderId:orderId}).then(res=>{
				if(res.code == 0){
					this.$Message.success('撤销成功');
					this.refreshPage(this.filterSearch);
				}else{
					this.$Message.error('撤销失败');
				}
			})
			.catch(err => console.log(err))
    }
  },
  created() {
    this.refreshPage(this.filterSearch);
  }
}
</script>

<style lang="less" scoped>
.switchTab {
	margin: 20px 0;
}
Input,.ivu-select.ivu-select-single{
  width: 150px;
}
.priceSectionWrapper{
  margin-bottom: 10px;
  .ivu-input-wrapper.ivu-input-type {
    width: 60px ;
  }
  .priceSection {
    float: left;
  }
  .orderStatus {
    margin-left: 20px;
    float: left;
  }
  .btns{
    margin-left: 10px;
    float: left;
    height: 30px;
    line-height: 30px;
  }
}
.tips{
  color: red;
}
</style>
