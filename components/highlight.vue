<template>
  <a class="highlight" :href="link">{{value}}</a>
</template>

<script>
export default {
  name: "highlight",
  props:{
    value:String,
    link:String
  }
}
</script>

<style scoped>
.highlight {
  position: relative;
  text-decoration: none;
  white-space: nowrap;
  color: #121314;
}

.highlight:after {
  content: '';
  position: absolute;
  z-index: -1;
  top: 66%;
  left: -0.1em;
  right: -0.1em;
  bottom: 0;
  transition: top 200ms cubic-bezier(0, 0.8, 0.13, 1);
  background-color: rgba(79, 192, 141, 0.5);
}
.highlight:hover{
  text-decoration: none;
}
.highlight:hover:after{
  top:0px
}
</style>
