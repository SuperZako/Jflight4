//
// Applet3D�N���X
//
// �R�c�\�����x�����邽�߂̃A�v���b�g�N���X
// ��ɂR�c���Q�c�ϊ��ƁA�L�[�X�L������e�C�x���g�Ǘ����s��
//

class Applet3D {
    sWidth: number;
    sHeight: number;        // �X�N���[���̑傫��
    protected sCenterX: number;
    sCenterY: number;     // �X�N���[���̃Z���^�[���W

    public camerapos: CVector3;         // �J�����̈ʒu

    bWidth: number; bHeight: number;                  // �o�b�N�o�b�t�@�̑傫���A���T�C�Y���ɃX�N���[���̑傫���ɂ��킹��


    // keyShoot: boolean;                     // �X�y�[�X�L�[�̏��
    // keyLeft: boolean;                      // ���J�[�\���L�[�̏��
    // keyRight: boolean;                     // �E�J�[�\���L�[�̏��
    // keyUp: boolean;                        // ��J�[�\���L�[�̏��
    // keyDown: boolean;                      // ���J�[�\���L�[�̏��
    // keyBoost: boolean;                     // B�i�u�[�X�g�j�L�[�̏��

    // �R���X�g���N�^

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

    // �o�b�N�o�b�t�@�̏�����

    public bgInit() {
        // this.backImage = this.createImage(this.sWidth, this.sHeight);
        // if (this.backImage != null) {
        //     this.bWidth = this.sWidth;
        //     this.bHeight = this.sHeight;
        //     this.bGraphics = this.backImage.getGraphics();
        // }
    }

    // �o�b�N�o�b�t�@�̃N���A

    public clear(context: CanvasRenderingContext2D | null) {

        if (context !== null) {
            context.fillStyle = "black";
            // context.fillStyle = "rgba(0,0,0,0)";
            context.fillRect(0, 0, this.sWidth, this.sHeight);
        }
    }

    // �o�b�N�o�b�t�@���t�����g�ɓ]��

    public flush() {
    }

    // �R�c�isp�j���Q�c�icp�j�ϊ�
    // �ϊ��ɂ�Plane�I�u�W�F�N�g�̕ϊ��s���p���Ă���

    change3d(plane: Plane, sp: CVector3, cp: CVector3) {

        // ���_���W�ɕ��s�ړ���A�ϊ��s����|����

        let x = sp.x - this.camerapos.x;
        let y = sp.y - this.camerapos.y;
        let z = sp.z - this.camerapos.z;

        let x1 = x * plane.matrix.elements[0] + y * plane.matrix.elements[4] + z * plane.matrix.elements[8];
        let y1 = x * plane.matrix.elements[1] + y * plane.matrix.elements[5] + z * plane.matrix.elements[9];
        let z1 = x * plane.matrix.elements[2] + y * plane.matrix.elements[6] + z * plane.matrix.elements[10];

        if (y1 > 10) {
            // ���s���Ŋ����ăX�N���[�����W�ɕϊ�
            y1 /= 10;
            cp.x = x1 * 50 / y1 + this.sCenterX;
            cp.y = -z1 * 50 / y1 + this.sCenterY;
            cp.z = y1 * 10;
        }
        else {
            // �ϊ���̉��s���iy1�j��10�ȉ��Ȃ�N���b�v
            cp.x = -10000;
            cp.y = -10000;
            cp.z = 1;
        }
    }

    // �n�ʂƋ@�̕\���p�̃��C���\��

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

    // �e�ە\���p�̃��C���\��

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

    // �e�ە\���p�̑������C���\��

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

    // �~�T�C�����p�̃��C���\��

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

    // �~�T�C���p�̃��C���\��

    public drawAline(p0: CVector3, p1: CVector3) {
        if (p0.x > -1000 && p1.x > -1000) {
            //bGraphics.setColor(Color.white);
            //bGraphics.drawLine(p0.x, (int)p0.y, (int)p1.x, (int)p1.y);
            //bGraphics.drawLine(p0.x + 1, (int)p0.y, (int)p1.x + 1, (int)p1.y);
            //bGraphics.drawLine(p0.x, (int)p0.y + 1, (int)p1.x, (int)p1.y + 1);
            //bGraphics.drawLine(p0.x + 1, (int)p0.y + 1, (int)p1.x + 1, (int)p1.y + 1);
        }
    }

    // �|���S���\��

    public drawPoly(context: CanvasRenderingContext2D | null, p0: CVector3, p1: CVector3, p2: CVector3) {
        this.drawSline(context, p0, p1);
        this.drawSline(context, p1, p2);
        this.drawSline(context, p2, p0);
    }

    // �����p�̉~�\��

    public fillBarc(p: CVector3) {
        if (p.x >= -100) {
            // �y���W�l�Ŕ��a��ς���

            let rr = (2000 / p.z) + 2;
            if (rr > 40)
                rr = 40;
            // bGraphics.setColor(Color.orange);

            // bGraphics.fillArc(p.x, p.y, rr, rr, 0, 360);
        }
    }

    // �C�x���g����������

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

    // ���T�C�Y�C�x���g����
    //this_componentResized(e: ComponentEvent) {
    //    this.sWidth = getSize().width;
    //    this.sHeight = getSize().height;
    //    this.sCenterX = (sWidth / 2);
    //    this.sCenterY = (sHeight / 2);
    //}
}


