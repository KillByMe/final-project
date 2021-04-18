import { AnimatedSprite, Texture } from "pixi.js";
import { Main } from "..";
import { AObjectAnimated } from "./AObjectAnimated";
import { Game } from "../scenes/Game";

export class Enemy extends AObjectAnimated {
    private _vilain = AnimatedSprite.fromFrames([
        "ennemi_1.png",
        "ennemi_2.png",
        "ennemi_3.png",
        "ennemi_4.png",
        "ennemi_5.png",
    ]);

    private _hit = false;
    get hit() {
        return this._hit;
    }
    set hit(value: boolean) {
        this.removeChild(this._vilain);
        this.addChild(this._vilain);
        this._hit = value;
    }

    constructor() {
        super();

        this._vilain.animationSpeed = 0.2;
        this._vilain.scale.set(1.2);
        this._vilain.anchor.set(0, 1);
        this._vilain.play();

        this.addChild(this._vilain);
    }

    public update(timeDelta: number) {
        super.update(timeDelta);

        this.x -= 1;

        if (this.x < 0) {
            this.kill = true;
        }
    }
}
