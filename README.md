# project-bolts

A Phaser.js game featuring a robot player with 'slippery fast' mechanics and wall running.

## Development

### Camera Architecture

The project maintains a flexible camera system where levels can use a default camera behavior or override it with custom implementations as needed.

### To-Do

- [ ] Add a default camera helper for world bounds, follow, deadzone and right padding
- [ ] Add a `LevelScene` base class with a `configureCamera(camera, bounds, target)` hook
- [ ] Make each level scene extend `LevelScene` and call the shared camera setup from `create()`
- [ ] Add a fixed-camera example override
- [ ] Add a custom/scripted camera example
- [ ] Test in-game and tune the feel
