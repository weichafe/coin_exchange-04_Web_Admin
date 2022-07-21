<template>
  <div>
    <Card>
      <p slot="title">
        centro personal
      </p>

      <Row >
        <Table 
        :columns="column_frist" 
        :data="userpage"
        :loading="ifLoading" 
        border>
        </Table>
      </Row>

      <Modal
        v-model="showModel"
        title="cambiar la contraseña"
        width=400
        @on-ok="confirmSub"
        @on-cancel="$Message.info('Cancelado！')">
        <Form :model="userPW" :label-width="60" label-position="right" :rules="checkPass">
          <FormItem label="Contraseña anterior：" prop="lastPassword">
            <Input type="password" v-model="userPW.lastPassword" placeholder="Por favor ingrese la contraseña anterior"></Input>
          </FormItem>
           <FormItem label="Nueva contraseña：" prop="newPassword">
            <Input type="password" v-model="userPW.newPassword" placeholder="Por favor ingrese una nueva contraseña"></Input>
          </FormItem>
        </Form>
      </Modal>

    </Card>   
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { getStore, setStore, removeStore } from '@/config/storage'
import { employeeDetail, fixPersonalPW } from '@/service/getData'
export default {
  data() {
    return {
      checkPass: {
        lastPassword:  { required: true, message: 'No puede estar vacío', trigger: 'change' },
        newPassword:  { required: true, message: 'No puede estar vacío', trigger: 'change' }
      },
      column_frist: [
        {
          title: 'username',
          key: 'username'
        },
        {
          title: 'departmentName',
          key: 'departmentName'
        },
        {
          title: 'role',
          key: 'role'
        },
        {
          title: 'mobilePhone',
          key: 'mobilePhone'
        },
        {
          title: 'email',
          key: 'email'
        },
        {
          title: 'QQ',
          key: 'qq'
        },
        {

          title: 'funcionar',
          render : (h, obj) => {
             return h ( 'Button',{
               props: {
                 type: 'info',
                 size: 'small'
               },
               on: {
                 click: () => {
                   this.showModel = true;
                 }
               }
             }, '修改密码' )
          }
        },
      ],
      userpage: [],
      ifLoading: true,
      showModel: false,
      userPW: {
        lastPassword: '',
        newPassword: '',
        id: ''
      }
    }

  },
  methods: {
    confirmSub() {
      let pass = true;
      for (let key in this.userPW ) {
        if( !String(key).trim().length ) pass = false;
      }
      if(pass) {
        fixPersonalPW(this.userPW)
        .then( res => {
          if( !res.code ) {
            this.$Message.success(res.message);
          }else this.$Message.error(res.message);
        })
        .catch( err => console.log(err))
      }else this.$Message.warning('Por favor complete la información！')
    }
  },
  created() {
    let personalInfo =  JSON.parse(Cookies.get('userInfo'));
    this.userPW.id = personalInfo.id;
    employeeDetail({ id: personalInfo.id })
    .then( res => {
      if(!res.code) {
        this.userpage = [res.data];
        this.ifLoading = false;
      }else this.$Message.error(res.message)
    })
    .catch( err => console.log(err))
  }
}
</script>

<style lang="less" scoped>

</style>


