import React, {useState} from 'react';
import TwitterIcon from '@material-ui/icons/Twitter';
import {Link, useHistory} from 'react-router-dom';
import {firebaseApp} from './firebase';
import './login.css';

export default function Login() {

    const auth = firebaseApp.auth();
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');

    const login = async() => {
        try {
        const loginUser = await auth.signInWithEmailAndPassword(email, password);
        console.log(loginUser)
        history.push('/dashboard');
        } catch(err) {
            console.log(err);
            const errmessage = await err.message;
            console.log(errmessage)
            setErr(errmessage);
        }

    }

    return (
        <div className='login'>
            <div className='twitter-sign'>
                <TwitterIcon className='twitter-icon'/>
            </div>
            <div className='twitter-login-text'>
                Log in to ReacTwitter
            </div>
            {err&&<p>Check your email and password and try again</p>}

            <div className='login-email'>
                <input type='text' placeholder='Your e-mail' onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='login-password'>
                <input type='password' placeholder='Your e-password' onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='login-btn-form'>
                <button className='login-btn-form-btn' onClick={() => login()}>Log in</button>
            </div>
            <div className='forgot-register'>
                <div className='forgot'>
                    <Link to='/forgotpassword'> <a href='#'> Forgot password? </a> </Link>
                </div>
                <div className='register-redirect'>
                    <Link to='/registerform'><a href='#'>Register</a></Link>     
                </div>
            </div>
        </div>
    )
}