import { loginOrRegister } from "./userActions.js";
const loginBtn = document.getElementById('login');
const registerBtn = document.getElementById('sign');
loginBtn.addEventListener("click", loginOrRegister);
registerBtn.addEventListener("click", loginOrRegister);
