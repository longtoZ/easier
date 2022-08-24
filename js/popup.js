// Simple example, see optional options for more configuration.
try {
    const pickr = Pickr.create({
        el: '.color-picker',
        theme: 'classic', // or 'monolith', or 'nano'
    
        // swatches: [
        //     'rgba(244, 67, 54, 1)',
        //     'rgba(233, 30, 99, 0.95)',
        //     'rgba(156, 39, 176, 0.9)',
        //     'rgba(103, 58, 183, 0.85)',
        //     'rgba(63, 81, 181, 0.8)',
        //     'rgba(33, 150, 243, 0.75)',
        //     'rgba(3, 169, 244, 0.7)',
        //     'rgba(0, 188, 212, 0.7)',
        //     'rgba(0, 150, 136, 0.75)',
        //     'rgba(76, 175, 80, 0.8)',
        //     'rgba(139, 195, 74, 0.85)',
        //     'rgba(205, 220, 57, 0.9)',
        //     'rgba(255, 235, 59, 0.95)',
        //     'rgba(255, 193, 7, 1)'
        // ],
    
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
        console.log(col.toHEXA())
    })
    
    pickr.on('clear', instance => {
        console.log('Event: "clear"', instance);
    })
} catch(e) {}

function mainPopUp(bgcolor_obj2, txtcolor_obj2, customcolor_obj) {

    const title = document.querySelector('#smart-highlighter__body .main-title')
    const switcher = document.querySelector('#smart-highlighter__body .action-switcher')
    const collapse = document.querySelector('#smart-highlighter__body .collapse-switcher')

    const color_mode = document.querySelectorAll('#smart-highlighter__body .color-mode .title')
    const color_mode_select = document.querySelectorAll('#smart-highlighter__body .color-mode__select')

    const bg_tab = document.querySelector('#smart-highlighter__body .color-tab__background')
    const txt_tab = document.querySelector('#smart-highlighter__body .color-tab__text')
    const bg_section = document.querySelector('#smart-highlighter__body .color-custom.bg-section')
    const txt_section = document.querySelector('#smart-highlighter__body .color-custom.txt-section')
    const color_store = document.querySelector('#smart-highlighter__body .save-color')
    const color_reset = document.querySelector('#smart-highlighter__body .reset-color')
    const action_status = document.querySelector('#smart-highlighter__body .color-action-status p')

    document.addEventListener('mousedown', function() {
        action_status.classList.remove('action-succeed')
        action_status.classList.remove('action-failed')
        action_status.textContent = ''
    })

    function createColor2(containerCls, cls, color, parent) {
        const container = document.createElement('div')
        const display = document.createElement('span')
        const input = document.createElement('input')

        container.setAttribute('class', containerCls)
        display.setAttribute('class', cls)
        display.setAttribute('style', 'background-color:' + color)
        input.setAttribute('type', 'text')
        input.setAttribute('placeholder', color)

        container.appendChild(display)
        container.appendChild(input)

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
        createColor2(i, 'bgcolor__display', bgcolor_obj2[i], bg_section)
    }

    for (const i in txtcolor_obj2) {
        createColor2(i, 'txtcolor__display', txtcolor_obj2[i], txt_section)
    }

    color_mode.forEach(i => {
        i.onclick = () => { 
            i.parentNode.classList.toggle('open')
            if (i.parentNode.classList.contains('basic-color-mode')) {
                document.querySelector('.custom-color-mode').classList.toggle('collapse')
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
        console.log(color_send)
        sendMessage(color_send)
    })

    color_store.addEventListener('click', () => {saveColor(action_status)})
    color_reset.addEventListener('click', () => {resetColor(action_status)})

    switcher.addEventListener('click', function() {
        switcher.classList.toggle('action-switcher-active')
        sendMessage({cmd: 'action-switch'})
        chrome.storage.sync.get(["ACTION_SWITCH"], (data) => {
            if (!chrome.runtime.lastError) {
                if (data.ACTION_SWITCH=="OFF") {
                    chrome.storage.sync.set({"ACTION_SWITCH" : "ON"}, () => {})
                } else {
                    chrome.storage.sync.set({"ACTION_SWITCH" : "OFF"}, () => {})
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
}

function sendMessage(obj) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log(tabs[0])
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
        BGCOLOR[i.parentNode.className] = rgb2hex(i.style.backgroundColor)
    })

    document.querySelectorAll('#smart-highlighter__body .color-custom .txtcolor__display').forEach(i => {
        TEXTCOLOR[i.parentNode.className] = rgb2hex(i.style.backgroundColor)
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
    if (!chrome.runtime.lastError) {
        // console.log(data.ACTION_SWITCH)
        if (data.ACTION_SWITCH=="ON") {
            document.querySelector('#smart-highlighter__body .action-switcher').classList.toggle('action-switcher-active')
        }
    } else {
        console.error(chrome.runtime.lastError)
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
            console.log('basic')
            setTimeout(function() {
                document.querySelector('#smart-highlighter__body .basic-color-mode .color-mode__select').click()
            }, 100)
        } else {
            console.log('custom')
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

