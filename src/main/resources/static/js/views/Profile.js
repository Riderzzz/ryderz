import createView from "../createView.js";
import {getHeaders, userEmail} from "../auth.js";
import {enableSearchIfLogged} from "./Home.js";

const BASE_URI = `${URI}/api/users`;
const COMMENT_URI = `${URI}/api/comments`;
const POST_URI = `${URI}/api/posts`;

export default function Profile(props) {
// language=HTML
    return `<!DOCTYPE html>
    <html lang="html">
    <head>
        <meta charset="UTF-8"/>
        <title>${props.profile.username}</title>
    </head>
    <body>
    <!--Filler for top white portion of page-->
    <section class="user-profile-top shadow-light">
        <div class="container">

            <section class="user-images mb-5">
                <!--Section: user images-->
                <div class="profile-header-photograph p-5 text-center bg-image rounded-bottom shadow"
                     style="background-image: url('${props.profile.userHeaderUrl}');height: 400px;">
                </div>

                <div class="d-flex justify-content-center">
                    <img class="shadow-profile-picture rounded-circle position-absolute"
                         src="${props.profile.userPhotoUrl  !== null ? props.profile.userPhotoUrl: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}"
                         style="width: 168px; height: 168px; margin-top: -140px" alt="">
                </div>
            </section>

            <!--Section: User Data-->
            <section class="text-center border-bottom-profile">
                <div class="row d-flex justify-content-center">
                    <div class="col-md-6">
                        <a class="back-to-home" data-id="${props.profile.id}"><strong>${props.profile.username}</strong></a>
                        <p class="bio-text">${props.profile.bio}</p>
                    </div>
                </div>
            </section>

            <!--Section: Buttons-->
            <section class="py-3 d-flex justify-content-between align-items-center mb-4">
                <!--Left Buttons-->
                <div class="">
                    <button type="button" class="btn btn-lightG-2 profile-btn posts-button">Posts</button>
                    <button type="button" class="btn btn-lightG-2 profile-btn about-button">About</button>
                    <button type="button" class="btn btn-lightG-2 profile-btn friends-button">Friends <small
                            class="text-muted">${props.profile.friends.length}</small></button>
                </div>
                <!--Right Buttons-->
                <div class="">
                    ${addOrRemoveFriends(props)}
                </div>
            </section>

        </div>
    </section>
    <!-- Bottom gray portion of the page-->
    <section class="">
        <div class="container">
           
            <div class="row bottom-profile">

                <div class="col-12 mb-4 mb-md-0 col-md-5">
                    <!--Groups joined on users profile-->
                    <div>
                    ${showUsersGroups(props)}
                    </div>
                    <!--users friend's on users profile-->
                    <div>
                    ${showUsersFriends(props)}
                    </div>
                    <!--users photo's on users profile-->
                </div>
                <!--Posts start-->
                <div class="col-12 mb-4 mb-md-0 post-refresh col-md-7">
                    ${showUsersPosts(props)}
                </div>

            </div>

            <!-- show contents based on button pressed-->

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
    <div>
        
    </div>

    </body>
    </html>`;
}


export function showFriendsProfile() {
    postsButtonlistener();
    aboutButtonlistener();
    friendsButtonListener();
    addFriendButtonListener();
    removeFriendButtonListener();
    cancelFriendButtonListener();
    showProfilePage();
    commentsButtonListener();
    commentFromUserProfile();
    showGroupPage();
    aboutMeEditButtonListener();
    goBackToHome();
    editPostFromProfile();
    editPostButtonListener();
    enableSearchIfLogged()
    goToSettings();
    deletePostButtonListener();
    deleteCommentOnPost();
    editProfileButtonListener();
}

function goBackToHome(){
    $(".back-to-home").click(function (){
        $(".bottom-profile").css("display", "flex")
        $(".friends-page").css("display", "none")
        $(".about-page").css("display", "none")
        $(".posts-button").removeClass("when-active")
        $(".about-button").removeClass("when-active")
        $(".friends-button").removeClass("when-active")
    })
}


function showProfilePage() {
    $(".show-users-friends-profile").click(function () {
        const profileId = $(this).data("id");
        createView("/profile", `${profileId}`);
    });
}

function showGroupPage() {
    $(".show-users-group-profile").click(function () {
        const groupId = $(this).data("id");
        createView("/group", `${groupId}`);
    });
}

function addFriendButtonListener() {
    $(".add-friend-btn").click(i => {
        const id = $(".add-friend-btn").data(`id`);

        const request = {
            method: "POST",
            headers: getHeaders(),
        }

        fetch(`${BASE_URI}/friends/${id}`, request)
            .then(res => {
                createView(`/profile`, id)
            }).catch(error => {
            createView(`/profile`, id);
        });
    });
}

function removeFriendButtonListener() {
    $(".remove-friend-btn").click(i => {
        const id = $(".remove-friend-btn").data(`id`);

        const request = {
            method: "DELETE",
            headers: getHeaders(),
        }

        fetch(`${BASE_URI}/friends/${id}`, request)
            .then(res => {
                createView(`/profile`, id)
            }).catch(error => {
            createView(`/profile`, id);
        });
    });
}

function cancelFriendButtonListener() {
    $(".cancel-friend-btn").click(i => {
        const id = $(".cancel-friend-btn").data(`id`);

        const request = {
            method: "DELETE",
            headers: getHeaders(),
        }

        fetch(`${BASE_URI}/friendRequest/${id}`, request)
            .then(res => {
                createView(`/profile`, id)
            }).catch(error => {
            createView(`/profile`, id);
        });
    });
}

function postsButtonlistener() {
    $(".posts-button").click(r => {
        $(".bottom-profile").css("display", "flex")
        $(".friends-page").css("display", "none")
        $(".about-page").css("display", "none")
        $(".posts-button").addClass("when-active")
        $(".about-button").removeClass("when-active")
        $(".friends-button").removeClass("when-active")
    });
}

function aboutButtonlistener() {
    $(".about-button").click(r => {
        $(".bottom-profile").css("display", "none")
        $(".friends-page").css("display", "none")
        $(".about-page").css("display", "contents")
        $(".posts-button").removeClass("when-active")
        $(".about-button").addClass("when-active")
        $(".friends-button").removeClass("when-active")
    });
}

function friendsButtonListener() {
    $(".friends-button").click(r => {
        $(".about-page").css("display", "none")
        $(".bottom-profile").css("display", "none")
        $(".friends-page").css("display", "contents")
        $(".posts-button").removeClass("when-active")
        $(".about-button").removeClass("when-active")
        $(".friends-button").addClass("when-active")
    });
}

function commentsButtonListener() {
    $(".comments-link").click(r => {
        $(".comments-show").css("display", "block")
    })
}

function commentFromUserProfile() {
    $(".submit-comment").click(function () {
        let id = $(this).data("id");
        let content = $(".comment-users-" + id).val();
        let userId = $(".submit-comment").data("user")
        $(".comment-users-" + id).val("");

        const comment = {
            content,
            post: {
                id: id
            }
        }

        const requestObj = {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(comment)
        }

        fetch(COMMENT_URI, requestObj)
            .then(function () {
                editPostButtonListener();
                editPostFromProfile();
                refreshPosts(userId);
                refreshComments(id);
            }).catch(error => {
            console.log(error);
        });

    })
}

function refreshComments(id) {
    let userId = $(".comments-" + id + "-show").data("id");
    let commentSection = $(".comments-" + id + "-show");

    const requestObject = {
        method: "GET",
        headers: getHeaders()
    }

    fetch(`${BASE_URI}/${userId}`, requestObject)
        .then(res => res.json()).then(data => {
        let state = {};

        data.posts.forEach(post => {
            if (id === post.id) {
                state = post;
            }
        });
        commentSection.html(displayComments(state));
    }).catch(error => {
        console.log(error);
    })
}


function showUsersGroups(props) {
    //language=HTML
    let html = `
        <div class="card card-profile groups-card shadow mb-4">
            <div class="card-title card-title-profile" style="margin-left: 10px"><strong>Groups</strong></div>
            <div class="card-body card-body-profile">
                <div class="d-flex flex-wrap flex-row">
                    ${props.profile.groupsJoined.map(groups => `
                        <div class="col-4 d-flex mb-3 justify-content-center">
                            <div class="justify-content-center">
                                <div class="group-img-profile">
                                    <img src="${groups.groupPhotoUrl !== null ? groups.groupPhotoUrl: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}"
                                        alt="image 1" class="rounded-circle"
                                        style="width: 90px;height: 90px;">
                                </div>
                                <div class="text-center">
                                    <a class="show-users-group-profile" 
                                          data-id="${groups.id}">${groups.name}</a>
                                </div>
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
        <div class="card card-profile friends-card shadow">
            <div class="card-title card-title-profile" style="margin-left: 10px"><strong>Friends</strong></div>
            <div class="card-body card-body-profile">
                <div class="d-flex flex-wrap flex-row">
                    ${props.profile.friends.map(friends => `
                        <div class="col-4 d-flex mb-3 justify-content-center">
                            <div class="justify-content-center">
                                <div>
                                    <img src="${friends.userPhotoUrl !== null ? friends.userPhotoUrl: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}"
                                        alt="image 1" class="rounded-circle"
                                         style="width: 90px;height: 90px;">
                                </div>
                                <div class="text-center">
                                   <a class="show-users-friends-profile" 
                                        data-id="${friends.id}">${friends.username}</a>
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
        ${props.profile.posts.reverse().map(post => ` 
            <div class="card card-profile posts-card shadow mb-4 posts-card-${post.id}" data-id="${post.id}">
            <!--head for card-->
                <div class="profile-card-header d-flex">
                    <img src="${props.profile.userPhotoUrl  !== null ? props.profile.userPhotoUrl: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}"
                         alt="lightbox image 1" class="rounded-circle"
                         style="width: 45px;height: 45px;">
                    <a class="go-to-profile-top" href="#">
                        <strong>${props.profile.username}</strong>
                    </a>
                    <p class="text-muted minutes-ago"><small>${new Date(post.createDate).toLocaleString()}</small></p>
                    ${showEditIfValidUser(post, props)}
                </div>
                  
            <!--body of card-->
                <div class="card-body card-body-profile">
                    <p class="card-text card-text-profile post-content-${post.id}" data-content="${post.content}">${post.content}</p>
                    <input class="comment-users-${post.id} comment-users-posts mt-1" placeholder="Write a comment...." data-id="${post.id}">
                    <button type="submit" class="submit-comment btn-lightG" data-id="${post.id}" data-user="${props.profile.id}">Comment</button>
                    
                    <div class="d-flex justify-content-end mt-1">
                        <div class="display-comments" id="${post.id}-container">
                           ${displayCommentsButton(post)}
                        </div>
                    </div>
                    
                    <div class="collapse" id="post-${post.id}">
                        <div class="comments-${post.id}-show comments-section" data-id="${props.profile.id}" data-post="${post.id}">
                            ${displayComments(post)}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal for edit post button-->
`).join("")}
<!--        Modal for editing  posts-->
        <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
            <div class="modal-dialog  modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editModalLabel">Edit Post</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <input style="width: 100%;height: 100%"  class="edit-post">
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn delete-post-btn" data-bs-dismiss="modal" data-user="${props.profile.id}">Delete Post</button>
                        <button type="button" class="btn btn-lightG save-post-edit" data-bs-dismiss="modal" data-user="${props.profile.id}">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- modal for deleting comments on post-->
        <div class="modal" id="deleteComments" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Delete Comment</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to delete your post? It will be permanently deleted.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-lightG confirm-delete-comment" data-bs-dismiss="modal" data-id="${props.profile.id}">Delete Post</button>
                    </div>
                </div>
            </div>
        </div>`

    return html;
}

function refreshPosts(userId){
    let postSection = $(".post-refresh");

    const requestObject = {
        method: "GET",
        headers: getHeaders()
    }

    fetch(`${BASE_URI}/${userId}`, requestObject)
        .then(res => res.json()).then(data => {

        let state = {
            profile: data
        };
        postSection.html(showUsersPosts(state));
        commentFromUserProfile();
        deleteCommentOnPost();
        editPostButtonListener();
        editPostFromProfile();
    }).catch(error => {
        console.log(error);
    })
}

function deletePostButtonListener(){
    $(".delete-post-btn").click(function (){
        let postId = $(this).data("id")
        let userId = $(this).data("user")
        const requestObject = {
            method: "DELETE",
            headers: getHeaders()
        }

        fetch(`${POST_URI}/${postId}`, requestObject)
            .then(data =>{
                refreshPosts(userId)
                console.log(data)
                }
            ).catch(e => {
            console.log(e)
        })

    })
}

function showEditIfValidUser(post ,props){
    if(props.profile.email === userEmail()){
        let html =
            `
        <a class="edit-post-button" data-id="${post.id}"  data-bs-toggle="modal" data-bs-target="#editModal"><i class="fas fa-ellipsis-h"></i></a>`
        return html;
    }
    return "";
}

function editPostButtonListener(){
    $(".save-post-edit").click(function (){
        let postId = $(this).data("id")
        let content = $(".edit-post").val();
        let userId = $(this).data("user")

        const requestObject = {
            method: "PUT",
            headers: getHeaders(),
            body: content
        }

        fetch(`${POST_URI}/profile/${postId}`, requestObject)
            .then(data =>{
                refreshPosts(userId)
                console.log(data)
                }
            ).catch(e => {
            console.log(e)
        })
    })
}

function editPostFromProfile(){
    $(".edit-post-button").click(function (){
        let id = $(this).data("id")
        let content = $(".post-content-" + id).data("content")

        $(".delete-post-btn").attr('data-id' , `${id}`)
        $(".save-post-edit").attr('data-id', `${id}`)
        $(".edit-post").val(content)
    })
}

function displayCommentsButton(post){
    if(post.comments.length !== 0){
        let html =`
        <button class="comments-link btn-lightG-2" data-bs-toggle="collapse" data-bs-target="#post-${post.id}" aria-controls="post-${post.id}"><small>comments</small></button>
        `
        return html;
    }
    return "";
}

function displayComments(props) {
    //language=HTML
    let html = `
        ${props.comments.reverse().map(posts => `
            <div class="card card-profile card-body card-body-profile p-2 mb-2">
                <div class="d-flex justify-content-between">
                   <div class="info d-flex">
                        <img src="${posts.author.userPhotoUrl  !== null ? posts.author.userPhotoUrl: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}" alt="lightbox image 1" class="rounded-circle" style="width: 45px;height: 45px;">
                        <div class="name">
                            <div class="username">${posts.author.username}</div>
                            <div class="content-within-comments">${posts.content}</div>
                        </div>
                   </div>
                        <div class="justify-content-end">
                                ${verifyUsersDeleteButton(posts)}
                        </div>
                </div>
            </div>`
    ).join("")}`
    return html;
}


function verifyUsersDeleteButton(props){
    if(props.author.email === userEmail()){
        let html =`
               <button type="button" class="btn delete-link" data-bs-toggle="modal" data-bs-target="#deleteComments" data-id="${props.id}">
                   delete
              </button>`
        return html;
    }
    return "";
}

function deleteCommentOnPost(){
    $(".confirm-delete-comment").click(function (){
            let commentId = $(".delete-link").data("id")
            let userId = $(".confirm-delete-comment").data("id")

            let requestObject = {
                method: "DELETE",
                headers: getHeaders()
            }

            fetch(`${COMMENT_URI}/${commentId}`, requestObject)
                .then( data =>{
                    editPostFromProfile();
                    refreshPosts(userId)
                    console.log(data)
                })
    })
}

function verifyUsersAboutProfile(props){
    if(props.profile.email === userEmail()){
        let html = `
        <button type="button" class="btn btn-lightG-2" data-bs-toggle="modal" data-bs-target="#aboutModal">
                    Edit about me
          </button>
        `
        return html;
    }
    return  "";
}

function showAboutPageOnly(props) {
    //language=HTML
    let html = `
        <div class="card  card-profile shadow" style="width: 100%">
            <div class="card-body card-body-profile">
                <h5 class="card-title card-title-profile mb-2">About Me</h5>
                <h6 class="card-subtitle  card-subtitle-profile mb-2 text-muted">${props.profile.username}</h6>
                    <div class="about-${props.profile.id}-show" data-id="${props.profile.id}">
                        <p class="card-text card-text-profile">${aboutMe(props)}</p>
                    </div>
                    ${verifyUsersAboutProfile(props)}
            </div>
        </div>

        <div class="modal fade" id="aboutModal" tabindex="-1" aria-labelledby="aboutModalLabel" aria-hidden="true">
            <div class="modal-dialog  modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Edit About Me</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <textarea style="width: 100%;height: 100%" maxlength="500" placeholder="Write About Yourself...." class="edit-bio"></textarea>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel Changes</button>
                        <button type="button" class="btn btn-lightG save-about-edit" data-bs-dismiss="modal" data-id="${props.profile.id}">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    `
    return html;
}

function aboutMeEditButtonListener(){
    $(".save-about-edit").click(function (){
        let id = $(this).data("id");
        let newBio = $(".edit-bio").val();

        const requestObj = {
            method: "POST",
            headers: getHeaders(),
            body: newBio
        }

        fetch(`${BASE_URI}/updateUsersBio/${id}`, requestObj)
            .then(data => {
                refreshAboutMe(id)
            }).catch(error => {
            console.log(error);
        });

    })
}

function refreshAboutMe(id) {
    let userId = $(".about-" + id + "-show").data("id");
    let aboutMeSection = $(".about-" + id + "-show");

    const requestObject = {
        method: "GET",
        headers: getHeaders()
    }

    fetch(`${BASE_URI}/${userId}`, requestObject)
        .then(res => res.json()).then(data => {
        let state = {profile: data}
        aboutMeSection.html(aboutMe(state));
    }).catch(error => {
        console.log(error);
    })
}

function aboutMe(props){
    let bioText = props.profile.bio;

    return bioText;
}

function showFriendsOnly(props) {
    //language=HTML
    let html = `
        <div class="card card-profile friends-card shadow-light">
            <div class="card-title card-title-profile"><strong>Friends</strong></div>
            <div class="card-body card-body-profile">
                <div class="d-flex flex-wrap flex-row">
                    ${props.profile.friends.map(friends => `
                    <div class="col-4 d-flex mb-3 justify-content-center">
                         <div class="justify-content-center">
                            <img src="${friends.userPhotoUrl !== null ? friends.userPhotoUrl: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}"
                                alt="image 1" class="rounded-circle"
                                style="width: 90px;height: 90px;">
                            <a class="text-center show-users-friends-profile" 
                                data-id="${friends.id}">${friends.username}</a>
                         </div>
                    </div>`).join("")}
                </div>
            </div>
        </div>
    `
    return html;
}

function addOrRemoveFriends(props) {

    for (let i = 0; i < props.profile.friendsRequest.length; i++){
        if (props.profile.friendsRequest[i].sender.email === userEmail()) {
            let html = `
                <button type="button" 
                            class="btn btn-lightG mr-2 cancel-friend-btn" 
                            data-id="${props.profile.id}">Cancel Request
                        <i class="fas fa-plus ml-2"></i>
                    </button>`
            return html
        }
    }

    for (let i = 0; i < props.profile.friends.length; i++) {
        if (props.profile.friends[i].email === userEmail()) {
            let html = `
                <button type="button" 
                            class="btn btn-lightG-2 mr-2 remove-friend-btn" 
                            data-id="${props.profile.id}">Remove Friend 
                        <i class="fas fa-plus ml-2"></i>
                    </button>`
            return html
        }
    }

    if(props.profile.email !== userEmail()){
        let html = `
                <button type="button" 
                            class="btn btn-lightG-2 mr-2 add-friend-btn" 
                            data-id="${props.profile.id}">Add Friend
                        <i class="fas fa-plus ml-2"></i>
                    </button>`
        return html
    } else if (props.profile.email === userEmail()){
        let html = `
        <a type="button" 
                   class="btn btn-lightG-2 mr-2 edit-profile-btn">Edit Profile
               <i class="fas fa-plus ml-2"></i>
        </a>`
        return html
    }

}

function editProfileButtonListener(){
    $(".edit-profile-btn").click(function (){
        createView("/user")
    })
}


function goToSettings(){
    $(".edit-profile-btn").click(function (){
        createView("/user")
    })
}
