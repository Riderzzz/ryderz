import createView from "../createView.js";

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
                     style="background-image: url('${props.profile.userPhotoUrl}');height: 400px;">
                </div>
                <div class="d-flex justify-content-center">
                    <img class="shadow-profile-picture rounded-circle position-absolute"
                         style="background-image: url('${props.profile.userPhotoUrl}'); width: 168px; height: 168px; margin-top: -140px">
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
                    <button type="button" class="btn btn-light profile-btn">Posts</button>
                    <button type="button" class="btn btn-light profile-btn">About</button>
                    <button type="button" class="btn btn-light profile-btn">Friends <small
                            class="text-muted">100</small></button>
                    <button type="button" class="btn btn-light profile-btn">Photos</button>

                    <div class="dropdown d-inline-block">
                        <button class="btn btn-light  dropdown-toggle" type="button" id="dropdownMenuButton"
                                data-mdb-toggle="dropdown"
                                aria-expanded="false">
                            More
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li><a class="dropdown-item" href="#">Action</a></li>
                            <li><a class="dropdown-item" href="#">Another action</a></li>
                            <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                    </div>
                </div>
                <!--Right Buttons-->
                <div class="">
                    <button type="button" class="btn btn-light mr-2"><i
                            class="far fa-envelope mr-2"></i> Message
                    </button>
                    <button type="button" class="btn btn-light mr-2">Add Friend <i
                            class="fas fa-plus ml-2"></i>
                    </button>
                </div>
            </section>
        </div>
    </section>
    <!-- Bottom gray portion of the page-->
    <section class="">
        <div class="container">
            <div class="row">
                <div class="col-5 mb-4 mb-md-0">

                    <!--Groups joined on users profile-->
                    <div class="card  mb-4 shadow-light">
                        <div class="card-body">
                            <div class="card-title"><strong>Groups</strong></div>
                            <div>
                                <div class="row d-flex">
                                    <div class="col-4 d-flex mb-3 justify-content-center">
                                        <img src="https://ehlinelaw.com/img/uploads/Leathernecks-MC-MCLI-Group-Riding.jpg"
                                             alt="image 1" class="rounded-circle"
                                             style="width: 90px;height: 90px;">
                                    </div>
                                    <div class="col-4 d-flex mb-3 justify-content-center">
                                        <img src="https://ehlinelaw.com/img/uploads/Leathernecks-MC-MCLI-Group-Riding.jpg"
                                             alt="lightbox image 1" class="rounded-circle"
                                             style="width: 90px;height: 90px;">
                                    </div>
                                    <div class="col-4 d-flex mb-3 justify-content-center">
                                        <img src="https://ehlinelaw.com/img/uploads/Leathernecks-MC-MCLI-Group-Riding.jpg"
                                             alt="lightbox image 1" class="rounded-circle"
                                             style="width: 90px;height: 90px;">
                                    </div>
                                    <div class="col-4 d-flex mb-3 justify-content-center">
                                        <img src="https://ehlinelaw.com/img/uploads/Leathernecks-MC-MCLI-Group-Riding.jpg"
                                             alt="lightbox image 1" class="rounded-circle"
                                             style="width: 90px;height: 90px;">
                                    </div>
                                    <div class="col-4 d-flex mb-3 justify-content-center">
                                        <img src="https://ehlinelaw.com/img/uploads/Leathernecks-MC-MCLI-Group-Riding.jpg"
                                             alt="lightbox image 1" class="rounded-circle"
                                             style="width: 90px;height: 90px;">
                                    </div>
                                    <div class="col-4 d-flex mb-3 justify-content-center">
                                        <img src="https://ehlinelaw.com/img/uploads/Leathernecks-MC-MCLI-Group-Riding.jpg"
                                             alt="lightbox image 1" class="rounded-circle"
                                             style="width: 90px;height: 90px;">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--end of groups-->
                    <!--users friend's on users profile-->
                    <div class="card shadow-light">
                        ${props.profile.friends.map(friends => `
                        <div class="card-body">
                            <div class="card-title"><strong>Friends</strong></div>
                            <div>
                                <div class="row d-flex">
                                    <div class="col-4 d-flex mb-3 justify-content-center">
                                         <div class="justify-content-center">
                                            <img src="${friends.userPhotoUrl}"
                                                 alt="image 1" class="rounded-circle"
                                                 style="width: 90px;height: 90px;">
                                            <p class="text-center">${friends.username}</p>
                                         </div>
                                    </div>
                                </div>
                            </div>
                        </div>`)}

                    </div>
                    <!--Friends End-->
                </div>
                <!--Posts start-->
                <div class="col-7 mb-4 mb-md-0">
                    <!--cards for posts-->
                    ${props.profile.posts.map(post => ` 
                        <div class="card shadow-light mb-4">
                        <!--head for card-->
                        <div class="profile-card-header d-flex">
                            <img src="https://ehlinelaw.com/img/uploads/Leathernecks-MC-MCLI-Group-Riding.jpg"
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
                    </div>`)}

                </div>
                <!--post end-->
            </div>
    </section>

    </body>
    </html>`;
}

export function showFriendsProfile() {

}

