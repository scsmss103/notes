export function setHeight(cls,margin=10){
    console.log('setHeight fired')
    const elems = document.querySelectorAll(`.${cls}`)
    elems.forEach((x)=>{
        var height = window.innerHeight - x.offsetTop - margin
        x.style.height = `${height}px`
    })
}