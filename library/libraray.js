var eventNameqaf,qafAlertObject;if(!customElements.get("qaf-alert")){class t extends HTMLElement{static observedAttributes=["qaf-alert-show","qaf-event","qaf-message"];constructor(){super()}connectedCallback(){}disconnectedCallback(){}adoptedCallback(){}attributeChangedCallback(t,a,e){"qaf-alert-show"===t?"object"==typeof(qafAlertObject=JSON.parse(e))&&(qafAlertObject.IsShow?this.innerHTML=`
              <style>
              .trigger{
                text-align: center;
              padding: 7px 13px;
              background: #3e3e3e;
              color: #fff;
              font-size: 15px;
              outline: none;
              border: none;
              border-radius: 5px;
              font-family: poppins;
          }
          
          .qaf-modal {
            font-family: poppins;
              position: fixed;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              opacity: 0;
              visibility: hidden;
              transform: scale(1.1);
              transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
          }
          .qaf-modal-content {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background-color: white;
              padding:26px 20px 14px 20px;
              border-radius: 0.5rem;
              min-width: 340px;
          }
        
          .qaf-show-modal {
              opacity: 1;
              visibility: visible;
              transform: scale(1.0);
              transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
              z-index:9999
          }
          
  .qaf-alert-button-container {
    display: flex;
    justify-content: center;
  }
  
  .qaf-alert-btn{
      margin: 5px;
      padding: 6px 12px;
  }
  .qaf-alert-button-cancel {
    background-color: #f6f4f4;
    color: #333;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  
  }
  .qaf-alert-button-submit{
    background-color:  #ff7a59;
    color:#fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  
  }
  .qaf-alert-qaf-alert-heading{
      font-size: 16px;
      color: #333;
      text-align: center;
      font-weight: 500;
  }
              </style>
              <div class="qaf-modal qaf-show-modal">
              <div class="qaf-modal-content">
                  <h1 class="qaf-alert-qaf-alert-heading">${qafAlertObject.Message}</h1>
                  ${qafAlertObject.Type&&"ok"===qafAlertObject.Type.toLowerCase()?`  <div class="qaf-alert-button-container">
                    <button class="qaf-alert-button-submit btn btn-primary qaf-alert-btn" onclick="oncloseModal('yes')">OK</button>
                </div>`:`  <div class="qaf-alert-button-container">
                    <button class="qaf-alert-button-submit btn btn-primary qaf-alert-btn" onclick="oncloseModal('yes')">Yes</button>
                    <button class="qaf-alert-button-cancel btn  qaf-alert-btn" onclick="oncloseModal('no')">No</button>
                </div>`}
              </div>
          </div>
              `:this.innerHTML=""):"qaf-event"===t&&(eventNameqaf=e)}}customElements.define("qaf-alert",t)}function oncloseModal(t){let a=document.querySelector("qaf-alert");qafAlertObject.IsShow&&(qafAlertObject.IsShow=!1),a.setAttribute("qaf-alert-show",JSON.stringify(qafAlertObject));var e=new CustomEvent(eventNameqaf,{detail:t});window.parent.document.dispatchEvent(e)}

if (!customElements.get("qaf-loader")) {
    class a extends HTMLElement {
        static observedAttributes = ["qaf-loader-show"]; constructor() { super() } connectedCallback() {
            this.innerHTML = `
              <style>
              .qaf-loader {
                  width: 48px;
                  height: 48px;
                  border: 5px solid #FFF;
                  border-bottom-color: #FF3D00;
                  border-radius: 50%;
                  display: inline-block;
                  box-sizing: border-box;
                  animation: rotation 1s linear infinite;
                  }
                
                  @keyframes rotation {
                  0% {
                      transform: rotate(0deg);
                  }
                  100% {
                      transform: rotate(360deg);
                  }
                  } 
                  .qaf-loader-container{
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    position: absolute;
                    left: 0;
                    width: 100%;
                    top: 0;
                  }
                  .qaf-loader-main{
                    position: relative;
                  }
              </style>
              <div class='qaf-loader-main'>
              <div class="qaf-loader-container">
              <span class="qaf-loader"></span>
          </div>
          </div>
              `} disconnectedCallback() { } adoptedCallback() { } attributeChangedCallback(a, e, t) { }
    } customElements.define("qaf-loader", a)
}

if (!customElements.get("qaf-single-line-text")) {
    class e extends HTMLElement {
        constructor() { super() } static get observedAttributes() { return ["element-id"] } connectedCallback() { this.render() } attributeChangedCallback(e, t, i) { "element-id" === e && this.render() } render() {
            let e = this.getAttribute("element-id"), t = this.getAttribute("element-label"); this.innerHTML = `
    <style>
    .qaf-label {
        display: inline-block;
        font-size: 15px;
        color: #333;
        font-weight: 400;
        font-family: "Poppins";
    }

    .qaf-input {
        width: 100%;
        padding: 6px 12px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
        font-size: 13px;
        outline: none;
        color: #333;
    }
    .qaf-control{
      margin-top: 10px;
      }
</style>
<div class='qaf-control'>
    <label for="${e}" class="qaf-label">${t}</label>
    <input type="text" id="${e}"class="qaf-input">
</div>
    `}
    } customElements.define("qaf-single-line-text", e)
}

if (!customElements.get("qaf-multi-line-text")) {
    class e extends HTMLElement {
        constructor() { super() } static get observedAttributes() { return ["element-id"] } connectedCallback() { this.render() } attributeChangedCallback(e, t, i) { "element-id" === e && this.render() } render() {
            let e = this.getAttribute("element-id"), t = this.getAttribute("element-label"); this.innerHTML = `
    <style>
    .qaf-label {
        display: inline-block;
      
        font-size: 15px;
        color: #333;
        font-weight: 400;
        font-family: "Poppins";
    }

    .qaf-input {
        width: 100%;
        padding: 6px 12px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
        font-size: 13px;
        outline: none;
        color: #333;
    }
    .qaf-control{
    margin-top: 10px;
    }
</style>
    <div class='qaf-control'>
    <label for="${e}" class="qaf-label">${t}</label>
    <textarea  id="${e}" class="qaf-input" cols="40" rows="3"></textarea>
</div>

    `}
    } customElements.define("qaf-multi-line-text", e)
}

if (!customElements.get("qaf-email-compoonent")) {
    class e extends HTMLElement {
        constructor() { super() } static get observedAttributes() { return ["element-id"] } connectedCallback() { this.render() } attributeChangedCallback(e, t, i) { "element-id" === e && this.render() } render() {
            let e = this.getAttribute("element-id"), t = this.getAttribute("element-label"); this.innerHTML = `
    <style>
    .qaf-label {
        display: inline-block;
        font-size: 15px;
        color: #333;
        font-weight: 400;
        font-family: "Poppins";
    }

    .qaf-input {
        width: 100%;
        padding: 6px 12px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
        font-size: 13px;
        outline: none;
        color: #333;
    }
    .qaf-control{
      margin-top: 10px;
      }
</style>
<div class='qaf-control'>
    <label for="${e}" class="qaf-label">${t}</label>
    <input type="text" id="${e}"class="qaf-input">
</div>
    `}
    } customElements.define("qaf-email-compoonent", e)
}