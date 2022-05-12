import createView from "../createView.js";
import {getHeaders, userEmail} from "../auth.js";

export default function Event(props) {
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
	const timeFormat = `${localTime.getFullYear()}-${month}-${date}T${hours}:${minutes}`;
	// language=HTML
	let html =  `<!DOCTYPE html>
    <html lang="html">
    <head>
        <meta charset="UTF-8"/>
        <title>${props.event.titleOfEvent}</title>
    </head>
    <body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col eventCol">
                <h1>Event</h1>
                <h4 class="event-name-${props.event.id}">Title: <span id="OGTitle">${props.event.titleOfEvent}</span></h4>
				
                <h5 class="event-location-${props.event.id}">Event Location:<span id="OGLocation">${props.event.eventLocation}</span></h5>
				
                <h5>Members: ${props.event.usersId.length}</h5>
				
                <p>Categories: <span id="OGCategories">${props.event.categories.map(category => `${category.name}`).join(", ")}</span></p>
				
                <p class="event-description-${props.event.id}">About: <span id="OGDescription">${props.event.descriptionOfEvent}</span></p>
				
                <p>Event Date: <span id="OGEventDate" data-id="${timeFormat}">${new Date(props.event.eventDate).toLocaleDateString()}
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
					html += `<button class="editEventBtn btn btn-dark">Edit Event</button>`
				}
                html += `<button class="backToDiscover btn btn-dark">Back to discover</button>
            </div>
            
            
            
            
            
            <div class="col singleEventPageEditForm">
            <h1>Edit your event</h1>
            <form>
                <label for="editedEventTitle">Title: <span
                        id="event-title"></span></label><br>
                        
                <input class="form-control" value="${props.event.titleOfEvent}" type="text" id="editedEventTitle" name="newEventTitle">
				
				
                <label for="editedEventDescription" class="mt-2">Event Description<span
                        id="group-bio"></span></label><br>
                        
                <textarea class="form-control mb-2" id="editedEventDescription"
                          name="newEventDescription">${props.event.descriptionOfEvent}</textarea>

                <label for="editedEventLocation">Location: <span
                        id="event-location"></span></label><br>
                        
                <input class="form-control" type="text" id="editedEventLocation" name="newEventLocation" value="${props.event.eventLocation}">
				
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
				<input value="${props.event.startingLatitude}" type="number" id="startingLatitude" name="startingLatitude">
				
                <label for="endingLong">Ending Longitude</label>
                <input value="${props.event.endingLongitude}" type="number" id="endingLong" name="endingLong">
				
                <label for="endingLatitude">Ending Latitude</label>
                <input value="${props.event.endingLatitude}" type="number" id="endingLatitude" name="endingLatitude">

                <p id="character-warning-on-submit"></p>
                <button class="btn btn-dark" id="cancelEdits">Cancel Edits</button>
                <input id="submitEditedEventBtn" data-id="${props.event.id}" class="btn btn-dark" type="button" value="Submit">
            </form>
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
	const OGEventDate= $("#OGEventDate").data("id");
	const OGStatusOfEvent = $(".stateOfEvent").text();
	const OGState = $("#OGState").text();
	const OGStartingLong = $("#OGStartLong").text();
	const OGStartingLat = $("#OGStartLat").text();
	const OGEndingLong = $("#OGEndLong").text();
	const OGEndingLat = $("#OGEndLat").text();
	const OGCategories = $("#OGCategories").text().split(", ");

	$(".backToDiscover").click(function () {
		createView('/discover')
	})

	$(".editEventBtn").click(function () {
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
					${data.map(cat =>
					`
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" ${OGCategories.includes(cat.name) ? "checked": ""} type="checkbox" id="category-${cat.id}" value="${cat.name}">
                                    <label class="form-check-label" for="category-${cat.id}">${cat.name}</label>
                                </div>
                            `)
					.join('')}
		
		`

				$(".formCategories").html(html)
			})
			.catch(error => {
				console.log(error);
			})
	})

	$("#cancelEdits").click(function () {
		$(".eventCol").css("display", "block");
		$(".singleEventPageEditForm").css("display", "none");
	})

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

		$('input[type="checkbox"]:checked').each(function() {
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
		){
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
			!endingLatitude)
		{
			warningPTag.css("color", "red");
			warningPTag.text("Please fill in all fields!");
			return;
		}else {
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