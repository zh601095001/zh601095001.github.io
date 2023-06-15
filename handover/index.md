<div style="text-align:center;font-weight:bold">交接文档</div>

## 5.4.7

1. 商户设置->电子签章

   `/src/page/modules/sysVue/tabComponents/electronicSeal`

2. 客户详情->客户信息：添加电子签章

   `src/page/modules/customer/viewcust`

3. 供应商详情->供应商信息：添加电子签章

   `src/page/modules/biz/vendorPurchaseMgt.vue`

4. 客户供应商实名信息及列表图标

   `src/js/modules/settleAccount/paging.js`

   ```js
   function showIdent(rowdata, type) {...}
   ```

## 5.5.0

1. 单据详情页面，产品，增加按产品排序的方式

   `src/components/productSort.vue`

   ```js
   // easygrid事件绑定
   table.on('click', '#' + table.attr('id') + 'nameSort', function (e) {...}
   
   // easygrid表头渲染
               {
                   text: (function () {
                       let prodName = '';
                       let sortName;
                       const sortNameMap = {
                           'prodName': 'sortByProductName',
                           'prodSequence': 'sortByProductNo',
                           'prodType': 'sortByProductType',
                       };
                       ...
                 }
   ```

2. 单据草稿状态：增加删除权限

   `data-btn="biz:sales:draft:delete:own"`
   
3. 熊猫皮肤（新增）

## 5.5.1

1. 列表替换（html->vue & mzgrid -> jqx）

   |    列表    |                 描述                  |
   | :--------: | :-----------------------------------: |
   |  客户列表  |              mzgrid->jqx              |
   | 出库单列表 | src/page/modules/yuncangin/index.vue  |
   | 入库单列表 | src/page/modules/yuncangout/index.vue |
   | 加工单列表 |              mzgrid->jqx              |
   | 调拨单列表 |              mzgrid->jqx              |
   | 退货单列表 |              mzgrid->jqx              |
   |  审批列表  |              mzgrid->jqx              |

## 5.5.2

1. 归档

   `src/page/modules/sysVue/archive/newArchive/archiveByTime` 按时间归档入口

   `src/page/modules/sysVue/archive/newArchive/search/time.vue` 按时间归档搜索条件

   `src/store/modules/archive/initalData/archiveByTime.js` 按时间归档初始化数据

2. 单据列表、详情（销售单、采购单、采购申请单、退货单、加工单、费用收入单、收款单、付款单、收货单、送货单、调拨单），客户的销售记录、资金往来列表，供应商的采购记录、资金往来列表，加上检/查/结/归

   `src/js/modules/settleAccount/paging.js`

   ```js
   function showIdent(rowdata, type) {...}
   ```

3. 客户/供应商列表、详情加上检/查/结/归；客户/供应商列表部分按钮隐藏

   产品列表、详情、库存加上检/查/结/归；产品列表部分按钮隐藏

   存在归、查标识的客户、供应商，不能继续开单，不在单据中的客户、供应商下拉列表中显示

   `src/js/acFrame/power.js`(按钮隐藏逻辑):

   ```js
   powerStatus.prototype.archivedLogic = function(json,parent) {...}
   ```

   `src/js/modules/settleAccount/paging.js`(检/查/结/归图标)：

   ```js
   function showIdent(rowdata, type) {...}
   ```

4. 销售单、采购单、采购申请单、退货单、加工单、费用收入单、收款单、付款单、收货单、送货单、调拨单、客户详情（销售记录、资金往来）、供应商详情（采购记录、资金往来）、客户/供应商、产品、库存、报表的列表搜索增加“已归档”选项以及客户、供应商、产品下拉框的修改

   - 归档传参(全局搜索)

     ```js
     /$("#.*?-archive").prop("checked")/g
     ```

   - 归档选择框添加

     ```json
     [
         {
         name: "search-other",
         html: `
             <div class="">
                 <label class="control-label col-sm-3 en-left-label"></label>
                 <div class="col-sm-8 priseInfoFlag">
                     <span class="span_check" style="top: 7px">
                         <input id=".*-archive" type="checkbox" class="input_check">
                         <label for></label>
                     </span>
                     <label class>${$.i18n.prop("settings.archive")}</label>
                 </div>
             </div>
             `,
     	}
     ]
     ```

   - 点击归档选择框切换输入框下拉框事件

     ```js
     $("#.*-archive").off("click").on("click",function () {
     	vm.archiveFlag = $('#.*-archive').prop("checked");
     });
     ```

   - 输入框下拉框切换全局函数

     `src/js/acFrame/acFrame.js`

     ```js
     changeInput(flag, id, settings,callback = () => undefined) {...}
     ```

5. 结账模块

   <div>
       <img src="https://typro-zh.oss-cn-shanghai.aliyuncs.com/imgs/image-20230602101248190.png">
       <img src="https://typro-zh.oss-cn-shanghai.aliyuncs.com/imgs/image-20230602101400369.png">
   </div>

6. 存储空间

   > src/components/storage
   >
   > > src/components/storage/api.js ==api对接==
   > >
   > > src/components/storage/modal.vue ==弹框逻辑==
   > >
   > > src/components/storage/modals.js ==空间不足提醒弹框==
   > >
   > > src/components/storage/storage.vue ==空间占用弹框==
   > >
   > > src/components/storage/utils.js ==存储空间占用图、弹框函数==

7. 所有报表html->vue替换

8. 商户设置替换

   辅助资料—产品分类

   辅助资料—多价位

   分店设置

   电子签章

   结账
   
9. 报表归档按钮添加、输入框切换、链接跳转修改情况

   |     报表名     |                      路径                       | 搜索（a归档按钮、p产品切换、c客户名切换） |        跳转修改        | 特殊跳转修改 |
   | :------------: | :---------------------------------------------: | :---------------------------------------: | :--------------------: | ------------ |
   |   进销存报表   |      /page/modules/equipment/psiReport.vue      |                    ap                     |           -            |              |
   |   净利润报表   |    /page/modules/equipment/profitReport.vue     |                     a                     |           -            |              |
   |    收支年报    |   /page/modules/equipment/inOutYearReport.vue   |                     -                     |           -            |              |
   |   资金流水表   |     /page/modules/equipment/capitalFlow.vue     |                    ac                     |          yes           |              |
   |   资金收入表   |     /page/modules/equipment/assetIncome.vue     |                    ac                     |          yes           |              |
   |   资金支出表   |     /page/modules/equipment/assetExpend.vue     |                    ac                     |          yes           |              |
   | 销售欠款汇总表 |     /page/modules/equipment/saleDebtSum.vue     |                    ac                     |           -            |              |
   |  采购付款汇总  |   /page/modules/equipment/purchasePaySum.vue    |                    ac                     |           -            |              |
   |  客户销售明细  |     /page/modules/equipment/custSaleDet.vue     |                    acp                    |           -            |              |
   | 供应商采购明细 |  /page/modules/equipment/vendorPurchaseDet.vue  |                    acp                    |           -            |              |
   |    销售流水    |      /page/modules/equipment/saleFlow.vue       |                    acp                    |          yes           |              |
   |    采购流水    |    /page/modules/equipment/purchaseFlow.vue     |                    acp                    |          yes           |              |
   |    加工流水    |     /page/modules/equipment/processFlow.vue     |                    acp                    |          yes           |              |
   |    销售业绩    |     /page/modules/equipment/saleResult.vue      |                     a                     |           -            |              |
   |   送货提醒表   |       /page/modules/equipment/sendDet.vue       |                    acp                    |          yes           |              |
   |   收货提醒表   |     /page/modules/equipment/receiveDet.vue      |                    acp                    |          yes           |              |
   |  产品销售总览  | /page/modules/equipment/productSaleOverview.vue |                    acp                    |           -            |              |
   |   送货明细表   |      /page/modules/equipment/delivery.vue       |                    acp                    |          yes           |              |
   |   收货明细表   |      /page/modules/equipment/receiving.vue      |                    acp                    |          yes           |              |
   |   客户对账单   |    /page/modules/equipment/customerbill.vue     |                    acp                    |          yes           |              |
   |  供应商对账单  |     /page/modules/equipment/vendorbill.vue      |                    acp                    |          yes           |              |
   |   销售退货单   |     /page/modules/equipment/salereturn.vue      |                    acp                    |          yes           |              |
   |   采购退货单   |      /page/modules/equipment/buyreturn.vue      |                    acp                    |          yes           |              |
   | 云店产品分析表 |  /page/modules/equipment/cloudShopProduct.vue   |                    acp                    |          yes           |              |
   | 采购申请流水表 |  /page/modules/equipment/purchaseApplyFlow.vue  |                    ap                     |          yes           |              |
   | 分店申请流水表 |  /page/modules/equipment/purchaseApplyFlow.vue  |          ==同  采购申请流水表==           | ==同  采购申请流水表== |              |
   |   客户分析表   |  /page/modules/equipment/customerAnalysis.vue   |                    ac                     |           -            |              |
   |   云仓费用表   |   /page/modules/equipment/wmsCost/wmsCost.vue   |                    ap                     |           -            |              |

10. 秒账-出入库单打印

   云仓出入库单-增加‘打印功能’、详情添加水印和对应打印按钮
