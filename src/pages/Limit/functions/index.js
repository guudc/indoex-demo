import Web3 from 'web3'
import { ethers } from 'ethers'
import { LimitOrderBuilder, LimitOrderProtocolFacade, Web3ProviderConnector } from '@1inch/limit-order-protocol'

import config from './config'
import { limitAbi, tokenAbi } from './abi.js'
import { ZERO_ADDRESS } from 'src/constants'

let web3 = null
let limitWalletAddress = ''

function useLimit() {
	async function setProvider(webProvider) {
		if (typeof webProvider === 'string') {
			web3 = new Web3(new Web3.providers.HttpProvider(webProvider))
			return Promise.resolve(true)
		} else {
			try {
				let res = await window.ethereum.request({ method: 'eth_requestAccounts' })
				if (res) {
					web3 = new Web3(webProvider)
					limitWalletAddress = res[0]
					window.ethereum.on('accountsChanged', acct => {
						limitWalletAddress = res[0]
					})
					return true
				} else throw new Error('Accounts changed error')
			} catch (e) {
				return false
			}
		}
	}

	async function isAllowed(_tokenAddress, chainId) {
		try {
			if (limitWalletAddress.trim() !== '' && _tokenAddress.trim() !== '') {
				const tokenz = new web3.eth.Contract(tokenAbi, _tokenAddress)
				tokenz.setProvider(web3)
				let amt = await tokenz.methods.allowance(limitWalletAddress, config.chains[chainId]).call()
				if (amt * 1 <= 0) {
					return Promise.resolve(false)
				}

				return Promise.resolve(true)
			} else throw new Error('Limit address is empty')
		} catch (err) {
			return false
		}
	}

	async function getAllowed(_tokenAddress, chainId, _ether) {
		try {
			if (limitWalletAddress.trim() !== '' && _tokenAddress.trim() !== '') {
				const signer = _ether.getSigner()
				const token = new ethers.Contract(_tokenAddress, tokenAbi, signer)
				let res = await token.approve(config.chains[chainId], Web3.utils.toWei('9000000000000000000'))
				if (res.hash) {
					res = await res.wait()
					if (res.status) return true
					else throw new Error('Could not approve account')
				} else throw new Error('Could not approve account')
			} else throw new Error('Limit address is empty')
		} catch (err) {
			console.log(err)
			return false
		}
	}

	async function fillLimit(order, chainId, _ether) {
		try {
			const contractAddress = config.chains[chainId]
			const signer = _ether.getSigner()
			const limit = new ethers.Contract(contractAddress, limitAbi, signer)

			const res = await limit.fillOrderWith(
				order.makerAsset,
				order.takerAsset,
				order.makingAmount,
				order.takingAmount,
				order.maker,
				order.salt + order.maker
			)
			return res
		} catch (error) {
			console.log('Error filling limit: ', error)
		}
	}

	async function newLimit(_type, chainId, [sellToken, sellDec], [buyToken, buyDec], sellAmt, buyAmt) {
		//to build a new limit order
        const salt = Math.floor(Math.random() * Math.random() * 1000000000009) + ""
		 
        //Sign limit order
        const dataToHash = web3.eth.abi.encodeParameters(
            ['string', 'address'],[salt, limitWalletAddress]
        );
    
        //const hashedMessage = web3.utils.soliditySha3(dataToHash);
        const hashedMessage = Web3.utils.sha3(dataToHash);
        
        try{
            const signt = await window.ethereum.request({
                method: 'personal_sign',
                params: [hashedMessage, limitWalletAddress],
            })

            const limitOrder = {
                makerAssetAddress: sellToken,
                takerAssetAddress: buyToken,
                makerAddress: limitWalletAddress,
                makerAmount: ethers.utils.parseUnits(sellAmt + '', sellDec * 1) + '',
                takerAmount: ethers.utils.parseUnits(buyAmt + '', buyDec * 1) + '',
                salt:salt,
                signature: signt
            }
            
            return [false, limitOrder, signt]
        }
        catch(e) {
            console.log(e)
            return [true, null, "User cancelled the signing process"]
        }
		
	}

	function cancelLimit(_limitOrder, chainId, func) {
		const order = {
			salt: _limitOrder.salt,
			makerAsset: _limitOrder.makerAsset,
			takerAsset: _limitOrder.takerAsset,
			maker: _limitOrder.maker,
			receiver: _limitOrder.receiver,
			allowedSender: _limitOrder.allowedSender,
			makingAmount: _limitOrder.makingAmount,
			takingAmount: _limitOrder.takingAmount,
			offsets: '',
			interaction: _limitOrder.interaction,
			interactions: _limitOrder.interaction
		}

		const contractAddress = config.chains[chainId]
		const connector = new Web3ProviderConnector(web3)
		const limitOrderProtocolFacade = new LimitOrderProtocolFacade(contractAddress, connector)
		const callData = limitOrderProtocolFacade.cancelLimitOrder(_limitOrder)

		const transactionParameters = {
			to: contractAddress,
			from: limitWalletAddress,
			data: callData,
			chainId: chainId
		}

		const txHash = window.ethereum.request({
			method: 'eth_sendTransaction',
			params: [transactionParameters]
		})
		txHash
			.then(tx => {
				func(tx)
			})
			.catch(err => {
				func(false)
			})
	}

	async function monitorTx(_tx) {
		try {
			let err = await web3.eth.getTransactionReceipt(_tx)
			if (err) throw err
			else {
				setTimeout(async () => {
					let s = await monitorTx(_tx)
				}, 1000)
			}
		} catch (err) {
			return false
		}
	}

	return {
		monitorTx,
		limitWalletAddress,
		cancelLimit,
		newLimit,
		fillLimit,
		setProvider,
		getAllowed,
		isAllowed
	}
}

export default useLimit