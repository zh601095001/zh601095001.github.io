<template>
<div style="display: flex;margin:12px 0;font-size: 12px;">
    <div style="color: rgb(89,89,89);margin-right: 10px">难度</div>
    <div :style="{color:levelColor[level]}">{{levelText[level]}}</div>
</div>
</template>

<script>
export default {
    name: "algorithmLevel",
    props:{
        level:{ // 难度： 0 简单 1 中等 2 复杂
            default:0
        }
    },
    data(){
        return {
            levelText:["简单","中等","困难"],
            levelColor:["rgb(90,183,38)","rgb(255,161,25)","rgb(255,45,85)"]
        }
    }
};
</script>

<style scoped>

</style>
