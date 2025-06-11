import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import Logo from "../../assets/logo.png";

import "./styles.scss";


const TopBar = () => {

    const location = useLocation();

    return (
        <div className="top-bar-container">
            <img src={Logo} className="top-bar-logo" alt="top-bar-logo" />
            <div className="top-bar-menu">
                <Link to={"/home"}><span className={location.pathname === "/home" ? "active" : ""}>Home</span></Link>
                <Link to={"/documentation"}><span className={location.pathname === "/documentation" ? "active" : ""}>Documentation</span></Link>
            </div>
        </div>
    )
};

export default TopBar;
