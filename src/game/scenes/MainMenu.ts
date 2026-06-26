import { Scene } from "phaser";

import { Input } from "phaser";

import { EventBus } from "../EventBus";

// import { BoltsCharacter } from "../Classes/BoltsCharacter";
import { BoltsCharacterController } from "../Classes/BoltsCharacter";

export class MainMenu extends Scene {
    private map?: Phaser.Tilemaps.Tilemap;
    private groundLayer?:
        | Phaser.Tilemaps.TilemapLayer
        | Phaser.Tilemaps.TilemapGPULayer;
    // player: BoltsCharacter;
    player: BoltsCharacterController;
    keys: Phaser.Types.Input.Keyboard.CursorKeys | any;

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

        // The player is now a reusable gameplay object instead of a bare sprite.
        // this.player = new BoltsCharacter(this, 50, 350, "mainCharacter");
        // this.add.existing(this.player);
        // this.physics.add.existing(this.player);

        this.keys = this.input.keyboard?.addKeys({
            up: Input.Keyboard.KeyCodes.W,
            left: Input.Keyboard.KeyCodes.A,
            down: Input.Keyboard.KeyCodes.S,
            right: Input.Keyboard.KeyCodes.D,
        });

        this.player = new BoltsCharacterController(
            this,
            50,
            350,
            "mainCharacter",
            this.keys,
            2,
        );
        this.player.sweptRectVisible = true;

        // this.player.setScale(2);
        // this.player.setCollideWorldBounds(true);

        // this.player.setDamping(true);
        // this.player.setDragX(0.7);
        // this.player.setMaxVelocity(500);

        // Collide the player against the tile layer, not against individual static images.
        // this.physics.add.collider(this.player, this.groundLayer);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        // const direction = this.player.handleKeybinds(this.keys);
        // this.player.applyHorizontalMovement(direction);
        this.player.update();
    }
}
