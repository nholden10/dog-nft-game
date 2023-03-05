import Head from "next/head";
import Image from "next/image";
import SelectCharacter from "../components/SelectCharacter";
import ABI from "../utils/ABI.json";

import { useEffect, useState } from "react";
import ethers from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

import { CONTRACT_ADDRESS, transformCharacterData } from "../constants.js";

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Go get Metamask!");
      } else {
        console.log("We have ethereum object", ethereum);

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Go get Metamask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    const { ethereum } = window;
    const checkNetwork = async () => {
      const currentChainId = await ethereum.request({
        method: "eth_chainId",
      });
      try {
        if (currentChainId !== 11155111) {
          alert("Connect to Sepolia!");
        }
      } catch (err) {
        console.log(err);
      }
    };
  }, []);

  useEffect(() => {
    const getNFTData = async () => {
      console.log("Chacking for characters NFT on address:", currentAccount);

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI.abi,
        signer
      );

      const txn = await gameContract.checkIfUserHasNFT();
      console.log("txn:", txn);
      if (txn.name) {
        console.log("User has character NFT");
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log("No character NFT found");
      }
    };

    if (currentAccount) {
      console.log("Current Account:", currentAccount);
      getNFTData();
    }
  }, [currentAccount]);
  return (
    <>
      <Head>
        <title>Dog NFT Game</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button className="connect-wallet-button" onClick={connectWallet}>
        Connect Wallet
      </button>
      {currentAccount && !characterNFT && (
        <SelectCharacter setCharacterNFT={setCharacterNFT} />
      )}
    </>
  );
}
