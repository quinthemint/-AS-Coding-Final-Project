import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs"

// initialize kaboom context
export const k = kaboom({
    width: 640,
    height: 300,
    scale: 2,
    font: "sinko",
    canvas: document.querySelector("#mycanvas"),
    background: [ 0, 0, 255, ],
    global: true
});