import React from "react";
import { Link } from "react-router-dom";
import market from './market.png';

const Navigation = ({ web3Handler, account }) => {
    return (
        <div className="bg-green-600 py-2 px-4 flex items-center justify-between">
            {/* Navbar Brand */}
            <Link to="/" className="text-white flex items-center space-x-2">
                <img src={market} alt="" className="w-8 h-8" />
                <span className="text-xl font-bold">Inceptia NFT Marketplace</span>
            </Link>

            {/* Navbar Links */}
            <div className="space-x-4">
                <Link to="/" className="text-white hover:underline">Home</Link>
                <Link to="/create" className="text-white hover:underline">Create</Link>
                <Link to="/my-listed-items" className="text-white hover:underline">My Listed Items</Link>
                <Link to="/my-purchases" className="text-white hover:underline">My Purchases</Link>
                <Link to="/claim-nft" className="text-white hover:underline">Claim NFT</Link>
            </div>

            {/* Wallet Button */}
            {account ? (
                <a
                    href={`https://etherscan.io/address/${account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-light mx-4 text-white"
                >
                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                </a>
            ) : (
                <button
                    onClick={web3Handler}
                    className="bg-white text-green-600 hover:bg-gray-100 py-2 px-4 rounded border border-green-600 hover:border-transparent"
                >
                    Connect Wallet
                </button>
            )}
        </div>
    );
};

export default Navigation;