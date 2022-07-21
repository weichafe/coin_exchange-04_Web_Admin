<template>
    <div>
      <Card>
        <p slot="title">
          editar usuario
        </p>

        <Row class="mainEmployeeContent">
          <Form ref="formCustom" 
          :model="formWrapperObj" 
          :rules="ruleFrom" 
          :label-width="90"
          label-position="right">

            <FormItem label="nombre de usuario：" prop="username">
              <Input type="text" v-model="formWrapperObj.username"></Input>
            </FormItem>

            <FormItem label="clave：" prop="password" class="resetRequired" :class="{ 'resetFromErr': uerpsCheck}">
              <Input type="password" v-model="formWrapperObj.password"></Input>
              <div  v-if="uerpsCheck" class="ivu-form-item-error-tip">Contraseña inconsistente ingresada dos veces！</div>
            </FormItem>

            <FormItem v-if="!employeeID" label="Confirmar contraseña：" prop="passwdCheck" class="resetRequired" :class="{ 'resetFromErr': uerpsCheck}">
              <Input type="password" v-model="formWrapperObj.passwdCheck"></Input>
              <div  v-if="uerpsCheck" class="ivu-form-item-error-tip">Contraseña inconsistente ingresada dos veces！</div>
            </FormItem>

            <FormItem label="nombre real：" prop="realName">
              <Input type="text" v-model="formWrapperObj.realName"></Input>
            </FormItem>

             <FormItem label="número de contacto：" prop="mobilePhone">
              <Input type="text" v-model="formWrapperObj.mobilePhone"></Input>
            </FormItem>

            <FormItem label="Role：" prop="role">
              <Select v-model="formWrapperObj.roleId" >
                <Option v-for="role in roleArr" :key="role.id" :value="role.id">{{ role.role }}</Option>
              </Select>
							<router-link to="/system/rolemanage">Agregar rol</router-link>
            </FormItem>

            <FormItem label="Departamento：" prop="depart">
              <Select v-model="formWrapperObj.departmentId">
                <Option v-for="depart in departArr" :key="depart.id" :value="depart.id">{{ depart.name }}</Option>
              </Select>
							<router-link to="/system/departmanage">Agregar departamento</router-link>
            </FormItem>

            <Row class="dashLine">
              <Button type="text" @click=" swtichMore = !swtichMore ">
                <span v-if="!swtichMore">Más <Icon type="chevron-down"></Icon></span>
                <span v-else>guardar <Icon type="chevron-up"></Icon></span>
              </Button>
            </Row>  

            <Row v-show="swtichMore">
              <FormItem label="Estatus de usuario：">
                <RadioGroup v-model="formWrapperObj.enable">
                  <Radio label="0">normal</Radio>
                  <Radio label="1">desactivado</Radio>
                </RadioGroup>
              </FormItem>

              <FormItem label="QQ：" prop="tencentQQ">
                <Input type="text" v-model="formWrapperObj.qq"></Input>
              </FormItem>

              <FormItem label="Correo：" prop="email">
                <Input type="text" v-model="formWrapperObj.email" ></Input>
              </FormItem>

              <FormItem label="avatar：" prop="avatar">
                <Input type="text" v-model="formWrapperObj.avatar"></Input>
              </FormItem>
            </Row>

            <FormItem>
              <Button type="success" long @click="confrimSub">confirmar</Button>
            </FormItem>
          </Form>
        </Row>
      </Card>
    </div>
</template>

<script>

import { setStore, getStore, removeStore } from '@/config/storage';
import { roleManage, departmentManage, addAuditEmployee, employeeDetail } from '@/service/getData'



export default {
  
  data() {
    
    const telPass = (rule, value, callback) => {
      console.log(value);
      
    }
    return {  
      uerpsCheck: false,
      employeeID: null,
      swtichMore: false,
      roleArr: [],
      departArr: [],
      formWrapperObj: {
        id: null,//f  //11 不需要
        username: null, //11
        password: null, //隐藏
        enable: 0,//f //11
        passwdCheck: null, //隐藏
        roleId: null,// 11
        departmentId: null,//11
        realName: null,//11
        mobilePhone: null,//11
        qq: null,//f//11
        email: null,//f//11
        avatar: null,//f//11
      },
      ruleFrom: {
        username: [
          { required: true, message: 'El nombre de usuario no puede estar vacío！', trigger: 'blur' }
          // { required: true, validator: validatePass, trigger: 'change' }
          // { required: true, message: 'The name cannot be empty', trigger: 'change' }
          //  { type: 'email', message: 'Incorrect email format', trigger: 'change' }
        ],
        role: [
          { required: true, message: 'Por favor seleccione un rol！', trigger: 'blur' }
        ],
        depart: [
          { required: true, message: 'Por favor seleccione su departamento！', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: 'Por favor complete el formato correcto！', trigger: 'blur' }
        ],
        mobilePhone: [
          { required: true, message: 'Por favor, introduzca el número de móvil correcto！', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: 'Por favor complete la dirección de correo electrónico correcta！', trigger: 'blur' }
        ]
      }
    }
      },
  methods: {
    confrimSub() {
      let checkSubObj = JSON.parse(JSON.stringify(this.formWrapperObj));
      let arr = [ 'id', 'qq', 'email', 'avatar', 'enable', 'passwdCheck'];

      for(let i = 0; i < arr.length; i++) {
            delete checkSubObj[arr[i]]
      }
      
      // console.log(checkSubObj);

      for ( let x in checkSubObj ) {
        if( !checkSubObj[x] ) {
          this.$Message.warning('Por favor complete la información！');
          return;
        }else if (!this.employeeID) {
          if(this.formWrapperObj.password!==this.formWrapperObj.passwdCheck){
            this.$Message.warning('Contraseña inconsistente ingresada dos veces！');
            return;
          }
        }
      } 
    addAuditEmployee(this.formWrapperObj)
    .then( res => {
      if(!res.code) {
        console.log(res);
        this.$router.push('/system/employee');
        this.$Message.success(res.message);
      }else this.$Message.error(res.message);
    })

    }
  },
  created () {
    roleManage()
    .then( res => {
      if(!res.code){
        this.roleArr = res.data.content;
      }else this.$Message.error(res.message)
		})
		
    departmentManage()
    .then( res => {
      if(!res.code){
				
       this.departArr = res.data.content;
      }else this.$Message.error(res.message)
		})
		
		this.employeeID = getStore('employeeID');
		
    if(!!this.employeeID){
      employeeDetail({ id: this.employeeID })
      .then( res => {
        if(!res.code) {
          this.formWrapperObj = res.data;
        }else this.$Message.error(res.message);
        console.log(res);
      })
    }
    
  },
  watch: {
    formWrapperObj: {
      handler(newVal, oldVal) {
        if(!this.employeeID) {
          if(newVal.password !== newVal.passwdCheck) {
            this.uerpsCheck = true;
          }else this.uerpsCheck = false;
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
  .mainEmployeeContent {
    .ivu-form-item {
      margin: 25px auto;
      width: 380px;
		}
		.ivu-form-item-content {
			a{
				position: absolute;
				right: -60px;
				top: 0;
			}
		}
    .dashLine{
      text-align: center;
      border-top: 1px dashed #d2d2d2;
      Button{
        color: #b3b1b1;
        &:hover{
          color: #57a3f3;
        }

      }
    }
  }
</style>