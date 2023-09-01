
// Canvas
const canvas = document.querySelector('canvas.canva')

// Context
const ctx = canvas.getContext('2d')

// background color
const backgroundColor = 0x000000

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

canvas.width = sizes.width
canvas.height = sizes.height

// Sounds
const sound = new Audio('assets/explosion.wav')

/**
 * Objects
 */

// Objects Path
const planePath = 'assets/plane.svg'
const misselPath = 'assets/missel.svg'

// Load SVG
const plane = new Image()
plane.src = planePath

const missel = new Image()
missel.src = misselPath

// Positions
var planePosition = {
    x: sizes.width / 2,
    y: sizes.height / 2
}

var misselPosition = {
    x: sizes.width / 2,
    y: sizes.height
}

var anglePlane = 0

// Draw function
const draw = () =>
{       
    // Clear canvas
    ctx.clearRect(0, 0, sizes.width, sizes.height)
    // Draw Objects    
    // draw plane
    drawPlane(anglePlane)
    // draw missel
    drawMissel()
    // draw text of sound command
    const text = 'Aperte S para desligar o som'
    ctx.font = '20px Arial'
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.fillText(text, sizes.width / 8, sizes.height - 20)

}

const drawPlane = (angle) =>
{
    ctx.translate(mouse.x, mouse.y)
    ctx.rotate(angle)
    ctx.drawImage(plane, -50, -50, 100, 100)
    ctx.rotate(-angle)
    ctx.translate(-mouse.x, -mouse.y)
}

const drawMissel = () =>
{
    // Make missel look to the plane
    const angle = Math.atan2(misselPosition.y - mouse.y, misselPosition.x - mouse.x)
    ctx.translate(misselPosition.x, misselPosition.y)
    ctx.rotate(angle - Math.PI / 2)
    ctx.drawImage(missel, -50, -100, 100, 100)
    // draw point
    // ctx.beginPath()
    // ctx.arc(0, 0, 5, 0, Math.PI * 2)
    // ctx.fillStyle = 'red'
    // ctx.fill()
    // ctx.closePath()
    ctx.rotate(-angle + Math.PI / 2)
    ctx.translate(-misselPosition.x, -misselPosition.y)
}
/**
 * Canvas
    */
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update canvas
    canvas.width = sizes.width
    canvas.height = sizes.height
})

// Se apertar o botão direito do mouse
window.addEventListener('contextmenu', (e) =>
{
    state = 1

    // Prevent context menu
    e.preventDefault()
})
    

// mouse

var mouse = {
    x: sizes.width / 2,
    y: sizes.height / 2
}

window.addEventListener('mousemove', (e) =>
{
    // Update mouse position
    mouse.x = e.clientX
    mouse.y = e.clientY
})

/**
 * Animate
 */

const updatePlanePosition = () =>
{
    planePosition.x = mouse.x - 50
    planePosition.y = mouse.y - 50
}

const vel = 10

const updateMisselPosition = () =>
{
    if (state == 1){
        const angle2Plane = Math.atan2(misselPosition.y - mouse.y, misselPosition.x - mouse.x)
        misselPosition.x -= Math.cos(angle2Plane) * vel
        misselPosition.y -= Math.sin(angle2Plane) * vel
    }
}

const checkCollision = () =>
{
    const distance = Math.sqrt(Math.pow(misselPosition.x - mouse.x, 2) + Math.pow(misselPosition.y - mouse.y, 2))
    if (distance < 100 && state == 1){
        console.log('colidiu')
        sound.play()
        state = 2
    }
}

// State machine
var state = 0

var haveSound = true
// se apertar s desliga o som
window.addEventListener('keydown', (e) =>
{
    if (e.key == 's'){
        if (haveSound){
            sound.muted = true
            haveSound = false
        }
        else{
            sound.muted = false
            haveSound = true
        }
    }   
})

const tick = () =>
{
    if( state < 2){
        // Update plane position
        updatePlanePosition()
        // Update missel position
        updateMisselPosition()

        // Check collision
        checkCollision()

        // Draw
        draw()
    }
    else{
        // Draw
        const text = 'Game Over!'
        ctx.font = '50px Arial'
        ctx.fillStyle = 'red'
        ctx.textAlign = 'center'
        ctx.fillText(text, sizes.width / 2, sizes.height / 2)
        // wait 3 seconds
        setTimeout(() => {
            // refresh page
            window.location.reload()
        }
        , 5000)
    }
    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()