<template>
  <a @click="handleClick">{{ title }}</a>
  <a-modal
      v-model:visible="visible"
      title="请输入密码-下载PDF"
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
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.password"/>
      </a-form-item>
      <a-form-item
      >
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import sha256 from "crypto-js/sha256"
import {message} from "ant-design-vue";
export default {
  name: "authUrl",
  props: {
    title: {
      default: "PDF"
    },
    url: String
  },
  data() {
    return {
      visible: false,
      formState: {
        password: ""
      }
    }
  },
  methods: {
    handleClick() {
      this.visible = true
    },
    onFinish() {
      this.visible = false
      if (sha256(this.formState.password).toString() === "9b6248011d83ed46f7620a4c0a3580e8058121cb2e06c05e6bdab722bcb9a119"){
        window.open(this.url)
      }else {
        message.error('密码输入错误');
      }
    },
  }
}
</script>

<style scoped>

</style>
