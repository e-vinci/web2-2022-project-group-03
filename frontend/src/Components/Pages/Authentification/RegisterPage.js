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
    form.classList.add("form-register");
    menu.appendChild(form);

    const inputUsername = document.createElement("input");
    inputUsername.setAttribute("type", "text");
    inputUsername.setAttribute("name", "username");
    inputUsername.setAttribute("placeholder", "USERNAME");
    form.appendChild(inputUsername);

    const inputEmail = document.createElement("input");
    inputEmail.setAttribute("type", "email");
    inputEmail.setAttribute("name", "email");
    inputEmail.setAttribute("placeholder", "EMAIL");
    form.appendChild(inputEmail);

    const inputPassword = document.createElement("input");
    inputPassword.setAttribute("type", "password");
    inputPassword.setAttribute("name", "password");
    inputPassword.setAttribute("placeholder", "PASSWORD");
    form.appendChild(inputPassword);

    const inputPasswordConfirm = document.createElement("input");
    inputPasswordConfirm.setAttribute("type", "password");
    inputPasswordConfirm.setAttribute("name", "passwordConfirm");
    inputPasswordConfirm.setAttribute("placeholder", "PASSWORD");
    form.appendChild(inputPasswordConfirm);

    const alreadyButton = document.createElement("button");
    alreadyButton.classList.add("nav-button");
    alreadyButton.setAttribute("id", "regToLog");
    alreadyButton.textContent = "ALREADY HAVE AN ACCOUNT ?";
    alreadyButton.addEventListener("click", () => {
        Navigate("/login");
    });
    form.appendChild(alreadyButton);

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

        const { username, email, password, passwordConfirmation, termsOfUse } = data;

        if (termsOfUse === undefined) {
            return;
        }

        if (password !== passwordConfirmation) {
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
                passwordConfirmation,
                termsOfUse,
            }),
        }

        const response = await fetch("http://localhost:3000/api/auth/register", options);

        if (!response.ok) throw new Error(`fetch error: ${response.status}`);

        const authenticatedUser = await response.json();

        setAuthenticatedUser(authenticatedUser);

        Navigate("/");
    });
}

export default RegisterPage;
