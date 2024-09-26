window.qafChatbot = (function () {
    isDefined = false;

    class QAFChatBot extends HTMLElement {
        conversationList = [];
        chatBotIconUrl = '';
        isFirstMessage = true;

        constructor() {
            super();
            // element created
        }

        chatWindowOpen() {
            this.shadowRoot.querySelector(".qaf-ai-widget--launcher").classList.add('chat-open');
            this.shadowRoot.querySelector(".qaf-ai-widget-chat").classList.add('open');
        }

        chatWindowClose() {
            this.shadowRoot.querySelector(".qaf-ai-widget--launcher").classList.remove('chat-open');
            this.shadowRoot.querySelector(".qaf-ai-widget-chat").classList.remove('open');
        }

        endConversion() {
            this.shadowRoot.querySelector(".qaf-ai-chat--overlay").classList.add('end-chat-overlay');
            this.shadowRoot.querySelector(".qaf-ai-chat--prompt").classList.add('end-chat-overlay');
        }

        endChat() {
            this.cancelEndConversion();
            this.chatWindowClose();

            // Clear everything except first message
            this.conversationList.splice(1);

            let mainElement = this.shadowRoot.querySelector(".qaf-ai-chat-main");
            mainElement.replaceChildren(mainElement.firstElementChild);
            localStorage.removeItem('Sid')
        }

        cancelEndConversion() {
            this.shadowRoot.querySelector(".qaf-ai-chat--overlay").classList.remove('end-chat-overlay');
            this.shadowRoot.querySelector(".qaf-ai-chat--prompt").classList.remove('end-chat-overlay');
        }

        async qafAIChatRequest(input) {
            let chatAPIUrl = `https://demtis.quickappflow.com/api/ptcssad`;
            let json;
            try {
                let payLoad = { Mcp: input, Pid: this.pid, Txt: this.txt, Tdp: this.tdp };
                if (this.isFirstMessage) {
                    payLoad = { Mcp: input, tmf: 1, Pid: this.pid, Txt: this.txt, Tdp: this.tdp };
                }
                let sid = localStorage.getItem('Sid')
                if (sid) {
                    payLoad['Sid'] = sid
                }
                const response = await fetch(chatAPIUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify(payLoad)
                })
                json = await response.json();
            } catch (error) {
                if (error instanceof SyntaxError) {
                    // Unexpected token < in JSON
                    console.log('There was a SyntaxError', error);
                } else {
                    console.log('There was an error', error);
                }
            }

            return json;
        }

        submitRequest($event) {
            let text = $event.target.value;
            var key = $event.keyCode;

            text = text.trim().replace('\n', '').replace('\r', '');

            // if(!text){
            //     if($event.preventDefault) $event.preventDefault();
            //     return false;
            // }

            if (key === 13 && text) {
                if ($event.preventDefault) $event.preventDefault();
                this.conversationList.push({ Type: 'SYSTEM', Message: text })

              

                // user entry
                var userRequest = `<div class="qaf-ai-chat-user-response">
                        <div class="qaf-ai-chat-user-message">${text}</div>
                    </div>`
                this.shadowRoot.querySelector(".qaf-ai-chat-main").insertAdjacentHTML('beforeend', userRequest);
           

                // Wait for chat response
                var processingMessage = `<div class="qaf-ai-chat-processing">
                                    <div class="qaf-ai-chat-icon">
                                        <img src="${this.chatBotIconUrl}"/>
                                    </div>
                                    <div class='loader'></div>
                                </div>`
                               
                //this.shadowRoot.querySelector(".qaf-ai-chat-processing").classList.add('show');
                this.shadowRoot.querySelector(".qaf-ai-chat-main").insertAdjacentHTML('beforeend', processingMessage);
                this.shadowRoot.querySelector(".qaf-ai-chat-main").scrollTop = this.shadowRoot.querySelector(".qaf-ai-chat-main").scrollHeight + 5;
                setTimeout(() => {
               

                    if (text && this.conversationList.length === 2) {
                        this.isFirstMessage = true;
                    } else {
                        this.isFirstMessage = false;
                    }

                    this.qafAIChatRequest(text).then((d) => {

                        localStorage.setItem('Sid', d.Sid ? d.Sid : '')
                        //this.shadowRoot.querySelector(".qaf-ai-chat-processing").classList.remove('show');
                        this.shadowRoot.querySelector(".qaf-ai-chat-main").removeChild(this.shadowRoot.querySelector(".qaf-ai-chat-main .qaf-ai-chat-processing"))
                        if (d && d.Mcs) {
                            // system entry
                            var systemRequest = `<div class="qaf-ai-chat-system-response">
                                                <div class="qaf-ai-chat-system-icon">
                                                    <img src="${this.chatBotIconUrl}"/>
                                                </div>
                                                <div class="qaf-ai-chat-system-msg">
                                                    ${d.Mcs}
                                                </div>
                                            </div>`
                            this.shadowRoot.querySelector(".qaf-ai-chat-main").insertAdjacentHTML('beforeend', systemRequest);
                            this.shadowRoot.querySelector(".qaf-ai-chat-main").scrollTop = this.shadowRoot.querySelector(".qaf-ai-chat-main").scrollHeight + 5;
                        }
                    }, (error) => {
                        //this.shadowRoot.querySelector(".qaf-ai-chat-processing").classList.remove('show');
                        this.shadowRoot.querySelector(".qaf-ai-chat-main").removeChild(this.shadowRoot.querySelector(".qaf-ai-chat-main .qaf-ai-chat-processing"))
                    })
                }, 500);
                this.shadowRoot.querySelector("textarea#qaf-ai-chat-ctrl").value = "";
                return false;
            } else {
                return true;
            }
        }

        buildConversions() {
            var conversionHtml = "";
            this.conversationList.map((conversion) => {
                if (conversion.Type === 'SYSTEM') {
                    conversionHtml += `<div class="qaf-ai-chat-system-response">
                        <div class="qaf-ai-chat-system-icon">
                            <img src="${this.chatBotIconUrl}"/>
                        </div>
                        <div class="qaf-ai-chat-system-msg">
                            ${conversion.Message}
                        </div>
                    </div>`
                } else {
                    conversionHtml += `<div class="qaf-ai-chat-user-response">
                        <div class="qaf-ai-chat-user-message">${conversion.Message}</div>
                    </div>`
                }
            })

            return conversionHtml;
        }
        connectedCallback() {
            // browser calls this method when the element is added to the document
            // (can be called many times if an element is repeatedly added/removed)
            let isPreview = this.getAttribute('preview') || this.preview;
            let elementID = this.getAttribute('elementId') || this.elementId;
            let title = this.getAttribute('title') || this.title;
            let projectID = this.getAttribute('pid') || this.pid;
            let Txt = this.getAttribute('Txt') || this.txt;
            let Tdp = this.getAttribute('Tdp') || this.tdp;
            let name = this.getAttribute('name') || this.name;
            let welcomeMessage = this.getAttribute('welcomeMessage') || this.welcomeMessage;
            let space = this.getAttribute('spacing') || this.spacing;
            let position = this.getAttribute('position') || this.position;
            let headerBgColor = this.getAttribute('HeaderBgColor') || this.headerBgColor;
            let iconUrl = this.getAttribute('iconUrl') || this.iconUrl;
            this.chatBotIconUrl = iconUrl;

            // Add default QAF AI message
            this.conversationList.push({ Type: 'SYSTEM', Message: welcomeMessage })

            let customStyle = `bottom: ${space}px; right: ${space}px;`
            if (position === 'RIGHT') {
                customStyle = `bottom: ${space}px; right: ${space}px;`
            } else {
                customStyle = `bottom: ${space}px; left: ${space}px;`
            }

            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `<style>
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
                        background-color: ${headerBgColor} !important;
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
                            background-color: ${headerBgColor};
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
                                    background-color: ${headerBgColor};
                                    margin-left: auto;
                                    border-radius: 4px;
                                        font-size: 15px;
    font-weight: 400;
    line-height: 20px;
    overflow-wrap: anywhere;
                            max-width: 86%;
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
                                    padding: 11px 16px 11px;
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
                                background-color: ${headerBgColor};
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
                                    background-color:${headerBgColor} !important;
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
          </style>`

            let previewClass = isPreview ? 'chat-preview' : '';

            shadow.innerHTML += `<div class='qaf-ai-chat-widget ${previewClass}'>
                <div class="qaf-ai-widget--launcher" style="${customStyle}"><button class="qaf-ai-chat-launcher"><img src="data:image/svg+xml,%3csvg%20viewBox='0%200%2036%2036'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%3e%3cpath%20d='M18.0000533,7%20C24.6266329,7%2030,11.4789312%2030,16.9976931%20C30,22.5163617%2024.6266329,26.9953062%2018.0000533,26.9953062%20C17.123351,26.9971724%2016.2483812,26.9169271%2015.386606,26.7553699%20C14.0404188,27.7431078%2012.5315125,28.4873102%2010.9284053,28.9541197%20C10.4583473,29.0903502%209.95341047,28.916663%209.66660965,28.5199682%20C9.37982216,28.1234068%209.37297168,27.5894152%209.64952342,27.1855224%20C10.1505552,26.5172998%2010.5515886,25.7796289%2010.840002,24.9957036%20C7.9365286,23.3624038%206.10015838,20.3278759%206,16.9976931%20C6,11.4789179%2011.3733271,7%2018.0000533,7%20Z%20M18.0000533,18.0020932%20L14.0000889,18.0020932%20L13.8644511,18.0112196%20C13.3765531,18.0774186%2013.0005042,18.4957012%2013.0005042,19.0018279%20C13.0005042,19.5539661%2013.4480335,20.0015625%2014.0000889,20.0015625%20L18.0000533,20.0015625%20L18.135691,19.9924361%20C18.623589,19.9262371%2018.9996379,19.5079545%2018.9996379,19.0018279%20C18.9996379,18.4496896%2018.5521087,18.0020932%2018.0000533,18.0020932%20Z%20M22.0001244,14.001515%20L14.0000889,14.001515%20L13.8644511,14.0106414%20C13.3765531,14.0768404%2013.0005042,14.495123%2013.0005042,15.0012497%20C13.0005042,15.5533879%2013.4480335,16.0009843%2014.0000889,16.0009843%20L22.0001244,16.0009843%20L22.1357621,15.9918579%20C22.6236601,15.9256589%2022.999709,15.5073764%2022.999709,15.0012497%20C22.999709,14.4491115%2022.5521797,14.001515%2022.0001244,14.001515%20Z'%20fill='%23ffffff'%3e%3c/path%3e%3c/g%3e%3c/svg%3e" alt="launch"></button></div>
                <div class="qaf-ai-widget-chat" style="${customStyle}">
                    <div class="qaf-ai-chat--container">
                        <article>
                            <header class="qaf-ai-chat-header">
                                <div class="qaf-ai-chat-icon">
                                    <img src="${iconUrl}"/>
                                </div>
                                <h1 class="qaf-ai-chat-header--title">${title}</h1>
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
                                ${this.buildConversions()}
                            </main>
                            <footer class="qaf-ai-chat-footer">
                                <div class="qaf-ai-chat-input">
                                    <textarea id="qaf-ai-chat-ctrl" placeholder="Message"></textarea>
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
            </div>`;

            //Register events
            setTimeout(() => {
                this.shadowRoot.querySelector("button.qaf-ai-chat-launcher").addEventListener("click", this.chatWindowOpen.bind(this));
                this.shadowRoot.querySelector("button#close-chat").addEventListener("click", this.chatWindowClose.bind(this));
                this.shadowRoot.querySelector("button#end-chat").addEventListener("click", this.endConversion.bind(this));
                this.shadowRoot.querySelector("button.qaf-ai-chat-btn-cancel").addEventListener("click", this.cancelEndConversion.bind(this));
                this.shadowRoot.querySelector("button.qaf-ai-chat-btn-warn").addEventListener("click", this.endChat.bind(this));
                this.shadowRoot.querySelector("textarea#qaf-ai-chat-ctrl").addEventListener("keypress", this.submitRequest.bind(this));

            }, 100);

        }

        disconnectedCallback() {
            // browser calls this method when the element is removed from the document
            // (can be called many times if an element is repeatedly added/removed)
        }

        static get observedAttributes() {
            return [/* array of attribute names to monitor for changes */];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            // called when one of attributes listed above is modified
        }

        adoptedCallback() {
            // called when the element is moved to a new document
            // (happens in document.adoptNode, very rarely used)
        }

        // there can be other element methods and properties
    }


    function chatInitialize(params) {
        customElements.define("qaf-chat-bot", QAFChatBot);
        var chatElement = Object.assign(document.createElement('qaf-chat-bot'), {
            id: 'qaf-ai-chat-bot',
            title: params.Title,
            name: params.Name,
            iconUrl: params.IconUrl,
            headerBgColor: params.HeaderBgColor,
            welcomeMessage: params.WelcomeMessage,
            position: params.Position,
            spacing: params.Spacing,
            preview: false,
            pid: params.Pid,
            txt: params.Txt,
            tdp: params.Tdp
        });

        document.body.append(chatElement);
    }

    function chatPreview(params) {

        // Check is this added already
        let chatbot = document.querySelector("#qaf-ai-chat-bot");
        if (chatbot && chatbot.length > 0) {
            // Reload
            //chatbot.remove();

            // Add again
            var chatElement = Object.assign(document.createElement('qaf-chat-bot'), {
                id: 'qaf-ai-chat-bot',
                title: params.Title,
                name: params.Name,
                iconUrl: params.IconUrl,
                headerBgColor: params.HeaderBgColor,
                welcomeMessage: params.WelcomeMessage,
                position: params.Position,
                spacing: params.Spacing,
                preview: true,
                elementId: params.PreviewElementId
            });

            if (params.PreviewElementId) {
                document.querySelector(`#${params.PreviewElementId}`).replaceChildren(chatElement);
            } else {
                //document.body.append(chatElement);
            }

        } else {
            if (!isDefined) {
                if (!customElements.get('qaf-chat-bot')) {
                    customElements.define('qaf-chat-bot', QAFChatBot);
                }
                isDefined = true;
                // customElements.define("qaf-chat-bot", QAFChatBot);
            }

            var chatElement = Object.assign(document.createElement('qaf-chat-bot'), {
                id: 'qaf-ai-chat-bot',
                title: params.Title,
                name: params.Name,
                iconUrl: params.IconUrl,
                headerBgColor: params.HeaderBgColor,
                welcomeMessage: params.WelcomeMessage,
                position: params.Position,
                spacing: params.Spacing,
                preview: true,
                elementId: params.PreviewElementId
            });

            if (params.PreviewElementId) {
                document.querySelector(`#${params.PreviewElementId}`).append(chatElement);
            } else {
                //document.body.append(chatElement);
            }
        }
    }

    return {
        initialize: chatInitialize,
        showChatPreview: chatPreview
    }

})();
