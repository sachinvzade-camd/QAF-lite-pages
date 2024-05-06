var recruiterValue=""
var jobpostValue=""
var startTime=""
var endTime="";
var employeeList=[]
var jobTrackerList=[]
document.getElementById("startTime").addEventListener("change", function() {
  startTime =new Date( this.value);
});
document.getElementById("endTime").addEventListener("change", function() {
  endTime = new Date( this.value);
});
let qafServiceLoaded = setInterval(() => {
    if(window.QafService){
        getRecruiter();
        clearInterval(qafServiceLoaded);
    }
 }, 10);

 function getRecruiter(){
    employeeList=[]
    let objectName = "Employees";
    let list = 'FirstName,LastName'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = ``;
    let orderBy = "true"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
        if (Array.isArray(employees) && employees.length > 0) {
    employeeList=employees
            let recruiterDropdown=document.getElementById('recruiter');
            let options=`<option value=''>Select Recruiter</option>`
            if(recruiterDropdown){
              employees.forEach(emp=>{
                options+= `<option value=${emp.RecordID}>${emp.FirstName} ${emp.LastName}</option>`
              })
              recruiterDropdown.innerHTML=options;
            }
           
        } 
        getjobposting()
    });
  }
  function getjobposting(){
    let objectName = "Job_Posting";
    let list = 'JobTitle'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = ``;
    let orderBy = "true"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((jobpostings) => {
        if (Array.isArray(jobpostings) && jobpostings.length > 0) {
            let jobpostDropdown=document.getElementById('jobpost');
            let options=`<option value=''>Select JobPost</option>`
            if(jobpostDropdown){
              jobpostings.forEach(job=>{
                options+= `<option value=${job.RecordID}>${job.JobTitle}</option>`
              })
              jobpostDropdown.innerHTML=options;
            }
        } 
        getTracker()
  
    });
  }
  function getTracker(){
    let objectName = "Job_Tracker";
    let list = 'JobPost,Candidate,Recruiter,CurrentStatus,Source,ContactNumber,Email'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = getWhereClause();
    let orderBy = "true"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((jobtrackers) => {
        if (Array.isArray(jobtrackers) && jobtrackers.length > 0) {
            jobTrackerList=jobtrackers;
            jobTrackerList.forEach(val=>{
                val.JobPost=formatGridValue(val.JobPost)
                val.Candidate=formatGridValue(val.Candidate)
                val.CreatedDate=dateFormat(val.CreatedDate)
                val.Recruiter=formatUOG(val.Recruiter)
            })
            displayTable(jobTrackerList)
        } else{
            displayTable([])
        }
    });
  }
  function searchReport(){
    getTracker();
  }
  function getWhereClause() {
    let whereclause = [];
    let recruiter = document.getElementById("recruiter");
    let jobpost = document.getElementById("jobpost");
    if (recruiter) {
      recruiterValue = recruiter.value;
    }
    if (jobpost) {
      jobpostValue = jobpost.value;
    }
    if (recruiterValue) {
      whereclause.push(`(Recruiter='${recruiterValue}')`)
    }
    if (jobpostValue) {
      whereclause.push(`(JobPost='${jobpostValue}')`)
    }
    if (startTime && endTime) {
      let startDate = `${startTime.getFullYear()}/${startTime.getMonth() + 1}/${startTime.getDate()}`;
      let endDate = `${endTime.getFullYear()}/${endTime.getMonth() + 1}/${endTime.getDate()}`;
      whereclause.push(`(CreatedDate>='${startDate}'<AND>CreatedDate<='${endDate}')`)
    }
  
    if (whereclause && whereclause.length > 0) {
      if (whereclause.length === 1) {
        return (whereclause[0].substring(0, whereclause[0].length - 1)).substring(1);
      }
      return whereclause.join("<<NG>>")
    }
    return ""
  }
 function displayTable(jobTrackerList){
    var table = new Tabulator("#example-table", {
        data: jobTrackerList,
        layout: "fitColumns",
        pagination: "local",
        paginationSize:10,
        tooltips: true,
        placeholder:"No Record Found",
        columns: [
            {
                title: "Job Post",
                field: "JobPost",
            },
            {
                title: "Name",
                field: "Candidate",
            },
            {
                title: "Tracker Date",
                field: "CreatedDate",
            },
            {
                title: "Recruiter",
                field: "Recruiter",
            },
            {
                title: "Status",
                field: "CurrentStatus",
            },
            {
                title: "Source",
                field: "Source",
            },
            {
                title: "Contact Number",
                field: "ContactNumber",
            },
            {
                title: "Email",
                field: "Email",
            }
        ],
        
    });
    
  }

  function formatGridValue(cvalue){
    if(cvalue && cvalue.indexOf(';#') !== -1){
      let values = cvalue.split(';#');
      let oddArray = [];
      values.forEach((v, idx)=>{
        oddArray.push(idx);
      })
      let odds = oddArray.filter(n => n%2);
      let returnItems = [];
      odds.forEach((d)=>{
        returnItems.push(values[d]);
      })
      return returnItems.join(';');
    }
  if(cvalue){
    return cvalue;
  }else{
    return '';
  }
}
function dateFormat(cvalue){
    if(cvalue ){
        let date = new Date(cvalue);
        let formatedDate=`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
        return formatedDate;
      }else{
      return  ''
      }
  
}
function formatUOG(cvalue){
    if(cvalue){
        let recruiterID=JSON.parse(cvalue)[0].RecordID;
        let employee=employeeList.filter(emp=>emp.RecordID===recruiterID);
        if(employee&&employee.length>0){
          return employee[0].FirstName+" "+employee[0].LastName
        }
        return ""
    }
    return ""
}