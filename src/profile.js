import React, { useEffect, useState, useRef } from 'react';
import Sidebar from './sidebar';
import Feed from './feed';
import Widgets from './widgets';

import './profile.css';
import { Avatar } from '@material-ui/core';
import {storage, db, firebaseApp} from './firebase';
import Post from './post';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import Modal from 'react-modal';

import TwitterIcon from '@material-ui/icons/Twitter';
import { NextWeek } from '@material-ui/icons';

export default function Profile() {

    const tab1Ref = useRef(null);
    const tab2Ref = useRef(null);
    const tab3Ref = useRef(null);
    
    const tab4Ref=useRef(null);

    const tab1 = useRef(null);
    const tab2 = useRef(null);
    const tab3 = useRef(null);
    const tab4 = useRef(null);

    const inputFile = useRef(null);

    const [avatar, setAvatar] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [twitterName, setTwitterName] = useState('');
    const [alltweets, setAllTweets] = useState([]);
    const [myTweets, setMyTweets] = useState([]);
    const [thisuserId, setthisUserId] = useState('');
    const [currentTab, setCurrentTab] = useState(1);
    const [joined, setJoined] = useState('');
    const [myLikes, setMyLikes] = useState([]);
    const [tweetsWithMedia, setTweetsWithMedia] = useState([]);
    const [numberOfFollowers, setNumberOfFollowers] = useState(0);
    const [numberOfFollowing, setNumberOfFollowing] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [avatarChanged, setAvatarChanged] = useState('');
    const [modalText, setModalText] = useState('Have a favorite selfie? Upload it now.');
    const [modalHeaderText, setModalHeaderText ] = useState('Pick a profile picture');
    const [avatarStep, setAvatarStep] = useState(true); 
    const [myBio, changeMyBio] = useState('');

    const uploadFile = () => {
        
        inputFile.current.click();
      };

      const uploadImage = async(image) => {
        if (image) {
           
            const storageRef = storage.ref();
           
            const imageRef = storageRef.child(image.name);
           
            await imageRef.put(image)
           
           const imglink = await imageRef.getDownloadURL();
           
           setAvatarChanged(imglink);

           const currUserId = firebaseApp.auth().currentUser.uid;

           const currUserEntry = await db.collection('users').where('userId', '==', currUserId).get();
         
          const entryId = currUserEntry.docs[0].id;

           const currUserEntryMapped = currUserEntry.docs.map(docs => docs.data())[0];

           currUserEntryMapped.avatar = imglink;

           const changeAvatar = await db.collection('users').doc(entryId).set(currUserEntryMapped);

           
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
                setAvatarChanged(url);
                uploadImage(files[0])
                
            }
            
        }
    }

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

    const currUserLikesDb =  await db.collection('tweets').get();
    const currUserLikesDbMapped = currUserLikesDb.docs.map(doc => doc.data()).filter(e => e.likes.includes(userId));
    
    setMyLikes(currUserLikesDbMapped);

    const currUserTweetsWithMedia = currUserTweetsDb.docs.map(doc => doc.data()).filter(e => e.image);
    setTweetsWithMedia(currUserTweetsWithMedia);


        }
    }

    useEffect(() => {
        getCurrUserData();
        initialCheckFollow();
    }, []);

    const initialCheckFollow = async() => {

        const currentUserId = await firebaseApp.auth().currentUser.uid;

        const currentUserDb = await db.collection('users').where('userId', '==', currentUserId).get();

        const currUserDbMapped = currentUserDb.docs.map(doc => doc.data())[0];

        setNumberOfFollowing(currUserDbMapped.following.length);
        setNumberOfFollowers(currUserDbMapped.followers.length);

        if (currUserDbMapped.bio) {
            changeMyBio(currUserDbMapped.bio)
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

    const next = () => {
        setModalHeaderText('Describe yourself');
        setModalText('What makes you special? Dont think too hard, just have fun with it.')
        setAvatarStep(false);
    }

    const saveBio = async() => {
        const currUserId = firebaseApp.auth().currentUser.uid;

        const currUserEntry = await db.collection('users').where('userId', '==', currUserId).get();
      
       const entryId = currUserEntry.docs[0].id;

        const currUserEntryMapped = currUserEntry.docs.map(docs => docs.data())[0];

        currUserEntryMapped.bio = myBio;

        const changeBio = await db.collection('users').doc(entryId).set(currUserEntryMapped);

        setShowModal(false);
    }
    

    return (
        <>
        <Modal 
        className="Modal"
        overlayClassName="Overlay"
           isOpen={showModal}
           contentLabel="Minimal Modal Example"
        >
            <div className='modal'>
                <div className='modal-header'>
                    <div className='twitter-icon-modal'>
                        <TwitterIcon />
                    </div>
                    <div className='modal-text-bold'>
                        <h1>{modalHeaderText}</h1>
                    </div>
                    <div className='modal-text'>
                        <p>{modalText}</p>
                        {!avatarStep && <>{myBio.length} / 160 </>  } 
                    </div>
                    <div className='modal-content-avatar'>
                        {avatarStep ? <><Avatar src={avatarChanged} onClick={() => uploadFile()} />
                        <input type='file' id='file' name='image' ref={inputFile} style={{display: 'none'}} onChange={handleFileUpload}/> </> :
                       <>  <br /> <input type='text' className='modal-bio-text' value={myBio} maxLength={160} onChange={(e) => changeMyBio(e.target.value) }/> </>
                        }

                    </div>
                </div>
            </div>
            <div className='close-btn-container'>
            <button onClick={() => setShowModal(false)} className='close-modal-btn'>Close</button>
           {avatarStep ? <button onClick={() => next()} className='close-modal-btn'>Next</button> :
           <button onClick={() => saveBio()} className='close-modal-btn'>Save and close</button>
           }
            </div>
          
        </Modal>
        <div className='profile'> 
        

            <Sidebar />
                <div className='profile-col'>
                    <div className='profile-header-profile'>
                        
                        <Avatar src={avatar} className='avatar-large' />

                        <div className='profile-info'>
                            <div className='profile-up'>
                                <div className='profile-names'>
                            <div className='displayname-profile'>{displayName}</div> 
                            <div className='twittername-profile'>@{twitterName}</div> 
                            </div>
                            <div className='editbtn'> <button className='edit-profile-btn' onClick={() => setShowModal(true)}>Edit profile</button></div>
                           
                            </div>
                            <div className='joined-profile'><CalendarTodayIcon className='inline-icon' />  Joined {joined}</div>
                            <div className='following-followers-profile'> <strong>{numberOfFollowing}</strong> following <strong>{numberOfFollowers}</strong> Followers</div>
                            <div className='bio-profile'>{myBio}</div>
                            
                        
                           
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

                   <div id='4' ref={tab4Ref} className='invisible-tab' >
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
          <Widgets userIdForImg={firebaseApp.auth().currentUser.uid} />
        </div>
        </>
    )
}