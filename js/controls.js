function addEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    }
}

addEvent(window, "keydown", keydown);
addEvent(window, "keyup", keyup);

function keydown(e) {
    switch (e.keyCode) {
        case keyboardKeys['D']:
            if (Math.abs(p.velocity.x) == 0) {
                p.velocity.x = 1;
                p.velAcc = 0.05;
            } else {
                p.velAcc = 0.07;
            }
            break;
        case keyboardKeys['A']:
            if (Math.abs(p.velocity.x) == 0) {
                p.velocity.x = -1;
                p.velAcc = -0.05;
            } else {
                p.velAcc = -0.07;
            }
            break;
        case keyboardKeys['W']:
            p.velocity.y -= 3;
            if (p.velocity.y < -3) {
                p.velocity.y = -3;
            }
            if (Math.abs(p.velocity.x) > 0.2&&Math.sign(p.velocity.x)==Math.sign(p/velAcc)) {
                p.velocity.x = p.MAX_SPEED * Math.sign(p.velocity.x)
            }
            break;
        default:
            break;
    }
}

function keyup(e) {
    // switch(e) {
    //     case keyboardKeys['D']:
    //         p.velAcc = 0.2;
    //         if(Math.abs(p.velocity.x)>0) {
    //             p.velocity.x = 1;
    //         }
    //         break;
    //     case keyboardKeys['A']:
    //         p.velocity.x = 0;
    //         break;
    //     case keyboardKeys['W']:
    //         p.velocity.y = 0;
    //         break;
    //     default:
    //         break;
    // }
}
