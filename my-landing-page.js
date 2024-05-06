let gridMyTeamsColumns = [
    {field:'RecordID', displayName:'ID', sorting: true},
    {field:'TeamName', displayName:'Team Name', sorting: true},
    {field:'TeamMembers', displayName:'Team Members', sorting: false}
];

let teamsGridColumns = [
    {field:'TeamName', displayName:'Team Name', sorting: true},
    {field:'TeamMembers', displayName:'Team Members', sorting: false}
  ];

  let myapps = [
    {name: 'My Dashboard',link:'https://google.com', icon:'fa fa-user-plus'},
    {name: 'Service Action',link:'https://google.com', icon:'fa fa-tachometer'},
    {name: 'Planner',link:'https://google.com', icon:'fa fa-tasks'},
    {name: 'Timesheet',link:'https://google.com', icon:'fa fa-clock-o'},
    {name: 'Attendance',link:'https://google.com', icon:'fa fa-calendar-check-o'},
    {name: 'Leaves',link:'https://google.com', icon:'fa fa-sign-out'}
  ]



function sayHello(name){
    alert(`Hello ${name}`)
  }

  function getInitials(fullName){
    let name = fullName;
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

    let initials = [...name.matchAll(rgx)] || [];

    initials = (
      (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
    ).toUpperCase();

    return initials;
  }
  
  function qfgrdTeams_onItemRender(cname, cvalue, row){
    if(cname === 'TeamMembers'){
      if(cvalue && cvalue.indexOf(';#') !== -1){
        let values = cvalue.split(';#');
        let oddArray = [];
        values.forEach((v, idx)=>{
          oddArray.push(idx);
        })
        let odds = oddArray.filter(n => n%2);
        let returnItems = [];
        odds.forEach((d)=>{
          //returnItems.push(values[d]);
          let id = values[d - 1];
          let name = values[d];
          let init = getInitials(name);
          returnItems.push(`<div style="margin-bottom:5px;"><qaf-avatar data-bind-employeeId="${id}" initials='${init}' primary="${name}"></qaf-avatar></div>`);
        })

        //return returnItems.join(';');
        return returnItems.join('');
      }
    }else if(cname === 'TeamName'){
      //return `<a href='https://google.com' target="_blank">${cvalue}</a>`
      return `<button class="qaf-btn-primary" type="button" onClick="sayHello(\`${cvalue}\`)">${cvalue}</button>`;
      //return `<qaf-avatar data-bind-employeeId="c364309e-7c50-48d5-912f-36d51c579d57" initials='AL' primary="Anil Lakhagoudar" secondary="Web Dev"></qaf-avatar>`;
      //return `<qaf-avatar data-bind-employeeId="c364309e-7c50-48d5-912f-36d51c579d57"></qaf-avatar>`;
    }
    return cvalue;
  }

  function qfgrdTeamsCard_onItemRender(cname, cvalue, row){

    if(cname === 'TeamName'){
      let members = row['TeamMembers'];
      let membersHtml = '';
      if(members && members.indexOf(';#') !== -1){
          
          let values = members.split(';#');
          let oddArray = [];
          values.forEach((v, idx)=>{
            oddArray.push(idx);
          })
          let odds = oddArray.filter(n => n%2);
          let returnItems = [];
          odds.forEach((d)=>{
            returnItems.push(`<li>${values[d]}</li>`);
          });
          membersHtml += `<ul>${returnItems.join('')}</ul>`;
        }

      return `<qaf-card title="${cvalue}" content="${membersHtml}"></qaf-card>`;
    }else {
      return '';
    }
    
  }
