import Phaser from "phaser";
import { z } from "zod";

import playerConfig from "../config/player-config.json";

// TODO - Complete the code (check if needs export or something)
const PlayerConfigSchema = z.object({
    baseKickoffVelocity: z.number(),
    kickoffAcceleration: z.number(),
    maintainedMomentumAcceleration: z.number(),
});
