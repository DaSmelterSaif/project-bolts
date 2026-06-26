# project-bolts

A Phaser.js game featuring a robot player with 'slippery fast' mechanics and wall running.

## Development

### Implmentation Details

Phaser's arcade physics engine as a base with a custom player
class that controls movement manually and uses overlapping rectangles
to integrate with a set list of existing physics objects.

### Movement

The player will be able to run, jump, wall-run, and fly (level-specific).

**Running mechanics:**

When the player starts moving, he will have a great initial acceleration
until he reaches the base speed. After which the acceleration will be slower.
The player is able to gain more speed as he goes. The player can also press a
set key to accelerate and reach max speeds faster. If the player walks in the
opposite direction, a "skid" deceleration is applied until he reaches a full
stop. After which, the player should either stop completely until the pressed
key is released and pushed again, or wait a very small period of time before
applying an opposite side acceleration, which is smaller than the usual kick
off acceleration, but fast enough to not be too slow or sluggish (TBD).

**Wall-run mechanics:**

When the player jumps and hits a set type of wall, the player will immediately
enter a wall-run, and movement will work just like when on a flat surface.
The wall run will continue until jumping, or reaching the end of the wall.
When jumping, the player will accelerate away from the wall, then after a
certain distance, gravity will take over again. Reaching the end of the wall
with too little speed will cause the player to return to the wall run. If the
player exists the wall with enough speed, he will effectively exit the wall-run,
giving him control to walk to the wall's edge. If a player jumps of a wall and
hits another set type of wall on the other side, he will enter another wall-run
on that wall.

**Flying mechanic:**

When the player reaches a specific point defined by the level he is in, he will
automatically enter into a flying mode. He may or may not be given control to
move up and down (linear movement, no acceleration and deceleration), also defined
by the level. The flying will be completely horizontal, at least initially.

### Camera Architecture

The project maintains a flexible camera system where levels can use a default camera behavior or override it with custom implementations as needed.

### To-Do

- [ ] Add a default camera helper for world bounds, follow, deadzone and right padding
- [ ] Add a `LevelScene` base class with a `configureCamera(camera, bounds, target)` hook
- [ ] Make each level scene extend `LevelScene` and call the shared camera setup from `create()`
- [ ] Add a fixed-camera example override
- [ ] Add a custom/scripted camera example
- [ ] Test in-game and tune the feel
