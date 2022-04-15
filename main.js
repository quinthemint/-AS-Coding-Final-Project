// Input handling and basic player movement

// Start kaboom 
import {k} from "./kaboom.js"

// Load assets
loadSprite("blurbyWalk", "/sprites/strip1.png", {
	// The image contains 5 frames layed out horizontally, slice it into individual frames
	sliceX: 20,
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
			from: 14,
			to: 19,
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
var killCount = 0
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
		"     +   =  ",
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
const tutorial = [
	[
		"@    ",
		"           ",
		"             ",
		"==============*",
		"           ",

	]
]

scene("title", () => {
	function addButton(txt, p, f) {

		const btn = add([
			text(txt),
			pos(p),
			area({ cursor: "pointer", }),
			scale(1),
			origin("center"),
		])
	
		btn.onClick(f)
	
		btn.onUpdate(() => {
			if (btn.isHovering()) {
				const t = time() * 10
				btn.color = rgb(
					wave(128, 0, t),
					wave(128, 0, t + 2),
					wave(128, 0, t + 4),
				)
				btn.scale = vec2(1.2)
			} else {
				btn.scale = vec2(1)
				btn.color = rgb()
			}
		})
	
	}
	add([
		text("BLURBY'S RETURN"),
		color(128, 0, 128),
		pos(center().sub(100,100)),
		scale(3),
		origin("center"),
	])

	addButton("play", vec2(200,100), () => go("game", {
			levelIdx: 0,
			score: 0,
		}))
	
	addButton("tutorial", vec2(200,150), () => go("tutorial"))
	//add([
	//	text("play"),
	//	pos(center().sub(0,50)),
	//	scale(1),
	//	area(),
	//	origin("center")
	//])
	//onMouseDown(() => go("game", {
	//	levelIdx: 0,
	//	score: 0,
	//}))
})

scene("tutorial", () => {
	add([
		text("ur bad kid"),
	])
})

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
			// rect(64,64),
			// color(RED),
			area(),
			// pos(),
			body(),
			origin("bot"),
			state("idle", ["idle", "pickup"]),
			// outline(),
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
	const twig = get("twig")[0]
	
	// function weapon() {
	// let hasWeapon = false;

	// return {

	// 	destroy() {
	// 	 hasWeapon = true;
	// 	},
		
	// 	weaponCheck() {
	// 		return hasWeapon
	// 	}, 
	// 	update() {
	// 	}
	// }
	// }
	// twig.onStateUpdate("idle", () => {
		console.log("touch: " + twig.state + " " + player.isColliding(twig))
	// 	if (player.isColliding(twig)) {
			
	// 		twig.enterState("pickup")
	// 	}
	// })

	onUpdate(() => {
			console.log("touch: " + twig.state + " " + player.isColliding(twig))
		if (player.isColliding(twig)) {
			
			twig.enterState("pickup")
		}
	})
	
	twig.onStateEnter("pickup", () => {
		add([
			sprite("twig"),
			pos(twig.pos),
			follow(player),
			area(),
			origin("center"),
			"twig",
		])
	})
		
	player.play("idle")

	
	// twig.onCollide("ghost", (ghost, twig) => {
	// 	destroy(ghost),
	// 	destory(twig)
	// 	})

	player.onUpdate(() => {

		camPos(player.pos)

		if (player.pos.y >= 1000) {
			go("lose")
		}
	
		// if (twig.weaponCheck()) {
		// 		debug.log("hi")
		// 		player.onCollide("ghost", (ghost) => {
		// 		debug.log("aklsdjf;lasdkjf;lasdkjf")
		// 		destroy(ghost),
		// 			killCount = killCount + 1,
		// 			debug.log(killCount)
		// 	})
		// }

	})
	
	
	
	// 	if (!twig.weaponCheck()) {
	// 	player.onCollide("ghost", (ghost) => {
	// 		go("lose")
	// 	})
	// }

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
		go("title")
	}

	start()
