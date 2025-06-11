import { useState } from 'react';
import { message, Progress, Upload } from 'antd';
import axios from "axios";
import { DownloadOutlined } from '@ant-design/icons';

import './styles.scss';
import { Fade } from 'react-awesome-reveal';


const UploadView = ({ setIsUploadSuccess, setFileName }) => {

    const { Dragger } = Upload;
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const uploadFile = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            setFileName(file.name);
            setIsUploading(true);

            // Upload the file
            const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });

            if (response.statusText === 'OK') {
                // Simulate upload progress
                let percentage = 0;
                const interval = setInterval(() => {
                    percentage += 20; // Increase progress by 10% at each interval
                    setProgress(percentage);
                    if (percentage >= 100) {
                        clearInterval(interval); // Stop the interval when progress reaches 100%
                        setIsUploading(false);
                        // Mark uploading as complete
                        message.success(`${file.name} upload success.`);
                        setIsUploadSuccess(true);
                    }
                }, 1000); // Update progress every 1 second
            }
            else {
                setIsUploading(false);
                message.error(`${file.name} upload failed.`);
            }
        } catch (error) {
            message.error(`${file.name} upload failed.`);
            console.log('Error ::', error);
            setIsUploading(false);
        }
    };

    const props = {
        name: 'file',
        multiple: false,
        beforeUpload: (file) => {
            const isWav = file.type === 'audio/wav';
            if (isWav) {
                // Call the upload function before the file is uploaded
                uploadFile(file);
            }
            else {
                message.error('You can only upload .wav files!');
            }
            // Prevent default upload behavior of Ant Design Upload
            return false;
        },
    };

    const renderContent = () => {
        if (isUploading) {
            return (
                <div className='progress-main-container'>
                    <div className='progress-container'>
                        <Progress percent={progress} className='progress' type='circle' size={200} strokeColor={'#ff9248'} trailColor='#dcdcdc' />
                    </div>
                    <div className='progress-text-container'>
                        <p className='progress-text'>File is uploading...</p>
                    </div>
                </div>)
        }
        else {
            return (
                <div className='dragger-container'>
                    <Dragger {...props} showUploadList={false} className='dragger-upload'>
                        <p className="ant-upload-drag-icon">
                            <DownloadOutlined className='upload-icon' />
                        </p>
                        <p className="ant-upload-text">Click here or drag your audio file to this area to upload</p>
                    </Dragger>
                </div>
            )
        }
    }

    return (
        <div className="upload-view-container">
            <Fade delay={100}>{renderContent()}</Fade>
        </div>
    );
};

export default UploadView;






