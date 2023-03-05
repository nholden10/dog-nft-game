import Image from "next/image";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../constants.js";
import ABI from "../utils/ABI.json";

export default function Arena({ characterNFT }) {
  const [gameContract, setGameContract] = useState(null);
  const [bossNFT, getBossNFT] = useState(null);

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  return <div className="arena-container"></div>;
}
