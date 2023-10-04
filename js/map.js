//PlatForms
new BlockCollision(0, 72, 49, 15, null, /*new Sprite("/assets/sprite_sheet.png")*/); //1
new BlockCollision(132, 99, 143, 22, null); //2
new BlockCollision(403, 73, 77, 22, null); //3
new BlockCollision(0, 225, 100, 17, null); //4
new BlockCollision(165, 282, 103, 17, null); //5
new BlockCollision(321, 205, 94, 25, null); //6
new BlockCollision(409, 225, 71, 15, null); //7
// new Block(79, 388, 303, 100, null); //8
new BlockCollision(-5, 388, canvas.width + 5, 100, "red"); //Test

class MapObject {
    constructor(x, y, sprite) {
        this.position = new Vector(x, y);
        this.sprite = sprite;
    }

    show () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        if (this.sprite != null) {
            this.sprite.show(5, this.position.x, this.position.y);
        }
    }
}