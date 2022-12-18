import Game from '../../Babylon/Game';

import { clearPage } from "../../../utils/render";
import {isAuthenticated} from "../../../utils/auths";
import Navigate from "../../Router/Navigate";

const GamePage = async () => {
    clearPage();

    const audio = document.querySelector('audio');
    audio.currentTime = 0;
    audio.pause();

    if (isAuthenticated()) {
        await new Game();
        document.querySelector("canvas").focus();
    } else {
        Navigate('/login');
    }
}

export default GamePage;
