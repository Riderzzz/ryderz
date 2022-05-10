import createView from "../createView.js";

export default function Group(props) {
	console.log(props)
	// language=HTML
	return `<!DOCTYPE html>
    <html lang="html">
    <head>
        <meta charset="UTF-8"/>
        <title>${props.group.name}</title>
    </head>
    <body>
    <div class="container">
        <div class="row">
            <div class="col">
                <h1>${props.group.name}</h1>
                <p>About: ${props.group.bio}</p>
                <p>Created on: ${new Date(props.group.createdDate).toLocaleDateString()} ${new Date(props.group.createdDate).toLocaleTimeString()}</p>
                <p>Owner: ${props.group.groupOwner.username}</p>
                <p>Location: ${props.group.location}</p>
                <p>Members: ${props.group.users.length}</p>
				<button class="backToDiscover btn btn-dark">Back to discover</button>
            </div>
        </div>
    </div>
    </body>
    </html>`;

}

export function GroupEvents() {
	$(".backToDiscover").click(function () {
		createView('/discover')
	})
}