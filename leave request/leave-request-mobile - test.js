var leaveTypesList=[];
var leaveBalance;
var startTime=""
var endTime="";
var attachmenturl="";
var EmployeeID_Value;
var EmployeeGUID_Value;
var EmployeeEmail_Value;
var file;
var filename;
var attachmentRepoAndFieldName;
var funFirstapiURL = "https://inskferda.azurewebsites.net"
var SITapiURL = "https://demtis.quickappflow.com"




document.getElementById("startTime")&&document.getElementById("startTime").addEventListener("change", function() {
    startTime =new Date(this.value);
    let displayStartTimeElement=document.getElementById('displayStartTime');
    if(displayStartTimeElement){
      displayStartTimeElement.value=moment(startTime).format('DD-MM-YYYY')
    }
    if(startTime&&endTime){
        calculateDifference()
    }
  });

  document.getElementById("endTime")&&document.getElementById("endTime").addEventListener("change", function() {
    endTime = new Date( this.value);
    let displayStartTimeElement=document.getElementById('displayEndTime');
    if(displayStartTimeElement){
      displayStartTimeElement.value=moment(endTime).format('DD-MM-YYYY')
    }
    if(startTime&&endTime){
        calculateDifference()
    }
  });
  
 qafServiceLoaded = setInterval(() => {
    if(window.QafService){
  // var lsvalue = new CustomEvent('setlskey', { detail: { key: "user_key" } })
  // window.parent.document.dispatchEvent(lsvalue)
  // window.document.addEventListener('getlsvalue', getLocalstoreageDetails)
      setTimeout(() => {
        getLeaveType();
        getEmployeeLeaveBalance();
     
      },200)
      clearInterval(qafServiceLoaded);
    }
 }, 10);
 function getLocalstoreageDetails(event) {
  if(typeof(event.detail)==='object'){
  const { EmployeeGUID, EmployeeID,Email } = event.detail;
  EmployeeID_Value = EmployeeID;
  EmployeeGUID_Value = EmployeeGUID;
  EmployeeEmail_Value = Email;
}
}

function getEmployeeLeaveBalance(){
    employeeList=[]
    let currentYear=new Date().getFullYear()
    let objectName = "Employee_Leave_Balance";
    let list = 'Employee,Year,LeaveBalance,CompOffLeaveBalance,PersonalLeaveBalance,UnpaidLeaveBalance,OpeningBalance,MedicalLeaveBalance,SickLeaveBalance'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `(Year='${currentYear}')<<NG>>(Employee='${EmployeeGUID_Value}')`;
    let orderBy = "true"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((balance) => {
        if (Array.isArray(balance) && balance.length > 0) {
            leaveBalance=balance[0]
        } 
    });
  }

 function getLeaveType(){
    employeeList=[]
    let objectName = "Leave_Type";
    let list = 'Name,MappingwithLeaveBalance'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = ``;
    let orderBy = "true"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((leaveTypes) => {
        if (Array.isArray(leaveTypes) && leaveTypes.length > 0) {
            leaveTypesList=leaveTypes
            let leaveDropdown=document.getElementById('leaveType');
            let options=`<option value=''></option>`
            if(leaveDropdown){
                leaveTypesList.forEach(type=>{
                options+= `<option value=${type.RecordID}>${type.Name}</option>`
              })
              leaveDropdown.innerHTML=options;
            }
           
        } 
    });
  }
  function handleChangeleaveType(){
    let leaveType=document.getElementById('leaveType');
    if(leaveType){
        let value=leaveTypesList.find(type=>type.RecordID===leaveType.value)
        if(value){
          if(leaveBalance){
            let currentLeaveBalance=leaveBalance[value.MappingwithLeaveBalance]
            let leaveBalanceElement=document.getElementById('leaveBalance');
            if(leaveBalanceElement){
                leaveBalanceElement.value=currentLeaveBalance
            }
          }
        }else{
          let leaveBalanceElement=document.getElementById('leaveBalance');
          if(leaveBalanceElement){
              leaveBalanceElement.value=0
          }
        }
  }
  }
  function saveAppplyForm(){
    let leaveButton=document.getElementById('apply_leave');
    if(leaveButton){
        leaveButton.disabled=true
    }
    let leaveTypeValue=""
    let titleValue=""
    let NoteValue=""
    let numberofdaysValue=0
    let leaveType=document.getElementById('leaveType');
    let Title=document.getElementById('Title');
    let Note=document.getElementById('Note');
    let numberofdays=document.getElementById('numberofdays');
    let isSaveSubmit=true;
    if(numberofdays){
        numberofdaysValue=numberofdays.value
    }
    if(leaveType){
        let value=leaveTypesList.find(type=>type.RecordID===leaveType.value)
        if(value){
            leaveTypeValue=value.RecordID+";#"+value.Name
            if(value.Name.toLowerCase()==="Unpaid Leave".toLowerCase()){
              isSaveSubmit=true
            }else{
              if(leaveBalance){
                let currentLeaveBalance=leaveBalance[value.MappingwithLeaveBalance]
                if(parseFloat(numberofdaysValue)>currentLeaveBalance){
                    isSaveSubmit=false
                }}
            }

        }
    }
     if(isSaveSubmit){
    if(Title){
        titleValue=Title.value
    }
    if(Note){
        NoteValue=Note.value
    }
    let halfdayelement = document.getElementById("halfday");
    let  halfvalue = halfdayelement.checked;
    let object={
        Title:titleValue,
        LeaveType:leaveTypeValue,
        StartDate: startTime?storeDateWithTimeZone(startTime,'',false,false) : "",
        EndDate: endTime?storeDateWithTimeZone(endTime,'',false,false) : "",
        HalfDayLeave: halfvalue ? true : false,
        NumberofDays:numberofdaysValue?parseFloat(numberofdaysValue):'',
        Note:NoteValue,
        Attachment:attachmenturl
    }
    if(!titleValue){
      if(leaveButton){
        leaveButton.disabled=false
    }
    alert('Brief about the request is required')
    }
   else if(!leaveTypeValue){
    if(leaveButton){
      leaveButton.disabled=false
  }
    alert('Leave Type is required')

    }
   else if(!startTime){
    if(leaveButton){
      leaveButton.disabled=false
  }
    alert('Start Date is required')

    }
   else if(!endTime){
    if(leaveButton){
      leaveButton.disabled=false
  }
    alert('End Date is required')
    }else{
      save(object, 'Leave_Request')
    }
  }
  else{
    alert("Leave taken is more than leave balance")
    if(leaveButton){
        leaveButton.disabled=false
    }
  }

  }

  function save(object, repositoryName) {
    return new Promise((resolve) => {
      var recordFieldValueList = [];
      var intermidiateRecord = {}
      
      Object.keys(object).forEach((key, value) => {
        recordFieldValueList.push({
          FieldID: null,
          FieldInternalName: key,
          FieldValue: object[key]
        });
      });
      intermidiateRecord.CreatedByID = EmployeeID_Value;
      intermidiateRecord.CreatedDate = new Date();
      intermidiateRecord.LastModifiedBy = null;
      intermidiateRecord.ObjectID = repositoryName;
      intermidiateRecord.RecordID = null;
      intermidiateRecord.RecordFieldValues = recordFieldValueList;
      window.QafService.CreateItem(intermidiateRecord).then(response => {
        clearForm()
        resolve({
          response
        })
      });
    }
    )
  
  }
  function getByKey(key) {
    let cacheValue = this.localStorage.getItem(key);
    if (cacheValue && (cacheValue != "undefined")) {
      return JSON.parse(cacheValue);
    }
  }

  function calculateDifference(){
    if(moment(endTime).isSameOrAfter(startTime,'date')){
      const date1 = new Date(startTime);
      const date2 = new Date(endTime);
      const diffTime = Math.abs(date2 - date1);
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))+1; 
      let totaldays=document.getElementById('numberofdays');
      let halfdayelement = document.getElementById("halfday");
      let  halfvalue = halfdayelement.checked;
      if(halfvalue){
          diffDays=diffDays/2
      }
      
          if(totaldays){
              totaldays.value=diffDays;
          }
    }
    else{
      alert('Please select proper date range')
    }

  }
  function handleChangehalfday(){
   
    if(startTime&&endTime){
        calculateDifference()
    }
  }
  function clearForm(){
      let Title=document.getElementById('Title');
    let leaveType=document.getElementById('leaveType');
   let startDate= document.getElementById("startTime")
   let endDate= document.getElementById("endTime")
   let halfdayelement = document.getElementById("halfday");
    let Note=document.getElementById('Note');
    let numberofdays=document.getElementById('numberofdays');

    if(Title){
        Title.value=""
    }
    if(leaveType){
        leaveType.value=""
    }
    if(Note){
        Note.value=""
    }
    if(numberofdays){
        numberofdays.value=""
    }
    if(startDate){
        startDate.value="";
        startTime=""
    }
    if(endDate){
        endDate.value="";
        endTime=""
    }
    if(halfdayelement){
        halfdayelement.checked=false
    }
    let leaveButton=document.getElementById('apply_leave');
    if(leaveButton){
        leaveButton.disabled=false
    }
    let closeformevent = new CustomEvent('closeformevent')
    window.parent.document.dispatchEvent(closeformevent)
  }
  function getByKey(key) {
    let cacheValue = this.localStorage.getItem(key);
    if (cacheValue && (cacheValue != "undefined")) {
      return JSON.parse(cacheValue);
    }
  }
 function storeDateWithTimeZone(dateString, timeZone = "", isTimeSelected = false, isTimePresent= false) {
  let dateFormate = getByKey("TimeZone");
  let timezoneLable = dateFormate ? dateFormate.split(",")[1] : "Asia/Kolkata";
  timeZone = timeZone ? timeZone : timezoneLable
   
    // offset to hours and minutes
    let totaloffset = moment.tz(timeZone).utcOffset();
    let offsethours = Number(Math.floor(totaloffset / 60));
    let offsetMinutes = Number(totaloffset % 60);
    if (offsethours < 0) {
      offsethours = Math.abs(offsethours)
      offsetMinutes = Math.abs(offsetMinutes)
    } else {
      offsethours = -Math.abs(offsethours);
      offsetMinutes = -Math.abs(offsetMinutes);
    }

    if (dateString) {
      // date convert year,month,date
      let year= Number(moment(dateString).format("YYYY"))
      let month = Number(moment(dateString).format("MM"))
      let date = Number(moment(dateString).format("DD"))
      let hour = Number(moment(dateString).format("hh"))
      let modifier = (moment(dateString).format("a"))
      let minutes = Number(moment(dateString).format('mm'));
      if (isTimeSelected) {
        let currentTime = this.getCurrentTime()
        hour = Number(moment(currentTime).format("hh"))
        modifier = (moment(currentTime).format("a"))
        minutes = Number(moment(currentTime).format('mm'));
      }
      // check meridian 
      if (modifier.toUpperCase() === 'PM') {
        if (hour === 12) {
          hour = 12
        } else {
          hour = hour + 12;
        }
      } else {
        if (hour === 12) {
          hour = 0
        }
      }
      if (isTimeSelected && !isTimePresent) {
        let dateTime = new Date(year, month - 1, date, hour + offsethours, minutes + offsetMinutes, 0);
        return moment(dateTime).format("YYYY-MM-DDTHH:mm:ss")
      }
      if (!isTimeSelected && isTimePresent) {
        let dateTime = new Date(year, month - 1, date, hour + offsethours, minutes + offsetMinutes, 0);
        return moment(dateTime).format("YYYY-MM-DDTHH:mm:ss")
      }
      else {
        let dateTime = new Date(year, month - 1, date, 12 + offsethours, 0 + offsetMinutes, 0)
        return moment(dateTime).format("YYYY-MM-DDTHH:mm:ss")
      }
    };
  }


//   function onFileChange(event){
//     let selectedFiles = event.files;
//     let type = selectedFiles[0] && selectedFiles[0].name.substr(selectedFiles[0].name.lastIndexOf('.'), selectedFiles[0].name.length).toLowerCase();
//     if (type != ".exe") {
//       let recordId = "";
//       file = selectedFiles[0];
//       filename = file && file.name ?file.name : '';
//         attachmentRepoAndFieldName = `Leave_Request;#Attachment`;
//         document.getElementById('filename').innerHTML=filename
//         document.getElementById('deleteicon').style.display='block'

//     }
//   }
//   function  deleteFile(){
//     filename=""
//     file=null
//     attachmentRepoAndFieldName=""
//     document.getElementById('filename').innerHTML=filename
//     document.getElementById('deleteicon').style.display='none'
//     document.getElementById('UploadResume').value = "";

//   }
//   function   uploadAttachment() {
//     if(file){

//     const form = new FormData();
//     form.append('file', file, file && file.name);
//     form.append("file_type", attachmentRepoAndFieldName);
//     form.append("recordID", '');
//     fetch(`https://qaffirst.quickappflow.com/Attachment/uploadfile`, {
//         method: 'POST',
//         headers: {
//             'Host': 'demtis.quickappflow.com',
//             'Employeeguid': user.value.EmployeeGUID,
//             'Hrzemail': user.value.Email
//         },
//         body:form
//     })
//         .then(response => response.json())
//         .then(fileResponse => {
//           attachmenturl=fileResponse.url
//     saveAppplyForm()
//         })
//     }
// else{
//     saveAppplyForm()
// }
//   }