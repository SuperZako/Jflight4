

//
// missile
// �~�T�C���N���X
//

class Missile extends PhysicsState {

    // �萔
    public static MOMAX = 50;           // ���̒����̍ő�l

    // �ϐ�
    // public pVel = new CVector3();       // �ʒu
    
    public opVel: CVector3[] = [];      // �̂̈ʒu�i���̈ʒu�j
    public vpVel = new CVector3();      // ���x
    public aVel = new CVector3();       // �����i�P�ʃx�N�g���j
    public use = 0;                     // �g�p��ԁi0�Ŗ��g�p�j
    public bom = 0;                     // ������ԁi0�Ŗ����j
    public bomm = 0;                    // �j���ԁi0�Ŗ����j
    public count: number;               // �����O�o�b�t�@���i���̒����j
    public targetNo: number;            // �^�[�Q�b�gNO�i0>�Ń��b�NOFF�j

    spheres: THREE.Mesh[] = [];
    private explosion: THREE.Mesh;
    // �e���|�����I�u�W�F�N�g

    protected m_a0: CVector3;

    public constructor(scene: THREE.Scene) {
        super();
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

    // �~�T�C���̃z�[�~���O����

    public horming(world: Jflight, _plane: Plane) {

        // ���b�NON����Ă��āA�c��X�e�b�v��85�ȉ��Ȃ�z�[�~���O����

        if (this.targetNo >= 0 && this.use < 100 - 15) {

            // �����̑��x�����߂�
            let v = this.vpVel.abs();
            if (Math.abs(v) < 1) {
                v = 1;
            }

            // �ǔ��ڕW
            let tp = world.plane[this.targetNo];

            // �ǔ��ڕW�Ƃ̋��������߂�
            this.m_a0.setMinus(tp.position, this.position);
            let l = this.m_a0.abs();
            if (l < 0.001) {
                l = 0.001;
            }

            // �ǔ��ڕW�Ƃ̑��x�������߂�
            this.m_a0.setMinus(tp.vpVel, this.vpVel);
            let m = this.m_a0.abs();

            // �Փ˗\�z���Ԃ��C������ŋ��߂�
            let t0 = l / v * (1.0 - m / (800 + 1));

            // �Փ˗\�z���Ԃ��O����T�Ɋۂ߂�
            if (t0 < 0) {
                t0 = 0;
            }
            if (t0 > 5) {
                t0 = 5;
            }

            // �Փ˗\�z���Ԏ��̃^�[�Q�b�g�̈ʒu�Ǝ����̈ʒu�̍������߂�
            this.m_a0.x = tp.position.x + tp.vpVel.x * t0 - (this.position.x + this.vpVel.x * t0);
            this.m_a0.y = tp.position.y + tp.vpVel.y * t0 - (this.position.y + this.vpVel.y * t0);
            this.m_a0.z = tp.position.z + tp.vpVel.z * t0 - (this.position.z + this.vpVel.z * t0);

            let tr = ((100 - 15) - this.use) * 0.02 + 0.5;
            if (tr > 0.1) {
                tr = 0.1;
            }

            if (tr < 1) {
                // ���˒���́A�h��ȋ@�������Ȃ�
                l = this.m_a0.abs();
                this.aVel.addCons(this.m_a0, l * tr * 10);
            } else {
                // �����łȂ��ꍇ�A�ǔ������փ~�T�C���@���������
                this.aVel.set(this.m_a0.x, this.m_a0.y, this.m_a0.z);
            }

            // ������P�ʃx�N�g���ɕ␳
            this.aVel.consInv(this.aVel.abs());
        }

    }

    // �~�T�C�����[�^�[�v�Z

    public calcMotor(_world: Jflight, _plane: Plane) {

        // ���˒���̓��[�^�[OFF
        if (this.use < 100 - 5) {
            let aa = 1.0 / 20;
            let bb = 1 - aa;

            // ���݂̑��x�����ƌ����������������ĐV���ȑ��x�����Ƃ���
            let v = this.vpVel.abs();
            this.vpVel.x = this.aVel.x * v * aa + this.vpVel.x * bb;
            this.vpVel.y = this.aVel.y * v * aa + this.vpVel.y * bb;
            this.vpVel.z = this.aVel.z * v * aa + this.vpVel.z * bb;

            // �~�T�C������
            this.vpVel.addCons(this.aVel, 10.0);
        }
    }

    // �~�T�C���ړ��A�G�@�Ƃ̂����蔻��A�n�ʂƂ̓����蔻����s��
    // �~�T�C�����ˏ�����Jflight�N���X���ōs���Ă���

    public move(world: Jflight, plane: Plane) {

        // �������Ȃ�J�E���^����
        if (this.bom > 0) {

            // ��������
            this.count = 0;

            this.bom--;
            if (this.bom < 0) {
                this.use = 0;
            }

            return;
        }

        // �d�͉���
        this.vpVel.z += Jflight.G * Jflight.DT;

        // �z�[�~���O�v�Z
        this.horming(world, plane);

        // �~�T�C�����[�^�[�v�Z
        this.calcMotor(world, plane);

        // �����O�o�b�t�@�Ɉʒu��ۑ�
        this.opVel[this.use % Missile.MOMAX].set(this.position.x, this.position.y, this.position.z);

        // �~�T�C���ړ�
        this.position.addCons(this.vpVel, Jflight.DT);
        this.use--;

        // �^�[�Q�b�g�Ƃ̓����蔻��
        // ���b�N���Ă���ΏۂƂ̂ݓ����蔻�肷��

        if (this.targetNo >= 0) {

            // �ǔ��ڕW
            let tp = world.plane[this.targetNo];

            // �^�[�Q�b�g�Ƃ̋��������߂āA������x�ȉ��Ȃ瓖����i�ڐG�M�ǂ̂ݎg�p�j
            this.m_a0.setMinus(this.position, tp.position);
            if (this.m_a0.abs() < 10) {
                this.bom = 10;

                // ����
                tp.posInit();
            }
        }

        if (this.use >= 0) {

            // �~�T�C�����������łȂ���΁A�~�T�C���{�̂�\��
            if (this.bom <= 0) {
                // dm.x = ap.pVel.x + ap.aVel.x * 4;
                // dm.y = ap.pVel.y + ap.aVel.y * 4;
                // dm.z = ap.pVel.z + ap.aVel.z * 4;
                // this.change3d(this.plane[0], dm, cp);
                // this.change3d(this.plane[0], ap.pVel, dm);
                // this.drawAline(cp, dm);
            }

            // �~�T�C���̉���\��
            // ���̍��W�̓����O�o�b�t�@�Ɋi�[����Ă���

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

        // �~�T�C�����������̏ꍇ�A���~�\��
        this.explosion.visible = false;
        if (this.bom > 0) {
            this.explosion.position.x = this.position.x;
            this.explosion.position.y = this.position.y;
            this.explosion.position.z = this.position.z;
            this.explosion.visible = true;

            // this.change3d(this.plane[0], ap.pVel, cp);
            // this.fillBarc(cp);
        }






        // �n�ʂƂ̓����蔻��

        let gh = world.gHeight(this.position.x, this.position.y);
        if (this.position.z < gh) {
            this.bom = 10;
            this.position.z = gh + 3;
        }

        // �����O�o�b�t�@���i���̒����j��ݒ�
        if (this.count < Missile.MOMAX) {
            this.count++;
        }
    }

}
