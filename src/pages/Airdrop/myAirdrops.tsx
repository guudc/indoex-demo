/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, PureComponent } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import jumbotronImg from './images/jumbotron.jpeg'
import { isAuthenticated, signout } from '../../helper/auth'
import { getMyAirdrops, deleteMyAirdrop } from '../../functions/user'
import Pagination from 'rc-pagination'
import axios from 'axios'
import { getUserDetails } from './../../functions/user'

import './style.css'
import { User } from 'react-feather'
import Loader from 'src/components/Loader'
import { Redirect } from 'react-router-dom';

const AirdropContainer = styled.div`
	width: 100%;
	min-height: 100vh;
	margin-top: -10px;
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

interface TagProps {
	readonly $type: string
}

const MyAirdrops: React.FC = ({ history }: any) => {
	const [airdrops, setAirdrops] = useState([] as any)
	const { token } = isAuthenticated()

	const [perPage, setPerPage] = useState(9)
	const [size, setSize] = useState(perPage)
	const [current, setCurrent] = useState(1)
	const [key, setKey] = useState(1)
	const [loading, setLoading] = useState(false)
	const [id, setId] = useState('')

	const [user, setUser] = useState(null)

	const initUser = () => {
		getUserDetails(token).then(data => {
			console.log('data: ', data)
			if (data.message === 'Invalid Authentification') {
				alert('Session expired,  Please login')
				signout(() => {
					history.push('/')
					setTimeout(() => {
						window.location.reload()
					}, 1000)
				})
				return
			}
			setUser(data.user)
		})
	}

	useEffect(() => {
		initUser()
	}, [])
	const getOwnerAirdrop = () => {
		setLoading(true)
		getMyAirdrops(token).then((data) => {
			if (data.message === 'Invalid Authentification') {
				alert('Session expired,  Please login')
				signout(() => {
					history.push('/')
					setTimeout(() => {
						window.location.reload()
					}, 1000)
				})
				return
			}
			const airdrop = data.airdrops
			const aDrop = airdrop.map((airdrop) => airdrop)
			if (aDrop) {
				setAirdrops(aDrop)
				setLoading(false)
			}
		})
	}

	useEffect(() => {
		getOwnerAirdrop()
	}, [])

	const PerPageChange = (value) => {
		setSize(value)
		const newPerPage = Math.ceil(airdrops.length / value)
		if (current > newPerPage) {
			setCurrent(newPerPage)
		}
	}

	const getData = (current, pageSize) => {
		// Normally you should get the data from the server

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

	const init = () => {
		getMyAirdrops(token).then((data) => {
			data.airdrops.map((airdrop) => {
				setId(airdrop._id)
			})
		})
	}

	useEffect(() => {
		init()
	}, [])

	const deleteAirdrop = () => {
		deleteMyAirdrop(id, token).then((data) => {
			setLoading(false)
			alert(data.message)
		})
	}

	return (
		<AirdropContainer>
			{user && !user.verified ? <Redirect to="/verify-email" /> : null}
			{user &&
			<>
			<AirdropTop />
			<AirdropBody>
				{loading ? (
					<>
						<h4>Loading your airdrops...Please wait</h4>
						<Loader />
					</>
				) : (
					<>
						<h2>My Airdrops</h2>
						{airdrops.length ? (
							<>
								<Airdrops>
									{getData(current, size).map((data, index) => (
										<>
											{data.owner === user.email ? (
												<Card key={index}>
													{console.log(data)}
													<CardMeta>
														<CardDetails>
															<CardImage>
																<img src={data.logo} alt="Card Image" />
															</CardImage>
															<span>
																<h5>{data.name}</h5>
																<p>Category: {data.category}</p>
																<p>TVL: ${numFor.format(data.tvl)}</p>
																<div style={{ display: 'flex', paddingLeft: '2px' }}>
																	<Link to={`/update/airdrop/${data._id}`}>
																		<button>Edit Airdrop</button>
																	</Link>
																	<a href="#" onClick={deleteAirdrop}>
																		<button style={{ background: 'red', color: '#ffffff' }}>Delete Airdrop</button>
																	</a>
																</div>
															</span>
														</CardDetails>
													</CardMeta>
												</Card>
											) : <h4>You do not have any airdrop</h4>}
										</>
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
						) : (
							<h4>You do not have any airdrop</h4>
						)}
					</>
				)}
			</AirdropBody>
			</>
		}
			
		</AirdropContainer>
	)
}

export default MyAirdrops
