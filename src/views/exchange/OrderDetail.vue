<template>
  <div>
    <Card>
      <p slot="title">
        Detalles del pedido de tokens
        <!-- <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          刷新
        </Button> -->
      </p>

      <div class="baseInfo">
        <Row>
          <Col span="6">
          <p>Número de orden：<span>{{detail[0].orderId}}</span></p>
          </Col>
          <Col span="6">
          <p>estado：<span>{{getStatus(detail[0].status)}}</span></p>
          </Col>
          <Col span="6">
          <p>tiempo de comisión：<span>{{getTime(detail[0].time)}}</span></p>
          </Col>
          <Col span="6">
          <p>tipo de delegado：<span>{{getStyle(detail[0].type)}}</span></p>
          </Col>
        </Row>

        <Row>
          <Col span="6">
          <p>Precio del pedido：<span>{{detail[0].price}}</span></p>
          </Col>
          <Col span="6">
          <p>numero de ordenes：<span>{{detail[0].amount}}</span></p>
          </Col>
          <Col span="6">
          <p>El número de transacciones：<span>{{detail[0].tradedAmount}}</span></p>
          </Col>
        </Row>
      </div>

    </Card>
    <br><br>
    <Card>
      <p slot="title">
        交易记录
      </p>
      <Row>
        <Table :columns="columnsList" :data="userpage" border :loading="ifLoading" class='user_center'>
        </Table>
      </Row>

      <Row class="pageWrapper">
        <Page :total="totalNum" style='margin-top:8px' :current="current" @on-change="changePage" show-elevator></Page>
      </Row>
    </Card>
  </div>
</template>

<script>
import dtime from "time-formater";
import { exgOrderDetail, queryBBOrder } from "@/service/getData";
import { setStore, getStore, removeStore } from "@/config/storage";
export default {
  data() {
    return {
      currentPageIdx: null,
      totalNum: null,
      ifLoading: true,
      current: 1,
      pageIndex: 1,
      columnsList: [
        {
          title: "orderId",
          key: "orderId"
        },
        {
          title: "price",
          key: "price"
        },
        {
          title: "amount",
          key: "amount"
        },
        {
          title: "fee",
          key: "fee"
        },
        {
          title: "time",
          key: "time",
          render: (h, obj) => {
            let formatTime = dtime(obj.row.time).format("YYYY-MM-DD HH:mm:ss");
            return h("span", {}, formatTime);
          }
        }
      ],
      userpage: [],
      detail: [
        {
          amount: null,
          baseSymbol: null,
          canceledTime: null,
          coinSymbol: null,
          completed: null,
          completedTime: null,
          detail: null,
          direction: null,
          memberId: null,
          orderId: null,
          price: null,
          status: null,
          symbol: null,
          time: null,
          tradedAmount: null,
          turnover: null,
          type: null,
          useDiscount: null
        }
      ],
      status: ["en transacción", "terminado", "Cancelado"]
    };
  },
  methods: {
    refreshPageManual() {
      this.ifLoading = true;
      this.refreshPage({ pageNo: this.currentPageIdx, pageSize: 20 });
    },
    getTime(time){
      return dtime(time).format('YYYY-MM-DD HH:mm:ss')
    },
    getStyle(str){
      return str=="MARKET_PRICE" ? "market" : "limit";
    },
    getStatus(str) {
      var direction = ""
      if (str == "TRADING") {
        direction = "trading";
      } else if (str == "COMPLETED") {
        direction = "campleted";
      } else if (direction == "CANCELED") {
        direction = "cancel";
      }
      return direction;
    },
    changePage(pageIndex) {
      this.ifLoading = true;
      this.currentPageIdx = pageIndex;
      this.refreshPage({ pageNo: pageIndex, pageSize: 20 });
    },
    refreshPage() {
      let orderID = getStore("exchangeOrderId");
      let completed = JSON.parse(getStore("completed"));
      completed = completed ? 1 : 0;
      let obj = { orderId: orderID, completed: completed };
      queryBBOrder(obj).then(res => {
        if (!res.code) {
          this.detail = res.data && res.data.content;
        } else {
          this.$Message.error("error de consulta");
        }
      });
      exgOrderDetail({ id: orderID }).then(res => {
        this.userpage = res.data;
        this.totalNum = res.data.length;
        this.ifLoading = false;
      });
    }
  },
  created() {
    this.refreshPage();
  }
};
</script>

<style lang="less" scoped>
</style>