import createView from "../createView.js";
import {getHeaders, userEmail} from "../auth.js";

export default function Group(props) {
	console.log(props)
	//language=HTML
	return `<!DOCTYPE html>
    <html lang="html">
    <head>
        <meta charset="UTF-8"/>
        <title>Club</title>
    </head>
    <body>
    <div class="container groupContainer">
        <div class="row mb-4">
            <img class="group-bg-img" src="${props.group.groupPhotoUrl !== null ? props.group.groupPhotoUrl : "https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"}" alt="">
        </div>
        <div class="row justify-content-center groupMainRow">
            <div class="col-lg-4 groupLeftCol">
                ${groupInfoPopulateHTML(props)}
            </div>


            <div class="col-lg-7">
                <div class="container-fluid rightColDiv">
                    <div class="row align-items-center rightColTopRow">
                        <div class="col-md-9"><h2>Latest from this group</h2></div>
                        <div class="col-md-3">
                            ${checkIfUserInGroup(props)}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            ${commentInputCollapseHTML(props)}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col groupCommentsDiv">
                            <h2>Comments</h2>
                            <div class="commentSection-${props.group.id}">
                                ${populateGroupCommentsHTML(props)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>`;
}


//Events
export function GroupEvents() {
	const groupName = $(".groupName").text();
	const OGBio = $(".groupBio").text();
	const OGLocation = $(".groupLocation").text();
	editGroupBtn(groupName, OGBio, OGLocation);
	editGroupSubmitBtn(groupName, OGBio, OGLocation);
	joinGroupBtn();
	leaveGroupBtn();
	backToDiscoverBtn();
	cancelEditsBtn();
	createCommentListener();
	deleteGroupBtn();
	uploadGroupImgHeader();
	clickOnCommentAuthorName();
	const groupId = $(".leaveGroupBtn").data("id");

}

function joinGroupBtn() {
	$(".joinGroupBtn").click(function () {
		const groupId = $(this).data("id");
		console.log(groupId);
		let warningPTag = $("#character-warning-on-submit");

		let request = {
			method: "PUT",
			headers: getHeaders()
		}

		fetch(`${URI}/api/groups/${groupId}/adduser`, request)
			.then(res => {
				console.log(res.status)
				if (res.status !== 200) {
					console.log(res);
					warningPTag.text("Error submitting changes!");
					warningPTag.css("color", "red");
				}
				createView('/group', groupId);
			})
			.catch(error => {
				console.log(error);
				warningPTag.text("Error submitting changes!");
				warningPTag.css("color", "red");
			})

	})
}

function leaveGroupBtn() {
	$(".leaveGroupBtn").click(function () {
		const groupId = $(this).data("id");
		let warningPTag = $("#character-warning-on-submit");

		let request = {
			method: "DELETE",
			headers: getHeaders()
		}

		fetch(`${URI}/api/groups/${groupId}/remove-user`, request)
			.then(res => {
				console.log(res.status)
				if (res.status !== 200) {
					console.log(res);
					warningPTag.text("Error submitting changes!");
					warningPTag.css("color", "red");
				}
				createView('/group', groupId);
			})
			.catch(error => {
				console.log(error);
				warningPTag.text("Error submitting changes!");
				warningPTag.css("color", "red");
			})
	})
}

function backToDiscoverBtn() {
	$(".backToDiscover").click(function () {
		createView('/discover')
	})
}

function editGroupBtn(groupName, OGBio, OGLocation) {
	$(".editGroupBtn").click(function () {
		$("#editGroupName").val(groupName);
		$("#editGroupBio").val(OGBio);
		$("#editGroupLocation").val(OGLocation);
		$(".groupCol").css("display", "none");
		$(".singleGroupPageEditForm").css("display", "block");
	})
}

function cancelEditsBtn() {
	$("#cancelEdits").click(function () {
		$(".groupCol").css("display", "block");
		$(".singleGroupPageEditForm").css("display", "none");
	})
}

function editGroupSubmitBtn(groupName, OGBio, OGLocation) {
	$("#editGroupSubmit").click(function () {
		const groupId = $(this).data("id");
		let warningPTag = $("#character-warning-on-submit");
		if (groupName === $("#editGroupName").val() && OGBio === $("#editGroupBio").val() && OGLocation === $("#editGroupLocation").val()) {
			warningPTag.text("No fields were changed!");
			warningPTag.css("color", "red");
			return;
		}

		const name = $("#editGroupName").val();
		const bio = $("#editGroupBio").val();
		const location = $("#editGroupLocation").val()

		if (!name || !bio || !location) {
			warningPTag.text("Please fill all fields");
			warningPTag.css("color", "red");
			return;
		}

		const editedGroup = {
			name,
			bio,
			location
		}


		let request = {
			method: "PUT",
			headers: getHeaders(),
			body: JSON.stringify(editedGroup)
		}

		fetch(`${URI}/api/groups/${groupId}`, request)
			.then(res => {
				console.log(res.status)
				if (res.status !== 200) {
					console.log(res);
					warningPTag.text("Error submitting changes!");
					warningPTag.css("color", "red");
				}
				createView('/group', groupId);
			})
			.catch(error => {
				console.log(error);
				warningPTag.text("Error submitting changes!");
				warningPTag.css("color", "red");
			})

	})
}

function deleteGroupBtn() {
	$("#deleteGroup").click(function () {
		let groupId = $(this).data("id");
		let warningPTag = $("#character-warning-on-submit");

		if (confirm("Delete this group?") === false) {
			return;
		}

		const requestObject = {
			method: "DELETE",
			headers: getHeaders()
		}

		fetch(`${URI}/api/groups/${groupId}`, requestObject)
			.then(res => {
				console.log(res.status)
				if (res.status !== 200) {
					console.log(res);
					warningPTag.text("Error submitting changes!");
					warningPTag.css("color", "red");
					return;
				}
				createView('/discover')
			})
			.catch(error => {
				console.log(error);
				warningPTag.text("Error submitting changes!");
				warningPTag.css("color", "red");
			})
	})
}

function createCommentListener() {
	$("#button-addon").click(function () {
		let comment = $("#comment-content");
		let groupId = $(this).data("id");
		let content = comment.val();
		let warningPTag = $("#character-warning-on-submit");
		comment.val("");

		const commentObject = {
			content,
			group: {
				id: groupId
			}
		}

		const requestObject = {
			method: "POST",
			headers: getHeaders(),
			body: JSON.stringify(commentObject)
		}

		fetch(`${URI}/api/comments`, requestObject)
			.then(res => {
				console.log(res.status)
				if (res.status !== 200) {
					console.log(res);
					return;
				}
				refreshComments(groupId)
			})
			.catch(error => {
				console.log(error);
				warningPTag.text("Error submitting changes!");
				warningPTag.css("color", "red");
			})
	})
}

function refreshComments(groupId) {
	//add comment to list of comment displayed
	// fetch same data as current router props
	// give props to populateGroupComments()
	let commentSection = $(".commentSection-" + groupId);

	let warningPTag = $(".warningReloadingComments");

	const requestObject = {
		method: "GET",
		headers: getHeaders()
	}

	fetch(`${URI}/api/groups/${groupId}`, requestObject)
		.then(res => res.json())
		.then(data => {
			let state = {group: data}
			commentSection.html(populateGroupCommentsHTML(state));
		})
		.catch(error => {
			console.log(error);
			warningPTag.text("Error reloading comments!");
			warningPTag.css("color", "red");
		})
}

function uploadGroupImgHeader() {
	$("#submitGroupHeaderImg").click(function () {
		let groupId = $(this).data("id");
		let file = document.getElementById("groupHeaderFile");
		let warningPTag = $("#file-warning-on-submit");
		let formData = new FormData();

		formData.append("file", file.files[0]);

		const requestObject = {
			method: "POST",
			body: formData
		}

		fetch(`${URI}/api/groups/${groupId}/groupUpload`, requestObject)
			.then(res => {
				console.log(res.status)
				if (res.status !== 200) {
					console.log(res);
					return;
				}
				createView('/group', groupId);
			})
			.catch(error => {
				console.log(error);
				warningPTag.text("Error submitting changes!");
				warningPTag.css("color", "red");
			})
	})
}

function clickOnCommentAuthorName() {
	$(".commentATag").click(function () {
		let commentAuthorID = $(this).data("id");

		createView("/profile", commentAuthorID);
	})
}

//End of events


//HTML
function groupInfoPopulateHTML(props) {
	//language=HTML
	let html = `
        <!--		TODO: add delete group option set up with backend-->
        <div class="groupCol">
            <h1><span class="groupName">${props.group.name}</span></h1>
            <p>About: <span class="groupBio">${props.group.bio}</span></p>
            <p>Created on: ${new Date(props.group.createdDate).toLocaleDateString()}</p>
            <p>Owner: <a href=""></a>${props.group.groupOwner.username}</p>
            <p>Location: <span class="groupLocation">${props.group.location}</span></p>
            <p>Members: ${props.group.users.length}</p>`
	let found = false;
	let arrayEmpty = true;
	if (userEmail() === props.group.groupOwner.email) {
		html += `<button class="groupGreenButton editGroupBtn btn btn-dark">Edit Group</button>`
	} else if (props.group.users.length === 0) {
		console.log("length 0")
		html += `<button class="groupGreenButton joinGroupBtn btn btn-dark" data-id="${props.group.id}">Join Group</button>`
	} else if (props.group.users.length > 0) {
		arrayEmpty = false;
		props.group.users.forEach(user => {
			if (user.email === userEmail()) {
				found = true;
			}
		})
	}
	if (found) {
		html += `<button class="groupGreenButton leaveGroupBtn btn btn-dark" data-id="${props.group.id}">Leave Group</button>`
	} else if (!found && arrayEmpty === false) {
		html += `<button class="groupGreenButton joinGroupBtn btn btn-dark" data-id="${props.group.id}">Join Group</button>`
	}
	//language=HTML
	html += `
        </div>`
	//language=HTML
	html += `
        <div class="col singleGroupPageEditForm">
            <h1>Edit your Group</h1>
            <form>
                <label for="newGroupName">Name: <span
                        id="group-name"></span></label><br>
                <input class="settingForm form-control" type="text" id="editGroupName" name="newGroupName">


                <label for="newGroupBio" class="mt-2">Group Bio <span
                        id="group-bio"></span></label><br>
                <textarea class="settingForm form-control mb-2" id="editGroupBio"
                          name="newGroupBio"></textarea>
                <label for="newGroupLocation">Location: <span
                        id="group-location"></span></label><br>
                <input class="settingForm form-control" type="text" id="editGroupLocation" name="newGroupLocation">
                <p id="character-warning-on-submit"></p>
                <button class="groupGreenButton btn mt-3" id="cancelEdits">Cancel Edits</button>
                <input id="editGroupSubmit" data-id="${props.group.id}" class="btn groupGreenButton mt-3" type="button"
                       value="Submit">
                <button class="groupGreenButton btn btn-danger mt-3" data-id="${props.group.id}" id="deleteGroup">Delete Group</button>
            </form>
            <h3>Change header image</h3>
            <p id="file-warning-on-submit"></p>
            <input class="fileUploadBtn" id="groupHeaderFile" type="file" accept="image/*">
			<button type="submit" class="groupGreenButton btn mt-3" data-id="${props.group.id}" id="submitGroupHeaderImg">Change Image</button>
        </div>
	`
	return html;
}

function checkIfUserInGroup(props) {
	let userIsInGroup = false;

	if (props.group.users.length > 0) {
		props.group.users.forEach(user => {
			if (user.email === userEmail()) {
				userIsInGroup = true
			}
		})
	}

	if (userIsInGroup || props.group.groupOwner.email === userEmail()) {
		//language=HTML
		return `
            <button class="groupGreenButton btn btn-dark" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseExample" aria-expanded="false"
                    aria-controls="collapseExample">
                Comment
            </button>`
	} else {
		//language=HTML
		return `
            <h4>Join group to comment</h4>
		`
	}
}

function populateGroupCommentsHTML(props) {

	if (props.group.comments.length === 0) {
		return `<h3>Be the first to comment!</h3>`
	} else {
		//language=HTML
		let html = `
            <div id="groupCommentsContainer">
                ${props.group.comments.reverse().map(comment =>
                        `<div class="card card-body groupComment p-2 m-3">
                        	<div class="d-flex">
                            <div class="info d-flex">
								<!--TODO: add delete icon to delete comment-->
								<a class="commentATag" data-id="${comment.author.id}">
                                <div class="pic"><img class="group-comment-profile-pic" src="${comment.author.userPhotoUrl}" alt=""></div>
                                </a>
                                <div class="ms-2 names">
                                	<a class="commentATag" data-id="${comment.author.id}">
                                    	<div class="username">${comment.author.username}</div>
                                	</a>
                                	<div class="content">${comment.content}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
		`
		return html
	}

}

function commentInputCollapseHTML(props) {
//	language=HTML
	return `
        <div class="collapse" id="collapseExample">
            <div class="input-group my-3">
                <p class="warningReloadingComments"></p>
                <input type="text" id="comment-content" class="form-control"
                       data-postId="${props.group.id}" placeholder="Your thoughts..."
                       aria-label="Comment"
                       aria-describedby="button-addon">
                <button class="groupGreenButton btn btn-dark comment-btn" data-id="${props.group.id}"
                        type="button" id="button-addon">Submit
                </button>
            </div>
        </div>
	`
}

//End of HTML