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
        <div class="row justify-content-center">
            <div class="col groupCol">
				<h1>Group</h1>
                <h2><span class="groupName">${props.group.name}</span></h2>
                <p>About: <span class="groupBio">${props.group.bio}</span></p>
                <p>Created on: ${new Date(props.group.createdDate).toLocaleDateString()} ${new Date(props.group.createdDate).toLocaleTimeString()}</p>
                <p>Owner: ${props.group.groupOwner.username}</p>
                <p>Location: <span class="groupLocation">${props.group.location}</span></p>
                <p>Members: ${props.group.users.length}</p>`
                if (userEmail() === props.group.groupOwner.email) {
					html += `<button class="saveGroupEdits btn btn-dark">Edit Group</button>`
                }
				html += `<button class="backToDiscover btn btn-dark">Back to discover</button>
            </div>
            <div class="col singleGroupPageEditForm">
            <h1>Edit your Group</h1>
           		<form>
                <label for="newGroupName">Name: <span
                        id="group-name"></span></label><br>
                <input class="form-control" type="text" id="editGroupName" name="newGroupName">
				
				
                <label for="newGroupBio" class="mt-2">Group Bio <span
                        id="group-bio"></span></label><br>
                <textarea class="form-control mb-2" id="editGroupBio"
                          name="newGroupBio"></textarea>

                <label for="newGroupLocation">Location: <span
                        id="group-location"></span></label><br>
                <input class="form-control" type="text" id="editGroupLocation" name="newGroupLocation">


                <p id="character-warning-on-submit"></p>
                <button class="btn btn-dark" id="cancelEdits">Cancel Edits</button>
                <input id="editGroupSubmit" data-id="${props.group.id}" class="btn btn-dark" type="button" value="Submit">
            </form>
			</div>
        </div>
    </div>
    </body>
    </html>`;

	return html;
}

export function GroupEvents() {
	const groupName = $(".groupName").text();
	const OGBio = $(".groupBio").text();
	const OGLocation = $(".groupLocation").text();

	$(".backToDiscover").click(function () {
		createView('/discover')
	})
	$(".saveGroupEdits").click(function () {
		$("#editGroupName").val(groupName);
		$("#editGroupBio").val(OGBio);
		$("#editGroupLocation").val(OGLocation);
		$(".groupCol").css("display", "none");
		$(".singleGroupPageEditForm").css("display", "block");
	})

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

	$("#cancelEdits").click(function () {
		$(".groupCol").css("display", "block");
		$(".singleGroupPageEditForm").css("display", "none");
	})
}