import Head from 'next/head'
import Image from 'next/image'

import { useEffect, useState } from 'react'

export default function Home() {

  const [currentAccount, setCurrentAccount] = useState(null);



  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window
      if (!ethereum) {
        console.log('Go get Metamask!')
      } else {
        console.log('We have ethereum object', ethereum)

        const accounts = await ethereum.request({ method: 'eth_accounts' })
      
        if (accounts.length !== 0) {
          const account = accounts[0]
          console.log('Found an authorized account:', account)
          setCurrentAccount(account)
        } else {
          console.log('No authorized account found')
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Go get Metamask!')
        return
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      })

      console.log('Connected', accounts[0])
      setCurrentAccount(accounts[0])

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  return (
    <>
      <Head>
        <title>Dog NFT Game</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button
        className="connect-wallet-button"
        onClick={connectWallet}>
        Connect Wallet
      </button>
    </>
  )
}
