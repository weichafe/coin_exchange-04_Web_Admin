<template>
	<div>
    <Card>
      <p slot="title">
        Gestión de miembros
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>actualizar
        </Button>
      </p>
      <Row class="functionWrapper">
        <div class="searchWrapper clearfix">
					<div class="poptip">
						<Poptip trigger="hover" content="Ingrese nombre de usuario, correo electrónico, número de teléfono móvil, nombre para buscar" placement="bottom-start">
							<Input placeholder="Ingrese nombre de usuario, correo electrónico, número de teléfono móvil, nombre para buscar"
										v-model="filterSearch.account"
										style="width: 300px"/>
							</Input>
						</Poptip>
					</div>

					<div class="poptip">
						<span>estado de miembro：</span>
						<Select v-model="filterSearch.commonStatus">
							<Option v-for="item in memberStatusArr"
										:value="item.status"
										:key="item.status">{{ item.text }}</Option>
						</Select>
					</div>

          <div class="poptip">
            <span>es un agente：</span>
            <Select v-model="filterSearch.superPartner">
              <Option v-for="item in superPartnerArr"
                    :value="item.value"
                    :key="item.value">{{ item.text }}</Option>
            </Select>
          </div>

					<div class="btns">
						<Button type="info" size="small" @click="searchByFilter">búsqueda</Button>
					</div>

        </div>
        <div class="btnsWrapper clearfix">
          <Button type="success" @click="exportExcel">exportar</Button>
        </div>
      </Row>

      <Row class="margin-top-10 searchable-table-con1">
          <Table
            :columns="columns_first"
            :data="userpage"
            border
            :loading="ifLoading"
            ref="tabel"
            class='user_center'>
          </Table>
      </Row>

      <Row class="pageWrapper" >
        <Page :total="totalNum" style='margin-top:8px' :current="currentPageIdx"   @on-change="changePage" show-elevator></Page>
      </Row>
    </Card>
        <Modal class="auditModel" v-model="detailModel"  title="Agregar una invitación" @on-ok="setInviterDetail">
            <ul>
                <li><span><i>*</i>ID：</span>
                    <p>
                        <Input v-model="this.userId" disabled></Input>
                        <span>{{ }}</span>
                    </p>
                </li>
                <li>
                    <span><i>*</i>Establezca la identificación del invitador:</span>
                    <p> <Input v-model="inviterId"></Input> </p>
                </li>
            </ul>
        </Modal>
  </div>
</template>

<script>

import { setStore, getStore, removeStore } from '@/config/storage';
import { memberManage, forbiddenMember, forbiddenMemberTrans, setSuperPartner,setInviter  } from '@/service/getData';

export default {
  data () {
    return {
			currentPageIdx: 1,
			filterSearch: {
				account: '',
				commonStatus: '',
                superPartner: '',
			},
            //弹窗和信息
            detailModel: false,
            userId: "",
            inviterId: null,
			memberStatusArr: [
				{ status: 0, text: 'normal' },
				{ status: 1, text: 'ilegal' },
				{ status: '', text: 'todos' },
			],
      superPartnerArr: [
        { value: '0', text: 'no' },
        { value: '1', text: 'Sí' }
      ],
      totalNum: null,
      ifLoading: true,
      usemmuber:'',
      pageIndex:1,
      loading:true,
      columns_first: [
        {
          type: 'selection',
          width: 60
        },
        {
          title: 'ID',
          key: 'id',
          width: 70
        },
        {
          title: 'username',
          key: 'username',
          width: 120
        },
        {
          title: 'mobilePhone',
          key: 'mobilePhone',
          width: 110
        },
        {
          title: 'memberLevel',
          key: 'memberLevel',
          width:90,
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
          title: 'realName',
          key: 'realName',
          width:90
        },
        {
          title: 'inviterId',
          key: 'inviterId',
          width:90
        },
        {
          title: 'registrationTime',
          width: 150,
          key: 'registrationTime'
				},
				{
          title: 'transactionStatus',
          key: 'transactionStatus',
          width:90,
          render: (h, obj) => {
            let  userStatus = obj.row.transactionStatus;
           	let statusTxt = !userStatus ? 'desactivado' : 'normal';
            return h('span', {
            }, statusTxt);
          }
        },

        {
          title: 'estado',
          width:90,
          key: 'status',
          render: (h, obj) => {
            let  userStatus = obj.row.status;
            let statusTxt = null;
            userStatus === 0 ? statusTxt = 'normal' : statusTxt = 'ilegal';

            return h('span', {
            },statusTxt);
          }
        },
        {
          title: 'email',
          key: 'email',
          width: 150
        },
        {
         title:"agente",
         key:"superPartner",
         render:(h, obj) =>{
           let superPartner = obj.row.superPartner;
           let text = null;
           superPartner == 0 && (text = "Miembro ordinario");
           superPartner == 1 && (text = "súper agente");
           superPartner == 2 && (text = "súper compañero");
           return h('span',{},text);
         }
        },
        {
          title: 'action',
          key: 'action',
          width: 150,
          fixed: 'right',
          align: 'center',
          render: (h, obj) => {
						let memberStatus = !obj.row.status ? 1 : 0;
						let memberTxt = !obj.row.status ? 'desactivado' : 'levantar la prohibición';
						let memberStatusTrans = !obj.row.transactionStatus ? 1 : 0;
						let memberTxtTrans = !obj.row.transactionStatus ? 'permitir transacciones' : 'ninguna transacción';
            let memberSuperSpartner = obj.row.superPartner === '0' ? '1' : '0';
            let setSuperSpartnerTxt = obj.row.superPartner === '0' ? 'Agente autorizado' : 'cancelar agencia';
						// let
						return h('div', {
						}, [
							h('Button', {
								props: {
									type: 'info',
									size: 'small',
								},
								on: {
									click: () => {
										removeStore('memberID');
										setStore('memberID', obj.row.id);
										this.$router.push('/member/memberdetail');
									}
								}
							}, 'Controlar'),
                            h(
                                "Button",
                                {
                                    props: {type: "primary",size: "small"}, style: {marginRight: "10px"},
                                    on: {
                                        click: () => {
                                            if(obj.row.inviterId!=null){
                                                this.$Message.error("El invitador ya existe");
                                                return;
                                            }
                                            this.detailModel = true;
                                            this.userId = obj.row.id;
                                            // this.inviterId = obj.row.inviterId;
                                        }
                                    }
                                },
                                "añadir invitación"
                            ),
							h('Dropdown', {
								props: {
									transfer: true
								},
								on: {
									'on-click': (name) => {
										if(name === 'forbidden') {

											forbiddenMember({ memberId: obj.row.id, status: memberStatus })
											.then(res => {
												if(!res.code) {
													this.$Message.success(res.message)
												}else this.$Message.error(res.message)
												this.refreshPage({ pageNo: this.currentPageIdx, pageSize: 20, property: 'registrationTime', direction: 1 })
											})
											.catch( err => { console.log(err)})
										}else if(name === 'forbiddenTrans') {
											forbiddenMemberTrans({ memberId: obj.row.id, status: memberStatusTrans })
											.then(res => {
												if(!res.code) {
													this.$Message.success(res.message)
												}else this.$Message.error(res.message)
												this.refreshPage({ pageNo: this.currentPageIdx, pageSize: 20, property: 'registrationTime', direction: 1 })
											})
										}else if(name === 'setSuperSpartner') {
                      setSuperPartner({ memberId: obj.row.id, superPartner: memberSuperSpartner })
                      .then(res => {
                        if(!res.code) {
                          this.$Message.success(res.message)
                        }else this.$Message.error(res.message)
                        this.refreshPage({ pageNo: this.currentPageIdx, pageSize: 20, property: 'registrationTime', direction: 1 })
                      })
                    }
									}
								}
							}, [
								h('DropdownMenu', {
									slot: 'list'
								}, [
										h("DropdownItem",{
											props: {
												name: 'forbidden'
											}
										}, memberTxt),
										h("DropdownItem",{
											props: {
												name: 'forbiddenTrans'
											}
										}, memberTxtTrans),
                    h("DropdownItem",{
                      props: {
                        name: 'setSuperSpartner'
                      }
                    }, setSuperSpartnerTxt)
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
							])
						])

          }
        }
      ],
      userpage: []
    }
  },
  methods: {
    refreshPageManual() {
    for(let val in this.filterSearch)  {
			this.filterSearch[val] = '';
		}
		this.currentPageIdx = 1;
      this.refreshPage({ pageNo: 1, pageSize: 20, property: 'registrationTime', direction: 1 });
    },
    exportExcel () {
      this.$refs.tabel.exportCsv({
        filename: 'hello'
      });
    },
    searchByFilter(){
			this.$store.commit('switchLoading', true);
      memberManage(this.filterSearch)
      .then( res => {
        if (!res.code) {
          this.ifLoading = false;
          this.userpage = res.data.content;
					this.totalNum = res.data.totalElements;
					this.$store.commit('switchLoading', false);
        }else console.log(this.$Message.error(res.message))
			})
			.catch(err => console.log(err))
    },

    changePage(pageIndex) {
      this.currentPageIdx = pageIndex;
			this.ifLoading = true;
			let obj =Object.assign({ pageNo: pageIndex, pageSize: 20, property: 'registrationTime', direction: 1 }, this.filterSearch);
      this.refreshPage(obj);
    },
      setInviterDetail() {
          let params = {
              id: this.userId,
              inviterId: this.inviterId
          };
          setInviter(params).then(res => {
              if (!res.code) {
                  this.$Message.success("Modificado con éxito！");
                  this.refreshPageManual();
              } else {
                  this.$Message.error(res.message);
              }
          })
      },
    refreshPage(obj = {}) {
			this.ifLoading = true;
      memberManage(obj)
      .then( res => {
        if (!res.code) {
          this.ifLoading = false;
          this.userpage = res.data.content;
          this.totalNum = res.data.totalElements;
        }
      })
		}
  },
  created() {
    this.refreshPage({  property: 'registrationTime', direction: 1 });
  },
  // watch: {
  //   // account( newval, oldVal ) {
  //   //   if(!String(newval).length ) {
  //   //     this.refreshPage({  property: 'registrationTime', direction: 1 });
  //   //   }
  //   // }
  // }
}
</script>

<style lang="less" scoped>
  .search-mask{
    position: absolute;
    z-index: 8888;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .2);
  }
</style>
