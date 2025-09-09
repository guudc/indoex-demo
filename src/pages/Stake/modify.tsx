import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useState, MouseEvent } from 'react'
import './stake.css'
import { ButtonError, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import { onToggle, E, readErrorMessage, onRender, toBig, formatNumber, native } from '../../components/utility';
import _ from 'lodash';
import { useWalletModalToggle } from '../../state/application/hooks';
import {ethers} from "ethers";
import Web3 from 'web3';
import abi from './functions/abi';
import config from './functions/config';
import { useActiveWeb3React } from '../../hooks'
import { ModalInfo, showModalInfo, setModalMsg, setModalStaus, hideModalInfo } from '../../components/infomodal';
import { ZERO_ADDRESS } from 'dxswap-sdk';
//variables declration
let _liquidity: any = '0'; let _balance: any; let locked: boolean = false; let _pool: any;
let _duration: any = 0; let _ether: any; let _account: any;let _chainid: any;
let hasSaved: boolean = false //to know if a new pool was Saved 
let SaveHooks: any = []

const SavePool = () => {
  let _Address: any = config.chains[_chainid] as unknown as JSON | null
  if(_Address != null) {
    let _stakeAddress: any = _Address.stake as any | ""
    const signer = _ether.getSigner();
    const stake = new ethers.Contract(_stakeAddress, abi.stake, signer);
    let a: any;  ////console.log(Web3.utils.toWei(_liquid + "", 'wei'))
    const liquid = toBig(_liquidity, _pool.rewardTokenInfo.decimal)
    _duration = _duration * 1
    //console.log(liquid, locked, _duration)
    if(_pool.rewardTokenInfo.tokenAddress != ZERO_ADDRESS) {
        a = stake.modifyStakePool(_pool.poolId,Web3.utils.toWei(liquid + "", 'wei'), locked,_duration)
    }else {a = stake.modifyStakePool(_pool.poolId,Web3.utils.toWei(liquid + "", 'wei'), locked,_duration, {value: Web3.utils.toWei(liquid + "", 'wei')})}
    return a.then((_res: any)=> {  
        return _res;      
    })
  }
  else {return false}
}
const validateStakeData = () => { 
    _liquidity =  getInputValue('stake_edit_liquid_input')
    _duration = getInputValue('stake_edit_end_input')
    //console.log(_liquidity, _duration)
    if((_liquidity * 1) > (_balance * 1)) {
        return [false, "Insufficient balance to provide for the desired liquidity."]
    }
    else if((_liquidity * 1) < 0) {
        return [false, "Liquidity amount cannot be negative"]
    }
    else if((_duration * 1) < 0) {
        return [false, "Duration value cannot be negative"]
    }    
    return [true]   
}
const getInputValue = (_id: any) => {
   const _div = E(_id) as HTMLInputElement | null
   if(_div != null) {
       return _div.value
   }
   return ""
}
const hasSavedNew = (_callback: Function) => {
  if(_callback != null){SaveHooks.push(_callback)}
}
const callHooks = () => {
  if(SaveHooks.length > 0 && hasSaved) {
    hasSaved = false
      SaveHooks.forEach((callback:any) => {
          callback()
      });
      hasSaved = false
  }
}
const showEditStake = (pool: any, bal: any) => { //console.log(pool)
    //to show edit stake pool
    _balance = bal
    onRender('stake_edit_info', () => {
        _pool = pool;
        (E('stake_edit_info') as HTMLSpanElement).innerHTML = "Add liquidity in " + (pool.rewardTokenInfo.symbol || native(_chainid)?.symbol);
        (E('stake_edit_balance') as HTMLSpanElement).innerHTML = "Balance: " + (formatNumber(bal)) + " " + (pool.rewardTokenInfo.symbol || native(_chainid)?.symbol)
        locked = pool.locked
        const _toggleChild = ((E('stake_edit_lock') as HTMLDivElement)?.children) as HTMLCollectionOf<HTMLDivElement>
        if(locked) {
            _toggleChild[0].className = 'stake_toggle_select'
            _toggleChild[1].className = ''
        }
        else {
            _toggleChild[1].className = 'stake_toggle_select'
            _toggleChild[0].className = ''
        }
        (E('stake_edit_button') as HTMLButtonElement).disabled = false;
        (E('stake_edit_button') as HTMLButtonElement).innerHTML = "Save";
        //SHOW SAVE MODAL
        (E('stake_save') as HTMLDivElement).style.display = ""
        hasSaved = false
    })       
}
const Save: React.FC<{}> = (): React.ReactElement => {
    const { account, chainId, library } = useActiveWeb3React()
    _ether = library;  _account = account;_chainid = chainId
    const toggleWalletModal = useWalletModalToggle()
     onToggle("stake_edit_lock", (_value: any) => {
        (_value.toLowerCase() == 'locked') ? locked = true : locked = false
    }) 
    const doButtonAction = () => { 
        //for button actions
        const a = validateStakeData(); 
        const stake_edit_button = E('stake_edit_button') as HTMLButtonElement
        if(a[0]) {
            stake_edit_button.disabled = true;  stake_edit_button.innerHTML = "...";
            showModalInfo(true);setModalMsg('Transacting');setModalStaus('')
              stake_edit_button.disabled = true; 
              SavePool()
              .then((tx: any) => {
                if(tx.hash) {
                  tx.wait()
                  .then((res: any) => {
                    stake_edit_button.disabled = false; hideModalInfo(3000);
                    stake_edit_button.innerHTML = "Save"
                      if(res.status == 1) {
                        setModalMsg("Saved successfull")
                        setModalStaus('good')
                        hasSaved = true
                        hideSaveModal()
                      }
                      else{
                        //transaction failed
                        setModalStaus('error');setModalMsg("Transaction failed")
                      }
                   })
                  .catch((err: any) => {  
                      reset(err)
                  })
                }
              })
              .catch((err: any) => {
                reset(err)
              })
        }
        else {
            showModalInfo(true);setModalStaus('error');setModalMsg(a[1])
            hideModalInfo(4000)
        }
        function reset(err: any) {  
            setModalStaus('error')
            setModalMsg(readErrorMessage(err));hideModalInfo();
            if(stake_edit_button != null) {stake_edit_button.disabled = false}
            stake_edit_button.innerHTML = "Save"
        }
    }
    const hideSaveModal = () => {
      const _c = E('stake_save') as HTMLDivElement | null
      if(_c != null) {
        _c.style.display = 'none'
        //reset everything
        _pool = null; _balance = 0; _liquidity = 0;
        callHooks()
      }

    }
    onRender('stake_save', () => {
        if(_pool != null) {
            if(_pool.owner != _account) {
                //not an owner
                //HID SAVE MODAL
                (E('stake_save') as HTMLDivElement).style.display = "none"
            }
        }
    })
return (
      <>
      
        <div id='stake_save' className='stake_overlay' style={{display:'none'}}>
           <div className='stake_modal topGravity'>
             <div onClick={hideSaveModal} className='stake_cancel'><span className='fas fa-times'></span></div>
             <span className='' style={{margin:'15px', fontSize:'18px'}}>Edit Stake Pool</span>
             <div className='stake_modal_display'>   
                <section className='stake_option_section'>
                    <span id='stake_edit_info' className='stake_token_font span'>Add liquidity in BNB</span>
                    <div> 
                     <input id='stake_edit_liquid_input' type='number' className='input' placeholder='amount'  />
                    </div>
                    <span id='stake_edit_balance' className='msg'>Balance: </span>
                </section>
                <section className='stake_option_section'>
                    <span className='stake_token_font span'>Lock staking</span>
                    <div> 
                      <div id='stake_edit_lock' className='stake_toggle' style={{marginLeft:'10px'}}>
                        <div className='stake_toggle_select'>locked</div>
                        <div>Unlocked</div>
                       </div>
                    </div>
                </section>
                <section className='stake_option_section'>
                    <span className='stake_token_font span'>Extend duration in days</span>
                    <div> 
                     <input id='stake_edit_end_input' type='number' className='input' placeholder='set duration'  />
                    </div>
                </section>
                <section className='stake_option_section' style={{border:'0px'}}>
                   {!account ? (
                       <ButtonPrimary onClick={toggleWalletModal}>Connect Wallet</ButtonPrimary>
                   ):
                   (
                    <ButtonPrimary onClick={doButtonAction} id='stake_edit_button'>Save</ButtonPrimary>
                   )}
                  
             </section>
             </div>
           </div>
        </div>
        <ModalInfo/>
      </>
    )
}

export { Save, hasSavedNew, showEditStake};