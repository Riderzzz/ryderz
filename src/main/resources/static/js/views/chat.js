import {sendMsg, subscribeToChannel, setUUID, fetchOldMessages} from "../pubnubChat.js"
// import {pubnub} from "../auth.js";
// import {userEmail} from "../auth.js";
// import {isLoggedIn, userEmail} from "../auth.js";






let channel = 'app-test-1'

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
    setUUID()
    subscribeToChannel(channel)
    fetchOldMessages(channel)
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
    setFeedToBottom()
    feed.html(feed.html() + `
        <div class="card">
          <div class="card-body">
            ${message.publisher}: ${message.message.description}
          </div>
        </div>
    `)
    feed.scrollTop(feed[0].scrollHeight)
}

export function appendOldMessagesToChatBox(messageArray) {

    if (messageArray.channels == null) {
        return
    }

    let feed = $('.feed')
    let messages = messageArray.channels[Object.keys(messageArray.channels)[0]]

    for (const msg of messages) {
        console.log(`${msg.uuid}: ${msg.message.description}`)
        feed.html(feed.html() + `
        <div class="card">
          <div class="card-body">
            ${msg.uuid}: ${msg.message.description}
          </div>
        </div>
        `)
        feed.scrollTop(feed[0].scrollHeight)
    }
    setFeedToBottom()
}

function setFeedToBottom() {
    let feed = $('.feed')

    let isScrolledToBottom = feed.scrollHeight - feed.clientHeight <= feed.scrollTop + 1;

    if(!isScrolledToBottom)
        feed.scrollTop = feed.scrollHeight - feed.clientHeight;
}












