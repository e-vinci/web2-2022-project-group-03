import { clearPage } from "../../../utils/render";
import Game from "../../Babylon/Game";

const HomePage = () => {
    clearPage();
    // eslint-disable-next-line
    new Game();
};

export default HomePage;