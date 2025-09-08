// import { useState } from 'react';
// import { message, Progress, Upload } from 'antd';
// import axios from "axios";
// import { DownloadOutlined } from '@ant-design/icons';

// import './styles.scss';
// import { Fade } from 'react-awesome-reveal';


// const UploadView = ({ setIsUploadSuccess, setFileName }) => {

//     const { Dragger } = Upload;
//     const [progress, setProgress] = useState(0);
//     const [isUploading, setIsUploading] = useState(false);

//     const uploadFile = async (file) => {
//         try {
//             const formData = new FormData();
//             formData.append('file', file);

//             setFileName(file.name);
//             setIsUploading(true);

//             // Upload the file
//             const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 },
//             });

//             if (response.statusText === 'OK') {
//                 // Simulate upload progress
//                 let percentage = 0;
//                 const interval = setInterval(() => {
//                     percentage += 20; // Increase progress by 10% at each interval
//                     setProgress(percentage);
//                     if (percentage >= 100) {
//                         clearInterval(interval); // Stop the interval when progress reaches 100%
//                         setIsUploading(false);
//                         // Mark uploading as complete
//                         message.success(`${file.name} upload success.`);
//                         setIsUploadSuccess(true);
//                     }
//                 }, 1000); // Update progress every 1 second
//             }
//             else {
//                 setIsUploading(false);
//                 message.error(`${file.name} upload failed.`);
//             }
//         } catch (error) {
//             message.error(`${file.name} upload failed.`);
//             console.log('Error ::', error);
//             setIsUploading(false);
//         }
//     };

//     const props = {
//         name: 'file',
//         multiple: false,
//         beforeUpload: (file) => {
//             const isWav = file.type === 'audio/wav';
//             if (isWav) {
//                 // Call the upload function before the file is uploaded
//                 uploadFile(file);
//             }
//             else {
//                 message.error('You can only upload .wav files!');
//             }
//             // Prevent default upload behavior of Ant Design Upload
//             return false;
//         },
//     };

//     const renderContent = () => {
//         if (isUploading) {
//             return (
//                 <div className='progress-main-container'>
//                     <div className='progress-container'>
//                         <Progress percent={progress} className='progress' type='circle' size={200} strokeColor={'#ff9248'} trailColor='#dcdcdc' />
//                     </div>
//                     <div className='progress-text-container'>
//                         <p className='progress-text'>File is uploading...</p>
//                     </div>
//                 </div>)
//         }
//         else {
//             return (
//                 <div className='dragger-container'>
//                     <Dragger {...props} showUploadList={false} className='dragger-upload'>
//                         <p className="ant-upload-drag-icon">
//                             <DownloadOutlined className='upload-icon' />
//                         </p>
//                         <p className="ant-upload-text">Click here or drag your audio file to this area to upload</p>
//                     </Dragger>
//                 </div>
//             )
//         }
//     }

//     return (
//         <div className="upload-view-container">
//             <Fade delay={100}>{renderContent()}</Fade>
//         </div>
//     );
// };

// export default UploadView;





import { useState } from 'react';
import { message, Progress, Upload } from 'antd';
import axios from "axios";
import { CloudUploadOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import { Fade } from 'react-awesome-reveal';

import './styles.scss';

const UploadView = ({ setIsUploadSuccess, setFileName }) => {
  const { Dragger } = Upload;
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      setFileName(file.name);
      setIsUploading(true);
      setIsComplete(false);

      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.statusText === "OK") {
        let percentage = 0;
        const interval = setInterval(() => {
          percentage += 20;
          setProgress(percentage);
          if (percentage >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            setIsComplete(true);
            message.success(`${file.name} uploaded successfully 🎉`);
            setIsUploadSuccess(true);
          }
        }, 600);
      } else {
        setIsUploading(false);
        message.error(`${file.name} upload failed.`);
      }
    } catch (error) {
      message.error("Upload failed. Try again.");
      console.error("Error ::", error);
      setIsUploading(false);
    }
  };

  const props = {
    name: "file",
    multiple: false,
    beforeUpload: (file) => {
      const isWav = file.type === "audio/wav";
      if (isWav) uploadFile(file);
      else message.error("You can only upload .wav files!");
      return false;
    },
  };

  return (
    <div className="upload-view-container">
      <Fade delay={100}>
        {isUploading ? (
          <div className="progress-main-container">
            <Progress
              percent={progress}
              type="circle"
              size={180}
              strokeColor="#ff9248"
              trailColor="#f2f2f2"
              strokeWidth={10}
            />
            <p className="progress-text">Uploading your file...</p>
          </div>
        ) : isComplete ? (
          <div className="complete-main-container">
            <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 64 }} />
            <p className="complete-text">Upload Complete!</p>
          </div>
        ) : (
          <div className="dragger-container">
            <Dragger {...props} showUploadList={false} className="dragger-upload">
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined className="upload-icon" />
              </p>
              <p className="ant-upload-text">Drag & Drop your .wav file here</p>
              <p className="ant-upload-hint">or click to browse</p>
            </Dragger>
          </div>
        )}
      </Fade>
    </div>
  );
};

export default UploadView;



