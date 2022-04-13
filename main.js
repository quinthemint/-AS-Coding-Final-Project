// Input handling and basic player movement

// Start kaboom 
import {k} from "./kaboom.js"

// Load assets
loadSprite("blurbyWalk", "/sprites/walkingstrip2.png", {
	// The image contains 5 frames layed out horizontally, slice it into individual frames
	sliceX: 5,
	// Define animations
	anims: {
		// {
		// 	// Starts from frame 0, ends at frame 3
		// 	from: 0,
		// 	to: 3,
		// 	// Frame per second
		// 	speed: 5,
		// 	loop: true,
		// },
		"run": {
			from: 1,
			to: 4,
			speed: 10,
			loop: true,
		},
		"idle": 1
		// This animation only has 1 frame
		// "jump": 8
	},
})

loadSprite("gosling", "/sprites/bladerunner.jpeg")
loadSprite("ghost", "/sprites/ghost.png")
loadSprite("twig", "/sprites/twig.png")
loadSprite("sword", "/sprites/sword.png")
loadSprite("holdingtwig", "/sprites/holdingtwig.png")
loadSprite("stone", "/sprites/stoneFloor.jpg")

// Define player movement speed (pixels per second)
const SPEED = 320
var hasWeapon = false;
var killCount = 0;
const LEVELS = [
	[
		"@     ^   ",
		"  +       ",
		"         *",
		"          ",
		"==========",
	],
	[
		"@    +   ^ ",
		"           ",
		"           ",
		"              *",
		"=    =    =",
	],
	[
		"@          ",
		"           *",
		"        =  ",
		"     =     ",
		"==         ",
	],
	[
		"@  ++   ^^ ",
		"           ",
		"            * ",
		"========== ",
		"           ",
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
			sprite("blurbyWalk"),
			area(),
			body(),
			origin("bot"),
			"player",
		],
		"^": () => [
			sprite("ghost"),
			area(),
			body(),
			scale(0.1,0.1),
			origin("bot"),
			"ghost",
		],
		"+": () => [
			sprite("twig"),
			area(),
			body(),
			origin("bot"),
			state("idle", [ "idle","pickup" ]),
			"twig",
		],
		"*": () => [
			sprite("gosling"),
			area(),
			solid(),
			"gosling",
			origin("bot"),
		],
		"=": () => [
			sprite("stone"),
			area(),
			solid(),
			origin("bot"),
		],
	})

	const player = get("player")[0]
  
	const twig = get("twig") [0]
	
	// const dir = player.pos.sub(twig.pos).unit()

	// twig.onStateEnter("pickup", async () => {
	// 	add([
	// 		sprite("twig"),
	// 		pos(twig.pos),
	// 		move(dir, 30),
	// 		area(),
	// 		origin("center"),
	// 		"twig",
	// 	])
	// })
		
	player.play("idle")

	player.onCollide("twig", (twig) => {
		destroy(twig),
		hasWeapon = true
	})

	// if (hasWeapon) {
	// 	add([
	// 		sprite("twig"),
	// 		pos(twig.pos),
	// 		area(),
	// 		origin("center"),
	// 		"twig",
	// 	])
	// 	twig.enterState("pickup")
	// }
	
	// twig.onCollide("ghost", (ghost, twig) => {
	// 	destroy(ghost),
	// 	destory(twig)
	// 	})

	player.onUpdate(() => {

		camPos(player.pos)

		if (player.pos.y >= 1000) {
			go("lose")
		}

		if (hasWeapon) {
			player.onCollide("ghost", (ghost) => {
				destroy(ghost),
					killCount = killCount + 1,
					debug.log(killCount),
				hasWeapon = false
			})
		}
	// 	if (!hasWeapon) {
	// 	player.onCollide("ghost", (ghost) => {
	// 		go("lose")
	// 	})
	// }
	
	})

player.onCollide("gosling",() => {
			if (levelIdx < LEVELS.length - 1) {
				// If there's a next level, go() to the same scene but load the next level
				go("game", {
					levelIdx: levelIdx + 1,
				})
				
			} else {
				// Otherwise we have reached the end of game, go to "win" scene!
				go("win")
			}
})
	
player.onGround(() => {
	if (!isKeyDown("left") && !isKeyDown("right")) {
		player.play("idle")
	} else {
		player.play("run")
	}
})
	
onKeyRelease(["left", "right"], () => {
	// Only reset to "idle" if player is not holding any of these keys
	if (player.isGrounded() && !isKeyDown("left") && !isKeyDown("right")) {
		player.play("idle")
	}
})

player.onAnimEnd("idle", () => {
	// You can also register an event that runs when certain anim ends
})
  
	// onKeyDown() registers an event that runs every frame as long as user is holding a certain key
	onKeyDown("left", () => {
	player.move(-SPEED, 0)
	player.flipX(true)
	// .play() will reset to the first frame of the anim, so we want to make sure it only runs when the current animation is not "run"
	if (player.isGrounded() && player.curAnim() !== "run") {
		player.play("run")
	}
})

onKeyDown("right", () => {
	player.move(SPEED, 0)
	player.flipX(false)
	if (player.isGrounded() && player.curAnim() !== "run") {
		player.play("run")
	}
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
		debug.log(hasWeapon)
	})

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
			text("You killed " + killCount + " enemies!!!", {
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
