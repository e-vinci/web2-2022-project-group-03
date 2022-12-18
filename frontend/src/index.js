import './stylesheets/main.css';

import Router from './Components/Router/Router';
import music from "./sounds/mainMenu.mp3";

Router();

const body = document.querySelector("body");
const audio = document.createElement("audio");

audio.setAttribute("autoplay", "");
audio.setAttribute("loop", "");
audio.setAttribute("src", music);

body.appendChild(audio);
