import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, MouseEvent } from "react";

import {
  useAddress,
  useContract,
  useDisconnect,
  useMetamask,
  useNetwork,
  useNetworkMismatch,
  ThirdwebNftMedia,
  ChainId,
  useNFTs,
  useMintNFT,
} from "@thirdweb-dev/react";
import { ImageService } from "~/services";

const Home: NextPage = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();

  const isWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const { contract } = useContract(
    "0x81aA157b256cCD8983E36E4d6940A18f5f220ba9"
  );

  const { data: nfts, refetch } = useNFTs(contract, { start: 0, count: 100 });
  const {
    mutate: mintNft,
  } = useMintNFT(contract);

  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    (async () => {
      console.log('Auth state changed.')
      if (!contract) return;
      await refetch()
      setLoading(false);
    })()
  }, [contract]);

  const mint = async () => {
    if (!address) {
      connectWithMetamask();
      return;
    }

    if (isWrongNetwork) {
      switchNetwork?.(ChainId.Mumbai);
      return;
    }

    mintNft({
      to: address,
      metadata: {
        name: "SleepingBeauty01",
        image: "https://gateway.ipfscdn.io/ipfs/QmQyMGkmVgTKyZK5dPUG7kw4gFVDCMjBNR2gkL49bwrhex/271653600_4915406805241049_8729256039293760664_n.jpg",
      },
    });

    alert(`🚀 Successfully Minted NFT!`);
  }

  const handleOnClickGenerateImage = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    try {
      const image = await ImageService.generate(prompt)
      const imageSrc = ` data:image/jpeg;charset=utf-8;base64,${image}`
      image && setImage(imageSrc)
    } catch (error) {
      console.log(error)  
    }
  }

  return (
    <>
      <Head>
        <title>BlockGen AI</title>
      </Head>
      <div className="bg-black">
      <nav className=" flex items-center px-8 py-8 h-20 bg-none">
          <img src="./pages/LOGO-pricpale.png" className="mr-6 " />
          <h3 className="font-['Inter'] font-bold text-xl leading-6 tracking-[.5em] mr-auto text-[#FFFFFF]" >
            BLOCKGEN
          </h3>
            
          {address ? (
            <>
              <p className="text-slate-400">Your address: {address}</p>

              <div className="mb-4" />

              <button onClick={disconnectWallet} className="inline-flex  rounded-md bg-[#4745D0] px-3 py-2 text-sm font-semibold text-[#FFFFFF] shadow-sm ring-1 ring-inset bg-[#4745D0] ">
                Disconnect Wallet
              </button>
            </>
          ) : (
            <button onClick={connectWithMetamask} className="inline-flex rounded-md bg-[#4745D0] px-3 py-2 text-sm font-semibold text-[#FFFFFF] shadow-sm ring-1 ring-inset bg-[#4745D0] ">
              Connect Wallet
            </button>
          )}
      </nav>
      <main className="flex flex-col items-center">
        

        {/* {!loading ? (
          <div className="flex gap-4">
            {nfts?.map((nft) => (
              <div className="my-6 flex flex-col items-center" key={nft.metadata.id.toString()}>
                <ThirdwebNftMedia
                  metadata={nft.metadata}
                  className="border-2 border-gray-400 rounded-lg"
                />
                <h3 className="mt-4">{nft.metadata.name}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p className="my-6">Loading NFTs...</p>
        )}

        <div className="mb-4" />

        <div className="flex flex-col items-center">
          <img
            className="border-2 border-gray-400 rounded-lg"
            src={image}
          />
          <h3 className="mt-4">Name</h3>
        </div>

        <div className="mb-4" /> */}
        <div className="items-center align-middle font-bold tracking-[.2px font-[sora] text-[64px] mt-[253px] text-[#FFFFFF]">
          <h3 >
            AI-powered platform
          </h3>
          <h3>
            for NFTs
          </h3>
        </div>
        <textarea
          className="w-1/2 p-3 rounded-lg border border-solid border-[#262840] outline-none focus-visible:border focus-visible:border-slate-400 bg-[#060714] opacity-70 text-[#FFFFFF]"
          placeholder="Start generating your AI NFT here..."
          autoFocus
          onChange={(event) => setPrompt(event.currentTarget.value)}
        />

        {/* <div className="mb-4" />

        <button
          className="inline-flex items-center rounded-md bg-blue-900 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300"
          onClick={handleOnClickGenerateImage}
        >
          Generate
        </button>

        <div className="mb-4" />

        <button
          className="inline-flex items-center rounded-md bg-blue-900 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300"
          onClick={mint}
        >
          Mint NFT
        </button> */}
        <p className='mt-[150px] font-[Inter] text-[#FFFFFF]'>
          BRINGING <span className="font-[Inter] text-[#6C4DD7]">AI TO WEB 3.0</span> THROUGH NFTS
          <p className= "px-[60px] font-[Inter] text-[#FFFFFF]">
            MVP BLOCKGEN ©2023
          </p>
        </p>
      </main>
      </div>
    </>
  )
};

export default Home;
