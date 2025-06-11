import { Button, Row } from 'antd';
import { Bounce, AttentionSeeker } from "react-awesome-reveal";
import { SafetyCertificateOutlined, WarningOutlined } from '@ant-design/icons';

import Logo from "../../assets/logo.png";

import './styles.scss';


const PredictionCard = ({ callType, handleButtonClick }) => {

    const renderContent = () => {
        return (
            <>
                <Row className="icon-row">
                    {callType === "SPAM" ? <WarningOutlined className='icon-warn' /> : <SafetyCertificateOutlined className='icon' />}
                </Row>
                <Row className='heading-row'>
                    {callType === "SPAM" ? <h2 className='heading-warn'>Spam Call Detected!</h2> : <h2 className='heading-success'>Your Call Is Not A Spam Call!</h2>}
                </Row>
                <Row className='text-row'>
                    {callType === 'SPAM' ?
                        <p>We would like to inform you that the input call record you provided has been flagged as a spam call. Our system has identified it as such, indicating a potential fraud risk.</p> :
                        <p>We're confirming that the input call record you provided has not been identified as a spam call. It has been recognized as legitimate and will be processed accordingly. </p>}
                </Row>
                <Row className='logo-row'>
                    <img src={Logo} className="card-logo" alt="card-logo" />
                </Row>
                <Row className='button-row'>
                    <Button className='button' type='default' onClick={handleButtonClick}>Check Another Call</Button>
                </Row>
            </>
        )
    }

    return (
        <div className="prediction-card-main-container">
            {
                callType === "SPAM" ? <AttentionSeeker effect="shakeX"> {renderContent()} </AttentionSeeker> : <Bounce> {renderContent()} </Bounce>
            }
        </div>
    )
}

export default PredictionCard
