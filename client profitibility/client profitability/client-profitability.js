var guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/g;
var Employee = [];
var revenueDetailsList=[]
var clientAllocationMatrixList=[]
var expenseClaim_Data;
var currentDate = new Date();
var FirstDay;
var LastDay;
var clientProfibility={
    NameOfClient:0,
    BillingAmount:0,
    AccountManagerCost:0,
    AccountManagerPercentage:0,
    TLCost:0,
    TLCostPercentage:0,
    TotalResourceCost:0,
    TotalResourceCostPercentage:0,
    Profibility:0,
    TotalSalesContribution:0
}
var clientProfibilityList=[]

qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        let mainGridElement = document.getElementById('main-grid');
        let noGridElement = document.getElementById('no-grid');
        if (mainGridElement) {
            mainGridElement.style.display = 'block'
        }
        if (noGridElement) {
            noGridElement.style.display = "none"
        }
        getRevenueDetails();
        clearInterval(qafServiceLoaded);
    }
}, 10);

function addRevenue() {
    if (window.QafPageService) {
        window.QafPageService.AddItem(expenseGrid.repository, function () {
            loadCustomerRevenue();
        });
    }
}

var expenseGrid = {
    repository: 'Customer_Revenue_Details',
    columns: [
        { field: 'NameOfClient', displayName: 'Name of Client', sorting: false },
        { field: 'BillingAmount', displayName: 'Billing Amount', sorting: false },
        { field: 'AccountManagerCost', displayName: 'Account Manager Cost', sorting: false },
        { field: 'AccountManagerPercentage', displayName: '% of Revenue', sorting: false },
        { field: 'TLCost', displayName: 'TL Cost', sorting: false },
        { field: 'TLCostPercentage', displayName: '% of Revenue', sorting: false },
        { field: 'TotalResourceCost', displayName: 'Total Resource Cost', sorting: false },
        { field: 'TotalResourceCostPercentage', displayName: '% of Total Revenue', sorting: false },
        { field: 'Profibility', displayName: 'Profitability in Value', sorting: false },
        { field: 'TotalSalesContribution', displayName: '% Contribution to Total Sales', sorting: false },

    ],
    viewFields: ["NameOfClient", "BillingAmount", "AccountManagerCost", "AccountManagerPercentage", "TLCost", "TLCostPercentage", "TotalResourceCost","TotalResourceCostPercentage","Profibility","TotalSalesContribution"],
    page: 1,
    pageSize: 10,
    dateFormat: 'YYYY/MM/DD',
    currentSelectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    filter: ""
}

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var gridExpenseColumns =  [
    { field: 'NameOfClient', displayName: 'Name of Client', sorting: false },
    { field: 'BillingAmount', displayName: 'Billing Amount', sorting: false },
    { field: 'AccountManagerCost', displayName: 'Account Manager Cost', sorting: false },
    { field: 'AccountManagerPercentage', displayName: '% of Revenue', sorting: false },
    { field: 'TLCost', displayName: 'TL Cost', sorting: false },
    { field: 'TLCostPercentage', displayName: '% of Revenue', sorting: false },
    { field: 'TotalResourceCost', displayName: 'Total Resource Cost', sorting: false },
    { field: 'TotalResourceCostPercentage', displayName: '% of Total Revenue', sorting: false },
    { field: 'Profibility', displayName: 'Profitability in Value', sorting: false },
    { field: 'TotalSalesContribution', displayName: '% Contribution to Total Sales', sorting: false },

];



function getRevenueDetails() {
    let mainGridElement = document.getElementById('main-grid');
            let noGridElement = document.getElementById('no-grid');
            if (mainGridElement) {
                mainGridElement.style.display = 'block'
            }
            if (noGridElement) {
                noGridElement.style.display = "none"
            }
    revenueDetailsList = []
    let objectName = "Customer_Revenue_Details";
    let list = 'RecordID,Name,ProductOffering,BillingAmount';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = ``;
    let orderBy = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((revenues) => {
        if (Array.isArray(revenues) && revenues.length >0) {
            revenueDetailsList = revenues;
            getClientAllocationMatrix()
        }else{
            let mainGridElement = document.getElementById('main-grid');
            let noGridElement = document.getElementById('no-grid');
            if (mainGridElement) {
                mainGridElement.style.display = 'none'
            }
            if (noGridElement) {
                noGridElement.style.display = "block"
            }
            
        }
    });
}
function getClientAllocationMatrix() {
    clientAllocationMatrixList = []
    let objectName = "Client_Allocation_Matrix";
    let list = 'RecordID,Customer,ProductOffering,Employee,NumberofHours,HourlyRate';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = ``;
    let orderBy = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((matrixs) => {
        if (Array.isArray(matrixs) && matrixs.length > 0) {
            clientAllocationMatrixList = matrixs;
            getCommonCustomer()
        }else{
            let mainGridElement = document.getElementById('main-grid');
            let noGridElement = document.getElementById('no-grid');
            if (mainGridElement) {
                mainGridElement.style.display = 'none'
            }
            if (noGridElement) {
                noGridElement.style.display = "block"
            }
            
        }
    });
}
function getCommonCustomer(){
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
    expenseGridElement.show = true;
    let totalRevenueAmount=revenueDetailsList.reduce((acc, value) => acc + Number(value.BillingAmount), 0);

    let commonCustomer=revenueDetailsList.filter((v,i,a)=>a.findIndex(t=>t.Name===v.Name)===i);
    if(commonCustomer&&commonCustomer.length>0){
        commonCustomer.forEach(val=>{
            clientProfibility={
                NameOfClient:0,
                BillingAmount:0,
                AccountManagerCost:0,
                AccountManagerPercentage:0,
                TLCost:0,
                TLCostPercentage:0,
                TotalResourceCost:0,
                TotalResourceCostPercentage:0,
                Profibility:0,
                TotalSalesContribution:0
            }
            if(val.Name){
                let customer=revenueDetailsList.filter(a=>a.Name===val.Name);
                let amount=customer.reduce((acc, value) => acc + Number(value.BillingAmount), 0);
                clientProfibility.NameOfClient=val.Name.split(";#")[1];
                clientProfibility.BillingAmount=amount;

                let accountManagers=customer.filter(a=>a.ProductOffering.includes('Account Manager'))
                let accountManagersmatrix=clientAllocationMatrixList.filter(a=>a.ProductOffering.includes('Account Manager')&&a.Customer===val.Name)
                if(accountManagers&&accountManagers.length>0){
                    let accountManagerCost=0;
                    accountManagersmatrix.forEach(mtx=>{
                        accountManagerCost+=mtx.NumberofHours*mtx.HourlyRate
                    })
                    clientProfibility.AccountManagerCost=parseFloat((accountManagerCost).toFixed(2));
                    clientProfibility.AccountManagerPercentage= parseFloat(((clientProfibility.AccountManagerCost/clientProfibility.BillingAmount)*100).toFixed(2));
                }

                let teamLeads=customer.filter(a=>a.ProductOffering.includes('Team Lead')||a.ProductOffering.includes('TL'))
                let teamLeadsmatrix=clientAllocationMatrixList.filter(a=>(a.ProductOffering.includes('Team Lead')||a.ProductOffering.includes('TL'))&&a.Customer===val.Name)
                if(teamLeads&&teamLeads.length>0){
                    // let teamLeadsCost=teamLeads.reduce((acc, value) => acc + Number(value.BillingAmount), 0);
                    let teamLeadsCost=0;
                    teamLeadsmatrix.forEach(mtx=>{
                        teamLeadsCost+=mtx.NumberofHours*mtx.HourlyRate
                    })
                    clientProfibility.TLCost=parseFloat((teamLeadsCost).toFixed(2));;
                    clientProfibility.TLCostPercentage= parseFloat(((clientProfibility.TLCost/clientProfibility.BillingAmount)*100).toFixed(2));
                }

                clientProfibility.TotalResourceCost=clientProfibility.AccountManagerCost+clientProfibility.TLCost
                clientProfibility.TotalResourceCostPercentage= parseFloat(((clientProfibility.TotalResourceCost/clientProfibility.BillingAmount)*100).toFixed(2));

                clientProfibility.Profibility=clientProfibility.BillingAmount-clientProfibility.TotalResourceCost;
                clientProfibility.TotalSalesContribution=((clientProfibility.BillingAmount/totalRevenueAmount)*100).toFixed(2);

                clientProfibilityList.push(clientProfibility)
            }
        })
  
        expenseGridElement.Data = clientProfibilityList;
        expenseGridElement.show = false;
        }
    }
}


function updateMonthElement() {
    let currentDate = expenseGrid.currentSelectedDate;
    let currentMonthYear = `${monthNames[currentDate.getMonth()]}-${currentDate.getFullYear()}`;
    if (currentMonthYear) {
        let ele = document.querySelector('.expense-current-month');
        if (ele) {
            document.querySelector('.expense-current-month').innerText = currentMonthYear;
        }
    }
}

function getCurrentUserGuid() {

    let guid = '';
    let userKey = window.localStorage.getItem('user_key');
    if (userKey) {
        let user = JSON.parse(userKey);
        if (user.value) {
            guid = user.value.EmployeeGUID;
        }
    }
    return guid;
}

function startDate() {
    var currentDate = expenseGrid.currentSelectedDate;
    var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return firstDay;
}

function endDate() {
    var currentDate = expenseGrid.currentSelectedDate;
    var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return lastDay;
}



function pageSizeEvent(page) {
    expenseGrid.pageSize = page.detail.pageSize;
    loadCustomerRevenue();
}



function GetWhereClause() {
    let userId = getCurrentUserGuid();
    let whereClause = ``;
    return whereClause;
}

function loadCustomerRevenue() {
    let mainGridElement = document.getElementById('main-grid');
    let noGridElement = document.getElementById('no-grid');
    if (mainGridElement) {
        mainGridElement.style.display = 'block'
    }
    if (noGridElement) {
        noGridElement.style.display = "none"
    }

    let recordForField
    // let whereClause="";
    let whereClause = GetWhereClause();
    console.log("whereClause: ", whereClause);
    recordForField = {
        Tod: expenseGrid.repository,
        Ldft: expenseGrid.viewFields.join(','),
        Ybod: expenseGrid.orderBy,
        Ucwr: whereClause,
        Zps: expenseGrid.pageSize,
        Rmgp: expenseGrid.page,
        Diac: "false",
    }
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        expenseGridElement.show = true;
        window.QafService.Rfdf(recordForField).then((expenseClaim) => {
            expenseGridElement.show = false;
            if (Array.isArray(expenseClaim) && expenseClaim.length > 0) {
                expenseClaim_Data = expenseClaim
                expenseGridElement.Data = expenseClaim;
                expenseGridElement.show = false;
                updateMonthElement();
            }
            else {
                let mainGridElement = document.getElementById('main-grid');
                let noGridElement = document.getElementById('no-grid');
                if (mainGridElement) {
                    mainGridElement.style.display = 'none'
                }
                if (noGridElement) {
                    noGridElement.style.display = "block"
                }
            }
        }, (error) => {
            expenseGridElement.show = false;
        }

        ).catch((error) => {
            console.log(error);
        });
        expenseGridElement.addEventListener('onNextPageEvent', nextPageEvent);
        expenseGridElement.addEventListener('onPrevPageEvent', prevPageEvent);
        expenseGridElement.addEventListener('onGridSortEvent', sortEvent);
        expenseGridElement.addEventListener('onPageSizeEvent', pageSizeEvent);
    }
    expenseGridElement.Data = ''
    expenseGridElement.show = false;
}

function nextPageEvent(page) {
    let recordForField
    let whereClause = GetWhereClause();
    recordForField = {
        Tod: expenseGrid.repository,
        Ldft: expenseGrid.viewFields.join(','),
        Ybod: expenseGrid.orderBy,
        Ucwr: whereClause,
        Zps: expenseGrid.pageSize,
        Rmgp: page.detail.currentPage,
        Diac: "false",
    }
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        expenseGridElement.show = true;
        window.QafService.Rfdf(recordForField).then((expenseClaim) => {
            expenseGridElement.show = false;

            if (Array.isArray(expenseClaim) && expenseClaim.length > 0) {
                expenseClaim_Data = expenseClaim
                expenseGridElement.Data = expenseClaim;
                expenseGridElement.show = false;
                updateMonthElement();
            }
        });
    }
    expenseGridElement.Data = ''
    expenseGridElement.show = false;
}

function prevPageEvent(page) {
    let recordForField
    let whereClause = GetWhereClause();
    recordForField = {
        Tod: expenseGrid.repository,
        Ldft: expenseGrid.viewFields.join(','),
        Ybod: expenseGrid.orderBy,
        Ucwr: whereClause,
        Zps: expenseGrid.pageSize,
        Rmgp: page.detail.currentPage,
        Diac: "false",
    }
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        expenseGridElement.show = true;
        window.QafService.Rfdf(recordForField).then((expenseClaim) => {
            expenseGridElement.show = false;

            if (Array.isArray(expenseClaim) && expenseClaim.length > 0) {
                expenseClaim_Data = expenseClaim
                expenseGridElement.Data = expenseClaim;
                expenseGridElement.show = false;
                updateMonthElement();
            }
        });
    }
    expenseGridElement.Data = ''
    expenseGridElement.show = false;
}

function sortEvent(page) {
    let recordForField
    let whereClause = GetWhereClause();
    recordForField = {
        Tod: expenseGrid.repository,
        Ldft: expenseGrid.viewFields.join(','),
        Ybod: expenseGrid.orderBy,
        Ucwr: whereClause,
        Zps: expenseGrid.pageSize,
        Rmgp: expenseGrid.page,
        Diac: "false",
    }
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        expenseGridElement.show = true;
        window.QafService.Rfdf(recordForField).then((expenseClaim) => {
            expenseGridElement.show = false;
            if (Array.isArray(expenseClaim) && expenseClaim.length > 0) {
                expenseClaim_Data = expenseClaim
                expenseGridElement.Data = expenseClaim;
                expenseGridElement.show = false;
                updateMonthElement();
            }
        });
    }
    expenseGridElement.Data = ''
    expenseGridElement.show = false;
}


function nextMonth(e) {
    //Get grid by id
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        if (window.QafService) {
            expenseGrid.currentSelectedDate.setMonth(expenseGrid.currentSelectedDate.getMonth() + 1);
            expenseGridElement.show = true;
            updateMonthElement();
            let recordForField
            let whereClause = GetWhereClause();
            recordForField = {
                Tod: expenseGrid.repository,
                Ldft: expenseGrid.viewFields.join(','),
                Ybod: expenseGrid.orderBy,
                Ucwr: whereClause,
                Zps: expenseGrid.pageSize,
                Rmgp: expenseGrid.page,
                Diac: "false",
            }

            window.QafService.Rfdf(recordForField).then((expenseClaim) => {
                expenseGridElement.show = false;

                if (Array.isArray(expenseClaim) && expenseClaim.length > 0) {
                    expenseClaim_Data = expenseClaim
                    expenseGridElement.Data = expenseClaim;
                    expenseGridElement.show = false;
                    updateMonthElement();
                }
            });
        }
    }
    expenseGridElement.Data = ''
    expenseGridElement.show = false;
}

function prevMonth(e) {
    //Get grid by id
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        if (window.QafService) {
            expenseGrid.currentSelectedDate.setMonth(expenseGrid.currentSelectedDate.getMonth() - 1);
            expenseGridElement.show = true;
            updateMonthElement();

            let recordForField
            let whereClause = GetWhereClause();
            recordForField = {
                Tod: expenseGrid.repository,
                Ldft: expenseGrid.viewFields.join(','),
                Ybod: expenseGrid.orderBy,
                Ucwr: whereClause,
                Zps: expenseGrid.pageSize,
                Rmgp: expenseGrid.page,
                Diac: "false",
            }

            window.QafService.Rfdf(recordForField).then((expenseClaim) => {
                expenseGridElement.show = false;

                if (Array.isArray(expenseClaim) && expenseClaim.length > 0) {
                    expenseClaim_Data = expenseClaim
                    expenseGridElement.Data = expenseClaim;
                    expenseGridElement.show = false;
                    updateMonthElement();
                }
            });
        }
    }
    expenseGridElement.Data = ''
    expenseGridElement.show = false;
}

function expgrid_onItemRender(cname, cvalue, row) {
    
    if (cname === 'NameOfClient'||cname === 'ProductOffering') {
        if (cvalue) {
            return `${cvalue}
                       <style> 
                       .qaf-grid:hover::-webkit-scrollbar {
  width: 10px;
  height: 13px;
}

.qaf-grid::-webkit-scrollbar {
  width: 10px;
  height: 13px;
}

.qaf-grid::-webkit-scrollbar-thumb {
  background-color: transparent;
    border-radius: 4px;

}

.qaf-grid:hover::-webkit-scrollbar-thumb {
  background-color: darkgray;
    border-radius: 4px;

}

                       
                            .qaf-grid__row:hover {
                            background-color: #fff !important;
                            }
.qaf-grid__row-item_action{
                        display:none
                    }
                            .qaf-grid__footer {
                            border-top: 1px solid rgba(0, 0, 0, 0.12);
                            background-color: #ffffff;
                            }
                            .qaf-grid {
                            border: none;
                            box-shadow: 1px 2px 5px;
                            }
                            .qaf-grid__header {
                            background-color: #f2f2f2;
                            border-bottom: 1px solid rgba(0, 0, 0, 0.12);
                            font-size: 13px;
                            font-weight: 500 !important;
                            }
                            .qaf-grid__row {
                            font-size: 12px;
                            font-weight: 500;
                            background-color: #fff;
                            }

                            .qaf-grid__header-item {
                            font-weight: 500 !important;
                            font-size: 13px;
                            }

                            .qaf-grid-page-size label {
                            font-weight: 500;
                            }
                            .qaf-grid-page-size select {
                            background-color: #fff;
                            color: #333;
                            }
                            .qaf-grid__footer > button {
                            background-color: #fff;
                            }
                            .qaf-grid__footer > button > svg {
                            fill: #333;
                            }
                            .qaf-grid__row-item a {
                            color: #009ce7;
                            text-decoration: none;
                            }
                            .qaf-loader-container{
                          display:none !important;
                          }
                          .qaf-loader{
                                border: 5px solid transparent !important;
                              }
                                .qaf-grid__row-item > a {
                            color: #009ce7;
                            text-decoration: none;
                            cursor:pointer;
                        }
                              .pg-content{
                      padding-top: 40px !important;
                        }
.qaf-grid__header{
    width:154%;
    }
    .qaf-grid__row{
    width:154%;
    }
    .qaf-grid{
            overflow-y:scroll
    }
            .qaf-grid__footer{
            width:151%;
            }
                      </style>`;
        }
        else {
            return `    <style>
        
                    .qaf-grid__row:hover {
                    background-color: #fff !important;
                    }

                    .qaf-grid__footer {
                    border-top: 1px solid rgba(0, 0, 0, 0.12);
                    background-color: #ffffff;
                    }
                    .qaf-grid {
                    border: none;
                    box-shadow: 1px 2px 5px;
                    }
                    .qaf-grid__header {
                    background-color: #f2f2f2;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
                    font-size: 13px;
                    font-weight: 500 !important;
                    }
                    .qaf-grid__row {
                    font-size: 12px;
                    font-weight: 500;
                    background-color: #fff;
                    }

                    .qaf-grid__header-item {
                    font-weight: 500 !important;
                    font-size: 13px;
                    }

                    .qaf-grid-page-size label {
                    font-weight: 500;
                    }
                    .qaf-grid-page-size select {
                    background-color: #fff;
                    color: #333;
                    }
                    .qaf-grid__footer > button {
                    background-color: #fff;
                    }
                    .qaf-grid__footer > button > svg {
                    fill: #333;
                    }
                    .qaf-grid__row-item a {
                            color: #009ce7;
                            text-decoration: none;
                            }
                            .qaf-loader-container{
                          display:none !important;
                          }
                          .qaf-loader{
                                border: 5px solid transparent !important;
                              }
                                .qaf-grid__row-item > a {
                            color: #009ce7;
                            text-decoration: none;
                            cursor:pointer;
                        }
                        .pg-content{
                      padding-top: 40px !important;
                        }
                      .btn-revenue{
                      font-size: 12px!important;
    padding: 5px 10px 5px 10px!important;
                      }
    .qaf-grid__header{
    width:154%;
    }
    .qaf-grid__row{
    width:154%;
    }

                </style>`
        }
    }
    if(cname === 'EngagementStartDate'||cname === 'EngagementEndDate'){
        if(cvalue ){
          let date = new Date(cvalue);
          let formatedDate=convertUTCDateToLocalDate( new Date(cvalue) )
           formatedDate=`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear() } ${date.getHours() }:${date.getMinutes() } `
          return formatedDate;
        }else{
        return  ''
        }
      }
    if (cname === "DirectManager") {
        if (cvalue) {
            let reportingManagerRecordId = userOrGroupFieldRecordID(cvalue)
            cvalue = getFullNameByRecordID(reportingManagerRecordId)
            return cvalue;
        } else {
            return "";
        }
    }
    if(cname==='Action'){
        return `<button class="btn btn-primary btn-revenue" 
                                onclick="allocateRevenue('${row.RecordID}')">Allocate</button>`
    }

    if (cvalue||cvalue===0) {
        return cvalue;
    } else {
        return '';
    }
}
function allocateRevenue(recordID){
let revenue=expenseClaim_Data.find(a=>a.RecordID===recordID);
if(revenue&&revenue.RecordID){
    let fields=["Customer","Employee","StartDate","EndDate","NumberofHours","BillingAmount","HourlyRate"]
    let fieldsValue = [];
    fields.forEach(val => {
        if (val === 'Customer') {
          fieldsValue.push({ fieldName: val, fieldValue: revenue.Name })
        }  else if (val === 'StartDate') {
            fieldsValue.push({ fieldName: val, fieldValue:convertUTCDateToLocalDate( new Date(revenue.EngagementStartDate) )})
          } else if (val === 'EndDate') {
            fieldsValue.push({ fieldName: val, fieldValue:convertUTCDateToLocalDate( new Date(revenue.EngagementEndDate) )})
          }else if (val === 'NumberofHours') {
            fieldsValue.push({ fieldName: val, fieldValue:revenue.NumberofHours/revenue.NumberofSeats})
          }else if (val === 'BillingAmount') {
            fieldsValue.push({ fieldName: val, fieldValue:revenue.BillingAmount/revenue.NumberofSeats})
          }
        else {
          fieldsValue.push({ fieldName: val, fieldValue: null })
        }
      })
      let fieldsDoNotdiaply = ['Customer'];//check
      let excludeFieldFromForm = [];//check
     let displayFieldlist = fields.filter((objOne) => {
        return !fieldsDoNotdiaply.some((objTwo) => {
          return objOne === objTwo;
        });
      });
      window.QafPageService.AddItem("Client_Allocation_Matrix",{},displayFieldlist,fieldsValue,null,null,fieldsDoNotdiaply,excludeFieldFromForm,null,null,null,true,null,null,null)
}

}
function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  
    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
  
    newDate.setHours(hours - offset);
    return newDate;
  }
function expgrid_onRowActionEvent(eventName, row) {
    if (window.QafPageService) {
        if (eventName === 'VIEW') {
            window.QafPageService.ViewItem(expenseGrid.repository, row.RecordID, function () {
                loadCustomerRevenue();
            });

        } else if (eventName === 'EDIT') {
            window.QafPageService.EditItem(expenseGrid.repository, row.RecordID, function () {
                loadCustomerRevenue();
            }, null, null, null, null, ["Approvedamount"], ["Approvedamount"]);

        } else if (eventName === 'DELETE') {
            window.QafPageService.DeleteItem(row.RecordID, function () {
                loadCustomerRevenue();
            });
        }
    }
}


function userOrGroupFieldRecordID(id) {
    if (id) {
        if (id && id.includes("[{")) {
            return (JSON.parse(id))[0].RecordID;
        }
        else {
            return id && id.includes(";#") ? id.split(";#")[0] : id;
        }
    }
}


function getFullNameByRecordID(targetRecordID) {

    const Employee_Data = Employee;
    const targetRecord = Employee_Data.find(record => record.RecordID === targetRecordID);
    if (targetRecord) {
        const fullName = `${targetRecord.FirstName} ${targetRecord.LastName}`;
        return fullName;
    } else {
        return '';
    }
}