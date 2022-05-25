import {getHeaders} from "../auth.js";
import createView from "../createView.js";

export default function CreateEvent(props) {
	//language=HTML
	let html = `<!DOCTYPE html>
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
            <div class="col">
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
                        <input type="datetime-local" id="eventDate" name="eventDate">
                    </label>

                    <div class="mb-3">
                        ${props.categories.map(cat =>
                                `
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" id="category-${cat.id}" value="${cat.name}">
                                    <label class="form-check-label" for="category-${cat.id}">${cat.name}</label>
                                </div>
                            `)
                                .join('')}
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

                    <label for="origin">Origin</label>
                    <input type="text" id="from" name="origin">

                    <label for="destination">Destination</label>
                    <input type="text" id="to" name="destination">

                    <p id="character-warning-on-submit"></p>
                    <button id="createRoute" class="btn btn-dark" type="button">Show Route</button>
                    <button class="backToDiscover btn btn-dark">Back to discover</button>
                    <input id="newEventBtn" class="btn btn-dark" type="button" value="Submit">
                </form>
            </div>
            <div class="col">
                <div id="createEventMap"></div>
            </div>
        </div>
    </div>

    </body>
	`
	return html
}

export function CreateEventEvents() {
	createEventSubmitListener();
	backToDiscoverBtn();
	initMap();
}

let map;

function initMap() {
	let map, infoWindow;
	let myLatLng = {lat: 38.3460, lng: -0.4907};

	infoWindow = new google.maps.InfoWindow();

	map = new google.maps.Map(document.getElementById("createEventMap"), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.ROADMAP

	});

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				};

				infoWindow.setPosition(pos);
				infoWindow.setContent("Location found.");
				infoWindow.open(map);
				map.setCenter(pos);
			},
			() => {
				handleLocationError(true, infoWindow, map.getCenter());
			}
		);
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}

	function handleLocationError(browserHasGeolocation, infoWindow, pos) {
		infoWindow.setPosition(pos);
		infoWindow.setContent(
			browserHasGeolocation
				? "Error: The Geolocation service failed."
				: "Error: Your browser doesn't support geolocation."
		);
		infoWindow.open(map);
	}

	//create a DirectionsService object to use the route method and get a result for our request
	var directionsService = new google.maps.DirectionsService();

//create a DirectionsRenderer object which we will use to display the route
	var directionsDisplay = new google.maps.DirectionsRenderer();

//bind the DirectionsRenderer to the map
	directionsDisplay.setMap(map);


//define calcRoute function
	function calcRoute() {
		//create request
		var request = {
			origin: document.getElementById("from").value,
			destination: document.getElementById("to").value,
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


//create autocomplete objects for all inputs
	var options = {
		types: ['(cities)']
	}

	var input1 = document.getElementById("from");
	var autocomplete1 = new google.maps.places.Autocomplete(input1, options);

	var input2 = document.getElementById("to");
	var autocomplete2 = new google.maps.places.Autocomplete(input2, options);

	$("#createRoute").click(function () {
		calcRoute()
	})

}

function backToDiscoverBtn() {
	$(".backToDiscover").click(function () {
		createView('/discover')
	})
}

function createEventSubmitListener() {
	$("#newEventBtn").click(function () {
		const titleOfEvent = $("#newEventTitle").val();
		const descriptionOfEvent = $("#newEventDescription").val();
		const eventLocation = $("#newEventLocation").val();
		const dateTime = $("#eventDate").val();
		const eventDate = new Date(dateTime).getTime();
		const stateWhereEventTakesPlace = $("#states").val();
		const startingLongitude = $("#startingLong").val();
		const startingLatitude = $("#startingLatitude").val();
		const endingLongitude = $("#endingLong").val();
		const endingLatitude = $("#endingLatitude").val();

		if (!titleOfEvent || !descriptionOfEvent || !eventLocation || !eventDate || !startingLongitude || !startingLatitude || !endingLongitude || !endingLatitude) {
			$("#character-warning-on-submit").text("Fill all fields")
			return;
		}

		let selectedCategories = [];

		$('input[type="checkbox"]:checked').each(function () {
			console.log(this.value);
			selectedCategories.push({name: this.value})

		});

		const categories = selectedCategories;

		console.log(selectedCategories)

		const newEvent = {
			startingLongitude,
			startingLatitude,
			endingLongitude,
			endingLatitude,
			eventDate,
			titleOfEvent,
			descriptionOfEvent,
			eventLocation,
			stateWhereEventTakesPlace,
			categories
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
