<template>
 	<div>
    <Card>
      <p slot="title">
        Gestión de saldos
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          actualizar
        </Button>
      </p>

			<Row class="functionWrapper">
        <div class="searchWrapper clearfix">
          
          <div class="poptip">
            <Poptip trigger="hover" content="Ingrese nombre de usuario, correo electrónico, teléfono móvil o nombre para buscar" placement="bottom-start">
              <Input placeholder="Ingrese nombre de usuario, correo electrónico, teléfono móvil o nombre para buscar"
                    v-model="filterSearch.account"/> 

            </Poptip>
          </div>

					<div class="poptip">
            <Poptip trigger="hover" content="Ingrese la dirección de la billetera para buscar" placement="bottom-start">
              <Input placeholder="Ingrese la dirección de la billetera para buscar"
                    v-model="filterSearch.walletAddress"/>

            </Poptip>
          </div>

					<div class="poptip">
            <Poptip trigger="hover" content="Por favor ingrese la moneda para buscar" placement="bottom-start">
              <Input placeholder="Por favor ingrese la moneda para buscar"
                    v-model="filterSearch.unit"/> 

            </Poptip>
          </div>
					<br>
					<div class="poptip range">
            <Poptip trigger="hover" content="Ingrese el número mínimo de monedas disponibles para buscar" placement="bottom-start">
              <Input placeholder="Buscar por el menor número de monedas disponibles"
                    v-model="filterSearch.minBalance"/> 

            </Poptip>

						<Poptip trigger="hover" content="Ingrese el mayor número de monedas disponibles para buscar" placement="bottom-start">
              <Input placeholder="Buscar por el mayor número de monedas disponibles"
                    v-model="filterSearch.maxBalance"/> 

            </Poptip>
          </div>

						<div class="poptip range">
            <Poptip trigger="hover" content="Ingrese el número mínimo de monedas congeladas para buscar" placement="bottom-start">
              <Input placeholder="Buscar el número mínimo de monedas congeladas"
                    v-model="filterSearch.minFrozenBalance"/> 

            </Poptip>

						<Poptip trigger="hover" content="Ingrese el número máximo de monedas congeladas para buscar" placement="bottom-start">
              <Input placeholder="Busca el mayor número de monedas congeladas"
                    v-model="filterSearch.maxFrozenBalance"/> 

            </Poptip>
          </div>

						<div class="poptip range">
            <Poptip trigger="hover" content="Ingrese la cantidad mínima de monedas totales para buscar" placement="bottom-start">
              <Input placeholder="Buscar el número más bajo de monedas totales"
                    v-model="filterSearch.minAllBalance"/> 

            </Poptip>

						<Poptip trigger="hover" content="Ingrese el número máximo de monedas para buscar" placement="bottom-start">
              <Input placeholder="Buscar el mayor número de monedas totales"
                    v-model="filterSearch.maxAllBalance"/> 

            </Poptip>
          </div>


          <div class="btns">
            <Button type="info" size="small" @click="searchByFilter">búsqueda</Button>
          </div>

        </div>
			</Row>

      <Row class="margin-top-10 searchable-table-con1">
        <Table ref="selection" 
        :columns="columns_first" 
        :data="userpage"
        border
        :loading="ifLoading"
       >
        </Table>
      </Row>

      <Row class="pageWrapper">
        <Page :total="pageNum" 
         :current="currentPageIdx"
         class="buttomPage"
         @on-change="changePage"
         show-elevator></Page>
      </Row>

    </Card>
 	</div>   
</template>

<script>

import { memberAsset } from '@/service/getData'

  export default {
    data () {
      return {
				/** 
 * unit
 * walletAddress
 * account //用户名、邮箱、手机、姓名
 * 
 * property 排序字段
 * direction 0 1
*/
				currentPageIdx: 1,
				filterSearch: {
					unit: '',
					walletAddress: '',
					account: '',
					minBalance: '',
					maxBalance: '',
					minFrozenBalance: '',
					maxFrozenBalance: '',
					minAllBalance: '',
					maxAllBalance: ''
				},
        pageNum: null,
        userpage: [],
        ifLoading: true,
        columns_first: [
          {
            title: 'memberId',
            key: 'memberId',
          },
          {
            title: 'username',
            key: 'username',
          },
          {
            title: 'email',
            key: 'email',
          },
          {
            title: 'mobilePhone',
            key: 'mobilePhone',
          },
           {
            title: 'realName',
            key: 'realName',
          },
           {
            title: 'unit',
            key: 'unit',
          },
          {
            title: 'address',
            key: 'address',
          },
         {
            title: 'balance',
            key: 'balance',
          },
          {
            title: 'frozenBalance',
            key: 'frozenBalance',
          },
          {
            title: 'allBalance',
            key: 'allBalance',
          },
        ]
      }
    },
    methods: {
			searchByFilter() {
				let bol = Number(this.filterSearch.minBalance) > Number(this.filterSearch.maxBalance) ||
				Number(this.filterSearch.minFrozenBalance) > Number(this.filterSearch.maxFrozenBalance) ||
        Number(this.filterSearch.minAllBalance) > Number(this.filterSearch.maxAllBalance);
        
				if(bol) {
					this.$Message.warning('El número mínimo de monedas no puede ser mayor que el número máximo de monedas');
				}else{
					this.$store.commit('switchLoading', true);
					this.currentPageIdx = 1;
				
					let obj = Object.assign(this.filterSearch, { pageNo: 1, pageSize: 20 });
					this.refreshPage(obj);
				}
			},
/** 
 * unit
 * walletAddress
 * account //用户名、邮箱、手机、姓名
 * 
 * property 排序字段
 * direction 0 1
*/

      changePage(pageIndex) {
        this.ifLoading = true;
				this.currentPageIdx = pageIndex;
	
				let	obj = Object.assign(this.filterSearch, { pageNo: pageIndex, pageSize: 20 });
        this.refreshPage(obj);
      },
      refreshPageManual() {
				for(let val in this.filterSearch) {
					this.filterSearch[val] = '';
				}
				this.ifLoading = true;
        this.refreshPage({ pageNo: 1, pageSize: 20 });
      },
      refreshPage(obj = {}) {
        memberAsset(obj)
      .then( res => {
        if (!res.code) {
          this.pageNum = res.data.totalElements;
          this.userpage = res.data.content;
          this.ifLoading = false;
					this.$store.commit('switchLoading', false);
        }else this.$Message.error('Error al obtener datos！')
       })
      }

    },
    created() {
      this.refreshPage();
    }

  }
</script>

<style lang="less" scoped>

</style>