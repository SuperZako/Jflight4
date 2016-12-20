

//
// CVector3
// �R���x�N�g���N���X
//
// �K�[�x�b�W�R���N�V����������邽�߁A�V�K�I�u�W�F�N�g�������K�v�ƂȂ�
// �a�⍷�����߂郁�\�b�h���������ĂȂ��̂Œ��ӁB
// �����Ɨ��֐����d�����āA�����o�ϐ���public�ɂ��Ă���
//

class CVector3 {

    // �ϐ�

    // public x: number;
    // public y: number;
    // public z: number;

    // �R���X�g���N�^
    public constructor(public x = 0, public y = 0, public z = 0) {
        //this.set(ax, ay, az);
    }

    // �l�ݒ�

    public set(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    // �x�N�g�����Z

    public add(a: CVector3) {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
        return this;
    }

    public setPlus(a: CVector3, b: CVector3) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    }

    // �x�N�g���萔�{���Z

    public addCons(a: CVector3, c: number) {
        this.x += a.x * c;
        this.y += a.y * c;
        this.z += a.z * c;
        return this;
    }

    // �x�N�g�����Z

    public sub(a: CVector3) {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
        return this;
    }

    public setMinus(a: CVector3, b: CVector3) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    }

    // �x�N�g���萔�{���Z
    public subCons(a: CVector3, c: number) {
        this.x -= a.x * c;
        this.y -= a.y * c;
        this.z -= a.z * c;
        return this;
    }

    // �萔�{

    public cons(c: number) {
        this.x *= c;
        this.y *= c;
        this.z *= c;
        return this;
    }

    public consInv(c: number) {
        this.x /= c;
        this.y /= c;
        this.z /= c;
        return this;
    }

    public setCons(a: CVector3, c: number) {
        this.x = a.x * c;
        this.y = a.y * c;
        this.z = a.z * c;
        return this;
    }

    public setConsInv(a: CVector3, c: number) {
        this.x = a.x / c;
        this.y = a.y / c;
        this.z = a.z / c;
        return this;
    }

    // �x�N�g�����̂Q��

    public abs2() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    // �x�N�g����

    public abs() {
        return Math.sqrt(this.abs2());
    }

    // ����

    public inprod(a: CVector3) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    }
}

