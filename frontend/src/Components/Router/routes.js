import HomePage from "../Pages/HomePage/HomePage";
import LoginPage from "../Pages/Authentification/LoginPage";
import GamePage from "../Pages/Game/GamePage";
import RegisterPage from "../Pages/Authentification/RegisterPage";
import LeaderboardPage from "../Pages/Leaderboard/LeaderboardPage";

const routes = {
    '/': HomePage,
    '/game': GamePage,
    '/login': LoginPage,
    '/register' : RegisterPage,
    '/leaderboard' : LeaderboardPage
};

export default routes;
