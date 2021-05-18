import React from 'react';
import './sidebar.css'

import HomeIcon from '@material-ui/icons/Home';
import TwitterIcon from '@material-ui/icons/Twitter';
import Sidebaroptions from './sidebaroptions';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';

export default function Sidebar() {
    const vals = [['Home', <HomeIcon />],['Explore', <SearchIcon />], ['Notifications', <NotificationsIcon />]]
    return (
        <div className='sidebar'>
            {
                vals.map(e => {
                    return (
                        <Sidebaroptions text={e[0]} icon ={e[1]} />
                    )
                })
            }

            
        </div>
        )
};

