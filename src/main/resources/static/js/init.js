import createView from './createView.js';


export default function init() {
    loadViewOnPageRequest();
    addListenerToNavLinks();
}
/**
 * When the DOM loads, build the view given the current endpoint.
 */
function loadViewOnPageRequest() {
    let Id = localStorage.getItem("Id");
    history.pushState(localStorage.getItem("History"), null, localStorage.getItem("Route"));
    window.addEventListener('DOMContentLoaded', function() {
        // Switched to location.pathname so the route would be accurate to current view
        createView(location.pathname, Id);
    });
}

/**
 * Add a listener that will change the view if a nav link is clicked.
 */
function addListenerToNavLinks() {
    document.addEventListener('click', (event) => {
        // we want checkboxes and labels to keep their default behavior when clicked
        // and not prevent the default
        if(event.target.type && event.target.type === "checkbox" || event.target.type === "file") {
            return;
        }
        if(event.target.matches('label')) {
            return;
        }
        event.preventDefault();
        if (event.target.dataset['link'] !== undefined) {
            const URI = event.target.href.substring(location.origin.length);
            createView(URI);
        }
    });
}

