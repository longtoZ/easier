chrome.runtime.onInstalled.addListener(function() {
    console.log('open')

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
            console.log('set color successfully')
        } else {
            console.log('set error')
        }
    })

    chrome.storage.sync.set({"ACTION_SWITCH" : "OFF"}, () => {
        console.log('set action default')
    })

    chrome.storage.sync.set({"COLLAPSE_SWITCH" : "OFF"}, () => {
        console.log('set collapse default')
    })

    chrome.storage.sync.set({"COLOR_MODE" : "BASIC"}, () => {
        console.log('set color mode default')
    })
})
