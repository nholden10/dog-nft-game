import React from "react";
import Image from "next/image";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../constants.js";
import ABI from "../utils/ABI.json";

export default function SelectCharacter({ setCharacterNFT }) {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);

  const mintCharacterNFT = async (characterId) => {
    try {
      console.log("Minting character in progress...");
      console.log("Character id:", characterId);
      const mintTxn = await gameContract.mintCharacterNFT(characterId);
      await mintTxn.wait();

      console.log("mintTxn:", mintTxn);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, signer);

      setGameContract(contract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  useEffect(() => {
    const getCharacterData = async () => {
      try {
        const characterData = await gameContract.getAllDefaultCharacters();

        const chars = characterData.map((c) => {
          return transformCharacterData(c);
        });
        setCharacters(chars);
        console.log(characters);
      } catch (error) {
        console.log("Something went wrong when fetching the characters", error);
      }
    };

    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );

      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log("Character NFT: ".characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
      }
    };

    if (gameContract) {
      getCharacterData();

      gameContract.on("CharacterNFTMinted", onCharacterMint);
    }
  }, [gameContract]);

  const characterBoxes = characters.map((character, index) => {
    return (
      <div key={character.name} className="selectCharacter-tile">
        <h1>{character.name}</h1>
        <Image src={character.imageURI} width={200} height={200} alt="Error" />
        <p>Max HP: {parseInt(character.hp)}</p>
        <p>Attack Damage: {parseInt(character.attackDamage)}</p>
        <button className="mint-button" onClick={() => mintCharacterNFT(index)}>
          Mint {character.name}
        </button>
      </div>
    );
  });

  return (
    <div className="selectCharacter-container">
      <h1 className="selectCharacter-title">
        No NFTs found. Mint your character!
      </h1>
      {characters.length > 0 && (
        <div className="selectCharacter-tile-container">{characterBoxes}</div>
      )}
    </div>
  );
}
