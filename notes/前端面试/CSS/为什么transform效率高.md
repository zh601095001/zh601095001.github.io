# 为什么transform效率高？

因为transform既不会影响布局也不会影响绘制指令，它影响的只是渲染流程的最后一个draw阶段。 由于draw阶段在合成线程中，所以transform的变化几乎不会影响渲染主线程。反之，渲染主线程无论如何忙碌，也不会影响transform的变化。

**注：涉及字体放大、位置移动之类的，尽量使用transform**
