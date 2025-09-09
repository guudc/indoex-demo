READ ME

    How to use the Limit order Javascript wrapper
    
    First set the web3 provider by calling this function
    
        setProvider(provider)
    returns a promise
    
    If you are using custom web3 provider like a default RPC url
    then set the wallet address of the user sending the transactions
    
        limitWalletAddress = "<wallet address>"
        
    if you are using an external provider like metamask, 
    then the wallet address would be set automatic
    
    
    First check if the limit order contract has the right
    to spend the tokens on behalf of the user, by calling
        
        isAllowed(tokenAddress, chainId, callback(<bool>))
    
    It returns a bool via the callback, if limit order contract does not have
    allowance, it request for approval automatically
        
    To create a limit order
        
        newLimit(type, chainId, sellTokenAddress, buyTokenAddress, sellAmount(in wei), buyAmount(in wei), thresHold(in wei), callback(<tx hash>, <limit Order>)>
        where type is buy|sell
        
        It returns a transaction hash and limit order object(This can be used to cancel a limit order) via the callback
        
   To cancel a limit order
   
        cancelLimit(limitOrder,chainId, callback(<tx hash>))
        where limitOrder is an object return via the newLimit function
        
        It returns the transaction  hash via the callback
        
   To monitor a transaction via its hash, to know if its successfull or not
   
        monitorTx(txhash, callback(<bool>))
        
        It returns the status of the transaction via the callback
        
  