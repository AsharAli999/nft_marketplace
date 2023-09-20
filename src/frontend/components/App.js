import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './Navbar';
import Home from './Home';
import Create from './Create';
import MyListedItems from './MyListedItems';
import MyPurchases from './MyPurchases';
import MarketplaceAbi from '../contractsData/Marketplace.json';
import MarketplaceAddress from '../contractsData/Marketplace-address.json';
import NFTAbi from '../contractsData/NFT.json';
import NFTAddress from '../contractsData/NFT-address.json';
import { Spinner } from 'react-bootstrap';
import './index.css';
import './App.css';
import ClaimNFT from './ClaimNFT';
import UpdateNFT from './UpdateNFT';

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});
  const [userNFTs, setUserNFTs] = useState([]);

  useEffect(() => {
    const checkMetaMask = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        window.ethereum.on('chainChanged', (chainId) => {
          window.location.reload();
        });

        window.ethereum.on('accountsChanged', async function (accounts) {
          setAccount(accounts[0]);
          await loadContracts(signer);
        });

        await loadContracts(signer);

        // Check local storage for previously created NFTs
        const storedNFTs = JSON.parse(localStorage.getItem('userNFTs')) || [];
        setUserNFTs(storedNFTs);
      } else {
        alert('MetaMask not found. Please install it to continue.');
      }
    };

    checkMetaMask();
  }, []);

  const loadContracts = async (signer) => {
    try {
      // Get deployed copies of contracts
      const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);
      setMarketplace(marketplace);
      const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
      setNFT(nft);
      setLoading(false);
    } catch (error) {
      console.error('Error loading contracts:', error);
    }
  };

  useEffect(() => {
    const saveNFTsToLocalStorage = () => {
      // Save the user's NFTs to local storage whenever the list changes
      localStorage.setItem('userNFTs', JSON.stringify(userNFTs));
    };

    saveNFTsToLocalStorage();
  }, [userNFTs]);

  const web3Handler = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      localStorage.setItem('metaMaskAccount', accounts[0]);
      // Load contracts or perform other actions as needed
      loadContracts();
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };



  return (
    <BrowserRouter>
      <div className="App">
        <Navigation web3Handler={web3Handler} account={account} />
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className="mx-3 my-0 text-white text-2xl">Awaiting MetaMask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home marketplace={marketplace} nft={nft} userNFTs={userNFTs} />} />
              <Route path="/create" element={<Create marketplace={marketplace} nft={nft} />} />
              <Route path="/my-listed-items" element={<MyListedItems marketplace={marketplace} nft={nft} account={account} />} />
              <Route path="/my-purchases" element={<MyPurchases marketplace={marketplace} nft={nft} account={account} />} />
              <Route path="/claim-nft" element={<ClaimNFT marketplace={marketplace} nft={nft} account={account} />} />
              <Route path="/update-nft" element={<UpdateNFT marketplace={marketplace} nft={nft} account={account} />} />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
