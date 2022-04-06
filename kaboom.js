import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs"

// initialize kaboom context
export const k = kaboom({
    width: 1200,
    height: 600,
    font: "sinko",
    canvas: document.querySelector("#mycanvas"),
    background: [ 0, 0, 255, ],
    global: true
});