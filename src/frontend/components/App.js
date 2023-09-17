import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from './Navbar';
import Home from './Home.js'
import Create from './Create.js'
import MyListedItems from './MyListedItems.js'
import MyPurchases from './MyPurchases.js'
import MarketplaceAbi from '../contractsData/Marketplace.json'
import MarketplaceAddress from '../contractsData/Marketplace-address.json'
import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Spinner } from 'react-bootstrap'
import './index.css'
import './App.css'
import ClaimNFT from "./ClaimNFT";

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});

  useEffect(() => {
    // Function to check for MetaMask and set up initial connection
    const checkMetaMask = async () => {
      if (window.ethereum) {
        try {
          // Request MetaMask accounts
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);
          // Get provider from Metamask
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          // Set signer
          const signer = provider.getSigner();
          loadContracts(signer);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        alert('MetaMask not found. Please install it to continue.');
      }
    };

    // Function to load contracts
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

    checkMetaMask();
  }, []);

  useEffect(() => {
    // Check if the MetaMask account is already connected
    const storedAccount = localStorage.getItem('metaMaskAccount');
    if (storedAccount && account !== storedAccount) {
      // Attempt to reconnect to the stored account
      window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
        if (accounts.length > 0 && accounts[0] === storedAccount) {
          setAccount(accounts[0]);
          // Refresh the contract data if needed
          loadContracts();
        }
      });
    }
  }, [account]);

  const loadContracts = async () => {
    // Load your contracts here as needed
    // This function can be called to refresh contract data when necessary
  };

  const handleMetaMaskConnect = async () => {
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
        <>
          <Navigation web3Handler={handleMetaMaskConnect} account={account} />
        </>
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0 text-white text-2xl'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home marketplace={marketplace} nft={nft} />} />
              <Route path="/create" element={<Create marketplace={marketplace} nft={nft} />} />
              <Route path="/my-listed-items" element={<MyListedItems marketplace={marketplace} nft={nft} account={account} />} />
              <Route path="/my-purchases" element={<MyPurchases marketplace={marketplace} nft={nft} account={account} />} />
              <Route path="/claim-nft" element={<ClaimNFT marketplace={marketplace} nft={nft} account={account} />} />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
