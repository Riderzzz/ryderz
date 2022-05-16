import {getHeaders, isLoggedIn, userEmail} from "../auth.js";
import createView from "../createView.js";

const COMMENT_URI = "http://localhost:8081/api/comments";
const POST_URI = "http://localhost:8081/api/posts";
const EVENT_URI = "http://localhost:8081/api/events";

export let editPostId;
export let editPostTitle;
export let editPostContent;
export let editPostCategories;

export default function NewsFeed(props) {
    let mixedProps = [];
    for (let post of props.posts) {
        post.date = new Date(post.createDate)
        post.type = "post"
        mixedProps.push(post)
    }
    for (let event of props.events) {
        event.date = new Date(event.createdDate)
        event.type = "event"
        mixedProps.push(event)
    }

    const sortedProps = mixedProps.sort((a, b) => b.date - a.date)

    console.log(sortedProps)

    //language=HTML
    let html =
        `
            <div class="container-fluid">
                <div class="row">
                    <div class="sidebar-container col-2  d-none d-lg-block">
                        ${newsfeedSidebarHtml(props)}
                    </div>
                    <div class="posts-container col-12 col-lg-10">
                        ${newsfeedPostsHtml(sortedProps)}
                    </div>
                </div>
            </div>
        `

    return html;
}

export function NewsFeedEvents() {

    commentOnPost();
    createPostBtn();
    editPostBtn();
    deletePostBtn();
    sideBarGroupBtn();
    sideBarEventBtn();
    sideBarFriendBtn();
    showProfilePage();
    editEventBtn();
    deleteEventBtn();
    commentOnEvent();
}
function showProfilePage() {
    $(".view-profile-page").click(function () {
        const profileId = $(this).data("id");
        console.log(profileId)
        createView("/profile", `${profileId}`);
    });
}

function commentOnPost() {
    $(".post-comment-btn").click(function () {
        let postId = $(this).data("id")
        const content = $('#comment-content-' + postId).val()

        //author field gets set in backend
        const commentObject = {
            content,
            post: {
                id: postId
            }
        }

        console.log(commentObject)

        const requestObject = {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(commentObject)
        }

        fetch(COMMENT_URI, requestObject).then(function () {
            console.log("Comment created");
        }).catch(function () {
            console.log("error")
        }).finally(function () {
            createView("/newsfeed")
        });
    });
}

function commentOnEvent() {
    $(".event-comment-btn").click(function () {
        let eventId = $(this).data("id")
        const content = $('#comment-content-' + eventId).val()

        //author field gets set in backend
        const commentObject = {
            content,
            event: {
                id: eventId
            }
        }

        console.log(commentObject)

        const requestObject = {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(commentObject)
        }

        fetch(COMMENT_URI, requestObject).then(function () {
            console.log("Comment created");
        }).catch(function () {
            console.log("error")
        }).finally(function () {
            createView("/newsfeed")
        });
    });
}

function createPostBtn() {
    $(".create-post-btn").click(function () {
        createView('/createPost')
    })
}

function editPostBtn() {
    $(".post-edit-btn").click(function () {
        editPostId = $(this).data("id");
        editPostTitle = $('#post-title-' + editPostId).text();
        editPostContent = $('#post-content-' + editPostId).text();
        editPostCategories = $('#post-categories-' + editPostId).text();
        editPostCategories = editPostCategories.split(" ");

        createView('/editPost')
    });
}

function deletePostBtn() {
    $(".post-delete-btn").click(function () {
        const postId = $(this).data("id")

        const requestObject = {
            method: "DELETE",
            headers: getHeaders()
        }

        fetch(`${POST_URI}/${postId}`, requestObject).then(r => {
            console.log("Post deleted")
        }).catch(r => {
            console.log("error")
        }).finally(() => {
            createView("/newsfeed")
        })
    });
}

function deleteEventBtn() {
    $(".event-delete-btn").click(function () {
        const eventId = $(this).data("id")

        const requestObject = {
            method: "DELETE",
            headers: getHeaders()
        }

        fetch(`${EVENT_URI}/${eventId}`, requestObject).then(r => {
            console.log("Event deleted")
        }).catch(r => {
            console.log("error")
        }).finally(() => {
            createView("/newsfeed")
        })
    });
}

function editEventBtn() {
    $(".event-edit-btn").click(function (){
        const eventId = $(this).data("id")
        console.log("THis event id is " + eventId)
        createView("/event", eventId)
    })
}

function sideBarGroupBtn() {
    $('.group').click(function () {
        const groupId = $(this).data("id")
        console.log("this groupss id is: " + groupId)
        createView("/group", groupId)
    })
}

function sideBarEventBtn() {
    $('.event').click(function (){
        const eventId = $(this).data("id")
        console.log("this events id is: " + eventId)
        createView("/event", eventId)
    })
}

function sideBarFriendBtn() {
    $('.friend').click(function (){
        const friendId = $(this).data("id")
        console.log("this friends id is: " + friendId)
        createView("/profile", friendId) //<--- once view for a users profile is made insert that where /group is
    })
}

function formatTime(time) {

    let hourSplit = time.split(":")
    let hour = parseInt(hourSplit[0]);

    if (hour > 12) {
        return (hour - 12) + ":" + hourSplit[1] + 'pm'
    }

    return hour + ":" + hourSplit[1] + 'am'
}

function formatDate(d) {
    d += " "
    let splitDate = d.split(" ");
    return splitDate[0] + " " + splitDate[1] + " " + splitDate[2] + ", " + splitDate[3];
}

function joinBtnIfLoggedInAndNotJoined(usersJoined, eventId) {
    console.log(usersJoined)

    for (const user of usersJoined) {
        if (user.email === userEmail()) {
            //language=html
            return `<div>

                <button class="btn btn-sm btn-dark mx-2" type="button" data-id="${eventId}">
                    Leave
                </button>
                
            </div>`
        }
    }

    return `<div>
    
    <button class="btn btn-sm btn-dark mx-2" type="button" data-id="${eventId}">
	    Join
	</button>
    
</div>`
}

function newsfeedSidebarHtml(props) {
    //language=html
    let html =
        `
		<div class="sidebar d-flex flex-column">
			<div class="groups d-flex flex-column">
				
				<p class="mx-auto my-3">
					<button class="sidebar-btn collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseGroups" aria-expanded="false" aria-controls="collapseGroups">
						<i class="bi bi-people ms-1 me-2"></i>Groups<i class="bi bi-caret-down icon"></i>
					</button>
				</p>
				<div class="collapse mx-auto" id="collapseGroups">
					<div class="">
						${props.user.groupsJoined.map(group => `<div class="p-1 group" data-id="${group.id}"><a href="#">- ${group.name}</a></div>`).join("")}
					</div>
				</div>
				
				<p class="mx-auto my-3">
					<button class="sidebar-btn collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEvents" aria-expanded="false" aria-controls="collapseEvents">
						<i class="bi bi-calendar-event ms-1 me-2"></i>Events<i class="bi bi-caret-down icon"></i>
					</button>
				</p>
				<div class="collapse mx-auto" id="collapseEvents">
					<div class="">
						${props.user.eventsJoined.map(event => `<div class="p-1 event" data-id="${event.id}"><a href="#">-${event.titleOfEvent}</a></div>`).join("")}
					</div>
				</div>
				
				<p class="mx-auto my-3">
					<button class="sidebar-btn collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFriends" aria-expanded="false" aria-controls="collapseFriends">
						<i class="bi bi-person ms-1 me-2"></i>Friends<i class="bi bi-caret-down icon"></i>
					</button>
				</p>
				<div class="collapse mx-auto" id="collapseFriends">
					<div class="">
						${props.user.friends.map(friend => `<div class="p-1 friend" data-id="${friend.id}"><a href="#">- ${friend.username}</a></div>`).join("")}
					</div>
				</div>
				
			</div>
		</div>
		`
    return html;
}



function newsfeedPostsHtml(sortedProps) {
    //language=HTML


    let html = `
        <header class="d-flex justify-content-between m-3">
            <div class="mx-4"><h3>News Feed</h3></div>
            <button class="btn btn-dark create-post-btn mx-4">Create Post</button>
        </header>
        <div class="post">
            ${sortedProps.map(post => {
        
                if (post.type === "post"){
                    return postCard(post)
                }
                if (post.type === "event") {
                    return eventCard(post)
                }
                
    }).join("")}
        </div>
				
				`;
    return html;
}

function postCard(post) {
    //card-header begin
    let html = `<div class="card m-3">
					<div class="card-header post-header d-flex justify-content-between">
						<a class="view-profile-page" data-id="${post.author.id}">
							 <i class="bi bi-person-square avatar me-2"></i>${post.author.username}
						</a>
						<div class="header-right">	
				`

    if (userEmail() === post.author.email) {
        html += `<div class="edit-delete"><i data-id="${post.id}" class="bi bi-pen post-edit-btn mx-1"></i><i data-id="${post.id}" class="bi bi-x-lg post-delete-btn ml-1"></i></div>`
    }

    html += `
            <div class="time">${formatDate(new Date(post.date))} ${formatTime(new Date(post.createDate).toLocaleTimeString())}</div>
                        
            </div></div>`
    //card-header-end
    //card-body-start
    html += `<div class="card-body pb-2">
									<h5 class="card-title" id="post-title-${post.id}">${post.title}</h5>
									<p class="card-text" id="post-content-${post.id}">${post.content}</p>
									<p class="card-text" id="post-categories-${post.id}">${post.categories.map(category => `${category.name}`).join(" ")}</p>
									<div>
										<button class="btn btn-sm btn-dark" type="button" data-bs-toggle="collapse" data-bs-target="#post-${post.id}-collapseComments" aria-expanded="false" aria-controls="post-${post.id}-collapseComments">
										Comments
										</button>
									</div>
									
									<div class="collapse" id="post-${post.id}-collapseComments">
										<div class="input-group my-3">
											<input type="text" id="comment-content-${post.id}" class="form-control" data-postId="${post.id}" placeholder="Your thoughts..." aria-label="Comment" aria-describedby="button-addon-${post.id}">
											<button class="btn btn-outline-secondary post-comment-btn" data-id="${post.id}" type="button" id="button-addon-${post.id}">comment</button>
										</div>
										${post.comments.map(comment =>
        `
			
										<div class="card card-body p-2">
                                            <div class="d-flex">
                                                <div class="info d-flex">
                                                    <div class="pic"><i class="bi bi-person-square comment-avatar me-2"></i></div>
                                                    <div class="names">
                                                        <div class="username">${comment.author.username}</div>
                                                        <div class="content">${comment.content}</div>
                                                    </div>
                                                </div>
                                                
                                            </div>
										</div>
			
									`).join("")}
									</div>
									
								</div>`	//card-body end

    html += `</div>`//ending div of card

    return html;
}

function eventCard(event) {
    let html = `<div class="card m-3">
					<div class="card-header post-header d-flex justify-content-between">
						<a class="view-profile-page" data-id="${event.eventCreator.id}">
							 <i class="bi bi-person-square avatar me-2"></i>${event.eventCreator.username}
						</a>
						<div class="header-right">	
				`

    if (userEmail() === event.eventCreator.email) {
        html += `<div class="edit-delete"><i data-id="${event.id}" class="bi bi-pen event-edit-btn mx-1"></i><i data-id="${event.id}" class="bi bi-x-lg event-delete-btn ml-1"></i></div>`
    }

    html += `
            <div class="time">${formatDate(new Date(event.date))} ${formatTime(new Date(event.date).toLocaleTimeString())}</div>
                        
            </div></div>`
    //card-header-end
    //card-body-start
    html += `<div class="card-body pb-2">
									<h5 class="card-title" id="post-title-${event.id}">${event.titleOfEvent}</h5>
									<div class="starting-ending-addresses justify-content-between d-flex">
									    <div class="starting-address">Starting: lat-${event.startingLatitude}Long-${event.startingLongitude}</div>
									    <div class="ending-address">Ending: lat-${event.endingLatitude}Long-${event.endingLongitude}</div>
									    <div class="distance">Miles:(api data)</div>
                                    </div>
                                    <div class="content-and-map row my-3">
                                        <p class="card-text col-7" id="post-content-${event.id}">${event.descriptionOfEvent}</p>
                                        <div class="map col-5 mx-auto"></div>
                                    </div>
									<p class="card-text" id="post-categories-${event.id}">${event.categories.map(category => `${category.name}`).join(" ")}</p>
									<div class="d-flex justify-content-between">
									    <div class="d-flex">
									        <button class="btn btn-sm btn-dark me-2" type="button" data-bs-toggle="collapse" data-bs-target="#event-${event.id}-collapseComments" aria-expanded="false" aria-controls="event-${event.id}-collapseComments">
										    Comments
										    </button>
										    ${joinBtnIfLoggedInAndNotJoined(event.usersId)}
                                        </div>
                                        <div class="rider-count">Riders: ${event.usersId.length}<i class="bi bi-person-fill"></i></div>
									</div>
									
									<div class="collapse" id="event-${event.id}-collapseComments">
										<div class="input-group my-3">
											<input type="text" id="comment-content-${event.id}" class="form-control" data-postId="${event.id}" placeholder="Your thoughts..." aria-label="Comment" aria-describedby="button-addon-${event.id}">
											<button class="btn btn-outline-secondary event-comment-btn" data-id="${event.id}" type="button" id="button-addon-${event.id}">comment</button>
										</div>
										${event.comments.map(comment =>
        `
			
										<div class="card card-body p-2">
                                            <div class="d-flex">
                                                <div class="info d-flex">
                                                    <div class="pic"><i class="bi bi-person-square comment-avatar me-2"></i></div>
                                                    <div class="names">
                                                        <div class="username">${comment.author.username}</div>
                                                        <div class="content">${comment.content}</div>
                                                    </div>
                                                </div>
                                                
                                            </div>
										</div>
			
									`).join("")}
									</div>
									
								</div>`	//card-body end

    html += `</div>`//ending div of card

    return html;
}

