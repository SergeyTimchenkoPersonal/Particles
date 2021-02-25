;(function () {
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')
	const w = (canvas.width = innerWidth)
	const h = (canvas.height = innerHeight)
	const particles = []
	const properties = {
		backgroundColor: 'rgba(17, 17, 19, 1)',
		particleColor: 'rgba(255, 40, 40, 1)',
		particleRadius: 3,
		particleCount: 70,
		particleMaxVelocity: 1,
		lineLength: 150,
		particleLife: 6,
		stepLength: 2,
		maxOffset: 3,
	}
	document.querySelector('body').appendChild(canvas)
	window.onresize = () => {
		const w = (canvas.width = innerWidth)
		const h = (canvas.height = innerHeight)
	}

	class Particle {
		constructor() {
			this.x = Math.random() * w
			this.y = Math.random() * h
			this.velocityX =
				Math.random() * (properties.particleMaxVelocity * 1.5)
			this.velocityY =
				Math.random() * (properties.particleMaxVelocity * 1.5)
			this.life = Math.random() * properties.particleLife * 60
		}

		position() {
			;(this.x + this.velocityX > w && this.velocityX > 0) ||
			(this.x + this.velocityX < 0 && this.velocityX < 0)
				? (this.velocityX *= -1)
				: this.velocityX
			;(this.y + this.velocityY > h && this.velocityY > 0) ||
			(this.y + this.velocityY < 0 && this.velocityY < 0)
				? (this.velocityY *= -1)
				: this.velocityY
			this.x += this.velocityX
			this.y += this.velocityY
		}

		redraw() {
			ctx.beginPath()
			ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2)
			ctx.closePath()
			ctx.fillStyle = properties.particleColor
			ctx.fill()
		}

		reCalculateLife() {
			if (this.life < 1) {
				this.x = Math.random() * w
				this.y = Math.random() * h
				this.velocityX =
					Math.random() * (properties.particleMaxVelocity * 2) -
					properties.particleMaxVelocity
				this.velocityY =
					Math.random() * (properties.particleMaxVelocity * 2) -
					properties.particleMaxVelocity
				this.life = Math.random() * properties.particleLife * 60
			}
			this.life--
		}
	}

	const reDrawBackground = () => {
		ctx.fillStyle = properties.backgroundColor
		ctx.fillRect(0, 0, w, h)
	}

	const drawLines = () => {
		let x1, y1, x2, y2, length, opacity
		for (let i in particles) {
			for (let j in particles) {
				x1 = particles[i].x
				y1 = particles[i].y
				x2 = particles[j].x
				y2 = particles[j].y
				let dist = getDistance({ x: x1, y: y1 }, { x: x2, y: y2 })
				let stepsCount = dist / properties.stepLength
				if (dist < properties.lineLength) {
					opacity = 1 - dist / properties.lineLength
					ctx.lineWidth = '0.5'
					ctx.strokeStyle = `rgba(255, 40, 40, ${opacity})`
					ctx.beginPath()
					ctx.moveTo(x1, y1)
					for (let i = stepsCount; i > 1; i--) {
						let pathLength = getDistance(
							{ x: x1, y: y1 },
							{ x: x2, y: y2 }
						)
						let offset =
							Math.sin((pathLength / dist) * Math.PI) *
							properties.maxOffset

						x1 +=
							(x2 - x1) / i + Math.random() * offset * 2 - offset
						y1 +=
							(y2 - y1) / i + Math.random() * offset * 2 - offset

						ctx.lineTo(x1, y1)
					}
					ctx.closePath()
					ctx.stroke()
				}
			}
		}
	}

	function getDistance(a, b) {
		return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
	}

	const reDrawParticles = () => {
		for (let i in particles) {
			particles[i].reCalculateLife()
			particles[i].position()
			particles[i].redraw()
		}
	}

	const loop = () => {
		reDrawBackground()
		reDrawParticles()
		drawLines()
		requestAnimationFrame(loop)
	}

	const init = () => {
		for (let i = 0; i < properties.particleCount; i++) {
			particles.push(new Particle())
		}
		loop()
	}

	init()
})()
