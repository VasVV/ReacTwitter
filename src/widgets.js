import React, { useEffect, useState } from 'react';
import './widgets.css';
import SearchIcon from '@material-ui/icons/Search';
import {TwitterTimelineEmbed, TwitterShareButton, TwitterTweetEmbed} from 'react-twitter-embed';
import {firebaseApp, db} from './firebase';
import ShortUserWidget from './shortuserwidget';

export default function Widgets() {

    const [suggestUsers, setSuggestUsers] = useState([]);

    const suggestions = async() => {
        const currUserId = firebaseApp.auth().currentUser.uid;
        const currUserNotFollowed = await db.collection('users').get();
        const currUserNotFollowedMapped = currUserNotFollowed.docs.map(e => e.data());
        console.log('suggestions');
        //console.log(currUserNotFollowedMapped);
       const suggestions = currUserNotFollowedMapped.filter(e => e.userId != currUserId && !e.followers.includes(currUserId));
       console.log(suggestions);
       setSuggestUsers(suggestions)
    }

    useEffect(() => {
        suggestions();
    },[])
    return (
        <div className='widgets'>
            <div className='widgets-input'>
                <SearchIcon className='widgets-search' />
                <input placeholder='Search Twitter' type='text' />
                <p>Here will be the media widget</p>

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