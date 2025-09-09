import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import { isAuthenticated } from '../../helper/auth'
import { sendVerification } from './../../functions/user'
import Loader from 'src/components/Loader'

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
const ErrorMessage = styled.p`
	font-size: 1rem;
	color: #f44336;
`

const SuccessMessage = styled.p`
	font-size: 1rem;
	color: #4caf50;
`

const VerifyEmail: React.FC<Props> = ({ history }: any) => {
	const { user, token } = isAuthenticated()
	const [success, setSuccess] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [userData, setUserData] = useState(null);

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

	const sendVerifcation = (e) => {
		e.preventDefault()
		setLoading(true)
		sendVerification(token, { email: userData.email }).then((data) => {
			if (data.error) {
				console.log(data.error)
				setError(data.error)
				setLoading(false)
			} else {
				setLoading(false)
				setSuccess('New verification link has been sent to your email. Please check your email to verify your account')
			}
		})
	}

	return (
		<DashboardContainer>
            <>
                <Title>Welcome, {user && userData && userData.email}. Please activate your account</Title>
                {user && userData && userData.verified == false ? (
                    <>
                        {loading ? (
                            <SubmitButton disabled type="submit" onClick={sendVerifcation}>
                                Processing<Loader/>
                            </SubmitButton>
                        ) : (
                            <SubmitButton type="submit" onClick={sendVerifcation}>
                                Resend Verificatin Email
                            </SubmitButton>
                        )}
                    </>
                ) : <>
                {user && userData && userData.role !== 'user' ? <Redirect to="/admin/dashboard" /> : <Redirect to="/dashboard" /> }
                </>}
                <br />
                {success ? <SuccessMessage>{success}</SuccessMessage> : null}
                {error ? <ErrorMessage>{error}</ErrorMessage> : null}
            </>
		</DashboardContainer>
	)
}

export default VerifyEmail
