import {pubnub, sendMsg, subscribeToChannel} from "../pubnubChat.js"
// import {isLoggedIn, userEmail} from "../auth.js";






let channel = 'hello_world'

export default function chatTest(props) {

    return `
    <h1>chat</h1>
    
    
    
    <div class="chat-box-container mx-auto row">
        <div class="contacts col-3">Withers56</div>
        <div class="chat col-8 p-0">
            <div class="feed m-1"></div>
            <div class="type-bar d-flex">
                <div class="bottom">
                    <div class="input-group">
                      <input type="text" class="form-control" name="msgField" id="msg" aria-label="Recipient's username" aria-describedby="button-addon2">
                      <button class="btn btn-outline-dark send-msg-btn" type="button" id="button-addon2" data-channel="${channel}">Send</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  
    <div class="chatBox">
    
    </div>

    `
}

export function chatTestEvents() {
    subscribeToChannel(channel)
    sendMsgBtn()
}

function sendMsgBtn() {
    $('.send-msg-btn').click(function (){
        let messageText = $('#msg').val()
        let channel = $(this).data("channel")

        console.log('ready to send: ' + messageText)

        sendMsg(messageText, channel)
    })
}

export function appendToChatbox(message){
    let feed = $('.feed')
    feed.html(feed.html() + `${message.publisher}: ${message.message.description}`)
}











