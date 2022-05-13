import createView from "../createView.js";
import {getHeaders, userEmail} from "../auth.js";

export default function Group(props) {
	console.log(props)
	// language=HTML
	let html = `<!DOCTYPE html>
    <html lang="html">
    <head>
        <meta charset="UTF-8"/>
        <title>${props.group.name}</title>
    </head>
    <body>
    <div class="container">
        <div class="row">
            //img header
            <img src="" alt="">
        </div>
        <div class="row justify-content-center">
            ${groupInfoPopulateHTML(props)}


            <div class="col-md-8">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-8"><h1>Latest from this group</h1></div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <p>
                                <a class="btn btn-primary" data-bs-toggle="collapse" href="#collapseExample"
                                   role="button" aria-expanded="false" aria-controls="collapseExample">
                                    Link with href
                                </a>
                                <button class="btn btn-primary" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseExample" aria-expanded="false"
                                        aria-controls="collapseExample">
                                    Button with data-bs-target
                                </button>
                            </p>
                            <div class="collapse" id="collapseExample">
                                <div class="card card-body">
                                    Some placeholder content for the collapse component. This panel is hidden by default
                                    but revealed when the user activates the relevant trigger.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>`;

	return html;
}


//Events
export function GroupEvents() {
	backToDiscoverBtn();
	editGroupBtn();
	editGroupSubmitBtn();
	cancelEditsBtn();
	const groupName = $(".groupName").text();
	const OGBio = $(".groupBio").text();
	const OGLocation = $(".groupLocation").text();

	function backToDiscoverBtn() {
		$(".backToDiscover").click(function () {
			createView('/discover')
		})
	}

	function editGroupBtn() {
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

	function editGroupSubmitBtn() {
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

			fetch(`http://localhost:8081/api/groups/${groupId}`, request)
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
}

//End of events


//HTML
function groupInfoPopulateHTML(props) {
	let html = `<div class="col-md-4">
			<div class="groupCol">
				<h1>Group</h1>
				<h2><span class="groupName">${props.group.name}</span></h2>
				<p>About: <span class="groupBio">${props.group.bio}</span></p>
				<p>Created on: ${new Date(props.group.createdDate).toLocaleDateString()}
					${new Date(props.group.createdDate).toLocaleTimeString()}</p>
				<p>Owner: ${props.group.groupOwner.username}</p>
				<p>Location: <span class="groupLocation">${props.group.location}</span></p>
				<p>Members: ${props.group.users.length}</p>`
	let found = false;
	let arrayEmpty = true;
	if (userEmail() === props.group.groupOwner.email) {
		html += `<button class="editGroupBtn btn btn-dark">Edit Group</button>`
	} else if (props.group.users.length === 0) {
		console.log("length 0")
		html += `<button class="joinGroupBtn btn btn-dark">Join Group</button>`
	} else if (props.group.users.length > 0) {
		arrayEmpty = false;
		props.group.users.forEach(user => {
			if (user.email === userEmail()) {
				found = true;
			}
		})
	}
	if (found) {
		html += `<button class="joinGroupBtn btn btn-dark">Leave Group</button>`
	} else if (!found && arrayEmpty === false) {
		html += `<button class="joinGroupBtn btn btn-dark">Join Group</button>`
	}
	//language=HTML
	html += `
        <button class="backToDiscover btn btn-dark">Back to discover</button>
        </div>
        </div>`
	return html;
}

//End of HTML