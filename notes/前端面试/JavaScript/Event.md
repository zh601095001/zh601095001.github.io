# Event

## e.target和e.currentTarget有什么区别？

1. e.target永远指向被点击的那个对象
2. e.currentTarget指向绑定该事件的对象，也就是说是`xxx.addEventListener`中的`xxx`对象

- 我们给四个div元素绑定事件，且`addEventListener`第三个参数不设置，则默认设置为`false`

  ```html
      <div id="a">
        <div id="b">
          <div id="c">
            <div id="d">哈哈哈哈哈</div>
          </div>
        </div>
      </div>
  ```

  ```js
  const a = document.getElementById('a')
  const b = document.getElementById('b')
  const c = document.getElementById('c')
  const d = document.getElementById('d')
  a.addEventListener('click', (e) => {
    const {
      target,
      currentTarget
    } = e
    console.log(`currentTarget是${currentTarget.id}`)
  })
  b.addEventListener('click', (e) => {
    const {
      target,
      currentTarget
    } = e
    console.log(`currentTarget是${currentTarget.id}`)
  })
  c.addEventListener('click', (e) => {
    const {
      target,
      currentTarget
    } = e
    console.log(`currentTarget是${currentTarget.id}`)
  })
  d.addEventListener('click', (e) => {
    const {
      target,
      currentTarget
    } = e
    console.log(`currentTarget是${currentTarget.id}`)
  })
  ```

  输出结果：d c b a

  原因：参数为`false`时，在事件冒泡阶段触发，此时的currentTarget由内向外触发

- addEventListener第三个参数为`true`:

  输出结果：a b c d

  原因：参数为`true`时，在事件捕获阶段触发，此时的currentTarget由外向内触发

