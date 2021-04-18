import { gsap } from "gsap";
import { Sprite, Texture } from "pixi.js";
import { Main } from "../index";
import { AScene } from "./AScene";
import { Game } from "./Game";

export class HomeScreen extends AScene {
    private _homescreen = Sprite.from("accueil.png");
    private _startbutton = Sprite.from("start.png");

    private _music = new Audio("../../assets/music.mp3");
    private _soundIcon = Sprite.from("sound_off.png");

    private _timeline = gsap.timeline();

    constructor() {
        super();

        this._startbutton.y = Main.SCREEN_HEIGHT - this._startbutton.height * 3;
        this._startbutton.x = (Main.SCREEN_WIDTH - this._startbutton.width) / 2;

        this._soundIcon.x = 60;
        this._soundIcon.y = 60;
        this._soundIcon.interactive = true;
        this._soundIcon.buttonMode = true;

        this.addChild(this._homescreen);
        this.addChild(this._startbutton);
        this.addChild(this._soundIcon);

        this._timeline.to(this._startbutton, { alpha: 0.4, duration: 0.5, yoyo: true, repeat: -1 });

        this._startbutton.interactive = true;
        this._startbutton.buttonMode = true;

        this._startbutton.once("pointerdown", this._play.bind(this));

        this._soundIcon.on("pointerdown", this._playSound.bind(this));
    }

    private _play() {
        Main.instance.scene = new Game();
        this._music.pause();
    }

    private _playSound() {
        if (this._music.muted) {
            console.log("play");
            this._music.muted = false;
            this._music.play();
            this._soundIcon.texture = Texture.from("sound_on.png");
        } else {
            console.log("pause");
            this._music.muted = true;
            this._soundIcon.texture = Texture.from("sound_off.png");
        }
    }
}
