var Employee;
var ShiftName;
var TableData;
let qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        getEmployee();
        clearInterval(qafServiceLoaded);
    }
}, 10);

function getEmployee() {
    Employee = []
    let objectName = "Employees";
    let list = 'RecordID,FirstName,LastName,IsOffboarded';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `IsOffboarded!='True'<OR>IsOffboarded=''`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
        if (Array.isArray(employees) && employees.length > 0) {
            Employee = employees;

        }
        getshiftAllocation();
    });
}

function getshiftAllocation() {
    ShiftName = []
    let objectName = "Shift_Allocation";
    let list = 'Employee,ShiftName';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((policy) => {
        if (Array.isArray(policy) && policy.length > 0) {
            ShiftName = policy;

        }
        printData();
    });
}


function getNewEmployee(Employee, saPolicy) {
    
    const result = [];
    Employee.forEach(emp => {
        const matchedShift = saPolicy.find(policy => policy.Employee.split(';#')[0] === emp.RecordID);
        if (matchedShift) {
            const shiftName = matchedShift.ShiftName;
            if (shiftName) {
                emp.ShiftName = shiftName.split(';#')[1];
            } else {
                emp.ShiftName = ''; 
            }
        } else {
            emp.ShiftName = '';
        }
        result.push(emp); 
    });

    return result;
}





function printData() {
    getNewEmployee(Employee, ShiftName);
    TableData=sortData(Employee);
    generateTable(TableData);
}


function generateTable(TableData) {
    if (TableData && TableData.length > 0) {
        let tableHead = `
                        <th class="qaf-th">Employee Name</th>
                        <th class="qaf-th">Shift Name</th>
                         `;
        let tableRow = "";

        TableData.forEach(entry => {
            const employeeName = (entry.FirstName ? entry.FirstName : "") + (entry.LastName ? " " + entry.LastName : "");
            const ShiftName = entry.ShiftName ? entry.ShiftName : "";

           
            if (employeeName.trim() !== "" || ShiftName.trim() !== "") {
                tableRow += `
                    <tr class="qaf-tr">
                        <td class="qaf-td">${employeeName}</td>
                        <td class="qaf-td">${ShiftName}</td>
                    </tr>
                `;
            }
        });

        let tableValue = `
            <table class="qaf-table" id="table">
                <thead class="qaf-thead">
                    <tr class="qaf-tr">
                        ${tableHead}
                    </tr>
                </thead>
                <tbody class="qaf-tbody">
                    ${tableRow}
                </tbody>
            </table>
        `;
        document.getElementById('tablecontainer').innerHTML = tableValue;
    } else {
        filterData(filterData);
    }
}


// Event listener for the keyup event on the search input

document.getElementById('search').addEventListener('keyup', function (event) {
    let searchCancle = document.getElementById('cancelSearch')
    if (searchCancle) {
        searchCancle.style.display = 'block'
    }
    if (event.key === "Enter") {
        let searchCancle = document.getElementById('cancelSearch')
        if (searchCancle) {
            searchCancle.style.display = 'block'
        }
        const searchTerm = event.target.value.trim();
        filterData(searchTerm);
    }
});


function cancelSearch() {
    let searchCancle = document.getElementById('cancelSearch')
    if (searchCancle) {
        searchCancle.style.display = 'none'
    }
    var searchInput = document.getElementById("search");
    searchInput.value = '';
    generateTable(TableData);

}


function filterData(searchTerm) {

    const filteredData = TableData.filter(item => {
        const firstName = item["FirstName"];
        const lastName = item["LastName"];
        
        // Check if firstName and lastName are not null before calling toLowerCase()
        if (firstName !== null && lastName !== null) {
            return (
                firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lastName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return ''; // Return false if either firstName or lastName is null
    });
    
    

    if (filteredData.length === 0) {
        const tableElement = document.getElementById('table');
        tableElement.innerHTML = '';
        let tableHead = `
                        <th class="qaf-th">Employee Name</th>
                        <th class="qaf-th">Shift Name</th>    `;
        let tableBody = '';
        let startRow = '<tr class="qaf-tr">';
        let endRow = '</tr>';
        let tableRow = `<td colspan="2" class="qaf-td" ><div class='no-record'>No Record Found</div></td>`;
        let tableHTML = `
                    <thead class="qaf-thead">
                        <tr class="qaf-tr">
                            ${tableHead}
                        </tr>
                     </thead>
                     <tbody class="qaf-tbody">
                        ${startRow}
                            ${tableRow}
                         ${endRow}
                    </tbody>
        `;
        tableElement.innerHTML = tableHTML;
    }
    else {
        generateTable(filteredData);

    }

}

function sortData(data) {
    return data.slice().sort((a, b) => {
        if (a.FirstName && b.FirstName) {
            const firstNameA = a.FirstName.toLowerCase();
            const firstNameB = b.FirstName.toLowerCase();

            if (firstNameA < firstNameB) {
                return -1;
            }
            if (firstNameA > firstNameB) {
                return 1;
            }
            return 0;
        } else if (!a.FirstName && b.FirstName) {
          
            return 1;
        } else if (a.FirstName && !b.FirstName) {
           
            return -1;
        } else {
           
            return 0;
        }
    });
}
function download_csv() {
    let data = TableData;

    let csvData = [];
    data.forEach(val => {
        let employeeName = (val["FirstName"] ? val["FirstName"] : "") + " " + (val["LastName"] ? val["LastName"] : "");
        let shiftName = val["ShiftName"] ? val["ShiftName"] : ""; 
        csvData.push([employeeName, shiftName].join(","));
    });

    let csvBody = csvData.join('\n');

    
    let csvHeader = ["Employee Name", "Shift Name"].join(',') + '\n';

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvHeader + csvBody);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Shift Allocation Report' + '.csv';
    hiddenElement.click();
}