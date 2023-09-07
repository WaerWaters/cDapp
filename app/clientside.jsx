'use client'

import React, { useState, useEffect } from 'react';
import Nav from "./components/nav"

export default function ClientSide({allowedWallets, stores}) {
    const [connectedWallet, getConnectedWallet] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [nftData, setNftData] = useState(null);
    const [nftPrice, setNftPrice] = useState(null);
    const [maxPercentageInput, setMaxPercentageInput] = useState('');
    const [yourPayingInput, setYourPayingInput] = useState('');
    const [maxBuy, setMaxBuy] = useState(0);
    const [column1Traits, setColumn1Traits] = useState([])
    const [column2Traits, setColumn2Traits] = useState([])

    const handleOverlayClick = () => setShowPopup(false);

    const handlePopupClick = (e) => e.stopPropagation();

    const api = window.cardano
    
    // fetch api to fetch nft data
    const fetchNFTData = async (project, asset) => {
        fetch(`/api/fetchNFTData?project=${project}&asset=${asset}`)
        .then((response) => response.json())
        .then((data) => {
            console.log('Data:', data);
            setNftData(data);
            setShowPopup(true);
            const usedStore = Object.keys(data["prices"])
            if (stores.includes(usedStore[0])) {
                setNftPrice(data["prices"][usedStore]["price"]/1000000)
            }
            const allTraitKeys = Object.keys(data["traits"]);
            const half = Math.ceil(allTraitKeys.length / 2);

            setColumn1Traits(allTraitKeys.slice(0, half))
            setColumn2Traits(allTraitKeys.slice(half))
        })
        .catch(error => {
            console.error('An error occurred:', error);
        });
    }

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

    const isValidPercentage = () => {
        const num = parseFloat(maxPercentageInput);
        return !isNaN(num) && num >= 0 && num <= 49;
    };

    const getMaxAllowedPaying = () => {
        const value = (nftPrice / 100) * parseFloat(maxPercentageInput);
        return parseFloat(value.toFixed(2));
    };

    const handleMaxPercentageChange = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
          setMaxPercentageInput(e.target.value);
          setYourPayingInput('');
        }
    };

    const getOwnershipPercentage = () => {
        if (yourPayingInput === '' || isNaN(yourPayingInput) || isNaN(nftPrice) || nftPrice === 0) {
            return 0;
        }
        return ((parseFloat(yourPayingInput) / parseFloat(nftPrice)) * 100).toFixed(2);
    };
    
    const traitRarity = (type, ownedTrait) => {
        let max = 0
        let ownedQuantity = 0
        Object.keys(nftData["attributes"][type]).forEach((trait) => {
            if (trait == ownedTrait) {
                ownedQuantity = nftData["attributes"][type][trait]
            }
            max += nftData["attributes"][type][trait]
        })
        return (ownedQuantity/max * 100).toFixed(2)
    }


    const renderTrait = (traitKey) => {
    return (
        <div key={traitKey} className="min-h-[100px]">
            <span className="text-medium text-xl">{traitKey}</span>
            {Array.isArray(nftData["traits"][traitKey]) ? 
                nftData["traits"][traitKey].map((item, index) => (
                <div key={index}>
                    {item} <span className="text-cyan-500 font-bold">{traitRarity(traitKey, item)}%</span>
                </div>
                )) : 
                <div>
                    {nftData["traits"][traitKey]} <span className="text-cyan-500 font-bold">{traitRarity(traitKey, nftData["traits"][traitKey])}%</span>
                </div>
            }
        </div>
    )}

    useEffect(() => {
        if (!isValidPercentage() && yourPayingInput !== '') {
            setYourPayingInput('');
        }
    }, [maxPercentageInput, yourPayingInput]);

    useEffect(() => {
        if (isValidPercentage()) {
            setMaxBuy(getMaxAllowedPaying());
        }
    }, [maxPercentageInput, nftPrice]);

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
                        placeholder="Paste NFT Market URL. (ex https://www.jpg.store/asset/...)"
                    />
                    <button 
                        onClick={handleSubmit}
                        className="mt-5 text-lg bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                </div>
            </form>
            {showPopup && (
                <div id="overlay" className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" onClick={handleOverlayClick}>
                    <div className="border-2 bg-gray-800 p-4 rounded shadow-lg w-4/5" onClick={handlePopupClick}>  {/* Width adjusted to w-4/5 */}
                        <div className='border-2 w-auto text-center text-4xl font-medium'>
                            Create Proposal
                        </div>
                        <div className="flex border-2 border-blue-300">
                            <div className="border-2 border-yellow-300 text-center w-2/5 text-2xl"> {/* Width adjusted to w-2/5 */}
                                {nftData["name"]}
                                <div className="relative">
                                    <img src={`https://ipfs.io/ipfs/${nftData["url"]}`} alt="IPFS Image" className="w-auto h-auto object-cover rounded-t-lg" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50">
                                        <div className='flex gap-20 text-lg'>
                                            <div className='flex flex-col gap-6'>
                                                {column1Traits.map(traitKey => renderTrait(traitKey))}
                                            </div>
                                            <div className='flex flex-col gap-6'>
                                                {column2Traits.map(traitKey => renderTrait(traitKey))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-2 border-red-300 w-3/5 flex flex-col">  {/* Width adjusted to w-3/5 */}
                                <div className='text-center text-2xl'>
                                    Set Rules and Conditions
                                </div>
                                <div className='flex-grow flex flex-col'>
                                    <div className='h-5/6 border-2 flex justify-center'>
                                        <div className='flex flex-col' >
                                            Max percantage a wallet can own
                                            <div className='flex justify-center text-4xl'>
                                                <input 
                                                    type="text" 
                                                    placeholder='49' 
                                                    value={maxPercentageInput}
                                                    onChange={handleMaxPercentageChange}
                                                    className={`border-2 w-20 h-10 text-center text-black ${isValidPercentage() ? 'border-green-500' : 'border-red-500'}`}
                                                />
                                                %
                                            </div>
                                        </div>
                                    </div>
                                    <div className='h-1/6 border-2 flex'>
                                        <div className='w-4/6 border-2 flex'>
                                            <div className='w-2/6 flex items-center justify-center text-3xl font-medium'>
                                                ₳ {nftPrice}
                                            </div>
                                            <div className='border-2 w-3/6'>
                                                <div className='mx-10 my-4'>
                                                    <div className='flex'>
                                                        Your paying
                                                        <div className="ml-auto text-gray-300">
                                                            max ₳{maxBuy}
                                                        </div>
                                                    </div>
                                                    <input 
                                                        type="text" 
                                                        value={yourPayingInput}
                                                        disabled={!isValidPercentage()}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value);

                                                            if (value <= maxBuy) {
                                                                setYourPayingInput(e.target.value);
                                                            } else {
                                                                setYourPayingInput(maxBuy.toString());
                                                            }
                                                        }}
                                                        className={`text-black w-full ${yourPayingInput <= getMaxAllowedPaying() ? 'border-green-500' : 'border-red-500'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div className='border-2 w-1/6'>
                                                <div className='flex flex-col justify-center items-center pt-4'>
                                                    <div className='text-sm'>
                                                        Ownsership
                                                    </div>
                                                    <div>
                                                        {getOwnershipPercentage()}%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='w-2/6 border-2 flex items-center justify-center relative'>
                                            <button className="text-lg bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-14 rounded absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div>
                <div>
                    Filter
                </div>
                <div>
                    Proposals
                </div>
            </div>
        </>
    )
}