import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { isAuthenticated, signout } from '../../helper/auth'
import { getMyAirdrops, updateMyAirdrop, getUserDetails } from '../../functions/user'

import Loader from 'src/components/Loader'
import { Redirect } from 'react-router-dom'

// Styled-Components
const FormContainer = styled.div`
	width: 100%;
	overflow: visible;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: auto;
`

const Form = styled.form`
	width: calc(100% - 40px);
	max-width: 400px;
	background-color: ${({ theme }) => theme.bg1};
	border: 1px solid ${({ theme }) => theme.bg2};
	border-radius: 8px;
	padding: 1rem;
`

const FormTitle = styled.h2`
	font-size: 1.3rem;
	text-align: center;
	margin-bottom: 1rem;
`

const FormGroup = styled.div`
	margin-bottom: 1.5rem;
`

const Label = styled.label`
	font-size: 1rem;
`

const Input = styled.input<{ error: string }>`
	background: none;
	display: block;
	width: 100%;
	padding: 0.5rem;
	font-size: 1rem;
	border: 1px solid #eaeaea;
	color: #ffffff;
	border-radius: 5px;
	margin-bottom: 0.5rem;
	&:focus {
		outline: none;
		color: #ffffff;
		border-color: #eaeaea;
		border-width: 2px;
	}
	${props =>
		props.error &&
		`
    border-color: #f44336;
  `};
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

const ErrorMessage = styled.p`
	font-size: 1rem;
	color: #f44336;
`

const SuccessMessage = styled.p`
	font-size: 1rem;
	color: #4caf50;
`

const UpdateAirdrop = ({ history }) => {
	const { token } = isAuthenticated()

	// State to hold user input
	const [userInput, setUserInput] = useState({
		name: '',
		user: '',
		change_1d: '',
		change_1m: '',
		change_7d: '',
		logo: '',
		url: '',
		mcaptvl: '',
		symbol: '',
		tvl: '',
		chains: '',
		category: '',
		chainTvls: '',
		extraTvl: ''
	})
	// State to hold errors
	const [errors, setErrors] = useState({
		nameError: '',
		urlError: '',
		logoError: '',
		tvlError: '',
		chainsError: '',
		categoryError: ''
	})
	// State to hold success message
	const [success, setSuccess] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
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

	// Function to handle user input
	const handleChange = event => {
		const { name, value } = event.target
		setUserInput({
			...userInput,
			[name]: value
		})
	}

	// Function to check for errors
	const validate = () => {
		let nameError = ''
		let urlError = ''
		let logoError = ''
		let tvlError = ''
		let chainsError = ''
		let categoryError = ''

		// Check for empty name
		if (!userInput.name) {
			nameError = 'Name cannot be empty'
		}
		// Check for empty tvl
		if (!userInput.tvl) {
			tvlError = 'Total value (tvl) cannot be empty'
		}
		// Check for empty logo url
		if (!userInput.logo) {
			logoError = 'Logo url cannot be empty'
		}
		// Check if chains
		if (!userInput.chains) {
			chainsError = 'Chains cannot be'
		}
		// Check if category
		if (!userInput.category) {
			categoryError = 'Category cannot be'
		}
		// Check if url
		if (!userInput.url) {
			urlError = 'URL cannot be'
		}
		// Set errors accordingly
		if (nameError || logoError || tvlError || chainsError || categoryError || urlError) {
			setErrors({
				nameError: '',
				logoError: '',
				urlError: '',
				tvlError: '',
				chainsError: '',
				categoryError: ''
			})
			return false
		}

		return true
	}

	const init = () => {
		getMyAirdrops(token).then(data => {
			if (data.error) {
				console.log(data.error, data)
			} else {
				console.log(data)
				data.airdrops.map(airdrop => {
					setId(airdrop._id)
					setUserInput({
						name: airdrop.name,
						change_1d: airdrop.change_1d,
						url: airdrop.url,
						change_1m: airdrop.change_1m,
						change_7d: airdrop.change_7d,
						logo: airdrop.logo,
						mcaptvl: airdrop.mcaptvl,
						symbol: airdrop.symbol,
						tvl: airdrop.tvl,
						chains: airdrop.chains,
						category: airdrop.category,
						chainTvls: airdrop.chainTvls,
						extraTvl: airdrop.extraTvl,
						user: airdrop.token
					})
				})
			}
		})
	}

	useEffect(() => {
		init()
	}, [])

	// Function to handle form submission
	const handleSubmit = async event => {
		event.preventDefault()
		setLoading(true)

		try {
			const isValid = validate()
			if (isValid) {
				// Clear state
				setUserInput({
					name: '',
					change_1d: '',
					change_1m: '',
					change_7d: '',
					url: '',
					logo: '',
					mcaptvl: '',
					symbol: '',
					tvl: '',
					chains: '',
					category: '',
					chainTvls: '',
					extraTvl: '',
					user: ''
				})
				setErrors({
					nameError: '',
					urlError: '',
					logoError: '',
					tvlError: '',
					chainsError: '',
					categoryError: ''
				})

				updateMyAirdrop(id, token, {
					name: userInput.name,
					change_1d: userInput.change_1d,
					change_1m: userInput.change_1m,
					change_7d: userInput.change_7d,
					logo: userInput.logo,
					url: userInput.url,
					mcaptvl: userInput.mcaptvl,
					symbol: userInput.symbol,
					tvl: userInput.tvl,
					chains: userInput.chains,
					category: userInput.category,
					chainTvls: userInput.chainTvls,
					extraTvl: userInput.extraTvl,
					user: token
				}).then(data => {
					if (data.success != true) {
						setError(data.message)
						setSuccess('')
						setLoading(false)
						return
					} else {
						setLoading(false)
						setSuccess(data.message)
						setError('')
					}
				})
			}
		} catch (error) {
			console.log(error)
			setError('Error updating your airdrop. Please try again later')
			setSuccess('')
			setLoading(false)
		}
	}

	const myAirdrop = e => {
		e.preventDefault()
		history.push('/my-airdrops')
	}

	return (
		<>
			{user && !user.verified ? <Redirect to="/verify-email" /> : null}

			<h5>Edit, {userInput.name}</h5>
			<FormGroup>
				<SubmitButton type="submit" onClick={myAirdrop}>
					View your Airdrops
				</SubmitButton>
			</FormGroup>
			<FormContainer>
				<Form onSubmit={handleSubmit}>
					<FormTitle>Submit Airdrop Details</FormTitle>
					{success ? <SuccessMessage>{success}</SuccessMessage> : null}
					{error ? <ErrorMessage>{error}</ErrorMessage> : null}

					<FormGroup>
						<Label htmlFor="name">Name</Label>
						<Input type="text" name="name" value={userInput.name} onChange={handleChange} error={errors.nameError} />
						{errors.nameError ? <ErrorMessage>{errors.nameError}</ErrorMessage> : null}
					</FormGroup>
					<FormGroup>
						<Label htmlFor="name">URL</Label>
						<Input type="text" name="url" value={userInput.url} onChange={handleChange} error={errors.urlError} />
						{errors.urlError ? <ErrorMessage>{errors.urlError}</ErrorMessage> : null}
					</FormGroup>
					<FormGroup>
						<Label htmlFor="tvl">Total Value(tvl)</Label>
						<Input type="number" name="tvl" value={userInput.tvl} onChange={handleChange} error={errors.tvlError} />
						{errors.tvlError ? <ErrorMessage>{errors.tvlError}</ErrorMessage> : null}
					</FormGroup>
					<FormGroup>
						<Label htmlFor="logo">Logo URL</Label>
						<Input type="text" name="logo" value={userInput.logo} onChange={handleChange} error={errors.logoError} />
						{errors.logoError ? <ErrorMessage>{errors.logoError}</ErrorMessage> : null}
					</FormGroup>
					<FormGroup>
						<Label htmlFor="chains">Chains</Label>
						<Input
							type="text"
							name="chains"
							value={userInput.chains}
							onChange={handleChange}
							error={errors.chainsError}
						/>
						{errors.chainsError ? <ErrorMessage>{errors.chainsError}</ErrorMessage> : null}
					</FormGroup>
					<FormGroup>
						<Label htmlFor="category">Category</Label>
						<Input
							type="text"
							name="category"
							value={userInput.category}
							onChange={handleChange}
							error={errors.categoryError}
						/>
						{errors.categoryError ? <ErrorMessage>{errors.categoryError}</ErrorMessage> : null}
					</FormGroup>
					<FormGroup>
						<Label htmlFor="change_1d">Change in 1 day</Label>
						<Input
							type="number"
							name="change_1d"
							value={userInput.change_1d}
							onChange={handleChange}
							error=""
							placeholder="Optional"
						/>
					</FormGroup>
					<FormGroup>
						<Label htmlFor="change_1d">Change in 7 days</Label>
						<Input
							type="number"
							name="change_7d"
							value={userInput.change_7d}
							onChange={handleChange}
							error=""
							placeholder="Optional"
						/>
					</FormGroup>
					<FormGroup>
						<Label htmlFor="change_1d">Change in 1 month</Label>
						<Input
							type="number"
							name="change_1m"
							value={userInput.change_1m}
							onChange={handleChange}
							error=""
							placeholder="Optional"
						/>
					</FormGroup>
					<FormGroup>
						<Label htmlFor="symbol">Symbol</Label>
						<Input
							type="text"
							name="symbol"
							value={userInput.symbol}
							onChange={handleChange}
							error=""
							placeholder="Optional"
						/>
					</FormGroup>
					<FormGroup>
						<Label htmlFor="mcaptvl">Market Cap Total Value(mcaptvl)</Label>
						<Input
							type="number"
							name="mcaptvl"
							value={userInput.mcaptvl}
							onChange={handleChange}
							error=""
							placeholder="Optional"
						/>
					</FormGroup>

					<FormGroup>
						{loading ? (
							<SubmitButton disabled type="submit">
								Updating
								<Loader />
							</SubmitButton>
						) : (
							<SubmitButton type="submit">Update</SubmitButton>
						)}
					</FormGroup>
				</Form>
			</FormContainer>
		</>
	)
}

export default UpdateAirdrop
