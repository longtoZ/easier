let isOn = false
let isCollapse = false
let mode = 'basic'

let bgcolor_obj = {}
let txtcolor_obj = {}
let customcolor_obj = {}

function loadAction(bgcolor_obj, txtcolor_obj, customcolor_obj) {
    fetch(chrome.runtime.getURL('../action.html'))
    .then(response => response.text())
    .then(data => {
        document.body.insertAdjacentHTML('beforeend', data)
        main(bgcolor_obj, txtcolor_obj, customcolor_obj)
    })
}

function main(bgcolor_obj, txtcolor_obj, customcolor_obj) {

    document.querySelector('#smart-highlighter .custom-btn .bgcolor-custom').style.backgroundColor = customcolor_obj['bgcolor-custom']
    document.querySelector('#smart-highlighter .custom-btn .txtcolor-custom').style.backgroundColor = customcolor_obj['txtcolor-custom']
    document.querySelector('#smart-highlighter .custom-btn .style-custom').textContent = customcolor_obj['style-custom']

    for (const i in bgcolor_obj) {
        createColor('smbgcolor ' + i, bgcolor_obj[i], document.querySelector('.smart-highlighter__background .more-options div'))
    }

    for (const i in txtcolor_obj) {
        createColor('smtxtcolor ' + i, txtcolor_obj[i], document.querySelector('.smart-highlighter__text .more-options div'))
    }

    const action_btn  = document.querySelector('.smart-highlighter-container')

    if (isOn==true) {
        action_btn.classList.remove('deactive')
    }

    if (mode=='basic') {
        document.querySelectorAll('#smart-highlighter .smbox:not(.smart-highlighter__remove)').forEach(i => {i.classList.remove('hide')})
        document.querySelector('#smart-highlighter .custom-btn').classList.add('hide')
    } else if (mode=='custom') {
        document.querySelectorAll('#smart-highlighter .smbox:not(.smart-highlighter__remove)').forEach(i => {i.classList.add('hide')})
        document.querySelector('#smart-highlighter .custom-btn').classList.remove('hide')
    }

    if (isCollapse==true && mode=='custom') {
        document.querySelectorAll('#smart-highlighter > div:not(.smart-highlighter__remove)').forEach(i => {i.classList.add('hide')})
    }

    const background = document.querySelector('.smart-highlighter__background')
    const text = document.querySelector('.smart-highlighter__text')
    const style = document.querySelector('.smart-highlighter__style')
    const remove = document.querySelector('.smart-highlighter__remove button')

    const bgcolor = document.querySelector('.smart-highlighter__background .more-options')
    const txtcolor = document.querySelector('.smart-highlighter__text .more-options')
    const txtstyle = document.querySelector('.smart-highlighter__style .more-options')

    const bgcolor_options = document.querySelectorAll('.smart-highlighter__background .more-options button')
    const txtcolor_options = document.querySelectorAll('.smart-highlighter__text .more-options button')
    const txtstyle_options = document.querySelectorAll('.smart-highlighter__style .more-options button')

    const custom_btn = document.querySelector('#smart-highlighter .custom-btn button')

    document.addEventListener("mouseup", function(event) {
        if (isOn==true) {
            const txt = window.getSelection().toString().trim()

            if (txt.length) {
                const pageWidth = document.documentElement.offsetWidth
                const pageHeight = document.documentElement.offsetHeight
                const posX = event.clientX
                const posY = event.clientY
                const x = event.pageX
                const y = event.pageY

                if (action_btn.style.display=="none") {
                    action_btn.style.display = "block"
                    action_btn.style.left = `${x + 10}px`
                    action_btn.style.top = `${y + 20}px`

                    if (pageWidth - posX < 100) {
                        action_btn.style.left = `${x - 110}px`
                    }

                    if (pageHeight - posY < 100) {
                        action_btn.style.top = `${y - 120}px`
                    }

                } else {
                    action_btn.style.display = "block"
                }

                if (isCollapse==true && mode=='custom') {
                    document.designMode = "on"
                    document.execCommand('backColor', false, document.querySelector('#smart-highlighter .custom-btn .bgcolor-custom').style.backgroundColor)
                    document.execCommand('foreColor', false, document.querySelector('#smart-highlighter .custom-btn .txtcolor-custom').style.backgroundColor)
                    document.execCommand(document.querySelector('#smart-highlighter .custom-btn .style-custom').textContent)
                    document.designMode = "off"
                } 
                
            }
        }
    })

    document.addEventListener("mousedown", function(event) {
        if (isOn==true) {
            if (action_btn.style.display==="block" && 
            (!event.target.classList.contains("smicon") && !event.target.classList.contains("smbox") && 
            !event.target.classList.contains("smbgcolor") && !event.target.classList.contains("smtxtcolor") && 
            !event.target.classList.contains("smtxtstyle") && !event.target.classList.contains("smremove") &&
            !event.target.classList.contains("smcustom") && event.target.id!="smart-highlighter")) {

            // console.log('clicked')
            removeOptions(bgcolor, txtcolor, txtstyle)
            action_btn.style.display = "none"
            window.getSelection().empty()
                
            }
        }

    })

    background.addEventListener('mouseover', function() {
        removeOptions(txtcolor, txtstyle)
        bgcolor.classList.add('active')
    })

    bgcolor_options.forEach(i => {
        i.onclick = function() {        
            document.designMode = "on"
            document.execCommand("backColor", false, i.style.backgroundColor)
            document.designMode = "off"
        }
    })

    text.addEventListener('mouseover', function() {
        removeOptions(bgcolor, txtstyle)
        txtcolor.classList.add('active')
    })

    txtcolor_options.forEach(i => {
        i.onclick = function() {        
            document.designMode = "on"
            document.execCommand("foreColor", false, i.style.backgroundColor)
            document.designMode = "off"
        }
    })

    style.addEventListener('mouseover', function() {
        removeOptions(bgcolor, txtcolor)
        txtstyle.classList.add('active')
    })

    txtstyle_options.forEach(i => {
        i.onclick = function() {    
            document.designMode = "on"
            document.execCommand(i.getAttribute('text-style'))
            document.designMode = "off"
        }
    })

    remove.addEventListener('mouseover', function() {
        removeOptions(bgcolor, txtcolor, txtstyle)
    })

    remove.addEventListener('click', function() {
        document.designMode = "on"
        document.execCommand("removeformat", false, null)
        document.execCommand("removeformat", false, null)
        document.designMode = "off"
    })

    custom_btn.addEventListener('click', function() {
        document.designMode = "on"
        document.execCommand('backColor', false, document.querySelector('#smart-highlighter .custom-btn .bgcolor-custom').style.backgroundColor)
        document.execCommand('foreColor', false, document.querySelector('#smart-highlighter .custom-btn .txtcolor-custom').style.backgroundColor)
        document.execCommand(document.querySelector('#smart-highlighter .custom-btn .style-custom').textContent)
        document.designMode = "off"
    })

    function removeOptions() {
        for (let i=0; i<arguments.length; i++) {
            arguments[i].classList.remove('active')
        }
    }
    
    function createColor(cls, color, parent) {
        const btn = document.createElement('button')
    
        btn.setAttribute('class', cls)
        btn.setAttribute('style', 'background-color: ' + color)
    
        parent.appendChild(btn)
    }
}

function receiveMessage() {
    chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
        if (!chrome.runtime.lastError) {
            const container = document.querySelector('.smart-highlighter-container')
            if (request.cmd=='action-switch') {
                if (isOn) {
                    isOn = false
                    container.remove()
                } else {
                    isOn = true
                    loadAction(bgcolor_obj, txtcolor_obj, customcolor_obj)
                }
                
            } else if (request.cmd=='collapse-switch' && container) {
                isCollapse = isCollapse==false ? true : false
                if (isCollapse==true && mode=='custom') {
                    document.querySelectorAll('#smart-highlighter > div:not(.smart-highlighter__remove)').forEach(i => {i.classList.add('hide')})
                } else if (isCollapse==false && mode=='custom') {
                    document.querySelectorAll('#smart-highlighter > div:not(.smart-highlighter__remove)').forEach(i => {i.classList.add('hide')})
                    document.querySelector('#smart-highlighter .custom-btn').classList.remove('hide')
                } else if (mode=='basic') {
                    document.querySelectorAll('#smart-highlighter > div:not(.smart-highlighter__remove)').forEach(i => {i.classList.remove('hide')})
                    document.querySelector('#smart-highlighter .custom-btn').classList.add('hide')
                }

            } else if (request.cmd=='color-mode-basic' && container) {
                mode = 'basic'
                document.querySelectorAll('#smart-highlighter .smbox:not(.smart-highlighter__remove)').forEach(i => {i.classList.remove('hide')})
                document.querySelector('#smart-highlighter .custom-btn').classList.add('hide')

            } else if (request.cmd=='color-mode-custom' && container) {
                mode = 'custom'
                document.querySelectorAll('#smart-highlighter .smbox:not(.smart-highlighter__remove)').forEach(i => {i.classList.add('hide')})
                document.querySelector('#smart-highlighter .custom-btn').classList.remove('hide')

            } else {
                if (container) {
                    if (request.color) {
                        document.querySelector('#smart-highlighter .more-options div .' + request.class).style.backgroundColor = request.color
                    } else {
                        document.querySelector('#smart-highlighter .more-options div .' + request.class).textContent = request.style
                    }
                }
            }
            sendResponse('received')
        }
        return true
    });     
}

chrome.storage.sync.get(["COLLAPSE_SWITCH"], (data) => {
    if (!chrome.runtime.lastError) {
        if (data.COLLAPSE_SWITCH=="ON") {
            isCollapse = true
        }
    } else {
        console.error(chrome.runtime.lastError)
    }
})

chrome.storage.sync.get(["COLOR_MODE"], (data) => {
    if (!chrome.runtime.lastError) {
        if (data.COLOR_MODE=="BASIC") {
            mode = 'basic'
        } else {
            mode = 'custom'
        }
    } else {
        console.error(chrome.runtime.lastError)
    }
})

chrome.storage.sync.get(["COLOR_STORE"], (data) => {
    if (!chrome.runtime.lastError) {
        // console.log(data)
        bgcolor_obj = data.COLOR_STORE.BGCOLOR 
        txtcolor_obj = data.COLOR_STORE.TEXTCOLOR
        customcolor_obj = data.COLOR_STORE.CUSTOM_PRESET

        receiveMessage()
    } else {
        console.log('get error')
    }
})

chrome.storage.sync.get(["SITES"], (data) => {
    chrome.storage.sync.get(["SITES_SELECT"], (select) => {
        if (select.SITES_SELECT=='true') {
            tab_url = (window.location.href).match(/^(http|https):\/\/(.*?).(.*?)\//g)[0]
            for (url of data.SITES) {
                if (tab_url == url) {
                    if (!document.getElementById('smart-highlighter')) {
                        isOn = true
                        loadAction(bgcolor_obj, txtcolor_obj, customcolor_obj)
                    } else {
                        isOn = false
                        document.querySelector('.smart-highlighter-container').remove()
                    } 
                    break
                }
            }
        } else {
            chrome.storage.sync.get(["ACTION_SWITCH"], (data) => {
                if (!chrome.runtime.lastError) {
                    if (data.ACTION_SWITCH=="ON") {
                        isOn = true
                        loadAction(bgcolor_obj, txtcolor_obj, customcolor_obj)
                    } else {
                        isOn = false
                        document.querySelector('.smart-highlighter-container').remove()
            
                    }
                } else {
                    console.error(chrome.runtime.lastError)
                }
            })
        }

    })

})