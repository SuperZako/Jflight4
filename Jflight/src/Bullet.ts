///<reference path="CVector3.ts" />

//
// Bullet
// 弾丸クラス
//

class Bullet {

    // 変数

    public pVel = new CVector3();         // 位置
    public opVel = new CVector3();        // １ステップ前の位置
    public vVel = new CVector3();         // 速度
    public use = 0;               // 使用状態（0で未使用）
    public bom = 0;               // 爆発状態（0で未爆）

    // テンポラリ用オブジェクト

    protected m_a = new CVector3();
    protected m_b = new CVector3();
    protected m_vv = new CVector3();

    private sphere: THREE.Mesh;
    // コンストラクタ

    public constructor(scene: THREE.Scene) {
        var geometry = new THREE.SphereGeometry(5, 8, 8);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.sphere = new THREE.Mesh(geometry, material);
        this.sphere.visible = false;
        scene.add(this.sphere);
    }

    // 弾丸移動、敵機とのあたり判定、地面との当たり判定を行う
    // 弾丸発射処理はJflightクラス側で行われている

    public move(world: Jflight, plane: Plane) {

        // 重力加速
        this.vVel.z += Jflight.G * Jflight.DT;

        // 一つ前の位置を保存
        this.opVel.set(this.pVel.x, this.pVel.y, this.pVel.z);

        // 移動
        this.pVel.addCons(this.vVel, Jflight.DT);
        this.use--;

        // 弾丸を移動させる
        if (this.use > 0) {
            this.sphere.position.x = this.pVel.x;
            this.sphere.position.y = this.pVel.y;
            this.sphere.position.z = this.pVel.z;
            this.sphere.visible = true;
        } else {
            this.sphere.visible = false;
        }

        // 弾丸が爆発中の場合、爆円表示
        if (this.bom > 0) {
            // this.change3d(this.plane[0], bp.opVel, cp);
            // this.fillBarc(cp);
            this.bom--;
        }
        // 目標が定まっているのならターゲットとの当たり判定を行う
        // 目標以外との当たり判定は行わない

        if (plane.gunTarget > -1) {

            // 目標が存在している場合

            // ここでの当たり判定方法は、
            // 一つ前の位置と現在の位置との距離と
            // 一つ前の位置と目標の距離、現在の位置と目標の距離との和を比較することで
            // 行っている。弾丸速度が速いため、単に距離を求めても当たらない。
            // 点と直線の方程式で再接近距離を求めても良いが、面倒だったので手抜き 。

            // 現在の弾丸の位置と目標との差ベクトルを求める
            this.m_a.setMinus(this.pVel, world.plane[plane.gunTarget].position);

            // 一つ前の弾丸の位置と目標との差ベクトルを求める
            this.m_b.setMinus(this.opVel, world.plane[plane.gunTarget].position);

            // 一つ前の弾丸の位置と現在の弾丸の位置との差ベクトルを求める
            this.m_vv.setCons(this.vVel, Jflight.DT);

            let v0 = this.m_vv.abs();
            let l = this.m_a.abs() + this.m_b.abs();

            if (l < v0 * 1.05) {
                // 命中
                this.bom = 1;  // 爆発表示用にセット
                this.use = 10; // 直ぐには消さないで跳ね飛ばす

                // 現在位置と一つ前の位置の中間位置方向の速度成分を足して跳ね飛ばす
                this.m_vv.x = (this.m_a.x + this.m_b.x) / 2.0;
                this.m_vv.y = (this.m_a.y + this.m_b.y) / 2.0;
                this.m_vv.z = (this.m_a.z + this.m_b.z) / 2.0;
                l = this.m_vv.abs();
                this.m_vv.consInv(l);
                this.vVel.addCons(this.m_vv, v0 / 0.1);
                this.vVel.cons(0.1);
            }
        }

        // 地面との当たり判定

        let gh = world.gHeight(this.pVel.x, this.pVel.y);
        if (this.pVel.z < gh) {
            // 地面以下なら、乱反射させる
            this.vVel.z = Math.abs(this.vVel.z);
            this.pVel.z = gh;
            this.vVel.x += (Math.random() - 0.5) * 50;
            this.vVel.y += (Math.random() - 0.5) * 50;
            this.vVel.x *= 0.5;
            this.vVel.y *= 0.5;
            this.vVel.z *= 0.1;
        }
    }
}
