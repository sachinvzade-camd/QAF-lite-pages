var submitreport=document.getElementById('submit');
var startTime;
var endTime;
var salesOrderList;
var employeesList;
var orderItemList;
var salesSummaryList=[];
document.getElementById("startTime").addEventListener("change", function() {
    startTime =new Date( this.value);
});
document.getElementById("endTime").addEventListener("change", function() {
    endTime = new Date( this.value);
});
submitreport.addEventListener('click',getSalesOrder)

function getSalesOrder(){
    let startDate = `${startTime.getFullYear()}/${startTime.getMonth()+1}/${startTime.getDate()}`;
    let endDate = `${endTime.getFullYear()}/${endTime.getMonth()+1}/${endTime.getDate()}`;
    let objectName = "Sales_Order";
    let list = 'SalesRepresentative,Customer,DateIssued'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `DateIssued>='${startDate}'<AND>DateIssued<='${endDate}'`;
    let orderBy = "false"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((salesOrder) => {
        if (Array.isArray(salesOrder) && salesOrder.length > 0) {
            salesOrderList = salesOrder
            getOrderItem()
        } 
    });
}

function getOrderItem(){
    let parentID = salesOrderList.map(a => a.RecordID).join("'<OR>ParentID='");
    let objectName = "Order_Items";
    let list = 'ParentID,Product,Quantity,ListPrice,OfferPrice,ItemTotal'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `ParentID='${parentID}'`;
    let orderBy = "false"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((orderItem) => {
        if (Array.isArray(orderItem) && orderItem.length > 0) {
            orderItemList = orderItem
            processSalesSummary()
        } 
    });
}
function processSalesSummary(){
    let commonProductList=orderItemList.filter((v,i,a)=>a.findIndex(t=>t.Product===v.Product)===i);
    commonProductList.forEach(val=>{
        let orderItems=orderItemList.filter(order=>order.Product.split(";#")[0]===val.Product.split(";#")[0]);
        let quantity=0;
        if(orderItems&&orderItems.length>0){
            quantity=orderItems.reduce((acc, value) => acc + value, 0);
        }

        salesSummaryList.push({
            Product:val.Product.split(";#")[1]
        })
    })
    
    // salesOrderList.forEach(salesOrder => {
    //     let dateIssued=new Date(salesOrder.DateIssued)
    //     let startDate = `${dateIssued.getDate()}/${dateIssued.getMonth()+1}/${dateIssued.getFullYear()}`;
    //     let orderItems=orderItemList.filter(order=>order.ParentID===salesOrder.RecordID);
    //     if(orderItems&&orderItems.length>0){
    //         orderItems.forEach(order=>{
    //             salesSummaryList.push({
    //                 Date:startDate,
    //                 SalesRepresentative:employeeFullName,
    //                 Customer:salesOrder.Customer?salesOrder.Customer.split(";#")[1]:'',
    //                 Product:order.Product?order.Product.split(";#")[1]:'',
    //                 Quantity:order.Quantity,
    //                 ListPrice:order.ListPrice,
    //                 OfferPrice:order.OfferPrice,
    //                 ItemTotal:order.ItemTotal,
    //             })
    //         })
    //     }
    // });
    showData(salesSummaryList)
}
    function showData(salesSummaryList=[]){
    var table = new Tabulator("#example-table", {
        data:salesSummaryList,
        layout: "fitColumns",
        pagination: "local",
        paginationSize: 2,
        tooltips: true,
        placeholder:"No Record Found",
        columns: [
            {
                title: "Date",
                field: "Date",
            },
            {
                title: "User Name",
                field: "SalesRepresentative",
            },
            {
                title: "Customer Name",
                field: "Customer",
            },
            {
                title: "Item",
                field: "Product",
            },
            {
                title: "Sales Quantity",
                field: "Quantity",
            },
            {
                title: "List Price",
                field: "ListPrice",
            },
            {
                title: "Order Price",
                field: "OfferPrice",
            },
            {
                title: "Net Amount",
                field: "ItemTotal",
            },
        ],
    });
    table.on("pageSizeChanged", function(pagesize){
       
    });
    table.on("pageLoaded", function(pagesize){
       
    });
  }

  qafServiceLoadedReport = setInterval(() => {
    if (window.QafService) {
        showData()
      clearInterval(qafServiceLoadedReport);
    }
  }, 10);

  function IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }