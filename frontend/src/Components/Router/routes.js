import HomePage from "../Pages/HomePage/HomePage";
import LoginPage from "../Pages/Authentification/LoginPage";
import RegisterPage from "../Pages/Authentification/RegisterPage";
import GamePage from "../Pages/Game/GamePage";

const routes = {
  '/': HomePage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/game': GamePage,
};

export default routes;
