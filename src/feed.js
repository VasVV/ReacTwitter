import React, {useState, useEffect} from 'react';
import './feed.css';
import TweetBox from './tweetbox';
import Post from './post';
import { db, firebaseApp} from './firebase';
import {useSelector} from 'react-redux';
import props from 'prop-types';
import {store} from './index';

export default function Feed() {

    const Store = store;
    
    const  select = (state) => {
        return state.update
      }


      let currentValue;
      const [update, setUpdate] = useState();


    const handleChangeStore = () => {
        let previousValue = currentValue
        currentValue = select(Store.getState());
        if (previousValue !== currentValue) {
            getPosts()
          }
        }

        const unsubscribe = Store.subscribe(handleChangeStore)
    
    const currUser = firebaseApp.auth().currentUser;
    const [posts, setPosts] = useState([]);
    const [updateChild, setupdateChild] = useState(0);
    

    function handleChange() {
        getPosts();
        console.log('got posts!!');
    }


    const getPosts = async() => {
        const snapshot = await db.collection('tweets').get().then(snapshot => {
            let tweets  = snapshot.docs.map(doc => doc.data());
            const currUserId = firebaseApp.auth().currentUser.uid;
            const currUserDb = db.collection('users').where('userId', '==', currUserId).get().then(res => {
                const currUserDbMapped = res.docs.map(doc => doc.data())[0];
                const following = currUserDbMapped.following;

                console.log('tweets')
                console.log(tweets);
                console.log('mapped')
                console.log(currUserDbMapped)
                tweets = tweets.map(e => {
                    if (following.includes(e.userId) || e.userId == currUserId) {
                        console.log('includes')
                        console.log(e.userId)
                        return e;
                    } else return false;
                }).filter(e => e)
                setPosts(tweets);

                });
            
        })
        }
    

    useEffect(() => {
      getPosts();
      unsubscribe();
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
    joined = {e.joined}
    thisPostUserId={e.userId}
    />
            
                )
            })}
            
            Feed
        </div>
    )
}