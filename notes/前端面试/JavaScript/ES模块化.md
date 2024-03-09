# ES模块化原理

## 1.1 与cjs的区别

例子：

```js
// math.js
export let num = 3;
export function updateNum(value) {
  num = value;
}
```

```js
// main.js
import { num, updateNum } from './math.js';

console.log(num); // 输出：3
updateNum(5);
console.log(num); // 现在输出：5
```

es模块化导入的是引用（live bindings），而cjs是浅拷贝

## 1.2 通过babel编译方法理解esm

```js
// Webpack 引导/运行时代码
// 设置一个对象来存储已加载的模块
var installedModules = {};

// 模拟 require 函数
function __webpack_require__(moduleId) {
    // 检查模块是否在缓存中
    if(installedModules[moduleId]) {
        return installedModules[moduleId].exports;
    }
    // 如果不在缓存中，创建一个新模块（并且把它放入缓存）
    var module = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
    };

    // 执行模块函数
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // 标记模块为已加载
    module.l = true;

    // 返回模块的导出
    return module.exports;
}

// 存储模块的定义
var modules = [
  // math.js 模块
  function(module, exports) {
    function add(x, y) {
      return x + y;
    }
    exports.add = add;
  },

  // index.js 模块
  function(module, exports, __webpack_require__) {
    var math = __webpack_require__(0);
    console.log("2 + 3 = ", math.add(2, 3));
  }
];

// 执行入口模块（index.js）
__webpack_require__(1);
```

从以上编译结果，我们可以知道，模块只有第一次导入会执行，再次导入时会使用缓存，且可以通过导出的函数去控制模块内导出的变量值

## 1.3静态导入与动态导入

1. 静态导入：在编译阶段就已经确定了依赖，因此导入语句必须写在模块开头

2. 动态导入：模块的导入允许嵌套在条件语句内部，实现条件导入，缺点是只能在运行时才能确认到底哪些模块最终被导入了

区别：由于静态导入在代码运行前就已经能确定依赖关系，因此可以进行代码的静态依赖检查，以执行tree shaking

## 1.4 tree shaking

1. 使用ES6模块

开始于代码的编写阶段，开发者需要使用ES6模块语法（`import`和`export`），因为它允许静态分析，即在编译时就能确定模块之间的依赖关系。

2. 静态分析

构建工具（如Webpack或Rollup）在构建过程中对代码进行静态分析，识别所有的`import`和`export`语句，构建一个模块间的依赖图。

通过这个依赖图，构建工具能够识别哪些模块和导出被其他模块所引用。

3. 标记未使用的导出

在静态分析的基础上，构建工具进一步分析哪些导出没有在任何地方被引用。这些未被引用的导出会被标记为未使用。

4. 移除未使用的代码

在最终生成的构建包中，构建工具会移除那些被标记为未使用的导出代码。这一步骤通常在代码压缩阶段（如使用Terser等压缩工具）进行，因为压缩工具能够在减小文件体积的同时，移除未引用的函数和变量。

5. 配置副作用

为了进一步优化tree shaking，开发者可以在`package.json`文件中通过`sideEffects`属性指明哪些文件是“纯净”的（即没有副作用的，比如直接修改全局状态的操作）。这告诉构建工具哪些模块的导出即使没有被直接引用，也不应该被移除。

```json
{
  "sideEffects": false
}
```

如果项目中某些文件有副作用，可以将`sideEffects`设置为一个数组，列出所有有副作用的文件。

6. 优化和测试

在整个tree shaking过程完成后，开发者需要进行彻底的测试，确保移除未使用代码的同时，没有误删必要的代码，保证应用正常运行。
