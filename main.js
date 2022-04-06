// Input handling and basic player movement

// Start kaboom
import {k} from "./kaboom.js"

// Load assets
loadSprite("gosling", "/sprites/bladerunner.jpeg")
loadSprite("enemy", "/sprites/download.jpeg")

// Define player movement speed (pixels per second)
const SPEED = 320

// Add player game object
const player = add([
	sprite("gosling"),
	// center() returns the center point vec2(width() / 2, height() / 2)
  pos(center()),
	area(),
	// body() component gives the ability to respond to gravity
	body(),
])

add([
	rect(width(), 48),
	outline(4),
	area(),
	pos(0, height() - 48),
	// Give objects a solid() component if you don't want other solid objects pass through
	solid(),
])

add([
		sprite("enemy"),
		pos(40,40),
		// Both objects must have area() component to enable collision detection between
		area(),
		"enemy",
])

player.onCollide("enemy", (enemy) => {
	destroy(enemy)
})
  
// onKeyDown() registers an event that runs every frame as long as user is holding a certain key
onKeyDown("left", () => {
	// .move() is provided by pos() component, move by pixels per second
	player.move(-SPEED, 0)
})

onKeyDown("right", () => {
	player.move(SPEED, 0)
})

onKeyDown("up", () => {
if (player.isGrounded()) {
		// .jump() is provided by body()
		player.jump()
	}
})

onKeyDown("down", () => {
	player.move(0, SPEED)
})


// onClick() registers an event that runs once when left mouse is clicked
onClick(() => {
	// .moveTo() is provided by pos() component, changes the position
	player.moveTo(mousePos())
})

add([
	// text() component is similar to sprite() but renders text
	text("Press arrow keys", { width: width() / 2 }),
	pos(12, 12),
])