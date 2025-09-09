/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactElement, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { revalidate } from '../../../api'
import { getSimpleProtocolsPageData } from '../../../api/protocols'
import { basicPropertiesToKeep } from '../../../api/protocols/utils'
import Loader from 'src/components/Loader'

const AirdropDetails = styled.div`
	width: 100%;
	min-height: 100vh;
	padding: 30px;

	& h2 {
		width: min(100% - 2rem, 950px);
		margin-inline: auto;
		margin-bottom: 20px;
		font-size: 2.2rem;
		font-weight: normal !important;
	}
`

const AirdropDetailsContainer = styled.div`
	background-color: ${({ theme }) => theme.bg1};
	border: 1px solid ${({ theme }) => theme.bg2};
	width: min(100% - 2rem, 950px);
	margin-inline: auto;
	display: flex;
	flex-direction: column;
	padding: 20px;
	border-radius: 10px;

	& a {
		& button {
			background-color: #7eb946;
			border: none;
			padding: 10px 25px;
			color: #fff;
			cursor: pointer;
			outline: none;
		}
	}
`

const Top = styled.div`
	display: flex;
	align-items: center;

	@media only screen and (max-width: 600px) {
		display: block;
	}
`

const Bottom = styled.div`
	display: flex;

	flex-direction: column;
	align-items: center;

	& p {
		margin-block: 20px;

		& a {
			text-decoration: none;
		}
	}

	& span {
		display: flex;
		align-items: center;

		& svg {
			width: 20px;
		}
	}

	& button {
		border: none;
		padding: 15px 20px;
		outline: none;
		display: flex;
		align-items: center;
		text-transform: uppercase;
		font-size: 1.5rem;
		color: #fff;
		background-color: #7eb946;
		border-radius: 4px;

		& svg {
			width: 20px;
			color: #fff !important;
		}
	}
`

const DetailsLeft = styled.div`
	min-width: 35%;
	padding-right: 20px;

	& section {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		& img {
			width: 170px;
		}

		& span {
			padding: 10px;
			border-radius: 10px;
			border: 1px solid #555;
			display: flex;
			align-items: center;
			justify-content: space-between;
			min-width: 100px;

			& b {
				font-weight: bolder;
				font-size: 1.15rem;
			}

			& svg {
				width: 20px;
				cursor: pointer;
			}
		}
	}
`

const LeftMeta = styled.div`
	display: block;
	margin-top: 20px;

	& .chain-details {
		display: flex;
		justify-content: space-between;
	}
	& .chain-details div {
		display: block;
	}

	& span {
		display: block;
		font-weight: 200;
		margin-bottom: 8px;

		& a {
			text-decoration: none;
		}
	}
`

const Info = styled.p`
	& a {
		text-decoration: none;
	}
`
const NavLink = styled.p`
	text-decoration: underline;
	color: green;
`

const DetailsRight = styled.div`
  letter-spacing: 0.4px;
  line-height: 1.5;
  padding-left: 20px;

  & p {
    margin-bottom: 20px;
    font-size: 1.1rem;
  }

  & h5 {
    font-size: 1rem;
    font-weight: 800 !important;
    margin-bottom: 5pximport { moment } from 'mom';
;
  }

  & ul {
    counter-reset: number;
    list-style-type: none;
    padding-left: 20px;
    margin-bottom: 30px;

    & li {
      counter-increment: number;

      & a {
        text-decoration: none;
      }

      &::before {
        content: counter(number) '.  ';
      }
    }
  }
`

const Meta = styled.div`
	display: flex;
	flex-direction: column;
	padding: 10px 30px;
	align-items: center;

	& p {
		font-size: 1.5rem;
		margin-bottom: 10px;
	}

	& span {
		color: #5b8cbf;
		font-size: 1.5rem;
	}
`

const Generic = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	padding: 10px;
	margin-bottom: 20px;

	& h2 {
		margin: 0;
		font-size: 1.7rem;
	}
`

const Overview = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
`

const OverviewLeft = styled.div`
	display: flex;
	flex-direction: column;
	width: 40%;

	& span {
		margin-bottom: 5px;
		display: flex;
		align-items: center;

		& button {
			color: #ffffff;
			border: 1px solid #ffffff;
			padding: 5px 30px;
			background-color: transparent;
			cursor: pointer;
		}

		& a {
			text-decoration: none;
		}

		& svg {
			width: 20px;
		}
	}
`
const OverviewRight = styled.div`
	display: flex;
	flex-direction: column;
	width: 40%;

	& span {
		margin-bottom: 5px;
		display: flex;
		align-items: center;

		& svg {
			width: 20px;
		}
	}
`

const IframeContainer = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`

const Iframe = styled.iframe`
	width: min(100% - 4rem, 600px);
	height: 400px;
	border: none;
`

const numFor = Intl.NumberFormat('en-US')

function CardMeta(props: { name: string; value: any }): ReactElement {
	const { name, value } = props
	return (
		<Meta>
			<p>{name}</p>
			<span>${numFor.format(value)}</span>
		</Meta>
	)
}

function GenericCard(props: { header: string; body: ReactElement }): ReactElement {
	const { header, body } = props
	return (
		<Generic>
			<h2>{header}</h2>
			<hr style={{ width: '100%', height: 1, border: 'none', backgroundColor: 'grey', marginBlock: 20 }} />
			<div>{body}</div>
		</Generic>
	)
}

function SocialLink(props: { name: string; icon: ReactElement }): ReactElement {
	const { name, icon } = props
	return (
		<span>
			{name}: &nbsp;<a href="#">{icon}</a>
		</span>
	)
}

interface Params {
	name: string
}

const exclude = [
	'DeerFi',
	'FireDAO',
	'Robo-Advisor for Yield',
	'SenpaiSwap',
	'Zunami Protocol',
	'NowSwap',
	'NeoBurger',
	'MochiFi',
	'StakeHound',
	'Mento',
	'Lightning Network',
	'Secret Bridge',
	'Karura Swap',
	'Karura Liquid-Staking',
	'Karura Dollar (kUSD)',
	'Tezos Liquidity Baking',
	'Notional',
	'Tinlake',
	'Kuu Finance'
]

const Details: React.FC<{}> = (): ReactElement => {
	const params = useParams<Params>()
	const [state, setState] = useState({
		airdrops: []
	} as any)
	const [loading, setLoading] = useState(true)

	const getAirdrops = async () => {
		const protocolsRaw = await getSimpleProtocolsPageData([
			...basicPropertiesToKeep,
			'extraTvl',
			'listedAt',
			'chainTvls'
		])

		const protocols = protocolsRaw.protocols
			.filter((token) => (token.symbol === null || token.symbol === '-') && !exclude.includes(token.name))
			.map((p) => ({ listedAt: 1624728920, ...p }))
			.sort((a, b) => b.listedAt - a.listedAt)
		const airdrops = protocols.map((protocol) => protocol)
		const url = `${process.env.REACT_APP_BACKEND_API}/airdrops`

		const response = await fetch(url)
		const data = await response.json()
		if (airdrops || data) {
			setState({ ...state, airdrops: [...airdrops, ...data.airdrops] })
			setLoading(false)
		}
		return {
			props: {
				protocols,
				chainList: protocolsRaw.chains
			},
			revalidate: revalidate()
		}
	}

	const { airdrops } = state

	useEffect(() => {
		getAirdrops()
	}, [])

	const airdrop = airdrops.find((airdrop) => airdrop?._id === params.name)

	console.log({ params, airdrop })
	const chainTvls = []
	const chains = []

	for (const key in airdrop?.chainTvls) {
		if (!airdrop?.chainTvls.hasOwnProperty(key)) continue

		const obj = airdrop?.chainTvls[key]
		chainTvls.push(obj)

		for (const prop in obj) {
			if (!obj.hasOwnProperty(prop)) continue
		}
	}

	let i: any = []
	for (i in airdrop?.chainTvls) {
		if (airdrop?.chainTvls.hasOwnProperty(i)) {
			chains.push(i)
		}
	}

	function nFormatter(num, digits) {
		const lookup = [
			{ value: 1, symbol: '' },
			{ value: 1e3, symbol: 'k' },
			{ value: 1e6, symbol: 'M' },
			{ value: 1e9, symbol: 'G' },
			{ value: 1e12, symbol: 'T' },
			{ value: 1e15, symbol: 'P' },
			{ value: 1e18, symbol: 'E' }
		]
		const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
		const item = lookup
			.slice()
			.reverse()
			.find(function (item) {
				return num >= item.value
			})
		return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
	}

	return (
		<>
			{loading ? (
				<>
					<h2>Loading airdrop info...Please wait</h2>
					<Loader />
				</>
			) : (
				<AirdropDetails>
					<h2>{airdrop?.name}</h2>
					<AirdropDetailsContainer>
						<Top>
							<DetailsLeft>
								<section>
									<img src={airdrop?.logo} alt="Airdrop Logo" />
									<p>Total Value Locked</p>
									<span>
										<b>${numFor.format(Math.ceil(airdrop?.tvl))}</b>
									</span>
								</section>
								<LeftMeta>
									<hr />
									<p>Chain Breakdown</p>
									<hr />
									<div className="chain-details">
										{airdrop?.owner ? (
											<>
												<span>
													<b>Chain: &nbsp;&nbsp;</b>
												</span>
												<div>
													<span>{airdrop?.chains}</span>
												</div>
											</>
										) : (
											<>
												<div>
													{chains.map((chain, key) => (
														<span key={key}>
															<b>{chain}: &nbsp;&nbsp;</b>
														</span>
													))}
												</div>
												<div>
													{chainTvls.map((chainTvls, key) => (
														<span key={key}>${nFormatter(chainTvls.tvl, chainTvls.tvl.toString().split('.'))}</span>
													))}
												</div>
											</>
										)}
									</div>
								</LeftMeta>
							</DetailsLeft>
							<DetailsRight>
								<p>{airdrop?.name}</p>
								<hr />
								<span>
									<strong>Chains</strong>
								</span>
								<hr />
								{airdrop?.owner ? (
									<div>
										<ol>
											<li style={{ marginTop: '5px' }}>{airdrop?.chains}</li>
										</ol>
									</div>
								) : (
									<div>
										<ol>
											{chains.map((chain, key) => (
												<li style={{ marginTop: '5px' }} key={key}>
													{chain}
												</li>
											))}
										</ol>
									</div>
								)}

								<hr />
								<span>
									<strong>Category</strong>
								</span>
								<hr />
								<div>
									<ol>
										<li style={{ marginTop: '5px' }}>{airdrop?.category}</li>
									</ol>
								</div>

								<Info>
									You&apos;re interested in more projects that do not have any token yet and could potentially airdrop a
									governance token to early users in the future?
								</Info>
							</DetailsRight>
						</Top>
						<hr style={{ width: '100%', height: 1, border: 'none', backgroundColor: 'grey', marginBlock: 30 }} />
						<a href={airdrop?.url} target="_blank" rel="noreferrer">
							<Bottom>
								<button>
									Claim Airdrop
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path
											d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54"
											stroke="#ffffff"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M2 12H14.88"
											stroke="#ffffff"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M12.65 8.6499L16 11.9999L12.65 15.3499"
											stroke="#ffffff"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
							</Bottom>
						</a>
					</AirdropDetailsContainer>
				</AirdropDetails>
			)}
		</>
	)
}

export default Details
