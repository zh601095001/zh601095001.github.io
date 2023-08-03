# Javascript
## 原型和原型链
![](https://typro-zh.oss-cn-shanghai.aliyuncs.com/b4599b1c11093903233e88796a827cb0.png)
- __proto__为对象所专有，指向创建该对象的构造函数的prototype
- prototype为函数所专有,其本身为普通对象实例
- Function对象由其自身创建，所以其不仅是对象，也是构造函数，所以其__proto__ === prototype
- Object函数由Function创建，所以其Object.__proto__ === Function.prototype
- Function.prototype是Object的实例，所以Function.prototype.__proto__ === Object.prototype
- Object.prototype.__proto__ === null,虽然Object.prototype是由Object函数构造的，但是为了避免形成死循环，将其指向null