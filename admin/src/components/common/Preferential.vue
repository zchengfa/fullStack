<script setup lang="ts">
const props = defineProps({
    leftColor:{
        type:String,
        default(){
            return '#df1313'
        }
    },
    rightColor:{
        type:String,
        default(){
            return '#a18815c7'
        }
    },
    threshold:{
        type:String,
        default(){
            return ''
        }
    },
})
</script>

<template>
<div class="preferential-container">
    <div class="left-box" :style="{backgroundColor:leftColor}">
        <span class="title">优惠券</span>
    </div>
    <div class="right-box" :style="{backgroundColor:rightColor}">
        <div class="pri-box">
            <span class="threshold-price">{{threshold}}</span>
        </div>

    </div>
</div>
</template>

<style scoped>
.preferential-container{
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    min-width: 100px;
    min-height: 60px;
    width: 100%;
    height: 100%;
    color: #fff;

}
.left-box{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20%;
    height: 100%;

    background: radial-gradient(15px at top right,#fff 50%,transparent 50%),
    radial-gradient(15px at bottom right,#fff 50%,transparent 50%);
}
.right-box{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 80%;
    height: 100%;
    background: radial-gradient(15px at top left,#fff 50%,transparent 50%),
    radial-gradient(15px at bottom left,#fff 50%,transparent 50%);
}

.title{
    display: block;
    padding: 6px;
    white-space: pre-wrap;
    font-size: 12px;
    transform: scale(.6);

}

.threshold-price{
    font-size: 14px;

    transform: scale(.7);
}
.pri-box{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80%;
    height: 80%;
    border-radius: 6px;
    border: 1px solid #fff;
}

</style>