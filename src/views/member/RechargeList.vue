<template>

  <div>
    <Card>
      <p slot="title">
        Detalles del depósito
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
            title: 'username',
            key: 'username',
          },
          {
            title: 'email',
            key: 'email',
          },
          {
            title: 'mobilePhone',
            key: 'mobilePhone',
          },
           {
            title: 'realName',
            key: 'realName',
          },
           {
            title: 'username',
            key: 'username',
          },
          {
            title: 'username',
            key: 'username',
          },
          {
            title: 'username',
            key: 'username',
          },
          {
            title: 'username',
            key: 'username',
          },
          {
            title: 'username',
            key: 'username',
          },
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


