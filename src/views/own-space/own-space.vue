<style lang="less">
   .own-space{
    &-btn-box{
        margin-bottom: 10px;
        button{
            padding-left: 0;
            span{
                color: #2D8CF0;
                transition: all .2s;
            }
            span:hover{
                color: #0C25F1;
                transition: all .2s;
            }
        }
    }
    &-tra{
        width:10px;
        height:10px;
        transform:rotate(45deg);
        position:absolute;
        top:50%;
        margin-top:-6px;
        left:-3px;
        box-shadow:0 0 2px 3px rgba(0,0,0,.1);
        background-color:white;z-index:100;
    }
    &-input-identifycode-con{
        position:absolute;
        width:200px;
        height:100px;
        right:-220px;
        top:50%;
        margin-top:-50px;
        border-radius:4px;
        box-shadow:0 0 2px 3px rgba(0,0,0,.1);
    }
}

</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
              Informacion personal
            </p>
            <div>
                <Form
                    ref="userForm"
                    :model="userForm"
                    :label-width="100"
                    label-position="right"
                    :rules="inforValidate"
                >
                    <FormItem label="nombre de usuario：" prop="name">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.name" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="用户手机：" prop="cellphone" >
                        <div style="display:inline-block;width:204px;">
                            <Input v-model="userForm.cellphone" @on-keydown="hasChangePhone"></Input>
                        </div>
                        <div style="display:inline-block;position:relative;">
                            <Button @click="getIdentifyCode" :disabled="canGetIdentifyCode">{{ gettingIdentifyCodeBtnContent }}</Button>
                            <div class="own-space-input-identifycode-con" v-if="inputCodeVisible">
                                <div style="background-color:white;z-index:110;margin:10px;">
                                    <Input v-model="securityCode" placeholder="Por favor complete el código de verificación de SMS" ></Input>
                                    <div style="margin-top:10px;text-align:right">
                                        <Button type="ghost" @click="cancelInputCodeBox">Cancelar</Button>
                                        <Button type="primary" @click="submitCode" :loading="checkIdentifyCodeLoading">确定</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FormItem>
                    <FormItem label="公司：">
                        <span>{{ userForm.company }}</span>
                    </FormItem>
                    <FormItem label="部门：">
                        <span>{{ userForm.department }}</span>
                    </FormItem>
                    <FormItem label="登录密码：">
                        <Button type="text" size="small" @click="showEditPassword">修改密码</Button>
                    </FormItem>
                    <div>
                        <Button type="text" style="width: 100px;" @click="cancelEditUserInfor">取消</Button>
                        <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
                    </div>
                </Form>
            </div>
        </Card>
        <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
            <h3 slot="header" style="color:#2D8CF0">cambiar la contraseña</h3>
            <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
                <FormItem label="Contraseña anterior" prop="oldPass" :error="oldPassError">
                    <Input v-model="editPasswordForm.oldPass" placeholder="Por favor ingrese su contraseña actual" ></Input>
                </FormItem>
                <FormItem label="Nueva contraseña" prop="newPass">
                    <Input v-model="editPasswordForm.newPass" placeholder="Ingrese una nueva contraseña, al menos 6 caracteres" ></Input>
                </FormItem>
                <FormItem label="Confirmar la nueva contraseña" prop="rePass">
                    <Input v-model="editPasswordForm.rePass" placeholder="Por favor, introduzca la nueva contraseña de nuevo" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelEditPass">取消</Button>
                <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    name: 'ownspace_index',
    data () {
        const validePhone = (rule, value, callback) => {
            var re = /^1[0-9]{10}$/;
            if (!re.test(value)) {
                callback(new Error('Ingrese un número de teléfono móvil en el formato correcto'));
            } else {
                callback();
            }
        };
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.editPasswordForm.newPass) {
                callback(new Error('Las contraseñas ingresadas dos veces no coinciden'));
            } else {
                callback();
            }
        };
        return {
            userForm: {
                name: '',
                cellphone: '',
                company: '',
                department: ''
            },
            uid: '',
            securityCode: '', // 验证码
            phoneHasChanged: false, // 是否编辑了手机
            save_loading: false,
            identifyError: '', // 验证码错误
            editPasswordModal: false, // 修改密码模态框显示
            savePassLoading: false,
            oldPassError: '',
            identifyCodeRight: false, // 验证码是否正确
            hasGetIdentifyCode: false, // 是否点了获取验证码
            canGetIdentifyCode: false, // 是否可点获取验证码
            checkIdentifyCodeLoading: false,
            inforValidate: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                cellphone: [
                    { required: true, message: '请输入手机号码' },
                    { validator: validePhone }
                ]
            },
            editPasswordForm: {
                oldPass: '',
                newPass: '',
                rePass: ''
            },
            passwordValidate: {
                oldPass: [
                    { required: true, message: 'Por favor ingrese la contraseña original', trigger: 'blur' }
                ],
                newPass: [
                    { required: true, message: 'Por favor ingrese una nueva contraseña', trigger: 'blur' },
                    { min: 6, message: 'Por favor ingrese al menos 6 caracteres', trigger: 'blur' },
                    { max: 32, message: 'Introduzca hasta 32 caracteres', trigger: 'blur' }
                ],
                rePass: [
                    { required: true, message: 'Por favor, introduzca la nueva contraseña de nuevo', trigger: 'blur' },
                    { validator: valideRePassword, trigger: 'blur' }
                ]
            },
            inputCodeVisible: false, // 显示填写验证码box
            initPhone: '',
            gettingIdentifyCodeBtnContent: 'obtener código de verificación' // “获取验证码”按钮的文字
        };
    },
    methods: {
        getIdentifyCode () {
            this.hasGetIdentifyCode = true;
            this.$refs['userForm'].validate((valid) => {
                if (valid) {
                    this.canGetIdentifyCode = true;
                    let timeLast = 60;
                    let timer = setInterval(() => {
                        if (timeLast >= 0) {
                            this.gettingIdentifyCodeBtnContent = timeLast + 'Reintentar en segundos';
                            timeLast -= 1;
                        } else {
                            clearInterval(timer);
                            this.gettingIdentifyCodeBtnContent = 'obtener código de verificación';
                            this.canGetIdentifyCode = false;
                        }
                    }, 1000);
                    this.inputCodeVisible = true;
                    // you can write ajax request here
                }
            });
        },
        showEditPassword () {
            this.editPasswordModal = true;
        },
        cancelEditUserInfor () {
            this.$store.commit('removeTag', 'ownspace_index');
            localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
            let lastPageName = '';
            if (this.$store.state.app.pageOpenedList.length > 1) {
                lastPageName = this.$store.state.app.pageOpenedList[1].name;
            } else {
                lastPageName = this.$store.state.app.pageOpenedList[0].name;
            }
            this.$router.push({
                name: lastPageName
            });
        },
        saveEdit () {
            this.$refs['userForm'].validate((valid) => {
                if (valid) {
                    if (this.phoneHasChanged && this.userForm.cellphone !== this.initPhone) { // 手机号码修改过了而且修改之后的手机号和原来的不一样
                        if (this.hasGetIdentifyCode) { // 判断是否点了获取验证码
                            if (this.identifyCodeRight) { // 判断验证码是否正确
                                this.saveInfoAjax();
                            } else {
                                this.$Message.error('Código de verificación incorrecto, vuelva a introducirlo');
                            }
                        } else {
                            this.$Message.warning('Haga clic para obtener el código de verificación primero');
                        }
                    } else {
                        this.saveInfoAjax();
                    }
                }
            });
        },
        cancelEditPass () {
            this.editPasswordModal = false;
        },
        saveEditPass () {
            this.$refs['editPasswordForm'].validate((valid) => {
                if (valid) {
                    this.savePassLoading = true;
                    // you can write ajax request here
                }
            });
        },
        init () {
            this.userForm.name = 'Lison';
            this.userForm.cellphone = '17712345678';
            this.initPhone = '17712345678';
            this.userForm.company = 'TalkingData';
            this.userForm.department = 'Departamento de visualización';
        },
        cancelInputCodeBox () {
            this.inputCodeVisible = false;
            this.userForm.cellphone = this.initPhone;
        },
        submitCode () {
            let vm = this;
            vm.checkIdentifyCodeLoading = true;
            if (this.securityCode.length === 0) {
                this.$Message.error('Por favor complete el código de verificación de SMS');
            } else {
                setTimeout(() => {
                    this.$Message.success('El código de verificación es correcto.');
                    this.inputCodeVisible = false;
                    this.checkIdentifyCodeLoading = false;
                }, 1000);
            }
        },
        hasChangePhone () {
            this.phoneHasChanged = true;
            this.hasGetIdentifyCode = false;
            this.identifyCodeRight = false;
        },
        saveInfoAjax () {
            this.save_loading = true;
            setTimeout(() => {
                this.$Message.success('Guardado con éxito');
                this.save_loading = false;
            }, 1000);
        }
    },
    mounted () {
        this.init();
    }
};
</script>
