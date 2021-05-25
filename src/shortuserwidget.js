import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import {firebaseApp, db} from './firebase';
import {useDispatch} from 'react-redux';
import './shortuserwidget.css';



export default function ShortUserWidget({
    displayName,
    twittername,
    avatar,
    userId
}) {

    const dispatch = useDispatch();

    const [followed, setFollowed] = useState(false);

    const addRemoveFollow = async() => {
        const user = await db.collection('users').where('userId', '==', userId).get();
       
        const otherUserDocId = user.docs[0].id;
        const mappedUser = user.docs.map(doc => doc.data())[0];
       
        const currUserId = firebaseApp.auth().currentUser.uid;
        const addFollowing = await db.collection('users').where('userId', '==', currUserId).get();
        const currUserDocId = addFollowing.docs[0].id;
        const mappedCurrentUser = addFollowing.docs.map(doc => doc.data())[0];
        console.log('initial current user');
        console.log(mappedCurrentUser);
        if ( mappedUser.followers.includes(currUserId) ) {
           const index = mappedUser.followers.findIndex(e => e == currUserId);
           console.log('INDEXS')
            console.log(index)
            mappedUser.followers.splice(index, 1);
            const index2 = mappedCurrentUser.following.findIndex(e => e== userId);
            mappedCurrentUser.following.splice(index2, 1);
            setFollowed(false);
            
        } else {
            mappedUser.followers.push(currUserId);
            mappedCurrentUser.following.push(userId);
            setFollowed(true);
        }

        console.log('current user changed');
        console.log(mappedCurrentUser);

        console.log('other user changed');
        console.log(mappedUser)


        const addFollower = await db.collection('users').doc(otherUserDocId).set(mappedUser);
        const addFollowingtoDb = await db.collection('users').doc(currUserDocId).set(mappedCurrentUser);

        dispatch({type: 'UPDATE', payload: 'abc'});
    }
    return (
        <div className='shortuser-widget'>
            <div className='shortuser-avatar-text'>
            <div className='shortuser-avatar-container'>
                <Avatar src={avatar} />
            </div>
            <div className='shortuser-text-container'>
                <div><strong>{displayName}</strong></div>
                <div>@{twittername}</div>
            </div>
            </div>
            <div className='shortuser-button-container'>
                <button className='shortuser-btn' onClick={() =>  addRemoveFollow()}>{followed ? 'Unfollow' : 'Follow'}</button>
            </div>
        </div>
    )
}