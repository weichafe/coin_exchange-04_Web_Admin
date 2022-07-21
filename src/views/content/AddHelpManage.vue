<template>
<div>
  <Card>
    <p slot="title">
      ayuda del sistema
    </p>
    <div class="formWrapper">
      <div class="titleWrapper">título：
        <p class="title"><Input v-model="title"  style="width:500px"></Input></p>
      </div>

      <div class="createTimeWrapper" v-if="!!queryDetailId" >
        tiempo de creación：
        <p class="title"><Input v-model="createTime" disabled></Input></p>
      </div>

      <div>Clasificación：
        <Select v-model="klass" style="width:200px">
          <Option v-for=" perKlass in klassArr " :value="perKlass.value" :key="perKlass.value">{{ perKlass.name }}</Option>
        </Select>
      </div>
      <div class="titleWrapper">clasificar：
        <p class="title"><Input v-model="sort"  style="width:200px"></Input></p>
      </div>
      <div>idioma：
        <RadioGroup v-model="lang">
          <Radio label="zh_CN">
            <span>Chino</span>
          </Radio>
          <Radio label="en_US">
            <span>English</span>
          </Radio>
          <Radio label="ja_JP">
            <span>japonés</span>
          </Radio>
          <Radio label="ko_KR">
            <span>coreano</span>
          </Radio>
          <Radio label="de_DE">
            <span>Alemán</span>
          </Radio>
          <Radio label="fr_FR">
            <span>Francés</span>
          </Radio>
          <Radio label="it_IT">
            <span>Italia</span>
          </Radio>
          <Radio label="es_ES">
            <span>España</span>
          </Radio>
          <Radio label="zh_HK">
            <span>Chino tradicional</span>
          </Radio>
        </RadioGroup>
      </div>
      <div>estado：
        <RadioGroup v-model="status" @on-change="changeAdStatus">
          <Radio :label="0">
            <span>mostrar</span>
          </Radio>
          <Radio :label="1">
            <span>No mostrar</span>
          </Radio>
        </RadioGroup>
      </div>
    </div>
    <smeditor :config='config' ref="smeditor" @isUploading = "ifUploading"></smeditor>

    <div class="btnWrapper">
      <Button type="success" long size='large' @click="upload">
        提交
      </Button>
    </div>

    <div class="circleWrapper" v-show="uploading">
      <p>carga de imagen...</p>
    </div>
  </Card>

</div>

</template>

<script>

import smeditor from '@/SMEditor/SMEditor.vue'


import { BASICURL,  addHelpManage, helpManageDetail, updateHelpManage } from '@/service/getData';
import { getStore, removeStore, setStore } from '@/config/storage';


  export default {

    data () {
      return {
        klassArr: [
          { name: 'Guía para principiantes', value: 0 },
          { name: 'problema comun', value: 1 },
          { name: 'Guía comercial', value: 2 },
          { name: 'Información de moneda', value: 3 },
          { name: 'Cotizar tecnología', value: 4 },
          { name: 'acuerdo de términos', value: 5 },
          { name: 'otro', value: 6 },
        ],
        uploading: false,
        ifAdd: true,
        queryDetailId: null,
        createTime: null,
        title: null,
        klass: null,
        status: 0,
        lang: "zh_CN",
        sort: null,
        basicUrl: BASICURL,
        config :{
          uploadUrl: `${BASICURL}admin/common/upload/oss/image`,
          uploadName: 'file',
          parentName: 'helpManage',
          uploadParams: {

          },

          uploadCallback: (data) => {
            this.uploading = false;
            if(!data.code){
              this.$Message.success('Subido con éxito!');
              return data.data;
            }else{
              this.$Message.error('subida fallida!');
            }
          },
          uploadFailed: (err) => {
            console.log(err)
            this.uploading = false;
            this.$Message.error('subida fallida!');

          }
        }
      }
    },
    methods: {
      ifUploading(val) {
        this.uploading = val;
      },
      changeAdStatus() {

      },
      upload() {
        this.$refs.smeditor.$emit('saveInner');

        let uploadObj = {
          title: this.title,
          sysHelpClassification: this.klass,
          status: this.status,
          lang: this.lang,
          sort: this.sort,
          content: getStore('smeditor')
        };

        let fn = null;
        if(this.ifAdd)  fn = addHelpManage;
        else {
					uploadObj.id = this.queryDetailId;
					uploadObj.createTime = this.createTime;
          fn = updateHelpManage;
        }

        if ( this.title ==='' || this.title ===null ||
            this.klass ==='' || this.klass ===null ||
            getStore('smeditor') ==='' || getStore('smeditor') === null ) {
              this.$Message.warning('Por favor complete la información！')
        } else {
          fn(uploadObj)
          .then( res => {
            if(!res.code) {
              this.$Message.success('Operación exitosa!');
              this.$router.push('/content/helpManage');
              removeStore('smeditor');
            }  else this.$Message.error('Error!');
          })
        }
      }
    },
    created() {
      removeStore('smeditor');
      this.queryDetailId = getStore('manageID');

      if (!!this.queryDetailId) {
        this.ifAdd = false;

        helpManageDetail({ id: this.queryDetailId })
       .then(res => {
         console.log(res);
         this.createTime = res.data.createTime;
         this.title = res.data.title;
         this.klass = res.data.sysHelpClassification;
         this.status = res.data.status;
         this.lang = res.data.lang;
         this.sort = res.data.sort;
          setStore('smeditor', res.data.content);

       })

      } else this.ifAdd = true;
      // this.textareaInner = getStore('smeditor');
    },

    components: {
      smeditor
    },


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
    margin: 20px auto;
    width: 30%;

  }
  .formWrapper{
    p, div{
      margin: 5px 0;
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
</style>

