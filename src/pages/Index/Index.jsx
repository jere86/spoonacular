import styles from './Index.module.scss';
import { useNavigate } from "react-router-dom";

import routes from "../../data/routes";

const Index = () => {
    const navigate = useNavigate();

    const routeToSearch = () => {
        navigate(routes.search);
    }

    return (
        <div className={styles.index}>
            <button onClick={routeToSearch}>Search</button>
        </div>
    )

}

export default Index;