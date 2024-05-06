var noRecordFoundImages;
var sharedJDURL;
let qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        getDetails()
        clearInterval(qafServiceLoaded);
    }
}, 10);

function getDetails() {
    let objectName = "Company_Settings";
    let list = "PortalImage";
    let orderBy = "";
    let whereClause = "";
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((data) => {
      if (Array.isArray(data) && data.length > 0) {
      noRecordFoundImages = window.location.origin+"/Attachment/downloadfile?fileUrl="+encodeURIComponent(getURLFromJson(data[0].PortalImage))
        this.getSharedJDURL()
      }
    })
  }

function getJobPosting() {
    let date=new Date()
    let startDate = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;
    let objectName = "Job_Posting";
    let list = "JobTitle,RecordID,JobImage,PostingExpiresOn,IsPublish";
    let orderBy = "";
    let whereClause = "(PostingExpiresOn>='" +startDate + "'<OR>PostingExpiresOn='')<<NG>>(IsPublish='true')";
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((jobsList) => {
        if (Array.isArray(jobsList) && jobsList.length > 0) {
          let carttemplate="";
            jobsList.forEach(val => {
                let imageURL=val.JobImage?window.location.origin+"/Attachment/downloadfile?fileUrl="+encodeURIComponent(getURLFromJson(val.JobImage)):noRecordFoundImages
                carttemplate += `<div class="card" onclick="openJobDetails('${val.RecordID}')">
<div class="card__image-container">
  <img
    src="${imageURL}"
  />
</div>
<div class="card__content">
    ${val.JobTitle}
</div>
</div>`
            })
            document.getElementById('newcards').innerHTML=carttemplate;
        }
    });

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
  function getSharedJDURL() {
    let objectName = "Recruitment_Settings";
    let list = "SettingName,SettingValue";
    let orderBy = "";
    let whereClause = `SettingName='SharedJD'`;
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((settings) => {
      if (Array.isArray(settings) && settings.length > 0) {
        sharedJDURL=settings[0].SettingValue
        this.getJobPosting()
      }
    })
  }
  function openJobDetails(parameter1) {
    let url=sharedJDURL+`?jobID=${parameter1}`
    window.open(url,"_blank")
}
  