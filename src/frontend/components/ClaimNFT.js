import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTAbi from '../contractsData/NFT.json';
import NFTAddress from '../contractsData/NFT-address.json';

const ClaimNFT = () => {
  const [nftContract, setNftContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [selectedTokenURI, setSelectedTokenURI] = useState(null);
  const [account, setAccount] = useState(null);
  const [isMinting, setIsMinting] = useState(false);

  // State to store the minted URI
  const [mintedTokenURI, setMintedTokenURI] = useState(null);

  useEffect(() => {
    async function setup() {
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = web3Provider.getSigner();
        const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);

        setNftContract(nft);
        setProvider(web3Provider);

        const accounts = await web3Provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } else {
        alert('MetaMask not found. Please install it to continue.');
      }
    }

    setup();
  }, []);

  useEffect(() => {
    // Retrieve the minted NFT URI from localStorage when the component mounts
    const storedMintedTokenURI = localStorage.getItem('mintedTokenURI');
    if (storedMintedTokenURI) {
      setMintedTokenURI(storedMintedTokenURI);
    }
  }, []);

  const connectToMetaMask = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  const handleTokenURIClick = (uri) => {
    setSelectedTokenURI(uri);
  };

  const mintNFT = async () => {
    try {
      if (!account) {
        alert('Please connect your MetaMask account first.');
        return;
      }

      if (!selectedTokenURI) {
        alert('Please select a token URI to mint.');
        return;
      }

      const signer = provider.getSigner();
      setIsMinting(true);

      const tx = await nftContract.mint(selectedTokenURI);
      await tx.wait();

      // Update the mintedTokenURI state after minting
      setMintedTokenURI(selectedTokenURI);

      // Store the minted NFT URI in localStorage
      localStorage.setItem('mintedTokenURI', selectedTokenURI);

      setIsMinting(false);

      alert('NFT minted successfully!');
    } catch (error) {
      setIsMinting(false);
      console.error('Error minting NFT:', error);
    }
  };

  // Define your three token URIs here
  const tokenURIs = [
    'https://ipfs.io/ipfs/QmWDu8Fz8fV7ndedD2n9us8r5h84dqmUo8uxYmq74CtUcY',
    'https://ipfs.io/ipfs/QmXYgSXTB799PcBfhFCNcJob9MfD62zyQC6mPM9FLtF6cM',
    'https://ipfs.io/ipfs/QmfDfHPFtbUQSxZtnLtitomXYUBJJkz2JBkGkC83FfQuXR',
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#161616fd] py-6 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#1a1c1f' }}>
      <div className="max-w-7xl mx-auto w-full space-y-4">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">NFT Minting App</h2>
        </div>
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-4">
            {tokenURIs.map((uri, index) => (
              <div key={index} className="bg-[#161616fd] p-4 rounded-lg shadow-lg cursor-pointer">
                <img
                  src={uri}
                  alt={`NFT ${index + 1}`}
                  className="mx-auto mt-4 rounded-lg"
                  style={{ maxWidth: '100%', width: '100%' }}
                  onClick={() => handleTokenURIClick(uri)}
                />
                {selectedTokenURI === uri && <span className="text-green-500">Selected</span>}
              </div>
            ))}
          </div>
          <button
            onClick={mintNFT}
            className="mt-4 w-3/2 inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            style={{ background: 'linear-gradient(90deg, rgba(50,168,56,1) 0%, rgba(50,168,56,1) 50%, rgba(87,194,33,1) 50%, rgba(87,194,33,1) 100%)' }}
            disabled={isMinting || !selectedTokenURI}
          >
            {isMinting ? 'Minting...' : 'Mint NFT'}
          </button>
          {account ? (
            <p className="text-center text-white mt-4">Connected Address: {account}</p>
          ) : (
            <button
              onClick={connectToMetaMask}
              className="w-full inline-flex text-white items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
              style={{ background: 'linear-gradient(90deg, rgba(50,168,56,1) 0%, rgba(50,168,56,1) 50%, rgba(87,194,33,1) 50%, rgba(87,194,33,1) 100%)' }}
            >
              Connect to MetaMask Account
            </button>
          )}

          {/* Display the minted URI if available */}
          {mintedTokenURI && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white">Minted and Claimed NFT:</h3>
              <div className="p-4 rounded-lg shadow-lg">
                <img src={mintedTokenURI} alt="Minted NFT" className="mx-auto mt-4 rounded-lg" style={{ maxWidth: '50%', width: '50%' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default ClaimNFT;
