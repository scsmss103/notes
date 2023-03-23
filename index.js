import { setHeight } from './utils.js'


class useLocalStorage {
    constructor(key) {
        this.key = key
        let dta = localStorage.getItem(key)
        if (dta) {
            this.data = JSON.parse(dta)
        } else {
            this.data = []
        }
    }
    #copyData() {
        return JSON.parse(JSON.stringify([...this.data]))
    }
    #findIdx(data, field, value) {
        let idx = false
        data.some((x, i) => {
            if (x[field] == value) {
                idx = i
                return true
            } else {
                return false
            }
        })
        return idx
    }
    set(data) {
        localStorage.setItem(this.key, JSON.stringify(data))
        alert('saved to localStorage')
    }
    get() {
        this.data = JSON.parse(localStorage.getItem(this.key))
        return this.data
    }
    add(data) {
        this.data.push(data)
        this.set(this.data)
    }
    delete(id) {
        let tmpDta = this.#copyData()
        let idx = this.#findIdx(tmpDta, 'id', id)
        if (idx !== false) {
            tmpDta.splice(idx, 1)
            this.data = tmpDta
            this.set(this.data)
        }
    }
    updateNote(data) {
        let tmpDta = this.#copyData()
        let idx = this.#findIdx(tmpDta, 'id', data.id)
        if (idx !== false) {
            tmpDta.splice(idx, 1, data)
            this.data = tmpDta
            this.set(this.data)
        }
    }
    updateNoteField(id, field, value) {
        let tmpDta = this.#copyData()
        let idx = this.#findIdx(tmpDta, 'id', id)
        if (idx !== false) {
            let row = tmpDta[idx]
            row[field] = value
            tmpDta.splice(idx, 1, row)
            this.data = tmpDta
            this.set(this.data)
        }
    }
}

const noteStorage = new useLocalStorage('notes')

/// testing start ///
const testBtn = document.getElementById('testBtn')
testBtn.addEventListener('click', () => {
    noteStorage.updateNoteField('4', 'note', 'braa testing updated field from btn')
    console.log('thats data: ', noteStorage.get())
    refreshNoteCards()
})
/// testing end ///

//const localData = JSON.parse(localStorage.getItem('notes'))

window.initPage = function initPage() {
    setHeight('main')
    //console.log(localData)
    createNoteCards(noteStorage.data)
}

function refreshNoteCards() {
    const cards = document.querySelectorAll('.noteCards:not(#tmpl_card)')
    cards.forEach((x) => {
        x.remove()
    })
    initPage()
}

function createNoteCards(data) {
    const tmplCard = document.querySelector('#tmpl_card')
    const cardsPinned = document.createDocumentFragment()
    const cardsUnpinned = document.createDocumentFragment()
    const cardsContPinned = document.createElement('div')
    cardsContPinned.classList.add('noteCards')
    const cardsContUnpinned = document.createElement('div')
    cardsContUnpinned.classList.add('noteCards')

    data.forEach((x) => {
        var tmpcard = tmplCard.cloneNode(true)
        tmpcard.removeAttribute('id')
        tmpcard.style.display = null
        const txt = tmpcard.querySelector('.noteText')
        txt.innerText = x.note
        if (x.pinned) {
            const pin = tmpcard.querySelector('.pinIcon')
            pin.classList.add('pinned')
            if (cardsPinned.childElementCount !== 0) {
                cardsPinned.insertBefore(tmpcard, cardsPinned.children[0])
            } else {
                cardsPinned.appendChild(tmpcard)
            }
        } else {
            if (cardsUnpinned.childElementCount !== 0) {
                cardsUnpinned.insertBefore(tmpcard, cardsUnpinned.children[0])
            } else {
                cardsUnpinned.appendChild(tmpcard)
            }
        }
    })
    cardsContPinned.appendChild(cardsPinned)
    cardsContUnpinned.appendChild(cardsUnpinned)
    const pinnedNotes = document.querySelector('.pinnedNotes')
    const allNotes = document.querySelector('.allNotes')
    pinnedNotes.appendChild(cardsContPinned)
    allNotes.appendChild(cardsContUnpinned)

    createNoteEventListeners()
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
    const nearestNoteCar = e.currentTarget.closest('.noteCard')
    const allColorPicker = nearestNoteCar.querySelectorAll('.colorPicker')
    const parent = e.currentTarget.parentElement
    const picker = parent.querySelector('.colorPicker')
    if (window.getComputedStyle(picker).getPropertyValue('display') === 'none') {
        allColorPicker.forEach((x) => {
            x.style.display = 'none'
        })
        picker.style.display = 'grid'
    } else {
        picker.style.display = 'none'
    }
}

function mouseOverColorPicker(e) {
    e.currentTarget.addEventListener('mouseleave', (e) => { mouseLeaveColorPicker(e) })
}

function mouseLeaveColorPicker(e) {
    e.currentTarget.removeEventListener('mouseleave', (e) => { mouseLeaveColorPicker(e) })
    e.currentTarget.style.display = ''
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
function createNoteEventListeners() {
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

    const newNoteTxt = document.querySelector('.newNoteText')
    newNoteTxt.addEventListener('input', (e) => {
        const elem = e.currentTarget
        elem.style.height = 'auto' //reset height first otherwise no shrink
        elem.style.height = elem.scrollHeight + 'px'
    })

}