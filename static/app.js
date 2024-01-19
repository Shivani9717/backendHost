class Chatbox{
    constructor(){
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }
        this.state = false;
        this.messages = [];
    }
    display(){
        const {openButton,chatBox,sendButton} = this.args;
        openButton.addEventListener('click', () => this.toggleState(chatBox))
        sendButton.addEventListener('click', () => this.onSendButton(chatBox))
        const node = chatBox.querySelector('input');
        node.addEventListener("keydown", event => {
          if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            this.onSendButton(chatBox)
          }
        });
    }
    toggleState(chatbox){
        this.state = !this.state;

        // show or hides the box
        if(this.state){
            chatbox.classList.add('chatbox--active')
        }
        else{
            chatbox.classList.remove('chatbox--active')
        }
    }

onSendButton(chatbox){
    var textField = chatbox.querySelector('input');
    let text1 = textField.value
            if (text1 === "") {
                return;
    }
    let msg1 = { name: "User", message: text1 }
    // this time we got user input
//            console.log(msg1);
//            const userInputTime = new Date();
            this.messages.push(msg1);
             this.messages.push({ name: "loading", message: "Loading..."});
            this.updateChatText(chatbox);
            textField.value = ''
            fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                body: JSON.stringify({ message: text1 }),
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json'
                },
              })
              .then(r => r.json())
              .then(r => {
//              here we got bot output from backedn which we will further display ont he chatbot UI
//              const botOutputTime= new Date();
//                console.log(botOutputTime - userInputTime + "milliseconds")
                let msg2 = { name: "Sam", message: r.answer.content };
//                console.log(msg2)
                this.messages.pop()
                this.messages.push(msg2);
                this.updateChatText(chatbox)
                textField.value = ''

            }).catch((error) => {
                console.error('Error:', error);
                this.updateChatText(chatbox)
                textField.value = ''
              });
}

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sam")
            {
                html += '<div class="messages__item messages__item--visitor"><p>' + item.message + '</p></div>'
            }
            else if (item.name === "User")
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            } else {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
          });
          const chatmessage = chatbox.querySelector('.chatbox__messages');
          chatmessage.innerHTML = html;
    }
}


const chatbox = new Chatbox();
chatbox.display();
