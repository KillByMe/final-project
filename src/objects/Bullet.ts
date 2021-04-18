import { Texture, Sprite } from "pixi.js";
import { Main } from "..";
import { AObject } from "./AObject";

export class Bullet extends AObject {
    constructor() {
        super(Texture.from("tir_ennemi.png"));
    }

    public update(timeDelta: number) {
        super.update(timeDelta);

        this.x -= 5 * timeDelta;
    }
}
