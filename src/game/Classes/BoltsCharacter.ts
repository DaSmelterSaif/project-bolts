import Phaser from "phaser";

import playerConfig from "../config/player-config.json";

//// To be replaced by schema.ts
type MovementConfig = {
    baseKickoffVelocity: number;
    kickoffAcceleration: number;
    maintainedMomentumAcceleration: number;
};

// TODO - Make a generic function that deals with incorrect config imports
function readMovementConfig(config: typeof playerConfig): MovementConfig {
    const baseKickoffVelocity = Number(config.baseKickoffVelocity);
    const kickoffAcceleration = Number(config.kickoffAcceleration);
    const maintainedMomentumAcceleration = Number(
        config.maintainedMomentumAcceleration,
    );

    if (
        !Number.isFinite(baseKickoffVelocity) ||
        !Number.isFinite(kickoffAcceleration) ||
        !Number.isFinite(maintainedMomentumAcceleration)
    ) {
        throw new Error(
            "player-config.json must contain numeric movement values.",
        );
    }

    return {
        baseKickoffVelocity,
        kickoffAcceleration,
        maintainedMomentumAcceleration,
    };
}
////

const movementConfig = readMovementConfig(playerConfig);

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
