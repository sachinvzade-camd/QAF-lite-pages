var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
let listrecordID = urlParams.get("id");
class QafCrmGrid extends HTMLElement {
    static observedAttributes = ["refresh-grid"];
    constructor() {
        super();
    }
    async connectedCallback() {

        if (window.QafService) {

            let list = await getAllListData()
            let contacts = []

            if (list.Entity.toLowerCase() === "Lead".toLowerCase()) {

                let leads = await getAllLead(list.FilterCriteria)

                let recrordIDS = [];
                if (leads && leads.length > 0) {
                    leads.forEach(val => {
                        if (val && val.AdditionalContactPerson) {
                            let contactRecordID = val.AdditionalContactPerson.split(";#").filter((contact, index) => index % 2 === 0);
                            recrordIDS.push(...contactRecordID)
                        }
                        if (val && val.ContactPerson) {
                            recrordIDS.push(val.ContactPerson.split(";#")[0])
                        }
                    })
                }
                let idswhereclause = recrordIDS.join("'<OR>RecordID='");
                contacts = await getAllContact(idswhereclause)
            }
            else if (list.Entity.toLowerCase() === "Opportunity".toLowerCase()) {
                let opportunities = await getAllOpportunities(list.FilterCriteria)
                let recrordIDS = [];
                if (opportunities && opportunities.length > 0) {
                    opportunities.forEach(val => {
                        if (val && val.AdditionalContactPerson) {
                            let contactRecordID = val.AdditionalContactPerson.split(";#").filter((contact, index) => index % 2 === 0);
                            recrordIDS.push(...contactRecordID)
                        }
                        if (val && val.ContactPerson) {
                            recrordIDS.push(val.ContactPerson.split(";#")[0])
                        }
                    })
                }
                let idswhereclause = recrordIDS.join("'<OR>RecordID='");
                contacts = await getAllContact(idswhereclause)
            }
            else if (list.Entity.toLowerCase() === "Customer".toLowerCase()) {

                let customers = await getAllCustomers(list.FilterCriteria)
                let recrordIDS = [];
                if (customers && customers.length > 0) {
                    customers.forEach(val => {
                        if (val && val.AdditionalContactPerson) {
                            let contactRecordID = val.AdditionalContactPerson.split(";#").filter((contact, index) => index % 2 === 0);
                            recrordIDS.push(...contactRecordID)
                        }
                        if (val && val.ContactPerson) {
                            recrordIDS.push(val.ContactPerson.split(";#")[0])
                        }
                    })
                }
                let idswhereclause = recrordIDS.join("'<OR>RecordID='");
                contacts = await getAllContact(idswhereclause)
            }
            else {
                contacts = await getAllData(list.FilterCriteria)
            }
            let contactData = ``
            if (contacts && contacts.length > 0) {
                contacts.forEach(val => {
                    contactData += `  <tr class="qaf-tr">
             <td class="qaf-td">${val.FirstName ? val.FirstName : ""}</td>
             <td class="qaf-td">${val.LastName ? val.LastName : ""}</td>
             <td class="qaf-td">${val.Email ? val.Email : ""}</td>
             <td class="qaf-td">${val.Mobile ? val.Mobile : ""}</td>
             </tr>`
                });
                this.innerHTML = `
                    <style>
                                    .page {
                        --qaf-grid-button-bg-color: var(--ButtonBackGroundColor);
                        --qaf-grid-button-border-radius: 4px;
                        }
                        .qaf-btn-primary {
                        margin-left: 8px;
                        background-color: var(--qaf-grid-button-bg-color, #313CBF);
                        border: none;
                        color: var(--qaf-grid-button-color, #fff);
                        padding: var(--qaf-grid-button-color, 8px 16px);
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: var(--qaf-grid-button-font-size, 16px);
                        border-radius: var(--qaf-grid-button-border-radius, 24px);
                        }
    
                        .tablecontainer {
                        display: flex;
                        justify-content: flex-start;
                        width: 100%;
                        box-shadow: rgb(51, 51, 51) 0px 0px 3px 0px;
                        }
                        .tablecontainer {
                        overflow-x: auto;
                        max-width: 100%;
                        max-height: 483px;
                        margin-top: 12px;
                        padding-bottom:20px;
                        }
    
                        .qaf-table {
                        font-size: 13px;
                        width: 100%;
                        margin: 2px auto;
                        border-collapse: collapse;
                        background-color: #fff;
                        overflow: hidden;
                        font-weight: 400;
                        }
                        .qaf-tr,
                        .qaf-td {
                        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
                        }
                        .table > tbody > tr > td,
                        .table > tbody > tr > th,
                        .table > tfoot > tr > td,
                        .table > tfoot > tr > th,
                        .table > thead > tr > td,
                        .table > thead > tr > th {
                        vertical-align: middle;
                        }
    
                        .qaf-th {
                        height: 38.12px;
                        padding: 9px 10px;
                        text-align: left;
                        word-wrap: break-word;
                        min-width: 70px;
                        border-right: none;
                        vertical-align: middle;
                        }
                        .qaf-td {
                        height: 38.12px;
                        padding: 0px 10px;
                        text-align: left;
                        word-wrap: break-word;
                        min-width: 135px;
                        border-right: none;
                        vertical-align: middle;
                        }
    
                        .qaf-th {
                        background-color: rgb(242, 242, 242);
                        color: rgb(0, 0, 0);
                        font-weight: 400;
                        }
    
                        .qaf-tr:nth-child(even) {
                        background-color: rgba(0, 0, 0, 0);
                        }
                        @media screen and (max-width: 600px) {
                        .qaf-th,
                        .qaf-td {
                        display: block;
                        width: 100%;
                        box-sizing: border-box;
                        }
                        }
                        .right-container {
                        height: inherit;
                        display: flex;
                        justify-content: end;
                        }
                         @keyframes blink {
                            0% { opacity: 1; }
                            50% { opacity: 0; }
                            100% { opacity: 1; }
                            }

                            .blink {
                            animation: blink 1s linear;
                            }
                        </style>
                       <div class="right-container">
                            <div class="addform">
                                <button id="resetButton" class="btn btn-primary" onclick="refresh()" style="float: right;"><i class="fa fa-refresh" aria-hidden="true"></i></button>
                            </div>
                         </div>
                        <div class="tablecontainer" >
                        <table class="qaf-table" id="table">
                            <thead class="qaf-thead">
                                <tr class="qaf-tr">
                                    <th class="qaf-th">First Name</th>
                                    <th class="qaf-th">Last Name</th>
                                    <th class="qaf-th">Email</th>
                                    <th class="qaf-th">Mobile</th>
                                </tr>
                            </thead>
                            <tbody class="qaf-tbody">
                                ${contactData}
                            </tbody>
                        </table>
                        </div>
                        
                `
            }
            else {

                this.innerHTML = `
                <style>
                    .page {
                    --qaf-grid-button-bg-color: var(--ButtonBackGroundColor);
                    --qaf-grid-button-border-radius: 4px;
                    }
                    .qaf-btn-primary {
                    margin-left: 8px;
                    background-color: var(--qaf-grid-button-bg-color, #313CBF);
                    border: none;
                    color: var(--qaf-grid-button-color, #fff);
                    padding: var(--qaf-grid-button-color, 8px 16px);
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: var(--qaf-grid-button-font-size, 16px);
                    border-radius: var(--qaf-grid-button-border-radius, 24px);
                    }

                    .tablecontainer {
                    display: flex;
                    justify-content: flex-start;
                    width: 100%;
                    box-shadow: rgb(51, 51, 51) 0px 0px 3px 0px;
                    }
                    
                    .tablecontainer {
                    overflow-x: auto;
                    max-width: 100%;
                    max-height: 483px;
                    margin-top: 12px;
                    }

                    .qaf-table {
                    font-size: 13px;
                    width: 100%;
                    margin: 2px auto;
                    border-collapse: collapse;
                    background-color: #fff;
                    overflow: hidden;
                    font-weight: 400;
                    }
                    .qaf-tr,
                    .qaf-td {
                    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
                    }
                    .table > tbody > tr > td,
                    .table > tbody > tr > th,
                    .table > tfoot > tr > td,
                    .table > tfoot > tr > th,
                    .table > thead > tr > td,
                    .table > thead > tr > th {
                    vertical-align: middle;
                    }

                    .qaf-th {
                    height: 38.12px;
                    padding: 9px 10px;
                    text-align: left;
                    word-wrap: break-word;
                    min-width: 70px;
                    border-right: none;
                    vertical-align: middle;
                    }
                    .qaf-td {
                    height: 38.12px;
                    padding: 0px 10px;
                    text-align: left;
                    word-wrap: break-word;
                    min-width: 135px;
                    border-right: none;
                    vertical-align: middle;
                    }

                    .qaf-th {
                    background-color: rgb(242, 242, 242);
                    color: rgb(0, 0, 0);
                    font-weight: 400;
                    }

                    .qaf-tr:nth-child(even) {
                    background-color: rgba(0, 0, 0, 0);
                    }
                    .right-container {
                    height: inherit;
                    display: flex;
                    justify-content: end;
                    }
                    .no-record {
                            width: 100%;
                            text-align: center;
                            font-size: 14px;
                            font-weight: 500;
                            }
                             @keyframes blink {
                            0% { opacity: 1; }
                            50% { opacity: 0; }
                            100% { opacity: 1; }
                            }

                            .blink {
                            animation: blink 1s linear;
                            }
                </style>
                   <div class="right-container">
                        <div class="addform">
                            <button id="resetButton" class="btn btn-primary" onclick="refresh()" style="float: right;"><i class="fa fa-refresh" aria-hidden="true"></i></button>
                        </div>
                     </div>
                    <div class="tablecontainer" >
                    <table class="qaf-table" id="table">
                        <thead class="qaf-thead">
                            <tr class="qaf-tr">
                                <th class="qaf-th">First Name</th>
                                <th class="qaf-th">Last Name</th>
                                <th class="qaf-th">Email</th>
                                <th class="qaf-th">Mobile</th>
                            </tr>
                        </thead>
                        <tbody class="qaf-tbody">
                        <tr class="qaf-tr">
                           <td colspan="4" class="qaf-td" ><div class='no-record'>No Record Found</div></td>
                           </tr>
                        </tbody>
                    </table>
                    </div>
                        
                `
            }

        }
    }

    disconnectedCallback() {
    }

    adoptedCallback() {
    }

    async attributeChangedCallback(name, oldValue, newValue) {

        if (window.QafService) {
            let list = await getAllListData()
            // let contacts = await getAllData(list.FilterCriteria)
            let contacts = []

            if (list.Entity.toLowerCase() === "Lead".toLowerCase()) {

                let leads = await getAllLead(list.FilterCriteria)

                let recrordIDS = [];
                if (leads && leads.length > 0) {
                    leads.forEach(val => {
                        if (val && val.AdditionalContactPerson) {
                            let contactRecordID = val.AdditionalContactPerson.split(";#").filter((contact, index) => index % 2 === 0);
                            recrordIDS.push(...contactRecordID)
                        }
                        if (val && val.ContactPerson) {
                            recrordIDS.push(val.ContactPerson.split(";#")[0])
                        }
                    })
                }
                let idswhereclause = recrordIDS.join("'<OR>RecordID='");
                contacts = await getAllContact(idswhereclause)
            }
            else if (list.Entity.toLowerCase() === "Opportunity".toLowerCase()) {
                let opportunities = await getAllOpportunities(list.FilterCriteria)
                let recrordIDS = [];
                if (opportunities && opportunities.length > 0) {
                    opportunities.forEach(val => {
                        if (val && val.AdditionalContactPerson) {
                            let contactRecordID = val.AdditionalContactPerson.split(";#").filter((contact, index) => index % 2 === 0);
                            recrordIDS.push(...contactRecordID)
                        }
                        if (val && val.ContactPerson) {
                            recrordIDS.push(val.ContactPerson.split(";#")[0])
                        }
                    })
                }
                let idswhereclause = recrordIDS.join("'<OR>RecordID='");
                contacts = await getAllContact(idswhereclause)
            }
            else if (list.Entity.toLowerCase() === "Customer".toLowerCase()) {

                let customers = await getAllCustomers(list.FilterCriteria)
                let recrordIDS = [];
                if (customers && customers.length > 0) {
                    customers.forEach(val => {
                        if (val && val.AdditionalContactPerson) {
                            let contactRecordID = val.AdditionalContactPerson.split(";#").filter((contact, index) => index % 2 === 0);
                            recrordIDS.push(...contactRecordID)
                        }
                        if (val && val.ContactPerson) {
                            recrordIDS.push(val.ContactPerson.split(";#")[0])
                        }
                    })
                }
                let idswhereclause = recrordIDS.join("'<OR>RecordID='");
                contacts = await getAllContact(idswhereclause)
            }
            else {
                contacts = await getAllData(list.FilterCriteria)
            }
            let contactData = ``
            if (contacts && contacts.length > 0) {
                contacts.forEach(val => {
                    contactData += `  <tr class="qaf-tr">
             <td class="qaf-td">${val.FirstName ? val.FirstName : ""}</td>
             <td class="qaf-td">${val.LastName ? val.LastName : ""}</td>
             <td class="qaf-td">${val.Email ? val.Email : ""}</td>
             <td class="qaf-td">${val.Mobile ? val.Mobile : ""}</td>
             </tr>`
                });

                this.innerHTML = `
                    <style>
                        .page {
                        --qaf-grid-button-bg-color: var(--ButtonBackGroundColor);
                        --qaf-grid-button-border-radius: 4px;
                        }
                        .qaf-btn-primary {
                        margin-left: 8px;
                        background-color: var(--qaf-grid-button-bg-color, #313CBF);
                        border: none;
                        color: var(--qaf-grid-button-color, #fff);
                        padding: var(--qaf-grid-button-color, 8px 16px);
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: var(--qaf-grid-button-font-size, 16px);
                        border-radius: var(--qaf-grid-button-border-radius, 24px);
                        }
    
                        .tablecontainer {
                        display: flex;
                        justify-content: flex-start;
                        width: 100%;
                        box-shadow: rgb(51, 51, 51) 0px 0px 3px 0px;
                        }
                        
                        .tablecontainer {
                        overflow-x: auto;
                        max-width: 100%;
                        max-height: 483px;
                        margin-top: 12px;
                        padding-bottom:20px;
                        }
    
                        .qaf-table {
                        font-size: 13px;
                        width: 100%;
                        margin: 2px auto;
                        border-collapse: collapse;
                        background-color: #fff;
                        overflow: hidden;
                        font-weight: 400;
                        }
                        .qaf-tr,
                        .qaf-td {
                        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
                        }
                        .table > tbody > tr > td,
                        .table > tbody > tr > th,
                        .table > tfoot > tr > td,
                        .table > tfoot > tr > th,
                        .table > thead > tr > td,
                        .table > thead > tr > th {
                        vertical-align: middle;
                        }
    
                        .qaf-th {
                        height: 38.12px;
                        padding: 9px 10px;
                        text-align: left;
                        word-wrap: break-word;
                        min-width: 70px;
                        border-right: none;
                        vertical-align: middle;
                        }
                        .qaf-td {
                        height: 38.12px;
                        padding: 0px 10px;
                        text-align: left;
                        word-wrap: break-word;
                        min-width: 135px;
                        border-right: none;
                        vertical-align: middle;
                        }
    
                        .qaf-th {
                        background-color: rgb(242, 242, 242);
                        color: rgb(0, 0, 0);
                        font-weight: 400;
                        }
    
                        .qaf-tr:nth-child(even) {
                        background-color: rgba(0, 0, 0, 0);
                        }
                        .right-container {
                        height: inherit;
                        display: flex;
                        justify-content: end;
                        }
                        @keyframes blink {
                            0% { opacity: 1; }
                            50% { opacity: 0; }
                            100% { opacity: 1; }
                            }

                            .blink {
                            animation: blink 1s linear;
                            }
                        </style>
                       <div class="right-container">
                            <div class="addform">
                                <button id="resetButton" class="btn btn-primary" onclick="refresh()" style="float: right;"><i class="fa fa-refresh" aria-hidden="true"></i></button>
                            </div>
                         </div>
                        <div class="tablecontainer" >
                        <table class="qaf-table" id="table">
                            <thead class="qaf-thead">
                                <tr class="qaf-tr">
                                    <th class="qaf-th">First Name</th>
                                    <th class="qaf-th">Last Name</th>
                                    <th class="qaf-th">Email</th>
                                    <th class="qaf-th">Mobile</th>
                                </tr>
                            </thead>
                            <tbody class="qaf-tbody">
                                ${contactData}
                            </tbody>
                        </table>
                        </div>
                `
            }
            else {

                this.innerHTML = `
                    <style>
                        .page {
                        --qaf-grid-button-bg-color: var(--ButtonBackGroundColor);
                        --qaf-grid-button-border-radius: 4px;
                        }
                        .qaf-btn-primary {
                        margin-left: 8px;
                        background-color: var(--qaf-grid-button-bg-color, #313CBF);
                        border: none;
                        color: var(--qaf-grid-button-color, #fff);
                        padding: var(--qaf-grid-button-color, 8px 16px);
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: var(--qaf-grid-button-font-size, 16px);
                        border-radius: var(--qaf-grid-button-border-radius, 24px);
                        }
    
                        .tablecontainer {
                        display: flex;
                        justify-content: flex-start;
                        width: 100%;
                        box-shadow: rgb(51, 51, 51) 0px 0px 3px 0px;
                        }
                        
                        .tablecontainer {
                        overflow-x: auto;
                        max-width: 100%;
                        max-height: 483px;
                        margin-top: 12px;
                        }
    
                        .qaf-table {
                        font-size: 13px;
                        width: 100%;
                        margin: 2px auto;
                        border-collapse: collapse;
                        background-color: #fff;
                        overflow: hidden;
                        font-weight: 400;
                        }
                        .qaf-tr,
                        .qaf-td {
                        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
                        }
                        .table > tbody > tr > td,
                        .table > tbody > tr > th,
                        .table > tfoot > tr > td,
                        .table > tfoot > tr > th,
                        .table > thead > tr > td,
                        .table > thead > tr > th {
                        vertical-align: middle;
                        }
    
                        .qaf-th {
                        height: 38.12px;
                        padding: 9px 10px;
                        text-align: left;
                        word-wrap: break-word;
                        min-width: 70px;
                        border-right: none;
                        vertical-align: middle;
                        }
                        .qaf-td {
                        height: 38.12px;
                        padding: 0px 10px;
                        text-align: left;
                        word-wrap: break-word;
                        min-width: 135px;
                        border-right: none;
                        vertical-align: middle;
                        }
    
                        .qaf-th {
                        background-color: rgb(242, 242, 242);
                        color: rgb(0, 0, 0);
                        font-weight: 400;
                        }
    
                        .qaf-tr:nth-child(even) {
                        background-color: rgba(0, 0, 0, 0);
                        }
                        .right-container {
                        height: inherit;
                        display: flex;
                        justify-content: end;
                        }
                         @keyframes blink {
                            0% { opacity: 1; }
                            50% { opacity: 0; }
                            100% { opacity: 1; }
                            }

                            .blink {
                            animation: blink 1s linear;
                            }
                        .no-record {
                                width: 100%;
                                text-align: center;
                                font-size: 14px;
                                font-weight: 500;
                                }
                    </style>
                       <div class="right-container">
                            <div class="addform">
                                <button id="resetButton" class="btn btn-primary" onclick="refresh()" style="float: right;"><i class="fa fa-refresh" aria-hidden="true"></i></button>
                            </div>
                         </div>
                        <div class="tablecontainer" >
                        <table class="qaf-table" id="table">
                            <thead class="qaf-thead">
                                <tr class="qaf-tr">
                                    <th class="qaf-th">First Name</th>
                                    <th class="qaf-th">Last Name</th>
                                    <th class="qaf-th">Email</th>
                                    <th class="qaf-th">Mobile</th>
                                </tr>
                            </thead>
                            <tbody class="qaf-tbody">
                            <tr class="qaf-tr">
                               <td colspan="4" class="qaf-td" ><div class='no-record'>No Record Found</div></td>
                               </tr>
                            </tbody>
                        </table>
                        </div>
                `
            }

        }
    }

}
function refresh() {
    const myComponent = document.querySelector('qaf-crm-grid');
    myComponent.setAttribute('refresh-grid', false);
    makeBlinkResetBtn()
}

function makeBlinkResetBtn() {
    var button = document.getElementById('resetButton');
    if (button) {
        button.classList.add('blink');
        setTimeout(function() {
            button.classList.remove('blink');
        }, 1000);
    }
}

function getAllListData() {
    return new Promise((resolve) => {
        
        let objectName = "CRM_List";
        let list = 'RecordID,FilterCriteria,Entity';
        let fieldList = list.split(",");
        let pageSize = "20000";
        let pageNumber = "1";
        let orderBy = "true";
        let whereClause = `RecordID='${listrecordID}'`;
        window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((lists) => {
            resolve(lists[0])
        });
    })

}
function getAllData(whereclause) {
    return new Promise((resolve) => {
        let objectName = "Contact";
        let list = 'RecordID,FirstName,LastName,Email,Mobile,City,Country,Industry,Source,EventName';
        let fieldList = list.split(",");
        let pageSize = "20000";
        let pageNumber = "1";
        let orderBy = "true";
        let whereClause = whereclause ? whereclause : "";
        window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((contacts) => {
            resolve(contacts)
        });
    })
}
function getAllLead(whereclause) {
    return new Promise((resolve) => {
        let objectName = "Leads";
        let list = 'RecordID,FirstName,LastName,Email,Mobile,City,Country,Industry,LeadSource,EventName,AdditionalContactPerson,ContactPerson,ExpectedRevenue,LeadOwner';
        let fieldList = list.split(",");
        let pageSize = "20000";
        let pageNumber = "1";
        let orderBy = "true";
        let whereClause = whereclause ? whereclause : "";
        window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((leads) => {
            resolve(leads)
        });
    })
}
function getAllOpportunities(whereclause) {
    return new Promise((resolve) => {
        let objectName = "Opportunity";
        let list = 'RecordID,FirstName,LastName,Email,Mobile,City,Country,Industry,Source,EventName';
        let fieldList = list.split(",");
        let pageSize = "20000";
        let pageNumber = "1";
        let orderBy = "true";
        let whereClause = whereclause ? whereclause : "";
        window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((opportunities) => {
            resolve(opportunities)
        });
    })
}
function getAllCustomers(whereclause) {
    return new Promise((resolve) => {
        let objectName = "Customers";
        let list = 'RecordID,FirstName,LastName,Email,Mobile,City,Country,Industry,Source,EventName';
        let fieldList = list.split(",");
        let pageSize = "20000";
        let pageNumber = "1";
        let orderBy = "true";
        let whereClause = whereclause ? whereclause : "";
        window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((customers) => {
            resolve(customers)
        });
    })
}
function getAllContact(whereclause) {
    return new Promise((resolve) => {
        let objectName = "Contact";
        let list = 'RecordID,FirstName,LastName,Email,Mobile,City,Country,Industry,Source,EventName';
        let fieldList = list.split(",");
        let pageSize = "20000";
        let pageNumber = "1";
        let orderBy = "true";
        let whereClause = `RecordID='${whereclause}'`
        let recordForField

        recordForField = {
            Tod: objectName,
            Ldft: list,
            Ybod: "",
            Ucwr: whereClause,
            Zps: 1000000,
            Rmgp: 1,
            Diac: "true",
        }
        window.QafService.Rfdf(recordForField).then((contacts) => {
            resolve(contacts)
        });
    })
}



customElements.define("qaf-crm-grid", QafCrmGrid);
