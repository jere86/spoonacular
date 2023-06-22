import styles from './Index.module.scss';
import { useNavigate } from "react-router-dom";

import routes from "../../data/routes";

const Index = () => {
    const navigate = useNavigate();

    const reroute = () => {
        navigate(routes.search);
    }

    return (
        <div className={styles.index}>
            <button onClick={reroute}>Search</button>
        </div>
    )

}

export default Index;