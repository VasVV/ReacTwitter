import React, { useEffect, useState } from 'react';
import './widgets.css';
import SearchIcon from '@material-ui/icons/Search';
import {TwitterTimelineEmbed, TwitterShareButton, TwitterTweetEmbed} from 'react-twitter-embed';
import {firebaseApp, db} from './firebase';
import ShortUserWidget from './shortuserwidget';
import {useSelector } from 'react-redux';
import {store} from './index';

export default function Widgets({userIdForImg}) {

    

    const [images, setImages] = useState([]);

    const [suggestUsers, setSuggestUsers] = useState([]);

    const suggestions = async() => {
        const currUserId = firebaseApp.auth().currentUser.uid;
        const currUserNotFollowed = await db.collection('users').get();
        const currUserNotFollowedMapped = currUserNotFollowed.docs.map(e => e.data());
        
       const suggestions = currUserNotFollowedMapped.filter(e => e.userId != currUserId && !e.followers.includes(currUserId));
      
       setSuggestUsers(suggestions)
    };

    const getImages = async() => {
       console.log('USER ID FOR IMG IN WIDGETS');
       console.log(userIdForImg)
        const imagesDb = await db.collection('photos').get();
        const imagesDbMapped = imagesDb.docs.map(e => e.data());
        const imagesFiltered = imagesDbMapped.filter(e => e.userId == userIdForImg).slice(0,5);
        
        setImages(imagesFiltered)

    }

    useEffect(() => {
        suggestions();
        getImages();
    },[])
    return (
        <div className='widgets'>
            <div className='widgets-input'>
                <SearchIcon className='widgets-search' />
                <input placeholder='Search Twitter' type='text' />
                <div className='image-grid'>
                    <div className='image-line'>
                        <img className='grid-img grid-img-left-up' src={images[0]?.url} />
                        <img className='grid-img'  src={images[1]?.url} />
                        <img className='grid-img'  src={images[2]?.url} />
                    </div>
                    <div className='image-line'>
                        <img className='grid-img'  src={images[3]?.url} />
                        <img className='grid-img'   src={images[4]?.url} />
                        <img  className='grid-img' src={images[5]?.url} />
                    </div>
                </div>
                <div className='suggestions'>
                    <div className='suggestions-header-container'>
                        <h2 className='suggestions-header'>You might like</h2>
                    </div>
                    {suggestUsers.map(e => {
                        
                        return (
                            <ShortUserWidget 
                     displayName={e.displayName}
                    twittername={e.twittername}
                    avatar={e.avatar}
                    userId={e.userId}
                    
                    />
                        )
                    })}
                </div>
                <TwitterShareButton />
                </div>    



        </div>
    )
}