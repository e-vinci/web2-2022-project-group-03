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
    menu.appendChild(form);

    const inputUsername = document.createElement('input');
    inputUsername.setAttribute('type', 'text');
    inputUsername.setAttribute('name', 'username');
    inputUsername.setAttribute('placeholder', 'USERNAME');
    inputUsername.setAttribute('required', 'required');
    form.appendChild(inputUsername);

    const inputPassword = document.createElement('input');
    inputPassword.setAttribute('type', 'password');
    inputPassword.setAttribute('name', 'password');
    inputPassword.setAttribute('placeholder', 'PASSWORD');
    inputPassword.setAttribute('required', 'required');
    form.appendChild(inputPassword);

    const rememberMeInput = document.createElement('input');
    rememberMeInput.setAttribute('type', 'checkbox');
    rememberMeInput.setAttribute('name', 'rememberMe');
    form.appendChild(rememberMeInput);

    const donthaveButton = document.createElement("button");
    donthaveButton.classList.add("nav-button");
    donthaveButton.setAttribute("id", "regToLog");
    donthaveButton.textContent = "DONT HAVE AN ACCOUNT ?";
    donthaveButton.addEventListener("click", () => {
        Navigate("/register");
    });
    form.appendChild(donthaveButton);

    const br = document.createElement("br");
    form.appendChild(br);

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

    // eslint-disable-next-line consistent-return
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        const { username, password, rememberMe } = data;

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

        const response = await fetch('/api/auth/login', options);

        if (response.status !== 200) {
            const result = await response.json();
            showErrorMessage(result.error, main);
            return;
        }

        const authenticatedUser = await response.json();

        setAuthenticatedUser(authenticatedUser, rememberMe);

        Navigate('/');
    });
}

function showErrorMessage(message, element) {
    const div = document.createElement('div');
    div.classList.add('alert');
    element.appendChild(div);

    const span = document.createElement('span');
    span.textContent = message;
    span.classList.add('msg');
    div.appendChild(span);

    div.classList.add('show');
    div.classList.remove('hide');
    div.classList.add('showAlert');
    setTimeout(() => {
        div.classList.remove('show');
        div.classList.add('hide');
    }, 5000);
}

export default LoginPage;
