import React, { Provider } from 'react'
import { useActiveWeb3React } from '../../hooks'
import noresult from './wrong.png'
import './Proposal.css'
import config from './config'
import abi from './abi'
import { ethers } from 'ethers'
import Web3 from 'web3'
import { ChainId } from 'dxswap-sdk'
import { useWalletModalToggle } from '../../state/application/hooks'
import { getAccountKey, hideWeb3StatusWith } from 'src/components/utility'
import { ModalInfo, setInfo } from 'src/components/infomodal'
let _ether: any
const VOTING_BACKEND_PATH = `${process.env.REACT_APP_BACKEND_API}/`
let PROPOSAL_ID = ''
let END_DATE = 0

//to display off chain data
const displayData = (_data: any) => {
	const _timer = setInterval(() => {
		const _proposal = document.getElementById('_proposal') as HTMLElement | null
		if (_proposal != null) {
			clearInterval(_timer)
			_proposal.innerHTML = _data.proposal.wallet
			const _start = document.getElementById('_start') as HTMLElement | null
			const _end = document.getElementById('_end') as HTMLElement | null
			if (_start != null && _end != null) {
				_start.innerHTML = new Date(_data.proposal.created).toLocaleDateString('en-us', {
					weekday: 'long',
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})
				_end.innerHTML = new Date(_data.proposal.end).toLocaleDateString('en-us', {
					weekday: 'long',
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})
				//show its parent display
				const _short_detail = document.getElementById('_short_detail') as HTMLElement | null
				if (_short_detail != null) {
					_short_detail.style.display = 'block'
				}
			}

			//time to display the proposal contents
			const _action = document.getElementById('_action') as HTMLElement | null
			if (_action != null) {
				_action.innerHTML = _data.proposal.action + ' Feature'
				const _title = document.getElementById('_title') as HTMLElement | null
				if (_title != null) {
					_title.innerHTML = _data.proposal.title
					const _body = document.getElementById('_body') as HTMLElement | null
					if (_body != null) {
						_body.innerHTML = _data.proposal.summary.replace(/\n/g, '<br>')
						const _long_detail = document.getElementById('_long_detail') as HTMLElement | null
						if (_long_detail != null) {
							_long_detail.style.display = 'block'
						}
					}
				}
			}
		}
	}, 1000)
}
//to display on chain data
const displayProposalData = (_proposalVotes: any, _voterData: any, _offChainData: any, _account: any) => {
	const _timer = setInterval(() => { console.log(_proposalVotes)
		const _voting_results = document.getElementById('_voting_results') as HTMLElement | null
		const _voting_result = document.getElementById('_voting_result') as HTMLElement | null
		if (_voting_results != null && _voting_result != null) {
			clearInterval(_timer)
			_voting_result.style.display = 'block' //show voting results
			if (_offChainData.proposal.status == 'active') {
				_voting_results.style.display = 'none'
			} else if (_offChainData.proposal.status == 'settled') {
				_voting_results.style.display = ''
				_voting_results.innerHTML = 'Completed'
				_voting_results.style.backgroundColor = 'limegreen'
			} else if (_offChainData.proposal.status == 'cancelled') {
				_voting_results.style.display = ''
				_voting_results.innerHTML = 'Rejected'
				_voting_results.style.backgroundColor = 'red'
			} else if (_offChainData.proposal.status == 'undecided') {
				_voting_results.style.display = ''
				_voting_results.innerHTML = 'Undecided'
				_voting_results.style.backgroundColor = 'grey'
			}

			const _yes_vote = document.getElementById('_yes_vote') as HTMLElement | null
			const _yes_vote_bar = document.getElementById('_yes_vote_bar') as HTMLElement | null
			if (_yes_vote != null && _yes_vote_bar != null) {
				let _yes_percent = (100 / (_proposalVotes[0] * 1 + _proposalVotes[1] * 1)) * _proposalVotes[0]
				if (isNaN(_yes_percent)) {
					_yes_percent = 0
				}
				_yes_vote.innerHTML = _proposalVotes[0] + ' (' + _yes_percent + '%)'
				_yes_vote_bar.style.width = _yes_percent + '%'
			}
			const _no_vote = document.getElementById('_no_vote') as HTMLElement | null
			const _no_vote_bar = document.getElementById('_no_vote_bar') as HTMLElement | null
			if (_no_vote != null && _no_vote_bar != null) {
				let _no_percent = (100 / (_proposalVotes[0] * 1 + _proposalVotes[1] * 1)) * _proposalVotes[1]
				if (isNaN(_no_percent)) {
					_no_percent = 0
				}
				_no_vote.innerHTML = _proposalVotes[1] + ' (' + _no_percent + '%)'
				_no_vote_bar.style.width = _no_percent + '%'
			}

			const _yes_vote_button = document.getElementById('_yes_vote_button') as HTMLButtonElement | null
			const _no_vote_button = document.getElementById('_no_vote_button') as HTMLButtonElement | null
			const hasVoted = document.getElementById('hasVoted') as HTMLElement | null
			if (_yes_vote_button != null && _no_vote_button != null) {
				if (_voterData == true) {
					//has voted already
					_yes_vote_button.style.display = 'none'
					_no_vote_button.style.display = 'none'
					hasVoted.style.display = 'flex'
				}
				else {
					_yes_vote_button.style.display = ''
					_no_vote_button.style.display = ''	
					hasVoted.style.display = 'none'
				}
				if (_offChainData.proposal.status == 'active') {
					//Voting is ongoing, show parent view
					const voting_area = document.getElementById('voting_area') as HTMLElement | null
					if (voting_area != null) {
						voting_area.style.display = 'block'
					}
				}
				//check if its the proposal viewing this
				//if (!(_offChainData.proposal.wallet == _account && _proposalVotes[0] + _proposalVotes[1] == 0)) { //This shows delete button only if nobody has voted on
				if (!(_offChainData.proposal.wallet == _account)) { //This shows delete button whether voted or not voted
					//hide remove button
					const submit_proposal_btn = document.getElementById('submit-proposal-btn') as HTMLButtonElement | null
					const _proposal_info = document.getElementById('_proposal_info') as HTMLElement | null
					if (submit_proposal_btn != null && _proposal_info != null) {
						submit_proposal_btn.style.display = 'none'
						_proposal_info.style.display = 'none'
					}
				} else {
					const submit_proposal_btn = document.getElementById('submit-proposal-btn') as HTMLButtonElement | null
					const _proposal_info = document.getElementById('_proposal_info') as HTMLElement | null
					if (submit_proposal_btn != null && _proposal_info != null) {
						submit_proposal_btn.style.display = ''
						_proposal_info.style.display = ''
					}
				}
			}
		}
	}, 1000)
}
async function getProposalData(_id: any) {
	return fetch(VOTING_BACKEND_PATH + 'getproposal', {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: _id
		})
	}).then((response) =>
		response.json().then((data) => {
			return data
		})
	)
}
//to return proposal data from chain
async function getProposalChainData(_id: any, chainId: number) {
	let _voteAddress: string = (config.chains[chainId] as unknown) as string | ''
	const votez = new ethers.Contract(_voteAddress, abi.vote, _ether)
	return votez.getProposal(_id, END_DATE).then((_res: any) => {
		return _res
	})
}
//to return proposal data from chain
async function getVoterChainData(_id: any, _address: any, chainId: number) {
	let _voteAddress: string = (config.chains[chainId] as unknown) as string | ''
	const votez = new ethers.Contract(_voteAddress, abi.vote, _ether)
	return votez.getVoterProposal(_id, _address, END_DATE).then((_res: any) => {
		return _res
	})
}
function gup(name: string, url: string) {
	if (!url) url = window.location.href
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
	var regexS = '[\\?&]' + name + '=([^&#]*)'
	var regex = new RegExp(regexS)
	var results = regex.exec(url)
	return results == null ? null : results[1]
}

async function rProposal(id: any, key: any) {
	const data = {
		id: id,
		key: key
	}
	return fetch(VOTING_BACKEND_PATH + 'forceremoveproposal', {
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
const voteYes = () => {
	const _yes_vote_button = document.getElementById('_yes_vote_button') as HTMLButtonElement | null
	const _no_vote_button = document.getElementById('_no_vote_button') as HTMLButtonElement | null
	const _msg = document.getElementById('proposal-msg-area') as HTMLElement | null
	if (_yes_vote_button != null && _no_vote_button != null && _msg != null) {
		_yes_vote_button.innerHTML = 'Voting..'
		_yes_vote_button.disabled = true
		_no_vote_button.disabled = true
		_msg.style.display = 'none'
		voteOnProposal(1, 137)
			.then((tx: any) => {
				if (tx.hash) {
					tx.wait()
						.then((res: any) => {
							_yes_vote_button.disabled = false
							_no_vote_button.disabled = false
							if (res.status == 1) {
								//successfull
								_reset('Voted successfully')
								_msg.className = 'proposal-msg-area proposal-msg-area-success'
								window.location.reload()
							} else {
								_reset('Transaction failed')
								_msg.className = 'proposal-msg-area proposal-msg-area-fail'
							}
						})
						.catch((err: any) => {
							err.data = err.data || { message: 'Transaction failed<br>Try again later' }
							_reset(err.data.message || err.message || 'Transaction failed')
							_msg.className = 'proposal-msg-area proposal-msg-area-fail'
						})
				}
			})
			.catch((err: any) => {
				err.data = err.data || { message: 'Transaction failed<br>Try again later' }
				_reset(err.data.message || err.message || 'Transaction failed')
				_msg.className = 'proposal-msg-area proposal-msg-area-fail'
			})
	}

	function _reset(msg: any) {
		if (_yes_vote_button != null && _no_vote_button != null && _msg != null) {
			_yes_vote_button.disabled = false
			_no_vote_button.disabled = false
			_yes_vote_button.innerHTML = 'Yes'
			_msg.style.display = 'flex'
			_msg.innerHTML = msg
		}
	}
}
const voteNo = () => {
	const _yes_vote_button = document.getElementById('_yes_vote_button') as HTMLButtonElement | null
	const _no_vote_button = document.getElementById('_no_vote_button') as HTMLButtonElement | null
	const _msg = document.getElementById('proposal-msg-area') as HTMLElement | null
	if (_yes_vote_button != null && _no_vote_button != null && _msg != null) {
		_no_vote_button.innerHTML = 'Voting..'
		_no_vote_button.disabled = true
		_yes_vote_button.disabled = true
		_msg.style.display = 'none'
		voteOnProposal(0, 137)
			.then((tx: any) => {
				if (tx.hash) {
					tx.wait()
						.then((res: any) => {
							_yes_vote_button.disabled = false
							_no_vote_button.disabled = false
							if (res.status == 1) {
								//successfull
								_reset('Voted successfully')
								_msg.className = 'proposal-msg-area proposal-msg-area-success'
								window.location.reload()
							} else {
								_reset('Transaction failed')
								_msg.className = 'proposal-msg-area proposal-msg-area-fail'
							}
						})
						.catch((err: any) => {
							err.data = err.data || { message: 'Transaction failed<br>Try again later' }
							_reset(err.data.message || err.message || 'Transaction failed')
							_msg.className = 'proposal-msg-area proposal-msg-area-fail'
						})
				}
			})
			.catch((err: any) => {
				err.data = err.data || { message: 'Transaction failed<br>Try again later' }
				_reset(err.data.message || err.message || 'Transaction failed')
				_msg.className = 'proposal-msg-area proposal-msg-area-fail'
			})
	}

	function _reset(msg: any) {
		if (_yes_vote_button != null && _no_vote_button != null && _msg != null) {
			_yes_vote_button.disabled = false
			_no_vote_button.disabled = false
			_no_vote_button.innerHTML = 'No'
			_msg.style.display = 'flex'
			_msg.innerHTML = msg
		}
	}
}
const voteOnProposal = (_choice: any, chainId: any) => {
	let _voteAddress: string = (config.chains[chainId] as unknown) as string | ''
	const signer = _ether.getSigner()
	const votez = new ethers.Contract(_voteAddress, abi.vote, signer)
	console.log(END_DATE)
	return votez.vote(PROPOSAL_ID, _choice, END_DATE)
}
hideWeb3StatusWith('prposal')
const Vote: React.FC<{}> = (): React.ReactElement => {
	//set all necessary functions
	const { account, chainId, library } = useActiveWeb3React()
	const toggleWalletModal = useWalletModalToggle()
	//setting the web3 provider
	_ether = library
	const init = () => {
		const _id = gup('id', window.location.href)
		//console.log(_id)
		if (_id != '' && _id != null) {
			//get the proposal data from server
			PROPOSAL_ID = _id
			getProposalData(_id)
				.then((_res) => {
					if (_res.status === true) {
						console.log(_res)
						displayData(_res)
						END_DATE = (new Date(_res.proposal.end).getTime() * 1) / 1000
						if (isNaN(END_DATE)) {
							END_DATE = 0
						}
						otherInit(_res)
						//monitor network and chain change
						const voting_warning = document.getElementById('voting_warning') as HTMLElement | null
						const _proposal = document.getElementById('_proposals') as HTMLElement | null
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
					} else {
						alert('Proposal does not exist')
						window.location.href = '#/vote'
					}
				})
				.catch((err) => {
					//try again
					setTimeout(function () {
						init()
					}, 1000)
				})
		}
	}
	const otherInit = (_res: any) => {
		//get proposal data on chain
		if (chainId == 137) {
			getProposalChainData(_res.id, chainId as ChainId | 0)
				.then((res) => {
					// get voters proposal data
					getVoterChainData(_res.id, account, chainId as ChainId | 0)
						.then((_voters) => {
							//can display data
							displayProposalData(res, _voters, _res, account)
						})
						.catch((err) => {
							otherInit(_res)
						}) //retry again
				})
				.catch((err) => {
					otherInit(_res)
				}) //retry again
		}
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
	//to remove a proposal
	const removeProposal = async () => {
		const _button = document.getElementById('submit-proposal-btn') as HTMLButtonElement | null
		const _msg = document.getElementById('proposal-msg-area') as HTMLElement | null
		if (_button != null && _msg != null) {
			_button.disabled = true
			_button.innerHTML = 'Removing...'
			_msg.innerHTML = ''
			const key = await getAccountKey(account)
			if(key != null) {
			rProposal(PROPOSAL_ID, key)
				.then((res) => {
					console.log(res)
					_button.disabled = false
					_button.innerHTML = 'Remove Proposal'
					_msg.style.display = 'flex'
					if (res.status === 'error' || res.status === 'false') {
						_msg.innerHTML = res.msg
						_msg.className = 'proposal-msg-area proposal-msg-area-fail'
					} else if (res.status === true) {
						_msg.innerHTML = 'Removed Successfully'
						_msg.className = 'proposal-msg-area proposal-msg-area-success'
						//redirect to vote page
						window.location.href = '#/vote'
					}
				})
				.catch((err) => {
					_button.disabled = false
					_button.innerHTML = 'Remove Proposal'
					_msg.style.display = 'flex'
					_msg.innerHTML = 'Network error'
					_msg.className = 'proposal-msg-area proposal-msg-area-fail'
				})
			}
			else {
				_button.disabled = false
				_button.innerHTML = 'Remove Proposal'
				setInfo(
					{
						status:'error',
						msg: "Please authorize this transaction",
						duration:3000
					}
				)
			}
		}
	}
	return (
		<div className="create-proposal">
			<div className="bg-image"></div>
			<div className="dxvoting">
				<div id="_proposals" className="votingContainer">
					<div id="_short_detail" className="voting" style={{ display: 'none' }}>
						<div className="voting-content-header">
							<h3 className="dxvoting-title">Proposal</h3>
							<p className="voting-content">
								Only those with IND token can vote on a proposal. You can only vote once on a proposal and votes are
								irreversible.
							</p>
						</div>
						<div className="voting-proposal-box" style={{ paddingTop: '15px' }}>
							<div id="_proposal" className="title_b">
								0x....
							</div>
							<div className="tiny-head">Proposer</div>

							<div id="_start" className="title_b">
								9th Dec. 2022
							</div>
							<div className="tiny-head">Start Date</div>

							<div id="_end" className="title_b">
								9th Dec. 2022
							</div>
							<div className="tiny-head">End Date</div>
						</div>
					</div>

					<div id="_voting_result" className="voting" style={{ display: 'none' }}>
						<div className="voting-proposal-box top_head" style={{ paddingTop: '5px' }}>
							<div className="voting-proposal">
								<p className="tiny-head">Results</p>
								<div id="_voting_results" style={{ backgroundColor: 'limegreen' }}></div>
							</div>
					</div>

						<div className="result">
							<div>
								<div className="result_stat">
									<span style={{ color: 'limegreen', fontWeight: 'bold' }}>Yes</span>
									<span id="_yes_vote">45 Votes (56%)</span>
								</div>
								<div className="result_bar">
									<div id="_yes_vote_bar" style={{ backgroundColor: 'limegreen' }}></div>
								</div>
							</div>

							<div style={{ marginTop: '30px' }}>
								<div className="result_stat">
									<span style={{ color: 'red', fontWeight: 'bold' }}>No</span>
									<span id="_no_vote">45 Votes (26%)</span>
								</div>
								<div className="result_bar">
									<div id="_no_vote_bar" style={{ backgroundColor: 'red' }}></div>
								</div>
							</div>
						</div>
					</div>

					<div id="_long_detail" className="voting" style={{ display: 'none' }}>
						<div className="voting-proposal-box" style={{ paddingTop: '15px' }}>
							<div className="voting-propo sal">
								<p className="tiny-head">Proposed Action</p>
								<div className="proposal-views" id="_action" style={{ textTransform: 'capitalize' }}>
									Action
								</div>
							</div>

							<div className="proposal-content">
								<p className="tiny-head">Title</p>
								<div className="proposal-views" id="_title">
									Title
								</div>
								<div id="_body" style={{ marginTop: '20px' }} className="proposal-content-placeholder">
									<p> -- Proposal Format -- </p>
								</div>
							</div>
						</div>
					</div>

					<div id="voting_area" className="voting" style={{ display: 'none' }}>
						<div style={{ paddingTop: '20px' }}>
							<div className="proposal-vote-options">
								<button onClick={voteYes} id="_yes_vote_button">
									Yes
								</button>
								<button onClick={voteNo} id="_no_vote_button">
									No
								</button>
								<div id='hasVoted' className='proposal-voted' style={{display: 'none'}}>
									Voted
								</div>
							</div>
						</div>
						<div id="proposal-msg-area" className="proposal-msg-area proposal-msg-area-fail"></div>
						<button onClick={removeProposal} id="submit-proposal-btn" className="submit-proposal-btn">
							Remove
						</button>
						<p id="_proposal_info" className="dont-have-2-point-4M" style={{display:'none'}}>
							{/* You can only remove a proposal that has not been voted on */}
						</p>
					</div>
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
			</div>
			<ModalInfo />
			{init()}
		</div>
	)
}

export default Vote
