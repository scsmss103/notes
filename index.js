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
    //close all other picker first
    const nearestNoteCar = e.currentTarget.closest('.noteCard')
    const allColorPicker = nearestNoteCar.querySelectorAll('.colorPicker')
    allColorPicker.forEach((x)=>{
        x.style.visibility = null
    })
    //open color picker
    const parent = e.currentTarget.parentElement
    const picker = parent.querySelector('.colorPicker')
    if (window.getComputedStyle(picker).getPropertyValue('visibility') === 'hidden') {
        picker.style.visibility = 'visible'
    } else {
        picker.style.visibility = null
    }
}

function mouseOverColorPicker(e) {
    e.currentTarget.addEventListener('mouseleave', (e) => { mouseLeaveColorPicker(e) })
}

function mouseLeaveColorPicker(e) {
    e.currentTarget.removeEventListener('mouseleave', (e) => { mouseLeaveColorPicker(e) })
    e.currentTarget.style.visibility = null
}

//eventListener
const pickersIcon = document.querySelectorAll('.clrPicker')
pickersIcon.forEach((x) => {
    x.addEventListener('click', (e) => { toggleColorPicker(e) })
})

const colorPicker = document.querySelectorAll('.colorPicker')
colorPicker.forEach((x) => {
    x.addEventListener('mouseover', (e) => { mouseOverColorPicker(e) })
})