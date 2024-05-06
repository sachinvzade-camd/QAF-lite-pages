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
    window.onload = function(){
      gridDisplay();
    };
      function gridDisplay(){
        const grids = document.querySelectorAll('qaf-grid');
          grids.forEach((gridElement)=>{
            customElements.whenDefined(gridElement.localName).then((done)=>{
              const element = gridElement;
              const attr = element.getAttribute('data-bind-reposiory');
              if(attr === 'Expense_claims'){
                          element.columns = [
                              {field:'Requesttitle', displayName:'Request Title', sorting: true},
                              {field:'Project', displayName:'Project', sorting: true},
                              {field:'TotalAmount', displayName:'Total Amount', sorting: true},
                              {field:'Description', displayName:'Description', sorting: true},
                              {field:'Approvedamount', displayName:'Approved Amount', sorting: true},
                          ];
              }
            });
          });
      }

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
      gridDisplay();
      }