import {clearPage} from "../../../utils/render";
import {setAuthenticatedUser} from "../../../utils/auths";
import Navigate from "../../Router/Navigate";

const RegisterPage = async () => {
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

    const form = document.createElement("form");
    menu.appendChild(form);

    const inputUsername = document.createElement("input");
    inputUsername.setAttribute("type", "text");
    inputUsername.setAttribute("name", "username");
    inputUsername.setAttribute("placeholder", "USERNAME");
    inputUsername.setAttribute("required", "required");
    form.appendChild(inputUsername);

    const inputEmail = document.createElement("input");
    inputEmail.setAttribute("type", "email");
    inputEmail.setAttribute("name", "email");
    inputEmail.setAttribute("placeholder", "EMAIL");
    inputEmail.setAttribute("required", "required");
    form.appendChild(inputEmail);

    const inputPassword = document.createElement("input");
    inputPassword.setAttribute("type", "password");
    inputPassword.setAttribute("name", "password");
    inputPassword.setAttribute("placeholder", "PASSWORD");
    inputPassword.setAttribute("required", "required");
    form.appendChild(inputPassword);

    const inputPasswordConfirm = document.createElement("input");
    inputPasswordConfirm.setAttribute("type", "password");
    inputPasswordConfirm.setAttribute("name", "passwordConfirm");
    inputPasswordConfirm.setAttribute("placeholder", "PASSWORD");
    inputPasswordConfirm.setAttribute("required", "required");
    form.appendChild(inputPasswordConfirm);

    const alreadyButton = document.createElement("button");
    alreadyButton.classList.add("nav-button");
    alreadyButton.setAttribute("id", "regToLog");
    alreadyButton.textContent = "ALREADY HAVE AN ACCOUNT ?";
    alreadyButton.addEventListener("click", () => {
        Navigate("/login");
    });
    form.appendChild(alreadyButton);

    const breakLine = document.createElement("br");
    form.appendChild(breakLine);

    const termsOfUseLabel = document.createElement("label");
    termsOfUseLabel.setAttribute("id", "terms")
    termsOfUseLabel.setAttribute("for", "termsOfUse");
    termsOfUseLabel.textContent = "I accept the terms of use";
    form.appendChild(termsOfUseLabel);

    const termsOfUseInput = document.createElement("input");
    termsOfUseInput.setAttribute("type", "checkbox");
    termsOfUseInput.setAttribute("name", "termsOfUse");
    termsOfUseInput.setAttribute("required", "required");
    form.appendChild(termsOfUseInput);

    const button = document.createElement("button");
    button.classList.add("nav-button");
    button.setAttribute("type", "submit");
    button.textContent = "REGISTER";
    form.appendChild(button);

    const backButton = document.createElement("button");
    backButton.classList.add("nav-button");
    backButton.textContent = "BACK";
    backButton.addEventListener("click", () => {
        Navigate("/");
    });
    menu.appendChild(backButton);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        const { username, email, password, passwordConfirm , termsOfUse } = data;

        if (password !== passwordConfirm) {
            showErrorMessage("Passwords do not match", main);
            return;
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                email,
                password,
                passwordConfirm,
                termsOfUse,
            }),
        }

        const response = await fetch("/api/auth/register", options);

        if (response.status !== 200) {
            const result = await response.json();
            showErrorMessage(result.message, main);
            return;
        }

        const authenticatedUser = await response.json();

        setAuthenticatedUser(authenticatedUser);

        Navigate("/");
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

export default RegisterPage;
