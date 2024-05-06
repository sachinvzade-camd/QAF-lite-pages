function externalFormValidationRule(){
    let a=document.getElementById('Date')
    if(a.value){
        let date=new Date(a.value)
        var currentdate = new Date();
var cur_month = currentdate.getMonth() + 1;
var lastsevendate=currentdate.getDate()-7
if(cur_month==date.getMonth()&&lastsevendate>date.getDate())
{
 alert("condition is true");
}
    }
}