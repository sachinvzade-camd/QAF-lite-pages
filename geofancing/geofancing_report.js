var Employee;
var GeoFencePolicy;
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
        getGeoFencePolicy();
    });
}

function getGeoFencePolicy() {
    GeoFencePolicy = []
    let objectName = "Geofence_Allocation";
    let list = 'Employee,GeofencePolicy';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((policy) => {
        if (Array.isArray(policy) && policy.length > 0) {
            GeoFencePolicy = policy;

        }
        printData();
    });
}


// function compareEmployeeAndGfPolicy(Employee, gfPolicy) {
//     const result = [];
//     Employee.forEach(emp => {
//         const employeeRecordID = emp.RecordID;
//         const matchedPolicy = gfPolicy.find(policy => {
//             const employeeID = policy.Employee.split(';#')[0]; 
//             return employeeID === employeeRecordID;
//         });
//         if (matchedPolicy) {
//             const employeeName = `${emp.FirstName} ${emp.LastName}`;
//             const geofencePolicy = matchedPolicy.GeofencePolicy.split(';#')[1];
//             const employee = matchedPolicy.Employee.split(';#')[1]; 

//             result.push({
//                 FirstName: emp.FirstName,
//                 LastName: emp.LastName,
//                 GeofencePolicy: geofencePolicy,
//                 Employee: employee
//             });
//         }
//     });

//     return result;
// }

function getNewEmployee(Employee, gfPolicy){
    const result = [];
    Employee.forEach(emp => {
        const matchedPolicy = gfPolicy.find(policy => policy.Employee.split(';#')[0] === emp.RecordID);
        if (matchedPolicy) {
            emp.GeofencePolicy = matchedPolicy.GeofencePolicy.split(';#')[1]; // Extract GeofencePolicy name
        } else {
            emp.GeofencePolicy = '';
        }
    });

    return result;
}


function printData() {
    getNewEmployee(Employee, GeoFencePolicy);
    TableData=sortData(Employee);
    generateTable(TableData);
    console.log("EmployeeData", Employee);
    console.log("GeoFencePolicy", GeoFencePolicy);
    console.log("EmployeeData", TableData)
}


function generateTable(TableData) {
    console.log("Table Data", TableData);
    if (TableData && TableData.length > 0) {
        let tableHead = `
                        <th class="qaf-th">Employee Name</th>
                        <th class="qaf-th">Policy Name</th>
                         `;
        let tableRow = "";

        TableData.forEach(entry => {
            const employeeName = (entry.FirstName ? entry.FirstName : "") + (entry.LastName ? " " + entry.LastName : "");
            const location = entry.GeofencePolicy ? entry.GeofencePolicy : "";

           
            if (employeeName.trim() !== "" || location.trim() !== "") {
                tableRow += `
                    <tr class="qaf-tr">
                        <td class="qaf-td">${employeeName}</td>
                        <td class="qaf-td">${location}</td>
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
                        <th class="qaf-th">Policy Name</th>    `;
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
        // Check if both objects have non-null FirstName properties
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
            // If only the first object has null FirstName, place it after
            return 1;
        } else if (a.FirstName && !b.FirstName) {
            // If only the second object has null FirstName, place it after
            return -1;
        } else {
            // If both objects have null FirstName, maintain their order
            return 0;
        }
    });
}
function download_csv() {
    let data = TableData;
    let csvData = [];
    data.forEach(val => {
        let employeeName = (val["FirstName"] ? val["FirstName"] : "") + " " + (val["LastName"] ? val["LastName"] : "");
        let location = val["GeofencePolicy"] ? val["GeofencePolicy"] : ""; 
        csvData.push([employeeName, location].join(","));
    });

    let csvBody = csvData.join('\n');

    let csvHeader = ["Employee Name", "Policy Name"].join(',') + '\n';

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvHeader + csvBody);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Geofence And  Policy Report' + '.csv';
    hiddenElement.click();
}