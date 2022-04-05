import {k} from "./kaboom.js"

k.scene("start", () => {
    k.add([
        k.scale(2),
        k.text("start screen!"),
        k.pos(50, 80),
    ])
})

// add a piece of text at position (120, 80)
