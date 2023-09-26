function addEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    }
}

addEvent(window, "keydown", Keypress);
addEvent(window, "keyup", keyup);

function Keypress(e){
    switch (e.keyCode) {
        case keyboardKeys['D']:
            p.velX = 5;
            break;
        case keyboardKeys['A']:
            p.velX = -5;
            break;
        case keyboardKeys['W']:
            p.velY = -5;
            break;
        default:
            break;
    }
}

function keyup(){
    p.velX = 0;
}
