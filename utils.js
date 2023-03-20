export function setHeight(cls, margin = 10) {
    const elems = document.querySelectorAll(`.${cls}`)
    elems.forEach((x) => {
        var height = window.innerHeight - x.offsetTop - margin
        x.style.height = `${height}px`
    })
}

export function randowmHex(no = 8) {
    var str = ''
    for (let i = 0; i <= no; i++) {
        str += Math.floor(Math.random() * 36).toString(36)
    }
    return str
}