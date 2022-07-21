<template>
	<div>
		<Row class="btns">
			<Button type="primary"  @click="refreshPage"> 
				<Icon type="refresh"></Icon> actualizar
			</Button>
		</Row>
		<Card>
			<div slot="title">
        Información básica
			</div>
			<div class="baseInfo">
				<Row>
					<Col span="6">
            <p>estado: <span>{{ !baseInfo.status ? 'en el estante' : 'fuera del estante' }}</span></p>
					</Col>
					<Col span="6">
            <p>tipo de transacciones: <span>{{ !baseInfo.advertiseType ? 'buy' : 'sell' }}</span></p>
					</Col span="6">
					<Col span="6">
						<p>Moneda de transacción：<span>{{ !baseInfo.coin ? '' : baseInfo.coin.unit  }}</span></p>
					</Col>
					<Col span="6">
						<p>moneda de transacción：<span>{{ !baseInfo.country ? '' : baseInfo.country.localCurrency }}</span></p>
					</Col>
				</Row>
				<Row>
					<Col span="6">
						<p>Período de negociación：<span>{{ baseInfo.timeLimit }}分钟</span></p>
					</Col>
					<Col span="6">
						<p>comprar volumen：<span>{{ baseInfo.dealAmount }}</span></p>
					</Col span="6">
					<Col span="6">
						<p>nación：<span>{{ !baseInfo.country ? '' : baseInfo.country.zhName }}</span></p>
					</Col>
					<Col span="6">
						<p>método de pago：<span>{{ baseInfo.payMode }}</span></p>
					</Col>
				</Row>
				<Row>
					<Col span="6">
						<p>Monto mínimo de transacción：<span>{{ baseInfo.minLimit }}</span></p>
					</Col>
					<Col span="6">
						<p>Monto máximo de transacción：<span>{{ baseInfo.maxLimit }}</span></p>
					</Col span="6">
					<Col span="6">
						<p>Precio fijo：<span>{{ baseInfo.price }}</span></p>
					</Col>
				</Row>
				<Row>
					<Col span="6">
						<p>Observaciones：<span>{{ baseInfo.remark }}</span></p>
					</Col>
					<Col span="6" offset="6">
						<p>respuesta automática：<span>{{ !baseInfo.auto ? '是' : '否'}}</span></p>
					</Col span="6">
				</Row>
			</div>
		</Card>
			<br>
			<br>
		<Card>
			<div slot="title">
				订单明细
				<!-- <Button type="primary" size="small" @click="refreshPageManual">
					<Icon type="refresh"></Icon> 刷新
				</Button> -->
			</div>
			<Row>
				<Table
					:loading="ifLoading"
					:columns="columnsList"
					:data="userpage"
					border>
				</Table>
			</Row>
		
			<Row class="pageWrapper" >
				<Page :total="cbData.totalElements" 
							:current="currentPageIdx"   
							@on-change="changePage" 
							show-elevator>
				</Page>
			</Row>
			
		</Card>				
	</div>
</template>

<script>
import { advDetailOtc, queryOtcOrder } from '@/service/getData'
export default {
	data() {
		return {
			cbData: {},
			ifLoading: false,
			currentPageIdx: 1,
			id: '',
			memberName: '',
			baseInfo: {},
			filterSearch: {
				pageNo: 1,
				pageSize: 20,
				memberName: ''
			},
			columnsList: [
				{
          title: 'Número de pedido',
					key: 'orderSn'
				},
				{
					title: 'comerciante',
					key: 'customerName',
					render: (h, obj) => {
						let cName = obj.row.customerName;
						let mName = obj.row.memberName;
						return h('span',{}, `${cName}(${mName})`)
					}
				},
				{
					title: 'createTime',
					key: 'createTime'
				},
				{
					title: 'number',
					key: 'number'
				},
				{
					title: 'money',
					key: 'money'
				},
				{
					title: 'fee',
					key: 'fee'
				},
				{
					title: 'payMode',
					key: 'payMode'
				},
				{
					title: 'status',
					key: 'status'

				},
			],
			userpage: []
		}
	},
	methods: {
		refreshPage() {
			advDetailOtc({id: this.id})
			.then(res => {
				if(!res.code) {
					console.log(res);
					this.baseInfo = res.data;
					this.filterSearch.memberName = res.data.member.username;
					this.otcOrderTabel(this.filterSearch);
				}
				else this.$Message.error(res.message);
			})
			.catch(err => { console.log(err)})
		},
		otcOrderTabel(obj) {
			this.ifLoading = true;
			queryOtcOrder(obj)
			.then(res => {
				if(!res.code) { 
					console.log(res);
					this.cbData = res.data;
					this.userpage = res.data.content;
					this.ifLoading = false;
				}
				else this.$Message.error(res.message);
			})
		},
		changePage(pageIndex) {
			this.currentPageIdx = pageIndex;
			this.filterSearch.pageNo = pageIndex;
			this.otcOrderTabel(this.filterSearch)
		}
	},
	created () {
		this.id = this.$route.query.advID;
		this.refreshPage();
	}
}
</script>

<style lang="less" scoped>
.btns{
	line-height: 50px;
	text-align: right;
}
	.baseInfo {
		p {
			line-height: 30px;
			font-size: 15px;
			color: #adabab;
			span{
				color: #444;
			}
		}
	}
</style>


