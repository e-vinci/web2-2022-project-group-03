import Game from '../../Babylon/Game';

import { clearPage } from "../../../utils/render";

const GamePage = () => {
    clearPage();
    // eslint-disable-next-line no-new
    new Game();
}

export default GamePage;