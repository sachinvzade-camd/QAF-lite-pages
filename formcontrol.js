function externalFormValidationRule(){
    return new Promise((resolve) => {
        
           let a=document.getElementById('SelectDate')
    if(a.value){
        let dateFormate =getByKey("TimeZone");
        let timezoneLable = dateFormate ? dateFormate.split(",")[1] : "Asia/Kolkata";
        let language = dateFormate ? dateFormate.split(",")[0] : "IN";
        let date=(new Date(a.value).toLocaleString(language, { timeZone: timezoneLable }))
        let selectedDate=convertDate(date)
        var currentdate = new Date();
        var last2datefromcurentDate = new Date();
        last2datefromcurentDate.setDate(last2datefromcurentDate.getDate() - 2);
if(selectedDate.toDateString()==currentdate.toDateString())
{
 alert("Current Date not allow to select");
}
else if(last2datefromcurentDate.toDateString()<selectedDate.toDateString()){
 alert("only 2 days allow from current date");

}
    }
    })

}
function convertDate(date){
    const dateString = date;
const [datePart, timePart] = dateString.split(",");
const [ month,day, year] = datePart.split("/");
const dateObject = new Date(year, month - 1, day);
return dateObject
}
function getByKey(key) {
    let cacheValue = this.localStorage.getItem(key);
    if (cacheValue && (cacheValue != "undefined")) {
      return JSON.parse(cacheValue);
    }
  }
function onQafInit(){
    
    console.log(window.hiddenFieldsForm);
    window.hiddenFieldsForm=["Lookup"]
    console.log(window.hiddenFieldsForm);
    
}