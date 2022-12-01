import {clearPage} from "../../../utils/render";
import {setAuthenticatedUser} from "../../../utils/auths";
import Navigate from "../../Router/Navigate";

const RegisterPage = async () => {
    clearPage();

    const main = document.querySelector("main");

    const section = document.createElement("section");
    main.appendChild(section);

    const logo = document.createElement("img");
    logo.src = ""; // TODO : Add logo

    section.appendChild(logo);

    const form = document.createElement("form");
    form.setAttribute("method", "post");

    const usernameInput = document.createElement("input");
    usernameInput.setAttribute("type", "text");
    usernameInput.setAttribute("name", "username");
    usernameInput.setAttribute("placeholder", "Username");
    usernameInput.setAttribute("required", "required");

    const emailInput = document.createElement("input");
    emailInput.setAttribute("type", "email");
    emailInput.setAttribute("name", "email");
    emailInput.setAttribute("placeholder", "Email");
    emailInput.setAttribute("required", "required");

    const passwordInput = document.createElement("input");
    passwordInput.setAttribute("type", "password");
    passwordInput.setAttribute("name", "password");
    passwordInput.setAttribute("placeholder", "Password");
    passwordInput.setAttribute("required", "required");

    const passwordConfirmationInput = document.createElement("input");
    passwordConfirmationInput.setAttribute("type", "password");
    passwordConfirmationInput.setAttribute("name", "passwordConfirmation");
    passwordConfirmationInput.setAttribute("placeholder", "Password Confirmation");
    passwordConfirmationInput.setAttribute("required", "required");

    const termsOfUseCheckbox = document.createElement("input");
    termsOfUseCheckbox.setAttribute("type", "checkbox");
    termsOfUseCheckbox.setAttribute("name", "termsOfUse");
    termsOfUseCheckbox.setAttribute("required", "required");

    const termsOfUseLabel = document.createElement("label");
    termsOfUseLabel.innerText = "I agree to the ";

    const linkTermsOfUse = document.createElement("a");
    linkTermsOfUse.setAttribute("href", "https://en.help.roblox.com/hc/en-us/articles/115004647846-Roblox-Terms-of-Use");
    linkTermsOfUse.innerText = "Terms of Use";

    termsOfUseLabel.appendChild(linkTermsOfUse);

    const submitButton = document.createElement("button");
    submitButton.setAttribute("type", "submit");
    submitButton.innerText = "Register";

    form.appendChild(usernameInput);
    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(passwordConfirmationInput);
    form.appendChild(termsOfUseCheckbox);
    form.appendChild(termsOfUseLabel);
    form.appendChild(submitButton);

    section.appendChild(form);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        const { username, email, password, passwordConfirmation, termsOfUse } = data;

        if (termsOfUse === undefined) {
            // TODO : Display error message
            alert("You must agree to the Terms of Use");
            return;
        }

        if (password !== passwordConfirmation) {
            // TODO: Display error message
            alert("Passwords do not match");
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
