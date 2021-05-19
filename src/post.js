import React from 'react';
import './post.css';
import {Avatar} from '@material-ui/core'
import { ChatBubbleOutline, FavoriteBorder, PublishOutlined, RepeatOutlined, VerifiedUserRounded } from '@material-ui/icons';
import './post.css'


export default function Post({
    displayName,
    userName,
    avatar,
    verified,
    timestamp,
    text,
    image
}) {

    return (

        <div className='post'>
            <div className='post-avatar'>
                <Avatar src={avatar} />
            </div>
                <div className='post-body'>
                    <div className='post-header'>
                        <div className='header-text'>
                            <h3>{displayName} <span>
                                {verified&&<VerifiedUserRounded className='verified-icon' />}
                                </span> @{userName} · {timestamp}
                                
                                </h3>
                        </div>
                        <div className='post-headerdescription'>
                            <p>{text}</p>
                        </div>
                    </div>
                    <div className='post-img'>
                        {image&&<img src={image} />}
                    </div>
                     <div className='footer-icons'> 
                    <ChatBubbleOutline fontSize='small' />
                    <RepeatOutlined fontSize='small'  />
                    <FavoriteBorder fontSize='small' />
                    <PublishOutlined fontSize='small' />
                    </div>
                </div>
        </div>

        
    )
}