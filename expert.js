// Expense app

let expenseGrid = {
    repository: 'Submitted_Answersheet',
    columns: [
          {field:'Answersheet', displayName:'Interview Test', sorting: true},
          {field:'UploadYourPsychometricTest', displayName:'Personal Information Sheet', sorting: true},
          {field:'SubmittedDate', displayName:'Submitted Date', sorting: true},
    {field:'ReviewAssignedDate', displayName:'Review Assigned Date', sorting: true},
    {field:'Qualification', displayName:'Qualification', sorting: true},
    {field:'Role', displayName:'Role', sorting: true},
    {field:'Status', displayName:'Status', sorting: true},
    {field:'JobPost', displayName:'JobPost', sorting: true},

    ],
    viewFields: ['Answersheet','Feedback','ReviewAssignedDate','SubmittedDate','Qualification','Role','Examiner','Status'],
    page: 1,
    pageSize: 10,
    dateFormat: 'YYYY/MM/DD',
    currentSelectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    // filter: "CreatedByGUID='{{CURRENTUSERID}}'<<NG>>(CreatedDate>='{{STARTOFMONTH}}'<AND>CreatedDate<='{{ENDOFMONTH}}')"
    // filter: "Examiner='{{CURRENTUSERID}}'<<NG>>Feedback='HW test - in review'"
    filter: ""
  }

const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

let gridExpenseColumns = [
    {field:'Answersheet', displayName:'Interview Test',sequence:1, sorting: true},
    {field:'UploadYourPsychometricTest', displayName:'Personal Information Sheet',sequence:2, sorting: true},
    {field:'SubmittedDate', displayName:'Submitted Date',sequence:3, sorting: true},
    {field:'ReviewAssignedDate', displayName:'Review Assigned Date',sequence:4, sorting: true},
    {field:'Qualification', displayName:'Qualification',sequence:5, sorting: true},
    {field:'Role', displayName:'Role',sequence:6, sorting: true},
    {field:'Status', displayName:'Status',sequence:7, sorting: true},
    {field:'JobPost', displayName:'JobPost',sequence:8, sorting: true},
   
];

function updateMonthElement(){
  let currentDate = expenseGrid.currentSelectedDate;
  let currentMonthYear = `${monthNames[currentDate.getMonth()]}-${currentDate.getFullYear()}`;
  if(currentMonthYear){
    let ele = document.querySelector('.expense-current-month');
    if(ele){
      document.querySelector('.expense-current-month').innerText = currentMonthYear;
    }
  }
}

function getCurrentUserGuid(){
  
  let guid = '';
  let userKey = window.localStorage.getItem('user_key');
  if(userKey){
    let user = JSON.parse(userKey);
    if(user.value){
      guid = user.value.EmployeeGUID;
    }
  }
  return guid;
}

function startDate(){
  var currentDate = expenseGrid.currentSelectedDate;
  var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  return firstDay;
}

function endDate(){
  var currentDate = expenseGrid.currentSelectedDate;
  var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  return lastDay;
}

function loadExpenseGrid(){
  let userId = getCurrentUserGuid();
  let firstDay = startDate();
  let lastDay = endDate();
  let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
  let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
  let filterFormat = expenseGrid.filter;
  filterFormat = filterFormat.replace('{{CURRENTUSERID}}',userId);
  filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
  filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);

  let filterGridCondition = filterFormat;
  let expenseGridElement = document.querySelector('#expgrid'); 
  if(expenseGridElement){
      expenseGridElement.show = true;
let orderBy="false"

      window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition,'',orderBy).then((filteredExpense)=>{
      expenseGridElement.Data = filteredExpense;
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

function pageSizeEvent(page){
  expenseGrid.pageSize = page.detail.pageSize;
  loadExpenseGrid();
}

function nextPageEvent(page){
    let userId = getCurrentUserGuid();
    let firstDay = startDate();
    let lastDay = endDate();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
    let filterFormat = expenseGrid.filter;
    filterFormat = filterFormat.replace('{{CURRENTUSERID}}',userId);
    filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
    filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);

    let filterGridCondition = filterFormat;
    let expenseGridElement = document.querySelector('#expgrid'); 
    if(expenseGridElement){
        expenseGridElement.show = true;
let orderBy="false"

        window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, page.detail.currentPage, filterGridCondition,'',orderBy).then((filteredExpense)=>{
        expenseGridElement.Data = filteredExpense;
        expenseGridElement.show = false;
        updateMonthElement();
        });
    }
}

function prevPageEvent(page){
    let userId = getCurrentUserGuid();
    let firstDay = startDate();
    let lastDay = endDate();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
    let filterFormat = expenseGrid.filter;
    filterFormat = filterFormat.replace('{{CURRENTUSERID}}',userId);
    filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
    filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);

    let filterGridCondition = filterFormat;
    let expenseGridElement = document.querySelector('#expgrid'); 
    if(expenseGridElement){
        expenseGridElement.show = true;
let orderBy="false"

        window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, page.detail.currentPage, filterGridCondition,'',orderBy).then((filteredExpense)=>{
        expenseGridElement.Data = filteredExpense;
        expenseGridElement.show = false;
        updateMonthElement();
        });
    }
}

function sortEvent(page){
    let userId = getCurrentUserGuid();
    let firstDay = startDate();
    let lastDay = endDate();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
    let filterFormat = expenseGrid.filter;
    filterFormat = filterFormat.replace('{{CURRENTUSERID}}',userId);
    filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
    filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);

    let filterGridCondition = filterFormat;
    let expenseGridElement = document.querySelector('#expgrid'); 
    if(expenseGridElement){
        expenseGridElement.show = true;
let orderBy="false"

        window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, 1, filterGridCondition, page.detail.field, page.detail.order,'',orderBy).then((filteredExpense)=>{
        expenseGridElement.Data = filteredExpense;
        expenseGridElement.show = false;
        updateMonthElement();
        });
    }
}

function addExpense(){
    if(window.QafPageService){
      window.QafPageService.AddItem(expenseGrid.repository, function(){
        loadExpenseGrid();
      });
    }
  }

function nextMonth(e){
  //Get grid by id
  let expenseGridElement = document.querySelector('#expgrid');
  if(expenseGridElement){
    if(window.QafService){
      expenseGrid.currentSelectedDate.setMonth(expenseGrid.currentSelectedDate.getMonth() + 1);
      expenseGridElement.show = true;
      updateMonthElement();

      let userId = getCurrentUserGuid();
      let firstDay = startDate();
      let lastDay = endDate();
      let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
      let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
      let filterFormat = expenseGrid.filter;
      filterFormat = filterFormat.replace('{{CURRENTUSERID}}',userId);
      filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
      filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);

      let filterGridCondition = filterFormat;
      let orderBy="false"

      window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition,'',orderBy).then((filteredExpense)=>{
        expenseGridElement.Data = filteredExpense;
        expenseGridElement.show = false;
      })
    }
  }
}

function prevMonth(e){
  //Get grid by id
  let expenseGridElement = document.querySelector('#expgrid');
  if(expenseGridElement){
    if(window.QafService){
      expenseGrid.currentSelectedDate.setMonth(expenseGrid.currentSelectedDate.getMonth() - 1);
      expenseGridElement.show = true;
      updateMonthElement();

      let userId = getCurrentUserGuid();
      let firstDay = startDate();
      let lastDay = endDate();
      let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
      let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
      let filterFormat = expenseGrid.filter;
      filterFormat = filterFormat.replace('{{CURRENTUSERID}}',userId);
      filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
      filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);

      let filterGridCondition = filterFormat;
      let orderBy="false"

      window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition,'',orderBy).then((filteredExpense)=>{
        expenseGridElement.Data = filteredExpense;
        expenseGridElement.show = false;
      })
    }
  }
}

function expgrid_onItemRender(cname, cvalue, row){
  
  if(cname === 'Qualification'||cname === 'Role'){
      if(cvalue && cvalue.indexOf(';#') >-1){
        let values = cvalue.split(';#')[1];
        return values;
      }else{
      return  cvalue?cvalue:''
      }
    }
    if(cname === 'SubmittedDate'||cname === 'ReviewAssignedDate'){
      if(cvalue ){
        let date = new Date(cvalue);
        let formatedDate=`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
        return formatedDate;
      }else{
      return  ''
      }
    }
     if(cname === 'Answersheet'){
      if(cvalue ){
        let attchmenent=""
       try{
          let parseAttachment=JSON.parse(cvalue);
          if(Array.isArray(parseAttachment)&&parseAttachment.length>0){
            let attachmentsArray=[];
            parseAttachment.forEach(attchment=>{
              let attachmentLink=`<a href='https://hrssalturkidev.azurewebsites.net/Attachment/downloadfile?fileUrl=${encodeURIComponent(attchment.link)}'>${attchment.displayName}</a>`
              attachmentsArray.push(attachmentLink)
            })
            attchmenent=  attachmentsArray.join(" ")

          }
       }
       catch(e){
        console.log(e);
       }
        return attchmenent;
      }else{
      return  ''
      }
    }
    else{
      return cvalue?cvalue:''
    }
  }

function expgrid_onRowActionEvent(eventName, row){
  if(window.QafPageService){
    if(eventName === 'VIEW'){
        window.QafPageService.ViewItem(expenseGrid.repository, row.RecordID, function(){
          loadExpenseGrid();
        });

    }else if(eventName === 'EDIT'){
        window.QafPageService.EditItem(expenseGrid.repository, row.RecordID, function(){
          loadExpenseGrid();
        });

    }else if(eventName === 'DELETE'){
        window.QafPageService.DeleteItem(row.RecordID, function(){
          loadExpenseGrid();
        });
    }
  }
}

 let qafServiceLoaded = setInterval(() => {
    if(window.QafService){
      isEmployeePresentInTeam();
        clearInterval(qafServiceLoaded);
    }
 }, 10);
 function isEmployeePresentInTeam(){
  let userId = getCurrentUserGuid();
  let objectName = "Teams";
  let fieldList = ["TeamName","TeamMembers"];
  let pageSize = "20000";
  let pageNumber = "1";
  let whereClause = `(TeamName='HOD')<<NG>>(TeamMembers='${userId}')`;
let orderBy="false"

      window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause,'',orderBy).then((filteredExpense)=>{
        if (Array.isArray(filteredExpense) && filteredExpense.length > 0) {
          loadExpenseGrid();
        }else{
          let sideNavBar=document.getElementsByClassName('expense-app-links-dt')[0].shadowRoot;
          let sideBarElementList=sideNavBar.querySelectorAll('div');
          sideBarElementList.forEach((val,index)=>{
            if(index===(sideBarElementList.length-1)){
              val.style.display = 'none';
            }
          })
          loadExpenseGrid();
        }
      });
}


