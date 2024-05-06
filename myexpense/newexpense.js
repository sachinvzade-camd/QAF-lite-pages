var Employee;
var expenseClaim_Data;
let todayMonth = document.getElementById("today");
const date = new Date();
var day = date.getDate();
var month = date.getMonth() + 1;
var year = date.getFullYear();
var firstDate = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
var lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
var currentMonth = `${date.toLocaleString([], { month: 'short' })}-${year}`;
var UpdateStartDate;
var UpdateLastDate;
var Employee;
var Plan;
var DepartmentData;
var Expense_Ledger;
var ledgerRecords;
var requestFor = document.getElementById("requestfor")
var requestTitle = document.getElementById("requesttitle")
var DepartmentInput = document.getElementById("department")
var Project = document.getElementById("Project")
var totalAmount = document.getElementById("totalAmount")
var Description = document.getElementById("Description")
var SelectedEmployee = ""
var DepartmentName = ""
var PlanName = ""
var selectedFiles = [];
var attachmentUrlData;
var responseRecordId;
var file;
var filename;
var attachmentRepoAndFieldName;
var user = getCurrentUser();
var EditExpense;
var EditExpenseperticular;
let AttachBills = [];
var recordID;
var modepaymentList=[]
let expenseGrid = {
    repository: 'Expense_claims',
    columns: [
        { field: 'Requesttitle', displayName: 'Request Title', sorting: false },
        { field: 'Project', displayName: 'Project', sorting: false },
        { field: 'Description', displayName: 'Description', sorting: false },
        { field: 'TotalAmount', displayName: 'Total Amount', sorting: false },
        { field: 'Approvedamount', displayName: 'Approved Amount', sorting: false },
    ],
    viewFields: ["Approvedamount", "SelectEmployee", "Requesttitle", "SelectDepartment", "Project", "ExpenseDetails", "TotalAmount", "Description"],
    page: 1,
    pageSize: 10,
    dateFormat: 'YYYY/MM/DD',
    currentSelectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    filter: ""
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let gridExpenseColumns = [
    { field: 'Requesttitle', displayName: 'Request Title', sequence: 1, sorting: false },
    { field: 'Project', displayName: 'Project', sequence: 2, sorting: false },
    { field: 'Description', displayName: 'Description', sequence: 3, sorting: false },
    { field: 'TotalAmount', displayName: 'Total Amount', sequence: 4, sorting: false },
    { field: 'Approvedamount', displayName: 'Approved Amount', sequence: 5, sorting: false },

];


let qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        todayMonth.innerHTML = currentMonth;
        let condition = Getcondtion();
        getObjectDetails()
        loadmyExpense(condition);
        clearInterval(qafServiceLoaded);
    }
}, 10);

function Getcondtion() {
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let FirstDate = formatDate(firstDay)
    let LastDate = formatDate(lastDay)
    UpdateStartDate = FirstDate;
    UpdateLastDate = LastDate;
    let whereClause = `CreatedByGUID='${getCurrentUserGuid()}'<<NG>>(CreatedDate>='${FirstDate}' <AND> CreatedDate<='${LastDate}')`;
    return whereClause;

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


function addExpenses() {
    if (window.QafPageService) {
        window.QafPageService.AddItem(expenseGrid.repository, function () {
            let condition = Getcondtion();
            loadmyExpense(condition);
        });
    }
}

//MOnth Nevigator
function leftNavigator() {
    monthNavigator('subtract')
}

function rightNavigator() {
    monthNavigator('plus')
}
function monthNavigator(month) {

    if (month === 'subtract') {
        date.setMonth(date.getMonth() - 1);
    } else {
        date.setMonth(date.getMonth() + 1);
    }
    day = date.getDate();
    month = (date.getMonth() + 1);
    year = date.getFullYear();
    currentDate = `${date.toLocaleString([], { month: 'short' })}-${year}`;
    todayMonth.innerHTML = currentDate;

    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let FirstDate;
    let Month;
    if (firstDay.toString().length === 1) {
        FirstDate = '0' + firstDay.toString()
    }
    else {
        FirstDate = firstDay;
    }
    let Lastdate;
    if (lastDay.toString().length === 1) {
        Lastdate = '0' + lastDay.toString()
    }
    else {
        Lastdate = lastDay;
    }
    if (month.toString().length === 1) {
        Month = '0' + month.toString()
    }
    else {
        Month = month;
    }

    var formattedFirstDay = year + '/' + Month + "/" + FirstDate
    var formattedLastDay = year + '/' + Month + "/" + Lastdate
    UpdateStartDate = formattedFirstDay;
    UpdateLastDate = formattedLastDay;
    let whereClause = `CreatedByGUID='${getCurrentUserGuid()}'<<NG>>(CreatedDate>='${formattedFirstDay}' <AND> CreatedDate<='${formattedLastDay}')`;
    loadmyExpense(whereClause)
}


function GetWhereClause() {
    let whereClause = `CreatedByGUID='${getCurrentUserGuid()}'<<NG>>(CreatedDate>='${UpdateStartDate}' <AND> CreatedDate<='${UpdateLastDate}')`;
    return whereClause
}

function formatDate(inputDateStr) {
    const date = new Date(inputDateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month
    const day = String(date.getDate()).padStart(2, '0');
    // ${day}/${month}/${year}

    return `${year}/${month}/${day}`;
}


function pageSizeEvent(page) {
    expenseGrid.pageSize = page.detail.pageSize;
    let whereClause = GetWhereClause();
    loadmyExpense(whereClause);
}

function loadmyExpense(condition) {
    
    let userId = getCurrentUserGuid();
    let firstDay = startDate();
    let lastDay = endDate();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
    let filterFormat = expenseGrid.filter;
    filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
    filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
    filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);
    let recordForField

    let whereClause = condition;
    console.log("whereClause: ", whereClause);
    recordForField = {
        Tod: expenseGrid.repository,
        Ldft: expenseGrid.viewFields.join(','),
        Ybod: expenseGrid.orderBy,
        Ucwr: whereClause,
        Zps: expenseGrid.pageSize,
        Rmgp: expenseGrid.page,
        Diac: "false",
        isWF: "true",
        wf: "Expense claims",
    }
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        expenseGridElement.show = true;
        window.QafService.Rfdf(recordForField).then((expenseClaim) => {
            if (Array.isArray(expenseClaim) && expenseClaim.length > 0) {
                expenseClaim_Data = expenseClaim
                console.log("TAble Data", expenseClaim)
                expenseGridElement.Data = expenseClaim;
                expenseGridElement.show = false;
                updateMonthElement();
            }
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
    let userId = getCurrentUserGuid();
    let firstDay = startDate();
    let lastDay = endDate();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
    let filterFormat = expenseGrid.filter;
    filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
    filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
    filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);
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
        isWF: "true",
        wf: "Expense claims",
    }
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        expenseGridElement.show = true;
        window.QafService.Rfdf(recordForField).then((expenseClaim) => {
            if (Array.isArray(expenseClaim) && expenseClaim.length > 0) {
                console.log("TAble Data", expenseClaim)
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
    let userId = getCurrentUserGuid();
    let firstDay = startDate();
    let lastDay = endDate();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
    let filterFormat = expenseGrid.filter;
    filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
    filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
    filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);
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
        isWF: "true",
        wf: "Expense claims",
    }
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        expenseGridElement.show = true;
        window.QafService.Rfdf(recordForField).then((expenseClaim) => {
            if (Array.isArray(expenseClaim) && expenseClaim.length > 0) {
                console.log("TAble Data", expenseClaim)
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
    let userId = getCurrentUserGuid();
    let firstDay = startDate();
    let lastDay = endDate();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
    let filterFormat = expenseGrid.filter;
    filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
    filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
    filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);
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
        isWF: "true",
        wf: "Expense claims",
    }
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        expenseGridElement.show = true;
        window.QafService.Rfdf(recordForField).then((expenseClaim) => {
            if (Array.isArray(expenseClaim) && expenseClaim.length > 0) {
                console.log("TAble Data", expenseClaim)
                expenseGridElement.Data = expenseClaim;
                expenseGridElement.show = false;
                updateMonthElement();
            }
        });
    }
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
            let userId = getCurrentUserGuid();
            let firstDay = startDate();
            let lastDay = endDate();
            let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
            let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
            let filterFormat = expenseGrid.filter;
            filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
            filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
            filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);

            let whereClause = GetWhereClause();
            recordForField = {
                Tod: expenseGrid.repository,
                Ldft: expenseGrid.viewFields.join(','),
                Ybod: expenseGrid.orderBy,
                Ucwr: whereClause,
                Zps: expenseGrid.pageSize,
                Rmgp: expenseGrid.page,
                Diac: "false",
                isWF: "true",
                wf: "Expense claims",
            }

            window.QafService.Rfdf(recordForField).then((expenseClaim) => {
                if (Array.isArray(expenseClaim) && expenseClaim.length > 0) {
                    console.log("TAble Data", expenseClaim)
                    expenseGridElement.Data = expenseClaim;
                    expenseGridElement.show = false;
                    updateMonthElement();
                }
            });
        }
    }
}

function prevMonth(e) {
    //Get grid by id
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        if (window.QafService) {
            expenseGrid.currentSelectedDate.setMonth(expenseGrid.currentSelectedDate.getMonth() - 1);
            expenseGridElement.show = true;
            updateMonthElement();

            let userId = getCurrentUserGuid();
            let firstDay = startDate();
            let lastDay = endDate();
            let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
            let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
            let filterFormat = expenseGrid.filter;
            filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
            filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
            filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);
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
                isWF: "true",
                wf: "Expense claims",
            }

            window.QafService.Rfdf(recordForField).then((expenseClaim) => {
                if (Array.isArray(expenseClaim) && expenseClaim.length > 0) {
                    console.log("TAble Data", expenseClaim)
                    expenseGridElement.Data = expenseClaim;
                    expenseGridElement.show = false;
                    updateMonthElement();
                }
            });
        }
    }
}

function expgrid_onItemRender(cname, cvalue, row) {
    if (cname === 'Requesttitle') {
        if (cvalue) {
            let result;
            let matchingObject = expenseClaim_Data.find(item => item.Requesttitle === cvalue);
            if (matchingObject) {
                result = {
                    objectid: matchingObject.objectid,
                    CreatedByGUID: matchingObject.CreatedByGUID,
                    InstanceID: matchingObject.InstanceID,
                    RecordID: matchingObject.RecordID
                };
            }
            return `
                <a href="${window.location.origin}/workflow-engine/i-request-details?rn=expense&cbid=${result.CreatedByGUID}&oid=${result.objectid}&rid=${result.RecordID}&incid=${result.InstanceID}" target="_blank">${cvalue}</a>`;
        }
    }

    if (cname === 'Project') {
        console.log("Expense Data Fpor URL", expenseClaim_Data)
        if (cvalue && cvalue.indexOf(';#') !== -1) {
            let values = cvalue.split(';#');
            let oddArray = [];
            values.forEach((v, idx) => {
                oddArray.push(idx);
            })
            let odds = oddArray.filter(n => n % 2);
            let returnItems = [];
            odds.forEach((d) => {
                returnItems.push(values[d]);
            })
            return `${returnItems.join(';')} 
            <style>
                   
                    .qaf-grid__header .qaf-grid__header-item{
                        padding: 12px 50px !important;
                    }
                    .qaf-grid__footer {
                        border-top: 1px solid rgba(0,0,0,.12);
                        background-color: #ffffff;
                    }
                    .qaf-grid{
                    border:none;
                    box-shadow: 1px 2px 5px;
                    }
                    .qaf-grid__header
                    {
                    background-color: #f2f2f2;
                    border-bottom: 1px solid rgba(0,0,0,.12);
                    font-size: 13px;
                    font-weight: 500 !important;
                    
                    }
                    .qaf-grid__row {
                        font-size: 12px;
                        font-weight: 500;
                        background-color: #fff;
                    }
                
                    .qaf-grid__header-item {
                        padding: 12px 50px;
                        font-weight: 500 !important;
                        font-size:13px;
                        
                    }
                    .qaf-grid-page-size label {
                        font-weight: 500;
                    }
                    .qaf-grid-page-size select {
                        background-color: #fff;
                        color: #333;
                    }
                    .qaf-grid__footer > button{
                    background-color: #fff;
                    }
                    .qaf-grid__footer > button > svg {
                        
                        fill: #333;
                    }
                    .qaf-grid__row-item{
                        padding: 12px 50px;
                    }
                    .qaf-grid__row-item>a{
                    color: #009ce7;
                    text-decoration: none;
                    }
            </style>
        `;
        }
    }
    // Handle 'Moved' independently
    if (cvalue) {
        return cvalue;
    } else {
        return '';
    }
}



function expgrid_onRowActionEvent(eventName, row) {
    
    let condition = Getcondtion();

    if (window.QafPageService) {
        if (eventName === 'VIEW') {
            window.QafPageService.ViewItem(expenseGrid.repository, row.RecordID, function () {
                loadmyExpense(condition);
            });

        } else if (eventName === 'EDIT') {
            // window.QafPageService.EditItem(expenseGrid.repository, row.RecordID, function () {
            //     loadmyExpense(condition);
            // });
            recordID=row.RecordID;
            getObjectID()
           
        } else if (eventName === 'DELETE') {
            window.QafPageService.DeleteItem(row.RecordID, function () {
                loadmyExpense(condition);
            });
        }
    }
}

function editExpenseDetails(){
    GetExpense(recordID);
    let popUp = document.getElementById("expense-from");
    if (popUp) {
        popUp.style.display = 'block';
        let actionsButtons = document.getElementById("actionsButtons");
        if(actionsButtons){
        actionsButtons.style.display = 'none'
    }}
}
function GetExpense(recordID) {
    EditExpense = [];
    let userId = getCurrentUserGuid();
    let objectName = "Expense_claims";
    let list = ["Approvedamount", "SelectEmployee", "Requesttitle", "SelectDepartment", "Project", "ExpenseDetails", "TotalAmount", "Description"];
    let fieldList = list.join(",");
    let pageSize = "10000000";
    let pageNumber = "1";
    let orderBy = "true";
    // let whereClause = `RecordID='${recordID}'`;
    conditions = `RecordID='${recordID}'`;
    let recordForField;
    recordForField = {
        Tod: objectName,
        Ldft: fieldList,
        Ybod: orderBy,
        Ucwr: conditions,
        Zps: pageSize,
        Rmgp: pageNumber,
        Diac: "false",
        isWF: "true",
        wf: "Expense claims",
    };
    window.QafService.Rfdf(recordForField).then((myRequest) => {
        if (Array.isArray(myRequest) && myRequest.length > 0) {
            EditExpense= myRequest;
            GetExpensePerticular(recordID)
        }
    });
    
}

function GetExpensePerticular(recordID) {
    EditExpenseperticular=[]
    let objectName = "Expense_Particulars";
    let list = ["ExpenseLedger", "ExpenseDate", "Amount", "ModeofPayment", "Remarks", "AttachBills"];
    let fieldList = list.join(",");
    let pageSize = "10000000";
    let pageNumber = "1";
    let orderBy = "true";
    // let whereClause = `RecordID='${recordID}'`;
    conditions = `ParentRecordID='${recordID}'`;
    let recordForField;
    recordForField = {
        Tod: objectName,
        Ldft: fieldList,
        Ybod: orderBy,
        Ucwr: conditions,
        Zps: pageSize,
        Rmgp: pageNumber,
        Diac: "false",
    };
    window.QafService.Rfdf(recordForField).then((particular) => {
        if (Array.isArray(particular) && particular.length > 0) {
            
            EditExpenseperticular= particular;
            setData();
        }else{
            setData();
        }
    });
    
}

function setData() {
    var requestFor = document.getElementById("requestfor")
    var requestTitle = document.getElementById("requesttitle")
    var DepartmentInput = document.getElementById("department")
    var Project = document.getElementById("Project")
    var totalAmount = document.getElementById("totalAmount")
    var Description = document.getElementById("Description")
    if(EditExpense&&EditExpense.length>0){
    requestFor.value = EditExpense[0].SelectEmployee.split(";#")[0];
    requestTitle.value = EditExpense[0].Requesttitle;
    DepartmentInput.value = EditExpense[0].SelectDepartment.split(";#")[1];
    totalAmount.value = EditExpense[0].TotalAmount;
    Project.value = EditExpense[0].Project.split(";#")[0];
    Description.value = EditExpense[0].Description;
    loadChildTable()
}
}
function loadChildTable() {
    let perticularTable=""
    EditExpenseperticular.forEach((perticular,index)=>{
        perticularTable+=`<tr class="qaf-tr">
        <td class="qaf-td">
            <select class="fs-input tableinput ledgerName" id="expense_ledger_name-${index}" name="expense_ledger_name"></select>
        </td>
        <td class="qaf-td">
            <div class="date-input">
                <input class="fs-input tableinput" type="date" name="expense_date" placeholder="" id='expenseDate-${index}'>
                <button type="button" class="row-add cross-button" onclick="cleardateValue(this)">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
        </td>
        <td class="qaf-td">
            <input type="text" class="fs-input amount tableinput" id="amount-${index}" name="amount"
                autocomplete="off" required oninput="calculateTotal()"
                onkeydown="handleInput(event)">
        </td>
        <td class="qaf-td">
            <select class="fs-input tableinput" name="mode_of_payment" id="mode_of_payment-${index}">
            </select>
        </td>
        <td class="qaf-td">
            <textarea class="fs-input tableinput remark" name="remarks" rows="5" id='remark-${index}'></textarea>
        </td>
        <td class="qaf-td">
            <input class="fs-input file tableinput" type="file" name="attach_bills" id="attach_bills-${index}" onchange="onFileChange(this)">
        </td>
        <td class="qaf-td row-action">
            <button type="button" class="row-add" onclick="addRow()">
                <i class="fa fa-plus" aria-hidden="true"></i>
            </button>
            <button type="button" class="row-add" onclick="deleteRow(this)">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
        </td>
        </tr>`

    })
    const tableStructure = `
        <table class="qaf-table">
            <thead>
                <tr class="qaf-tr">
                    <th class="qaf-th">Expense Ledger Name</th>
                    <th class="qaf-th">Expense Date</th>
                    <th class="qaf-th">Amount</th>
                    <th class="qaf-th">Mode of Payment</th>
                    <th class="qaf-th">Remarks</th>
                    <th class="qaf-th">Attach Bills</th>
                    <th class="qaf-th"></th>
                </tr>
            </thead>
            <tbody id="tableBody">
                ${perticularTable}
            </tbody>
        </table>
    `;
    const tableContainer = document.getElementById('tablecontainer');
    tableContainer.innerHTML = tableStructure;
    modePayment()
}
function modePayment(){
    EditExpenseperticular.forEach((perticular,index)=>{
    let payment = document.getElementById(`mode_of_payment-${index}`);
    let options = `<option value=''>Select Mode Of Payment</option>`
    if (payment) {
        modepaymentList.forEach(choise => {
            options += `<option value=${choise}>${choise}</option>`
        })
        payment.innerHTML = options;
    }
    editLeadersName()

})
}
function editLeadersName() {
    let projectID;
    let ProjectElemet = document.getElementById("Project")
    if(ProjectElemet){
        projectID=ProjectElemet.value
    }
   let ledgerRecords = Expense_Ledger.filter(ledger => ledger.Project.split(';#')[0] === projectID);
    EditExpenseperticular.forEach((perticular,index)=>{
    let PlanName = document.getElementById(`expense_ledger_name-${index}`);
    let options = `<option value=''> Select Expense Ledger Name</option>`; ``
    if (PlanName) {
        ledgerRecords.forEach(ledger => {
            options += `<option value="${ledger.RecordID}">${ledger.LedgerName}</option>`;

        });
        PlanName.innerHTML = options;
    }
})
    loadChildTableData()

}

function loadChildTableData(){
    EditExpenseperticular.forEach((perticular,index)=>{
        let expense_ledger_name=document.getElementById(`expense_ledger_name-${index}`);
        if(expense_ledger_name){
            expense_ledger_name.value=perticular.ExpenseLedger.split(";#")[0]
        }
        let expenseDataElemnt=document.getElementById(`expenseDate-${index}`);
        if(expenseDataElemnt){
            expenseDataElemnt.value=getDate(perticular.ExpenseDate)
        }
        let amountElement=document.getElementById(`amount-${index}`);
        if(amountElement){
            amountElement.value=perticular.Amount
        }
        let mode_of_paymentElement=document.getElementById(`mode_of_payment-${index}`);
        if(mode_of_paymentElement){
            mode_of_paymentElement.value=perticular.ModeofPayment
        }
        let remarkElement=document.getElementById(`remark-${index}`);
        if(remarkElement){
            remarkElement.value=perticular.Remarks
        }
        let attach_billsElement=document.getElementById(`attach_bills-${index}`);
        if(attach_billsElement){
            attach_billsElement.value=perticular.AttachBills
        }
    })
}
function getDate(date){
   let firstDay= moment(date).format("YYYY-MM-DD")
    return firstDay.toString();
    }
function AddForm() {
    recordID=""
    loadTable()
    getObjectID()
    let popUp = document.getElementById("expense-from");
    if (popUp) {
        popUp.style.display = 'block';
        let actionsButtons = document.getElementById("actionsButtons");
        if(actionsButtons){
        actionsButtons.style.display = 'none'
    }
    }
}

function CloseForm() {
    let popUp = document.getElementById("expense-from");
    if (popUp) {
        popUp.style.display = 'none';
    }
}

function getCurrentUser() {
    let userKey = window.localStorage.getItem('user_key');
    return JSON.parse(userKey);
}
function getObjectDetails() {
    window.QafService.GetObjectById('Expense_Particulars').then((responses) => {
        responses[0].Fields.forEach(val => {
            if (val.InternalName === 'ModeofPayment') {
                modepaymentList=val.Choices.split(";#")
            }
        })
    })
}
function getObjectID() {
    window.QafService.GetObjectById('Expense_Particulars').then((responses) => {
        responses[0].Fields.forEach(val => {
            if (val.InternalName === 'ModeofPayment') {
                let jobType = document.getElementById('mode_of_payment');
                let options = `<option value=''>Select Mode Of Payment</option>`
                if (jobType) {
                    modepaymentList=val.Choices.split(";#")
                    val.Choices.split(";#").forEach(choise => {
                        options += `<option value=${choise}>${choise}</option>`
                    })
                    jobType.innerHTML = options;
                }
            }
        })
        getEmployee()
    })
}

function getEmployee() {
    Employee = []
    let objectName = "Employees";
    let list = 'RecordID,FirstName,LastName,Department';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
        if (Array.isArray(employees) && employees.length > 0) {
            Employee = employees;

        }
        loadEmployee();
        getPlan();

    });
}

function getPlan() {
    Plan = []
    let objectName = "Project";
    let list = 'RecordID,ProjectName';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((plans) => {
        if (Array.isArray(plans) && plans.length > 0) {
            Plan = plans;
        }
        loadPlan()
        getDepartment()
    });

}

function getDepartment() {
    DepartmentData = []
    let objectName = "Department";
    let list = 'Name';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((departments) => {
        if (Array.isArray(departments) && departments.length > 0) {
            DepartmentData = departments;
        }
        getExpense_Ledger()
    });
}


function getExpense_Ledger() {
    Expense_Ledger = []
    let objectName = "Expense_Ledger";
    let list = 'LedgerName,Project';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((expense_ledgers) => {
        if (Array.isArray(expense_ledgers) && expense_ledgers.length > 0) {
            Expense_Ledger = expense_ledgers;
        }
        editExpenseDetails()
    });
}
function loadEmployee() {
    let requestFor = document.getElementById('requestfor');
    let options = `<option value=''> Select Employee</option>`;
    if (requestFor) {
        Employee.sort((a, b) => (a.FirstName > b.FirstName) ? 1 : ((b.FirstName > a.FirstName) ? -1 : 0));
        Employee.forEach(emp => {
            options += `<option value="${emp.RecordID}">${emp.FirstName} ${emp.LastName}</option>`;
        });
        requestFor.innerHTML = options;
    }
}

function loadPlan() {
    let PlanName = document.getElementById('Project');
    let options = `<option value=''> Select Project</option>`;
    if (PlanName) {
        Plan.forEach(plan => {
            options += `<option value="${plan.RecordID}">${plan.ProjectName}</option>`;

        });
        PlanName.innerHTML = options;
    }
}

requestFor.addEventListener('change', loadDepartment);
function loadDepartment() {
    removeErrorMessage(requestFor);
    const selectedEmployeeId = requestFor.value;
    let department = document.getElementById("department");
    const selectedEmployee = Employee.find(emp => emp.RecordID === selectedEmployeeId);
    if (selectedEmployee) {
        const departmentId = selectedEmployee.Department.split(';#')[0];
        const departmentObj = DepartmentData.find(dep => dep.RecordID === departmentId);
        if (departmentObj) {
            department.value = departmentObj.Name;
        } else {
            department.value = "";
        }
    } else {
        department.value = "";
    }
}

// Project.addEventListener('change', loadProject);
// function loadProject() {
//     
//     const selectedProjectID = Project.value;
//     let ledger_name = document.getElementById("expense_ledger_name");
//     const selectedProject= Plan.find(pln => pln.RecordID === selectedProjectID);
//     if (selectedProject) {
//         const projectID = selectedProject.RecordID;
//         const departmentObj = Expense_Ledger.find(plan => plan.Project.split(';#')[0] === projectID);
//         if (departmentObj) {
//             ledger_name .value = departmentObj.LedgerName;
//         } else {
//             ledger_name.value = "";
//         }
//     } else {
//         ledger_name.value = "";
//     }
// }

Project.addEventListener('change', loadProject);
function loadProject() {
    ;
    ledgerRecords = []; // Clear ledgerRecords before populating it again
    const selectedProjectID = Project.value;
    const selectedProject = Plan.find(plan => plan.RecordID === selectedProjectID);
    if (selectedProject) {
        const projectID = selectedProject.RecordID;
        ledgerRecords = Expense_Ledger.filter(ledger => ledger.Project.split(';#')[0] === projectID);
    }
    loadLeadersName()
}

function loadLeadersName() {
    let PlanName = document.getElementById('expense_ledger_name');
    let options = `<option value=''> Select Expense Ledger Name</option>`; ``
    if (PlanName) {
        ledgerRecords.forEach(ledger => {
            options += `<option value="${ledger.RecordID}">${ledger.LedgerName}</option>`;

        });
        PlanName.innerHTML = options;
    }
}

function loadTable() {
    const tableStructure = `
        <table class="qaf-table">
            <thead>
                <tr class="qaf-tr">
                    <th class="qaf-th">Expense Ledger Name</th>
                    <th class="qaf-th">Expense Date</th>
                    <th class="qaf-th">Amount</th>
                    <th class="qaf-th">Mode of Payment</th>
                    <th class="qaf-th">Remarks</th>
                    <th class="qaf-th">Attach Bills</th>
                    <th class="qaf-th"></th>
                </tr>
            </thead>
            <tbody id="tableBody">
                <tr class="qaf-tr">
                    <td class="qaf-td">
                        <select class="fs-input tableinput ledgerName" id="expense_ledger_name" name="expense_ledger_name"></select>
                    </td>
                    <td class="qaf-td">
                        <div class="date-input">
                            <input class="fs-input tableinput" type="date" name="expense_date" placeholder="">
                            <button type="button" class="row-add cross-button" onclick="cleardateValue(this)">
                                <i class="fa fa-times" aria-hidden="true"></i>
                            </button>
                        </div>
                    </td>
                    <td class="qaf-td">
                        <input type="text" class="fs-input amount tableinput" id="amount" name="amount"
                            autocomplete="off" required oninput="calculateTotal()"
                            onkeydown="handleInput(event)">
                    </td>
                    <td class="qaf-td">
                        <select class="fs-input tableinput" name="mode_of_payment" id="mode_of_payment">
                        </select>
                    </td>
                    <td class="qaf-td">
                        <textarea class="fs-input tableinput remark" name="remarks" rows="5"></textarea>
                    </td>
                    <td class="qaf-td">
                        <input class="fs-input file tableinput" type="file" name="attach_bills" id="attach_bills" onchange="onFileChange(this)">
                    </td>
                    <td class="qaf-td row-action">
                        <button type="button" class="row-add" onclick="addRow()">
                            <i class="fa fa-plus" aria-hidden="true"></i>
                        </button>
                        <button type="button" class="row-add" onclick="deleteRow(this)">
                            <i class="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
    const tableContainer = document.getElementById('tablecontainer');
    tableContainer.innerHTML = tableStructure;
}

function addRow() {
    const tableBody = document.getElementById('tableBody');
    const newRow = tableBody.rows[0].cloneNode(true);
    newRow.querySelectorAll('input').forEach(input => input.value = '');
    newRow.querySelectorAll('select').forEach(select => select.value = '');
    newRow.querySelectorAll('textarea').forEach(textarea => textarea.value = '');
    newRow.querySelectorAll('input[type="file"]').forEach(fileInput => fileInput.value = '');

    tableBody.appendChild(newRow);
}

function deleteRow(button) {
    if (document.querySelectorAll('.qaf-table tbody .qaf-tr').length > 1) {
        button.closest('.qaf-tr').remove();
        calculateTotal();
    }
}

function cleardateValue(button) {
    const inputField = button.parentElement.querySelector('.fs-input[type="date"]');
    inputField.value = '';
}


function calculateTotal() {
    let total = 0;
    const amountInputs = document.querySelectorAll('.amount');
    amountInputs.forEach(input => {
        const amount = parseFloat(input.value) || 0;
        total += amount;
    });

    document.getElementById('totalAmount').value = total.toFixed(2);
}

function handleInput(event) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete'];
    const keyPressed = event.key;
    if (!allowedKeys.includes(keyPressed) && !event.ctrlKey) {
        event.preventDefault();
    }
}

function resetValue() {
    requestFor.value = ""
    requestTitle.value = ""
    DepartmentInput.value = ""
    Project.value = ""
    totalAmount.value = ""
    Description.value = ""
    let popUp = document.getElementById("expense-from");
    if (popUp) {
        popUp.style.display = 'none';
    }
}

function clearTableInputValues() {
    const tableRows = document.querySelectorAll('.qaf-table tbody tr');
    tableRows.forEach(row => {
        const inputs = row.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.value = '';
        });
    });
}

function onFileChange(event) {
    selectedFiles.push(...event.files);
}

function SaveRecord() {
    
    removeErrorMessage(requestFor);
    const EmployeName = requestFor.value;
    const DepartmentValue = DepartmentInput.value;
    const PlanValue = Project.value
    if (EmployeName) {
        if (EmployeName) {
            let employee = Employee.filter(emp => emp.RecordID === EmployeName);
            if (employee && employee.length > 0) {
                SelectedEmployee = employee[0].RecordID + ";#" + employee[0].FirstName + " " + employee[0].LastName;
            }
        }
        if (DepartmentValue) {
            let department = DepartmentData.filter(dept => dept.Name === DepartmentValue);
            if (department && department.length > 0) {
                DepartmentName = department[0].RecordID + ";#" + department[0].Name;
            }
        }
        if (PlanValue) {
            let plan = Plan.filter(pln => pln.RecordID === PlanValue);
            if (plan && plan.length > 0) {
                PlanName = plan[0].RecordID + ";#" + plan[0].PlanName;
            }
        }
        uploadAttachment()
    }
    else {
        displayErrorMessage(requestFor, "This field is required");
    }

}

function displayErrorMessage(field, message) {
    removeErrorMessage(field);
    const parentElement = field.parentElement;
    const errorSpan = document.createElement("span");
    errorSpan.classList.add("error-message");
    errorSpan.textContent = message;
    parentElement.appendChild(errorSpan);
}


function removeErrorMessage(field) {
    const parentElement = field.parentElement;
    const errorSpan = parentElement.querySelector(".error-message");
    if (errorSpan) {
        parentElement.removeChild(errorSpan);
    }
}

function uploadAttachment() {
    if (selectedFiles.length > 0) {

        let responses = [];
        let fetchPromises = [];
        selectedFiles.forEach((file, index) => {
            let type = file.name.substr(file.name.lastIndexOf('.'), file.name.length).toLowerCase();
            if (type !== ".exe") {
                const form = new FormData();
                form.append('file', file, file.name);
                form.append("file_type", `Expense_Particulars;#AttachedBill`);
                form.append("recordID", '');

                // Upload the file
                let fetchPromise = fetch(`https://qaffirst.quickappflow.com/Attachment/uploadfile`, {
                    method: 'POST',
                    headers: {
                        'Host': 'demtis.quickappflow.com',
                        'Employeeguid': user.value.EmployeeGUID,
                        'Hrzemail': user.value.Email
                    },
                    body: form
                })
                    .then(response => response.json())
                    .then(fileResponse => {
                        responses.push(fileResponse.url);
                    });
                fetchPromises.push(fetchPromise);
            } else {
                console.log("File type .exe is not allowed.");
            }
        });

        Promise.all(fetchPromises).then(() => {
            console.log("Responses", responses);
            attachmentUrlData = responses;
            let object = {
                SelectEmployee: SelectedEmployee,
                Requesttitle: requestTitle.value,
                SelectDepartment: DepartmentName,
                Project: PlanName,
                TotalAmount: totalAmount.value,
                Description: Description.value,
            };
            save(object, 'Expense_claims').then(result => {
                responseRecordId = result.response
                saveChildTable()
                clearTableInputValues()
                selectedFiles = []
                attachmentUrlData = []

            })
        });
    }
    else {
        let object = {
            SelectEmployee: SelectedEmployee,
            Requesttitle: requestTitle.value,
            SelectDepartment: DepartmentName,
            Project: PlanName,
            TotalAmount: totalAmount.value,
            Description: Description.value,
        };
        if(recordID){
            updateExpense(object, 'Expense_claims').then(result => {
                responseRecordId = result.response
                updateChildTable()
                clearTableInputValues()
                selectedFiles = []
                attachmentUrlData = []
    
            })
        }else{
            save(object, 'Expense_claims').then(result => {
                responseRecordId = result.response
                saveChildTable()
                clearTableInputValues()
                selectedFiles = []
                attachmentUrlData = []
    
            })
        }
        
    }

}

function updateExpense(object, repositoryName) {
    return new Promise((resolve) => {
        var recordFieldValueList = [];
        var intermidiateRecord = {}
        user = getCurrentUser()
        Object.keys(object).forEach((key, value) => {
            recordFieldValueList.push({
                FieldID: null,
                FieldInternalName: key,
                FieldValue: object[key]
            });
        });
        intermidiateRecord.CreatedByID = user.EmployeeID;
        intermidiateRecord.CreatedDate = new Date();
        intermidiateRecord.LastModifiedBy = null;
        intermidiateRecord.ObjectID = repositoryName;
        intermidiateRecord.RecordID = recordID;
        intermidiateRecord.RecordFieldValues = recordFieldValueList;
        window.QafService.UpdateItem(intermidiateRecord).then(response => {
            resetValue()
            resolve({
                response
            })
        });
    }
    )
}
function save(object, repositoryName) {
    return new Promise((resolve) => {
        var recordFieldValueList = [];
        var intermidiateRecord = {}
        user = getCurrentUser()
        Object.keys(object).forEach((key, value) => {
            recordFieldValueList.push({
                FieldID: null,
                FieldInternalName: key,
                FieldValue: object[key]
            });
        });
        intermidiateRecord.CreatedByID = user.EmployeeID;
        intermidiateRecord.CreatedDate = new Date();
        intermidiateRecord.LastModifiedBy = null;
        intermidiateRecord.ObjectID = repositoryName;
        intermidiateRecord.RecordID = null;
        intermidiateRecord.RecordFieldValues = recordFieldValueList;
        window.QafService.CreateItem(intermidiateRecord).then(response => {
            resetValue()
            resolve({
                response
            })
        });
    }
    )
}
function updateChildTable() {
    let childTableData = getDataFromTable();
    let records = [];
    let intermidiateRecord;
    let recordFieldValues = [];
    childTableData.forEach((element,index) => {
        tableRecordID=EditExpenseperticular[index].RecordID

        intermidiateRecord = {};
        recordFieldValues = [];
        Object.keys(element).forEach((key) => {
            recordFieldValues.push({
                FieldID: null,
                FieldInternalName: key,
                FieldValue: element[key]
            });
        });
        intermidiateRecord.CreatedByID = user.EmployeeID;
        intermidiateRecord.CreatedDate = new Date();
        intermidiateRecord.LastModifiedBy = null;
        intermidiateRecord.LastModifiedDate = new Date();
        intermidiateRecord.ObjectID = "Expense_Particulars";
        intermidiateRecord.RecordID = tableRecordID;
        intermidiateRecord["ParentRecordID"] = responseRecordId ? responseRecordId : "";
        intermidiateRecord.RecordFieldValues = recordFieldValues;
        records.push(intermidiateRecord);

    });
    window.QafService.UpdateItems(records).then((response) => {
        resolve({
            response
        })
    });
}
function saveChildTable() {
    let childTableData = getDataFromTable();
    let records = [];
    let intermidiateRecord;
    let recordFieldValues = [];
    childTableData.forEach((element) => {
        intermidiateRecord = {};
        recordFieldValues = [];
        Object.keys(element).forEach((key) => {
            recordFieldValues.push({
                FieldID: null,
                FieldInternalName: key,
                FieldValue: element[key]
            });
        });
        intermidiateRecord.CreatedByID = user.EmployeeID;
        intermidiateRecord.CreatedDate = new Date();
        intermidiateRecord.LastModifiedBy = null;
        intermidiateRecord.LastModifiedDate = new Date();
        intermidiateRecord.ObjectID = "Expense_Particulars";
        intermidiateRecord.RecordID = "";
        intermidiateRecord["ParentRecordID"] = recordID ? recordID : "";
        intermidiateRecord.RecordFieldValues = recordFieldValues;
        records.push(intermidiateRecord);

    });
    window.QafService.UpdateItems(records).then((response) => {
        resolve({
            response
        })
    });
}

function getDataFromTable() {
    
    const tableRows = document.querySelectorAll('.qaf-table tbody tr');
    const dataArray = [];
    let SelectedLedgerName;
    tableRows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        let LedgerName = cells[0].querySelector('select').value;
        if (LedgerName) {
            LedgerName = Expense_Ledger.filter(emp => emp.RecordID === LedgerName);
            if (LedgerName && LedgerName.length > 0) {
                SelectedLedgerName = LedgerName[0].RecordID + ";#" + LedgerName[0].LedgerName;
            }
        }
        else {
            SelectedLedgerName = ""
        }
        const rowData = {
            ExpenseLedger: SelectedLedgerName,
            ExpenseDate: cells[1].querySelector('input').value,
            Amount: cells[2].querySelector('input').value,
            ModeofPayment: cells[3].querySelector('select').value,
            Remarks: cells[4].querySelector('textarea').value,
            AttachBills: cells[5].querySelector('input[type="file"]').value ? findURLContainingFileName(cells[5].querySelector('input[type="file"]').value) : ""
        };
        dataArray.push(rowData);
    });
    return dataArray;
}


function findURLContainingFileName(fileName) {
    const extractedFileName = fileName.match(/([^\\\/]+)(?=\.\w+$)/)[1];
    const extractedFileExtension = fileName.match(/\.(.+)$/)[1].toLowerCase(); // Extract file extension without the dot
    let foundURL = "";
    attachmentUrlData.forEach(url => {
        const urlFileName = url.substring(url.lastIndexOf('/') + 1);
        const urlFileExtension = urlFileName.substring(urlFileName.lastIndexOf('.') + 1).toLowerCase();
        if (urlFileName.includes(extractedFileName) && urlFileExtension === extractedFileExtension) {
            foundURL = url;
        }
    });

    return foundURL;
}

