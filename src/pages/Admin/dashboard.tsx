import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { isAuthenticated } from '../../helper/auth'
import { signout } from 'src/helper/auth'
import { getUserDetails } from 'src/functions/user'

interface Props {
	title: string
	children: React.ReactNode
}

const DashboardContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px;
	@media screen and (max-width: 600px) {
		width: 100%;
	}
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

const Title = styled.h1`
	font-size: 20px;
	margin-bottom: 20px;
	@media screen and (max-width: 600px) {
		width: 100%;
	}
`

const Dashboard: React.FC<Props> = ({ history }: any) => {
	const [user, setUser] = useState(null)
	let { token } = isAuthenticated()
	const init = () => {
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
		init()
	}, [])
	return (
		<>
			{user && !user.verified ? <Redirect to="/verify-email" /> : null}

			{user && user.role !== 'admin' ? (
				<Redirect to="/dashboard" />
			) : (
				<DashboardContainer>
					<Title>Welcome to admin dashboard</Title>
					<Link to="/submit-airdrop" style={{ width: '100%' }}>
						<SubmitButton type="submit">Submit Airdrop</SubmitButton>
					</Link>
					<br />
					<br />
					<Link to="/admin/airdrops" style={{ width: '100%' }}>
						<SubmitButton type="submit">View Airdrops</SubmitButton>
					</Link>
					<br />
					<br />
					<Link to="/admin/users" style={{ width: '100%' }}>
						<SubmitButton type="button">View Users</SubmitButton>
					</Link>
					<br />
					<br />
					<Link to="/change/password" style={{ width: '100%' }}>
						<SubmitButton type="submit">Change Password</SubmitButton>
					</Link>
					<br />
					<br />
					<a
						style={{ cursor: 'pointer', width: '100%' }}
						onClick={() => {
							signout(() => {
								history.push('/')
								setTimeout(() => {
									window.location.reload()
								}, 1000)
							})
						}}
					>
						<SubmitButton type="submit">Logout</SubmitButton>
					</a>
					<br />
				</DashboardContainer>
			)}
		</>
	)
}

export default Dashboard
