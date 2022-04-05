import {k} from "./kaboom.js"

// add a piece of text at position (120, 80)
k.add([
    k.scale(2),
    k.text("hello world"),
    k.pos(50, 80),
]);

k.onClick(() => k.go("start"))