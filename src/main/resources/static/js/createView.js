import render from './render.js';
import router from './router.js';
import fetchData from "./fetchData.js";
import {getHeaders, initPubIfUndefined, isLoggedIn, pubnub, pubnubInitWithUserUsername} from "./auth.js";

/**
 * Finds the correct route for a given view, builds a loading view, fetches data and builds the final rendered view.
 * @param URI
 */
export default function createView(URI, Id) {
    let route = router(URI, Id);

    initPubIfUndefined()

    // Store the title because the loading screen render overwrites it.
    // let currentTitle = "ryderz";

    // if route is invalid, return a 404 page
    if (!route) {
        render(null, router('/error'));
        return;
    }

    // change view to loading screen
    render(null, router('/loading'));

    let request = {
        headers: getHeaders()
    }
    fetchData(route.state, request).then((props) => {
        // Restore the title so that history entries are not all 'Loading...'
        // I tried using route.uri here instead, but it seems there's an off-by-one bug (https://stackoverflow.com/a/38830794)
        // document.title = currentTitle;
        // Add the current page to the history stack
        history.pushState({...props, lastUri: route.uri}, null, route.uri)
        localStorage.setItem("Id", Id);
        render(props, route);
    });
}

// When the user hits back in the browser, get the last uri from history and render it (w/ props)
window.addEventListener('popstate', (e) => {
    if (e?.state?.lastUri) {
        const splitURI = e.state.lastUri.split("/")
        const Id = splitURI[2];
        const {lastUri, ...props} = e.state
        render(props, router("/" + splitURI[1], Id));
    }
});
