import {clearPage} from "../../../utils/render";

const LeaderboardPage = () => {
    clearPage();

    const users = fetch('/leaderboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const main = document.querySelector('main');

    let table = `
        <table>
            <thead>
                <tr>
                    <th>Rang</th>
                    <th>Nom</th>
                    <th>Temps</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let i = 0; i < users.length; i + 1) {
        table += `
            <tr>
                <td>${i + 1}</td>
                <td>${users[i].name}</td>
                <td>${users[i].time}</td>
            </tr>
        `;
    }

    table += `
            </tbody>
        </table>
    `;

    main.innerHTML = table;
}

export default LeaderboardPage;
