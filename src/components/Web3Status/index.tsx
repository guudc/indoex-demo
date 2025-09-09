/* eslint-disable @typescript-eslint/no-empty-function */
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { darken, transparentize } from 'polished'
import React, { useMemo } from 'react'
import { Activity, ChevronDown } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { NetworkContextName } from '../../constants'
import useENSName from '../../hooks/useENSName'
import { useWalletModalToggle, useNetworkSwitcherPopoverToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import { TYPE } from '../../theme'
import { ButtonSecondary } from '../Button'
import Loader from '../Loader'

import { RowBetween } from '../Row'
import WalletModal from '../WalletModal'
import NetworkSwitcherPopover from '../NetworkSwitcherPopover'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import GnosisLogo from '../../assets/images/gnosis-chain-logo.png'
import ArbitrumLogo from '../../assets/images/arbitrum-logo.jpg'
import BscLogo from "../../assets/images/bsc.svg";
import AvaxLogo from "../../assets/native/avax.png";
import PolygonLogo from '../../assets/images/polygon-logo.png'
import { ChainId } from 'dxswap-sdk'
import { useActiveWeb3React } from '../../hooks'
import useUAuthUser from '../../hooks/useUAuthUser'
import Web3 from 'web3';
import { E, web3Views } from '../utility'

const ChainLogo: any = {
  [ChainId.MUMBAI_TESTNET]: PolygonLogo,
  [ChainId.BSC_TESTNET]: BscLogo,
  [ChainId.ROPSTEN]: EthereumLogo,
  [ChainId.MAINNET]: EthereumLogo,
  [ChainId.XDAI]: GnosisLogo,
  [ChainId.MATIC]: PolygonLogo,
  [ChainId.AVAX]: AvaxLogo
}

const ChainLabel: any = {
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.MUMBAI_TESTNET]: 'Mumbai Testnet',
  [ChainId.BSC_TESTNET]: 'BSC Mainnet',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.SOKOL]: 'Sokol',
  [ChainId.XDAI]: 'Gnosis Chain',
  [ChainId.MATIC]: 'Polygon',
  [ChainId.AVAX]: 'Avalanche C-Chain'
}

const IconWrapper = styled.div<{ size?: number | null }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '30px')};
    border-radius: 50%;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: center;
  `};
`

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`
const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};
  padding-top: 5px;
  padding-bottom: 5px;
  margin-right: 10px;
  margin-left: 10px;
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
`

const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean }>`
  background-color: ${({ theme }) => transparentize(0.25, theme.bg1)};
  color: ${({ theme }) => theme.text4};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 11px;
  line-height: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: background-color 0.3s ease;
  padding: 9px 0px 9px 14px;
  outline: none;
  :hover,
  :focus {
    outline: none;
    border: none;
    box-shadow: none;
    background-color: ${({ theme }) => transparentize(0.1, theme.bg1)};
  }
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  background-color: ${({ pending, theme }) => (pending ? theme.primary1 : theme.dark2)};
  border: none;
  color: ${({ pending, theme }) => (pending ? theme.white : theme.text4)};
  border-radius: 8px;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.08em;
  transition: background-color 0.3s ease;
  padding: 9px 14px;
  :hover,
  :focus {
    border: none;
    background-color: ${({ pending, theme }) => (pending ? theme.primary1 : transparentize(0.1, theme.purple3))};
  }
`

const Web3StatusNetwork = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  background-color: ${({ theme }) => theme.dark1};
  padding: 0px 18px 0px 14px;
  border: 1px solid ${({ theme }) => theme.dark1};
`

const Text = styled.p<{ fontSize?: number }>`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
  ${({ fontSize }) => (fontSize ? `font-size:${fontSize}px` : '')};
`

const NetworkIcon = styled(Activity)`
  width: 15px;
  height: 15px;
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function Web3StatusInner() {
  const { t } = useTranslation()
  const { account, error, deactivate} = useWeb3React()
  const { chainId: networkConnectorChainId } = useActiveWeb3React()
  const { ENSName } = useENSName(account ?? undefined)
  const user = useUAuthUser(account ?? undefined)
  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const isConnected = localStorage.getItem("is_indoex_connected") || null
  if(isConnected == "false") {
    setTimeout(() => {
      try{
        //disable if it has not been disabled
        if(account != undefined) deactivate()
      } catch(error){}
    }, 600)
  }
  const hasPendingTransactions = !!pending.length
  const toggleWalletModal = useWalletModalToggle()
  const toggleNetworkSwitcherPopover = useNetworkSwitcherPopoverToggle()
  const swicthNetwork = async () => {
    //to switch to default network
    if (window.ethereum?.request != undefined) {
        try {
            await window.ethereum?.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: Web3.utils.toHex(137) }],
            });
          } 
          catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if ((switchError as any)?.code === 4902) {
              //add the chain
              try {
                await window.ethereum?.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: Web3.utils.toHex(137),
                      chainName: 'Polygon',
                      nativeCurrency: {
                        name: 'MATIC',
                        symbol: 'MATIC',
                        decimals: 18
                      },
                      blockExplorerUrls: ['https://polygonscan.com'],
                      rpcUrls: ['https://poly-mainnet.gateway.pokt.network/v1/lb/61141e8259501900341bb3e2']
                    }
                  ]
                })
              } catch (addError) {
                console.log(addError)
              }
            }
          }
         }
  }
  
  if (error) {
    console.error('webstatusinner err:', error)
    return (
      <Web3StatusError onClick={swicthNetwork}>
        <NetworkIcon />
        <Text>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}</Text>
      </Web3StatusError>
    )
  }
  if (networkConnectorChainId) {
    return (
      <>
        {!!account ? (
          <Web3StatusConnected id="web3-status-connected" onClick={toggleWalletModal} pending={hasPendingTransactions}>
            {hasPendingTransactions ? (
              <RowBetween>
                <Text fontSize={13}>{pending?.length} Pending</Text> <Loader />
              </RowBetween>
            ) : (
              (user && user.sub) || ENSName || shortenAddress(account)
            )}
          </Web3StatusConnected>
        ) : (
          <Web3StatusConnect id="connect-wallets" onClick={toggleWalletModal} faded={!account}>
            {t('Connect Wallet')}
          </Web3StatusConnect>
        )}
        <NetworkSwitcherPopover>
          <Web3StatusNetwork onClick={!!!account ? toggleNetworkSwitcherPopover : toggleNetworkSwitcherPopover}>
            <IconWrapper size={20}>
              <img src={ChainLogo[networkConnectorChainId]} alt={''} />
            </IconWrapper>
            <TYPE.white ml="8px" mr={!!!account ? '4px' : '0px'} fontWeight={700} fontSize="12px">
              {ChainLabel[networkConnectorChainId]}
            </TYPE.white>
            {!!!account && <ChevronDown size={16} />}
          </Web3StatusNetwork>
        </NetworkSwitcherPopover>
      </>
    )
  }
  return null
}
const _web3Timer = setInterval(() => {
    let addr = window.location.href + ""
    const t = E('web3status_head_bar') as HTMLDivElement
    if(t != null) {
      t.style.display = 'flex'
      web3Views.forEach((elem: any) => {
          addr = addr.substring(addr.lastIndexOf("/"))
          if(addr.indexOf(elem) > -1) {
              t.style.display = 'none'
              //exit function 
              return
          }
      })
    }
}, 1000)
export default function Web3Status() {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
     <div id='web3status_head_bar' style={{display:'flex', alignItems:'center'}}>
      <Web3StatusInner />
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
      </div>
    </>
  )
}
