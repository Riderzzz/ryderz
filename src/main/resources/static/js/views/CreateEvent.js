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
            <div class="col-md-6">
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

					<label for="singleLocation">Single Location Event</label>
					<input type="checkbox" id="singleLocation"><br>
                    <label id="originLocation" for="origin">Origin</label>
                    <input type="text" id="from" name="origin"><br>

                    <label id="labelForDestination" for="destination">Destination</label>
                    <input type="text" id="to" name="destination">

                    <p id="character-warning-on-submit"></p>
                    <button id="createRoute" class="btn btn-dark" type="button">Show Route</button>
                    <button class="backToDiscover btn btn-dark">Back to discover</button>
                    <input id="newEventBtn" class="btn btn-dark" type="button" value="Submit">
                </form>
            </div>
            <div class="col-md-6">
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
	checkBoxSingleLocation();
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

	var input1 = document.getElementById("from");
	var autocomplete1 = new google.maps.places.Autocomplete(input1);

	var input2 = document.getElementById("to");
	var autocomplete2 = new google.maps.places.Autocomplete(input2);

	$("#createRoute").click(function () {
		calcRoute()
	})

}

function backToDiscoverBtn() {
	$(".backToDiscover").click(function () {
		createView('/discover')
	})
}

function checkBoxSingleLocation() {
	$("#singleLocation").click(function () {
		if (document.getElementById('singleLocation').checked) {
			$("#originLocation").text("Location");
			$("#labelForDestination").css('display', 'none');
			$("#to").css('display', 'none');
		} else {
			$("#originLocation").text("Origin");
			$("#labelForDestination").css('display', 'block');
			$("#to").css('display', 'block');
		}
	})
}

function createEventSubmitListener() {
	$("#newEventBtn").click(function () {
		const warningTag = $("#character-warning-on-submit");
		const titleOfEvent = $("#newEventTitle").val();
		const descriptionOfEvent = $("#newEventDescription").val();
		const eventLocation = $("#newEventLocation").val();
		const dateTime = $("#eventDate").val();
		const eventDate = new Date(dateTime).getTime();
		const origin = $("#from").val();
		const destination = $("#to").val();
		const isSingleLocationEvent = document.getElementById('singleLocation').checked;

		if (isSingleLocationEvent) {
			if (!titleOfEvent || !descriptionOfEvent || !eventLocation || !eventDate || !origin) {
				warningTag.text("Fill all fields");
				warningTag.css('color', 'red');
				return;
			}
		} else {
			if (!titleOfEvent || !descriptionOfEvent || !eventLocation || !eventDate || !origin || !destination) {
				warningTag.text("Fill all fields");
				warningTag.css('color', 'red');
				return;
			}
		}



		let selectedCategories = [];

		$('input[type="checkbox"]:checked').each(function () {
			console.log(this.value);
			selectedCategories.push({name: this.value})

		});

		const categories = selectedCategories;

		console.log(selectedCategories)

		const newEvent = {
			origin,
			destination,
			isSingleLocationEvent,
			eventDate,
			titleOfEvent,
			descriptionOfEvent,
			eventLocation,
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
