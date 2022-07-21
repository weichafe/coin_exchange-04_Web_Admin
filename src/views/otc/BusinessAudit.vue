<template>
	<div>
    <Card>
      <p slot="title">
        Comerciante Certificado
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          actualizar
        </Button>
      </p>
      <Row class="functionWrapper">
        <div class="searchWrapper clearfix">
          <div class="poptip">
            <Poptip trigger="hover" content="Ingrese el número de teléfono móvil, el nombre real o el nombre del miembro para buscar" placement="bottom-start">
              <Input placeholder="Ingrese el número de teléfono móvil, el nombre real o el nombre del miembro para buscar"
                    v-model="filterSearch.account"/> 
              </Input>      
            </Poptip>
          </div>

					<div class="poptip">
						<span>estado de miembro：</span>
						<Select v-model="filterSearch.status">
							<Option v-for="item in checkStatus" 
										:value="item.value" 
										:key="item.value">{{ item.name }}
							</Option>
						</Select>
					</div>
					
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
					:loading="ifLoading"
					@on-sort-change="definedOrder"
					class='user_center'>
				</Table>
      </Row>

      <Row class="pageWrapper" >
        <Page :total="totalNum" 
              :current="currentPageIdx"   
              @on-change="changePage" 
              show-elevator>
				</Page>			
      </Row>

			<Modal
        v-model="ifPass"
        title="Si la revisión del comerciante ha pasado"
        @on-ok="confirmPass"
        @on-cancel="$Message.success('Cancelado');">
        <p>Si aprobar el elemento seleccionado</p>
      </Modal>


    </Card>
  </div>
</template>

<script>

import { setStore, getStore, removeStore } from '@/config/storage';
import { queryBusinessStatus, queryBusiness, memberManage, businessAudit, publishAdvOtc, businessDetail  } from '@/service/getData';


export default {
  data () {
		return {
			sortObj: {},
			checkStatus: [
				// { status: 0, text: '未认证' },
				// { status: 1, text: '待审核' },
				// { status: 2, text: '已认证' },
				// { status: 3, text: '未通过' },
				// { status: '', text: '全部' },
			],
			filterSearch: {
				account: '',
				status: '',
			},
      routeStatus: null,
      currentPageIdx: 1,
      status: null,
      userID: null,
      ifPass: false,
      searchInner: null,
      totalNum: null,
      ifLoading: true,
      usemmuber:'',
      loading:true,
      columns_first: [
        {
          title: 'Apodo de miembro',
					key: 'username',
					render: (h, ctx) => {
						return h('span',{},ctx.row.member.username)
					}
        },
				{
					title: 'Correo',
					key: 'email',
					render: (h, ctx) => {
						return h('span',{},ctx.row.member.email)
					}
				},
        {
          title: 'realName',
					key: 'realName',
					render: (h, ctx) => {
						return h('span',{},ctx.row.member.realName)
					}
        },
        {
          title: 'mobilePhone',
					key: 'mobilePhone',
					render: (h, ctx) => {
						return h('span',{},ctx.row.member.mobilePhone)
					}
        },
       
       
        {
          title: 'memberLevel',
          key: 'memberLevel',
          width:160,
          render: (h, obj) => {
            let memberLevel = obj.row.memberLevel;
            let memberLevelTxt = null;
            if (!memberLevel) memberLevelTxt = 'Miembro ordinario'
            else if (memberLevel===1) memberLevelTxt = 'nombre real'
            else if (memberLevel===2) memberLevelTxt = 'Certificación'

            return h('span',{
            }, memberLevelTxt)
            
          }
        },
        {
          title: 'Tiempo de revisión',
					key: 'member.certifiedBusinessCheckTime',
					width: 105,
					sortable: 'custom',
					render: (h, ctx) => {
						let time = ctx.row.member.certifiedBusinessCheckTime;
						return h('span',{},!time ? '-' : time)
					}
				},
				{
					title: 'tiempo de aplicación',
					key: 'member.certifiedBusinessApplyTime',
					width: 105,
					sortable: 'custom',
					render: (h, ctx) => {
						let time = ctx.row.member.certifiedBusinessApplyTime;
						return h('span',{},!time ? '-' : time)
					}
				},
				{
          title: 'publishAdvertise',
					key: 'publishAdvertise',
					render: (h, obj) => {
            let adStatus = obj.row.member.publishAdvertise;
						let text = !adStatus ? 'Prohibido' : 'Permitir publicar';
						return h('span', {}, text)
          }
					
        },
        {
          title: 'status',
          // key: 'status',
          render: (h, obj) => {
            let  userStatus = obj.row.certifiedBusinessStatus;
            let statusTxt = null;
            if (userStatus === 1)  statusTxt = 'bajo revisión'
            else if (userStatus === 2)  statusTxt = 'verificado'
            else if (userStatus === 0)  statusTxt = 'no certificado'
            else if (userStatus === 3)  statusTxt = 'No pasó'
            else if (userStatus === 5)  statusTxt = 'Solicitud de rendición'

            return h('span', {
            },statusTxt);
          }
				},
				// {
        //   title: '审核人',
        //   key: ''
        // },
        {
          title: 'action',
          key: 'action',
          width: 180,
          align: 'center',
          render: (h, obj) => {
						let advStatus = obj.row.member.publishAdvertise;
						let btnType = !advStatus ? 'info' : 'error';
						let btnText = !advStatus ? 'Permitir publicar' : 'Prohibido';
            let userStatus = obj.row.certifiedBusinessStatus;
            let statusTxt = null;
            let type = 'text';
            let isDisabled = true;
            let color = 'unset';
            if (userStatus !== 1) {
							if (userStatus === 5) {
								return h('span', {}, '-');
							}
							return	h('div', {}, [
								h('Button', {
									props: {
										type: 'success',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.$router.push({path: '/otc/businessaudit/businessdetail', query: {id: obj.row.id}});
										}
									}
								}, '查看'),
								h('Button', {
									props: {
										type: btnType,
										size: 'small'
									},
									on: {
										click: () => {
											let status = !obj.row.member.publishAdvertise ? 1 : 0;
											publishAdvOtc({ memberId: obj.row.member.id, status: status})
											.then(res => {
												if(!res.code) {
													this.$Message.success(res.message);
													this.refreshPage({ pageNo: this.currentPageIdx, pageSize: 20 });
												}else this.$Message.error(res.message);
											})
											.catch( err => console.log(err))
										}
									}
								}, btnText)
							])
						} else {
							statusTxt = '待审核';
              type = 'info';
							isDisabled = false;
							return h('div', {}, [
								h('Button', {
									props: {
										type: type,
										size: 'small',
										disabled: isDisabled
									},
									style: {
										color: color,
										marginRight: '5px'
									},
									on: {
										click: () => {
											if(userStatus === 1) {
												this.$store.commit('switchBusinessMask', true);
												businessDetail(obj.row.member.id, {status: obj.row.member.certifiedBusinessStatus})
												.then(res => {
													if(!res.code) {
														this.$store.commit('businessCheckInfo', res.data)
													}else this.$Message.error(res.message);
												})
												// this.ifPass = true;
												this.userID = null;
												this.status = null;
												
												this.userID = obj.row.member.id;
												this.status = 2;
											}
										}
									}
								 }, statusTxt),
								 h('Button',{
										 props: {
											type: btnType,
											size: 'small'
										},
										on: {
											click: () => {
												let status = !obj.row.member.publishAdvertise ? 1 : 0;
												publishAdvOtc({ memberId: obj.row.member.id, status: status})
												.then(res => {
													if(!res.code) {
														this.$Message.success(res.message);
														this.refreshPage({ pageNo: this.currentPageIdx, pageSize: 20 });
													}else this.$Message.error(res.message);
												})
												.catch( err => console.log(err))
											}
										}
								 },btnText)
							])
						}
          }
        }
      ],
      userpage: []
    }
  },
  methods: {
		definedOrder(obj) {
			this.currentPageIdx = 1;

			let searchObj = Object.assign(this.filterSearch, { pageNo: 1	, pageSize: 20 });
			let orderNum = '';

			obj.order==='desc' ? orderNum = 1 : orderNum = 0;
			this.sortObj = { direction: [orderNum], property: [obj.key] };

			let sortSubObj = Object.assign(searchObj, this.sortObj);

			this.refreshPage(sortSubObj);
			
		},
		searchByFilter() {
			let searchObj = Object.assign(this.filterSearch, { pageNo: 1	, pageSize: 20 }, this.sortObj);
      this.refreshPage(searchObj);
		},
    confirmPass() {
      businessAudit(this.userID, { status: this.status })
      .then( res => {
        if(!res.code) {
          this.$Message.success(res.message);
        } else this.$Message.error(res.message);
        this.refreshPage({ pageNo: this.currentPageIdx, pageSize: 20 });
      })
      
    },
    refreshPageManual(){
			this.currentPageIdx = 1;
			for(let key in this.filterSearch) {
				this.filterSearch[key] = '';
			}
      this.refreshPage({ pageNo: 1, pageSize: 20 });
    },
    changePage(pageIndex) {
			this.currentPageIdx = pageIndex;
			let searchObj = Object.assign(this.filterSearch, { pageNo: pageIndex	, pageSize: 20 });
      this.refreshPage(searchObj);
    },
    refreshPage(obj = {}) {
      this.ifLoading = true;
      queryBusiness(obj)
      .then( res => {
        if (!res.code) {
          this.ifLoading = false;
          let formatArr = [];
          this.userpage = res.data.content;
          this.totalNum = res.data.totalElements;
        }
      })
    },
    judgeRouteStatus(obj) {
      if(obj.status===undefined) this.routeStatus = null;
      else  this.routeStatus = obj.status;
      this.refreshPage({status: this.routeStatus});
    }
  },
  created() {
		queryBusinessStatus()
		.then( res => {
			if (!res.code) {
			this.checkStatus = res.data;
			this.checkStatus.push({ value: '', name: '全部' },);
			}else this.$Message.error(res.message);
		})
    this.judgeRouteStatus(this.$route.query);
	},
	computed: {
		date() {
			return this.$store.state.user.date
		}
	},
  watch: {
    '$route' (to, from) {
      this.judgeRouteStatus(to.query);
		},
		date(newVal, oldVal) {
			this.searchByFilter();
		}
	}
}
</script>

<style lang="less" scoped>
  
</style>