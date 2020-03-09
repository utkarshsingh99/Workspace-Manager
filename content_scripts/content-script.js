(function () {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    browser.runtime.onMessage.addListener((message) => {
        if (message.command == "submit") {
            console.log('Submit Button Invoked', message.urls)
            let workspace = {
                name: message.workspace_name,
                urls: message.urls
            }
            let workspace_name = workspace.name, urls = workspace.urls, id=message.workspace_id

            browser.storage.local.set({[workspace_name] : {urls: urls, id: id}})
                .then(() => {
                    browser.storage.local.get()
                        .then(results => console.log(results))
                }).catch(e => console.error(e))
        }
    });

})();