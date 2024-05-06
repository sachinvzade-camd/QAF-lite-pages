var menuList=[
    {
        Title:'Requisition',
        Icons:"fa-user-plus",
        URL:`recruitment/Candidate-Requisition`,
        Iframe:true,
        IsFirstComponent:true
    },
    {
        Title:'Candidate Search',
        Icons:"fa-search",
        URL:`recruitment/candidate-Search`,
        Iframe:true

    },
    {
        Title:'Job Posting',
        Icons:"fa-podcast",
        URL:`pages/jobposting`
    },
    {
        Title:'Setting',
        Icons:"fa-cog",
        URL:`recruitment/recruitment-setting`,
        Iframe:true

    },
    {
        Title:'Customer',
        Icons:"fa-users",
        URL:`crm/crm-customer-directory`,
        Iframe:true

    },
    {
        Title:'Contact',
        Icons:"fa-phone",
        URL:`crm/crm-contact-directory`,
        Iframe:true
    },
    {
        Title:'Vendor',
        Icons:"fa-id-card-o",
        URL:`pages/vendor`
    },
    {
        Title:'Manage Timesheet',
        Icons:"fa-calendar",
        URL:`pages/managetimesheet`
    },
    {
        Title:'Resources',
        Icons:"fa-crosshairs",
        URL:`pages/resources`,
        Html:""
    },
]

let qafServiceLoaded = setInterval(() => {
    if(window.QafService){
        document.getElementById('menu').data=menuList
        clearInterval(qafServiceLoaded);
    }
 }, 10);
