exports.token = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name_",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol_",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
exports.stake = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "changeOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_rewardAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_stakingToken",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_liquidity",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_yield",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_yieldType",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_yieldDuration",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_timeDuration",
				"type": "uint256"
			}
		],
		"name": "createPool",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_liquidity",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_lock",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "_duration",
				"type": "uint256"
			}
		],
		"name": "modifyStakePool",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_fee",
				"type": "uint256"
			}
		],
		"name": "setCreationFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_poolId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_amountToStake",
				"type": "uint256"
			}
		],
		"name": "stakePool",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_feeReceiver",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_poolId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "unstake",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_poolId",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "CREATION_FEE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "FEE_RECEIVER",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPool",
		"outputs": [
			{
				"components": [
					{
						"components": [
							{
								"internalType": "address",
								"name": "tokenAddress",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "decimal",
								"type": "uint256"
							},
							{
								"internalType": "string",
								"name": "symbol",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "name",
								"type": "string"
							}
						],
						"internalType": "struct staking.token",
						"name": "rewardTokenInfo",
						"type": "tuple"
					},
					{
						"components": [
							{
								"internalType": "address",
								"name": "tokenAddress",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "decimal",
								"type": "uint256"
							},
							{
								"internalType": "string",
								"name": "symbol",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "name",
								"type": "string"
							}
						],
						"internalType": "struct staking.token",
						"name": "stakeTokenInfo",
						"type": "tuple"
					},
					{
						"internalType": "uint256",
						"name": "yield",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "yieldType",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "yieldDuration",
						"type": "uint256"
					},
					{
						"internalType": "uint256[2]",
						"name": "time",
						"type": "uint256[2]"
					},
					{
						"internalType": "uint256",
						"name": "stakers",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalStaked",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "liquidity",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "locked",
						"type": "bool"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "poolId",
						"type": "uint256"
					}
				],
				"internalType": "struct staking.pool[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			}
		],
		"name": "getPoolWithId",
		"outputs": [
			{
				"components": [
					{
						"components": [
							{
								"internalType": "address",
								"name": "tokenAddress",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "decimal",
								"type": "uint256"
							},
							{
								"internalType": "string",
								"name": "symbol",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "name",
								"type": "string"
							}
						],
						"internalType": "struct staking.token",
						"name": "rewardTokenInfo",
						"type": "tuple"
					},
					{
						"components": [
							{
								"internalType": "address",
								"name": "tokenAddress",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "decimal",
								"type": "uint256"
							},
							{
								"internalType": "string",
								"name": "symbol",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "name",
								"type": "string"
							}
						],
						"internalType": "struct staking.token",
						"name": "stakeTokenInfo",
						"type": "tuple"
					},
					{
						"internalType": "uint256",
						"name": "yield",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "yieldType",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "yieldDuration",
						"type": "uint256"
					},
					{
						"internalType": "uint256[2]",
						"name": "time",
						"type": "uint256[2]"
					},
					{
						"internalType": "uint256",
						"name": "stakers",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalStaked",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "liquidity",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "locked",
						"type": "bool"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "poolId",
						"type": "uint256"
					}
				],
				"internalType": "struct staking.pool",
				"name": "_pool",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getPoolWithIdAndUser",
		"outputs": [
			{
				"components": [
					{
						"components": [
							{
								"components": [
									{
										"internalType": "address",
										"name": "tokenAddress",
										"type": "address"
									},
									{
										"internalType": "uint256",
										"name": "decimal",
										"type": "uint256"
									},
									{
										"internalType": "string",
										"name": "symbol",
										"type": "string"
									},
									{
										"internalType": "string",
										"name": "name",
										"type": "string"
									}
								],
								"internalType": "struct staking.token",
								"name": "rewardTokenInfo",
								"type": "tuple"
							},
							{
								"components": [
									{
										"internalType": "address",
										"name": "tokenAddress",
										"type": "address"
									},
									{
										"internalType": "uint256",
										"name": "decimal",
										"type": "uint256"
									},
									{
										"internalType": "string",
										"name": "symbol",
										"type": "string"
									},
									{
										"internalType": "string",
										"name": "name",
										"type": "string"
									}
								],
								"internalType": "struct staking.token",
								"name": "stakeTokenInfo",
								"type": "tuple"
							},
							{
								"internalType": "uint256",
								"name": "yield",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "yieldType",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "yieldDuration",
								"type": "uint256"
							},
							{
								"internalType": "uint256[2]",
								"name": "time",
								"type": "uint256[2]"
							},
							{
								"internalType": "uint256",
								"name": "stakers",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "totalStaked",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "liquidity",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "locked",
								"type": "bool"
							},
							{
								"internalType": "address",
								"name": "owner",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "poolId",
								"type": "uint256"
							}
						],
						"internalType": "struct staking.pool",
						"name": "_pool",
						"type": "tuple"
					},
					{
						"internalType": "uint256",
						"name": "totalStaked",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "reward",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "ended",
						"type": "bool"
					}
				],
				"internalType": "struct staking.poolUser",
				"name": "_pool",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getPoolWithUser",
		"outputs": [
			{
				"components": [
					{
						"components": [
							{
								"components": [
									{
										"internalType": "address",
										"name": "tokenAddress",
										"type": "address"
									},
									{
										"internalType": "uint256",
										"name": "decimal",
										"type": "uint256"
									},
									{
										"internalType": "string",
										"name": "symbol",
										"type": "string"
									},
									{
										"internalType": "string",
										"name": "name",
										"type": "string"
									}
								],
								"internalType": "struct staking.token",
								"name": "rewardTokenInfo",
								"type": "tuple"
							},
							{
								"components": [
									{
										"internalType": "address",
										"name": "tokenAddress",
										"type": "address"
									},
									{
										"internalType": "uint256",
										"name": "decimal",
										"type": "uint256"
									},
									{
										"internalType": "string",
										"name": "symbol",
										"type": "string"
									},
									{
										"internalType": "string",
										"name": "name",
										"type": "string"
									}
								],
								"internalType": "struct staking.token",
								"name": "stakeTokenInfo",
								"type": "tuple"
							},
							{
								"internalType": "uint256",
								"name": "yield",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "yieldType",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "yieldDuration",
								"type": "uint256"
							},
							{
								"internalType": "uint256[2]",
								"name": "time",
								"type": "uint256[2]"
							},
							{
								"internalType": "uint256",
								"name": "stakers",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "totalStaked",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "liquidity",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "locked",
								"type": "bool"
							},
							{
								"internalType": "address",
								"name": "owner",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "poolId",
								"type": "uint256"
							}
						],
						"internalType": "struct staking.pool",
						"name": "_pool",
						"type": "tuple"
					},
					{
						"internalType": "uint256",
						"name": "totalStaked",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "reward",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "ended",
						"type": "bool"
					}
				],
				"internalType": "struct staking.poolUser[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_staker",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			}
		],
		"name": "getUserStakeDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "stakedAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lastStaked",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "reward",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "timeLastStaked",
						"type": "uint256"
					}
				],
				"internalType": "struct staking.userData",
				"name": "_userData",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]