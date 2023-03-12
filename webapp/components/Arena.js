import Image from "next/image";
import CharacterTile from "./CharacterTile.js";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../constants.js";
import ABI from "../utils/ABI.json";

export default function Arena({ characterNFT, currentAccount }) {
  const [gameContract, setGameContract] = useState(null);
  const [bossNFT, setBossNFT] = useState(null);

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

  useEffect(() => {
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBoss();
      console.log("Boss: ", bossTxn);
      setBossNFT(transformCharacterData(bossTxn));
    };

    if (gameContract) {
      fetchBoss();
    }
  }, [gameContract]);

  const attack = async () => {
    const attackTxn = await gameContract.attackBoss();
    console.log("Boss was attacked!");
  };

  return (
    <div className="arena-container">
      <div className="hero-container">
        <CharacterTile character={characterNFT} />
        <button onClick={attack}>Attack {bossNFT.name}!</button>
      </div>

      <CharacterTile character={bossNFT} />
    </div>
  );
}
