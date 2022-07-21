<template>
  <div class="ExitBond">
    <Card>
      <p slot="title">
        Gestión de rendición
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          actualizar
        </Button>
      </p>

			<Row class="functionWrapper">
        <div class="searchWrapper clearfix">
					
					<div class="poptip">
						<Poptip trigger="hover" content="Ingrese el apodo, el correo electrónico y el número de teléfono móvil del miembro"" placement="bottom-start">
							<Input placeholder="Ingrese el apodo del miembro, correo electrónico, número de teléfono móvil" v-model="filterSearch.account"/></Input>
						</Poptip>
					</div>

					<div class="poptip">
						<Select v-model="filterSearch.status" placeholder="Seleccione un estado">
							<Option v-for="item in statusArr" :value="item.value" :key="item.value">{{item.name}}</Option>
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

			<Modal
				class="bondCheck" 
				title="Revisión de rendición"
				v-model="bondCheck"
				@on-cancel="cancelSub"
			>
				<Row>cantidad de rescate： {{
					!exitBondDetail.depositRecord ? '' : exitBondDetail.depositRecord.amount+exitBondDetail.depositRecord.coin.unit }}</Row>
				<Row>motivo de entrega： {{ (!exitBondDetail.businessCancelApply ? '无' : exitBondDetail.businessCancelApply.reason) | reasonFilter }}</Row>
				<br>
				<Row>
					<Col span="8">
            Número de anuncios publicados：{{ exitBondDetail.advertiseNum }}
					</Col>
					<Col span="8">
            Apelaciones：{{ exitBondDetail.complainantNum }}
					</Col>
					<Col span="8">
            Apelaciones：{{ exitBondDetail.defendantNum }}
					</Col>
				</Row>
				<br>
				<Row>
					<Col span="12">
            facturación total：{{ !exitBondDetail.money ? 0 : exitBondDetail.money }}
					</Col>
					<Col span="12" >
            tarifa total de manejo：{{ !exitBondDetail.fee ? 0 : exitBondDetail.fee }}
					</Col>
				</Row>
				<br>
				<br>
				<p>Nota: Después de la aprobación, el sistema transferirá automáticamente el depósito a la cuenta del usuario</p>

				<div slot="footer">
					<Row>
						<Col span="8" offset="3">
							<Button long type="info" @click="confirmPass(1)">审核通过</Button>
						</Col>
						<Col span="8" offset="3">
							<Button long type="error" @click="confirmPass(0)">审核不通过</Button>
						</Col>
					</Row>
				</div>
			</Modal>

			<Modal title="Motivo del rechazo (opcional)"
				v-model="rejectModal"
				width="400"
				@on-ok="subReject"
			>
				<Input v-model="subCheck.reason" type="textarea" placeholder="Por favor, introduzca un motivo de rechazo...">
				</Input>
			</Modal>
    </Card>
    </div>
</template>

<script>

import { cancelBusinessStatus, MemberRealNameList, accessLog, queryCancelApply, cancelApplyDetail, checkApply } from '@/service/getData';
import { setStore, getStore, removeStore } from '@/config/storage';

export default {
	name: 'ExitBond',
  data() {
    return {
			rejectModal: false,
			exitBondDetail: {},
			subCheck: {
				id: '',
				success: '',
				reason: '',
				
			},
			bondCheck: false,
			statusArr: [],
			filterSearch: {
				pageNo: 1,
				pageSize: 20,
				status: '',
				account: '',
				direction: [],
				property: []
			},
      currentPageIdx: 1,
      ifLoading: true,
      totalNum: null,
      columns_first: [
        {
					title: 'username',
					key: 'username',
					render: (h, ctx) => {
						return h('span', {}, ctx.row.member.username)
					}
        },
        {
          title: "email",
					key: "email",
					render: (h, ctx) => {
						return h('span', {}, ctx.row.member.email)
					}
        },
         {
          title: "mobilePhone",
					key: "mobilePhone",
					render: (h, ctx) => {
						return h('span', {}, ctx.row.member.mobilePhone)
					}
        },
        {
					title: "unit",
					key: 'unit',
					render: (h, ctx) => {
						return h('span', {}, ctx.row.depositRecord.coin.unit)
					}
        },
        {
          title: "amount",
					key: "amount",
					render: (h, ctx) => {
						return h('span', {}, ctx.row.depositRecord.amount)
					}
        },
        {
          title: "cancelApplyTime",
          key: "cancelApplyTime"
				},
				{
          title: "handleTime",
					key: "handleTime",
					render: (h, ctx) => {
						return h('span', {}, !ctx.row.handleTime ? '-' : ctx.row.handleTime);
					}
				},
				{
          title: "status",
					key: "status",
					render: (h, ctx) => {
						let status = '';
						if(ctx.row.status === 6) status = 'fallar';
						else if(ctx.row.status === 5) status = 'revisión pendiente';
						else if(ctx.row.status === 7) status = 'éxito';
						return h('span', {}, status);
					}
				},
				// {
        //   title: "审核人",
        //   key: "module"
				// },
				{
          title: "module",
					key: "module",
					render: (h, ctx) => {
						let btnText = '审核';
						let btnType = 'info';
						if(ctx.row.status === 5) {
							 btnText = 'auditoría';
							 btnType = 'info';
						}else{
							 btnText = '查看';
						   btnType = 'success';
						}
						return h('Button', {
							props: {
								type: btnType,
								size: 'small'
							},
							on: {
								click: () => {
									if(ctx.row.status === 5) {
										cancelApplyDetail({id: ctx.row.id})
										.then(res => {
											if(!res.code) {
												this.exitBondDetail = res.data;
												this.bondCheck = true;
												this.subCheck.id = ctx.row.id;
											}else this.$Message.error(res.message);
										})
									}else{
										this.$router.push({path: '/otc/adManage/exitbonddetail', query: { id: ctx.row.id }});
									}
								}
							}
						}, btnText)
					}
				}
      ],
      userpage: [],
    };
  },
  methods: {
		cancelSub() {
			for(let key in this.subCheck)  {
				this.subCheck[key] = '';
			}
		},
		subReject() {
			checkApply(this.subCheck)
			.then(res => {
				if(!res.code) {
					this.$Message.success(res.message);
					this.refreshPage(this.filterSearch);
					this.cancelSub();
					this.rejectModal = this.bondCheck = false;
				}else this.$Message.error(res.message)
			})
		},
		confirmPass(n) {
			this.subCheck.success = n;
			if(!n) this.rejectModal = true;
			else{
				checkApply(this.subCheck)
				.then(res => {
					if(!res.code) {
						this.$Message.success(res.message);
						this.refreshPage(this.filterSearch);
						this.cancelSub();
						this.rejectModal = this.bondCheck = false;
					}else this.$Message.error(res.message)
				})
			}
		},
		searchByFilter() {
			this.filterSearch.pageNo = 1;
			this.currentPageIdx = 1;
			console.log(this.filterSearch);
			
      this.refreshPage(this.filterSearch);
		},
    refreshPageManual() {
			this.currentPageIdx = 1;
			for(let key in this.filterSearch)  {
				this.filterSearch[key] = '';
			}
			this.filterSearch.pageNo = 1;
			this.filterSearch.pageSize = 10;
			this.filterSearch.direction = [];
			this.filterSearch.property = [];
      this.refreshPage(this.filterSearch);
    },
    refreshPage(obj) {
			this.ifLoading = true;
      queryCancelApply(obj)
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
		cancelBusinessStatus().then(res => {
			if(!res.code){
				this.statusArr = res.data;
				this.statusArr.push({ value: '', name: 'todos' });
			}else this.$Message.error(res.message);
		});
		this.refreshPage()
	},
	filters: {
		reasonFilter(val) {
			if(!val) return '无';
			else return val;
		}
	}
}
</script>

<style scoped lang='less'>
	.bondCheck{
		.ivu-row{
			font-size: 16px;
			line-height: 32px;
		}
		p{
			color: #afafaf;
			text-align: center;
		}
	}
</style>