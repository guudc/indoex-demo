import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import Loader from 'src/components/Loader'
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../../helper/auth'

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
	${(props) =>
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
	color: #ffffff;
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

const ResetPassword = ({ history }) => {
	// State to hold user input
	const [userInput, setUserInput] = useState({
		email: '',
		code: '',
		password: '',
		confirmPassword: ''
	})
	// State to hold errors
	const [errors, setErrors] = useState({
		emailError: '',
		codeError: '',
		passwordError: '',
		confirmPasswordError: ''
	})
	// State to hold success message
	const [success, setSuccess] = useState('')
	const [error, setError] = useState('')
	const [processing, setProcessing] = useState(false)
	const [userData, setUserData] = useState(null);
	const { user } = isAuthenticated()

	// useEffect(() => {
	// 	const fetchUser = async () => {
	// 	  const response = await 
	// 	  axios.get(`${process.env.REACT_APP_BACKEND_API}/me/${user._id}`,
	// 		{
	// 		headers: {
	// 			Authorization: `Bearer ${user.token}`,
	// 		},
	// 		}
	// 		);
	// 	  setUserData(response.data.user);
	// 	};
	// 	fetchUser();
	//   }, []);

	// Function to handle user input
	const handleChange = (event) => {
		const { name, value } = event.target
		setUserInput({
			...userInput,
			[name]: value
		})
	}

	// Function to check for errors
	const validate = () => {
		let emailError = ''
		let codeError = ''
		let passwordError = ''
		let confirmPasswordError = ''

		// Check for empty email
		if (!userInput.email) {
			emailError = 'Email cannot be empty'
		}
		// Check for empty code
		if (!userInput.code) {
			codeError = 'Code cannot be empty'
		}
		// Check for empty password
		if (!userInput.password) {
			passwordError = 'Password cannot be empty'
		}
		// Check for empty confirm password
		if (!userInput.confirmPassword) {
			confirmPasswordError = 'Confirm password cannot be empty'
		}
		// Check if passwords match
		if (userInput.password !== userInput.confirmPassword) {
			confirmPasswordError = 'Passwords must match'
		}
		// Set errors accordingly
		if (emailError || passwordError || confirmPasswordError || codeError) {
			setErrors({
				emailError,
				codeError,
				passwordError,
				confirmPasswordError
			})
			return false
		}

		return true
	}

	const changePassword = async () => {
		try {
			const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API}/changePassword`, {

				email: userInput.email,
				password: userInput.password
			})
			if (data.status == false) {
				setError(data.message)
			} else {
				setSuccess(data.message)
			}
		} catch (error) {
			console.log(error)
			setError(error)
		}
	}

	// Function to handle form submission
	const handleSubmit = async (event) => {
		event.preventDefault()
		setProcessing(true)
		const strongRegexHigherCase = new RegExp('^(?=.*[A-Z])')
		const strongRegexLowerCase = new RegExp('^(?=.*[a-z])')
		const strongRegexNumber = new RegExp('^(?=.*[0-9])')
		const strongRegexSpecialCharacter = /^(.*\W).*$/

		if (userInput.password.length < 8) {
			setError('Password must be atleast 8 characters.')
			setSuccess('')
			setProcessing(false)
		}
		if (userInput.password.length > 40) {
			setError('Password must be maximum of 40 characters.')
			setSuccess('')
			setProcessing(false)
		}

		if (!strongRegexHigherCase.test(userInput.password)) {
			setError('Password must contain an uppercase.')
			setSuccess('')
			setProcessing(false)
		}
		if (!strongRegexLowerCase.test(userInput.password)) {
			setError('Password must contain a lowercase.')
			setSuccess('')
			setProcessing(false)
		}
		if (!strongRegexNumber.test(userInput.password)) {
			setError('Password must contain a number.')
			setSuccess('')
			setProcessing(false)
		}
		if (!strongRegexSpecialCharacter.test(userInput.password)) {
			setError('Password must contain a special character.')
			setSuccess('')
			setProcessing(false)
			return
		}
		try {
			const isValid = validate()
			if (isValid) {
				setErrors({
					emailError: '',
					codeError: '',
					passwordError: '',
					confirmPasswordError: ''
				})
				const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API}/validateResetCode`, {

					code: userInput.code,
					email: userInput.email
				})
				if (data.status == false) {
					setError(data.message)
					setSuccess('')
					setProcessing(false)
					return
				} else {
					// Clear state
					setUserInput({
						email: '',
						password: '',
						code: '',
						confirmPassword: ''
					})
					changePassword()
					setProcessing(false)
					setSuccess(data.message)
				}
			}
			setProcessing(false)
		} catch (error) {
			console.log(error)
			setSuccess('')
			setError('Error resetting your password. Please try again later')
			setProcessing(false)
		}
	}

	return (
		<>
			{user && userData && !userData.verified ? <Redirect to="/verify-email" /> : null}

			<FormContainer>
				<Form onSubmit={handleSubmit}>
					<FormTitle>Reset Password</FormTitle>
					<FormGroup>
						<Label htmlFor="email">Code</Label>
						<Input
							type="text"
							name="code"
							placeholder="Provide your email verifiction code"
							value={userInput.code}
							onChange={handleChange}
							error={errors.codeError}
						/>
						{errors.codeError ? <ErrorMessage>{errors.codeError}</ErrorMessage> : null}
					</FormGroup>
					<FormGroup>
						<Label htmlFor="email">Email</Label>
						<Input
							type="email"
							name="email"
							value={userInput.email}
							placeholder="Enter your email address"
							onChange={handleChange}
							error={errors.emailError}
						/>
						{errors.emailError ? <ErrorMessage>{errors.emailError}</ErrorMessage> : null}
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
					<FormGroup>
						<Label htmlFor="confirmPassword">Confirm Password</Label>
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
						{processing ? (
							<SubmitButton disabled type="submit">
								Submitting
								<Loader />
							</SubmitButton>
						) : (
							<SubmitButton type="submit">Submit</SubmitButton>
						)}{' '}
					</FormGroup>
					{success ? <SuccessMessage>{success}</SuccessMessage> : null}
					{error ? <ErrorMessage>{error}</ErrorMessage> : null}
				</Form>
			</FormContainer>
		</>
	)
}

export default ResetPassword
