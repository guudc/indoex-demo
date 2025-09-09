import React from 'react'
import './Vote.css'

//To set the data results
const _init = (_resArray) => {
   //check for empty result 
   document.getElementById('vote-bar-settled').innerHTML = ""
    if(_resArray.length < 1) {
        //show empty result
        document.getElementById('vote-bar-settled').innerHTML = emptyResult()
    }
    else {
        //show results
        for(let i=0;i< _resArray.length; i++) {
            document.getElementById('vote-bar-settled').innerHTML += settledProposal(_resArray[i])
        }
    }
}

const settledProposal = (res) => {
    let _res = '<a href="#/proposal?id=' + res.id + '" class="no-a"><div class="vote-proposal-details">'
    _res += '<div class="vote-title">' + res.title + '</div>'
    if(res.status == 'undecided') { 
        _res += '<i class="vote-status-undecided fas fa-check-circle"></i></div>'
    }
    else{ _res += '<i class="vote-status-executed fas fa-check-circle"></i></div></a>'}
    return _res;
}
const emptyResult = () => {
    return '<div class="vote-proposal-empty">There is no settled proposal</div>'
}
const settled = () => {
    return (
        <>
        <div className='vote-bar' id='vote-bar-settled'>
        
        </div>
        </>
    )
}

export const Settled = settled;
export const settled_init = _init;