import {clearPage} from "../../../utils/render";

const RegisterPage = () => {
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

  const emailInput = document.createElement("input");
  emailInput.setAttribute("type", "email");
  emailInput.setAttribute("name", "email");
  emailInput.setAttribute("placeholder", "Email");

  const passwordInput = document.createElement("input");
  passwordInput.setAttribute("type", "password");
  passwordInput.setAttribute("name", "password");
  passwordInput.setAttribute("placeholder", "Password");

  const passwordConfirmationInput = document.createElement("input");
  passwordConfirmationInput.setAttribute("type", "password");
  passwordConfirmationInput.setAttribute("name", "passwordConfirmation");
  passwordConfirmationInput.setAttribute("placeholder", "Password Confirmation");

  const termsOfUseCheckbox = document.createElement("input");
  termsOfUseCheckbox.setAttribute("type", "checkbox");
  termsOfUseCheckbox.setAttribute("name", "termsOfUse");
  termsOfUseCheckbox.setAttribute("value", "termsOfUse");

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
}

export default RegisterPage;
