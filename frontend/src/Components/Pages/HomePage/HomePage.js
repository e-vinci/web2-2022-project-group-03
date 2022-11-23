import Navigate from "../../Router/Navigate";

import { clearPage } from "../../../utils/render";
import { isAuthenticated } from "../../../utils/auths";

const HomePage = () => {
    clearPage();

    const main = document.querySelector('main');
    const navBar = document.createElement('nav');
    main.appendChild(navBar);
    const navBarList = document.createElement('ul');
    navBar.appendChild(navBarList);

    const newGameItem = document.createElement('li');
    const newGameButton = document.createElement('button');
    newGameButton.innerText = 'New Game';
    newGameButton.addEventListener('click', () => {
        Navigate('/game');
    });
    newGameItem.appendChild(newGameButton);
    navBarList.appendChild(newGameItem);

    if (isAuthenticated()) {
        const resumeGameItem = document.createElement('li');
        const resumeGameButton = document.createElement('button');
        resumeGameButton.innerText = 'Resume Game';
        resumeGameButton.addEventListener('click', () => {
            Navigate('/game?level=1');

            // TODO: add logic to get the level the authenticated user was on
        });
        resumeGameItem.appendChild(resumeGameButton);
        navBarList.appendChild(resumeGameItem);
    } else {
        const loginItem = document.createElement('li');
        const loginButton = document.createElement('button');
        loginButton.innerText = 'Login';
        loginButton.addEventListener('click', () => {
            Navigate('/login');
        });
        loginItem.appendChild(loginButton);
        navBarList.appendChild(loginItem);

        const registerItem = document.createElement('li');
        const registerButton = document.createElement('button');
        registerButton.innerText = 'Register';
        registerButton.addEventListener('click', () => {
            Navigate('/register');
        });
        registerItem.appendChild(registerButton);
        navBarList.appendChild(registerItem);
    }

    const leaderboardItem = document.createElement('li');
    const leaderboardButton = document.createElement('button');
    leaderboardButton.innerText = 'Leaderboard';
    leaderboardButton.addEventListener('click', () => {
        Navigate('/leaderboard');
    });
    leaderboardItem.appendChild(leaderboardButton);
    navBarList.appendChild(leaderboardItem);

    const creditsTitle = document.createElement('h1');
    creditsTitle.innerText = 'Credits';
    main.appendChild(creditsTitle);

    const credits = document.createElement('p');
    credits.innerText = 'This game was made by the following people:';
    main.appendChild(credits);

    const creditsList = document.createElement('ul');
    main.appendChild(creditsList);

    const creditsListItems = [
        'De Sa Adegas Miguel',
        'D\'haeyere Corentin',
        'Lapinski Damien',
        'Subbota Iuliana',
        'Vandeputte François'
    ];

    creditsListItems.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.innerText = item;
        creditsList.appendChild(listItem);
    });

};

export default HomePage;
