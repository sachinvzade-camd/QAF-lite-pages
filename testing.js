var arrayList=["krunal","k1"]
function init(){
    document.getElementById('qafautocomplete').dataCopy=arrayList
}
function qafautocomplete_onItemSelected (){
    let autoElement=document.getElementById('qafautocomplete');
    if(autoElement){
        debugger
        let value=autoElement.state.selectedItem;
      
    }
}
init()