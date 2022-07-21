<template>
<div>
  <Card>
		<p slot="title">
      Gestión de divisas
			<Button type="primary" size="small" @click="refreshPageManual">
				<Icon type="refresh"></Icon>actualizar
			</Button>
		</p>

		<Row class="functionWrapper">
			<div class="btnsWrapper clearfix">
				<Button type="primary" @click="addCoin">actualizar</Button>
			</div>
		</Row>

		<Row>
			<Table
				:columns="columnsList"
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
				show-elevator>
			</Page>
		</div>
        <p>[Tipo de cuenta] se divide en [Modo de dirección] y [Modo de cuenta], el primero está representado por BTC, puede recargar directamente a través de la dirección al recargar, mientras que el último debe completar los comentarios de Memo para marcar la ID de usuario real</p>
        <p>El botón [Agregar dirección] no agregará la dirección real de blockchain por el momento, solo inserta un registro de billetera asociado con la ID de usuario y la ID de moneda para el usuario</p>
        <p>Nota: Al crear una nueva moneda, no abra RPC, de lo contrario, se conectará a la red de bloques y creará una dirección de billetera para cada usuario, lo que puede ser muy lento.</p>
        <p>Nota: Al crear una nueva moneda, cambie el modo de dirección para que el modo de dirección genere un valor</p>
        <p>Nota: Al crear una nueva moneda, mantenga la introducción de la moneda por debajo de las 100 palabras.</p>
  </Card>

  <Modal
		v-model="showDetailModal"
		width="400"
		title="detalles">
		<p>Tarifa mínima de transacción: {{ detailModal.minTxFee}}</p>
		<p>Tarifa máxima de transacción: {{ detailModal.maxTxFee}}</p>
		<p>Cantidad mínima de retiro: {{ detailModal.minWithdrawAmount}}</p>
		<p>Cantidad máxima de retiro: {{ detailModal.maxWithdrawAmount}}</p>
        <p>Importe mínimo de recarga: {{ detailModal.minRechargeAmount}}</p>
  </Modal>

  <Modal
		v-model="showUpdateModel"
		title="Modificación de información de moneda"
		@on-cancel="cancelSub"
		@on-ok="confirmSub">
		<Form :model="coinForm" :label-width="80" class='form'>
			<FormItem label="nombre:">
				<Input v-model="coinForm.nameCn"></Input>
			</FormItem>
			<FormItem label="nombre inglés:">
				<Input v-model="coinForm.name"></Input>
			</FormItem>
			<FormItem label="unidad monetaria:">
				<Input v-model="coinForm.unit" placeHolder="Como BTC, ETH, etc. Este campo es muy importante y no se puede modificar después de la configuración."></Input>
			</FormItem>
            <FormItem label="Introducción a la moneda:">
                <Input v-model="coinForm.information"></Input>
            </FormItem>
            <FormItem label="Enlace de detalles:">
                <Input v-model="coinForm.infolink"></Input>
            </FormItem>
            <FormItem label="Tipo de cuenta:">
                <RadioGroup v-model="coinForm.accountType">
                  <Radio :label="0">
                    <span>Modo de dirección (por ejemplo: BTC)</span>
                  </Radio>
                  <Radio :label="1">
                    <span>Modo de cuenta (p. ej.: EOS)</span>
                  </Radio>
                </RadioGroup>
            </FormItem>

            <FormItem label="dirección de recarga:" v-show="coinForm.accountType==1">
                <Input v-model="coinForm.depositAddress"></Input>
            </FormItem>
			<Row>
				<Col span="8">
					<FormItem label="recargar">
						<i-switch v-model="coinForm.canRecharge" :true-value="1" :false-value="0" size="large">
							<span slot="open">abierto</span>
							<span slot="close">prohibir</span>
						</i-switch>
					</FormItem>
				</Col>
				<Col span="8">
					<FormItem label="RPC">
						<i-switch v-model="coinForm.enableRpc" :true-value="1" :false-value="0" size="large">
							<span slot="open">abierto</span>
							<span slot="close">prohibir</span>
						</i-switch>
					</FormItem>
				</Col>
				<Col span="8">
					<FormItem label="retirar">
						<i-switch v-model="coinForm.canWithdraw" :true-value="1" :false-value="0" size="large">
							<span slot="open">prohibir</span>
							<span slot="close">desactivado</span>
						</i-switch>
					</FormItem>
				</Col>
			</Row>
            <FormItem label=" ">
                <p style="color:#FF0000;font-size:10px;line-height:15px;">Nota: Al crear una nueva moneda, no habilite [RPC], de lo contrario, cuando se genere el registro "User-Wallet", la dirección real de la billetera se obtendrá a través de RPC, lo que llevará mucho tiempo.</p>
            </FormItem>

            <FormItem label="recarga minima:">
                <Input v-model="coinForm.minRechargeAmount"></Input>
            </FormItem>
			<Row>
				<Col span="12">
					<FormItem label="Tarifa mínima de manejo:">
						<Input  v-model="coinForm.minTxFee" ></Input>
					</FormItem>
				</Col>
				<Col span="12">
					<FormItem label="Tarifa máxima de manejo:">
						<Input  v-model="coinForm.maxTxFee" ></Input>
					</FormItem>
				</Col>
			</Row>

			<Row>
				<Col span="12">
					<FormItem label="Cantidad mínima de retiro:">
						<Input v-model="coinForm.minWithdrawAmount" ></Input>
					</FormItem>
				</Col>
				<Col span="12">
					<FormItem label="Cantidad máxima de retiro:">
						<Input v-model="coinForm.maxWithdrawAmount" ></Input>
					</FormItem>
				</Col>
			</Row>

			<Row>
				<Col span="12">
					<FormItem label="transferencia automática">
						<i-switch v-model="coinForm.canAutoWithdraw" :true-value="1" :false-value="0"  size="large">
							<span slot="open">habilitar</span>
							<span slot="close">desactivado</span>
						</i-switch>
					</FormItem>
				</Col>
				<Col span="12">
					<FormItem label="estado">
						<i-switch v-model="coinForm.status" :true-value="0" :false-value="1" size="large">
							<span slot="open">habilitar</span>
							<span slot="close">desactivado</span>
						</i-switch>
					</FormItem>
				</Col>
			</Row>

			<Row>
				<Col span="12">
					<FormItem label="Límite:">
						<Input v-model="coinForm.withdrawThreshold"></Input>
					</FormItem>
				</Col>
				<Col span="12">
					<FormItem label="clasificar:">
						<Input v-model="coinForm.sort"></Input>
					</FormItem>
				</Col>
			</Row>

			<Row>
				<Col span="12">
					<FormItem label="Tipo de cambio RMB:">
						<Input v-model="coinForm.cnyRate"></Input>
					</FormItem>
				</Col>
				<Col span="12">
					<FormItem label="tipo de cambio USD:">
						<Input v-model="coinForm.usdRate"></Input>
					</FormItem>
				</Col>
			</Row>
		</Form>
  </Modal>

<!--	<Modal-->
<!--		title="修改币种信息"-->
<!--		v-model="showPhoneCodeModal"-->
<!--		width="350"-->
<!--		@on-ok="confirmSub"-->
<!--		@on-cancel="cancelSub">-->
<!--		<Row>-->
<!--			<p>验证码已发送至：<span style="color: #ed3f14">{{ phoneNum | hidePhoneNumFilter}}</span></p>-->
<!--		</Row>-->
<!--		<br>-->
<!--		<Row>-->
<!--			<Input placeholder="请输入验证码" v-model="coinForm.code" :class="{appendBtn: count===0}">-->
<!--				<Button slot="append" v-if="count>0" :disabled="count>0">{{count}}s后重新获取</Button>-->
<!--				<Button slot="append" v-else-if="count===0" type="success" @click="getCodeTwice('fixedInfo')">获取验证码</Button>-->
<!--			</Input>-->
<!--		</Row>-->
<!--	</Modal>-->

	<Modal
		title="转入冷钱包"
		v-model="showColdWalletModal"
		width="380"
		>
<!--		<Form :model="coldWalletForm" :label-width="90" :rules="coldWalletRule">-->
<!--			<FormItem label="币种：">-->
<!--				<span>{{ coldWalletForm.unit }}</span>-->
<!--			</FormItem>-->
<!--			<FormItem label="转入金额：" prop="amount">-->
<!--				<Input v-model="coldWalletForm.amount"></Input>-->
<!--				<p class="transferTips">可转入金额：<span>{{ enableTransferCoin }}</span></p>-->
<!--			</FormItem>-->

<!--			<FormItem label="手机号：" v-show="needCord">-->
<!--				<Input placeholder="请输入验证码" :disabled="true" :value="phoneNum | hidePhoneNumFilter" :class="{appendBtn: count===0}">-->
<!--					<Button slot="append" v-if="count>0" :disabled="count>0">{{count}}s后重新获取</Button>-->
<!--					<Button slot="append" v-else-if="count===0" type="success" @click="getCodeTwice('coldWallet')">获取验证码</Button>-->
<!--				</Input>-->
<!--			</FormItem>-->

<!--			<FormItem label="验证码：" prop="code" v-show="needCord">-->
<!--				<Input v-model="coldWalletForm.code"></Input>-->
<!--			</FormItem>-->

<!--		</Form>-->
		<Row slot="footer">
			<Col span="11">
				<Button type="info" long @click="confirmSubCodeWallet">Transferencia a billetera fría</Button>
			</Col>
			<Col span="11" offset="2">
				<Button long @click="cancelSub">Cancelar</Button>
			</Col>
		</Row>
	</Modal>
</div>
</template>

<script>
import Cookies from 'js-cookie'
import { getStore, setStore, removeStore } from '@/config/storage'
import { tansTimeout, transferColdWallet, getColdWalletCode, setPlatformCoin, coinReviseSys, employeeDetail, querySysCoin, addSysCoin, updateSysCoin, sysCoinDetail,createMemberWallet } from '@/service/getData'

export default {
  data() {
    return {
    	needCord: true,
    	enableTransferCoin: 0,
    	coldWalletForm: {
    		unit: '',
    		amount: '',
    		code: ''
    	},
    	coldWalletRule: {
    		amount: [
    			{ required: true, message: 'Por favor ingrese el monto de la transferencia', trigger: 'blur' }
    		],
    		code: [
    			{ required: true, message: 'por favor ingrese el código de verificación', trigger: 'blur' }
    		]
    	},
    	phoneNum: '',
    	count: 0,
    	timer: '',
    	showPhoneCodeModal: false,
    	showColdWalletModal: false,
    	ifCreate: true,
    	userpage: [],
    	filterSearch: {
    		pageNo: 1,
    		pageSize: 50,
    		property: [],
    		direction: []
    	},
      totalNum: null,
      ifLoading: true,
      currentPageIdx: 1,
      showDetailModal: false,
      showUpdateModel: false,
      detailModal: {},
      coinForm: {
		code: '',
		name: '',
		nameCn: '',
		unit: '',
		status: 0,
		canWithdraw: 0,
		canRecharge: 0,
		sort: 0,
		minTxFee: '',
		cnyRate: '',
		usdRate: '',
		maxTxFee: '',
		enableRpc: 0,
		canAutoWithdraw: 0,
		withdrawThreshold: '',
		maxWithdrawAmount: '',
		minWithdrawAmount: '',
        infolink: "",
        information: "",
        minRechargeAmount: '',
        accountType: 0,
        depositAddress: ''
      },
      initForm: {
        code: '',
        name: '',
        nameCn: '',
        unit: '',
        status: 0,
        canWithdraw: 0,
        canRecharge: 0,
        sort: 0,
        minTxFee: 0,
        cnyRate: 0,
        usdRate: 0,
        maxTxFee: 0,
        enableRpc: 0,
        canAutoWithdraw: 0,
        withdrawThreshold: '',
        maxWithdrawAmount: '',
        minWithdrawAmount: '',
        infolink: "",
        information: "",
        minRechargeAmount: '',
        accountType: 0,
        depositAddress: ''
      },
      columnsList: [
        {
          title: "nameCn",
          key: "nameCn",
          width: 130
        },
        {
          title: "name",
          key: "name",
          width: 130
        },
        {
          title: "unit",
          key: "unit",
          width: 90
        },
        {
          title: "accountType",
          key: "accountType",
          width: 100,
          render: (h, obj) => {
            const row = obj.row;
            const aType = row.accountType === 1 ? "Modo de cuenta ☑" : "modo de dirección";
            return h("span", {}, aType);
          }
        },
        {
          title: "RPC",
          width: 100,
          key: "enableRpc",
          render: (h, obj) => {
            const row = obj.row;
            const status = row.enableRpc === 1 ? "abierto" : "desactivado";
            return h(
              "Tag",
              {
                props: {
                  color: row.enableRpc === 1 ? "green" : "red"
                }
              },
              status
            );
          }
        },
        {
          title: "transferencia automática",
          width: 100,
          key: "canAutoWithdraw",
          render: (h, obj) => {
            const row = obj.row;
            const status = row.canAutoWithdraw === 1 ? "abierto" : "cerca";
            return h(
              "Tag",
              {
                props: {
                  color: row.canAutoWithdraw === 1 ? "green" : "red"
                }
              },
              status
            );
          }
        },
        {
          title: "canWithdraw",
          key: "canWithdraw",
          width: 60,
          render: (h, obj) => {
            const row = obj.row;
            const canWithdraw = row.canWithdraw === 1 ? "Sí" : "no";
            return h("span", {}, canWithdraw);
          }
        },
        {
          title: "canRecharge",
          key: "canRecharge",
          width: 60,
          render: (h, obj) => {
						const row = obj.row;
            const canRecharge = row.canRecharge === 1 ? "Sí" : "no";
            return h("span", {}, canRecharge);
          }
		},
        {
          title: "status",
          width: 100,
          key: "status",
          render: (h, obj) => {
            const row = obj.row;
            const status = row.status === 0 ? "habilitar" : "deshabilitar";
            return h(
              "Tag",
              {
                props: {
                  color: row.status === 0 ? "green" : "red"
                }
              },
              status
            );
          }
        },
        {
          title: "blockHeight",
          key: "blockHeight",
          width: 90
        },
				/*
				重要！！
					{
						title: "平台币",
						key: "isPlatformCoin",
						render: (h, obj) => {
							return h("i-switch", {
								props: {
									'value': obj.row.isPlatformCoin,
									'true-value': 1,
									'false-value': 0,

								},
								on: {
									'on-change': (val) => {
										this.ifLoading = true;
										this.isPlatformCoin = val;
										setPlatformCoin({ name: obj.row.name })
										.then(res => {
											if(!res.code) {
												this.$Message.success(res.message);
											}else this.$Message.error(res.message);
											this.filterSearch.pageNo = this.currentPageIdx;
											this.refreshPage(this.filterSearch);
										})
										.catch(err => console.log(err))
									}
								}
							},[
								h("span",{
									slot: 'open',
								}, '是'),
								h("span",{
									slot: 'close',
								}, '否')
							] );
						}
					},
				*/
        {
          title: "allBalance",
          width: 160,
					key: "allBalance",
					render: (h, obj) => {
						let num = obj.row.allBalance;
						if( num && num < 1) {
							num = num.toFixed(8);
						}
						return h('span', {}, num)
					}
        },
        {
          title: "hotAllBalance",
          key: "hotAllBalance",
          width: 160
        },
        {
          title: "coldWalletAddress",
          key: "coldWalletAddress",
          width: 160
		},
        {
          title: "depositAddress",
          key: "depositAddress",
          width: 160,
          render: (h, obj) => {
            const row = obj.row;
            const dAddress = row.accountType === 1 ? row.depositAddress : "";
            return h("span", {}, dAddress);
          }
        },
		{
			title: "Agregar billetera",
            width: 100,
			render:(h,obj)=>{
				return h("Button",{
					props: {
                    type: "info",
                    size: "small"
				},
          on: {
            click: () => {
				const coinName=obj.row.name;
				createMemberWallet({coinName}).then((data)=>{
				    console.log(data)
				});
            }
          }
				},"añadir")
			}
        },
        {
          title: "funcionar",
          width: 130,
          fixed: 'right',
          render: (h, obj) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
									},
                  style: {
										color: '#2d8cf0',
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
											this.detailModal = obj.row;
                      this.showDetailModal = true;
                    }
                  }
                },
                "Detalles"
              ),
              h("Dropdown",{
								props: {
									transfer: true
								},
									on: {
										'on-click': (name) => {
											if(name==='change') {
												sysCoinDetail({name: obj.row.name })
												.then(res => {
													let obj = {};
													if(!res.code) {
														// for( let key in this.coinForm) {
															Object.assign(this.coinForm,res.data)
															console.log(this.coinForm);
															// this.coinForm[key] = res.data[key];
														// }
														this.ifCreate = false;
														this.showUpdateModel = true;
													}else this.$Message.error(res.message)
												})
												.catch(err => console.log(err));
											}else if(name === 'coldWallet') {
												this.coldWalletForm.unit = obj.row.unit;
												this.enableTransferCoin = obj.row.hotAllBalance;
												tansTimeout({phone: Cookies.get('userPhone') })
												.then(res => {
													if(!res.code) {
														this.needCord = false;
													}else{
														this.needCord = true;
													}
												})
												this.showColdWalletModal = true;
											}else if(name === 'transformDetail') {
												this.$router.push({ path: '/system/coin/transferdetail', query: {unit: obj.row.unit}});
											}
										}
									}
							},[
								h("DropdownMenu",{
									slot: 'list'
								},[
										h("DropdownItem",{
											props: {
												name: 'change'
											}
										},'Revisar'),
										h("DropdownItem",{
											props: {
												name: 'coldWallet'
											}
										},'Transferencia a billetera fría'),
										h("DropdownItem",{
											props: {
												name: 'transformDetail'
											}
										},'Detalles de la transferencia')
								]),
								h("Button",{
									props: {
                    type: "text",
                    size: "small"
									},
                  style: {
										color: '#2d8cf0',
                    marginRight: "5px"
                  },
								},"Más")
							]
              )
            ]);
          }
        }
      ],
    };
  },
  methods: {
		ininFormDate(){
			this.coinForm={
				code: '',
				name: '',
				nameCn: '',
				unit: '',
				status: 0,
				canWithdraw: 0,
				canRecharge: 0,
				sort: 0,
				minTxFee: 0,
				cnyRate: 0,
				usdRate: 0,
				maxTxFee: 0,
				enableRpc: 0,
				canAutoWithdraw: 0,
				withdrawThreshold: '',
				maxWithdrawAmount: '',
				minWithdrawAmount: '',
				infolink: "",
				information: "",
				minRechargeAmount: '',
				accountType: 0,
				depositAddress: ''
			};
		},
		confirmSubCodeWallet() {
			if(this.needCord) {
				for (let key in this.coldWalletForm)  {
					if(this.coldWalletForm[key].trim()==='') {
						this.$Message.warning('请完善信息！')
						return;
					}
				}
			}else{
				if(this.coldWalletForm.unit.trim()==='' || this.coldWalletForm.amount.trim()==='') {
					this.$Message.warning('请完善信息！')
					return;
				}
			}
			transferColdWallet(this.coldWalletForm)
			.then( res => {
				if(!res.code) {
					this.$Message.success(res.message);
				} else this.$Message.error(res.message);
				this.showColdWalletModal = false;
				this.enableTransferCoin = 0;
				this.count = 0;
			})
			.catch(err => console.log(err))

		},
		getCode(str) {
			let fn = '';
			if(str==='fixedInfo') {
				fn = coinReviseSys;
			}else if(str==='coldWallet'){
				fn = getColdWalletCode;
			}
			fn({ phone: this.phoneNum })
			.then(res => {
				this.$Notice.info({
					title: res.message | hidePhoneNum,
					desc: ''
				});
			})
			.catch(err => {console.log(err)})
		},
		getCodeTwice(str) {
			this.count = 60;
			this.getCode(str);
		},
		// showNeedCode() {
		// 	this.showPhoneCodeModal = true;
		// 	this.getCode('fixedInfo');
		// },
		cancelSub() {
			for(let key in this.coinForm) {
				this.coinForm[key] = '';
			}
			for(let key in this.coldWalletForm) {
				this.coldWalletForm[key] = '';
			}
			this.enableTransferCoin = 0;
			this.coinForm.status = this.coinForm.canWithdraw = this.coinForm.canRecharge
			 = this.coinForm.enableRpc = this.coinForm.canAutoWithdraw = 0;
			 this.showColdWalletModal = false;
		},
    confirmSub() {
			let fn = '';
			if(this.ifCreate) fn = addSysCoin
			else fn = updateSysCoin
			console.log(this.coinForm);
			fn(this.coinForm)
			.then(res => {
				if(!res.code) {
					this.$Message.success(res.message)
				}else this.$Message.error(res.message)
				this.refreshPage();
			})
			.catch(err => console.log(err));
    },
    addCoin() {
	  this.cancelSub();
	  this.ifCreate = true;
      this.ininFormDate();
      this.showUpdateModel = true;
    },
    refreshPage(obj={}) {
    	this.ifLoading = true;
        this.currentPageIdx = 1;
        this.filterSearch.pageNo = 1;
    	querySysCoin(this.filterSearch)
    	.then(res => {
    		if(!res.code) {
    			this.userpage = res.data.content;
    			this.totalNum = res.data.totalElements;
    		}else this.$Message.error(res.message)
    			this.ifLoading = false;
    	})
    	.catch(err => console.log(err))
    },
    changePage(pageIndex) {
			this.currentPageIdx = pageIndex;
			this.filterSearch.pageNo = pageIndex;
      this.refreshPage(this.filterSearch);
    },
    refreshPageManual() {
      this.refreshPage(this.filterSearch);
    }
  },
  created() {
		this.phoneNum = JSON.parse(Cookies.get('userInfo')).mobilePhone;
		this.refreshPage();
	},
	filters: {
		hidePhoneNumFilter(val) {
			return val.split('').fill('*',3,7).join('');
		}
	},
	watch: {
		count(newVal, oldVal) {
			if(newVal>0){
				this.timer = setTimeout(()=> {
					this.count--;
				}, 1000)
			}else{
				clearTimeout(this.timer)
			}
		}
	}
};

</script>

<style lang="less" scoped>
	.transferTips{
		position: absolute;
    bottom: -24px;
		color: #999;
		line-height: 23px;
	}
</style>
