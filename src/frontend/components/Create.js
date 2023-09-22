import axios from 'axios';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { ethers } from "ethers"

const Create = ({ marketplace, nft }) => {
  const [fileImg, setFile] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const sendJSONtoIPFS = async (ImgHash) => {
    try {
      const resJSON = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
        data: {
          "name": name,
          "description": desc,
          "image": ImgHash
        },
        headers: {
          'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
          'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY,
        },
      });

      const tokenURI = `https://gateway.pinata.cloud/ipfs/${resJSON.data.IpfsHash}`;
      console.log("Token URI", tokenURI);
      mintThenList(tokenURI);
    } catch (error) {
      console.log("JSON to IPFS: ");
      console.log(error);
    }
  }

  const sendFileToIPFS = async (e) => {
    e.preventDefault();

    if (fileImg) {
      try {

        setIsCreating(true); // Set isCreating to true before starting the process

        const formData = new FormData();
        formData.append("file", fileImg);
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
            'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY,
            "Content-Type": "multipart/form-data"
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        console.log(ImgHash);
        sendJSONtoIPFS(ImgHash);
      } catch (error) {
        console.log("File to IPFS: ");
        console.log(error);
        setIsCreating(false); // Make sure to set isCreating to false on error as well
      }
    }
  }

  const mintThenList = async (uri) => {
    await (await nft.mint(uri)).wait()
    const id = await nft.tokenCount()
    await (await nft.setApprovalForAll(marketplace.address, true)).wait()
    const listingPrice = ethers.utils.parseEther(price.toString())
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait()
    setIsCreating(false); // Set isCreating to false after the process is complete
    // Clear the form input data
    setFile(null);
    setName("");
    setDescription("");
    setPrice("");
  }

  return (
    <div className="container mx-auto mt-20 p-8 bg-[#2c2a2cfd] shadow-md rounded-lg max-w-3xl">
      <h1 className="text-2xl font-semibold mb-8 text-white">Create NFT</h1>
      <form className="space-y-4">
        <div className="mb-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="cursor-pointer bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
            style={{ background: 'linear-gradient(90deg, rgba(50,168,56,1) 0%, rgba(50,168,56,1) 50%, rgba(87,194,33,1) 50%, rgba(87,194,33,1) 100%)' }}
          >
            Choose File
          </label>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border py-2 px-3 rounded-lg focus:outline-none focus:ring focus:border-blue-300 w-full"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDescription(e.target.value)}
            className="border py-2 px-3 rounded-lg focus:outline-none focus:ring focus:border-blue-300 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Price in ETH"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border py-2 px-3 rounded-lg focus:outline-none focus:ring focus:border-blue-300 w-full"
          />
        </div>
        <div className="text-center">
          <Button
            onClick={sendFileToIPFS}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full ${isCreating ? "cursor-not-allowed opacity-70" : ""
              }`}
            size="lg"
            disabled={isCreating}
            style={{
              background: 'linear-gradient(90deg, rgba(50,168,56,1) 0%, rgba(50,168,56,1) 50%, rgba(87,194,33,1) 50%, rgba(87,194,33,1) 100%)',
            }}
          >
            {isCreating ? "Creating..." : "Create & List NFT"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Create;
