import React, { useState } from 'react'
import styled from 'styled-components'
import { authenticate, isAuthenticated } from '../../helper/auth'
import { login } from '../../functions/auth'
import { Link, Redirect } from 'react-router-dom'
import Loader from 'src/components/Loader'

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

const Login = ({ history }) => {
	// State to hold user input
	const [userInput, setUserInput] = useState({
		email: '',
		password: ''
	})
	// State to hold errors
	const [errors, setErrors] = useState({
		emailError: '',
		passwordError: ''
	})
	// State to hold success message
	const [success, setSuccess] = useState('')
	const [processing, setProcessing] = useState(false)
	const [error, setError] = useState('')
	const [token, setToken] = useState('')
	const { user } = isAuthenticated()

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
		let passwordError = ''

		// Check for empty email
		if (!userInput.email) {
			emailError = 'Email cannot be empty'
		}
		// Check for empty password
		if (!userInput.password) {
			passwordError = 'Password cannot be empty'
		}
		// Set errors accordingly
		if (emailError || passwordError) {
			setErrors({
				emailError,
				passwordError
			})
			return false
		}
		return true
	}

	// Function to handle form submission
	const handleSubmit = async (event) => {
		event.preventDefault()
		const isValid = validate()
		setProcessing(true)
		if (isValid) {
			setErrors({
				emailError: '',
				passwordError: ''
			})
		}

		login({ email: userInput.email, password: userInput.password }).then((data) => {
			if (data.status == false) {
				setError(data.message)
				setSuccess('')
				setProcessing(false)
				return
			} else {

				authenticate(data, () => {
					// Clear state
					setUserInput({
						email: '',
						password: ''
					})
					setError('')
					setToken(data.token)
					setProcessing(false)
					user && user.role === 'admin' ? history.push('/admin/dashboard') : history.push('/dashboard')
					setSuccess(data.message)
				})
			}
		})
	}

	return (
		<>
			{user ? <Redirect to="/" /> : null}
			<FormContainer>
				<Form onSubmit={handleSubmit}>
					<FormTitle>Login Now</FormTitle>
					{success ? <SuccessMessage>{success}</SuccessMessage> : null}
					{error ? <ErrorMessage>{error}</ErrorMessage> : null}
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
						{processing ? (
							<SubmitButton disabled type="submit">
								Submitting<Loader/>
							</SubmitButton>
						) : (
							<SubmitButton type="submit">Submit</SubmitButton>
						)}
					</FormGroup>
					<div style={{display: "flex", flexDirection:'column'}}>
						<Link to="/change/password" style={{ color: '#fff' }}>
							Forgot Password?
						</Link>
						<Link to="/register" style={{ color: '#fff' }}>
							Don't have an account? Register
						</Link>
					</div>
					
				</Form>
			</FormContainer>
		</>
	)
}

export default Login
