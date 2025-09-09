import React from 'react'
import './Vote.css'

//To set the data results
const _init = (_resArray) => {
   //check for empty result 
   document.getElementById('vote-bar-cancelled').innerHTML = ""
    if(_resArray.length < 1) {
        //show empty result
        document.getElementById('vote-bar-cancelled').innerHTML = emptyResult()
    }
    else {
        //show results
        for(let i=0;i< _resArray.length; i++) {
            document.getElementById('vote-bar-cancelled').innerHTML += cancelledProposal(_resArray[i])
        }
    }
}

const cancelledProposal = (res) => {
    let _res = '<a href="#/proposal?id=' + res.id + '" class="no-a"><div class="vote-proposal-details">'
    _res += '<div class="vote-title">' + res.title + '</div>'
    _res += '<i class="vote-status-cancelled fas fa-check-times"></i></div></a>'
    return _res;
}
const emptyResult = () => {
    return '<div class="vote-proposal-empty">There is no cancelled proposal</div>'
}
const cancelled = () => {
    return (
        <>
        <div className='vote-bar' id='vote-bar-cancelled'>
        
        </div>
        </>
    )
}

export const Cancelled = cancelled;
export const cancelled_init = _init;