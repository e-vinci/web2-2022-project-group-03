import {clearPage} from "../../../utils/render";

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

    const passwordInput = document.createElement('input');
    passwordInput.setAttribute('type', 'password');
    passwordInput.setAttribute('name', 'password');
    passwordInput.setAttribute('placeholder', 'Password');

    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.innerText = 'Login';

    form.appendChild(usernameInput);
    form.appendChild(passwordInput);
    form.appendChild(submitButton);

    section.appendChild(form);
}

export default LoginPage;