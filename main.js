// Input handling and basic player movement

// Start kaboom 
import {k} from "./kaboom.js"

// Load assets
loadSprite("gosling", "/sprites/bladerunner.jpeg")
loadSprite("enemy", "/sprites/download.jpeg")
loadSprite("stone", "/sprites/stoneFloor.jpg")
loadSprite("ghost", "/sprites/ghost.jpeg")

// Define player movement speed (pixels per second)
const SPEED = 320

const LEVELS = [
	[
		"@       ",
		"        ",
		"        ",
		"        ",
		"       ^ ",
		"        ",
		"==========================",
	],
	[
		"         ",
		"         ",
		"         ",
		"         ",
		"         ",
		"@        ",
		"=   =   =",
	],
]

scene("game", ({ levelIdx, score }) => {

	gravity(2400)

	// Use the level passed, or first level
	const level = addLevel(LEVELS[levelIdx || 0], {
		width: 64,
		height: 64,
		pos: vec2(100, 200),
		"@": () => [
			sprite("gosling"),
			area(),
			body(),
			origin("bot"),
			"player",
		],
		"^": () => [
			sprite("ghost"),
			area(),
			origin("bot"),
			"enemy",
		],
		"=": () => [
			sprite("stone"),
			area(),
			solid(),
			origin("bot"),
		],
	})

	const player = get("player")[0]
  
	player.onCollide("ghost", (enemy) => {
		destroy(enemy)
	})

	player.onUpdate(() => {
		if (player.pos.y >= 480) {
			go("lose")
		}
    
		if (player.pos.x >= 1200) {
			if (levelIdx < LEVELS.length - 1) {
				// If there's a next level, go() to the same scene but load the next level
				go("game", {
					levelIdx: levelIdx + 1,
				})
			} else {
				// Otherwise we have reached the end of game, go to "win" scene!
				go("win")
			}
		}
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

	scene("lose", () => {

		add([
			text("You Lose"),
			pos(12),
		])

		// Press any key to go back
		onKeyPress(start)

	})

	scene("win", () => {

		add([
			text(`You grabbed 999999 coins!!!`, {
				width: width(),
			}),
			pos(12),
		])

		onKeyPress(start)

	})

	})

	function start() {
		// Start with the "game" scene, with initial parameters
		go("game", {
			levelIdx: 0,
			score: 0,
		})
	}

	start()
