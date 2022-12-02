import HomePage from "../Pages/HomePage/HomePage";
import LoginPage from "../Pages/Authentification/LoginPage";
import RegisterPage from "../Pages/Authentification/RegisterPage";
import GamePage from "../Pages/Game/GamePage";
import LeaderboardPage from "../Pages/Leaderboard/LeaderboardPage";


const routes = {
  '/': HomePage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/game': GamePage,
  '/leaderboard': LeaderboardPage,
};

export default routes;
