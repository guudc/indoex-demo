import React from 'react'
import './Vote.css'
import noresult from '../Proposal/wrong.png'
import '../Proposal/Proposal.css'
import { Running, init } from './running'
import { Settled, settled_init } from './settled'
import { Cancelled, cancelled_init } from './cancelled'
import Web3 from 'web3'
import { useActiveWeb3React } from 'src/hooks'
import { useWalletModalToggle } from 'src/state/application/hooks'
import { hideWeb3StatusWith } from 'src/components/utility'
const VOTING_BACKEND_PATH = `${process.env.REACT_APP_BACKEND_API}/`

const _init = () => {
	//prepare the vote page
	const _timer = setInterval(() => {
		const _proposalViews = document.getElementById('proposal-views')
		if (_proposalViews != null) {
			clearInterval(_timer)
			for (let i = 0; i < _proposalViews.children.length; i++) {
				_proposalViews.children[i].className = ''
			}

			const _proposalDisplay = document.getElementById('vote-proposal-box') as HTMLDivElement | null
			if (_proposalDisplay != null) {
				const _p = _proposalDisplay.children as HTMLCollectionOf<HTMLElement>
				for (let i = 0; i < _p.length; i++) {
					_p[i].style.display = 'none'
				}
			}
			selectView(0)
			loadVotingData()
		}
	}, 1000)
}

const loadVotingData = () => {
	//get voting data
	getVotingData()
		.then((_res) => {
			if (_res.status) {
				//segregate the data
				const _data = _res.data
				let _activeVotes = [] //for active proposals
				let _settleVotes = [] //for settled proposals
				let _cancelVotes = [] //for cancelled proposals
				for (let i = 0; i < _data.length; i++) {
					_data[i].data.id = _data[i].id
					if (_data[i].data.status == 'active') {
						_activeVotes.push(_data[i].data)
					} else if (_data[i].data.status == 'settled' || _data[i].data.status == 'undecided') {
						_settleVotes.push(_data[i].data)
					} else if (_data[i].data.status == 'cancelled') {
						_cancelVotes.push(_data[i].data)
					}
				}
				init(_activeVotes)
				settled_init(_settleVotes)
				cancelled_init(_cancelVotes)
			}
		})
		.catch((err) => {
			//retry after 3 seconds
			setTimeout(() => {
				loadVotingData()
			}, 3000)
		})
}
//to switch views
const selectView = (_viewNo: number) => {
	//reset all views first
	try {
		const _proposalViews = document.getElementById('proposal-views')
		if (_proposalViews != null) {
			for (let i = 0; i < _proposalViews.children.length; i++) {
				_proposalViews.children[i].className = ''
			}
			const _proposalDisplay = document.getElementById('vote-proposal-box') as HTMLDivElement | null
			if (_proposalDisplay != null) {
				const _p = _proposalDisplay.children as HTMLCollectionOf<HTMLElement>
				for (let i = 0; i < _p.length; i++) {
					_p[i].style.display = 'none'
				}
				_p[_viewNo].style.display = 'flex'
			}
			_proposalViews.children[_viewNo].className = 'selected-proposal'
		}
	} catch (e) {}
}
const selectView0 = () => {
	selectView(0)
}
const selectView1 = () => {
	selectView(1)
}
const selectView2 = () => {
	selectView(2)
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

async function getVotingData() {
	return fetch(VOTING_BACKEND_PATH + 'allproposal', {
		method: 'GET', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((response) =>
		response.json().then((data) => {
			return data
		})
	)
}

const goVoting = () => {
	window.location.href = '#/voting'
}
const Vote: React.FC<{}> = (): React.ReactElement => {
	const { account, chainId, library } = useActiveWeb3React()
	const toggleWalletModal = useWalletModalToggle()
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
	//hide web3 status
	hideWeb3StatusWith('vote')
	return (
		<>
			<div className="bg-image"></div>

			<div id='votingParent' className="dxvote">
				<h3 className="dxvote-title">INDOEX Governance</h3>
				<div className="voteContainer">
					<div className="vote">
						<div className="vote-content-header">
							<p className="vote-content">
								IND tokens represent vote shares in Indoex governance. You can vote on each proposal yourself or
								delegate your votes to a third party.
							</p>

							{/* <a href="/#" className="vote-content-read-more">
								Read more about Indoex governance
							</a> */}
						</div>
						<div className="vote-proposal-box">
							<div className="vote-proposal">
								<p className="proposal-title">Proposal</p>
								<button onClick={goVoting} className="create-proposal-btn">
									Create Proposal
								</button>
							</div>
						</div>
					</div>

					<div className="vote">
						<div className="proposal-views" id="proposal-views">
							<p onClick={selectView0} className="selected-proposal">
								Running
							</p>
							<p onClick={selectView1}>Settled</p>
							<p onClick={selectView2}>Cancelled</p>
						</div>
						<div className="vote-proposal-box" id="vote-proposal-box">
							<Running />
							<Settled />
							<Cancelled />
						</div>
					</div>
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
			{_init()}
		</>
	)
}

export default Vote
