// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAD0XRfPLr6j99Y2fN-xGpsLv64A3LH1UA",
    authDomain: "theychat-c5af3.firebaseapp.com",
    databaseURL: "https://theychat-c5af3.firebaseio.com",
    projectId: "theychat-c5af3",
    storageBucket: "theychat-c5af3.appspot.com",
    messagingSenderId: "819495158021",
    appId: "1:819495158021:web:a7613798dd777f183af76c"
};
function updateScroll(){
    var element = document.getElementById("messages");
    element.scrollTop = element.scrollHeight;
}
firebase.initializeApp(firebaseConfig)

var db = firebase.firestore()

if (!localStorage.getItem('name')) {
    name = prompt('What is your name?')
    localStorage.setItem('name', name)
} else {
    name = localStorage.getItem('name')
}
document.querySelector('#name').innerText = name

document.querySelector('#change-name').addEventListener('click', () => {
    name = prompt('What is your name?')
    localStorage.setItem('name', name)
    document.querySelector('#name').innerText = name
})

document.querySelector('#message-form').addEventListener('submit', e => {
    e.preventDefault()

    let message = document.querySelector('#message-input').value
    db.collection('messages')
        .add({
            name: name,
            message: message,
            date: firebase.firestore.Timestamp.fromMillis(Date.now())
        })
        .then(docRef => {
            console.log(`Document written with ID: ${docRef.id}`)
            document.querySelector('#message-form').reset()
        })
        .catch(error => {
            console.log(`Error adding document: ${error}`)
        })
})

db.collection('messages')
    .orderBy('date', 'desc')
    .onSnapshot(snapshot => {
        document.querySelector('#messages').innerHTML = ''
        snapshot.forEach(doc => {
            let message = document.createElement('div')
            let identity = doc.data().name
            if (name == identity) {
                message.className = "d-flex justify-content-end mb-4";
                message.innerHTML = `
                                    <div class="msg_cotainer_send">
                                    ${doc.data().message}
                                    <span class="msg_time">${doc.data().name}</span>
                                    </div>`
            }
            else {
                message.className = "d-flex justify-content-start mb-4";
                message.innerHTML = `
                                        <div class="msg_cotainer">
                                        ${doc.data().message}
                                        <span class="msg_time">${doc.data().name}</span>
                                        </div>`
            }
            
		
		
            document.querySelector('#messages').prepend(message)
            updateScroll()
        })
    })

document.querySelector('#clear').addEventListener('click', () => {
    db.collection('messages')
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                db.collection('messages').doc(doc.id).delete()
                    .then(() => {
                        console.log('Document successfully deleted!')
                    })
                    .catch((error) => {
                        console.log(`Error removing document: ${error}`)
                    })
            })
        })
        .catch(error => {
            console.log(`Error getting documents: ${error}`)
        })
})