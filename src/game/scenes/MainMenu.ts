import { Scene } from "phaser";

import { Input } from "phaser";

import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    private map?: Phaser.Tilemaps.Tilemap;
    private groundLayer?:
        | Phaser.Tilemaps.TilemapLayer
        | Phaser.Tilemaps.TilemapGPULayer;
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    keys: Phaser.Types.Input.Keyboard.CursorKeys | any;
    playerBody: Phaser.Physics.Arcade.Body;

    constructor() {
        super("MainMenu");
    }

    create() {
        // NEW CODE: Tilemap setup.
        // Load the map JSON with this.load.tilemapTiledJSON("map", "tilemaps/maps/level1.json")
        // in Preloader, and load the tileset PNG with this.load.image("fantasy-tiles", "tilemaps/tiles/fantasy-tiles.png").
        this.map = this.add.tilemap("map");

        // The first argument must match the tileset name inside Tiled.
        // The second argument must match the texture key loaded in Preloader.
        const tileset = this.map.addTilesetImage(
            "fantasy-tiles",
            "fantasy-tiles",
        );

        if (!tileset) {
            throw new Error(
                "Tileset 'fantasy-tiles' could not be created from the loaded map JSON.",
            );
        }

        // Match this layer name to the layer name inside Tiled.
        this.groundLayer = this.map.createLayer("Tile Layer 1", tileset, 0, 0);

        if (!this.groundLayer) {
            throw new Error(
                "Layer 'Tile Layer 1' could not be created from the loaded map JSON.",
            );
        }

        // Render pixel-art tiles at 2x size.
        const tileRenderScale = 2;
        this.groundLayer.setScale(tileRenderScale);
        this.groundLayer.setPosition(
            0,
            this.scale.height - this.map.heightInPixels * tileRenderScale,
        );

        // Make every non-empty tile in the layer collide with the player.
        this.groundLayer.setCollisionByExclusion([-1]);

        // Keep the physics world aligned with the visible game area.
        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

        // The player is a dynamic body, so gravity and collisions will affect it.
        this.player = this.physics.add
            .sprite(50, 350, "mainCharacter")
            .setScale(2);

        this.playerBody = this.player.body as Phaser.Physics.Arcade.Body;

        this.player.setCollideWorldBounds(true);

        this.player.setDamping(true);
        this.player.setDragX(0.7);
        this.player.setMaxVelocity(500);

        // Collide the player against the tile layer, not against individual static images.
        this.physics.add.collider(this.player, this.groundLayer);

        this.keys = this.input.keyboard?.addKeys({
            up: Input.Keyboard.KeyCodes.W,
            left: Input.Keyboard.KeyCodes.A,
            down: Input.Keyboard.KeyCodes.S,
            right: Input.Keyboard.KeyCodes.D,
        });

        // OLD CODE: manual static-image level building.
        // This is the previous approach you had before switching to a tilemap.
        /*
        this.platform1 = this.add
            .tileSprite(0, 480, 704, 32, "groundTile")
            .setOrigin(0, 1);

        this.platform1.setScale(2, 2);

        this.physics.add.existing(this.platform1, true);

        this.player = this.physics.add
            .sprite(50, 350, "mainCharacter")
            .setScale(2);

        this.physics.add.collider(this.player, this.platform1);

        // Or, if you prefer a looped layout:
        for (const platformDefinition of level.platforms) {
            const platform = this.physics.add.staticImage(
                platformDefinition.x,
                platformDefinition.y,
                platformDefinition.key,
            );

            platform.setOrigin(0, 1);
            platform.setScale(platformDefinition.scaleX ?? 2, platformDefinition.scaleY ?? 2);
            platform.refreshBody();

            this.platforms.push(platform);
        }
        */

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        try {
            if (this.keys.right.isDown) {
                this.player.setAccelerationX(this.newAccelerationAbs());
            } else if (this.keys.left.isDown) {
                this.player.setAccelerationX(-this.newAccelerationAbs());
            } else {
                this.player.setAccelerationX(0);
            }
        } catch (e) {
            console.error("Something went wrong with the keybinds.");
        }
    }
    newAccelerationAbs() {
        if (Math.abs(this.playerBody.velocity.x) < 200) {
            return 1000;
        } else {
            return 200;
        }
    }
}
