import React, {useState, useEffect} from 'react';
import './post.css';
import {Avatar} from '@material-ui/core'
import { ChatBubbleOutline, FavoriteBorder, PublishOutlined, RepeatOutlined, VerifiedUserRounded } from '@material-ui/icons';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {Link} from 'react-router-dom';

import {db,firebaseApp} from './firebase';
import { adduserinfo } from './actions/adduserinfo';

import {useDispatch} from 'react-redux';

export default function Post({
    displayName,
    userName,
    avatar,
    verified,
    timestamp,
    text,
    image,
    timeStamp,
    currUser,
    update,
    updatePost,
    joined,
    thisPostUserId

}) {
    const dispatch = useDispatch();
    

    const [likes, setLikes] = useState(0);
    const [numberOfLikes, setNumberOflikes] = useState(0);
    const [liked, setLiked] = useState();
    const [numberOfRetweets, setNumberOfRetweets] = useState(0);
    const [retweeted, setRetweeted] = useState();
    const [isRetweet, setisRetweet] = useState();
    const [retweetedBy, setRetweetedBy] = useState();
    const [showreplybox, setShowreplybox] = useState(false);
    const [reply, setReply] = useState('');
    const [allReplies, setAllReplies] = useState([]);
    const [linkToProfile, setLinkToProfile] = useState('');


    useEffect(() => {
        initialLikesCheck();
        getData();
        checkIfCurrent();
    },[]);

    useEffect(() => {
        setLikes(likes => likes + 1);
        console.log('post updated'); //simultaniously update all components !
    },[updatePost]);

    const checkIfCurrent = async() => {
        const thispost = await db.collection('tweets').where('timeStamp', '==', timeStamp).get();
        let thispostdata  = thispost.docs.map(doc => doc.data())[0];
        
        if (thispostdata.userId == currUser) {
            setLinkToProfile('/profile')
        } else {
            setLinkToProfile('/otheruserprofile')
        }


    }

    const getData = async() => {
        const thispost = await db.collection('tweets').where('timeStamp', '==', timeStamp).get();
        let thispostdata  = thispost.docs.map(doc => doc.data())[0];
        setisRetweet(thispostdata.retweet);
        
       
        if (thispostdata.retweet) {
            setRetweetedBy(thispostdata.retweetedBy)
        }
    }
   

    const initialLikesCheck = async() => {
        const tweets = await db.collection('tweets').where('timeStamp', '==', timeStamp).get();
        let mapped  = tweets.docs.map(doc => doc.data())[0];
        
        if (mapped && mapped.likes.length > 0) {
            
        const includes = mapped.likes.includes(currUser);
        if (includes) {
            
            setLiked(true);       
        } else {setLiked(false);}
        setNumberOflikes(mapped.likes.length)
    }
    }
   
    const addLike = async() => {
        const tweets = await db.collection('tweets').where('timeStamp', '==', timeStamp).get();
       
        
        const id = tweets.docs[0].id
        let mapped  = tweets.docs.map(doc => doc.data())[0];
        

        const includes = mapped.likes.includes(currUser);
       
        if (includes) {
            const index =  mapped.likes.findIndex(e => e == currUser);
            mapped.likes.splice(index, 1);
            const add = await db.collection('tweets').doc(id).set(mapped);
            
            if (mapped.retweet) {
                let parent;
                const getParentId = await db.collection('tweets').doc(mapped.parent).get().then(doc => {
                    parent = doc.data();
                });
                const index = parent.likes.findIndex(e => e == currUser);
                parent.likes.splice(index, 1);
               
                const updateParent = await db.collection('tweets').doc(mapped.parent).set(parent);
               
            }
            setLiked(false)
        } else {
            mapped.likes.push(currUser);
            const add = await db.collection('tweets').doc(id).set(mapped);
            if (mapped.retweet) {
                let parent; 
                const getParentId = await db.collection('tweets').doc(mapped.parent).get().then(doc => {
                    parent = doc.data();
                });
                parent.likes.push(currUser);
                const updateParent = await db.collection('tweets').doc(mapped.parent).set(parent);
            }

            setLiked(true);
        }


        const tweetsNew = await db.collection('tweets').where('timeStamp', '==', timeStamp).get();
        let numOfLikes = tweetsNew.docs.map(doc => doc.data())[0].likes.length;
        setNumberOflikes(numOfLikes);
       // update('aaa');
    }


   

    const addRetweet = async() => {
          
          
          const tweets = await db.collection('tweets').where('timeStamp', '==', timeStamp).get();
          
          let date = new Date();
          let newTimeStamp = date.toJSON().slice(0,10).replace(/-/g,'/') + ' ' + date.toTimeString().split(' ')[0];


        let mapped  = tweets.docs.map(doc => doc.data())[0];

        const id = tweets.docs[0].id;
        //ddd
       



        if (mapped.retweet) {
            console.log('this is retweet!!!');
            //if retweet ->
            //1)add new post (child) with parents content
            //2)  update users who retweeted (retweets) of a parent +
            //3)  update children of a parent +
            

            const parentId = mapped.parent;

            let parentdata;

            const parent = await db.collection('tweets').doc(parentId).get().then((doc) => {
                parentdata = doc.data();
            })
            //if this user did retweet already
            if ( parentdata.retweets.includes(currUser) ) {
                console.log('delete retweet')
                //remove this user from parent
                const thisuserindex = parentdata.retweets.findIndex(e => e == currUser);
                parentdata.retweets.splice(thisuserindex, 1);
                //remove child from parent
                const childindex = parentdata.children.findIndex(e => e == id)
                parentdata.children.splice(childindex, 1)
                //update parent
                const updateparent = await db.collection('tweets').doc(parentId).set(parentdata);
                //remove element
                const removeRetweet = await db.collection('tweets').doc(id).delete();
            } else {

            let childId;

            const res = await db.collection('tweets').add({
                ...parentdata,
                retweetedBy: displayName,
                timeStamp: newTimeStamp,
                retweet: true
            }).then(docRef => childId = docRef.id);

            
            
           //

            parentdata.retweets.push(currUser);

            parentdata.children.push(id);
            
            const updateParent = await db.collection('tweets').doc(parentId).set(parentdata);

            
        }





        } else {
            console.log('this is original tweet');
            //if original tweet (parent)
            //1) create new post with this doc content
            //2) update this doc users who retweeted
            //3) update this doc children

            let childId;
            //if this user did retweet already
            if (mapped.retweets.includes(currUser)) {
                //delete child
                console.log('delete retweet');
                //find all retweets
                let thisretweet, retweetid;
               const allRetweets = await db.collection('tweets').where('retweet', '==', true)
               .where('userId', '==', currUser)
               .where('parent', '==', id)
               .get()

              
               thisretweet = allRetweets.docs.map(data => data.data())[0];

               const allRetweetsId = await db.collection('tweets').where('retweet', '==', true)
               .where('userId', '==', currUser)
               .where('parent', '==', id).get().then(doc => {
                  
                   retweetid = doc.docs[0].id;
               })
                
                //!
            
            ////remove user
            const thisuserindex = mapped.retweets.findIndex(e => e == currUser);
            mapped.retweets.splice(thisuserindex, 1);
            //remove child from parent
            const childindex = mapped.children.findIndex(e => e == id)
            mapped.children.splice(childindex, 1)
            //update this elem
            const updatethiselem = await db.collection('tweets').doc(id).set(mapped);
            //remove element
            const removeRetweet = await db.collection('tweets').doc(retweetid).delete();


            } else {
            const res = await db.collection('tweets').add({
                ...mapped,
                retweetedBy: displayName,
                parent: id,
                timeStamp: newTimeStamp,
                retweet: true
            }).then(docRef => childId = docRef.id);

            //updating this post data!!!
         
            mapped.children.push(childId);
             mapped.retweets.push(currUser);

            const updatethis =  await db.collection('tweets').doc(id).set(mapped);
        }

        }
        update('aaa');
    }

    const addReply = async() => {

        let date = new Date();
          let newTimeStamp = date.toJSON().slice(0,10).replace(/-/g,'/') + ' ' + date.toTimeString().split(' ')[0];
          const user = firebaseApp.auth().currentUser;
          const currUserDb = await db.collection('users').where('userId', '==', currUser).get();
          const udata = currUserDb.docs.map(user => user.data())[0];
        

        const thisTweet = await db.collection('tweets').where('timeStamp', '==', timeStamp).get();
        
        
        const parentid = thisTweet.docs[0].id;
        
        let mappedParent  = thisTweet.docs.map(doc => doc.data())[0];
        
        let replyId;

        await db.collection('tweets').add({
            avatar: udata.avatar,
            displayName: udata.displayName,
            image: '',
            text: reply,
            userId: currUser,
            userName: udata.twittername, //@bla
            verified: true,
            likes: [],
            retweets: [],
            responses: [],
            timeStamp: newTimeStamp,
            children: [],
            isReply: true,
            parent: parentid
        }).then(docRef => replyId = docRef.id);

        mappedParent.responses.push(replyId)

        await db.collection('tweets').doc(parentid).set(mappedParent);
    }

    const getallReplies = async() => {
        if (!showreplybox) {
        const thisTweet = await db.collection('tweets').where('timeStamp', '==', timeStamp).get();
        const parentid = thisTweet.docs[0].id;
        let responcesIds  = thisTweet.docs.map(doc => doc.data())[0].responses;
        let completeResponces = [];
        for (let a = 0; a < responcesIds.length; a++ ) {
            
            let responce = await db.collection('tweets').doc(responcesIds[a]).get().then(doc => {
                
                completeResponces.push(doc.data());
            });
        }
            
        
        

        setAllReplies(completeResponces);
    }
        setShowreplybox(!showreplybox)

    }

    const adduserinfo = () => {
        dispatch({type: 'ADD_USERINFO', payload: 
            [displayName,
            userName,
            avatar,
            verified,
            joined,
            thisPostUserId]})
    }


    return (

        <div className='post' >
            <div className='post-avatar'>
                <Avatar src={avatar} />
            </div>
                <div className='post-body'>
                    <div className='post-header'>
                    {isRetweet&& <p>{retweetedBy} retweeted</p>}
                    <Link to={linkToProfile}> <div className='header-text' onClick={() => adduserinfo()}>
                          <h3>{displayName} <span>
                                {verified&&<VerifiedUserRounded className='verified-icon' />}
                                </span>   @{userName} · {timeStamp}
                                
                                </h3>
                        </div></Link> 
                        <div className='post-headerdescription'>
                            <p>{text}</p>
                        </div>
                    </div>
                    <div className='post-img'>
                        {image&&<img src={image} />}
                    </div>
                     <div className='footer-icons'> 
                      <span className='reply-span' onClick= {()=>getallReplies()}> {allReplies ? allReplies.length : 0} <ChatBubbleOutline fontSize='small' /> </span>

                     <span className='retweet-span' onClick={() => addRetweet()}>{numberOfRetweets}<RepeatOutlined fontSize='small' style={{fill: retweeted&&'green'}}  /></span>   
                    <span className='like-span' onClick={() => addLike()}> {numberOfLikes} {liked ? <FavoriteIcon fontSize='small' style={{fill: "red"}} /> :<FavoriteBorder fontSize='small' />} </span>
                        <PublishOutlined fontSize='small' />
                    </div>
                    {showreplybox && 
                    <> 
                        <input type='text' placeholder='Your reply' className='reply-input' onChange={(e) => setReply(e.target.value)} /> 
                        <button className='reply-btn' onClick={() => addReply()}>Send</button> 
                        <ul>
                            
                            {allReplies.map(e => {
                               
                               return (<div className='post' >
                               <div className='post-avatar'>
                                   <Avatar src={e.avatar} />
                               </div>
                                   <div className='post-body'>
                                       <div className='post-header'>
                                       {e.isRetweet&& <p>{retweetedBy} retweeted</p>}
                                           <div className='header-text'>
                                               <h3>{e.displayName} <span>
                                                   {e.verified&&<VerifiedUserRounded className='verified-icon' />}
                                                   </span>   @{e.userName} · {e.timeStamp}
                                                   
                                                   </h3>
                                           </div>
                                           <div className='post-headerdescription'>
                                               <p>{e.text}</p>
                                           </div>
                                       </div>
                                       
                                   </div>
                               </div>)
                            })}
                        </ul>
                    </>
                        }
                </div>
                
        </div>

        
    )
}