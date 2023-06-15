<template>
    <div>
        <div :id="id"></div>
    </div>
</template>
<script>
import sdk from '@stackblitz/sdk'

export default {
    name:"stackblitz",
    data(){
      return {
          id:"stackblitz-"+Date.now()
      }
    },
    props:{
        projectId:String,
        embedOptions:{
            default:{
                forceEmbedLayout: true,
                openFile: 'index.js',
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
