import createView from "../createView.js";
import {getHeaders} from "../auth.js";


const BASE_URI = 'http://localhost:8081/api/users';


export default function Requests(props){
    return `
    <!DOCTYPE html>
    <html lang="html">
        <head>
            <meta charset="UTF-8"/>
            <title>${props.user.username}</title>
        </head>
        <body>
            <div class="show-requests-${props.user.id} ">
               ${getNewFriendsRequests(props.user.id)}
            </div>
        </body>
    </html>`
}

export function showRequests(){

}

function getNewFriendsRequests(id){
    let  populateRequests = $(".show-requests-" + id)

    const requestObject = {
        method: "GET",
        headers: getHeaders()
    }

    fetch(`${BASE_URI}/request/${id}`, requestObject)
       .then(res =>{
          populateRequests.html( showFriendRequests(res));
           createView("/request", id)
       }).catch(e =>{
        console.log(e)
        createView("/request", id)
    })
}
function showFriendRequests(res) {
let html =`
<div>
    <div>
        <div>${props.profile.username}</div>
        <div>${props.profile.id}</div>
    </div>
</div>
`
    return html;
}