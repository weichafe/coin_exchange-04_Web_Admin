<template>
<div>
  <Card>
    <p slot="title">
      Agregar/editar paquetes rojos
    </p>
    <div class="formWrapper">
      <Form :model="envelopeForm" :label-width="100" class='form'>
          <FormItem label="Tipo de paquete rojo:">
                  <RadioGroup v-model="envelopeForm.type">
                    <Radio label="0"><em>随机</em></Radio>
                    <Radio label="1"><em>定额</em></Radio>
                  </RadioGroup>
          </FormItem>
          <FormItem label="invitación a dividir:">
                  <RadioGroup v-model="envelopeForm.invite">
                    <Radio label="0"><em>否</em></Radio>
                    <Radio label="1"><em>是</em></Radio>
                  </RadioGroup>
          </FormItem>
          <FormItem label="Sobres rojos plataforma:">
                  <RadioGroup v-model="envelopeForm.plateform">
                    <Radio label="0"><em>否</em></Radio>
                    <Radio label="1"><em>是</em></Radio>
                  </RadioGroup>
          </FormItem>
          <FormItem label="La cantidad máxima que se puede reclamar (aleatoriamente válida):">
              <Input v-model="envelopeForm.maxRand"></Input>
          </FormItem>
          <FormItem label="La cantidad total de sobres rojos.">
              <Input v-model="envelopeForm.totalAmount"></Input>
          </FormItem>
          <FormItem label="Número de paquetes rojos:">
              <Input v-model="envelopeForm.count"></Input>
          </FormItem>
          <FormItem label="LOGON:">
              <Upload :action="basicUrl+'admin/common/upload/oss/image'"
                      :on-success = 'uploadLogoSuccessed'
                      :on-error = "uploadFailed"
                      :on-progress = "imguploading"
                      :show-upload-list = "false">
                <Button type="ghost" icon="ios-cloud-upload-outline">添加图片</Button>
              </Upload>
          </FormItem>
          <FormItem label="imagen de fondo:">
              <Upload :action="basicUrl+'admin/common/upload/oss/image'"
                      :on-success = 'uploadBgImageSuccessed'
                      :on-error = "uploadFailed"
                      :on-progress = "imguploading"
                      :show-upload-list = "false">
                <Button type="ghost" icon="ios-cloud-upload-outline">添加图片</Button>
              </Upload>
          </FormItem>
          <FormItem label="Moneda de sobre rojo:">
              <Input v-model="envelopeForm.unit"></Input>
          </FormItem>
          <FormItem label="Tiempo efectivo:">
              <Input v-model="envelopeForm.expiredHours"></Input>
          </FormItem>
          <FormItem label="Nombre del paquete rojo:">
              <Input v-model="envelopeForm.name"></Input>
          </FormItem>
          <FormItem label="Descripción del paquete rojo:">
              <smeditor :config='config' ref="smeditor" @isUploading = "ifUploading" style="width:100%;"></smeditor>
          </FormItem>
      </Form>
      <div class="circleWrapper" v-show="ifShowPercentCircle">
        <i-circle :percent="percentage" :size="60" :stroke-width="10">
          <span class="demo-Circle-inner" style="font-size:24px">{{ percentage.toFixed(1) }}%</span>
        </i-circle>
      </div>
    </div>
    <div class="btnWrapper">
      <Button type="success" :disabled="false" long size='large' @click="submit">
        提交
      </Button>
    </div>
  </Card>

    <Modal
          class="auditModel"
          v-model="loginPassModal"
          title="Por favor, introduzca su contraseña"
          width="350"
          @on-cancle="loginPW = ''"
          @on-ok="confirmLoginPass">
          <Input v-model="loginPW" type="password" placeholder="Por favor, introduzca su contraseña"></Input>
   </Modal>
</div>

</template>

<script>
import smeditor from '@/SMEditor/SMEditor.vue'

import { BASICURL,  envelopeAdd, envelopeModify, envelopeDetail } from '@/service/getData';
import { getStore, removeStore, setStore } from '@/config/storage';


  export default {

    data () {
      return {
        envelopeForm:{
            type: "0",
            invite: "0",
            plateform: "0",
            maxRand: "",
            totalAmount: "",
            count: "",
            logoImage: "",
            bgImage: "",
            name: "",
            detail: "",
            unit: "",
            expiredHours: ""
        },
        loginPassModal: false,
        loginPW: "",
        ifShowPercentCircle: false,
        percentage: 0,
        picUrl: "",
        picUrlIcon: false,
        basicUrl: BASICURL,
        uploading: false,
        ifAdd: true,
        queryDetailId: null,
        lang: "CN",
        basicUrl: BASICURL,
        config :{
          uploadUrl: `${BASICURL}admin/common/upload/oss/image`,
          uploadName: 'file',
          parentName: 'envelope',
          uploadParams: {

          },
          // 上传成功回调
          uploadCallback: (data) => {
            this.uploading = false;
            if(!data.code){
              this.$Message.success('Subido con éxito!');
              return data.data;
            }else{
              this.$Message.error('subida fallida!');
            }
          },
          // 上传失败回调, 可选
          uploadFailed: (err) => {
            this.uploading = false;
            console.log(err)
            this.$Message.error('subida fallida!');
          }
        }
      }
    },
    methods: {
      confirmLoginPass(){
        console.log("passwd");
        if(!this.ifAdd){
          this.envelopeForm.id = this.queryDetailId;
          envelopeModify(this.envelopeForm)
          .then( res => {
            if (!res.code) {
              this.$Message.success('Operación exitosa!');
              this.$router.push('/envelope/envelopeList');
            } else this.$Message.error('Error!');
          });
        }else{
          envelopeAdd(this.envelopeForm)
          .then( res => {
            if (!res.code) {
              this.$Message.success('Operación exitosa!');
              this.$router.push('/envelope/envelopeList');
            } else this.$Message.error('Error!');
          });
        }
      },
      submit(){
        this.$refs.smeditor.$emit('saveInner');
        this.envelopeForm.detail = getStore('smeditor');

        this.loginPassModal = true;
      },
      ifUploading(val) {
        this.uploading = val;
      },
      changeAdStatus(val) {
        this.status = val*1;
      },
      listenValUrl() {
          this.picUrlIcon = true;
      },
      imguploading(event, file, fileList) {
          this.ifShowPercentCircle = true;
          this.percentage = file.percentage;
      },
      uploadLogoSuccessed(response, file, fileList) {
        this.envelopeForm.logoImage = response.data;
        this.ifShowPercentCircle = false;
        this.$Message.success('Subido con éxito');
      },
      uploadBgImageSuccessed(response, file, fileList){
        this.envelopeForm.bgImage = response.data;
        this.ifShowPercentCircle = false;
        this.$Message.success('Subido con éxito');
      },
      uploadFailed(error, file, fileList) {
          this.ifShowPercentCircle = false;
          this.$Message.error('subida fallida');
      }
    },
    created() {

      removeStore('smeditor');

      this.queryDetailId = getStore('manageID');
      console.log("++++++++++++==:"+this.queryDetailId);
      if (!!this.queryDetailId) {

        this.ifAdd = false;
        this.envelopeForm.id = this.queryDetailId;

        envelopeDetail(this.queryDetailId)
         .then(res => {
            this.envelopeForm.type = String(res.data.type);
            this.envelopeForm.invite = String(res.data.invite);
            this.envelopeForm.plateform = String(res.data.plateform);
            this.envelopeForm.maxRand = res.data.maxRand;
            this.envelopeForm.totalAmount = res.data.totalAmount;
            this.envelopeForm.logoImage = res.data.logoImage;
            this.envelopeForm.bgImage = res.data.bgImage;
            this.envelopeForm.name = res.data.name;
            this.envelopeForm.detail = res.data.detail;
            this.envelopeForm.unit = res.data.unit;
            this.envelopeForm.count = res.data.count;
            this.envelopeForm.expiredHours = res.data.expiredHours;

            setStore('smeditor', res.data.detail);

        });
      }else {
        this.ifAdd = true;
        this.envelopeForm.plateform = "1";
        this.envelopeForm.expiredHours = 24;
      }
    },

    components: {
      smeditor
    }
  }
</script>

<style lang="less" scoped>
  .wrapper{
    margin: auto;
    width: 70%;
  }
  .formWrapper{
    margin: auto;
    width: 70%;
  }
  .btnWrapper{
    margin: 40px auto;
    width: 30%;
  }
  .formWrapper{
    p, div{
      margin: 0px 0 5px 0;
      Input{
        display: inline-block;
        width: 90px;
      }
    }
  }
  .title{
    display: inline-block;
    width: 200px;
  }
  .circleWrapper{
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .3);
    p{
      font-size: 30px;
      font-family: '黑体';
      color: #fff;
      text-align: center;
      line-height: 550px;
    }
  }

  em{
    font-style: normal;
  }
</style>

