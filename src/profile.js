import React, { useEffect, useState, useRef } from 'react';
import Sidebar from './sidebar';
import Feed from './feed';
import Widgets from './widgets';

import './profile.css';
import { Avatar } from '@material-ui/core';
import {db, firebaseApp} from './firebase';
import Post from './post';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

export default function Profile() {

    const tab1Ref = useRef(null);
    const tab2Ref = useRef(null);

    const tab1 = useRef(null);
    const tab2 = useRef(null);

    const [avatar, setAvatar] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [twitterName, setTwitterName] = useState('');
    const [alltweets, setAllTweets] = useState([]);
    const [myTweets, setMyTweets] = useState([]);
    const [thisuserId, setthisUserId] = useState('');
    const [currentTab, setCurrentTab] = useState(1);
    const [joined, setJoined] = useState('');

    const getCurrUserData = async() => {
        if (firebaseApp.auth()) {
    const currUser = await firebaseApp.auth().currentUser
    
    
    const userId = currUser.uid;
    setthisUserId(userId);
    const currUserDb = await db.collection('users').where('userId', '==', userId).get();
    const currUserDbMapped = currUserDb.docs.map(doc => doc.data())[0];
    setAvatar(currUserDbMapped.avatar);
    setDisplayName(currUserDbMapped.displayName);
    setTwitterName(currUserDbMapped.twittername);
    setJoined(currUserDbMapped.joined)
    const currUserTweetsDb = await db.collection('tweets').where('userId', '==', userId).get();
    const currUserTweetsDbMapped = currUserTweetsDb.docs.map(doc => doc.data());
    setAllTweets(currUserTweetsDbMapped);

    const my = currUserTweetsDbMapped.filter(e => !e.isReply);
    setMyTweets(my);

        }
    }

    useEffect(() => {
        getCurrUserData()
    }, []);

    const switchTab = num => {
        setCurrentTab(num); 
        if (num == 1) {
            tab1Ref.current.className = 'visible-tab';
            tab2Ref.current.className = 'invisible-tab';

            tab1.current.className = 'tweets-tweets-active';
            tab2.current.className ='tweets-tweets-nonactive';

        } else if (num == 2) {
            tab1Ref.current.className = 'invisible-tab';
            tab2Ref.current.className = 'visible-tab';

            tab1.current.className = 'tweets-tweets-nonactive';
            tab2.current.className ='tweets-tweets-active';
        }
    }

    return (
        <div className='profile'>
            <Sidebar />
                <div className='profile-col'>
                    <div className='profile-header'>
                        
                        <Avatar src={avatar} className='avatar-large' />
                        <div className='profile-info'>
                            <div className='displayname-profile'>{displayName}</div> 
                            <div className='twittername-profile'>@{twitterName}</div> 
                            <div className='joined-profile'><CalendarTodayIcon className='inline-icon' />  Joined {joined}</div>
                            <div className='following-followers-profile'>0 following 0 followers</div>
                        </div>
                        <div className='select-profile'>
                            <div className='tweets-tweets select-profile-item tweets-tweets-active' ref={tab1} onClick={() => switchTab(1)}> Tweets </div>
                            <div className='tweets-replies select-profile-item' ref={tab2} onClick={() => switchTab(2)}>Tweets & replies</div>
                            <div className='tweets-media select-profile-item'>Media</div>
                            <div className='tweets-likes select-profile-item'>Likes</div>
                        </div>
                    </div>
                    <div id='1' ref={tab1Ref} className='visible-tab'>
                   {myTweets.map(e => {
                       return (
                                        <Post 
                                        
                                text={e.text} 
                                displayName={e.displayName}
                        userName={e.userName}
                        avatar={e.avatar}
                        verified={e.verified}
                        timeStamp={e.timeStamp}
                        text={e.text}
                        image={e.image}
                        likes={e.likes}
                        retweets={e.retweets}
                        responses={e.responses}
                        currUser={thisuserId}
                        retweeted= {e.retweet ? true : false}
                        />
                       )
                   })}
                   </div>
                    <div id='2' ref={tab2Ref} className='invisible-tab'>
                   {alltweets.map(e => {
                       return (
                                        <Post 
                                        
                                text={e.text} 
                                displayName={e.displayName}
                        userName={e.userName}
                        avatar={e.avatar}
                        verified={e.verified}
                        timeStamp={e.timeStamp}
                        text={e.text}
                        image={e.image}
                        likes={e.likes}
                        retweets={e.retweets}
                        responses={e.responses}
                        currUser={thisuserId}
                        retweeted= {e.retweet ? true : false}
                        />
                       )
                   })}
                   </div>
                </div>
          <Widgets />
        </div>
    )
}