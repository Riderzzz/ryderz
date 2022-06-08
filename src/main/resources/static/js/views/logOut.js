import createView from "../createView.js";

export default function logOut(props) {
    return `
        <header>
            <h1>Log Out</h1>
        </header>
        <main>
            <div>
                <p>
                    Logged Out
                </p>    
            </div>
        </main>
    `;
}

export function LogOutEvent(){
    window.localStorage.clear()
    createView("/");
}