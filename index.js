import { setHeight } from './utils.js'


const localData = JSON.parse(localStorage.getItem('notes'))

window.initPage = function initPage() {
    setHeight('main')
    console.log(localData)
}



function createNoteCards(data) {
    const tmplCard = document.querySelector('#tmpl_card')
    const cards = document.createDocumentFragment()
    const cardsCont = document.createElement('div')
    cardsCont.classList.add('noteCards')

    data.forEach((x)=>{
        var tmpcard = tmplCard.cloneNode(true)
    })
    

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
    allColorPicker.forEach((x) => {
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

function maximizeCard(e) {
    const card = e.currentTarget.closest('.noteCard')
    const picker = card.querySelectorAll('.colorPicker')
    if (Array(...card.classList).includes('maximized')) {
        card.classList.remove('maximized')
        picker.forEach((x) => {
            x.classList.remove('maximized')
        })
    } else {
        card.classList.add('maximized')
        picker.forEach((x) => {
            x.classList.add('maximized')
        })
    }
}

function bgColorClick(e) {
    const card = e.currentTarget.closest('.noteCard')
    const classes = Array(...e.currentTarget.classList)
    const colors = ['red', 'blue', 'yellow', 'black', 'white']
    const color = colors.find((x) => {
        if (classes.includes(x)) {
            return true
        }
        return false
    })
    const cardColor = colors.find((x) => {
        if (Array(...card.classList).includes(x)) {
            return true
        }
        return false
    })
    card.classList.remove(cardColor)
    card.classList.add(color)
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

const maximize = document.querySelectorAll('.maximize')
maximize.forEach((x) => {
    x.addEventListener('click', (e) => { maximizeCard(e) })
})

const color = document.querySelectorAll('.bg-color')
color.forEach((x) => {
    x.addEventListener('click', (e) => { bgColorClick(e) })
})