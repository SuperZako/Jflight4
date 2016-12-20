///<reference path="../Math/CVector3.ts" />

class PhysicsState {
    public position = new CVector3();    // 位置（ワールド座標系）
    public rotation = new THREE.Euler();

    public constructor() {
    }
}