import React, {useEffect, useState} from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { isAuthenticated } from '../../helper/auth'
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


const RegisterSuccess = () => {
	const { user } = isAuthenticated()

	return (
		<>
			{!user ? <Redirect to="/login" /> : null}

			<FormContainer>
				<Form>
					<FormTitle>Registration Successful, Check your email to activate your account</FormTitle>
				</Form>
			</FormContainer>
		</>
	)
}

export default RegisterSuccess
