import { Sprite, Text } from "pixi.js";
import { AScene } from "./AScene";
import { Main } from "../index";
import { gsap, Back } from "gsap";
import { Game } from "./Game";
import { HomeScreen } from "./HomeScreen";

export class GameOver extends AScene {
    private _timeline = gsap.timeline();

    constructor(timeFinal: number) {
        super();

        const txtFin = new Text("Vous avez survécu : " + timeFinal + " secondes", {
            fontSize: 30,
            letterSpacing: 0.6,
            fontWeight: "bold",
            fill: ["#848A95"],
        });
        txtFin.x = (Main.SCREEN_WIDTH - txtFin.width) / 2;
        txtFin.y = 60;

        const gameOver = Sprite.from("game_over.png");
        const restartbutton = Sprite.from("start_again.png");
        const homebutton = Sprite.from("menu_button.png");

        this.addChild(gameOver);

        restartbutton.y = Main.SCREEN_HEIGHT;
        restartbutton.x = (Main.SCREEN_WIDTH - restartbutton.width) / 2;
        this.addChild(restartbutton);

        homebutton.scale.set(0.5);
        homebutton.y = 60;
        homebutton.x = Main.SCREEN_WIDTH - homebutton.width - 50;
        this.addChild(homebutton);

        restartbutton.interactive = true;
        restartbutton.buttonMode = true;

        homebutton.interactive = true;
        homebutton.buttonMode = true;

        this.addChild(txtFin);

        setTimeout(() => {
            this._timeline.to(restartbutton, {
                y: Main.SCREEN_HEIGHT - restartbutton.height * 3,
                duration: 0.6,
                ease: Back.easeOut,
            });
            this._timeline.to(restartbutton, { alpha: 0.4, duration: 0.5, yoyo: true, repeat: -1 });
        }, 1000);

        restartbutton.once("pointerdown", () => (Main.instance.scene = new Game()));
        homebutton.once("pointerdown", () => (Main.instance.scene = new HomeScreen()));
    }
}
