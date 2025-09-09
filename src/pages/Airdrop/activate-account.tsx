import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { activate } from 'src/functions/user'
import { isAuthenticated } from './../../helper/auth'
import { Redirect } from 'react-router-dom'
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

const ActivateAccount = ({ history }) => {
	// State to hold errors
	const [error, setError] = useState('')
	// State to hold success message
	const [success, setSuccess] = useState('')
	const [processing, setProcessing] = useState(false)
	const [userData, setUserData] = useState(null);

	const { token, user } = isAuthenticated()

	// Function to check for errors
	const validate = () => {
		let messageError = ''

		// Set errors accordingly
		if (messageError) {
			setError(messageError)
			return false
		}

		return true
	}


	useEffect(() => {
		const fetchUser = async () => {
		  const response = await 
		  axios.get(`${process.env.REACT_APP_BACKEND_API}/me/${user._id}`,
			{
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
			}
			);
		  setUserData(response.data.user);
		};
		fetchUser();
	  }, []);


	// Function to handle form submission
	const handleSubmit = (event) => {
		event.preventDefault()
		setProcessing(true)
		const isValid = validate()
		if (isValid) {
			// Clear state
			setError('')
		}
		activate(token, {
			token: user.token
		}).then((data) => {
			if (data.status == false) {
				setError(data.message)
				setSuccess('')
				setProcessing(false)

				return
			} else {
				setError('')
				setSuccess(data.message)
				setProcessing(false)
				history.push('/dashboard')
			}
		})
	}

	return (
		<>
			{!user && !userData ? <Redirect to="/login" /> : null}
			{user && userData && userData.verified ? <Redirect to="/verify-email" /> : null}

			<FormContainer>
				<Form onSubmit={handleSubmit}>
					<FormTitle>Activate Account</FormTitle>

					{success ? <SuccessMessage>{success}</SuccessMessage> : null}
					<FormGroup>
						{processing ? (
							<SubmitButton disabled type="submit">
								Processing<Loader/>
							</SubmitButton>
						) : (
							<SubmitButton type="submit">Activate</SubmitButton>
						)}
					</FormGroup>
					{error ? <ErrorMessage>{error}</ErrorMessage> : null}
				</Form>
			</FormContainer>
		</>
	)
}

export default ActivateAccount
