let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let recordID = urlParams.get("vid");
// let recordID = '6a901716-d2b9-4778-826e-e83558a77256';


var menuList=[
  {
      Title:'Requisition',
      Icons:"fa-user-plus",
      URL:`recruitment/Candidate-Requisition`,
      Iframe:true,
  },
  {
      Title:'Candidate Search',
      Icons:"fa-search",
      URL:`recruitment/candidate-Search`,
      Iframe:true

  },
  {
      Title:'Job Posting',
      Icons:"fa-podcast",
      URL:`pages/jobposting`
  },
  {
      Title:'Setting',
      Icons:"fa-cog",
      URL:`recruitment/recruitment-setting`,
      Iframe:true

  },
  {
      Title:'Customer',
      Icons:"fa-users",
      URL:`crm/crm-customer-directory`,
      Iframe:true

  },
  {
      Title:'Contact',
      Icons:"fa-phone",
      URL:`crm/crm-contact-directory`,
      Iframe:true
  },
  {
      Title:'Vendor',
      Icons:"fa-id-card-o",
      URL:`pages/vendor`
  },
  {
      Title:'Manage Timesheet',
      Icons:"fa-calendar",
      URL:`pages/managetimesheet`
  },
  {
      Title:'Resources',
      Icons:"fa-crosshairs",
      URL:`pages/resources`,

  },
  {
    Title:'',
    Icons:"",
    URL:``,
    Display:false,
    Html:`<div class="container-fluid"> <div class="page row"> <div class="page-nav"> <div class="expense-app-links"><qaf-repeater data-bind-item="app" data-bind-style="qaf-grid" class="expense-app-links-dt"> <div><a class="dashboard-App" href="" style="text-decoration:none;display:flex;flex-direction:column;align-items:center;color:white;font-size:14px;margin-bottom:15px;text-align:center;width:85px"><i class="" aria-hidden="true" style="font-size:18px"></i><span class="text-center app-icon-text"></span></a></div> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" /> </qaf-repeater></div> </div> <div class="page-content col-md-12 "> <div clasdivs="expense-grid"> <div class="expense-top"> <h3>Payment Details</h3> </div> <div class="expense-data-grid"><qaf-grid id="expgrid" columns="gridExpenseColumns" action="true"></qaf-grid> </div> </div> </div> <div class="section2 col-md-4"id='section2'> </div> </div> </div> </div>

    `,
    IsFirstComponent:true
},
]



let expenseGrid = {
  repository: 'sample_payment',
  columns: [
    { field: 'SingleLine', displayName: 'Single Line', sorting: true },
    { field: 'vendor', displayName: 'Vendor', sorting: true },
  ],
  viewFields: ['SingleLine', 'vendor'],
  page: 1,
  pageSize: 10,
  dateFormat: 'YYYY/MM/DD',
  currentSelectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  filter: ""
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let gridExpenseColumns = [
  { field: 'SingleLine', displayName: 'Single Line', sequence: 1, sorting: true },
  { field: 'vendor', displayName: 'Vendor', sequence: 2, sorting: true },
 
];


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

function loadResourceGrid() {

  var myElement = document.getElementById('removeContainer');
    if (myElement.classList.contains('content')) {
      myElement.classList.remove('container-fluid');
    }   
  let userId = getCurrentUserGuid();
  let firstDay = startDate();
  let lastDay = endDate();
  let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
  let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
  let filterFormat = expenseGrid.filter;
  filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
  filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
  filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);

  let filterGridCondition = filterFormat;
  let expenseGridElement = document.querySelector('#expgrid');
  if (expenseGridElement) {
    expenseGridElement.show = true;
    window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition).then((filteredExpense) => {
      let propertiesToSplit = ["vendor"];
      let samplepayment = splitIdentifiers(filteredExpense, propertiesToSplit);
      expenseGridElement.Data = samplepayment;
      expenseGridElement.show = false;
      updateMonthElement();
    });

    // Add event handlers
    expenseGridElement.addEventListener('onNextPageEvent', nextPageEvent);
    expenseGridElement.addEventListener('onPrevPageEvent', prevPageEvent);
    expenseGridElement.addEventListener('onGridSortEvent', sortEvent);
    expenseGridElement.addEventListener('onPageSizeEvent', pageSizeEvent);
  }
}

function pageSizeEvent(page) {
  expenseGrid.pageSize = page.detail.pageSize;
  loadResourceGrid();
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

  let filterGridCondition = filterFormat;
  let expenseGridElement = document.querySelector('#expgrid');
  if (expenseGridElement) {
    expenseGridElement.show = true;
    window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, page.detail.currentPage, filterGridCondition).then((filteredExpense) => {
      expenseGridElement.Data = filteredExpense;
      expenseGridElement.show = false;
      updateMonthElement();
    });
  }
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

  let filterGridCondition = filterFormat;
  let expenseGridElement = document.querySelector('#expgrid');
  if (expenseGridElement) {
    expenseGridElement.show = true;
    window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, page.detail.currentPage, filterGridCondition).then((filteredExpense) => {
      expenseGridElement.Data = filteredExpense;
      expenseGridElement.show = false;
      updateMonthElement();
    });
  }
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

  let filterGridCondition = filterFormat;
  let expenseGridElement = document.querySelector('#expgrid');
  if (expenseGridElement) {
    expenseGridElement.show = true;
    window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, 1, filterGridCondition, page.detail.field, page.detail.order).then((filteredExpense) => {
      expenseGridElement.Data = filteredExpense;
      expenseGridElement.show = false;
      updateMonthElement();
    });
  }
}

function addResources() {
  if (window.QafPageService) {
    window.QafPageService.AddItem(expenseGrid.repository, function () {
      loadResourceGrid();
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

      let userId = getCurrentUserGuid();
      let firstDay = startDate();
      let lastDay = endDate();
      let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
      let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
      let filterFormat = expenseGrid.filter;
      filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
      filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
      filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);

      let filterGridCondition = filterFormat;

      window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition).then((filteredExpense) => {
        expenseGridElement.Data = filteredExpense;
        expenseGridElement.show = false;
      })
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

      let filterGridCondition = filterFormat;

      window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition).then((filteredExpense) => {
        expenseGridElement.Data = filteredExpense;
        expenseGridElement.show = false;
      })
    }
  }
}

function expgrid_onItemRender(cname, cvalue, row) {
  if (cname === 'Project') {
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
      return returnItems.join(';');
    }
  }
  if (cvalue) {
    return cvalue;
  } else {
    return '';
  }
}

function expgrid_onRowActionEvent(eventName, row) {
  if (window.QafPageService) {
    if (eventName === 'VIEW') {
      window.QafPageService.ViewItem(expenseGrid.repository, row.RecordID, function () {
        loadResourceGrid();
      });

    } else if (eventName === 'EDIT') {
      window.QafPageService.EditItem(expenseGrid.repository, row.RecordID, function () {
        loadResourceGrid();
      });

    } else if (eventName === 'DELETE') {
      window.QafPageService.DeleteItem(row.RecordID, function () {
        loadResourceGrid();
      });
    }
  }
}

let qafServiceLoaded = setInterval(() => {
 
  if (window.QafService) {
    document.getElementById('menu').data=menuList;
    myFunction();
    loadResourceGrid();
    getDetailsPage();
    clearInterval(qafServiceLoaded);
  }
}, 10);

function myFunction() {

  var introElements = document.getElementsByClassName('content');
    var firstIntroElement = introElements[0];
    firstIntroElement.setAttribute('id', 'removeContainer');
}


function getDetailsPage() {
  let objectName = "R_Vendor";
  let list = "RecordID,FirstName,LastName,Email,MobileNumber,Address";
  let orderBy = "";
  let whereClause = `RecordID='${recordID}'`;
  let fieldList = list.split(";#")
  let pageSize = "20000";
  let pageNumber = "1";
  window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((jobdescriptionList) => {
    if (Array.isArray(jobdescriptionList) && jobdescriptionList.length > 0) {
      let vendor = jobdescriptionList[0];
let myContent = document.getElementById("section2")

      let html = `       
      <div class="a">
          <h5 id="name" class="text mb-6">${vendor.FirstName}&nbsp;${vendor.LastName}</h5>
          <h6 class="text-left mb-6">
              Email:&nbsp;<span id="email">${vendor.Email}</span>
          </h6>
      </div>
      <hr style="border: 1px solid gray;">
      <div class="accordion accordion-flush" id="responsiveAccordion">
          <!-- Accordion Item 1 -->
          <div class="accordion-item">
              <h6 class="accordion-header" id="headingOne">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse"
                      data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      Contact Information
                  </button>
              </h6>
              <div id="collapseOne" aria-labelledby="headingOne" data-bs-parent="#responsiveAccordion"
                  class="accordion-collapse collapse show"">
                  <div class="accordion-body">
                  <div class=" info bodyContent">
                         <h6>First Name</h6>
                          <p>${(vendor.FirstName== null ? "" : vendor.FirstName)}</p>
                      </div>
                      <div class="info bodyContent">
                          <h6>Last Name</h6>
                          <p>${(vendor.LastName== null ? "" : vendor.LastName)}</p>
                      </div>
                      <div class="info bodyContent">
                          <h6>Email</h6>
                          <p>${vendor.Email== null ? "" : vendor.Email}</p>
                      </div>
                      <div class="info bodyContent">
                          <h6>Mobile Number</h6>
                          <p>${vendor.MobileNumber== null ? "" : vendor.MobileNumber}</p>
                      </div>
                      <div class="info bodyContent">
                          <h6>Address</h6>
                          <p>${vendor.Address== null ? "" : vendor.Address}</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      `
        ;
      myContent.innerHTML = html;
    }
  })
};



function splitIdentifiers(arrayOfObjects, propertiesToSplit) {

  let updatedArray = arrayOfObjects.map(obj => ({ ...obj }));
  updatedArray = updatedArray.map(obj => {
    propertiesToSplit.forEach(property => {
      if (obj && obj.hasOwnProperty(property) && obj[property] !== null && obj[property] !== undefined && typeof obj[property] === 'string') {
        let valuesArray = obj[property].split(';#').filter(Boolean);
        obj[property] = valuesArray.filter((value, index) => index % 2 !== 0);
      }
    });

    return obj;
  });

  return updatedArray;
}
