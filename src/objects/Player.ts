import { Texture, Sprite, AnimatedSprite } from "pixi.js";
import { AObjectAnimated } from "./AObjectAnimated";
import { gsap } from "gsap";
import { Main } from "..";

export class Player extends AObjectAnimated {
    private _walk = AnimatedSprite.fromFrames([
        "perso_marche_1.png",
        "perso_marche_2.png",
        "perso_marche_3.png",
        "perso_marche_4.png",
    ]);

    private _die = Sprite.from("mort.png");

    private _jump = Sprite.from("perso_saut.png");

    private _attack = Sprite.from("perso_attaque.png");

    public isAttacking = false;

    private _isJumping = false;

    private _isDead = false;

    private _hit = false;
    get hit() {
        return this._hit;
    }
    set hit(value: boolean) {
        this.removeChild(this._walk);
        this.removeChild(this._jump);
        this.removeChild(this._attack);
        this.addChild(this._die);
        this._isDead = true;

        this._die.scale.set(1.2);
        this._die.y = 20;

        this._hit = value;
    }

    public jump() {
        if (this._isJumping) return;
        if (this._isDead) return;
        if (this.isAttacking) return;
        this.removeChild(this._walk);
        this.removeChild(this._attack);
        this.addChild(this._jump);
        this._isJumping = true;
        gsap.to(this, {
            duration: 0.4,
            y: 400,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                this.removeChild(this._jump);
                if (this._isDead != true) {
                    this.addChild(this._walk);
                }
                this._isJumping = false;
            },
        });
    }

    public attack() {
        if (this._isJumping) return;
        if (this.isAttacking) return;
        if (this._isDead) return;
        this.removeChild(this._walk);
        this.removeChild(this._jump);
        this.addChild(this._attack);
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
            this.removeChild(this._attack);
            this.addChild(this._walk);
        }, 500);
    }

    constructor() {
        super();

        this.addChild(this._walk);
        this._walk.animationSpeed = 0.3;
        this._walk.scale.set(1.2);
        this._walk.play();

        this._jump.scale.set(1.2);
        this._attack.scale.set(1.2);
    }
}
