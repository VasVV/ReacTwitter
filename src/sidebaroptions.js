import React, { useEffect } from 'react';
import {Link} from 'react-router-dom';
import './sidebaroptions.css'

export default function Sidebaroptions({active, text, Icon, redirect}) {

    return (
        <Link to={redirect}>
        <div className={`sidebarOption ${active && 'sidebarOption-active'}`}>
            {Icon}
            <h2>{text}</h2>
        </div>
        </Link>
    )
}