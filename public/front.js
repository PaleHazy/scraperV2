let appendHere = document.getElementsByClassName("articles")[0];
let note = document.getElementsByClassName("notes")[0];
note.onclick = function(event){
if (event.target.nodeName === "BUTTON"){
    console.log(event.target.id)
    
    let obj = {
        title: document.getElementById('noteTitle').value,
        body: document.getElementById('noteBody').value
    }
    console.log(obj)
    postFile(event.target.id, obj)
}
}

function getNote(message){
    console.log(this)
    let response = JSON.parse(this.responseText)
    if (response.note){

        console.log('damn', response)
        document.getElementById('noteTitle').value = response.note.title
        document.getElementById('noteBody').value = response.note.body
    }
   
  
}

appendHere.onclick = function(event) {
    
    note.innerText = ""
    var el = event.target;
    if(el.nodeName === "P"){
        console.log(el.getAttribute('data-id'))
        let idOfMongo = el.getAttribute('data-id')
        loadFile('/articles/' + idOfMongo, getNote, 'coooo')
        console.log(el.innerText)
        let title = document.createElement("p")
        title.innerText = el.innerText
        let input =  document.createElement("input")
        input.setAttribute('id', 'noteTitle')
        let area = document.createElement("textarea")
        area.setAttribute('id', 'noteBody')
        let butt = document.createElement("button")
        butt.setAttribute('id',idOfMongo )
        butt.innerText = "Add a note brother"
        note.appendChild(title)
        note.appendChild(input)
        note.appendChild(area)
        note.appendChild(butt)
        // if (el.nodeName == "P") {
        //     alert(el.innerText);
        // }
    }
    
};

function postFile(id, obj){
    console.log(obj)
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/articles/' + id, true )
    xhr.setRequestHeader('Content-Type', 'application/json');
    let queef = obj
    xhr.send(JSON.stringify(queef))
}

function xhrSuccess() { 
    console.log(this); 
    console.log(this.arguments.join()); 
    this.callback.apply(this, this.arguments); 
}
function xhrError() { 

    console.error(this.statusText); 
}
function loadFile(url, callback ) {
    var xhr = new XMLHttpRequest();
    console.dir(xhr)
    xhr.callback = callback;
    console.dir(arguments)
    console.log(Array.prototype.slice);
    console.log(Array.prototype.slice.call(arguments, 2));
    xhr.arguments = Array.prototype.slice.call(arguments, 2);
    xhr.onload = xhrSuccess;
    xhr.onerror = xhrError;
    xhr.open("GET", url, true);
    xhr.send(null);
}
function appenderBender(message) {
    console.log(JSON.parse(this.responseText));
    let response = JSON.parse(this.responseText)
    for (let i = 0; i < response.length ; i++){
            let div = document.createElement('div');
            let p = document.createElement('p');
            console.log(response[i])
            p.innerText = response[i].link
            p.setAttribute('data-id', response[i]._id )
            let pz = document.createElement('a');
            pz.innerText = response[i].title
            pz.href = response[i].title
            div.appendChild(p, pz)
            div.appendChild(pz)
            appendHere.appendChild(div)
    }
}

loadFile("/article", appenderBender, "HAhahahah doin it\n", "sux my");



