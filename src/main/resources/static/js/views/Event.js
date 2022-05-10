import createView from "../createView.js";

export default function Event(props) {
	console.log(props)
	// language=HTML
	return `<!DOCTYPE html>
    <html lang="html">
    <head>
        <meta charset="UTF-8"/>
        <title>${props.event.titleOfEvent}</title>
    </head>
    <body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col">
                <h1>Event</h1>
                <h4 class="event-name-${props.event.id}">${props.event.titleOfEvent}</h4>
                <h5 class="event-location-${props.event.id}">${props.event.eventLocation}</h5>
                <h5>Members: ${props.event.usersId.length}</h5>
                <p>Categories: ${props.event.categories.map(category => `${category.name}`).join(", ")}</p>
                <p class="event-description-${props.event.id}">${props.event.descriptionOfEvent}</p>
                <p>Event Date: ${new Date(props.event.eventDate).toLocaleDateString()}
                    ${new Date(props.event.eventDate).toLocaleTimeString()}</p>
                <p class="event-dateTime">Created: ${new Date(props.event.createdDate).toLocaleDateString()}</p>
                <p class="event-owner-${props.event.id}">Organizer: ${props.event.eventCreator.username}</p>
                <p>State of event: <span class="stateOfEvent">${props.event.stateOfEvent}</span></p>
                <button class="backToDiscover btn btn-dark">Back to discover</button>
            </div>
        </div>
    </div>
    </body>
    </html>`;

}

export function EventEvents() {
	$(".backToDiscover").click(function () {
		createView('/discover')
	})
}