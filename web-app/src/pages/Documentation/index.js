import { Col, Row } from "antd";
import { Fade } from "react-awesome-reveal";

import TopBar from "../../components/TopBar";
import DocumentationBanner from "../../assets/documentation-banner.png";

import "./styles.scss";

const DocumentationPage = () => {
  return (
    <div className="home-page-container">
      <Row className="top-row">
        <TopBar />
      </Row>

      <Row className="content-row aligned-row">
        {/* Left Column */}
        <Col className="left-col" span={12} lg={12}>
          <Row className="documentation-main-container">
            <Fade cascade damping={0.2}>
              <div className="documentation-container">
                {/* Quick Guide */}
                <section>
                  <h2>Quick Guide</h2>

                  <div className="step">
                    <div className="step-header">
                      <span className="step-number">01</span>
                      <h3>Upload Your Voice Call Record</h3>
                    </div>
                    <div className="step-content">
                      <p>Submit your voice call record using the upload prompt.</p>
                      <p>
                        Only <code>.wav</code> audio files are supported.
                      </p>
                    </div>
                  </div>

                  <div className="step">
                    <div className="step-header">
                      <span className="step-number">02</span>
                      <h3>System Analysis</h3>
                    </div>
                    <div className="step-content">
                      <p>Your file will be securely uploaded to the server.</p>
                      <p>
                        The system analyzes voice features and transcribes speech
                        using <strong>Speech-to-Text (STT)</strong>.
                      </p>
                      <p>Processing time depends on the length of the file.</p>
                    </div>
                  </div>

                  <div className="step">
                    <div className="step-header">
                      <span className="step-number">03</span>
                      <h3>Call Type Prediction</h3>
                    </div>
                    <div className="step-content">
                      <p>
                        After transcription, the system predicts the call type
                        based on its analysis.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Privacy Matters */}
                <section className="privacy-section">
                  <h2>Privacy Matters</h2>
                  <p>🔒 Your privacy is our top priority.</p>
                  <p>🗑️ After analysis, your call record is permanently deleted.</p>
                </section>
              </div>
            </Fade>
          </Row>
        </Col>

        {/* Right Column */}
        <Col className="right-col" span={12} lg={12}>
          <Fade delay={200}>
            <div className="banner-wrapper">
              <img
                src={DocumentationBanner}
                className="documentation-banner"
                alt="Documentation"
              />
              <p className="banner-caption">
                Your calls, analyzed securely and privately.
              </p>
            </div>
          </Fade>
        </Col>
      </Row>
    </div>
  );
};

export default DocumentationPage;
