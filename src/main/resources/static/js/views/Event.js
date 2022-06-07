import createView from "../createView.js";
import {getHeaders, userEmail} from "../auth.js";

export default function Event(props) {
	console.log(props);
	const timeFormat = getTimeFormat(props);
	// language=HTML
	let html = `<!DOCTYPE html>
    <html lang="html">
    <head>
        <meta charset="UTF-8"/>
        <title>Event</title>
    </head>
    <body>
    <div class="container eventContainer">
		<div class="row">
			<img class="event-bg-img" src="${props.event.eventImageUrl !== null ? props.event.eventImageUrl : "https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"}" alt="">
		</div>
        <div class="row mt-4 justify-content-center">
            <div class="col-md-7">
                <div class="eventTitles">
                    ${checkUserEventStatus(props)}
                </div>
                <div>
                    <div class="collapse" id="collapseExample">
						<p class="commentPostWarning"></p>
                        <div class="input-group my-3">
                            <input type="text" id="comment-content" class="form-control settingForm"
                                   data-postId="${props.event.id}" placeholder="Your thoughts..."
                                   aria-label="Comment"
                                   aria-describedby="button-addon">
                            <button class="comment-btn btn" data-id="${props.event.id}"
                                    type="button" id="button-addon">Submit
                            </button>
                        </div>
                    </div>
                    <div class="commentSection-${props.event.id} eventComments">
                        ${checkIfCommentsExist(props)}
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="eventCol mb-3">
                    ${eventColHTML(props, timeFormat)}
                </div>
                <div class="mb-3 singleEventPageEditForm">
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
	const OGCategories = $("#OGCategories").text().split(", ");
	const OGOrigin = $("#OGFrom").text();
	const OGDestination = $("#OGTo").text();

	backToDiscover();
	editEventBtn(OGState, OGStatusOfEvent, OGCategories);
	cancelEditsBtn();
	submitEditsBtn(OGTitle, OGDescription, OGLocation, OGEventDate, OGStatusOfEvent, OGState, OGCategories, OGOrigin, OGDestination);
	joinEventBtn();
	leaveEventBtn();
	commentOnEvent();
	deleteEventBtn();
	clickOnCommentAuthorName();
	initMap(OGOrigin, OGDestination);
	uploadEventImgHeader();

	flatpickr("#editedEventDate", {
		minDate: "today",
		maxDate: new Date().fp_incr(90),
		enableTime: true,
		dateFormat: "Y-m-d H:i",
	});
}

let map;

function initMap(OGOrigin, OGDestination) {
	let geocoder;
	geocoder = new google.maps.Geocoder();
	let map, infoWindow;
	let myLatLng = {lat: 39.8097343, lng: -98.5556199};

	infoWindow = new google.maps.InfoWindow();

	map = new google.maps.Map(document.getElementById("singleEventMap"), {
		center: {lat: 39.8097343, lng: -98.5556199},
		zoom: 10,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	//create a DirectionsService object to use the route method and get a result for our request
	var directionsService = new google.maps.DirectionsService();

//create a DirectionsRenderer object which we will use to display the route
	var directionsDisplay = new google.maps.DirectionsRenderer();

//bind the DirectionsRenderer to the map
	directionsDisplay.setMap(map);

	if (OGDestination === "") {

		function codeAddress() {
			var address = OGOrigin;
			geocoder.geocode( { 'address': address}, function(results, status) {
				if (status == 'OK') {
					map.setCenter(results[0].geometry.location);
					var marker = new google.maps.Marker({
						map: map,
						position: results[0].geometry.location
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
				origin: OGOrigin,
				destination: OGDestination,
				travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
				unitSystem: google.maps.UnitSystem.IMPERIAL
			}

			//pass the request to the route method
			directionsService.route(request, function (result, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					console.log(result);
					console.log(status);

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

		calcRoute();

	}




//create autocomplete objects for all inputs

	var input1 = document.getElementById("from");
	var autocomplete1 = new google.maps.places.Autocomplete(input1);

	var input2 = document.getElementById("to");
	var autocomplete2 = new google.maps.places.Autocomplete(input2);


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

		fetch(`${URI}/api/events/${eventId}/adduser`, request)
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

		fetch(`${URI}/api/events/${eventId}/remove-user`, request)
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
		let warningPTag = $(".commentPostWarning");
		comment.val("");

		if (content === "" || content === null || content.trim() === "") {
			warningPTag.text("No content in comment!");
			warningPTag.css("color", "red");
			return;
		}

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

		fetch(`${URI}/api/comments`, requestObject)
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

	fetch(`${URI}/api/events/${eventId}`, requestObject)
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
	let html = `<h1 class="text-white">${props.event.titleOfEvent}</h1>
    <h4 class="text-white">${props.event.descriptionOfEvent}</h4>`

	if (userEmail() === props.event.eventCreator.email) {
		html += ``;
	} else if (found && userEmail() !== props.event.eventCreator.email) {
		//language=HTML
		html += `
            <button class="leaveEvent btn btn-danger mx-3" data-id="${props.event.id}">Leave Event</button>`
	} else if (!found && userEmail() !== props.event.eventCreator.email) {
		html += `<button class="joinEventBtn btn btn-dark mx-3" data-id="${props.event.id}">Join Event</button>`
	}
	if (found || userEmail() === props.event.eventCreator.email) {
		//language=HTML
		html += `
            <button class="btn eventCommentCollapseBtn mx-3" type="button" data-bs-toggle="collapse"
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
	if (props.event.comments.length > 0) {
		//language=HTML
		let html = `
            <h1 class="text-white">Latest From This Event</h1>
            <div id="eventCommentsContainer">
                ${props.event.comments.reverse().map(comment =>
                        `<div class="card card-body p-2 m-3">
                        <div class="d-flex">
                            <div class="eventComment info d-flex">
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

		fetch(`${URI}/api/categories/all`)
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

function submitEditsBtn(OGTitle, OGDescription, OGLocation, OGEventDate, OGStatusOfEvent, OGState, OGCategories, OGOrigin, OGDestination) {
	$("#submitEditedEventBtn").click(function () {
		const eventId = $(this).data("id");
		const isSingleLocation = $(this).data("location");
		const titleOfEvent = $("#editedEventTitle").val();
		const descriptionOfEvent = $("#editedEventDescription").val();
		const eventLocation = $("#editedEventLocation").val();
		const dateTime = $("#editedEventDate").val();
		const eventDate = new Date(dateTime).getTime();
		const stateOfEvent = $('#eventStatus').val();
		const origin = $("#from").val();
		let destination = $("#to").val();

		if (isSingleLocation) {
			destination = "";
		}

		let selectedCategories = [];

		let checkCategories = [];

		$('input[type="checkbox"]:checked').each(function () {
			selectedCategories.push({name: this.value})
			checkCategories.push(this.value);

		});

		let warningPTag = $("#character-warning-on-submit");

		const categories = selectedCategories;

		if (OGDestination === "") {
			if (!titleOfEvent ||
				!descriptionOfEvent ||
				!eventLocation ||
				!eventDate ||
				!origin ||
				!stateOfEvent) {
				warningPTag.css("color", "red");
				warningPTag.text("Please fill in all fields!");
				return;
			} else {
				warningPTag.text("")
			}
		} else {
			if (!titleOfEvent ||
				!descriptionOfEvent ||
				!eventLocation ||
				!eventDate ||
				!origin ||
				!destination ||
				!stateOfEvent) {
				warningPTag.css("color", "red");
				warningPTag.text("Please fill in all fields!");
				return;
			} else {
				warningPTag.text("")
			}
		}

		const editedEvent = {
			titleOfEvent,
			descriptionOfEvent,
			eventLocation,
			eventDate,
			stateOfEvent,
			categories,
			origin,
			destination
		}


		let request = {
			method: "PUT",
			headers: getHeaders(),
			body: JSON.stringify(editedEvent)
		}

		fetch(`${URI}/api/events/${eventId}`, request)
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

		fetch(`${URI}/api/events/${eventId}`, requestObject)
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

        <p>State of event: <span class="stateOfEvent">${props.event.stateOfEvent}</span></p>
		
		<p>Route Details</p>
		
		<p>Miles: ${props.event.routeDistance}, Duration: ${props.event.routeDuration}, Summary: ${props.event.routeSummary}</p>
		
		`; if (props.event.isSingleLocationEvent) {
			html += `<p>Location: <span id="OGFrom">${props.event.origin}</span></p>`;
	} else {
			html+= `<p>Origin: <span id="OGFrom">${props.event.origin}</span></p>
					<p>Destination: <span id="OGTo">${props.event.destination}</span></p>`;
	}
	html+=`
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

            <input class="settingForm form-control" value="${props.event.titleOfEvent}" type="text" id="editedEventTitle"
                   name="newEventTitle">


            <label for="editedEventDescription" class="mt-2">Event Description<span
                    id="group-bio"></span></label><br>

            <textarea class="settingForm form-control mb-2" id="editedEventDescription"
                      name="newEventDescription">${props.event.descriptionOfEvent}</textarea>

            <label for="editedEventLocation">Location: <span
                    id="event-location"></span></label><br>

            <input class="settingForm form-control" type="text" id="editedEventLocation" name="newEventLocation"
                   value="${props.event.eventLocation}">

            <label class="mt-3" for="editedEventDate">Event Date
			<input type="datetime-local" class="settingForm form-control" id="editedEventDate" name="eventDate" value="${timeFormat}">
            </label>
            <div class="my-3 formCategories">

            </div>

            <label for="eventStatus">Choose a status</label>

            <select name="eventStatus" id="eventStatus">
                <option value="NOTSTARTED">NOT STARTED</option>
                <option value="INPROGRESS">IN PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
            </select>
			<br>
			<br>
			
			`; if (props.event.isSingleLocationEvent) {
					html+= `
						<label for="from">Origin</label>
						<input class="settingForm form-control" value="${props.event.origin}" type="text" id="from" name="from">`
				} else {
					html+= `
						<label for="from">Origin</label>
						<input class="settingForm form-control" value="${props.event.origin}" type="text" id="from" name="from">
			
						<label class="mt-3" for="to">Destination</label>
						<input class="settingForm form-control" value="${props.event.destination}" type="text" id="to" name="to">`
						}
						html+= `
    			        <p id="character-warning-on-submit"></p>
    			        <button class="btn" id="cancelEdits">Cancel Edits</button>
    			        <button class="btn" id="submitEditedEventBtn" data-id="${props.event.id}">Submit Changes</button>
    			        <button id="deleteEvent" data-id="${props.event.id}" data-location="${props.event.isSingleLocationEvent}" class="btn btn-danger">Delete Event</button>
    			        <h3>Change header image</h3>
            			<p id="file-warning-on-submit"></p>
            			<input class="fileUploadBtn mt-3" id="eventHeaderFile" type="file" accept="image/*">
						<button type="submit" class="groupGreenButton btn" data-id="${props.event.id}" id="submitEventHeaderImg">Change Image</button>
    			    </form>
	`

	return html;
}

function uploadEventImgHeader() {
	$("#submitEventHeaderImg").click(function () {
		let eventId = $(this).data("id");
		let file = document.getElementById("eventHeaderFile");
		let warningPTag = $("#file-warning-on-submit");
		let formData = new FormData();

		formData.append("file", file.files[0]);

		const requestObject = {
			method: "POST",
			body: formData
		}

		fetch(`${URI}/api/events/${eventId}/eventUpload`, requestObject)
			.then(res => {
				console.log(res.status)
				if (res.status !== 200) {
					console.log(res);
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