import { removePathPrefix } from '../../utils/path-prefix';
import routes from './routes';

const Router = () => {
    onFrontendLoad();
    onHistoryChange();
};

function onHistoryChange() {
    window.addEventListener('popstate', () => {
        const uri = removePathPrefix(window.location.pathname);
        const componentToRender = routes[uri];
        componentToRender();
    });
}

function onFrontendLoad() {
    window.addEventListener('load', () => {
        const uri = removePathPrefix(window.location.pathname);
        const componentToRender = routes[uri];
        if (!componentToRender) throw Error(`The ${uri} ressource does not exist.`);

        componentToRender();
    });
}

export default Router;
