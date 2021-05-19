import React, { useEffect } from 'react';
import './sidebaroptions.css'

export default function Sidebaroptions({active, text, Icon}) {

    return (
        <div className={`sidebarOption ${active && 'sidebarOption-active'}`}>
            {Icon}
            <h2>{text}</h2>
        </div>
        
    )
}