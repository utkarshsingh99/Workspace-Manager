const hidePage = `body > :not(.beastify-image) {
                    display: none;
                  }`;

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
    let saveButton = document.getElementById('save_ws')

    saveButton.addEventListener('click', function (e) {
        browser.tabs.query({currentWindow: true})
            .then(tabs => {
                let urls = []
                let workspace_name = document.getElementById('ws_title').value;
                let workspace_id = workspace_name.trim().replace(/ /g, '');
                for (let tab of tabs) {
                    console.log(tab.url)
                    urls.push({url: tab.url, title: tab.title})
                }
                browser.tabs.query({ active: true, currentWindow: true })
                    .then(tabs => {
                        browser.tabs.sendMessage(tabs[0].id, {
                            command: "submit",
                            workspace_name,
                            workspace_id,
                            urls
                        });
                        alert('Your Workspace has been saved!')
                    })
            })
    })
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({ file: "/content_scripts/content-script.js" })
    .then(listenForClicks)
    .catch(reportExecuteScriptError);
