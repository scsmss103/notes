import { setHeight } from './utils.js'

window.initPage = function initPage() {
    setHeight('main')
}



function createPinnedNotes() {
    return
}

function navBtn() {
    alert('this is nav btn')
}

window.noteCardFocus = function noteCardFocus(e) {
    const parent = e.currentTarget.parentElement
    const pin = parent.querySelector('.pinContainer')
    const action = parent.querySelector('.actionContainer')

    pin.style.visibility = 'visible'
    action.style.visibility = 'visible'
}

window.noteCardFocusOut = function noteCardFocusOut(e) {
    const parent = e.currentTarget.parentElement
    const pin = parent.querySelector('.pinContainer')
    const action = parent.querySelector('.actionContainer')

    pin.style.visibility = null
    action.style.visibility = null
}

function toggleColorPicker(e) {
    const parent = e.currentTarget.parentElement
    const picker = parent.querySelector('.colorPicker')
    if (window.getComputedStyle(picker).getPropertyValue('visibility') === 'hidden') {
        picker.style.visibility = 'visible'
    } else {
        picker.style.visibility = null
    }
}

//eventListener
const pickers = document.querySelectorAll('.clrPicker')
pickers.forEach((x)=>{
    x.addEventListener('click',(e)=>{toggleColorPicker(e)})
})