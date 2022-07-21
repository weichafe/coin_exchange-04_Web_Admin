<template>
<!-- 提币明细 -->
  <div>
    <Card>
      <p slot="title">
        Detalles de retiro
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          actualizar
        </Button>
      </p>

       <Row>
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
        <Page :total="totalNum"
        :current="currentPageIdx"   
        @on-change="changePage" show-elevator></Page>
      </Row>

    </Card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns_first: [
          {
            title: 'ID',
            key: 'id',
          },
          {
            title: 'nombre de usuario',
            key: 'username',
          },
          {
            title: 'Correo',
            key: 'email',
          },
          {
            title: 'Número de teléfono',
            key: 'mobilePhone',
          },
           {
            title: 'nombre real',
            key: 'realName',
          },
           {
            title: 'nombre de la moneda',
            key: 'username',
          },
          {
            title: 'dirección de la billetera',
            key: 'username',
          },
          {
            title: 'Número de monedas retiradas',
            key: 'username',
          },
          {
            title: 'Llegadas reales',
            key: 'username',
          },
          {
            title: 'tasa de tramitación',
            key: 'username',
          },
          {
            title: 'Tiempo de solicitud de retiro',
            key: 'username',
          },
           {
            title: 'Tiempo de aprobación',
            key: 'username',
          },
           {
            title: 'Crítico',
            key: 'username',
          }
      ],
      userpage: [],
      ifLoading: true,
      totalNum: null,
      currentPageIdx: 1,
    }
  },
  mehods: {
    refreshPageManual() {

    },
    changePage() {

    }
  }
}
</script>

<style lang="less" scoped>

</style>


