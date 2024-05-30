// table variable
var todayMonth = document.getElementById("today");
var date = new Date();
var day = date.getDate();
var month = date.getMonth() + 1;
var year = date.getFullYear();
var firstDate = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
var lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
var currentMonth = `${date.toLocaleString([], { month: 'long' })}-${year}`;
var UpdateStartDate;
var UpdateLastDate;
var guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/g;
var funfirstAttachment = "https://funfirst.quickappflow.com"
var SITAttachment = "https://qaffirst.quickappflow.com"
var attachmentAPIURL = funfirstAttachment
// expense form variable
var employeeList=[]
var departmentList=[]
var projectList=[]
var selecteddepartment;
var expenseClaimObject={}
var expenseRecordID
var expenseperticularList=[]
var expensePerticularObject={
    ExpenseLedger:'',
    ExpenseDate:'',
    Amount:'',
    ModeofPayment:'',
    Remarks:'',
    AttachBills:''
}
var expenseLedgerList=[]
var tempExpenseLedgerList=[]
var modepaymentList=[]
var divisionList=[]
var selectedFiles=[]
var selectedFilesReceipt=[]

var expenseGrid = {
    repository: 'Expense_claims',
    columns: [
        { field: 'Requesttitle', displayName: 'Brief about Request', sorting: false },
        { field: 'SelectEmployee', displayName: 'Request For', sorting: false },
        { field: 'Project', displayName: 'Project', sorting: false },
        { field: 'Division', displayName: 'Division', sorting: false },
        { field: 'DirectManager', displayName: 'Reporting Manager', sorting: false },
        { field: 'TotalAmount', displayName: 'Total Claimed  Amount', sorting: false },
        { field: 'Approvedamount', displayName: 'Approved Amount', sorting: false },

    ],
    viewFields: [ "SelectEmployee", "Requesttitle", "SelectDepartment", "Project", "ExpenseDetails", "TotalAmount", "Description","Division","DirectManager","Approvedamount"],
    page: 1,
    pageSize: 10,
    dateFormat: 'YYYY/MM/DD',
    currentSelectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    filter: ""
}

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var gridExpenseColumns = [
    { field: 'Requesttitle', displayName: 'Brief about Request', sequence: 1, sorting: false },
    { field: 'SelectEmployee', displayName: 'Request For', sequence: 2, sorting: false  },
    { field: 'Project', displayName: 'Project', sequence: 3, sorting: false  },
    { field: 'Division', displayName: 'Division', sequence: 4, sorting: false  },
    { field: 'DirectManager', displayName: 'Reporting Manager', sequence: 5, sorting: false },
    { field: 'TotalAmount', displayName: 'Total Claimed  Amount', sequence: 6, sorting: false },
    { field: 'Approvedamount', displayName: 'Approved Amount', sequence: 7, sorting: false },
];

 qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        todayMonth.innerHTML = currentMonth;
        // window.localStorage.setItem('ma',"funfirst.quickappflow.com")
        displayGrid()
        getAllListEmployee()
        clearInterval(qafServiceLoaded);
    }
}, 10);

function displayGrid(){
    let mainGridElement = document.getElementById('main-grid'); 
    let noGridElement = document.getElementById('no-grid'); 
      if(mainGridElement){
        mainGridElement.style.display='block'
      }
      if(noGridElement){
        noGridElement.style.display="none"
      }
      let attachmentCourierDisplayElement=document.getElementById(`CourierReceipt-display`)
      if(attachmentCourierDisplayElement){
        attachmentCourierDisplayElement.style.display='none'
      }
}

function getAllListEmployee() {
    let objectName = "Employees";
    let list = 'RecordID,FirstName,LastName,Department,IsOffboarded,CurrentLedgerBalance,GSLFLedgerBalance,Division';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `IsOffboarded!='True'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
        if (Array.isArray(employees) && employees.length > 0) {
            employeeList = employees;
        currentmonth()
        }
    });
}

function currentmonth() {

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let FirstDate = formatDate(firstDay)
    let LastDate = formatDate(lastDay)
    UpdateStartDate = FirstDate;
    UpdateLastDate = LastDate;
    getExpenseClaimList()
    getObjectIDExpenseclaim()
}
function getObjectIDExpenseclaim() {
    window.QafService.GetObjectById('Expense_claims').then((responses) => {
        responses[0].Fields.forEach(val => {
            if (val.InternalName === 'Division') {
                divisionList = val.Choices.split(";#")
            }
        })
        divisionDropdown()
      
    })
}
function divisionDropdown(){
    let divisionElement = document.getElementById(`division`);
    let options = `<option value=''>Select Division</option>`
    if (divisionElement) {
        divisionList.forEach(choise => {
            options += `<option value=${choise}>${choise}</option>`
        })
        divisionElement.innerHTML = options;
    }
}
// load table
function getExpenseClaimList() {
    let mainGridElement = document.getElementById('main-grid'); 
    let noGridElement = document.getElementById('no-grid'); 
      if(mainGridElement){
        mainGridElement.style.display='block'
      }
      if(noGridElement){
        noGridElement.style.display="none"
      }

    let whereClause = getWhereClause();
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
                expenseClaim.forEach(expense=>{
                    expense.Project=formatLookupFieldValue(expense.Project)
                    expense.SelectEmployee=formatLookupFieldValue(expense.SelectEmployee)
                    expense.Approvedamount=expense.Approvedamount?expense.Approvedamount:0;
                    if(expense.DirectManager){
                        let directManagerID=userOrGroupFieldRecordID(expense.DirectManager)
                        let emp=employeeList.find(a=>a.RecordID===directManagerID)
                        if(emp&&emp.RecordID){
                            expense.DirectManager=emp.FirstName+" "+emp.LastName 
                        }
                    }
            

                })
                expenseClaim_Data = expenseClaim
                console.log("TAble Data", expenseClaim)
                expenseGridElement.Data = expenseClaim;
                expenseGridElement.show = false;
            }else{
                let mainGridElement = document.getElementById('main-grid'); 
                let noGridElement = document.getElementById('no-grid'); 
                  if(mainGridElement){
                    mainGridElement.style.display='none'
                  }
                  if(noGridElement){
                    noGridElement.style.display="block"
                  }
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
function pageSizeEvent(page) {
    expenseGrid.pageSize = page.detail.pageSize;
    getExpenseClaimList();
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
                expenseGridElement.Data = expenseClaim;
                expenseGridElement.show = false;
                updateMonthElement();
            }
        });
    }
}


// add edit form
function AddForm(){
 
    expenseperticularList=[]
    expenseRecordID=""
    getFormDetails()
}
function getObjectIDExpenseParticular() {
    window.QafService.GetObjectById('Expense_Particulars').then((responses) => {
        responses[0].Fields.forEach(val => {
            if (val.InternalName === 'ModeofPayment') {
                modepaymentList = val.Choices.split(";#")
            }
        })
        getAllEmployee()
        getExpenseLedger()
      
    })
}
function addOneRowExpensePerticular(){
    expenseperticularList.push(expensePerticularObject)
    loadExpernseperticularTable()
}

function getFormDetails(){
    let popUp = document.getElementById("expense-from");
    if (popUp) {
        popUp.style.display = 'block';
        let actionsButtons = document.getElementById("actionsButtons");
        if(actionsButtons){
        actionsButtons.style.display = 'none'
    }
    }
    getObjectIDExpenseParticular()
}
function getAllEmployee() {
    let objectName = "Employees";
    let list = 'RecordID,FirstName,LastName,Department,IsOffboarded,CurrentLedgerBalance,GSLFLedgerBalance,Division';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `IsOffboarded!='True'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
        if (Array.isArray(employees) && employees.length > 0) {
            employeeList = employees;
            setEmployeeinDropdown()
            setReportingManagerinDropdown()
            getDepartment()
        }
    });
}
function getDepartment() {
    departmentList = []
    let objectName = "Department";
    let list = 'Name';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((departments) => {
        if (Array.isArray(departments) && departments.length > 0) {
            departmentList = departments;
            getProjects()
        }
    });
}
function getProjects() {
    projectList = []
    let objectName = "Plan";
    let list = 'RecordID,PlanName';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((projects) => {
        if (Array.isArray(projects) && projects.length > 0) {
            projectList = projects;
            setProjectOnDropdown()
            if(expenseRecordID){
                getExpenseClaim()
            }else{
            addOneRowExpensePerticular()

            }
        }
    });
}
function getExpenseLedger() {
    expenseLedgerList = []
    expenseLedgerList = []
    let objectName = "Expense_Ledger";
    let list = 'LedgerName,Project';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((expense_ledgers) => {
        if (Array.isArray(expense_ledgers) && expense_ledgers.length > 0) {
            expenseLedgerList = expense_ledgers;
            tempExpenseLedgerList = expense_ledgers;
        }
    });
}
function modePayment(){
    expenseperticularList.forEach((perticular,index)=>{
        
    let paymentElemet = document.getElementById(`mode_of_payment-${index}`);
    let options = `<option value=''>Select Mode of Payment</option>`
    if (paymentElemet) {
        modepaymentList.forEach(choise => {
            options += `<option value=${choise}>${choise}</option>`
        })
        paymentElemet.innerHTML = options;
    }

})
}

function getExpenseClaim() {
    let objectName = "Expense_claims";
    let list = 'RecordID,SelectEmployee,Requesttitle,SelectDepartment,Project,TotalAmount,Description,Division,DirectManager,GSLFLedgerBalance,CurrentLedgerBalance,CourierCompany,CourierDate,CourierReceipt';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `RecordID='${expenseRecordID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((expenseclaims) => {
        if (Array.isArray(expenseclaims) && expenseclaims.length > 0) {
            expenseClaimObject = expenseclaims[0];
            setExpenseClaimValue()
            getExpensePerticular()
        }
    });
}
function getExpensePerticular() {
    let objectName = "Expense_Particulars";
    let list = 'RecordID,ExpenseLedger,ExpenseDate,Amount,ModeofPayment,Remarks,AttachBills';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause =  `ParentRecordID='${expenseRecordID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((expensePerticulars) => {
        if (Array.isArray(expensePerticulars) && expensePerticulars.length > 0) {
            expenseperticularList = expensePerticulars
            loadExpernseperticularTable()
            onChangeProject()
        }
    });
}
function setProjectOnDropdown() {
    onChangeRequestFor()
    let projectElement = document.getElementById('Project');
    let options = `<option value=''> Select Project</option>`;
    if (projectElement) {
        projectList.forEach(project => {
            options += `<option value="${project.RecordID}">${project.PlanName}</option>`;
        });
        projectElement.innerHTML = options;
    }
}
function setEmployeeinDropdown() {
    let requestForElement = document.getElementById('requestfor');
    let options = `<option value=''> Select Employee</option>`;
    if (requestForElement) {
        employeeList.sort((a, b) => (a.FirstName > b.FirstName) ? 1 : ((b.FirstName > a.FirstName) ? -1 : 0));
        employeeList.forEach(emp => {
            options += `<option value="${emp.RecordID}">${emp.FirstName} ${emp.LastName}</option>`;
        });
        requestForElement.innerHTML = options;
    }
    if(!expenseRecordID){
        user = getCurrentUser()
        requestForElement.value=user.EmployeeGUID
    }
}
function setReportingManagerinDropdown() {
    let reportingManagerElement = document.getElementById('reportingManager');
    let options = `<option value=''> Select Employee</option>`;
    if (reportingManagerElement) {
        employeeList.sort((a, b) => (a.FirstName > b.FirstName) ? 1 : ((b.FirstName > a.FirstName) ? -1 : 0));
        employeeList.forEach(emp => {
            options += `<option value="${emp.RecordID}">${emp.FirstName} ${emp.LastName}</option>`;
        });
        reportingManagerElement.innerHTML = options;
    }
}

function onChangeRequestFor(){
    let requestForElement = document.getElementById('requestfor');
    let departmentElement = document.getElementById("department");
    let FGSPLBalanceElement = document.getElementById("FGSPLBalance");
    let GSLFBalanceElement = document.getElementById("GSLFBalance");
    let divisionElement = document.getElementById("division");

    if(requestForElement){
        let requestForRecordID=requestForElement.value;
        const selectedEmployee = employeeList.find(emp => emp.RecordID === requestForRecordID);
        if (selectedEmployee) {
            let departmentId = selectedEmployee.Department?selectedEmployee.Department.split(';#')[0]:'';
             selecteddepartment = departmentList.find(dep => dep.RecordID === departmentId);
            if (selecteddepartment) {
                departmentElement.value = selecteddepartment.Name;
            } else {
                departmentElement.value = "";
            }
            if(FGSPLBalanceElement){
                FGSPLBalanceElement.value=selectedEmployee.CurrentLedgerBalance
            }
            if(GSLFBalanceElement){
                GSLFBalanceElement.value=selectedEmployee.GSLFLedgerBalance
            }
            if(divisionElement){
                
                divisionElement.value=selectedEmployee.Division
                onChangeDivision()
            }

        } else {
            departmentElement.value = "";
        }
    }
}
function onChangeProject(){
    let projectElemet = document.getElementById("Project")
    if(projectElemet){
        projectID=projectElemet.value
        expenseLedgerList=tempExpenseLedgerList.filter(a=>(a.Project?a.Project.split(';#')[0]:"") === projectID)
        expenseLedgerOnDropdown()
    }

}


function expenseLedgerOnDropdown() {
    expenseperticularList.forEach((perticular,index)=>{
    let expenseLedgerElement = document.getElementById(`expense_ledger_name-${index}`);
    let options = `<option value=''> Select Expense Ledger</option>`; ``
    if (expenseLedgerElement) {
        expenseLedgerList.forEach(ledger => {
            options += `<option value="${ledger.RecordID}">${ledger.LedgerName}</option>`;

        });
        expenseLedgerElement.innerHTML = options;
    }

        expenseLedgerElement.value=perticular.ExpenseLedger?perticular.ExpenseLedger.split(";#")[0]:''
})

}
function onChangeExpenseLedeger(index){
    expenseperticularList.forEach((val,i)=>{
        if(i===parseInt(index)){
            let expenseLedgerElement=document.getElementById(`expense_ledger_name-${index}`);
            if(expenseLedgerElement){
                let expenseLedger=tempExpenseLedgerList.filter(a=>a.RecordID===expenseLedgerElement.value)
                val.ExpenseLedger=expenseLedger[0].RecordID+";#"+expenseLedger[0].LedgerName
            }
        }
    })
}
function onChangeExpenseDate(index){
    expenseperticularList.forEach((val,i)=>{
        if(i===parseInt(index)){
            let expenseDateElement=document.getElementById(`expenseDate-${index}`);
            if(expenseDateElement){
                val.ExpenseDate=expenseDateElement.value
            }
        }
    })
}
function onChangepaymentMode(index){
    expenseperticularList.forEach((val,i)=>{
        if(i===parseInt(index)){
            let paymentModeElement=document.getElementById(`mode_of_payment-${index}`);
            if(paymentModeElement){
                val.ModeofPayment=paymentModeElement.value
            }
        }
    })
}
function calculateTotal(e,index) {
    var t = e.value;
    e.value = t.indexOf(".") >= 0 ? t.slice(0, t.indexOf(".") + 3) : t;

    let total = 0;
    const amountInputs = document.querySelectorAll('.amount');
    amountInputs.forEach(input => {
        const amount = parseFloat(input.value) || 0;
        total += amount;
    });
    document.getElementById('totalAmount').value = total.toFixed(2);
    expenseperticularList.forEach((val,i)=>{
        if(i===parseInt(index)){
            let expenseAmountElement=document.getElementById(`amount-${index}`);
            if(expenseAmountElement){
                val.Amount=(expenseAmountElement.value)
            }
        }
    })
}
function handleInput(event) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete','.'];
    const keyPressed = event.key;
    if (!allowedKeys.includes(keyPressed) && !event.ctrlKey) {
        event.preventDefault();
    }
}
function oninputRemarks(index){
    expenseperticularList.forEach((val,i)=>{
        if(i===parseInt(index)){
            let remarkElement=document.getElementById(`remark-${index}`);
            if(remarkElement){
                val.Remarks=(remarkElement.value)
            }
        }
    })
}
function deleteAttachment(index){
    expenseperticularList.forEach((val,i)=>{
        if(i===parseInt(index)){
            user = getCurrentUser()
            let fetchPromise = fetch(`${attachmentAPIURL}/Attachment/deletefile?fileUrl=${val.AttachBills}&recordID=${val.RecordID}`, {
                method: 'POST',
                headers: {
                    'Host': 'demtis.quickappflow.com',
                    'Employeeguid': user.value.EmployeeGUID,
                    'Hrzemail': user.value.Email
                },
            })
                .then(response => response.json())
                .then(fileResponse => {

                    let attachmentDisplayElement=document.getElementById(`display-attachment-${parseInt(index)}`)
                    if(attachmentDisplayElement){
                        attachmentDisplayElement.style.display='none'
                    }
                    let attachmentElement=document.getElementById(`attachment-bill-name-${parseInt(index)}`)
                    if(attachmentElement){
                        attachmentElement.innerHTML=""
                    }
                    val.AttachBills=""
                })


            
        }})
      
}
function cleardateValue(index){
    expenseperticularList.forEach((val,i)=>{
        if(i===parseInt(index)){
            let expenseDateElement=document.getElementById(`expenseDate-${index}`);
            if(expenseDateElement){
                expenseDateElement.value=""
                val.ExpenseDate=""
            }
        }
    })
}

function loadExpernseperticularTable() {
    let perticularTable=""
    expenseperticularList.forEach((perticular,index)=>{
        perticularTable+=`<tr class="qaf-tr">
        <td class="qaf-td ledger-Name-cell">
            <select class="fs-input tableinput ledgerName" id="expense_ledger_name-${index}" name="expense_ledger_name" onchange="onChangeExpenseLedeger('${index}')"></select>
        </td>
        <td class="qaf-td">
            <div class="date-input-expense">
                <input class="fs-input tableinput" type="date" name="expense_date" placeholder="" id='expenseDate-${index}' onchange="onChangeExpenseDate('${index}')" required>
                <button type="button" class="row-add cross-button" onclick="cleardateValue('${index}')">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
        </td>
        <td class="qaf-td">
            <input type="text" class="fs-input amount tableinput" id="amount-${index}" name="amount"
                autocomplete="off" required oninput="calculateTotal(this,'${index}')"
                onkeydown="handleInput(event)">
        </td>
        <td class="qaf-td ledger-Name-cell">
            <select class="fs-input tableinput mode_of_payment arrow ledgerName" name="mode_of_payment" id="mode_of_payment-${index}"onchange="onChangepaymentMode('${index}')">
            </select>
        </td>
        <td class="qaf-td">
            <textarea class="fs-input tableinput remark" name="remarks" rows="5" id='remark-${index}' oninput="oninputRemarks('${index}')"></textarea>
        </td>
        <td class="qaf-td">
        <label for="attach_bills-${index}" class="custom-file-upload">
         Upload
    </label>
        <input class="fs-input fs-input-file file tableinput" type="file" name="attach_bills" id="attach_bills-${index}" onchange="onFileChange(this,'${index}')">
        <div class='attachment-display' id='display-attachment-${index}' style="display: none;">
        <div class='inner-attachment-display'>
            <div class='attach-bill' id='attachment-bill-name-${index}'></div>
            <div onclick="deleteAttachment('${index}')"><i class="fa fa-trash" aria-hidden="true"></i></div>
            </div>
        </div>
        
    </td>
        <td class="qaf-td row-action">
            <button type="button" class="row-add" onclick="addRowExpensePerticular()">
                <i class="fa fa-plus" aria-hidden="true"></i>
            </button>
            <button type="button" class="row-add" onclick="deleteRow('${index}')">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
        </td>
        </tr>`

    })
    const tableStructure = `
        <table class="qaf-table">
            <thead>
                <tr class="qaf-tr">
                    <th class="qaf-th">Expense Ledger<span
                    class="required"> *</span></th>
                    <th class="qaf-th">Expense Date</th>
                    <th class="qaf-th">Amount<span
                    class="required"> *</span></th>
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
    setExpernseperticularTable()
    let projectElemet = document.getElementById("Project")
    if(projectElemet){
        projectID=projectElemet.value
       if(projectID){
           expenseLedgerOnDropdown()
       }
    }
   
}
function onChangeDivision(){
    
    let divisionElement=document.getElementById('division');
    let FGSPLBalanceElement=document.getElementById('FGSPLBalancegroup')
    let GSLFLedgerBalanceElement=document.getElementById('GSLFBalancegroup')
    if(divisionElement){
        let division=divisionElement.value;
        if(division){
            if(division.toLowerCase()==='GSLF'.toLowerCase()){
                if(FGSPLBalanceElement){
                    FGSPLBalanceElement.style.display='none'
                }
                if(GSLFLedgerBalanceElement){
                    GSLFLedgerBalanceElement.style.display='block'
                }
            }
           else if(division.toLowerCase()==='FGSPL'.toLowerCase()){
            if(GSLFLedgerBalanceElement){
                GSLFLedgerBalanceElement.style.display='none'
            }
            if(FGSPLBalanceElement){
                FGSPLBalanceElement.style.display='block'
            }
            }
        }
    }
}
function addRowExpensePerticular(){
    expensePerticularObject={
        ExpenseLedger:'',
        ExpenseDate:'',
        Amount:'',
        ModeofPayment:'',
        Remarks:'',
        AttachBills:''
    }
    expenseperticularList.push(expensePerticularObject)
    loadExpernseperticularTable()
}
function deleteRow(index){
   expenseperticularList.splice((parseInt(index)), 1);
    loadExpernseperticularTable()
}
function setExpernseperticularTable(){
    
    expenseperticularList.forEach((perticular,index)=>{
        let expense_ledger_name=document.getElementById(`expense_ledger_name-${index}`);
        if(expense_ledger_name){
            expense_ledger_name.value=perticular.ExpenseLedger?perticular.ExpenseLedger.split(";#")[0]:''
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
        let attachmentElement=document.getElementById(`attachment-bill-name-${index}`)
        if(attachmentElement){
            attachmentElement.innerHTML=perticular.AttachBills?getAttachmentName(perticular.AttachBills):''
        }
        if(perticular.AttachBills){
        let attachmentDisplayElement=document.getElementById(`display-attachment-${index}`)
        if(attachmentDisplayElement){
            attachmentDisplayElement.style.display='block'
        }
    }
    })
}

function getExpenseClaimValue(){
    let requestForElement=document.getElementById('requestfor')
    let requesttitleElement=document.getElementById('requesttitle')
    let CourierCompanyElement=document.getElementById('CourierCompany')
    let CourierDateElement=document.getElementById('CourierDate')
    let divisioneElement=document.getElementById('division')
    let departmentElement=document.getElementById('department')
    let projectElement=document.getElementById('Project')
    let totalAmountElement=document.getElementById('totalAmount')
    let descriptionElement=document.getElementById('Description')
    let reportingManagerElement=document.getElementById('reportingManager')
    let FGSPLBalanceElement=document.getElementById('FGSPLBalance')
    let GSLFLedgerBalanceElement=document.getElementById('GSLFBalance')
    
    if(requestForElement){
        let requestForRecordID=requestForElement.value;
        const selectedEmployee = employeeList.find(emp => emp.RecordID === requestForRecordID);
        if(selectedEmployee&&selectedEmployee.RecordID){
        expenseClaimObject['SelectEmployee']=selectedEmployee.RecordID+";#"+selectedEmployee.FirstName+" "+selectedEmployee.LastName
    }
    }
    if(requesttitleElement){
        expenseClaimObject['Requesttitle']=requesttitleElement.value
    }
    if(CourierCompanyElement){
        expenseClaimObject['CourierCompany']=CourierCompanyElement.value
    }
    if(CourierDateElement){
        expenseClaimObject['CourierDate']=CourierDateElement.value
    }
    if(FGSPLBalanceElement){
        expenseClaimObject['CurrentLedgerBalance']=FGSPLBalanceElement.value
    }
    if(GSLFLedgerBalanceElement){
        expenseClaimObject['GSLFLedgerBalance']=GSLFLedgerBalanceElement.value
    }
    if(divisioneElement){
        expenseClaimObject['Division']=divisioneElement.value
    }
    if (reportingManagerElement) {
        if (reportingManagerElement.value) {
            let directManager = [{ UserType: 1, RecordID: reportingManagerElement.value }];

            expenseClaimObject['DirectManager'] = JSON.stringify(directManager)
        }
        else {
            expenseClaimObject['DirectManager'] = ""
        }
    }
    if(departmentElement){
        expenseClaimObject['SelectDepartment']=selecteddepartment.RecordID+";#"+selecteddepartment.Name
    }
  
    if(totalAmountElement){
        expenseClaimObject['TotalAmount']=totalAmountElement.value
    }
    if(descriptionElement){
        expenseClaimObject['Description']=descriptionElement.value
    }
    if(projectElement){
        let projectRecordID=projectElement.value;
        const selectedProject = projectList.find(project => project.RecordID === projectRecordID);
        if(selectedProject&&selectedProject.RecordID){
        expenseClaimObject['Project']=selectedProject.RecordID+";#"+selectedProject.PlanName}
    }

}
// set value
function setExpenseClaimValue(){
    let requestForElement=document.getElementById('requestfor')
    let requesttitleElement=document.getElementById('requesttitle')
    let CourierCompanyElement=document.getElementById('CourierCompany')
    let CourierDateElement=document.getElementById('CourierDate')
    let departmentElement=document.getElementById('department')
    let projectElement=document.getElementById('Project')
    let totalAmountElement=document.getElementById('totalAmount')
    let descriptionElement=document.getElementById('Description')
    let divisionElement=document.getElementById('division')
    let GSLFBalanceElement=document.getElementById('GSLFBalance')
    let FGSPLBalanceElement=document.getElementById('FGSPLBalance')
    let reportingManagerElement=document.getElementById('reportingManager')

    if(requestForElement){
        requestForElement.value=expenseClaimObject.SelectEmployee?expenseClaimObject.SelectEmployee.split(";#")[0]:''
    }
    if(requesttitleElement){
        requesttitleElement.value=expenseClaimObject.Requesttitle
    }
    if(CourierCompanyElement){
        CourierCompanyElement.value=expenseClaimObject.CourierCompany
    }
    if(CourierDateElement){
        CourierDateElement.value= getDate(expenseClaimObject.CourierDate)
    }

    if(expenseClaimObject.CourierReceipt){
    let attachmentDisplayElement=document.getElementById(`CourierReceipt-display`)
    if(attachmentDisplayElement){
        attachmentDisplayElement.style.display='block'
    }
    let attachmentElement=document.getElementById(`CourierReceipt-name`)
    if(attachmentElement){
        attachmentElement.innerHTML=getAttachmentName(expenseClaimObject.CourierReceipt)
    }
}

    if(GSLFBalanceElement){
        GSLFBalanceElement.value=expenseClaimObject.GSLFLedgerBalance
    }
    if(FGSPLBalanceElement){
        FGSPLBalanceElement.value=expenseClaimObject.CurrentLedgerBalance
    }
    if(reportingManagerElement){
        reportingManagerElement.value=expenseClaimObject.DirectManager?userOrGroupFieldRecordID(expenseClaimObject.DirectManager):''
    }
    if(divisionElement){
        divisionElement.value=expenseClaimObject.Division
    }
    if(totalAmountElement){
        totalAmountElement.value=expenseClaimObject.TotalAmount
    }
    if(descriptionElement){
        descriptionElement.value=expenseClaimObject.Description
    }
    if(departmentElement){
        departmentElement.value=expenseClaimObject.SelectDepartment?expenseClaimObject.SelectDepartment.split(";#")[1]:''
        selecteddepartment = departmentList.find(dep => dep.RecordID === (expenseClaimObject.SelectDepartment?expenseClaimObject.SelectDepartment.split(";#")[0]:''));
    }
    if(projectElement){
        projectElement.value=expenseClaimObject.Project?expenseClaimObject.Project.split(";#")[0]:''
    }
}
// save Form
function SaveRecord() {
    let isSaveForm=true
    let alertmessage=""
    let requestForElement=document.getElementById('requestfor')
    let requesttitleElement=document.getElementById('requesttitle')
    let divisionElement=document.getElementById('division')
    let reportingManagerElement=document.getElementById('reportingManager')
    let projectElement=document.getElementById('Project')

    if(requestForElement){
        if(!requestForElement.value){
            isSaveForm=false
            alertmessage="Request For is required"
        }
    }
    if(requesttitleElement){
        if(!requesttitleElement.value){
            isSaveForm=false
            alertmessage="Request title is required"
        }
    }
    if(divisionElement){
        if(!divisionElement.value){
            isSaveForm=false
            alertmessage="Division is required"
        }
    }
    if(reportingManagerElement){
        if(!reportingManagerElement.value){
            isSaveForm=false
            alertmessage="Reporting Manager is required"
        }
    }
    if(projectElement){
        if(!projectElement.value){
            isSaveForm=false
            alertmessage="Project is required"
        }
    }
if(isSaveForm){
    if(expenseperticularList&&expenseperticularList.length>0){
        expenseperticularList.forEach((element,index) => {
            if(!element.ExpenseLedger){
                isSaveForm=false
                alertmessage="Expense Ledger is required"
            }
            else if(!element.Amount){
                isSaveForm=false
                alertmessage="Amount is required"
            }
        })
    }
}
if(isSaveForm){
    let pageDisabledElement=document.getElementById('pageDisabled');
    if(pageDisabledElement){
        pageDisabledElement.classList.add('page-disabled')
    }
    let isloadingElement=document.getElementById('isloading');
    if(isloadingElement){
        isloadingElement.style.display='block'
    }
    getExpenseClaimValue()
    if(expenseRecordID){
        updateForm()
        updateChildTable()
    }else{
        saveForm()
    }
}else{
    openAlert(alertmessage)
}
   
}

function saveForm(){
    save(expenseClaimObject, 'Expense_claims').then(result => {
        saveChildTable(result.response)
    })
}
function updateForm(){
    updateExpense(expenseClaimObject, 'Expense_claims').then(result => {
    })
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
            CloseForm()
            resolve({
                response
            })
        });
    }
    )
}
function resetValueExpense(){
    expenseClaimObject={}
    let requestForElement=document.getElementById('requestfor')
    let requesttitleElement=document.getElementById('requesttitle')
    let CourierCompanyElement=document.getElementById('CourierCompany')
    let CourierDateElement=document.getElementById('CourierDate')
    let departmentElement=document.getElementById('department')
    let projectElement=document.getElementById('Project')
    let totalAmountElement=document.getElementById('totalAmount')
    let descriptionElement=document.getElementById('Description')
    if(requestForElement){
        requestForElement.value=""
    }
    if(requesttitleElement){
        requesttitleElement.value=""
    }
    if(CourierCompanyElement){
        CourierCompanyElement.value=""
    }
    if(departmentElement){
        departmentElement.value=""
    }
    if(projectElement){
        projectElement.value=""
    }
    if(totalAmountElement){
        totalAmountElement.value=""
    }
    if(descriptionElement){
        descriptionElement.value=""
    }
    if(CourierDateElement){
        CourierDateElement.value=""
    }
    let pageDisabledElement=document.getElementById('pageDisabled');
    if(pageDisabledElement){
        pageDisabledElement.classList.remove('page-disabled')
    }
    let isloadingElement=document.getElementById('isloading');
    if(isloadingElement){
        isloadingElement.style.display='none'
    }

    getExpenseClaimList()
}
function resetChildTable(){
    expenseperticularList=[]
    expensePerticularObject={
        ExpenseLedger:'',
        ExpenseDate:'',
        Amount:'',
        ModeofPayment:'',
        Remarks:'',
        AttachBills:''
    }
    expenseperticularList.push(expensePerticularObject)
    loadExpernseperticularTable()
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
        intermidiateRecord.RecordID = expenseRecordID;
        intermidiateRecord.RecordFieldValues = recordFieldValueList;
        window.QafService.UpdateItem(intermidiateRecord).then(response => {
            CloseForm()
            resolve({
                response
            })
        });
    }
    )
}
function updateChildTable() {
    let records = [];
    let intermidiateRecord;
    let recordFieldValues = [];
    expenseperticularList.forEach((element,index) => {
        tableRecordID=element.RecordID

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
        intermidiateRecord.RecordFieldValues = recordFieldValues;
        records.push(intermidiateRecord);

    });
    window.QafService.UpdateItems(records).then((response) => {
    resetChildTable()

        resolve({
            response
        })
    });
}
function saveChildTable(responseRecordId) {
    let records = [];
    let intermidiateRecord;
    let recordFieldValues = [];
    expenseperticularList.forEach((element,index) => {
        tableRecordID=""
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
    resetChildTable()

        resolve({
            response
        })
    });
}
// Table Action
function expgrid_onRowActionEvent(eventName, row) {

    if (window.QafPageService) {
        if (eventName === 'VIEW') {
            window.QafPageService.ViewItem(expenseGrid.repository, row.RecordID, function () {
                getExpenseClaimList();
            });

        } else if (eventName === 'EDIT') {
            expenseRecordID=row.RecordID;
            getFormDetails()
           
        } else if (eventName === 'DELETE') {
            window.QafPageService.DeleteItem(row.RecordID, function () {
                getExpenseClaimList();
            });
    }
}
}
function CloseForm(value) {
    let popUp = document.getElementById("expense-from");
    if (popUp) {
        popUp.style.display = 'none';
    }
    resetValueExpense()
    if(value){
        resetChildTable()
    }
}
// formatting function
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

    if (cname === 'SelectEmployee') {
            return `${cvalue} 
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
                        padding: 12px 24px;
                    }
                    .qaf-grid__row-item>a{
                    color: #009ce7;
                    text-decoration: none;
                    }
            </style>
        `;
    }


   
    if (cvalue) {
        return cvalue;
    } else {
        return '';
    }
}
function onFileChange(event,index) {
    selectedFiles=[]
    selectedFiles.push(...event.files);
    uploadAttachment(index)
}

function uploadAttachment(index) {
    
        let user = getCurrentUser()
        let file=selectedFiles[0]
            let type = file.name.substr(file.name.lastIndexOf('.'), file.name.length).toLowerCase();
            if (type !== ".exe") {
                const form = new FormData();
                form.append('file', file, file.name);
                form.append("file_type", `Expense_Particulars;#AttachedBill`);
                form.append("recordID", '');

                // Upload the file
                let fetchPromise = fetch(`${attachmentAPIURL}/Attachment/uploadfile`, {
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
                        expenseperticularList.forEach((val,i)=>{
                            if(i===parseInt(index)){
    
                                
                                val.AttachBills=fileResponse.url
                                let attachmentElement=document.getElementById(`attachment-bill-name-${parseInt(index)}`)
                                if(attachmentElement){
                                    attachmentElement.innerHTML=getAttachmentName(fileResponse.url)
                                }
                                let attachmentDisplayElement=document.getElementById(`display-attachment-${parseInt(index)}`)
                                if(attachmentDisplayElement){
                                    attachmentDisplayElement.style.display='block'
                                }
                            }
                        })
                    });
            } else {
                console.log("File type .exe is not allowed.");
            }

        

}

function getAttachmentName(fileUrl){
return formateFileName(getURLFromJson(fileUrl))
}

function formateFileName(fileUrl) {
    if (!fileUrl) {
      return;
    }
    let fileName = fileUrl;
    let fileExt = fileName.substr(fileName.lastIndexOf('.') + 1, fileName.length);
    if (fileName && fileName.indexOf('/') === -1) {
      fileName = fileName && fileName.substr(0, fileName.lastIndexOf('.'));
      fileName = fileName && fileName.substr(0, fileName.lastIndexOf('_'));
      fileName = fileName && fileName.substr(fileName.lastIndexOf('\\') + 1) + "." + fileExt;
    } else {
      fileName = fileName && fileName.substr(fileName.lastIndexOf('/') + 1, fileName.length);
      fileName = fileName && fileName.replace(/;#/gi, '\n');
      fileName = fileName && fileName.substr(0, fileName.lastIndexOf('_'));
      fileName = fileName && fileName.substr(fileName.lastIndexOf('\\') + 1) + "." + fileExt;
    }
    return fileName;
  }

function getURLFromJson(values) {
    if (values) {
      if (values.includes('link')) {
        if (this.IsJsonString(values)) {
          let sampleval = JSON.parse(values)
          return sampleval && sampleval[0].link ? sampleval[0].link : "";
        } else {
          return values;
        }
      }
      else {
        return values;
      }
    }
    else {
      return '';
    }
  }

  function leftNavigator() {
    monthNavigator('subtract')
}

function rightNavigator() {
    monthNavigator('plus')
}
function monthNavigator(month) {
displayGrid()
    if (month === 'subtract') {
        date.setMonth(date.getMonth() - 1);
    } else {
        date.setMonth(date.getMonth() + 1);
    }
    day = date.getDate();
    month = (date.getMonth() + 1);
    year = date.getFullYear();
    currentDate = `${date.toLocaleString([], { month: 'long' })}-${year}`;
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
    getExpenseClaimList()
}
function getDate(date){
    let dateValue= moment(date).format("YYYY-MM-DD")
     return dateValue.toString();
     }
function formatLookupFieldValue(value) {
    let returnValue = value ? value : "";
    let updatedRetunValue = [];
    if (returnValue && returnValue.indexOf(';#') !== -1) {
        let valuesWithGuid = returnValue.split(';#');
        for (let i = 0; i < valuesWithGuid.length; i++) {
            if (!isValidGuid(valuesWithGuid[i])) {
                updatedRetunValue.push(valuesWithGuid[i].trim());
            }
        }
        returnValue = updatedRetunValue.join('; ');
    } else {
        if (isValidGuid(returnValue)) {
            returnValue = '';
        }
    }
    return returnValue;
}
function isValidGuid(guidString) {
    let guidRegexPattern = new RegExp(guidPattern)
    return guidRegexPattern.test(guidString);
}
function formatDate(inputDateStr) {
    const date = new Date(inputDateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}
function getWhereClause() {
   let whereClause = `(CreatedByGUID='${getCurrentUserGuid()}')<<NG>>(CreatedDate>='${UpdateStartDate}' <AND> CreatedDate<='${UpdateLastDate}')`;
    return whereClause

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



  function onFileChangeReceipt(event) {
    selectedFilesReceipt=[]
    selectedFilesReceipt.push(...event.files);
    uploadAttachmentReceipt()
}

function uploadAttachmentReceipt() {
    
        let user = getCurrentUser()
        let file=selectedFilesReceipt[0]
            let type = file.name.substr(file.name.lastIndexOf('.'), file.name.length).toLowerCase();
            if (type !== ".exe") {
                const form = new FormData();
                form.append('file', file, file.name);
                form.append("file_type", `Expense_claims;#CourierReceipt`);
                form.append("recordID", '');

                // Upload the file
                let fetchPromise = fetch(`${attachmentAPIURL}/Attachment/uploadfile`, {
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
                                
                               expenseClaimObject['CourierReceipt']=fileResponse.url
                                let attachmentElement=document.getElementById(`CourierReceipt-name`)
                                if(attachmentElement){
                                    attachmentElement.innerHTML=getAttachmentName(fileResponse.url)
                                }
                                let attachmentDisplayElement=document.getElementById(`CourierReceipt-display`)
                                if(attachmentDisplayElement){
                                    attachmentDisplayElement.style.display='block'
                                }
                       
                    });
            } else {
                console.log("File type .exe is not allowed.");
            }

        

}

function deleteAttachmentReceipt(){
            user = getCurrentUser()
            let fetchPromise = fetch(`${attachmentAPIURL}/Attachment/deletefile?fileUrl=${expenseClaimObject.CourierReceipt}&recordID=${expenseRecordID?expenseRecordID:""}`, {
                method: 'POST',
                headers: {
                    'Host': 'demtis.quickappflow.com',
                    'Employeeguid': user.value.EmployeeGUID,
                    'Hrzemail': user.value.Email
                },
            })
                .then(response => response.json())
                .then(fileResponse => {
                    let attachmentDisplayElement=document.getElementById(`CourierReceipt-display`)
                    if(attachmentDisplayElement){
                        attachmentDisplayElement.style.display='none'
                    }
                    let attachmentElement=document.getElementById(`CourierReceipt-name`)
                    if(attachmentElement){
                        attachmentElement.innerHTML=""
                    }
                    expenseClaimObject['CourierReceipt']=""

                })
      
}
function openAlert(message) {
    let qafAlertObject={
        IsShow:true,
        Message:message,
        Type: 'ok'
    }
    const qafAlertComponent = document.querySelector('qaf-alert');
    qafAlertComponent.setAttribute('qaf-alert-show', JSON.stringify(qafAlertObject));
    qafAlertComponent.setAttribute('qaf-event', 'alertclose');
}

function clearCourierDate() {
    let startTime = document.getElementById('CourierDate');
    if(startTime){
        startTime.value = "";
    }

}