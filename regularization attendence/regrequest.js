var Employee = [];
var rg_Data;
var currentTab = 1;
var tabName = "myrequest";
var expenseGrid;
var requestColumn;
var pendingColumn;
var requestRepo;
var tabLable = "My Requests";
var currentDate = new Date();
var year = currentDate.getFullYear();
var month = String(currentDate.getMonth() + 1).padStart(2, '0');
var day = String(currentDate.getDate()).padStart(2, '0');
var formattedDate = `${year}-${month}-${day}`;
var selectedstartDate = document.getElementById("startDate");
var selectedendDate = document.getElementById("EndDate");
var employeeName = document.getElementById("employeeName")
var topbar = document.getElementById("header-title")

qafServiceLoaded = setInterval(() => {
  if (window.QafService) {

    // document.getElementById("breadcrum").style.display = "none";
    const container = document.getElementsByClassName('container')[0];
    const activeTab1 = container.getElementsByClassName('tab-btn isActive')[0];
    const activeLine1 = activeTab1.parentNode.getElementsByClassName('line')[0];
    activeLine1.style.width = activeTab1.offsetWidth + 'px';
    activeLine1.style.left = activeTab1.offsetLeft + 'px';
    topbar = document.getElementById("header-title")
    topbar.style.display = 'none';
    selectedstartDate.value = formattedDate;
    selectedendDate.value = formattedDate;
    getEmployee();
    clearInterval(qafServiceLoaded);
  }
}, 10);


function showContent(tabId, tabNum, clickedButton) {

  tabLable = clickedButton.textContent;
  if (tabLable) {
    let tabname = tabLable.toLowerCase()
    if (tabname === 'pending requests'.toLowerCase()) {
      let topbar = document.getElementById("header-title")
      topbar.style.display = 'flex';
    }
    else {
      let topbar = document.getElementById("header-title")
      topbar.style.display = 'none';
    }
  }

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
  clickedButton.style.fontWeight = "600";

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

  var contentArea = document.getElementById("myrequest");
  if (contentArea) {
    contentArea.classList.toggle("active");
  }
  switch (tabId) {
    case "myrequest":
      loadMyRequest();
      break;
    case "pendingrequest":
      employeeName.value = "";
      let selectedstartDate = document.getElementById("startDate");
      let selectedendDate = document.getElementById("EndDate");
      selectedstartDate.value = getCurrentMonthDate();
      selectedendDate.value = getCurrentMonthDate();
      fromDate = moment(selectedstartDate.value).format('YYYY/MM/DD');
      toDate = moment(selectedendDate.value).format('YYYY/MM/DD');
      let whereClause = `(Status!='Closed')<<NG>>(SelectDate>='${fromDate}'<AND>SelectDate<='${toDate}')`
      loadPendingRequest(whereClause);
      break;
    default:
      break;
  }
}



function getCurrentMonthDate() {
  const TodayDate = new Date();
  toDate = moment(TodayDate).format('YYYY/MM/DD');
  const formattedDate = moment(TodayDate).format('YYYY-MM-DD');
  return formattedDate;
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

function getEmployee() {
  Employee = []
  let objectName = "Employees";
  let list = 'RecordID,FirstName,LastName,IsOffboarded';
  let fieldList = list.split(",");
  let pageSize = "20000";
  let pageNumber = "1";
  let orderBy = "true";
  let whereClause = `IsOffboarded!='True'<OR>IsOffboarded=''`;
  window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
    if (Array.isArray(employees) && employees.length > 0) {
      Employee = employees;

    }
    loadEmployee()
  });
}

function loadEmployee() {
  let requestFor = document.getElementById('employeeName');
  let options = `<option value=''> Select Employee</option>`;
  if (requestFor) {
    Employee.sort((a, b) => (a.FirstName > b.FirstName) ? 1 : ((b.FirstName > a.FirstName) ? -1 : 0));
    Employee.forEach(emp => {
      options += `<option value="${emp.RecordID}">${emp.FirstName} ${emp.LastName}</option>`;
    });
    requestFor.innerHTML = options;
  }
  loadMyRequest()
}


function showData(newdata) {
  let data = newdata
  generateTable(data);
}


function formatDateString(dateString) {
  const originalDate = new Date(dateString);
  const year = originalDate.getFullYear();
  const month = String(originalDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(originalDate.getDate()).padStart(2, '0');

  // Format the date as "YYYY/MM/DD"
  const formattedDate = `${year}/${month}/${day}`;
  return formattedDate;
}

function getCurrentUserGuid() {
  let guid = "";
  let userKey = window.localStorage.getItem("user_key");
  if (userKey) {
    let user = JSON.parse(userKey);
    if (user.value) {
      guid = user.value.EmployeeGUID;
    }
  }
  return guid;
}

function formatDate(inputDate) {
  if (inputDate) {
    const dateTimeUTC = new Date(inputDate + "Z");
    const dateTimeIST = new Date(dateTimeUTC.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const day = dateTimeIST.getDate().toString().padStart(2, '0');
    const month = (dateTimeIST.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = dateTimeIST.getFullYear();
    let hours = dateTimeIST.getHours();
    const minutes = dateTimeIST.getMinutes();
    const seconds = dateTimeIST.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
    // const fullDate = `${day}/${month}/${year} ${formattedTime}`;
    const fullDate = `${day}/${month}/${year} `;
    return fullDate;
  }

  else {
    return "";
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

function generateTable(TableData) {
  let rg_RequestReport = document.getElementById('tablecontainer');
  rg_RequestReport.innerHTML = ""
  if (TableData && TableData.length > 0) {
    const ExportButton = document.getElementById('ExportButton');
    ExportButton.classList.remove('hide');
    let tableRow = "";
    let tableHead = `
                      <th class="qaf-th">Ticket ID</th>
                      <th class="qaf-th">Title</th>
                      <th class="qaf-th">Request For</th>
                      <th class="qaf-th">Select Date</th>
                      <th class="qaf-th">Due Date</th>
                      <th class="qaf-th">Reason</th>
                      <th class="qaf-th">Priority</th>
                      <th class="qaf-th">Status</th>
                       `;
    TableData.forEach(entry => {
      let AssignedTo_Value = ""
      if (entry.RequestFor) {
        ;
        AssignedTo_Value = getFullNameByRecordID(userOrGroupFieldRecordID(entry.RequestFor))
      }


      tableRow += `
          <tr class="qaf-tr">
              <td class="qaf-td"><a href="${window.location.origin}/workflow-engine/i-request-details?rn=rg&cbid=${entry.CreatedByGUID}&oid=${entry.objectid}&rid=${entry.RecordID}&incid=${entry.InstanceID}" target="_blank">${entry.TicketID}</a></td>
              <td class="qaf-td"><a href="${window.location.origin}/workflow-engine/i-request-details?rn=rg&cbid=${entry.CreatedByGUID}&oid=${entry.objectid}&rid=${entry.RecordID}&incid=${entry.InstanceID}" target="_blank">${entry.Title}</a></td>
              <td class="qaf-td">${AssignedTo_Value}</td>
              <td class="qaf-td">${entry.SelectDate ? formatDate(entry.SelectDate) : ""}</td>
              <td class="qaf-td">${formatDate(entry.DueDate)}</td>
              <td class="qaf-td">${entry.Description ? entry.Description : ""}</td>
              <td class="qaf-td">${entry.Priority ? entry.Priority.split(";#")[1] : ""}</td>
              <td class="qaf-td">${entry.Status ? entry.Status.split(";#")[1] : ""}</td>
             
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
    rg_RequestReport.innerHTML = tableValue;
    HideLoader()
  } else {
    const ExportButton = document.getElementById('ExportButton');
    ExportButton.classList.add('hide');
    const tableContainer = document.getElementById('tablecontainer');
    tableContainer.innerHTML = '';
    let tableHead = `
                      <th class="qaf-th">Ticket ID</th>
                      <th class="qaf-th">Title</th>
                      <th class="qaf-th">Request For</th>
                      <th class="qaf-th">Select Date</th>
                      <th class="qaf-th">Due Date</th>
                      <th class="qaf-th">Reason</th>
                      <th class="qaf-th">Priority</th>
                      <th class="qaf-th">Status</th>   `;
    let tableBody = '';
    let startRow = '<tr class="qaf-tr">';
    let endRow = '</tr>';
    let tableRow = `<td colspan="8" class="qaf-td" ><div class='no-record'>No Record Found</div></td>`;
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
    tableContainer.innerHTML = tableHTML;
    HideLoader();

  }

}

function formatLookup(inputString) {
  const delimiter = ";#";
  const index = inputString.indexOf(delimiter);
  if (index !== -1) {
    return inputString.substring(index + delimiter.length);
  }
  return "";
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

function SearchRequest() {
  let selectedstartDate = document.getElementById("startDate");
  let selectedendDate = document.getElementById("EndDate");
  let employeeName = document.getElementById("employeeName")
  let startDate = moment(selectedstartDate.value).format('YYYY/MM/DD');
  let EndDate = moment(selectedendDate.value).format('YYYY/MM/DD');
  let whereClause;
  if (employeeName.value) {
    whereClause = `(Status!='Closed')<<NG>>(RequestFor='${employeeName.value}')<<NG>>(SelectDate>='${startDate}'<AND>SelectDate<='${EndDate}')`
    loadPendingRequest(whereClause)
  }
  else {
    whereClause = `(Status!='Closed')<<NG>>(SelectDate>='${startDate}'<AND>SelectDate<='${EndDate}')`
    loadPendingRequest(whereClause)
  }
}

function loadMyRequest() {
  ShowLoader()
  rg_Data = []
  let userID = getCurrentUserGuid();
  let objectName = "Regularization_Request";
  let list = ["TicketID", "Title", "RequestFor", "SelectDate", "DueDate", "Description", "Priority", "Status",]
  let fieldList = list.join(",");
  let pageSize = "10000000";
  let pageNumber = "1";
  let orderBy = "true";
  let conditions = `CreatedByGUID='${userID}'`;
  let recordForField
  recordForField = {
    Tod: objectName,
    Ldft: fieldList,
    Ybod: orderBy,
    Ucwr: conditions,
    Zps: pageSize,
    Rmgp: pageNumber,
    Diac: "false",
    isWF: "true",
    wf: "Regularization Request",
  };
  window.QafService.Rfdf(recordForField).then((myRequest) => {

    if (Array.isArray(myRequest) && myRequest.length > 0) {

      rg_Data = myRequest;
    }
    showData(rg_Data);
  });
}


function loadPendingRequest(whereClause) {
  ShowLoader()
  rg_Data = []
  let objectName = "Regularization_Request";
  let list = ["TicketID", "Title", "RequestFor", "SelectDate", "DueDate", "Description", "Priority", "Status",]
  let fieldList = list.join(",");
  let pageSize = "10000000";
  let pageNumber = "1";
  let orderBy = "true";
  conditions = whereClause;
  let recordForField
  recordForField = {
    Tod: objectName,
    Ldft: fieldList,
    Ybod: orderBy,
    PendingWith: "",
    Ucwr: conditions,
    Zps: pageSize,
    Rmgp: pageNumber,
    Diac: "false",
    isWF: "true",
    wf: "Regularization Request",
  };
  window.QafService.Rfdf(recordForField).then((myRequest) => {
    if (Array.isArray(myRequest) && myRequest.length > 0) {
      rg_Data = myRequest;
    }
    showData(rg_Data);
  });

}


function download_csv() {
  let data = rg_Data;
  let csvData = [];
  data.forEach(val => {
    let AssignedTo = JSON.parse(val.RequestFor);
    RecordID = AssignedTo[0].RecordID;
    let AssignedTo_Value = getFullNameByRecordID(RecordID)
    let startDate = formatDate(val.SelectDate);
    let dueDate = formatDate(val.DueDate);
    let priority = formatLookup(val.Priority);
    let status = formatLookup(val.Status);


    let TicketID = val["TicketID"] ? val["TicketID"] : "";
    let Title = val["Title"] ? val["Title"] : "";
    let RequestFor = AssignedTo_Value ? AssignedTo_Value : "";
    let StartDate = startDate ? startDate : "";
    let DueDate = dueDate ? dueDate : "";
    let Description = val["Description"] ? val["Description"] : "";
    let Priority = priority ? priority : "";
    let Status = status ? status : "";
    csvData.push([TicketID, Title, RequestFor, StartDate, DueDate, Description, Priority, Status].join(","));
  });

  let csvBody = csvData.join('\n');
  let csvHeader = ["TicketID", "Title", "Request For", "Select Date", "Due Date", "Reason", "Priority", "Status"].join(',') + '\n';
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvHeader + csvBody);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'Regularization Request' + '.csv';
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