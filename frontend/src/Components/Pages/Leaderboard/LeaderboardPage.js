import { clearPage } from "../../../utils/render";
import Navigate from "../../Router/Navigate";

const LeaderboardPage = () => {
    clearPage();

    const main = document.querySelector("main");
    main.innerHTML = `
        <h1>Nous voila sur le leaderboard</h1>
        <button>Retour</button>
    `;

    const button = document.querySelector("button");

    button.addEventListener("click", () => {
        Navigate("/");
    });
};

export default LeaderboardPage;