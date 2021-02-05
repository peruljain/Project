async function getReponse() {
    const response = await fetch('https://xmeme-backend.herokuapp.com/memes');
    const myJson = await response.json(); 
    // hello
    return myJson
}

async function postMeme(meme) {
      let response = await fetch('https://xmeme-backend.herokuapp.com/memes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(meme)
      });
      
      let result = await response.json();
      return result;
      
}


function getMemes() {
    getReponse().then((res)=>{
        let memes = document.getElementById("memes");
        memes.innerHTML = ``
        for(let i=0; i<res.length; i++) {
            memes.innerHTML+=`<div class="card meme-card" style="width: 18rem;">
            <img src=${res[i].url} class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${res[i].name}</h5>
              <p class="card-text">${res[i].caption}</p>
            </div>
          </div>`
        }
    }).catch((err)=>{
        console.log(err)
    })
}

getMemes()

function test() {
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