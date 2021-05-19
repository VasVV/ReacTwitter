import React from 'react';
import './widgets.css';
import SearchIcon from '@material-ui/icons/Search';
import {TwitterTimelineEmbed, TwitterShareButton, TwitterTweetEmbed} from 'react-twitter-embed';
export default function Widgets() {
    return (
        <div className='widgets'>
            <div className='widgets-input'>
                <SearchIcon className='widgets-search' />
                <input placeholder='Search Twitter' type='text' />

                <TwitterShareButton />
                </div>    



        </div>
    )
}