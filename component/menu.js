class Menu extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
        <style>
        #breadcrum{
            display:none!important;
        }
        .qaf-lite-menu-main {
            z-index: 1;
            width: 102px;
              position: fixed;
              height: 100vh;
              inline-size: max-content;
              padding-bottom: 50px;
              overflow: auto;
              background: black;
            }
            .menu-list:nth-child(1) {
              margin-top: 44px;
            }
            .qaf-lite-menu-icon .menu-text {
              font-size: 12px;
              margin-bottom: 30px;
              margin-right: 3px;
              width: 86%;
              margin-left: 4px;
            }
            .qaf-lite-menu-icon{
              cursor: pointer;
            }
            .text-center{
              text-align: center;
            }
            .qaf-lite-menu-icon .menu-icon {
                color: white;
                padding-bottom: 5px;
              }
          
              .qaf-lite-menu-icon  .fa {
                font-size: 18px;
              }
              .qaf-menu-text {
                  font-size: 12px;
                  margin-bottom: 24px;
                  margin-right: -18px;
                  width: 86%;
                  margin-left: 4px;
                  color: white;
                }
          
      .qaf-lite-menu-display {
          position: relative;
          width: 91%;
          left: 125px;
          padding: 10px 10px 0 0px;
          height: calc(100vh - 77px);
        }
        #menu-details{
          height: 100%;
          margin-top: 20px; 
        }
        </style>
        <div class="qaf-lite-menu sidebar-sub-menu">
        <div class="qaf-lite-menu-main" id="menuid">
        </div>
        <div class="qaf-lite-menu-display">
            <div id="menu-details"> </div>
        </div>
    </div>
        `
    }
    set data(data) {
        let menuID = document.getElementById('menuid');
        let menus = ""
        if (menuID) {
            data.forEach(menu => {
                if(menu.Display!=false){
                menus += `<div class="menu-list" onclick="openTab('${menu.URL}','${menu.Iframe ? true : false}')">
                <a class="qaf-lite-menu-icon text-center">
                    <div class="menu-icon">
                        <i class="fa ${menu.Icons}" aria-hidden="true"></i>
                    </div>
                    <h4 class="qaf-menu-text ">${menu.Title}</h4>
                </a>
            </div>`}
            })
            menuID.innerHTML = menus;
            let firstComponent = data.find(dt => dt.IsFirstComponent)
            openFirstComponent(firstComponent.URL, firstComponent)
        }
    }
};
function openTab(url, iframe) {
    let menudetails = document.getElementById('menu-details');
    let locationOrigin = window.location.origin
    if (menudetails) {
        if (iframe.toLowerCase() === 'true') {
            menudetails.innerHTML = `<iframe
        src="${locationOrigin}/${url}?ln=false&header=false&breadcum=false" frameborder="0" width="100%"
        height="100%"></iframe>`
        } else {
            if(isMobileDevice()){
window.location.href=url
            }else{
                window.open(`${locationOrigin}/${url}`, "_self")
            }
        }
    }
}
function isMobileDevice() {
    var screenWidth = window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    return screenWidth < 768 ? true : false;
   
}
function openFirstComponent(url, firstComponent) {
    let menudetails = document.getElementById('menu-details');
    let locationOrigin = window.location.origin
    if (menudetails) {
        if (firstComponent.Iframe) {
            menudetails.innerHTML = `<iframe
        src="${locationOrigin}/${url}?ln=false&header=false&breadcum=false" frameborder="0" width="100%"
        height="100%"></iframe>`
        } else if(firstComponent.Html){
            menudetails.innerHTML = firstComponent.Html
        }else{
            window.open(`${locationOrigin}/${url}`, "_self")
        }
    }
}
customElements.define('menu-component', Menu);