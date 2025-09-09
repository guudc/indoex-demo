import React from 'react'
import './Vote.css'

//To set the data results
const _init = (_resArray) => {
   //check for empty result 
   document.getElementById('vote-bar-running').innerHTML = ""
    if(_resArray.length < 1) {
        //show empty result
        document.getElementById('vote-bar-running').innerHTML = emptyResult()
    }
    else {
        //show results
        for(let i=0;i< _resArray.length; i++) {
            document.getElementById('vote-bar-running').innerHTML += activeProposal(_resArray[i])
        }
    }
}
 
const activeProposal = (res) => {
    let _res = '<a href="#/proposal?id=' + res.id + '" class="no-a"><div class="vote-proposal-details">'
    _res += '<div class="vote-title">' + res.title + '</div>'
    _res += '<i class=""></i></div></a>'
    return _res;
}
const emptyResult = () => {
    return '<div class="vote-proposal-empty">There is no active proposal</div>'
}
const running = () => {
    return (
        <>
        <div className='vote-bar' id='vote-bar-running'>
        
        </div>
        </>
    )
}

export const Running = running;
export const init = _init;