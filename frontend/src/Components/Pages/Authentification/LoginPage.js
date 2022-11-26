import {clearPage} from "../../../utils/render";
import Navigate from "../../Router/Navigate";
import { setAuthenticatedUser } from "../../../utils/auths";

const LoginPage = () => {
    clearPage();

    const main = document.querySelector('main');

    const section = document.createElement('section');
    main.appendChild(section);

    const logo = document.createElement('img');
    logo.src = ''; // TODO : Add logo

    section.appendChild(logo);

    const form = document.createElement('form');
    form.setAttribute('method', 'post');

    const usernameInput = document.createElement('input');
    usernameInput.setAttribute('type', 'text');
    usernameInput.setAttribute('name', 'username');
    usernameInput.setAttribute('placeholder', 'Username');
    usernameInput.setAttribute('required', 'required');

    const passwordInput = document.createElement('input');
    passwordInput.setAttribute('type', 'password');
    passwordInput.setAttribute('name', 'password');
    passwordInput.setAttribute('placeholder', 'Password');
    passwordInput.setAttribute('required', 'required');

    const rememberMeCheckbox = document.createElement('input');
    rememberMeCheckbox.setAttribute('type', 'checkbox');
    rememberMeCheckbox.setAttribute('name', 'rememberMe');

    const rememberMeLabel = document.createElement('label');
    rememberMeLabel.innerText = 'Remember me';

    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.innerText = 'Login';

    form.appendChild(usernameInput);
    form.appendChild(passwordInput);
    form.appendChild(rememberMeCheckbox);
    form.appendChild(rememberMeLabel);
    form.appendChild(submitButton);

    section.appendChild(form);

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
