<template>
  <div class="pdf-container" @scroll="handleScroll">
    <div v-for="page in state.renderedPages" :key="page.pageNum" class="pdf-page">
      <canvas class="canvas-pdfjs" :ref="el => { if (el) initPageCanvas(el, page.pageNum) }"></canvas>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, watch} from 'vue';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
const state = reactive({
  pdfDoc: null,
  totalPages: 0,
  renderedPages: [],
});
const props = defineProps({
  url: String,
  token: String
})
onMounted(async () => {
  state.pdfDoc = await pdfjsLib.getDocument({url: props.url, password: props.token}).promise;
  state.totalPages = state.pdfDoc.numPages;
  // 初始渲染页面
  for (let i = 1; i <= state.totalPages; i++) {
    state.renderedPages.push({pageNum: i});
  }
});

const initPageCanvas = async (canvas, pageNum) => {

  const pdfDoc = await pdfjsLib.getDocument({url: props.url, password: props.token}).promise;
  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({scale: 1.5});
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const renderContext = {
    canvasContext: canvas.getContext('2d'),
    viewport,
  };
  page.render(renderContext);
};

const handleScroll = (e) => {
  // 实现虚拟滚动的逻辑可以在这里添加
  // 基于滚动位置动态加载和卸载页面
};
</script>

<style>
.pdf-container {
  height: 90vh;
  width: 60vw;
}

.pdf-page {
  margin-bottom: 10px;
}

</style>
