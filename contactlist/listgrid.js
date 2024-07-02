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
            debugger
            if (list.Entity.toLowerCase() === "Lead".toLowerCase()) {
                let leads = await getAllLead(list.FilterCriteria)
                debugger
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
        }FirstName,LastName,Email,Mobile'
                </style>
              <button onclick="refresh()" style="float: right;">refresh</button>
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
            `
        }
    }

    disconnectedCallback() {
    }

    adoptedCallback() {
    }

   async attributeChangedCallback(name, oldValue, newValue) {
        if (window.QafService) {
            let list = await getAllListData()
            let contacts = await getAllData(list.FilterCriteria)
            let contactData = ``
            contacts.forEach(val => {
                contactData += `  <tr class="qaf-tr">
         <td class="qaf-td">${val.FirstName?val.FirstName:""}</td>
         <td class="qaf-td">${val.LastName?val.LastName:""}</td>
         <td class="qaf-td">${val.Email?val.Email:""}</td>
         <td class="qaf-td">${val.Mobile?val.Mobile:""}</td>
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
        }FirstName,LastName,Email,Mobile'
                </style>
              <button onclick="refresh()" style="float: right;">refresh</button>
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
            `
        }
    }
    
}
function refresh(){
    const myComponent = document.querySelector('qaf-crm-grid');
    myComponent.setAttribute('refresh-grid', false);
}
function getAllListData(){
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
function getAllData(whereclause){
    return new Promise((resolve) => {
    let objectName = "Contact";
    let list = 'RecordID,FirstName,LastName,Email,Mobile,City,Country,Industry,Source,EventName';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = whereclause?whereclause:"";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((contacts) => {
           resolve(contacts)
    });
})
}
function getAllLead(whereclause){
    return new Promise((resolve) => {
    let objectName = "Leads";
    let list = 'RecordID,FirstName,LastName,Email,Mobile,City,Country,Industry,Source,EventName,AdditionalContactPerson,ContactPerson';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = whereclause?whereclause:"";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((leads) => {
        debugger
           resolve(leads)
    });
})
}
function getAllOpportunities(whereclause){
    return new Promise((resolve) => {
    let objectName = "Opportunity";
    let list = 'RecordID,FirstName,LastName,Email,Mobile,City,Country,Industry,Source,EventName';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = whereclause?whereclause:"";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((opportunities) => {
           resolve(opportunities)
    });
})
}
function getAllCustomers(whereclause){
    return new Promise((resolve) => {
    let objectName = "Customers";
    let list = 'RecordID,FirstName,LastName,Email,Mobile,City,Country,Industry,Source,EventName';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = whereclause?whereclause:"";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((customers) => {
           resolve(customers)
    });
})
}
function getAllContact(whereclause){
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
