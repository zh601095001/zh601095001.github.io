<template>
  <div>
    <h1 v-if="titleVisible">{{currentTitle}}</h1>
    <div style="margin-bottom: 20px;margin-top: 20px">
      <vue3VideoPlay v-bind="options" :width="width" :height="height" :src="src"/>
    </div>
    <a-list bordered :data-source="data">
      <template #header>
        <div>播放列表</div>
      </template>
      <template #renderItem="{ item }">
        <a-list-item>
          {{ item.title }}
          <template #actions>
            <a-button type="primary" @click="handleClick(item.url,item.title)">{{ title }}&nbsp;</a-button>
          </template>
        </a-list-item>
      </template>
    </a-list>

    <a-modal
        v-model:visible="visible"
        title="请输入密码"
        :footer="null"
    >
      <a-form
          :model="formState"
          name="basic"
          autocomplete="off"
          @finish="onFinish"
          ref="form"
          layout="inline"
      >
        <a-form-item
            label="密码"
            name="password"
            :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.password"/>
        </a-form-item>
        <a-form-item
        >
          <a-button type="primary" html-type="submit">播放</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import sha256 from "crypto-js/sha256";
import {message} from "ant-design-vue";
export default {
  name: "MyVideo",
  props: {
    width: String,
    height: String,
    data:Object
  },
  data() {
    return {
      title: "播放",
      currentTitle:"",
      visible: false,
      titleVisible:false,
      formState: {
        password: ""
      },
      src:"",
      privateSrc:"",
      width: "0px",
      height: "0px",
      options: {
        color: "#409eff", //主题色
        title: "", //视频名称
        muted: false, //静音
        webFullScreen: false,
        speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
        autoPlay: false, //自动播放
        loop: false, //循环播放
        mirror: false, //镜像画面
        ligthOff: false, //关灯模式
        volume: 0.3, //默认音量大小
        control: true, //是否显示控制
        controlBtns: [
          "audioTrack",
          "quality",
          "speedRate",
          "volume",
          "setting",
          "pip",
          "pageFullScreen",
          "fullScreen",
        ], //显示所有按钮,
      }
    }
  },
  methods: {
    handleClick(src,title) {
      this.visible = true
      this.titleVisible = false
      this.width = "0px"
      this.height = "0px"
      this.privateSrc = src
      this.src = ""
      this.currentTitle = title
      console.log(sha256("ligroup410").toString())
    },
    onFinish() {
      this.visible = false
      if (sha256(this.formState.password).toString() === "7e27e4bd3518e5a45a064bd10c805172c722c6dedd31057ca5727495132687ae") {
        this.width = "800px"
        this.height = "450px"
        this.src = this.privateSrc
        this.titleVisible = true
      } else {
        message.error('密码输入错误');
      }
    },
  }
}
</script>

<style scoped>

</style>
