function addEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    }
}

addEvent(window, "keydown", keydown);
addEvent(window, "keyup", keyup);

function keydown(e){
    switch (e.keyCode) {
        case keyboardKeys['D']:
            p.velocity.x = 3;
            break;
        case keyboardKeys['A']:
            p.velocity.x = -3;
            break;
        case keyboardKeys['W']:
            p.velocity.y = -3;
            break;
        default:
            break;
    }
}

function keyup(e) {
    switch(e) {
        case keyboardKeys['D']:
            p.velocity.x = 0;
            break;
        case keyboardKeys['A']:
            p.velocity.x = 0;
            break;
        case keyboardKeys['W']:
            p.velocity.y = 0;
            break;
        default:
            break;
    }
}
