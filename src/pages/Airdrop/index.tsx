/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, PureComponent } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import jumbotronImg from './images/jumbotron.jpeg'
import { revalidate } from '../../api'
import { getSimpleProtocolsPageData } from '../../api/protocols'
import { basicPropertiesToKeep } from '../../api/protocols/utils'
import Pagination from 'rc-pagination'
import { isAuthenticated, signout } from './../../helper/auth'

import './style.css'
import Loader from 'src/components/Loader'

const AirdropContainer = styled.div`
	width: 100%;
	min-height: 100vh;
	margin-top: -50px;
`

const AirdropTop = styled.div`
	background-image: url(${jumbotronImg});
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	width: 100%;
	min-height: 45vh;
`

const AirdropBody = styled.div`
	width: 100%;
	padding: 30px;
	display: flex;
	align-items: center;
	flex-direction: column;
	padding-bottom: 60px;

	& h2 {
		text-transform: uppercase;
		margin-top: 40px;
		font-weight: bolder;
		font-size: 2rem;
		letter-spacing: 1px;
		margin-bottom: 80px;
	}

	& .pagination-data {
		padding: 0;
		margin: 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-block: 70px;
	}
`

const Airdrops = styled.div`
	width: calc(100% - 2rem, 1000px);
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	margin-inline: auto;
	gap: 40px;

	@media screen and (max-width: 1035px) {
		grid-template-columns: repeat(2, 1fr);
	}
	@media screen and (max-width: 695px) {
		grid-template-columns: 1fr;
	}
`
const Card = styled.div`
	background-color: ${({ theme }) => theme.bg1};
	border: 1px solid ${({ theme }) => theme.bg2};
	border-radius: 10px;
	position: relative;
	padding: 20px;
	padding-bottom: 10px;
	align-items: center;
	min-width: 300px;
	max-width: 400px;
	cursor: pointer;
	display: block;
	color: #fff;
`

const SubmitButton = styled.button`
	width: 100%;
	cursor: pointer;
	transition: all 0.5s ease;
	background-color: #7eb946;
	color: #212121;
	font-size: 1rem;
	padding: 0.5rem 1rem;
	border: none;
	border-radius: 5px;
	&:hover {
		background-color: #212121;
		color: #eaeaea;
	}
`

const CardImage = styled.div`
	& img {
		width: 100%;
		max-width: 100px;
		height: auto;
		border-radius: 50%;
		margin-top: 5px;
	}
`

const CardMeta = styled.div`
	display: block;
`
const CardDetails = styled.div`
	display: flex;

	& span {
		align-items: center;
		font-size: 0.9rem;
		margin-left: 20px;
		padding-bottom: 10px;
	}

	& h5 {
		font-size: 18px;
		font-weight: 600;
	}

	& button {
		background-color: #539933;
		color: #fff;
		border: none;
		outline: none;
		padding: 5px;
		border-radius: 25px;
		cursor: pointer;
	}
`

const Tag = styled.div<TagProps>`
	position: absolute;
	padding: 10px 15px;
	top: 0;
	right: 0;
	border-radius: 20px 20px 0px 20px;
	background-color: #bf9140;
	font-size: 0.95rem;
	text-transform: capitalize;
`

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

interface TagProps {
	readonly $type: string
}

const Airdrop: React.FC = ({ history }: any) => {
	const [state, setState] = useState({
		airdrops: []
	} as any)
	const { user } = isAuthenticated()

	const [perPage, setPerPage] = useState(9)
	const [size, setSize] = useState(perPage)
	const [current, setCurrent] = useState(1)
	const [loading, setLoading] = useState(true)
	const [key, setKey] = useState(1)

	const getStaticProps = async () => {
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
		// console.log(airdrops)
		// console.log('protocolsRaw: ', protocolsRaw)
		const url = `${process.env.REACT_APP_BACKEND_API}/airdrops`

		const response = await fetch(url)
		const data = await response.json()
		if (airdrops || data) {
			setState({ ...state, airdrops: [...data.airdrops, ...airdrops] })
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
	const hasAirdrops = airdrops.length > 0

	useEffect(() => {
		getStaticProps()
	}, [getStaticProps])

	const PerPageChange = (value) => {
		setSize(value)
		const newPerPage = Math.ceil(airdrops.length / value)
		if (current > newPerPage) {
			setCurrent(newPerPage)
		}
	}

	const getData = (current, pageSize) => {
		return airdrops.slice((current - 1) * pageSize, current * pageSize)
	}

	const PaginationChange = (page, pageSize) => {
		setCurrent(page)
		setSize(pageSize)
	}

	const PrevNextArrow = (current, type, originalElement) => {
		if (type === 'prev') {
			return (
				<button>
					<i className="fa fa-angle-double-left"></i>
				</button>
			)
		}
		if (type === 'next') {
			return (
				<button>
					<i className="fa fa-angle-double-right"></i>
				</button>
			)
		}
		return originalElement
	}

	const numFor = Intl.NumberFormat('en-US')

	return (
		<AirdropContainer>
			<AirdropTop />
			<AirdropBody>
				{user ? (
					<div style={{ display: 'flex', marginBottom: '50px' }}>
						<Link to="/dashboard">
							<SubmitButton type="submit">Dashboard</SubmitButton>
						</Link>

						<a
							style={{ cursor: 'pointer', marginLeft: '10px' }}
							onClick={() => {
								signout(() => {
									history.push('/airdrop')
								})
							}}
						>
							<SubmitButton type="submit">Logout</SubmitButton>
						</a>
					</div>
				) : (
					<div style={{ display: 'flex', marginBottom: '50px' }}>
						<Link to="/register">
							<SubmitButton type="submit">Register</SubmitButton>
						</Link>
						<Link to="/login" style={{ marginLeft: '10px' }}>
							<SubmitButton type="submit">Login</SubmitButton>
						</Link>
					</div>
				)}
				{loading ? (
					<>
						<h4>Loading latest airdrops...Please wait</h4>
						<Loader />
					</>
				) : (
					<>
						<h2>Latest Airdrops</h2>

						{hasAirdrops ? (
							<>
								<Airdrops>
									{getData(current, size).map((data, index) => (
										<Card key={index}>
											<CardMeta>
												<CardDetails>
													<CardImage>
														<img src={data.logo} alt="Card Image" />
													</CardImage>
													<span>
														<h5>{data.name}</h5>
														<p>Category: {data.category}</p>
														<p>TVL: ${numFor.format(data.tvl)}</p>
														<Link to={`/airdrop/${data._id}`}>
															<button>View Airdrop</button>
														</Link>
													</span>
												</CardDetails>
											</CardMeta>
										</Card>
									))}
								</Airdrops>
								<Pagination
									className="pagination-data"
									showTotal={(total, range) => `Showing ${range[0]}-${range[1]} of ${total}`}
									onChange={PaginationChange}
									total={airdrops.length}
									current={current}
									pageSize={size}
									showSizeChanger={false}
									itemRender={PrevNextArrow}
									onShowSizeChange={PerPageChange}
								/>
							</>
						) : null}
					</>
				)}
			</AirdropBody>
		</AirdropContainer>
	)
}

export default Airdrop
