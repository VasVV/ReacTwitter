import React from 'react'
import firebase from 'firebase';
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDA5sEcESGNGI5oee2C1QGAV8aDtDauGxg",
    authDomain: "reactwitter-364e1.firebaseapp.com",
    projectId: "reactwitter-364e1",
    storageBucket: "reactwitter-364e1.appspot.com",
    messagingSenderId: "274058259196",
    appId: "1:274058259196:web:9ccde899f0b3090d294579"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();

  const storage = firebase.storage(); 

  export {firebaseApp, db, storage};