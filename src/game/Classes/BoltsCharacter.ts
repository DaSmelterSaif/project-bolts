import * as Phaser from "phaser";

import { movementConfig } from "../config/schema";

export class MovementBody {
    x: number;
    y: number;

    constructor() {}
}

export class BoltsCharacterController {
    scene: Phaser.Scene;
    sprite: Phaser.GameObjects.Sprite;
    width: number;
    height: number;
    /**
     * x-coordinate of the middle of character
     */
    x: number;
    /**
     * y-coordinate of the bottom of the character
     */
    y: number;
    velx = 0;
    vely = 0;
    accX = 0;
    accY = 0;
    gravityX: number;
    gravityY: number;
    keys: any;
    public sweptRectVisible = false;
    private sweptRectGraphics: Phaser.GameObjects.Graphics;
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        keys: any,
        scale: number, // Integer
    ) {
        this.scene = scene;
        // Assume texture exists.
        const scaleInt = Math.round(scale);

        this.sprite = scene.add.sprite(x, y, texture);
        this.sprite.setOrigin(0.5, 1);
        this.sprite.setScale(scaleInt);

        const inferredWidth = this.sprite.displayWidth;
        const inferredHeight = this.sprite.displayHeight;

        this.width = inferredWidth;
        this.height = inferredHeight;
        this.x = x;
        this.y = y;

        this.sweptRectGraphics = scene.add.graphics();
        this.gravityX = scene.physics.world.gravity.x;
        this.gravityY = scene.physics.world.gravity.y;
        this.keys = keys;
    }

    /**
     * Handles keybinds to control character
     *
     * @param keys
     * @returns
     */
    public handleKeybinds(
        keys: Phaser.Types.Input.Keyboard.CursorKeys | any,
    ): number {
        if (keys?.right?.isDown) {
            return 1;
        }

        if (keys?.left?.isDown) {
            return -1;
        }

        return 0;
    }

    private setAccelerationX(value: number) {
        this.accX = value;
    }

    /**
     * Applies acceleration based on the already-decided movement intent.
     *
     * @param direction
     * @returns
     */
    public applyHorizontalMovement(direction: number): void {
        const body = this.sprite.body as Phaser.Physics.Arcade.Body | null;

        if (!body) {
            return;
        }

        if (direction > 0) {
            this.setAccelerationX(this.newAccelerationAbs(body));
        } else if (direction < 0) {
            this.setAccelerationX(-this.newAccelerationAbs(body));
        } else {
            this.setAccelerationX(0);
        }
    }

    /**
     * Switch to a lower acceleration once the character is already moving fast enough.
     *
     * @param body
     * @returns
     */
    private newAccelerationAbs(body: Phaser.Physics.Arcade.Body): number {
        if (Math.abs(body.velocity.x) < movementConfig.baseKickoffVelocity) {
            return movementConfig.kickoffAcceleration;
        }

        return movementConfig.maintainedMomentumAcceleration;
    }

    private updateMovement() {}

    public update() {
        this.updateMovement();
        this.sweptRectGraphics.setVisible(this.sweptRectVisible);
        this.renderSweptRect();
    }

    /**
     * Used to draw the swept rectangle for debugging
     *
     * @returns {void}
     */
    private renderSweptRect(): void {
        if (!this.sweptRectVisible) {
            this.sweptRectGraphics.clear();
            return;
        }

        const dt = this.scene.game.loop.delta / 1000;
        const bounds = this.getSweptRect(dt);

        this.sweptRectGraphics.clear();
        this.sweptRectGraphics.lineStyle(1, 0xffffff, 1);
        this.sweptRectGraphics.strokeRect(
            bounds.x,
            bounds.y,
            bounds.width,
            bounds.height,
        );
    }

    /**
     * Used to avoid clipping when moving the character
     *
     * @param {number} dt - Delta T (frametime)
     * @returns {Phaser.Geom.Rectangle}
     */
    private getSweptRect(dt: number) {
        // Note that dt is directly connected to the framerate
        let rect_left = this.x - this.width / 2;
        let rect_width = this.width;
        let rect_top = this.y - this.height;
        let rect_height = this.height;

        // Set position and width of swept rectangle.
        // Assumptions:
        // - this.x is in the middle of the character
        if (this.velx > 0) {
            rect_width = Math.ceil(this.width + this.velx * dt);
        } else if (this.velx < 0) {
            rect_left = Math.floor(this.x + this.velx * dt - this.width / 2);
            rect_width = Math.ceil(this.width - this.velx * dt);
        }

        if (this.vely > 0) {
            // Assumptions:
            // - y origin of the character is at the very bottom
            rect_height = Math.ceil(this.height + this.vely * dt);
        } else if (this.vely < 0) {
            rect_top = Math.floor(this.y - this.height + this.vely * dt);
            rect_height = Math.ceil(this.height - this.vely * dt);
        }

        return new Phaser.Geom.Rectangle(
            rect_left,
            rect_top,
            rect_width,
            rect_height,
        );
    }
}

// TODO - Fix movement config
// TODO - Choose how to import config files
/**
 * NOTE: This class is pending removal and is
 * to be replaced with BoltsCharacterController.
 */
export class BoltsCharacter extends Phaser.Physics.Arcade.Sprite {
    // Reads the key state and converts it into this character's movement intent.
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
    }

    public handleKeybinds(
        keys: Phaser.Types.Input.Keyboard.CursorKeys | any,
    ): number {
        if (keys?.right?.isDown) {
            return 1;
        }

        if (keys?.left?.isDown) {
            return -1;
        }

        return 0;
    }

    // Applies acceleration based on the already-decided movement intent.
    public applyHorizontalMovement(direction: number): void {
        const body = this.body as Phaser.Physics.Arcade.Body | null;

        if (!body) {
            return;
        }

        if (direction > 0) {
            this.setAccelerationX(this.newAccelerationAbs(body));
        } else if (direction < 0) {
            this.setAccelerationX(-this.newAccelerationAbs(body));
        } else {
            this.setAccelerationX(0);
        }
    }

    // Switch to a lower acceleration once the character is already moving fast enough.
    private newAccelerationAbs(body: Phaser.Physics.Arcade.Body): number {
        if (Math.abs(body.velocity.x) < movementConfig.baseKickoffVelocity) {
            return movementConfig.kickoffAcceleration;
        }

        return movementConfig.maintainedMomentumAcceleration;
    }
}
