let toggleIsOn = false;
const elementIsReady = "special-flag";
let indicatorModal = document.createElement('div');

document.addEventListener('keydown', (event) => {
  //event.preventDefault();
  if (event.ctrlKey && event.key === 'b') {
    toggleIsOn ? toggleOff() : toggleOn();
  }

  function toggleOn() {
    toggleIsOn = true;

    indicatorModal.className = "indicator";
    indicatorModal.innerText = "Fontsnatcher is on";
    document.body.appendChild(indicatorModal);

    registerEventHandlers();
  }

  function toggleOff() {
    toggleIsOn = false;

    indicatorModal.className = "indicator";
    indicatorModal.innerText = "Fontsnatcher is off";
    document.body.appendChild(indicatorModal);
  }
})

function registerEventHandlers() {
  const allText = document.querySelectorAll('h1, h2, h3, h4, h5, p, li, td, caption, span');

    for (let i = 0; i < allText.length; i++) {
        const textElement = allText[i];

        // mark each text element with attribute to know the event
        // actions have been applied, to prevent registering
        // these handlers multiple times
        if (!textElement.hasAttribute(elementIsReady)) {

            // ON MOUSE HOVER
            textElement.addEventListener('mouseover', async () => {
              if (!toggleIsOn){
                textElement.style.cursor = null;
                return;
              } 
                
              const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#bdb2ff', '#9fdfff'];

              textElement.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
              textElement.style.borderRadius = "6px";
              textElement.style.cursor = "pointer";
            });

            // ON MOUSE LEAVE
            textElement.addEventListener('mouseout', async () => {
              if (!toggleIsOn) return;
              textElement.style.backgroundColor = null;
            });

            // ON CLICK
            textElement.addEventListener('click', async (e) => {
              if (!toggleIsOn) return;

              const showModal = async () => {
                const modal = document.createElement('dialog');
                const fontName = document.createElement('h1');
                const fontDetails = document.createElement('h4');
                const tryBtn = document.createElement('button');
                const getStyles = getComputedStyle(textElement);
                const family = getStyles.fontFamily;
                const color = getStyles.color;
                const fstyle = getStyles.fontWeight;
                const newFont = family.replaceAll('serif', '').replaceAll('sans-', '')
                .replaceAll('-','').replaceAll('"', '').split(", ")[0];

                // Font Name
                fontName.innerText = newFont;
                fontName.setAttribute('style',`position:absolute; font-family:${ family } !important; left:5px; top:20px; font-size:35px; padding:0 !important; margin:0 !important;`);

                // Font Colour and Weight
                function hex(x) {
                  return ("0" + parseInt(x).toString(16)).slice(-2);
                }
                function rgb2hex(rgb) {
                 rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s*\d+\.*\d+)?\)$/);
                 return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
                }
                ///

                const hexColor = rgb2hex(color);
                fontDetails.innerText = hexColor + " • " + fstyle;
                fontDetails.setAttribute('style',`color:#B8B8B8; position:absolute; left:5px; top:65px; font-size:18px; font-weight:400; padding:0 !important; margin:0 !important;`);


                //TryButton
                tryBtn.innerText = 'Try out this font';
                tryBtn.className = 'tryfont-btn';

                tryBtn.addEventListener('click', () => {
                  const closeBtn = document.createElement('button');

                  // Close Button hovering above
                  closeBtn.innerText = `X`;
                  closeBtn.setAttribute('style', `background-color: #ffffff !important; color: #000000 !important; height: 30px !important; width: 30px !important;  z-index:10000; position: absolute; right: 20px; top: -50px; border-radius: 100px; box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px; border: none;`);
                  closeBtn.addEventListener('click', () => {
                    canvDiv.style.display = "none";
                  });

                  document.body.insertAdjacentHTML('afterbegin', `<div id="canvDiv" style="position:fixed; left:500px; top:200px; background-color:#ffffff; border-radius:10px;
                  z-index:10000000000000000000000000000000000000000000000000000000000000000000000000000000000;">
                  <canvas id="canvas" 
                  style=
                  "
                  border-radius:10px;
                  text-align:center;
                  box-shadow: rgba(0, 0, 0, 0.2) 0px 18px 50px -10px;
                  ">
                  </canvas>

                  <div id="tools" style=
                  "
                  position:absolute;
                  top:50%;
                  right:20px;
                  background-color:#eeeeee;
                  width:50px;
                  height:260px;
                  border-radius:7px;
                  transform: translate(0%, -50%);
                  padding:10px;
                  display:flex;
                  flex-direction:column;
                  gap:12px;
                  "
                  >

                    <img class="toolbar-icons" id="textIcon" alt="textIcon"/>
                    <img class="toolbar-icons" id="boldIcon" alt="boldIcon"/>
                    <img class="toolbar-icons" id="italicsIcon" alt="italicsIcon"/>
                    <img class="toolbar-icons" id="alignLeftIcon" alt="alignLeftIcon"/>
                    <img class="toolbar-icons" id="alignCenterIcon" alt="alignCenterIcon"/>
                    <img  class="toolbar-icons" id="alignRightIcon" alt="alignRightIcon"/>
                  </div>
                  </div>`);
                  
                  // Add canvas from fabric.js
                  const canv = new fabric.Canvas('canvas', {
                    width:600,
                    height:300,
                  });

                  const text = new fabric.IText('Type text here', { 
                    left: 150, 
                    top: 120,
                    fontFamily: family,
                  });

                  canv.add(text);
                  canv.renderAll();

                  const canvDiv = document.getElementById('canvDiv');
                  canvDiv.appendChild(closeBtn);

                  let isNewText = false;



                  /* -----TOOLBAR ICONS----- */
                  const boldIconImg = document.getElementById("boldIcon");
                  boldIconImg.src = chrome.runtime.getURL('images/toolbar/boldIcon.svg');
                  boldIconImg.style.cursor = "pointer";

                  const italicsIconImg = document.getElementById("italicsIcon");
                  italicsIconImg.src = chrome.runtime.getURL('images/toolbar/italicsIcon.svg');
                  italicsIconImg.style.cursor = "pointer";

                  const alignLeftImg = document.getElementById("alignLeftIcon");
                  alignLeftImg.src = chrome.runtime.getURL('images/toolbar/alignLeftIcon.svg');
                  alignLeftImg.style.cursor = "pointer";

                  const alignCenterImg = document.getElementById("alignCenterIcon");
                  alignCenterImg.src = chrome.runtime.getURL('images/toolbar/alignCenterIcon.svg');
                  alignCenterImg.style.cursor = "pointer";

                  const alignRightImg = document.getElementById("alignRightIcon");
                  alignRightImg.src = chrome.runtime.getURL('images/toolbar/alignRightIcon.svg');
                  alignRightImg.style.cursor = "pointer";

                  /* ---------------------------------------------------------------- */

                  const textIconImg = document.getElementById("textIcon");
                  textIconImg.src = chrome.runtime.getURL('images/toolbar/textIcon.svg');
                  textIconImg.style.cursor = "pointer";
                  textIconImg.addEventListener('click', () => {
                    const newText = new fabric.IText('Type text here', { 
                      left: 150, 
                      top: 120,
                      fontFamily: family,
                    });

                    canv.add(newText);
                    canv.renderAll();

                    return;

                    newText.on('selected', () => {
                        // Text Align Left
                        alignLeftImg.addEventListener('click', () => {
                          newText.textAlign = 'left';
                          canv.renderAll();
                        });

                        // Text Align Center
                        alignCenterImg.addEventListener('click', () => {
                          newText.textAlign = 'center';
                          canv.renderAll();
                        });

                        // Text Align Right
                        alignRightImg.addEventListener('click', () => {
                          newText.textAlign = 'right';
                          canv.renderAll();
                        });

                        // Make Italic
                        italicsIconImg.addEventListener('click', async () => {
                          newText.fontStyle = await 'italic';
                          canv.renderAll();
                        });

                        // Make Bold
                        boldIconImg.addEventListener('click', async () => {
                          newText.fontWeight = await 'bold';
                          canv.renderAll();
                        });
                      });
                  });

                  boldIconImg.addEventListener('click', async () => {
                    if (boldIconImg.classList.contains("toolbar-icons")) {
                      boldIconImg.classList.remove("toolbar-icons");
                      boldIconImg.classList.add("toolbar-icons-active");

                      text.fontWeight = await 'bold';
                      canv.renderAll();
                    }
                      else if (boldIconImg.classList.contains("toolbar-icons-active")) {
                      boldIconImg.classList.remove("toolbar-icons-active");
                      boldIconImg.classList.add("toolbar-icons");

                      text.fontWeight = await 'normal';
                      canv.renderAll();
                    }
                  });

                  italicsIconImg.addEventListener('click', async () => {
                    if (italicsIconImg.classList.contains("toolbar-icons")) {
                      italicsIconImg.classList.remove("toolbar-icons");
                      italicsIconImg.classList.add("toolbar-icons-active");

                      text.fontStyle = await 'italic';
                      canv.renderAll();
                    }
                    else if (italicsIconImg.classList.contains("toolbar-icons-active")) {
                      italicsIconImg.classList.remove("toolbar-icons-active");
                      italicsIconImg.classList.add("toolbar-icons");

                      text.fontStyle = await 'normal';
                      canv.renderAll();
                    }
                  });

                  alignLeftImg.addEventListener('click', () => {
                    text.textAlign = 'left';
                    canv.renderAll();
                  });

                  alignCenterImg.addEventListener('click', () => {
                    text.textAlign = 'center';
                    canv.renderAll();
                  });

                  alignRightImg.addEventListener('click', () => {
                    text.textAlign = 'right';
                    canv.renderAll();
                  });
                  
                  /* END */
                });


/* -------------------------------------------------------------------------------- */


                // Set the style attribute of the modal
                modal.setAttribute(
                  "style",`
                  border: none;
                  border-radius:20px;
                  background-color:#fafafa;
                  opacity:1;
                  animation:fadeMe 0.4s;
                  position:absolute;
                  z-index:10000000000000000000000;
                  box-shadow: rgba(0, 0, 0, 0.2) 0px 18px 50px -10px;
                  `);
              
                  modal.innerHTML = 
                  `
                  <iframe id="popup-content" scrolling="no" style="height:155px; width:347px; z-index:10000000000000; animation:fadeMe 0.4s;" frameBorder="0">
                    
                  </iframe>
                  `;
            
                  modal.style.top = e.pageY+"px";
                  modal.style.left = e.pageX+"px";

                  modal.appendChild(fontName);
                  modal.appendChild(fontDetails);
                  modal.appendChild(tryBtn);

                  document.body.appendChild(modal);
                  
                  const dialog = document.querySelector("dialog");
                  dialog.show();
            
                  document.body.addEventListener('click', () => {
                    document.body.removeChild(modal);
                    dialog.close();
                  });

                  const iframe = document.getElementById("popup-content");
                  iframe.src = chrome.extension.getURL("findfont.html")
              }
            
                // Load in HTML file
                fetch(chrome.runtime.getURL("findfont.html"))
                  .then(r => r.text())
                  .then(html => {
                    showModal();
                });
            });

            textElement.setAttribute(elementIsReady, true);
        }
    }
}