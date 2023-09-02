'use client'

import React, { useState, useEffect } from 'react';
import Nav from "./components/nav"

export default function ClientSide({allowedWallets}) {
    const [connectedWallet, getConnectedWallet] = useState(null)
    const [inputValue, setInputValue] = useState('')

    const api = window.cardano
    
    // Function to handle URL submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // URL validation using regex
        const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?' + // port
            '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
            '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

        if (urlPattern.test(inputValue)) {
            if (inputValue.includes('jpg.store')) {
                const url = new URL(inputValue);
                const parts = url.pathname.split('/');
                const fullAssetID = parts[parts.length - 1];

                const policyID = fullAssetID.substring(0, 56);
                const assetID = fullAssetID.substring(56);
                
                const projectName = allowedWallets[policyID]

                fetchNFTData(projectName, assetID)
            }
            setInputValue('')
        } else {
            console.log("Submitted value is not a valid URL.");
        }
    };

    const fetchNFTData = async (project, asset) => {
        fetch(`/api/fetchNFTData?project=${project}&asset=${asset}`)
        .then((response) => response.json())
        .then((data) => {
            console.log('Data:', data);
        })
        .catch(error => {
            console.error('An error occurred:', error);
        });
    }

    return (
        <>
            <Nav api={api} getConnectedWallet={getConnectedWallet} />
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center justify-center h-48 bg-gray-600">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="text-black w-1/2 p-4 text-lg bg-gray-300 rounded-2xl border-2 transition duration-200 ease-in-out focus:border-blue-600 focus:ring focus:ring-blue-200 focus:outline-none"
                        placeholder="Enter something..."
                    />
                    <button 
                        onClick={handleSubmit}
                        className="mt-5 text-lg bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </>
    )
}