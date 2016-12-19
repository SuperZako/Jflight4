//
// Applet3Dクラス
//
// ３Ｄ表示を支援するためのアプレットクラス
// 主に３Ｄ→２Ｄ変換と、キースキャンや各イベント管理を行う
//

class Applet3D {
    sWidth: number;
    sHeight: number;        // スクリーンの大きさ
    protected sCenterX: number;
    sCenterY: number;     // スクリーンのセンター座標

    public camerapos: CVector3;         // カメラの位置

    bWidth: number; bHeight: number;                  // バックバッファの大きさ、リサイズ時にスクリーンの大きさにあわせる


    // keyShoot: boolean;                     // スペースキーの状態
    // keyLeft: boolean;                      // 左カーソルキーの状態
    // keyRight: boolean;                     // 右カーソルキーの状態
    // keyUp: boolean;                        // 上カーソルキーの状態
    // keyDown: boolean;                      // 下カーソルキーの状態
    // keyBoost: boolean;                     // B（ブースト）キーの状態

    // コンストラクタ

    public constructor() {
        this.camerapos = new CVector3();
        this.sWidth = 600;
        this.sHeight = 400;
        this.sCenterX = 300;
        this.sCenterY = 200;
        try {
            this.jbInit();
        } catch (e) {
            e.printStackTrace();
        }
        this.bgInit();
    }

    // バックバッファの初期化

    public bgInit() {
        // this.backImage = this.createImage(this.sWidth, this.sHeight);
        // if (this.backImage != null) {
        //     this.bWidth = this.sWidth;
        //     this.bHeight = this.sHeight;
        //     this.bGraphics = this.backImage.getGraphics();
        // }
    }

    // バックバッファのクリア

    public clear(context: CanvasRenderingContext2D | null) {

        if (context !== null) {
            context.fillStyle = "black";
            // context.fillStyle = "rgba(0,0,0,0)";
            context.fillRect(0, 0, this.sWidth, this.sHeight);
        }
    }

    // バックバッファをフロントに転送

    public flush() {
    }

    // ３Ｄ（sp）→２Ｄ（cp）変換
    // 変換にはPlaneオブジェクトの変換行列を用いている

    change3d(plane: Plane, sp: CVector3, cp: CVector3) {

        // 視点座標に平行移動後、変換行列を掛ける

        let x = sp.x - this.camerapos.x;
        let y = sp.y - this.camerapos.y;
        let z = sp.z - this.camerapos.z;

        let x1 = x * plane.matrix.elements[0] + y * plane.matrix.elements[4] + z * plane.matrix.elements[8];
        let y1 = x * plane.matrix.elements[1] + y * plane.matrix.elements[5] + z * plane.matrix.elements[9];
        let z1 = x * plane.matrix.elements[2] + y * plane.matrix.elements[6] + z * plane.matrix.elements[10];

        if (y1 > 10) {
            // 奥行きで割ってスクリーン座標に変換
            y1 /= 10;
            cp.x = x1 * 50 / y1 + this.sCenterX;
            cp.y = -z1 * 50 / y1 + this.sCenterY;
            cp.z = y1 * 10;
        }
        else {
            // 変換後の奥行き（y1）が10以下ならクリップ
            cp.x = -10000;
            cp.y = -10000;
            cp.z = 1;
        }
    }

    // 地面と機体表示用のライン表示

    public drawSline(context: CanvasRenderingContext2D | null, p0: CVector3, p1: CVector3) {
        if (context !== null && p0.x > -10000 && p0.x < 30000 && p0.y > -10000 && p0.y < 30000 &&
            p1.x > -10000 && p1.x < 30000 && p1.y > -10000 && p1.y < 30000) {
            // bGraphics.setColor(Color.white);
            context.strokeStyle = "white";
            // bGraphics.drawLine((p0.x, p0.y, p1.x, p1.y);
            context.beginPath();
            context.moveTo(p0.x, p0.y);
            context.lineTo(p1.x, p1.y);
            context.stroke();
        }
    }

    // 弾丸表示用のライン表示

    public drawBlined(context: CanvasRenderingContext2D | null, p0: CVector3, p1: CVector3) {
        if (context && p0.x > -1000 && p1.x > -1000) {
            // bGraphics.setColor(Color.yellow);
            context.strokeStyle = "yellow";
            // bGraphics.drawLine((int)p0.x, (int)p0.y, (int)p1.x, (int)p1.y);
            context.beginPath();
            context.moveTo(p0.x, p0.y);
            context.lineTo(p1.x, p1.y);
            context.stroke();
        }
    }

    // 弾丸表示用の太いライン表示

    public drawBline(context: CanvasRenderingContext2D | null, p0: CVector3, p1: CVector3) {
        if (context && p0.x > -1000 && p1.x > -1000) {
            //bGraphics.setColor(Color.yellow);
            context.strokeStyle = "yellow";

            //bGraphics.drawLine(p0.x, (int)p0.y, (int)p1.x, (int)p1.y);
            context.beginPath();
            context.moveTo(p0.x, p0.y);
            context.lineTo(p1.x, p1.y);
            context.stroke();

            //bGraphics.drawLine(p0.x + 1, (int)p0.y, (int)p1.x + 1, (int)p1.y);
            //bGraphics.drawLine(p0.x, (int)p0.y + 1, (int)p1.x, (int)p1.y + 1);
            //bGraphics.drawLine(p0.x + 1, (int)p0.y + 1, (int)p1.x + 1, (int)p1.y + 1);
        }
    }

    // ミサイル煙用のライン表示

    public drawMline(context: CanvasRenderingContext2D | null, p0: CVector3, p1: CVector3) {
        if (context && p0.x > -1000 && p1.x > -1000) {
            // bGraphics.setColor(Color.lightGray);
            context.strokeStyle = "lightgrey";

            // bGraphics.drawLine(p0.x, p0.y, p1.x, p1.y);
            context.beginPath();
            context.moveTo(p0.x, p0.y);
            context.lineTo(p1.x, p1.y);
            context.stroke();
        }
    }

    // ミサイル用のライン表示

    public drawAline(p0: CVector3, p1: CVector3) {
        if (p0.x > -1000 && p1.x > -1000) {
            //bGraphics.setColor(Color.white);
            //bGraphics.drawLine(p0.x, (int)p0.y, (int)p1.x, (int)p1.y);
            //bGraphics.drawLine(p0.x + 1, (int)p0.y, (int)p1.x + 1, (int)p1.y);
            //bGraphics.drawLine(p0.x, (int)p0.y + 1, (int)p1.x, (int)p1.y + 1);
            //bGraphics.drawLine(p0.x + 1, (int)p0.y + 1, (int)p1.x + 1, (int)p1.y + 1);
        }
    }

    // ポリゴン表示

    public drawPoly(context: CanvasRenderingContext2D | null, p0: CVector3, p1: CVector3, p2: CVector3) {
        this.drawSline(context, p0, p1);
        this.drawSline(context, p1, p2);
        this.drawSline(context, p2, p0);
    }

    // 爆発用の円表示

    public fillBarc(p: CVector3) {
        if (p.x >= -100) {
            // Ｚ座標値で半径を変える

            let rr = (2000 / p.z) + 2;
            if (rr > 40)
                rr = 40;
            // bGraphics.setColor(Color.orange);

            // bGraphics.fillArc(p.x, p.y, rr, rr, 0, 360);
        }
    }

    // イベント処理初期化

    private jbInit() {
        //        this.setBackground(Color.black);
        //        this.addKeyListener(new java.awt.event.KeyAdapter() {
        //            public void keyPressed(KeyEvent e) {
        //                this_keyPressed(e);
        //            }
        //      public  keyReleased(KeyEvent e) {
        //                this_keyReleased(e);
        //            }
        //    });
        //this.addComponentListener(new java.awt.event.ComponentAdapter() {
        //    public void componentResized(ComponentEvent e) {
        //        this_componentResized(e);
        //    }
        //    });
        //this.setForeground(Color.white);
    }

    // リサイズイベント処理
    //this_componentResized(e: ComponentEvent) {
    //    this.sWidth = getSize().width;
    //    this.sHeight = getSize().height;
    //    this.sCenterX = (sWidth / 2);
    //    this.sCenterY = (sHeight / 2);
    //}
}


