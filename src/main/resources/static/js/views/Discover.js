import createView from "../createView.js";
import {enableSearchIfLogged} from "./Home.js";

export default function Discover(props) {
	// language=html
	let html = `<!DOCTYPE html>
    <html lang="html">
    <head>
        <meta charset="UTF-8"/>
        <title>Discover</title>
    </head>
    <body class="discoverBody">
    <div class="container discoverContainer">
		<header>
			<div class="my-3">
				<h1 class="pt-3 text-white">Discover New Roads</h1>
			</div>
			<div class="headerImgDiv">
				<img class="discoverFeaturedEventImg" src="https://images.unsplash.com/photo-1498084393753-b411b2d26b34?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80">
				<div class="featuredTitle">
					<h3 class="featuredSubTitle">Night Life Tour</h3>
					<p class="featuredSubDetails">Join us on a late night route!</p>
					<button class="featuredEventBtn btn mt-3 groupGreenButton">Go to event</button>
				</div>
			</div>
		</header>
		<div class="row my-3">
			<div class="col-md-10">
				<h2 class="text-white">Events</h2>
			</div>
			<div class="col-md-2">
            	<button class="btn mt-2 mx-2 createEventBtn">Create Event</button>
			</div>
		</div>
		<div class="row my-3">

            <div class="media-scroller snaps-inline">
				${props.events.reverse().map(event => 
					`
				<div class="media-element">
					<a class="eventDiv" data-id="${event.id}">
					<img class="discoverItemImg shadow" src="${event.eventImageUrl !== null ? event.eventImageUrl : "https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"}" alt="">
                    <h5 class="discoverTitle text-white">${event.titleOfEvent}</h5>
                    <p class="discoverLocation text-white">Location: ${event.origin}</p>
                    <p class="text-white">${getRouteInfo(event)}</p>
                    <p class="eventDate text-white">Date: ${new Date(event.eventDate).toLocaleDateString()}</p>	
					</a>
                </div>
`
				).join('')}
			</div>
		</div>
        <div class="row my-3">
			<div class="col-md-10">
            	<h2 class="d-inline text-white">Clubs</h2>
			</div>
			<div class="col-md-2">
            	<button class="d-inline btn mt-2 mx-2 createGroupBtn">Create Club</button>
			</div>
		</div>
		<div class="row my-3">

            <div class="media-scroller mb-4 snaps-inline">
                ${props.groups.reverse().map(group =>
                        `
				<div class="media-element">
					<a class="groupDiv" data-id="${group.id}">
					<img class="discoverItemImg shadow" src="${group.groupPhotoUrl !== null ? group.groupPhotoUrl : "https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"}" alt="">
                    <h5 class="discoverTitle text-white">${group.name}</h5>
                    <p class="discoverLocation text-white">Location: ${group.location}</p>		
                    <p class="groupMembers text-white">Members: ${group.users.length}</p>		
					</a>
                </div>
`
                ).join('')}
            </div>
        </div>
    </div>

    </body>
    </html>`;

	return html;

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

	$(".featuredEventBtn").click(function () {
		createView('/event', 13)
	})

	enableSearchIfLogged();
}

function getRouteInfo(event) {
	if (event.isSingleLocationEvent) {
		return ``
	} else if (!event.routeDistance || !event.routeDuration) {
		return ``
	} else {
	return `Miles: ${event.routeDistance} Duration: ${event.routeDuration}`
	}
}