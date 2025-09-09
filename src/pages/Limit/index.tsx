import { CurrencyAmount, JSBI, Trade, Token, RoutablePlatform, Currency } from 'dxswap-sdk'
import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useState, MouseEvent } from 'react'
import { Repeat, Lock, Unlock, ChevronDown } from 'react-feather'
import { darken } from 'polished'
import styled, { ThemeContext } from 'styled-components'
import axios from 'axios'
import './limit.css'
import { ButtonPrimary, ButtonOutlined } from '../../components/Button'
import { ModalInfo, setInfo, setModalMsg, setModalStaus, showModalInfo } from '../../components/infomodal'

import { AutoColumn } from '../../components/Column'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { RowBetween, RowFixed } from '../../components/Row'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import { ArrowWrapper, SwapCallbackError, SwitchTokensAmountsContainer, Wrapper } from '../../components/swap/styleds'
import TradePrice from '../../components/swap/TradePrice'
import TokenWarningModal from '../../components/TokenWarningModal'
import { useActiveWeb3React } from '../../hooks'
import { useAllTokens, useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/swap/actions'
import {
	useDefaultsFromURLSearch,
	useDerivedSwapInfo,
	useSwapActionHandlers,
	useSwapState
} from '../../state/swap/hooks'
import { useExpertModeManager, useUserSlippageTolerance } from '../../state/user/hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import AppBody from '../AppBody'
import { ClickableText } from '../Pool/styleds'
import Loader from '../../components/Loader'
import Backdrop from '../../components/Backdrop'
import { useTargetedChainIdFromUrl } from '../../hooks/useTargetedChainIdFromUrl'
import NetworkWarningModal from '../../components/NetworkWarningModal'
import BeeEth from '../../assets/svg/bee-eth.svg'
import TradingViewWidget from './TradingViewWidget'
import useLimit from './functions'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import { Limitx, init } from './limit'

const CustomButton = styled(ButtonOutlined)`
	border: 1px solid ${(props: any) => props.theme.blue1};
	background-color: ${(props: any) => darken(0.3, props.theme.blue1)};
	text-transform: uppercase;
`

const RotatedRepeat = styled(Repeat)`
	transform: rotate(90deg);
	width: 14px;
`

const SwitchIconContainer = styled.div`
	height: 0;
	position: relative;
	width: 100%;
`

const SalesInfoContainer = styled.div`
	border: 1px solid ${(props: any) => props.theme.text3};
	padding: 10px;
	display: flex;
	flex-direction: column;
	width: 100%;
	border-radius: 10px;
`

const SalesInfoTop = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
`

const SalesInfoTopLeft = styled.div`
	background-color: ${(props: any) => props.theme.dark2};
	border-radius: 10px;
	padding: 10px;
	flex: 0.85;
	min-width: 225px;
	margin-right: 5px;
`

const SalesTopRight = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	margin-left: 5px;

	& p {
		font-size: 0.8rem;
		letter-spacing: 0.4px;
	}

	& select {
		background-color: transparent;
		color: ${(props: any) => props.theme.text2};
		font-size: 0.85rem;
		padding: 8px;
		border-radius: 10px;
		outline: none;
		focus: none;
	}
`

const SalesInfoBottom = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;

	& p {
		font-size: 0.65rem;
		color: ${(props: any) => props.theme.text2};
		display: flex;
		align-items: center;
		cursor: pointer;

		& svg {
			width: 14px;
			height: 14px;
		}
	}

	& span {
		font-size: 0.75rem;

		& span {
			margin-right: 8px;
		}
	}
`

const Input = styled.input`
	border: none;
	outline: none;
	font-size: 0.9rem;
	background-color: transparent;
	color: white;
	display: inline-block;
	width: 100px;

	&::-webkit-inner-spin-button,
	&::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
`

const LeftTop = styled.div`
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: space-between;
	color: ${(props: any) => props.theme.text2};

	& p {
		font-size: 0.65rem;
	}

	& > span {
		font-size: 0.65rem;
		display: flex;
		align-items: center;
		color: ${(props: any) => props.theme.blue1};
		cursor: pointer;

		&:hover {
		}

		& svg {
			width: 14px;
			color: ${(props: any) => props.theme.text3};
			cursor: pointer;
			margin-left: 8px;
		}
	}
`
const LeftBottom = styled.div`
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: space-between;

	& span {
		font-size: 0.65rem;
		letter-spacing: 1px;
		text-transform: uppercase;
		color: ${(props: any) => props.theme.blue1};
		cursor: pointer;
		display: flex;
		align-items: center;

		&:hover {
			color: var(--white);
		}

		& svg {
			width: 14px;
			height: 14px;
			margin-left: 2px;
		}
	}
`

const options: string[] = [
	'1 Minute',
	'10 Minutes',
	'1 Hour',
	'1 Day',
	'3 Days',
	'7 Days',
	'30 days',
	'3 Months',
	'6 Months',
	'1 Year',
	'2 Years',
	'3 Years'
]

type LimitStatus = 'buy' | 'sell'
interface TokenPriceData {
	[sellerAddress: string]: {
		usd: number
	}
}

const Limit: React.FC<{}> = ({}): ReactElement => {
	const [isMarketOpen, setIsMarketOpen] = useState<boolean>(false)
	const [showDiv, setShowDiv] = useState<boolean>(true)
	const [height, setHeight] = useState<string | null>('50vh')
	const [loadingCoins, setLoadingCoins] = useState<boolean>(true)
	const [coins, setCoins] = useState([])
	const [loading, setLoading] = useState<boolean>(false)
	const [limitOrderComplete, setLimitOrderComplete] = useState<boolean>(false)
	const [txnError, setTxnError] = useState<string | null>(null)
	const [showMonitorModal, setShowMonitorModal] = useState<string | null>(null)
	const [platformOverride, setPlatformOverride] = useState<RoutablePlatform | null>(null)
	const [lock, setLock] = useState<boolean>(false)
	const [expiry, setExpiry] = useState<string>('7 Days')
	const [limit, setLimit] = useState<string | null>('0')
	const [showPair, setShowPair] = useState<boolean>(false)
	const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
	const [sellerPermission, setSellerPermission] = useState<boolean>(false)
	const [buyerPermission, setBuyerPermission] = useState<boolean>(false)
	const [sellerAllowed, setSellerAllowed] = useState<boolean>(false)
	const [buyerAllowed, setBuyerAllowed] = useState<boolean>(false)
	const [sellerTokenPrice, setSellerTokenPrice] = useState<number | null>(null)
	const [buyerTokenPrice, setBuyerTokenPrice] = useState<number | null>(null)
	const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
		showConfirm: boolean
		tradeToConfirm: Trade | undefined
		attemptingTxn: boolean
		swapErrorMessage: string | undefined
		txHash: string | undefined
	}>({
		showConfirm: false,
		tradeToConfirm: undefined,
		attemptingTxn: false,
		swapErrorMessage: undefined,
		txHash: undefined
	})
	const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
	const [showInverted, setShowInverted] = useState<boolean>(false)
	const [limitStatus, setLimitStatus] = useState<LimitStatus>('sell')

	const allTokens = useAllTokens()
	const loadedUrlParams = useDefaultsFromURLSearch()
	const { setProvider, isAllowed, newLimit, getAllowed } = useLimit()
	const [loadedInputCurrency, loadedOutputCurrency] = [
		useCurrency(loadedUrlParams?.inputCurrencyId),
		useCurrency(loadedUrlParams?.outputCurrencyId)
	]
	const urlLoadedChainId = useTargetedChainIdFromUrl()
	const { account, chainId, library } = useActiveWeb3React()
	const toggleWalletModal = useWalletModalToggle()

	const [isExpertMode] = useExpertModeManager()
	const [allowedSlippage] = useUserSlippageTolerance()

	const { independentField, typedValue, recipient } = useSwapState()
	const {
		trade: potentialTrade,
		allPlatformTrades,
		currencyBalances,
		parsedAmount,
		currencies,
		inputError: swapInputError
	} = useDerivedSwapInfo(platformOverride || undefined)
	const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
		currencies[Field.INPUT],
		currencies[Field.OUTPUT],
		typedValue
	)
	const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()

	const urlLoadedScammyTokens: Token[] = useMemo(() => {
		const normalizedAllTokens = Object.values(allTokens)
		if (normalizedAllTokens.length === 0) return []
		return [loadedInputCurrency, loadedOutputCurrency].filter((urlLoadedToken): urlLoadedToken is Token => {
			return (
				urlLoadedToken instanceof Token && !normalizedAllTokens.some(legitToken => legitToken.equals(urlLoadedToken))
			)
		})
	}, [loadedInputCurrency, loadedOutputCurrency, allTokens])
	let [sellerDec, buyerDec] = useMemo(() => {
		return Object.values(currencies).map(v => {
			if (v instanceof WrappedTokenInfo) {
				return v.decimals
			} else {
				return 18
			}
		})
	}, [currencies['INPUT'], currencies['OUTPUT']])

	let [sellerAddress, buyerAddress] = useMemo(() => {
		return Object.values(currencies).map(v => {
			if (v instanceof WrappedTokenInfo) {
				return v.address
			} else {
				return ''
			}
		})
	}, [currencies['INPUT'], currencies['OUTPUT']])
	let [sellerToken, buyerToken] = useMemo(() => {
		return Object.values(currencies).map(t => (!t ? '' : t.name))
	}, [currencies['INPUT'], currencies['OUTPUT']])

	let [sellerTokenSymbol, buyerTokenSymbol] = useMemo(() => {
		return Object.values(currencies).map(t => (!t ? '' : t.symbol))
	}, [currencies['INPUT'], currencies['OUTPUT']])

	const readyToAskPermission = useMemo(() => {
		let isSellerAddress: boolean = sellerAddress.trim() !== ''
		let isBuyerAddress: boolean = buyerAddress.trim() !== ''
		checkAllowance()
		return isSellerAddress && isBuyerAddress
	}, [sellerAddress, buyerAddress])

	const handleConfirmTokenWarning = useCallback(() => {
		setDismissTokenWarning(true)
	}, [])
	const handleTypeInput = useCallback(
		(value: string) => {
			onUserInput(Field.INPUT, value)
		},
		[onUserInput]
	)
	const handleTypeOutput = useCallback(
		(value: string) => {
			onUserInput(Field.OUTPUT, value)
		},
		[onUserInput]
	)
	const limitProvider = useCallback(
		async acc => {
			let provided = await setProvider(window.ethereum)
			return provided
		},
		[account]
	)

	const handleConfirmDismiss = useCallback(() => {
		setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
		if (txHash) {
			onUserInput(Field.INPUT, '')
			onUserInput(Field.OUTPUT, '')
		}
	}, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

	const handleInputSelect = useCallback(
		inputCurrency => {
			setPlatformOverride(null)
			setApprovalSubmitted(false)
			onCurrencySelection(Field.INPUT, inputCurrency)
			sellerAddress = inputCurrency?.address
			checkAllowance()
		},
		[onCurrencySelection]
	)

	const handleOutputSelect = useCallback(
		outputCurrency => {
			setPlatformOverride(null)
			onCurrencySelection(Field.OUTPUT, outputCurrency)
			buyerAddress = outputCurrency?.address
		},
		[onCurrencySelection]
	)

	const theme = useContext(ThemeContext)

	const permission = sellerPermission || sellerAllowed
	const bestPricedTrade = allPlatformTrades?.[0]
	const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
	const trade = showWrap ? undefined : potentialTrade
	const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)
	const parsedAmounts = showWrap
		? {
				[Field.INPUT]: parsedAmount,
				[Field.OUTPUT]: parsedAmount
		  }
		: {
				[Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
				[Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
		  }
	const isValid = !swapInputError
	const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

	let solveOutput =
		parsedAmounts[independentField]?.toExact() == undefined
			? ''
			: (parseFloat(parsedAmounts[independentField]?.toExact()) / parseFloat(limit)).toFixed(4)

	if (solveOutput === String(Infinity) || solveOutput === String(NaN)) {
		solveOutput = ''
	}

	const formattedAmounts = {
		[independentField]: typedValue,
		[dependentField]: showWrap ? parsedAmounts[independentField]?.toExact() ?? '' : solveOutput?.toString() ?? ''
	}

	const route = trade?.route
	const userHasSpecifiedInputOutput = Boolean(
		currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
	)
	const noRoute = !route
	const FEE_MESSAGE_CURRENCIES_CODE = ['ETH']

	const inputCurrency = currencies[Field.INPUT]?.symbol || ''
	const outputCurrency = currencies[Field.OUTPUT]?.symbol || ''

	let currencyMessage = ''
	if (chainId === 137) {
		if (FEE_MESSAGE_CURRENCIES_CODE.includes(inputCurrency)) {
			currencyMessage = inputCurrency
		} else if (FEE_MESSAGE_CURRENCIES_CODE.includes(outputCurrency)) {
			currencyMessage = outputCurrency
		}
	}

	function toggleLock(e: React.MouseEvent<HTMLSpanElement>): void {
		setLock(old => !old)
		if (sellerTokenPrice) {
			setLimit(sellerTokenPrice.toString())
		}
	}

	async function limitHandler(e: MouseEvent<HTMLButtonElement>) {
		setLoading(_ => true)
		if (!formattedAmounts[Field.INPUT]) {
			alert('Please input sell amount')
			setLoading(_ => false)
			return
		}
		if (!inputCurrency) {
			alert('Please select buy currency')
			setLoading(_ => false)
			return
		}
		if (!sellerAddress) {
			alert('Please select a buy token')
			setLoading(_ => false)
			return
		}
		if (!formattedAmounts[Field.OUTPUT]) {
			alert('Please wait, buy amount loading...')
			setLoading(_ => false)
			return
		}

		if (!permission) {
			alert('Please set your limit permission')
			setLoading(_ => false)
			return
		}
		setLoading(_ => true)
		showModalInfo(true)
		setModalMsg('Creating Limit Order')
		setModalStaus('')
		let [err, limitorder, res] = await newLimit(
			limitStatus,
			chainId,
			[sellerAddress, sellerDec],
			[buyerAddress, buyerDec],
			Number(formattedAmounts['INPUT']),
			Number(formattedAmounts['OUTPUT'])
		)

		if (err === true) {
			setInfo({
				msg: 'Unable to create limit order<br>' + res,
				status: 'error'
			})
			setLoading(_ => false)
		} else {console.log(expiry)
			const ldata = {
				data: {
					sign: res,
					order: limitorder,
					account: account,
					expires: expiry
				},
				chain: chainId
			}
			fetch(`${process.env.REACT_APP_BACKEND_API}/createlimit`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(ldata)
			})
				.then(async response => {
					const res = await response.json()
					console.log(res)
					if (res.status === true) {
						setInfo({
							msg: 'Limit order created successfully',
							status: 'good'
						})
						init(true)
					} else {
						setInfo({
							msg: 'Limit order failed',
							status: 'error'
						})
					}
					setLoading(_ => false)
				})
				.catch(err => {
					console.log(err)
					setInfo({
						msg: 'Limit order failed',
						status: 'error'
					})
					setLoading(_ => false)
				})
		}
	}

	async function getPermission(e: any) {
		setLoading(_ => true)
		let sellerGiven: boolean = false,
			buyerGiven: boolean = false
		if (!sellerAllowed) {
			sellerGiven = await getAllowed(sellerAddress, chainId, library)
		}

		setSellerPermission(_ => sellerGiven)
		if (sellerGiven) {
			setInfo({ msg: 'Approval successful', status: 'good' })
		} else {
			setInfo({ msg: 'Unable to approve access', status: 'error' })
		}
		setLoading(_ => false)
	}

	useEffect(() => {
		;(async () => {
			let hasSet = null
			if (account != null) {
				hasSet = await limitProvider(account)
			}
			await (async () => {
				let isSellerAllowed = await isAllowed(sellerAddress, chainId)
				let isBuyerAllowed = await isAllowed(buyerAddress, chainId)
				setSellerAllowed(_ => isSellerAllowed)
				setBuyerAllowed(_ => isBuyerAllowed)
			})()
			setLoading(_ => false)
		})()
	}, [account])

	async function checkAllowance() {
		let isSellerAllowed = await isAllowed(sellerAddress, chainId)
		setSellerAllowed(_ => isSellerAllowed)
	}
	useEffect(() => {
		if (approval === ApprovalState.PENDING) {
			setApprovalSubmitted(true)
		}
	}, [approval, approvalSubmitted])

	const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT], chainId)
	const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

	const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

	const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

	const handleSwap = useCallback(() => {
		if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
			return
		}
		if (!swapCallback) {
			return
		}
		setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
		swapCallback()
			.then(hash => {
				setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })
			})
			.catch(error => {
				setSwapState({
					attemptingTxn: false,
					tradeToConfirm,
					showConfirm,
					swapErrorMessage: error.message,
					txHash: undefined
				})
			})
	}, [tradeToConfirm, priceImpactWithoutFee, showConfirm, swapCallback])

	const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

	const handleMaxInput = useCallback(() => {
		maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
	}, [maxAmountInput, onUserInput])
	const handleAcceptChanges = useCallback(() => {
		setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
	}, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

	const url =
		'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false'

	useEffect(() => {
		axios
			.get(url)
			.then(response => {
				if (response.data) {
					setLoadingCoins(false)
					setCoins(response.data)
				}
			})
			.catch(error => {
				setLoadingCoins(false)
				console.log(error)
			})
	}, [])

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth <= 1084) {
				setShowDiv(false)
			} else {
				setShowDiv(true)
			}
		}

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	useEffect(() => {
		const fetchSellerTokenPrice = async () => {
			try {
				const response = await fetch(
					`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${sellerAddress}&vs_currencies=usd`
				)
				const data: TokenPriceData = await response.json()

				if (data) {
					const price = data[sellerAddress.toLocaleLowerCase()]?.usd
					setSellerTokenPrice(price)
				}
			} catch (error) {
				console.error('Error fetching token price:', error)
				setSellerTokenPrice(null)
			}
		}

		if (sellerAddress) {
			fetchSellerTokenPrice()
		}
	}, [sellerAddress])

	useEffect(() => {
		const fetchBuyerTokenPrice = async () => {
			try {
				const response = await fetch(
					`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${buyerAddress}&vs_currencies=usd`
				)
				const data: TokenPriceData = await response.json()
				const price = data[buyerAddress.toLocaleLowerCase()]?.usd
				formattedAmounts[Field.OUTPUT] = price != undefined ? price.toString() : ''
				setBuyerTokenPrice(price)
			} catch (error) {
				console.error('Error fetching token price:', error)
				setBuyerTokenPrice(null)
			}
		}

		if (buyerAddress) {
			fetchBuyerTokenPrice()
		}
	}, [buyerAddress])

	return (
		<>
			{loading && (
				<Backdrop>
					<Loader />
				</Backdrop>
			)}

			<NetworkWarningModal
				isOpen={!!account && !!urlLoadedChainId && chainId !== urlLoadedChainId}
				targetedNetwork={urlLoadedChainId}
			/>
			<TokenWarningModal
				isOpen={
					(!urlLoadedChainId || chainId === urlLoadedChainId) &&
					urlLoadedScammyTokens.length > 0 &&
					!dismissTokenWarning
				}
				tokens={urlLoadedScammyTokens}
				onConfirm={handleConfirmTokenWarning}
			/>

			{!showDiv && (
				<AppBody tradeDetailsOpen={!!trade}>
					<Wrapper id="limit-page">
						<ConfirmSwapModal
							isOpen={showConfirm}
							trade={trade}
							originalTrade={tradeToConfirm}
							onAcceptChanges={handleAcceptChanges}
							attemptingTxn={attemptingTxn}
							txHash={txHash}
							recipient={recipient}
							allowedSlippage={allowedSlippage}
							onConfirm={handleSwap}
							swapErrorMessage={swapErrorMessage}
							onDismiss={handleConfirmDismiss}
						/>

						<AutoColumn gap="16px">
							<AutoColumn gap="3px">
								<CurrencyInputPanel
									label={independentField === Field.OUTPUT && !showWrap && trade ? 'You sell (estimated)' : 'You sell'}
									value={sellerAddress && formattedAmounts[Field.INPUT]}
									showMaxButton={false}
									currency={currencies[Field.INPUT]}
									onUserInput={handleTypeInput}
									onMax={handleMaxInput}
									onCurrencySelect={handleInputSelect}
									otherCurrency={currencies[Field.OUTPUT]}
									id="swap-currency-input"
								/>
								<SwitchIconContainer>
									<SwitchTokensAmountsContainer
										onClick={() => {
											setApprovalSubmitted(false)
											onSwitchTokens()
										}}
									>
										<ArrowWrapper clickable>
											<RotatedRepeat color={theme.text4} />
										</ArrowWrapper>
									</SwitchTokensAmountsContainer>
								</SwitchIconContainer>
								<CurrencyInputPanel
									value={
										sellerAddress && buyerAddress && !lock
											? formattedAmounts[Field.OUTPUT]
											: sellerTokenPrice?.toString()
									}
									onUserInput={handleTypeOutput}
									label={independentField === Field.INPUT && !showWrap && trade ? 'You buy (estimated)' : 'You buy'}
									showMaxButton={false}
									currency={currencies[Field.OUTPUT]}
									onCurrencySelect={handleOutputSelect}
									otherCurrency={currencies[Field.INPUT]}
									id="swap-currency-output"
								/>
								{currencyMessage && (
									<AutoColumn gap="3px" justify={'center'}>
										<div
											style={{
												display: 'flex',
												border: '1px solid',
												borderRadius: '7px',
												borderColor: 'white',
												padding: '4px',
												margin: '5px 0'
											}}
										>
											<img src={BeeEth} alt="" style={{ marginRight: '3px' }} />
											<h5
												style={{ textAlign: 'center' }}
											>{`Trades with ${currencyMessage} token have a fee of only 0.15%`}</h5>
										</div>
									</AutoColumn>
								)}
							</AutoColumn>

							<SalesInfoContainer>
								<SalesInfoTop>
									<SalesInfoTopLeft>
										<LeftTop>
											<p>Sell {sellerTokenSymbol} at rate</p>
											<span aria-disabled={!buyerAddress && !sellerAddress ? true : false} onClick={toggleLock}>
												Set to market {lock ? <Lock /> : <Unlock />}
											</span>
										</LeftTop>
										<LeftBottom>
											{buyerAddress && sellerAddress && lock ? (
												<Input value={buyerTokenPrice?.toString()} disabled={true} />
											) : (
												<Input
													placeholder="0"
													value={formattedAmounts[Field.OUTPUT]}
													onChange={e => setLimit(e.target.value)}
													type="number"
												/>
											)}

											<span>
												{buyerToken} <Repeat />
											</span>
										</LeftBottom>
									</SalesInfoTopLeft>

									<SalesTopRight>
										<p>Expires in</p>
										<select value={expiry} onChange={e => setExpiry(_ => e.currentTarget.value)}>
											{options.map((o, i) => (
												<option key={i} value={o}>
													{o}
												</option>
											))}
										</select>
									</SalesTopRight>
								</SalesInfoTop>
								<>
									<SalesInfoBottom>
										<p onClick={e => setShowPair(old => !old)}>
											{buyerTokenSymbol?.toUpperCase()} buy price <ChevronDown />
										</p>
										<span>${buyerTokenPrice?.toString()}</span>
									</SalesInfoBottom>
									{showPair && (
										<SalesInfoBottom>
											<p>{sellerTokenSymbol?.toUpperCase()} sell price </p>
											<span>${buyerAddress && sellerAddress && lock ? limit : formattedAmounts[Field.INPUT]}</span>
										</SalesInfoBottom>
									)}
								</>
							</SalesInfoContainer>
							{!permission && (
								<div>
									<CustomButton onClick={getPermission} disabled={!readyToAskPermission ? true : false}>
										Give permission to use tokens
									</CustomButton>
								</div>
							)}
							<div>
								{!account ? (
									<ButtonPrimary onClick={toggleWalletModal}>Connect Wallet</ButtonPrimary>
								) : (
									<ButtonPrimary disabled={permission && buyerAddress ? false : true} onClick={limitHandler}>
										{sellerAddress && buyerAddress ? 'Add Limit' : 'Can not use native currency'}
									</ButtonPrimary>
								)}
							</div>
							{isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
							{!showWrap && !!trade && (
								<RowBetween align="center">
									<RowFixed>
										<ClickableText fontSize="14px" fontWeight="600" color="white">
											Indoex
										</ClickableText>
									</RowFixed>
									<RowFixed>
										<TradePrice
											price={trade?.executionPrice}
											showInverted={showInverted}
											setShowInverted={setShowInverted}
										/>
									</RowFixed>
								</RowBetween>
							)}
						</AutoColumn>
					</Wrapper>
				</AppBody>
			)}

			<div style={{ width: '100%' }} className="css-1xv2xdc e1dej11h0">
				{loadingCoins ? (
					<div className="css-hnm5xc e17te42g5" style={{ margin: 'auto' }}>
						<h3 style={{ textAlign: 'center' }}>
							Loading...Please wait <Loader />
						</h3>
					</div>
				) : (
					<div className="css-hnm5xc e17te42g5" style={{ marginTop: '20px' }}>
						<div className="css-npyjff e17te42g4">
							<div className="css-158dyo6 e17te42g3">
								<div>
									<div
										style={{
											position: 'relative',
											userSelect: 'auto',
											maxWidth: '100%',
											boxSizing: 'border-box',
											flexShrink: 0
										}}
									>
										<Limitx />
										<br />
										<TradingViewWidget />
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
				<div style={{ position: 'relative', marginTop: '20px' }}>
					<div className="big_screen_limit">
						{showDiv && (
							<AppBody tradeDetailsOpen={!!trade}>
								<Wrapper id="limit-page">
									<ConfirmSwapModal
										isOpen={showConfirm}
										trade={trade}
										originalTrade={tradeToConfirm}
										onAcceptChanges={handleAcceptChanges}
										attemptingTxn={attemptingTxn}
										txHash={txHash}
										recipient={recipient}
										allowedSlippage={allowedSlippage}
										onConfirm={handleSwap}
										swapErrorMessage={swapErrorMessage}
										onDismiss={handleConfirmDismiss}
									/>

									<AutoColumn gap="16px">
										<AutoColumn gap="3px">
											<CurrencyInputPanel
												label={
													independentField === Field.OUTPUT && !showWrap && trade ? 'You sell (estimated)' : 'You sell'
												}
												value={sellerAddress && formattedAmounts[Field.INPUT]}
												showMaxButton={false}
												currency={currencies[Field.INPUT]}
												onUserInput={handleTypeInput}
												onMax={handleMaxInput}
												onCurrencySelect={handleInputSelect}
												otherCurrency={currencies[Field.OUTPUT]}
												id="swap-currency-input"
											/>
											<SwitchIconContainer>
												<SwitchTokensAmountsContainer
													onClick={() => {
														setApprovalSubmitted(false)
														onSwitchTokens()
														checkAllowance()
													}}
												>
													<ArrowWrapper clickable>
														<RotatedRepeat color={theme.text4} />
													</ArrowWrapper>
												</SwitchTokensAmountsContainer>
											</SwitchIconContainer>
											<CurrencyInputPanel
												value={formattedAmounts[Field.OUTPUT]}
												onUserInput={handleTypeOutput}
												label={
													independentField === Field.INPUT && !showWrap && trade ? 'You buy (estimated)' : 'You buy'
												}
												showMaxButton={false}
												currency={currencies[Field.OUTPUT]}
												onCurrencySelect={handleOutputSelect}
												otherCurrency={currencies[Field.INPUT]}
												id="swap-currency-output"
											/>
											{currencyMessage && (
												<AutoColumn gap="3px" justify={'center'}>
													<div
														style={{
															display: 'flex',
															border: '1px solid',
															borderRadius: '7px',
															borderColor: 'white',
															padding: '4px',
															margin: '5px 0'
														}}
													>
														<img src={BeeEth} alt="" style={{ marginRight: '3px' }} />
														<h5
															style={{ textAlign: 'center' }}
														>{`Trades with ${currencyMessage} token have a fee of only 0.15%`}</h5>
													</div>
												</AutoColumn>
											)}
										</AutoColumn>

										<SalesInfoContainer>
											<SalesInfoTop>
												<SalesInfoTopLeft>
													<LeftTop>
														<p>Sell {sellerTokenSymbol} at rate</p>
														<span aria-disabled={!buyerAddress && !sellerAddress ? true : false} onClick={toggleLock}>
															Set to market {lock ? <Lock /> : <Unlock />}
														</span>
													</LeftTop>
													<LeftBottom>
														{buyerAddress && sellerAddress && lock ? (
															<Input value={buyerTokenPrice} disabled={true} />
														) : (
															<Input
																placeholder="0"
																value={formattedAmounts[Field.OUTPUT]}
																onChange={e => setLimit(e.target.value)}
																type="number"
															/>
														)}

														<span>
															{buyerToken} <Repeat />
														</span>
													</LeftBottom>
												</SalesInfoTopLeft>
												<SalesTopRight>
													<p>Expires in</p>
													<select value={expiry} onChange={e => setExpiry(_ => e.currentTarget.value)}>
														{options.map((o, i) => (
															<option key={i} value={o}>
																{o}
															</option>
														))}
													</select>
												</SalesTopRight>
											</SalesInfoTop>
											{buyerAddress && (
												<>
													<SalesInfoBottom>
														<p onClick={e => setShowPair(old => !old)}>
															{buyerTokenSymbol?.toUpperCase()} buy price <ChevronDown />
														</p>
														<span>${buyerTokenPrice}</span>
														<span></span>
													</SalesInfoBottom>
													{showPair && (
														<SalesInfoBottom>
															<p>{sellerTokenSymbol?.toUpperCase()} sell price </p>
															<span>
																${buyerAddress && sellerAddress && lock ? limit : formattedAmounts[Field.INPUT]}
															</span>
														</SalesInfoBottom>
													)}
												</>
											)}
										</SalesInfoContainer>
										{!permission && (
											<div>
												<CustomButton onClick={getPermission} disabled={!readyToAskPermission ? true : false}>
													Give permission to use tokens
												</CustomButton>
											</div>
										)}
										<div>
											{!account ? (
												<ButtonPrimary onClick={toggleWalletModal}>Connect Wallet</ButtonPrimary>
											) : (
												<ButtonPrimary disabled={permission && buyerAddress ? false : true} onClick={limitHandler}>
													{sellerAddress && buyerAddress ? 'Add Limit' : 'Can not use native currency'}
												</ButtonPrimary>
											)}
										</div>
										{isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
										{!showWrap && !!trade && (
											<RowBetween align="center">
												<RowFixed>
													<ClickableText fontSize="14px" fontWeight="600" color="white">
														Indoex
													</ClickableText>
												</RowFixed>
												<RowFixed>
													<TradePrice
														price={trade?.executionPrice}
														showInverted={showInverted}
														setShowInverted={setShowInverted}
													/>
												</RowFixed>
											</RowBetween>
										)}
									</AutoColumn>
								</Wrapper>
							</AppBody>
						)}
					
						<ModalInfo />
					</div>
				</div>
			</div>
		</>
	)
}

export default Limit