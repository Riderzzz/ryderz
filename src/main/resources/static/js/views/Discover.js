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
        <div class="row mt-4">
            <div class="col">
                <ul class="nav nav-pills nav-fill mb-3" id="pills-tab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active bg-dark text-white" id="pills-home-tab" data-bs-toggle="pill"
                                data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home"
                                aria-selected="true">Groups
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link bg-dark text-white" id="pills-profile-tab" data-bs-toggle="pill"
                                data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile"
                                aria-selected="false">Events
                        </button>
                    </li>
                </ul>
            </div>
        </div>
        <div class="row">
            <div class="tab-content" id="pills-tabContent">
                <div class="container tab-pane fade show active" id="pills-home" role="tabpanel"
                     aria-labelledby="pills-home-tab">
                    <h3 class="text-center">Groups</h3>
                    <div id="groups-container" class="row justify-content-center">
                        ${props.groups.reverse().map(group =>
                                `
			<div class="col-4 form-holder m-2 border border-dark rounded bg-dark text-white p-4" data-id="${group.id}">
           		<h4 class="group-name-${group.id}">${group.name}</h4>
           		<h5 class="group-location-${group.id}">${group.location}</h5>
           		<h5>Members: ${group.users.length}</h5>
           		<p class="group-content-${group.id}">${group.bio}</p>
           	
           		<p class="group-createdDate">${new Date(group.createdDate).toLocaleTimeString()} ${new Date(group.createdDate).toLocaleDateString()}</p>
           		<p class="group-owner-${group.id}">Organizer: ${group.groupOwner.username}</p>
			<button class="btn btn-light group-page-btn" data-id="${group.id}">Go to Group page</button>
			</div>
        `)
                                .join('')}
                    </div>
                </div>
                <div class="container tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                    <h3 class="text-center">Events</h3>

                    <div id="groups-container" class="row justify-content-center">
                        ${props.events.reverse().map(event =>
                                `
			<div class="col-4 form-holder m-2 border border-dark rounded bg-dark text-white p-4" data-id="${event.id}">
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
				<button class="btn btn-light event-page-btn" data-id="${event.id}">Go to Event page</button>
			</div>
        `)
                                .join('')}
                    </div>
                </div>
            </div>
        </div>
    </div>

    </body>
    </html>`;

}

export function DiscoverEvents() {
	$(".group-page-btn").click(function () {
		const groupId = $(this).data("id");
		createView('/group', groupId);
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

function groupsHTML(props) {
	//language=HTML
	return `

	`;
}

function eventsHTML(props) {
	//language=HTML
	return `

	`
}