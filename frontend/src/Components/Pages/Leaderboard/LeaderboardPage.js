import {clearPage} from "../../../utils/render";

const LeaderboardPage = async () => {
    clearPage();

    const result = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const users = await result.json();

    console.log(users);

    const main = document.querySelector('main');

    let table = `
        <table>
            <thead>
                <tr>
                    <th>Rang</th>
                    <th>Nom</th>
                    <th>Temps</th>
                    <th>Niveau</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let i = 0; i < users.length; i + 1) {
        table += `
            <tr>
                <td>${users[i].username}</td>
                <td>${users[i].time}</td>
                <td>${users[i].level}</td>
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
