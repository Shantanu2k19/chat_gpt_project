import React from "react"
import { Link } from 'react-router-dom';

export default function Testpage() {
    return (
        <div>
            error!
            <br/>
            <Link to="/">
            <button>back to login</button>
            </Link>
        </div>
    )
};