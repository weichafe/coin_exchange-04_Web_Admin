<template>
  <div>
    <Card>
      <p slot="title">
        Registro del sistema
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          actualizar
        </Button>
      </p>

			<Row class="functionWrapper">
        <div class="searchWrapper clearfix">
					
					<div class="poptip">
						<Poptip trigger="hover" content="Por favor ingrese nombre de usuario para buscar" placement="bottom-start">
							<Input placeholder="Por favor ingrese nombre de usuario para buscar"
										v-model="filterSearch.adminName"/> 
							</Input>      
						</Poptip>
					</div>

					<div class="poptip">
						<Select v-model="filterSearch.module" placeholder="por favor elige...">
							<Option v-for="item in moduleArr" :value="item.status" :key="item.status">{{item.text}}</Option>
						</Select>
					</div>
						<!-- module -->

					
					<div class="btns">
						<Button type="info" size="small" @click="searchByFilter">búsqueda</Button>
					</div>
				</div>
			</Row>		
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

import { MemberRealNameList, accessLog } from '@/service/getData';
import { setStore, getStore, removeStore } from '@/config/storage';

export default {
	name: 'AccessLog',
  data() {
    return {
			moduleArr: [
				{ status: 0, text: 'CMS'},
				{ status: 1, text: 'COMMON'},
				{ status: 2, text: 'EXCHANGE'},
				{ status: 3, text: 'FINANCE'},
				{ status: 4, text: 'MEMBER'},
				{ status: 5, text: 'OTC'},
				{ status: 6, text: 'SYSTEM'},
				{ status: 7, text: 'PROMOTION'},
				{ status: -1, text: '全部'}
			],
			filterSearch: {
				pageNo: 1,
				pageSize: 20,
				adminName: '',
				module: null
			},
      currentPageIdx: 1,
      ifLoading: true,
      totalNum: null,
      columns_first: [
        {
					title: 'accessIp',
					key: 'accessIp'
        },
        {
          title: "accessMethod",
          key: "accessMethod"
        },
         {
          title: "accessTime",
          key: "accessTime"
        },
        {
					title: "adminName",
					key: 'adminName'
        },
        {
          title: "operation",
          key: "operation"
        },
        {
          title: "uri",
          key: "uri"
				},
				{
          title: "module",
          key: "module"
				}
      ],
      userpage: [],
    };
  },
  methods: {
		searchByFilter() {
			this.filterSearch.pageNo = 1;
			this.currentPageIdx = 1;
      this.refreshPage(this.filterSearch);
		},
    refreshPageManual() {
			this.currentPageIdx = 1;
			this.filterSearch.pageNo = 1;
			this.filterSearch.pageSize = 10;
			this.filterSearch.adminName = '';
			this.filterSearch.module = null;
      this.refreshPage(this.filterSearch);
    },
    refreshPage(obj) {
			this.ifLoading = true;
      accessLog('', obj)
      .then(res => {
        if(!res.code){
          this.ifLoading = false;
          this.userpage = res.data.content;
          this.totalNum = res.data.totalElements;
				}else this.$Message.error(res.message);
      });
    },
    changePage(pageIndex) {
      this.currentPageIdx = pageIndex;
			this.filterSearch.pageNo = pageIndex;
      this.refreshPage(this.filterSearch);
    },
  },
  created() {
		this.refreshPage()
  }
}
</script>

<style scoped lang='less'>
 
</style>