import Image from "next/image";
import CharacterTile from "./CharacterTile.js";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../constants.js";
import ABI from "../utils/ABI.json";

export default function Arena({
  characterNFT,
  setCharacterNFT,
  currentAccount,
}) {
  const [gameContract, setGameContract] = useState(null);
  const [bossNFT, setBossNFT] = useState(null);

  const [attackState, setAttackState] = useState(null);

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

    const onAttackComplete = (sender, newBossHp, newPlayerHp) => {
      console.log(
        `sender ${sender}, newBossHp: ${newBossHp}, newPlayerHp: ${newPlayerHp}`
      );
      const bossHp = newBossHp.toNumber();
      const playerHp = newPlayerHp.toNumber();

      console.log(
        `Attack Complete: Boss Hp: ${bossHp}, Player Hp: ${playerHp}`
      );

      if (currentAccount === sender.toLowerCase()) {
        setBossNFT((prevState) => {
          return { ...prevState, hp: bossHp };
        });
        setCharacterNFT((prevState) => {
          return { ...prevState, hp: playerHp };
        });
      }
    };

    if (gameContract) {
      fetchBoss();
      gameContract.on("AttackCompleted", onAttackComplete);
    }

    return () => {
      if (gameContract) {
        gameContract.off("AttackCompleted", onAttackComplete);
      }
    };
  }, [gameContract]);

  const attack = async () => {
    try {
      if (gameContract) {
        setAttackState("attacking");
        console.log("Attacking boss...");
        const attackTxn = await gameContract.attackBoss();
        await attackTxn.wait();
        console.log("attackTxn:", attackTxn);
        setAttackState("hit");
      }
    } catch (error) {
      console.log("Error attacking boss: ", error);
      setAttackState("");
    }
  };

  return (
    <div className="arena-container">
      <div className="hero-container">
        {characterNFT ? (
          <CharacterTile character={characterNFT} />
        ) : (
          <p>Character not loaded</p>
        )}
        <button onClick={attack}>
          Attack {bossNFT ? bossNFT.name : "hello"}!
        </button>
      </div>
      {bossNFT ? <CharacterTile character={bossNFT} /> : "Boss not loaded"}
    </div>
  );
}
