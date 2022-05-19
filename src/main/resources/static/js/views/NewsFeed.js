import {getHeaders, isLoggedIn, userEmail} from "../auth.js";
import createView from "../createView.js";

const COMMENT_URI = "http://localhost:8081/api/comments";
const POST_URI = "http://localhost:8081/api/posts";
const EVENT_URI = "http://localhost:8081/api/events";

export let editPostId;
export let editPostTitle;
export let editPostContent;
let count = 0
// export let editPostCategories;
let allProps;

export default function NewsFeed(props) {
    allProps = props
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
                <div class="username" data-username="${props.user.username}"></div>
                <div class="id" data-userId="${props.user.id}"></div>
                <div class="row">
                    <div class="sidebar-container col-2  d-none d-lg-block">
                        ${newsfeedSidebarHtml(props.user)}
                    </div>
                    <div class="posts-container col-12 col-lg-10">
                        ${newsfeedPostsHtml(sortedProps)}
                    </div>
                </div>
                <div class="modal-container">
                    ${createPostModal(props)}
                    ${editPostModal(props)}           
                </div>
            </div>
        `

    return html;
}

export function NewsFeedEvents() {

    commentOnPost();
    createPostBtn();
    populateEditPostBtn();
    deletePostBtn();
    sideBarGroupBtn();
    sideBarEventBtn();
    sideBarFriendBtn();
    showProfilePage();
    editEventBtn();
    deleteEventBtn();
    commentOnEvent();
    editPostBtn();
    joinEvent();
    leaveEvent();
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
        let username = $('.username').data("username")
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
            let commentSection = $('.post-' + postId + '-comments')
            commentSection.html(showComment(commentObject, username) + commentSection.html())
        });
    });
}

function commentOnEvent() {
    $(".event-comment-btn").click(function () {
        let eventId = $(this).data("id")
        let username = $('.username').data("username")
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
            let commentSection = $('.event-' + eventId + '-comments')
            commentSection.html(showComment(commentObject, username) + commentSection.html())
        });
    });
}

//TODO: Once post gets appended to the page you cant edit or delete it until you refresh and
// get the acrual post in the database, make it to where you can

function createPostBtn() {
    $(".create-post-btn").click(function () {
        // createView('/createPost')
        let selectedCategories = [];

        $('input[type="checkbox"]:checked').each(function() {
            console.log(this.value);
            selectedCategories.push({name: this.value})

        });

        console.log(selectedCategories)

        const title = $('#createPostTitle').val();
        const content = $('#createPostContent').val();
        const categories = selectedCategories;

        const postObject = {
            id: 0,
            title,
            content,
            categories
        }
        console.log(postObject);
        const requestObject = {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(postObject)
        }

        fetch(POST_URI, requestObject).then(r => {
            console.log("post created")
        }).catch(r => {
            console.log('error')
        }).finally(r => {
            fetchPostsAndEventsData().then(d => {
                console.log(d)
                $('.posts-container').html(newsfeedPostsHtml(d))
                NewsFeedEvents()
            })
            // createView('/newsfeed')

            //appends post without reloading page but has bugs
            // postObject.comments = []
            // postObject.date = new Date()
            // postObject.author = {
            //     id: $('.id').data("userId"),
            //     username: $('.username').data("username"),
            //     email: userEmail()
            // }
            // console.log(postObject.date.toLocaleTimeString())
            // let feedContainer = $('.post')
            // feedContainer.html(tempPostCard(postObject) + feedContainer.html())
        })
    })
}

function populateEditPostBtn() {
    $(".post-edit-btn").click(function () {
        let editPostCheckboxes = $('.edit-post-checkbox')

        //unchecking boxes from last edit
        editPostCheckboxes.each(function (){
            $(this).prop('checked', false)
        })

        //----start populating modal with posts info
        editPostId = $(this).data("id");
        let postId = editPostId
        let editPostCategories = $('#post-categories-' + postId).text();
        editPostCategories = editPostCategories.split(" ");
        console.log(editPostCategories)

        editPostCheckboxes.each(function() {
            if (editPostCategories.includes($(this).val())) {
                console.log($(this).val())
                $(this).prop('checked', true)
            }
        });

        $('#editPostTitle').val($('#post-title-' + postId).text())
        $('#editPostContent').val($('#post-content-' + postId).text());
        //----end populating modal with posts info


        // createView('/editPost')
    });
}

function editPostBtn() {
    $('.edit-post-btn').click(e => {

        let postId = editPostId
        console.log(postId)

        let selectedCategories = [];

        $('input[type="checkbox"]:checked').each(function() {
            selectedCategories.push({name: this.value})

        });

        // console.log(selectedCategories)

        const title = $('#editPostTitle').val();
        const content = $('#editPostContent').val();
        const categories = selectedCategories;

        const postObject = {
            title,
            content,
            categories
        }
        console.log(postObject);
        const requestObject = {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(postObject)
        }

        fetch(`${POST_URI}/${postId}`, requestObject).then(r => {
            console.log("post edited")
        }).catch(r => {
            console.log('error')
        }).finally(r => {
            $('#post-title-' + postId).text(title)
            $('#post-content-' + postId).text(content)
            let categoryField = $('#post-categories-' + postId)
            categoryField.text("")
            for (const category of categories) {
                categoryField.text(categoryField.text() + " " + category.name)
            }
            //resetting so newly added post's edit doesnt edit previously edited post
            editPostId = '';
        })
    })
}

function deletePostBtn() {
    $(".post-delete-btn").click(function () {
        const postId = $(this).data("id")
        $('.post-num-' + postId).css("opacity", ".3")

        const requestObject = {
            method: "DELETE",
            headers: getHeaders()
        }

        fetch(`${POST_URI}/${postId}`, requestObject).then(r => {
            console.log("Post deleted")
        }).catch(r => {
            console.log("error")
        }).finally(() => {
            $('.post-num-' + postId).css("display", "none")
        })
    });
}

function deleteEventBtn() {
    $(".event-delete-btn").click(function () {
        const eventId = $(this).data("id")
        $('.event-num-' + eventId).css("opacity", ".3")


        const requestObject = {
            method: "DELETE",
            headers: getHeaders()
        }

        fetch(`${EVENT_URI}/${eventId}`, requestObject).then(r => {
            console.log("Event deleted")
        }).catch(r => {
            console.log("error")
        }).finally(() => {
            $('.event-num-' + eventId).css("display", "none")
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

function joinEvent() {
    $('.join-event-btn').click(function () {
        let eventId = $(this).data("id")
        let userId = $('.id').data("userId")

        $('.join-leave-container-' + eventId).text('Joined!')
        // $('.join-leave-container-' + eventId).children().children().addClass('btn-success').removeClass('btn-dark')

        let requestObject = {
            method: 'PUT',
            headers: getHeaders()
        }

        fetch(`${EVENT_URI}/${eventId}/adduser`, requestObject).then(r => {
            console.log('joined')
        }).catch(r => {

        }).finally(() => {
            fetchUserData().then(d => {
                console.log(d)
                $('.sidebar-container').html(newsfeedSidebarHtml(d))
            })
            fetchPostsAndEventsData().then(d => {
                console.log(d)
                $('.posts-container').html(newsfeedPostsHtml(d))
                NewsFeedEvents()
            })
        })
    })
}

function leaveEvent() {
    $('.leave-event-btn').click(function () {
        let eventId = $(this).data("id")
        let userId = $('.id').data("userId")

        $('.join-leave-container-' + eventId).text('left!')
        // $('.join-leave-container-' + eventId).children().children().addClass('btn-danger').removeClass('btn-dark')

        let requestObject = {
            method: "DELETE",
            headers: getHeaders()
        }

        fetch(`${EVENT_URI}/${eventId}/remove-user`, requestObject).then(r => {
            console.log('left')
        }).catch(r => {

        }).finally(() => {
            fetchUserData().then(d => {
                console.log(d)
                $('.sidebar-container').html(newsfeedSidebarHtml(d))
            })
            fetchPostsAndEventsData().then(d => {
                console.log(d)
                $('.posts-container').html(newsfeedPostsHtml(d))
                NewsFeedEvents()
            })
        })
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
    console.log(eventId)

    for (const user of usersJoined) {
        if (user.email === userEmail()) {
            //language=html
            return leaveBtn(eventId)
        }
    }

    return joinBtn(eventId)
}

function joinBtn(eventId) {
    return`<div>
    
    <button class="btn btn-sm btn-dark mx-2 join-event-btn" type="button" data-id="${eventId}">
	    Join <i class="bi bi-plus-lg"></i>
	</button>
    
</div>`
}

function leaveBtn(eventId) {
    return`<div>

                <button class="btn btn-sm btn-dark mx-2 leave-event-btn" type="button" data-id="${eventId}">
                    Leave <i class="bi bi-dash-lg"></i>
                </button>
                
            </div>`
}

function newsfeedSidebarHtml(userProps) {

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
						${userProps.groupsJoined.map(group => `<div class="p-1 group" data-id="${group.id}"><a href="#">- ${group.name}</a></div>`).join("")}
					</div>
				</div>
				
				<p class="mx-auto my-3">
					<button class="sidebar-btn collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEvents" aria-expanded="false" aria-controls="collapseEvents">
						<i class="bi bi-calendar-event ms-1 me-2"></i>Events<i class="bi bi-caret-down icon"></i>
					</button>
				</p>
				<div class="collapse mx-auto" id="collapseEvents">
					<div class="">
						${userProps.eventsJoined.map(event => `<div class="p-1 event" data-id="${event.id}"><a href="#">-${event.titleOfEvent}</a></div>`).join("")}
					</div>
				</div>
				
				<p class="mx-auto my-3">
					<button class="sidebar-btn collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFriends" aria-expanded="false" aria-controls="collapseFriends">
						<i class="bi bi-person ms-1 me-2"></i>Friends<i class="bi bi-caret-down icon"></i>
					</button>
				</p>
				<div class="collapse mx-auto" id="collapseFriends">
					<div class="">
						${userProps.friends.map(friend => `<div class="p-1 friend" data-id="${friend.id}"><a href="#">- ${friend.username}</a></div>`).join("")}
					</div>
				</div>
				
			</div>
		</div>
		`
    return html;
}



function newsfeedPostsHtml(sortedProps) {
    console.log(sortedProps)
    //language=HTML


    let html = `
        <header class="d-flex justify-content-between m-3">
            <div class="mx-4"><h3>News Feed</h3></div>
            <button class="btn btn-dark mx-4" data-bs-toggle="modal" data-bs-target="#createModal">Create Post</button>
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
    let html = `<div class="card m-3 post-num-${post.id}">
					<div class="card-header post-header d-flex justify-content-between">
						<a class="view-profile-page d-flex align-items-end" data-id="${post.author.id}">
							 <div class="me-2 newsfeed-profile-pic-container">
							    <img class="newsfeed-profile-pic" src="${post.author.userPhotoUrl}" alt="">
							 </div>
                             <div class="users-username my-2">${post.author.username}</div>
						</a>
						<div class="header-right">	
				`

    if (userEmail() === post.author.email) {
        html += `<div class="edit-delete"><i data-id="${post.id}" class="bi bi-pen post-edit-btn mx-1" data-bs-toggle="modal" data-bs-target="#editModal"></i><i data-id="${post.id}" class="bi bi-x-lg post-delete-btn ml-1"></i></div>`
    }

    html += `
            <div class="time">${formatDate(post.date)} ${formatTime(post.date.toLocaleTimeString())}</div>
                        
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
										<div class="post-${post.id}-comments">
										${post.comments.reverse().map(comment =>
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
									</div>
									
								</div>`	//card-body end

    html += `</div>`//ending div of card

    return html;
}

function eventCard(event) {
    let html = `<div class="card m-3 event-num-${event.id}"">
					<div class="card-header post-header d-flex justify-content-between">
						<a class="view-profile-page d-flex align-items-end" data-id="${event.eventCreator.id}">
							 <div class="me-2 newsfeed-profile-pic-container">
							    <img class="newsfeed-profile-pic" src="${event.eventCreator.userPhotoUrl}" alt="">
							 </div>
                             <div class="users-username my-2">${event.eventCreator.username}</div>
						</a>
						<div class="header-right my-1">	
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
									<h5 class="card-title d-flex justify-content-center justify-content-lg-start" id="post-title-${event.id}">${event.titleOfEvent}</h5>
									<div class="starting-ending-addresses justify-content-between d-flex flex-column flex-lg-row align-items-center ">
									    <div class="starting-address">Starting: lat-${event.startingLatitude}Long-${event.startingLongitude}</div>
									    <div class="ending-address">Ending: lat-${event.endingLatitude}Long-${event.endingLongitude}</div>
									    <div class="distance">Miles:(api data)</div>
                                    </div>
                                    <div class="content-and-map row my-3">
                                        <p class="card-text col-12 col-lg-7" id="post-content-${event.id}">${event.descriptionOfEvent}</p>
                                        <div class="map d-none d-lg-block col-lg-5 mx-auto"></div>
                                    </div>
									<p class="card-text" id="post-categories-${event.id}">${event.categories.map(category => `${category.name}`).join(" ")}</p>
									<div class="d-flex justify-content-between align-items-center">
									    <div class="d-flex">
									        <button class="btn btn-sm btn-dark me-2" type="button" data-bs-toggle="collapse" data-bs-target="#event-${event.id}-collapseComments" aria-expanded="false" aria-controls="event-${event.id}-collapseComments">
										    Comments
										    </button>
										    <div class="join-leave-container-${event.id}">
										        ${joinBtnIfLoggedInAndNotJoined(event.usersId, event.id)}
                                            </div>
                                        </div>
                                        <div class="rider-count">Riders: ${event.usersId.length}<i class="bi bi-person-fill"></i></div>
									</div>
									
									<div class="collapse" id="event-${event.id}-collapseComments">
										<div class="input-group my-3">
											<input type="text" id="comment-content-${event.id}" class="form-control" data-postId="${event.id}" placeholder="Your thoughts..." aria-label="Comment" aria-describedby="button-addon-${event.id}">
											<button class="btn btn-outline-secondary event-comment-btn" data-id="${event.id}" type="button" id="button-addon-${event.id}">comment</button>
										</div>
										<div class="event-${event.id}-comments">
										${event.comments.reverse().map(comment =>
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
								</div>
								</div>`	//card-body end

    html += `</div>`//ending div of card

    return html;
}

function showComment(comment, username) {
    return `<div class="card card-body p-2">
                                            <div class="d-flex">
                                                <div class="info d-flex">
                                                    <div class="pic"><i class="bi bi-person-square comment-avatar me-2"></i></div>
                                                    <div class="names">
                                                        <div class="username">${username}</div>
                                                        <div class="content">${comment.content}</div>
                                                    </div>
                                                </div>
                                            </div>
										</div>`
}

function createPostModal(props) {
    return `
<!-- Modal -->
<div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="createModalLabel">Create Post</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form class="m-3">
                        <div class="mb-3">
                          <label for="createPostTitle" class="form-label">Title</label>
                          <input type="email" class="form-control" id="createPostTitle">
                        </div>
                        <div class="mb-3">
                          <label for="createPostContent" class="form-label">Content</label>
                          <textarea class="form-control" id="createPostContent" rows="3"></textarea>
                        </div>
                        <div class="mb-3">
                         ${props.categories.map(cat =>
        `
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" id="category-${cat.id}" value="${cat.name}">
                                    <label class="form-check-label" for="category-${cat.id}">${cat.name}</label>
                                </div>
                            `)
        .join('')}
                        </div>
<!--                        <div class="mb-3 d-flex justify-content-end">-->
<!--                            <button class="btn btn-dark create-post-btn mx-4">Create Post</button>-->
<!--                        </div>-->
                    </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-dark create-post-btn" data-bs-dismiss="modal">Create</button>
      </div>
    </div>
  </div>
</div>`
}

function editPostModal(props) {
    console.log(props)
    return `<!-- Modal -->
<div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editModalLabel">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form class="m-3">
                        <div class="mb-3">
                          <label for="editPostTitle" class="form-label">Title</label>
                          <input type="email" class="form-control" id="editPostTitle">
                        </div>
                        <div class="mb-3">
                          <label for="editPostContent" class="form-label">Content</label>
                          <textarea class="form-control" id="editPostContent" rows="3"></textarea>
                        </div>
                        <div class="mb-3">
                         ${props.categories.map(cat => {
        let categoriesHtml = `
                                <div class="form-check form-check-inline">
                                                 `;

        // if(editPostCategories.includes(cat.name)){
        //     categoriesHtml += `<input class="form-check-input" type="checkbox" id="category-${cat.id}" value="${cat.name}" checked>`
        // } else {
            categoriesHtml += `<input class="form-check-input edit-post-checkbox" type="checkbox" id="category-${cat.id}" value="${cat.name}">`
        // }
        categoriesHtml += `
                                    <label class="form-check-label" for="category-${cat.id}">${cat.name}</label>
                                </div>
                            `
        return categoriesHtml;
    })
        .join('')}
                        </div>
                    
                    </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-dark edit-post-btn" data-bs-dismiss="modal">Save changes</button>
      </div>
    </div>
  </div>
</div>`
}



function tempPostCard(post) {
    //card-header begin
    let html = `<div class="card m-3" id="temp-card-${count}">
					<div class="card-header post-header d-flex justify-content-between">
						<a class="view-profile-page" data-id="${post.author.id}">
							 <i class="bi bi-person-square avatar me-2"></i>${post.author.username}
						</a>
						<div class="header-right">	
				`

    html += `
            <div class="time">${formatDate(post.date)} ${formatTime(post.date.toLocaleTimeString())}</div>
                        
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
										<div class="post-${post.id}-comments">
										${post.comments.reverse().map(comment =>
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
									</div>
									
								</div>`	//card-body end

    html += `</div>`//ending div of card

    return html;
}

function fetchUserData() {
    let requestObject = {
        method: 'GET',
        headers: getHeaders()
    }
    return fetch(`http://localhost:8081/api/users/me`, requestObject).then(r => {
        return r.json()
    }).then(data => data)
}

function fetchPostsAndEventsData() {
    let requestObject = {
        method: "GET",
        headers: getHeaders()
    }
    return Promise.all([
        fetch("http://localhost:8081/api/posts/friendsPost", requestObject),
        fetch("http://localhost:8081/api/events/friendsEvents", requestObject),
    ]).then(function (responses) {
        // Get a JSON object from each of the responses
        return Promise.all(responses.map(function (response) {
            return response.json();
        }));
    }).then(function (data) {
        // Log the data to the console
        // You would do something with both sets of data here

        let mixedProps = [];
        for (let post of data[0]) {
            post.date = new Date(post.createDate)
            post.type = "post"
            mixedProps.push(post)
        }
        for (let event of data[1]) {
            event.date = new Date(event.createdDate)
            event.type = "event"
            mixedProps.push(event)
        }

        const sortedProps = mixedProps.sort((a, b) => b.date - a.date)

        console.log(sortedProps)
        console.log(data);
        return sortedProps
    }).catch(function (error) {
        // if there's an error, log it
        console.log(error);
    });
}