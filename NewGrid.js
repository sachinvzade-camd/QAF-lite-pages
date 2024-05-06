const date = new Date();

var day = date.getDate();
var month = date.getMonth() + 1;
var year = date.getFullYear();
var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
// 'YYYY/MM/DD'

 let whereClause = `CreatedDate>='${year+'/'+month+'/'+firstDay}'<AND>CreatedDate<='${year+'/'+month+'/'+lastDay}'`;
document.getElementById('Expense_claims').setAttribute('data-bind-filter',whereClause);

var currentDate = `${date.toLocaleString([], { month: 'short' })}-${year}`;

let grid = `<div class="navigator"><div class="navigator-symbol" onclick="leftNavigator()">&lt;</div>
        <div class='today-date'>&nbsp;&nbsp;<span id='date'>${currentDate}</span>&nbsp;&nbsp;</div>
        <div class="navigator-symbol"onclick="rightNavigator()">&gt;</div>
    </div>`
    document.getElementById('navigator').innerHTML = grid;
function gridLoad(){
    if(window.QafService){
        // QAF service is defined
        let service = window.QafService;
        let objectName = 'Expense_claims';
        let fieldList = ['Requesttitle', 'RecordID','Project','TotalAmount','Description','Approvedamount'];
        let page = 1;
        let pageSize = 5;
        service.GetItems(objectName,fieldList, pageSize, page).then((data)=>{
            const elementGrid = document.querySelector('qaf-grid');
            elementGrid.columns = [
                {field:'Requesttitle', displayName:'Request Title', sorting: true},
                {field:'Project', displayName:'Project', sorting: true},
                {field:'TotalAmount', displayName:'Total Amount', sorting: true},
                {field:'Description', displayName:'Description', sorting: true},
                {field:'Approvedamount', displayName:'Approved Amount', sorting: true},
            ];
            elementGrid.Data = data;
            elementGrid.show = false;

            elementGrid.addEventListener('onNextPageEvent', (page)=>{
                  console.log(page)
                  elementGrid.show = true;
                  service.GetItems(objectName,fieldList, pageSize, page.detail.currentPage).then((data)=>{
                    elementGrid.Data = data;
                    elementGrid.show = false;
                  })
            })

            elementGrid.addEventListener('onPrevPageEvent', (page)=>{
                console.log(page)
                elementGrid.show = true;
                service.GetItems(objectName,fieldList, pageSize, page.detail.currentPage).then((data)=>{
                    elementGrid.Data = data;
                    elementGrid.show = false;
                })
            })

            elementGrid.addEventListener('onGridSortEvent', (page)=>{
                console.log(page)

                elementGrid.show = true;
                service.GetItems(objectName,fieldList, pageSize, 1, page.detail.field, page.detail.order).then((data)=>{
                    elementGrid.Data = data;
                    elementGrid.show = false;
                })
            })

        }, (error)=>{
    
        });
    }
}

setTimeout(() => {
    gridLoad();
}, 800);

function leftNavigator(){
    monthNavigator('subtract')
  }
  function rightNavigator(){
    monthNavigator('plus')
  }

  function monthNavigator(month){
    if(month==='subtract'){
      date.setMonth(date.getMonth() -1);
    }else{
      date.setMonth(date.getMonth() +1);
    }
    day = date.getDate();
    month =( date.getMonth() + 1);
    year = date.getFullYear();
    currentDate =  `${date.toLocaleString([], { month: 'short' })}-${year}`;
    document.getElementById('date').innerHTML=currentDate;
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    // 'YYYY/MM/DD'
    
     let whereClause = `CreatedDate>='${year+'/'+month+'/'+firstDay}'<AND>CreatedDate<='${year+'/'+month+'/'+lastDay}'`;
    document.getElementById('Expense_claims').setAttribute('data-bind-filter',whereClause);
    gridLoad();
  }
