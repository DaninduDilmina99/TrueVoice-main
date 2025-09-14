import { useEffect, useState } from "react";
import { Col, Row, message } from "antd";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import TopBar from "../../components/TopBar";
import UploadView from "../../components/UploadView";
import PredictionCard from "../../components/PredictionCard";
import Spinner from "../../components/Spinner";

import { deleteAudioApi, detectAudioApi, transcribeApi } from "../../constants/apiConstants";

import HomeBackgroundShape from "../../assets/landing-vector.png";
import HomeBanner from "../../assets/home-banner.png";
import AnalyzeBanner from "../../assets/analyze-banner.png";
import LegitBanner from "../../assets/legit-banner.png";
import SpamBanner from "../../assets/spam-banner.png";

import "./styles.scss";

const HomePage = () => {
  const [uploadSuccess, setIsUploadSuccess] = useState(false);
  const [loadingTranscribe, setLoadingTranscribe] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [callType, setCallType] = useState(null);
  const [transcribedAudioData, setTranscribedAudioData] = useState(null);

  // Step 1: Transcribe uploaded file
  useEffect(() => {
    const transcribeAudio = async () => {
      try {
        const response = await axios.post(transcribeApi, { audioName: fileName });
        if (response.statusText === "OK") {
          setTranscribedAudioData(response.data.result);
          setLoadingTranscribe(false);
        }
      } catch (error) {
        console.error("Transcription error:", error);
      }
    };

    if (uploadSuccess && fileName) {
      setLoadingTranscribe(true);
      transcribeAudio();
    }
  }, [uploadSuccess, fileName]);

  // Step 2: Detect audio type
  useEffect(() => {
    const getPrediction = async () => {
      try {
        const response = await axios.post(detectAudioApi, {
          audioName: fileName,
          transcribedAudioData,
        });
        if (response.statusText === "OK") {
          setCallType(response.data.result);
        }
      } catch (error) {
        console.error("Detection error:", error);
      }
    };

    if (transcribedAudioData) getPrediction();
  }, [transcribedAudioData, fileName]);

  // Step 3: Delete audio after detection
  useEffect(() => {
    const deleteFile = async () => {
      try {
        const response = await axios.delete(`${deleteAudioApi}/${fileName}`);
        if (response.statusText === "OK") {
          message.success(`${fileName} safely deleted from the system.`);
        } else {
          message.error(`${fileName} delete failed.`);
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    };

    if (callType && fileName) {
      setTimeout(() => deleteFile(), 2000);
    }
  }, [callType, fileName]);

  const handleReset = () => {
    setIsUploadSuccess(false);
    setFileName(null);
    setCallType(null);
    setLoadingTranscribe(false);
    setTranscribedAudioData(null);
  };

  // ----------- Render Dynamic States (Left Column) ----------
  const renderComponent = () => {
    if (!uploadSuccess) {
      return <UploadView setIsUploadSuccess={setIsUploadSuccess} setFileName={setFileName} />;
    } else if (loadingTranscribe) {
      return <Spinner text="Analyzing your audio..." />;
    } else if (callType) {
      return <PredictionCard callType={callType} handleButtonClick={handleReset} />;
    }
  };

  // ----------- Render Animated Banner (Right Column) ----------
  const renderBanner = () => {
    let bannerSrc;
    let bannerClass;

    if (!uploadSuccess) {
      bannerSrc = HomeBanner;
      bannerClass = "home-banner";
    } else if (loadingTranscribe) {
      bannerSrc = AnalyzeBanner;
      bannerClass = "analyze-banner";
    } else if (callType) {
      bannerSrc = callType === "LEGIT" ? LegitBanner : SpamBanner;
      bannerClass = callType === "LEGIT" ? "legit-banner" : "spam-banner";
    }

    return (
      <AnimatePresence mode="wait">
        <motion.img
          key={bannerSrc}
          src={bannerSrc}
          alt="banner"
          className={bannerClass}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: -20 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </AnimatePresence>
    );
  };

  return (
    <div className="home-page-container">
      {/* Top Bar */}
      <Row className="top-row">
        <TopBar />
      </Row>

      {/* Main Content */}
      <Row className="content-row">
        {/* Left Section: Headline + Upload/Prediction Flow */}
        <Col className="left-col" span={12} lg={12}>
          <motion.img
            src={HomeBackgroundShape}
            className="home-left-shape"
            alt="home-left-shape"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1.2 }}
          />
          <Row className="home-heading-container">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span>Voice Recognition</span> Based <br />
              Spam Call Detection Platform
            </motion.h1>
          </Row>
          <Row className="home-left-content-container">
            <AnimatePresence mode="wait">{renderComponent()}</AnimatePresence>
          </Row>
        </Col>

        {/* Right Section: Dynamic Banner */}
        <Col className="right-col" span={12} lg={12}>
          <Row className="home-right-shape-container">
            <motion.img
              src={HomeBackgroundShape}
              className="home-right-shape"
              alt="home-right-shape"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ duration: 1.2 }}
            />
          </Row>
          <Row className="home-banner-container">{renderBanner()}</Row>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
