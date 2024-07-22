var urlParams = new URLSearchParams(window.location.search);
var previewType = urlParams.get('type');
var quotationRecordID = urlParams.get('qid');
var invoiceRecordID = urlParams.get('cid')

if (!quotationRecordID) {
    quotationRecordID = urlParams.get('id');
}
if (!invoiceRecordID) {
    invoiceRecordID = urlParams.get('id');
    if(window.location.href.includes('invoice-details')){
    invoiceRecordID = urlParams.get('iid');
    previewType="Invoice"
    }
}
var ParentRecordID = ""
var companySetting = [];
var quotationRecord = []
var invoiceRecord = []
var orderItemList = []
var opportunityList = []
var customerList = [];
var contactList = []
var CRM_Settings = [];
var ParentReferenceID = ""
var customerID = ""
var contactID = ""
var defaultTermsConiditions = ""
var quotationTerms = "";
var invoiceTerms = "";
qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        

        getCompanySetting()
        if (previewType&&previewType.toLowerCase() === "Invoice".toLowerCase()) {
            ParentRecordID = invoiceRecordID;
            getInvoice();
        }
        else {
            ParentRecordID = quotationRecordID;
            getQuotation()
        }
        clearInterval(qafServiceLoaded);
    }
}, 10);


function getInvoice() {
    quotationRecord = []
    let objectName = "Customer_Invoice";
    let list = 'RecordID,DateIssued,DueDate,Contact,InvoiceNo,Customer,TermsandConditions,ValidForDays,ParentReferenceID,BillToAddress,InvoiceOwner,QuoteName,Status,ExpirationDate,QuotationDocument,SubTotal,Discount,Tax,TotalAmount,AccessToMember,Opportunity,CompanyOffice,RevenueBy';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `RecordID='${invoiceRecordID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((quotations) => {
        if (Array.isArray(quotations) && quotations.length > 0) {

            quotationRecord = quotations[0]
            ParentReferenceID = quotationRecord.ParentReferenceID ? quotationRecord.ParentReferenceID : ""
            customerID = quotationRecord.Customer ? quotationRecord.Customer.split(";#")[0] : "";
            contactID = quotationRecord.Contact ? quotationRecord.Contact.split(";#")[0] : "";
        }
        getOrderItems();

    });
}


function getQuotation() {
    quotationRecord = []
    let objectName = "Quotation";
    let list = 'RecordID,DateIssued,DueDate,AutoUnique,Contact,Customer,TermsandConditions,ValidForDays,BilltoName,ParentReferenceID,BillToAddress,QuoteOwner,QuoteName,Status,ExpirationDate,QuotationDocument,Subtotal,Discount,Tax,GrandTotal,AccessToMember,Opportunity,CompanyOffice';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `RecordID='${quotationRecordID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((quotations) => {
        if (Array.isArray(quotations) && quotations.length > 0) {
            quotationRecord = quotations[0]
            ParentReferenceID = quotationRecord.ParentReferenceID ? quotationRecord.ParentReferenceID : ""
            customerID = quotationRecord.Customer ? quotationRecord.Customer.split(";#")[0] : "";
            contactID = quotationRecord.Contact ? quotationRecord.Contact.split(";#")[0] : "";
        }
        getOrderItems();

    });
}

function getOrderItems() {

    orderItemList = []
    let objectName = "Order_Items";
    let list = 'Product,Quantity,ListPrice,ItemSubTotal,Discount,Tax,ItemTotal,RecordID,OrderDate,ParentID,SGST,CGST';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `ParentRecordID='${ParentRecordID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((orders) => {
        if (Array.isArray(orders) && orders.length > 0) {

            orderItemList = orders.sort((a, b) => new Date(a.CreatedDate) - new Date(b.CreatedDate))
        }
        getCRM_Settings()
    });
}


function getOpportunity() {
    if (ParentReferenceID) {
        opportunityList = []
        let objectName = "Opportunity";
        let list = 'RecordID,CustomerName,LeadSource,City,Province,Country,ZIP,Email,MobileNumber,Company';
        let fieldList = list.split(",");
        let pageSize = "20000";
        let pageNumber = "1";
        let orderBy = "true";
        let whereClause = `RecordID='${ParentReferenceID}'`;
        window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((opport) => {
            if (Array.isArray(opport) && opport.length > 0) {
                opportunityList = opport
                getCRM_Settings()
            }
        });
    }
    else {
        getCRM_Settings()
    }

}

function getCRM_Settings() {
    let objectName = "CRM_Settings";
    let list = 'RecordID,SettingName,SettingValue';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = '';
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((terms) => {
        if (Array.isArray(terms) && terms.length > 0) {
            defaultTermsConiditions = terms
            quotationTerms = defaultTermsConiditions.find(term => term.SettingName === "QUOTATION_TERMS").SettingValue;
            invoiceTerms = defaultTermsConiditions.find(term => term.SettingName === "INVOICE_TERMS").SettingValue;
            getContact()
        }
        else {
            getContact()
        }
    });


}

function getContact() {
    contactList = []
    let objectName = "Contact";
    let list = 'RecordID,FirstName,LastName,PostalCode,Country,StateProvince,StreetAddress,City,Mobile,Email';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `RecordID='${contactID}'`;
    if (contactID) {
        window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((contacts) => {
            if (Array.isArray(contacts) && contacts.length > 0) {
                contactList = contacts
                getCustomer()
            }
        });
    }
    else {
        getCustomer()
    }
}

function getCustomer() {
    customerList = []
    let objectName = "Customers";
    let list = 'Name,Email,BillingCity,RecordID,State,BillingZipPostalCode,Country';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `RecordID='${customerID}'`;
    if (customerID) {
        window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((customer) => {
            if (Array.isArray(customer) && customer.length > 0) {
                customerList = customer
                setPreviewData();
            }
        });
    }
    else {
        setPreviewData();
    }
}

function getCompanySetting() {
    companySetting = []
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
        }
    });

}

function downloadResume(url) {
    return window.location.origin + "/Attachment/downloadfile?fileUrl=" + encodeURIComponent(getURLFromJson((url)))
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


function getDatesforvalidity() {

    if (previewType&&previewType.toLowerCase() === "Invoice".toLowerCase()) {
        return `<p><b>Date Issued:&nbsp;</b>${formatDate(quotationRecord.DateIssued)}</p><!----><!---->
                                <p class="account-detail"><b>Valid Till:&nbsp;</b>${formatDate(quotationRecord.DueDate)} </p>`
    }
    else {
        return `<p><b>Date Issued:&nbsp;</b>${formatDate(quotationRecord.DateIssued)}</p><!----><!---->
                                <p class="account-detail"><b>Valid Till:&nbsp;</b>${formatDate(quotationRecord.ExpirationDate)} </p>`
    }
}

function setPreviewData() {
    let orders = "";

    orderItemList.forEach((value, index) => {
        orders += `
                <tr>
                    <td class="item-width-si">${index + 1}</td>
                    <td>${value.Product ? value.Product.split(";#")[1] : ""}</td>
                    <td class="reviwe-td">${value.Quantity ? value.Quantity : ""}</td>
                    <td class="reviwe-td">${value.ListPrice ? parseFloat(value.ListPrice).toFixed(2) : "0.00"}</td>
                    <td class="reviwe-td">${value.Discount ? parseFloat(value.Discount).toFixed(2) : "0.00"}</td>
                    <td class="reviwe-td">${value.ItemTotal ? parseFloat(value.ItemTotal).toFixed(2) : "0.00"}</td>
                </tr>
            `
    })
    //
    let customervalue = ""
    let contactvalue = ""

    // quotationRecord.TermsandConditions = quotationObject.TermsandConditions;
    // quotationRecord.DateIssued = quotationObject.DateIssued;
    // quotationRecord.ExpirationDate = quotationObject.ExpirationDate;

    if (customerList) {
        let customer = customerList
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
    if (contactList) {
        let contact = contactList
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

    // let image = (window.location.origin.includes('localhost') ? 'https:/qaffirst.quickappflow.com' : window.location.origin) + "/Attachment/downloadfile?fileUrl=" + encodeURIComponent(getURLFromJson(companySetting.Logo))
    // ${(contactvalue || customervalue) ? "To," : ""}
    let preview = `
                <div class="hrz-dynamic-frm-per">
                    <div class="print-btn"><button class="btn btn-primary m-t-5 m-b-20 no-print m-r-5">Download</button></div>
                    <loader><!----></loader><!---->
                    <div class="hrz-n-r-container-per custom-hrz-n-r-container-per" id="quotation-preview">
                        <div class="company-info">
                            <div class="company-logo img-content"><!----><img alt="" src="${downloadResume(companySetting.Logo)}">
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

                            <div class="company-details m-t-20">
                            ${getDatesforvalidity()}
                                
                            </div>
                        </div>
                        <div class="quoate-id" style="margin: 30px 0;">
                      
                            <p>${getbillNumber()}</p>
                        </div>

                        <div class="table-order-items">

                            <table>
                                <thead>
                                    <tr class="header-row">
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
                                        <td class="item-width reviwe-td">${previewType&&previewType.toLowerCase() === "Invoice".toLowerCase() ? (quotationRecord.SubTotal ? parseFloat(quotationRecord.SubTotal).toFixed(2) : "0.00") : (quotationRecord.Subtotal ? parseFloat(quotationRecord.Subtotal).toFixed(2) : "0.00")}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="item-width reviwe-td-left">Discount</td>
                                        <td class="item-width reviwe-td">${quotationRecord.Discount ? parseFloat(quotationRecord.Discount).toFixed(2) : "0.00"}</td>
                                    </tr>
                                    <tr>
                                        <td class="item-width reviwe-td-left">Tax</td>
                                        <td class="item-width reviwe-td">${quotationRecord.Tax ? parseFloat(quotationRecord.Tax).toFixed(2) : "0.00"}</td>
                                    </tr>
                                    <!---->
                                    <tr>
                                        <td class="item-width reviwe-td-left">Total Payable</td>
                                        <td class="item-width reviwe-td">${previewType&&previewType.toLowerCase() === "Invoice".toLowerCase() ? (quotationRecord.TotalAmount ? parseFloat(quotationRecord.TotalAmount).toFixed(2) : "0.00") : (quotationRecord.GrandTotal ? parseFloat(quotationRecord.GrandTotal).toFixed(2) : "0.00")}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div><!---->
                        <div class="m-t-70"><!---->
                            <p class="m-b-20">${previewType&&previewType.toLowerCase() === "Invoice".toLowerCase() ? 'Invoice validity' : 'Quotation validity'}:&nbsp;${getValidDays()}&nbsp;day(S) </p>
                        </div>
                        <div>
                            <div>
                                <p class=" term-condition">Terms and Conditions</p>
                                <pre class="pre-terms">${previewType&&previewType.toLowerCase() === "Invoice".toLowerCase() ? `${quotationRecord.TermsandConditions ? quotationRecord.TermsandConditions : invoiceTerms}` : `${quotationRecord.TermsandConditions ? quotationRecord.TermsandConditions : quotationTerms}`} </pre>
                               
                            </div>
                        </div>
                        <p class="signature">${quotationRecord.CreatedByName}</p>
                    </div>
                </div>
             `
    document.getElementById('previewQuotation').innerHTML = preview;
}

function formatDate(date) {
    if (date) {
        return moment(date).format("DD MMMM YYYY")
    }
    return " ";
}


function getbillNumber() {
    if (previewType&&previewType.toLowerCase() === "Invoice".toLowerCase()) {
        return `Invoice No: ${quotationRecord.InvoiceNo}`
    }
    else {
        return ` Quotation No: ${quotationRecord.AutoUnique}`
    }

}

function getValidDays() {
    if (previewType&&previewType.toLowerCase() === "Invoice".toLowerCase()) {

        if (quotationRecord.DateIssued && quotationRecord.DueDate) {
            let dateOne = moment(quotationRecord.DateIssued);
            let dateTwo = moment(quotationRecord.DueDate);
            // Function call
            let result = dateOne.diff(dateTwo, 'days')
            return Math.abs(result)
        }
        return 0
    }
    else {
        if (quotationRecord.DateIssued && quotationRecord.ExpirationDate) {
            let dateOne = moment(quotationRecord.DateIssued);
            let dateTwo = moment(quotationRecord.ExpirationDate);
            // Function call
            let result = dateOne.diff(dateTwo, 'days')
            return Math.abs(result)
        }
        return 0;
    }
}