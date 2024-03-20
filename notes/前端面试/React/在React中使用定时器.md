# React中使用定时器

## 1.在定时器中直接使用setState带来的问题

```jsx
function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setInterval(() => {
      setCount(count + 1);
    }, 1000);
  }, []);
  return (
    <div>{count}</div>
  );
}
```

问题：

1. **内存泄露问题**：当`App`组件卸载后，由`useEffect`创建的定时器会继续运行，因为定时器在组件卸载后并没有被清除。这可能会导致内存泄露，因为定时器会尝试更新已经卸载的组件的状态。
2. **闭包陷阱**：定时器回调函数中的`count`变量来自于组件首次渲染时的闭包，因此它的值始终为0。这意味着无论定时器调用了多少次`setCount`，`count`的值都不会增加。

## 2.改进版本1

```jsx
function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>{count}</div>
  );
}
```

问题：

1. `setInterval`内仍然是闭包的环境,无法在回调中获取每次最新的props值
2. `setInterval`参数不是“响应式的”，需要手动添加依赖

## 3.改进版本2

```jsx
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
```

优点：

1. `useInterval`接收的`callback`在react每次执行使用该hook的函数组件都会导致callback的引用发生变化，保证了callback每次执行时都是最新的
2. 动态监听delay变化

## 4.实现useRafInterval

```js
interface Handle {
  id: number | NodeJS.Timer;
}

const setRafInterval = function (callback: () => void, delay: number = 0): Handle {
  if (typeof requestAnimationFrame === typeof undefined) {
    return {
      id: setInterval(callback, delay),
    };
  }
  let start = new Date().getTime();
  const handle: Handle = {
    id: 0,
  };
  const loop = () => {
    const current = new Date().getTime();
    if (current - start >= delay) {
      callback(); // 执行回调
      start = new Date().getTime();
    }
    handle.id = requestAnimationFrame(loop);
  };
  handle.id = requestAnimationFrame(loop);
  return handle;
};

function cancelAnimationFrameIsNotDefined(t: any): t is NodeJS.Timer {
  return typeof cancelAnimationFrame === typeof undefined;
}

const clearRafInterval = function (handle: Handle) {
  if (cancelAnimationFrameIsNotDefined(handle.id)) {
    return clearInterval(handle.id);
  }
  cancelAnimationFrame(handle.id);
};

function useRafInterval(
  fn: () => void,
  delay: number | undefined,
  options?: {
    immediate?: boolean;
  },
) {
  const immediate = options?.immediate;

  const fnRef = useLatest(fn);

  useEffect(() => {
    if (typeof delay !== 'number' || delay < 0) return;
    if (immediate) {
      fnRef.current();
    }
    const timer = setRafInterval(() => {
      fnRef.current();
    }, delay);
    return () => {
      clearRafInterval(timer);
    };
  }, [delay]);
}
```

