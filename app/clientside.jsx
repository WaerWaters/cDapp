'use client'

import React, { useState, useEffect } from 'react';

export default function ClientSide() {
    const [connectedWallet, setConnectedWallet] = useState("")
    const [showLoginLink, setShowLoginLink] = useState(true);
    const [installedWallets, setInstalledWallets] = useState({})
    const [showPopup, setShowPopup] = useState(false);
    const allowedWallets = ["lace", "nami", "eternl"]
    const api = window.cardano

    // Your function that runs when the site loads
    useEffect(() => {
        const wallets = {}
        Object.keys(api).forEach((wallet) => {
            if (allowedWallets.includes(wallet)) {
                wallets[wallet] = api[wallet]
                api[wallet].isEnabled().then((value) => {
                    if (value == true) {
                        setShowLoginLink(false)
                        setConnectedWallet(wallet)
                    }
                }) 
            }
        })
        setInstalledWallets(wallets)
    }, []); // Empty dependency array means this useEffect runs once when the component mounts.

    console.log(connectedWallet)

    function connectWallet(wallet) {
        api[wallet].enable().then((val) => {
            if (val != null) {
                api[wallet].isEnabled().then(() => {
                    setShowLoginLink(false)
                    handleOverlayClick()
                })
            }
        }).catch((error) => {
            if (error["code"] == -3) {
                // MAKE ERROR MESSAGE DIV FOR USER TO SEE
                console.log(error["info"])
            }
        })
    }

    function togglePopup() {
        setShowPopup(!showPopup);
    };

    function handleOverlayClick() {
        setShowPopup(false);
    };
    
    function handlePopupClick(e) {
        e.stopPropagation();
    };

    return (
        <>
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50" onClick={handleOverlayClick}>
                    <div className="border-2 bg-grey p-4 rounded shadow-lg" onClick={handlePopupClick}>
                        {Object.keys(installedWallets).map((wallet, index) => (
                            <button className='border-2 border-red-500 flex flex-row gap-2 items-center w-full' onClick={() => connectWallet(wallet)} key={index}>
                                <img className='basis-1/4 w-12 h-12 pl-2' src={installedWallets[wallet]["icon"]}></img>
                                <div className='basis-3/4 text-2xl flex justify-center items-center pr-2 border-2'>{wallet}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <nav className="bg-gray-800 border-b-4 border-gray-600 mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                    <img
                        src="favicon.ico" // Replace with your actual logo file path
                        alt="Logo"
                        className="h-8 w-8 mr-2"
                    />
                    <h1 className="text-2xl font-semibold text-white">cDapp</h1>
                    </div>
                    <div>
                    <ul>
                        <li></li>
                    </ul>
                    </div>
                    <div>
                    <ul className="flex space-x-4">
                        <li>
                        <a className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded" href="/new">Find or create new partition</a>
                        </li>

                        {showLoginLink ? (
                        <li>
                            <button className="text-white hover:text-gray-300" href="/login" onClick={togglePopup}>Connect Wallet</button>
                        </li>
                        ) : (
                        <li>
                            <a className="text-white hover:text-gray-300" href="/user-page">Connected</a>
                        </li>
                        )}
                        
                    </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}