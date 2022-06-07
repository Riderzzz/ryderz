import {getHeaders} from "../auth.js";
import createView from "../createView.js";

export default function CreateGroup() {
	//language=HTML
	return `<!DOCTYPE html>
    <html lang="html">
    <head>
        <meta charset="UTF-8"/>
        <title>Create Club</title>
    </head>
    <body>
    <div class="container createGroupDiv">
        <div class="row mt-4 text-center">
            <h1>Create Club</h1>
        </div>
        <div class="row justify-content-center">
			<div class="col-11">
                <form>
                    <label for="newGroupName">Name: <span
                            id="group-name"></span></label><br>
                    <input class="settingForm form-control" type="text" id="newGroupName" name="newGroupName">


                    <label for="newGroupBio" class="mt-2">Group Bio <span
                            id="group-bio"></span></label><br>
                    <textarea class="settingForm form-control mb-2" id="newGroupBio"
                              name="newGroupBio"></textarea>

                    <label for="newGroupLocation">Location: <span
                            id="group-location"></span></label><br>
                    <input class="settingForm form-control" type="text" id="newGroupLocation" name="newGroupLocation">


                    <p id="character-warning-on-submit"></p>
                    <button class="backToDiscover btn btn-dark mt-4">Back to discover</button>
                    <input id="newGroupSubmit" class="btn btn-dark groupGreenButton mt-4" type="button" value="Submit">
                </form>
			</div>
        </div>
    </div>

    </body>
	`
}

export function CreateGroupEvents() {
	createGroupSubmitListener();
	backToDiscoverBtn();
}

function backToDiscoverBtn() {
	$(".backToDiscover").click(function () {
		createView('/discover')
	})
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

		fetch(`${URI}/api/groups`, request)
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
