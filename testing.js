var arrayList=["krunal","sachin","Niranjani","Mamta"]
function init(){
    document.getElementById('qafautocomplete').dataCopy=arrayList
}
function qafautocomplete_onItemSelected (){
    
    let autoElement=document.getElementById('qafautocomplete');
    if(autoElement){
        
        let value=autoElement.state.selectedItem;
      
    }
}
init()