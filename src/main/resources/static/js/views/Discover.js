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
			<div class="col-8">
                <h1>Discover</h1>
			</div>
			<div class="col-4">
				<button class="btn btn-dark mt-3 mx-2 createGroupBtn">Create Group</button><button class="btn btn-dark mt-3 mx-2 createEventBtn">Create Event</button>
			</div>
		</div>
        <div class="row">
            <div class="col">
                <h3>Groups</h3>
                <div id="groups-container" class="col-md-7">
                    ${props.groups.reverse().map(group =>

                            `
			<div class="form-holder mb-3" data-id="${group.id}">
           		<h4 class="group-name-${group.id}">${group.name}</h4>
           		<h5 class="group-location-${group.id}">${group.location}</h5>
           		<h5>Members: </h5>
           		<p class="group-content-${group.id}">${group.bio}</p>
           	
           		<p class="group-createdDate">${new Date(group.createdDate).toLocaleTimeString()} ${new Date(group.createdDate).toLocaleDateString()}</p>
           		<p class="group-owner-${group.id}">Organizer: ${group.groupOwner.username}</p>
			</div>
        `)
                            .join('')}
                </div>
            </div>
            <div class="col">
                <h3>Events</h3>

                <div id="groups-container" class="col-md-7">
                    ${props.events.reverse().map(event =>

                            `
			<div class="form-holder mb-3" data-id="${event.id}">
           		<h4 class="event-name-${event.id}">${event.titleOfEvent}</h4>
           		<h5 class="event-location-${event.id}">${event.eventLocation}</h5>
           		<h5>Members: </h5>
           		<p class="event-description-${event.id}">${event.descriptionOfEvent}</p>
           		<p></p>
           		<p class="event-dateTime">${new Date(event.createdDate).toLocaleTimeString()} ${new Date(event.createdDate).toLocaleDateString()}</p>
           		<p class="event-owner-${event.id}">Organizer: ${event.eventCreator.username}</p>
			</div>
        `)
                            .join('')}
                </div>
            </div>
        </div>
    </div>

    </body>
    </html>`;

}

export function DiscoverEvents() {
	$(".createGroupBtn").click(function () {
		createView('/createGroup')
	})

	$(".createEventBtn").click(function () {
		createView('/createEvent')
	})
}