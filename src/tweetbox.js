import React, {useState, useRef} from 'react';
import {Avatar, Button} from '@material-ui/core';
import axios from 'axios';
import './tweetbox.css';
import props from 'prop-types';


import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import GifIcon from '@material-ui/icons/Gif';
import PollIcon from '@material-ui/icons/Poll';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import EventIcon from '@material-ui/icons/Event';

import {storage, db} from './firebase'


export default function TweetBox(props) {

   
    const inputFile = useRef(null);

    const [tweet, setTweet] = useState('');
    const [tweetImg, setTweetImg] = useState('');
    const [link, setLink] = useState('')


    const uploadFile = () => {
        
        inputFile.current.click();
      };
     

      const sendTweet = async(e) => {
          e.preventDefault();
          console.log('link');
          console.log(link);
        await db.collection('tweets').add({
            avatar: 'https://uprostim.com/wp-content/uploads/2021/03/image105-32.jpg',
            displayName: 'Sample tweet',
            image: link ? link : '',
            text: tweet,
            userId: '',
            userName: 'Sample Username',
            verified: true
        });
        props.update('aaa');
        setTweetImg('');
        setTweet('');

      }
      
    const uploadImage = async(image) => {
        if (image) {
            //2.
            const storageRef = storage.ref();
            //3.
            const imageRef = storageRef.child(image.name);
            //4.
            await imageRef.put(image)
           //5.
           const imglink = await imageRef.getDownloadURL();
           console.log('imglink')
            console.log(imglink)
           setLink(imglink);
           
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
                setTweetImg(url);
                uploadImage(files[0])
                
            }
            
        }
    }  

    return (
        <div className='tweetbox'>
            <form>
                <div className='tweetbox-input'>
                    <Avatar src='https://www.mantruckandbus.com/fileadmin/media/bilder/02_19/219_05_busbusiness_interviewHeader_1485x1254.jpg' />
                    <input type='text' value={tweet} onChange={(e) => setTweet(e.target.value)} placeholder='Enter your tweet...' />
                    
                </div>
                <div className='tweet-img'>
                    {tweetImg && <img src={tweetImg} className='' />}
                    </div>
                <div className='tweetbox-submit-line'>
                    <div className='media-submit-line'>
                    <input type='file' id='file' name='image' ref={inputFile} style={{display: 'none'}} onChange={handleFileUpload}/>
                       <span onClick={(e) => uploadFile(e)} className='media-submit-line'> <CropOriginalIcon  /> </span>
                        <PollIcon />
                        <InsertEmoticonIcon />
                        <EventIcon />
                    </div>
                    <div className='tweet-btn-container'> <button className='tweet-btn' variant='outlined' onClick={(e) => sendTweet(e)} >Tweet </button></div>
                    
                </div>
            </form>
        </div>
    )
}