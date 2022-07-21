<template>
<div>
  <Card>
    <p slot="title">

      Añadir/editar eventos
    </p>
    <div class="formWrapper">
      <Form :model="activityForm" :label-width="150" class='form'>
          <FormItem label="título del evento:">
              <Input v-model="activityForm.title"></Input>
          </FormItem>
          <FormItem label="Introducción:">
              <Input v-model="activityForm.detail"></Input>
          </FormItem>
          <FormItem label="Estado de visualización:">
                  <RadioGroup v-model="activityForm.status">
                    <Radio label="0"><em>ocultar</em></Radio>
                    <Radio label="1"><em>mostrar</em></Radio>
                  </RadioGroup>
          </FormItem>
          <FormItem label="estado activo:">
                  <RadioGroup v-model="activityForm.step">
                    <Radio label="0"><em>Preparación</em></Radio>
                    <Radio label="1"><em>Procesando</em></Radio>
                    <Radio label="2"><em>Distribuido</em></Radio>
                    <Radio label="3"><em>sobre</em></Radio>
                  </RadioGroup>
          </FormItem>

          <FormItem label="tipo de actividad:">
                  <RadioGroup v-model="activityForm.type">
                    <Radio label="1"><em>Primer lanzamiento (compra instantánea)</em></Radio>
                    <Radio label="2"><em>Primero en línea (dividido en partes iguales)</em></Radio>
                    <Radio label="3"><em>compartir posición</em></Radio>
                    <Radio label="4"><em>Suscripción gratuita</em></Radio>
                    <Radio label="5"><em>máquina de minería en la nube</em></Radio>
                    <Radio label="6"><em>encerrar</em></Radio>
                  </RadioGroup>
          </FormItem>

          <FormItem label="ciclo minero:" v-if="activityForm.type==5">
                  <RadioGroup v-model="activityForm.miningPeriod">
                    <Radio label="0"><em>cielo</em></Radio>
                    <Radio label="1"><em>semana</em></Radio>
                    <Radio label="2"><em>luna</em></Radio>
                    <Radio label="3"><em>año</em></Radio>
                  </RadioGroup>
          </FormItem>
          <FormItem label="Número de ciclos de minería:" v-if="activityForm.type==5">
              <Input v-model="activityForm.miningDays"></Input>
          </FormItem>
          <FormItem label="salida del ciclo minero:" v-if="activityForm.type==5">
              <Input v-model="activityForm.miningDaysprofit"></Input>
          </FormItem>
          <FormItem label="moneda minera:" v-if="activityForm.type==5">
              <Input v-model="activityForm.miningUnit"></Input>
          </FormItem>


          <FormItem label="Moneda bloqueada:" v-if="activityForm.type==6">
              <Input v-model="activityForm.lockedUnit"></Input>
          </FormItem>
          <FormItem label="Tipo de bloqueo:" v-if="activityForm.type == 6">
                  <RadioGroup v-model="activityForm.releaseType">
                    <Radio label="0"><em>liberación igual</em></Radio>
                    <Radio label="1"><em>liberación proporcional</em></Radio>
                  </RadioGroup><br>
                  <span style="font-size:10px;color:#FF0000;">
                    El significado de liberación proporcional es realizar un cálculo porcentual sobre la base de la cantidad restante no liberada, no la cantidad total al principio. Por lo tanto, si el período de liberación se establece lo suficientemente grande, la liberación de bloqueo será interminable.</span>
          </FormItem>

          <FormItem label="周期释放比例:" v-if="activityForm.type == 6 && activityForm.releaseType == 1">
              <Input v-model="activityForm.releasePercent"></Input>
              <span style="font-size:10px;color:#FF0000;">Si la relación de liberación se completa con 0,15, significa que se libera un 15 % por ciclo</span>
          </FormItem>

          <FormItem label="Cuota de publicación periódica:" v-if="activityForm.type == 6 && activityForm.releaseType == 0">
              <Input v-model="activityForm.releaseAmount"></Input>
          </FormItem>
          <FormItem label="ciclo de lanzamiento:" v-if="activityForm.type == 6">
                  <RadioGroup v-model="activityForm.lockedPeriod">
                    <Radio label="0"><em>cielo</em></Radio>
                    <Radio label="1"><em>semana</em></Radio>
                    <Radio label="2"><em>luna</em></Radio>
                    <Radio label="3"><em>año</em></Radio>
                  </RadioGroup>
          </FormItem>

          <FormItem label="El número total de períodos de bloqueo:" v-if="activityForm.type == 6">
              <Input v-model="activityForm.lockedDays"></Input>
              <span style="font-size:10px;color:#FF0000;">La liberación proporcional se liberará por completo en el último ciclo, sin importar cuánto quede</span>
          </FormItem>

          <FormItem label="Umbral de participación:" v-if="activityForm.type == 6">
              <Input v-model="activityForm.lockedFee"></Input>
              <span style="font-size:10px;color:#FF0000;">Esta tarifa de umbral es un parámetro específico del bloqueo. Después de que el usuario participe en el bloqueo, el monto de la moneda se deducirá del saldo.</span>
          </FormItem>

          <FormItem label="liberación múltiple:" v-if="activityForm.type == 6">
              <Input v-model="activityForm.releaseTimes"></Input>
              <span style="font-size:10px;color:#FF0000;">Después de que el múltiplo de lanzamiento se complete con un valor mayor que 0, la "cuota de lanzamiento periódico" no será válida. El monto de liberación del ciclo se liberará automáticamente en total/cantidad del ciclo. Este valor puede ser un decimal, como 1,5</span>
          </FormItem>

          <FormItem label="Aumento de la capacidad de invitación (compra):" v-if="activityForm.type==5 || activityForm.type == 6">
              <Input v-model="activityForm.miningInvite" placeholder="Tales como: 0.01 (es decir, la capacidad de producción básica aumenta en un 1%), 0 significa que no hay aumento"></Input>
          </FormItem>
          <FormItem label="Límite de aumento de capacidad:" v-if="activityForm.type==5 || activityForm.type == 6">
              <Input v-model="activityForm.miningInvitelimit" placeholder="Por ejemplo: 0,1 (es decir, el límite superior del aumento de la capacidad básica es del 10 %), 0 significa que no hay límite superior"></Input>
          </FormItem>
          <FormItem label="invitación de primera clase:">
              <Input v-model="activityForm.leveloneCount" placeholder="Tales como: 8 (los amigos de primer nivel no pueden ser inferiores a este número al comprar una máquina de minería)"></Input>
              <span style="font-size:10px;color:#FF0000;">El número de amigos de primer nivel requeridos no puede ser menor a este valor, si es 0 no se requiere ningún requisito.</span>
          </FormItem>

          <FormItem label="hora de inicio final:">
              <DatePicker v-model="activityForm.startTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="yyyy-MM-dd HH:mm:ss" style="width: 200px"></DatePicker>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;~&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <DatePicker v-model="activityForm.endTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="yyyy-MM-dd HH:mm:ss" style="width: 200px"></DatePicker>
          </FormItem>

          <FormItem label="suministro total:">
              <Input v-model="activityForm.totalSupply"></Input>
          </FormItem>

          <FormItem label="precio de emisión:">
              <Input v-model="activityForm.price"></Input>
          </FormItem>

          <FormItem label="precisión del precio:">
              <Input v-model="activityForm.priceScale"></Input>
          </FormItem>

          <FormItem label="unidad monetaria:">
              <Input v-model="activityForm.unit"></Input>
          </FormItem>

          <FormItem label="moneda aceptada:">
              <Input v-model="activityForm.acceptUnit"></Input>
          </FormItem>

          <FormItem label="Precisión cuantitativa:">
              <Input v-model="activityForm.amountScale"></Input>
          </FormItem>

          <FormItem label="límite máximo de compra:">
              <Input v-model="activityForm.maxLimitAmout"></Input>
          </FormItem>

          <FormItem label="Compra mínima:">
              <Input v-model="activityForm.minLimitAmout"></Input>
          </FormItem>

          <FormItem label="límite de compra:">
              <Input v-model="activityForm.limitTimes"></Input>
          </FormItem>

          <FormItem label="Moneda requerida para la posición:">
              <Input v-model="activityForm.holdUnit"></Input>
              <span style="font-size:10px;color:#FF0000;">Este es el requisito de umbral de participación. Si debe tener BZB, no debe tener menos de 10,000</span>
          </FormItem>
          <FormItem label="Requisito mínimo de posición:">
              <Input v-model="activityForm.holdLimit"></Input>
          </FormItem>

          <FormItem label="Enlace del evento:">
              <Input v-model="activityForm.activityLink"></Input>
          </FormItem>
          <FormItem label="Enlace de anuncio:">
              <Input v-model="activityForm.noticeLink"></Input>
          </FormItem>

          <FormItem label="JSON:">
              <Input v-model="activityForm.settings" type="textarea" :rows="5"></Input>
          </FormItem>

          <FormItem label="Miniatura de la lista:">
            <Upload :action="basicUrl+'admin/common/upload/oss/image'"
                    :on-success = 'uploadSuccessedSmall'
                    :on-error = "uploadFailed"
                    :on-progress = "imageUploading"
                    :show-upload-list = "false">
              <Button type="ghost" icon="ios-cloud-upload-outline">añadir fotos</Button>
            </Upload>
          </FormItem>

          <FormItem label="Dirección del mapa de la lista:">
              <Input @on-blur="listenValUrl" v-model="activityForm.smallImageUrl" disabled style="width: 100%;"></Input>
              <span v-if="picUrlIcon">
                  <Icon style="color: green" type="checkmark-round" v-if="!!activityForm.smallImageUrl"></Icon>
                  <Icon type="close-round" v-else></Icon>
              </span>
          </FormItem>

          <FormItem label="Imagen de la pancarta:">
            <Upload :action="basicUrl+'admin/common/upload/oss/image'"
                    :on-success = 'uploadSuccessedBanner'
                    :on-error = "uploadFailed"
                    :on-progress = "imageUploading"
                    :show-upload-list = "false">
              <Button type="ghost" icon="ios-cloud-upload-outline">añadir fotos</Button>
            </Upload>
          </FormItem>

          <FormItem label="Banner:">
              <Input @on-blur="listenValUrl" v-model="activityForm.bannerImageUrl" disabled style="width: 100%;"></Input>
              <span v-if="picUrlIcon">
                  <Icon style="color: green" type="checkmark-round" v-if="!!activityForm.bannerImageUrl"></Icon>
                  <Icon type="close-round" v-else></Icon>
              </span>
          </FormItem>

          <FormItem label="detalles de la actividad:">
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
import dtime from 'time-formater'
import smeditor from '@/SMEditor/SMEditor.vue'

import { BASICURL,  addActivity, modifyActivity, activityDetail } from '@/service/getData';
import { getStore, removeStore, setStore } from '@/config/storage';


  export default {

    data () {
      return {
        activityForm:{
            title: "",
            detail: "",
            status: "1",
            step: "1",
            type: "1",
            startTime: "",
            endTime: "",
            totalSupply: "0",
            price: "",
            priceScale: "2",
            unit: "",
            acceptUnit: "",
            amountScale: "2",
            maxLimitAmout: 0,
            minLimitAmout: 0,
            limitTimes: 0,
            activityLink: "",
            noticeLink: "",
            settings: "",
            smallImageUrl: "",
            bannerImageUrl: "",
            leveloneCount: 0,
            holdUnit: "",
            holdLimit: 0,
            lockedUnit: "",
            lockedPeriod: "0",
            lockedDays: 0,
            releaseType: "0",
            releasePercent: 0,
            lockedFee: 0,
            releaseAmount: 0,
            releaseTimes: 0,
            miningDays: 0,
            miningDaysprofit: "",
            miningUnit: "",
            miningInvite: 0,
            miningInvitelimit: 0,
            miningPeriod: "0",
            content: ""
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
          parentName: 'activity',
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
          this.activityForm.id = this.queryDetailId;
          this.activityForm.password = this.loginPW;
          this.activityForm.startTime = dtime(this.activityForm.startTime).format('YYYY-MM-DD HH:mm:ss');
          this.activityForm.endTime = dtime(this.activityForm.endTime).format('YYYY-MM-DD HH:mm:ss');
          modifyActivity(this.activityForm)
          .then( res => {
            if (!res.code) {
              this.$Message.success('Operación exitosa!');
              this.$router.push('/activity/activity');
            } else this.$Message.error('Error!');
          });
        }else{
          this.activityForm.startTime = dtime(this.activityForm.startTime).format('YYYY-MM-DD HH:mm:ss');
          this.activityForm.endTime = dtime(this.activityForm.endTime).format('YYYY-MM-DD HH:mm:ss');
          addActivity(this.activityForm)
          .then( res => {
            if (!res.code) {
              this.$Message.success('Operación exitosa!');
              this.$router.push('/activity/activity');
            } else this.$Message.error('Error!');
          });
        }
      },
      submit(){
        this.$refs.smeditor.$emit('saveInner');
        this.activityForm.content = getStore('smeditor');

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
      imageUploading(event, file, fileList) {
          this.ifShowPercentCircle = true;
          this.percentage = file.percentage;
      },
      uploadSuccessedSmall(response, file, fileList) {
          this.activityForm.smallImageUrl = response.data;
          this.ifShowPercentCircle = false;
          this.$Message.success('Subido con éxito');
      },
      uploadSuccessedBanner(response, file, fileList) {
          this.activityForm.bannerImageUrl = response.data;
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

      if (!!this.queryDetailId) {

        this.ifAdd = false;
        this.activityForm.id = this.queryDetailId;

        activityDetail(this.queryDetailId)
       .then(res => {
            this.activityForm.id = this.queryDetailId;
            this.activityForm.title = res.data.title;
            this.activityForm.detail = res.data.detail;
            this.activityForm.status = String(res.data.status);
            this.activityForm.step = String(res.data.step);
            this.activityForm.type = String(res.data.type);
            this.activityForm.startTime = res.data.startTime;
            this.activityForm.endTime = res.data.endTime;
            this.activityForm.totalSupply = res.data.totalSupply;
            this.activityForm.price = res.data.price;
            this.activityForm.priceScale = res.data.priceScale;
            this.activityForm.unit = res.data.unit;
            this.activityForm.acceptUnit = res.data.acceptUnit;
            this.activityForm.amountScale = res.data.amountScale;
            this.activityForm.maxLimitAmout = res.data.maxLimitAmout;
            this.activityForm.minLimitAmout = res.data.minLimitAmout;
            this.activityForm.limitTimes = res.data.limitTimes;
            this.activityForm.settings = res.data.settings;
            this.activityForm.content = res.data.content;
            this.activityForm.smallImageUrl = res.data.smallImageUrl;
            this.activityForm.bannerImageUrl = res.data.bannerImageUrl;
            this.activityForm.noticeLink = res.data.noticeLink;
            this.activityForm.activityLink = res.data.activityLink;
            this.activityForm.leveloneCount = res.data.leveloneCount;
            this.activityForm.holdUnit = res.data.holdUnit;
            this.activityForm.holdLimit = res.data.holdLimit;
            this.activityForm.miningDays = res.data.miningDays;
            this.activityForm.miningDaysprofit = res.data.miningDaysprofit;
            this.activityForm.miningUnit = res.data.miningUnit;
            this.activityForm.miningInvite = res.data.miningInvite;
            this.activityForm.miningInvitelimit = res.data.miningInvitelimit;
            this.activityForm.miningPeriod = String(res.data.miningPeriod);
            this.activityForm.lockedUnit = res.data.lockedUnit;
            this.activityForm.lockedPeriod = String(res.data.lockedPeriod);
            this.activityForm.lockedDays = res.data.lockedDays;
            this.activityForm.releaseType = String(res.data.releaseType);
            this.activityForm.releasePercent = res.data.releasePercent;
            this.activityForm.lockedFee = res.data.lockedFee;
            this.activityForm.releaseAmount = res.data.releaseAmount;
            this.activityForm.releaseTimes = res.data.releaseTimes;

            setStore('smeditor', res.data.content);

       });
      }else  this.ifAdd = true;
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

