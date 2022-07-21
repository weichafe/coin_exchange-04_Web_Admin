<template>
  <div>
    <Card>
      <p slot="title">
        Detalles de auditoría
        <Button type="primary" size="small" @click="reset">
          <Icon type="refresh"></Icon>
          actualizar
        </Button>
      </p>

      <div class="stepWrapper">
        <Steps :current="status">
          <Step title="auditado" v-if="!!status"></Step>
          <Step title="revisión pendiente" v-if="!status"></Step>
          <Step title="Transferencia"></Step>
          <Step title="Transacción fallida" v-if="status===2"></Step>
          <Step title="transacción exitosa" v-if="status!==2"></Step>
        </Steps>
      </div>
      <Row class="userDetails">

        <span>nombre de usuario
          <i>{{ userInfo.memberUsername }}</i>
        </span>
        <span>nombre real
          <i>{{ userInfo.memberRealName }}</i>
        </span>
        <span>cantidad a cuenta
          <i>{{ userInfo.arrivedAmount }}</i>
        </span>
        <span>dirección de retiro
          <i>{{ userInfo.address }}</i>
        </span>

        <br>
        <span>Moneda de retiro
          <i>{{ userInfo.unit }}</i>
        </span>

        <span>tasa de tramitación：
          <i>{{ userInfo.fee }}</i>
        </span>
        <span>Cantidad de retiro：
          <i>{{ userInfo.totalAmount }}</i>
        </span>
        <span>tiempo de aplicación：
          <i>{{ userInfo.createTime }}</i>
        </span>

        <div class="passCoinWrapper" v-if="status===1&&isAuto===0">
          <Button type="error" size="large" @click=" ifPassCoin = true ">Empezar a depositar monedas</Button>
        </div>

      </Row>

      <Modal class="passCoinModal" width="400" v-model="ifPassCoin" @on-ok="confrimPass">
        <div>Por favor ingrese el número de serie：
          <p>
            <Input type="textarea" v-model="transactionNum"></Input>
          </p>
        </div>
      </Modal>

      <Row class="tradeRecord">
        <h3>Registro de la transacción</h3>
        <div class="tableWrapper">
          <div class="poptip" style="display:flex;flex-direction:row;margin-bottom: 10px;">
            <div style="width:100px;">tipo de transacción：</div>
            <Select v-model="tradeType" style="width:100px;margin-right:20px;">
              <Option v-for="(item, index) in tradeTypeArr"
                    :value="index"
                    :key="item">{{ item }}</Option>
            </Select>
            <Button type="info" size="small" @click="searchByFilter" style="padding: 5px 20px;">búsqueda</Button>
          </div>
          <Table :columns="columns_first" :data="trade_data"></Table>
          <Page :total="totalNum" :page-size=10  @on-change="changePage"></Page>
        </div>
        <p class="line"></p>
        <div class="btnContainer" v-if="!status">
          <Button type="error" size="large" @click="ifPass(false)">Fallar</Button>
          <Button type="success" size="large" @click="ifPass(true)">pasar</Button>
        </div>
      </Row>

    </Card>

  </div>
</template>

<script>
import Cookies from "js-cookie";
import { setStore, getStore, removeStore } from "@/config/storage";
import {
  auditPass,
  auditNoPass,
  withdrawManage,
  perTradeAll,
  passCoinByOne
} from "@/service/getData";

export default {
  data() {
    return {
      isAuto: null,
      transactionNum: null,
      ifPassCoin: false,
      userInfo: {},
      totalNum: null,
      status: null,
      tradeType: null,
      tradeTypeArr: [ 'recargar', 'retirar', 'transferir', 'comercio de divisas', 'Compra de moneda fiduciaria', 'Venta de moneda fiduciaria', 'Premio Actividad', 'Recompensa de promoción', 'Dividendo', 'votar', 'recarga manual', 'par', 'intercambio de eventos' ],
      columns_first: [
        {
          title: "ID",
          key:"memberId"
        },
        {
          title: "medio de transacción",
          key: "type",
          render: (h, obj) => {
            let type = obj.row.type;
            let arr = [
              "recargar",
              "retirar",
              "transferir",
              "comercio de divisas",
              "Compra de moneda fiduciaria",
              "Venta de moneda fiduciaria",
              "Premio Actividad",
              "Recompensa de promoción",
              "Dividendo",
              "votar",
              "recarga manual",
              "par",
              "intercambio de eventos"
            ];
            return h("span", {}, arr[type]);
          }
        },
        {
          title: "Monto de la transacción",
          render: (h, obj) => {
            let amount = obj.row.amount;
            let symbol = obj.row.symbol;
            return h("span", {}, amount + " " + symbol);
          }
        },
        {
          title: "Tarifas de transacción",
          key:"fee"
        },
        {
          title: "hora de transacción",
          key:"createTime"
        }
      ],
      trade_data: []
    };
  },
  methods: {
    confrimPass() {
      if (!this.transactionNum) {
        this.$Message.warning("Por favor complete el número de serie！");
      } else {
        let obj = {
          id: this.userInfo.id,
          transactionNumber: this.transactionNum
        };

        passCoinByOne(obj).then(res => {
          if (!res.code) {
            this.$Message.success("Operación exitosa！");
            this.$router.push("/finance/userwithdrawals");
          } else this.$Message.error(res.message);
        });
      }
    },
    reset() {},
    searchByFilter(){
      perTradeAll({pageNo: 1, pageSize: 20, memberId: this.userInfo.memberId, type: this.tradeType}).then(res => {
        this.totalNum = (res.data && res.data.totalElements) || 1;
        this.trade_data = (res.data && res.data.content)|| [];
      });
    },
    changePage(pageIndex) {
      perTradeAll({pageNo: pageIndex, pageSize: 20, memberId: this.userInfo.memberId, type: this.tradeType}).then(res => {
        this.totalNum = (res.data && res.data.totalElements) || 1;
        this.trade_data = (res.data && res.data.content)|| [];
      });
    },
    ifPass(bol) {
      let id = this.userInfo.id;
      console.log(this.userInfo);
      let fn = null;

      if (bol) fn = auditPass;
      else fn = auditNoPass;

      fn({ ids: [id] }).then(res => {
        if (!res.code) {
          this.$Message.success(res.message);
        } else {
          this.$Message.error("solicitud de excepción!");
        }

        this.$router.push({ path: "/finance/userwithdrawals" });
      });
    },
    refreshPage() {
      this.userInfo = JSON.parse(getStore("userDetails"));
      this.status = this.userInfo.status;
      this.isAuto = this.userInfo.isAuto;
      perTradeAll({pageNo: 1,pageSize: 6,memberId: this.userInfo.memberId}).then(res => {
          if (!res.code)
          this.totalNum = (res.data && res.data.totalElements) || 1;
          this.trade_data = (res.data && res.data.content) || [];
        },
        err => {
          console.log(err);
        }
      );
    }
  },
  created() {
    this.refreshPage();
  }
};
</script>

<style scoped>
.ivu-modal-body div {
  font-size: 14px;
  font-weight: 700;
  line-height: 40px;
}
.stepWrapper {
  padding: 10px 0;
  padding-left: 10%;
}
.userDetails {
  position: relative;
  font-size: 13px;
}
.passCoinWrapper {
  position: absolute;
  top: 10px;
  right: 0;
}
.userDetails span {
  padding-left: 10px;
  display: inline-block;
  min-width: 150px;
  height: 25px;
  font-weight: 700;
}
.userDetails i {
  font-style: normal;
  font-weight: normal;
}
.tradeRecord {
  padding-left: 10px;
  margin-top: 10px;
}
.tradeRecord h3 {
  color: #2b85e4;
  margin-bottom: 10px;
}
.btnContainer {
  margin-top: 15px;
  text-align: center;
}
.btnContainer button {
  margin: 10px;
}
.tableWrapper {
  text-align: right;
}
.tableWrapper .ivu-page {
  margin-top: 20px;
  margin-right: 80px;
}
.line {
  margin-top: 10px;
  border-top: 1px solid #dddee1;
}
</style>
