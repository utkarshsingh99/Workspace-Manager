browser.storage.local.get().then(res => {
    console.log(res)
    let ul = document.getElementById('workspaces')
    let keys = Object.keys(res)
    console.log(keys)
    keys.forEach((key, i) => {
        console.log(res[key].id);
        let str = `<li class="box" id=${res[key].id}><h3>${key}</h3></li><br>`;
        ul.insertAdjacentHTML('beforeend',str);
        document.getElementById(`${res[key].id}`).addEventListener('click', function (e) {
            let confirm = confirm("Are you sure you want to delete this workspace?")
            if(confirm){
                browser.storage.local.remove(`${key}`).then(()=>alert('Workspace Deleted. Reload to see changes'))
            }
        })
    })
})