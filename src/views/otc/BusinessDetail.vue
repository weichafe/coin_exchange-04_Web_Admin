<template>
	<Card class="businessDetail">
		<p slot="title">
      Información de negocios
			<Button type="primary" size="small" @click="refreshPageManual">
				<Icon type="refresh"></Icon>
        actualizar
			</Button>
		</p>
		<Spin class="loading" v-if="ifLoading" size="large"></Spin>
		<Row>
			<Col span="6">
        Estado de aprobación：<span class="status">{{ userInfo.status | filterStatus }}</span>
			</Col>
			<Col span="6">
        nombre real：<span>{{ userInfo.realName }}</span>
			</Col>
			<Col span="6">
        Margen：<span>{{ userInfo.amount + userInfo.info.coinSymbol }}</span>
			</Col>
		</Row>
		<Row>
			<Col span="6">
        Número de teléfono：<span>{{ userInfo.info.telno }}</span>
			</Col>
			<Col span="6">
        número de chat：<span>{{ userInfo.info.wechat }}</span>
			</Col>
			<Col span="6">
        número QQ：<span>{{ userInfo.info.qq }}</span>
			</Col>
		</Row>
		<Row>
      Motivo del fracaso：<span>{{ !userInfo.detail ? '无' : userInfo.detail }}</span>
		</Row>

		<Row class="imgs" type="flex" justify="space-around">
			<Col span="11">
				<img :src="userInfo.info.assetData" alt="Prueba de activos digitales personales"><br>
				<p style="color:#333">Prueba de activos digitales personales</p>
			</Col>
			<Col span="11">
				<img :src="userInfo.info.tradeData" alt="Prueba de transacción de activos digitales"><br>
				<p style="color:#333">Prueba de transacción de activos digitales</p>
			</Col>

		</Row>
	</Card>
</template>

<script>
import { authBusinessDetail } from '@/service/getData'
export default {
	name: 'BusinessDetail',
	data() {
		return {
			ifLoading: false,
			userInfo: {
				info: {}
			}
		}
	},
	methods: {
		refreshPageManual() {
			this.refreshPage();
		},
		refreshPage() {
			this.ifLoading = true;
			authBusinessDetail({id: this.$route.query.id})
			.then(res => {
				if(!res.code){
					this.userInfo = res.data;
				}else this.$Message.error(res.message)
				this.ifLoading = false;
			})
			.catch(err => console.log(err))
		}
	},
	created() {
		this.refreshPage();
	},
	filters: {
		filterStatus(val) {

      let arr = ['no certificado', 'certificado-para ser revisado', 'certificado-auditado con éxito', 'certificado-auditado fallido', 'margen insuficiente'];
			return arr[val];
		}
	}
}
</script>

<style lang="less" scoped>
	.businessDetail{
		font-size: 16px;
		color: #adadad;
		.ivu-row {
			.status{
				color: #ec0909;
			}
			line-height: 60px;
		}
		.ivu-row-flex.imgs{
			margin-top: 70px;
			img{
				width: 100%;
				height: 300px;
				background-color: red;
			}
			p{
				text-align: center;
			}
		}
		.loading{
			position: absolute;
			z-index: 100;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(255, 255, 255, .8);
		}
	}
</style>