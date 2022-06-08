import createView from "../createView.js";
import {getHeaders} from "../auth.js";
import {enableSearchIfLogged} from "./Home.js";


const BASE_URI = `${URI}/api/users`;


export default function Requests(props) {
    //language=html
    return `
        <!DOCTYPE html>
        <html lang="html">
        <head>
            <meta charset="UTF-8"/>
            <title>requests</title>
        </head>
        <body>
        <div class="container">
             <h1 class="friends-requests-header text-center">Friends Requests</h1>
            <div class="d-flex row justify-content-center friends-requests">
                ${showAllRequests(props)}
            </div>
        </div>

        </body>
        </html>`
}

export function showRequests() {
    addFriend()
    enableSearchIfLogged()
}

function showAllRequests(props) {
    let html = `
       ${props.request.map(m => `
         <div class="card request-card" style="width: 18rem;">
                    <div class="card-body ">
                    <div class="d-flex">
                            <img class="requesters-img rounded-circle"src="${m.sender.userProfilePictureUrl !== null ? m.sender.userProfilePictureUrl : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}"
                             alt="" style="height: 45px; width: 45px">
                        <div>
                            <h5 class="card-title request-username">${m.sender.username}</h5>
                         </div>
                    </div>     
                         <div class="d-flex justify-content-end">
                        <button href="#" class="btn-accept accept-friend" data-id="${m.sender.id}">accept</button>
                        <button href="#" class="btn-decline decline-friend">decline</button>
                        </div>
                    </div>
                </div>
       `).join("")}
       `
    return html;
}

function addFriend() {
    $(".accept-friend").click(function () {
        const id = $(this).data("id");

        const request = {
            method: "POST",
            headers: getHeaders(),
        }

        fetch(`${BASE_URI}/addfriend/${id}`, request)
            .then(res => {
                createView(`/request`)
            }).catch(error => {
            console.log(error);
            createView(`/request`);
        });

    })
}