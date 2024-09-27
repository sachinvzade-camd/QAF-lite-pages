window.qafChatbot=function(){isDefined=!1;class t extends HTMLElement{conversationList=[];chatBotIconUrl="";isFirstMessage=!0;constructor(){super()}chatWindowOpen(){let t=document.getElementById("qaf-ai-chat-bot");t&&(t.title=""),this.shadowRoot.querySelector(".qaf-ai-widget--launcher").classList.add("chat-open"),this.shadowRoot.querySelector(".qaf-ai-widget-chat").classList.add("open")}chatWindowClose(){this.shadowRoot.querySelector(".qaf-ai-widget--launcher").classList.remove("chat-open"),this.shadowRoot.querySelector(".qaf-ai-widget-chat").classList.remove("open")}endConversion(){this.shadowRoot.querySelector(".qaf-ai-chat--overlay").classList.add("end-chat-overlay"),this.shadowRoot.querySelector(".qaf-ai-chat--prompt").classList.add("end-chat-overlay")}endChat(){this.cancelEndConversion(),this.chatWindowClose(),this.conversationList.splice(1);let t=this.shadowRoot.querySelector(".qaf-ai-chat-main");t.replaceChildren(t.firstElementChild),localStorage.removeItem("Sid")}cancelEndConversion(){this.shadowRoot.querySelector(".qaf-ai-chat--overlay").classList.remove("end-chat-overlay"),this.shadowRoot.querySelector(".qaf-ai-chat--prompt").classList.remove("end-chat-overlay")}async qafAIChatRequest(t){let e;try{let a={Mcp:t,Pid:this.pid,Txt:this.txt,Tdp:this.tdp};this.isFirstMessage&&(a={Mcp:t,tmf:1,Pid:this.pid,Txt:this.txt,Tdp:this.tdp});let i=localStorage.getItem("Sid");i&&(a.Sid=i);let o=await fetch("https://demtis.quickappflow.com/api/ptcssad",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json","Access-Control-Allow-Origin":"*"},body:JSON.stringify(a)});e=await o.json()}catch(s){s instanceof SyntaxError?console.log("There was a SyntaxError",s):console.log("There was an error",s)}return e}submitRequest(t){let e=t.target.value;var a=t.keyCode;if(e=e.trim().replace("\n","").replace("\r",""),13!==a||!e)return!0;t.preventDefault&&t.preventDefault(),this.conversationList.push({Type:"SYSTEM",Message:e});var i=`<div class="qaf-ai-chat-user-response">
                        <div class="qaf-ai-chat-user-message">${e}</div>
                    </div>`;this.shadowRoot.querySelector(".qaf-ai-chat-main").insertAdjacentHTML("beforeend",i);var o=`<div class="qaf-ai-chat-processing">
                                    <div class="qaf-ai-chat-icon">
                                        <img src="${this.chatBotIconUrl}"/>
                                    </div>
                                    <div class='loader'></div>
                                </div>`;return this.shadowRoot.querySelector(".qaf-ai-chat-main").insertAdjacentHTML("beforeend",o),this.shadowRoot.querySelector(".qaf-ai-chat-main").scrollTop=this.shadowRoot.querySelector(".qaf-ai-chat-main").scrollHeight+5,setTimeout(()=>{e&&2===this.conversationList.length?this.isFirstMessage=!0:this.isFirstMessage=!1,this.qafAIChatRequest(e).then(t=>{if(localStorage.setItem("Sid",t.Sid?t.Sid:""),this.shadowRoot.querySelector(".qaf-ai-chat-main").removeChild(this.shadowRoot.querySelector(".qaf-ai-chat-main .qaf-ai-chat-processing")),t&&t.Mcs){var e=`<div class="qaf-ai-chat-system-response">
                                                <div class="qaf-ai-chat-system-icon">
                                                    <img src="${this.chatBotIconUrl}"/>
                                                </div>
                                                <div class="qaf-ai-chat-system-msg">
                                                    ${t.Mcs}
                                                </div>
                                            </div>`;this.shadowRoot.querySelector(".qaf-ai-chat-main").insertAdjacentHTML("beforeend",e),this.shadowRoot.querySelector(".qaf-ai-chat-main").scrollTop=this.shadowRoot.querySelector(".qaf-ai-chat-main").scrollHeight+5}},t=>{this.shadowRoot.querySelector(".qaf-ai-chat-main").removeChild(this.shadowRoot.querySelector(".qaf-ai-chat-main .qaf-ai-chat-processing"))})},500),this.shadowRoot.querySelector("textarea#qaf-ai-chat-ctrl").value="",!1}buildConversions(){var t="";return this.conversationList.map(e=>{"SYSTEM"===e.Type?t+=`<div class="qaf-ai-chat-system-response">
                        <div class="qaf-ai-chat-system-icon">
                            <img src="${this.chatBotIconUrl}"/>
                        </div>
                        <div class="qaf-ai-chat-system-msg">
                            ${e.Message}
                        </div>
                    </div>`:t+=`<div class="qaf-ai-chat-user-response">
                        <div class="qaf-ai-chat-user-message">${e.Message}</div>
                    </div>`}),t}connectedCallback(){let t=this.getAttribute("preview")||this.preview;this.getAttribute("elementId")||this.elementId;let e=this.getAttribute("title")||this.title;this.getAttribute("pid")||this.pid,this.getAttribute("Txt")||this.txt,this.getAttribute("Tdp")||this.tdp,this.getAttribute("name")||this.name;let a=this.getAttribute("welcomeMessage")||this.welcomeMessage,i=this.getAttribute("spacing")||this.spacing,o=this.getAttribute("position")||this.position,s=this.getAttribute("HeaderBgColor")||this.headerBgColor,r=this.getAttribute("iconUrl")||this.iconUrl;this.chatBotIconUrl=r,this.conversationList.push({Type:"SYSTEM",Message:a});let $=`bottom: ${i}px; right: ${i}px;`,n=$="RIGHT"===o.toUpperCase()?`bottom: ${i}px; right: ${i}px;`:`bottom: ${i}px; left: ${i}px;`;window.matchMedia("screen and (max-width: 768px)").matches&&(n="width:100%;height:100%;");let c=this.attachShadow({mode:"open"});c.innerHTML=`<style>
            .qaf-chat-start{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 26px;
}
.qaf-ai-chat-image img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
}
.qaf-ai-chat-image{
    width: 60px;
    height: 60px;
}
           .loader {
    width: 30px;
    aspect-ratio: 2;
    --_g: no-repeat radial-gradient(circle closest-side,grey 90%,#0000);
    background: 
      var(--_g) 0%   50%,
      var(--_g) 50%  50%,
      var(--_g) 100% 50%;
    background-size: calc(100%/3) 50%;
    animation: shadowPulse 1s infinite linear;
  }
  @keyframes shadowPulse {
      20%{background-position:0%   0%, 50%  50%,100%  50%}
      40%{background-position:0% 100%, 50%   0%,100%  50%}
      60%{background-position:0%  50%, 50% 100%,100%   0%}
      80%{background-position:0%  50%, 50%  50%,100% 100%}
  }
            .qaf-ai-chat-widget {
             font-family: 'Open Sans',
            sans-serif;
                position: fixed;
                inset: 0px;
                -webkit-font-smoothing: antialiased;
                z-index: 10000;
                pointer-events: none;
                button {
                        &:hover {
                            cursor: pointer;
                            background-color: rgba(255, 255, 255, 0.16) !important;
                        } 
                    }
                
                &.chat-preview {
                    position: static;
                    height: 100%;

                    .qaf-ai-widget--launcher {
                        display: none;
                    }
                    
                    .qaf-ai-widget-chat {
                        position: static;
                        display: block;
                    }
                }

                .qaf-ai-widget--launcher {
                    position: absolute;
                    display: block;
                    pointer-events: auto;
                    img {
                        width: 42px;
                        height: 42px;
                    }

                    button {
                        &:hover {
                            cursor: pointer;
                        } 
                    }

                    &.chat-open {
                        display: none;
                    }

                    .qaf-ai-chat-launcher {
                        border-radius: 50%;
                        background-color: ${s} !important;
                        height: 60px;
                        width: 60px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border: 0;
                    }
                }

                .qaf-ai-widget-chat {
                    position: absolute;
                    display:none;
                    width: 380px;
                    overflow: hidden;
                    border-radius: 10px;
                    box-shadow: 0 2px 48px rgba(19, 33, 68, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.04);
                    height: 90%;
                    max-height: 800px;

                    &.open {
                        display:block;
                    }

                    .qaf-ai-chat--container {
                        height: 100%;
                        background: #fff;
                        pointer-events: auto;
                        font-family: inherit;
                        font-size: 14px;

                        article {
                            height: 100%;
                            position: relative;
                            display: flex;
                            overflow: hidden;
                            flex-direction: column;
                            background-color: #fff;
                        }
                        .qaf-ai-chat-header {
                            display: flex;
                            flex-shrink: 0;
                            align-items: center;
                            height: 56px;
                            padding: 0 16px 0 20px;
                            background-color: ${s};
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.16);
                            color: rgba(255, 255, 255, 0.95);

                            .qaf-ai-chat-header--title {
                                flex: 1 1 0%;
                                margin: 0px 0px 0px 14px;
                            }

                            .qaf-ai-chat-header-button {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 32px;
                                width: 32px;
                                margin-left: 8px;
                                border-radius: 6px;
                                background: none;
                                transition: background-color 150ms;
                                border: 0px;
                                padding: 0px;

                                ::hover {
                                    background-color: rgba(255, 255, 255, 0.16);
                                }
                            }

                            .qaf-ai-chat-icon {
                                flex-shrink: 0;
                                border-radius: 50%;
                                background-color: #f4f4f4;
                                background-position: center center;
                                background-repeat: no-repeat;
                                background-size: cover;
                                height: 32px;
                                width: 32px;

                                img {
                                    width: 100%;
                                    height: 100%;
                                    border-radius: 50%;
                                }
                            }

                            .qaf-ai-chat-icon-close {
                                height: 16px;
                                width: 16px;
                                color: rgba(255, 255, 255, 0.8);
                                transition: color 150ms;
                            }
                        }

                        .qaf-ai-chat-main {
                            display: flex;
                            flex-direction: column;
                            height: 100%;
                            overflow: hidden scroll;

                            .qaf-ai-chat-user-response {
                                margin-top: 20px;
                                padding: 0;
                                color: #fff;
                                display: flex;
                                width: 98%;
                                align-items: center;    

                                .qaf-ai-chat-user-message {
                                    padding: 10px 14px;
                                    background-color: ${s};
                                    margin-left: auto;
                                    border-radius: 8px;
                                        font-size: 15px;
    font-weight: 400;
    line-height: 20px;
    overflow-wrap: anywhere;
                            max-width: 70%;
                                }

                            }

                            .qaf-ai-chat-system-response {
                                margin-top: 20px;
                                padding: 0 10px;
                                display: flex;
                                align-items: end;
                                width:86%;

                                .qaf-ai-chat-system-icon {
                                    height: 26px;
                                    width: 26px;
                                    margin: 0px 8px 4px 0px;

                                    img {
                                        width: 26px;
                                        height: 26px;
                                        border-radius: 50%;
                                    }
                                }

                                .qaf-ai-chat-system-msg {
                                    background: #f4f4f4;
                                    padding: 10px 14px;
                                    border-radius: 8px;
                                    font-size: 15px;
                                    font-weight: 400;
                                    line-height: 20px;
                                     overflow-wrap: anywhere;
                                }
                            }
                            
                            .qaf-ai-chat-processing {
                                display: flex;
                                align-items: center;
                                padding: 0 10px;
                                margin-top: 15px;
                                &.show {
                                    visibility: visible;
                                }

                                .qaf-ai-chat-icon {
                                    flex-shrink: 0;
                                    border-radius: 50%;
                                    background-color: #f4f4f4;
                                    background-position: center center;
                                    background-repeat: no-repeat;
                                    background-size: cover;
                                    height: 26px;
                                    width: 26px;
                                    margin-right: 8px;

                                    img {
                                        width: 100%;
                                        height: 100%;
                                        border-radius: 50%;
                                    }
                                }
                            }
                           
                        }
                             
                        .qaf-ai-chat-footer {
                            padding: 12px 16px 16px 16px;
                            position: relative;
                            bottom: 0;
                            width: 92%;
                            background: #fff;

                            .qaf-ai-chat-input {
                                display: flex;
                                box-shadow: 0 1px 12px rgba(0, 0, 0, 0.02);
                                transition: border-color 150ms, box-shadow 150ms;  
                                
                                textarea {
                                height:41px;
                                    box-sizing: border-box;
                                    border-width: 1px 1px 1px 1px;
                                    border-style: solid;
                                    border-color: rgba(115, 115, 118, 0.3);
                                    border-image: initial;
                                    background-color: #fff;
                                    box-shadow: none;
                                    transition: border-color 150ms;
                                    resize: none;
                                    min-height: 42px;
                                    margin: 0px;
                                    border-top-right-radius: 0px;
                                    border-bottom-right-radius: 0px;
                                    padding: 12px 12px 10px;
                                    width: 100%;
                                    border-radius: 8px;
                                    font-family: inherit;
                                    font-size: 14px;
                                }
                            }
                        }

                        .qaf-ai-chat--overlay {
                            position: absolute;
                            background-color: rgba(0, 0, 0, 0.12);
                            opacity: 0;
                            
                            &.end-chat-overlay {
                                opacity: 1;
                                inset: 0px;
                                z-index: 2;
                                pointer-events: auto;
                            }
                        }
                        .qaf-ai-chat--prompt {
                            position: absolute;
                            bottom: 0px;
                            width: 100%;
                            box-sizing: border-box;
                            padding-bottom: calc(12px + 10px);
                            display: flex;
                            flex-direction: column;
                            padding: 16px 16px 12px 16px;
                            transition: transform 320ms cubic-bezier(0.45, 1.29, 0.64, 1), box-shadow 300ms;
                            transform: translateY(calc(100% + 10px));
                            border-radius: 8px;
                            background-color: #fff;
                            box-shadow: 0 12px 48px 4px rgba(0, 0, 0, 0.12);

                            &.end-chat-overlay {
                                z-index: 3;
                                transform: translateY(10px);
                            }

                            .qaf-ai-chat-btn-warn {
                                background-color: ${s};
                                min-height: 42px;
                                color: #fff;
                                transition: background-color 150ms;
                                padding: 10px 14px;
                                box-sizing: border-box;
                                white-space: break-spaces;
                                border-radius: 8px;
                                margin-bottom: 4px;
                                font-size: 15px;
                                font-weight: 600;
                                border: 0;

                                &:hover {
                                    background-color:${s} !important;
                                }
                            }

                            .qaf-ai-chat-btn-cancel {
                                min-height: 42px;
                                color: inherit;
                                transition: background-color 150ms;
                                padding: 10px 14px;
                                box-sizing: border-box;
                                white-space: break-spaces;
                                background-color: inherit;
                                border-radius: 8px;
                                font-size: 15px;
                                font-weight: 600;
                                border: 0;

                                &:hover {
                                    background-color: inherit !important;
                                }
                            }
                        }
                    }
                }
            }
          </style>`,c.innerHTML+=`<div class='qaf-ai-chat-widget ${t?"chat-preview":""}'>
                <div class="qaf-ai-widget--launcher" style="${$}"><button class="qaf-ai-chat-launcher"><img src="data:image/svg+xml,%3csvg%20viewBox='0%200%2036%2036'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%3e%3cpath%20d='M18.0000533,7%20C24.6266329,7%2030,11.4789312%2030,16.9976931%20C30,22.5163617%2024.6266329,26.9953062%2018.0000533,26.9953062%20C17.123351,26.9971724%2016.2483812,26.9169271%2015.386606,26.7553699%20C14.0404188,27.7431078%2012.5315125,28.4873102%2010.9284053,28.9541197%20C10.4583473,29.0903502%209.95341047,28.916663%209.66660965,28.5199682%20C9.37982216,28.1234068%209.37297168,27.5894152%209.64952342,27.1855224%20C10.1505552,26.5172998%2010.5515886,25.7796289%2010.840002,24.9957036%20C7.9365286,23.3624038%206.10015838,20.3278759%206,16.9976931%20C6,11.4789179%2011.3733271,7%2018.0000533,7%20Z%20M18.0000533,18.0020932%20L14.0000889,18.0020932%20L13.8644511,18.0112196%20C13.3765531,18.0774186%2013.0005042,18.4957012%2013.0005042,19.0018279%20C13.0005042,19.5539661%2013.4480335,20.0015625%2014.0000889,20.0015625%20L18.0000533,20.0015625%20L18.135691,19.9924361%20C18.623589,19.9262371%2018.9996379,19.5079545%2018.9996379,19.0018279%20C18.9996379,18.4496896%2018.5521087,18.0020932%2018.0000533,18.0020932%20Z%20M22.0001244,14.001515%20L14.0000889,14.001515%20L13.8644511,14.0106414%20C13.3765531,14.0768404%2013.0005042,14.495123%2013.0005042,15.0012497%20C13.0005042,15.5533879%2013.4480335,16.0009843%2014.0000889,16.0009843%20L22.0001244,16.0009843%20L22.1357621,15.9918579%20C22.6236601,15.9256589%2022.999709,15.5073764%2022.999709,15.0012497%20C22.999709,14.4491115%2022.5521797,14.001515%2022.0001244,14.001515%20Z'%20fill='%23ffffff'%3e%3c/path%3e%3c/g%3e%3c/svg%3e" alt="launch"></button></div>
                <div class="qaf-ai-widget-chat" style="${n}">
                    <div class="qaf-ai-chat--container">
                        <article>
                            <header class="qaf-ai-chat-header">
                                <div class="qaf-ai-chat-icon">
                                    <img src="${r}"/>
                                </div>
                                <h1 class="qaf-ai-chat-header--title">${e}</h1>
                                <button id="close-chat" title="Minimize" class="qaf-ai-chat-header-button">
                                    <div class="qaf-ai-chat-icon-close">
                                        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="qaf-ai-minus" fill="none" fill-rule="evenodd"><path d="M15 8a.84.84 0 0 1-.84.84H1.84a.84.84 0 0 1 0-1.68h12.32A.84.84 0 0 1 15 8z" fill="currentColor"></path></g></svg>
                                    </div>
                                </button>
                                <button id="end-chat" title="End Chat" class="qaf-ai-chat-header-button">
                                    <div class="qaf-ai-chat-icon-close">
                                        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="qaf-ai-close" d="M13.748 3.32a.773.773 0 0 0-1.093-1.094l-4.389 4.39a.363.363 0 0 1-.514 0L3.368 2.23a.779.779 0 0 0-1.101 0l-.039.038a.779.779 0 0 0 0 1.101l4.385 4.385a.363.363 0 0 1 0 .514l-4.37 4.37a.773.773 0 1 0 1.092 1.093l4.37-4.37a.363.363 0 0 1 .514 0l4.413 4.412a.779.779 0 0 0 1.101 0l.039-.038a.779.779 0 0 0 0-1.101L9.359 8.222a.363.363 0 0 1 0-.514l4.389-4.389z" fill="currentColor"></path></svg>
                                    </div>
                                </button>
                            </header>
                         
                            <main class="qaf-ai-chat-main" id='create'>
                               <div class='qaf-chat-start'> <div class="qaf-ai-chat-image">
                                    <img src="${r}"/>
                                </div>
                                <h1 class="qaf-ai-chat-title">${e}</h1></div>
                                ${this.buildConversions()}
                            </main>
                            <footer class="qaf-ai-chat-footer">
                                <div class="qaf-ai-chat-input">
                                    <textarea id="qaf-ai-chat-ctrl" placeholder="Message..." row='1'></textarea>
                                </div>
                            </footer>
                            <div class="qaf-ai-chat--overlay"></div>
                            <div class="qaf-ai-chat--prompt">
                                <button label="End Chat" title="End Chat" class="qaf-ai-chat-btn-warn">End Chat</button>
                                <button label="Cancel" title="Close" class="qaf-ai-chat-btn-cancel">Cancel</button>
                            </div>
                        </article>
                    </div>
                </div>
            </div>`,setTimeout(()=>{this.shadowRoot.querySelector("button.qaf-ai-chat-launcher").addEventListener("click",this.chatWindowOpen.bind(this)),this.shadowRoot.querySelector("button#close-chat").addEventListener("click",this.chatWindowClose.bind(this)),this.shadowRoot.querySelector("button#end-chat").addEventListener("click",this.endConversion.bind(this)),this.shadowRoot.querySelector("button.qaf-ai-chat-btn-cancel").addEventListener("click",this.cancelEndConversion.bind(this)),this.shadowRoot.querySelector("button.qaf-ai-chat-btn-warn").addEventListener("click",this.endChat.bind(this)),this.shadowRoot.querySelector("textarea#qaf-ai-chat-ctrl").addEventListener("keypress",this.submitRequest.bind(this))},100)}disconnectedCallback(){}static get observedAttributes(){return[]}attributeChangedCallback(t,e,a){}adoptedCallback(){}}return{initialize:function e(a){customElements.define("qaf-chat-bot",t);var i=Object.assign(document.createElement("qaf-chat-bot"),{id:"qaf-ai-chat-bot",title:a.Title,name:a.Name,iconUrl:a.IconUrl,headerBgColor:a.HeaderBgColor,welcomeMessage:a.WelcomeMessage,position:a.Position,spacing:a.Spacing,preview:!1,pid:a.Pid,txt:a.Txt,tdp:a.Tdp});document.body.append(i)},showChatPreview:function e(a){let i=document.querySelector("#qaf-ai-chat-bot");if(i&&i.length>0){var o=Object.assign(document.createElement("qaf-chat-bot"),{id:"qaf-ai-chat-bot",title:a.Title,name:a.Name,iconUrl:a.IconUrl,headerBgColor:a.HeaderBgColor,welcomeMessage:a.WelcomeMessage,position:a.Position,spacing:a.Spacing,preview:!0,elementId:a.PreviewElementId});a.PreviewElementId&&document.querySelector(`#${a.PreviewElementId}`).replaceChildren(o)}else{isDefined||(customElements.get("qaf-chat-bot")||customElements.define("qaf-chat-bot",t),isDefined=!0);var o=Object.assign(document.createElement("qaf-chat-bot"),{id:"qaf-ai-chat-bot",title:a.Title,name:a.Name,iconUrl:a.IconUrl,headerBgColor:a.HeaderBgColor,welcomeMessage:a.WelcomeMessage,position:a.Position,spacing:a.Spacing,preview:!0,elementId:a.PreviewElementId});a.PreviewElementId&&document.querySelector(`#${a.PreviewElementId}`).append(o)}}}}();