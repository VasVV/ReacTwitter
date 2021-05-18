import React from 'react';
import './sidebaroptions.css'

export default function Sidebaroptions({text, Icon}) {

    return (
        <div className='sidebar-option'>
            {<Icon />}
            <h2>{text}</h2>
        </div>
    )
}