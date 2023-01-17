import {setHeight} from './utils.js'

window.initPage = function initPage(){
    console.log('init page')
    setHeight('main')
    return
}



function createPinnedNotes(){
return
}

function navBtn(){
    alert('this is nav btn')
}

/*window.noteCardClick = function noteCardClick(e){
    //alert('thats click')
    //console.log('click fired')
    //console.log(e.currentTarget.querySelector('.noteText'))
    const txt = e.currentTarget.querySelector('.noteText')
    const pin = e.currentTarget.querySelector('.pinContainer')
    const action = e.currentTarget.querySelector('.actionContainer')

    pin.style.visibility = 'visible'
    action.style.visibility = 'visible'
    txt.focus()
}

window.noteCardBlur = function noteCardBlur(e){
    console.log('blur fired')
    const txt = e.currentTarget.querySelector('.noteText')
    const pin = e.currentTarget.querySelector('.pinContainer')
    const action = e.currentTarget.querySelector('.actionContainer')
    pin.style.visibility = 'hidden'
    action.style.visibility = 'hidden'
}*/

window.noteCardFocus = function noteCardFocus(e){
    const parent = e.currentTarget.parentElement
    const pin = parent.querySelector('.pinContainer')
    const action = parent.querySelector('.actionContainer')

    pin.style.visibility = 'visible'
    action.style.visibility = 'visible'
}

window.noteCardFocusOut = function noteCardFocusOut(e){
    const parent = e.currentTarget.parentElement
    const pin = parent.querySelector('.pinContainer')
    const action = parent.querySelector('.actionContainer')

    pin.style.visibility = null
    action.style.visibility = null
}
