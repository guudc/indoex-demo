import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useState, MouseEvent } from 'react'
import styled from 'styled-components';
import { onRender, E } from './utility';
let sho: any = Math.random(); let showTimer: any
const ModalHead = styled.div `
   position:fixed;
   top:0px;left:0px;
   width:100vw;
   height:1px;
   display:none;
   align-items:flex-start;
   z-index:400;
`
const ModalBody = styled.div `
   padding:15px 20px;
   background-color: ${(props: any) => props.theme.dark1};
   min-height:40px;
   color:${(props: any) => props.theme.text1};
   font-size:15px;
   margin-left:auto;margin-right:80px;
   margin-top:120px;
   box-shadow:0 0 6px 3px rgba(0,0,0,.1);
   border-radius:10px;
   display:flex;
   align-items:center;
   max-width:350px;
`
const ModalMsg = styled.span `
    margin-left:10px;
    margin-right:10px;
`

const showModalInfo = (_canShow: any) => {
    if(_canShow) {
        if(E('modal_info_msg') != null){
            (E('modal_info_msg') as HTMLDivElement).style.display = "flex"
        }
        //stop timer
        try{clearTimeout(showTimer)} catch(e) {}
    }
    else{
        if(E('modal_info_msg') != null){
            (E('modal_info_msg') as HTMLDivElement).style.display = "none"
        }
    }
}
const hideModalInfo = (_timeOut: any = 3000) => {
     try{clearTimeout(showTimer)} catch(e) {}
     showTimer = setTimeout(() => {
        (E('modal_info_msg') as HTMLDivElement).style.display = "none"
     }, _timeOut)
}
const setModalMsg = (_msg: any) => {
    if(E('modal_info_msg_body') != null){
         (E('modal_info_msg_body') as HTMLDivElement).innerHTML = _msg
    }
}
const setInfo = (params) => {
    showModalInfo(true)
    setModalMsg(params.msg || "")
    setModalStaus(params.status || "")
    hideModalInfo(params.duration || 3000)
}
const setModalStaus = (_type: any) => {
    const _t = E('modal_info_msg_status') as HTMLDivElement
    if(_type == 'error'){
        if(_t != null){
            (E('modal_info_msg_status') as HTMLDivElement).className = "fas fa-times"
            _t.style.color = "red"
        }
    }
    else if(_type == 'good'){
        if(_t != null){
            (E('modal_info_msg_status') as HTMLDivElement).className = "fas fa-check-circle"
            _t.style.color = "limegreen"
        }
    }
    else {
        if(_t != null){
            (E('modal_info_msg_status') as HTMLDivElement).className = "fas fa-spinner fa-spin"
            _t.style.color = ""
        }
    }
}
const ModalInfo: React.FC<{}> = (): React.ReactElement => {
 
    return (
        <>
            <ModalHead id='modal_info_msg'>
                <ModalBody>
                    <span id='modal_info_msg_status' className='fas fa-spinner fa-spin'></span>
                    <ModalMsg id='modal_info_msg_body'>Loading</ModalMsg>
                </ModalBody>
            </ModalHead>
        </>
    )

}

export {ModalInfo, setInfo, showModalInfo, hideModalInfo, setModalMsg, setModalStaus}