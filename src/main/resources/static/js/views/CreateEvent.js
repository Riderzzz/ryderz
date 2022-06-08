import {getHeaders} from "../auth.js";
import createView from "../createView.js";
import {enableSearchIfLogged} from "./Home.js";

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
        <div class="row justify-content-center my-4">
            <div class="col-md-6 createEventForm">
                <h1>Create Event</h1>
                <form>
                    <label for="newEventTitle">Title: <span
                            id="event-title"></span></label><br>
                    <input class="settingForm form-control" type="text" id="newEventTitle" name="newEventTitle">


                    <label for="newEventDescription" class="mt-2">Event Description<span
                            id="group-bio"></span></label><br>
                    <textarea class="settingForm form-control mb-2" id="newEventDescription"
                              name="newEventDescription"></textarea>

                    <label for="newEventLocation">Location: <span
                            id="event-location"></span></label><br>
                    <input class="settingForm form-control" type="text" id="newEventLocation" name="newEventLocation">

                    <label class="mt-4" for="eventDate">Event Date & Time
                        <input class="settingForm form-control" type="datetime-local" id="eventDate" name="eventDate">
                    </label>

                    <div class="my-3">
						<h3>Choose Categories</h3>
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
                    <label class="mt-4" id="originLocation" for="origin">Origin</label>
                    <input class="settingForm form-control" type="text" id="from" name="origin"><br>

                    <label id="labelForDestination" for="destination">Destination</label>
                    <input class="settingForm form-control" type="text" id="to" name="destination">
					<p class="eventMilesPTag mt-3">Miles: <span class="eventMiles"></span></p>
					<p class="eventDurationPTag">Duration: <span class="eventDuration"></span></p>
					<p class="eventSummaryPTag">Summary: <span class="eventSummary"></span></p>

                    <p id="character-warning-on-submit"></p>
                    <button id="createRoute" class="btn mt-3" type="button">Show Route</button>
                    <button class="backToDiscover btn mt-3">Back to discover</button>
                    <input id="newEventBtn" class="btn settingForm mt-3" type="button" value="Submit">
                </form>
            </div>
            <div class="col-md-6 createEventMapContainer">
                <div id="createEventMap"></div>
            </div>
        </div>
    </div>

    </body>
	`
	return html
}

export function CreateEventEvents() {
	backToDiscoverBtn();
	initMap();
	checkBoxSingleLocation();

	enableSearchIfLogged()

	flatpickr("#eventDate", {
		minDate: "today",
		maxDate: new Date().fp_incr(90),
		enableTime: true,
		dateFormat: "Y-m-d H:i",
	});
}

let map;

function initMap() {
	let map, infoWindow;
	let myLatLng = {lat: 39.8097343, lng: -98.5556199};

	infoWindow = new google.maps.InfoWindow();

	map = new google.maps.Map(document.getElementById("createEventMap"), {
		center: {lat: 39.8097343, lng: -98.5556199},
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		styles: [
			{ elementType: "geometry", stylers: [{ color: "#181818" }] },
			{ elementType: "labels.text.stroke", stylers: [{ color: "#000000" }] },
			{ elementType: "labels.text.fill", stylers: [{ color: "#709775" }] },
			{
				featureType: "administrative.locality",
				elementType: "labels.text.fill",
				stylers: [{ color: "#709775" }],
			},
			{
				featureType: "poi",
				elementType: "labels.text.fill",
				stylers: [{ color: "#709775" }],
			},
			{
				featureType: "poi.park",
				elementType: "geometry",
				stylers: [{ color: "#263c3f" }],
			},
			{
				featureType: "poi.park",
				elementType: "labels.text.fill",
				stylers: [{ color: "#6b9a76" }],
			},
			{
				featureType: "road",
				elementType: "geometry",
				stylers: [{ color: "#38414e" }],
			},
			{
				featureType: "road",
				elementType: "geometry.stroke",
				stylers: [{ color: "#212a37" }],
			},
			{
				featureType: "road",
				elementType: "labels.text.fill",
				stylers: [{ color: "#9ca5b3" }],
			},
			{
				featureType: "road.highway",
				elementType: "geometry",
				stylers: [{ color: "#606060" }],
			},
			{
				featureType: "road.highway",
				elementType: "geometry.stroke",
				stylers: [{ color: "#1f2835" }],
			},
			{
				featureType: "road.highway",
				elementType: "labels.text.fill",
				stylers: [{ color: "#f3d19c" }],
			},
			{
				featureType: "transit",
				elementType: "geometry",
				stylers: [{ color: "#2f3948" }],
			},
			{
				featureType: "transit.station",
				elementType: "labels.text.fill",
				stylers: [{ color: "#709775" }],
			},
			{
				featureType: "water",
				elementType: "geometry",
				stylers: [{ color: "#17263c" }],
			},
			{
				featureType: "water",
				elementType: "labels.text.fill",
				stylers: [{ color: "#515c6d" }],
			},
			{
				featureType: "water",
				elementType: "labels.text.stroke",
				stylers: [{ color: "#17263c" }],
			},
		]



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
let distance;
let duration;
let summary;

//define calcRoute function
	async function calcRoute() {
		//create request
		var request = {
			origin: document.getElementById("from").value,
			destination: document.getElementById("to").value,
			travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
			unitSystem: google.maps.UnitSystem.IMPERIAL
		}

		//pass the request to the route method
		await directionsService.route(request, function (result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				console.log(result);
				console.log(status);
				console.log(result.routes[0].legs[0].distance.text)
				distance = result.routes[0].legs[0].distance.text;
				console.log(distance);
				console.log(result.routes[0].legs[0].duration.text)
				duration = result.routes[0].legs[0].duration.text;
				console.log(result.routes[0].summary)
				summary = result.routes[0].summary;
				$(".eventMiles").text(distance);
				$(".eventDuration").text(duration);
				$(".eventSummary").text(summary);

				//Get distance and time
				// const output = document.querySelector('#output');
				// output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";

				//display route
				directionsDisplay.setDirections(result);
				return result;
			} else {
				$("#character-warning-on-submit").text("Error creating route, please check location inputs!");
				$("#character-warning-on-submit").css("color", "red");
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
		calcRoute();
	})

	$("#newEventBtn").click(async function () {
		let results = await calcRoute();
			const warningTag = $("#character-warning-on-submit");
			const titleOfEvent = $("#newEventTitle").val();
			const descriptionOfEvent = $("#newEventDescription").val();
			const eventLocation = $("#newEventLocation").val();
			const dateTime = $("#eventDate").val();
			const eventDate = new Date(dateTime).getTime();
			const origin = $("#from").val();
			const destination = $("#to").val();
			const isSingleLocationEvent = document.getElementById('singleLocation').checked;

			let routeDistance = distance;
			let routeDuration = duration;
			let routeSummary = summary;

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
				categories,
				routeDistance,
				routeDuration,
				routeSummary
			}


			let request = {
				method: "POST",
				headers: getHeaders(),
				body: JSON.stringify(newEvent)
			}

			fetch(`${URI}/api/events`, request)
				.then(res => {
					console.log(res.status);
					createView("/discover");
				})
				.catch(error => {
					const warningTag = $("#character-warning-on-submit");
					warningTag.text("Error creating event!");
					warningTag.css("color", "red");
					console.log(error);
				})

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
			$("#createRoute").css("display", "none");
			$(".eventMilesPTag").css("display", "none");
			$(".eventDurationPTag").css("display", "none");
			$(".eventSummaryPTag").css("display", "none");
		} else {
			$("#originLocation").text("Origin");
			$("#labelForDestination").css('display', 'block');
			$("#to").css('display', 'block');
			$("#createRoute").css("display", "inline");
			$(".eventMilesPTag").css("display", "block");
			$(".eventDurationPTag").css("display", "block");
			$(".eventSummaryPTag").css("display", "block");
		}
	})
}
