import React, { useState } from 'react'
import './stake.css'
import { OutlineCard } from '../../components/Card'
import { TYPE } from '../../theme'
import Logo from '../../assets/images/ethereum-logo.png' 
import { useActiveWeb3React } from '../../hooks'
import { E, onRender, native } from '../../components/utility'
import { useAllTokens, useCurrency } from '../../hooks/Tokens'
import { ZERO_ADDRESS } from '../../constants'
import { useDefaultsFromURLSearch } from '../../state/swap/hooks'
let tokens: any; let currency: any; let _chainid: any; let stakeData: any;
let tmpChain: any;

const _init = (_data: any, _filter: any, sort: any) => { 
    //to load the image data
    const stake_my_pool = E('stake_my_pool_results')
    if(stake_my_pool != null) {   
        stake_my_pool.innerHTML = "<div id='stake_pool_empty'></div>";
        stakeData = _data;// storing the stake data, would be used for filtering 
        if(_data.length > 0) {
            sortData(sort, false)
            for(let i=0;i<_data.length;i++) {
                stake_my_pool.innerHTML += stakeView(_data[i])
            }
            //apply filter
            filterData(_filter, "")
        }
        else {
            //empty
            stake_my_pool.innerHTML = empty()
        }
        stake_my_pool.style.display = "flex";
        (E('stake_my_pool_info') as HTMLDivElement).style.display = 'none'
    }
}
const filterData = (_filter: any, search: any) => {
    if(stakeData) {  
        if(stakeData.length > 0) {
            let _div: any; let _bool: boolean = false;
            for(let i=0;i<stakeData.length;i++) {
                _div = E(`stake_my_pool_view_${stakeData[i]._pool.poolId}`) as HTMLDivElement
                if(_div != null)
                    //lets use filter
                    if(_filter.live) { 
                        //check if its live
                        if(!stakeData[i].ended) {
                            //check for staked
                            if(_filter.all && searchData(search, stakeData[i])) {
                                _div.style.display = ""; _bool = true
                            }
                            else if(_filter.staked && stakeData[i].totalStaked > 0 && searchData(search, stakeData[i])){
                                _div.style.display = ""; _bool = true
                            }
                            else {
                                _div.style.display = "none"
                            }
                        }
                        else{ _div.style.display = "none"}
                    }
                    else {
                        if(stakeData[i].ended) {
                            //check for staked
                            if(_filter.all && searchData(search, stakeData[i])) {
                                _div.style.display = ""; _bool = true
                        }
                        else if(_filter.staked && stakeData[i].totalStaked > 0 && searchData(search, stakeData[i])){
                            _div.style.display = ""; _bool = true
                        }
                        else {
                            _div.style.display = "none"
                        }
                        }
                        else{ _div.style.display = "none"}
                    }
            }
            const n = E('stake_pool_empty') as HTMLDivElement
            if(!_bool) {
                //nothing to show
               n.innerHTML = emptyFilter()
            }
            else {
            n.innerHTML = ""
           }
        }
    }
}
const emptyFilter = () => {
    return `<div class='stake_empty' style='margin-top:32px'>
    No staking pools found
        </div>`    
}
const searchData = (_search: any, d: any) => {
      //lets apply search, first search id
      if(d != null) {
        if(_search != ""){
            let _bol: boolean = false; let tmp: any;
            tmp = _search.replace(/[^0-9]/g,"")
            if((d._pool.poolId + "").indexOf(tmp+"") > -1 && tmp != "") {
                            //has passed id search
                            _bol = true
            }
            //do token search
            _bol = _bol || (d._pool.stakeTokenInfo.symbol || native(_chainid)?.symbol).toLowerCase().indexOf(_search) > -1
            _bol = _bol || (d._pool.stakeTokenInfo.name || native(_chainid)?.name).toLowerCase().indexOf(_search) > -1
            _bol = _bol || (d._pool.rewardTokenInfo.symbol || native(_chainid)?.symbol).toLowerCase().indexOf(_search) > -1
            _bol = _bol || (d._pool.rewardTokenInfo.name || native(_chainid)?.name).toLowerCase().indexOf(_search) > -1
            
            
            return _bol;
        }
        else {
            return true
        }
    }   
    else {return false}      
}   
const sortData = (sort: any, _resetView: boolean) => { 
    if(stakeData.length > 0) {  
        if(sort.sortBy == 'create'){
            stakeData.sort(function(a: any, b: any){
                if(sort.sortType == 'down'){return b._pool.time[0] - a._pool.time[0]}
                else {return a._pool.time[0] - b._pool.time[0]}
            });
        }
        else if(sort.sortBy == 'mine'){
            stakeData.sort(function(a: any, b: any){
                if(sort.sortType == 'down'){return b.totalStaked - a.totalStaked}
                else {return a.totalStaked - b.totalStaked}
            });
        }
        else if(sort.sortBy == 'earned'){
            stakeData.sort(function(a: any, b: any){
                if(sort.sortType == 'down'){return b.reward - a.reward}
                else {return a.reward - b.reward}
            });
        }
        else if(sort.sortBy == 'total'){
            stakeData.sort(function(a: any, b: any){
                if(sort.sortType == 'down'){return b._pool.totalStaked - a._pool.totalStaked}
                else {return a._pool.totalStaked - b._pool.totalStaked}
            });
        }
        //to reset view if allowed
        if(_resetView) {  
            let _div:any
            //to reset view
            const stake_my_pool = E('stake_my_pool_results') as HTMLDivElement
            if(stake_my_pool != null) {
                for(let i=0;i<stakeData.length;i++) {
                    _div = E(`stake_my_pool_view_${stakeData[i]._pool.poolId}`) as HTMLDivElement
                    if(_div != null){
                        //place at top if its the first
                        stake_my_pool.appendChild(_div)
                    }
                }
            }
        }
    }
}
//to load the token info for the stake
const loadTokenInfo = (d:any) => {
    //get token images 
    onRender(`stake_my_pool_view_stakeimg_${d._pool.poolId}`, () => {
        const stakeImg = E(`stake_my_pool_view_stakeimg_${d._pool.poolId}`) as HTMLImageElement
        const stakeName = E(`stake_my_pool_view_stakename_${d._pool.poolId}`) 
        const earnImg = E(`stake_my_pool_view_earnimg_${d._pool.poolId}`) as HTMLImageElement
        const earnName = E(`stake_my_pool_view_earnname_${d._pool.poolId}`) 
        if(stakeImg != null && stakeName != null && earnImg != null && earnName != null) { 
            if(d._pool.stakeTokenInfo.tokenAddress in tokens) { 
                //set the stake token image, and name
                stakeImg.src = tokens[d._pool.stakeTokenInfo.tokenAddress].tokenInfo.logoURI
                stakeName.innerHTML = "Stake " + d._pool.stakeTokenInfo.symbol
            }
            else if(d._pool.stakeTokenInfo.tokenAddress == ZERO_ADDRESS) {
                //using default currency
                let _v = native(_chainid)
                if(_v != undefined) {
                     stakeImg.src = _v.logo
                     stakeName.innerHTML = "Stake " + _v.symbol
                }
            }
            else {
                //use default image
                stakeImg.src = Logo
                stakeName.innerHTML = "Stake " + d._pool.stakeTokenInfo.symbol
            }
            if(d._pool.rewardTokenInfo.tokenAddress in tokens) { 
                //set the stake token image
                earnImg.src = tokens[d._pool.rewardTokenInfo.tokenAddress].tokenInfo.logoURI
                earnName.innerHTML = "Earn <b>" + d._pool.rewardTokenInfo.symbol + "</b>"
            }
            else if(d._pool.rewardTokenInfo.tokenAddress == ZERO_ADDRESS) {
                //using default currency
                let _v = native(_chainid)
                if(_v != undefined) {
                    earnImg.src = _v.logo;
                    earnName.innerHTML = "Earn <b>" + _v.symbol + "</b>"
                }
            }
            else {
                //use default image
                earnImg.src = Logo
                earnName.innerHTML = "Earn <b>" + d._pool.rewardTokenInfo.symbol + "</b>"
            }

            const a = E(`stake_my_pool_view_${d._pool.poolId}`) as HTMLDivElement
            a.onclick = () => {
                goToStakePool(d._pool.poolId)
            }
            
        }
    })
}
const stakeView = (d: any) => {
//    const yield = d.yield / 
//    let msg: any = d.yield + "";
//    if(d.yieldType == 1) { if(d.yield * 1 msg += " unit"}
      let msg: any;let ymsg: any; if(d._pool.stakers == 1){msg = (Intl.NumberFormat('en-US', {maximumSignificantDigits: 6}).format(d._pool.stakers)) + " Staker"}else if(d._pool.stakers > 1) {msg = (Intl.NumberFormat('en-US', {maximumSignificantDigits: 6}).format(d._pool.stakers)) + " Stakers"} else {msg = ""}
      let myStake: any =  (Intl.NumberFormat('en-US', {maximumSignificantDigits: 6}).format(d.totalStaked / (Math.pow(10,d._pool.stakeTokenInfo.decimal * 1))))
      let Rewards: any =  (Intl.NumberFormat('en-US', {maximumSignificantDigits: 6}).format(d.reward / (Math.pow(10,d._pool.rewardTokenInfo.decimal * 1))))
      let totalStaked: any =  (Intl.NumberFormat('en-US', {maximumSignificantDigits: 6}).format(d._pool.totalStaked / (Math.pow(10,d._pool.stakeTokenInfo.decimal * 1))))
      let _yield: any =  (Intl.NumberFormat('en-US', {maximumSignificantDigits: 6}).format(d._pool.yield / (Math.pow(10,d._pool.rewardTokenInfo.decimal * 1))))
      if(d._pool.yieldType == 1) {ymsg = _yield + " units per 1" + (d._pool.stakeTokenInfo.symbol || native(_chainid)?.symbol) + " "}else {ymsg = _yield + "% "}
      if(d._pool.yieldDuration == 1) {ymsg += "daily yield"}else if(d._pool.yieldDuration == 2) {ymsg += "weekly yield"}
      else if(d._pool.yieldDuration == 3) {ymsg += "monthly yield"}else if(d._pool.yieldDuration == 4) {ymsg += "yearly yield"}
      loadTokenInfo(d)
   return `<div id='stake_my_pool_view_${d._pool.poolId}' class='topGravity stake_pool' >
    <div class='leftGravity stake_pool_top'>
        <span>Pool${d._pool.poolId}</span>
    </div>
    <div class='leftGravity'>
        <div class='leftGravity stake_div'>
            <div class='leftGravity centre '>
                <img id='stake_my_pool_view_stakeimg_${d._pool.poolId}'  class='stake_icon circle' />
                <img id='stake_my_pool_view_earnimg_${d._pool.poolId}'  class='stake_earn_icon circle' />
            </div>
            <div class='topGravity stake_token_font'>
                <span id='stake_my_pool_view_stakename_${d._pool.poolId}'></span>
                <span id='stake_my_pool_view_earnname_${d._pool.poolId}' style='color:limegreen'></span>
            </div>
        </div>
        <div class='leftGravity stake_token_font stake_div'>
            <div class='topGravity stake_div_div'>
                <span style='fontSize:12px'>Your Stake</span>
                <span class='staked_amount'>${myStake} ${d._pool.stakeTokenInfo.symbol || native(_chainid)?.symbol}</span>
            </div>
        </div>
        <div class='leftGravity stake_token_font stake_div'>
            <div class='topGravity stake_div_div'>
                <span style={{fontSize:'12px'}}>Reward earned</span>
                <span class='staked_amount' style='color:limegreen'>${Rewards} ${d._pool.rewardTokenInfo.symbol || native(_chainid)?.symbol}</span>
            </div>
        </div>
        <div class='leftGravity stake_token_font stake_div'>
            <div class='topGravity stake_div_div'>
                <span style='fontSize:12px'>Total Staked</span>
                <span class='staked_amount'>${totalStaked} ${d._pool.stakeTokenInfo.symbol || native(_chainid)?.symbol}</span>
            </div>
        </div>
        
    </div>
    <div class='leftGravity stake_pool_bottom'>
        <span style='margin-left:auto; margin-right:10px'>${msg}</span>
        <span>${ymsg}</span>
    </div>
    </div>`

}
const goToStakePool = (id: any) => { 
    window.location.href = "#/stakeview?id=" + id
}
const empty = () => {
    return `<div class='stake_empty' style='margin-top:32px'>
    You have not set up a staking pool. To begin your own staking pool, click the "Create Stake Pool" button.
        </div>`    
}

const MyPool: React.FC<{}> = (): React.ReactElement => {
    const { account, chainId } = useActiveWeb3React()
    _chainid = chainId; 
    tokens = useAllTokens();
    
    return (
      <>
      <div id='stake_my_pool' style={{display:'none'}}>
      <div id='stake_my_pool_info'>
        {!account ? (
            <OutlineCard marginTop="60px">
                    <TYPE.body fontSize="14px" lineHeight="17px" textAlign="center">
                      Connect to a wallet to view stake pool.
                    </TYPE.body>
            </OutlineCard>
        ): (
             
            <div className='stake_loading'>
                    <span className='fas fa-spinner fa-spin' style={{marginRight:'15px'}}></span>
                    <span>Fetching your staking pools</span>
            </div>
        )}
        </div>
        <div id='stake_my_pool_results' style={{display:'none'}}></div>
     </div>
      </>
    )
}

export {MyPool, _init, filterData, sortData};