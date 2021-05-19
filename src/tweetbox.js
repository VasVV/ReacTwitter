import React from 'react';
import {Avatar, Button} from '@material-ui/core';
import './tweetbox.css'

import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import GifIcon from '@material-ui/icons/Gif';
import PollIcon from '@material-ui/icons/Poll';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import EventIcon from '@material-ui/icons/Event';

export default function TweetBox() {
    return (
        <div className='tweetbox'>
            <form>
                <div className='tweetbox-input'>
                    <Avatar src='https://www.mantruckandbus.com/fileadmin/media/bilder/02_19/219_05_busbusiness_interviewHeader_1485x1254.jpg' />
                    <input type='text' />
                    
                </div>
                <div className='tweetbox-submit-line'>
                    <div className='media-submit-line'>
                        <CropOriginalIcon />
                        <GifIcon />
                        <PollIcon />
                        <InsertEmoticonIcon />
                        <EventIcon />
                    </div>
                    <div className='tweet-btn-container'> <button className='tweet-btn' variant='outlined' >Tweet </button></div>
                    
                </div>
            </form>
        </div>
    )
}