import {getHeaders} from "../auth.js";
import createView from "../createView.js";

export default function CreateEvent() {
	//language=HTML
	return `<!DOCTYPE html>
    <html lang="html">
    <head>
        <meta charset="UTF-8"/>
        <title>Create Event</title>
    </head>
    <body>
    <div class="container">
        <div class="row mt-4">
            <h1>Create Event</h1>
        </div>
        <div class="row">
            <form>
                <label for="newEventTitle">Title: <span
                        id="event-title"></span></label><br>
                <input class="form-control" type="text" id="newEventTitle" name="newEventTitle">
				
				
                <label for="newEventDescription" class="mt-2">Event Description<span
                        id="group-bio"></span></label><br>
                <textarea class="form-control mb-2" id="newEventDescription"
                          name="newEventDescription"></textarea>

                <label for="newEventLocation">Location: <span
                        id="event-location"></span></label><br>
                <input class="form-control" type="text" id="newEventLocation" name="newEventLocation">
				
				<label for="eventDate">Event Date
                <input type="date" id="eventDate" name="eventDate" value="2022-05-09">
                </label>
				
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
				
				<label for="startingLong">Starting Longitude</label>
				<input type="number" id="startingLong" name="startingLong">
				
				<label for="startingLatitude">Starting Latitude</label>
				<input type="number" id="startingLatitude" name="startingLatitude">
				
                <label for="endingLong">Ending Longitude</label>
                <input type="number" id="endingLong" name="endingLong">
				
                <label for="endingLatitude">Ending Latitude</label>
                <input type="number" id="endingLatitude" name="endingLatitude">

                <p id="character-warning-on-submit"></p>
                <input id="newEventBtn" class="btn btn-dark" type="button" value="Submit">
            </form>
        </div>
    </div>

    </body>
	`
}

export function CreateEventEvents() {
	createEventSubmitListener();
}

function createEventSubmitListener() {
	$("#newEventBtn").click(function () {
		const titleOfEvent = $("#newEventTitle").val();
		const descriptionOfEvent = $("#newEventDescription").val();
		const eventLocation = $("#newEventLocation").val();
		const eventDate = $("#eventDate").val();
		console.log(eventDate);
		const stateWhereEventTakesPlace = $("#states").val();
		const startingLongitude = $("#startingLong").val();
		const startingLatitude = $("#startingLatitude").val();
		const endingLongitude = $("#endingLong").val();
		const endingLatitude = $("#endingLatitude").val();

		if (!titleOfEvent || !descriptionOfEvent || !eventLocation || !eventDate || !startingLongitude || !startingLatitude || !endingLongitude || !endingLatitude) {
			$("#character-warning-on-submit").text("Fill all fields")
			return;
		}

		const newEvent = {
			startingLongitude,
			startingLatitude,
			endingLongitude,
			endingLatitude,
			eventDate,
			titleOfEvent,
			descriptionOfEvent,
			eventLocation,
			stateWhereEventTakesPlace
		}


		let request = {
			method: "POST",
			headers: getHeaders(),
			body: JSON.stringify(newEvent)
		}

		fetch(`http://localhost:8081/api/events`, request)
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
