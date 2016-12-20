

class HUD {
    lines: THREE.Line[] = [];

    public constructor(scene: THREE.Scene) {


        // let distance = 10000;
        let v1 = new THREE.Vector3(10, 100, 0);
        let v2 = new THREE.Vector3(-10, 100, 0);

        // for (let i = -180; i <= 180; i += 10) {
        {
            let i= 0;
            //geometryの宣言と生成
            let geometry = new THREE.Geometry();

            let v3 = v1.clone();
            let v4 = v2.clone();

            let m = new THREE.Matrix4();
            m.makeRotationX(i * Math.PI / 180);

            v3.applyMatrix4(m);
            v4.applyMatrix4(m);
            geometry.vertices.push(v3);
            geometry.vertices.push(v4);

            let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xffffff }));
            this.lines.push(line);

            scene.add(line);
        }
    }

    public rotationZ(z: number) {

        for (let line of this.lines) {
            line.rotation.z = z;
        }


        //this.line2.rotation.z = z;
    }

    public setPosition(x: number, y: number, z: number) {
        for (let line of this.lines) {
            line.position.set(x, y, z);
        }
        //this.line.position.set(x, y, z);
        //this.line2.position.set(x, y, z);
    }
}