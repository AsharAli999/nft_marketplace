import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button, Container } from 'react-bootstrap'
import Style from './NFTCard.module.css';
import { BsImages } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import HeroSection from './HeroSection';

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  const [like, setLike] = useState(true);

  const likeNft = () => {
    if (!like) {
      setLike(true);
    } else {
      setLike(false);
    }
  };
  const loadMarketplaceItems = async () => {
    const itemCount = await marketplace.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i)
      if (!item.sold) {
        const uri = await nft.tokenURI(item.tokenId)
        const response = await fetch(uri)
        const metadata = await response.json()
        const totalPrice = await marketplace.getTotalPrice(item.itemId)
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })
      }
    }
    setLoading(false)
    setItems(items)
  }

  const buyMarketItem = async (item) => {
    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    loadMarketplaceItems()
  }

  useEffect(() => {
    loadMarketplaceItems()
  }, [])

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )

  return (
    <>
      <div>
        <HeroSection />
      </div>

      <div className={`container ${Style.NFTCard}`}>
        {items.map((item, idx) => (
          <div className={Style.NFTCard_box} key={idx + 1}>
            <div className={Style.NFTCard_box_img}>
              <img
                src={item.image}
                alt="NFT images"
                className="object-cover rounded-lg w-full h-full"
              />
            </div>


            <div className={Style.NFTCard_box_update}>
              <div className={Style.NFTCard_box_update_left}>
                <div
                  className={Style.NFTCard_box_update_left_like}
                  onClick={() => likeNft()}
                >
                  {like ? (
                    <AiOutlineHeart />
                  ) : (
                    <AiFillHeart
                      className={
                        Style.NFTCard_box_update_left_like_icon
                      }
                    />
                  )}
                  {''} 22
                </div>
              </div>


            </div>

            <div className={Style.NFTCard_box_update_details}>
              <div className={Style.NFTCard_box_update_details_price}>
                <div className={Style.NFTCard_box_update_details_price_box}>
                  <h4>{item.name}</h4>

                  <div
                    className={
                      Style.NFTCard_box_update_details_price_box_box
                    }
                  >
                    <div
                      className={
                        Style.NFTCard_box_update_details_price_box_bid
                      }
                    >
                      <small>{item.description}</small>
                      <p>{ethers.utils.formatEther(item.totalPrice)} ETH</p>
                    </div>
                    <div
                      className={
                        Style.NFTCard_box_update_details_price_box_stock
                      }
                    ></div>
                  </div>
                </div>
              </div>
              <div className={Style.NFTCard_box_update_details_category}>
                <BsImages />
              </div>
            </div>
            <button
              onClick={() => buyMarketItem(item)}
              className={Style.NFTCard_box_buy_button}
            >
              Buy
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
