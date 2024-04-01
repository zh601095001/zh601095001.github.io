# 一、Threejs中的基本概念

## 1.场景

在 Three.js 的3D世界里，场景（Scene）是所有物体、灯光和摄像机的容器

```js
const scene = new THREE.Scene()
```

## 2.相机

相机定义了用户从什么位置，以什么角度查看场景，以及决定了渲染视图的范围和深度。相机决定了哪部分的3D场景会被渲染到屏幕上，它如何映射3D世界到2D显示屏幕，以及哪些对象是可见的。

```js
const camera = new THREE.PerspectiveCamera(
    45, // 视角
    window.innerWidth / window.innerHeight, // 宽高比
    0.1, // 近平面
    1000 // 远平面
)
```

## 3.渲染函数

```js
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight) // 设置渲染宽高
renderer.render(scene, camera) // 渲染场景和相机
```

## 4.几何体

几何体代表了物体的形状，即其顶点和面的集合。

```js
const geometry = new THREE.BoxGeometry(1, 1, 1) // 立方体
```

### 4.1 BufferGeometry

与其前身 `Geometry` 相比，`BufferGeometry` 提供了一种更直接、更低层次的方式来处理顶点和其他与几何体相关的数据。

特别注意：

1. 顶点是有顺序的，逆时针为正面。
2. Three.js中的材质默认是单面渲染，可以通过`side: THREE.DoubleSide`设置材质的两面都渲染

### 4.1.1通过三个定点创建三角形

```js
// 示例 通过BufferGeometry创建一个三角形

// 创建一个BufferGeometry对象
const geometry = new THREE.BufferGeometry();

// 定义顶点位置数据
const vertices = new Float32Array([
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0,
    0.0, 1.0, 0.0,
]);

// 创建顶点位置属性并添加到geometry
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// 使用geometry和material创建网格
const mesh = new THREE.Mesh(geometry, material);

// 将网格添加到场景中
scene.add(mesh);
```

### 4.1.2通过索引共用定点

```js
const geometry = new THREE.BufferGeometry()
const vertices = new Float32Array([
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0,
    1.0, 1.0, 0.0,
    -1.0, 1.0, 0.0
])
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
geometry.setIndex(new THREE.BufferAttribute(indices, 1))
```

### 4.1.3通过索引创建定点组

```js
geometry.addGroup(0, 3, 0) // 从第0个索引定点开始，选择3个定点作为一组，其材质索引为0
geometry.addGroup(3, 3, 1)
const material1 = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide})
const material2 = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide})
const mesh = new THREE.Mesh(geometry, [material1, material2])
```

## 5.材质

材质（Material）是一个非常重要的概念，它定义了一个三维物体表面的视觉属性。材质决定了物体看起来是什么颜色，是否透明，是否反射光线，表面是光滑还是粗糙，以及许多其他特性。这些视觉属性影响着物体在3D场景中的外观和感觉。

```js
const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
```



## 5.1贴图

```js
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load("./texture/watercover/CityNewYork002_COL_VAR1_1K.png")
const aoMap = textureLoader.load("./texture/watercover/CityNewYork002_AO_1K.jpg")
const alphaMap = textureLoader.load("./texture/door/height.jpg")
const lightMap = textureLoader.load("./texture/colors.png")
const specularMap = textureLoader.load("./texture/watercover/CityNewYork002_GLOSS_1K.jpg")

const rgbeLoader = new RGBELoader()
rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", envMap => {
    envMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = envMap
    scene.environment = envMap
    planeMaterial.envMap = envMap
})

const planeGeometry = new THREE.PlaneGeometry(1, 1)
const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: texture,
    transparent: true,
    aoMap: aoMap,
    alphaMap: alphaMap,
    lightMap: lightMap,
    specularMap: specularMap
})
```

**加载纹理**：使用纹理加载器加载了几种不同类型的纹理，包括：

- `texture`：主纹理，可能用作对象表面的颜色或模式。
- `aoMap`：环境遮挡贴图（Ambient Occlusion Map），用于增加阴影的细节，使物体的细节部分看起来更加真实。
- `alphaMap`：透明度贴图，定义材质的哪些部分是透明的。
- `lightMap`：光照贴图，用于模拟物体表面的光照效果。
- `specularMap`：高光贴图，定义材质的哪些部分反射更多的光线。

**环境贴图**：

1. **`scene.background = envMap;`**
   - 这行代码将环境贴图设置为整个场景的背景。这意味着当你查看场景时，不仅仅是物体使用了环境贴图，整个场景的背景也会显示为该环境贴图。这在创建沉浸式背景或天空盒效果时特别有用。
2. **`scene.environment = envMap;`**
   - 这行代码设置了整个场景的环境光照贴图。在Three.js中，这主要影响具有金属材质或粗糙度属性的物体（如使用`MeshStandardMaterial`或`MeshPhysicalMaterial`的物体），让这些物体能够反映或吸收环境光，从而实现更真实的光照效果。它对场景中的所有物体产生影响，使得物体可以根据环境贴图接收到间接的光照和反射。
3. **`planeMaterial.envMap = envMap;`**
   - 这行代码将环境贴图应用到特定物体的材质上，即在这个例子中是一个平面的材质。这使得平面材质能够反映环境中的光线和颜色，依据环境贴图产生反射。这是实现物体表面镜面反射效果的常用技术，特别适合用于模拟金属、水面或其他反光表面。

## 6.网格

网格（Mesh）扮演着非常核心的角色。网格是由顶点（Vertices）、边（Edges）、和面（Faces）组成的集合，它们共同定义了一个三维形状的几何结构。

```js
const cube = new THREE.Mesh(geometry, material)

cube.scale.set(0.5,0.5,0.5) // 调整网格对象的缩放
```

## 7.坐标辅助对象

坐标辅助对象定义了三维空间的坐标x y z

- **红色**（黄色）：X轴
- **绿色**：Y轴
- **蓝色**：Z轴

```js
const axeHelper = new THREE.AxesHelper(5)
```

## 8.轨道控制器

轨道控制器：允许用户通过鼠标和键盘操作来旋转、缩放和平移相机，从而以交互的方式查看场景中的对象。

```js
const controls = new OrbitControls(camera, renderer.domElement) // 第一个参数为要操作的相机 第二个参数为监听控制器鼠标事件的dom对象

controls.update() // 需要在每次渲染前调用以更新相机位置
```

## 9.*lil-gui*

lil-gui:创建一个可以控制图像的gui面板

```js
const gui = new GUI()
const eventObj = {
    Fullscreen: () => {
        document.body.requestFullscreen()
    },
    ExitFullscreen: () => {
        document.exitFullscreen()
    }
}
gui.add(eventObj, "Fullscreen")
gui.add(eventObj, "ExitFullscreen")
const folder = gui.addFolder("立方体位置")
folder.add(cube.position, "x", -5, 5)
folder.add(material, "wireframe").name("子元素线框模式")
folder.addColor({
    cubeColor: "#ff0000"
}, "cubeColor").name("立方体颜色").onChange(val => {
    cube.material.color.set(val)
})
```

## 10.模型加载

```js
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("./draco/")
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load("./model/Duck.glb", gltf => {
    scene.add(gltf.scene)
})
gltfLoader.load("./model/city.glb", gltf => {
    scene.add(gltf.scene)
})
const rgbeLoader = new RGBELoader()
rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", envMap => {
    envMap.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = envMap
    scene.background = envMap
})
```

## 11.光线投射实现3D物体与鼠标的交互

```js
const meshes = []
const geometry = new THREE.SphereGeometry(1, 32, 32)
const m1 = new THREE.MeshBasicMaterial({
    color: 0xFF0000
})
const m2 = new THREE.MeshBasicMaterial({
    color: 0x0000FF
})
const m3 = new THREE.MeshBasicMaterial({
    color: 0x00FF00
})
const sphere1 = new THREE.Mesh(geometry, m1)
const sphere2 = new THREE.Mesh(geometry, m2)
const sphere3 = new THREE.Mesh(geometry, m3)
sphere1.position.x = -4
sphere3.position.x = 4
meshes.push(sphere1, sphere2, sphere3)

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

window.addEventListener("click", event => {
    const clientX = event.clientX
    const clientY = event.clientY
    const innerWidth = window.innerWidth
    const innerHeight = window.innerHeight
    mouse.x = (clientX / innerWidth) * 2 - 1
    mouse.y = -(clientY / innerHeight) * 2 + 1 // y是从下到上 -1~1
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(meshes)
    intersects.length && (intersects[0].object.material.color.set(0xFFFFFF))
})
```

## 12.UV映射

UV映射（或UV展开）是3D模型纹理映射的一种技术，它允许2D图像（纹理）被精确地映射到3D对象的表面。"UV"代表纹理坐标的两个轴，其中"U"代表水平轴，"V"代表垂直轴。这种命名源自传统的"x"和"y"坐标轴，以避免与3D空间坐标（通常是X、Y和Z）混淆。

```js
const geo = new THREE.BufferGeometry()
const vertices = new Float32Array([
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0,
    1.0, 1.0, 0.0,
    -1.0, 1.0, 0
])
geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
geo.setIndex(new THREE.BufferAttribute(indices, 1))

// 设置UV
const uv = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])
geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2))
const uvTexture = new THREE.TextureLoader().load("./texture/uv_grid_opengl.jpg")
const materials = new THREE.MeshBasicMaterial({
    map: uvTexture,
})
```

## 13.法向量及法向量辅助器

```js
geo.computeVertexNormals() // 自动计算法向量

const helper = new VertexNormalsHelper(plane, 1, 0x00ff00) // 法向量辅助器
```

## 14.使用translate移动顶点

```js
geo.translate()
```

## 15.包围盒和包围盒辅助器

### 15.1常规方案获取包围盒子

```js
loaders.rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", envMap => {
    envMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = envMap
    scene.environment = envMap
})
loaders.gltfLoader.load("./model/Duck.glb", gltf => {
    scene.add(gltf.scene)
    // 获取鸭子的网格
    let duckMesh = gltf.scene.getObjectByName("LOD3spShape")
    const duckGeometry = duckMesh.geometry
    // 计算包围盒
    duckGeometry.computeBoundingBox()
    const duckBox = duckGeometry.boundingBox
    // 更新世界矩阵
    duckMesh.updateWorldMatrix(true, true)
    // 给包围盒应用世界矩阵
    duckBox.applyMatrix4(duckMesh.matrixWorld)
    // 创建包围盒辅助器
    const boxHelper = new THREE.Box3Helper(duckBox, 0xffff00)
    scene.add(boxHelper)
})
```

### 15.2使用setFromObject获取包围盒

```js
const box = new THREE.Box3().setFromObject(meshObj) // 自动更新世界矩阵并应用到包围盒然后返回该包围盒
```

## 16.线框几何体和边缘几何体

1. EdgesGeometry：仅展示边缘
2. WireframeGeometry：展示为三角形组成的线框

## 17.灯光与阴影

需要满足以下条件：

1. 材质要满足能够对光照有反应
2. 设置渲染器开启阴影的计算：`renderer.shadowMap.enabled = true`
3. 设置光照投影：`directionalLight.castShadow = true`
4. 设置物体投射阴影：`sphere.castShadow = true`
5. 设置物体接收阴影：`plane.receiveShadow = true`





