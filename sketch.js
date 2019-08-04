function setup() {
    createCanvas(600, 600);
}

let u = {
    x : 250,
    y : 525,
    spd : 5,
    width : 90,
    height : 30
}
let al = {
    x : [65, 185, 305, 425, 545],
    y : [100, 100, 100, 100, 100],
    dif : 120,
    width : 40,
    rad : 20,
    spd : .5,
    downSpd : .5,
    yes : [true, true, true, true, true],
    move : [],
    bump1 : 0,
    bump2 : 4,
    left : true,
    right : false,
    down : true
}
let bul = {
    spd : 5,
    width : 12,
    rad : 6,
    //for bul number
    x : [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300],
    y : [525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525],
    move : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    yes : [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
}

let tics = -1
let counter = 0
let dcYes = false
let restart = false
let level = 1

function draw(){
    background(0, 0, 0);
    //Hit Box Variables//
    let hb = {
        x1 : [al.x[0] - (al.rad) - bul.rad, al.x[1] - (al.rad) - bul.rad, al.x[2] - (al.rad) - bul.rad, al.x[3] - (al.rad) - bul.rad, al.x[4] - (al.rad) - bul.rad],
        x2 : [al.x[0] + (al.rad) + bul.rad, al.x[1] + (al.rad) + bul.rad, al.x[2] + (al.rad) + bul.rad, al.x[3] + (al.rad) + bul.rad, al.x[4] + (al.rad) + bul.rad],
        y1 : [al.y[0] - (al.rad) - bul.rad, al.y[1] - (al.rad) - bul.rad, al.y[2] - (al.rad) - bul.rad, al.y[3] - (al.rad) - bul.rad, al.y[4] - (al.rad) - bul.rad],
        y2 : [al.y[0] + (al.rad + bul.rad), al.y[1] + (al.rad + bul.rad), al.y[2] + (al.rad + bul.rad), al.y[3] + (al.rad + bul.rad), al.y[4] + (al.rad + bul.rad)],
    }
    fill(200, 200, 200);
    //Circle//
    for (i=0; i < al.yes.length; i++){
        if (al.yes[i]){
            circle(al.x[i], al.y[i], al.width)
        }
    }
    //Direction: Left & Right//
    //Get the number of the 2 aliens on the left and right//
    for (i=0; i < al.yes.length; i++){
        if (al.yes[i]){
            al.move.push(i)
        }
    }
    al.bump1 = Math.min(...al.move)
    al.bump2 = Math.max(...al.move)
    al.move = []
    //If those number aliens touch the edge, go the other way//
    if (al.right == true){
        for (i=0; i<al.yes.length; i++){
            al.x[i] += al.spd
        }
    } else if (al.left == true){
        for (i=0; i<al.yes.length; i++){
            al.x[i] -= al.spd
        }
    }
    if (al.x[al.bump1] - al.rad < 0){
        al.right = true
        al.left = false
    } else if (al.x[al.bump2] + al.rad > 600){
        al.left = true
        al.right = false
    }
    //Direction: Down//
    for (i=0; i < al.yes.length; i++){
        al.y[i]+=al.downSpd
        if (al.y[i] > u.y){
            gameOver()
        }
    }
    console.log(al.y[1])
    //Rectangle//
    rect(u.x, u.y, u.width, u.height)
    if (keyIsDown(LEFT_ARROW)){
        if (u.x > 0){u.x -= u.spd}
    } else if (keyIsDown(RIGHT_ARROW)){
        if (u.x < width - u.width){ u.x += u.spd}
    }
    //HitBoxes//
    for (i = 0; i < al.yes.length; i++){
        for (j = 0; j < bul.x.length; j++){
            if (bul.y[j] < hb.y2[0] && bul.y[j] > -50){
                if (bul.x[j] > hb.x1[i] && bul.x[j] < hb.x2[i]){
                    al.yes[i]=false
                }
            }
        }
    }
    //Bullet will move with the alien after hitting so it doesn't affect a fast alien//
    for (i=0; i<bul.y.length; i++){
        if (bul.y[i] <= hb.y1[0]){
            if (al.right == true){
                bul.x[i]+=al.spd
            } else if (al.left == true){
                bul.x[i]-=al.spd
            }
        }
    }
    //Bullets//
    for (i=0; i<bul.y.length; i++){
        //For first round
        if (bul.move[i] <= tics && bul.yes[i]){
            fill(255, 0, 0)
            circle(bul.x[i], bul.y[i]-=bul.spd, bul.width)
        }
        //bullet is false if past the screen//
        if (bul.y[i] < 0){
            bul.yes[i] = false;
            bul.y[i] = -100
        } else {
            bul.yes[i] = true;
        }
        //Last bullet fired makes dcYes true. If the last bullet is fired and the counter is on bullet[i], bullet[i]'s y = u.y
        if (bul.y[bul.y.length-1] < u.y - 10 && bul.yes[i]){
            dcYes = true;
        }
        if (dcYes == true && dumbCounter == i){
            bul.y[i] = u.y;
            dumbCounter += 0.000000001
        } 
    }
    //Next Round//
    if (!al.yes[0] && !al.yes[1] && !al.yes[2] && !al.yes[3] && !al.yes[4]){
        al.spd += .7
        al.downSpd += .5
        level += 1
        for (i = 0; i < al.yes.length; i++){
            al.yes[i] = true
            al.y[i] = 100
        }
    }
}

function keyPressed(){
    if (keyCode == 32){
        tics += 1
        counter = tics%30
        dumbCounter = counter
        bul.x[counter] = u.x + (u.width/2);
    }
}

function gameOver() {
    fill(0, 0, 0)
    rect(0, 0, 600, 600)
    textSize(95);
    fill(255,0,0);
    text("GAME OVER", 10, 250);
    console.log("lol done")
    fill(200, 200, 200)
    rect(225, 325, 150, 30)
    textSize(22);
    fill(0,0,0);
    text("Restart", 265, 350);
}