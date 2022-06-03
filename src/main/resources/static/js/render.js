import Navbar from "./views/partials/Navbar.js";
import {isLoggedIn} from "./auth.js";

export default function render(props, route) {

    const app = document.querySelector('#app');
    const title = `${route.title}`;
    document.title = title;
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


