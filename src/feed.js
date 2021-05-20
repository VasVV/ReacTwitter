import React, {useState, useEffect} from 'react';
import './feed.css';
import TweetBox from './tweetbox';
import Post from './post';
import { db} from './firebase';
import props from 'prop-types';


export default function Feed() {

    

    const [posts, setPosts] = useState([]);
    

    function handleChange() {
        getPosts();
    }


    const getPosts = async() => {
        const snapshot = await db.collection('tweets').get().then(snapshot => {
            let tweets = snapshot.docs.map(doc => doc.data());
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
                console.log(e);
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