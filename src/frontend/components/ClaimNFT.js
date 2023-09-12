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
    <div>
      <h1>NFT Minting App</h1>
      {account ? (
        <div>
          <p>Connected Address: {account}</p>
          {tokenURI && <img src={tokenURI} alt="NFT" style={{ maxWidth: '300px' }} />}
          <button onClick={mintNFT}>Mint NFT</button>
        </div>
      ) : (
        <button onClick={connectToMetaMask}>Connect to MetaMask Account</button>
      )}
    </div>
  );
};

export default ClaimNFT;