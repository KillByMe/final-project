import { AScene } from "./AScene";
import { Bullet } from "../objects/Bullet";
import { Player } from "../objects/Player";
import { DisplayObject, Texture, TilingSprite, Text } from "pixi.js";
import { Main } from "..";
import { AObject } from "../objects/AObject";
import { Enemy } from "../objects/Enemy";
import { Maths } from "../utils/Maths";
import { GameOver } from "./GameOver";
import { IObject } from "../objects/IObject";

export class Game extends AScene {
    private _music = new Audio("../../assets/music.mp3");

    private _background: TilingSprite;
    private _ground: TilingSprite;

    private _player = new Player();

    private _fin = false;

    private _objects: IObject[] = [];

    public _timeTxt = new Text("0 s", { fontSize: 30, letterSpacing: 0.6, fontWeight: "bold", fill: ["#FFFFFF"] });
    private _time = 0;

    private _timeBeforeMissile = 0;
    private _missileTime = Maths.randomIntBetweenTwoNumbers(5, 10);

    private _isNotAttacking = true;

    constructor() {
        super();

        this._background = new TilingSprite(Texture.from("background.png"), 1920, 1080);

        this._ground = new TilingSprite(Texture.from("ground.png"), 1920, 409);
        this._ground.y = Main.SCREEN_HEIGHT - this._ground.height;

        this._player.x = 300;
        this._player.y = this._ground.y - 55;

        this._timeTxt.x = 300;
        this._timeTxt.y = 60;

        this.addChild(this._background);
        this.addChild(this._ground);
        this.addChild(this._player);
        this.addChild(this._timeTxt);
    }

    public initialize() {
        super.initialize();

        this._music.play();

        this._createEnemy();

        window.addEventListener("keydown", this._onKeyboard.bind(this));
    }

    public dipose() {
        super.dispose();
    }

    public update(timeDelta: number) {
        super.update(timeDelta);

        if (this._fin) return;

        this._background.tilePosition.x -= 0.6;
        this._ground.tilePosition.x -= 3;

        for (const obj of this._objects) {
            obj.update(timeDelta);
        }

        this._player.update(timeDelta);
        for (const object of this._objects) {
            object.update(timeDelta);
        }

        if (!this._fin) {
            this._time += timeDelta / 75;
            this._timeTxt.text = "Temps de survie : " + Math.floor(this._time) + " s";
        }

        for (const object of this._objects) {
            object.update(timeDelta);
            for (const enemy of this._objects.filter((obj) => obj instanceof Enemy)) {
                if (this._isNotAttacking && this._isIntersecting(this._player, enemy)) {
                    this._fin = true;
                    this._player.hit = true;

                    if (this._fin) {
                        setTimeout(() => {
                            Main.instance.scene = new GameOver(Math.floor(this._time));
                            this._music.pause();
                        }, 800);
                    }
                }
                if (!this._isNotAttacking && this._isIntersecting(this._player, enemy)) {
                    enemy.kill = true;
                }
            }
            for (const bullet of this._objects.filter((obj) => obj instanceof Bullet)) {
                if (this._isIntersecting(this._player, bullet)) {
                    this._fin = true;
                    this._player.hit = true;
                    bullet.kill = true;

                    if (this._fin) {
                        setTimeout(() => {
                            Main.instance.scene = new GameOver(Math.floor(this._time));
                            this._music.pause();
                        }, 800);
                    }
                }
            }
        }

        for (const object of this._objects) {
            if (object.kill) {
                this.removeChild((object as unknown) as DisplayObject);
                this._objects.splice(this._objects.indexOf(object), 1);
            }
        }

        this._timeBeforeMissile += timeDelta / 20;
        const enemies = this._objects.filter((obj) => obj instanceof Enemy);
        if (this._timeBeforeMissile > this._missileTime && enemies.length > 0) {
            const enemy = enemies[Maths.randomIntBetweenTwoNumbers(0, enemies.length)];
            const bullet = new Bullet();
            bullet.x = enemy.x - 30;
            bullet.y = enemy.y - 65;
            this.addChild(bullet);
            this._objects.push(bullet);

            this._missileTime = Maths.randomIntBetweenTwoNumbers(4, 8);
            this._timeBeforeMissile = 0;
        }
    }

    private _createEnemy() {
        setInterval(() => {
            const enemy = new Enemy();
            enemy.x = Main.SCREEN_WIDTH;
            enemy.y = Main.SCREEN_HEIGHT - this._ground.height + 45;
            this.addChild(enemy);
            this._objects.push(enemy);
            console.log(enemy);
        }, 2500);
    }

    private _isIntersecting(r1: IObject, r2: IObject): boolean {
        return !(
            r2.x > r1.x + r1.width ||
            r2.x + r2.width < r1.x ||
            r2.y > r1.y + r1.height ||
            r2.y + r2.height < r1.y
        );
    }

    private _onKeyboard(kEvt: KeyboardEvent) {
        if (kEvt.key == "ArrowUp") {
            this._player.jump();
        }
        if (kEvt.key == "ArrowRight") {
            this._player.attack();
            this._isNotAttacking = false;
        }
    }
}
