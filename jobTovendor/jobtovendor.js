
var jobsToVendorData = [];
var vendorRecordID;
var user = "";
var jobName = ""
var urlParams = new URLSearchParams(window.location.search);
var jobID = urlParams.get('rid');
qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        getJobPost()
        getJobsTo_Vendor()
        clearInterval(qafServiceLoaded);
    }
}, 10);

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

function getJobPost() {
    
    let objectName = "Job_Posting";
    let list = 'RecordID,JobID,JobTitle';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `RecordID='${jobID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((vendors) => {
        if (Array.isArray(vendors) && vendors.length > 0) {
            jobName = vendors[0].RecordID + ";#" + vendors[0].JobID + "-" + vendors[0].JobTitle
        }
    });
}

function getJobsTo_Vendor() {
    ShowLoader()
    jobsToVendorData = []
    let objectName = "Jobs_To_Vendor";
    let list = 'RecordID,JobPost,Vendor,PublishToAll';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `JobPost='${jobID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((vendors) => {
        if (Array.isArray(vendors) && vendors.length > 0) {
            jobsToVendorData = vendors;
            generateReport();
        }
        else {
            generateReport();
        }

    });
}

function generateReport() {
    
    TableData = jobsToVendorData;
    let reportContainerElement = document.getElementById('reportContainer')
    reportContainerElement.innerHTML = ""

    if (TableData && TableData.length > 0) {
        let tableHead = `
        <th class="qaf-th action-head"></th>
        <th class="qaf-th">Job Post</th>
        <th class="qaf-th">Vendor</th>
        <th class="qaf-th">Publish To All</th>`;
        let tableRow = "";

        TableData.forEach(entry => {
            const jobPost = entry.JobPost ? entry.JobPost.split(";#")[1] : "";
            const vendor = entry.Vendor ? entry.Vendor.split(";#")[1] : "";
            const publishToAll = entry.PublishToAll;
            tableRow += `
                <tr class="qaf-tr">
                    <td class="qaf-td action-cell">
                        <button class="action-btn" onclick="toggleActionButtons(this,'${entry.RecordID}')">
                        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                        </button>
                    </td>
                    <td class="qaf-td">${jobPost ? jobPost : ""}</td>
                    <td class="qaf-td">${vendor ? vendor : ""}</td>
                    <td class="qaf-td">${publishToAll ? "Yes" : "No"}</td>
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

        reportContainerElement.innerHTML = tableValue;
        HideLoader();
    }
    else {
        let tableHead = `
        <th class="qaf-th">Job Post</th>
        <th class="qaf-th">Vendor</th>
        <th class="qaf-th">Publish To All</th>
        `;
        let tableBody = '';
        let startRow = '<tr class="qaf-tr">';
        let endRow = '</tr>';
        let tableRow = `<td colspan="3" class="qaf-td" ><div class='no-record'>No Record Found</div></td>`;
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
        reportContainerElement.innerHTML = tableHTML;
        HideLoader();
    }
}

function toggleActionButtons(button, recordID) {
    vendorRecordID = recordID;
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

window.onclick = function (event) {
    if (!(event.target.classList.contains('fa-ellipsis-v') || event.target.classList.contains('action-btn'))) {
        document.getElementById("menuId").innerHTML = ``
    } else {
        document.getElementById("menuId").innerHTML = `<div class="action-buttons" id="actionsButtons"  style="top: ${event.clientY - 560}px;left: ${event.clientX - 120}px;">
         <button class="view-btn" onclick="ViewRecord('${vendorRecordID}')"><i class="fa fa-eye" aria-hidden="true"></i>&nbsp;View</button>
         <button class="edit-btn" onclick="EditRecord('${vendorRecordID}')"><i class="fa fa-pencil" aria-hidden="true"></i>&nbsp;Edit</button>
         <button class="delete-btn" onclick="DeleteRecord('${vendorRecordID}')"><i class="fa fa-trash-o" aria-hidden="true"></i>&nbsp;Delete</button>
    </div>`
    }
}

function ViewRecord(RecordID) {
    if (window.QafPageService) {
        let Repository = "Jobs_To_Vendor";
        window.QafPageService.ViewItem(Repository, RecordID, function () {
            getJobsTo_Vendor();
        });
    }

}

function EditRecord(RecordID) {
    if (window.QafPageService) {
        let Repository = "Jobs_To_Vendor";
        window.QafPageService.EditItem(Repository, RecordID, function () {
            getJobsTo_Vendor();
        }, null, null, null, null, null, null, null, null, null, null, ["JobPost"]);
    }
}

function DeleteRecord(RecordID) {
    if (window.QafPageService) {
        window.QafPageService.DeleteItem(RecordID, function () {
            getJobsTo_Vendor();
        });
    }
}

function ExportReport() {
    let data = jobsToVendorData;
    let csvData = [];
    let csvHeader = ["Job Post", "Vendor", "Publish To All"].join(',');
    csvData.push(csvHeader);
    data.forEach(val => {
        let JobPost = val["JobPost"] ? val["JobPost"].split(';#')[1] : "";
        let Vendor = val["Vendor"] ? val["Vendor"].split(';#')[1] : "";
        let PublishToAll = val["PublishToAll"] ? val["PublishToAll"] : "";

        csvData.push([JobPost, Vendor, ContactNumber, PublishToAll].join(","));
    });
    let csvBody = csvData.join('\n');
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvBody);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Publish To Vendor Report.csv';
    hiddenElement.click();
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

function addVendor() {
    window.QafService.GetObjectById("Jobs_To_Vendor").then((responses) => {
        let fields = [];
        let fieldsValue = [];

        responses[0].Fields.forEach((ele) => {
            fields.push(ele.InternalName)
        })
        fields.forEach(val => {
            if (val === "JobPost") {
                fieldsValue.push({
                    fieldName: val,
                    fieldValue: jobName
                })
            } else {
                fieldsValue.push({ fieldName: val, fieldValue: "" })
            }
        })

        let repository = "Jobs_To_Vendor";
        if (window.QafPageService) {
            document.getElementById('topHeader').style.zIndex = '1';
            window.QafPageService.AddItem(repository, function () {
                getJobsTo_Vendor();
            }, fields, fieldsValue, null, null, null, null, null, null, null, null, ["JobPost"]);
        }
    })
}

function checkfullControls() {
    let User = getCurrentUser();
    if (User && User.LP) {
        return User.LP.split(',').includes("37-3");
    } else {
        return false;
    }
}