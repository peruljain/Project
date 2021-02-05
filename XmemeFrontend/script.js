// get all memes
async function getReponse() {
    const response = await fetch('https://xmeme-backend.herokuapp.com/memes');
    const myJson = await response.json(); 
    return myJson
}

// for post meme
async function postMeme(meme) {
      let url = 'https://xmeme-backend.herokuapp.com/memes/?name='+meme.name+'&url='+meme.url+'&caption='+meme.caption
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
      });
      
      let result = await response.json();
      return result;
      
}

// get patch response
async function getUpdateResponse(id, body) {
    let url = 'https://xmeme-backend.herokuapp.com/memes/'+id
    let response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(body)
      });
      
      let result = await response.json();
      return result;
} 

// filling the memes in frontend
function getMemes() {
    getReponse().then((res)=>{
        let memes = document.getElementById("memes");
        memes.innerHTML = ``
        for(let i=0; i<res.length; i++) {
            memes.innerHTML+=`<div class="card meme-card" style="width: 18rem;">
            <img src=${res[i].url} class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${res[i].name}</h5>
              <p class="card-text" >${res[i].caption}</p>
              <button type="button" class="btn btn-primary" id="${res[i].id}" onclick="edit(${res[i].id})">Edit</button>
            </div>
          </div>`
        }
    }).catch((err)=>{
        console.log(err)
    })
}

getMemes()
let meme_id = 0

function submit() {
    let memer_name = document.getElementById("name").value;
    let memer_caption = document.getElementById("caption").value;
    let memer_url = document.getElementById("url").value;

    let meme = {
        name : memer_name,
        caption : memer_caption,
        url : memer_url
    }

    let result  = postMeme(meme);
    result.then((res)=>{
        getMemes()
        document.getElementById("name").value = ''
        document.getElementById("caption").value = ''
        document.getElementById("url").value = ''
        alert("Posted Successfully")
    }).catch((err)=>{
        alert(err)
    })
    
}

function edit(id) {
    document.getElementById("pop_up").style.display = "block"
    meme_id = id
}

function update() {
    let memer_caption = document.getElementById("caption_update").value;
    let memer_url = document.getElementById("url_update").value;
    let body = {
        caption : memer_caption,
        url : memer_url
    }
    let result = getUpdateResponse(meme_id, body)
    result.then((res)=>{
        document.getElementById(meme_id).parentElement.parentElement.parentElement.innerHTML = `<div class="card meme-card" style="width: 18rem;">
        <img src=${res.url} class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${res.name}</h5>
          <p class="card-text" >${res.caption}</p>
          <button type="button" class="btn btn-primary" id="${res.id}" onclick="edit(${res.id})">Edit</button>
        </div>
      </div>`
        document.getElementById("caption_update").value = ''
        document.getElementById("url_update").value = '';
        alert("Updated Successfully")
    }).catch((err)=>{
        alert(err)
    })
    document.getElementById("pop_up").style.display = "none"
}