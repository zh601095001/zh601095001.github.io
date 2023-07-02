# VASP输入参数

## 初始化参数（I/O) 

---

```vasp
SYMTEM = MoS2
KPAR = 4 # 表面计算一般不用  
NCORE = 4 # 每个轨道计算所使用核数
ISTART = 1 # 是否读取WAVECAR
ICHARG = 1 # 决定vasp如何构建初始电荷密度
LWAVE = .TRUE. # 是否输出WAVECAR
LCHARG = .TRUE. # 是否输出电荷密度（CHGCAR和CHG）
LVTOT = .FALSE. # 是否将总局域电荷密度写入LOCPOT
LVHAR = .FALSE. # 是否将静电势写入LOCPOT
LELF = .FALSE. # 是否输出ELFCAR
# LORBIT = 11 # 是否输出PROCAR/PROOUT
```

## 电子步

---

```vasp
ENCUT = 500 # 平面波基组截断能，单位：eV
ISMEAR = 0 # 决定每个轨道的粒子占据情况
SIGMA = 0.05 # 展宽，单位：eV
EDIFF = 1E-6 # 全局电子自洽收敛标准，结构优化和MD使用1E-5,过渡态/频率使用1E-6或-7
NELMIN = 5 # 电子自洽循环的最小步数
# NELMDL = xxx # 非自洽步数，建议默认值，难收敛体系取-20
NELM = 300 # 电子自洽循环的最大步数
GGA = PE # 广义梯度近似的类型
LREAL = .FALSE. # 决定是在实空间还是在倒数空间中评估投影算子，材料计算.FALSE.,表面计算.Auto.
# NGX,NGY,NGZ,NGXF,NGYF,NGZF = 默认值
# 在计算表面功函数时LDIPOL = .TRUE. 和IDIPOL = 3 需要打开！
# LDIPOL = .TRUE.
# IDIPOL = 3 # 添加偶极校正,1/2/3分别代表在x、y、z方向做偶极校正，4代表全方向
# ISYM = 0 # 是否考虑体系对称性，表面计算选择0，杂化泛函选择3
# SYMPREC = 默认
# ALGO = FAST # 电子最小化算法/GW算法选择
# IALGO = 默认
# PREC = Accurate # 计算精度
# ADDGRID = .TRUE. # whether an additional support grid is used for the evaluation of the augmentation charges,电子结构高精度时启用
# AMIX = 0.2
# BMIX = 0.0001
# AMIX_MAG = 0.8
# BMIX_MAG = 0.0001
# MAXMIX = 40
```

## 磁性相关参数

```VASP
# ISPIN = 1
# MAGMOM = n*5
# NUPDOWN = 0
# VOSKOWN = 1
```

## 结构优化

```vasp
EDIFFG = -0.01 # 离子步收敛条件（晶胞优化<-0.01，结构优化-0.02,过渡态-0.02（<-0.05））
IBRION = 2 # 离子步更新和移动的方式,MD为0
POTIM = 0.2 # 每步离子移动宽度（离子弛豫）（频率计算取0.015）/时间步长（分子动力学）
NSW = 300 # 允许的最大离子步，加了范德华校正时建议设置500+
ISIF = 3 # 决定计算哪些力以及晶胞和原子坐标是否可以改变，晶胞优化3，结构优化2，MD 0，E-V曲线拟合4，二维材料通常使用3
# NFREE = 2 # 频率计算2，弹性常数2或4
```

## DFT +U

```
# LDAU = .TRUE. # 开启DFT+U
# LDAUTYPE = 2 # +U方法
# LDAUL = 2 -1 -1 -1 -1 # +U角动量，-1，0，1，2，3分别代表不加，s，p，d，f轨道
# LDAUU = 4.6 0.0 0.0 0.0 0.0 # U值（一一对应每个元素）
# LDAUJ = 0.4 0.0 0.0 0.0 0.0 # J值
# LDAUALPHA = 0.0 0.5 # 输出详细程度
# LDAUPRINT = 2 # 控制输出的详细程度，为0时可以避免过大的OUTCAR
# LMAXMIX = 4 # 对d轨道混合电荷密度以加速收敛，d区设置为4，f区设置为6
```

---

---

## 各种泛函使用说明

### LDA泛函

```
不写GGA
POTCAR使用LDA
```

### GGA泛函

```
GGA = 91 | PE | RP | PS | AM
# 分别代表PW91 PBE RPBE revPBE PBEsol AM05
```

### Meta-GGA泛函

```
METAGGA = TPSS | RTPSS | M06L | MBJL | SCAN | MS0 | MS1 | MS2
```

### 杂化泛函

#### I/O

```
SYMTEM = xxx
KPAR = 4
NCORE = 5
ISTART = 1
ICHARG = 1
LWAVE = .T.
LCHARG = .T.
LVTOT = .F.
LVHAR = .T.
LELF = .F.
LORBIT = 11
NEDOS = 1000
```

#### SCF

```
ENCUT = 500
ISMEAR = 0
SIGMA = 0.05
EDIFF = 1E-6
NELMIN = 5
NELM = 300
GGA = PE
LREAL = .F.
PREC = Accurate
ISYM = 3
```

#### Geo Opt

```
EDIFFG = -0.01
IBRION = 2
POTIM = 0.2
NSW = 0
ISIF = 3
```

#### HSE

```
LHFCALC = .T.
AEXX = 0.25
HFSCREEN = 0.2
ALGO = ALL | Damped
TIME = 0.4
```

---

## 范德华校正

```
IVDW = 11 # DFT-D3
IVDW = 12 # DFT-D3BJ
# 注：PBE RPBE revPBE PBEsol不许需要指定额外的参数，都已经内置于程序中
```

![vdW-DF](https://typro-zh.oss-cn-shanghai.aliyuncs.com/imgs/vdW-DF.png)

---

## VASP编译

[http://sobereva.com/455/](http://sobereva.com/455/)

[https://www.bilibili.com/video/av39616222/](https://www.bilibili.com/video/av39616222/)

[https://www.bilibili.com/video/av33956717/](https://www.bilibili.com/video/av33956717/)

```
常见插件：VTST OPTCELL VASPSOL NBO/SSADNDP Wannier90
```

## DOS图

> 平缓：相互作用强，对应能带能量跨度大
>
> 窄陡：相互作用弱，对应能带平缓
>
> dos图宽度：展宽
>
> 获取NBANDS：`grep NBANDS OUTCAR`
>
> ​						  当需要计算能量更高的轨道时，可在此基础上提高NBANDS
>
> ​						  光学性质计算需要翻2~3倍

```
NSW = 0
ICHARG = 1 
LORBIT = 11 # 10只区分角量子数(s,p,d...),11区分角量子数和磁量子数
NEDOS = INT # 用于控制DOSCAR输出图的取点密度，建议值为1000，若毛刺多，则增加KPOINTS或使用ISMEAR=0
EMAX,EMIN = default # 控制输出DOS数据的能量取值范围
ISMEAR = -5 # 适用于半导体和绝缘体,金属建议>=0
```

## SOC计算流程

```
正常结构优化-->scf_SOC-->band_SOC


1.struct
>>>>INCAR<<<<
SYSTEM = ZrB2
 ISTART = 0
 ICHARG = 2
 ISIF = 3
 NSW = 500
 IBRION = 2
 ENCUT = 300
 POTIM = 0.5
 EDIFF = 1E-5
 ISMEAR = 0
 SIGMA = 0.2
 PREC = Accurate
 LWAVE = .FALSE.
 LCHARG = .FALSE.
 NPAR = 4
 >>>>><<<<<
 >>>>KPOINTS<<<<
 ...
 6 6 6
 >>>><<<<
 
 
 2.scf_SOC
 复制上一步的CONTCAR为POSCAR
 复制上一步的IBZKPT为KPOINTS  # 保持k点一致
 >>>>>INCAR<<<<<
  SYSTEM = ZrB2
 ISTART = 0
 ICHARG = 2
 NSW = 0
 ENCUT = 300
 IBRION = 2
 ISIF = 2
 ISMEAR = 0
 SIGMA = 0.2
 NEDOS = 1601
 POTIM = 0.5
 EDIFF = 1E-7
 #LREAL=.TRUE.
 PREC = Accurate
 LORBIT = 11
 NPAR = 4
 ISYM = 0    #对称性开关
 GGA_COMPAT = .FALSE.
 ISPIN = 2   #打开自旋
 MAGMOM = 1 1 0 1 1 0 1 1 0 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 #设置初始磁矩
 LSORBIT = .TRUE.  #打开SOC
 LNONCOLLINEAR= .TRUE.   
 SAXIS = 0 0 1   
 LMAXMIX = 4    # f元素改为6，d为4，
 VOSKOWN = 1
 NELM = 200
 >>>>><<<<<
 
 
 3.band
 复制上一步的POSCAR
 >>>INCAR<<<
  SYSTEM = ZrB2
 ISTART = 0
 ICHARG = 2
 NSW = 0
 ENCUT = 300
 IBRION = 2
 ISIF = 2
 ISMEAR = 0
 SIGMA = 0.2
 NBANDS = 96
# NEDOS = 1601
 POTIM = 0.5
 EDIFF = 1E-7
 #LREAL=.TRUE.
 PREC = Accurate
 LORBIT = 11
 NPAR = 4
 ISYM = 0
 GGA_COMPAT = .FALSE.
 ISPIN = 2
 MAGMOM = 1 1 0 1 1 0 1 1 0 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
 LSORBIT = .TRUE.
 LNONCOLLINEAR= .TRUE.
 SAXIS = 0 0 1
 LMAXMIX = 4
 VOSKOWN = 1
 NELM = 200
 >>>>><<<<<
```

