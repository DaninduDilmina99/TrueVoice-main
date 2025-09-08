// import { useEffect, useState } from "react";
// import { Col, Row, message } from "antd";
// import axios from "axios";
// import { Fade } from "react-awesome-reveal";

// import TopBar from "../../components/TopBar";
// import UploadView from "../../components/UploadView";
// import PredictionCard from "../../components/PredictionCard";
// import Spinner from "../../components/Spinner";
// import { deleteAudioApi, detectAudioApi, transcribeApi } from "../../constants/apiConstants";

// import HomeBackgroundShape from "../../assets/landing-vector.png";
// import HomeBanner from "../../assets/home-banner.png";
// import AnalyzeBanner from "../../assets/analyze-banner.png";
// import LegitBanner from "../../assets/legit-banner.png";
// import SpamBanner from "../../assets/spam-banner.png";

// import "./styles.scss";


// const HomePage = () => {

//     const [uploadSuccess, setIsUploadSuccess] = useState(false);
//     const [loadingTranscribe, setLoadingTranscribe] = useState(false);
//     const [fileName, setFileName] = useState(null);
//     const [callType, setCallType] = useState(null);
//     const [transcribedAudioData, setTranscribedAudioData] = useState(null);

//     useEffect(() => {
//         const transcribeAudio = async () => {
//             try {
//                 const requestBody = {
//                     audioName: fileName,
//                 };
//                 const response = await axios.post(transcribeApi, requestBody);
//                 if (response.statusText === 'OK') {
//                     setTranscribedAudioData(response.data.result);
//                     setLoadingTranscribe(false);
//                 }
//             }
//             catch (error) {
//                 console.log('Error ::', error);
//             }
//         };
//         if (uploadSuccess && fileName) {
//             setLoadingTranscribe(true);
//             transcribeAudio();
//         }
//     }, [uploadSuccess, fileName]);


//     useEffect(() => {
//         const getPrediction = async () => {
//             try {
//                 const requestBody = {
//                     audioName: fileName,
//                     transcribedAudioData: transcribedAudioData
//                 };
//                 const response = await axios.post(detectAudioApi, requestBody);
//                 if (response.statusText === 'OK') {
//                     setCallType(response.data.result);
//                 }
//             }
//             catch (error) {
//                 console.log('Error ::', error);
//             }
//         };
//         if (transcribedAudioData) {
//             getPrediction();
//         }
//     }, [transcribedAudioData, fileName]);

//     useEffect(() => { 
//         const deleteFile = async () => {
//             try {
//                 const response = await axios.delete(`${deleteAudioApi}/${fileName}`);
//                 if (response.statusText === 'OK') {
//                     message.success(`${fileName} audio file safely deleted from the system.`);
//                 }
//                 else {
//                     message.error(`${fileName} audio file delete failed.`);
//                 }
//             }
//             catch (error) {
//                 console.log('Error ::', error);
//             }
//         };

//         if (callType && fileName) {
//             console.log('callType ::', callType);	
//             setTimeout(() => {
//                 console.log('time out');
//                 deleteFile();
//             }, 2000);
//         }
//     },[callType, fileName]);


//     const handleButtonClick = () => {
//         setIsUploadSuccess(false);
//         setFileName(null);
//         setCallType(null);
//         setLoadingTranscribe(false);
//         setTranscribedAudioData(null);
//     };

//     const renderComponent = () => {
//         if (!uploadSuccess) {
//             return <UploadView setIsUploadSuccess={setIsUploadSuccess} setFileName={setFileName} />
//         }
//         else if (loadingTranscribe) {
//             return <Spinner />
//         }
//         else if (callType) {
//             return <PredictionCard callType={callType} handleButtonClick={handleButtonClick} />
//         }
//     }

//     const renderBanner = () => {
//         if (!uploadSuccess) {
//             return <img src={HomeBanner} className="home-banner" alt="home-banner" />
//         }
//         else if (loadingTranscribe) {
//             return <img src={AnalyzeBanner} className="analyze-banner" alt="analyze-banner" />
//         }
//         else if (callType) {
//             if (callType === "LEGIT") {
//                 return <img src={LegitBanner} className="legit-banner" alt="legit-banner" />
//             } else if (callType === "SPAM") {
//                 return <img src={SpamBanner} className="spam-banner" alt="spam-banner" />
//             }
//         }
//     }


//     return (
//         <div className="home-page-container">
//             <Row className="top-row">
//                 <TopBar />
//             </Row>
//             <Row className="content-row">
//                 <Col className="left-col" span={12} lg={12}>
//                     <img src={HomeBackgroundShape} className="home-left-shape" alt="home-left-shaper" />
//                     <Row className="home-heading-container">
//                         <h1>
//                             <span>Voice Recognition</span> Based <br />
//                             Spam Call Detection Platform
//                         </h1>
//                     </Row>
//                     <Row className="home-left-content-container">
//                         {renderComponent()}
//                     </Row>
//                 </Col>
//                 <Col className="right-col" span={12} lg={12}>
//                     <Row className="home-right-shape-container">
//                         <img src={HomeBackgroundShape} className="home-right-shape" alt="home-right-shape" />
//                     </Row>
//                     <Row className="home-banner-container">
//                         <div>
//                             <Fade delay={150}>{renderBanner()}</Fade>
//                         </div>
//                     </Row>
//                 </Col>
//             </Row>
//         </div>
//     );
// }

// export default HomePage;




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
