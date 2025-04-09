const canvas = document.getElementById("dotsCanvas");
const ctx = canvas.getContext("2d");

let dots = [];
let stars = [];

function resizeCanvas() {       //resize canvas dynamically based on window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createDots();
    createStars();
}

function createDots() {
    dots = [];
    for(let i=0; i<150; i++) {
        dots.push({
            x: Math.random() * canvas.width,        // random x position
            y: Math.random() * canvas.height,       // random y position

            radius: Math.random() * 4 + 2,          //random dot size (2 to 6px)

            dx: Math.random() * 1.5 - 0.75,         //random horizontal speed
            dy: Math.random() * 1.5 - 0.75,         //random vertical speed

            color: "#ffffff"
        });
    }
}

function createStars() {
    stars = [];
    for(let i=0; i<200; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,

            size: Math.random() * 2,                // random star size (0 to 2px)
            speed: Math.random() * 0.5 + 0.2,       //varying speed for parallax effect
            brightness: Math.random(),
            twinkleSpeed: Math.random() * 0.02 + 0.01
        });
    }
}

let mouseX = -100, mouseY = -100;

canvas.addEventListener("mousemove", (event) => {           //track the mouse position relative to the canvas
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

function drawBackground() {
    let gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 50,
        canvas.width / 2, canvas.height / 2, canvas.width
    );

    let color1 = "rgb(5, 5, 10)";
    let color2 = "rgb(10, 10, 20)";
    let color3 = "rgb(15, 15, 30)";

    gradient.addColorStop(0, color1);
    gradient.addColorStop(0.5, color2);
    gradient.addColorStop(1, color3);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStars() {
    stars.forEach(star => {
        // Move stars towards the left for a parallax effect
        star.x -= star.speed;

        if(star.x < 0) {
            star.x = canvas.width;
            star.y = Math.random() * canvas.height;
        }

        // twinkle effect by changing brightness
        star.brightness += star.twinkleSpeed;
        if(star.brightness > 1 || star.brightness < 0) {
            star.twinkleSpeed *= -1;            // reverse direction to create a flicker effect
        }

        // Draw the star with its varying brightness
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function drawLines() {
    for(let i=0; i<dots.length; i++) {
        for(let j = i+1; j<dots.length; j++) {
            let dist = Math.sqrt((dots[i].x - dots[j].x) ** 2 + (dots[i].y - dots[j].y) ** 2);

            if(dist < 100) {            // only draw lines for close dots
                let alpha = 1 - (dist / 100);
                let hue = 200 - (dist / 2);

                ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawStars();

    dots.forEach(dot => {
        let distance = Math.sqrt((dot.x - mouseX) ** 2 + (dot.y - mouseY) ** 2);

        if(distance < 120) {            // repel effect when the cursor is close
            let angle = Math.atan2(dot.y - mouseY, dot.x - mouseX);
            dot.x += Math.cos(angle) * 5;
            dot.y += Math.sin(angle) * 5;
        }
        else {  
            // Move dots normally
            dot.x += dot.dx;
            dot.y += dot.dy;
        }

        if(dot.x < 0 || dot.x > canvas.width) dot.dx *= -1;
        if(dot.y < 0 || dot.y > canvas.height) dot.dy *= -1;

        // Draw each dot
        ctx.fillStyle = dot.color;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
        ctx.fill();
    });

    drawLines();

    requestAnimationFrame(animateDots);
}

// initialize animation when the page loads
window.onload = () => {
    resizeCanvas();
    animateDots();
};
window.addEventListener("resize", resizeCanvas);


//  Custom cursor effect - adds twinkling stars at cursor position
document.addEventListener("mousemove", (event) => {
    const star = document.createElement("div");
    star.classList.add("cursor-star");
    document.body.appendChild(star);

    // position the star at the cursor location
    star.style.left = `${event.clientX}px`;
    star.style.top = `${event.clientY}px`;

    let size = Math.random() * 12 + 4;      // random size between 4px to 16px
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    setTimeout(() => {
        star.remove();          //remove star after animation
    }, 500);
});
