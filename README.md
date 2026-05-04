# Camera architecture

The project should keep one simple default camera behavior and let each level override it with its own code when needed.

## To-Do

- Add a default camera helper for world bounds, follow, deadzone and right padding.
- Add a `LevelScene` base class with a `configureCamera(camera, bounds, target)` hook.
- Make each level scene extend `LevelScene` and call the shared camera setup from `create()`.
- Add a fixed-camera example override.
- Add a custom/scripted camera example.
- Test in-game and tune the feel.
