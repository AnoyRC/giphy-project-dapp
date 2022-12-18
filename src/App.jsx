import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = ['https://media.giphy.com/media/p092OM3vVCXII/giphy.gif',
  'https://c.tenor.com/_9NCbkYa5C4AAAAd/gorlami-inglorious-basterds.gif',
  'https://i.gifer.com/NtJd.gif']

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null)
  const [inputValue, setInputValue] = useState("")
  const [gifList, setGifList] = useState([])
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom Wallet Found!')

          const response = await solana.connect({
            onlyIfTrusted: true
          })
          console.log('Connected with public key :', response.publicKey.toString())
          setWalletAddress(response.publicKey.toString())
        }
      } else {
        alert('Solana Object not found! Get a Phantom wallet')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      console.log('Connected with public key :', response.publicKey.toString())
      setWalletAddress(response.publicKey.toString())
    }
  };

  const onInputChange = event => {
    const { value } = event.target;
    setInputValue(value)
  }

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif Link : ', inputValue)
      setGifList([...gifList, inputValue])
      setInputValue('')
    } else {
      console.log('Empty Input! Try Again!')
    }
  }

  const renderNotConnectedContainer = () => {
    return <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet!
    </button>
  }

  const renderConnectedContainer = () => {
    return <div className="connected-container">
      <form onSubmit={event => {
        event.preventDefault()
        sendGif()
      }}>
        <input type="text" placeholder="Enter gif link!" value={inputValue} onChange={onInputChange} />
        <button type="submit" className="cta-button submit-gif-button">Submit</button>
      </form>
      <div className='gif-grid'>
        {gifList.map((gif) => (
          <div className='gif-item' key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  }

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected()
    }
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching Gif List')


      setGifList(TEST_GIFS)
    }
  }, [walletAddress])

  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`Adapted from @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
