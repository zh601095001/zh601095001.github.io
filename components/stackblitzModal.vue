<script lang="jsx">
import { defineComponent, ref } from 'vue';
export default {
    props: ['projectId','projectTitle'],
    setup(props,) {
        const {projectId,projectTitle} = props
        const visible = ref(false);

        const showModal = () => {
            visible.value = true;
        };

        const handleOk = (e) => {
            console.log(e);
            visible.value = false;
        };
        return ()=>(
            <div>
                <a-button type="primary" onClick={showModal} >开始练习</a-button>
                <a-modal
                    v-model:visible={visible.value}
                    title={projectTitle}
                    onOk={handleOk}
                    footer={null}
                    width="100%"
                    bodyStyle={{
                        padding:0,
                        height:"90vh"
                    }}
                    wrapClassName="stackblitzModal"
                >
                    <stackblitz
                        projectId={projectId}
                        embedOptions={
                            {
                                forceEmbedLayout: true,
                                openFile: 'index.js',
                                height:"100%",
                                view:"editor"
                            }
                        }
                    />
                </a-modal>
            </div>
        )
    }
}
</script>
<style>
.stackblitzModal .ant-modal{
    max-width: 100%!important;
    top:0;
    padding: 10px;
}
</style>
