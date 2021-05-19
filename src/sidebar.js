import React from 'react';
import './sidebar.css'
import { Button } from '@material-ui/core';


import HomeIcon from '@material-ui/icons/Home';
import Sidebaroptions from './sidebaroptions';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PersonIcon from '@material-ui/icons/Person';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import TwitterIcon from '@material-ui/icons/Twitter';

export default function Sidebar() {
    const vals = [['Home', <HomeIcon />],['Explore', <SearchIcon />], ['Notifications', <NotificationsIcon />], ['Messages', <MailOutlineIcon />], ['Bookmarks', <BookmarkBorderIcon />], ['Lists', <ListAltIcon />], ['Profile', <PersonIcon />], ['More', <MoreHorizIcon />]]
    return (
        <div className='sidebar'>
            <TwitterIcon className='twitter-icon' />
            {
                vals.map(e => {
                    let x = e[1]
                    return (
                        
                        <Sidebaroptions active={true} text={e[0]} Icon ={x} />
                    )
                })
            }
            <Button variant='outlined' className='sidebar-btn' fullWidth='true'>Tweet</Button>  
            
        </div>
        )
};

