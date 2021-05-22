import React, {useState, useRef} from 'react';
import TwitterIcon from '@material-ui/icons/Twitter';
import {Link, useHistory} from 'react-router-dom';
import {Avatar, Button} from '@material-ui/core';
import './login.css';
import {storage, db, firebaseApp} from './firebase';


export default function RegisterTwo() {
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState('');
    const [err, setErr] = useState('');
    const [twittername, setTwittername] = useState('');

    const inputFile = useRef(null);
    const auth = firebaseApp.auth();

    const uploadFile = () => {
        
        inputFile.current.click();
      };

      const uploadImage = async(image) => {
        if (image) {
           
            const storageRef = storage.ref();
           
            const imageRef = storageRef.child(image.name);
           
            await imageRef.put(image)
           
           const imglink = await imageRef.getDownloadURL();
           
           setAvatar(imglink);
           
          } else {
            alert("Please upload an image first.");
          }

      
    } 

      const handleFileUpload = e => {
        const { files } = e.target;
        if (files && files.length) {
            const filename = files[0].name;
            const parts = filename.split(".");
            const fileType = parts[parts.length - 1];
            if (fileType == 'PNG' || fileType == 'JPG' || fileType == 'JPEG' || fileType == 'png' || fileType == 'jpg' || fileType == 'jpeg') {
                const url = URL.createObjectURL(files[0]);
                setAvatar(url);
                uploadImage(files[0])
                
            }
            
        }
    }



    const register = async() => {

        const currentUser = await firebaseApp.auth().currentUser;

        if (currentUser) {
            await currentUser.updateProfile({
                displayName: username
            });

            await firebaseApp.firestore().collection('users').add({
                userId: currentUser.uid,
                avatar: avatar,
                displayName: username,
                twittername
            });

            history.push('/dashboard')
    }
    }

    return (
        <div className='login'>
            <div className='twitter-sign'>
                <TwitterIcon className='twitter-icon'/>
            </div>
            <div className='twitter-login-text'>
                Submit your information
            </div>
            {err&&<p>{err}</p>}
            <div className='login-email'>
                <input type='text' placeholder='Your name' onChange={(e) => setTwittername(e.target.value)}/>
            </div>
            <div className='login-email'>
                <input type='text' placeholder='Your usename' onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className='avatar-line'>
                <div className='avatar-img'>{avatar ? <Avatar className='avatar-elem' src={avatar} /> : <Avatar  className='avatar-elem' />}</div>
                <div className='choose-avatar-text'>Choose your profile picture</div>
                <button onClick={() => uploadFile()} className='upload-avatar-btn'>Upload</button>
                <input type='file' id='file' name='image' ref={inputFile} style={{display: 'none'}} onChange={handleFileUpload}/>
            </div>
            <div className='login-btn-form'>
                <button className='login-btn-form-btn' onClick={() => register()}>Go to Dashboard</button>
            </div>
            
        </div>
    )
}