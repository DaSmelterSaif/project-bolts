// Made to avoid running the Phaser library in the Node environment.
class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class Sprite {}

export default {};
export const Geom = { Rectangle };
export const Physics = { Arcade: { Sprite } };
