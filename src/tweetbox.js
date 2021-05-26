import React, {useState, useRef, useEffect} from 'react';
import {Avatar, Button} from '@material-ui/core';
import axios from 'axios';
import './tweetbox.css';
import props from 'prop-types';
import Picker from 'emoji-picker-react';

import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import GifIcon from '@material-ui/icons/Gif';
import PollIcon from '@material-ui/icons/Poll';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import EventIcon from '@material-ui/icons/Event';

import {storage, db, firebaseApp} from './firebase'


export default function TweetBox(props) {

    const currUser =firebaseApp.auth().currentUser;
    const inputFile = useRef(null);

    const [tweet, setTweet] = useState('');
    const [tweetImg, setTweetImg] = useState('');
    const [link, setLink] = useState('');

    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');
    const [twittername, setTwittername] = useState('');
    const [showHideEmojiPicker, setShowHideEmojiPicker] = useState(false);
    const [joined, setJoined] = useState('');
    const [fileImg, setFileImg] = useState();


    const onEmojiClick = (event, emojiObject) => {
    setTweet(`${tweet}${emojiObject.emoji}`)
  };
    
    

    const uploadFile = () => {
        
        inputFile.current.click();
      };
     


    const setUserInfo = async() => {
        console.log('func fired')
        if (currUser) {
            console.log('current user')
        const uid = currUser.uid;
        console.log(uid);
        const currUserDb = await db.collection('users').where('userId', '==', uid).get();
        console.log('userdata')
        const udata = currUserDb.docs.map(user => user.data())[0];
        if (udata) {
        setAvatar(udata.avatar)
        setUsername(udata.displayName);
        setTwittername(udata.twittername);
        setJoined(udata.joined)};
        }
    }  

    useEffect(() => {
        setUserInfo()
    },[])
     

      const sendTweet = async(e) => {
          e.preventDefault();
          
          let date = new Date();
          let timeStamp = date.toJSON().slice(0,10).replace(/-/g,'/') + ' ' + date.toTimeString().split(' ')[0];
          let imglink = '';
          if (tweetImg) {
            const storageRef = storage.ref();
           
            const imageRef = storageRef.child(fileImg.name);
           
            await imageRef.put(fileImg)
           
            imglink = await imageRef.getDownloadURL();
            console.log("LINK TO FIREBASE IMAGE")
            console.log(imglink)
          }

        await db.collection('photos').add({
            url: imglink,
            userId: currUser.uid,
            timeStamp
        })  

        await db.collection('tweets').add({
            avatar: avatar,
            displayName: username,
            image: imglink,
            text: tweet,
            userId: currUser.uid,
            userName: twittername, //@bla
            verified: true,
            likes: [],
            retweets: [],
            responses: [],
            timeStamp,
            children: [],
            joined: joined
        });
        
        setTweetImg('');
        setLink('');
        setTweet();
        props.update('aaaa');
      }
      
    const uploadImage = async(image) => {
        if (image) {
           
            const storageRef = storage.ref();
           
            const imageRef = storageRef.child(image.name);
           
            await imageRef.put(image)
           
           const imglink = await imageRef.getDownloadURL();

           console.log('LINK SET');
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
                console.log(files[0]);
                setFileImg(files[0]);
                
                
            }
            
        }
        
    }  

    return (
        <div className='tweetbox'>
            <form>
                <div className='tweetbox-input'>
                    <Avatar src={avatar} />
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
                        <span onClick={() => setShowHideEmojiPicker(!showHideEmojiPicker)} className='emoji-submit-line'> <InsertEmoticonIcon /> </span>
                        <EventIcon />
                    </div>
                    <div className='tweet-btn-container'> <button className='tweet-btn' variant='outlined' onClick={(e) => sendTweet(e)} >Tweet </button></div>
                    
                </div>
            </form>
            {showHideEmojiPicker && <Picker onEmojiClick={onEmojiClick} />}
        </div>
    )
}