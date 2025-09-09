import React, { useEffect, useState } from 'react'
import {onRender} from '../../components/utility'
import './stake.css'
import {Pool, _filterData, _init_, _sortData} from './pool'
import {MyPool, _init, filterData, sortData} from './mypool'
import {Create, hasCreatedNew, showCreateStake} from './create'
import {ethers} from "ethers";
import abi from './functions/abi';
import config from './functions/config';
import { useActiveWeb3React } from '../../hooks'
import { ModalInfo } from '../../components/infomodal';
import { onToggle, E, Toggle} from '../../components/utility'
import { useAllTokens, useCurrency } from '../../hooks/Tokens'
import { OutlineCard } from 'src/components/Card'
import { TYPE } from 'src/theme'
let _chainid: any; let _wallet: any; let _ether:any; let allTokens: any = {};let _view: any = 0;
let stakeMyData: any = null;let stakeData: any = null; let _filter: any = {
  live:true, finished:false,
  staked:false, all: true
}

//functions declaration
const selectView = (_viewNo: number) => {
  //reset all views first
  try{
  const _stakeViews = document.getElementById('stake_head')
  let _stakeViewChild = document.getElementById('stake_view') as HTMLDivElement | null
  if(_stakeViews != null && _stakeViewChild != null){ 
      let stakeViewChild = _stakeViewChild.children as HTMLCollectionOf<HTMLElement> | null
      if(stakeViewChild != null) {
          for(let i=0;i<_stakeViews.children.length;i++) {
            _stakeViews.children[i].className = ""
            stakeViewChild[i].style.display = 'none'
          }
          _stakeViews.children[_viewNo].className = "stake_head_selected"
          //switch view
          stakeViewChild[_viewNo].style.display = ""
          _view = _viewNo
       }
   }
  }catch(e){}
}
const getStakeData = () => {
    let _Address: any = config.chains[_chainid] as unknown as JSON | null
    if(_Address != null) { 
      let _stakeAddress: any = _Address.stake as any | ""
      const _stake = new ethers.Contract(_stakeAddress, abi.stake, _ether);
      return _stake.getPoolWithUser(_wallet)
      .then((_res: any)=> { 
        return _res
      })
    }
    else {return false}
}
const loadData = () => { 
  stakeData = null;stakeMyData = null;
  let _data = getStakeData()
  if(_data != false){
    _data.then((res: any) => {   
        //reset search field
        const value = (E('stake_search_input') as HTMLInputElement)
        if(value != null){value.value = ""}
        //loop through and seperate
        let _pool = []; let _mypool = []
        for(let i=0;i<res.length;i++) {
            if(res[i]._pool.owner == _wallet) {
                _mypool.push(res[i])
            }
            else{
              _pool.push(res[i])
            }
        }
        stakeData = _pool;stakeMyData = _mypool;
       
        _init(_mypool, _filter, getSortData())
        _init_(_pool, _filter, getSortData())
    })
    .catch((err :any) => {
      //reload every 2 sec
      setTimeout(() => {loadData()}, 2000)
    })
  }
}
const showCreateStaked = () => {
    const stake_create = document.getElementById('stake_create')
    if(stake_create != null) stake_create.style.display = ""
    showCreateStake();
}
const getSortData = () => {
  const value = (E('stake_sort_type') as HTMLInputElement)?.className
  let _sortData = {sortType:'', sortBy:''}
  if(value.indexOf('down') > -1) {
    _sortData.sortType = 'down'
  }
  else{  _sortData.sortType = 'up'}
  _sortData.sortBy = (E('stake_sort_by') as HTMLInputElement)?.value
  return _sortData;
}
const Stake: React.FC<{}> = (): React.ReactElement => {
    const { account, chainId, library } = useActiveWeb3React()
   _ether = library; const tokens = useAllTokens();
   
   //configuring the toggle
   onToggle('stake_toggle_filter', (_value:any) => {
      if(_value == 'Live') {
        _filter.live = true;_filter.finished = false;
      }
      else {
        _filter.live = false;_filter.finished = true;
      }
      //reload data
      const value = (E('stake_search_input') as HTMLInputElement)?.value
      if(stakeData != null || stakeMyData != null){
        filterData(_filter, value)
         _filterData(_filter, value)
      }
   })
   onToggle('stake_toggle_filter_1', (_value:any) => {
    if(_value == 'Staked') {
      _filter.staked = true;_filter.all = false;
    }
    else {
      _filter.staked = false;_filter.all = true;
    }
    //apply filter
    const value = (E('stake_search_input') as HTMLInputElement)?.value
    if(stakeData != null || stakeMyData != null){
      filterData(_filter, value)
      _filterData(_filter, value)
    }
   })
   const onSearch = () => {
     const value = (E('stake_search_input') as HTMLInputElement)?.value
     if(stakeData != null || stakeMyData != null){
       filterData(_filter, value);
       _filterData(_filter, value)
     }
   }
   const onSortType = () => {
    const value = (E('stake_sort_type') as HTMLInputElement)
    if(value != null) {
        if(value.className.indexOf('down') > -1) {
            //sorting downwards
            value.className = "fas fa-arrow-up"
        }
        else if(value.className.indexOf('up') > -1) {
          //sorting downwards
          value.className = "fas fa-arrow-down"
      }
      if(stakeData != null || stakeMyData != null){
           sortData(getSortData(), true)
          _sortData(getSortData(), true)
      }
    }
   }
   const onSortBy = () => {
     if(stakeData != null || stakeMyData != null){
         sortData(getSortData(), true)
        _sortData(getSortData(), true)
     }
   }
   useEffect(() => {
    // Reset variables
    allTokens = {}; 
   });
   const init = () => {
    onRender('stake_view', () => {  
        selectView(_view);
         
        if(account != null && chainId != null && JSON.stringify(tokens) != '{}') { 
          if(_wallet != account || _chainid != chainId || JSON.stringify(allTokens) != JSON.stringify(tokens)) { 
            //configure the global variables
           allTokens = tokens;_wallet = account; _chainid = chainId; 
            loadData();  
            //do toggle
            if(_filter.live) {Toggle('stake_toggle_filter',0)} else {Toggle('stake_toggle_filter',1)}
            if(_filter.staked) {Toggle('stake_toggle_filter_1',0)} else {Toggle('stake_toggle_filter_1',1)}
          }
        }
    })
   } 
   //hooking to New pool created
   hasCreatedNew(() => {  
    onRender('stake_view', () => {  
      if(account != null && chainId != null) { 
            loadData()
      }
    })
   })
    return (

      <>
       
        
        <div className="bg-image"></div>
        <div className="dxstake" >
        <div className="stakeContainer">
            <div className='topStakeBar'>
                <span className='stake_bold' style={{marginRight:'auto', fontSize:'20px'}}>Staking Pool</span>
                <button onClick={showCreateStaked} className='stake_button'>Create Stake Pool</button>
                <input onInput={onSearch} id='stake_search_input' placeholder='Search by token, id' className='stake_input'  />
          </div>
            <div className='stake_head' id='stake_head'>
                <button onClick={()=> selectView(0)} style={{borderRight:'1px solid white'}}>Pool</button>
                <button onClick={()=> selectView(1)} className=''>My Pool</button>
            </div>
            <div  className='leftGravity centre stake_middle'>
              <span className='stake_token_font'>Filter</span>
              <div id='stake_toggle_filter' className='stake_toggle'>
                <div className='stake_toggle_select'>Live</div>
                <div>Finished</div>
            </div>
            <div className='centre stake_sort' style={{marginLeft:'auto'}}>
                <div onClick={onSortType} className='center'><span id='stake_sort_type' className='fas fa-arrow-down'></span></div>
                <select onInput={onSortBy} id='stake_sort_by'>
                    <option value='mine'>Your stake</option>
                    <option value='earned'>Reward earned</option>
                    <option value='total'>Total staked</option>
                    <option value='create' selected>Created</option>
                </select>
            </div>
              <div id='stake_toggle_filter_1' className='stake_toggle' style={{marginLeft:'15px'}}>
                 <div>Staked</div>
                 <div className='stake_toggle_select'>All</div>
              </div>
            </div>
            <div className='stake_view' id='stake_view'>
                <Pool />
                <MyPool/> 
            </div>
        </div></div>
        <ModalInfo />
        <Create />
        {init()}
      </>
    )
}

  export default Stake;
