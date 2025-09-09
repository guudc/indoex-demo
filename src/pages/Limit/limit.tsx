import React, { Provider, useState } from 'react'
import './limit.css'
import { useActiveWeb3React } from 'src/hooks'
import { E, onRender, toElem } from 'src/components/utility';
import { useAllTokens } from 'src/hooks/Tokens';
import { ethers } from 'ethers';
import {limitAbi, tokenAbi} from './functions/abi';
import _ from 'lodash';
import Web3 from 'web3'
import useLimit from './functions'
import coin from '../../assets/images/coin.png'
import { ModalInfo, setInfo, setModalMsg, setModalStaus, showModalInfo } from '../../components/infomodal'
import config from './functions/config'
const { setProvider, cancelLimit, monitorTx, getAllowed, isAllowed } = useLimit()
	

/* Variables */
let hasInit = false; //Flag to know if the Limit has been loaded
let limits = []; let curTime = 0; //hold the current  server time
let startTime = 0; //holds offset date
let limitHead = 'active' ;//holds the curren state in view
let tokens = null; let _ether: any = null
let hasLoad = false //flag to know if has load current
let _account = null; let _chainid = 0;
let _expiryTmr:any = null

const empty = (msg: any) => {
    return `<div class='limitEmpty'>${msg}</div>`    
}
const drawLimt = async (_limit:any, hasExpired, id: Number, isInactive:boolean = false) => {
    //load token info
    let makerDet = {
        tokenInfo: {
            decimals:18, symbol: "TST"
        }
    }
    let takerDet = {
        tokenInfo: {
            decimals:18, symbol: "TST"
        }
    }
    if(_limit.order.makerAssetAddress in tokens) {
         makerDet = tokens[_limit.order.makerAssetAddress]      
    }
    else {
        //get info from server
        makerDet = await getTokenData(_limit.order.makerAssetAddress)
    }
    if(_limit.order.takerAsset in tokens) {
        takerDet = tokens[_limit.order.takerAssetAddress]
   }
   else {
       //get info from server
       takerDet = await getTokenData(_limit.order.takerAssetAddress)
   }

   const mkAmt = (Intl.NumberFormat('en-US', {maximumSignificantDigits: 8}).format((_limit.order.makerAmount)/(10 ** makerDet?.tokenInfo.decimals)))
   const tkAmt = (Intl.NumberFormat('en-US', {maximumSignificantDigits: 8}).format((_limit.order.takerAmount)/(10 ** takerDet?.tokenInfo.decimals)))
   let eDate = ""
   if(hasExpired) {
        eDate = "expired"
   }
   else {
     eDate = formatDate(new Date(_limit.expires))
   }
   return `<div class='limitBody'>
    <div class='linner' style='margin-left:20px'>
        <span class='ltop'>You ${(_limit.account == _account) ? "Sell" : "Buy"}</span>
        <div>
            <img id="limitBodyMakerImg${id}" />
            <span class='lsell'>${mkAmt} ${makerDet?.tokenInfo.symbol}</span>
        </div>
    </div>

    <div class='linner'>
        <span class='ltop'>You ${(_limit.account == _account)? "Buy" : "Sell"}</span>
        <div>
            <img id="limitBodyTakerImg${id}" />
            <span class='lbuy'>${tkAmt} ${takerDet?.tokenInfo.symbol}</span>
        </div>
    </div>

    <div class='linner'>
        <span class='ltop'>Expires</span>
        <div>
            <span class='lexpire'>${eDate}</span>
        </div>
    </div>

    <div class='linner' style="margin-right:20px;${(hasExpired) ? "display:none" : ""}">
         <button ${(isInactive)? "disabled" : ""} id="limitBodyFillButton${id}" class='lfill' style="${(isInactive)? "background:none;border:0px;color:grey" : ""}; margin-bottom:8px; ${(_limit.account == _account) ? "display:none" : "" }">Fill Order</button>
         <button id="limitBodyCancelButton${id}" onclick="cancelL(${id})" style="${(_limit.account != _account) ? "display:none" : ""}" class='lcancel'>Cancel Order</button>
    </div>
</div>`

}
const getCurrencyImage = (addr: any, id: String) => {
    //to load the currecny image
    if(addr in tokens) {
       (E(id) as HTMLImageElement).src = tokens[addr].tokenInfo.logoURI    
    }
    else {
        (E(id) as HTMLImageElement).src = coin
    }
}
const loadLimits = async (_forceInspect:boolean=false) => {
    if(limits.length > 0) {
        E("limitMain").innerHTML = ""
        //calculate the offset date
        let isExpired = false; let isInActive = false; let nn:any; let np:any;
        for(let i=0;i<limits.length;i++) {
            //checking for invalid dates
            if(!isNaN(limits[i].data.expires * 1) && limits[i].data.expires != null && limits[i].data.expires != undefined && limits[i].data.order != null){
                //check if na expired product
                //console.log(curTime, startTime, (curTime + (Date.now() - startTime)) , limits[i].data.expires)   //check if na expired product
             
                isExpired = (curTime + (Date.now() - startTime)) > limits[i].data.expires
                limits[i].expired = isExpired //set the expired flag
                //if force inspect is activated
                if(_forceInspect) {
                    //get maker balance
                    nn = Web3.utils.toBN(limits[i].data.order.makerAmount);
                    np = await getUserBalance(limits[i].data.order.makerAssetAddress, limits[i].data.order.makerAddress);
                    ////console.log(nn.toString(), np.toString(), nn - np)
                    if((np - nn) < 0) {
                        isInActive = true
                        limits[i].inactive = true
                    }
                    else {limits[i].inactive = false}
                }
                ////console.log(limitHead, isExpired, limits[i].data.account, _account)
                if(limitHead == 'active' && !isExpired && !limits[i].inactive) {  
                    E("limitMain").appendChild(toElem(await drawLimt(limits[i].data, false, i)))
                    //loading the surrency images
                    getCurrencyImage(limits[i].data.order.makerAssetAddress, "limitBodyMakerImg" + i)
                    getCurrencyImage(limits[i].data.order.takerAssetAddress, "limitBodyTakerImg" + i)
                    E("limitBodyCancelButton" + i).onclick = () => {cancelL(i)}
                    E("limitBodyFillButton" + i).onclick = () => {fillL(i)}
                }
                else if(limitHead == 'expired' && isExpired && limits[i].data.account == _account) { 
                    //only show expired limits that belongs to this owner
                    E("limitMain").appendChild(toElem(await drawLimt(limits[i].data, true, i)))
                    //loading the surrency images
                    getCurrencyImage(limits[i].data.order.makerAssetAddress, "limitBodyMakerImg" + i)
                    getCurrencyImage(limits[i].data.order.takerAssetAddress, "limitBodyTakerImg" + i)
                    E("limitBodyCancelButton" + i).onclick = () => {cancelL(i)}
                }else if(limits[i].inactive && limitHead == 'inactive') { //console.log(limits[i].inactive)
                    //only show expired limits that belongs to this owner
                    E("limitMain").appendChild(toElem(await drawLimt(limits[i].data, false, i, true)))
                    //loading the surrency images
                    getCurrencyImage(limits[i].data.order.makerAssetAddress, "limitBodyMakerImg" + i)
                    getCurrencyImage(limits[i].data.order.takerAssetAddress, "limitBodyTakerImg" + i)
                    E("limitBodyCancelButton" + i).onclick = () => {cancelL(i)}
                }
            }
        }
        if(E("limitMain").firstElementChild == null) {
            //empty view
            E("limitMain").innerHTML = empty("Nothing found")
        }
        monitorExpiration()
    }
    else {
        //show the connect wallet msg
        E("limitMain").innerHTML = empty("No active limit found")
    }
}
function formatDate(date) {
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Use 24-hour format
    };
  
    return date.toLocaleString('en-US', options);
}
const monitorExpiration = () => {
    //to monitor expiration
    if(_expiryTmr != null) clearInterval(_expiryTmr) //stop previous timer
    //console.log(0)
    _expiryTmr = setInterval(() => {
        //use 1 min as interval since the lowest expiry is 1 minutes
        for(let i=0;i<limits.length;i++) {
            //checking for invalid dates
            if(!isNaN(limits[i].data.expires * 1) && limits[i].data.expires != null && limits[i].data.expires != undefined && limits[i].data.order != null && !limits[i].expired){
                if((curTime + (Date.now() - startTime)) > limits[i].data.expires) {
                    //someone has expired. 
                    loadLimits()
                    limits[i].expired = true //a flag to know if it has expired
                    //break out of loop to prevent reloading limits
                    break;
                } 
                else {
                    limits[i].expired = false
                }   
            }
        }
    }, 60000)
}
//this function returns a token details using its address
async function getTokenData(addr: any) {
    if(addr != null) {
      const token = new ethers.Contract(addr, tokenAbi, _ether);
      const sym = await token.symbol()
      const decimals = await token.decimals()
      
      return Promise.resolve({
        tokenInfo: {
            symbol:sym,
            decimals:decimals
        }
      })
    }
    else{return Promise.resolve({tokenInfo: {
        symbol:"",
        decimals:"0"
    }})}
} 
//this function returns a user balance of a token
async function getUserBalance(tokenAddr: any, userAddr:any) {
    if(tokenAddr != null) {
      const token = new ethers.Contract(tokenAddr, tokenAbi, _ether);
      const bal = await token.balanceOf(userAddr)
       
      return Promise.resolve(bal)
    }
    else{return Promise.resolve(0)}
} 
//initialize the Limit
const init = (_force: Boolean) => {
    if((_force || !hasInit)) { 
        if(_expiryTmr != null) clearInterval(_expiryTmr) //cancel monitoring expiring
        //do load
        fetch(`${process.env.REACT_APP_BACKEND_API}/getlimit`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chain: _chainid
            })
        })
        .then(async (response) => {
            if(!hasInit || _force) {
                const res = await response.json()
                hasInit = true
                hasLoad = false
                //console.log(res)
                startTime = Date.now()
                if(res.status === true) {
                    //load the view
                    limits = res.data
                    curTime = res.time
                    loadLimits(true)
                }
                else {
                    //load the view
                    limits = []
                    loadLimits(true) 
                }
           }
        })
        .catch((err) => { //console.log(err)
            //reload in two seconds
            setTimeout(() => {
                init(true)
            }, 2000)
        })	
    }
}

function cancelL(id) {
    //get the id
    const order_id = limits[id].id;
    //disable button
    (E("limitBodyCancelButton" + id) as HTMLButtonElement).disabled = true;
    //show loading effect in button
    (E("limitBodyCancelButton" + id) as HTMLButtonElement).innerHTML = "..."
    //do the fetch request
    fetch(`${process.env.REACT_APP_BACKEND_API}/deletelimit`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id:order_id})
    })
        .then(async response => {
            const res = await response.json()
            //console.log(res)
            if (res.status === true) {
                init(true)
            } else {
                setInfo({
                    msg: 'Unable to cancel limit order<br>Something went wrong',
                    status: 'error'
                });
                //enable button
                (E("limitBodyCancelButton" + id) as HTMLButtonElement).disabled = false;
                //remove loading effect in button
                (E("limitBodyCancelButton" + id) as HTMLButtonElement).innerHTML = "Cancel Order"
    
            }
        })
        .catch(err => {
            //console.log(err)
            setInfo({
                msg: 'Unable to cancel limit order<br>Something went wrong',
                status: 'error'
            });
            //enable button
            (E("limitBodyCancelButton" + id) as HTMLButtonElement).disabled = false;
            //remove loading effect in button
            (E("limitBodyCancelButton" + id) as HTMLButtonElement).innerHTML = "Cancel Order"

        })
}

async function fillL(id:any) {
    //get the order
    const order = limits[id].data.order; 
    //check if the maker has enough of the maker assets
    const nn:any = Web3.utils.toBN(order.makerAmount);
    const np:any = await getUserBalance(order.makerAssetAddress, order.makerAddress);
    if((np - nn) < 0) {
        //show that this limit is inactive
        setInfo({
            msg:"This limit has become inactive",
            status:"error"
        })
        init(true)
    }
    else {  
        //check if the taker has enough of the taker assets
        const nn:any = Web3.utils.toBN(order.takerAmount);
        const np:any = await getUserBalance(order.takerAssetAddress, _account);
        if((np - nn) < 0) {
            //show that this limit is inactive
            setInfo({
                msg:"You don't have enough " + (await getTokenData(order.takerAssetAddress)).tokenInfo.symbol + " to fill this order",
                status:"error"
            })
        }
        else{ 
            //check if this limit has been filled via the smart contract
            const web3 = new Web3(window.ethereum as any)
            const dataToHash = web3.eth.abi.encodeParameters(
                ['string', 'address'],[order.salt, order.makerAddress]
            );
            const hashedMessage = Web3.utils.sha3(dataToHash);
            const limitCon = new ethers.Contract(config.chains[_chainid], limitAbi, _ether);
            try {
                const _fill = await limitCon.remaining(hashedMessage)
                //order has already been filled. delete from the server
                setInfo({
                    msg:"Oops this limit has already being filled.",
                    status:'error'
                })
                cancelL(id)
                return;
            }
            catch(e) {
                //has not been filled
                //first check if the taker has given permision to move tokens
                const hasAllowed = await isAllowed(order.takerAssetAddress, _chainid)
                if(!hasAllowed) {
                    try{
                        //get Allowed first
                        showModalInfo(true)
                        setModalMsg("Giving permission to accces " + (await getTokenData(order.takerAssetAddress)).tokenInfo.symbol)
                        setModalStaus("info")
                        
                        const res = await getAllowed(order.takerAssetAddress, _chainid, _ether)
                        if(res) {
                            setInfo({
                                msg:"Granted", status:"good"
                            })
                        }
                        else {
                            setInfo({
                                msg:"Something went wrong",
                                status:'error'
                            })
                        }
                    }
                    catch(e) {
                        setInfo({
                            msg:"Something went wrong",
                            status:'error'
                        })
                    }
                }
                showModalInfo(true)
                setModalMsg("Filling limit")
                setModalStaus("info")
                
                const signer = _ether.getSigner()
                const _limitCon = new ethers.Contract(config.chains[_chainid], limitAbi, signer);
                //do the filling of the order
                let fillRes:any = await _limitCon.fillOrderWith(
                    order.makerAssetAddress,
                    order.takerAssetAddress,
                    order.makerAmount,
                    order.takerAmount,
                    order.makerAddress,
                    order.salt + "",
                    order.signature
                ) 
                 
                if (fillRes.hash) {
					fillRes = await fillRes.wait()
                    if(fillRes.status == 1) {
                        setInfo({
                            msg:"Limit order filled", status:"good"
                        })
                        //remove the limit
                        cancelL(id)
                    }
                }
            }
        }
    }
}
const Limitx: React.FC<{}> = (): React.ReactElement => {

    const { account, chainId, library } = useActiveWeb3React()
    tokens = useAllTokens();
    _ether = library
    if(_ether != null) {
        setProvider(window.ethereum)
    }
    
    onRender("limitMain", () => {
        if(((account != _account) || (chainId != _chainid)) && tokens != null) {
            _account = account
            _chainid = chainId
            init(true)
        }
        else if(account == null){
            //show the connect wallet msg
            E("limitMain").innerHTML = empty("Connect wallet to view limit orders")
        }
    })
    
    const switchActiveExpired = (_type: String) => {
        if(_type == "active") {
            E("limitActive").className = "limitSelected"
            E("limitInActive").className = ""
            E("limitExpired").className = ""
            limitHead = "active"
            //switch to active view
            loadLimits()
        }
        else if(_type == "inactive") {
            E("limitInActive").className = "limitSelected"
            E("limitActive").className = ""
            E("limitExpired").className = ""
            limitHead = "inactive"
            //switch to active view
            loadLimits()
        }
        else {
            E("limitExpired").className = "limitSelected"
            E("limitActive").className = ""
            E("limitInActive").className = ""
            limitHead = "expired"
            //switch to active view
            loadLimits()
        }
    }

    
    return(
        <>
            <div className="innerLimits">
                <div className='limitButton'>
                    <button id="limitActive" onClick={() => switchActiveExpired("active")} className='limitSelected'>Active</button>
                    <button id="limitInActive" onClick={() => switchActiveExpired("inactive")}>InActive</button>
                    <button id="limitExpired" onClick={() => switchActiveExpired("expired")}>Expired</button>
                </div>
                {/* The Limits are here */}
                <div id='limitMain' className='limitMain'>
                     
                    
                   
                </div>
            </div>
            <ModalInfo />
        </>
    )
}

export {Limitx, init};