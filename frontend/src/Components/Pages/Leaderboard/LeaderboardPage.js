import {clearPage} from "../../../utils/render";
import Navigate from "../../Router/Navigate";

const LeaderboardPage = async () => {
    clearPage();

    const audio = document.querySelector('audio');
    if (audio.paused) audio.play();

    const result = await fetch(`${process.env.API_BASE_URL}/leaderboard`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const leaderboard = await result.json();

    const main = document.querySelector("main");

    const sectionImage = document.createElement("section");
    sectionImage.classList.add("image");
    main.appendChild(sectionImage);

    const leaderboardSection = document.createElement("section");
    leaderboardSection.classList.add("leaderboard");
    sectionImage.appendChild(leaderboardSection);

    const title = document.createElement("h5");
    title.classList.add("title");
    title.textContent = "LEADERBOARD";
    leaderboardSection.appendChild(title);

    if (leaderboard.length > 0) {
        const leaderboardTable = document.createElement("table");
        leaderboardTable.classList.add("leaderboard-table");
        leaderboardSection.appendChild(leaderboardTable);

        const leaderboardTableRowHead = document.createElement("tr");

        const leaderboardTableHeadRank = document.createElement("th");
        leaderboardTableHeadRank.classList.add("table-head");
        leaderboardTableHeadRank.textContent = "RANK";
        leaderboardTableRowHead.appendChild(leaderboardTableHeadRank);

        const leaderboardTableHeadUsername = document.createElement("th");
        leaderboardTableHeadUsername.classList.add("table-head");
        leaderboardTableHeadUsername.textContent = "USERNAME";
        leaderboardTableRowHead.appendChild(leaderboardTableHeadUsername);

        const leaderboardTableHeadTime = document.createElement("th");
        leaderboardTableHeadTime.classList.add("table-head");
        leaderboardTableHeadTime.textContent = "TIME";
        leaderboardTableRowHead.appendChild(leaderboardTableHeadTime);

        leaderboardTable.appendChild(leaderboardTableRowHead);

        let i = 1;
        leaderboard.forEach((leaderboardElement) => {
            const leaderboardTableRow = document.createElement("tr");
            leaderboardTable.appendChild(leaderboardTableRow);

            const leaderboardTableRowRank = document.createElement("td");
            leaderboardTableRowRank.classList.add("table-data");
            leaderboardTableRowRank.textContent = `#${i}`;
            leaderboardTableRow.appendChild(leaderboardTableRowRank);

            const leaderboardTableRowUsername = document.createElement("td");
            leaderboardTableRowUsername.classList.add("table-data");
            leaderboardTableRowUsername.textContent = leaderboardElement.username;
            leaderboardTableRow.appendChild(leaderboardTableRowUsername);

            const leaderboardTableRowTime = document.createElement("td");
            leaderboardTableRowTime.classList.add("table-data");
            leaderboardTableRowTime.textContent = leaderboardElement.time;
            leaderboardTableRow.appendChild(leaderboardTableRowTime);

            i += 1;
        });
    } else {
        const noEntries = document.createElement("h5");
        noEntries.classList.add("no-entries");
        noEntries.textContent = "THERE ARE NO LEADERBOARD ENTRIES YET";
        leaderboardSection.appendChild(noEntries);
    }

    const backButton = document.createElement("button");
    backButton.classList.add("back-button");
    backButton.textContent = "BACK";
    backButton.addEventListener("click", () => {
        Navigate("/");
    });
    leaderboardSection.appendChild(backButton);
}

export default LeaderboardPage;
