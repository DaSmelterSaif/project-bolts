import Phaser from "phaser";

import { movementConfig } from "../config/schema";

// TODO - Fix movement config
// TODO - Choose how to import config files
export class BoltsCharacter extends Phaser.Physics.Arcade.Sprite {
    // Reads the key state and converts it into this character's movement intent.
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
