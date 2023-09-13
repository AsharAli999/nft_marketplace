import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';

export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const [newPrice, setNewPrice] = useState('');
  const [relistItemId, setRelistItemId] = useState(null);

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
    <div className="flex justify-center">
      {purchases.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>
                    {item.totalPrice} ETH
                    <Button
                      variant="primary"
                      onClick={() => handleRelistClick(item.itemId)}
                    >
                      Relist
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: '1rem 0' }}>
          <h2>No purchases</h2>
        </main>
      )}
      {relistItemId !== null && (
        <div className="px-5 container">
          <Form>
            <Form.Group controlId="newPrice">
              <Form.Label>Enter New Price (ETH)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter new price"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleRelist}>
              Confirm Relist
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
}
