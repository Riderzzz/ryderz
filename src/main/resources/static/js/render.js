import Navbar from "./views/partials/Navbar.js";
import {isLoggedIn} from "./auth.js";

/**
 * Pushes the current URI to the URL bar and sets the HTML of the app div.
 * @param props - the data required for view rendering
 * @param route - the object containing information for the given endpoint
 */
export default function render(props, route) {
    // let navbarInfo = await getData()

    const app = document.querySelector('#app');
    console.log(route)
    console.log(route.title)
    const title = `${route.title}`;
    document.title = title;
    console.log(document.title)
    if (isLoggedIn()) {
        app.innerHTML = `${Navbar(props)} ${route.returnView(props)}`;
    } else app.innerHTML = `${Navbar(null)} ${route.returnView(props)}`;
    if (route.viewEvent) {
        route.viewEvent();
    }
}

function navProps(props) {
    if (isLoggedIn()) {
        return props
    } else return null
}


