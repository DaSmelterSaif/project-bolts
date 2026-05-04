import Phaser from "phaser";
import { z } from "zod";

import playerConfig from "../config/player-config.json";

// TODO - Complete the code (check if needs export or something)
const PlayerConfigSchema = z.object({
    baseKickoffVelocity: z.number(),
    kickoffAcceleration: z.number(),
    maintainedMomentumAcceleration: z.number(),
});

const MovementConfigSchema = PlayerConfigSchema.pick({
    baseKickoffVelocity: true,
    kickoffAcceleration: true,
    maintainedMomentumAcceleration: true,
});

export type MovementConfig = z.infer<typeof MovementConfigSchema>;
