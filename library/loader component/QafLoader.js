try {
  class QafLoader extends HTMLElement {
    static observedAttributes = ["qaf-loader-show"];
    constructor() {
      super();
    }
    connectedCallback() {
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
              `;
    }
    disconnectedCallback() {
    }
    adoptedCallback() {
    }
    attributeChangedCallback(name, oldValue, newValue) {
    }
  }
  
var qafLoaderelementExists = document.querySelector("qaf-loader");
if (typeof (qafLoaderelementExists) === 'undefined' || qafLoaderelementExists === null) {
  customElements.define("qaf-loader", QafLoader);
}
} catch (error) {
 
}

