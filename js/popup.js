try {
    const pickr = Pickr.create({
        el: '.color-picker',
        theme: 'classic', // or 'monolith', or 'nano'
    
        swatches: null,
    
        components: {
    
            // Main components
            preview: true,
            opacity: true,
            hue: true,
    
            // Input / output Options
            interaction: {
                hex: true,
                rgba: true,
                hsla: true,
                hsva: true,
                cmyk: true,
                input: true,
                clear: true,
                save: true
            }
        }
    });

    pickr.on('save', (color) => {
        let col = color
    })
    
    pickr.on('clear', instance => {
        console.log('Event: "clear"', instance);
    })
} catch(e) {}

const title = document.querySelector('#smart-highlighter__body .main-title')
const switcher = document.querySelector('#smart-highlighter__body .action-switcher')

const url_list = document.querySelector('.url-item-container')
const add_url_btn = document.querySelector('.url-box .url-add')
const url_noti = document.querySelector('.url-noti')
const url_pattern = /^(http|https):\/\/(.*?).(.*?)\//g
let tab_url = ''
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    try {
        tab_url = (tabs[0].url).match(url_pattern)[0];
    } catch (e) {
        console.log(e)
    }
    document.querySelector('.url-box input').setAttribute('placeholder', tab_url)
})

function mainPopUp(bgcolor_obj2, txtcolor_obj2, customcolor_obj) {

    const collapse = document.querySelector('#smart-highlighter__body .collapse-switcher')

    const site_mode = document.querySelector('#smart-highlighter__body .site-mode .title')
    const site_mode_select = document.querySelector('#smart-highlighter__body .site-mode__select')

    const color_mode = document.querySelectorAll('#smart-highlighter__body .color-mode .title')
    const color_mode_select = document.querySelectorAll('#smart-highlighter__body .color-mode__select')

    const bg_tab = document.querySelector('#smart-highlighter__body .color-tab__background')
    const txt_tab = document.querySelector('#smart-highlighter__body .color-tab__text')
    const bg_section = document.querySelector('#smart-highlighter__body .color-custom.bg-section')
    const txt_section = document.querySelector('#smart-highlighter__body .color-custom.txt-section')
    const color_store = document.querySelector('#smart-highlighter__body .save-color')
    const color_reset = document.querySelector('#smart-highlighter__body .reset-color')
    const action_status = document.querySelector('#smart-highlighter__body .color-action-status p')

    const refresh_btn = document.querySelector('#smart-highlighter__body .color-action-status .refresh')
    const add_url_btn = document.querySelector('.url-box .url-add')

    function createColor(containerCls, cls, color, parent) {
        const container = document.createElement('div')
        const display = document.createElement('span')
        const input = document.createElement('input')
        const remove = document.createElement('div')

        container.setAttribute('class', containerCls)
        display.setAttribute('class', cls)
        display.setAttribute('style', 'background-color:' + color)
        input.setAttribute('type', 'text')
        input.setAttribute('placeholder', color)
        remove.setAttribute('class', 'basic-color__remove')
        remove.innerHTML = `<svg class="url-remove" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#000000}</style><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>`

        container.appendChild(display)
        container.appendChild(input)
        container.appendChild(remove)

        parent.appendChild(container)

    }

    function createCustomColor(customcolor_obj) {

        document.querySelector('.bgcolor-custom span').style.backgroundColor = customcolor_obj['bgcolor-custom']
        document.querySelector('.bgcolor-custom input').placeholder = customcolor_obj['bgcolor-custom']

        document.querySelector('.txtcolor-custom span').style.backgroundColor = customcolor_obj['txtcolor-custom']
        document.querySelector('.txtcolor-custom input').placeholder = customcolor_obj['txtcolor-custom']

        document.querySelectorAll('.style-custom option').forEach(i => {
            if (i.value==customcolor_obj['style-custom']) {
                i.setAttribute('selected', 'selected')
            } else {
                i.removeAttribute('selected')
            }
        })


    }

    createCustomColor(customcolor_obj)

    for (const i in bgcolor_obj2) {
        createColor(i, 'bgcolor__display', bgcolor_obj2[i], bg_section)
    }

    for (const i in txtcolor_obj2) {
        createColor(i, 'txtcolor__display', txtcolor_obj2[i], txt_section)
    }

    document.querySelectorAll('.basic-color__remove').forEach(i => {
        i.addEventListener('click', () => {
            i.parentNode.remove()
        })
    })

    site_mode.addEventListener('click', function() {
        this.parentNode.classList.toggle('open')
        document.querySelector('.basic-color-mode').classList.toggle('collapse')
        document.querySelector('.custom-color-mode').classList.toggle('collapse')
        title.classList.toggle('collapse')
        switcher.classList.toggle('collapse')

    })

    site_mode_select.addEventListener('click', function() {

        switcher.classList.toggle('hide')
        title.classList.toggle('hide')

        if (this.parentNode.classList.contains('select')) {
            switcher.classList.remove('action-switcher-active')
            this.classList.remove('select')
            this.parentNode.classList.remove('select')
            chrome.storage.sync.set({"SITES_SELECT" : 'false'})
        } else {
            switcher.classList.add('action-switcher-active')
            this.classList.add('select')
            this.parentNode.classList.add('select')
            chrome.storage.sync.set({"SITES_SELECT" : 'true'})
        }
    })

    color_mode.forEach(i => {
        i.onclick = () => { 
            i.parentNode.classList.toggle('open')
            if (i.parentNode.classList.contains('basic-color-mode')) {
                document.querySelector('.custom-color-mode').classList.toggle('collapse')

                if (document.querySelector('#smart-highlighter__body .color-mode.open')) {
                    if (document.querySelector('#smart-highlighter__body .basic-color-mode .bgcolor-custom')) {
                        document.querySelector('#smart-highlighter__body .color-mode.open').style.height = '400px'
                    }
                } else {
                    document.querySelector('#smart-highlighter__body .color-mode').style.height = ''
                }

            } else {
                document.querySelector('.basic-color-mode').classList.toggle('collapse')

            }
            title.classList.toggle('collapse')
            switcher.classList.toggle('collapse')
        }
    })

    color_mode_select.forEach(i => {
        i.onclick = () => {
            i.classList.add('select')
            i.parentNode.classList.add('select')
            if (i.parentNode.classList.contains('basic-color-mode')) {
                document.querySelector('.custom-color-mode').classList.remove('select')
                document.querySelector('.custom-color-mode .color-mode__select').classList.remove('select')

                sendMessage({cmd: 'color-mode-basic'})
                chrome.storage.sync.set({"COLOR_MODE" : "BASIC"}, () => {})
            } else {
                document.querySelector('.basic-color-mode').classList.remove('select')
                document.querySelector('.basic-color-mode .color-mode__select').classList.remove('select')

                sendMessage({cmd: 'color-mode-custom'})
                chrome.storage.sync.set({"COLOR_MODE" : "CUSTOM"}, () => {})
            }

        }
    })


    bg_tab.addEventListener('click', function() {
        bg_tab.style.boxShadow = '-4px 0 0 0 var(--second-primary-bg)'
        txt_tab.style.boxShadow = 'none'

        bg_tab.classList.add('color-tab-active')
        bg_section.classList.add('color-custom-active')
        txt_tab.classList.remove('color-tab-active')
        txt_section.classList.remove('color-custom-active')
    })

    txt_tab.addEventListener('click', function() {
        txt_tab.style.boxShadow = '4px 0 0 0 var(--second-primary-bg)'
        bg_tab.style.boxShadow = 'none'

        txt_tab.classList.add('color-tab-active')
        txt_section.classList.add('color-custom-active')
        bg_tab.classList.remove('color-tab-active')
        bg_section.classList.remove('color-custom-active')
    })

    const color_input = document.querySelectorAll('#smart-highlighter__body .color-custom input')
    const style_custom = document.querySelector('#smart-highlighter__body .color-custom select')
    
    color_input.forEach(i => {
        i.addEventListener('change', function() {
            i.value == '' ?  i.previousElementSibling.style.backgroundColor = i.getAttribute('placeholder') : i.previousElementSibling.style.backgroundColor = i.value.toString()
            var color_send = {class: i.parentNode.className, color: i.previousElementSibling.style.backgroundColor}
            sendMessage(color_send)
        })
    })

    style_custom.addEventListener('change', function() {
        var color_send = {class: this.className, style: this.value}
        sendMessage(color_send)
    })

    color_store.addEventListener('click', () => {
        refresh_btn.style.display = 'block'
        saveColor(action_status)
    })

    color_reset.addEventListener('click', () => {
        refresh_btn.style.display = 'block'
        resetColor(action_status)
    })

    switcher.addEventListener('click', function() {
        switcher.classList.toggle('action-switcher-active')
        sendMessage({cmd: 'action-switch'})
        chrome.storage.sync.get(["ACTION_SWITCH"], (data) => {
            if (!chrome.runtime.lastError) {
                if (data.ACTION_SWITCH=="OFF") {
                    chrome.storage.sync.set({"ACTION_SWITCH" : "ON"}, () => {})
                    chrome.action.setIcon({path: 
                        {
                            "16": "/img/easier-16.png",
                            "32": "/img/easier-32.png",
                            "48": "/img/easier-48.png",
                            "128": "/img/easier-128.png"
                        }
                    })
                } else {
                    chrome.storage.sync.set({"ACTION_SWITCH" : "OFF"}, () => {})
                    chrome.action.setIcon({path: 
                        {
                            "16": "/img/easier-16-off.png",
                            "32": "/img/easier-32-off.png",
                            "48": "/img/easier-48-off.png",
                            "128": "/img/easier-128-off.png"
                        }
                    })
                }
            } else {
                console.error(chrome.runtime.lastError)
            }
        })

    })

    collapse.addEventListener('click', function() {
        collapse.classList.toggle('collapse-switcher-active')
        sendMessage({cmd: 'collapse-switch'})
        chrome.storage.sync.get(["COLLAPSE_SWITCH"], (data) => {
            if (!chrome.runtime.lastError) {
                if (data.COLLAPSE_SWITCH=="OFF") {
                    chrome.storage.sync.set({"COLLAPSE_SWITCH" : "ON"}, () => {})
                } else {
                    chrome.storage.sync.set({"COLLAPSE_SWITCH" : "OFF"}, () => {})
                }
            } else {
                console.error(chrome.runtime.lastError)
            }
        })
    })

    refresh_btn.addEventListener('click', function() {
        refresh_btn.querySelector('.transition-overlay').classList.toggle('active')
        setTimeout(() => {
            window.close()
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.reload(tabs[0].id)
            })
        }, 500)

    })

    add_url_btn.addEventListener('click', function() {
        const input = document.querySelector('.url-box input').value.trim()
        const url = input == '' ?  tab_url : input

        console.log(tab_url)
        addURL(url)
        document.querySelector('.url-box input').value = ''

    })

}

function warningNoti(txt) {
    url_noti.style.display = 'block'
    url_noti.textContent = txt
    setTimeout(() => {
        url_noti.style.display = 'none'
        url_noti.textContent = ''
    }, 1000)
}

function createURL(url) {

    add_url_btn.classList.toggle('new')
    const url_item = document.createElement('div')
    url_item.classList.add('url-item')
    url_item.innerHTML = `<input type="text" class="item" value="${url}">
    <svg class="url-remove" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#000000}</style><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>`

    url_list.appendChild(url_item)

    const remove_url_btn = url_item.querySelector('.url-remove')
    remove_url_btn.addEventListener('click', function() {
        this.parentElement.remove()

        removeURL(url)
    })
}

function addURL(url) {

    if (!url.match(/^(https|http):\/\//)) {
        warningNoti('Require "http" or "https"!')
        return 0
    }

    if (url.match(url_pattern)==null) {
        warningNoti('Wrong url format!')
        return 0 
    }

    chrome.storage.sync.get(["SITES"], (data) => {
        let new_data = data.SITES
        if (!new_data.includes(url)) {
            new_data.push(url)
            chrome.storage.sync.set({"SITES": new_data}, () => {})
            createURL(url)
            
        } else {
            warningNoti('Already in list!')
            return 0
        }
    })
    


}

function removeURL(url) {
    chrome.storage.sync.get(["SITES"], (data) => {
        let new_data = data.SITES.filter(i => i !== url)
        chrome.storage.sync.set({"SITES": new_data}, () => {})
    })
}

function sendMessage(obj) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // console.log(tabs[0])
        chrome.tabs.sendMessage(tabs[0].id, obj, function (response) {
        })
    });
}

function saveColor(action_status) {
    const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`
    const BGCOLOR = {}
    const TEXTCOLOR = {}
    const CUSTOM_PRESET = {
        'bgcolor-custom': rgb2hex(document.querySelector('.bgcolor-custom span').style.backgroundColor),
        'txtcolor-custom': rgb2hex(document.querySelector('.txtcolor-custom span').style.backgroundColor),
        'style-custom': document.querySelector('.style-custom').value
    }

    document.querySelectorAll('#smart-highlighter__body .color-custom .bgcolor__display').forEach(i => {
        if (i.parentNode.parentNode.parentNode.matches('.custom-color-mode.select') || i.parentNode.parentNode.parentNode.matches('.basic-color-mode')) {
            BGCOLOR[i.parentNode.className] = rgb2hex(i.style.backgroundColor)
        }
    })

    document.querySelectorAll('#smart-highlighter__body .color-custom .txtcolor__display').forEach(i => {
        if (i.parentNode.parentNode.parentNode.matches('.custom-color-mode.select') || i.parentNode.parentNode.parentNode.matches('.basic-color-mode')) {
            TEXTCOLOR[i.parentNode.className] = rgb2hex(i.style.backgroundColor)
        }
    })

    const color_store = {
        'BGCOLOR': BGCOLOR,
        'TEXTCOLOR': TEXTCOLOR,
        'CUSTOM_PRESET': CUSTOM_PRESET
    }

    chrome.storage.sync.set({"COLOR_STORE" : color_store}, () => {
        var error = chrome.runtime.lastError;
        if (!error) {
            action_status.textContent = 'Save successfully! RELOAD REQUIRED'
            action_status.classList.remove('action-failed')
            action_status.classList.add('action-succeed')
        } else {
            action_status.textContent = 'Falied to save!'
            action_status.classList.remove('action-succeed')
            action_status.classList.add('action-failed')
        }
    })


}

function resetColor(action_status) {
    chrome.storage.sync.clear(function() {
        var error = chrome.runtime.lastError;
        if (!error) {
            action_status.textContent = 'Reset successfully! RELOAD REQUIRED'
            action_status.classList.remove('action-failed')
            action_status.classList.add('action-succeed')
        } else {
            action_status.textContent = 'Falied to reset!'
            action_status.classList.remove('action-succeed')
            action_status.classList.add('action-failed')
        }
    });

    setColor()
}

function setColor() {
    const bgcolor_obj2 = {
        'bgcolor-1': '#c7e372',
        'bgcolor-2': '#ffc701',
        'bgcolor-3': '#ef5a68',
        'bgcolor-4': '#9ad0dc',
        'bgcolor-5': '#d4ddda',
        'bgcolor-6': '#fdb9c9'
    }

    const txtcolor_obj2 = {
        'txtcolor-1': '#91c200',
        'txtcolor-2': '#c79c00',
        'txtcolor-3': '#c40014',
        'txtcolor-4': '#008faf',
        'txtcolor-5': '#d4ddda',
        'txtcolor-6': '#970023'
    }

    const customcolor_obj = {
        'bgcolor-custom': '#d4ddda',
        'txtcolor-custom': '#ffc701',
        'style-custom': 'bold'
    }

    const color_store = {
        'BGCOLOR': bgcolor_obj2,
        'TEXTCOLOR': txtcolor_obj2,
        'CUSTOM_PRESET': customcolor_obj
    }

    chrome.storage.sync.set({"COLOR_STORE" : color_store}, () => {
        if (!chrome.runtime.lastError) {
            console.log('set successfully')
        } else {
            console.error(chrome.runtime.lastError)
        }
    })

    chrome.storage.sync.set({"ACTION_SWITCH" : "OFF"}, () => {
        console.log('set action default')
    })

    chrome.storage.sync.set({"COLOR_MODE" : "BASIC"}, () => {
        console.log('set color mode default')
    })
}

chrome.storage.sync.get(["ACTION_SWITCH"], (data) => {
    if (data.ACTION_SWITCH=="ON") {
        switcher.classList.add('action-switcher-active')
        chrome.action.setIcon({path: 
            {
                "16": "/img/easier-16.png",
                "32": "/img/easier-32.png",
                "48": "/img/easier-48.png",
                "128": "/img/easier-128.png"
            }
        })
    } else {
        switcher.classList.remove('action-switcher-active')
        chrome.action.setIcon({path: 
            {
                "16": "/img/easier-16-off.png",
                "32": "/img/easier-32-off.png",
                "48": "/img/easier-48-off.png",
                "128": "/img/easier-128-off.png"
            }
        })
    }  

    
})

chrome.storage.sync.get(["COLLAPSE_SWITCH"], (data) => {
    if (!chrome.runtime.lastError) {
        // console.log(data.ACTION_SWITCH)
        if (data.COLLAPSE_SWITCH=="ON") {
            document.querySelector('#smart-highlighter__body .collapse-switcher').classList.toggle('collapse-switcher-active')
        }
    } else {
        console.error(chrome.runtime.lastError)
    }
})

chrome.storage.sync.get(["COLOR_MODE"], (data) => {
    if (!chrome.runtime.lastError) {
        if (data.COLOR_MODE=="BASIC") {
            setTimeout(function() {
                document.querySelector('#smart-highlighter__body .basic-color-mode .color-mode__select').click()
            }, 100)
        } else {
            setTimeout(function() {
                document.querySelector('#smart-highlighter__body .custom-color-mode .color-mode__select').click()
            }, 100)
        }
    } else {
        console.error(chrome.runtime.lastError)
    }
})

chrome.storage.sync.get(["COLOR_STORE"], (data) => {
    if (!chrome.runtime.lastError) {
        // console.log(data)
        const bgcolor_obj2 = data.COLOR_STORE.BGCOLOR 
        const txtcolor_obj2 = data.COLOR_STORE.TEXTCOLOR
        const customcolor_obj = data.COLOR_STORE.CUSTOM_PRESET

        mainPopUp(bgcolor_obj2, txtcolor_obj2, customcolor_obj)
    } else {
        console.log('get error')
    }
})

chrome.storage.sync.get(["SITES_SELECT"], (data) => {
    if (!chrome.runtime.lastError) {
        if (data.SITES_SELECT=='true') {
            document.querySelector('#smart-highlighter__body .site-mode').classList.add('select')
            document.querySelector('#smart-highlighter__body .site-mode__select').classList.add('select')
            title.classList.add('hide')
            switcher.classList.add('hide')

            if (!switcher.classList.contains('action-switcher-active')) {
                switcher.click()
                console.log('click in sites select')
            }
        } 
    } else {
        console.error(chrome.runtime.lastError)
    }
})

chrome.storage.sync.get(["SITES"], (data) => {
    for (url of data.SITES) {
        createURL(url)
        if (tab_url == url) {
            if (document.querySelector('.site-mode__select').classList.contains('select')) {
                if (!switcher.classList.contains('action-switcher-active')) {
                    switcher.click()
                    console.log('click in sites')
                    chrome.action.setIcon({path: 
                        {
                            "16": "/img/easier-16.png",
                            "32": "/img/easier-32.png",
                            "48": "/img/easier-48.png",
                            "128": "/img/easier-128.png"
                        }
                    })
                    break
                } else {
                    chrome.action.setIcon({path: 
                        {
                            "16": "/img/easier-16-off.png",
                            "32": "/img/easier-32-off.png",
                            "48": "/img/easier-48-off.png",
                            "128": "/img/easier-128-off.png"
                        }
                    })
                } 
            }
            
        } 
        
        
    }
        
        
    
})


document.querySelector('.url-noti').addEventListener('click', function() {
    this.textContent = ''
    this.style.display = 'none'
})

document.querySelector('.url-box input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        add_url_btn.dispatchEvent(new Event('click'))
    }
})