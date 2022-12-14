import {clearPage} from "../../../utils/render";

const LeaderboardPage = async () => {
    clearPage();

    const result = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const leaderboard = await result.json();
    console.log(leaderboard);
}

export default LeaderboardPage;
