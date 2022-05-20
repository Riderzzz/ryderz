import createView from "../createView.js";

export default function Discover(props) {
	console.log(props)
	// language=html
	return `<!DOCTYPE html>
    <html lang="html">
    <head>
        <meta charset="UTF-8"/>
        <title>Discover</title>
    </head>
    <body>
    <div class="container">
        <div class="row">
            <div class="col-md-8 justify-content-center">
                <h1 class="mt-2">Discover</h1>
            </div>
            <div class="col-md-4">
                <button class="btn btn-dark mt-3 mx-2 createGroupBtn">Create Group</button>
                <button class="btn btn-dark mt-3 mx-2 createEventBtn">Create Event</button>
            </div>
        </div>
        <div class="row justify-content-center mt-4">
            <div class="col">
                <nav class="container">
                    <div class="row nav nav-tabs" id="nav-tab" role="tablist">
                        <button class="col-4 nav-link active" id="nav-home-tab" data-bs-toggle="tab"
                                data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home"
                                aria-selected="true">Groups
                        </button>
                        <button class="col-4 nav-link" id="nav-profile-tab" data-bs-toggle="tab"
                                data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile"
                                aria-selected="false">Events
                        </button>
                    </div>
                </nav>
                <div class="tab-content" id="nav-tabContent">
                    <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                        <h3 class="text-center mt-3">Groups</h3>
                        <div id="groups-container" class="row justify-content-center">
                            ${props.groups.reverse().map(group =>
									`
			<div class="col-3">
			<a class="groupDiv" data-id="${group.id}">
			<div class=" shadow text-dark bg-light form-holder m-2 rounded p-4" data-id="${group.id}">
           		<h4 class="group-name-${group.id}">${group.name}</h4>
           		<h5 class="group-location-${group.id}">${group.location}</h5>
           		<h5>Members: ${group.users.length}</h5>
           		<p class="group-content-${group.id}">${group.bio}</p>
           	
           		<p class="group-createdDate">${new Date(group.createdDate).toLocaleTimeString()} ${new Date(group.createdDate).toLocaleDateString()}</p>
           		<p class="group-owner-${group.id}">Organizer: ${group.groupOwner.username}</p>
			<button class="btn btn-dark group-page-btn" data-id="${group.id}">Go to Group page</button>
			</div>
			</a>
			</div>
        `)
                                    .join('')}
                        </div>
                    </div>
                    <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                        <h3 class="text-center mt-3">Events</h3>

                        <div id="groups-container" class="row justify-content-center">
                            ${props.events.reverse().map(event =>
                                    `
			<div class="col-3">
			<a class="eventDiv" data-id="${event.id}">
			<div class="shadow text-dark bg-light form-holder m-3 rounded p-4" data-id="${event.id}">
           		<h4 class="event-name-${event.id}">${event.titleOfEvent}</h4>
           		<h5 class="event-location-${event.id}">${event.eventLocation}</h5>
           		<h5>Members: ${event.usersId.length}</h5>
           		<p>Categories: ${event.categories.map(category => `${category.name}`).join(", ")}</p>
           		<p class="event-description-${event.id}">${event.descriptionOfEvent}</p>
           		<p>Event Date: ${new Date(event.eventDate).toLocaleDateString()} ${new Date(event.eventDate).toLocaleTimeString()}</p>
           		<p class="event-dateTime">Created: ${new Date(event.createdDate).toLocaleDateString()}
           		 ${new Date(event.createdDate).toLocaleTimeString()}</p>
           		<p class="event-owner-${event.id}">Organizer: ${event.eventCreator.username}</p>
           		<p>State of event: <span class="stateOfEvent">${event.stateOfEvent}</span></p>
				<button class="btn btn-dark event-page-btn" data-id="${event.id}">Go to Event page</button>
			</div>
			</a>
			</div>
        `)
                                    .join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="tab-content" id="pills-tabContent">
                <div class="container tab-pane fade show active" id="pills-home" role="tabpanel"
                     aria-labelledby="pills-home-tab">

                </div>
                <div class="container tab-pane fade" id="pills-profile" role="tabpanel"
                     aria-labelledby="pills-profile-tab">
                    
                </div>
            </div>
        </div>
    </div>

    </body>
    </html>`;

}

export function DiscoverEvents() {
	$(".groupDiv").click(function () {
		const groupId = $(this).data("id");
		createView('/group', groupId);
	})
	$(".group-page-btn").click(function () {
		const groupId = $(this).data("id");
		createView('/group', groupId);
	})

	$(".eventDiv").click(function () {
		const eventId = $(this).data("id");
		createView('/event', eventId);
	})
	$(".event-page-btn").click(function () {
		const eventId = $(this).data("id");
		createView('/event', eventId);
	})

	$(".createGroupBtn").click(function () {
		createView('/createGroup')
	})

	$(".createEventBtn").click(function () {
		createView('/createEvent')
	})
}