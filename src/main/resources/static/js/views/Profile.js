import createView from "../createView.js";

export default function Profile(props) {
    console.log(props)
// language=HTML
    return `<!DOCTYPE html>
    <html lang="html">
    <head>
        <meta charset="UTF-8"/>
        <title>${props.profile.username}</title>
    </head>
    <body>
    <section class="bg-white shadow">
        <div class="container">
            <section class="user-images mb-5">
                <!--Section: user images-->
                <div class="profile-header-photograph p-5 text-center bg-image rounded-bottom shadow"
                     style="background-image: url('https://mdbcdn.b-cdn.net/img/new/slides/041.webp');height: 400px;">
                </div>
                <div class="d-flex justify-content-center">
                    <img alt="temp" src="https://thumbs.dreamstime.com/b/biker-27757798.jpg"
                         class="shadow-profile-picture rounded-circle position-absolute"
                         style="width: 168px; height: 168px; margin-top: -140px">
                </div>
            </section>

            <!--Section: User Data-->
            <section class="text-center border-bottom">
                <div class="row d-flex justify-content-center">
                    <div class="col-md-6">
                        <h2><strong>William Withers</strong></h2>

                        <p class="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                    </div>
                </div>
            </section>

            <!--Section: Buttons-->
            <section class="py-3 d-flex justify-content-between">
                <!--Left Buttons-->
                <div class="">
                    <button type="button" class="btn btn-light active profile-btn">Posts</button>
                    <button type="button" class="btn btn-light profile-btn">About</button>
                    <button type="button" class="btn btn-light profile-btn">Friends <small
                            class="text-muted">100</small></button>
                    <button type="button" class="btn btn-light profile-btn">Photos</button>

                    <div class="dropdown d-inline-block">
                        <button class="btn profile-btn  dropdown-toggle" type="button" id="dropdownMenuButton"
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
                    <button type="button" class="btn btn-primary right-side-btn">Message</button>
                    <button type="button" class="btn btn-primary right-side-btn">Add Friend +</button>
                </div>
            </section>
        </div>
    </section>
    </body>
    </html>`;
}

export function showFriendsProfile() {

}


