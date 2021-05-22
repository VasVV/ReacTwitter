import React, {useState} from 'react';
import TwitterIcon from '@material-ui/icons/Twitter';
import {Link, useHistory} from 'react-router-dom';
import './login.css';
import {firebaseApp} from './firebase';


export default function RegisterForm() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');


    const auth = firebaseApp.auth();

    const register = async() => {
        try {
        const createUser = await auth.createUserWithEmailAndPassword(email, password);
        
        setErr('You have registered succesfully. Now we will redirect you to the next step of the registration process...');
        setTimeout(()=>history.push('/registertwo'), 3000);
        } catch(err) {
            const errmessage = await err.message;
            setErr(errmessage);
        }

    }

    return (
        <div className='login'>
            <div className='twitter-sign'>
                <TwitterIcon className='twitter-icon'/>
            </div>
            <div className='twitter-login-text'>
                Register in ReacTwitter
            </div>
            {err&&<p>{err}</p>}
            <div className='login-email'>
                <input type='text' placeholder='Your e-mail' onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className='login-password'>
                <input type='password' placeholder='Your password' onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='login-btn-form'>
                <button className='login-btn-form-btn' onClick={() => register()}>Register</button>
            </div>
            
        </div>
    )
}