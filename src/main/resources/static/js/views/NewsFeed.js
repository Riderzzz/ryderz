import {getHeaders, isLoggedIn, pubnubInitWithUserUsername, userEmail} from "../auth.js";
import createView from "../createView.js";
import {fetchOldMessages, sendMsg, subscribeToChannel} from "../pubnubChat.js";
import {chatBoxHtml, selectFriendsTabListener, sendMsgBtn, sendMsgEnter, toggleChatboxBtn} from "./chat.js";

const COMMENT_URI = `${URI}/api/comments`;
const POST_URI = `${URI}/api/posts`;
const EVENT_URI = `${URI}/api/events`;
const USER_URI = `${URI}/api/users`;

export let editPostId;
export let editPostTitle;
export let editPostContent;
let count = 0
let channel = 'app-test-1'
let allProps = ''
let sortedProps = ''
let eventIdsArray = [];

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

    sortedProps = mixedProps.sort((a, b) => b.date - a.date)

    //language=HTML
    let html =
        `
            <div class="newsfeedSelect d-flex d-lg-none">
                <div class="selectTab" data-id="1">Sidebar</div>
                <div class="selectTab bottom-border" data-id="2">Feed</div>
                <div class="selectTab" data-id="3">Recents</div>
            </div>
            <div class="container-fluid">
                <div class="username" data-username="${props.user.username}"></div>
                <div class="id" data-userid="${props.user.id}"></div>
                <div class="row">
                    <div class="sidebar-container col-12 col-lg-2  d-none d-lg-block">
                        ${newsfeedSidebarHtml(props.user)}
                    </div>
                    <div class="posts-container col-12 col-lg-7">
                        ${newsfeedPostsHtml(sortedProps)}
                    </div>
                    <div class="recent-events d-none d-lg-block col-12 col-lg-3">
                        ${newsfeedRecent(props)}
                    </div>
                </div>
                <div class="modal-container">
                    ${createPostModal(props)}
                    ${editPostModal(props)}           
                </div>
                <div>
                    ${chatBoxHtml(props.user.friends)}
                </div>
            </div>
        `

    return html;
}

export function NewsFeedEvents() {
    navSearchListener()

    commentOnPost();
    createEventBtn();
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

    //left side-bar functions
    goToRecentEventBtn();
    goToRecentGroupBtn();

    //chat functions
    subscribeToChannel(channel);
    fetchOldMessages(channel);
    sendMsgBtn();
    sendMsgEnter();
    toggleChatboxBtn();
    selectFriendsTabListener();
    hideChatbox();


    showMap()
    showMapMap()
    // newsfeedInitAllMaps()
    newsFeedMobileSelect()

    windowSizeListener()
}

function windowSizeListener() {
    window.addEventListener('resize', function (){
        let width = document.documentElement.clientWidth
        let leftSidebar = $('.sidebar-container')
        let centerFeed = $('.posts-container')
        let rightSidebar = $('.recent-events')
        if (width >= 992) {
            leftSidebar.removeClass('d-none')
            centerFeed.removeClass('d-none')
            rightSidebar.removeClass('d-none')
        }
    })
}

function newsFeedMobileSelect() {
    $('.selectTab').click(function (){
        $('.selectTab').removeClass('bottom-border')
        $(this).addClass('bottom-border')
        let id = $(this).data('id')
        let leftSidebar = $('.sidebar-container')
        let centerFeed = $('.posts-container')
        let rightSidebar = $('.recent-events')

        leftSidebar.addClass('d-none')
        centerFeed.addClass('d-none')
        rightSidebar.addClass('d-none')

        switch (id) {
            case 1 : leftSidebar.removeClass('d-none')
                break;
            case 2: centerFeed.removeClass('d-none')
                break;
            case 3: rightSidebar.removeClass('d-none')
                break;
        }
    })
}

function showMap() {
    $('.show-map').click(function (){
        $(this).remove()
        let mapId = $(this).data('id')
        let origin = $(this).data('origin')
        let destination = $(this).data('destination')

        $(`.map[data-id=${mapId}]`).removeClass('blur')

        newsfeedInitMap(mapId, origin, destination)
    })
}

function showMapMap() {
    $('.show-map-map').click(function (){
        let mapId = $(this).data('id')
        let origin = $(this).data('origin')
        let destination = $(this).data('destination')

        $(`.map[data-id=${mapId}]`).removeClass('blur')

        newsfeedInitMap(mapId, origin, destination)
    })
}

function userSearchListener() {
    $('.userSearched').click(function (){
        const userId = $(this).data('id')
        console.log('clicked on user with id of: ' + userId)
        createView("/profile", `${userId}`);
    })
}

function searchedUsersHtml(users) {
    //language=html
    // console.log(users)
    let html = ''

    users.map(user => {html += `<li><a class="list-group-item userSearched" data-id="${user.id}" href="#">${user.username}</a></li>`}).join("")

    return html
}

export function navSearchListener() {
    $('.nav-search').keyup(function (event){
        $('#searchedUsersContainer').html("")
        var keycode = event.keyCode
        let searchedString = $(this).val()
        // console.log(searchedString)
        if (searchedString.length >= 3) {
            fetch(`${USER_URI}/getUsersByUsername/${searchedString}`).then(response => {
                            return response.json()
                        }).then(data => {
                            $('#searchedUsersContainer').html(searchedUsersHtml(data))
                            userSearchListener()
                        })
        }
        // if(keycode == '13'){
        //     event.preventDefault()
        //
        //     let searchedString = $(this).val().toLowerCase()
        //     console.log('searched: ' + searchedString)
        //     if (searchedString.length > 0) {
        //         fetch(`${USER_URI}/getUsersByUsername/${searchedString}`).then(response => {
        //             return response.json()
        //         }).then(data => {
        //             $('#searchedUsersContainer').html(searchedUsersHtml(data))
        //             userSearchListener()
        //         })
        //     }
        // }
    })
}

function hideChatbox() {
    $('.posts-container').click(function () {
        let chatbox = $('.chat-box-container')

        if (!chatbox.hasClass('d-none')) {
            chatbox.toggleClass('d-none')
        }
    })
}

function showProfilePage() {
    $(".view-profile-page").click(function () {
        const profileId = $(this).data("id");
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

        // console.log(commentObject)

        const requestObject = {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(commentObject)
        }

        fetch(COMMENT_URI, requestObject).then(function () {
            // console.log("Comment created");
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
        // console.log(editPostCategories)

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

function createEventBtn() {
    $('.create-event-btn').click(function (){
        createView('/createEvent')
    })
}

function editPostBtn() {
    $('.edit-post-btn').click(e => {

        let postId = editPostId
        // console.log(postId)

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
        // console.log(postObject);
        const requestObject = {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(postObject)
        }

        fetch(`${POST_URI}/${postId}`, requestObject).then(r => {
            // console.log("post edited")
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
            // console.log("Post deleted")
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
        let userId = $('.id').data("userid")

        $('.join-leave-container-' + eventId).children().children().text('Joined!')
        $('.join-leave-container-' + eventId).children().children().addClass('btn-success').removeClass('btn-dark')

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
        let userId = $('.id').data("userid")

        $('.join-leave-container-' + eventId).children().children().text('left!')
        $('.join-leave-container-' + eventId).children().children().addClass('btn-danger').removeClass('btn-dark')

        let requestObject = {
            method: "DELETE",
            headers: getHeaders()
        }

        fetch(`${EVENT_URI}/${eventId}/remove-user`, requestObject).then(r => {
            // console.log('left')
        }).catch(r => {

        }).finally(() => {
            fetchUserData().then(d => {
                // console.log(d)
                $('.sidebar-container').html(newsfeedSidebarHtml(d))
            })
            fetchPostsAndEventsData().then(d => {
                // console.log(d)
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
    // console.log(time)
    let hourSplit = time.split(":")
    let secondsAndAMPM = hourSplit[2]
    let AMorPM = secondsAndAMPM.split(" ")

    return hourSplit[0] + ':' + hourSplit[1] + ' ' + AMorPM[1]
}

function formatDate(d) {
    d += " "
    let splitDate = d.split(" ");
    return splitDate[0] + " " + splitDate[1] + " " + splitDate[2] + ", " + splitDate[3];
}

function joinBtnIfLoggedInAndNotJoined(usersJoined, eventId, creator) {
    // console.log(eventId)
    if (creator.email === userEmail()) {
        return ``
    }

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
    
    <button class="btn btn-sm btn-lightG mx-2 join-event-btn" type="button" data-id="${eventId}">
	    Join <i class="bi bi-plus-lg"></i>
	</button>
    
</div>`
}

function leaveBtn(eventId) {
    return`<div>

                <button class="btn btn-sm btn-lightG mx-2 leave-event-btn" type="button" data-id="${eventId}">
                    Leave <i class="bi bi-dash-lg"></i>
                </button>
                
            </div>`
}

function goToRecentGroupBtn() {
    $('.recent-group-card').click(function () {
        let groupId = $(this).data("id")
        createView('/group', groupId)
    })
}

function goToRecentEventBtn() {
    $('.recent-event-card').click(function () {
        let eventId = $(this).data("id");
        createView('/event', eventId)
    })
}

function newsfeedSidebarHtml(userProps) {

    //language=html
    let html =
        `
		<div class="sidebar d-flex flex-column navbar-dark-bg">
			<div class="groups d-flex flex-column">
				
				<p class="mx-auto my-3">
					<button class="sidebar-btn collapsed d-flex justify-content-between align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapseGroups" aria-expanded="false" aria-controls="collapseGroups">
                        <div><i class="bi bi-people ms-1 me-1"></i>Clubs</div>
                        <div><i class="bi bi-caret-up icon mx-2"></i></div>
					</button>
				</p>
				<div class="collapse me-auto" id="collapseGroups">
					<div class="">
						${userProps.groupsJoined.map(group => `<div class="p-1 group" data-id="${group.id}"><a href="#" class="hover-green">- ${group.name}</a></div>`).join("")}
					</div>
				</div>
				
				<p class="mx-auto my-3">
					<button class="sidebar-btn collapsed d-flex justify-content-between align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEvents" aria-expanded="false" aria-controls="collapseEvents">
                        <div><i class="bi bi-calendar-event ms-1 me-1"></i>Events</div>
                        <div><i class="bi bi-caret-up icon mx-2"></i></div>
					</button>
				</p>
				<div class="collapse me-auto" id="collapseEvents">
					<div class="">
						${userProps.eventsJoined.map(event => `<div class="p-1 event" data-id="${event.id}"><a href="#" class="hover-green">-${event.titleOfEvent}</a></div>`).join("")}
					</div>
				</div>
				
				<p class="mx-auto my-3">
					<button class="sidebar-btn collapsed d-flex justify-content-between align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFriends" aria-expanded="false" aria-controls="collapseFriends">
                        <div><i class="bi bi-person ms-1 me-1"></i>Friends</div>
                        <div><i class="bi bi-caret-up icon mx-2"></i></div>
						
					</button>
				</p>
				<div class="collapse me-auto" id="collapseFriends">
					<div class="">
						${userProps.friends.map(friend => `<div class="p-1 friend" data-id="${friend.id}"><a href="#" class="hover-green">- ${friend.username}</a></div>`).join("")}
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
            <div class=""><h3>News Feed</h3></div>
            <div class="">
                <button class="btn btn-lightG ms-1 fontResponsive" data-bs-toggle="modal" data-bs-target="#createModal">Create Post</button>
                <button class="btn btn-lightG ms-1 fontResponsive create-event-btn">Create event</button>
            </div>
        </header>
        <div class="post">
            ${sortedProps.map(post => {
                // console.log(post)
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

function newsfeedRecent(props) {
    //language=html
    let html =
        `
        <div class="recent-events">
            <h4>Recent clubs...</h4>
            ${props.recentGroups.map(group => `${recentGroupCard(group)}`).join("")}
            <h4>Recent events...</h4>
            ${props.recentEvents.map(event => `${recentEventCard(event)}`).join("")}
        </div>         
        
        `
    return html;
}

function recentEventCard(event) {
    return `
            <div class="card card-dark-bg m-3 recent-event-card" data-id="${event.id}">
              <img src="${event.eventImageUrl !== null ? event.eventImageUrl : "https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"}" class="card-img-top" alt="..." style="border-radius: 10px 10px 0 0">
              <div class="card-body d-flex justify-content-between p-2">
                  <div>
                    <h6>${event.titleOfEvent}</h6>
                    <p class="card-text">${event.eventLocation}</p>
                  </div>
                  <div>
                    <div class="date" style="font-size: .75em">${formatDate(new Date(event.eventDate))}</div>
                    <div class="time" style="font-size: .75em">${formatTime(new Date(event.eventDate).toLocaleTimeString('en-US'))}</div>
                  </div>  
              </div>
            </div>`
}

function recentGroupCard(group) {

    return `
            <div class="card card-dark-bg m-3 recent-group-card" data-id="${group.id}">
              <img src="${group.groupPhotoUrl !== null ? group.groupPhotoUrl : "https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"}" class="card-img-top discoverItemImg" alt="..." style="border-radius: 10px 10px 0 0">
              <div class="card-body p-2">
                <h5>${group.name}</h5>
                <p class="card-text">${group.location}</p>
              </div>
            </div>`
}

function postCard(post) {
    //card-header begin
    let html = `<div class="card m-lg-3 my-3 mx-1 post-num-${post.id} shadow-light card-dark-bg">
					<div class="post-header mb-2 d-flex justify-content-between">
						<a class="view-profile-page d-flex align-items-end" data-id="${post.author.id}">
							 <div class="me-2 newsfeed-profile-pic-container">
							    <img class="newsfeed-profile-pic rounded-circle" src="${post.author.userPhotoUrl}" alt="">
							 </div>
                             <div class="users-username">${post.author.username}</div>
						</a>
						<div class="header-right-post">	
				`

    if (userEmail() === post.author.email) {
        html += `<div class="edit-delete"><i data-id="${post.id}" class="bi bi-pen post-edit-btn pointer hover-opacity mx-1" data-bs-toggle="modal" data-bs-target="#editModal"></i><i data-id="${post.id}" class="bi bi-x-lg post-delete-btn pointer hover-opacity ml-1"></i></div>`
    }

    html += `
            
                        
            </div></div>`
    //card-header-end
    //card-body-start
    html += `<div class="card-body pb-2 bt">
									<h5 class="card-title" id="post-title-${post.id}">${post.title}</h5>
									<p class="card-text" id="post-content-${post.id}">${post.content}</p>
									<p class="card-text" id="post-categories-${post.id}">${post.categories.map(category => `${category.name}`).join(" ")}</p>
									<div class="d-flex justify-content-between ">
									      <a class="show-comments collapsed text-white" data-bs-toggle="collapse" href="#post-${post.id}-collapseComments" role="button" aria-expanded="false" aria-controls="post-${post.id}-collapseComments">
                                            Comments <i class="bi bi-chevron-up icon"></i>
                                          </a>
										<div class="time">${formatDate(post.date)} ${formatTime(post.date.toLocaleTimeString('en-US'))}</div>
									</div>
									<div class="collapse" id="post-${post.id}-collapseComments">
										<div class="input-group my-3">
											<input type="text" id="comment-content-${post.id}" class="form-control settingForm" data-postId="${post.id}" placeholder="Your thoughts..." aria-label="Comment" aria-describedby="button-addon-${post.id}">
											<button class="btn btn-outline-secondary post-comment-btn comment-btn" data-id="${post.id}" type="button" id="button-addon-${post.id}">comment</button>
										</div>
										<div class="post-${post.id}-comments">
										${post.comments.reverse().map(comment =>
        `
			
										${showComment(comment,comment.author.username)}
			
									`).join("")}
										</div>
									</div>
									
								</div>`	//card-body end

    html += `</div>`//ending div of card

    return html;
}

function checkForTwoLocations(event) {
    if (event.isSingleLocationEvent) {
        return ``
    } else if (!event.routeDistance || !event.routeDuration) {
        return ``
    }
    return `
                <div class="ending-address mb-1">Ending: ${event.destination}</div>
                <div class="distance mb-1">Miles: ${event.routeDistance}</div>
           `
}

function eventCard(event) {
    eventIdsArray.push(event)
    let html = `<div class="card m-lg-3 my-3 mx-1 event-num-${event.id} shadow-light card-dark-bg">
					<div class="post-header d-flex justify-content-between mb-2">
						<a class="view-profile-page d-flex align-items-end" data-id="${event.eventCreator.id}">
							 <div class="me-2 newsfeed-profile-pic-container">
							    <img class="newsfeed-profile-pic rounded-circle" src="${event.eventCreator.userPhotoUrl}" alt="">
							 </div>
                             <div class="users-username">${event.eventCreator.username}</div>
						</a>
						<div class="event-header-right">
						    <div class="join-leave-container-${event.id} me-2">
							    ${joinBtnIfLoggedInAndNotJoined(event.usersId, event.id, event.eventCreator)}
                            </div>
                        
						<div class="header-right">	
						    
				`

    if (userEmail() === event.eventCreator.email) {
        html += `<div class="edit-delete"><i data-id="${event.id}" class="bi bi-pen event-edit-btn pointer hover-opacity mx-1"></i><i data-id="${event.id}" class="bi bi-x-lg event-delete-btn pointer hover-opacity ml-1"></i></div>`
    }

    html += `    <div class="rider-count">Riders: ${event.usersId.length}<i class="bi bi-person-fill"></i></div>
                        
            </div></div></div>`
    //card-header-end
    //card-body-start
    html += `<div class="card-body pb-2 bt">
									<h5 class="d-flex justify-content-center justify-content-lg-start" id="post-title-${event.id}">${event.titleOfEvent}</h5>
									
                                    <div class="content-and-map row my-3">
                                        <div class="col-12 col-lg-6">
                                            <div class="starting-address mb-1">Starting: ${event.origin}</div>
                                            ${checkForTwoLocations(event)}
                                            <p class="card-text" id="post-content-${event.id}">${event.descriptionOfEvent}</p>
                                        </div>
                                        <div class="map-container d-none d-lg-block col-lg-6 mx-auto">
                                            <div class="content-comment text-center">click map to view</div>
                                            <div id="map-${event.id}" class="map blur show-map-map" data-id="${event.id}" data-origin="${event.origin}" data-destination="${event.destination}"></div>        
                                        </div>
                                    </div>
									<p class="card-text" id="post-categories-${event.id}">
                                        ${event.categories.map(category => `${category.name}`).join(" ")}
                                    </p>
									<div class="d-flex justify-content-between align-items-center">
									    <div class="d-flex">
									        <a href="#" class="event text-white me-2" data-id="${event.id}">Event page</a>
									        <a class="show-comments collapsed text-white me-2" data-bs-toggle="collapse" href="#event-${event.id}-collapseComments" role="button" aria-expanded="false" aria-controls="event-${event.id}-collapseComments">
                                                Comments <i class="bi bi-chevron-up icon"></i>
                                            </a>
                                        </div>
                                        <div class="time">${formatDate(event.date)} ${formatTime(event.date.toLocaleTimeString('en-US'))}</div>

									</div>
									
									<div class="collapse" id="event-${event.id}-collapseComments">
										<div class="input-group my-3">
											<input type="text" id="comment-content-${event.id}" class="form-control settingForm" data-postId="${event.id}" placeholder="Your thoughts..." aria-label="Comment" aria-describedby="button-addon-${event.id}">
											<button class="btn btn-outline-secondary event-comment-btn comment-btn" data-id="${event.id}" type="button" id="button-addon-${event.id}">comment</button>
										</div>
										<div class="event-${event.id}-comments">
										${event.comments.reverse().map(comment =>
        `

                                            ${showComment(comment,comment.author.username)}
			                               
										
			
									`).join("")}
									</div>
								</div>
								</div>`	//card-body end

    html += `</div>`//ending div of card

    return html;
}

function showComment(comment, username) {
    return `<div>
                                            <div class="d-flex comment-card">
                                                <div class="info d-flex">
                                                    <div class="pic"><i class="bi bi-person-square comment-avatar me-2"></i></div>
                                                    <div class="names">
                                                        <div class="username">${username}</div>
                                                        <div class="content-comment">${comment.content}</div>
                                                    </div>
                                                </div>
                                            </div>
										</div>`
}

function createPostModal(props) {
    return `
<!-- Modal -->
<div class="modal fade text-white" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header card-dark-bg">
        <h5 class="modal-title" id="createModalLabel">Create Post</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body card-dark-bg">
        <form class="m-3">
                        <div class="mb-3">
                          <label for="createPostTitle" class="form-label">Title</label>
                          <input type="email" class="form-control settingForm" id="createPostTitle">
                        </div>
                        <div class="mb-3">
                          <label for="createPostContent" class="form-label">Content</label>
                          <textarea class="form-control settingForm" id="createPostContent" rows="3"></textarea>
                        </div>
                        <div class="mb-3">
                         ${props.categories.map(cat =>
        `
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input checkboxForm" type="checkbox" id="category-${cat.id}" value="${cat.name}">
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
      <div class="modal-footer card-dark-bg">
        <button type="button" class="btn btn-lightG" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn create-post-btn btn-lightG" data-bs-dismiss="modal">Create</button>
      </div>
    </div>
  </div>
</div>`
}

function editPostModal(props) {
    // console.log(props)
    return `<!-- Modal -->
<div class="modal fade text-white" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header card-dark-bg">
        <h5 class="modal-title" id="editModalLabel">Modal title</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body card-dark-bg">
        <form class="m-3">
                        <div class="mb-3">
                          <label for="editPostTitle" class="form-label">Title</label>
                          <input type="email" class="form-control settingForm" id="editPostTitle">
                        </div>
                        <div class="mb-3">
                          <label for="editPostContent" class="form-label">Content</label>
                          <textarea class="form-control settingForm" id="editPostContent" rows="3"></textarea>
                        </div>
                        <div class="mb-3">
                         ${props.categories.map(cat => {
        let categoriesHtml = `
                                <div class="form-check form-check-inline">
                                                 `;

        // if(editPostCategories.includes(cat.name)){
        //     categoriesHtml += `<input class="form-check-input" type="checkbox" id="category-${cat.id}" value="${cat.name}" checked>`
        // } else {
        categoriesHtml += `<input class="form-check-input edit-post-checkbox checkboxForm" type="checkbox" id="category-${cat.id}" value="${cat.name}">`
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
      <div class="modal-footer card-dark-bg">
        <button type="button" class="btn btn-lightG" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-lightG edit-post-btn" data-bs-dismiss="modal">Save changes</button>
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

export function fetchUserData() {
    let requestObject = {
        method: 'GET',
        headers: getHeaders()
    }
    return fetch(`${URI}/api/users/me`, requestObject).then(r => {
        return r.json()
    }).then(data => data)
}

function fetchPostsAndEventsData() {
    let requestObject = {
        method: "GET",
        headers: getHeaders()
    }
    return Promise.all([
        fetch(`${URI}/api/posts/friendsPost`, requestObject),
        fetch(`${URI}/api/events/friendsEvents`, requestObject),
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

        // console.log(sortedProps)
        // console.log(data);
        return sortedProps
    }).catch(function (error) {
        // if there's an error, log it
        // console.log(error);
    });
}

function newsfeedInitAllMaps() {
    for (let event of eventIdsArray) {
        newsfeedInitMap(event.id, event.origin, event.destination)
    }
}

function newsfeedInitMap(eventId, origin, destination) {
    // console.log(eventIdsArray)
    // console.log(origin)
    // console.log(destination)

    let geocoder;
    geocoder = new google.maps.Geocoder();
    let map, infoWindow;
    let myLatLng = {lat: 39.8097343, lng: -98.5556199};

    infoWindow = new google.maps.InfoWindow();

    map = new google.maps.Map(document.getElementById(`map-${eventId}`), {
        center: {lat: 39.8097343, lng: -98.5556199},
        disableDefaultUI: true,
        zoom: 3,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
            { elementType: "geometry", stylers: [{ color: "#181818" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#000000" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#709775" }] },
            {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#709775" }],
            },
            {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#709775" }],
            },
            {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#263c3f" }],
            },
            {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#6b9a76" }],
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#38414e" }],
            },
            {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#212a37" }],
            },
            {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9ca5b3" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#606060" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#1f2835" }],
            },
            {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{ color: "#f3d19c" }],
            },
            {
                featureType: "transit",
                elementType: "geometry",
                stylers: [{ color: "#2f3948" }],
            },
            {
                featureType: "transit.station",
                elementType: "labels.text.fill",
                stylers: [{ color: "#709775" }],
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }],
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#515c6d" }],
            },
            {
                featureType: "water",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#17263c" }],
            },
        ]
    });

    //create a DirectionsService object to use the route method and get a result for our request
    var directionsService = new google.maps.DirectionsService();

//create a DirectionsRenderer object which we will use to display the route
    var directionsDisplay = new google.maps.DirectionsRenderer();

//bind the DirectionsRenderer to the map
    directionsDisplay.setMap(map);

    if (destination === "") {
        map.setZoom(10)
        function codeAddress() {
            var address = origin;
            geocoder.geocode( { 'address': address}, function(results, status) {
                if (status == 'OK') {
                    map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location,
                    });
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        }

        codeAddress();

    } else {
        //define calcRoute function
        function calcRoute() {
            //create request
            var request = {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
                unitSystem: google.maps.UnitSystem.IMPERIAL
            }

            //pass the request to the route method
            directionsService.route(request, function (result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    // console.log(result);
                    // console.log(status);

                    //Get distance and time
                    // const output = document.querySelector('#output');
                    // output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";

                    //display route
                    directionsDisplay.setDirections(result);
                } else {
                    //delete route from map
                    directionsDisplay.setDirections({routes: []});
                    //center map in London
                    map.setCenter(myLatLng);
                    console.log(result);

                    //show error message
                    // output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
                }
            });
        }
        calcRoute()
    }
}