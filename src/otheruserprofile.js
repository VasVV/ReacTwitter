import React, { useEffect, useState, useRef } from 'react';
import Sidebar from './sidebar';
import Feed from './feed';
import Widgets from './widgets';

import './otheruserprofile.css';
import { Avatar } from '@material-ui/core';
import {db, firebaseApp} from './firebase';
import Post from './post';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import {useSelector, useDispatch} from 'react-redux';

export default function OtherUserProfile() {

    const dispatch = useDispatch();

    const tab1Ref = useRef(null);
    const tab2Ref = useRef(null);
    const tab3Ref = useRef(null);
    const tab4Ref=useRef(null);

    const tab1 = useRef(null);
    const tab2 = useRef(null);
    const tab3 = useRef(null);

    const tab4 = useRef(null);

    const [avatar, setAvatar] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [twitterName, setTwitterName] = useState('');
    const [joined, setJoined] = useState('');
    const [followed, setFollowed] = useState('');
    const [numberOfFollowers, setNumberOfFollowers] = useState(0);
    const [numberOfFollowing, setNumberOfFollowing] = useState(0);
    const [myLikes, setMyLikes] = useState([]);
    const [tweetsWithMedia, setTweetsWithMedia] = useState([]);


    const user = useSelector(state => state.userInfo);

    const recieveUserInfo = () => {
        console.log('user from redfux');
        console.log(user);
        setAvatar(user[2]);
        setDisplayName(user[1]);
        setTwitterName(user[0]);
        setJoined(user[4]);
        setUserId(user[5]);
        initialCheckFollow(user[5]);
        getCurrUserData(user[5]);
        dispatch({type: 'USERID', payload: user[5]})
    }

    useEffect(() => {
        recieveUserInfo();
        
    },[])

    
    const [allusertweets, setAlluserTweets] = useState([]);
    const [userTweets, setUserTweets] = useState([]);
    const [thisuserId, setthisUserId] = useState('');
    const [currentTab, setCurrentTab] = useState(1);
    const [userId, setUserId] = useState('');
    // const [joined, setJoined] = useState('');
    const [alltweets, setAllTweets] = useState([]);
    const [myTweets, setMyTweets] = useState([]);

    const getCurrUserData = async(userId) => {
        if (firebaseApp.auth()) {
    
    const currUserDb = await db.collection('users').where('userId', '==', userId).get();
    const currUserDbMapped = currUserDb.docs.map(doc => doc.data())[0];
    
    const currUserTweetsDb = await db.collection('tweets').where('userId', '==', userId).get();
    const currUserTweetsDbMapped = currUserTweetsDb.docs.map(doc => doc.data());
    setAllTweets(currUserTweetsDbMapped);

    const my = currUserTweetsDbMapped.filter(e => !e.isReply);
    setMyTweets(my);

    const currUserLikesDb =  await db.collection('tweets').get();
    const currUserLikesDbMapped = currUserLikesDb.docs.map(doc => doc.data()).filter(e => e.likes.includes(userId));
    
    setMyLikes(currUserLikesDbMapped);

    const currUserTweetsWithMedia = currUserTweetsDb.docs.map(doc => doc.data()).filter(e => e.image);
    setTweetsWithMedia(currUserTweetsWithMedia);

        }
    }

   

    const addRemoveFollow = async() => {
        const user = await db.collection('users').where('userId', '==', userId).get();
       
        const otherUserDocId = user.docs[0].id;
        const mappedUser = user.docs.map(doc => doc.data())[0];
       
        const currUserId = firebaseApp.auth().currentUser.uid;
        const addFollowing = await db.collection('users').where('userId', '==', currUserId).get();
        const currUserDocId = addFollowing.docs[0].id;
        const mappedCurrentUser = addFollowing.docs.map(doc => doc.data())[0];
        
        if ( mappedUser.followers.includes(currUserId) ) {
           const index = mappedUser.followers.findIndex(e => e == currUserId);
          
            mappedUser.followers.splice(index, 1);
            const index2 = mappedCurrentUser.following.findIndex(e => e== userId);
            mappedCurrentUser.following.splice(index2, 1);
            
        } else {
            mappedUser.followers.push(currUserId);
            mappedCurrentUser.following.push(userId);
        }

        console.log('current user changed');
        console.log(mappedCurrentUser);

        console.log('other user changed');
        console.log(mappedUser)


        const addFollower = await db.collection('users').doc(otherUserDocId).set(mappedUser);
        const addFollowingtoDb = await db.collection('users').doc(currUserDocId).set(mappedCurrentUser);
        initialCheckFollow(userId);
    }

    const initialCheckFollow = async(otherUserId) => {

        const currentUserId = await firebaseApp.auth().currentUser.uid;

        const currentUserDb = await db.collection('users').where('userId', '==', currentUserId).get();

        const currUserDbMapped = currentUserDb.docs.map(doc => doc.data())[0];

        const otheruser = await db.collection('users').where('userId', '==', otherUserId).get();
       
        const mappedotherUser = otheruser.docs.map(doc => doc.data())[0];

        setNumberOfFollowers(mappedotherUser.followers.length);
        setNumberOfFollowing(mappedotherUser.following.length);

        
        
        if (currUserDbMapped.following.includes(otherUserId) ) {
            setFollowed(true);
            console.log('true')
        } else {
            setFollowed(false)
            console.log('false')
        }
    }

    const switchTab = num => {
        setCurrentTab(num); 
        if (num == 1) {
            tab1Ref.current.className = 'visible-tab';
            tab2Ref.current.className = 'invisible-tab';
            tab3Ref.current.className = 'invisible-tab';
            tab4Ref.current.className = 'invisible-tab';

            tab1.current.className = 'tweets-tweets-active';
            tab2.current.className ='tweets-tweets-nonactive';
            tab3.current.className ='tweets-tweets-nonactive';
            tab4.current.className= 'tweets-tweets-nonactive'

        } else if (num == 2) {
            tab1Ref.current.className = 'invisible-tab';
            tab2Ref.current.className = 'visible-tab';
            tab3Ref.current.className = 'invisible-tab';
            tab4Ref.current.className = 'invisible-tab';

            tab1.current.className = 'tweets-tweets-nonactive';
            tab2.current.className ='tweets-tweets-active';
            tab3.current.className ='tweets-tweets-nonactive';
            tab4.current.className= 'tweets-tweets-nonactive'
        } else if (num == 3) {
            tab1Ref.current.className = 'invisible-tab';
            tab2Ref.current.className = 'invisible-tab';
            tab3Ref.current.className = 'visible-tab';
            tab4Ref.current.className = 'invisible-tab';

            tab1.current.className = 'tweets-tweets-nonactive';
            tab2.current.className ='tweets-tweets-nonactive';
            tab3.current.className ='tweets-tweets-active';
            tab4.current.className= 'tweets-tweets-nonactive'
        }

        else if (num == 4) {
            tab1Ref.current.className = 'invisible-tab';
            tab2Ref.current.className = 'invisible-tab';
            tab3Ref.current.className = 'invisible-tab';
            tab4Ref.current.className = 'visible-tab';

            tab1.current.className = 'tweets-tweets-nonactive';
            tab2.current.className ='tweets-tweets-nonactive';
            tab3.current.className ='tweets-tweets-nonactive';
            tab4.current.className= 'tweets-tweets-active'
        }
    }

    return (
        <div className='profile'>
            <Sidebar />
                <div className='profile-col'>
                    <div className='profile-header'>
                        
                        <Avatar src={avatar} className='avatar-large' />
                        <div className='profile-info-other'>
                            <div>
                            <div className='displayname-profile'>{displayName}</div> 
                            <div className='twittername-profile'>@{twitterName}</div> 
                            <div className='joined-profile'><CalendarTodayIcon className='inline-icon' />  Joined {joined} </div>
                            <div className='following-followers-profile'><strong>{numberOfFollowing}</strong> following <strong>{numberOfFollowers} </strong> followers</div>

                            </div>
                            
                            <div>
                                <button className='follow-unfollow-btn' onClick={() => addRemoveFollow()}>{followed ? 'Unfollow' : 'Follow'}</button>
                            </div>

                        </div>
                        <div className='select-profile'>
                            <div className='tweets-tweets select-profile-item tweets-tweets-active' ref={tab1} onClick={() => switchTab(1)}> Tweets </div>
                            <div className='tweets-replies select-profile-item' ref={tab2} onClick={() => switchTab(2)}>Tweets & replies</div>
                            <div className='tweets-media select-profile-item' ref={tab3} onClick={() => switchTab(3)}> Media</div>
                            <div className='tweets-likes select-profile-item' ref={tab4} onClick={() => switchTab(4)}>Likes</div>
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

                   <div id='3' ref={tab3Ref} className='invisible-tab'>
                    {
                        tweetsWithMedia.map(e => {
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
                        })
                    }
                   </div>

                   <div id='4' ref={tab4Ref} className='invisible-tab'>
                   {myLikes.map(e => {
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
          <Widgets 
          userIdForImg={user[5]}
          />
        </div>
    )
}