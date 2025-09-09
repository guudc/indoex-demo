import React, { useState, useEffect } from 'react'
import Loader from 'src/components/Loader'
import styled from 'styled-components'
import axios from 'axios'
import { changePassword } from '../../functions/auth'
import { Redirect } from 'react-router-dom'
import { isAuthenticated, signout } from '../../helper/auth'
import { getUserDetails, updatePassword } from './../../functions/user'

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

const ChangePassword = ({ history }) => {
	// State to hold user input
	const [userInput, setUserInput] = useState({
		email: '',
		password: '',
		confirmPassword: ''
	})
	// State to hold errors
	const [errors, setErrors] = useState({
		emailError: '',
		passwordError: '',
		confirmPasswordError: ''
	})
	// State to hold success message
	const [success, setSuccess] = useState('')
	const [processing, setProcessing] = useState(false)
	const [error, setError] = useState('')

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
		let emailError = ''

		// Check for empty email
		if (!userInput.email) {
			emailError = 'Email cannot be empty'
		}

		// Set errors accordingly
		if (emailError) {
			setErrors({
				emailError,
				passwordError: '',
				confirmPasswordError: ''
			})
			return false
		}
		return true
	}

	// Function to handle form submission
	const handleSubmit = async event => {
		event.preventDefault()
		const isValid = validate()
		setProcessing(true)
		if (isValid) {
			// Clear state
			setUserInput({
				email: '',
				password: '',
				confirmPassword: ''
			})
			setErrors({
				emailError: '',
				passwordError: '',
				confirmPasswordError: ''
			})
		}

		if (user) {
			setProcessing(true)
			const strongRegexHigherCase = new RegExp('^(?=.*[A-Z])')
			const strongRegexLowerCase = new RegExp('^(?=.*[a-z])')
			const strongRegexNumber = new RegExp('^(?=.*[0-9])')
			const strongRegexSpecialCharacter = /^(.*\W).*$/
			if(!userInput.confirmPassword){
				setErrors({
					emailError: '',
					passwordError: '',
					confirmPasswordError: 'Provide your current password.'
				})
				setSuccess('')
				setProcessing(false)
				return
			}
			if (userInput.password.length < 8) {
				setErrors({
					emailError: '',
					passwordError: 'Password must be atleast 8 characters.',
					confirmPasswordError: ''
				})
				setSuccess('')
				setProcessing(false)
				return
			}
			if (userInput.password.length > 40) {
				setErrors({
					emailError: '',
					passwordError: 'Password must be maximum of 40 characters.',
					confirmPasswordError: ''
				})
				setSuccess('')
				setProcessing(false)
				return
			}

			if (!strongRegexHigherCase.test(userInput.password)) {
				setErrors({
					emailError: '',
					passwordError: 'Password must contain an uppercase.',
					confirmPasswordError: ''
				})
				setSuccess('')
				setProcessing(false)
				return
			}
			if (!strongRegexLowerCase.test(userInput.password)) {
				setErrors({
					emailError: '',
					passwordError: 'Password must contain a lowercase.',
					confirmPasswordError: ''
				})
				setSuccess('')
				setProcessing(false)
				return
			}
			if (!strongRegexNumber.test(userInput.password)) {
				setErrors({
					emailError: '',
					passwordError: 'Password must contain a number.',
					confirmPasswordError: ''
				})
				setSuccess('')
				setProcessing(false)
				return
			}
			if (!strongRegexSpecialCharacter.test(userInput.password)) {
				setErrors({
					emailError: '',
					passwordError: 'Password must contain a special character.',
					confirmPasswordError: ''
				})
				setSuccess('')
				setProcessing(false)
				return
			}
		}

		try {
			const isValid = validate()
			if (isValid) {
				setErrors({
					emailError: '',
					passwordError: '',
					confirmPasswordError: ''
				})

				setUserInput({
					password: '',
					confirmPassword: '',
					email: ''
				})
				setProcessing(false)
			}

			if (user) {
				updatePassword(token, {password: userInput.password, oldPassword: userInput.confirmPassword}).then(data => {
					if (data.status == false) {
						setError(data.message)
						setSuccess('')
						setProcessing(false)
					} else {
						setErrors({
							emailError: '',
							passwordError: '',
							confirmPasswordError: ''
						})
						setError('')
						setProcessing(false)
						setSuccess(data.message)
					}
				})
			} else {
				changePassword({ email: userInput.email }).then(data => {
					if (data.status == false) {
						setError(data.message)
						setSuccess('')
						setProcessing(false)
					} else {
						setErrors({
							emailError: '',
							passwordError: '',
							confirmPasswordError: ''
						})
						setError('')
						setProcessing(false)
						setSuccess(data.message)
					}
				})
			}
		} catch (error) {}
	}

	return (
		<>
			<FormContainer>
				{user && !user.verified ? <Redirect to="/verify-email" /> : null}

				<Form onSubmit={handleSubmit}>
					<FormTitle>{user ? 'Update Password' : 'Change Password'}</FormTitle>
					{user ? (
						<>
						<FormGroup>
								<Label htmlFor="confirmPassword">Current Password</Label>
								<Input
									type="password"
									name="confirmPassword"
									value={userInput.confirmPassword}
									onChange={handleChange}
									error={errors.confirmPasswordError}
								/>
								{errors.confirmPasswordError ? <ErrorMessage>{errors.confirmPasswordError}</ErrorMessage> : null}
							</FormGroup>
							<FormGroup>
								<Label htmlFor="password">Password</Label>
								<Input
									type="password"
									name="password"
									value={userInput.password}
									onChange={handleChange}
									error={errors.passwordError}
								/>
								{errors.passwordError ? <ErrorMessage>{errors.passwordError}</ErrorMessage> : null}
							</FormGroup>
							
						</>
					) : (
						<FormGroup>
							<Label htmlFor="email">Email</Label>
							<Input
								type="email"
								name="email"
								value={userInput.email}
								onChange={handleChange}
								error={errors.emailError}
							/>
							{errors.emailError ? <ErrorMessage>{errors.emailError}</ErrorMessage> : null}
						</FormGroup>
					)}

					<FormGroup>
						{processing ? (
							<SubmitButton disabled type="submit">
								{user ? 'Updating' : 'Submitting'}
								<Loader />
							</SubmitButton>
						) : (
							<SubmitButton type="submit">{user ? 'Update' : 'Submit'}</SubmitButton>
						)}
					</FormGroup>
					{success ? <SuccessMessage>{success}</SuccessMessage> : null}
					{error ? <ErrorMessage>{error}</ErrorMessage> : null}
				</Form>
			</FormContainer>
		</>
	)
}

export default ChangePassword
