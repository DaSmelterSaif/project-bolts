import { test, expect, vi } from "vitest";
import { BoltsCharacterController } from "./BoltsCharacter";

vi.mock("phaser");

function mockScene() {
    return {
        add: {
            sprite: (x: number, y: number, texture: string) => ({
                setScale: (_: number) => {},
            }),
        },
        physics: {
            world: { gravity: { x: 0, y: 0 } },
        },
    } as unknown as Phaser.Scene;
}

test("getSweptRect - rectangle size when vel=0", () => {
    const scene = mockScene();
    const c = new BoltsCharacterController(
        scene,
        50,
        350,
        "mainCharacter",
        {},
        32,
        48,
    );

    const rect = (c as any).getSweptRect(1 / 60);
    expect(rect.x).toBe(50 - 16);
    expect(rect.y).toBe(350 - 48);
    expect(rect.width).toBe(32);
    expect(rect.height).toBe(48);
});

test("getSweptRect - moving right expands rectangle to the right", () => {
    const x = 50;
    const y = 350;
    const width = 32;
    const height = 48;
    const frametime = 1 / 60;
    const velocityX = 10;
    const velocityY = 0;

    const scene = mockScene();
    const c = new BoltsCharacterController(
        scene,
        x,
        y,
        "mainCharacter",
        {},
        width,
        height,
    );

    c.velx = velocityX;
    c.vely = velocityY;

    const rect = (c as any).getSweptRect(frametime);
    expect(rect.x).toBe(x - width / 2);
    expect(rect.y).toBe(y - height);
    expect(rect.width).toBe(Math.ceil(width + frametime * velocityX));
    expect(rect.height).toBe(Math.ceil(height + frametime * velocityY));
});
