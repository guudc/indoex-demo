import React from 'react'
import { useActiveWeb3React } from '../../hooks'
import './Voting.css'
import noresult from '../Proposal/wrong.png'
import '../Proposal/Proposal.css'
import Web3 from 'web3'
import ethSymbol from './eth-symbol.jpg'
import { useWalletModalToggle } from 'src/state/application/hooks'
import { getAccountKey, hideWeb3StatusWith } from 'src/components/utility'
import { onRender, E } from '../../components/utility'
import { setInfo, ModalInfo } from 'src/components/infomodal'
 

const VOTING_BACKEND_PATH = `${process.env.REACT_APP_BACKEND_API}/`

async function getUserIndBalance(_account: any) {
	return fetch(VOTING_BACKEND_PATH + 'getallbalance', {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			wallet: _account
		})
	}).then((response) =>
		response.json().then((data) => {
			return data
		})
	)
}
const doButtonAction = async () => {
	if (window.ethereum?.request != undefined) {
		try {
			await window.ethereum?.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: Web3.utils.toHex(137) }]
			})
		} catch (switchError) {
			// This error code indicates that the chain has not been added to MetaMask.
			if ((switchError as any)?.code === 4902) {
				//add the chain
				try {
					await window.ethereum?.request({
						method: 'wallet_addEthereumChain',
						params: [
							{
								chainId: Web3.utils.toHex(137),
								chainName: 'Polygon',
								nativeCurrency: {
									name: 'MATIC',
									symbol: 'MATIC',
									decimals: 18
								},
								blockExplorerUrls: ['https://polygonscan.com'],
								rpcUrls: ['https://poly-mainnet.gateway.pokt.network/v1/lb/61141e8259501900341bb3e2']
							}
						]
					})
				} catch (addError) {
					console.log(addError)
				}
			}
		}
	}
}
const Vote: React.FC<{}> = (): React.ReactElement => {
	//to get account and chainid
	const { account, chainId } = useActiveWeb3React()
	const toggleWalletModal = useWalletModalToggle()
	onRender('voting_warning', ()=>{   
		const voting_warning = document.getElementById('voting_warning') as HTMLElement | null
		const _proposal = document.getElementById('votingParent') as HTMLElement | null
	
		if (voting_warning != null && _proposal != null) {

		if (account == null) {
			voting_warning.style.display = 'block'
			_proposal.style.display = 'none'
		} else if (chainId != 137 && chainId != null) {
			voting_warning.style.display = 'block'
			_proposal.style.display = 'none'
		} else {
			voting_warning.style.display = 'none'
			_proposal.style.display = ''
		}
		}
	})
	//set all necessary functions
	const init = () => {
		const _timer = setInterval(() => {
			const _placeholder = document.getElementById('proposal-content-placeholder') as HTMLElement | null
			if (_placeholder != null) {
				clearInterval(_timer)
				//set the placeholder funtions
				_placeholder.onclick = () => {
					const _p = document.getElementById('proposal-content-area') as HTMLElement | null
					if (_p != null) {
						_p.style.display = 'flex'
						_placeholder.style.display = 'none'
						_p.focus()
					}
				}
				const _contentArea = document.getElementById('proposal-content-area') as HTMLInputElement | null
				if (_contentArea != null) {
					_contentArea.oninput = () => {
						if (_contentArea.value == '') {
							_placeholder.style.display = 'block'
							_contentArea.style.display = 'none'
						}
					}
					_contentArea.onblur = _contentArea.oninput
				}
				const _submitButton = document.getElementById('submit-proposal-btn') as HTMLButtonElement | null
				if (_submitButton != null) {
					_submitButton.disabled = true //default true
					if (account == null) {
						_submitButton.innerHTML = 'Wallet not connected'
					} else {
						//get the ind balance
						getUserIndBalance(account)
							.then((_amt) => {
								if (_amt.status) {  
									if (_amt.balance >= 2000) {
										_submitButton.disabled = false
										_submitButton.innerHTML = 'Create Proposal'
									} else {
										_submitButton.innerHTML = 'BALANCE: ' + Math.floor(_amt.balance) + 'IND'
									}
								} else {
									//server error, try again
									init()
								}
							})
							.catch((err) => {
								//retry
								init()
							})
					}
				}
			}
		}, 1000)
	}
	//to create a new proposal
	const createProposal = async () => {
		//get the action
		const _action = document.getElementById('proposal-views') as HTMLInputElement | null
		if (_action != null) {
			let _actionValue = _action.value
			//get the proposal title
			const _title = document.getElementById('proposal-content-title') as HTMLInputElement | null
			if (_title != null) {
				let _titleValue = _title.value
				//get the body message
				const _body = document.getElementById('proposal-content-area') as HTMLInputElement | null
				if (_body != null) {
					let _bodyValue = _body.value
					//do validation of data
					if (_titleValue.trim().replace(/ /g, '') != '') {
						//validate body, by checking length
						if (_bodyValue.trim().replace(/ /g, '').length > 50) {
							const _button = document.getElementById('submit-proposal-btn') as HTMLButtonElement | null
							const _msg = document.getElementById('proposal-msg-area') as HTMLDivElement | null
							if (_button != null && _msg != null) {
								//disable button to prevent re-clicking
								_button.disabled = true
								_button.innerHTML = 'Creating...'
								_msg.style.display = 'none'
								const key = await getAccountKey(account)
								if(key != null) {
								//get the message signing
								newProposal(_titleValue, _actionValue, _bodyValue, key)
									.then((res) => {
										console.log(res)
										_button.disabled = false
										_button.innerHTML = 'Create Proposal'
										_msg.style.display = 'flex'
										if (res.status === 'error' || res.status === 'false') {
											_msg.innerHTML = res.msg
											_msg.className = 'proposal-msg-area proposal-msg-area-fail'
										} else if (res.status === true) {
											_msg.innerHTML = 'Created Successfully'
											_msg.className = 'proposal-msg-area proposal-msg-area-success'
											//redirect to vote page
											window.location.href = window.location.href.replace('/voting', '/vote')
										}
									})
									.catch((err) => {
										_button.disabled = false
										_button.innerHTML = 'Create Proposal'
										_msg.style.display = 'flex'
										_msg.innerHTML = 'Network error'
										_msg.className = 'proposal-msg-area proposal-msg-area-fail'
									})
								}
								else {
									_button.disabled = false
									_button.innerHTML = 'Create Proposal'
									setInfo(
										{
											status:'error',
											msg: "Please authorize this transaction",
											duration:3000
										}
									)
								}
							}
						} else {
							alert('Proposal body length is too small\nmust be over 50 words')
						}
					} else {
						alert('Title cannot be empty')
					}
				}
			}
		}
	}
	async function newProposal(title: any, action: any, body: any, key: any) {
		const data = {
			title: title,
			body: body,
			action: action,
			wallet: account,
			key: key
		}
		console.log(key)
		return fetch(VOTING_BACKEND_PATH + 'newproposal', {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data) // body data type must match "Content-Type" header
		}).then((response) =>
			response.json().then((data) => {
				return data
			})
		)
	}
	hideWeb3StatusWith('voting')
	
	return (
		<>
		<div id='votingParent' className="create-proposal">
			<div className="bg-image"></div>
			<div className="dxvoting">
				<div className="votingContainer">
					<div className="voting">
						<div className="voting-content-header">
							<h3 className="dxvoting-title">Create Proposal</h3>
							<p className="voting-content">
								Choose an action and describe your community suggestion. The proposal cannot be changed once it has been
								submitted, so please double-check all details before submitting. The voting process will span one month
								and will begin immediately.
							</p>
						</div>
						<div className="voting-proposal-box">
							<div className="voting-proposal">
								<div className="proposal-title">Proposed Action</div>
								<select className="proposal-views" id="proposal-views">
									<option className="transfer-token-proposal" value="add">
										Add Feature
									</option>
									<option className="transfer-token-proposal" value="modify">
										Modify Feature
									</option>
									<option className="transfer-token-proposal" value="remove">
										Remove Feature
									</option>
								</select>
							</div>
							<div className="token-tranfer-box off">
								<form className="token-transfer-form">
									<div className="token-tranfer-to">
										<h3 className="token-tranfer-to-title">To</h3>
										<input type="text" placeholder="Wallet Address or ENS name" className="token-tranfer-to-input" />
									</div>
									<div className="token-tranfer-amount">
										<img src={ethSymbol} alt="Ethereum" className="ethereum" />
										<select className="token-select-tranfer">
											<option className="WETH">WETH</option>
										</select>
										<div className="token-input-divider"></div>
										<input type="text" placeholder="0" className="token-amount-input" />
									</div>
								</form>
							</div>

							<div className="proposal-content">
								<input id="proposal-content-title" className="proposal-content-title" placeholder="Proposal Title" />
								<hr />
								<div id="proposal-content-placeholder" className="proposal-content-placeholder">
									<p> -- Proposal Format -- </p>
									<p> ## Summary</p>
									<p> ## Methodology</p>
									<p> Insert your methodology here</p>
									<p> ## Conclusion</p>
									<p> Insert your conclusion here</p>
								</div>
								<textarea id="proposal-content-area" className="proposal-content-area"></textarea>
								<div id="proposal-msg-area" className="proposal-msg-area proposal-msg-area-fail"></div>
							</div>
							{!account ? (
								<button onClick={toggleWalletModal} className="submit-proposal-btn">
									Connect Wallet
								</button>
							) : (
								<button id="submit-proposal-btn" className="submit-proposal-btn" onClick={createProposal}>
								...
								</button>
							)}
							
							<p className="dont-have-2-point-4M">You must have 2000 IND to submit a proposal</p>
						</div>
					</div>
				</div>
			</div>
			{init()}
		</div>
		<div id="voting_warning" className="votingContainer" style={{ display: 'none' }}>
		<div className="voting">
			<div className="voting-content-header" style={{ background: 'none' }}>
				<h3 className="dxvoting-title">Voting</h3>
				<p className="voting-content" style={{ textAlign: 'center' }}>
					All voting can only be done on the Polygon Network.
				</p>
			</div>
			<div
				style={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column'
				}}
			>
				<img
					src={noresult}
					style={{ maxWidth: '250px', maxHeight: '250px', marginBottom: '30px', marginTop: '20px' }}
				/>
				{!account ? (
					<button onClick={toggleWalletModal} className="voting voting_warning">
						Connect Wallet
					</button>
				) : (
					<button onClick={doButtonAction} className="voting voting_warning">
						Switch network to Polygon
					</button>
				)}
			</div>
		</div>
		</div>
		<ModalInfo />
	</>
	)
}

export default Vote
