import React from 'react';
import {Link} from 'react-router-dom';
import './register.css'
import Img from './register.png';
import TwitterIcon from '@material-ui/icons/Twitter';

export default function Register() {


    

    return (
        <div className='register'>
            <div className='big-image-col'>
                <div className='overlay-twitter'>
                <TwitterIcon className='twitter-icon'/>
                </div>
            </div>
            
            <div className='register-col'>
            <div className='twitter-sign-col'>
                    <TwitterIcon className='twitter-icon'/>
                </div>
                <div className='bigger-text-col'>
                    In touch with the events
                </div>
                <div className='smaller-text-col'>
                    Join ReacTwitter right now!
                </div>
                <div className='register-col-btn'>
                    <div className='register-btn-div'>
                    <Link to='/registerform'>  <button className='register-btn'>Register</button> </Link>
                    </div>
                    <div className='login-btn-div'>
                      <Link to='/login'><button className='login-btn'>Log in</button></Link>  
                    </div>
                   
                </div>
            </div>
        </div>
    )
}