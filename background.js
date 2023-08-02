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
        'bgcolor-custom': '#000000',
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

    chrome.storage.sync.set({"SITES": []}, () => {
        console.log('Created sites array')
    })

    chrome.storage.sync.set({"SITES_SELECT": 'false'}, () => {
        console.log('Created sites select')
    })
})


// async function getTab() {
//     let queryOptions = { active: true, currentWindow: true };
//     let tabs = await chrome.tabs.query(queryOptions);
//     return tabs[0].url.toString();
// }

function changeIcon(tab_url) {
    chrome.storage.sync.get(["SITES"], (data) => {
        chrome.storage.sync.get(["SITES_SELECT"], (select) => {
            if (select.SITES_SELECT=='true') {
                for (urls of data.SITES) {
                    if (tab_url.startsWith(urls)) {
                        console.log(tab_url.startsWith(urls), 'Same: ' + tab_url, urls)
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
                        console.log(tab_url, urls)
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
        })
        
    }) 


}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    changeIcon(tab.url)
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, tab => {
        changeIcon(tab.url);
      });
})