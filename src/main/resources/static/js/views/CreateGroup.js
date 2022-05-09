import {getHeaders} from "../auth.js";
import createView from "../createView.js";

export default function CreateGroup() {
	//language=HTML
	return `<!DOCTYPE html>
    <html lang="html">
    <head>
        <meta charset="UTF-8"/>
        <title>Create Group</title>
    </head>
    <body>
    <div class="container">
        <div class="row mt-4">
            <h1>Create Group</h1>
        </div>
        <div class="row">
            <form>
                <label for="newGroupName">Name: <span
                        id="group-name"></span></label><br>
                <input class="form-control" type="text" id="newGroupName" name="newGroupName">
				
				
                <label for="newGroupBio" class="mt-2">Group Bio <span
                        id="group-bio"></span></label><br>
                <textarea class="form-control mb-2" id="newGroupBio"
                          name="newGroupBio"></textarea>

                <label for="newGroupLocation">Location: <span
                        id="group-location"></span></label><br>
                <input class="form-control" type="text" id="newGroupLocation" name="newGroupLocation">


                <p id="character-warning-on-submit"></p>
                <input id="newGroupSubmit" class="btn btn-dark" type="button" value="Submit">
            </form>
        </div>
    </div>

    </body>
	`
}

export function CreateGroupEvents() {
	createGroupSubmitListener();
}

function createGroupSubmitListener() {
	$("#newGroupSubmit").click(function () {
		const name = $("#newGroupName").val();
		const bio = $("#newGroupBio").val();
		const location = $("#newGroupLocation").val();

		if (!name || !bio || !location) {
			$("#character-warning-on-submit").text("Fill all fields")
			return;
		}

		const newGroup = {
			name,
			bio,
			location
		}


		let request = {
			method: "POST",
			headers: getHeaders(),
			body: JSON.stringify(newGroup)
		}

		fetch(`http://localhost:8081/api/groups`, request)
			.then(res => {
				console.log(res.status)
				createView("/discover")
			})
			.catch(error => {
				console.log(error)
				createView("/discover")
			})
	})
}
