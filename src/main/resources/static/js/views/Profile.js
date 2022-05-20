import createView from "../createView.js";
import {getHeaders} from "../auth.js";

const BASE_URI = 'http://localhost:8081/api/users';

export default function Profile(props) {
    console.log(props)
    console.log(props.profile)

// language=HTML
    return `<!DOCTYPE html>
    <html lang="html">
    <head>
        <meta charset="UTF-8"/>
        <title>${props.profile.username}</title>
    </head>
    <body>
    <!--Filler for top white portion of page-->
    <section class="bg-white shadow">
        <div class="container">
            <section class="user-images mb-5">
                <!--Section: user images-->
                <div class="profile-header-photograph p-5 text-center bg-image rounded-bottom shadow"
                     style="background-image: url('${props.profile.userHeaderUrl}');height: 400px;">
                </div>
                <div class="d-flex justify-content-center">
                    <img class="shadow-profile-picture rounded-circle position-absolute"
                         src="${props.profile.userPhotoUrl}"
                         style="width: 168px; height: 168px; margin-top: -140px" alt="">
                </div>
            </section>

            <!--Section: User Data-->
            <section class="text-center border-bottom">
                <div class="row d-flex justify-content-center">
                    <div class="col-md-6">
                        <h2><strong>${props.profile.username}</strong></h2>
                        <p class="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                    </div>
                </div>
            </section>

            <!--Section: Buttons-->
            <section class="py-3 d-flex justify-content-between align-items-center mb-4">
                <!--Left Buttons-->
                <div class="">
                    <button type="button" class="btn btn-light profile-btn posts-button">Posts</button>
                    <button type="button" class="btn btn-light profile-btn about-button">About</button>
                    <button type="button" class="btn btn-light profile-btn friends-button">Friends <small
                            class="text-muted">100</small></button>
                    <button type="button" class="btn btn-light profile-btn">Photos</button>
                </div>
                <!--Right Buttons-->
                <div class="">
                    <button type="button" class="btn btn-light mr-2"><i
                            class="far fa-envelope mr-2"></i> Message
                    </button>
                    <button type="button" class="btn btn-light mr-2 add-friend-btn" data-id="${props.profile.id}">Add
                        Friends ${props.profile.id}<i
                                class="fas fa-plus ml-2"></i>
                    </button>
                </div>

            </section>
        </div>
    </section>
    <!-- Bottom gray portion of the page-->
    <section class="">

        <div class="container">
            <div class="row bottom-profile">
                <div class="col-5 mb-4 mb-md-0">
                    <!--Groups joined on users profile-->
                    ${showUsersGroups(props)}

                    <!--users friend's on users profile-->
                    ${showUsersFriends(props)}

                    <!--users photo's on users profile-->

                </div>

                <!--Posts start-->
                <div class="col-7 mb-4 mb-md-0">
                    ${showUsersPosts(props)}
                </div>
                <!--post end-->
            </div>

            <!-- show contents based on button pressed-->
            <div class="row posts-page">
                <div class="col">
                    ${showPostsOnly(props)}
                </div>
            </div>

            <div class="row about-page">
                <div class="col">
                    ${showAboutPageOnly(props)}
                </div>
            </div>

            <div class="row friends-page">
                <div class="col">
                    ${showFriendsOnly(props)}
                </div>
            </div>

            <!--end of showing contents when buttons pressed-->
        </div>
    </section>

    </body>
    </html>`;
}

export function showFriendsProfile() {
    postsButtonlistener();
    aboutButtonlistener();
    friendsButtonListener();
    addFriendButtonListener();
    showProfilePage();
    commentsButtonListener();
}

function showProfilePage() {
    $(".show-users-friends-profile").click(function () {
        const profileId = $(this).data("id");
        console.log(profileId)
        createView("/profile", `${profileId}`);
    });
}

function addFriendButtonListener() {
    $(".add-friend-btn").click(i => {
        const id = $(".add-friend-btn").data(`id`);
        console.log(id);

        const request = {
            method: "POST",
            headers: getHeaders(),
        }

        fetch(`${BASE_URI}/friends/${id}`, request)
            .then(res => {
                console.log(res.status);
                createView(`/profile`, id)
            }).catch(error => {
            console.log(error);
            createView(`/profile`, id);
        });
    });
}

function postsButtonlistener() {
    $(".posts-button").click(r => {
        $(".bottom-profile").css("display", "none")
        $(".friends-page").css("display", "none")
        $(".about-page").css("display", "none")
        $(".posts-page").css("display", "contents")
    });
}

function aboutButtonlistener() {
    $(".about-button").click(r => {
        $(".posts-page").css("display", "none")
        $(".bottom-profile").css("display", "none")
        $(".friends-page").css("display", "none")
        $(".about-page").css("display", "contents")
    });
}

function friendsButtonListener() {
    $(".friends-button").click(r => {
        $(".posts-page").css("display", "none")
        $(".about-page").css("display", "none")
        $(".bottom-profile").css("display", "none")
        $(".friends-page").css("display", "contents")
    });
}

function commentsButtonListener(){
    $(".comments-link").click(r=>{
        $(".comments-show").css("display","block")
    })
}

function showUsersGroups(props) {
    //language=HTML
    let html = `
        <div class="card groups-card shadow-light mb-4">
            <div class="card-title"><strong>Groups</strong></div>
            <div class="card-body">
                <div class="d-flex flex-wrap flex-row">
                    ${props.profile.groupsJoined.map(groups => `
                       <div class="col-4 d-flex mb-3 justify-content-center">
                            <div class="justify-content-center">
                               <img src="${groups.groupPhotoUrl}"
                                    alt="image 1" class="rounded-circle"
                                    style="width: 90px;height: 90px;">
                               <p class="text-center">${groups.name}</p>
                            </div>
                       </div>`).join("")}
                </div>
            </div>
        </div>`
    return html;
}

function showUsersFriends(props) {
    //language=HTML
    let html = `
        <div class="card friends-card shadow-light">
            <div class="card-title"><strong>Friends</strong></div>
            <div class="card-body">
                <div class="d-flex flex-wrap flex-row">
                    ${props.profile.friends.map(friends => `
                    <div class="col-4 d-flex mb-3 justify-content-center">
                         <div class="justify-content-center">
                         <div>
                            <img src="${friends.userPhotoUrl}"
                                 alt="image 1" class="rounded-circle"
                                 style="width: 90px;height: 90px;">
                                 </div>
                                 <div>
                            <a class="text-center show-users-friends-profile" data-id="${friends.id}">${friends.username}</a>
                            </div>
                         </div>
                    </div>`).join("")}
                </div>
            </div>
        </div>
    `
    return html;
}


function showUsersPosts(props) {
    //language=HTML
    let html = `
        ${props.profile.posts.map(post => ` 
        <div class="card posts-card shadow-light mb-4">
        <!--head for card-->
        <div class="profile-card-header d-flex">
            <img src="${props.profile.userPhotoUrl}"
                 alt="lightbox image 1" class="rounded-circle"
                 style="width: 45px;height: 45px;">
            <a class="go-to-profile-top" href="#">
                <strong>${props.profile.username}</strong>
            </a>
            <p class="text-muted minutes-ago"><small>20min ago</small></p>
            <a class="edit-post-button" data-id="${post.id}"><i class="fas fa-ellipsis-h"></i></a>
        </div>
        <!--body of card-->
       
        <div class="card-body">
            <p class="card-text">${post.content}</p>
               
            <input class="comment-users-posts w-100 mt-1" placeholder="Write a comment....">
            <div class="d-flex justify-content-end mt-1">
            <div class="" id="${post.id}-container">
                 <button class="comments-link" data-bs-toggle="collapse" data-bs-target="#post-${post.id}" aria-controls="post-${post.id}"><small>comments</small></button>
            </div>
            </div>
            <div class="collapse" id="post-${post.id}">
            <div class="comments-show">
                ${displayComments(post)}
            </div>
            </div>
     
     
    </div>
</div>`).join("")}`

    return html;
}

function displayComments(props) {
    //language=HTML
    let html = `
        ${props.comments.map(posts => `
            <div class="card card-body p-2 mb-1">
                <div class="d-flex">
                   <div class="info d-flex">
                         <img src="${posts.author.userPhotoUrl}" alt="lightbox image 1" class="rounded-circle" style="width: 45px;height: 45px;">
                        <div class="name">
                        <div class="username">${posts.author.username}</div>
                        <div class="content">${posts.content}</div>
                        </div>
                   </div>
                </div>
            </div>`
        ).join("")}`
    return html;
}

function showPostsOnly(props) {
    let html = `
        ${props.profile.posts.map(post => ` 
        <div class="card posts-card shadow-light mb-4">
        <!--head for card-->
        <div class="profile-card-header d-flex">
            <img src="${props.profile.userPhotoUrl}"
                 alt="lightbox image 1" class="rounded-circle"
                 style="width: 45px;height: 45px;">
            <a class="go-to-profile-top" href="#">
                <strong>${props.profile.username}</strong>
            </a>
            <p class="text-muted minutes-ago"><small>20min ago</small></p>
            <a class="edit-post-button" data-id="${post.id}"><i class="fas fa-ellipsis-h"></i></a>
        </div>
        <!--body of card-->
        <div class="card-body">
            <p class="card-text">${post.content}</p>
            <input class="comment-users-posts w-100" placeholder="Write a comment....">
            
        </div>
    </div>`).join("")}`

    return html;

}

function showAboutPageOnly(props) {
    //language=HTML
    let html = `
        <div class="card about-card shadow-light">
        </div>
    `
    return html;
}

function showFriendsOnly(props) {
    //language=HTML
    let html = `
        <div class="card friends-card shadow-light">
            <div class="card-title"><strong>Friends</strong></div>
            <div class="card-body">
                <div class="d-flex flex-wrap flex-row">
                    ${props.profile.friends.map(friends => `
                    <div class="col-4 d-flex mb-3 justify-content-center">
                         <div class="justify-content-center">
                            <img src="${friends.userPhotoUrl}"
                                 alt="image 1" class="rounded-circle"
                                 style="width: 90px;height: 90px;">
                            <p class="text-center">${friends.username}</p>
                         </div>
                    </div>`).join("")}
                </div>
            </div>
        </div>
    `
    return html;
}