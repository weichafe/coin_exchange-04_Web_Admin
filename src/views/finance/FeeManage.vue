<template>
  <div>
    <Card>
      <p slot="title">
        Gestión de tarifas de manipulación
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          actualizar
        </Button>
      </p>

      <Row class="functionWrapper">
        <div class="searchWrapper clearfix">
						<span>tipo de transacción：</span>
						<Select v-model="filterSearch.type" style="width: 200px">
							<Option v-for="(item, index) in tradeTypeArr"
										:value="index"
										:key="item">{{ item }}</Option>
						</Select>
				</div>
        <div class="searchWrapper clearfix" style="margin-left:20px;">
						<span>hora de transacción：</span>
						<DatePicker
							type="daterange"
							placement="bottom-end"
              v-model="value1"
							@on-change="dateRange"
							placeholder="Elige un intervalo de tiempo">
						</DatePicker>
				</div>
        <div class="searchWrapper clearfix">
          <Button type="primary" @click="searchByFilter">búsqueda</Button>
        </div>
      </Row>

      <Row class="tableWrapper">
        <Table :columns="columns_first" :data="userpage" border :loading="ifLoading"></Table>
      </Row>

      <Row class="pageWrapper" >
        <Page :total="pageNum"  :current="current"   @on-change="changePage" show-elevator></Page>
      </Row>
    </Card>
  </div>
</template>

<script>

import { perTradeAll  } from '@/service/getData';

  export default{
    data () {
      return {
        value1:"",
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
        ifLoading: true,
        current: 1,
        pageNum: null,
        userpage: [],
        tradeTypeArr: [ 'recargar', 'retirar', 'transferir', 'comercio de divisas', 'Compra de moneda fiduciaria', 'Venta de moneda fiduciaria',
              'Premio Actividad', 'Recompensa de promoción', 'Dividendo', 'votar', 'recarga manual', 'par',
              "intercambio de eventos", "CTC comprar", "CTC vender", "sobres rojos", "Recibe un sobre rojo" ],
        columns_first: [
          {
            title: 'ID',
            key:"memberId"
          },

          {
            title: 'type',
						key: 'type',
						render: (h, obj) => {
              	return h ('span', {}, this.tradeTypeArr[obj.row.type])
						}
          },
          {
            title: 'symbol',
            key:"symbol"
          },

          {
            title: 'createTime',
            key:"createTime"
          },
          {
            title: 'fee',
            key:"fee"
          },
        ]
      }
    },
    methods: {
      searchByFilter(){
        this.current = 1;
        console.log(this.filterSearch)
				this.filterSearch.pageNo = 1;
				this.refreshPage(this.filterSearch)
      },
      refreshPageManual() {
        this.current = 1;
        this.value1 = "";
				for(let key in this.filterSearch) {
					this.filterSearch[key] = '';
				}
				this.filterSearch.pageNo = 1;
				this.filterSearch.pageSize = 10;
				this.refreshPage(this.filterSearch);
      },
      dateRange() {
        console.log(this.value1)
          this.filterSearch.startTime = this.value1[0] && this.timeforamt(this.value1[0])
          this.filterSearch.endTime = this.value1[0] && this.timeforamt(this.value1[1])
      },
      addZero(num){
        return num>=10?num+"":"0"+num;
      },
      timeforamt(time){
         let year = time.getFullYear();
         let month = this.addZero(time.getMonth() + 1);
         let day = this.addZero(time.getDate());
         return `${year}-${month}-${day} 00:00:00`
      },
      changePage(pageIndex) {
        this.current = pageIndex;
        this.filterSearch.pageNo = pageIndex;
        this.refreshPage( this.filterSearch );
      },
      refreshPage(obj) {
        this.ifLoading = true;
        perTradeAll(obj).then( res => {
          if(!res.code) {
            this.ifLoading = false;
            this.pageNum = (res.data && res.data.totalElements) || 1;
						this.userpage = (res.data && res.data.content) || [];
          } else {
            this.$Message.error(res.message);
          }
        } )
      }

    },
    created () {
      this.refreshPage();
    }
  }
</script>

<style lang="less" scoped>

</style>

