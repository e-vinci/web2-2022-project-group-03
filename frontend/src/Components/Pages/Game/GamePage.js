import Game from '../../Babylon/Game';

import { clearPage } from "../../../utils/render";

const GamePage = async () => {
    clearPage();
    // eslint-disable-next-line no-new
    await new Game();
    document.querySelector("canvas").focus();
}

export default GamePage;