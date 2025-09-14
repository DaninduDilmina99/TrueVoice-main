import { Button, Col, Row } from "antd";
import { Link } from "react-router-dom";

import LandingImage from "../../assets/landing.png";
import LandingVector from "../../assets/landing-vector.png";
import Logo from "../../assets/logo.png";

import "./styles.scss";

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <Row className="landing-row">
        {/* Left Column with Vector + Banner */}
        <Col className="left-col" span={12} lg={12}>
          <img
            src={LandingVector}
            className="landing-vector"
            alt="landing-vector"
          />
          <img
            src={LandingImage}
            className="landing-banner"
            alt="landing-banner"
          />
        </Col>

        {/* Right Column with Logo + Content */}
        <Col className="right-col" span={12} lg={12}>
          <Row className="landing-logo-container">
            <img src={Logo} className="landing-logo" alt="landing-logo" />
          </Row>

          <Row className="landing-heading-container">
            <h1>Welcome to <span className="highlight">TrueVoice</span>!</h1>
          </Row>

          <Row className="landing-content-container">
            <p>
              TrueVoice is your ultimate solution for <strong>spam voicemail call
              detection</strong> using cutting-edge voice recognition technology.
              Say goodbye to interruptions—our advanced algorithms filter out spam
              so only important calls reach you.
            </p>
            <p>
              Enjoy a <strong>peaceful communication experience</strong>, where
              every call you answer is safe and meaningful. Take control of your
              voicemail today with TrueVoice.
            </p>
          </Row>

          <Row className="landing-button-container">
            <Link to={"/home"}>
              <Button type="default" className="landing-button">
                Let’s Go 🚀
              </Button>
            </Link>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default LandingPage;
