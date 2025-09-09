import React, { useEffect, useState } from 'react'
import './stake.css'
import Logo from '../../assets/images/logo_trans.png' 
import { ButtonError, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import styled, { ThemeContext } from 'styled-components'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useActiveWeb3React } from '../../hooks'
import { Save, hasSavedNew, showEditStake } from './modify'
import { onRender, E, G, native, formatNumber, readErrorMessage, toBig } from '../../components/utility'
import {ethers} from "ethers";
import Web3 from 'web3';
import abi from './functions/abi';
import config from './functions/config';
import { useAllTokens } from '../../hooks/Tokens'
import { ZERO_ADDRESS } from '../../constants'
import { hideModalInfo, setModalMsg, setModalStaus, showModalInfo } from '../../components/infomodal'

let _chainid: any; let _wallet: any; let _ether:any
let _balance: any; let _staked: any; let _Option = "stake";let rbalance: any;
let _buttonAct = "";let stakeId: any; let allTokens: any = {};
let viewNo: any = 0; let pool: any; let _withdrawAct: any = "";

const StakeStatsContainer = styled.div`
  width: 100%;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props: any) => props.theme.bg1And2};
  margin-top: 20px;
  border-radius: 8px;
`
const VotingAddresses = styled.div`
  display: flex;
  flex-direction: column;

  & p {
    margin: 0;
    font-size: 0.85rem;
    margin-bottom: 7px;
    color: ${(props: any) => props.theme.purple2}
  }

  & span {
    font-size: 0.9rem;
    font-weight: 600;

    & sub {
      font-size: 0.7rem;
      font-weight: 500;
      color: ${(props: any) => props.theme.green1};
    }
`
//to switch between stake and unstake
const selectView = (_viewNo: number) => {
  //reset all views first
  const _proposalViews = document.getElementById('proposal-views')
    if(_proposalViews != null){
      for(let i=0;i<2;i++) {
        _proposalViews.children[i].className = ""
      }
      _proposalViews.children[_viewNo].className = "selected-proposal"
      const stake_input = document.getElementById('stake_input') as HTMLInputElement | null
      if(stake_input != null) {
        stake_input.value = "0"
      }
      if(_viewNo == 0) { _Option = "stake"} else {_Option = "unstake"}
      viewNo = _viewNo
      showConditionalDisplay()
    }
}
//to get stake info
const getStakeData = () => {
  let _Address: any = config.chains[_chainid] as unknown as JSON | null
  if(_Address != null) {
    let _stakeAddress: any = _Address.stake as any | ""
    const _stake = new ethers.Contract(_stakeAddress, abi.stake, _ether);
    return _stake.getPoolWithIdAndUser(stakeId,_wallet)
    .then((_res: any)=> {  
      return _res
    })
  }
  else {return false}
}
const loadData = () => {    
  let _data = getStakeData()
  if(_data != false){
    _data.then((res: any) => {  
      //checking if its a valid id
      if(res._pool.owner != ZERO_ADDRESS){
         //get the user balance of the stake token
         getUserBalance(res._pool.stakeTokenInfo.tokenAddress)
         .then((bal: any) => {
            //get user balance for reward token
            getUserBalance(res._pool.rewardTokenInfo.tokenAddress)
            .then((rbal: any) => {
              //get is allowed for staking currency
              let a = getAllowed(res._pool.stakeTokenInfo.tokenAddress)
              if(a != false){
                a.then((bol: any) => {  
                  if(!bol) {_buttonAct = "permission"}
                  //to prevent showing when it has been removed from view
                  if(E('stake_coin_name') != null){
                    //load the currency details
                    const stake_coin_name = E('stake_coin_name')
                    const stake_head_stake_name = E('stake_head_stake_name') as HTMLDivElement
                    const stake_coin_img = E('stake_coin_img') as HTMLImageElement
                    const stake_head_stake_img = E('stake_head_stake_img') as HTMLImageElement
                    const stake_head_info = E('stake_head_info') as HTMLDivElement
                    //earn image details
                    const stake_head_earn_name = E('stake_head_earn_name') as HTMLDivElement
                    const stake_head_earn_img = E('stake_head_earn_img') as HTMLImageElement
                    if(stake_coin_name != null){
                      stake_coin_name.innerHTML = res._pool.stakeTokenInfo.symbol || native(_chainid)?.symbol
                      stake_head_stake_name.innerHTML = stake_coin_name.innerHTML
                      stake_head_earn_name.innerHTML = res._pool.rewardTokenInfo.symbol || native(_chainid)?.symbol
                      if(res._pool.stakeTokenInfo.tokenAddress in allTokens){
                        stake_coin_img.src = allTokens[res._pool.stakeTokenInfo.tokenAddress].tokenInfo.logoURI
                      }
                      else {
                        stake_coin_img.src = native(_chainid)?.logo || ""
                      }
                      if(res._pool.rewardTokenInfo.tokenAddress in allTokens){
                        stake_head_earn_img.src = allTokens[res._pool.rewardTokenInfo.tokenAddress].tokenInfo.logoURI
                      }
                      else {
                        stake_head_earn_img.src = native(_chainid)?.logo || ""
                      }
                      stake_head_stake_img.src = stake_coin_img.src
                    }
                    //loading extra pool details
                    (E('stakers') as HTMLDivElement).innerHTML = formatNumber(res._pool.stakers);
                    (E('total_staked') as HTMLDivElement).innerHTML = (formatNumber(res._pool.totalStaked/Math.pow(10,res._pool.stakeTokenInfo.decimal)) + " "  + (res._pool.stakeTokenInfo.symbol || native(_chainid)?.symbol)) || "";
                    (E('reward') as HTMLDivElement).innerHTML = (formatNumber(res.reward/Math.pow(10,res._pool.rewardTokenInfo.decimal)) + " "  + (res._pool.rewardTokenInfo.symbol || native(_chainid)?.symbol)) || "";
                    (E('liquidity') as HTMLDivElement).innerHTML = (formatNumber(res._pool.liquidity/Math.pow(10,res._pool.rewardTokenInfo.decimal)) + " "  + (res._pool.rewardTokenInfo.symbol || native(_chainid)?.symbol)) || "";
                    //show yield type value
                    let ymsg: any;let _yield: any =  formatNumber(res._pool.yield / (Math.pow(10,res._pool.rewardTokenInfo.decimal * 1)))
                    if(res._pool.yieldType == 1) {ymsg = _yield + " units per 1" + (res._pool.stakeTokenInfo.symbol || native(_chainid)?.symbol) + " "}else {ymsg = _yield + "% "}
                    if(res._pool.yieldDuration == 1) {ymsg += "daily yield"}else if(res._pool.yieldDuration == 2) {ymsg += "weekly yield"}
                    else if(res._pool.yieldDuration == 3) {ymsg += "monthly yield"}else if(res._pool.yieldDuration == 4) {ymsg += "yearly yield"}
                    (E('stake_yield_benefit') as HTMLDivElement).innerHTML = ymsg;
                    //show stake status
                    if(res._pool.locked) {
                      //show its locked
                      (E('stake_info_head') as HTMLDivElement).innerHTML = "<div class='stake_info_black'>Locked</div>"
                    }
                    else if(res._pool.liquidity == 0){
                      //show insufficient liquidity
                      (E('stake_info_head') as HTMLDivElement).innerHTML = "<div class='stake_info_red'>Insufficient liquidity pool</div>"
                    }
                    else if(res.ended) {
                      //show has ended
                      (E('stake_info_head') as HTMLDivElement).innerHTML = "<div class='stake_info_black'>Ended</div>"
                    }
                    else { 
                      //show ending date
                      (E('stake_info_head') as HTMLDivElement).innerHTML = "<div class='stake_info_normal'>Ending at " + (new Date(res._pool.time[1] * 1000).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})) + "</div>"
                    }
                    //show the div
                    (E('stake_info_head') as HTMLDivElement).style.display = "";
                    //show edit stake pool if owner
                    (res._pool.owner == _wallet)? (E('edit_stake') as HTMLDivElement).style.display = "" : (E('edit_stake') as HTMLDivElement).style.display = "none" ;
                    _balance = bal / Math.pow(10,res._pool.stakeTokenInfo.decimal)
                    rbalance = rbal / Math.pow(10,res._pool.rewardTokenInfo.decimal)
                    _staked = res.totalStaked / Math.pow(10,res._pool.stakeTokenInfo.decimal)
                    pool = res;
                    //show conditional display
                    showConditionalDisplay()
                  }
                })
              }
            })
          })
         .catch((err: any) => {
            //retry again 
            setTimeout(() => {loadData()}, 500)
         })
      }
      else {
        alert('Staking pool not found')
        window.location.href = "#/stake"
      }
    })
    .catch((err :any) => {
      //reload every 2 sec
      setTimeout(() => {loadData()}, 2000)
    })
  }
}

const getUserBalance = (_address: any) => {
  let _Address: any = config.chains[_chainid] as unknown as JSON | null
  if(_address != ZERO_ADDRESS) {
    const token = new ethers.Contract(_address, abi.token, _ether);
    return token.balanceOf(_wallet)
    .then((_res: any)=> {  
      return _res
    })
  }
  else {  
    //get the user native currency balance 
    return _ether.getBalance(_wallet)
  }
}
const getAllowed = (_tokenAddress: any) => {
  let _Address: any = config.chains[_chainid] as unknown as JSON | null
  if(_Address != null) {
    if(_tokenAddress != ZERO_ADDRESS){
      const token = new ethers.Contract(_tokenAddress, abi.token, _ether);
      return token.allowance(_wallet,  _Address.stake  as any | "")
      .then((_res: any)=> {  
        return _res > 0
      })
    }else {
      return Promise.resolve(true)
    }
  }else {
    return false
  }
}
const grantPermission = () => {
  let _Address: any = config.chains[_chainid] as unknown as JSON | null
  if(_Address != null) {
    let _stakeAddress: any = _Address.stake as any | ""
    const signer = _ether.getSigner();
    const token = new ethers.Contract(pool._pool.stakeTokenInfo.tokenAddress, abi.token, signer);
   return token.approve(_stakeAddress,  Web3.utils.toWei('9000000000000000000'))
   .then((_res: any)=> {  
        return _res;      
    })
  }
  else {return false}
}
const stake = (_amount: any) => {
  let _Address: any = config.chains[_chainid] as unknown as JSON | null
  if(_Address != null) {
    let _stakeAddress: any = _Address.stake as any | ""
    const signer = _ether.getSigner();
    const _stake = new ethers.Contract(_stakeAddress, abi.stake, signer);
    console.log(Web3.utils.toWei(_amount + "", 'wei'))
    if(pool._pool.stakeTokenInfo.tokenAddress == ZERO_ADDRESS) {
        return _stake.stakePool(stakeId, Web3.utils.toWei(_amount + "", 'wei'), {value: Web3.utils.toWei(_amount + "", 'wei')})
    }
    else {
      return _stake.stakePool(stakeId, Web3.utils.toWei(_amount + "", 'wei'))
    }
  }
  else {return false}
}
const unstake = (_amount: any) => {
  let _Address: any = config.chains[_chainid] as unknown as JSON | null
  if(_Address != null) {
    let _stakeAddress: any = _Address.stake as any | ""
    const signer = _ether.getSigner();
    const _stake = new ethers.Contract(_stakeAddress, abi.stake, signer);
    console.log(Web3.utils.toWei(_amount + "", 'wei'))
    return _stake.unstake(stakeId, Web3.utils.toWei(_amount + "", 'wei'))
  }
  else {return false}
}
const withdrawPool = () => {
  let _Address: any = config.chains[_chainid] as unknown as JSON | null
  if(_Address != null) {
    let _stakeAddress: any = _Address.stake as any | ""
    const signer = _ether.getSigner();
    const _stake = new ethers.Contract(_stakeAddress, abi.stake, signer);
    return _stake.withdraw(stakeId)
  }
  else {return false}
}
const setInputAmount = (_amount: any) => {
  let _amt;
    if(_Option == 'stake'){
      _amt = (_amount/100) * _balance
    }
    else{
      _amt = (_amount/100) * _staked
    }
    const stake_input = document.getElementById('stake_input') as HTMLInputElement | null
    if(stake_input != null) {
      stake_input.value = _amt + ""
    }
}
const showEditPool = () => {
  //to show the edit pool pane
  showEditStake(pool._pool, rbalance)
}
//to show coditional display
const showConditionalDisplay = () => {
  //to format display based on ceratin conditions
  if(pool != null) {
    //first with token and stake balance
    const stake_reward_button = document.getElementById('stake_reward_button') as HTMLButtonElement
    const stake_button = document.getElementById('stake_button') as HTMLButtonElement
    const stake_amount = document.getElementById('stake_amount') as HTMLElement
    if(_Option == 'stake') {
      stake_amount.innerHTML = "Balance : " + (Intl.NumberFormat('en-US', {maximumSignificantDigits: 12}).format(_balance || ""));
    }
    else {
      stake_amount.innerHTML = "Staked : " + (Intl.NumberFormat('en-US', {maximumSignificantDigits: 12}).format(_staked || ""));
    }
    //check if its locked
    if(pool._pool.locked) {
      //disable button only during staked
      if(_Option == 'stake') {
        stake_button.disabled = true  
      }
      else {
        stake_button.disabled = false  
        if(_buttonAct != "transact") {
          stake_button.innerHTML = 'unstake'
        }
        else {
          stake_button.innerHTML = '...'
        }
      }
      //disbale the reward button
      stake_reward_button.disabled = true
    }
    else if(pool._pool.liquidity == 0) {
      //insufficient liquidity
      if(_Option == 'stake') {
        stake_button.disabled = true  
      }
      else {
        stake_button.disabled = false  
        if(_buttonAct != "transact") {
          stake_button.innerHTML = 'unstake'
        }
        else {
          stake_button.innerHTML = '...'
        }
      }
      stake_reward_button.disabled = false
    }
    else if(pool.ended) {
      //ended
      if(_Option == 'stake') {
        stake_button.disabled = true  
      }
      else {
        stake_button.disabled = false  
        if(_buttonAct != "transact") {
          stake_button.innerHTML = 'unstake'
        }
        else {
          stake_button.innerHTML = '...'
        }
      }
      stake_reward_button.disabled = false
    }
    else {
      //passed all
      stake_button.disabled = false;stake_reward_button.disabled = false
      if(_buttonAct == "permission") {
         //show grant permision button
         if(_Option == 'stake') {
           stake_button.innerHTML = "Grant access to " + pool._pool.stakeTokenInfo.symbol
         }
         else {
          stake_button.innerHTML = "unstake"
         }
      }
      else if(_buttonAct == "") {
        //show grant permision button
        if(_Option == 'stake') {
          stake_button.innerHTML = "stake"
        }
        else {
         stake_button.innerHTML = "unstake"
        }
      }
      else if(_buttonAct == 'transact') {
        stake_button.disabled = true
      }
      if(_withdrawAct == 'transact') {
        stake_reward_button.disabled = true
      }
      else {
        stake_reward_button.innerHTML = 'withdraw reward'
      }
    }
    //check if there is rewards
    if(pool.reward > 0) {
      stake_reward_button.style.display = ""
    }
    else {
      stake_reward_button.style.display = "none"
    }
  }
}
const Stake: React.FC<{}> = (): React.ReactElement => {
  const { account, chainId, library} = useActiveWeb3React()
  const tokens = useAllTokens();
  const [isAllowed, setAllowed] = useState(false)
  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle() 
  _ether = library;
  useEffect(() => {
    // Reset variables
    _balance = 0; _staked = 0; _Option = "stake";
    _buttonAct = "";_withdrawAct = "";allTokens = {};
    viewNo = 0; pool = null;
   });
  onRender('stake_info_head', () => {
    stakeId = G('id',"");
    if(account != null && chainId != null && JSON.stringify(tokens) != '{}') { 
      if(_wallet != account || _chainid != chainId || JSON.stringify(allTokens) != JSON.stringify(tokens)) { 
         allTokens = tokens;_wallet = account; _chainid = chainId; 
          selectView(viewNo)
          loadData()
      }
    }
  })
  const  buttonAction = () => {
    //to run the button actions
    //check the button actions
    const stake_button = document.getElementById('stake_button') as HTMLButtonElement | null
    const stake_input = document.getElementById('stake_input') as HTMLInputElement | null
    if (_buttonAct == 'permission') {
       if(stake_button != null) {
          stake_button.disabled = true;stake_button.innerHTML = "..."; 
          let a: any = grantPermission();
            if(a != false) {
              showModalInfo(true);setModalMsg('Transacting');setModalStaus('')
              stake_button.disabled = true; _buttonAct = 'transact'
              a.then((tx: any) => { 
                if(tx.hash) {
                    tx.wait()
                    .then((res: any) => {
                      stake_button.disabled = false; hideModalInfo(3000)
                      if(res.status == 1) {
                        setModalMsg("Permission granted")
                        setModalStaus('good')
                        _buttonAct = ""
                      }
                      else{
                        //transaction failed
                        setModalStaus('error');setModalMsg("Transaction failed")
                        _buttonAct = "permission"
                      }
                      showConditionalDisplay()
                    })
                    .catch((err: any) => {
                        _buttonAct = "permission"
                        reset(err)
                    })
                    
                  }
              })
              .catch ((err: any) => {
                _buttonAct = "permission"
                reset(err)
              })
            }     
       }
    }
    else {
      let func = null;
      //for stake and unstake
      if(_Option == 'stake') {func = stake}else{func = unstake}
          //get the amount
          if(stake_button != null && stake_input != null) {
            let _amt: any; _amt = stake_input.value; 
            if(_amt > 0){
              stake_button.disabled = true;  stake_button.innerHTML = "...";
              showModalInfo(true);setModalMsg('Transacting');setModalStaus('')
              stake_button.disabled = true; _buttonAct = 'transact'
              func(toBig(_amt, pool._pool.stakeTokenInfo.decimal))
              .then((tx: any) => {
                if(tx.hash) {
                  tx.wait()
                  .then((res: any) => {
                    stake_button.disabled = false; hideModalInfo(3000);_buttonAct = ""
                      if(res.status == 1) {
                        setModalMsg("Successfull")
                        setModalStaus('good')
                        loadData()
                      }
                      else{
                        //transaction failed
                        setModalStaus('error');setModalMsg("Transaction failed")
                      }
                      showConditionalDisplay()
                   })
                  .catch((err: any) => {  
                      _buttonAct = ""
                      reset(err)
                  })
                }
              })
              .catch((err: any) => {
                _buttonAct = ""
                reset(err)
              })
            }
         }
         
    }
    function reset(err: any) {  
      setModalStaus('error')
      setModalMsg(readErrorMessage(err));hideModalInfo();
      if(stake_button != null) {stake_button.disabled = false}
      showConditionalDisplay()
    }
  }
  //hooking to New pool created
  hasSavedNew(() => {  
    onRender('stake_head_stake_img', () => {  
      if(account != null && chainId != null) { 
        loadData()
      }
    })
  })
  //to withdraw rewards
  const withdraw = () => {
    const stake_reward_button = document.getElementById('stake_reward_button') as HTMLButtonElement | null
    if(stake_reward_button != null) {
      stake_reward_button.disabled = true;stake_reward_button.innerHTML = "..."; 
          let a: any = withdrawPool();
            if(a != false) {
              showModalInfo(true);setModalMsg('Transacting');setModalStaus('')
              stake_reward_button.disabled = true; _withdrawAct = 'transact'
              a.then((tx: any) => { 
                if(tx.hash) {
                    tx.wait()
                    .then((res: any) => {
                      stake_reward_button.disabled = false; hideModalInfo(3000)
                      if(res.status == 1) {
                        setModalMsg("Reward sent to wallet")
                        setModalStaus('good')
                        _withdrawAct = ""
                        loadData()
                      }
                      else{
                        //transaction failed
                        setModalStaus('error');setModalMsg("Transaction failed")
                        _withdrawAct = ""
                      }
                      showConditionalDisplay()
                    })
                    .catch((err: any) => {
                      _withdrawAct = ""
                       reset(err)
                    })
                    
                  }
              })
              .catch ((err: any) => {
                _withdrawAct = ""
                reset(err)
              })
            }     
    }
    function reset(err: any) {  
      setModalStaus('error')
      setModalMsg(readErrorMessage(err));hideModalInfo();
      if(stake_reward_button != null) {stake_reward_button.disabled = false}
      showConditionalDisplay()
    }
  }
  return (
    <>
      <div className="bg-image"></div>

      <div className="dxstake" >
        <div className="stakeinnerContainer">
        <div className='stake_name_info' style={{display:'none'}}> <span id='stake_head_info'></span>
          <img id='stake_head_stake_img' style={{marginLeft:'10px'}} />
          <b id='stake_head_stake_name'></b><img id='stake_head_earn_img'/><b id='stake_head_earn_name'></b></div>
          <div id='stake_info_head' className='stake centre' style={{background:'none', padding:'0px', display:'none', fontSize:'14px'}}>
             
          </div>

          <div id='stake_body_view' className='stake' >
          <div className="proposal-views" id="proposal-views">
              <p onClick={() => selectView(0)} className="selected-proposal">Stake</p>
              <p onClick={() => selectView(1)}className="">Unstake</p>

              <button id='edit_stake' onClick={showEditPool} className='stake_edit_button center' style={{display:'none'}}>
                  <span>Edit pool</span>
              </button>
          </div>
          <div className="stake-proposal-box" id="stake-box">
                <div className='stake-currency'>
                    <span>Amount </span>
                    <span id='stake_amount'>Balance </span>
                </div>
                <div className='stake-currency-1'>
                    <input id='stake_input' placeholder='0.00'/>
                    <span id='stake_coin_name'></span>
                    <img id='stake_coin_img'/>
                </div>
                <div className='stake_yield_benefit'>
                  <span id='stake_yield_benefit' style={{color:'limegreen'}}></span>
                </div>
          </div>
          <div className='stake_percents'>
            <button onClick={() => setInputAmount(25)}>25%</button>
            <button onClick={() => setInputAmount(50)}>50%</button>
            <button onClick={() => setInputAmount(75)}>75%</button>
            <button onClick={() => setInputAmount(100)}>100%</button>
          </div>
          <div id='msg' className='proposal-msg-area proposal-msg-area-fail'>
                
          </div>
          <div className='stake_buttons'>
          {!account ? (
                <ButtonPrimary onClick={toggleWalletModal}>Connect Wallet</ButtonPrimary>
              ) : (
                <ButtonPrimary onClick={buttonAction}  id='stake_button'>...</ButtonPrimary>
              )}
          </div>
          </div>
          
          <div id='stake_info_bottom' className='stake'>
            <StakeStatsContainer>
            <VotingAddresses>
              <p>Staking Addresses</p>
              <span id='stakers'>
                 
              </span>
            </VotingAddresses>
            <VotingAddresses>
              <p>Total staked</p>
              <span id='total_staked'>
                   
              </span>
            </VotingAddresses>
            </StakeStatsContainer>

            <StakeStatsContainer>
            <VotingAddresses>
              <p>Available Liquidity</p>
              <span id='liquidity'>
                  
              </span>
            </VotingAddresses>
            <VotingAddresses>
              <p>Reward earned</p>
              <span id='reward'>
                  
              </span>
            </VotingAddresses>
            </StakeStatsContainer>
            <div className='stake_buttons'>
              <ButtonPrimary onClick={withdraw}  id='stake_reward_button'>Withdraw reward</ButtonPrimary>
            </div>
          </div>

          <Save/>
        </div>
      </div>
      
    </>
  )
}

export default Stake
