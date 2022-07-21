<template>
  <div>
    <Card>
      <p slot="title">
        detalles del pedido <span class="orderDetail">{{ cbData.orderSn }}</span>
      </p>
			<div class="baseInfo">
				<Row>
					<Col span="6">
            <p>estado: <span class="status">{{ !cbData.isSuccess ? 'lost' : 'wins' }}</span></p>
					</Col>
					<Col span="6">
						<p>Moneda de transacción：<span>{{ cbData.coinName }}</span></p>
					</Col>
					<Col span="6">
            <p>tipo de transacciones: <span>{{ !cbData.advertiseType ? 'buy' : 'sell' }}</span></p>
					</Col>
					<Col span="6">
						<p>método de pago：<span>{{ cbData.payMode }}</span></p>
					</Col>
				</Row>
				<Row>
					<Col span="6">
						<p>querellante：<span>{{ cbData.initiatorName }}</span></p>
					</Col>
					<Col span="6">
						<p>anunciantes：<span>{{ `(${cbData.advertiseCreaterName})${cbData.advertiseCreaterUserName}` }}</span></p>
					</Col>
					<Col span="6">
						<p>enterrador：<span>{{ `(${cbData.customerUserName})${cbData.customerName}`}}</span></p>
					</Col>
				</Row>
				<Row>
					<Col span="6">
						<p>cantidad de pedido ：<span>{{ cbData.number }}</span></p>
					</Col>
					<Col span="6">
						<p>Total de la orden：<span>{{ cbData.money }}</span></p>
					</Col>
				</Row>
				<Row>
						<p>Observación：<span>{{ cbData.remark }}</span></p>
				</Row>
			</div>
    </Card>
    </div>
</template>

<script>

import { appealManageDetail } from '@/service/getData';

export default {
	name: 'AppealDetail',
  data() {
   return {
		 cbData: {}
	 }
	},
	methods: {
		refreshPage(obj) {
			appealManageDetail(obj)
			.then(res => {
				if(!res.code) {
					this.cbData = res.data;
				}else this.$Message.error(res.message);
			})
			.catch(err => console.log(err))
		}
	},
  created() {
		this.refreshPage({ id: this.$route.query.id })
  }
}
</script>

<style scoped lang='less'>
@import '../../styles/common.less';
	.orderDetail {
		color: @primary;
	}
	.status{
		color: @light-primary !important;
	}
</style>