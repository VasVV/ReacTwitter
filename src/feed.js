import React, {useState, useEffect} from 'react';
import './feed.css';
import TweetBox from './tweetbox';
import Post from './post';
import { db, firebaseApp} from './firebase';
import props from 'prop-types';


export default function Feed() {

    
    const currUser = firebaseApp.auth().currentUser;
    const [posts, setPosts] = useState([]);
    const [updateChild, setupdateChild] = useState(0);

    function handleChange() {
        getPosts();
        console.log('got posts!!')
    }


    const getPosts = async() => {
        const snapshot = await db.collection('tweets').get().then(snapshot => {
            let tweets  = snapshot.docs.map(doc => doc.data());
            setPosts(tweets);
        })
        }
    

    useEffect(() => {
      getPosts() 
    }, []);

    

    return (
        <div className='feed'>
            <div className='feed-header'>
                <h2>Home</h2>
            </div>

            <TweetBox update={handleChange} />
            {posts.map(e => {
               
                return (
                    
                    <Post update={handleChange} 
                    updatePost={posts}
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
    currUser={currUser.uid}
    retweeted= {e.retweet ? true : false}
    />
            
                )
            })}
            
            Feed
        </div>
    )
}