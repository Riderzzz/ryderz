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
		<header>
			<div class="my-3">
				<h1>Discover New Roads</h1>
			</div>
			<div class="headerImgDiv">
				<img class="discoverFeaturedEventImg" src="https://images.unsplash.com/photo-1552306062-29a5560e1c31?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80">
				<div class="featuredTitle">
					<h3 class="featuredSubTitle">Night Life Tour</h3>
					<p class="featuredSubDetails">Join us on a late night route!</p>
				</div>
			</div>
		</header>
		<div class="row my-3">
			<div class="col-md-10">
				<h2>Events</h2>
			</div>
			<div class="col-md-2">
            	<button class="btn btn-dark mt-2 mx-2 createEventBtn">Create Event</button>
			</div>
		</div>
		<div class="row my-3">

            <div class="media-scroller snaps-inline">
				${props.events.reverse().map(event => 
					`
				<div class="media-element">
					<a class="eventDiv" data-id="${event.id}">
					<img src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80" alt="">
                    <h5 class="title">${event.titleOfEvent}</h5>
                    <p>Location: ${event.origin}</p>	
                    <p>Date: ${new Date(event.eventDate).toLocaleDateString()}</p>			
					</a>
                </div>
`
				).join('')}
			</div>
		</div>
        <div class="row my-3">
			<div class="col-md-10">
            	<h2 class="d-inline">Clubs</h2>
			</div>
			<div class="col-md-2">
            	<button class="d-inline btn btn-dark mt-2 mx-2 createGroupBtn">Create Club</button>
			</div>
		</div>
		<div class="row my-3">

            <div class="media-scroller mb-4 snaps-inline">
                ${props.groups.reverse().map(group =>
                        `
				<div class="media-element">
					<a class="groupDiv" data-id="${group.id}">
					<img src="${group.groupPhotoUrl !== null ? group.groupPhotoUrl : "https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"}" alt="">
                    <h5 class="title">${group.name}</h5>
                    <p>Location: ${group.location}</p>		
                    <p>Members: ${group.users.length}</p>		
					</a>
                </div>
`
                ).join('')}
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