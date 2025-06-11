import ScaleLoader from "react-spinners/ScaleLoader";

import "./styles.scss";
import { Row } from "antd";
import { Fade } from "react-awesome-reveal";

const Spinner = () => {
    return (
        <div className="spinner-main-container">
            <Fade>
                <Row className="spinner-container">
                    <ScaleLoader color="#ff9248" height={150} width={10} radius={6} margin={8} />
                </Row>
                <Row className="spinner-text">
                    <h3>Audio is being processed to text and analyzing...</h3>
                </Row>
            </Fade>
        </div>
    )
}

export default Spinner;
