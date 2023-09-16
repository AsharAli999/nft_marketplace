import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Style from './NFTCard.module.css';

export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const [newPrice, setNewPrice] = useState('');
  const [relistItemId, setRelistItemId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadPurchasedItems = async () => {
    try {
      const filter = marketplace.filters.Bought(null, null, null, null, null, account);
      const results = await marketplace.queryFilter(filter);

      const purchases = await Promise.all(
        results.map(async (event) => {
          const eventData = event.args;
          const tokenId = eventData.tokenId.toNumber();
          const totalPrice = ethers.utils.formatEther(await marketplace.getTotalPrice(eventData.itemId));

          const uri = await nft.tokenURI(tokenId);
          const response = await fetch(uri);
          const metadata = await response.json();

          return {
            itemId: eventData.itemId.toNumber(),
            tokenId,
            totalPrice,
            price: ethers.utils.formatEther(eventData.price),
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
          };
        })
      );

      setLoading(false);
      setPurchases(purchases);
    } catch (error) {
      console.error('Error loading purchased items:', error);
    }
  };


  const handleRelistClick = (itemId) => {
    setRelistItemId(itemId);
    setIsModalOpen(true);
  };

  const handleRelist = async () => {
    try {
      if (!newPrice || isNaN(newPrice) || newPrice <= 0) {
        console.error('Invalid new price');
        return;
      }

      await marketplace.relistItem(relistItemId, ethers.utils.parseEther(newPrice));

      const updatedPurchases = purchases.filter((item) => item.itemId !== relistItemId);
      setPurchases(updatedPurchases);
      setRelistItemId(null);

      setNewPrice(''); // Clear the input field
      setIsModalOpen(false);
      // You may want to add the relisted item to another component, like "My Listed Items" or "Home," as needed.
    } catch (error) {
      console.error('Error relisting the NFT:', error);
    }
  };

  useEffect(() => {
    loadPurchasedItems();
  }, []);

  if (loading) {
    return (
      <main style={{ padding: '1rem 0' }}>
        <h2>Loading...</h2>
      </main>
    );
  }

  return (
    <>
      <div className="container mt-14 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {purchases.length > 0 ? (
            purchases.map((item, idx) => (
              <div className="bg-white p-4 rounded-lg shadow-md" key={idx + 1}>
                <div className="bg-gray-200 p-2 rounded-lg">
                  <img
                    src={item.image}
                    alt="NFT images"
                    className="object-cover rounded-lg w-full h-full"
                  />
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-semibold">{item.name}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <div className="border border-gray-400 p-2 rounded-md">
                      <small>{item.description}</small>
                      <p>{item.totalPrice} ETH</p>
                    </div>
                    <button
                      onClick={() => handleRelistClick(item.itemId)}
                      className="bg-blue-500 text-white rounded-md px-4 py-2 text-sm hover:bg-blue-700 transition duration-300"
                    >
                      Relist
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <main style={{ padding: '1rem 0' }}>
              <h2>No purchases</h2>
            </main>
          )}
        </div>
      </div>


      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* This is your modal */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Relist NFT</h3>
                    <div className="mt-2">
                      <label htmlFor="newPrice" className="block text-sm font-medium text-gray-700">
                        Enter New Price (ETH)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          id="newPrice"
                          placeholder="Enter new price"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleRelist}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Confirm Relist
                </button>
                <button
                  onClick={() => setIsModalOpen(false)} // Close the modal if Cancel is clicked
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

