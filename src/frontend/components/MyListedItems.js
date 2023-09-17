import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import Style from './NFTCard.module.css'; // Import the existing CSS
import { BsImages } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

function renderSoldItems(items) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 text-white">Sold NFTs</h2>

      <div className={`container ${Style.NFTCard}`}> {/* Use the existing CSS class */}
        {items.map((item, idx) => (
          <div className={Style.NFTCard_box} key={idx + 1}>
            <div className={Style.NFTCard_box_img}>
              <img
                src={item.image}
                alt="NFT images"
                width={360}
                height={400}
                className={Style.NFTCard_box_img_img}
              />
            </div>
            <div className={Style.NFTCard_box_update}>
              <div className={Style.NFTCard_box_update_left}>

              </div>
            </div>
            <div className={Style.NFTCard_box_update_details}>
              <div className={Style.NFTCard_box_update_details_price}>
                <div className={Style.NFTCard_box_update_details_price_box}>
                  <h4>{item.name}</h4>
                  <div className={Style.NFTCard_box_update_details_price_box_box}>
                    <div className={Style.NFTCard_box_update_details_price_box_bid}>
                      <small>{item.description}</small>
                      <p>{ethers.utils.formatEther(item.totalPrice)} ETH</p>
                    </div>
                    <div className={Style.NFTCard_box_update_details_price_box_stock}></div>
                  </div>
                </div>
              </div>
              <div className={Style.NFTCard_box_update_details_category}>
                <BsImages />
              </div>
            </div>

          </div>
        ))}
      </div>
    </>
  )
}

export default function MyListedItems({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  const [soldItems, setSoldItems] = useState([])

  const loadListedItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await marketplace.itemCount()
    let listedItems = []
    let soldItems = []

    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await marketplace.items(indx)

      if (i.seller.toLowerCase() === account) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(i.itemId)
        // define listed item object
        let item = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        }
        listedItems.push(item)
        // Add listed item to sold items array if sold
        if (i.sold) soldItems.push(item)
      }
    }
    setLoading(false)
    setListedItems(listedItems)
    setSoldItems(soldItems)
  }

  useEffect(() => {
    loadListedItems()
  }, [])

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2 className='text-white'>Loading...</h2>
    </main>
  )

  return (
    <div className="flex justify-center">
      {listedItems.length > 0 ? (
        <div className="px-5 py-3 container">
          <h2 className="text-2xl font-semibold mb-4 text-white">Listed NFTs</h2>

          <div className={`container ${Style.NFTCard}`}> {/* Use the existing CSS class */}
            {listedItems.map((item, idx) => (
              <div className={Style.NFTCard_box} key={idx + 1}>
                <div className={Style.NFTCard_box_img}>
                  <img
                    src={item.image}
                    alt="NFT images"
                    width={360}
                    height={400}
                    className={Style.NFTCard_box_img_img}
                  />
                </div>
                <div className={Style.NFTCard_box_update}>
                  <div className={Style.NFTCard_box_update_left}>

                  </div>
                </div>
                <div className={Style.NFTCard_box_update_details}>
                  <div className={Style.NFTCard_box_update_details_price}>
                    <div className={Style.NFTCard_box_update_details_price_box}>
                      <h4>{item.name}</h4>
                      <div className={Style.NFTCard_box_update_details_price_box_box}>
                        <div className={Style.NFTCard_box_update_details_price_box_bid}>
                          <small>{item.description}</small>
                          <p>{ethers.utils.formatEther(item.totalPrice)} ETH</p>
                        </div>
                        <div className={Style.NFTCard_box_update_details_price_box_stock}></div>
                      </div>
                    </div>
                  </div>
                  <div className={Style.NFTCard_box_update_details_category}>
                    <BsImages />
                  </div>
                </div>

              </div>
            ))}
          </div>
          {soldItems.length > 0 && renderSoldItems(soldItems)}
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No listed assets</h2>
        </main>
      )}
    </div>
  );
}
