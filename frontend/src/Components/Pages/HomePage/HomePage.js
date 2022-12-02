import Navigate from "../../Router/Navigate";

import { clearPage } from "../../../utils/render";
import { isAuthenticated } from "../../../utils/auths";

const HomePage = () => {
    clearPage();

    const main = document.querySelector("main");

    const sectionImage = document.createElement("section");
    sectionImage.classList.add("image");
    main.appendChild(sectionImage);

    const sectionSide = document.createElement("section");
    sectionSide.classList.add("side");
    sectionImage.appendChild(sectionSide);

    const title = document.createElement("h5");
    title.classList.add("title");
    title.textContent = "NOM";
    sectionSide.appendChild(title);

    const menu = document.createElement("div");
    menu.classList.add("menu");
    sectionSide.appendChild(menu);

    const newGameButton = document.createElement("button");
    newGameButton.classList.add("nav-button");
    newGameButton.textContent = "NEW GAME";
    newGameButton.addEventListener("click", () => {
        Navigate("/game");
    });
    menu.appendChild(newGameButton);

    if (isAuthenticated()) {
        const resumeGameButton = document.createElement('button');
        resumeGameButton.classList.add('nav-button');
        resumeGameButton.innerText = 'RESUME';
        resumeGameButton.addEventListener('click', async () => {
            Navigate(`/game`);
        });
        menu.appendChild(resumeGameButton);
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
};

export default HomePage;