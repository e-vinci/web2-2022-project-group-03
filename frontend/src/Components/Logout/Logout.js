import { clearAuthenticatedUser } from '../../utils/auths';
import Navigate from '../Router/Navigate';

const Logout = () => {
    clearAuthenticatedUser();
    Navigate('/login');
};

export default Logout;
