import BSC from '../assets/native/bsc.png'
import MATIC from '../assets/native/matic.png'
import AVAX from '../assets/native/avax.png'
import ETH from '../assets/native/ethereum.png'


const onRender = (_renderId:any, _callback: Function) => {
    const tmr = setInterval(() => {
        const _element = document.getElementById(_renderId)
        if(_element != null) {
            clearInterval(tmr)
            //has rendered
            if(_callback != null) {
                _callback()
            }
        }
    }, 500)
}
const onToggle = (_id: any, _callback: Function) => {
    onRender(_id, () => {
        //set onclick functions of the main toggle
        const _toggle = document.getElementById(_id);
        if(_toggle != null) {
            const _toggleChild = _toggle.children as HTMLCollectionOf<HTMLDivElement>
            for(let i=0;i<_toggleChild.length;i++) {
                _toggleChild[i].onclick = (event: any) => {
                    //reset all choose
                    for(let i=0;i<_toggleChild.length;i++) {
                        _toggleChild[i].className = ""
                    }
                    //select this one
                    event.target.className = "stake_toggle_select"
                    if(_callback != null) {
                        _callback(event.target.innerText)
                    }
                }
            }
        }
    })
}

const Toggle = (_id: any, _index: any) => {
    onRender(_id, () => {
        //set onclick functions of the main toggle
        const _toggle = document.getElementById(_id);
        if(_toggle != null) {
            const _toggleChild = _toggle.children as HTMLCollectionOf<HTMLDivElement>
            _toggleChild[_index].click();
        }
    })
}

const E = (_id: any) => {
    return document.getElementById(_id)
}

const readErrorMessage = (_err: any) => {
    //to read error messages from transaction
    if(_err.message && !_err.data) {
        let msg = _err.message
        if(msg.indexOf('denied') > -1) {
            //denied message signature
            return "User cancelled the transaction signature."
        }
        else if(msg.indexOf('undefined') > -1) {
            //denied message signature
            return "Something went wrong."
        }else {
            return msg
        }
    }
    else if(_err.data) {
        if(_err.data.message) {
            let msg = _err.data.message
            if(msg.indexOf('price') > -1) {
                //denied message signature
                return "The transaction is underpriced as a result of the fluctuating network gas fee.. Try performing the transaction again"
            }
            else {
                return msg
            }
        }   
    }
    else {return "Transaction error"}
}

const toBig = (_num: any, _multiplier: any) => {
   
        _num = _num + "";let _point: any = 0;
        if(_num.indexOf(".") > -1) {
            //has decimals
            _point = _num.length - (_num.indexOf(".") + 1)
        }
        _num = _num.replace('.','')
        for(let i=0;i<_multiplier - _point;i++) {
            //append zeros
            _num += '0'
        }
        return _num
     
}

const native = (chainId: any) => {
    //to return native currency info
    let chains = []; chains[80001] = chains[137] = {
        name: 'MATIC', symbol: "MATIC", decimals: 18, logo: MATIC
    }
    chains[97] = chains[56]= {
        name: 'BNB', symbol: "BNB", decimals: 18, logo: BSC
    }
    chains[43114] = {
        name: 'AVAX', symbol: "AVAX", decimals: 18, logo: AVAX
    }
    chains[1] = {
        name: 'ETH', symbol: "ETH", decimals: 18, logo: ETH
    }
    if(chains[chainId] != undefined) {return chains[chainId];}
    else {return null}
}
const G = ( name:string, url:string ) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}
const formatNumber = (num: any) => {
    return (Intl.NumberFormat('en-US', {maximumSignificantDigits: 12}).format(num || ""));
}
//to controll the display of web3status view when certain pages are shown
let web3Views = []
const hideWeb3StatusWith = (_id: any) => {
    web3Views.push(_id)
}
//to sign message
const getAccountKey = async (_address: any) => {
    const msgSample = "Please verify this account";
    try {
      const from = _address
      // For historical reasons, you must submit the message to sign in hex-encoded UTF-8.
      // This uses a Node.js-style buffer shim in the browser.
      const msg = `0x${Buffer.from(msgSample, 'utf8').toString('hex')}`;
      const sign = await window.ethereum?.request({
        method: 'personal_sign',
        params: [msg, from, msgSample],
      });
      return sign;
    } catch (err) {
      return null
    }
}
const toElem = (elemString: any) => {
    let div = document.createElement('div')
    div.innerHTML = elemString
    return div.firstElementChild

}
export {toElem, onRender, getAccountKey, onToggle, Toggle, E, G, formatNumber, readErrorMessage, toBig, native, hideWeb3StatusWith, web3Views};