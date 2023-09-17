import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTAbi from '../contractsData/NFT.json';
import NFTAddress from '../contractsData/NFT-address.json';

const ClaimNFT = () => {
  const [nftContract, setNftContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [tokenURI, setTokenURI] = useState(null);
  const [account, setAccount] = useState(null);

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

  const mintNFT = async () => {
    try {
      if (!account) {
        alert('Please connect your MetaMask account first.');
        return;
      }

      const signer = provider.getSigner();
      const uri = "https://ipfs.io/ipfs/QmRNwcmSPxpBV7Dyfy49ZbWWboTJkkMZ1awciHYj6skPTj?filename=";
      setTokenURI(uri);

      const tx = await nftContract.mint(uri);
      await tx.wait();

      alert('NFT minted successfully!');
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#1a1c1f' }}>
      <div className="max-w-md w-full space-y-4">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">NFT Minting App</h2>
        </div>
        <div className="mb-4">
          {account ? (
            <div>
              <p className="text-center text-white">Connected Address: {account}</p>
              {tokenURI && <img src={tokenURI} alt="NFT" className="mx-auto mt-4" style={{ maxWidth: '300px' }} />}
              <button
                onClick={mintNFT}
                className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                style={{ background: 'linear-gradient(90deg, rgba(50,168,56,1) 0%, rgba(50,168,56,1) 50%, rgba(87,194,33,1) 50%, rgba(87,194,33,1) 100%)' }}
              >
                Mint NFT
              </button>
            </div>
          ) : (
            <button
              onClick={connectToMetaMask}
              className="w-full inline-flex text-white items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Connect to MetaMask Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimNFT;
