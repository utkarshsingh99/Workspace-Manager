let ul = document.getElementById('workspaces')

browser.storage.local.get().then(res => {
    console.log(res, typeof res)
    let keys = Object.keys(res)
    // for(var i in keys) 
    keys.forEach((key, i)=> {
        let li = `<li class="box" id="workspace_${keys[i]}">
                <h3><u>${keys[i]}</u></h3><ul>`
        console.log(keys[i])
        for(var j in res[keys[i]].urls) {
            li += `<li class="links"><a class="links" href="${res[keys[i]].urls[j].url}">${res[keys[i]].urls[j].title}</a></li><br>`;
        }
        li += `</ul>`;
        // let li = `<li id="workspace_${keys[i]}">${keys[i]}</li>`
        ul.insertAdjacentHTML('beforeend', li);
        li = document.getElementById(`workspace_${keys[i]}`)
        li.addEventListener('click', function (e) {
            var noRedirect = '.links';
            if(!e.target.matches(noRedirect)) {
                console.log(keys[i]);
                browser.storage.local.get(keys[i]).then(res => {
                    console.log(res)
                    res[keys[i]].urls.forEach(url => {
                        browser.tabs.create({
                            url: url.url
                        })
                    })
                    console.log(res[keys[i]].urls)
                })
            }
        })
    })
})

let addNewWorkspace = document.getElementById('no_workspaces');
let newWorkspace = document.getElementById('new_workspace');
let urlno = 2;
addNewWorkspace.addEventListener('click', function (e) {
    let css = newWorkspace.style.display;
    console.log(css)
    if(css == 'none') {
        newWorkspace.style.display = "block";
    } else {
        newWorkspace.style.display = "none";
    }
    // let mainString = `<br><input style="width: 400px;" type="text" id="ws_title" placeholder="Workspace Name"/><br>
    //                 <label>URL 1:</label>
    //         <input type="text" id="ws_1" placeholder="Enter URL" /><br>
    //         <input type="button" value="Add More" id="add_more" />
    //         <input type="submit" id="submit"/><br>`;

    // newWorkspace.insertAdjacentHTML('beforeend', mainString)
    let addMore = document.getElementById('add_more')
    addMore.addEventListener('click', function (e) {
        let inp = ` <label>URL ${urlno}:</label><br>
                    <input type="text" id="ws_${urlno++}" placeholder="Enter URL"/><br>`;
        newWorkspace.insertAdjacentHTML('beforeend', inp);
    })
    document.getElementById('submit').addEventListener('click', function (e) {
        let urls = []
        let workspace_name = document.getElementById('ws_title').value;
        let workspace_id = workspace_name.trim().replace(' ', '');
        let currUrl = 1;
        while(currUrl < urlno) {
            let url = document.getElementById(`ws_${currUrl}`).value;
            let title = findTitle(url)
            urls.push({url: url, title: title}) 
            currUrl++;
        }
        console.log(urls, workspace_name, workspace_id)
        browser.tabs.executeScript({ file: "/content_scripts/content-script.js" })
        .then(() => {
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
})

function findTitle(url) {
    let Lastindex = url.search(/\.com|\.org|\.io|\.in/)
    let firstIndex = url.indexOf('.')
    if(firstIndex == Lastindex) {
        firstIndex = url.indexOf('://')+2
    }
    return url.slice(firstIndex+1, Lastindex)
}
// function openTabs(key) {
//     console.log(key)
    
// }