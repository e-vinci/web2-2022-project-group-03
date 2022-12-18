import Navigate from "../../Router/Navigate";

import { clearPage } from "../../../utils/render";
import { getAuthenticatedUser, isAuthenticated } from "../../../utils/auths";

const HomePage = () => {
    clearPage();

    const audio = document.querySelector('audio');
    if (audio.paused) audio.play();

    const main = document.querySelector("main");

    const sectionImage = document.createElement("section");
    sectionImage.classList.add("image");
    main.appendChild(sectionImage);

    const sectionSide = document.createElement("section");
    sectionSide.classList.add("side");
    sectionImage.appendChild(sectionSide);

    const title = document.createElement("h5");
    title.classList.add("title");
    if (isAuthenticated()) {
        title.textContent = `WELCOME ${getAuthenticatedUser().username}`;
    } else {
        title.textContent = "WELCOME";
    }
    sectionSide.appendChild(title);

    const menu = document.createElement("div");
    menu.classList.add("menu");
    sectionSide.appendChild(menu);

    if (isAuthenticated()) {
        const newGameButton = document.createElement("button");
        newGameButton.classList.add("nav-button");
        newGameButton.textContent = "NEW GAME";
        newGameButton.addEventListener("click", async () => {
            const requestGet = await fetch(`${process.env.API_BASE_URL}/users/get`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: getAuthenticatedUser().token
                }
            });
            const result = await requestGet.json();
            if (result.level > 1) {
                const requestReset = await fetch(`${process.env.API_BASE_URL}/users/reset`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: getAuthenticatedUser().username
                    })
                });
                await requestReset.json();
            }
            Navigate("/game");
        });
        menu.appendChild(newGameButton);

        const resumeGameButton = document.createElement('button');
        resumeGameButton.classList.add('nav-button');
        resumeGameButton.innerText = 'RESUME';
        resumeGameButton.addEventListener('click', () => {
            Navigate(`/game`);
        });
        menu.appendChild(resumeGameButton);

        const br = document.createElement("br");
        menu.appendChild(br);

        const logoutButton = document.createElement("button");
        logoutButton.classList.add('nav-button');
        logoutButton.innerText = 'LOGOUT';
        logoutButton.addEventListener('click', () => {
            Navigate('/logout');
        });
        menu.appendChild(logoutButton);
    } else {
        const signupButton = document.createElement('button');
        signupButton.classList.add('nav-button');
        signupButton.innerText = 'SIGN UP';
        signupButton.addEventListener('click', () => {
            Navigate('/register');
        });
        menu.appendChild(signupButton);

        const signinButton = document.createElement('button');
        signinButton.classList.add('nav-button');
        signinButton.innerText = 'SIGN IN';
        signinButton.addEventListener('click', () => {
            Navigate('/login');
        });
        menu.appendChild(signinButton);
    }

    const leaderboardButton = document.createElement("button");
    leaderboardButton.classList.add("nav-button");
    leaderboardButton.textContent = "LEADERBOARD";
    leaderboardButton.addEventListener("click", () => {
        Navigate("/leaderboard");
    });
    menu.appendChild(leaderboardButton);

    const creditsButton = document.createElement("button");
    creditsButton.classList.add("nav-button");
    creditsButton.textContent = "CREDITS";
    creditsButton.addEventListener("click", () => {
        Navigate("/credits");
    });
    menu.appendChild(creditsButton);
};

export default HomePage;
