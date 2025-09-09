import React, {ReactElement, CSSProperties, MouseEvent} from "react";
import {NavLink, useHistory} from "react-router-dom";
import { useWalletModalToggle } from '../../state/application/hooks'


import {Button, Logo, ICard, Card, IFooterLink, Footer, IFooterSocialLink} from "./components";
import clsx from "./styles.module.css";
import aave from "./assets/swaps/aave.png";
import anyswap from "./assets/swaps/anyswap.png";
import avalanche from "./assets/swaps/avalanche.png";
import matic from "./assets/swaps/matic.png";
import wrappedBTC from "./assets/swaps/wrappedBTC.png";
import sentinel from "./assets/swaps/sentinel.png";
import surffinance from "./assets/swaps/surffinance.png";
import uniswap from "./assets/swaps/uniswap.png";
import usdt from "./assets/swaps/usdt.png";
import wave from "./assets/swaps/wave.png";

import eth from "./assets/cards/eth.png";
import locker from "./assets/cards/locker.png";
import newFolder from "./assets/cards/new-folder.png";
import sheild from "./assets/cards/sheild.png";
import wallets from "./assets/wallets.png";


const images: Array<string> = [
    aave,
    sentinel,
    surffinance,
    uniswap,
    usdt,
    wave,
    wrappedBTC,
    avalanche,
    matic,
    anyswap
];



const footerLinks: Array<IFooterLink> = [
    {
        path: "#",
        title: "Ecosystem"
    },
    {
        path: "#",
        title: "Community"
    },
    {
        path: "#",
        title: "Developers"
    },
    {
        path: "#",
        title: "FAQ"
    },
    {
        path: "/swap",
        title: "Swap"
    },
]


const socialLinks: Array<IFooterSocialLink> = [
    {
        path: "#",
        component: <svg width="28" height="26" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M14 0C6.265 0 0 5.8175 0 13C0 18.7525 4.0075 23.6113 9.5725 25.3338C10.2725 25.4475 10.535 25.0575 10.535 24.7163C10.535 24.4075 10.5175 23.3838 10.5175 22.295C7 22.8963 6.09 21.4988 5.81 20.7675C5.6525 20.3938 4.97 19.24 4.375 18.9313C3.885 18.6875 3.185 18.0863 4.3575 18.07C5.46 18.0538 6.2475 19.0125 6.51 19.4025C7.77 21.3688 9.7825 20.8163 10.5875 20.475C10.71 19.63 11.0775 19.0613 11.48 18.7363C8.365 18.4113 5.11 17.29 5.11 12.3175C5.11 10.9038 5.6525 9.73375 6.545 8.82375C6.405 8.49875 5.915 7.16625 6.685 5.37875C6.685 5.37875 7.8575 5.0375 10.535 6.71125C11.655 6.41875 12.845 6.2725 14.035 6.2725C15.225 6.2725 16.415 6.41875 17.535 6.71125C20.2125 5.02125 21.385 5.37875 21.385 5.37875C22.155 7.16625 21.665 8.49875 21.525 8.82375C22.4175 9.73375 22.96 10.8875 22.96 12.3175C22.96 17.3063 19.6875 18.4113 16.5725 18.7363C17.08 19.1425 17.5175 19.9225 17.5175 21.1413C17.5175 22.88 17.5 24.2775 17.5 24.7163C17.5 25.0575 17.7625 25.4638 18.4625 25.3338C21.2417 24.4624 23.6567 22.8038 25.3676 20.5913C27.0785 18.3788 27.9992 15.7238 28 13C28 5.8175 21.735 0 14 0Z" fill="#1B225A"/>
        </svg>
    },
    {
        path: "#",
        component: <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_74_326)">
        <path d="M22.0101 4.86639C20.3526 4.11889 18.5759 3.56639 16.718 3.25222C16.7015 3.24904 16.6844 3.25109 16.669 3.25808C16.6537 3.26506 16.6409 3.27665 16.6324 3.29122C16.4049 3.69097 16.1514 4.21205 15.9738 4.62372C14.0033 4.32931 12 4.32931 10.0295 4.62372C9.83164 4.16749 9.60849 3.72263 9.36112 3.29122C9.35273 3.27647 9.34005 3.26462 9.32475 3.25727C9.30946 3.24991 9.29229 3.2474 9.27553 3.25005C7.4187 3.56422 5.64203 4.11672 3.98345 4.8653C3.96918 4.87129 3.95708 4.88149 3.94878 4.89455C0.577449 9.8508 -0.346634 14.6846 0.107282 19.4578C0.108545 19.4695 0.112174 19.4808 0.117948 19.491C0.123721 19.5013 0.131519 19.5103 0.140866 19.5174C2.10862 20.95 4.3034 22.0414 6.63328 22.7457C6.64952 22.7507 6.6669 22.7507 6.68313 22.7457C6.69936 22.7407 6.71371 22.7309 6.72428 22.7176C7.22564 22.047 7.66992 21.3357 8.05245 20.591C8.05776 20.5808 8.06082 20.5696 8.06142 20.5581C8.06203 20.5466 8.06016 20.5352 8.05595 20.5245C8.05173 20.5138 8.04528 20.5042 8.03701 20.4962C8.02874 20.4882 8.01886 20.4821 8.00803 20.4783C7.3082 20.2148 6.63012 19.8967 5.98003 19.5271C5.96835 19.5205 5.95851 19.511 5.95139 19.4996C5.94426 19.4882 5.94009 19.4752 5.93923 19.4618C5.93837 19.4483 5.94085 19.4349 5.94646 19.4227C5.95207 19.4105 5.96063 19.3998 5.97137 19.3917C6.10787 19.291 6.24437 19.1859 6.37437 19.0808C6.38607 19.0714 6.40016 19.0653 6.41508 19.0634C6.43 19.0615 6.44516 19.0638 6.45887 19.07C10.7131 20.981 15.3205 20.981 19.525 19.07C19.5387 19.0634 19.554 19.0608 19.5691 19.0626C19.5843 19.0643 19.5986 19.0702 19.6105 19.0797C19.7405 19.1859 19.876 19.291 20.0135 19.3917C20.0244 19.3997 20.0331 19.4102 20.0389 19.4223C20.0446 19.4344 20.0473 19.4478 20.0467 19.4612C20.0461 19.4746 20.0421 19.4876 20.0352 19.4992C20.0282 19.5107 20.0186 19.5203 20.007 19.5271C19.3592 19.8998 18.6854 20.2151 17.9779 20.4772C17.9671 20.4812 17.9572 20.4874 17.9489 20.4955C17.9406 20.5035 17.9342 20.5133 17.93 20.524C17.9258 20.5348 17.9239 20.5463 17.9245 20.5579C17.9252 20.5694 17.9282 20.5807 17.9335 20.591C18.3235 21.3352 18.7699 22.0437 19.2606 22.7165C19.2708 22.7303 19.285 22.7406 19.3013 22.746C19.3176 22.7515 19.3352 22.7517 19.3516 22.7468C21.6855 22.0444 23.8839 20.9526 25.8538 19.5174C25.8634 19.5107 25.8715 19.502 25.8774 19.4919C25.8834 19.4818 25.8872 19.4705 25.8884 19.4589C26.4301 13.9404 24.9806 9.14555 22.0437 4.89672C22.0365 4.88291 22.0246 4.87215 22.0101 4.86639ZM8.68837 16.5512C7.40787 16.5512 6.35162 15.3931 6.35162 13.9729C6.35162 12.5516 7.38728 11.3946 8.68837 11.3946C9.9992 11.3946 11.0457 12.5613 11.0251 13.9729C11.0251 15.3942 9.98945 16.5512 8.68837 16.5512V16.5512ZM17.3279 16.5512C16.0464 16.5512 14.9912 15.3931 14.9912 13.9729C14.9912 12.5516 16.0258 11.3946 17.3279 11.3946C18.6388 11.3946 19.6853 12.5613 19.6647 13.9729C19.6647 15.3942 18.6399 16.5512 17.3279 16.5512V16.5512Z" fill="#1B225A"/>
        </g>
        <defs>
        <clipPath id="clip0_74_326">
        <rect width="26" height="26" fill="white"/>
        </clipPath>
        </defs>
        </svg>
    },
    {
        path: "#",
        component: <svg width="30" height="27" viewBox="0 0 30 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M29.5539 5.55403C28.5101 5.97028 27.3889 6.25153 26.2101 6.37865C27.4264 5.72367 28.3363 4.6928 28.7701 3.4784C27.6274 4.08927 26.3768 4.51925 25.0726 4.74965C24.1956 3.90688 23.034 3.34827 21.768 3.16056C20.5021 2.97285 19.2028 3.16654 18.0717 3.71156C16.9406 4.25658 16.0411 5.12244 15.5128 6.1747C14.9846 7.22696 14.8571 8.40675 15.1501 9.5309C12.8347 9.42627 10.5697 8.88465 8.50192 7.94117C6.43416 6.9977 4.60994 5.67346 3.14764 4.0544C2.64764 4.83065 2.36014 5.73065 2.36014 6.68915C2.35958 7.55202 2.59568 8.40168 3.04748 9.16273C3.49929 9.92378 4.15284 10.5727 4.95014 11.0519C4.02548 11.0254 3.12123 10.8006 2.31264 10.396V10.4635C2.31254 11.6737 2.77768 12.8467 3.62912 13.7834C4.48055 14.7201 5.66585 15.3628 6.98389 15.6025C6.12612 15.8115 5.22681 15.8422 4.35389 15.6925C4.72576 16.7338 5.45013 17.6444 6.4256 18.2968C7.40106 18.9492 8.57878 19.3107 9.79389 19.3308C7.73118 20.7881 5.18375 21.5786 2.56139 21.5752C2.09686 21.5753 1.63273 21.5509 1.17139 21.502C3.83323 23.0424 6.93181 23.8598 10.0964 23.8567C20.8089 23.8567 26.6651 15.8714 26.6651 8.9459C26.6651 8.7209 26.6589 8.49365 26.6476 8.26865C27.7867 7.52725 28.77 6.60916 29.5514 5.5574L29.5539 5.55403V5.55403Z" fill="#1B225A"/>
        </svg>        
    },
]




const cards: Array<ICard> = [
    {
        image: sheild,
        bgColor: "#BEFDC3",
        value: "$4B+",
        title: "Transactions Per Day",
        shadow: "0px 7px 14px #BEFDC3"
    },
    {
        image: newFolder,
        bgColor: "#FAEAB3",
        value: "101M+",
        title: "Total Staked Funds",
        shadow: "0px 7px 14px #FAEAB3"
    },
    {
        image: eth,
        bgColor: "#A1B8F9",
        value: "$3.01",
        title: "IndoCoin Price",
        shadow: "0px 7px 14px #A1B8F9"
    },
    {
        image: locker,
        bgColor: "#F5BEBC",
        value: "1B+",
        title: "Total Liquidity",
        shadow: "0px 7px 14px #F5BEBC"
    },
]

type HomeProps = {};



const Home: React.FC<HomeProps> = (): ReactElement => {
    const history = useHistory();
    const toggleWalletModal = useWalletModalToggle()
    const commonStyle: CSSProperties = {
        border: 'none',
        cursor: 'pointer',
    }
    const headerButtonStyle: CSSProperties = {
        ...commonStyle,
        backgroundColor: "#6BC06D",
        padding: "10px 40px"
    }

    const bottomButtonStyle: CSSProperties = {
        ...commonStyle,
        padding: "15px 60px",
        textTransform: 'uppercase',
        color: "#fff",
        width: "80%",
        backgroundColor: "#41444E" 
    }

    const bottomBtnStyle: CSSProperties = {
        ...commonStyle,
        padding: "15px 60px",
        textTransform: 'uppercase',
        color: "#fff",
        backgroundColor: "#41444E" 
    }

    const lightningBtnStyle: CSSProperties = {
        ...commonStyle,
        padding: "15px 60px",
        textTransform: 'uppercase',
        color: "#000",
        backgroundColor: "#6BC06D",
        boxShadow: "0px 3px 10px 0px #6BC06D"
    }

    function gotoSwapHandler(e: MouseEvent<HTMLButtonElement>){
        history.push("/swap");
    }


    return (
        <div className={clsx.home}>

            <div className={clsx.home_first}>
                {/* <div className={clsx.home_first_bg}></div> */}
                <div className={clsx.home_first__header}>
                    <div className={clsx.first_header__left}>
                        <NavLink to="/">
                            <Logo />
                        </NavLink>
                    </div>
                    <div className={clsx.first_header__right}>
                        <Button text="Launch App" radius={false} onClick={gotoSwapHandler} style={headerButtonStyle} />
                    </div>
                </div>


                <div className={clsx.home_first__body}>
                    <div className={clsx.first_body__left}>
                        <p>
                            Limitless Opportunity To Swap Decentralized Within The Safest Blockchains
                        </p>
                    </div>
                    <div className={clsx.first_body__right}>
                        <p>
                            Through simple, secure and scalable technology, IndoEx empowers millions to invent and explore new opportunities.
                        </p>
                        <Button text="Launch Dapp" radius={true} onClick={gotoSwapHandler} style={bottomButtonStyle} />
                    </div>

                </div>
            </div>

            <div className={clsx.home_second}>
                <div className={clsx.home_second__header}>
                    {
                        images.map((img, i) => (
                            <img key={i} src={img} alt="Swap" />
                        ))
                    }
                </div>
                <div className={clsx.home_second__body}>
                    {/* <div className={clsx.second_body__absolute}></div> */}
                    <h3>Backed By Valuable Metrics</h3>
                    <div className={clsx.second_body__content}>
                        <div className={clsx.body_content__cards}>
                            {
                                cards.map(({image, value, title, bgColor, shadow}, i) => (
                                    <Card key={i} image={image} value={value} shadow={shadow} title={title} bgColor={bgColor} />
                                ))
                            }
                        </div>
                    </div>
                </div>

                <div className={clsx.second_lightning}>
                    <div className={clsx.lightning_left}>

                    </div>
                    <div className={clsx.lightning_right}>
                        <h2>Secured For A Fast And Safe Swap Experience</h2>
                        <p>IndoEx Has Built The Safest Most Secure Platform For User Of Decentralized Finance, And Now Those Users Are Entrusting Us With Of $20million In Funds</p>
                        <Button text="Launch dapp" radius={true} onClick={gotoSwapHandler} style={lightningBtnStyle} />
                    </div>
                </div>

                <div className={clsx.second_lock}>
                    <div className={clsx.lock_left}>
                        <h3>Freedom To Trade <br/> Anything You Want, <br /> Anytime You Want.</h3>
                    </div>
                    <div className={clsx.lock_right}>
                    </div>
                </div>

                <div className={clsx.second_connect__wallet}>
                    <div className={clsx.connect_wallet}>
                        <div className={clsx.connect_wallet__left}>
                           <img src={wallets} alt="Wallets" />
                        </div>
                        <div className={clsx.connect_wallet__right}>
                            <h3>Connect Your Wallet And Start Trading.</h3>
                            <Button text="Connect Wallet" radius={true} onClick={toggleWalletModal} style={bottomBtnStyle} />
                        </div>
                    </div>
                </div>

                <Footer links={footerLinks} socialLinks={socialLinks} />
            </div>
        </div>
    )
}



export default Home;