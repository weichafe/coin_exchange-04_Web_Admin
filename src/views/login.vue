<style lang="less">
    @import "./login.less";
</style>
<template>
    <div class="login" @keydown.enter="handle">
        <div class="login-con">
            <Card :bordered="true">
                <p slot="title">
                    <Icon type="log-in"></Icon> Ingresa, por favor
                </p>
                <div class="form-con" v-if="!phoneNum">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="username">
                            <Input v-model="form.username" :disabled="btnDisable" placeholder="por favor ingrese el nombre de usuario">
                            <span slot="prepend">
                                <Icon :size="16" type="person"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" :disabled="btnDisable" placeholder="Por favor, ingrese contraseña">
                            <span slot="prepend">
                                <Icon :size="14" type="locked"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <Row v-show="!phoneNum">
                            <Col span="12">
                            <Input v-model="form.captcha" placeholder="código de verificación">
                            <span slot="prepend">
                                <Icon :size="14" type="locked"></Icon>
                            </span></Input>
                            </Col>
                            <Col span="10" offset="2">
                            <img :src="logimg" style='vertical-align: middle;width:95%;height:95%' @click="chanloimg" />
                            </Col>
                        </Row>
                        <FormItem style='margin-top:40px'>
                            <Button @click="handle" type="warning" long>
                                Iniciar sesión
                            </Button>
                        </FormItem>
                        <p style='color:red;text-align:center' v-if="messshow">{{errormessage}}</p>
                    </Form>
                </div>
                <div v-if="!!phoneNum">
                    <Form>
                         						<FormItem>
                                                    <p class="phone-num">{{ phoneNum | hidePhoneNum }}</p>
                                                </FormItem>
                                                <FormItem>
                                                    <Input placeholder="por favor ingrese el código de verificación" v-model="code" :class="{appendBtn: count===0}">
                                                    <Button slot="append" v-if="count>0" :disabled="count>0">
                                                        {{count}}s
                                                        Recuperar más tarde
                                                    </Button>
                                                    <Button slot="append" v-else-if="count===0" type="success" @click="getCodeTwice">
                                                        obtener código de verificación
                                                    </Button>
                                                    </Input>
                                                </FormItem>
                        <FormItem>
                            <Row>
                                <Col span="11">
                                <Button @click="handle" type="warning" long>Iniciar sesión</Button>
                                </Col>
                                <Col span="11" offset="2">
                                <Button @click="cancelSignIn" long>Cancelar</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
        <div style="position:absolute;top: 10px;font-size: 14px;margin-top: 10px;margin-left: 30px;color:rgb(255 238 211);text-shadow: 1px 0px 2px #000;width: 400px;text-align: left;border-radius: 5px;padding: 5px 0;"></div>
    </div>
</template>
<style>

    .login .ivu-card {
        background: #ffffffd9;
    }
</style>
<script>

    import Cookies from "js-cookie";
    import store from "../store";

    import { setStore, getStore, removeStore } from "../config/storage";
    import { otherRouter, appRouter } from "../router/router.js";
    import { BASICURL, getLoginCode, signIn, getCodeAgain } from "../service/getData";

    export default {
        data() {

            return {
                timer: '',
                btnDisable: false,
                count: 0,
                form: {
                    username: null,
                    password: null,
                    captcha: null
                },
                code: null,
                phoneNum: null,
                username: null,
                password: null,
                messshow: false,
                errormessage: null,
                logimg: `${BASICURL}/admin/captcha?cid=ADMIN_LOGIN`,
                rules: {
                    username: [{ required: true, message: "No puede estar vacío", trigger: "blur" }],
                    captcha: [{ required: true, message: "No puede estar vacío", trigger: "blur" }],
                    password: [{ required: true, message: "No puede estar vacío", trigger: "blur" }]
                },
                permissions: {}
            };
        },
        methods: {
            cancelSignIn() {
                Cookies.remove('userPhone');
                window.location.reload();
            },
            getCodeTwice() {
                this.count = 60;
                getCodeAgain({ phone: this.phoneNum })
                    .then(res => {
                    })
                    .catch(err => { console.log(err) })
            },
            chanloimg() {
                this.logimg = `${BASICURL}admin/captcha?cid=ADMIN_LOGIN&a=${Math.random().toFixed(2)}`;
            },
            processPermission(menu) {
                if (menu.name != "") this.permissions[menu.name] = 1;
                if (menu.subMenu != null && menu.subMenu.length > 0) {
                    for (var i = 0; i < menu.subMenu.length; i++) {
                        this.processPermission(menu.subMenu[i]);
                    }
                }
            },
            handle() {
                if (!!this.phoneNum) {
                    signIn({ code: this.code, phone: this.phoneNum, username : this.username, password: this.password })
                        .then(res => {
                            if (!res.code) {
                                Cookies.set('user', res.data.admin.username);
                                Cookies.set('userInfo', res.data.admin);
                                setStore("leftSidebarList", res.data.permissions);
                                this.$router.push({ name: "home_index" });
                            } else {
                              this.$Message.error(res.message)
                            };
                        }).catch(err => { console.log(err) });
                } else {
                    getLoginCode(this.form)
                        .then(res => {
                            if (!res.code) {

                                this.phoneNum = res.data.mobilePhone;
                                this.username = this.form.username;
                                this.password = this.form.password;

                                Cookies.set('userInfo', res.data);
                                Cookies.set('user', this.username);
                                Cookies.set('userPhone', this.phoneNum);

                            } else this.$Message.error(res.message)
                        })
                        .catch(err => console.log(err));
                }
            }
        },
        beforeRouteLeave(to, from, next) {
            clearInterval(this.timer)
            window.location.reload();
            next();
        },
        created() {
            this.phoneNum = Cookies.get('userPhone');
            clearInterval(this.timer)
            this.logimg = `${BASICURL}admin/captcha?cid=ADMIN_LOGIN`;
        },
        filters: {
            hidePhoneNum(val) {
                return val.split('').fill('*', 3, 7).join('');
            }
        },
        watch: {
            count(newVal, oldVal) {
                if (newVal > 0) {
                    this.timer = setTimeout(() => {
                        this.count--;
                    }, 1000)
                } else {
                    clearInterval(this.timer)
                }
            },
            phoneNum(newVal, oldVal) {
                if (!!newVal) this.count = 0;
            }
        }
    };
</script>
