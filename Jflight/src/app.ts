///<reference path="../node_modules/@types/three/index.d.ts" />
///<reference path="THREEx.KeyboardState.ts" />
///<reference path="Jflight.ts" />


/*
       Three.js "tutorials by example"
       Author: Lee Stemkoski
       Date: July 2013 (three.js v59dev)
 */

// main

// グローバル変数
var keyboard = new THREEx.KeyboardState();

namespace Main {
    "use strict";

    let flight: Jflight;

    /* canvas要素のノードオブジェクト */

    let canvas: HTMLCanvasElement;

    // standard global variables
    var container: HTMLDivElement;
    var scene: THREE.Scene;
    var camera: THREE.PerspectiveCamera;
    var renderer: THREE.WebGLRenderer;

    // var stats: Stats;
    // var keyboard = new THREEx.KeyboardState();
    // var clock = new THREE.Clock();
    // custom global variables
    // var boomer: TextureAnimator; // animators
    // var man: Billboard;
    // var controls: THREE.OrbitControls;

    // functions
    export function init() {
        canvas = <HTMLCanvasElement>document.getElementById("canvas");

        // scene
        scene = new THREE.Scene();

        // camera
        const SCREEN_WIDTH: number = 600; // window.innerWidth;
        const SCREEN_HEIGHT: number = 400; // window.innerHeight;
        const VIEW_ANGLE: number = 90;
        const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
        const NEAR = 0.1;
        const FAR = 100000;

        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        scene.add(camera);
        camera.position.z = SCREEN_HEIGHT / 2;
        camera.lookAt(scene.position);

        // RENDERER
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        container = <HTMLDivElement>document.getElementById("ThreeJS");

        container.appendChild(renderer.domElement);

        // EVENTS
        // THREEx.WindowResize(renderer, camera);
        // THREEx.FullScreen.bindKey({ charCode: 'm'.charCodeAt(0) });

        // CONTROLS
        // controls = new THREE.OrbitControls(camera, renderer.domElement);
        // STATS

        // stats = new Stats();
        // stats.dom.style.position = 'absolute';
        // stats.dom.style.bottom = '0px';
        // stats.dom.style.zIndex = '100';

        // container.appendChild(stats.dom);



        // LIGHT

        // var light = new THREE.PointLight(0xffffff);

        // light.position.set(0, 250, 0);

        // scene.add(light);



        // var directionalLight = new THREE.DirectionalLight(0xffffff);

        // directionalLight.position.set(0, 0.7, 0.7);

        // scene.add(directionalLight);



        // FLOOR
        // let pitch = new _SoccerPitch(scene);



        // SKYBOX/FOG
        // var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
        // var skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x9999ff, side: THREE.BackSide });
        // var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);

        // scene.add(skyBox);
        scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);

        ////////////
        // CUSTOM //
        ////////////

        // GridHelper(大きさ, １マスの大きさ)
        var grid = new THREE.GridHelper(100000, 100);
        grid.rotateX(Math.PI / 2);
        //シーンオブジェクトに追加
        scene.add(grid);

        // 軸の長さ10000
        var axis = new THREE.AxisHelper(10000);
        // sceneに追加
        scene.add(axis);


        // MESHES WITH ANIMATED TEXTURES!


        // man = new Billboard(scene);



        // var explosionTexture = new THREE.TextureLoader().load('images/explosion.jpg');

        // boomer = new TextureAnimator(explosionTexture, 4, 4, 16, 55); // texture, #horiz, #vert, #total, duration.

        // var explosionMaterial = new THREE.MeshBasicMaterial({ map: explosionTexture });

        flight = new Jflight(scene);
    }

    export function animate() {
        requestAnimationFrame(animate);
        render();
        update();
    }

    function update() {

        // var delta = clock.getDelta();

        /* 2Dコンテキスト */

        let context = canvas.getContext("2d");
        flight.run(context);
        // boomer.update(1000 * delta);

        // man.update(1000 * delta);
        // if (keyboard.pressed("z")) {
        // do something
        // }

        // controls.update();
        // stats.update();
        // man.quaternion(camera.quaternion);


        let m = new THREE.Matrix4();
        let elements = flight.plane[0].matrix.elements;
        m.elements[0] = elements[0]; m.elements[4] = elements[2]; m.elements[8] = -elements[1];
        m.elements[1] = elements[4]; m.elements[5] = elements[6]; m.elements[9] = -elements[5];
        m.elements[2] = elements[8]; m.elements[6] = elements[10]; m.elements[10] = -elements[9];

        camera.setRotationFromMatrix(m);

        camera.position.set(flight.camerapos.x, flight.camerapos.y, flight.camerapos.z);

        flight.plane[1].line.position.set(flight.plane[1].pVel.x, flight.plane[1].pVel.y, flight.plane[1].pVel.z);
        flight.plane[2].line.position.set(flight.plane[2].pVel.x, flight.plane[2].pVel.y, flight.plane[2].pVel.z);
        flight.plane[3].line.position.set(flight.plane[3].pVel.x, flight.plane[3].pVel.y, flight.plane[3].pVel.z);



    }

    function render() {
        renderer.render(scene, camera);

        //let context = renderer.domElement.getContext("2d");


        //if (context) {
        //    context.strokeStyle = "rgb(0, 0, 255)";
        //    //描画することを宣言する
        //    context.beginPath();
        //    //描き始め（始点）を決定する
        //    context.moveTo(51, 15);
        //    //始点から指定の座標まで線を引く
        //    context.lineTo(100, 100);
        //    //引き続き線を引いていく
        //    context.lineTo(0, 100);
        //    context.lineTo(51, 15);
        //    //描画を終了する
        //    context.closePath();

        //    //上記記述は定義情報である。この命令で線を描く。
        //    context.stroke();
        //}
    }
}

Main.init();
Main.animate();
