
// Start kaboom 
import {k} from "./kaboom.js"

// Load assets
loadSprite("blurbyWalk", "/sprites/walk+idletransparent.png", {
	sliceX: 6,
	anims: {
		"run": {
			from: 1,
			to: 5,
			speed: 10,
			loop: true,
		},
		"idle": 0
	},
})

loadSprite("enemy", "/sprites/enemy.png", {
	sliceX: 2,
	anims: {
		walk: {
			from: 0, 
			to: 1, 
			speed: 10,
			loop: true,
		},
		"idle": 0
	},
})

loadSprite("gosling", "/sprites/bladerunner.jpeg")
loadSprite("twig", "/sprites/sword1.png")
loadSprite("stone", "/sprites/cobbletext.png")

var SPEED = 320
const JUMP_FORCE = 600
var killCount = 0
const LEVELS = [
	[
		"@       ",
		"          ",
		"           ",
		"   + +  ^   ",
		"=========== =====*",
	],
	[
		"@                                    ^+ ",
		"                          ",
		"                            ",
		"                 =  ====      ===*",
		"===  =  =  =  =               ",
	],
	[
		"@          ^    ^              ==    ==    ==",
		"          ===  ===  ===  = ==                             *",
		"    +  =                                            == ",
		"    =     ",
		"==         ",
	],
	[
		"@      ",
		"         ^    ^",
		"   ++  ===  ====  =* ",
		"======   ",
		"           ",
	],
		[
		"@      ",
		"        ^    ",
		"   +    ====  ^  ",
		"=======      ===*", 
		"           ",
	],
	[
		"@      ",
		"             ",
		"   +    ^           ^",
		"==================  =   *   ",
		"           ",
	],
	[
		"@                                                       +^",
		"                                     == ",
		"                             ==  ==      ",
		"=== === ==  ==  =   =   ===                ===*  ",
		"           ",
	],
		[
			"@    ",
			"           ",
			"                    +                      ^ ",
			"===============  ============================================    ================      ================================*",
			"           ",
	
		],
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
		pos(center().sub(100, 100)),
		scale(3),
		origin("center"),
	])

	addButton("play", vec2(200, 100), () => go("game", {
		levelIdx: 0,
		score: 0,
	}))
	
	addButton("tutorial", vec2(200, 150), () => go("game", {
		levelIdx: 7,
	})
	)
})

scene("game", ({ levelIdx, score }) => {

	gravity(2400)

	const level = addLevel(LEVELS[levelIdx || 0], {
		width: 64,
		height: 64,
		// pos: vec2(100, 200),
		"@": () => [
			sprite("blurbyWalk"),
			area(),
			body({ jumpForce: JUMP_FORCE, }),
			origin("bot"),
			"player",
		],
		"^": () => [
			sprite("enemy"),
			area(),
			body(),
			origin("bot"),
			"ghost",
		],
		"+": () => [
			sprite("twig"),
			area(),
			origin("bot"),
			state("idle", ["idle", "pickup"]),
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
	const twigs = get("twig")

	onCollide("twig","player",(twig, p) => {
			twig.enterState("pickup")
			destroy(twig)
	})
	
	onCollide("ghost","player",(g, p) => {
			go("lose")
		})
	
	twigs.forEach((twig) => {
		twig.onStateEnter("pickup", () => {
		console.log("pickedup!")
	add([
			sprite("twig"),
			pos(),
			area(),
			follow(player, vec2(-5, -2)),
			rotate(0),
			origin("bot"),
			"twig_pickup",
			spin(),
		])
		})
	})

function spin() {
	let spinning = false
	let tp = get("twig_pickup")[0]
	return {
		id: "spin",
		update() {
			if (spinning) {
				this.angle += 1200 * dt()
				onCollide("twig_pickup", "ghost", (tp, g) => {
					console.log("colliding ghost")
					destroy(g)
					killCount = killCount + 1
					console.log(killCount)
				}) 
				if (this.angle >= 120) {
					spinning = false
					destroy(tp)
					console.log("twig destroyed")
					console.log(spinning)
				}
			}
		},
		spin() {
			console.log("its spinning!");
			spinning = true
		},
		
	}
}
	onKeyPress("space", () => {

		let tp = get("twig_pickup")[0]
		if (tp) {
			wait(0.1, () =>
				tp.spin()
			)
			wait(0.3, () =>
				destroy(tp),
				shake(60)
			)
		}
})
	
	player.play("idle")

	player.onUpdate(() => {

		camPos(player.pos)

		if (player.pos.y >= 1000) {
			go("lose")
		}
	
	})

	player.onCollide("gosling", () => {
	SPEED = 320
			if (levelIdx < LEVELS.length - 1 && levelIdx != 6) {
				go("game", {
					levelIdx: levelIdx + 1,
				})
				
			} else {
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
	if (player.isGrounded() && !isKeyDown("left") && !isKeyDown("right")) {
		player.play("idle")
	}
})

player.onAnimEnd("idle", () => {
	// You can also register an event that runs when certain anim ends
})
  
	onKeyPress("shift", () => {
		SPEED = 1200
		wait(0.1, () => {
			SPEED = 320
		})
	})

	onKeyDown("left", () => {
	const tp = get("twig_pickup")[0]
	player.move(-SPEED, 0)
		player.flipX(true)
		if (tp) {
			tp.flipX(true)
		}
	if (player.isGrounded() && player.curAnim() !== "run") {
		player.play("run")
	}
})

	onKeyDown("right", () => {
	const tp = get("twig_pickup")[0]
	player.move(SPEED, 0)
		player.flipX(false)
		if (tp) {
			tp.flipX(false)
		}
	if (player.isGrounded() && player.curAnim() !== "run") {
		player.play("run")
	}
})

	onKeyPress("up", () => {
		
			player.doubleJump()
	})

	onKeyDown("down", () => {
		player.move(0, SPEED)
	})

	
	
	onClick(() => {
		// .moveTo() is provided by pos() component, changes the position
	})

	scene("lose", () => {

		add([
			text("You Lose"),
			pos(12),
		])

		
		onKeyPress(start)
		onClick(start)

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

		if (levelIdx == 7) {
			add([
				text("Welcome back Blurby! It's been a while. Let's get you warmed up! Use the arrow keys to move left, right, and to jump."),
				pos(50,25),
			])
			add([
				text("Here's your trusty sword! you can pick it up by walking over to it. Press space to swing your sword. Be careful though, you only have one swing per sword! Go ahead and kill that فارس up there."),
				pos(1150, 25),
			])
			add([
				text("Good job! Uh oh, theres a jump coming up. Press the up arrow again while in the air to perform a double jump."),
				pos(3000, 25)
			])
			add([
				text("Awesome! Kinda sucks though, you're only moving at 2 times the speed of light. Press shift to go 10x for a quick dash!"),
				pos(4200, 25)
			])
			add([
				text("Nice! Did you know, if you were at 10% power and you swung that sword, spacetime itself would collapse leaving you alone in an infinitely vast void! Thank god you're only using 0.23%. Enter this portal to go back to the menu!"),
				pos(5600, 25)
			])


	}


	})

	function start() {
		// Start with the "title" scene, with initial parameters
		go("title")
	}

	start()
