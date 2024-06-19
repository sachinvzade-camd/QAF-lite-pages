var quotationObject = {}
var currentTab = 1;
var tabName = "first";
var customersList=[]
var statusList=[]
var billingFrequencyList=[]
var employeesList =[]
var expenseperticularList = []
var orderItemList = []
var productList = []
var companyOfficeList = []
var orderItemsFields = []
var companySetting ;
var isSave=false
var quotationRecordID=""
var orderItemObject = {
    Product: '',
    ProductCode:'',
    Terms:'',
    BillingFrequency:'',
    Quantity:'',
    ListPrice:'',
    Discount:'',
    ItemTotal:'',
}
var priceDetails={
    Subtotal:'',
    Discount:'',
    Tax:'',
    GrandTotal:'',
}
var quotationRecordObject;
var quotationFields=[]
var productFields=[]
var ParentReferenceID;
var user
function showContent(tabId, tabNum, id) {
    tabName = tabId;
    selectedTab = tabNum;
    let newTabValue = selectedTab - currentTab;
    movingTabs(newTabValue);
    currentTab = selectedTab;

    let allButtons = document.querySelectorAll(".tab-btn");
    allButtons.forEach(function (button) {
        button.classList.remove("isActive");
        button.style.fontWeight = "normal";
    });
    let clickedButtonElement=document.getElementById(id)
    if(clickedButtonElement){
        clickedButtonElement.classList.add("isActive");
        clickedButtonElement.style.fontWeight = "600";
    }

    let tabBox = document.querySelector(".tab-box");
    let lineElement = document.querySelector(".line");
    let button = document.querySelector('[data-tab="' + tabId + '"]');

    let tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach(function (content) {
        content.classList.remove("active");
    });

    let buttonRect = button.getBoundingClientRect();
    let tabBoxRect = tabBox.getBoundingClientRect();
    let offsetLeft = buttonRect.left - tabBoxRect.left;

    lineElement.style.width = button.offsetWidth + "px";
    lineElement.style.transform = "translateX(" + offsetLeft + "px)";

    let contentArea = document.getElementById(tabId);
    if (contentArea) {
        contentArea.classList.toggle("active");
    }
    switch (tabId) {
        case "first":
            break;
        case "second":
            break;
        case "third":
            break;
        default:
            break;
    }
}
function movingTabs(value) {
    const cards = document.querySelectorAll(".tab-content");
    cards.forEach((card, index) => {
        card.classList.remove("moving-left", "moving-right");
        if (value > 0) {
            card.classList.add("moving-right");
        } else if (value < 0) {
            card.classList.add("moving-left");
        } else {
            card.classList.remove("moving-left", "moving-right");
        }
    });
}

qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
         user = getCurrentUser()
       
        window.document.addEventListener('openquotationFormEvent', getDetails)
        clearInterval(qafServiceLoaded);
    }
}, 10);


function getDetails(event) {
    if(typeof(event.detail)==='object'){
        debugger
        quotationRecordID=event.detail.RecordID
        ParentReferenceID=event.detail.quotation?event.detail.quotation.ParentReferenceID
        :''
        quotationObject['ParentReferenceID']=ParentReferenceID
        AddForm()
  }
  }

function getCurrentUser() {
    let userDetails = '';
    let userKey = window.localStorage.getItem('user_key');
    if (userKey) {
        let user = JSON.parse(userKey);
        if (user.value) {
            userDetails = user.value;
        }
    }
    return userDetails;
}
function AddForm() {
    document.getElementById('topHeader').style.zIndex = '1';
    tabName="first"
    let actbtnElement=document.getElementById('actbtn')
    if(actbtnElement){
    let lineElement = document.querySelector(".line");

        lineElement.style.width = 88 + "px";
        lineElement.style.transform = "translateX(" + 0 + "px)";
        actbtnElement.classList.add('isActive')
    }
    let actbtn2Element=document.getElementById('actbtn2')
    if(actbtn2Element){
        actbtn2Element.classList.remove('isActive')
    }
    let actbtn3Element=document.getElementById('actbtn3')
    if(actbtn3Element){
        actbtn3Element.classList.remove('isActive')
    }
    let firstElement=document.getElementById('first')
    if(firstElement){
        firstElement.classList.add('active')
    }
    let secondElement=document.getElementById('second')
    if(secondElement){
        secondElement.classList.remove('active')
    }
    let thirdElement=document.getElementById('third')
    if(thirdElement){
        thirdElement.classList.remove('active')
    }
    let popUp = document.getElementById("expense-from");
    if (popUp) {
        popUp.style.display = 'block';
        const container = document.getElementsByClassName('container')[0];
        const activeTab1 = container.getElementsByClassName('tab-btn isActive')[0];
        const activeLine1 = activeTab1.parentNode.getElementsByClassName('line')[0];
        activeLine1.style.width = activeTab1.offsetWidth + 'px';
        activeLine1.style.left = activeTab1.offsetLeft + 'px';
        let actionsButtons = document.getElementById("actionsButtons");
        if (actionsButtons) {
            actionsButtons.style.display = 'none'
        }
        quotationRecordObject=null
        resetquotationvalue()
        getObjectID()
        getObjectIDOrderItems()
        getObjectIDProduct()
        getCustomer()
        getEmployees()
        getCompanyOffices()
      
    }
}
function getQuotation() {
    let objectName = "Quotation";
    let list = quotationFields.join(",");
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `RecordID='${quotationRecordID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((quotations) => {
        if (Array.isArray(quotations) && quotations.length > 0) {
            quotationRecordObject = quotations[0]
            priceDetails.Discount=quotationRecordObject.Discount
            priceDetails.Subtotal=quotationRecordObject.Subtotal
            priceDetails.Tax=quotationRecordObject.Tax
            priceDetails.GrandTotal=quotationRecordObject.GrandTotal
            setquotationValue()
        }
    });
}
function getProduct() {
    let objectName = "Product";
    let list = productFields.join(",");
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = ``;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((products) => {
        if (Array.isArray(products) && products.length > 0) {
            productList = products
        }
    });
}

function getCompanyOffices() {
    let objectName = "Company_Offices";
    let list = 'RecordID,RegisteredCompanyName';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = ``;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((offices) => {
        if (Array.isArray(offices) && offices.length > 0) {
            companyOfficeList = offices
            setofficesOnDropdown()
        }
    });
}
function setofficesOnDropdown() {
    let officeElement = document.getElementById('companyOffice');
    let options = `<option value=''> Select office</option>`;
    if (officeElement) {
        companyOfficeList.forEach(customer => {
            options += `<option value="${customer.RecordID}">${customer.RegisteredCompanyName}</option>`;
        });
        officeElement.innerHTML = options;
    }
}


function getCustomer() {
    let objectName = "Customers";
    let list = 'RecordID,Name';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = ``;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((customers) => {
        if (Array.isArray(customers) && customers.length > 0) {
            customersList = customers
            setCustomerOnDropdown()
        }
    });
}
function setCustomerOnDropdown() {
    let customerElement = document.getElementById('customer');
    let options = `<option value=''> Select Customer</option>`;
    if (customerElement) {
        customersList.forEach(customer => {
            options += `<option value="${customer.RecordID}">${customer.Name}</option>`;
        });
        customerElement.innerHTML = options;
    }
}
function getObjectID() {
    fieldListObject = []
     window.QafService.GetObjectById('Quotation').then((responses) => {
       responses[0].Fields.forEach((ele) => {
        quotationFields.push(ele.InternalName)
        if (ele.InternalName === 'Status') {
            statusList=ele.Choices.split(";#")
        }
       })
     
       setStatusOnDropdown()
       if(quotationRecordID){
        setTimeout(() => {
                getQuotation()
           }, 2000);
       }else{
        priceDetails={
            Subtotal:'',
            Discount:'',
            Tax:'',
            GrandTotal:'',
        }
        orderItemList=[]
        quotationRecordObject=null
        resetquotationvalue()
       }
      
       
     })
   }
   function getObjectIDOrderItems() {
    orderItemsFields = []
     window.QafService.GetObjectById('Order_Items').then((responses) => {
       responses[0].Fields.forEach((ele) => {
        orderItemsFields.push(ele.InternalName)
        if (ele.InternalName === 'BillingFrequency') {
            billingFrequencyList=ele.Choices.split(";#")
        }
       })
     })
   }
   function getObjectIDProduct() {
     window.QafService.GetObjectById('Product').then((responses) => {
       responses[0].Fields.forEach((ele) => {
        productFields.push(ele.InternalName)
       })
       getProduct()

     })
   }

   function setStatusOnDropdown() {
    let statusElement = document.getElementById('status');
    let options = `<option value=''> Select Status</option>`;
    if (statusElement) {
        statusList.forEach(status => {
            options += `<option value="${status}">${status}</option>`;
        });
        statusElement.innerHTML = options;
    }
} 

function getEmployees() {
    let objectName = "Employees";
    let list = 'RecordID,FirstName,LastName';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = ``;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
        if (Array.isArray(employees) && employees.length > 0) {
            employeesList = employees
            setEmployeesOnDropdown()
            setEmployeesAssessToMemberOnDropdown()
            setEmployeesQuotationByOnDropdown()
        }
    });
}
function setEmployeesOnDropdown() {
    let employeeElement = document.getElementById('assignedTo');
    let options = `<option value=''> Select AssignedTo</option>`;
    if (employeeElement) {
        employeesList.forEach(employee => {
            options += `<option value="${employee.RecordID}">${employee.FirstName} ${employee.LastName}</option>`;
        });
        employeeElement.innerHTML = options;
    }
}
function setEmployeesAssessToMemberOnDropdown() {
    let employeeAssessToMemeberElement = document.getElementById('accessToMember');
    let options = `<option value=''> Select Access To Member</option>`;
    if (employeeAssessToMemeberElement) {
        employeesList.forEach(employee => {
            options += `<option value="${employee.RecordID}">${employee.FirstName} ${employee.LastName}</option>`;
        });
        employeeAssessToMemeberElement.innerHTML = options;
    }
}
function setEmployeesQuotationByOnDropdown() {
    let quotationByElement = document.getElementById('quotationby');
    let options = `<option value=''> Select Quotation by</option>`;
    if (quotationByElement) {
        employeesList.forEach(employee => {
            options += `<option value="${employee.RecordID}">${employee.FirstName} ${employee.LastName}</option>`;
        });
        quotationByElement.innerHTML = options;
    }
}
function SaveRecord(){
    let popUp = document.getElementById("expense-from");
    if (popUp) {
        popUp.style.display = 'none';
    }
    document.getElementById('topHeader').style.zIndex = '1052';
    var event = new CustomEvent('closequotationFormEvent',{detail:"save"})
    window.parent.document.dispatchEvent(event)
}
function CloseForm(value) {
    if(isSave){
        SaveRecord()
    }else{
        let popUp = document.getElementById("expense-from");
        if (popUp) {
            popUp.style.display = 'none';
        }
        document.getElementById('topHeader').style.zIndex = '1052';
        var event = new CustomEvent('closequotationFormEvent',{detail:"cancel"})
        window.parent.document.dispatchEvent(event)
    }
  
}
function getqouationValue() {
    let customerElement = document.getElementById('customer')
    let validfordaysElement = document.getElementById('validfordays')
    let assignedToElement = document.getElementById('assignedTo')
    let accessToMemberElement = document.getElementById('accessToMember')
    let companyOfficeElement = document.getElementById('companyOffice')
    let quoteNameElement = document.getElementById('quoteName')
    let CommentsElement = document.getElementById('Comments')
    let TermsandConditionsElement = document.getElementById('TermsandConditions')
    let dateIssuedElement = document.getElementById('dateIssued')
    let ExpirationDateElement = document.getElementById('ExpirationDate')
    let statusElement = document.getElementById('status')
    let quotationbyElement = document.getElementById('quotationby')
    if (customerElement) {
        let customervalue=""
        if(customerElement.value){
                let customer=customersList.filter(a=>a.RecordID===customerElement.value)
                if(customer&&customer.length>0){
                    customervalue=customer[0].RecordID+";#"+customer[0].Name;
                }
        }
        quotationObject['Customer'] = customervalue
    }
    if (validfordaysElement) {
        quotationObject['ValidForDays'] = Number(validfordaysElement.value)
    }
    if (assignedToElement) {
        let assignedTomembervalue=""
        if(assignedToElement.value){
            assignedTomembervalue=JSON.stringify([{ "UserType": 1, "RecordID": assignedToElement.value }])
        }
        quotationObject['QuoteOwner'] = assignedTomembervalue
    }
    if (accessToMemberElement) {
        let accessTomembervalue=""
        if(accessToMemberElement.value){
            accessTomembervalue=JSON.stringify([{ "UserType": 1, "RecordID": accessToMemberElement.value }])
        }
        quotationObject['AccessToMember'] = accessTomembervalue
    }
    if (companyOfficeElement) {
        let companyOfficevalue=""
        if(companyOfficeElement.value){
                let office=companyOfficeList.filter(a=>a.RecordID===companyOfficeElement.value)
                if(office&&office.length>0){
                    companyOfficevalue=office[0].RecordID+";#"+office[0].RegisteredCompanyName
                }
        }
        quotationObject['CompanyOffice'] = companyOfficevalue
    }
    if (quoteNameElement) {
        quotationObject['QuoteName'] = quoteNameElement.value
    }
    if (CommentsElement) {
        quotationObject['Comments'] = CommentsElement.value
    }
    if (TermsandConditionsElement) {
        quotationObject['TermsandConditions'] = TermsandConditionsElement.value
    }
    if (statusElement) {
        quotationObject['Status'] = statusElement.value
    }
    if (quotationbyElement) {
        let quotationBYvalue
        if(quotationbyElement.value){
            quotationBYvalue=JSON.stringify([{ "UserType": 1, "RecordID": quotationbyElement.value }])
        }
        quotationObject['QuotationBy'] = quotationBYvalue
    }
    if (dateIssuedElement) {
        quotationObject['DateIssued'] = dateIssuedElement.value;
    }
    if (ExpirationDateElement) {
        quotationObject['ExpirationDate'] = ExpirationDateElement.value;
    }
    if(quotationRecordID){
        quotationObject['ParentReferenceID']=ParentReferenceID?ParentReferenceID:quotationRecordObject.ParentReferenceID
        updateQuotationForm(quotationObject)
    }else{
        saveQuotationForm()
    }

}


function setquotationValue() {
    let customerElement = document.getElementById('customer')
    let validfordaysElement = document.getElementById('validfordays')
    let assignedToElement = document.getElementById('assignedTo')
    let accessToMemberElement = document.getElementById('accessToMember')
    let companyOfficeElement = document.getElementById('companyOffice')
    let quoteNameElement = document.getElementById('quoteName')
    let TermsandConditionsElement = document.getElementById('TermsandConditions')
    let CommentsElement = document.getElementById('Comments')
    let dateIssuedElement = document.getElementById('dateIssued')
    let ExpirationDateElement = document.getElementById('ExpirationDate')
    let statusElement = document.getElementById('status')
    let quotationbyElement = document.getElementById('quotationby')
    if (customerElement) {
        customerElement.value=quotationRecordObject.Customer?quotationRecordObject.Customer.split(";#")[0]:''
    }
    if (validfordaysElement) {
        validfordaysElement.value=quotationRecordObject.ValidForDays?quotationRecordObject.ValidForDays:''
    }
    if (assignedToElement) {
        assignedToElement.value=quotationRecordObject.QuoteOwner?JSON.parse(quotationRecordObject.QuoteOwner)[0].RecordID:''
    
    }
    if (accessToMemberElement) {
        accessToMemberElement.value=quotationRecordObject.AccessToMember?JSON.parse(quotationRecordObject.AccessToMember)[0].RecordID:''
      
    }
    if (companyOfficeElement) {
        companyOfficeElement.value=quotationRecordObject.CompanyOffice?quotationRecordObject.CompanyOffice.split(";#")[0]:''
    }
    if (quoteNameElement) {
        quoteNameElement.value=quotationRecordObject.QuoteName?(quotationRecordObject.QuoteName):''
    }
    if (TermsandConditionsElement) {
        TermsandConditionsElement.value=quotationRecordObject.TermsandConditions?(quotationRecordObject.TermsandConditions):''
    }
    if (CommentsElement) {
        CommentsElement.value=quotationRecordObject.Comments?(quotationRecordObject.Comments):''
    }
    if (statusElement) {
        statusElement.value=quotationRecordObject.Status?(quotationRecordObject.Status):''
    }
    if (quotationbyElement) {
        quotationbyElement.value=quotationRecordObject.QuotationBy?JSON.parse(quotationRecordObject.QuotationBy)[0].RecordID:''
    }
    if (dateIssuedElement) {
        dateIssuedElement.value=quotationRecordObject.DateIssued?moment(quotationRecordObject.DateIssued).format('YYYY-MM-DD'):''
    }
    if (ExpirationDateElement) {
        ExpirationDateElement.value=quotationRecordObject.ExpirationDate?moment(quotationRecordObject.ExpirationDate).format('YYYY-MM-DD'):''
    }
}
function resetquotationvalue() {
    let customerElement = document.getElementById('customer')
    let validfordaysElement = document.getElementById('validfordays')
    let assignedToElement = document.getElementById('assignedTo')
    let accessToMemberElement = document.getElementById('accessToMember')
    let companyOfficeElement = document.getElementById('companyOffice')
    let quoteNameElement = document.getElementById('quoteName')
    let TermsandConditionsElement = document.getElementById('TermsandConditions')
    let CommentsElement = document.getElementById('Comments')
    let dateIssuedElement = document.getElementById('dateIssued')
    let ExpirationDateElement = document.getElementById('ExpirationDate')
    let statusElement = document.getElementById('status')
    let quotationbyElement = document.getElementById('quotationby')
    if (customerElement) {
        customerElement.value=''
    }
    if (validfordaysElement) {
        validfordaysElement.value=''
    }
    if (assignedToElement) {
        assignedToElement.value=''
    
    }
    if (accessToMemberElement) {
        accessToMemberElement.value=''
      
    }
    if (companyOfficeElement) {
        companyOfficeElement.value=''
    }
    if (quoteNameElement) {
        quoteNameElement.value=''
    }
    if (TermsandConditionsElement) {
        TermsandConditionsElement.value=''
    }
    if (CommentsElement) {
        CommentsElement.value=''
    }
    if (statusElement) {
        statusElement.value=''
    }
    if (quotationbyElement) {
        quotationbyElement.value=''
    }
    if (dateIssuedElement) {
        dateIssuedElement.value=''
    }
    if (ExpirationDateElement) {
        ExpirationDateElement.value=''
    }
}

function saveQuotationForm() {
    return new Promise((resolve) => {
        var recordFieldValueList = [];
        var intermidiateRecord = {}
        var user = getCurrentUser()
        Object.keys(quotationObject).forEach((key, value) => {
           recordFieldValueList.push({
                FieldID: null,
                FieldInternalName: key,
                FieldValue: quotationObject[key]
            });
        });
        intermidiateRecord.CreatedByID = user.EmployeeID;
        intermidiateRecord.CreatedDate = new Date();
        intermidiateRecord.LastModifiedBy = null;
        intermidiateRecord.ObjectID = "Quotation";
        intermidiateRecord.RecordID = null;
        intermidiateRecord.RecordFieldValues = recordFieldValueList;
        window.QafService.CreateItem(intermidiateRecord).then(response => {
            quotationRecordID=response
                getQuotation()
            
            resolve({
                response
            })
        });
    })
}
function updateQuotationForm(quotationObjectupdate) {
    return new Promise((resolve) => {
        var recordFieldValueList = [];
        var intermidiateRecord = {}
        var user = getCurrentUser()
        Object.keys(quotationObjectupdate).forEach((key, value) => {
           recordFieldValueList.push({
                FieldID: null,
                FieldInternalName: key,
                FieldValue: quotationObjectupdate[key]
            });
        });
        intermidiateRecord.CreatedByID = user.EmployeeID;
        intermidiateRecord.CreatedDate = new Date();
        intermidiateRecord.LastModifiedBy = null;
        intermidiateRecord.ObjectID = "Quotation";
        intermidiateRecord.RecordID = quotationRecordID;
        intermidiateRecord.RecordFieldValues = recordFieldValueList;
        window.QafService.UpdateItem(intermidiateRecord).then(response => {
            resolve({
                response
            })
        });
    })
}
function nextFirstTabClick(current){
    let quoteNameElement = document.getElementById('quoteName')
    let assignedToElement = document.getElementById('assignedTo')
    let quotevalue=quoteNameElement?quoteNameElement.value:''
    let assigntovalue=assignedToElement?assignedToElement.value:''
    if(quotevalue&&assigntovalue){
        showContent('second',2, current)
        getqouationValue()
        isSave=true
        if(quotationRecordID){
            getOrderItems()
        }else{
             orderItemObject = {
                Product: '',
                ProductCode:'',
                Terms:'',
                BillingFrequency:'',
                Quantity:'',
                ListPrice:'',
                Discount:'',
                ItemTotal:'',
            }
            orderItemList.push(orderItemObject)
            loadChildTable()
        }
    }else{
        if(!quotevalue){
            openAlert('Quote name is required')
        }else if(!assigntovalue){
            openAlert('Assigned To  is required')
        }
    }
}
function openAlert(message) {
    let qafAlertObject = {
        IsShow: true,
        Message: message,
        Type: 'ok'
    }
    const body = document.body;
    let alertElement = document.createElement('qaf-alert')
    body.appendChild(alertElement);
    const qafAlertComponent = document.querySelector('qaf-alert');
    qafAlertComponent.setAttribute('qaf-alert-show', JSON.stringify(qafAlertObject));
    qafAlertComponent.setAttribute('qaf-event', 'alertclose');
}
function nextSecondTabClick(current){
    showContent('third',3, current)
    saveChildTable()
    updateQuotationForm(priceDetails)
    getCompanySetting()
}
function backtoSecondTabClick(current){
    showContent('second',2, current)
    orderItemList=[]
    if(quotationRecordID){
        getOrderItems()
    }
}

function saveChildTable() {
    let records = [];
    let intermidiateRecord;
    let recordFieldValues = [];
    orderItemList.forEach((element,index) => {
        tableRecordID=element.RecordID
        element.ParentID=quotationRecordID
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
        intermidiateRecord.ObjectID = "Order_Items";
        intermidiateRecord.RecordID = tableRecordID;
        intermidiateRecord["ParentRecordID"] = quotationRecordID ? quotationRecordID : "";
        intermidiateRecord.RecordFieldValues = recordFieldValues;
        records.push(intermidiateRecord);

    });
    window.QafService.UpdateItems(records).then((response) => {

    
    });
}

function getOrderItems() {
    let fields=orderItemsFields;
    fields.push('ParentRecordID')
    let objectName = "Order_Items";
    let fieldList = fields
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `ParentRecordID='${quotationRecordID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((orders) => {
        if (Array.isArray(orders) && orders.length > 0) {
            orderItemList = orders
            loadChildTable()
        }else{
            orderItemList.push(orderItemObject)
            loadChildTable()
        }
    });
}
function onChangeExpenseLedeger(index) {
    orderItemList.forEach((val, i) => {
        if (i === parseInt(index)) {
            let expenseLedgerElement = document.getElementById(`product-${index}`);
            if (expenseLedgerElement) {
                let expenseLedger = productList.filter(a => a.RecordID === expenseLedgerElement.value)
                val.Product = expenseLedger[0].RecordID + ";#" + expenseLedger[0].ProductName
            }
        }
    })
}

function onskuinput(e, index) {
    orderItemList.forEach((val, i) => {
        if (i === parseInt(index)) {
            let skuElement = document.getElementById(`sku-${index}`);
            if (skuElement) {
                val.ProductCode = (skuElement.value)
            }
        }
    })
}
function onTermsinput(e, index) {
    orderItemList.forEach((val, i) => {
        if (i === parseInt(index)) {
            let termElement = document.getElementById(`Terms-${index}`);
            if (termElement) {
                val.Terms = (termElement.value)
            }
        }
    })
}
function onQuantityinput(e, index) {
    orderItemList.forEach((val, i) => {
        if (i === parseInt(index)) {
            let termElement = document.getElementById(`Quantity-${index}`);
            if (termElement) {
                val.Quantity = (termElement.value)
            }
            calculateTotal(index)
        }
    })
}
function calculateTotal(index){
    orderItemList.forEach((val, i) => {
        if (i === parseInt(index)) {
let termElement = document.getElementById(`ItemTotal-${index}`);

            if (termElement) {
                let totalAmount=(val.Quantity * val.ListPrice)
                let total=(val.Quantity * val.ListPrice) * (val.Discount/100)
                val.ItemTotal = totalAmount-total
                termElement.value=val.ItemTotal 
            }
            }
        })
        setValueInPriceObject()
}
function setValueInPriceObject(){
     priceDetails={
        Subtotal:'',
        Discount:'',
        Tax:'',
        GrandTotal:'',
    }
    let subtotal=orderItemList.reduce((acc, value) => acc + value.ItemTotal, 0);
    priceDetails.Subtotal=parseFloat(subtotal.toFixed(2))
    let priceDiscountElement=document.getElementById('priceDiscount')
    if(priceDiscountElement){
        priceDetails.Discount=priceDiscountElement.value?Number(priceDiscountElement.value):''
    }
    let pricetaxElement=document.getElementById('priceTax')
    if(pricetaxElement){
        priceDetails.Tax=pricetaxElement.value?Number(pricetaxElement.value):''
    }
    priceDetails.GrandTotal=(priceDetails.Subtotal)
    if(priceDetails.Discount){
       let discountTotal=priceDetails.GrandTotal*(priceDetails.Discount/100)
       priceDetails.GrandTotal=parseFloat((priceDetails.GrandTotal-discountTotal).toFixed(2))
    }
    if(priceDetails.Tax){
        let discountTotal=priceDetails.GrandTotal*(priceDetails.Tax/100)
        priceDetails.GrandTotal=parseFloat((priceDetails.GrandTotal-discountTotal).toFixed(2))
    }
    setValueInPricing()
}
function onListPriceinput(e, index) {
    orderItemList.forEach((val, i) => {
        if (i === parseInt(index)) {
            let termElement = document.getElementById(`ListPrice-${index}`);
            if (termElement) {
                val.ListPrice = (termElement.value)
            }
            calculateTotal(index)

        }
    })
}
function onDiscountinput(e, index) {
    orderItemList.forEach((val, i) => {
        if (i === parseInt(index)) {
            let termElement = document.getElementById(`Discount-${index}`);
            if (termElement) {
                val.Discount = (termElement.value)
            }
            calculateTotal(index)

        }
    })
}
function onChangeBillingFrequency(index) {
    orderItemList.forEach((val, i) => {
        if (i === parseInt(index)) {
            let BillingFrequencyElement = document.getElementById(`BillingFrequency-${index}`);
            if (BillingFrequencyElement) {
                val.BillingFrequency = BillingFrequencyElement.value
            }
        }
    })
}
function ononItemTotalinput(index) {
    orderItemList.forEach((val, i) => {
        if (i === parseInt(index)) {
            let ItemTotalElement = document.getElementById(`ItemTotal-${index}`);
            if (ItemTotalElement) {
                val.ItemTotal = ItemTotalElement.value
            }
        }
    })
}


function loadChildTable() {
    let perticularTable = ""
    orderItemList.forEach((perticular, index) => {
        perticularTable += `<tr class="qaf-tr qaf-tr-data">
        <td class="qaf-td ledger-Name-cell">
            <select class="fs-input tableinput ledgerName" id="product-${index}" name="product" onchange="onChangeExpenseLedeger('${index}')"></select>
        </td>
         <td class="qaf-td">
            <input type="text" class="fs-input amount tableinput" id="sku-${index}" name="ProductCode"
                autocomplete="off" required oninput="onskuinput(this,'${index}')"
                >
        </td>
         <td class="qaf-td">
            <input type="text" class="fs-input Terms tableinput" id="Terms-${index}" name="Terms"
                autocomplete="off" required oninput="onTermsinput(this,'${index}')"
                >
        </td>
   <td class="qaf-td ledger-Name-cell">
            <select class="fs-input tableinput ledgerName" id="BillingFrequency-${index}" name="BillingFrequency" onchange="onChangeBillingFrequency('${index}')"></select>
        </td>
   <td class="qaf-td">
            <input type="number" class="fs-input Quantity tableinput" id="Quantity-${index}" name="Quantity"
                autocomplete="off" required oninput="onQuantityinput(this,'${index}')"
                >
        </td>
   <td class="qaf-td">
            <input type="number" class="fs-input ListPrice tableinput" id="ListPrice-${index}" name="ListPrice"
                autocomplete="off" required oninput="onListPriceinput(this,'${index}')"
                >
        </td>
   <td class="qaf-td">
            <input type="number" class="fs-input Discount tableinput" id="Discount-${index}" name="Discount"
                autocomplete="off" required oninput="onDiscountinput(this,'${index}')"
                >
        </td>
        <td class="qaf-td">
            <input type="number" class="fs-input Discount tableinput" id="ItemTotal-${index}" name="ItemTotal"
                autocomplete="off" required oninput="onItemTotalinput(this,'${index}')"
                >
        </td>
        <td class="qaf-td row-action">
            <button type="button" class="row-add" onclick="deleteRow('${index}')">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
        </td>
        </tr>`

    })
  
 
    let tableStructure = `
        <table class="qaf-table">
            <thead>
                 <tr class="qaf-tr">
                    <th class="qaf-th">Product</th>
                    <th class="qaf-th">SKU</th>
                    <th class="qaf-th">Terms</th>
                    <th class="qaf-th">Billing Frequency</th>
                    <th class="qaf-th">Quantity</th>
                    <th class="qaf-th">List Price</th>
                    <th class="qaf-th">Discount</th>
                    <th class="qaf-th">Item Total</th>
                    <th class="qaf-th"></th>
                </tr>
            </thead>
            <tbody id="tableBody">
                ${perticularTable}
            </tbody>
        </table>
    `;
    tableStructure+=`  <button type="button" class="row-add" onclick="addRowExpensePerticular()">
    <i class="fa fa-plus" aria-hidden="true"> Add New</i>
</button>`
    const tableContainer = document.getElementById('tablecontainer');
    tableContainer.innerHTML = tableStructure;
    setExpernseperticularTable()
    expenseLedgerOnDropdown()
    billingFrequesyOnDropdown()
    setValueInPricing()
}



function addRowExpensePerticular() {
    orderItemObject = {
        Product: '',
        ProductCode:'',
        Terms:'',
        BillingFrequency:'',
        Quantity:'',
        ListPrice:'',
        Discount:'',
        ItemTotal:'',
    }
    orderItemList.push(orderItemObject)
    loadChildTable()
}
function deleteRow(index) {
    orderItemList.splice((parseInt(index)), 1);
    loadChildTable()
}

function billingFrequesyOnDropdown() {
    orderItemList.forEach((perticular, index) => {
        let expenseLedgerElement = document.getElementById(`BillingFrequency-${index}`);
        let options = `<option value=''> Select Billing Frequency</option>`; ``
        if (expenseLedgerElement) {
            billingFrequencyList.forEach(product => {
                options += `<option value="${product}">${product}</option>`;
            });
            expenseLedgerElement.innerHTML = options;
        }
        expenseLedgerElement.value = perticular.BillingFrequency ? perticular.BillingFrequency : ''
    })

}
function expenseLedgerOnDropdown() {
    orderItemList.forEach((perticular, index) => {
        let expenseLedgerElement = document.getElementById(`product-${index}`);
        let options = `<option value=''> Select product</option>`; ``
        if (expenseLedgerElement) {
            productList.forEach(product => {
                options += `<option value="${product.RecordID}">${product.ProductName}</option>`;

            });
            expenseLedgerElement.innerHTML = options;
        }

        expenseLedgerElement.value = perticular.Product ? perticular.Product.split(";#")[0] : ''
    })

}

function setExpernseperticularTable() {
    orderItemList.forEach((perticular, index) => {
        let expense_ledger_name = document.getElementById(`product-${index}`);
        if (expense_ledger_name) {
            expense_ledger_name.value = perticular.Product ? perticular.Product.split(";#")[0] : ''
        }
        let skuElement = document.getElementById(`sku-${index}`);
        if(skuElement){
            skuElement.value=perticular.ProductCode?perticular.ProductCode:''
        }
        let TermsElement = document.getElementById(`Terms-${index}`);
        if(TermsElement){
            TermsElement.value=perticular.Terms?perticular.Terms:''
        }
        let BillingFrequencyElement = document.getElementById(`BillingFrequency-${index}`);
        if(BillingFrequencyElement){
            BillingFrequencyElement.value=perticular.BillingFrequency?perticular.BillingFrequency:''
        }
        let UnitPriceElement = document.getElementById(`ListPrice-${index}`);
        if(UnitPriceElement){
            UnitPriceElement.value=perticular.ListPrice?perticular.ListPrice:''
        }
        let QuantityElement = document.getElementById(`Quantity-${index}`);
        if(QuantityElement){
            QuantityElement.value=perticular.Quantity?perticular.Quantity:''
        }
        let DiscountElement = document.getElementById(`Discount-${index}`);
        if(DiscountElement){
            DiscountElement.value=perticular.Discount?perticular.Discount:''
        }
         let ItemTotalElement = document.getElementById(`ItemTotal-${index}`);
        if(ItemTotalElement){
            ItemTotalElement.value=perticular.Discount?perticular.ItemTotal:''
        }
    })
}

function onChangeExpenseLedeger(index) {
    orderItemList.forEach((val, i) => {
        if (i === parseInt(index)) {
            let expenseLedgerElement = document.getElementById(`product-${index}`);
            if (expenseLedgerElement) {
                let product = productList.filter(a => a.RecordID === expenseLedgerElement.value)
                val.Product = product[0].RecordID + ";#" + product[0].ProductName;
                val.ProductCode = product[0].ProductCode
                val.Terms = product[0].Terms
                val.BillingFrequency = product[0].BillingFrequency
                val.ListPrice = product[0].UnitPrice
                val.Discount = product[0].Discount
                    setValueInProduct(index,product[0])
              
            }
        }
    })
}
function setValueInProduct(index,product){
    let skuElement = document.getElementById(`sku-${index}`);
    if(skuElement){
        skuElement.value=product.ProductCode?product.ProductCode:''
    }
    let TermsElement = document.getElementById(`Terms-${index}`);
    if(TermsElement){
        TermsElement.value=product.Terms?product.Terms:''
    }
    let BillingFrequencyElement = document.getElementById(`BillingFrequency-${index}`);
    if(BillingFrequencyElement){
        BillingFrequencyElement.value=product.BillingFrequency?product.BillingFrequency:''
    }
    let UnitPriceElement = document.getElementById(`ListPrice-${index}`);
    if(UnitPriceElement){
        UnitPriceElement.value=product.UnitPrice?product.UnitPrice:''
    }
    let DiscountElement = document.getElementById(`Discount-${index}`);
    if(DiscountElement){
        DiscountElement.value=product.Discount?product.Discount:''
    }
}
function setValueInPricing(){
    
    let SubtotalElement = document.getElementById(`Subtotal`);
    if(SubtotalElement){
        SubtotalElement.value=priceDetails.Subtotal?priceDetails.Subtotal:''
    }
    let DiscountElement = document.getElementById(`priceDiscount`);
    if(DiscountElement){
        DiscountElement.value=priceDetails.Discount?priceDetails.Discount:''
    }
    let TaxElement = document.getElementById(`priceTax`);
    if(TaxElement){
        TaxElement.value=priceDetails.Tax?priceDetails.Tax:''
    }
    let GrandTotalElement = document.getElementById(`GrandTotal`);
    if(GrandTotalElement){
        GrandTotalElement.value=priceDetails.GrandTotal?priceDetails.GrandTotal:''
    }
}
function backtofirstTabClick(id){
    showContent('first',1, id)

}

function getCompanySetting() {
    let objectName = "Company_Settings";
    let list = 'RecordID,Title,State,Country,City,Logo';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = ``;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((settings) => {
        if (Array.isArray(settings) && settings.length > 0) {
            companySetting = settings[0]
            setPreviewData()
        }
    });
}
function getURLFromJson(values) {
    if (values) {
      if (values.includes('link')) {
        if (IsJsonString(values)) {
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
  function IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  function formatDate(date){
    if (date) {
        return moment(date).format("DD MMMM YYYY")
      }
      return " ";
  }
  function getValidDays(){
    let dateOne = moment(quotationRecordObject.DateIssued);
let dateTwo = moment(quotationRecordObject.ExpirationDate);
 
// Function call
let result = dateOne.diff(dateTwo, 'days') 
    return  Math.abs(result)
  }
  function setPreviewData(){
    let orders;
    orderItemList.forEach((value, index) => {
        orders += `
                <tr>
                    <td class="item-width-si">${index + 1}</td>
                    <td>${value.Product ? value.Product.split(";#")[1] : ""}</td>
                    <td class="reviwe-td">${value.Quantity}</td>
                    <td class="reviwe-td">${value.ListPrice}</td>
                    <td class="reviwe-td">${value.Discount}</td>
                    <td class="reviwe-td">${value.ItemTotal}</td>
                </tr>
            `
    })
    let customervalue=""
        if(quotationRecordObject.Customer){
          let  customer=customersList.filter(a=>a.RecordID===quotationRecordObject.Customer.split(';#')[0])
          if(customer&&customer.length>0){
customervalue= `<p> ${customer?customer[0].Name:""} <!----><br> ${customer?customer[0].BillingCity:""} ,${customer?customer[0].State:""} <!----><br>
                                    ${customer?customer[0].Country:""} <!----><br>${customer?customer[0].Email:""}<!----> </p>`
          }

          
        }
    let image=(window.location.origin.includes('localhost')?'https:/qaffirst.quickappflow.com':window.location.origin)+"/Attachment/downloadfile?fileUrl="+encodeURIComponent(getURLFromJson(companySetting.Logo))
    let preview=`<div class="hrz-dynamic-frm-per">
                    <div class="print-btn"><button
                            class="btn btn-primary m-t-5 m-b-20 no-print m-r-5">Download</button></div>
                    <loader><!----></loader><!---->
                    <div class="hrz-n-r-container-per custom-hrz-n-r-container-per" id="quotation-preview">
                        <div class="company-info">
                            <div class="company-logo"><!----><img alt=""
                                    src="${image}">
                            </div><!----><!---->
                            <div class="company-details m-t-20">
                                <p>${companySetting.Title} <br> ${companySetting.City} <br> ${companySetting.Country} <br> <br> </p>
                                <p class="account-detail"><!----><br> <br> <br> <br> </p>
                            </div>
                            <div class="company-details m-t-20">
                                <p><b>Date Issued:&nbsp;</b>${formatDate(quotationRecordObject.DateIssued)}</p><!----><!---->
                                <p class="account-detail"><b>Valid Till:&nbsp;</b>${formatDate(quotationRecordObject.ExpirationDate)} </p>
                            </div>
                        </div>
                        <div class="quoate-id">
                            <p>Quotation No: ${quotationRecordObject.AutoUnique}</p>
                        </div>
                        <div class="quotation-to m-t-20 m-b-20">
                            <div class="quotation-name m-t-20"> To, ${customervalue?customervalue:""}
                            </div>
                        </div>
                        <div class="table-order-items">
                            <table>
                                <thead>
                                    <tr class="header-row">
                                        <th>SN</th>
                                        <th style="width: 30%;">Item</th>
                                        <th class="reviwe-td">Quantity</th>
                                        <th class="reviwe-td">List Price</th>
                                        <th class="reviwe-td">Discount</th><!----><!----><!---->
                                        <th class="reviwe-td">Item Total</th>
                                    </tr>
                                </thead>
                                <tbody><!---->
                                ${orders}
                                </tbody>
                            </table>
                        </div>
                        <div class="total-div">
                            <table>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td class="item-width reviwe-td">Sub Total</td>
                                        <td class="item-width reviwe-td">${priceDetails.Subtotal}</td>
                                    </tr>
                                    <tr>
                                        <td class="item-width reviwe-td">Discount</td>
                                        <td class="item-width reviwe-td">${priceDetails.Discount}</td>
                                    </tr><!---->
                                    <tr>
                                        <td class="item-width reviwe-td">Total Payable</td>
                                        <td class="item-width reviwe-td">${priceDetails.GrandTotal}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div><!---->
                        <div class="m-t-70"><!---->
                            <p class="m-b-20">Quotation validity:&nbsp;${getValidDays()}&nbsp;day(S) </p>
                        </div>
                        <div>
                            <div>
                                <p class=" term-condition">Terms and Conditions</p>${quotationRecordObject.TermsandConditions}
                            </div>
                        </div>
                        <p class="signature">Signature<br>${quotationRecordObject.CreatedByName}</p>
                    </div>
                </div>`

                document.getElementById('preview').innerHTML=preview
}