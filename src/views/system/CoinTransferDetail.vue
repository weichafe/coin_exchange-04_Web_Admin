<template>
  <div>
    <Card>
      <p slot="title">
        Detalles de la transferencia
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          actualizar
        </Button>
      </p>

      <Row>
        <Table 
          :columns="columns_first" 
          :data="userpage" 
          border
          :loading="ifLoading">
				</Table>
      </Row>

      <div class="pageWrapper">
        <Page  
          :total="totalNum" 
          :current="currentPageIdx"   
          @on-change="changePage" 
          show-elevator></Page>
      </div>
    </Card>
    </div>
</template>

<script>

import { coinTransferDetail } from '@/service/getData';

export default {
	name: 'AccessLog',
  data() {
    return {
      currentPageIdx: 1,
      ifLoading: true,
      totalNum: null,
      columns_first: [
        {
					title: 'ID',
					key: 'id'
				},
				{
          title: "unit",
          key: "unit"
				},
        {
          title: "transferTime",
          key: "transferTime"
        },
         {
          title: "amount",
          key: "amount"
        },
        {
					title: "balance",
					key: 'balance',
					render: (h, obj) => {
							let num = obj.row.balance;
							if(num<1) {
								num = num.toFixed(8);
							}
							return h('span', {}, num)
						}
        },
        {
          title: "最小手续费",
					key: "minerFee",
					render: (h, obj) => {
						let num = obj.row.minerFee;
						if(num<1) {
							num = num.toFixed(8);
						}
						return h('span', {}, num)
					}
        },
				{
          title: "Operador",
          key: "adminName"
				},
				{
          title: "dirección de billetera fría",
          key: "coldAddress"
				},
				{
          title: "número de orden de transferencia",
          key: "transactionNumber"
				},
				
			],
			filterSearch: {
				pageNo: 1,
				pageSize: 20,
				unit: '',
				transactionNumber: ''
			},
      userpage: [],
    };
  },
  methods: {
    refreshPageManual() {
			this.currentPageIdx = 1;
			this.filterSearch.pageNo = 1;
      this.refreshPage(this.filterSearch);
    },
    refreshPage(obj) {
			this.ifLoading = true;
      coinTransferDetail(obj)
      .then(res => {
        if(!res.code){
          this.ifLoading = false;
          this.userpage = res.data.content;
          this.totalNum = res.data.totalElements;
				}else this.$Message,error(res.message);
      });
    },
    changePage(pageIndex) {
			this.currentPageIdx = pageIndex;
			this.filterSearch.pageNo = pageIndex;
      this.refreshPage(this.filterSearch);
    },
  },
  created() {
		this.filterSearch.unit = this.$route.query.unit;
		this.refreshPage(this.filterSearch);
  }
}
</script>

<style scoped lang='less'>
 
</style>