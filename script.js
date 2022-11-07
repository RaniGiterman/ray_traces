const APP_WIDTH = 640
const APP_HEIGHT = 300
const wall_amount = 6
let mouseX;
let mouseY

let app = new PIXI.Application({
    width: APP_WIDTH, height: APP_HEIGHT, backgroundColor: 0x000000,
});

document.getElementById("game").appendChild(app.view)

for (let i = 0; i < wall_amount; i++) {
    let wall = new PIXI.Sprite(PIXI.Texture.WHITE);
    wall.width = 50;
    wall.height = 50;
    wall.tint = 0xffffff;
    wall.x = getRndInteger(wall.width, APP_WIDTH - wall.width)
    wall.y = getRndInteger(wall.height, APP_HEIGHT - wall.height)
    //wall.angle = getRndInteger(0, 360)

    app.stage.addChild(wall);
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



document.addEventListener("mousemove", e => {
    mouseX = e.clientX
    mouseY = e.clientY

    remove_ray_trace()

    if (mouseX > APP_WIDTH || mouseY > APP_HEIGHT)
        return console.log("Out of canvas")

    draw_ray_trace(mouseX, mouseY)

})


function remove_ray_trace() {
    //for (let i = 0; i < app.stage.children.length; i++) {
    // if (app.stage.children[i].sign == "func_dot") { 
    //   app.stage.children.splice(i, 1) 
    //   i--
    // }
    // }

    let arr = app.stage.children.splice(0, 7)
    app.stage.children = arr
}

function draw_ray_trace(x, y) {
    let angle = 0
    while (angle <= 179) { // 180 will have the same effect as 0
        // m = tan(theta)
        // y = mx + b
        let m = Math.tan(angle)

        // find b. enter y and x from the paramaters to the function
        // move mx to the left hand side
        // y - mx = b

        let b = y - m * x
        fire(`${m}x + ${b}`)

        angle += 20
    }
}


function fire(equation) {
    //console.log(equation)
    //for (let x = -APP_WIDTH; x < APP_WIDTH; x += 1) {
    for (let x = mouseX; x < APP_WIDTH; x += 1) {
        let y;
        try {
            // y = eval(equation.replace("x", `*(${x})`));
            let s = interpret(equation, x);
            y = eval(s);
        } catch (error) {
            continue;
        }

        if (!pointCollide(x, y)) break
        draw(x, y);
    }

    for (let x = mouseX; x > -APP_WIDTH; x -= 1) {
        let y;
        try {
            // y = eval(equation.replace("x", `*(${x})`));
            let s = interpret(equation, x);
            y = eval(s);
        } catch (error) {
            continue;
        }

        if (!pointCollide(x, y)) break
        draw(x, y);
    }
}

function pointCollide(x_point, y_point) {
    for (let i = 0; i < 6; i++) {
        if (x_point >= app.stage.children[i].x &&
            x_point <= app.stage.children[i].x + app.stage.children[i].width) {
            if (y_point >= app.stage.children[i].y &&
                y_point <= app.stage.children[i].y +
                app.stage.children[i].height)
                return false
        }

    }
    return true

}

function interpret(equation, x) {
    let newEquation = "";
    let power_of = null
    for (let i = 0; i < equation.length; i++) {
        if (equation[i] == "x") {
            if (!isNaN(equation[i - 1]) && equation[i - 1] != " ") {
                // number before
                newEquation += `*(${x})`;
            } else {
                // no number before
                newEquation += `(${x})`;
            }
            continue;
        }
        if (equation[i] == "^") {
            newEquation += "**";
            power_of = equation[i + 1]
            // meaning next index gotta be the power of
            continue;
        }
        newEquation += equation[i];
    }

    newEquation = newEquation.replace("sin", "Math.sin");
    newEquation = newEquation.replace("cos", "Math.cos");
    newEquation = newEquation.replace("tan", "Math.tan");

    if (power_of) {
        newEquation = newEquation.replace(`-(${x})**${power_of}`, `-((${x})**${power_of})`)
    }
    // ^ Unary operator used immediately before exponentiation expression. Parenthesis must be used to disambiguate operator precedence

    return newEquation;
}

function draw(x, y) {
    let func_dot = new PIXI.Sprite(PIXI.Texture.WHITE);
    func_dot.width = 1;
    func_dot.height = 1;
    func_dot.tint = 0xffffff
    func_dot.x = x// + APP_WIDTH / 2;
    func_dot.y = y// * -1 + APP_HEIGHT / 2;
    func_dot.sign = "func_dot"
    app.stage.addChild(func_dot);
}
