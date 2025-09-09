import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useState, MouseEvent } from 'react'
import './stake.css'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import {
    useDefaultsFromURLSearch,
    useDerivedSwapInfo,
    useSwapActionHandlers,
    useSwapState
  } from '../../state/swap/hooks';
import { Field } from '../../state/swap/actions'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { CurrencyAmount, JSBI, Trade, Token, RoutablePlatform, Currency } from 'dxswap-sdk'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { useActiveWeb3React } from '../../hooks'
import styled, { ThemeContext } from 'styled-components'
import { Repeat, Lock, Unlock, ChevronDown } from 'react-feather'
import { ButtonError, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import { onToggle, E, readErrorMessage, onRender, toBig, native } from '../../components/utility';
import _ from 'lodash';
import { useWalletModalToggle } from '../../state/application/hooks';
import {ethers} from "ethers";
import Web3 from 'web3';
import abi from './functions/abi';
import config from './functions/config';
import { WrappedTokenInfo } from '../../state/lists/hooks';
import { ModalInfo, showModalInfo, setModalMsg, setModalStaus } from '../../components/infomodal';
//variables declration
let _stakeToken: any = ""; let _rewardToken: any; let _liquidity: any = '0';
let _rewardTokenDecimal: any; let _rewardTokenSymbol: any;let _yieldType: any = '1'; let _yieldDuration: any = 'daily'
let _yield: any = '0'; let _duration: any = 0; let _ether: any; let _account: any;let _chainid: any;
let _tmr: any;let _isAllowed: any = 'false'; let _balance: any = '0'; let hasCreated: boolean = false //to know if a new pool was created 
const zeroAddress = "0x0000000000000000000000000000000000000000"; let _creationFee: any = 0;
let createHooks: any = [];  let useOne: boolean = false;
const getAllowed = (_tokenAddress: any) => {
  let _Address: any = config.chains[_chainid] as unknown as JSON | null
  if(_Address != null) {
    let _stakeAddress: any = _Address.stake as any | ""
    const token = new ethers.Contract(_tokenAddress, abi.token, _ether);
    return token.allowance(_account,  _stakeAddress as any | "")
    .then((_res: any)=> {   
      return _res
    })
  }
  else{return false}
}
const getCreationFee = () => {
  let _Address: any = config.chains[_chainid] as unknown as JSON | null
  if(_Address != null) {
    let _stakeAddress: any = _Address.stake as any | ""
    const token = new ethers.Contract(_stakeAddress, abi.stake, _ether);
    return token.CREATION_FEE()
    .then((_res: any)=> {   
      return _res
    })
  }
  else{return false}
}
const grantPermission = () => {
  let _Address: any = config.chains[_chainid] as unknown as JSON | null
  if(_Address != null) {
    let _stakeAddress: any = _Address.stake as any | ""
    const signer = _ether.getSigner();
    const token = new ethers.Contract(_rewardToken, abi.token, signer);
   return token.approve(_stakeAddress,  Web3.utils.toWei('9000000000000000000'))
   .then((_res: any)=> {  
        return _res;      
    })
  }
  else {return false}
}
const createPool = (_liquid: any, yield_tmp:any, yield_dur: any) => {
  let _Address: any = config.chains[_chainid] as unknown as JSON | null
  if(_Address != null) {
    let _stakeAddress: any = _Address.stake as any | ""
    const signer = _ether.getSigner();
    const stake = new ethers.Contract(_stakeAddress, abi.stake, signer);
    let a: any;  
    let n = Web3.utils.toBN(_liquid + "")
    let p = Web3.utils.toBN(_creationFee);
    n = n.add(p)
    if(useOne) {
      //using one address
      _stakeToken = _rewardToken;
    }
    if(_rewardToken != zeroAddress) {
        a = stake.createPool(_rewardToken, _stakeToken, Web3.utils.toWei(_liquid + "", 'wei'), Web3.utils.toWei(yield_tmp + "", 'wei'), _yieldType, yield_dur, _duration, {value: _creationFee.toString()})
    }else {a = stake.createPool(_rewardToken, _stakeToken, Web3.utils.toWei(_liquid + "", 'wei'), Web3.utils.toWei(yield_tmp + "", 'wei'), _yieldType, yield_dur, _duration, {value: n.toString()})}
    return a.then((_res: any)=> {  
        return _res;      
    })
  }
  else {return false}
}
const vaidateStakeData = () => { 
    _liquidity =  getInputValue('stake-input-token')
    let yiel: any;
    if(_rewardToken != zeroAddress) {
      yiel = Math.floor(_yield * Math.pow(10,_rewardTokenDecimal))
      } else {yiel = Math.floor(_yield * 1E18)}
     
    if(useOne) {
      //using one address
      _stakeToken = _rewardToken;
    }
    if(_stakeToken == null || _stakeToken == undefined || _stakeToken == "") {
      return [false, "Choose a token to use for staking."]
    }
    else if(_rewardToken == null || _rewardToken == undefined) {
      return [false, "choose the reward token to be earned."]
    }
    else if((_liquidity * 1) == 0) {
        return [false, "Indicate the liquidity amount."]
    }
    else if((_liquidity * 1) < 0) {
      return [false, "Liquidity amount cannot be negative"]
    }
    else if((_duration * 1) < 0) {
      return [false, "Duration value cannot be negative"]
    }
    else if((_yield * 1) == 0){
      return [false, "Indicate the yield value."]
    }
    else if((_yield * 1) < 0){
      return [false, "Yield value cannot be negative."]
    }
    else if((yiel * 1) == 0){
      return [false, "Yield value is too small."]
    }
    else if(_duration < 1) {
      return [false, "Specify the duration"]
    }
    else if((_liquidity * 1) < (_yield * 1)) {
      return [false, "The yield amount cannot exceed the liquidity."]
    }
    else if((_balance * 1) < (_liquidity * 1)) {
      return [false, "Insufficient balance to provide for the desired liquidity."]
    }
    else if((_balance * 1) == 0) {
      return [false, "Insufficient balance"]
    }
    
    return [true]   
}
const getInputValue = (_id: any) => {
   const _div = E(_id) as HTMLDivElement | null
   if(_div != null) {
       //find the input field in it
       const _res = _div.querySelector('input')
       if(_res != null){return _res.value}
   }
   return ""
}
const hasCreatedNew = (_callback: Function) => {
  if(_callback != null){createHooks.push(_callback)}
}
const callHooks = () => {
  if(createHooks.length > 0 && hasCreated) {
    hasCreated = false
      createHooks.forEach((callback:any) => {
          callback()
      });
      hasCreated = false
  }
}
const checkCurrencyAllowed = (_address: any, _tokenSymbol: any) => {
  if(_account) { 
    const stake_button = E('stake_button') as HTMLButtonElement | null
    //check if button is loaded and if its re-doing itself
    if(stake_button != null && _address != _rewardToken) {
      stake_button.disabled = true //disable stake button from default
      stake_button.innerHTML = "..."
      _isAllowed = 'false'; 
      if(_address != zeroAddress && _address != ""){
        let a = getAllowed(_address)
        if(a != false) {
          a.then((res: any) => {  
              stake_button.disabled = false
                if(res > 0) {
                  stake_button.innerHTML = "Create"
                  _isAllowed = 'true'
                }
                else {
                  stake_button.innerHTML = "Grant access to " + _tokenSymbol
                }
          })
        }
      } 
      else if(_address == zeroAddress){ 
        //using native currency
        stake_button.innerHTML = "Create"
        stake_button.disabled = false
        _isAllowed = 'true'
      }
    }
  }
}
const showCreateStake = () => { 
  //to show create stake pool
  onRender('stake_yield_type', () => { 
      //reset some things
      _liquidity  = '';_yieldType  = '1'; _yieldDuration = 'daily'
      _yield = '0';_duration = 0;
      if(_rewardToken != null) {
        let tmp = _rewardToken;  _rewardToken = ""
        checkCurrencyAllowed(tmp, _rewardTokenSymbol)
      }
  })       
}
const myPrompt = (msg:any, callback: Function) => {
  //to call the prompt and get user info
  (E('stake_prompt') as HTMLDivElement).style.display = 'flex';
  const _t = (E('stake_prompt_msg') as HTMLDivElement)
  _t.innerHTML = msg;
  //configuring button
  (E('stake_prompt_yes') as HTMLDivElement).onclick = () => {
    (E('stake_prompt') as HTMLDivElement).style.display = 'none';
    callback(true)
  }
  (E('stake_prompt_no') as HTMLDivElement).onclick = () => {
    (E('stake_prompt') as HTMLDivElement).style.display = 'none';
    callback(false)
 }
}
const Create: React.FC<{}> = (): React.ReactElement => {
    const theme = useContext(ThemeContext); 
    const { account, chainId, library } = useActiveWeb3React()
    _ether = library;  _account = account;_chainid = chainId
    const toggleWalletModal = useWalletModalToggle()
    if(chainId != null) { 
     try{ 
      let _tmp = getCreationFee();
      if(_tmp !== false){ 
        _tmp.then((amt) => {
          _creationFee = amt
        })
      }
     }catch(e){}
    }
    const [loading, setLoading] = useState<boolean>(false);
    const [_useOne, setUseOne] = useState<boolean>(false);
    useOne = _useOne;
    const [platformOverride, setPlatformOverride] = useState<RoutablePlatform | null>(null)
    const { independentField, typedValue, recipient } = useSwapState()
    const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
    const { onCurrencySelection, onUserInput } = useSwapActionHandlers();
    const {
        trade: potentialTrade,
        allPlatformTrades,
        currencyBalances,
        parsedAmount,
        currencies,
        inputError: swapInputError
      } = useDerivedSwapInfo(platformOverride || undefined)
      const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
        currencies[Field.INPUT],
        currencies[Field.OUTPUT],
        typedValue
    );
    const maxAmountOutput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.OUTPUT], chainId)
    const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
    const trade = showWrap ? undefined : potentialTrade;
    const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount
        }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
        }
      const formattedAmounts = {
        [independentField]: typedValue,
        [dependentField]: showWrap
          ? parsedAmounts[independentField]?.toExact() ?? ''
          : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
    }
    //to select currency
    const getCurrencyValue = (v: any) => {
      if(v){
        if(v.address){
          return [v.address, v.symbol, v.decimals];
        }else if(v.symbol){
          return [zeroAddress, v.symbol, v.decimals];
        }else{
          return ['','', 18];
        }
      }
      else {
        return ['','', 18];
      }
    }
    const handleInputSelect =  useCallback(
      inputCurrency => {
        setPlatformOverride(null) // reset platform override, since best prices might be on a different platform
        onCurrencySelection(Field.INPUT, inputCurrency)
      },
      [onCurrencySelection]
    )
    const handleOutputSelect = useCallback(
      outputCurrency => {
        setPlatformOverride(null) // reset platform override, since best prices might be on a different platform
        onCurrencySelection(Field.OUTPUT, outputCurrency)
      },
      [onCurrencySelection]
    )
    const handleTypeInput = () => {}
    const handleTypeOutput = useCallback(
      (value: any) => {
        onUserInput(Field.OUTPUT, value)
        _liquidity = value
      },
      [onUserInput]
    )
    const handleMaxOuput = useCallback(() => {
      maxAmountOutput && onUserInput(Field.OUTPUT, maxAmountOutput.toExact())
      if(maxAmountOutput != undefined){
        let value = maxAmountOutput.toExact() as any | null
        _liquidity = value;
         //console.log(_liquidity)
      }
    }, [maxAmountOutput, onUserInput])
    //this gets the seller and buyers address
    let [stakeAddress, rewardAddress] = useMemo(() => {
    return Object.values(currencies).map(v => { 
          return getCurrencyValue(v);
    });
    }, [currencies['INPUT'], currencies['OUTPUT']])
    checkCurrencyAllowed(rewardAddress[0], rewardAddress[1])
    _rewardToken = rewardAddress[0]; _stakeToken = stakeAddress[0];
    _rewardTokenDecimal = rewardAddress[2]; _rewardTokenSymbol = rewardAddress[1]
    if(maxAmountOutput != null) {
      _balance = maxAmountOutput.toExact()
    }
     onToggle("stake_yield_type", (_value: any) => {
      const stake_yield_msg = E('stake_yield_msg')
      if(stake_yield_msg != null) {
      _value = _value.toLowerCase()
        if(_value == ' units') {
           _yieldType = '1'
           stake_yield_msg.innerHTML = "Rewards would be accumulated based on  units"
        }
        else {
          _yieldType = '0'
          stake_yield_msg.innerHTML = "Rewards would be accumulated based on percentage"
        }
        showMsg(_yieldDuration, _value, _yield)
      }
    })
    onToggle("stake_yield_duration", (_value: any) => {
      const stake_yield_msg = E('stake_yield_duration_msg')
      if(stake_yield_msg != null) {
      _value = _value.toLowerCase(); 
        _yieldDuration = _value
        showMsg(_value, _yieldType, _yield)
      }
    })
    const showMsg = (_value: any, _value1: any, _value3: any) => {
        let msg: any; let msg2: any; 
        const stake_yield_msg = E('stake_yield_duration_msg')
        const _yield_msg = E('_yield_msg')
        if(_yieldType == '1') {msg = " units";msg2=" units * "}else {msg="percentage"; msg2 = "% of the"}
        if(stake_yield_msg != null && _yield_msg != null) {  
          if(_value == 'daily') {  
              stake_yield_msg.innerHTML = "Rewards would be accumulated based on " + msg + " per day"
              _yield_msg.innerHTML = "Reward = " + _value3 + "" + msg2 + " staked token per day"  
          }
          else if(_value == 'weekly') {
            stake_yield_msg.innerHTML = "Rewards would be accumulated based on " + msg + " per week"
            _yield_msg.innerHTML = "Reward = " + _value3 + "" + msg2 + " staked token per week"  
          }
          else if(_value == 'monthly') {
              stake_yield_msg.innerHTML = "Rewards would be accumulated based on " + msg + " per month"
              _yield_msg.innerHTML = "Reward = " + _value3 + "" + msg2 + " staked token per month"  
            }
          else if(_value == 'yearly') {
              stake_yield_msg.innerHTML = "Rewards would be accumulated based on " + msg + " per year"
              _yield_msg.innerHTML = "Reward = " + _value3 + "" + msg2 + " staked token per year"  
          } 
        }

    }
    const onYieldInput = () => {
      const stake_yield_input = E('stake_yield_input') as HTMLInputElement | null
      if(stake_yield_input != null) {
        const _value: any = stake_yield_input.value as any
        _yield = _value
        showMsg(_yieldDuration, _yieldType, _value)
      }
    }
    const onEndInput = () => {
      const stake_end_input = E('stake_end_input') as HTMLInputElement | null
      if(stake_end_input != null) {
        const _value: any = stake_end_input.value as any
        _duration = _value
        //console.log(_duration)
      }
    }
    const switchOneToMany = () => {
      if(useOne){
        _stakeToken = "";
      }
      setUseOne(!useOne)
    }
    const doButtonAction = () => { 
        //for button actions
        if(_isAllowed == 'false') { 
            //grant permission function
            const stake_button = E('stake_button') as HTMLButtonElement | null
            let a: any = grantPermission();try{clearTimeout(_tmr)}catch(e){}
            if(a != false && stake_button != null) {
              showModalInfo(true);setModalMsg('Transacting');setModalStaus('')
              stake_button.disabled = true
              a.then((tx: any) => { 
                if(tx.hash) {
                    tx.wait()
                    .then((res: any) => {
                      stake_button.disabled = false; _tmr = setTimeout(() => {showModalInfo(false)}, 3000)
                      if(res.status == 1) {
                        stake_button.innerHTML = "Create"
                        setModalMsg("Permission granted")
                        setModalStaus('good')
                        _isAllowed = 'true'
                      }
                      else{
                        //transaction failed
                        setModalStaus('error');setModalMsg("Transaction failed")
                      }
                    })
                    .catch((err: any) => {
                        setModalStaus('error')
                        setModalMsg(readErrorMessage(err))
                        _tmr = setTimeout(() => {showModalInfo(false)}, 4000)
                    })
                  }
              })
              .catch ((err: any) => {
                  setModalStaus('error')
                  setModalMsg(readErrorMessage(err))
                  _tmr = setTimeout(() => {
                    showModalInfo(false)
                  }, 4000)
                  stake_button.disabled = false
              })
            }
        }
        else if(_isAllowed == 'true') {
           //can do the needfull, first validate
           const _a = vaidateStakeData()
           const stake_button = E('stake_button') as HTMLButtonElement | null
           if(_a[0] && stake_button != null) {
              //successfull, now deploy. Prepare the inputs
              let liquid: any; let yiel: any; let yd: any
              if(_rewardToken != zeroAddress) {
                  liquid = toBig(_liquidity, _rewardTokenDecimal)
                  yiel = toBig(_yield,_rewardTokenDecimal)
              } else {
                  liquid = toBig(_liquidity, 18)
                   yiel = toBig(_yield,18)
              }
                //do prompt
                const msg = "You would be charged <span style='color:yellow'>" + (_creationFee / 10E18) + " " + native(chainId)?.symbol + "</span> for this operation."
                myPrompt(msg, (_choice: Boolean) => {
                  if(_choice) {
                    //format yield duration
                    if(_yieldDuration == 'daily') {yd = '1'}else if(_yieldDuration == 'weekly'){yd = '2'}else if(_yieldDuration == 'monthly') {yd = '3'} else {yd = '4'}
                    let a = createPool(liquid, yiel, yd);try{clearTimeout(_tmr)}catch(e){}
                    if(a != false) {
                      showModalInfo(true);setModalMsg('Creating pool');setModalStaus('')
                      stake_button.disabled = true
                      a.then((tx: any) => { 
                        if(tx.hash) {
                            tx.wait()
                            .then((res: any) => {
                              stake_button.disabled = false; _tmr = setTimeout(() => {showModalInfo(false)}, 3000)
                              if(res.status == 1) {
                                stake_button.innerHTML = "Create"
                                setModalMsg("Staking pool Created")
                                setModalStaus('good')
                                hasCreated = true
                              }
                              else{
                                //transaction failed
                                setModalStaus('error');setModalMsg("Transaction failed")
                              }
                            })
                            .catch((err: any) => {
                                setModalStaus('error')
                                setModalMsg(readErrorMessage(err))
                                _tmr = setTimeout(() => {showModalInfo(false)}, 4000)
                            })
                          }
                      })
                      .catch ((err: any) => {
                          setModalStaus('error')
                          setModalMsg(readErrorMessage(err))
                          _tmr = setTimeout(() => {
                            showModalInfo(false)
                          }, 4000)
                          stake_button.disabled = false
                      })
                    }
                  }
                })
           }
           else{
              //didn't pass validation check
              showModalInfo(true);setModalStaus('error');setModalMsg(_a[1])
              try{clearTimeout(_tmr)}catch(e){}
              _tmr = setTimeout(() => {showModalInfo(false)}, 3000)
           }
        }
    }
    const hideCreateModal = () => {
      const _c = E('stake_create') as HTMLDivElement | null
      if(_c != null) {
        _c.style.display = 'none'
        callHooks()
      }

    }
    // onRender('stake_create', () => {
    // })
return (
      <>
      
        <div id='stake_create' className='stake_overlay' style={{display:'none'}}>
           <div className='stake_modal topGravity'>
             <div onClick={hideCreateModal} className='stake_cancel'><span className='fas fa-times'></span></div>
             <span className='' style={{margin:'15px', fontSize:'18px'}}>Create Stake Pool</span>
             <div className='stake_modal_display'>   
             <section className='stake_option_section' style={{border:'0px'}}>
                 {useOne ? (
                       <ButtonPrimary onClick={switchOneToMany}>use seperate token for stake and reward</ButtonPrimary>
                   ):
                   (
                    <ButtonPrimary onClick={switchOneToMany}>use one token for stake and reward</ButtonPrimary>
                   )}
             </section>
             
              <section className='stake_option_section'>
              {useOne ? (
                      <span className='stake_token_font span' style={{color:'yellow'}}>Using same token as rewards</span>
                      ):
                   (
                    <div>
                    <span className='stake_token_font span'>Select stake token</span>
                    <CurrencyInputPanel
                      label=""
                      value={formattedAmounts[Field.INPUT]}
                      showMaxButton={true}
                      hideInput ={true}
                      onUserInput={handleTypeInput}
                      onCurrencySelect={handleInputSelect}
                      currency={currencies[Field.INPUT]}
                      otherCurrency={currencies[Field.OUTPUT]}
                      id="swap-currency-input"
                    />
              
                    </div>
                     )}
                </section>
                <section className='stake_option_section'>
                    <span className='stake_token_font span'>Select Reward token and add liquidity</span>
                    <div>
                   <CurrencyInputPanel
                      label=""
                      value={formattedAmounts[Field.OUTPUT]}
                      showMaxButton={true}
                      onUserInput={handleTypeOutput}
                      onMax={handleMaxOuput}
                      onCurrencySelect={handleOutputSelect}
                      currency={currencies[Field.OUTPUT]}
                      otherCurrency={currencies[Field.OUTPUT]}
                      id="stake-input-token"
                    />
                    </div>
                </section>
                <section className='stake_option_section'>
                    <span className='stake_token_font span'>Yield type</span>
                    <div> 
                      <div id='stake_yield_type' className='stake_toggle' style={{marginLeft:'10px'}}>
                        <div className='stake_toggle_select'> units</div>
                        <div>Percentage</div>
                      </div>
                    </div>
                    <span  id='stake_yield_msg' className='msg'>Rewards would be accumulated based on  units</span>
                </section>
                <section className='stake_option_section'>
                    <span className='stake_token_font span'>Yield duration</span>
                    <div> 
                      <div id='stake_yield_duration' className='stake_toggle' style={{marginLeft:'10px'}}>
                        <div className='stake_toggle_select'>Daily</div>
                        <div>Weekly</div>
                        <div>Monthly</div>
                        <div>Yearly</div>
                      </div>
                    </div>
                    <span id='stake_yield_duration_msg' className='msg'>Reward would be accumulated based on uints per day</span>
                </section>
                <section className='stake_option_section'>
                    <span className='stake_token_font span'>Yield value</span>
                    <div> 
                     <input onInput={onYieldInput} id='stake_yield_input' type='number' className='input' placeholder='0.0'  />
                    </div>
                    <span id='_yield_msg' className='msg'></span>
                </section>
                <section className='stake_option_section'>
                    <span className='stake_token_font span'>Duration in days</span>
                    <div> 
                     <input onInput={onEndInput} id='stake_end_input' type='number' className='input' placeholder='set duration'  />
                    </div>
                </section>
                <section className='stake_option_section' style={{border:'0px'}}>
                   {!account ? (
                       <ButtonPrimary onClick={toggleWalletModal}>Connect Wallet</ButtonPrimary>
                   ):
                   (
                    <ButtonPrimary onClick={doButtonAction} id='stake_button'>...</ButtonPrimary>
                   )}
                  
             </section>
             </div>
           </div>
        </div>
        <ModalInfo/>
        <div id='stake_prompt' className='stake_create_back'>
                <div className='stake_create_back_div'>
                    <div id='stake_prompt_msg' className='stake_create_back_text'>You would be charged 0.5BNB for this operation.</div>
                    <div>
                       <button id='stake_prompt_yes' className='stake_confirm'>Confirm</button>
                       <button id='stake_prompt_no' className='stake_other_cancel'>Cancel</button>
                    </div>
                </div>
        </div>
      </>
    )
}

  export { Create, hasCreatedNew, showCreateStake};