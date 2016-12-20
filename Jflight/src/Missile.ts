

//
// missile
// ミサイルクラス
//

class Missile {

    // 定数
    public static MOMAX = 50;           // 煙の長さの最大値

    // 変数
    public pVel: CVector3;              // 位置
    public opVel: CVector3[] = [];      // 昔の位置（煙の位置）
    public vpVel: CVector3;             // 速度
    public aVel: CVector3;              // 向き（単位ベクトル）
    public use = 0;                     // 使用状態（0で未使用）
    public bom = 0;                     // 爆発状態（0で未爆）
    public bomm = 0;                    // 破裂状態（0で未爆）
    public count: number;               // リングバッファ長（煙の長さ）
    public targetNo: number;            // ターゲットNO（0>でロックOFF）

    spheres: THREE.Mesh[] = [];
    private explosion: THREE.Mesh;
    // テンポラリオブジェクト

    protected m_a0: CVector3;

    public constructor(scene: THREE.Scene) {
        this.pVel = new CVector3();
        this.vpVel = new CVector3();
        this.aVel = new CVector3();


        for (let i = 0; i < Missile.MOMAX; i++) {
            this.opVel.push(new CVector3());
        }

        this.m_a0 = new CVector3();

        let geometries: THREE.SphereGeometry[] = [];
        for (let i = 0; i < Missile.MOMAX; ++i) {
            geometries.push(new THREE.SphereGeometry(5, 8, 8));
        }

        let materials: THREE.MeshBasicMaterial[] = [];
        for (let i = 0; i < Missile.MOMAX; ++i) {
            materials.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));
            materials[i].opacity = 0.5;
            materials[i].transparent = true;
        }

        for (let i = 0; i < Missile.MOMAX; ++i) {
            this.spheres.push(new THREE.Mesh(geometries[i], materials[i]));
        }

        for (let i = 0; i < Missile.MOMAX; ++i) {
            this.spheres[i].visible = false;
            scene.add(this.spheres[i]);
        }

        this.explosion = new THREE.Mesh(new THREE.SphereGeometry(50, 16, 16), new THREE.MeshBasicMaterial({ color: 0xf0f0f0 }));
        this.explosion.visible = false;
        scene.add(this.explosion);
    }

    // ミサイルのホーミング処理

    public horming(world: Jflight, _plane: Plane) {

        // ロックONされていて、残りステップが85以下ならホーミングする

        if (this.targetNo >= 0 && this.use < 100 - 15) {

            // 自分の速度を求める
            let v = this.vpVel.abs();
            if (Math.abs(v) < 1) {
                v = 1;
            }

            // 追尾目標
            let tp = world.plane[this.targetNo];

            // 追尾目標との距離を求める
            this.m_a0.setMinus(tp.position, this.pVel);
            let l = this.m_a0.abs();
            if (l < 0.001) {
                l = 0.001;
            }

            // 追尾目標との速度差を求める
            this.m_a0.setMinus(tp.vpVel, this.vpVel);
            let m = this.m_a0.abs();

            // 衝突予想時間を修正ありで求める
            let t0 = l / v * (1.0 - m / (800 + 1));

            // 衝突予想時間を０から５に丸める
            if (t0 < 0) {
                t0 = 0;
            }
            if (t0 > 5) {
                t0 = 5;
            }

            // 衝突予想時間時のターゲットの位置と自分の位置の差を求める
            this.m_a0.x = tp.position.x + tp.vpVel.x * t0 - (this.pVel.x + this.vpVel.x * t0);
            this.m_a0.y = tp.position.y + tp.vpVel.y * t0 - (this.pVel.y + this.vpVel.y * t0);
            this.m_a0.z = tp.position.z + tp.vpVel.z * t0 - (this.pVel.z + this.vpVel.z * t0);

            let tr = ((100 - 15) - this.use) * 0.02 + 0.5;
            if (tr > 0.1) {
                tr = 0.1;
            }

            if (tr < 1) {
                // 発射直後は、派手な機動をしない
                l = this.m_a0.abs();
                this.aVel.addCons(this.m_a0, l * tr * 10);
            } else {
                // そうでない場合、追尾方向へミサイル機種を向ける
                this.aVel.set(this.m_a0.x, this.m_a0.y, this.m_a0.z);
            }

            // 向きを単位ベクトルに補正
            this.aVel.consInv(this.aVel.abs());
        }

    }

    // ミサイルモーター計算

    public calcMotor(_world: Jflight, _plane: Plane) {

        // 発射直後はモーターOFF
        if (this.use < 100 - 5) {
            let aa = 1.0 / 20;
            let bb = 1 - aa;

            // 現在の速度成分と向き成分を合成して新たな速度成分とする
            let v = this.vpVel.abs();
            this.vpVel.x = this.aVel.x * v * aa + this.vpVel.x * bb;
            this.vpVel.y = this.aVel.y * v * aa + this.vpVel.y * bb;
            this.vpVel.z = this.aVel.z * v * aa + this.vpVel.z * bb;

            // ミサイル加速
            this.vpVel.addCons(this.aVel, 10.0);
        }
    }

    // ミサイル移動、敵機とのあたり判定、地面との当たり判定を行う
    // ミサイル発射処理はJflightクラス側で行われている

    public move(world: Jflight, plane: Plane) {

        // 爆発中ならカウンタ減少
        if (this.bom > 0) {

            // 煙を消す
            this.count = 0;

            this.bom--;
            if (this.bom < 0) {
                this.use = 0;
            }

            return;
        }

        // 重力加速
        this.vpVel.z += Jflight.G * Jflight.DT;

        // ホーミング計算
        this.horming(world, plane);

        // ミサイルモーター計算
        this.calcMotor(world, plane);

        // リングバッファに位置を保存
        this.opVel[this.use % Missile.MOMAX].set(this.pVel.x, this.pVel.y, this.pVel.z);

        // ミサイル移動
        this.pVel.addCons(this.vpVel, Jflight.DT);
        this.use--;

        // ターゲットとの当たり判定
        // ロックしている対象とのみ当たり判定する

        if (this.targetNo >= 0) {

            // 追尾目標
            let tp = world.plane[this.targetNo];

            // ターゲットとの距離を求めて、ある程度以下なら当たり（接触信管のみ使用）
            this.m_a0.setMinus(this.pVel, tp.position);
            if (this.m_a0.abs() < 10) {
                this.bom = 10;

                // 撃墜
                tp.posInit();
            }
        }

        if (this.use >= 0) {

            // ミサイルが爆発中でなければ、ミサイル本体を表示
            if (this.bom <= 0) {
                // dm.x = ap.pVel.x + ap.aVel.x * 4;
                // dm.y = ap.pVel.y + ap.aVel.y * 4;
                // dm.z = ap.pVel.z + ap.aVel.z * 4;
                // this.change3d(this.plane[0], dm, cp);
                // this.change3d(this.plane[0], ap.pVel, dm);
                // this.drawAline(cp, dm);
            }

            // ミサイルの煙を表示
            // 煙の座標はリングバッファに格納されている

            for (let i = 0; i < Missile.MOMAX; ++i) {
                this.spheres[i].visible = false;
            }
            let k = (this.use + Missile.MOMAX + 1) % Missile.MOMAX;
            // this.change3d(this.plane[0], ap.opVel[k], dm);
            for (let m = 0; m < this.count; m++) {
                // this.change3d(this.plane[0], ap.opVel[k], cp);
                // this.drawMline(context, dm, cp);
                this.spheres[k].position.x = this.opVel[k].x;
                this.spheres[k].position.y = this.opVel[k].y;
                this.spheres[k].position.z = this.opVel[k].z;
                this.spheres[k].visible = true;
                k = (k + Missile.MOMAX + 1) % Missile.MOMAX;
                // dm.set(cp.x, cp.y, cp.z);
            }
        }

        // ミサイルが爆発中の場合、爆円表示
        this.explosion.visible = false;
        if (this.bom > 0) {
            this.explosion.position.x = this.pVel.x;
            this.explosion.position.y = this.pVel.y;
            this.explosion.position.z = this.pVel.z;
            this.explosion.visible = true;

            // this.change3d(this.plane[0], ap.pVel, cp);
            // this.fillBarc(cp);
        }






        // 地面との当たり判定

        let gh = world.gHeight(this.pVel.x, this.pVel.y);
        if (this.pVel.z < gh) {
            this.bom = 10;
            this.pVel.z = gh + 3;
        }

        // リングバッファ長（煙の長さ）を設定
        if (this.count < Missile.MOMAX) {
            this.count++;
        }
    }

}
