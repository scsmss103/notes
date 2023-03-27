import { randowmHex, setHeight } from './utils.js'

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
        //alert('saved to localStorage')
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
const bgcolors = ['red', 'blue', 'yellow', 'black', 'white']

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

function searchHandler(e) {
    const searchStr = e.currentTarget.value
    const txt = document.querySelectorAll('.noteText')
    const cards = document.querySelectorAll('.noteCard')
    let ids = []
    txt.forEach((x) => {
        let val = x.value.toLowerCase()
        if (val.includes(searchStr)) {
            const card = x.closest('.noteCard')
            if (card) {
                ids.push(card.getAttribute('id'))
            }
        }
    })
    cards.forEach((x) => {
        if (!ids.includes(x.id)) {
            x.style.display = 'none'
        } else {
            x.style.display = 'flex'
        }
    })
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
        var tmpcard = tmplCard.content.firstElementChild.cloneNode(true)
        tmpcard.id = x.id
        //note
        const txt = tmpcard.querySelector('.noteText')
        txt.innerText = x.note
        txt.addEventListener('input', (e) => noteStorage.updateNoteField(x.id, 'note', e.currentTarget.value))
        //pin
        const pin = tmpcard.querySelector('.pinIcon')
        pin.addEventListener('click', (e) => {
            const elem = e.currentTarget
            if (Array(...elem.classList).includes('pinned')) {
                elem.classList.remove('pinned')
                noteStorage.updateNoteField(x.id, 'pinned', false)
                refreshNoteCards()
            } else {
                elem.classList.add('pinned')
                noteStorage.updateNoteField(x.id, 'pinned', true)
                refreshNoteCards()
            }
        })
        //bg color
        if (x.bgColor !== 'yellow') {
            tmpcard.classList.remove('yellow')
            tmpcard.classList.add(x.bgColor)
        }
        //delete
        const del = tmpcard.querySelector('.deleteIcon')
        del.addEventListener('click', () => { noteStorage.delete(x.id); refreshNoteCards() })

        if (x.pinned) {
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
    var nearestNoteCar = e.currentTarget.closest('.noteCard')
    if (!nearestNoteCar) {
        nearestNoteCar = e.currentTarget.closest('.newNote')
    }
    const allColorPicker = nearestNoteCar.querySelectorAll('.colorPicker')
    const parent = e.currentTarget.parentElement
    const picker = parent.querySelector('.colorPicker')
    if (window.getComputedStyle(picker).getPropertyValue('display') === 'none' || picker.style.display == 'none') {
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
    var card = e.currentTarget.closest('.noteCard')
    if (!card) {
        card = e.currentTarget.closest('.newNote')
    }
    const classes = Array(...e.currentTarget.classList)

    const color = bgcolors.find((x) => {
        if (classes.includes(x)) {
            return true
        }
        return false
    })
    const cardColor = bgcolors.find((x) => {
        if (Array(...card.classList).includes(x)) {
            return true
        }
        return false
    })
    card.classList.remove(cardColor)
    card.classList.add(color)
    if (card.id) {
        noteStorage.updateNoteField(card.id, 'bgColor', color)
    }
}

function resetNewNote() {
    const newNote = document.querySelector('.newNote')
    //bg color
    const color = bgcolors.find((x) => {
        if (Array(...newNote.classList).includes(x)) {
            return true
        } else {
            return false
        }
    })
    newNote.classList.remove(color)
    newNote.classList.add('white')
    //note
    const txt = newNote.querySelector('.newNoteText')
    txt.value = ''
    //pin
    const pin = newNote.querySelector('.pinIcon')
    if (Array(...pin.classList).includes('pinned')) {
        pin.classList.remove('pinned')
    }

}

function saveNewNote() {
    const newNote = document.querySelector('.newNote')
    let tmpData = {}
    tmpData.id = randowmHex()
    //note
    const txt = newNote.querySelector('.newNoteText')
    tmpData.note = txt.value
    //bg color
    const color = bgcolors.find((x) => {
        if (Array(...newNote.classList).includes(x)) {
            return true
        } else {
            return false
        }
    })
    tmpData.bgColor = color
    //pin
    const pin = newNote.querySelector('.pinIcon')
    if (Array(...pin.classList).includes('pinned')) {
        tmpData.pinned = true
    } else {
        tmpData.pinned = false
    }
    noteStorage.add(tmpData)
    resetNewNote()
}

//eventListener Functions
function newNoteTextHandler(e) {
    const elem = e.currentTarget
    elem.style.height = 'auto' //reset height first otherwise no shrink
    elem.style.height = elem.scrollHeight + 'px'
}

function newNotePinHandler(e) {
    const elem = e.currentTarget
    const newNoteActions = document.querySelector('.newNoteActionEdit')
    const toolTip = newNoteActions.querySelector('.pinIcon~div')
    if (Array(...elem.classList).includes('pinned')) {
        elem.classList.remove('pinned')
        toolTip.innerHTML = 'Pin note'
    } else {
        elem.classList.add('pinned')
        toolTip.innerHTML = 'Unpin note'
    }
}

function newNoteSaveHandler() {
    saveNewNote()
    refreshNoteCards()
}

//eventListener
function createNoteEventListeners() {

    const inp = document.querySelector('.inpSearch')
    inp.addEventListener('input', searchHandler)

    const pickersIcon = document.querySelectorAll('.clrPicker')
    pickersIcon.forEach((x) => {
        x.addEventListener('click', toggleColorPicker)
    })

    const colorPicker = document.querySelectorAll('.colorPicker')
    colorPicker.forEach((x) => {
        x.addEventListener('mouseover', mouseOverColorPicker)
    })

    const maximize = document.querySelectorAll('.maximize')
    maximize.forEach((x) => {
        x.addEventListener('click', maximizeCard)
    })

    const color = document.querySelectorAll('.bg-color')
    color.forEach((x) => {
        x.addEventListener('click', bgColorClick)
    })

    const newNoteTxt = document.querySelector('.newNoteText')
    newNoteTxt.addEventListener('input', newNoteTextHandler)

    //new notes btns
    const newNoteActions = document.querySelector('.newNoteActionEdit')

    const newNotePin = newNoteActions.querySelector('.pinIcon')
    newNotePin.addEventListener('click', newNotePinHandler)

    const newNoteBtns = document.querySelector('.newNoteActionCont>div:last-child')
    Array(...newNoteBtns.children).forEach((x) => {
        if (x.innerHTML.toLowerCase() === 'save') {
            x.addEventListener('click', newNoteSaveHandler)
        } else {
            x.addEventListener('click', resetNewNote)
        }
    })
}