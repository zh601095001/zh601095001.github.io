<template>
  <div style="height: 100%">
    <div :id="id"></div>
  </div>
</template>
<script>
import sdk from '@stackblitz/sdk'

export default {
  name: "stackblitz",
  data() {
    return {
      id: "stackblitz-" + Date.now()
    }
  },
  props: {
    projectId: String,
    embedOptions: {
      default: {
        forceEmbedLayout: true,
        openFile: 'index.js',
        view: "editor",
        height: 600,
      }
    }
  },
  mounted() {
    sdk.embedProjectId(
        this.id,
        this.projectId,
        this.embedOptions
    );
  }
}
</script>
