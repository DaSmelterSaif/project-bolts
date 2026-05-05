import { z } from "zod";
import playerConfig from "./player-config.json";

//==== Player Config ====//
//== Player Movement Config ==//
// TODO - Edit the following schema to check for more invalid values (e.g. negative values)
const MovementConfigSchema = z.object({
    baseKickoffVelocity: z.number(),
    kickoffAcceleration: z.number(),
    maintainedMomentumAcceleration: z.number(),
});

const PlayerConfigSchema = z.object({
    movement: MovementConfigSchema,
});

export type MovementConfig = z.infer<typeof MovementConfigSchema>;

// Validate overall config then export only the movement portion.
const parsed = PlayerConfigSchema.parse(playerConfig);

export const movementConfig: MovementConfig = parsed.movement;
