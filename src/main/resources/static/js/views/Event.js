import createView from "../createView.js";
import {getHeaders, userEmail} from "../auth.js";

export default function Event(props) {
	const timeFormat = getTimeFormat(props);
	// language=HTML
	let html = `<!DOCTYPE html>
    <html lang="html">
    <head>
        <meta charset="UTF-8"/>
        <title>Event</title>
    </head>
    <body>
    <div class="container">
        <div class="row mt-4 justify-content-center">
            <div class="col-md-7">
                <div>
                    ${checkUserEventStatus(props)}
                </div>
                <div>
                    <div class="collapse" id="collapseExample">
                        <div class="input-group my-3">
                            <input type="text" id="comment-content" class="form-control"
                                   data-postId="${props.event.id}" placeholder="Your thoughts..."
                                   aria-label="Comment"
                                   aria-describedby="button-addon">
                            <button class="btn btn-dark comment-btn" data-id="${props.event.id}"
                                    type="button" id="button-addon">Submit
                            </button>
                        </div>
                    </div>
                    <div class="commentSection-${props.event.id}">
                        ${checkIfCommentsExist(props)}
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="eventCol border border-dark">
                    ${eventColHTML(props, timeFormat)}
                </div>
                <div class="singleEventPageEditForm">
                    ${eventEditFormHTML(props, timeFormat)}
                </div>
                <div id="singleEventMap"></div>
            </div>
        </div>
    </div>
    </body>
    </html>`;
	return html;
}

export function EventEvents() {
	// previous field input variables
	const OGTitle = $("#OGTitle").text();
	const OGDescription = $("#OGDescription").text();
	const OGLocation = $("#OGLocation").text();
	const OGEventDate = $("#OGEventDate").data("id");
	const OGStatusOfEvent = $(".stateOfEvent").text();
	const OGState = $("#OGState").text();
	const OGStartingLong = $("#OGStartLong").text();
	const OGStartingLat = $("#OGStartLat").text();
	const OGEndingLong = $("#OGEndLong").text();
	const OGEndingLat = $("#OGEndLat").text();
	const OGCategories = $("#OGCategories").text().split(", ");

	backToDiscover();
	editEventBtn(OGState, OGStatusOfEvent, OGCategories);
	cancelEditsBtn();
	submitEditsBtn(OGTitle, OGDescription, OGLocation, OGEventDate, OGStatusOfEvent, OGState, OGStartingLong, OGStartingLat, OGEndingLong, OGEndingLat, OGCategories);
	joinEventBtn();
	leaveEventBtn();
	commentOnEvent();
	deleteEventBtn();
	clickOnCommentAuthorName();
	initMap();
}

let map;

function initMap() {
	let map, infoWindow;

	infoWindow = new google.maps.InfoWindow();

	map = new google.maps.Map(document.getElementById("singleEventMap"), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 8,
	});

	var directionsService = new google.maps.DirectionsService();
	var directionsRenderer = new google.maps.DirectionsRenderer();


}

function getTimeFormat(props) {
	const timeString = new Date(props.event.eventDate.toLocaleString().substring(29, -1));
	const parsedTime = Date.parse(timeString);
	const localTime = new Date(parsedTime)

	let month = localTime.getMonth() + 1;
	let date = localTime.getDate();
	let hours = localTime.getHours();
	let minutes = localTime.getMinutes();
	if (localTime.getMonth() < 10) {
		month = "0" + month;
	}
	if (localTime.getDate() < 10) {
		date = "0" + date;
	}
	if (localTime.getHours() < 10) {
		hours = "0" + hours;
	}
	if (localTime.getMinutes() < 10) {
		minutes = "0" + minutes;
	}
	return `${localTime.getFullYear()}-${month}-${date}T${hours}:${minutes}`;
}

function backToDiscover() {
	$(".backToDiscover").click(function () {
		createView('/discover')
	})
}

function joinEventBtn() {
	$(".joinEventBtn").click(function () {
		const eventId = $(this).data("id");
		console.log(eventId);

		let warningPTag = $("#character-warning-on-submit");

		let request = {
			method: "PUT",
			headers: getHeaders()
		}

		fetch(`http://localhost:8081/api/events/${eventId}/adduser`, request)
			.then(res => {
				console.log(res.status)
				if (res.status !== 200) {
					console.log(res);
					warningPTag.text("Error submitting changes!");
					warningPTag.css("color", "red");
					return;
				}
				createView('/event', eventId);
			})
			.catch(error => {
				console.log(error);
				warningPTag.text("Error submitting changes!");
				warningPTag.css("color", "red");
			})
	})
}

function leaveEventBtn() {
	$(".leaveEvent").click(function () {
		const eventId = $(this).data("id");
		console.log(eventId);

		let warningPTag = $("#character-warning-on-submit");

		let request = {
			method: "DELETE",
			headers: getHeaders()
		}

		fetch(`http://localhost:8081/api/events/${eventId}/remove-user`, request)
			.then(res => {
				console.log(res.status)
				if (res.status !== 200) {
					console.log(res);
					warningPTag.text("Error submitting changes!");
					warningPTag.css("color", "red");
					return;
				}
				createView('/event', eventId);
			})
			.catch(error => {
				console.log(error);
				warningPTag.text("Error submitting changes!");
				warningPTag.css("color", "red");
			})
	})
}

function commentOnEvent() {
	$(".comment-btn").click(function () {
		let comment = $("#comment-content");
		const eventId = $(this).data("id");
		let content = comment.val();
		let warningPTag = $("#character-warning-on-submit");
		comment.val("");

		const commentObject = {
			content,
			event: {
				id: eventId
			}
		}

		const requestObject = {
			method: "POST",
			headers: getHeaders(),
			body: JSON.stringify(commentObject)
		}

		fetch(`http://localhost:8081/api/comments`, requestObject)
			.then(res => {
				console.log(res.status)
				if (res.status !== 200) {
					console.log(res);
					return;
				}
				refreshComments(eventId)
			})
			.catch(error => {
				console.log(error);
				warningPTag.text("Error submitting changes!");
				warningPTag.css("color", "red");
			})
	})
}

function refreshComments(eventId) {
	let commentSection = $(".commentSection-" + eventId);

	let warningPTag = $(".warningReloadingComments");

	const requestObject = {
		method: "GET",
		headers: getHeaders()
	}

	fetch(`http://localhost:8081/api/events/${eventId}`, requestObject)
		.then(res => res.json())
		.then(data => {
			let state = {event: data}
			commentSection.html(checkIfCommentsExist(state));
		})
		.catch(error => {
			console.log(error);
			warningPTag.text("Error reloading comments!");
			warningPTag.css("color", "red");
		})
}

function cancelEditsBtn() {
	$("#cancelEdits").click(function () {
		$(".eventCol").css("display", "block");
		$(".singleEventPageEditForm").css("display", "none");
	})
}

function clickOnCommentAuthorName() {
	$(".commentATag").click(function () {
		let commentAuthorID = $(this).data("id");

		createView("/profile", commentAuthorID);
	})
}

function checkUserEventStatus(props) {
	let found = false;
	if (props.event.usersId.length > 0) {
		props.event.usersId.forEach(user => {
			if (user.email === userEmail()) {
				found = true;
			}
		})
	}
	let html = `<h1>${props.event.titleOfEvent}</h1>
    <h4>${props.event.descriptionOfEvent}</h4>`

	if (userEmail() === props.event.eventCreator.email) {
		html += ``;
	} else if (found && userEmail() !== props.event.eventCreator.email) {
		//language=HTML
		html += `
            <button class="leaveEvent btn btn-danger" data-id="${props.event.id}">Leave Event</button>`
	} else if (!found && userEmail() !== props.event.eventCreator.email) {
		html += `<button class="joinEventBtn btn btn-dark" data-id="${props.event.id}">Join Event</button>`
	}
	if (found || userEmail() === props.event.eventCreator.email) {
		//language=HTML
		html += `
            <button class="btn btn-dark" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseExample" aria-expanded="false"
                    aria-controls="collapseExample">
                Comment
            </button>`
	} else {
		html += `<button class="btn btn-dark" disabled>Join to comment</button>`
	}

	return html;
}

function checkIfCommentsExist(props) {
	let html;
	console.log(props);
	if (props.event.comments.length > 0) {
		//language=HTML
		let html = `
            <h1>Latest From This Event</h1>
            <div id="eventCommentsContainer">
                ${props.event.comments.reverse().map(comment =>
                        `<div class="card card-body p-2 m-3">
                        <div class="d-flex">
                            <div class="info d-flex">
<!--                            TODO: add delete icon to delete comment-->
								<a class="commentATag" data-id="${comment.author.id}">
                                <div class="pic"><img class="event-comment-profile-pic" src="${comment.author.userPhotoUrl}" alt=""></div>
                                </a>
                                <div class="ms-2 names">
                                	<a class="commentATag" data-id="${comment.author.id}">
                                    	<div class="username">${comment.author.username}</div>
                                    </a>
                                    <div class="content">${comment.content}</div>
                                </div>
                                <div class="deleteIcon ml-auto"><i class="bi bi-x-square-fill"></i></div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
		`
		return html
	} else {
		//language=HTML
		return html = `
            <h2>Be the first to comment!</h2>
		`
	}
}

function editEventBtn(OGState, OGStatusOfEvent, OGCategories) {
	$(".editEventBtn").click(function () {
		//Auto select options from original event
		$("#states").val(OGState).prop('selected', 'true');
		$("#eventStatus").val(OGStatusOfEvent).prop('selected', 'true');

		//hide original event, show form to edit
		$(".eventCol").css("display", "none");
		$(".singleEventPageEditForm").css("display", "block");


		//call fetch to get all categories
		// "/api/categories/all"
		let request = {
			method: "GET",
			headers: getHeaders()
		}

		fetch(`http://localhost:8081/api/categories/all`)
			.then(res => res.json())
			.then(data => {
				console.log(data)
				//feed categories to form
				let html = `
					${data.map(cat => `
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" ${OGCategories.includes(cat.name) ? "checked" : ""} type="checkbox" id="category-${cat.id}" value="${cat.name}">
                                    <label class="form-check-label" for="category-${cat.id}">${cat.name}</label>
                                </div>
                            `)
					.join('')}`
				$(".formCategories").html(html)
			})
			.catch(error => {
				console.log(error);
			})
	})
}

function submitEditsBtn(OGTitle, OGDescription, OGLocation, OGEventDate, OGStatusOfEvent, OGState, OGStartingLong, OGStartingLat, OGEndingLong, OGEndingLat, OGCategories) {
	$("#submitEditedEventBtn").click(function () {
		const eventId = $(this).data("id");
		const titleOfEvent = $("#editedEventTitle").val();
		const descriptionOfEvent = $("#editedEventDescription").val();
		const eventLocation = $("#editedEventLocation").val();
		const dateTime = $("#editedEventDate").val();
		const eventDate = new Date(dateTime).getTime();
		const stateOfEvent = $('#eventStatus').val();
		const stateWhereEventTakesPlace = $('#states').val();
		const startingLongitude = $("#startingLong").val();
		const startingLatitude = $("#startingLatitude").val();
		const endingLongitude = $("#endingLong").val();
		const endingLatitude = $("#endingLatitude").val();

		let selectedCategories = [];

		let checkCategories = [];

		$('input[type="checkbox"]:checked').each(function () {
			selectedCategories.push({name: this.value})
			checkCategories.push(this.value);

		});

		let warningPTag = $("#character-warning-on-submit");

		const categories = selectedCategories;

		if (OGTitle === titleOfEvent &&
			OGDescription === descriptionOfEvent &&
			OGLocation === eventLocation &&
			OGEventDate === dateTime &&
			OGStatusOfEvent === stateOfEvent &&
			OGState === stateWhereEventTakesPlace &&
			OGStartingLong === startingLongitude &&
			OGStartingLat === startingLatitude &&
			OGEndingLong === endingLongitude &&
			OGEndingLat === endingLatitude &&
			OGCategories.toString() === checkCategories.toString()
		) {
			warningPTag.css("color", "red");
			warningPTag.text("No changes were made!");
			return;
		} else {
			warningPTag.text("");
		}

		if (!titleOfEvent ||
			!descriptionOfEvent ||
			!eventLocation ||
			!eventDate ||
			!stateOfEvent ||
			!stateWhereEventTakesPlace ||
			!startingLongitude ||
			!startingLatitude ||
			!endingLongitude ||
			!endingLatitude) {
			warningPTag.css("color", "red");
			warningPTag.text("Please fill in all fields!");
			return;
		} else {
			warningPTag.text("")
		}

		const editedEvent = {
			titleOfEvent,
			descriptionOfEvent,
			eventLocation,
			eventDate,
			stateOfEvent,
			stateWhereEventTakesPlace,
			startingLongitude,
			startingLatitude,
			endingLongitude,
			endingLatitude,
			categories
		}


		let request = {
			method: "PUT",
			headers: getHeaders(),
			body: JSON.stringify(editedEvent)
		}

		fetch(`http://localhost:8081/api/events/${eventId}`, request)
			.then(res => {
				console.log(res.status)
				if (res.status !== 200) {
					console.log(res);
					warningPTag.text("Error submitting changes!");
					warningPTag.css("color", "red");
				}
				createView('/event', eventId);
			})
			.catch(error => {
				console.log(error);
				warningPTag.text("Error submitting changes!");
				warningPTag.css("color", "red");
			})

	})
}

function deleteEventBtn() {
	$("#deleteEvent").click(function () {
		let eventId = $(this).data("id");
		let warningPTag = $("#character-warning-on-submit");

		if (confirm("Delete this event?") === false) {
			return;
		}

		const requestObject = {
			method: "DELETE",
			headers: getHeaders()
		}

		fetch(`http://localhost:8081/api/events/${eventId}`, requestObject)
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

function eventColHTML(props, timeFormat) {
	//language=HTML
	let html = `
        <h4 class="event-name-${props.event.id}">Title: <span id="OGTitle">${props.event.titleOfEvent}</span></h4>

        <h5 class="event-location-${props.event.id}">Event Location:<span
                id="OGLocation">${props.event.eventLocation}</span></h5>

        <h5>Members: ${props.event.usersId.length}</h5>

        <p>Categories: <span
                id="OGCategories">${props.event.categories.map(category => `${category.name}`).join(", ")}</span></p>

        <p style="display: none" class="event-description-${props.event.id}">About: <span
                id="OGDescription">${props.event.descriptionOfEvent}</span></p>

        <p>Event Date: <span id="OGEventDate"
                             data-id="${timeFormat}">${new Date(props.event.eventDate).toLocaleDateString()}
		${new Date(props.event.eventDate).toLocaleTimeString()}</span></p>

        <p class="event-dateTime">Created: ${new Date(props.event.createdDate).toLocaleDateString()}</p>

        <p class="event-owner-${props.event.id}">Organizer: ${props.event.eventCreator.username}</p>

        <p>Starting Longitude: <span id="OGStartLong">${props.event.startingLongitude}</span></p>
        <p>Starting Latitude: <span id="OGStartLat">${props.event.startingLatitude}</span></p>
        <p>Ending Longitude: <span id="OGEndLong">${props.event.endingLongitude}</span></p>
        <p>Ending Latitude: <span id="OGEndLat">${props.event.endingLatitude}</span></p>

        <p>State of event: <span class="stateOfEvent">${props.event.stateOfEvent}</span></p>

        <p>US State: <span id="OGState">${props.event.stateWhereEventTakesPlace}</span></p>
	`
	if (userEmail() === props.event.eventCreator.email) {
		html += `<button class= "editEventBtn btn btn-dark">Edit Event</button>`
	}
	return html;
}

function eventEditFormHTML(props, timeFormat) {
	//language=HTML
	let html = `
        <h1>Edit your event</h1>
        <form>
            <label for="editedEventTitle">Title: <span
                    id="event-title"></span></label><br>

            <input class="form-control" value="${props.event.titleOfEvent}" type="text" id="editedEventTitle"
                   name="newEventTitle">


            <label for="editedEventDescription" class="mt-2">Event Description<span
                    id="group-bio"></span></label><br>

            <textarea class="form-control mb-2" id="editedEventDescription"
                      name="newEventDescription">${props.event.descriptionOfEvent}</textarea>

            <label for="editedEventLocation">Location: <span
                    id="event-location"></span></label><br>

            <input class="form-control" type="text" id="editedEventLocation" name="newEventLocation"
                   value="${props.event.eventLocation}">

            <label for="editedEventDate">Event Date

                <input type="datetime-local" id="editedEventDate" name="eventDate" value="${timeFormat}">
            </label>

            <div class="mb-3 formCategories">

            </div>

            <label for="states">Choose a state</label>

            <select name="states" id="states">
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="DC">District Of Columbia</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
            </select>

            <label for="eventStatus">Choose a status</label>

            <select name="eventStatus" id="eventStatus">
                <option value="NOTSTARTED">NOT STARTED</option>
                <option value="INPROGRESS">IN PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
            </select>

            <label for="startingLong">Starting Longitude</label>
            <input value="${props.event.startingLongitude}" type="number" id="startingLong" name="startingLong">

            <label for="startingLatitude">Starting Latitude</label>
            <input value="${props.event.startingLatitude}" type="number" id="startingLatitude"
                   name="startingLatitude">

            <label for="endingLong">Ending Longitude</label>
            <input value="${props.event.endingLongitude}" type="number" id="endingLong" name="endingLong">

            <label for="endingLatitude">Ending Latitude</label>
            <input value="${props.event.endingLatitude}" type="number" id="endingLatitude"
                   name="endingLatitude">

            <p id="character-warning-on-submit"></p>
            <button class="btn btn-dark" id="cancelEdits">Cancel Edits</button>
            <input id="submitEditedEventBtn" data-id="${props.event.id}" class="btn btn-dark" type="button"
                   value="Submit">
            <button id="deleteEvent" data-id="${props.event.id}" class="btn btn-danger">Delete Event</button>
        </form>
	`

	return html;
}