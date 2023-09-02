'use client'

import React, { useState } from 'react';
import Nav from "./components/nav"

export default function ClientSide() {
    const [connectedWallet, getConnectedWallet] = useState(null)

    const api = window.cardano
    
    return (
        <>
            <Nav api={api} getConnectedWallet={getConnectedWallet} />
        </>
    )
}