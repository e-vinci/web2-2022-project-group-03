import {clearPage} from "../../../utils/render";
import Navigate from "../../Router/Navigate";
import { setAuthenticatedUser } from "../../../utils/auths";

const LoginPage = () => {
    clearPage();

    const main = document.querySelector('main');

    const sectionImage = document.createElement('section');
    sectionImage.classList.add('image');
    main.appendChild(sectionImage);

    const sectionSide = document.createElement('section');
    sectionSide.classList.add('side');
    sectionImage.appendChild(sectionSide);

    const title = document.createElement('h5');
    title.classList.add('title');
    title.textContent = 'NOM';
    sectionSide.appendChild(title);

    const menu = document.createElement('div');
    menu.classList.add('menu');
    sectionSide.appendChild(menu);

    const form = document.createElement('form');
    form.classList.add('form-login');
    menu.appendChild(form);

    const inputUsername = document.createElement('input');
    inputUsername.setAttribute('type', 'text');
    inputUsername.setAttribute('name', 'username');
    inputUsername.setAttribute('placeholder', 'USERNAME');
    form.appendChild(inputUsername);

    const inputPassword = document.createElement('input');
    inputPassword.setAttribute('type', 'password');
    inputPassword.setAttribute('name', 'password');
    inputPassword.setAttribute('placeholder', 'PASSWORD');
    form.appendChild(inputPassword);

    const loginButton = document.createElement('input');
    loginButton.setAttribute('type', 'submit');
    loginButton.setAttribute('value', 'LOGIN');
    loginButton.classList.add('nav-button');
    form.appendChild(loginButton);

    const backButton = document.createElement("button");
    backButton.classList.add("nav-button");
    backButton.textContent = "BACK";
    backButton.addEventListener("click", () => {
        Navigate("/");
    });
    menu.appendChild(backButton);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        const {username, password, rememberMe} = data;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            })
        }

        const response = await fetch('http://localhost:3000/api/auth/login', options);

        if (!response.ok) throw new Error(`fetch error: ${response.status}`);

        const authenticatedUser = await response.json();

        setAuthenticatedUser(authenticatedUser, rememberMe);

        Navigate('/');
    });
}

export default LoginPage;
