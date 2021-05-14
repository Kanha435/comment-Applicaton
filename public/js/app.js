const socket = io();
let username = "";
do{
    username =  prompt("Enter your name :");
}while(!username);


var textarea = document.getElementById("inputComment");
var submitBtn = document.getElementById("postBtn");
var commentBox = document.getElementById("commentBox");
let typingDiv = document.getElementById("typing");
// click on post button 
submitBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    let comment = textarea.value;
    if(!comment){
        return
    }

    postComment(comment);
    textarea.value = "";
})

// we would have post the commemt 
function postComment(comment){
    // append the comment in the dom
    let data = {
        username:username,
        comment : comment
    }

    appendDOM(data);
    broadcastData(data);
    sendToDatabase(data);

}
function appendDOM(data){
    let listTag = document.createElement('li');
    listTag.classList.add('comment','card','mt-2');
    let commentDiv = `
            <div class="card-body">
                <h6>${data.username}</h6>
                <p>${data.comment}</p>
                <img src="https://cdn1.iconfinder.com/data/icons/material-design-icons-light/24/clock-128.png" alt="" style="width: 15px;"><small>${moment(data.createdAt).format('LT')}</small>
            </div>  
        `;

    listTag.innerHTML = commentDiv;
    commentBox.prepend(listTag);
    // socket.emit('message' , data);

}

function broadcastData(data){
    socket.emit('comment',data);
}
socket.on('comment' ,(data)=>{
    appendDOM(data);
});

// debounce functionallity
let timeId = null;
function debounce(func , timer){
    if(timeId){
        clearTimeout(timeId);
    }
    timeId = setTimeout(()=>{
        func();
    },timer);
}

socket.on('typing',(data)=>{
    typingDiv.innerText = `${data.username} is typing......`;
    debounce(function(){
        typingDiv.innerText = "";
    }, 1000)
})


// send to data to database
function sendToDatabase(data){
        fetch("/comment/apis",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        })
        .then(res =>res.json())
        .then((data)=>{
            // console.log(data);
      })    
} 

const fetchComment = ()=>{
    fetch('/comment/apis')
    .then(res=> res.json())
    .then(data=>{
        data.forEach(element => {
            console.log(element)
            appendDOM(element);
        });  
    })
}

// event lishener on textarea 
textarea.addEventListener('keyup',(e)=>{
    socket.emit('typing',{username});
})

window.onload = fetchComment;