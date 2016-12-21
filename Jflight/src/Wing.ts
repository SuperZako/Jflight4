//
// Wing
// ���N���X
//
// ���ɂ����G���W�����\��
//

class Wing extends PhysicsState {

    //        ���W�n
    //     Z
    //     ^  Y
    //     | /
    //     |/
    //     -------->X

    // �ϐ�
    // public pVel: CVector3;    // �����S�ʒu�i�@�̍��W�j

    public unitX = new CVector3();   // �����W�w�P�ʃx�N�g���i�@�̍��W�j
    public yVel = new CVector3();   // �����W�x�P�ʃx�N�g���i�@�̍��W�j
    public zVel = new CVector3();   // �����W�y�P�ʃx�N�g���i�@�̍��W�j
    public mass: number;      // ���̎���
    public sVal: number;      // ���ʐ�
    public fVel: CVector3;    // ���ɂ������Ă����
    public aAngle: number;    // ���̂w���Ђ˂�p�x�irad�j
    public bAngle: number;    // ���̂x���Ђ˂�p�x�irad�j

    // public forward: CVector3;    // ���̂Ђ˂���l�������x�P�ʃx�N�g���i�@�̍��W�j

    public tVal: number;      // �G���W���̐��́i0�Œʏ�̗��j

    // �e���|�����I�u�W�F�N�g

    protected m_pp: CVector3; protected m_op: CVector3; protected m_ti: CVector3; protected m_ni: CVector3; protected m_vp: CVector3; protected m_vp2: CVector3;
    protected m_wx: CVector3; protected m_wy: CVector3; protected m_wz: CVector3;

    protected m_qx: CVector3; protected m_qy: CVector3; protected m_qz: CVector3;

    // �R���X�g���N�^

    public constructor() {
        super();

        this.fVel = new CVector3();

        this.m_pp = new CVector3();
        this.m_op = new CVector3();
        this.m_ti = new CVector3();
        this.m_ni = new CVector3();
        this.m_vp = new CVector3();
        this.m_vp2 = new CVector3();
        this.m_wx = new CVector3();
        this.m_wy = new CVector3();
        this.m_wz = new CVector3();
        this.m_qx = new CVector3();
        this.m_qy = new CVector3();
        this.m_qz = new CVector3();
    }

    // ���v�Z���s��
    // fVel�Ɍv�Z���ʂ����܂�
    // ve�͋�C���x�Ano�͗�No.�i�}�p�v�Z�Ɏg�p�j�Aboost�̓G���W���u�[�X�g

    public calc(plane: Plane, ve: number, no: number, boost: boolean) {
        let n, at, rr, cl, cd, ff;

        // �@�̂̑��x�Ɖ�]���A���̈ʒu���痃�ɂ����鑬�x�����߂�i�O�όv�Z�j
        this.m_vp.x = plane.localVelocity.x + this.position.y * plane.vaVel.z - this.position.z * plane.vaVel.y;
        this.m_vp.y = plane.localVelocity.y + this.position.z * plane.vaVel.x - this.position.x * plane.vaVel.z;
        this.m_vp.z = plane.localVelocity.z + this.position.x * plane.vaVel.y - this.position.y * plane.vaVel.x;


        // ���̂Ђ˂����ɁA��{���W�x�N�g������]

        let sin = Math.sin(this.bAngle);
        let cos = Math.cos(this.bAngle);

        this.m_qx.x = this.unitX.x * cos - this.zVel.x * sin;
        this.m_qx.y = this.unitX.y * cos - this.zVel.y * sin;
        this.m_qx.z = this.unitX.z * cos - this.zVel.z * sin;

        this.m_qy.set(this.yVel.x, this.yVel.y, this.yVel.z);

        this.m_qz.x = this.unitX.x * sin + this.zVel.x * cos;
        this.m_qz.y = this.unitX.y * sin + this.zVel.y * cos;
        this.m_qz.z = this.unitX.z * sin + this.zVel.z * cos;

        sin = Math.sin(this.aAngle);
        cos = Math.cos(this.aAngle);

        this.m_wx.set(this.m_qx.x, this.m_qx.y, this.m_qx.z);

        this.m_wy.x = this.m_qy.x * cos - this.m_qz.x * sin;
        this.m_wy.y = this.m_qy.y * cos - this.m_qz.y * sin;
        this.m_wy.z = this.m_qy.z * cos - this.m_qz.z * sin;

        this.m_wz.x = this.m_qy.x * sin + this.m_qz.x * cos;
        this.m_wz.y = this.m_qy.y * sin + this.m_qz.y * cos;
        this.m_wz.z = this.m_qy.z * sin + this.m_qz.z * cos;

        let t0 = 0;

        this.fVel.set(0, 0, 0);

        if (this.sVal > 0) {

            // ���v�Z

            let vv = this.m_vp.abs();

            // �����x�̒P�ʃx�N�g�������߂�(�@�̍��W)

            this.m_ti.x = this.m_vp.x / vv;
            this.m_ti.y = this.m_vp.y / vv;
            this.m_ti.z = this.m_vp.z / vv;

            // �@�̍��W�̗����x�𗃍��W�n�ɕϊ�

            let dx = this.m_wx.x * this.m_vp.x + this.m_wx.y * this.m_vp.y + this.m_wx.z * this.m_vp.z;
            let dy = this.m_wy.x * this.m_vp.x + this.m_wy.y * this.m_vp.y + this.m_wy.z * this.m_vp.z;
            let dz = this.m_wz.x * this.m_vp.x + this.m_wz.y * this.m_vp.y + this.m_wz.z * this.m_vp.z;

            // �g�͕����̑��x���������߂�

            rr = Math.sqrt(dx * dx + dy * dy);

            if (rr > 0.001) {
                this.m_vp2.x = (this.m_wx.x * dx + this.m_wy.x * dy) / rr;
                this.m_vp2.y = (this.m_wx.y * dx + this.m_wy.y * dy) / rr;
                this.m_vp2.z = (this.m_wx.z * dx + this.m_wy.z * dy) / rr;
            }
            else {
                this.m_vp2.x = this.m_wx.x * dx + this.m_wy.x * dy;
                this.m_vp2.y = this.m_wx.y * dx + this.m_wy.y * dy;
                this.m_vp2.z = this.m_wx.z * dx + this.m_wy.z * dy;
            }

            this.m_ni.x = this.m_wz.x * rr - this.m_vp2.x * dz;
            this.m_ni.y = this.m_wz.y * rr - this.m_vp2.y * dz;
            this.m_ni.z = this.m_wz.z * rr - this.m_vp2.z * dz;

            vv = this.m_ni.abs();

            this.m_ni.consInv(vv);

            // �}�p�����߂�

            at = -Math.atan(dz / dy);

            if (no === 0)
                plane.aoa = at;

            if (Math.abs(at) < 0.4) {
                //  �g�͌W���ƍR�͌W�����}�p���狁�߂�
                cl = at * 4;
                cd = (at * at + 0.05);
            }
            else {
                //  �}�p��0.4rad�𒴂��Ă����玸��
                cl = 0;
                cd = (0.4 * 0.4 + 0.05);
            }

            // �R�͂����߂�
            t0 = 0.5 * vv * vv * cd * ve * this.sVal;

            // �g�͂����߂�
            n = 0.5 * rr * rr * cl * ve * this.sVal;

            this.fVel.x = n * this.m_ni.x - t0 * this.m_ti.x;
            this.fVel.y = n * this.m_ni.y - t0 * this.m_ti.y;
            this.fVel.z = n * this.m_ni.z - t0 * this.m_ti.z;
        }

        if (this.tVal > 0) {

            // ���͌v�Z

            // ���͂����߂�
            if (boost)
                ff = ((5 * 10) / 0.9) * ve * 4.8 * this.tVal;
            else
                ff = (plane.power / 0.9) * ve * 4.8 * this.tVal;

            // �n�ʂɋ߂��ꍇ�A�������̐��͂��グ��
            if (plane.height < 20)
                ff *= (1 + (20 - plane.height) / 40);

            // ���͂�������

            this.fVel.addCons(this.m_wy, ff);
        }
        // this.forward.set(this.m_wy.x, this.m_wy.y, this.m_wy.z);
    }

}