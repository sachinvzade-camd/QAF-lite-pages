var waCampaignList;
var waCampaignRecordId;
var campaignStatus;
var waCampaignObject = {}
var camapaignEntity = "";
var campaignList = "";

var tabName = "";
var tabLable = "";
var currentTab = 1;
var entityList = []
var crmList = []
var campaginRecordID = "";
var templateRecordId = ""
var totalRecipentCount = 0


function showContent(tabId, tabNum, clickedButton) {
    debugger
    tabLable = clickedButton.textContent;
    tabName = tabId;
    selectedTab = tabNum;
    let newTabValue = selectedTab - currentTab;
    movingTabs(newTabValue);
    currentTab = selectedTab;

    var allButtons = document.querySelectorAll(".tab-btn");
    allButtons.forEach(function (button) {
        button.classList.remove("isActive");
        button.style.fontWeight = "normal";
    });
    clickedButton.classList.add("isActive");
    // clickedButton.style.fontWeight = "600";

    var tabBox = document.querySelector(".tab-box");
    var lineElement = document.querySelector(".line");
    var button = document.querySelector('[data-tab="' + tabId + '"]');

    var tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach(function (content) {
        content.classList.remove("active");
    });

    var buttonRect = button.getBoundingClientRect();
    var tabBoxRect = tabBox.getBoundingClientRect();
    var offsetLeft = buttonRect.left - tabBoxRect.left;

    lineElement.style.width = button.offsetWidth + "px";
    lineElement.style.transform = "translateX(" + offsetLeft + "px)";

    var contentArea = document.getElementById(tabId);
    if (contentArea) {
        contentArea.classList.toggle("active");
    }
    switch (tabId) {
        case "view":
            getTemplates()
            break;
        case "send":
            if (campaginRecordID) {
                Setvaluesinfrom()
                getObjectDetails()

            }
            else {
                getObjectDetails()
            }

            break;
        case "template":


            break;
        default:
            break;
    }
}

function getTemplates() {

    ShiftConfiguration = []
    let objectName = "WA_Template";
    let list = 'Message,RecordID';
    let fieldList = list.split(",");
    let pageSize = "100000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `RecordID='${templateRecordId}'`;
    // let whereClause="";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((templates) => {
        if (Array.isArray(templates) && templates.length > 0) {
            let viewTemplateElement = document.getElementById('viewcampain');
            if (viewTemplateElement) {
                viewTemplateElement.innerHTML = templates[0].Message
            }
        }
    });
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
        loadWa_Campaign()
        debugger
        let imgpath=localStorage.getItem('baseImagesPath')
        let imgsrc = imgpath + "" + "assets/img/phone.jpg";
        let mbimgELement=document.getElementById('view-mb-img');
        if(mbimgELement){
            // mbimgELement.style.backgroundImage= `url(${imgsrc})`
            mbimgELement.style.backgroundImage= `url(https://qaffirst.quickappflow.com/Attachment/downloadfile?fileUrl=Media_Library%2Fmobile_6b0a8cd5-4512-4840-84eb-646c95cc792d.jpg)`;
            mbimgELement.classList.add('mb-image')
        }
        clearInterval(qafServiceLoaded);
    }
}, 10);

function loadWa_Campaign() {
    ShowLoader()
    waCampaignList = []
    let objectName = "WA_Campaign";
    let list = 'Name,Status,SentDate,RecordID,Entity,List,EstimatedRecipients';
    let fieldList = list.split(",");
    let pageSize = "100000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    // let whereClause="";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((wa_campaigns) => {
        if (Array.isArray(wa_campaigns) && wa_campaigns.length > 0) {
            waCampaignList = wa_campaigns.sort((a, b) => new Date(b.CreatedDate) - new Date(a.CreatedDate));;
        }
        showData();
    });
}

function showData() {
    generateTable(waCampaignList);
}


function generateTable(TableData) {
    let campaignContainerGrid = document.getElementById('campaignContainer')
    campaignContainerGrid.innerHTML = ""

    if (TableData && TableData.length > 0) {
        let tableRow = "";
        let tableHead = `
                  <th class="qaf-th action-head"></th>
                  <th class="qaf-th">Name</th>
                  <th class="qaf-th">Status</th>
                  <th class="qaf-th">Send Date</th>
                  <th class="qaf-th">Created Date</th>
                       `;
        TableData.forEach((entry, index) => {
            tableRow += `
                  <tr class="qaf-tr">
                  <td class="qaf-td action-cell">
                  <button class="action-btn" onclick="toggleActionButtons(this,'${entry.RecordID}','${entry.Status}')">
                  <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                  </button>
              </td>
                  <td class="qaf-td">${entry.Name ? entry.Name : ""}</td>
                  <td class="qaf-td">${entry.Status ? entry.Status : ""}</td>
                  <td class="qaf-td">${entry.SentDate ? moment(entry.SentDate).format('DD/MM/YYYY') : ""}</td>
                  <td class="qaf-td">${entry.CreatedDate ? moment(entry.CreatedDate).format('DD/MM/YYYY') : ""}</td>
                  </tr>
                  `;

        });
        let tableValue = `
              <table class="qaf-table" id="table">
                  <thead class="qaf-thead">
                      <tr class="qaf-tr">
                          ${tableHead}
                      </tr>
                  </thead>
                  <tbody class="qaf-tbody">
                      ${tableRow}
                  </tbody>
              </table>
          `;
        document.getElementById('campaignContainer').innerHTML = tableValue;
        HideLoader()


    } else {
        let tableHead = `
                  <th class="qaf-th">Name</th>
                  <th class="qaf-th">Status</th>
                  <th class="qaf-th">Send Date</th>
                  <th class="qaf-th">Created Date</th>
        `;
        let tableBody = '';
        let startRow = '<tr class="qaf-tr">';
        let endRow = '</tr>';
        let tableRow = `<td colspan="4" class="qaf-td" ><div class='no-record'>No Record Found</div></td>`;
        let tableHTML = `
                <table class="qaf-table" id="table">
                    <thead class="qaf-thead">
                        <tr class="qaf-tr">
                            ${tableHead}
                        </tr>
                     </thead>
                     <tbody class="qaf-tbody">
                        ${startRow}
                            ${tableRow}
                         ${endRow}
                    </tbody>
                </table>
        `;
        campaignContainerGrid.innerHTML = tableHTML;
        HideLoader();
    }


}


function toggleActionButtons(button, recordID, Status) {
    waCampaignRecordId = recordID;
    campaignStatus = Status
    const actionButtons = button.nextElementSibling;
    const allActionButtons = document.querySelectorAll('.action-buttons');
    allActionButtons.forEach(btn => {
        if (btn !== actionButtons) {
            btn.style.display = 'none';
        }
    });
    if (actionButtons) {
        if (actionButtons.style.display === 'block') {
            actionButtons.style.display = 'none';
        } else {
            actionButtons.style.display = 'block';
        }
    }

}
// <button class="view-btn" onclick="ViewRecord('${waCampaignRecordId}')"><i class="fa fa-eye" aria-hidden="true"></i>&nbsp;View</button>

window.onclick = function (event) {
    let isStatus = campaignStatus
    if (!(event.target.classList.contains('fa-ellipsis-v') || event.target.classList.contains('action-btn'))) {
        document.getElementById("menuId").innerHTML = ``
    } else {
        if (isStatus.toLowerCase() === "Draft".toLowerCase()) {
            document.getElementById("menuId").innerHTML = `<div class="action-buttons" id="actionsButtons"  style="top: ${event.pageY - 115}px;left: ${event.pageX - 130}px;">
             <button class="edit-btn" onclick="EditRecord('${waCampaignRecordId}')"><i class="fa fa-pencil" aria-hidden="true"></i>&nbsp;Edit</button>
             <button class="qaf-delete-btn" onclick="DeleteRecord('${waCampaignRecordId}')"><i class="fa fa-trash-o" aria-hidden="true"></i>&nbsp;Delete</button>
        </div>`
        }
        else {
            document.getElementById("menuId").innerHTML = `<div class="action-buttons" id="actionsButtons"  style="top: ${event.pageY - 115}px;left: ${event.pageX - 130}px;">
            <button class="view-btn" onclick="DeleteRecord('${waCampaignRecordId}')"><i class="fa fa-trash-o" aria-hidden="true"></i>&nbsp;Delete</button>`
        }

    }
}


function ViewRecord(RecordID) {
    if (window.QafPageService) {
        let Repository = 'WA_Campaign';
        window.QafPageService.ViewItem(Repository, RecordID, function () {
            loadWa_Campaign();
        });
    }

}

var RecordForUpdate = [];
function EditRecord(recordID) {
    campaginRecordID = recordID
    if (campaginRecordID) {
        let UpdatedRecord = waCampaignList.filter(wclist => wclist.RecordID === campaginRecordID);
        if (UpdatedRecord && UpdatedRecord.length > 0) {
            RecordForUpdate = UpdatedRecord[0];
        }
    }
    addCampaign()
    Setvaluesinfrom();
    
}

function Setvaluesinfrom() {

    if (RecordForUpdate && Object.keys(RecordForUpdate).length > 0) {
        let campaignNameElement = document.getElementById('campaignName');
        let entityElement = document.getElementById('entity');
        let listElement = document.getElementById('list');

        // Check if the elements are found before assigning values
        if (campaignNameElement) {
            campaignNameElement.value = RecordForUpdate.Name;
        }
        if (entityElement) {
            entityElement.value = RecordForUpdate.Entity;
        }
        if (listElement) {
            listElement.value = RecordForUpdate.List ? RecordForUpdate.List.split(";#")[0] : "";
        }
    }
}

function DeleteRecord(RecordID) {
    if (window.QafPageService) {
        window.QafPageService.DeleteItem(RecordID, function () {
            loadWa_Campaign();
        });
    }
}

function ShowLoader() {

    let pageDisabledElement = document.getElementById('pageDisabled');
    if (pageDisabledElement) {
        pageDisabledElement.classList.add('page-disabled')
    }
    let isloadingElement = document.getElementById('isloading');
    if (isloadingElement) {
        isloadingElement.style.display = 'block'
    }
}

function HideLoader() {
    let pageDisabledElement = document.getElementById('pageDisabled');
    let isloadingElement = document.getElementById('isloading');
    if (pageDisabledElement) {
        pageDisabledElement.classList.remove('page-disabled')
    }
    if (isloadingElement) {
        isloadingElement.style.display = 'none'
    }
}

function addCampaign() {
    let popUp = document.getElementById("popupContainer");
    if (popUp) {
        popUp.style.display = 'block';
        const buttonElement = document.getElementById('actbtn');
        showContent('template', 1, buttonElement)
        loadtemplate();
        if (campaginRecordID) {
            let entityValue = waCampaignList.find(cmp => cmp.RecordID === campaginRecordID).Entity
            getCrmList(entityValue)
        }

        addCssforscroll()

    }
}

var entityObject = {}

function loadtemplate() {
    templateList = []
    let objectName = "WA_Template";
    let list = 'Name,Message';
    let fieldList = list.split(",");
    let pageSize = "100000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    const myContent = document.getElementById("job-cards");
    let html = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((temp) => {
        if (Array.isArray(temp) && temp.length > 0) {
            templateList = temp;
            templateList.forEach(val => {
                html += `
                        <div class="col-md-4 job-card" onclick="gotoViewSendPage('${val.RecordID}')">
                            <div class="card">
                                <div class="card-body">
                                    <div class="template-msg">
                                        <p class="msg-p">${val.Message}</p>
                                    </div>
                                    <div class="template-name">
                                    <input type="checkbox" class="es-input-campagin"  onchange="gotoViewSendPage('${val.RecordID}')" id='${val.RecordID}'>
                                        <h3>${val.Name}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>`
            });
            myContent.innerHTML = html;
        }
    })
};


function CloseForm() {
    let popUp = document.getElementById("userForm");
    if (popUp) {
        popUp.style.display = 'none';
        removeCss()
    }
    let blurdivElement = document.getElementById('blurdiv');
    if (blurdivElement) {
        blurdivElement.classList.remove('page-blur')
    }
    resetForm()
}

function resetForm() {
    let campaignNameElement = document.getElementById('campaignName');
    let entityTemplate = document.getElementById('entity');
    let listTemplate = document.getElementById('list');
    if (campaignNameElement) {
        campaignNameElement.value = "";
    }
    if (entityTemplate) {
        entityTemplate.value = "";
    }
    if (listTemplate) {
        listTemplate.value = "";
    }
    let recipentElement = document.getElementById('reciptent-count');
    if (recipentElement) {
        recipentElement.innerHTML = '';
    }

}


function CancelForm() {
    RecordForUpdate = [];
    resetForm()

    let popUp = document.getElementById("popupContainer");
    if (popUp) {
        popUp.style.display = 'none';
        removeCss()

    }
    loadWa_Campaign();
    campaginRecordID = ""
}
function previousview(){
    const buttonElement = document.getElementById('actbtn');
        showContent('template', 1, buttonElement)
}
function nextview(){
    const buttonElement = document.getElementById('actbtn');
        showContent('send', 3, buttonElement)
}
function previoussend(){
    const buttonElement = document.getElementById('actbtn');
        showContent('view', 2, buttonElement)
}

function gotoViewSendPage(templateId) {
    
    let checkboxElement=document.getElementById(`${templateId}`)
    if( checkboxElement.checked){
    templateRecordId = templateId
    let campaignNameElement = document.getElementById('campaignName');
    let campaignName = ""
    if (campaignNameElement) {
        campaignName = campaignNameElement.value.trim().replace(/\s+/g, ' ');
    }

    waCampaignObject = {
        Name: campaignName,
        Status: 'Draft',
    }

    if (!waCampaignObject.Name) {
        openAlert("Campaign Name is required")
    }
    else {

        const buttonElement = document.getElementById('actbtn');
        showContent('view', 2, buttonElement)
        // let secondSection = document.getElementById('popupContainer');
        // if (secondSection) {
        //     secondSection.style.display = 'block';
        //     let actbtnElement = document.getElementById('actbtn')
        //     if (actbtnElement) {
        //         let lineElement = document.querySelector(".line");

        //         lineElement.style.width = 88 + "px";
        //         lineElement.style.transform = "translateX(" + 0 + "px)";
        //         actbtnElement.classList.add('isActive')
        //     }
        //     let actbtn2Element = document.getElementById('actbtn2')
        //     if (actbtn2Element) {
        //         actbtn2Element.classList.remove('isActive')
        //     }

        //     let firstElement = document.getElementById('view')
        //     if (firstElement) {
        //         firstElement.classList.add('active')
        //     }
        //     let secondElement = document.getElementById('send')
        //     if (secondElement) {
        //         secondElement.classList.remove('active')
        //     }

        //     // const container = document.getElementsByClassName('popup-content')[0];
        //     // const activeTab1 = container.getElementsByClassName('tab-btn isActive')[0];
        //     // const activeLine1 = activeTab1.parentNode.getElementsByClassName('line')[0];
        //     // activeLine1.style.width = activeTab1.offsetWidth + 'px';
        //     // activeLine1.style.left = activeTab1.offsetLeft + 'px';
        //     const buttonElement = document.getElementById('actbtn');
        //     showContent('view', 1, buttonElement)
        //     // if (campaginRecordID) {
        //     //     Setvaluesinfrom()
        //     // }
        // }
        // let popUp = document.getElementById("userForm");
        // if (popUp) {
        //     popUp.style.display = 'none';
        // }
        
        if (campaginRecordID) {
                 Setvaluesinfrom()
             }
        if (campaginRecordID) {
            updateItem(waCampaignObject, "WA_Campaign", campaginRecordID)
        }
        else {
            save(waCampaignObject, "WA_Campaign").then(response => {
                campaginRecordID = response.response;
                getTemplates();
            })
        }


    }
}

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

            resolve({
                response
            })
        });
    }
    )
}

function updateItem(submitFormObject, repositoryName, recodId) {
    return new Promise((resolve) => {
        var recordFieldValueList = [];
        var intermidiateRecord = {}
        var user = getCurrentUser()
        Object.keys(submitFormObject).forEach((key, value) => {
            recordFieldValueList.push({
                FieldID: null,
                FieldInternalName: key,
                FieldValue: submitFormObject[key]
            });
        });
        intermidiateRecord.CreatedByID = user.EmployeeID;
        intermidiateRecord.CreatedDate = new Date();
        intermidiateRecord.LastModifiedBy = null;
        intermidiateRecord.ObjectID = repositoryName;
        intermidiateRecord.RecordID = recodId;
        intermidiateRecord.RecordFieldValues = recordFieldValueList;
        window.QafService.UpdateItem(intermidiateRecord).then(response => {
            // CancelForm();
            resolve({
                response
            })
        });
    })
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

function addCssforscroll() {
    var element = document.querySelector("body");
    element.classList.add("hide-y-scroll");
}
function removeCss() {
    var element = document.querySelector("body");
    element.classList.remove("hide-y-scroll");
}

function getObjectDetails() {


    window.QafService.GetObjectById('WA_Campaign').then((responses) => {

        responses[0].Fields.forEach(val => {
            if (val.InternalName === 'Entity') {
                entityList = val.Choices.split(";#")
            }
        })
        displayEntity()
    })
}

function displayEntity() {

    let sourceDropdown = document.getElementById('entity');
    let options = `<option value=''>Select entity</option>`
    if (sourceDropdown) {
        entityList=entityList.sort()
        entityList.forEach(entity => {
            options += `<option value='${entity}'>${entity}</option>`
        })
        sourceDropdown.innerHTML = options;
    }
    if (RecordForUpdate && Object.keys(RecordForUpdate).length > 0 > 0) {
        sourceDropdown.value = RecordForUpdate.Entity;
        onListChange()
    }

}
function onentityChange() {
    let entityvalue = "";
    let entityTemplate = document.getElementById('entity');
    if (entityTemplate) {
        entityvalue = entityTemplate.value;
        getCrmList(entityvalue)
    }
}
function onListChange() {
    let listTemplate = document.getElementById('list');
    if (listTemplate) {
        let listID = listTemplate.value;
        if (listID) {
            let list = crmList.find(a => a.RecordID === listID);
            let repoName = ""
            if (list.Entity === 'Contact') {
                repoName = "Contact"
            }
            if (list.Entity === 'Lead') {
                repoName = "Leads"
            }
            if (list.Entity === 'Opportunity') {
                repoName = "Opportunity"
            }
            if (list.Entity === 'Customer') {
                repoName = "Customers"
            }
            let whereclause = list.FilterCriteria
            getEntityFilterList(whereclause, repoName)

        }
    }
}

function getEntityFilterList(whereclauseObject, repoName) {
    let objectName = repoName;
    let list = 'AccessToMember,City,Country,Industry,Source,EventName';
    let fieldList = list.split(",");
    let pageSize = "100000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = whereclauseObject;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((recepitents) => {
        if (Array.isArray(recepitents) && recepitents.length > 0) {
            totalRecipentCount = recepitents.length;
            let recipentElement = document.getElementById('reciptent-count');
            if (recipentElement) {
                recipentElement.innerHTML = totalRecipentCount
            }
        }
    });
}
function getCrmList(entityvalue) {
    let objectName = "CRM_List";
    let list = 'Name,Entity,FilterCriteria';
    let fieldList = list.split(",");
    let pageSize = "100000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `Entity='${entityvalue}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((lists) => {
        crmList = []
        if (Array.isArray(lists) && lists.length > 0) {
            crmList = lists;
            crmList= crmList.sort((a, b) => a.Name.localeCompare(b.Name));
            entityObject = crmList
        }
        displaylists()
    });
}

function displaylists() {
    let sourceDropdown = document.getElementById('list');
    let options = `<option value=''>Select list</option>`
    if (sourceDropdown) {
        crmList.forEach(entity => {
            options += `<option value='${entity.RecordID}'>${entity.Name}</option>`
        })
        sourceDropdown.innerHTML = options;
    }
}


function saveCampagin() {
    
    let entityvalue = "";
    let listvalue = "";
    let entityTemplate = document.getElementById('entity');
    if (entityTemplate) {
        entityvalue = entityTemplate.value
    }
    let listTemplate = document.getElementById('list');
    if (listTemplate) {
        let listID = listTemplate.value;
        if (listID) {
            let list = crmList.find(a => a.RecordID === listID);
            listvalue = list.RecordID + ";#" + list.Name
        }
    }
    let campaginObject = {
        Entity: entityvalue,
        List: listvalue,
        Status: 'Draft',
    }

    if (!campaginObject.Entity) {
        openAlert("Entity is required")
    }
    else if (!campaginObject.List) {
        openAlert("List is required")
    }
    else {
        let newId=campaginRecordID;
        console.log('newId',newId)
        saveForm(campaginObject)
        openAlert("Recipient list is saved!");
    }

}

function sendCampagin() {
    
    let entityvalue = "";
    let listvalue = "";
    let entityTemplate = document.getElementById('entity');
    if (entityTemplate) {
        entityvalue = entityTemplate.value
        camapaignEntity = entityvalue;
    }
    let listTemplate = document.getElementById('list');
    if (listTemplate) {
        let listID = listTemplate.value;
        if (listID) {
            campaignList = listID
            let list = crmList.find(a => a.RecordID === listID);
            listvalue = list.RecordID + ";#" + list.Name
        }
    }

    let campaginObject = {
        Entity: entityvalue,
        List: listvalue,
        Status: 'Executed',
        SentDate: new Date(),
        EstimatedRecipients: totalRecipentCount
    }

    if (!campaginObject.Entity) {
        openAlert("Entity is required")
    }
    else if (!campaginObject.List) {
        openAlert("List is required")
    }
    else {
        sendCampaigainApi().then(response => {
            saveForm(campaginObject)
            openAlert("WA campaign is being executed");
            CancelForm();
        })
        
    }
}

function saveForm(submitFormObject) {
    
    return new Promise((resolve) => {
        
        var recordFieldValueList = [];
        var intermidiateRecord = {}
        var user = getCurrentUser()
        Object.keys(submitFormObject).forEach((key, value) => {
            recordFieldValueList.push({
                FieldID: null,
                FieldInternalName: key,
                FieldValue: submitFormObject[key]
            });
        });
        intermidiateRecord.CreatedByID = user.EmployeeID;
        intermidiateRecord.CreatedDate = new Date();
        intermidiateRecord.LastModifiedBy = null;
        intermidiateRecord.ObjectID = "WA_Campaign";
        intermidiateRecord.RecordID = campaginRecordID;
        intermidiateRecord.RecordFieldValues = recordFieldValueList;
        window.QafService.UpdateItem(intermidiateRecord).then(response => {
            loadWa_Campaign();
            // campaginRecordID = ""
            resolve({
                response
            })
        });
    })
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

function sendCampaigainApi() {
    let user = getCurrentUser();
    return new Promise((resolve) => {
        let apURL = window.localStorage.getItem('env')
        let fetch_url = `${apURL}/api/wacsnd?EntityName=${camapaignEntity}&ListName=${campaignList}`
        fetch(fetch_url, {
            method: 'POST',
            headers: {
                'Host': 'demtis.quickappflow.com',
                'Employeeguid': user.EmployeeGUID,
                'Hrzemail': user.Email
            },
        })
            .then(response => response.json())
            .then(data => {
                resolve(data)
            })
    })
}

function CloseFormvIEW() {
    let popUp = document.getElementById("popupContainer");
    if (popUp) {
        popUp.style.display = 'none';
        removeCss()
    }
}