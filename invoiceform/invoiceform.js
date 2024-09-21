var quotationObject = {}
var currentTab = 1;
var tabName = "first";
var customersList = []
var contactList = []
var statusList = []
var billingFrequencyList = []
var employeesList = []
var expenseperticularList = []
var orderItemList = []
var productList = []
var companyOfficeList = []
var orderItemsFields = []
var contactRecordIDS = []
var discountTypelist = []
var taxTypelist = []
var companySetting;
var isSave = false
var invoiceRecordID = "";
var termandsettingValue = ""
var billtoName = "";

var orderItemObject = {
    Product: '',
    ProductCode: '',
    Terms: '',
    BillingFrequency: '',
    Quantity: '',
    ListPrice: '',
    Discount: '',
    ItemTotal: '',
}

var priceDetails = {
    SubTotal: '',
    Discount: '',
    Tax: '',
    TotalAmount: '',
    DiscountType: '',
    SelectTaxType: '',
}

var quotationRecordObject;
var quotationFields = []
var productFields = []
var ParentReferenceID;
var user
var customerID = ""
var ownerID = ""

function showContentInvoice(tabId, tabNum, id) {

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
    let clickedButtonElement = document.getElementById(id)
    if (clickedButtonElement) {
        clickedButtonElement.classList.add("isActive");
        clickedButtonElement.style.fontWeight = "600";
    }

    let tabBox = document.querySelector(".qaf-tab-box");
    let lineElement = document.getElementById('line');
    let button = document.querySelector('[data-tab="' + tabId + '"]');

    let tabContents = document.querySelectorAll(".qaf-tab-content");
    tabContents.forEach(function (content) {
        content.classList.remove("active");
    });
    // tabBoxRect.left
    //518
    let buttonRect1 = button.getBoundingClientRect();
    let tabBoxRect1 = tabBox.getBoundingClientRect();
    let offsetLeft1 = buttonRect1.left - tabBoxRect1.left;

    lineElement.style.width = button.offsetWidth + "px";
    lineElement.style.transform = "translateX(" + offsetLeft1 + "px)";

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
    const cards = document.querySelectorAll(".qaf-tab-content");
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
window.document.addEventListener('openInvoiceFormEvent', getinvoiceDetails)
qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        user = getCurrentUser()
        clearInterval(qafServiceLoaded);
    }
}, 10);


function getinvoiceDetails(event) {

    if (typeof (event.detail) === 'object') {
        if (event.detail.isInvoice) {
            contactRecordIDS = event.detail.contact
            invoiceRecordID = event.detail.RecordID
            // billtoName = event.detail.customerInvoice?event.detail.customerInvoice.BilltoName:"";
            ParentReferenceID = event.detail.customerInvoice ? event.detail.customerInvoice.ParentReferenceID
                : ''
            customerID = event.detail.customerInvoice ? (event.detail.customerInvoice.Customer ? event.detail.customerInvoice.Customer.split(";#")[0] : "")
                : ''
            ownerID = event.detail.customerInvoice ? (event.detail.customerInvoice.InvoiceOwner ? event.detail.customerInvoice.InvoiceOwner.includes(";#") ? event.detail.customerInvoice.InvoiceOwner.split(";#")[0] : JSON.parse(event.detail.customerInvoice.InvoiceOwner)[0].RecordID : "")
                : ''
            quotationObject['ParentReferenceID'] = ParentReferenceID
            AddInvoiceForm()
        }
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

function resetLine() {
    let actbtnElement = document.getElementById('actbtn')
    if (actbtnElement) {
        let lineElement = document.getElementById("line");
        lineElement.style.width = 88 + "px";
        lineElement.style.transform = "translateX(" + 0 + "px)";
        actbtnElement.classList.add('isActive')
    }
}


function AddInvoiceForm() {
    let topHeaderElement = document.getElementById('topHeader')
    if (topHeaderElement) {
        topHeaderElement.classList.add = ('AddZindex')
    }
    tabName = "first"
    let actbtnElement = document.getElementById('actbtn')
    if (actbtnElement) {
        let lineElement = document.getElementById("line");
        lineElement.style.width = 88 + "px";
        lineElement.style.transform = "translateX(" + 0 + "px)";
        actbtnElement.classList.add('isActive')
    }
    let actbtn2Element = document.getElementById('actbtn2')
    if (actbtn2Element) {
        actbtn2Element.classList.remove('isActive')
    }
    let actbtn3Element = document.getElementById('actbtn3')
    if (actbtn3Element) {
        actbtn3Element.classList.remove('isActive')
    }
    let firstElement = document.getElementById('first')
    if (firstElement) {
        firstElement.classList.add('active')
    }
    let secondElement = document.getElementById('second')
    if (secondElement) {
        secondElement.classList.remove('active')
    }
    let thirdElement = document.getElementById('third')
    if (thirdElement) {
        thirdElement.classList.remove('active')
    }
    let popUp = document.getElementById("invoice-form");
    if (popUp) {
        popUp.style.display = 'block';


        let container = document.getElementsByClassName('qaf-container-main')[0];
        let activeTab1 = container.getElementsByClassName('tab-btn isActive')[0];
        let activeLine1;
        if (activeTab1) {
            activeLine1 = activeTab1.parentNode.getElementsByClassName('qafline')[0];
            activeLine1.style.width = activeTab1.offsetWidth + 'px';
            activeLine1.style.left = activeTab1.offsetLeft + 'px';
        }

        let actionsButtons = document.getElementById("actionsButtons");
        if (actionsButtons) {
            actionsButtons.style.display = 'none'
        }
        quotationRecordObject = null
        resetquotationvalue()
        getObjectIDOrderItems()
        getObjectIDProduct()
        getCustomer()
        getContact()
        getAppName()
        // getEmployees()
        getCompanyOffices()
        getCRMsetting()


    }
}

function getCRMsetting() {
    let objectName = "CRM_Settings";
    let list = 'RecordID,SettingName,SettingValue';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `SettingName='INVOICE_TERMS'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((settings) => {
        if (Array.isArray(settings) && settings.length > 0) {
            termandsettingValue = settings[0].SettingValue
        }
    });
}

var appNameDetails = [];
var mappingID = []
function getAppName() {
    appNameDetails = [];
    let objectName = "App_Configuration";
    let list = "RecordID,AppName,EncryptedName,Accessible,AppID";
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let AppName = "CRM";
    // let whereClause = `AppID='${this.appID}'`;
    let whereClause = `AppName='${AppName}'`;
    let isAscending = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, "", orderBy).then((appDetails) => {
        if (Array.isArray(appDetails) && appDetails.length > 0) {
            appNameDetails = appDetails[0];
            getAppMapping();
        }
    });
}

function getAppMapping() {
    mappingID = [];
    let objectName = "App_User_Mapping";
    let list = "RecordID,AppName,AllowUsers";
    let fieldList = list.split(",");
    let orderBy = "";
    let whereClause = `AppName='${appNameDetails.RecordID}'`;
    let pageSize = "100000";
    let pageNumber = "1";
    let isAscending = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, orderBy, isAscending).then((appDetails) => {
        if (Array.isArray(appDetails) && appDetails.length > 0) {
            appDetails.forEach(val => {
                mappingID.push(userOrGroupFieldRecordIDList(val.AllowUsers));
            });
        }
        getTeams(mappingID);
    });
}

function getTeams(mappingID) {
    let EmployeeWhereClause = []
    let objectName = "Teams";
    let list = "RecordID,AppName,TeamMembers";
    let fieldList = list.split(",");
    let orderBy = "";
    let whereClause = `AppName='${appNameDetails.RecordID}'`;
    let pageSize = "100000";
    let pageNumber = "1";
    let isAscending = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, orderBy, isAscending).then((teams) => {
        if (Array.isArray(teams) && teams.length > 0) {
            let teamList = teams;
            teamList.forEach(val => {
                mappingID.push(userOrGroupFieldRecordIDList(val.TeamMembers));

            });
            let RecordIdsArray = mappingID.flat();
            let EmployeeWhereClause = `RecordID='${RecordIdsArray.join("'<OR> RecordID='")}'`;
            getEmployees(EmployeeWhereClause);
        } else {
            getEmployees(EmployeeWhereClause);
        }
    });
}



function userOrGroupFieldRecordIDList(id) {
    if (id) {
        if (id && id.includes("[{")) {
            let jsonArray = (JSON.parse(id));
            if (jsonArray.length > 0) {
                return jsonArray.map(a => a.RecordID)
            }
        }
        else {
            return id && id.includes(";#") ? id.split(";#")[0] : id;
        }
    }
}


function getContact() {
    if (contactRecordIDS && contactRecordIDS.length > 0) {
        let id = contactRecordIDS.join("'<OR>RecordID='");
        let objectName = "Contact";
        let list = 'RecordID,FirstName,LastName,PostalCode,Country,StateProvince,StreetAddress,City,Mobile,Email';
        let fieldList = list.split(",");
        let pageSize = "20000";
        let pageNumber = "1";
        let orderBy = "true";
        let isAscending = "true";
        let whereClause = `RecordID='${id}'`
        window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, orderBy, isAscending).then((contacts) => {
            if (Array.isArray(contacts) && contacts.length > 0) {
                contactList = contacts
                setContactOnDropdown()
            }
        });
    }

}

function setContactOnDropdown() {
    let contactElement = document.getElementById('contact');
    let options = ``;
    if (contactElement) {
        contactList.forEach(contact => {
            options += `<option value="${contact.RecordID}">${contact.FirstName} ${contact.LastName}</option>`;
        });
        contactElement.innerHTML = options;
    }
}



function getQuotation() {
    quotationRecordObject = {}
    let objectName = "Customer_Invoice";
    let list = quotationFields.join(",");
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `RecordID='${invoiceRecordID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((quotations) => {
        if (Array.isArray(quotations) && quotations.length > 0) {
            quotationRecordObject = quotations[0]
            priceDetails.Discount = quotationRecordObject.Discount
            priceDetails.SubTotal = quotationRecordObject.SubTotal
            priceDetails.Tax = quotationRecordObject.Tax
            priceDetails.TotalAmount = quotationRecordObject.TotalAmount
            priceDetails.DiscountType = quotationRecordObject.DiscountType
            priceDetails.SelectTaxType = quotationRecordObject.SelectTaxType
            priceDetails.DiscountPercentage=quotationRecordObject.DiscountPercentage
            priceDetails.TaxPercentage=quotationRecordObject.TaxPercentage
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
    if(!window.location.href.includes('crm-customer-invoice')){
        document.getElementById('customer-drop').style.display='none'
    }
    let objectName = "Customers";
    let list = 'RecordID,Name,BillingCity,State,Country,Email,Type';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `Type='Customer'`;
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
function onchangeCustomer(){
    let customerElement = document.getElementById('customer');
    if(customerElement){
        let objectName = "Contact";
        let list = 'RecordID,FirstName,LastName,PostalCode,Country,StateProvince,StreetAddress,City,Mobile,Email,Customer';
        let fieldList = list.split(",");
        let pageSize = "20000";
        let pageNumber = "1";
        let orderBy = "true";
        let isAscending = "true";
        let whereClause = `Customer='${customerElement.value}'`
        window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, orderBy, isAscending).then((contacts) => {
            if (Array.isArray(contacts) && contacts.length > 0) {
                contactList = contacts
                setContactOnDropdown()
            }
        });
    }
}

function getObjectID() {

    fieldListObject = []
    window.QafService.GetObjectById('Customer_Invoice').then((responses) => {
        responses[0].Fields.forEach((ele) => {
            quotationFields.push(ele.InternalName)
            if (ele.InternalName === 'Status') {
                statusList = ele.Choices.split(";#")
            }
            if (ele.InternalName === 'SelectTaxType') {
                taxTypelist = ele.Choices.split(";#")
            }
            if (ele.InternalName === 'DiscountType') {
                discountTypelist = ele.Choices.split(";#")
            }
        })

        setStatusOnDropdown()
        setDiscountOnDropdown()
        setTaxOnDropdown()
        if (invoiceRecordID) {
            setTimeout(() => {
                getQuotation()
            }, 1000);
        } else {
            priceDetails = {
                Subtotal: '',
                Discount: '',
                Tax: '',
                TotalAmount: '',
                SelectTaxType: "",
                DiscountType: ""
            }
            orderItemList = []
            quotationRecordObject = null
            let dateIssuedElement = document.getElementById('dateIssued');
            dateIssuedElement.value =moment().format('YYYY-MM-DD') 
            // resetquotationvalue()
        }
    })
}

function getObjectIDOrderItems() {
    orderItemsFields = []
    window.QafService.GetObjectById('Order_Items').then((responses) => {
        responses[0].Fields.forEach((ele) => {
            orderItemsFields.push(ele.InternalName)
            if (ele.InternalName === 'BillingFrequency') {
                billingFrequencyList = ele.Choices.split(";#")
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

function setTaxOnDropdown() {
    let taxElement = document.getElementById('tax-select');
    let options = `<option value=''> Select Tax Type</option>`;
    if (taxElement) {
        taxTypelist.forEach(type => {
            options += `<option value="${type}">${type}</option>`;
        });
        taxElement.innerHTML = options;
    }
}

function setDiscountOnDropdown() {
    let discountElement = document.getElementById('discount-select');
    let options = `<option value=''> Select Discount Type</option>`;
    if (discountElement) {
        discountTypelist.forEach(type => {
            options += `<option value="${type}">${type}</option>`;
        });
        discountElement.innerHTML = options;
    }
}

function getEmployees(WhereClause) {
    let objectName = "Employees";
    let list = ["RecordID,FirstName,LastName"]
    let fieldList = list.join(",");
    let pageSize = "10000000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = WhereClause
    let recordForField
    recordForField = {
        Tod: objectName,
        Ldft: fieldList,
        Ybod: orderBy,
        Ucwr: whereClause,
        Zps: pageSize,
        Rmgp: pageNumber,
        Diac: "false",
    };
    window.QafService.Rfdf(recordForField).then((employees) => {
        if (Array.isArray(employees) && employees.length > 0) {
            employeesList = employees
            setEmployeesOnDropdown()
            setEmployeesAssessToMemberOnDropdown()
            setEmployeesQuotationByOnDropdown()
        }
        getObjectID()
    });
}

function setEmployeesOnDropdown() {
    let employeeElement = document.getElementById('assignedTo');
    let options = `<option value=''> Select Owner</option>`;
    if (employeeElement) {
        employeesList.forEach(employee => {
            options += `<option value="${employee.RecordID}">${employee.FirstName} ${employee.LastName}</option>`;
        });
        employeeElement.innerHTML = options;
    }

    if (employeeElement) {
        employeeElement.value = quotationRecordObject && quotationRecordObject.InvoiceOwner ? JSON.parse(quotationRecordObject.InvoiceOwner)[0].RecordID : ownerID
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
    let options = `<option value=''> Select Revenue by</option>`;
    if (quotationByElement) {
        employeesList.forEach(employee => {
            options += `<option value="${employee.RecordID}">${employee.FirstName} ${employee.LastName}</option>`;
        });
        quotationByElement.innerHTML = options;
    }
}

function SaveRecord() {
    let popUp = document.getElementById("invoice-form");
    if (popUp) {
        popUp.style.display = 'none';
    }
    let topHeaderElement = document.getElementById('topHeader')
    if (topHeaderElement) {
        topHeaderElement.classList.remove = ('AddZindex')
        topHeaderElement.classList.add = ('RemoveZindex')
    }
    var event = new CustomEvent('closeInvoiceFormEvent', { detail: "save" })
    window.parent.document.dispatchEvent(event)
}

function CloseForm(value) {
    if (isSave) {
        SaveRecord()
    } else {
        resetquotationvalue()
        let popUp = document.getElementById("invoice-form");
        if (popUp) {
            popUp.style.display = 'none';
        }
        let topHeaderElement = document.getElementById('topHeader')
        if (topHeaderElement) {
            topHeaderElement.classList.remove = ('AddZindex')
            topHeaderElement.classList.add = ('RemoveZindex')
        }
        var event = new CustomEvent('closeInvoiceFormEvent', { detail: "cancel" })
        window.parent.document.dispatchEvent(event)
    }
    resetLine();
}

function getqouationValue() {
    let customerElement = document.getElementById('customer')
    let validfordaysElement = document.getElementById('validfordays')
    let assignedToElement = document.getElementById('assignedTo')
    let accessToMemberElement = document.getElementById('accessToMember')
    let companyOfficeElement = document.getElementById('companyOffice')
    let contactElement = document.getElementById('contact')
    let quoteNameElement = document.getElementById('quoteName')
    let CommentsElement = document.getElementById('Comments')
    let TermsandConditionsElement = document.getElementById('TermsandConditions')
    let dateIssuedElement = document.getElementById('dateIssued')
    let ExpirationDateElement = document.getElementById('ExpirationDate')
    let statusElement = document.getElementById('status')
    let quotationbyElement = document.getElementById('quotationby')
    let customervalue = ""
    if (customerID) {
        let customer = customersList.filter(a => a.RecordID === customerID)
        if (customer && customer.length > 0) {
            customervalue = customer[0].RecordID + ";#" + customer[0].Name;
        }
    }else{
        if (customerElement) {
            if (customerElement.value) {
                let customerfind = customersList.filter(a => a.RecordID === customerElement.value)
                if (customerfind && customerfind.length > 0) {
                    customervalue = customerfind[0].RecordID + ";#" + customer[0].Name;
                }
            }
        }
    }
    quotationObject['Customer'] = customervalue

    if (validfordaysElement) {
        quotationObject['ValidForDays'] = Number(validfordaysElement.value)
    }
    if (assignedToElement) {
        let assignedTomembervalue = ""
        if (assignedToElement.value) {
            assignedTomembervalue = JSON.stringify([{ "UserType": 1, "RecordID": assignedToElement.value }])
        }
        quotationObject['InvoiceOwner'] = assignedTomembervalue
    }
    if (accessToMemberElement) {
        let accessTomembervalue = ""
        if (accessToMemberElement.value) {
            accessTomembervalue = JSON.stringify([{ "UserType": 1, "RecordID": accessToMemberElement.value }])
        }
        quotationObject['AccessToMember'] = accessTomembervalue
    }
    if (companyOfficeElement) {
        let companyOfficevalue = ""
        if (companyOfficeElement.value) {
            let office = companyOfficeList.filter(a => a.RecordID === companyOfficeElement.value)
            if (office && office.length > 0) {
                companyOfficevalue = office[0].RecordID + ";#" + office[0].RegisteredCompanyName
            }
        }
        quotationObject['CompanyOffice'] = companyOfficevalue
    }
    if (contactElement) {
        let contactValue = ""
        if (contactElement.value) {
            let contact = contactList.filter(a => a.RecordID === contactElement.value)
            if (contact && contact.length > 0) {
                contactValue = contact[0].RecordID + ";#" + contact[0].FirstName + " " + contact[0].LastName
            }
        }
        quotationObject['Contact'] = contactValue
    }
    if (quoteNameElement) {
        quotationObject['InvoiceTitle'] = quoteNameElement.value
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
        if (quotationbyElement.value) {
            quotationBYvalue = JSON.stringify([{ "UserType": 1, "RecordID": quotationbyElement.value }])
        }
        quotationObject['RevenueBy'] = quotationBYvalue
    }
    if (dateIssuedElement) {
        quotationObject['DateIssued'] = dateIssuedElement.value;
    }
    if (ExpirationDateElement) {
        quotationObject['DueDate'] = ExpirationDateElement.value;
    }
    if (invoiceRecordID) {
        quotationObject['ParentReferenceID'] = ParentReferenceID ? ParentReferenceID : quotationRecordObject.ParentReferenceID
        updateQuotationForm(quotationObject)
    } else {
        saveQuotationForm()
    }

}


function setquotationValue() {
    let customerElement = document.getElementById('customer')
    let validfordaysElement = document.getElementById('validfordays')
    let assignedToElement = document.getElementById('assignedTo')
    let contactElement = document.getElementById('contact')
    let accessToMemberElement = document.getElementById('accessToMember')
    let companyOfficeElement = document.getElementById('companyOffice')
    let quoteNameElement = document.getElementById('quoteName')
    let TermsandConditionsElement = document.getElementById('TermsandConditions')
    let CommentsElement = document.getElementById('Comments')
    let dateIssuedElement = document.getElementById('dateIssued')
    let ExpirationDateElement = document.getElementById('ExpirationDate')
    let statusElement = document.getElementById('status')
    let quotationbyElement = document.getElementById('quotationby')

    let QpriceDiscountElement = document.getElementById('priceDiscount')
    let QpriceTaxElement = document.getElementById('priceTax')
    let discountSelectElement = document.getElementById('discount-select')
    let taxSelectElement = document.getElementById('tax-select')
    let QlinktElement = document.getElementById('Ilink')

debugger
    if (QlinktElement) {
        QlinktElement.value = quotationRecordObject.Ilink  ? JSON.parse(quotationRecordObject.Ilink).link : ''
    }
    if (discountSelectElement) {
        discountSelectElement.value = quotationRecordObject.DiscountType ? quotationRecordObject.DiscountType : ''
    }
    if (taxSelectElement) {
        taxSelectElement.value = quotationRecordObject.SelectTaxType ? quotationRecordObject.SelectTaxType : ''
    }
    if (discountSelectElement) {
        discountSelectElement.value = quotationRecordObject.DiscountType ? quotationRecordObject.DiscountType : ''
    }
    if (QpriceDiscountElement) {
        if(quotationRecordObject.DiscountType==='Fixed'){
            QpriceDiscountElement.value = quotationRecordObject.Discount ? quotationRecordObject.Discount : ''

        }else{
            QpriceDiscountElement.value = quotationRecordObject.DiscountPercentage ? quotationRecordObject.DiscountPercentage : ''
        }
    }
    if (QpriceTaxElement) {
        if(quotationRecordObject.SelectTaxType==='Fixed'){
            QpriceTaxElement.value = quotationRecordObject.Tax ? quotationRecordObject.Tax : ''

        }else{
            QpriceTaxElement.value = quotationRecordObject.TaxPercentage ? quotationRecordObject.TaxPercentage : ''
        }
    }

    if (customerElement) {
        customerElement.value = quotationRecordObject.Customer ? quotationRecordObject.Customer.split(";#")[0] : ''
    }
    if (validfordaysElement) {
        validfordaysElement.value = quotationRecordObject.ValidForDays ? quotationRecordObject.ValidForDays : ''
    }

    if (assignedToElement) {
        if(quotationRecordObject.InvoiceOwner){
            if(IsJsonString(quotationRecordObject.InvoiceOwner)){
                assignedToElement.value =  JSON.parse(quotationRecordObject.InvoiceOwner)[0].RecordID
            }else{
                assignedToElement.value =quotationRecordObject.InvoiceOwner.split(";#")[0]
            }
        }else{
            assignedToElement.value = ownerID
        }
    }
    if (contactElement) {
        //
        contactElement.value = quotationRecordObject.Contact ? (quotationRecordObject.Contact).split(";#")[0] : ''

    }
    if (accessToMemberElement) {
        accessToMemberElement.value = quotationRecordObject.AccessToMember ? JSON.parse(quotationRecordObject.AccessToMember)[0].RecordID : ''

    }
    if (companyOfficeElement) {
        companyOfficeElement.value = quotationRecordObject.CompanyOffice ? quotationRecordObject.CompanyOffice.split(";#")[0] : ''
    }
    if (quoteNameElement) {
        quoteNameElement.value = quotationRecordObject.InvoiceTitle ? (quotationRecordObject.InvoiceTitle) : ''
    }
    if (TermsandConditionsElement) {
        TermsandConditionsElement.value = quotationRecordObject.TermsandConditions ? (quotationRecordObject.TermsandConditions) : ''
    }
    if (CommentsElement) {
        CommentsElement.value = quotationRecordObject.Comments ? (quotationRecordObject.Comments) : ''
    }
    if (statusElement) {
        statusElement.value = quotationRecordObject.Status ? (quotationRecordObject.Status) : ''
    }
    if (quotationbyElement) {
        quotationbyElement.value = quotationRecordObject.RevenueBy ? JSON.parse(quotationRecordObject.RevenueBy)[0].RecordID : ''
    }
    if (dateIssuedElement) {
        dateIssuedElement.value = quotationRecordObject.DateIssued ? moment(quotationRecordObject.DateIssued).format('YYYY-MM-DD') : ''
    }
    if (ExpirationDateElement) {
        ExpirationDateElement.value = quotationRecordObject.DueDate ? moment(quotationRecordObject.DueDate).format('YYYY-MM-DD') : ''
    }
}
function resetquotationvalue() {

    let customerElement = document.getElementById('customer')
    let validfordaysElement = document.getElementById('validfordays')
    let assignedToElement = document.getElementById('assignedTo')
    let contactElement = document.getElementById('contact')
    let accessToMemberElement = document.getElementById('accessToMember')
    let companyOfficeElement = document.getElementById('companyOffice')
    let quoteNameElement = document.getElementById('quoteName')
    let TermsandConditionsElement = document.getElementById('TermsandConditions')
    let CommentsElement = document.getElementById('Comments')
    let dateIssuedElement = document.getElementById('dateIssued')
    let ExpirationDateElement = document.getElementById('ExpirationDate')
    let statusElement = document.getElementById('status')
    let quotationbyElement = document.getElementById('quotationby')
    let priceDiscountElement = document.getElementById('priceDiscount')
    let priceTaxElement = document.getElementById('priceTax')

    if (customerElement) {
        customerElement.value = ''
    }
    if (validfordaysElement) {
        validfordaysElement.value = ''
    }
    if (assignedToElement) {
        assignedToElement.value = ''

    }
    if (accessToMemberElement) {
        accessToMemberElement.value = ''

    }
    if (companyOfficeElement) {
        companyOfficeElement.value = ''
    }
    if (quoteNameElement) {
        quoteNameElement.value = ''
    }
    if (TermsandConditionsElement) {
        TermsandConditionsElement.value = ''
    }
    if (CommentsElement) {
        CommentsElement.value = ''
    }
    if (statusElement) {
        statusElement.value = ''
    }
    if (contactElement) {
        contactElement.value = ''
    }
    if (quotationbyElement) {
        quotationbyElement.value = ''
    }
    if (dateIssuedElement) {
        dateIssuedElement.value = ''
    }
    if (ExpirationDateElement) {
        ExpirationDateElement.value = ''
    }
    if (priceDiscountElement) {
        priceDiscountElement.value = ''
    }
    if (priceTaxElement) {
        priceTaxElement.value = ''
    }
}

function rsetquotaionObjectValues() {
    quotationRecordObject.Discount = "";
    quotationRecordObject.DiscountType = "";
    quotationRecordObject.SelectTaxType = "";
    quotationRecordObject.Tax = "";
    quotationRecordObject.SubTotal = "";
    quotationRecordObject.TotalAmount = "";

}
function resetItemsOnOrderTab() {
    rsetquotaionObjectValues();
    let SubtotalElement = document.getElementById('Subtotal');
    if (SubtotalElement) {
        SubtotalElement.innerHTML = "";
    }
    let GrandTotalElement = document.getElementById('GrandTotal');
    if (GrandTotalElement) {
        GrandTotalElement.innerHTML = "";
    }
    let discountTypeElement = document.getElementById('discount-select');
    let priceDiscountElement = document.getElementById('priceDiscount')
    let discountCalculationElement = document.getElementById('discountCalculation');
    let taxSelectElement = document.getElementById('tax-select');
    let priceTaxElement = document.getElementById('priceTax')
    let taxCalculationElement = document.getElementById('taxCalculation');
    if (discountTypeElement) {
        discountTypeElement.value = "";
    }
    if (priceDiscountElement) {
        priceDiscountElement.value = "";
    }
    if (discountCalculationElement) {
        discountCalculationElement.innerHTML = "";
    }
    if (taxSelectElement) {
        taxSelectElement.value = "";
    }
    if (priceTaxElement) {
        priceTaxElement.value = "";
    }
    if (taxCalculationElement) {
        taxCalculationElement.innerHTML = "";
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
        intermidiateRecord.ObjectID = "Customer_Invoice";
        intermidiateRecord.RecordID = null;
        intermidiateRecord.RecordFieldValues = recordFieldValueList;
        window.QafService.CreateItem(intermidiateRecord).then(response => {
            invoiceRecordID = response
            let link={
                displayName: "Invoice Preview",
                link: `${window.location.origin}/preview?type=Invoice&id=${invoiceRecordID}`
            }
            let invoiceupdate={}
            invoiceupdate['Ilink']=JSON.stringify(link)
            updateQuotationForm(invoiceupdate)
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
        intermidiateRecord.ObjectID = "Customer_Invoice";
        intermidiateRecord.RecordID = invoiceRecordID;
        intermidiateRecord.RecordFieldValues = recordFieldValueList;
        window.QafService.UpdateItem(intermidiateRecord).then(response => {
            resolve({
                response
            })
        });
    })
}

function nextFirstTabClick(current) {
    
    let quoteNameElement = document.getElementById('quoteName')
    let assignedToElement = document.getElementById('assignedTo')
    let expirationDateElement = document.getElementById('ExpirationDate')
    let customerElement = document.getElementById('customer')
    let quotevalue = quoteNameElement ? quoteNameElement.value : '';
    let assigntovalue = assignedToElement ? assignedToElement.value : '';
    let expirationDate = expirationDateElement ? expirationDateElement.value : '';
    let customervalue = customerElement ? customerElement.value : '';
    if(window.location.href.includes('crm-customer-invoice')){
        if(!customervalue){
            openAlert('Customer is required')
            return
        }
    }
    if (quotevalue && expirationDate && assigntovalue) {
        showContentInvoice('second', 2, current)
        getqouationValue()
        isSave = true
        if (invoiceRecordID) {
            getOrderItems()
        } else {
            console.log("orderItemList", orderItemList)
            orderItemObject = {
                Product: '',
                ProductCode: '',
                Terms: '',
                BillingFrequency: '',
                Quantity: '',
                ListPrice: '',
                Discount: '',
                ItemTotal: '',
            }
            orderItemList.push(orderItemObject)
            console.log("orderItemList", orderItemList)
            loadChildTable()
        }
    } else {
        if (!quotevalue) {
            openAlert('Invoice Title is required')
        } else if (!assigntovalue) {
            openAlert('Owner is required')
        }
        else if (!expirationDate) {
            openAlert('Expiration Date is required')
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

function nextSecondTabClick(current) {
    showContentInvoice('third', 3, current)
    saveChildTable()

    updateQuotationForm(priceDetails)
    getCompanySetting()
}

function backtoSecondTabClick(current) {
    showContentInvoice('second', 2, current)
    orderItemList = []
    if (invoiceRecordID) {
        getOrderItems()
    }
}

function saveChildTable() {

    let records = [];
    let intermidiateRecord;
    let recordFieldValues = [];
    orderItemList.forEach((element, index) => {
        tableRecordID = element.RecordID
        element.ParentID = invoiceRecordID
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
        intermidiateRecord["ParentRecordID"] = invoiceRecordID ? invoiceRecordID : "";
        intermidiateRecord.RecordFieldValues = recordFieldValues;
        records.push(intermidiateRecord);

    });
    window.QafService.UpdateItems(records).then((response) => {
    });
}

function getOrderItems() {
    
    let fields = orderItemsFields;
    fields.push('ParentRecordID')
    let objectName = "Order_Items";
    let fieldList = fields
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `ParentRecordID='${invoiceRecordID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((orders) => {
        
        if (Array.isArray(orders) && orders.length > 0) {
            orderItemList = orders.sort((a, b) => new Date(a.CreatedDate) - new Date(b.CreatedDate))
            setValueInPriceObject()
            loadChildTable()
        } else {
            orderItemObject = {
                Product: '',
                ProductCode: '',
                Terms: '',
                BillingFrequency: '',
                Quantity: '',
                ListPrice: '',
                Discount: '',
                ItemTotal: '',
            }
            orderItemList.push(orderItemObject)
            priceDetails = []
            orderItemList = removeEmptyOrderItemList(orderItemList);
            resetItemsOnOrderTab();
            loadChildTable()
            // if (orderItemList.length >0 && orderItemList.length <2) {
               
            // }
            setValueInPriceObject();
        }
    });
}


function removeEmptyOrderItemList(orderItemListArray) {
    let cleanedList = [];
    orderItemListArray.forEach(item => {
        // Check if the object has more than one property
        if (Object.keys(item).length > 1) {
            // Check if all properties are empty
            let allEmpty = true;
            for (let key in item) {
                if (item[key] !== "") {
                    allEmpty = false;
                    break;
                }
            }
            // If not all properties are empty, add to cleanedList
            if (!allEmpty) {
                cleanedList.push(item);
            }
        } else {
            cleanedList.push(item);
        }
    });
    return cleanedList;
}

function onChangeExpenseLedeger(index) {
    orderItemList.forEach((val, i) => {
        if (i === parseInt(index)) {
            let expenseLedgerElement = document.getElementById(`productInv-${index}`);
            if (expenseLedgerElement) {
                let expenseLedger = productList.filter(a => a.RecordID === expenseLedgerElement.value)
                val.Product = expenseLedger[0].RecordID + ";#" + expenseLedger[0].ProductName
            }
            calculateTotal(index)

        }
    })
}

function onskuinput(e, index) {
    orderItemList.forEach((val, i) => {
        if (i === parseInt(index)) {
            let skuElement = document.getElementById(`skuInv-${index}`);
            if (skuElement) {
                val.ProductCode = (skuElement.value)
            }
        }
    })
}

function onTermsinput(e, index) {
    orderItemList.forEach((val, i) => {
        if (i === parseInt(index)) {
            let termElement = document.getElementById(`Termsinv-${index}`);
            if (termElement) {
                val.Terms = (termElement.value)
            }
        }
    })
}

function onQuantityinput(e, index) {
    orderItemList.forEach((val, i) => {
        if (i === parseInt(index)) {
            let termElement = document.getElementById(`Quantityinv-${index}`);
            if (termElement) {
                val.Quantity = (termElement.value)
            }
            calculateTotal(index)
        }
    })
}

function calculateTotal(index) {
    orderItemList.forEach((val, i) => {
        if (i === parseInt(index)) {
            let termElement = document.getElementById(`ItemTotalInv-${index}`);

            if (termElement) {
                let totalAmount = (val.Quantity * val.ListPrice)
                let total = (val.Quantity * val.ListPrice) * (val.Discount / 100)
                val.ItemTotal = totalAmount - total
                termElement.innerHTML = val.ItemTotal.toFixed(2)
            }
        }
    })
    setValueInPriceObject()
}

function setValueInPriceObject() {
debugger
    priceDetails = {
        Subtotal: '',
        Discount: '',
        Tax: '',
        TotalAmount: '',
        SelectTaxType: "",
        DiscountType: "",
            DiscountPercentage:'',
            TaxPercentage:''
    }

    // let subtotal = orderItemList.reduce((acc, value) => acc + value.ItemTotal, 0);
    // priceDetails.SubTotal = parseFloat(subtotal.toFixed(2))

    let subtotal = orderItemList.reduce((acc, value) => acc + Number(value.ItemTotal), 0);
    priceDetails.SubTotal = parseFloat(subtotal.toFixed(2));

    let priceDiscountSelectElement = document.getElementById('discount-select')
    if (priceDiscountSelectElement) {
        let value = priceDiscountSelectElement.value;
        priceDetails.DiscountType = value
    }
    let priceDiscountElement = document.getElementById('priceDiscount')
    if (priceDiscountElement) {
        if(priceDetails.DiscountType==='Fixed'){
            priceDetails.Discount = priceDiscountElement.value ? Number(priceDiscountElement.value) : ''
        }else{
            priceDetails.DiscountPercentage = priceDiscountElement.value ? Number(priceDiscountElement.value) : ''
        }
    }
    let taxTypeSelectElement = document.getElementById('tax-select')
        if (taxTypeSelectElement) {
            let value = taxTypeSelectElement.value;
            priceDetails.SelectTaxType = value
        }
    let pricetaxElement = document.getElementById('priceTax')
    if (pricetaxElement) {
        if(priceDetails.SelectTaxType==='Fixed'){
            priceDetails.Tax = pricetaxElement.value ? parseFloat(pricetaxElement.value) : ''
        }else{
            priceDetails.TaxPercentage = pricetaxElement.value ? parseFloat(pricetaxElement.value) : ''
        }
    }
    priceDetails.TotalAmount = (priceDetails.SubTotal)

    let discountSelectElement1 = document.getElementById('discount-select')
    if (discountSelectElement1) {
        let value = discountSelectElement1.value;
        priceDetails.DiscountType = value
    }

    let discountTotal = 0
    if (priceDetails.Discount||priceDetails.DiscountPercentage) {
        let discountSelectElement = document.getElementById('discount-select')
        if (discountSelectElement) {
            let value = discountSelectElement.value;
            priceDetails.DiscountType = value
            if (value) {
                if (value === 'Fixed') {
                    discountTotal = (priceDetails.Discount)

                } else {
                    discountTotal = priceDetails.TotalAmount * (priceDetails.DiscountPercentage / 100)
                }
            }
        }

        let discountCalculationElement = document.getElementById('discountCalculation');
        if (discountCalculationElement) {
            discountCalculationElement.innerHTML = parseFloat(discountTotal).toFixed(2)
        }

    }
    else {
        let discountCalculationElement = document.getElementById('discountCalculation');
        if (discountCalculationElement) {
            discountCalculationElement.innerHTML = parseFloat(discountTotal).toFixed(2);
        }

    }
    priceDetails.Discount = discountTotal

    priceDetails.TotalAmount = priceDetails.TotalAmount - discountTotal
    let taxTotal = 0
    let taxSelectElement = document.getElementById('tax-select')
    if (taxSelectElement) {
        let value = taxSelectElement.value;
        priceDetails.SelectTaxType = value
    }
    if (priceDetails.Tax||priceDetails.TaxPercentage) {

        let taxSelectElement = document.getElementById('tax-select')
        if (taxSelectElement) {
            let value = taxSelectElement.value;
            priceDetails.SelectTaxType = value
            if (value) {
                if (value === 'Fixed') {
                    taxTotal = (priceDetails.Tax)

                } else {
                    taxTotal = priceDetails.TotalAmount * (priceDetails.TaxPercentage / 100)
                }
            }
        }

        let taxCalculationElement = document.getElementById('taxCalculation');
        if (taxCalculationElement) {
            taxCalculationElement.innerHTML = parseFloat(taxTotal).toFixed(2)
        }
    }
    else {
        let taxCalculationElement = document.getElementById('taxCalculation');
        if (taxCalculationElement) {
            taxCalculationElement.innerHTML = parseFloat(taxTotal).toFixed(2)
        }
    }

    priceDetails.TotalAmount = parseFloat(((priceDetails.TotalAmount) + taxTotal)).toFixed(2)
    setValueInPricing()
}

function taxTypeChange() {
    //
    let taxTypeElement = document.getElementById('tax-select');
    if (taxTypeElement) {
        priceDetails.SelectTaxType = taxTypeElement.value
    }
    setValueInPriceObject()
}

function discuontTypeChange() {
    let discountTypeElement = document.getElementById('discount-select');
    if (discountTypeElement) {
        priceDetails.DiscountType = discountTypeElement.value
    }
    setValueInPriceObject()
}

function onListPriceinput(e, index) {
    orderItemList.forEach((val, i) => {
        if (i === parseInt(index)) {
            let termElement = document.getElementById(`ListPriceinv-${index}`);
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
            let termElement = document.getElementById(`Discountinv-${index}`);
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
            let BillingFrequencyElement = document.getElementById(`BillingFrequencyinv-${index}`);
            if (BillingFrequencyElement) {
                val.BillingFrequency = BillingFrequencyElement.value
            }
        }
    })
}

function ononItemTotalinput(index) {
    orderItemList.forEach((val, i) => {
        if (i === parseInt(index)) {
            let ItemTotalElement = document.getElementById(`ItemTotalInv-${index}`);
            if (ItemTotalElement) {
                val.TotalAmount = ItemTotalElement.value.toFixed(2)
            }
        }
    })
}


function loadChildTable() {

    let perticularTable = ""
    orderItemList.forEach((perticular, index) => {
        perticularTable += `<tr class="qaf-tr qaf-tr-data">
        <td class="qaf-td ledger-Name-cell">
            <select class="fs-input tableinput ledgerName" id="productInv-${index}" name="product" onchange="onChangeExpenseLedeger('${index}')"></select>
        </td>
         <td class="qaf-td">
            <input type="text" class="fs-input amount tableinput" id="skuInv-${index}" name="ProductCode"
                autocomplete="off" required oninput="onskuinput(this,'${index}')" readonly>
        </td>
         <td class="qaf-td">
            <input type="text" class="fs-input Terms tableinput" id="Termsinv-${index}" name="Terms"
                autocomplete="off" required oninput="onTermsinput(this,'${index}')"
                >
        </td>
   <td class="qaf-td ">
            <select class="fs-input tableinput ledgerName" id="BillingFrequencyinv-${index}" name="BillingFrequency" onchange="onChangeBillingFrequency('${index}')"></select>
        </td>
   <td class="qaf-td">
            <input type="number" class="fs-input Quantity tableinput currency-field" id="Quantityinv-${index}" name="Quantity"
                autocomplete="off" required oninput="onQuantityinput(this,'${index}')"
                >
        </td>
   <td class="qaf-td">
            <input type="number" class="fs-input ListPrice tableinput currency-field" id="ListPriceinv-${index}" name="ListPrice"
                autocomplete="off" required oninput="onListPriceinput(this,'${index}')"
                >
        </td>
   <td class="qaf-td">
            <input type="number" class="fs-input Discount tableinput currency-field" id="Discountinv-${index}" name="Discount"
                autocomplete="off" required oninput="onDiscountinput(this,'${index}')"
                >
        </td>
        <td class="qaf-td">
       <div id="ItemTotalInv-${index}" class="currency-field itemtotal-child"></div>
        
        </td>
        <td class="qaf-td row-delete-td">
        <div class="action-delete-row" >
            <button type="button" class="row-add row-delete" onclick="deleteRow('${index}')">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
            </div>
        </td>
        </tr>`

    })


    let tableStructure = `
    <div class='table-name'>Product and Services</div>
        <table class="qaf-table">
            <thead>
                 <tr class="qaf-tr">
                    <th class="qaf-th sub-table">Product</th>
                    <th class="qaf-th sub-table">SKU</th>
                    <th class="qaf-th sub-table">Terms</th>
                    <th class="qaf-th sub-table">Billing Frequency</th>
                    <th class="qaf-th sub-table currency-field">Quantity</th>
                        <th class="qaf-th sub-table currency-field">List Price</th>
                        <th class="qaf-th sub-table currency-field">Discount</th>
                        <th class="qaf-th sub-table currency-field">Item Total</th>
                    <th class="qaf-th sub-table action-button-th"></th>
                </tr>
            </thead>
            <tbody id="tableBody">
                ${perticularTable}
            </tbody>
        </table>
    `;
    tableStructure += `  <button  class="row-add" onclick="addRowExpensePerticular()">
    <i class="fa fa-plus"> </i>&nbsp;Add New
</button>`
    const tableContainer = document.getElementById('tablecontainer');
    tableContainer.innerHTML = tableStructure;
    setExpernseperticularTable()
    expenseLedgerOnDropdown()
    billingFrequesyOnDropdown()
    setValueInPriceObject()
}

function addRowExpensePerticular() {
    orderItemObject = {
        Product: '',
        ProductCode: '',
        Terms: '',
        BillingFrequency: '',
        Quantity: '',
        ListPrice: '',
        Discount: '',
        ItemTotal: '',
    }
    orderItemList.push(orderItemObject)
    loadChildTable()
}

function deleteRow(index) {
    
    let order = orderItemList[index]
    if (window.QafPageService) {
        
        if (order.RecordID) {
            orderItemList.splice((parseInt(index)), 1);
            window.QafPageService.DeleteItem(order.RecordID, function () {
                orderItemList = []
                getOrderItems()
            });
        } else {
            orderItemList.splice((parseInt(index)), 1);
            getOrderItems()
        }
    }



}

function billingFrequesyOnDropdown() {
    orderItemList.forEach((perticular, index) => {
        let expenseLedgerElement = document.getElementById(`BillingFrequencyinv-${index}`);
        let options = ``; ``
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
        let expenseLedgerElement = document.getElementById(`productInv-${index}`);
        let options = `<option value=''> Select Product</option>`; ``
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
        let expense_ledger_name = document.getElementById(`productInv-${index}`);
        if (expense_ledger_name) {
            expense_ledger_name.value = perticular.Product ? perticular.Product.split(";#")[0] : ''
        }
        let skuElement = document.getElementById(`skuInv-${index}`);
        if (skuElement) {
            skuElement.value = perticular.ProductCode ? perticular.ProductCode : ''
        }
        let TermsElement = document.getElementById(`Termsinv-${index}`);
        if (TermsElement) {
            TermsElement.value = perticular.Terms ? perticular.Terms : ''
        }
        let BillingFrequencyElement = document.getElementById(`BillingFrequencyinv-${index}`);
        if (BillingFrequencyElement) {
            BillingFrequencyElement.value = perticular.BillingFrequency ? perticular.BillingFrequency : ''
        }
        let UnitPriceElement = document.getElementById(`ListPriceinv-${index}`);
        if (UnitPriceElement) {
            UnitPriceElement.value = perticular.ListPrice ? perticular.ListPrice : ''
        }
        let QuantityElement = document.getElementById(`Quantityinv-${index}`);
        if (QuantityElement) {
            QuantityElement.value = perticular.Quantity ? perticular.Quantity : ''
        }
        let DiscountElement = document.getElementById(`Discountinv-${index}`);
        if (DiscountElement) {
            DiscountElement.value = perticular.Discount ? perticular.Discount : ''
        }
        let ItemTotalElement = document.getElementById(`ItemTotalInv-${index}`);
        if (ItemTotalElement) {
            ItemTotalElement.innerHTML = perticular.ItemTotal ? perticular.ItemTotal.toFixed(2) : ''
        }
    })
}

function onChangeExpenseLedeger(index) {
    orderItemList.forEach((val, i) => {
        if (i === parseInt(index)) {
            let expenseLedgerElement = document.getElementById(`productInv-${index}`);
            if (expenseLedgerElement) {
                let product = productList.filter(a => a.RecordID === expenseLedgerElement.value)
                val.Product = product[0].RecordID + ";#" + product[0].ProductName;
                val.ProductCode = product[0].ProductCode
                val.Terms = product[0].Terms
                val.BillingFrequency = product[0].BillingFrequency
                val.ListPrice = product[0].UnitPrice
                val.Discount = product[0].Discount
                setValueInProduct(index, product[0])

            }
        }
    })
}

function setValueInProduct(index, product) {
    let skuElement = document.getElementById(`skuInv-${index}`);
    if (skuElement) {
        skuElement.value = product.ProductCode ? product.ProductCode : ''
    }
    let TermsElement = document.getElementById(`Termsinv-${index}`);
    if (TermsElement) {
        TermsElement.value = product.Terms ? product.Terms : ''
    }
    let BillingFrequencyElement = document.getElementById(`BillingFrequencyinv-${index}`);
    if (BillingFrequencyElement) {
        BillingFrequencyElement.value = product.BillingFrequency ? product.BillingFrequency : ''
    }
    let UnitPriceElement = document.getElementById(`ListPriceinv-${index}`);
    if (UnitPriceElement) {
        UnitPriceElement.value = product.UnitPrice ? product.UnitPrice : ''
    }
    let DiscountElement = document.getElementById(`Discountinv-${index}`);
    if (DiscountElement) {
        DiscountElement.value = product.Discount ? product.Discount : ''
    }
}

function setValueInPricing() {


    let SubtotalElement = document.getElementById('Subtotal');
    if (SubtotalElement) {
        SubtotalElement.innerHTML = priceDetails.SubTotal ? window.localStorage.CurrencyIcon + parseFloat(priceDetails.SubTotal).toFixed(2) : ''
    }
    // let DiscountElement = document.getElementById('priceDiscount');
    // if (DiscountElement) {
    //     DiscountElement.value = priceDetails.Discount ? priceDetails.Discount : ''
    // }
    // let TaxElement = document.getElementById('priceTax');
    // if (TaxElement) {
    //     TaxElement.value = priceDetails.Tax ? priceDetails.Tax : ''
    // }
    let GrandTotalElement = document.getElementById('GrandTotal');
    if (GrandTotalElement) {
        GrandTotalElement.innerHTML = priceDetails.TotalAmount ? window.localStorage.CurrencyIcon + parseFloat(priceDetails.TotalAmount).toFixed(2) : ''
        priceDetails.TotalAmount = priceDetails.TotalAmount ? window.localStorage.CurrencyIcon + parseFloat(priceDetails.TotalAmount).toFixed(2) : ''
    }

    let taxSelectElement = document.getElementById('tax-select');
    if (taxSelectElement) {
        taxSelectElement.value = priceDetails.SelectTaxType
            ? priceDetails.SelectTaxType : ''
    }
    let discountTypeElement = document.getElementById('discount-select');
    if (discountTypeElement) {
        discountTypeElement.value = priceDetails.DiscountType ? priceDetails.DiscountType : ''
    }
    let discountTotal = 0
    let taxTotal = 0

    priceDetails.TotalAmount = (priceDetails.SubTotal)
    let discountprice = 0
    let priceDiscountElement = document.getElementById('priceDiscount')
    if (priceDiscountElement) {
        if(discountTypeElement.value==='Fixed'){
            discountprice=priceDetails.Discount?priceDetails.Discount:priceDiscountElement.value ? Number(priceDiscountElement.value) : ''
        }else{
              discountprice=priceDetails.DiscountPercentage?priceDetails.DiscountPercentage:priceDiscountElement.value ? Number(priceDiscountElement.value) : ''
        }
        priceDiscountElement.value=discountprice
    }
    if (discountprice) {
        let discountSelectElement = document.getElementById('discount-select')
        if (discountSelectElement) {
            let value = discountSelectElement.value;
            if (value) {
                if (value === 'Fixed') {
                    discountTotal = discountprice

                } else {
                    discountTotal = priceDetails.TotalAmount * (discountprice / 100)
                }
            }
        }

        let discountCalculationElement = document.getElementById('discountCalculation');
        if (discountCalculationElement) {
            discountCalculationElement.innerHTML = parseFloat(discountTotal).toFixed(2);
        }
    }
    else {
        let discountCalculationElement = document.getElementById('discountCalculation');
        if (discountCalculationElement) {
            discountCalculationElement.innerHTML = parseFloat(discountTotal).toFixed(2);
        }

    }
    priceDetails.Discount = discountTotal
    priceDetails.TotalAmount = priceDetails.TotalAmount - discountTotal;

    let taxprice = 0

    let priceTaxElement = document.getElementById('priceTax')
    if (priceTaxElement) {
        if(priceTaxElement.value==='Fixed'){
            taxprice=priceDetails.Tax?priceDetails.Tax:priceTaxElement.value ? Number(priceTaxElement.value) : ''
        }else{
            taxprice=priceDetails.TaxPercentage?priceDetails.TaxPercentage:priceTaxElement.value ? Number(priceTaxElement.value) : ''
        }
        priceTaxElement.value=taxprice
    }

    if (taxprice) {
        let taxSelectElement = document.getElementById('tax-select')
        if (taxSelectElement) {
            let value = taxSelectElement.value;
            if (value) {
                if (value === 'Fixed') {
                    taxTotal = (taxprice)

                } else {
                    taxTotal = priceDetails.TotalAmount * (taxprice / 100)
                }
            }
        }

        let taxCalculationElement = document.getElementById('taxCalculation');
        if (taxCalculationElement) {
            taxCalculationElement.innerHTML = parseFloat(taxTotal).toFixed(2);
        }

    }
    else {
        let taxCalculationElement = document.getElementById('taxCalculation');
        if (taxCalculationElement) {
            taxCalculationElement.innerHTML = parseFloat(taxTotal).toFixed(2);
        }

    }

    priceDetails.Tax = taxTotal
    priceDetails.TotalAmount = parseFloat(((priceDetails.TotalAmount) + taxTotal).toFixed(2))


    //Code MY
    // if (!priceDetails.DiscountType && !priceDetails.Discount) {
    //     let discountSelectElement = document.getElementById('discount-select')
    //     if (discountSelectElement) {
    //         if(quotationRecordObject){
    //             discountSelectElement.value = quotationRecordObject.DiscountType ? quotationRecordObject.DiscountType : ""

    //         }
    //     }
    //     let calculatedDiscount = 0
    //     if (discountSelectElement) {
    //         let value = discountSelectElement.value;
    //         if (value) {
    //             if (value === 'Fixed') {
    //                 calculatedDiscount = quotationRecordObject.Discount
    //             } else {
    //                 calculatedDiscount = (quotationRecordObject.Discount / (priceDetails.SubTotal)) * 100;
    //             }
    //         }
    //     }
    //     let priceDiscountElement = document.getElementById('priceDiscount')
    //     if (priceDiscountElement) {
    //         // priceDiscountElement.value = parseFloat(calculatedDiscount).toFixed(2)
    //         priceDiscountElement.value = formatNumber(calculatedDiscount);
    //     }
    // }

    // if (!priceDetails.SelectTaxType && !priceDetails.Tax) {
    //     let taxSelectElementnew = document.getElementById('tax-select')
    //     if (taxSelectElementnew) {
    //         if(quotationRecordObject){
    //             taxSelectElementnew.value = quotationRecordObject.SelectTaxType ? quotationRecordObject.SelectTaxType : "";
    //         }
    //     }
    //     let calculatedTax = 0
    //     if (taxSelectElement) {
    //         let value = taxSelectElement.value;
    //         if (value) {
    //             if(quotationRecordObject){
    //             if (value === 'Fixed') {
                   
    //                 calculatedTax = quotationRecordObject.Tax

    //             } else {
    //                 //Calculate value subtotal minus dicount 
    //                 let calculatedTotal = (priceDetails.SubTotal - quotationRecordObject.Discount)
    //                 calculatedTax = ((quotationRecordObject.Tax / calculatedTotal)) * 100;
    //             }}
    //         }
    //     }
    //     let priceTaxElement = document.getElementById('priceTax')
    //     if (priceTaxElement) {
    //         // priceTaxElement.value = parseFloat(calculatedTax).toFixed(2)
    //         priceTaxElement.value = formatNumber(calculatedTax);
    //     }
    // }
}

function formatNumber(number) {
    if (number === Math.floor(number)) {
        return number.toString();
    } else {
        let formattedNumber = number.toFixed(2);
        return parseFloat(formattedNumber).toString();
    }
}

function backtofirstTabClick(id) {
    showContentInvoice('first', 1, id)

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

function formatDate(date) {
    if (date) {
        return moment(date).format("DD MMMM YYYY")
    }
    return " ";
}

function getValidDays() {
    if (quotationRecordObject.DateIssued && quotationRecordObject.DueDate) {

        let dateOne = moment(quotationRecordObject.DateIssued);
        let dateTwo = moment(quotationRecordObject.DueDate);
        // Function call
        let result = dateOne.diff(dateTwo, 'days')
        return Math.abs(result)
    }
    return 0
}
function IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

function setPreviewData() {
    let orders = "";
    orderItemList.forEach((value, index) => {
        orders += `
                <tr>
                    <td class="item-width-si">${index + 1}</td>
                    <td>${value.Product ? value.Product.split(";#")[1] : ""}</td>
                    <td class="reviwe-td">${value.Quantity ? value.Quantity : ""}</td>
                    <td class="reviwe-td">${value.ListPrice ? typeof(value.ListPrice)==='string'? value.ListPrice:value.ListPrice.toFixed(2) : ""}</td>
                    <td class="reviwe-td">${value.Discount ? value.Discount.toFixed(2) : "0.00"}</td>
                    <td class="reviwe-td">${value.ItemTotal ? value.ItemTotal.toFixed(2) : ""}</td>
                </tr>
            `
    })
    //
    let customervalue = ""
    let contactvalue = ""

    quotationRecordObject.TermsandConditions = quotationObject.TermsandConditions;
    quotationRecordObject.DateIssued = quotationObject.DateIssued;
    quotationRecordObject.ExpirationDate = quotationObject.ExpirationDate;
    if (quotationRecordObject.Customer) {

        let customer = customersList.filter(a => a.RecordID === quotationRecordObject.Customer.split(';#')[0])
        if (customer && customer.length > 0) {
            let valueList = [];
            let subvalue = []
            if (customer[0].BillingCity) {
                subvalue.push(customer[0].BillingCity.split(";#")[1])
            }
            if (customer[0].State) {
                subvalue.push(customer[0].State.split(";#")[1])
            }
            if (customer[0].Name) {
                valueList.push(customer[0].Name)
            }
            let subvaluetext = subvalue.join(",&nbsp;")
            if (subvaluetext) {
                valueList.push(subvaluetext)
            }
            if (customer[0].Country) {
                valueList.push(customer[0].Country.split(";#")[1])
            }
            if (customer[0].Email) {
                valueList.push(customer[0].Email)
            }
            let customervaluestring = valueList.join('<br>')
            customervalue = `<p> ${customervaluestring}<!----> </p>`
        }
    }
    if (quotationRecordObject.Contact) {
        let contact = contactList.filter(a => a.RecordID === quotationRecordObject.Contact.split(';#')[0])
        if (contact && contact.length > 0) {

            let valueList = [];
            let subvalue = []
            // if (contact[0].City) {
            //     subvalue.push(contact[0].City.split(";#")[1])
            // }
            // if (contact[0].StateProvince) {
            //     subvalue.push(contact[0].StateProvince.split(";#")[1])
            // }
            // if (contact[0].Country) {
            //     subvalue.push(contact[0].Country.split(";#")[1])
            // }
            // if (contact[0].PostalCode) {
            //     subvalue.push(contact[0].PostalCode.split(";#")[1])
            // }
            if (contact[0].FirstName) {
                valueList.push(contact[0].FirstName + " " + contact[0].LastName)
            }
            // if (contact[0].StreetAddress) {
            //     valueList.push(contact[0].StreetAddress)
            // }
            let subvaluetext = subvalue.join(",&nbsp;")
            if (subvaluetext) {
                valueList.push(subvaluetext)
            }
            if (contact[0].Mobile) {
                valueList.push(contact[0].Mobile)
            }
            if (contact[0].Email) {
                valueList.push(contact[0].Email)
            }
            let contactvaluestring = valueList.join('<br>')
            contactvalue = `<p> ${contactvaluestring}<!----> </p>`
        }
    }
    let image = (window.location.origin.includes('localhost') ? 'https:/qaffirst.quickappflow.com' : window.location.origin) + "/Attachment/downloadfile?fileUrl=" + encodeURIComponent(getURLFromJson(companySetting.Logo))
    let preview = `<div class="hrz-dynamic-frm-per">
                    <div class="print-btn"><button
                            class="btn btn-primary m-t-5 m-b-20 no-print m-r-5">Download</button></div>
                    <loader><!----></loader><!---->
                    <div class="hrz-n-r-container-per custom-hrz-n-r-container-per" id="quotation-preview">
                        <div class="company-info">
                            <div class="company-logo"><!----><img alt=""
                                    src="${image}">
                            </div><!----><!---->
                            <div class="company-details m-t-5">
                                <p>${companySetting.Title} <br> ${companySetting.City} <br> ${companySetting.Country} <br> <br> </p>
                                <p class="account-detail"><!----><br> <br> <br> <br> </p>
                            </div>
                             <div class="quotation-to m-t-20 m-b-20">
                             To,
                              <div class="quotation-name ${contactvalue ? 'm-t-5' : ""}"> ${contactvalue ? contactvalue : ""}
                            </div>
                            <div class="quotation-name ${customervalue ? 'm-t-10' : ""}">  ${customervalue ? customervalue : ""}
                            
                            </div>
                        </div>

                            <div class="company-details m-t-10">
                                <p><b>Date Issued:&nbsp;</b>${formatDate(quotationRecordObject.DateIssued)}</p><!----><!---->
                                <p class="account-detail"><b>Valid Till:&nbsp;</b>${formatDate(quotationRecordObject.DueDate)} </p>
                            </div>
                        </div>
                        <div class="quoate-id">
                            <p>Invoice No: ${quotationRecordObject.InvoiceNo}</p>
                        </div>
                                        
                        <div class="table-order-items">
<div class='table-name'>Product and Services</div>
                            <table>
                                <thead>
                                    <tr class="header-rowView">
                                        <th class="product-td">SN</th>
                                        <th class="product-td" style="width: 30%;">Item</th>
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
                                        <td class="item-width reviwe-td-left">Sub Total</td>
                                        <td class="item-width reviwe-td">${parseFloat(priceDetails.SubTotal).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td class="item-width reviwe-td-left">Discount</td>
                                        <td class="item-width reviwe-td">${priceDetails.Discount ? parseFloat(priceDetails.Discount).toFixed(2) : "0.00"}</td>
                                    </tr>
                                    <tr>
                                        <td class="item-width reviwe-td-left">Tax</td>
                                        <td class="item-width reviwe-td">${priceDetails.Tax ? parseFloat(priceDetails.Tax).toFixed(2) : "0.00"}</td>
                                    </tr>
                                    <!---->
                                    <tr>
                                        <td class="item-width reviwe-td-left">Total Payable</td>
                                        <td class="item-width reviwe-td">${parseFloat(priceDetails.TotalAmount).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div><!---->
                        <div class="m-t-70"><!---->
                            <p class="m-b-20">Invoice validity:&nbsp;${getValidDays()}&nbsp;day(S) </p>
                        </div>
                        <div>
                            <div>
                                <p class=" term-condition">Terms and Conditions</p> 
                                <pre class="pre-terms">${quotationRecordObject.TermsandConditions ? quotationRecordObject.TermsandConditions : (termandsettingValue ? termandsettingValue : "")}</pre>
                            </div>
                        </div>
                        <p class="signature">${quotationRecordObject.CreatedByName}</p>
                    </div>
                </div>`

    document.getElementById('previewQuotation').innerHTML = preview;
}