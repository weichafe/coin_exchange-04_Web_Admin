<template>
    <div @click="showMessage" class="message-con">
        <Tooltip :content="value > 0 ? 'Tener' + value + 'mensajes no leídos' : 'Sin mensajes sin leer'" placement="bottom">
            <Badge :count="value" dot>
                <Icon type="ios-bell" :size="22"></Icon>
            </Badge>
        </Tooltip>
    </div>
</template>

<script>
import util from '@/libs/util.js';
export default {
    name: 'messageTip',
    props: {
        value: {
            type: Number,
            default: 0
        }
    },
    methods: {
        showMessage () {
            util.openNewPage(this, 'message_index');
            this.$router.push({
                name: 'message_index'
            });
        }
    }
};
</script>
