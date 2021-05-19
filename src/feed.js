import React, {useState, useEffect} from 'react';
import './feed.css';
import TweetBox from './tweetbox';
import Post from './post';
import {firebaseApp, db} from './firebase';

export default function Feed() {

    const [posts, setPosts] = useState([]);

    const getPosts = async() => {
        const snapshot = await db.collection('tweets').get().then(snapshot => {
            let tweets = snapshot.docs.map(doc => doc.data());
            console.log(tweets)
            setPosts(tweets);
        })
        }
    

    useEffect(() => {
      getPosts() 
    }, [])

    return (
        <div className='feed'>
            <div className='feed-header'>
                <h2>Home</h2>
            </div>

            <TweetBox />
            {posts.map(e => {
                return (
                    <>
                    <Post 
            text={e.text} 
            displayName={e.displayName}
    userName={e.userName}
    avatar={e.avata}
    verified={e.verified}
    timestamp={e.timestamp}
    text={e.text}
    image={e.image} />
            </>
                )
            })}
            
            Feed
        </div>
    )
}