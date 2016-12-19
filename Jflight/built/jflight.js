var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// THREEx.KeyboardState.js keep the current state of the keyboard.
// It is possible to query it at any time. No need of an event.
// This is particularly convenient in loop driven case, like in
// 3D demos or games.
//
// # Usage
//
// **Step 1**: Create the object
//
// ```var keyboard	= new THREEx.KeyboardState();```
//
// **Step 2**: Query the keyboard state
//
// This will return true if shift and A are pressed, false otherwise
//
// ```keyboard.pressed("shift+A")```
//
// **Step 3**: Stop listening to the keyboard
//
// ```keyboard.destroy()```
//
// NOTE: this library may be nice as standaline. independant from three.js
// - rename it keyboardForGame
//
// # Code
//
/** @namespace */
var THREEx;
(function (THREEx) {
    /**
     * - NOTE: it would be quite easy to push event-driven too
     *   - microevent.js for events handling
     *   - in this._onkeyChange, generate a string from the DOM event
     *   - use this as event name
    */
    var KeyboardState = (function () {
        function KeyboardState(domElement) {
            //this.domElement = domElement || document;
            // to store the current state
            //this.keyCodes = {};
            //this.modifiers = {};
            if (domElement === void 0) { domElement = document; }
            var _this = this;
            this.domElement = domElement;
            this.keyCodes = {};
            this.modifiers = {};
            this._onBlur = function () {
                for (var prop in _this.keyCodes) {
                    _this.keyCodes[prop] = false;
                }
                for (var prop in _this.modifiers) {
                    _this.modifiers[prop] = false;
                }
            };
            /**
             * to process the keyboard dom event
            */
            this._onKeyChange = function (event) {
                // log to debug
                //console.log("onKeyChange", event, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)
                // update this.keyCodes
                var keyCode = event.keyCode;
                var pressed = event.type === "keydown" ? true : false;
                _this.keyCodes[keyCode] = pressed;
                // update this.modifiers
                _this.modifiers["shift"] = event.shiftKey;
                _this.modifiers["ctrl"] = event.ctrlKey;
                _this.modifiers["alt"] = event.altKey;
                _this.modifiers["meta"] = event.metaKey;
            };
            // create callback to bind/unbind keyboard events
            //var _this = this;
            //this._onKeyDown = function (event) { _this._onKeyChange(event) }
            //this._onKeyUp = function (event) { _this._onKeyChange(event) }
            // bind keyEvents
            this.domElement.addEventListener("keydown", this._onKeyChange, false);
            this.domElement.addEventListener("keyup", this._onKeyChange, false);
            // create callback to bind/unbind window blur event
            //this._onBlur = () => {
            //    for (var prop in this.keyCodes)
            //        this.keyCodes[prop] = false;
            //    for (var prop in this.modifiers)
            //        this.modifiers[prop] = false;
            //}
            // bind window blur
            window.addEventListener("blur", this._onBlur, false);
        }
        /**
         * To stop listening of the keyboard events
        */
        KeyboardState.prototype.destroy = function () {
            // unbind keyEvents
            this.domElement.removeEventListener("keydown", this._onKeyChange, false);
            this.domElement.removeEventListener("keyup", this._onKeyChange, false);
            // unbind window blur event
            window.removeEventListener("blur", this._onBlur, false);
        };
        /**
         * query keyboard state to know if a key is pressed of not
         *
         * @param {String} keyDesc the description of the key. format : modifiers+key e.g shift+A
         * @returns {Boolean} true if the key is pressed, false otherwise
        */
        KeyboardState.prototype.pressed = function (keyDesc) {
            var keys = keyDesc.split("+");
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var pressed = false;
                if (KeyboardState.MODIFIERS.indexOf(key) !== -1) {
                    pressed = this.modifiers[key];
                }
                else if (Object.keys(KeyboardState.ALIAS).indexOf(key) !== -1) {
                    pressed = this.keyCodes[KeyboardState.ALIAS[key]];
                }
                else {
                    pressed = this.keyCodes[key.toUpperCase().charCodeAt(0)];
                }
                if (!pressed) {
                    return false;
                }
            }
            ;
            return true;
        };
        /**
         * return true if an event match a keyDesc
         * @param  {KeyboardEvent} event   keyboard event
         * @param  {String} keyDesc string description of the key
         * @return {Boolean}         true if the event match keyDesc, false otherwise
         */
        KeyboardState.prototype.eventMatches = function (event, keyDesc) {
            var aliases = KeyboardState.ALIAS;
            var aliasKeys = Object.keys(aliases);
            var keys = keyDesc.split("+");
            // log to debug
            // console.log("eventMatches", event, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var pressed = false;
                if (key === "shift") {
                    pressed = (event.shiftKey ? true : false);
                }
                else if (key === "ctrl") {
                    pressed = (event.ctrlKey ? true : false);
                }
                else if (key === "alt") {
                    pressed = (event.altKey ? true : false);
                }
                else if (key === "meta") {
                    pressed = (event.metaKey ? true : false);
                }
                else if (aliasKeys.indexOf(key) !== -1) {
                    pressed = (event.keyCode === aliases[key] ? true : false);
                }
                else if (event.keyCode === key.toUpperCase().charCodeAt(0)) {
                    pressed = true;
                }
                if (!pressed) {
                    return false;
                }
            }
            return true;
        };
        return KeyboardState;
    }());
    KeyboardState.MODIFIERS = ["shift", "ctrl", "alt", "meta"];
    KeyboardState.ALIAS = {
        "left": 37, "up": 38, "right": 39, "down": 40,
        "space": 32, "pageup": 33, "pagedown": 34, "tab": 9, "escape": 27,
    };
    THREEx.KeyboardState = KeyboardState;
})(THREEx || (THREEx = {}));
//
// Applet3D�N���X
//
// �R�c�\����x�����邽�߂̃A�v���b�g�N���X
// ��ɂR�c���Q�c�ϊ��ƁA�L�[�X�L������e�C�x���g�Ǘ���s��
//
var Applet3D = (function () {
    // keyShoot: boolean;                     // �X�y�[�X�L�[�̏��
    // keyLeft: boolean;                      // ���J�[�\���L�[�̏��
    // keyRight: boolean;                     // �E�J�[�\���L�[�̏��
    // keyUp: boolean;                        // ��J�[�\���L�[�̏��
    // keyDown: boolean;                      // ���J�[�\���L�[�̏��
    // keyBoost: boolean;                     // B�i�u�[�X�g�j�L�[�̏��
    // �R���X�g���N�^
    function Applet3D() {
        this.camerapos = new CVector3();
        this.sWidth = 600;
        this.sHeight = 400;
        this.sCenterX = 300;
        this.sCenterY = 200;
        try {
            this.jbInit();
        }
        catch (e) {
            e.printStackTrace();
        }
        this.bgInit();
    }
    // �o�b�N�o�b�t�@�̏�����
    Applet3D.prototype.bgInit = function () {
        // this.backImage = this.createImage(this.sWidth, this.sHeight);
        // if (this.backImage != null) {
        //     this.bWidth = this.sWidth;
        //     this.bHeight = this.sHeight;
        //     this.bGraphics = this.backImage.getGraphics();
        // }
    };
    // �o�b�N�o�b�t�@�̃N���A
    Applet3D.prototype.clear = function (context) {
        if (context !== null) {
            context.fillStyle = "black";
            // context.fillStyle = "rgba(0,0,0,0)";
            context.fillRect(0, 0, this.sWidth, this.sHeight);
        }
    };
    // �o�b�N�o�b�t�@��t�����g�ɓ]��
    Applet3D.prototype.flush = function () {
    };
    // �R�c�isp�j���Q�c�icp�j�ϊ�
    // �ϊ��ɂ�Plane�I�u�W�F�N�g�̕ϊ��s���p���Ă���
    Applet3D.prototype.change3d = function (plane, sp, cp) {
        // ���_���W�ɕ��s�ړ���A�ϊ��s���|����
        var x = sp.x - this.camerapos.x;
        var y = sp.y - this.camerapos.y;
        var z = sp.z - this.camerapos.z;
        var x1 = x * plane.matrix.elements[0] + y * plane.matrix.elements[4] + z * plane.matrix.elements[8];
        var y1 = x * plane.matrix.elements[1] + y * plane.matrix.elements[5] + z * plane.matrix.elements[9];
        var z1 = x * plane.matrix.elements[2] + y * plane.matrix.elements[6] + z * plane.matrix.elements[10];
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
    };
    // �n�ʂƋ@�̕\���p�̃��C���\��
    Applet3D.prototype.drawSline = function (context, p0, p1) {
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
    };
    // �e�ە\���p�̃��C���\��
    Applet3D.prototype.drawBlined = function (context, p0, p1) {
        if (context && p0.x > -1000 && p1.x > -1000) {
            // bGraphics.setColor(Color.yellow);
            context.strokeStyle = "yellow";
            // bGraphics.drawLine((int)p0.x, (int)p0.y, (int)p1.x, (int)p1.y);
            context.beginPath();
            context.moveTo(p0.x, p0.y);
            context.lineTo(p1.x, p1.y);
            context.stroke();
        }
    };
    // �e�ە\���p�̑������C���\��
    Applet3D.prototype.drawBline = function (context, p0, p1) {
        if (context && p0.x > -1000 && p1.x > -1000) {
            //bGraphics.setColor(Color.yellow);
            context.strokeStyle = "yellow";
            //bGraphics.drawLine(p0.x, (int)p0.y, (int)p1.x, (int)p1.y);
            context.beginPath();
            context.moveTo(p0.x, p0.y);
            context.lineTo(p1.x, p1.y);
            context.stroke();
        }
    };
    // �~�T�C�����p�̃��C���\��
    Applet3D.prototype.drawMline = function (context, p0, p1) {
        if (context && p0.x > -1000 && p1.x > -1000) {
            // bGraphics.setColor(Color.lightGray);
            context.strokeStyle = "lightgrey";
            // bGraphics.drawLine(p0.x, p0.y, p1.x, p1.y);
            context.beginPath();
            context.moveTo(p0.x, p0.y);
            context.lineTo(p1.x, p1.y);
            context.stroke();
        }
    };
    // �~�T�C���p�̃��C���\��
    Applet3D.prototype.drawAline = function (p0, p1) {
        if (p0.x > -1000 && p1.x > -1000) {
        }
    };
    // �|���S���\��
    Applet3D.prototype.drawPoly = function (context, p0, p1, p2) {
        this.drawSline(context, p0, p1);
        this.drawSline(context, p1, p2);
        this.drawSline(context, p2, p0);
    };
    // �����p�̉~�\��
    Applet3D.prototype.fillBarc = function (p) {
        if (p.x >= -100) {
            // �y���W�l�Ŕ��a��ς���
            var rr = (2000 / p.z) + 2;
            if (rr > 40)
                rr = 40;
        }
    };
    // �C�x���g����������
    Applet3D.prototype.jbInit = function () {
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
    };
    return Applet3D;
}());
//
// CVector3
// �R���x�N�g���N���X
//
// �K�[�x�b�W�R���N�V���������邽�߁A�V�K�I�u�W�F�N�g�������K�v�ƂȂ�
// �a�⍷����߂郁�\�b�h��������ĂȂ��̂Œ��ӁB
// �����Ɨ��֐���d�����āA�����o�ϐ���public�ɂ��Ă���
//
var CVector3 = (function () {
    // �ϐ�
    // public x: number;
    // public y: number;
    // public z: number;
    // �R���X�g���N�^
    function CVector3(x, y, z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        this.x = x;
        this.y = y;
        this.z = z;
        //this.set(ax, ay, az);
    }
    // �l�ݒ�
    CVector3.prototype.set = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    };
    // �x�N�g�����Z
    CVector3.prototype.add = function (a) {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
        return this;
    };
    CVector3.prototype.setPlus = function (a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    };
    // �x�N�g���萔�{���Z
    CVector3.prototype.addCons = function (a, c) {
        this.x += a.x * c;
        this.y += a.y * c;
        this.z += a.z * c;
        return this;
    };
    // �x�N�g�����Z
    CVector3.prototype.sub = function (a) {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
        return this;
    };
    CVector3.prototype.setMinus = function (a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    };
    // �x�N�g���萔�{���Z
    CVector3.prototype.subCons = function (a, c) {
        this.x -= a.x * c;
        this.y -= a.y * c;
        this.z -= a.z * c;
        return this;
    };
    // �萔�{
    CVector3.prototype.cons = function (c) {
        this.x *= c;
        this.y *= c;
        this.z *= c;
        return this;
    };
    CVector3.prototype.consInv = function (c) {
        this.x /= c;
        this.y /= c;
        this.z /= c;
        return this;
    };
    CVector3.prototype.setCons = function (a, c) {
        this.x = a.x * c;
        this.y = a.y * c;
        this.z = a.z * c;
        return this;
    };
    CVector3.prototype.setConsInv = function (a, c) {
        this.x = a.x / c;
        this.y = a.y / c;
        this.z = a.z / c;
        return this;
    };
    // �x�N�g�����̂Q��
    CVector3.prototype.abs2 = function () {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    };
    // �x�N�g����
    CVector3.prototype.abs = function () {
        return Math.sqrt(this.abs2());
    };
    // ���
    CVector3.prototype.inprod = function (a) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    };
    return CVector3;
}());
//
// Wing
// ���N���X
//
// ���ɂ����G���W����\��
//
var Wing = (function () {
    // �R���X�g���N�^
    function Wing() {
        this.pVel = new CVector3();
        this.xVel = new CVector3();
        this.yVel = new CVector3();
        this.zVel = new CVector3();
        this.vVel = new CVector3();
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
    // ���v�Z��s��
    // fVel�Ɍv�Z���ʂ����܂�
    // ve�͋�C���x�Ano�͗�No.�i�}�p�v�Z�Ɏg�p�j�Aboost�̓G���W���u�[�X�g
    Wing.prototype.calc = function (plane, ve, no, boost) {
        var vv, t0, n, at, sin, cos, rr, cl, cd, ff, dx, dy, dz;
        // �@�̂̑��x�Ɖ�]���A���̈ʒu���痃�ɂ����鑬�x����߂�i�O�όv�Z�j
        this.m_vp.x = plane.vVel.x + this.pVel.y * plane.vaVel.z - this.pVel.z * plane.vaVel.y;
        this.m_vp.y = plane.vVel.y + this.pVel.z * plane.vaVel.x - this.pVel.x * plane.vaVel.z;
        this.m_vp.z = plane.vVel.z + this.pVel.x * plane.vaVel.y - this.pVel.y * plane.vaVel.x;
        // ���̂Ђ˂���ɁA��{���W�x�N�g�����]
        sin = Math.sin(this.bAngle);
        cos = Math.cos(this.bAngle);
        this.m_qx.x = this.xVel.x * cos - this.zVel.x * sin;
        this.m_qx.y = this.xVel.y * cos - this.zVel.y * sin;
        this.m_qx.z = this.xVel.z * cos - this.zVel.z * sin;
        this.m_qy.set(this.yVel.x, this.yVel.y, this.yVel.z);
        this.m_qz.x = this.xVel.x * sin + this.zVel.x * cos;
        this.m_qz.y = this.xVel.y * sin + this.zVel.y * cos;
        this.m_qz.z = this.xVel.z * sin + this.zVel.z * cos;
        sin = Math.sin(this.aAngle);
        cos = Math.cos(this.aAngle);
        this.m_wx.set(this.m_qx.x, this.m_qx.y, this.m_qx.z);
        this.m_wy.x = this.m_qy.x * cos - this.m_qz.x * sin;
        this.m_wy.y = this.m_qy.y * cos - this.m_qz.y * sin;
        this.m_wy.z = this.m_qy.z * cos - this.m_qz.z * sin;
        this.m_wz.x = this.m_qy.x * sin + this.m_qz.x * cos;
        this.m_wz.y = this.m_qy.y * sin + this.m_qz.y * cos;
        this.m_wz.z = this.m_qy.z * sin + this.m_qz.z * cos;
        t0 = 0;
        this.fVel.set(0, 0, 0);
        if (this.sVal > 0) {
            // ���v�Z
            vv = this.m_vp.abs();
            // �����x�̒P�ʃx�N�g������߂�(�@�̍��W)
            this.m_ti.x = this.m_vp.x / vv;
            this.m_ti.y = this.m_vp.y / vv;
            this.m_ti.z = this.m_vp.z / vv;
            // �@�̍��W�̗����x�𗃍��W�n�ɕϊ�
            dx = this.m_wx.x * this.m_vp.x + this.m_wx.y * this.m_vp.y + this.m_wx.z * this.m_vp.z;
            dy = this.m_wy.x * this.m_vp.x + this.m_wy.y * this.m_vp.y + this.m_wy.z * this.m_vp.z;
            dz = this.m_wz.x * this.m_vp.x + this.m_wz.y * this.m_vp.y + this.m_wz.z * this.m_vp.z;
            // �g�͕����̑��x��������߂�
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
            // �}�p����߂�
            at = -Math.atan(dz / dy);
            if (no === 0)
                plane.aoa = at;
            if (Math.abs(at) < 0.4) {
                //  �g�͌W���ƍR�͌W����}�p���狁�߂�
                cl = at * 4;
                cd = (at * at + 0.05);
            }
            else {
                //  �}�p��0.4rad�𒴂��Ă����玸��
                cl = 0;
                cd = (0.4 * 0.4 + 0.05);
            }
            // �R�͂���߂�
            t0 = 0.5 * vv * vv * cd * ve * this.sVal;
            // �g�͂���߂�
            n = 0.5 * rr * rr * cl * ve * this.sVal;
            this.fVel.x = n * this.m_ni.x - t0 * this.m_ti.x;
            this.fVel.y = n * this.m_ni.y - t0 * this.m_ti.y;
            this.fVel.z = n * this.m_ni.z - t0 * this.m_ti.z;
        }
        if (this.tVal > 0) {
            // ���͌v�Z
            // ���͂���߂�
            if (boost)
                ff = (5 * 10) / 0.9 * ve * 4.8 * this.tVal;
            else
                ff = plane.power / 0.9 * ve * 4.8 * this.tVal;
            // �n�ʂɋ߂��ꍇ�A�������̐��͂�グ��
            if (plane.height < 20)
                ff *= (1 + (20 - plane.height) / 40);
            // ���͂������
            this.fVel.addCons(this.m_wy, ff);
        }
        this.vVel.set(this.m_wy.x, this.m_wy.y, this.m_wy.z);
    };
    return Wing;
}());
///<reference path="CVector3.ts" />
//
// Bullet
// �e�ۃN���X
//
var Bullet = (function () {
    // �R���X�g���N�^
    function Bullet(scene) {
        // �ϐ�
        this.pVel = new CVector3(); // �ʒu
        this.opVel = new CVector3(); // �P�X�e�b�v�O�̈ʒu
        this.vVel = new CVector3(); // ���x
        this.use = 0; // �g�p��ԁi0�Ŗ��g�p�j
        this.bom = 0; // ������ԁi0�Ŗ����j
        // �e���|�����p�I�u�W�F�N�g
        this.m_a = new CVector3();
        this.m_b = new CVector3();
        this.m_vv = new CVector3();
        var geometry = new THREE.SphereGeometry(5, 8, 8);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.sphere = new THREE.Mesh(geometry, material);
        this.sphere.visible = false;
        scene.add(this.sphere);
    }
    // �e�ۈړ��A�G�@�Ƃ̂����蔻��A�n�ʂƂ̓����蔻���s��
    // �e�۔��ˏ�����Jflight�N���X���ōs���Ă���
    Bullet.prototype.move = function (world, plane) {
        // �d�͉���
        this.vVel.z += Jflight.G * Jflight.DT;
        // ��O�̈ʒu��ۑ�
        this.opVel.set(this.pVel.x, this.pVel.y, this.pVel.z);
        // �ړ�
        this.pVel.addCons(this.vVel, Jflight.DT);
        this.use--;
        // �e�ۂ�ړ�������
        if (this.use > 0) {
            this.sphere.position.x = this.pVel.x;
            this.sphere.position.y = this.pVel.y;
            this.sphere.position.z = this.pVel.z;
            this.sphere.visible = true;
        }
        else {
            this.sphere.visible = false;
        }
        // �e�ۂ��������̏ꍇ�A���~�\��
        if (this.bom > 0) {
            // this.change3d(this.plane[0], bp.opVel, cp);
            // this.fillBarc(cp);
            this.bom--;
        }
        // �ڕW����܂��Ă���̂Ȃ�^�[�Q�b�g�Ƃ̓����蔻���s��
        // �ڕW�ȊO�Ƃ̓����蔻��͍s��Ȃ�
        if (plane.gunTarget > -1) {
            // �ڕW�����݂��Ă���ꍇ
            // �����ł̓����蔻����@�́A
            // ��O�̈ʒu�ƌ��݂̈ʒu�Ƃ̋�����
            // ��O�̈ʒu�ƖڕW�̋����A���݂̈ʒu�ƖڕW�̋����Ƃ̘a���r���邱�Ƃ�
            // �s���Ă���B�e�ۑ��x���������߁A�P�ɋ�������߂Ă������Ȃ��B
            // �_�ƒ����̕������ōĐڋߋ�������߂Ă�ǂ����A�ʓ|�������̂Ŏ蔲�� �B
            // ���݂̒e�ۂ̈ʒu�ƖڕW�Ƃ̍��x�N�g������߂�
            this.m_a.setMinus(this.pVel, world.plane[plane.gunTarget].pVel);
            // ��O�̒e�ۂ̈ʒu�ƖڕW�Ƃ̍��x�N�g������߂�
            this.m_b.setMinus(this.opVel, world.plane[plane.gunTarget].pVel);
            // ��O�̒e�ۂ̈ʒu�ƌ��݂̒e�ۂ̈ʒu�Ƃ̍��x�N�g������߂�
            this.m_vv.setCons(this.vVel, Jflight.DT);
            var v0 = this.m_vv.abs();
            var l = this.m_a.abs() + this.m_b.abs();
            if (l < v0 * 1.05) {
                // ����
                this.bom = 1; // �����\���p�ɃZ�b�g
                this.use = 10; // �����ɂ͏����Ȃ��Œ��˔�΂�
                // ���݈ʒu�ƈ�O�̈ʒu�̒��Ԉʒu�����̑��x�����𑫂��Ē��˔�΂�
                this.m_vv.x = (this.m_a.x + this.m_b.x) / 2.0;
                this.m_vv.y = (this.m_a.y + this.m_b.y) / 2.0;
                this.m_vv.z = (this.m_a.z + this.m_b.z) / 2.0;
                l = this.m_vv.abs();
                this.m_vv.consInv(l);
                this.vVel.addCons(this.m_vv, v0 / 0.1);
                this.vVel.cons(0.1);
            }
        }
        // �n�ʂƂ̓����蔻��
        var gh = world.gHeight(this.pVel.x, this.pVel.y);
        if (this.pVel.z < gh) {
            // �n�ʈȉ��Ȃ�A�����˂�����
            this.vVel.z = Math.abs(this.vVel.z);
            this.pVel.z = gh;
            this.vVel.x += (Math.random() - 0.5) * 50;
            this.vVel.y += (Math.random() - 0.5) * 50;
            this.vVel.x *= 0.5;
            this.vVel.y *= 0.5;
            this.vVel.z *= 0.1;
        }
    };
    return Bullet;
}());
//
// missile
// �~�T�C���N���X
//
var Missile = (function () {
    function Missile(scene) {
        this.opVel = []; // �̂̈ʒu�i���̈ʒu�j
        this.use = 0; // �g�p��ԁi0�Ŗ��g�p�j
        this.bom = 0; // ������ԁi0�Ŗ����j
        this.bomm = 0; // �j���ԁi0�Ŗ����j
        this.spheres = [];
        this.pVel = new CVector3();
        this.vpVel = new CVector3();
        this.aVel = new CVector3();
        for (var i = 0; i < Missile.MOMAX; i++) {
            this.opVel.push(new CVector3());
        }
        this.m_a0 = new CVector3();
        var geometries = [];
        for (var i = 0; i < Missile.MOMAX; ++i) {
            geometries.push(new THREE.SphereGeometry(5, 8, 8));
        }
        var materials = [];
        for (var i = 0; i < Missile.MOMAX; ++i) {
            materials.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));
            materials[i].opacity = 0.5;
            materials[i].transparent = true;
        }
        for (var i = 0; i < Missile.MOMAX; ++i) {
            this.spheres.push(new THREE.Mesh(geometries[i], materials[i]));
        }
        for (var i = 0; i < Missile.MOMAX; ++i) {
            this.spheres[i].visible = false;
            scene.add(this.spheres[i]);
        }
        this.explosion = new THREE.Mesh(new THREE.SphereGeometry(50, 16, 16), new THREE.MeshBasicMaterial({ color: 0xf0f0f0 }));
        this.explosion.visible = false;
        scene.add(this.explosion);
    }
    // �~�T�C���̃z�[�~���O����
    Missile.prototype.horming = function (world, _plane) {
        // ���b�NON����Ă��āA�c��X�e�b�v��85�ȉ��Ȃ�z�[�~���O����
        if (this.targetNo >= 0 && this.use < 100 - 15) {
            // �����̑��x����߂�
            var v = this.vpVel.abs();
            if (Math.abs(v) < 1) {
                v = 1;
            }
            // �ǔ��ڕW
            var tp = world.plane[this.targetNo];
            // �ǔ��ڕW�Ƃ̋�������߂�
            this.m_a0.setMinus(tp.pVel, this.pVel);
            var l = this.m_a0.abs();
            if (l < 0.001) {
                l = 0.001;
            }
            // �ǔ��ڕW�Ƃ̑��x������߂�
            this.m_a0.setMinus(tp.vpVel, this.vpVel);
            var m = this.m_a0.abs();
            // �Փ˗\�z���Ԃ�C������ŋ��߂�
            var t0 = l / v * (1.0 - m / (800 + 1));
            // �Փ˗\�z���Ԃ�O����T�Ɋۂ߂�
            if (t0 < 0) {
                t0 = 0;
            }
            if (t0 > 5) {
                t0 = 5;
            }
            // �Փ˗\�z���Ԏ��̃^�[�Q�b�g�̈ʒu�Ǝ����̈ʒu�̍�����߂�
            this.m_a0.x = tp.pVel.x + tp.vpVel.x * t0 - (this.pVel.x + this.vpVel.x * t0);
            this.m_a0.y = tp.pVel.y + tp.vpVel.y * t0 - (this.pVel.y + this.vpVel.y * t0);
            this.m_a0.z = tp.pVel.z + tp.vpVel.z * t0 - (this.pVel.z + this.vpVel.z * t0);
            var tr = ((100 - 15) - this.use) * 0.02 + 0.5;
            if (tr > 0.1) {
                tr = 0.1;
            }
            if (tr < 1) {
                // ���˒���́A�h��ȋ@������Ȃ�
                l = this.m_a0.abs();
                this.aVel.addCons(this.m_a0, l * tr * 10);
            }
            else {
                // �����łȂ��ꍇ�A�ǔ������փ~�T�C���@��������
                this.aVel.set(this.m_a0.x, this.m_a0.y, this.m_a0.z);
            }
            // ������P�ʃx�N�g���ɕ␳
            this.aVel.consInv(this.aVel.abs());
        }
    };
    // �~�T�C�����[�^�[�v�Z
    Missile.prototype.calcMotor = function (_world, _plane) {
        // ���˒���̓��[�^�[OFF
        if (this.use < 100 - 5) {
            var aa = 1.0 / 20;
            var bb = 1 - aa;
            // ���݂̑��x�����ƌ���������������ĐV���ȑ��x�����Ƃ���
            var v = this.vpVel.abs();
            this.vpVel.x = this.aVel.x * v * aa + this.vpVel.x * bb;
            this.vpVel.y = this.aVel.y * v * aa + this.vpVel.y * bb;
            this.vpVel.z = this.aVel.z * v * aa + this.vpVel.z * bb;
            // �~�T�C������
            this.vpVel.addCons(this.aVel, 10.0);
        }
    };
    // �~�T�C���ړ��A�G�@�Ƃ̂����蔻��A�n�ʂƂ̓����蔻���s��
    // �~�T�C�����ˏ�����Jflight�N���X���ōs���Ă���
    Missile.prototype.move = function (world, plane) {
        // �������Ȃ�J�E���^����
        if (this.bom > 0) {
            // �������
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
        this.opVel[this.use % Missile.MOMAX].set(this.pVel.x, this.pVel.y, this.pVel.z);
        // �~�T�C���ړ�
        this.pVel.addCons(this.vpVel, Jflight.DT);
        this.use--;
        // �^�[�Q�b�g�Ƃ̓����蔻��
        // ���b�N���Ă���ΏۂƂ̂ݓ����蔻�肷��
        if (this.targetNo >= 0) {
            // �ǔ��ڕW
            var tp = world.plane[this.targetNo];
            // �^�[�Q�b�g�Ƃ̋�������߂āA������x�ȉ��Ȃ瓖����i�ڐG�M�ǂ̂ݎg�p�j
            this.m_a0.setMinus(this.pVel, tp.pVel);
            if (this.m_a0.abs() < 10) {
                this.bom = 10;
                // ����
                tp.posInit();
            }
        }
        if (this.use >= 0) {
            // �~�T�C�����������łȂ���΁A�~�T�C���{�̂�\��
            if (this.bom <= 0) {
            }
            // �~�T�C���̉���\��
            // ���̍��W�̓����O�o�b�t�@�Ɋi�[����Ă���
            for (var i = 0; i < Missile.MOMAX; ++i) {
                this.spheres[i].visible = false;
            }
            var k = (this.use + Missile.MOMAX + 1) % Missile.MOMAX;
            // this.change3d(this.plane[0], ap.opVel[k], dm);
            for (var m = 0; m < this.count; m++) {
                // this.change3d(this.plane[0], ap.opVel[k], cp);
                // this.drawMline(context, dm, cp);
                this.spheres[k].position.x = this.opVel[k].x;
                this.spheres[k].position.y = this.opVel[k].y;
                this.spheres[k].position.z = this.opVel[k].z;
                this.spheres[k].visible = true;
                k = (k + Missile.MOMAX + 1) % Missile.MOMAX;
            }
        }
        // �~�T�C�����������̏ꍇ�A���~�\��
        this.explosion.visible = false;
        if (this.bom > 0) {
            this.explosion.position.x = this.pVel.x;
            this.explosion.position.y = this.pVel.y;
            this.explosion.position.z = this.pVel.z;
            this.explosion.visible = true;
        }
        // �n�ʂƂ̓����蔻��
        var gh = world.gHeight(this.pVel.x, this.pVel.y);
        if (this.pVel.z < gh) {
            this.bom = 10;
            this.pVel.z = gh + 3;
        }
        // �����O�o�b�t�@���i���̒����j��ݒ�
        if (this.count < Missile.MOMAX) {
            this.count++;
        }
    };
    return Missile;
}());
// �萔
Missile.MOMAX = 50; // ���̒����̍ő�l
///<reference path="CVector3.ts" />
///<reference path="Wing.ts" />
///<reference path="Bullet.ts" />
///<reference path="Missile.ts" />
//
// Plane
// �@�̃N���X
//
// �e�e�ۂ�~�T�C���𓮂����Ă���̂���̃N���X
//
var Plane = (function () {
    // �R���X�g���N�^
    function Plane(scene) {
        this.matrix = new THREE.Matrix4();
        this.wings = []; // �e��(0,1-�嗃,2-��������,3-��������,4,5-�G���W��)
        this.pVel = new CVector3(); // �@�̈ʒu�i���[���h���W�n�j
        this.vpVel = new CVector3(); // �@�̑��x�i���[���h���W�n�j
        this.vVel = new CVector3(); // �@�̑��x�i�@�̍��W�n�j
        this.gVel = new CVector3(); // �@�̉����x�i���[���h���W�n�j
        this.aVel = new THREE.Euler(); // �@�̌����i�I�C���[�p�j
        this.vaVel = new CVector3(); // �@�̉�]���x�i�I�C���[�p�j
        this.gcVel = new CVector3(); // �e�ۂ̏����\�z�ʒu
        this.iMass = new CVector3(); // �@�̊e���̊������[�����g
        // ���c�n
        this.stickPos = new CVector3(); // ���c�n�ʒu�ix,y-�X�e�B�b�N,z-�y�_���j
        this.stickVel = new CVector3(); // ���c�n�ω���
        // �@�e�n
        this.bullet = []; // �e�e�ۃI�u�W�F�N�g
        // �~�T�C���n
        this.aam = []; // �e�~�T�C���I�u�W�F�N�g
        for (var i = 0; i < Plane.BMAX; i++) {
            this.bullet.push(new Bullet(scene));
        }
        for (var i = 0; i < Plane.MMMAX; i++) {
            this.aam.push(new Missile(scene));
        }
        for (var i = 0; i < Plane.WMAX; i++) {
            this.wings.push(new Wing());
        }
        this.aamTarget = new Array(Plane.MMMAX);
        this.posInit();
        var material = new THREE.LineBasicMaterial({
            color: 0xffffff
        });
        var geometry = new THREE.Geometry();
        for (var _i = 0, _a = Jflight.obj; _i < _a.length; _i++) {
            var vertices = _a[_i];
            geometry.vertices.push(new THREE.Vector3(vertices[0].x, vertices[0].y, vertices[0].z));
            geometry.vertices.push(new THREE.Vector3(vertices[1].x, vertices[1].y, vertices[1].z));
            geometry.vertices.push(new THREE.Vector3(vertices[2].x, vertices[2].y, vertices[2].z));
        }
        this.line = new THREE.Line(geometry, material);
        scene.add(this.line);
    }
    // �e�ϐ������������
    Plane.prototype.posInit = function () {
        this.pVel.x = (Math.random() - 0.5) * 1000 - 8000;
        this.pVel.y = (Math.random() - 0.5) * 1000 - 1100;
        this.pVel.z = 5000;
        this.gHeight = 0;
        this.height = 5000;
        this.vpVel.x = 200.0;
        this.aVel.set(0, 0, Math.PI / 2);
        this.vpVel.y = 0.0;
        this.vpVel.z = 0.0;
        this.gVel.set(0, 0, 0);
        this.vaVel.set(0, 0, 0);
        this.vVel.set(0, 0, 0);
        this.power = 5;
        this.throttle = 5;
        this.heatWait = false;
        this.gunTemp = 0;
        this.gcVel.set(this.pVel.x, this.pVel.y, this.pVel.z);
        this.target = -2;
        this.onGround = false;
        this.gunX = 0;
        this.gunY = 100;
        this.gunVx = 0;
        this.gunVy = 0;
        this.boost = false;
        this.aoa = 0;
        this.stickPos.set(0, 0, 0);
        this.stickVel.set(0, 0, 0);
        this.stickR = 0.1;
        this.stickA = 0.1;
        var wa = 45 * Math.PI / 180;
        var wa2 = 0 * Math.PI / 180;
        // �e���̈ʒu�ƌ�����Z�b�g
        //  �E��???
        this.wings[0].pVel.set(3, 0.1, 0);
        this.wings[0].xVel.set(Math.cos(wa), -Math.sin(wa), Math.sin(wa2));
        this.wings[0].yVel.set(Math.sin(wa), Math.cos(wa), 0);
        this.wings[0].zVel.set(0, 0, 1);
        // �@����???
        this.wings[1].pVel.set(-3, 0.1, 0);
        this.wings[1].xVel.set(Math.cos(wa), Math.sin(wa), -Math.sin(wa2));
        this.wings[1].yVel.set(-Math.sin(wa), Math.cos(wa), 0);
        this.wings[1].zVel.set(0, 0, 1);
        // ��������
        this.wings[2].pVel.set(0, -10, 2);
        this.wings[2].xVel.set(1, 0, 0);
        this.wings[2].yVel.set(0, 1, 0);
        this.wings[2].zVel.set(0, 0, 1);
        // ��������
        this.wings[3].pVel.set(0, -10, 0);
        this.wings[3].xVel.set(0, 0, 1);
        this.wings[3].yVel.set(0, 1, 0);
        this.wings[3].zVel.set(1, 0, 0);
        // �E�G���W��
        this.wings[4].pVel.set(5, 0, 0);
        this.wings[4].xVel.set(1, 0, 0);
        this.wings[4].yVel.set(0, 1, 0);
        this.wings[4].zVel.set(0, 0, 1);
        // ���G���W��
        this.wings[5].pVel.set(-5, 0, 0);
        this.wings[5].xVel.set(1, 0, 0);
        this.wings[5].yVel.set(0, 1, 0);
        this.wings[5].zVel.set(0, 0, 1);
        // �e���̎��ʂ�Z�b�g
        this.wings[0].mass = 400 / 2;
        this.wings[1].mass = 400 / 2;
        this.wings[2].mass = 50;
        this.wings[3].mass = 50;
        this.wings[4].mass = 300;
        this.wings[5].mass = 300;
        // �e���̖ʐς�Z�b�g
        this.wings[0].sVal = 60 / 2;
        this.wings[1].sVal = 60 / 2;
        this.wings[2].sVal = 2;
        this.wings[3].sVal = 2;
        this.wings[4].sVal = 0;
        this.wings[5].sVal = 0;
        // �G���W���̐��͂�Z�b�g
        this.wings[0].tVal = 0.1;
        this.wings[1].tVal = 0.1;
        this.wings[2].tVal = 0.1;
        this.wings[3].tVal = 0.1;
        this.wings[4].tVal = 1000;
        this.wings[5].tVal = 1000;
        // �����ʂƊ������[�����g����߂Ă���
        this.mass = 0;
        this.iMass.set(1000, 1000, 4000);
        var m_i = 1;
        for (var _i = 0, _a = this.wings; _i < _a.length; _i++) {
            var wing = _a[_i];
            this.mass += wing.mass;
            wing.aAngle = 0;
            wing.bAngle = 0;
            wing.vVel.set(0, 0, 1);
            this.iMass.x += wing.mass * (Math.abs(wing.pVel.x) + 1) * m_i * m_i;
            this.iMass.y += wing.mass * (Math.abs(wing.pVel.y) + 1) * m_i * m_i;
            this.iMass.z += wing.mass * (Math.abs(wing.pVel.z) + 1) * m_i * m_i;
        }
    };
    // �@�̂̃��[�J�����W�����[���h���W�ϊ��s�����߂�
    Plane.prototype.checkTrans = function () {
        var x = this.aVel.x;
        var y = this.aVel.y;
        var z = this.aVel.z;
        this.sina = Math.sin(x);
        this.cosa = Math.cos(x);
        if (this.cosa < 1e-9 && this.cosa > 0) {
            this.cosa = 1e-9;
        }
        if (this.cosa > -1e-9 && this.cosa < 0) {
            this.cosa = -1e-9;
        }
        this.sinb = Math.sin(y);
        this.cosb = Math.cos(y);
        this.sinc = Math.sin(z);
        this.cosc = Math.cos(z);
        // �s�b�`�i�@��̏㉺�j�����[���i���E�̌X���j�����[(�n�ʐ�������)
        var a = new THREE.Euler(this.aVel.x, -this.aVel.y, this.aVel.z, "YXZ");
        this.matrix.makeRotationFromEuler(a);
    };
    // ���[���h���W��@�̍��W�֕ϊ�����i�P���ϊ��̂݁j
    Plane.prototype.change_w2l = function (pw, pl) {
        pl.x = pw.x * this.matrix.elements[0] + pw.y * this.matrix.elements[4] + pw.z * this.matrix.elements[8];
        pl.y = pw.x * this.matrix.elements[1] + pw.y * this.matrix.elements[5] + pw.z * this.matrix.elements[9];
        pl.z = pw.x * this.matrix.elements[2] + pw.y * this.matrix.elements[6] + pw.z * this.matrix.elements[10];
    };
    // �@�̍��W����[���h���W�֕ϊ�����i�P���ϊ��̂݁j
    Plane.prototype.change_l2w = function (pl, pw) {
        pw.x = pl.x * this.matrix.elements[0] + pl.y * this.matrix.elements[1] + pl.z * this.matrix.elements[2];
        pw.y = pl.x * this.matrix.elements[4] + pl.y * this.matrix.elements[5] + pl.z * this.matrix.elements[6];
        pw.z = pl.x * this.matrix.elements[8] + pl.y * this.matrix.elements[9] + pl.z * this.matrix.elements[10];
    };
    // �@�e��~�T�C���̃��b�N����
    Plane.prototype.lockCheck = function (world) {
        var a = new CVector3();
        var b = new CVector3();
        var nno = new Array(Plane.MMMAX); // �@��No.
        var dis = new Array(Plane.MMMAX); // �@�̂Ǝ��@�Ƃ̋���
        for (var m = 0; m < Plane.MMMAX; m++) {
            dis[m] = 1e30;
            nno[m] = -1;
        }
        for (var m = 0; m < Jflight.PMAX; m++) {
            // �ڕW�����݂��Ă���΃��b�N���X�g�ɒǉ�
            if (m !== this.no && world.plane[m].use) {
                // �ڕW�Ƃ̋�������߂�
                a.setMinus(this.pVel, world.plane[m].pVel);
                var near_dis = a.abs2();
                if (near_dis < 1e8) {
                    // �ڕW�Ƃ̈ʒu�֌W��@�̍��W�n�ɕϊ�
                    this.change_w2l(a, b);
                    // ����T�[�N����Ȃ烍�b�N
                    if (b.y <= 0 && Math.sqrt(b.x * b.x + b.z * b.z) < -b.y * 0.24) {
                        // ���Ƀ��b�N����Ă���̂Ȃ�A���̃��b�N�Ƌ߂����ɒu��������
                        for (var m1 = 0; m1 < Plane.MMMAX; m1++) {
                            if (near_dis < dis[m1]) {
                                for (var m2 = Plane.MMMAX - 1; m2 > m1; m2--) {
                                    dis[m2] = dis[m2 - 1];
                                    nno[m2] = nno[m2 - 1];
                                }
                                dis[m1] = near_dis;
                                nno[m1] = m;
                                break;
                            }
                        }
                    }
                }
            }
        }
        // ���b�N�ڕW��������Ȃ��ꍇ�A��ԋ߂��ڕW�Ƀ��b�N
        for (var m1 = 1; m1 < 4; m1++)
            if (nno[m1] < 0) {
                nno[m1] = nno[0];
                dis[m1] = dis[0];
            }
        // �S�ȍ~�̃~�T�C���́A����|�b�h�̃~�T�C���ɍ��킹��
        for (var m1 = 4; m1 < Plane.MMMAX; m1++) {
            nno[m1] = nno[m1 % 4];
            dis[m1] = dis[m1 % 4];
        }
        for (var m1 = 0; m1 < Plane.MMMAX; m1++)
            this.aamTarget[m1] = nno[m1];
        // �@�e�̖ڕW�i��ڕW�j�́A�ł�߂��G�@�ɃZ�b�g
        this.gunTarget = nno[0];
        this.targetDis = Math.sqrt(dis[0]);
    };
    // �@�̂𓮂���
    // ���@�̒e�ۂȂǂ�ړ�
    Plane.prototype.move = function (world, autof) {
        this.checkTrans(); // ���W�ϊ��p�̍s��Čv�Z
        this.lockCheck(world); // �~�T�C�����b�N����
        if (this.no === 0 && !autof) {
            this.keyScan(world);
        }
        else {
            this.autoFlight(world); // �������c
        }
        this.moveCalc(world);
        this.moveBullet(world);
        this.moveAam(world);
    };
    // �L�[��Ԃ��ƂɁA�X�e�B�b�N��g���K�[��Z�b�g
    // ���ۂ̃L�[�X�L������������Ă���̂́AApplet3D�N���X
    Plane.prototype.keyScan = function (_world) {
        this.stickVel.set(0, 0, 0);
        this.boost = false;
        this.gunShoot = keyboard.pressed("space"); // world.keyShoot;
        this.aamShoot = keyboard.pressed("space"); // world.keyShoot;
        if (keyboard.pressed("b"))
            this.boost = true;
        // �X�e�B�b�N��}���ɓ������Ƃ܂����̂ŁA
        // �X�e�B�b�N���g�Ɋ�����������Ċ��炩�ɓ������Ă���B
        if (keyboard.pressed("up")) {
            this.stickVel.x = 1;
        }
        if (keyboard.pressed("down")) {
            this.stickVel.x = -1;
        }
        if (keyboard.pressed("left")) {
            this.stickVel.y = -1;
        }
        if (keyboard.pressed("right")) {
            this.stickVel.y = 1;
        }
        if (this.stickPos.z > 1) {
            this.stickPos.z = 1;
        }
        if (this.stickPos.z < -1) {
            this.stickPos.z = -1;
        }
        this.stickPos.addCons(this.stickVel, this.stickA);
        this.stickPos.subCons(this.stickPos, this.stickR);
        // �X�e�B�b�N�ʒu������P�ȓ�Ɋۂ߂Ă���
        var r = Math.sqrt(this.stickPos.x * this.stickPos.x + this.stickPos.y * this.stickPos.y);
        if (r > 1) {
            this.stickPos.x /= r;
            this.stickPos.y /= r;
        }
    };
    // �@�̌v�Z
    Plane.prototype.moveCalc = function (world) {
        var ve;
        var dm = new CVector3();
        // ��ڕW�̌������̈ʒu����߂Ă����i�@�e�̒ǔ��ŗp����j
        this.targetSx = -1000;
        this.targetSy = 0;
        if (this.gunTarget >= 0 && world.plane[this.gunTarget].use) {
            // ��ڕW�̍��W��X�N���[�����W�ɕϊ�
            world.change3d(this, world.plane[this.gunTarget].pVel, dm);
            // �X�N���[����Ȃ�
            if (dm.x > 0 && dm.x < world.sWidth && dm.y > 0 && dm.y < world.sHeight) {
                this.targetSx = dm.x;
                this.targetSy = dm.y;
            }
        }
        // ���@�̈ʒu����A�n�ʂ̍�������߁A���x����߂�
        this.gHeight = world.gHeight(this.pVel.x, this.pVel.y);
        this.height = this.pVel.z - this.gHeight;
        // ��C���x�̌v�Z
        if (this.pVel.z < 5000) {
            ve = 0.12492 - 0.000008 * this.pVel.z;
        }
        else {
            ve = (0.12492 - 0.04) - 0.000002 * (this.pVel.z - 5000);
        }
        if (ve < 0) {
            ve = 0;
        }
        // �e���𑀏c�n�ɍ��킹�ĂЂ˂��Ă���
        this.wings[0].aAngle = -this.stickPos.y * 1.5 / 180 * Math.PI;
        this.wings[0].bAngle = 0;
        this.wings[1].aAngle = this.stickPos.y * 1.5 / 180 * Math.PI;
        this.wings[1].bAngle = 0;
        this.wings[2].aAngle = -this.stickPos.x * 6 / 180 * Math.PI;
        this.wings[2].bAngle = 0;
        this.wings[3].aAngle = this.stickPos.z * 6 / 180 * Math.PI;
        this.wings[3].bAngle = 0;
        this.wings[4].aAngle = 0;
        this.wings[4].bAngle = 0;
        this.wings[5].aAngle = 0;
        this.wings[5].bAngle = 0;
        this.change_w2l(this.vpVel, this.vVel);
        this.onGround = false;
        if (this.height < 5) {
            this.onGround = true;
        }
        // af���@�̂ɂ������
        // am���@�̂ɂ����郂�[�����g
        var af = new CVector3();
        var am = new CVector3();
        af.set(0, 0, 0);
        am.set(0, 0, 0);
        // �e���ɓ����͂ƃ��[�����g��v�Z
        this.aoa = 0;
        var i = 0;
        var v = new THREE.Vector3();
        for (var _i = 0, _a = this.wings; _i < _a.length; _i++) {
            var wing = _a[_i];
            wing.calc(this, ve, i, this.boost);
            ++i;
            // ��
            af.x += (wing.fVel.x * this.matrix.elements[0] + wing.fVel.y * this.matrix.elements[1] + wing.fVel.z * this.matrix.elements[2]);
            af.y += (wing.fVel.x * this.matrix.elements[4] + wing.fVel.y * this.matrix.elements[5] + wing.fVel.z * this.matrix.elements[6]);
            af.z += (wing.fVel.x * this.matrix.elements[8] + wing.fVel.y * this.matrix.elements[9] + wing.fVel.z * this.matrix.elements[10]) + wing.mass * Jflight.G;
            // ���[�����g�i�͂Ɨ��ʒu�Ƃ̊O�ρj
            // am.x -= (wing.pVel.y * wing.fVel.z - wing.pVel.z * wing.fVel.y);
            // am.y -= (wing.pVel.z * wing.fVel.x - wing.pVel.x * wing.fVel.z);
            // am.z -= (wing.pVel.x * wing.fVel.y - wing.pVel.y * wing.fVel.x);
            // v = position �~ velocity
            // am -= v;
            v.crossVectors(wing.pVel, wing.fVel);
            am.sub(v);
        }
        // �p�x�ω���ϕ�
        this.vaVel.x += am.x / this.iMass.x * Jflight.DT;
        this.vaVel.y += am.y / this.iMass.y * Jflight.DT;
        this.vaVel.z += am.z / this.iMass.z * Jflight.DT;
        this.aVel.x += (this.vaVel.x * this.cosb + this.vaVel.z * this.sinb) * Jflight.DT;
        this.aVel.y += (this.vaVel.y + (this.vaVel.x * this.sinb - this.vaVel.z * this.cosb) * this.sina / this.cosa) * Jflight.DT;
        this.aVel.z += (-this.vaVel.x * this.sinb + this.vaVel.z * this.cosb) / this.cosa * Jflight.DT;
        // �@�̂̊p�x����͈͂Ɋۂ߂Ă���
        //int q;
        for (var q = 0; q < 3 && this.aVel.x >= Math.PI / 2; q++) {
            this.aVel.x = Math.PI - this.aVel.x;
            this.aVel.y += Math.PI;
            this.aVel.z += Math.PI;
        }
        for (var q = 0; q < 3 && this.aVel.x < -Math.PI / 2; q++) {
            this.aVel.x = -Math.PI - this.aVel.x;
            this.aVel.y += Math.PI;
            this.aVel.z += Math.PI;
        }
        for (var q = 0; q < 3 && this.aVel.y >= Math.PI; q++) {
            this.aVel.y -= Math.PI * 2;
        }
        for (var q = 0; q < 3 && this.aVel.y < -Math.PI; q++) {
            this.aVel.y += Math.PI * 2;
        }
        for (var q = 0; q < 3 && this.aVel.z >= Math.PI * 2; q++) {
            this.aVel.z -= Math.PI * 2;
        }
        for (var q = 0; q < 3 && this.aVel.z < 0; q++) {
            this.aVel.z += Math.PI * 2;
        }
        // �����x�����
        this.gVel.setConsInv(af, this.mass);
        // �@�̂Ŕ��������R��[���I�ɐ���
        this.vpVel.x -= this.vpVel.x * this.vpVel.x * 0.00002;
        this.vpVel.y -= this.vpVel.y * this.vpVel.y * 0.00002;
        this.vpVel.z -= this.vpVel.z * this.vpVel.z * 0.00002;
        // �n�ʂ̌X������
        world.gGrad(this.pVel.x, this.pVel.y, dm);
        if (this.onGround) {
            this.gVel.x -= dm.x * 10;
            this.gVel.y -= dm.y * 10;
            var vz = dm.x * this.vpVel.x + dm.y * this.vpVel.y;
            if (this.vpVel.z < vz) {
                this.vpVel.z = vz;
            }
        }
        // �u�[�X�g���ɂ́A�@�̂�U��������
        if (this.boost) {
            this.gVel.x += (Math.random() - 0.5) * 5;
            this.gVel.y += (Math.random() - 0.5) * 5;
            this.gVel.z += (Math.random() - 0.5) * 5;
        }
        // �@�̂̈ʒu��ϕ����ċ��߂�
        this.vpVel.addCons(this.gVel, Jflight.DT);
        this.pVel.addCons(this.vpVel, Jflight.DT);
        // �O�̂��߁A�n�ʂɂ߂荞�񂾂��ǂ����`�F�b�N
        if (this.height < 2) {
            this.pVel.z = this.gHeight + 2;
            this.height = 2;
            this.vpVel.z *= -0.1;
        }
        // �n�ʂɂ�����x�ȏ�̑��x���A�����ȑ̐��ŐڐG�����ꍇ�A�@�̂������
        if (this.height < 5 && (Math.abs(this.vpVel.z) > 50 || Math.abs(this.aVel.y) > 20 * Math.PI / 180 || this.aVel.x > 10 * Math.PI / 180)) {
            this.posInit();
        }
    };
    // �������c
    Plane.prototype.autoFlight = function (world) {
        var m, mm;
        this.gunShoot = false;
        this.aamShoot = false;
        if (this.target < 0 || !world.plane[this.target].use)
            return;
        this.power = 4;
        this.throttle = this.power;
        this.stickPos.z = 0;
        if (this.level < 0)
            this.level = 0;
        var dm_p = new CVector3();
        var dm_a = new CVector3();
        // �ڕW�Ǝ��@�̈ʒu�֌W����߁A�@�̍��W�ɕϊ����Ă���
        dm_p.setMinus(this.pVel, world.plane[this.target].pVel);
        this.change_w2l(dm_p, dm_a);
        // mm�́A�X�e�B�b�N�̈ړ����E��
        if (this.level >= 20) {
            mm = 1;
        }
        else {
            mm = (this.level + 1) * 0.05;
        }
        this.stickVel.x = 0;
        this.stickVel.y = 0;
        m = Math.sqrt(dm_a.x * dm_a.x + dm_a.z * dm_a.z);
        // �X���b�g���̈ʒu�́A�ڕW�ɂ��킹��
        if (this.level > 8 && this.gunTime < 1) {
            this.power = world.plane[this.target].power;
        }
        else {
            this.power = 9;
        }
        // �ڕW������Ɍ�����ꍇ�A�X�e�B�b�N�����
        if (dm_a.z < 0)
            this.stickVel.x = dm_a.z / m * mm;
        // �ڕW�̍��E�������ʒu�ɍ��킹�āA�X�e�B�b�N����E�ɓ�����
        this.stickVel.y = -dm_a.x / m * mm * 0.4;
        if (this.stickVel.y > 1)
            this.stickVel.y = 1;
        if (this.stickVel.y < -1)
            this.stickVel.y = -1;
        // �X�e�B�b�N�̊�������
        this.stickPos.x += this.stickVel.x;
        this.stickPos.y += this.stickVel.y;
        if (this.stickPos.x > 1)
            this.stickPos.x = 1;
        if (this.stickPos.x < -1)
            this.stickPos.x = -1;
        if (this.stickPos.y > 1)
            this.stickPos.y = 1;
        if (this.stickPos.y < -1)
            this.stickPos.y = -1;
        // �@�̍��x���Ⴂ���A8�b�ȓ�ɒn�ʂɂԂ��肻���ȏꍇ�A��Ɍ�����
        if (this.height < 1000 || this.height + this.vpVel.z * 8 < 0) {
            this.stickPos.y = -this.aVel.y;
            if (Math.abs(this.aVel.y) < Math.PI / 2) {
                this.stickPos.x = -1;
            }
            else {
                this.stickPos.x = 0;
            }
        }
        // �X�e�B�b�N�ʒu��P�ȓ�Ɋۂ߂Ă���
        m = Math.sqrt(this.stickPos.x * this.stickPos.x + this.stickPos.y * this.stickPos.y);
        if (m > mm) {
            this.stickPos.x *= mm / m;
            this.stickPos.y *= mm / m;
        }
        // ��ڕW�Ƃ��đI�΂�Ă���̂Ȃ�A�@�e�����
        if (this.gunTarget === this.target && this.gunTime < 1) {
            // �@�e���I�[�o�[�q�[�g���Ă���ꍇ�A���x��������܂ő҂�
            if (!this.heatWait && this.gunTemp < Plane.MAXT - 1) {
                this.gunShoot = true;
            }
            else {
                this.heatWait = true;
            }
        }
        if (this.gunTemp < 2) {
            this.heatWait = false;
        }
        // ��ڕW�Ƃ��đI�΂�Ă���̂Ȃ�A�~�T�C�������
        if (this.gunTarget === this.target) {
            this.aamShoot = true;
        }
        // �����������ȏꍇ�A�X�e�B�b�N�𗣂�
        if (Math.abs(this.aoa) > 0.35) {
            this.stickPos.x = 0;
        }
    };
    // �@�e�̒e�ۈړ��Ɣ��ˏ���
    Plane.prototype.moveBullet = function (world) {
        var i;
        var aa;
        var sc = new CVector3();
        var a = new CVector3();
        var b = new CVector3();
        var c = new CVector3();
        var dm = new CVector3();
        var oi = new CVector3();
        var ni = new CVector3();
        // �e�ۂ̏������x����߂Ă���
        dm.set(this.gunX * 400 / 200, 400, this.gunY * 400 / 200);
        this.change_l2w(dm, oi);
        oi.add(this.vpVel);
        this.gunTime = 1.0;
        // �e�ۂ̏����ʒu����߂Ă���
        dm.set(4 * 2, 10.0, 4 * -0.5);
        this.change_l2w(dm, ni);
        // �e�ۂ̓��B�\�z���Ԃ���߂Ă���
        if (this.gunTarget >= 0)
            this.gunTime = this.targetDis / (oi.abs() * 1.1);
        if (this.gunTime > 1.0)
            this.gunTime = 1.0;
        // �e�ۂ̓����\�z�ʒu����߂�
        this.gcVel.x = this.pVel.x + ni.x + (oi.x - this.gVel.x * this.gunTime) * this.gunTime;
        this.gcVel.y = this.pVel.y + ni.y + (oi.y - this.gVel.y * this.gunTime) * this.gunTime;
        this.gcVel.z = this.pVel.z + ni.z + (oi.z + (-9.8 - this.gVel.z) * this.gunTime / 2) * this.gunTime;
        world.change3d(this, this.gcVel, sc);
        // �@�e��ڕW�֌�����
        if (this.gunTarget >= 0) {
            c.set(world.plane[this.gunTarget].pVel.x, world.plane[this.gunTarget].pVel.y, world.plane[this.gunTarget].pVel.z);
            c.addCons(world.plane[this.gunTarget].vpVel, this.gunTime);
            world.change3d(this, c, a);
            world.change3d(this, world.plane[this.gunTarget].pVel, b);
            sc.x += b.x - a.x;
            sc.y += b.y - a.y;
        }
        if (this.targetSx > -1000) {
            var xx = (this.targetSx - sc.x);
            var yy = (this.targetSy - sc.y);
            var mm = Math.sqrt(xx * xx + yy * yy);
            if (mm > 20) {
                xx = xx / mm * 20;
                yy = yy / mm * 20;
            }
            this.gunVx += xx;
            this.gunVy -= yy;
        }
        this.gunX += this.gunVx * 100 / 300;
        this.gunY += this.gunVy * 100 / 300;
        this.gunVx -= this.gunVx * 0.3;
        this.gunVy -= this.gunVy * 0.3;
        // �@�e�ғ����E����`�F�b�N
        var y = this.gunY - 20;
        var r = Math.sqrt(this.gunX * this.gunX + this.gunY * this.gunY);
        if (r > 100) {
            var x = this.gunX;
            x *= 100 / r;
            y *= 100 / r;
            this.gunX = x;
            this.gunY = y + 20;
            this.gunVx = 0;
            this.gunVy = 0;
        }
        // �e�ۈړ�
        for (i = 0; i < Plane.BMAX; i++)
            if (this.bullet[i].use != 0)
                this.bullet[i].move(world, this);
        // �e�۔��ˏ���
        if (this.gunShoot && this.gunTemp++ < Plane.MAXT) {
            for (i = 0; i < Plane.BMAX; i++) {
                if (this.bullet[i].use === 0) {
                    this.bullet[i].vVel.setPlus(this.vpVel, oi);
                    aa = Math.random();
                    this.bullet[i].pVel.setPlus(this.pVel, ni);
                    this.bullet[i].pVel.addCons(this.bullet[i].vVel, 0.1 * aa);
                    this.bullet[i].opVel.set(this.bullet[i].pVel.x, this.bullet[i].pVel.y, this.bullet[i].pVel.z);
                    this.bullet[i].bom = 0;
                    this.bullet[i].use = 15;
                    break;
                }
            }
        }
        else if (this.gunTemp > 0)
            this.gunTemp--;
    };
    // �~�T�C���ړ��Ɣ��ˏ���
    Plane.prototype.moveAam = function (world) {
        var dm = new CVector3();
        var ni = new CVector3();
        var oi = new CVector3();
        for (var k = 0; k < Plane.MMMAX; k++) {
            // �e�~�T�C���ړ�
            if (this.aam[k].use > 0) {
                this.aam[k].move(world, this);
            }
            // �^�C���A�E�g���������
            if (this.aam[k].use === 0)
                this.aam[k].use = -1;
        }
        // �~�T�C�����ˏ���
        // �������A�ڕW���߂�����ƌ��ĂȂ�
        if (this.aamShoot && this.targetDis > 50) {
            // �g���Ă��Ȃ��~�T�C����T��
            var k = void 0;
            for (k = 0; k < Plane.MMMAX; k++)
                if (this.aam[k].use < 0 && this.aamTarget[k] >= 0)
                    break;
            if (k !== Plane.MMMAX) {
                var ap = this.aam[k];
                //  ���ˈʒu����߂�
                switch (k % 4) {
                    case 0:
                        dm.x = 6;
                        dm.z = 1;
                        break;
                    case 1:
                        dm.x = -6;
                        dm.z = 1;
                        break;
                    case 2:
                        dm.x = 6;
                        dm.z = -1;
                        break;
                    case 3:
                        dm.x = -6;
                        dm.z = -1;
                        break;
                }
                dm.y = 2;
                this.change_l2w(dm, ni);
                //  ���ˑ��x����߂�
                var v2 = 0;
                var v3 = 5;
                var vx = Math.random() * v3;
                var vy = Math.random() * v3;
                v2 *= (k / 4) + 1;
                vx *= (k / 4) + 1;
                vy *= (k / 4) + 1;
                switch (k % 4) {
                    case 0:
                        dm.x = vx;
                        dm.z = vy - v2;
                        break;
                    case 1:
                        dm.x = -vx;
                        dm.z = vy - v2;
                        break;
                    case 2:
                        dm.x = vx;
                        dm.z = -vy - v2;
                        break;
                    case 3:
                        dm.x = -vx;
                        dm.z = -vy - v2;
                        break;
                }
                dm.y = 40;
                this.change_l2w(dm, oi);
                ap.pVel.setPlus(this.pVel, ni);
                ap.vpVel.setPlus(this.vpVel, oi);
                // ���ˌ�������߂�
                switch (k % 4) {
                    case 0:
                        dm.x = 8;
                        dm.z = 1 + 10;
                        break;
                    case 1:
                        dm.x = -8;
                        dm.z = 1 + 10;
                        break;
                    case 2:
                        dm.x = 5;
                        dm.z = -1 + 10;
                        break;
                    case 3:
                        dm.x = -5;
                        dm.z = -1 + 10;
                        break;
                }
                dm.y = 50.0;
                dm.z += (k / 4) * 5;
                this.change_l2w(dm, oi);
                var v = oi.abs();
                ap.aVel.setConsInv(oi, v);
                // �e�평����
                ap.use = 100;
                ap.count = 0;
                ap.bom = 0;
                ap.targetNo = this.aamTarget[k];
            }
        }
    };
    return Plane;
}());
// �萔
Plane.BMAX = 20; // �e�ۂ̍ő吔
Plane.MMMAX = 4; // �~�T�C���̍ő吔
Plane.WMAX = 6; // ���̐�
Plane.MAXT = 50; // �@�e�̍ő剷�x
// �^�C�g��:NekoFlight for java
// �o�[�W����:Ver0.1
// ���쌠:Copyright (c) 1998 Isamu Kaneko
// ���:��q�@�E
// ��Ж�:NekoSoft
// ���:http://village.infoweb.ne.jp/~fwhz9346
///<reference path="Applet3D.ts" />
///<reference path="Plane.ts" />
//
// Jflight�N���X
//
// jflight�p�̃A�v���b�g�N���X
// ���̃N���X��jflight���s�̋N�_
// Applet3D����p�����邱�Ƃ�3D�\������Ƌ��ɁA
// Runnable�C���^�[�t�F�C�X�p���ŃX���b�h��p����
//
//     �@�̍��W�n
//           Z
//           ^  X
//           | /
//           |/
//     Y<----
//     ���[���h���W�n
//     Z
//     ^  Y
//     | /
//     |/
//     -------->X
var Jflight = (function (_super) {
    __extends(Jflight, _super);
    // �A�v���b�g�̍\�z
    function Jflight(scene) {
        var _this = _super.call(this) || this;
        // �ϐ�
        // protected mainThread = null;           // �X���b�h�I�u�W�F�N�g
        _this.plane = []; // �e�@�̃I�u�W�F�N�g�ւ̔z��
        _this.autoFlight = true; // ���@�iplane[0]�j��������c�ɂ���̂�
        // �e���|�����I�u�W�F�N�g
        _this.pos = []; // �n�ʕ\���̍ۂ̃f�[�^��~���Ă������߂�Tmp
        // �@�̌`��̏�����
        _this.objInit();
        // �s�v�ȃK�[�x�b�W�R���N�V���������邽�߂ɁA
        // �I�u�W�F�N�g����߂ɏo���邾������Ă���
        for (var i = 0; i < Jflight.PMAX; i++) {
            _this.plane.push(new Plane(scene));
        }
        for (var j = 0; j < Jflight.GSCALE; j++) {
            _this.pos.push([]);
            for (var i = 0; i < Jflight.GSCALE; i++) {
                _this.pos[j].push(new CVector3());
            }
        }
        // �e�@�̂̐ݒ�
        _this.plane[0].no = 0;
        _this.plane[1].no = 1;
        _this.plane[2].no = 2;
        _this.plane[3].no = 3;
        _this.plane[0].target = 2;
        _this.plane[1].target = 2;
        _this.plane[2].target = 1;
        _this.plane[3].target = 1;
        _this.plane[0].use = true;
        _this.plane[1].use = true;
        _this.plane[2].use = true;
        _this.plane[3].use = true;
        _this.plane[0].level = 20;
        _this.plane[1].level = 10;
        _this.plane[2].level = 20;
        _this.plane[3].level = 30;
        return _this;
    }
    // �A�v���b�g�̏�����
    Jflight.prototype.init = function () {
    };
    // �A�v���b�g�̋N��
    Jflight.prototype.start = function () {
    };
    // �A�v���b�g�̒�~
    Jflight.prototype.stop = function () {
    };
    // �@�̌`��̏�����
    Jflight.prototype.objInit = function () {
        if (Jflight.obj.length !== 0) {
            return;
        }
        for (var j = 0; j < 20; j++) {
            Jflight.obj.push([]);
            for (var i = 0; i < 3; i++) {
                Jflight.obj[j].push(new THREE.Vector3());
            }
        }
        // �S�ēƗ��O�p�`�ō\��
        // �{���͊e���_����L�������������������ł͕\�������ȗ���
        Jflight.obj[0][0].set(-0.000000, -2.000000, 0.000000);
        Jflight.obj[0][1].set(0.000000, 4.000000, 0.000000);
        Jflight.obj[0][2].set(6.000000, -2.000000, 0.000000);
        Jflight.obj[1][0].set(0.000000, -3.000000, 1.500000);
        Jflight.obj[1][1].set(2.000000, -3.000000, 0.000000);
        Jflight.obj[1][2].set(0.000000, 8.000000, 0.000000);
        Jflight.obj[2][0].set(2.000000, 0.000000, 0.000000);
        Jflight.obj[2][1].set(3.000000, 0.000000, -0.500000);
        Jflight.obj[2][2].set(3.500000, 0.000000, 0.000000);
        Jflight.obj[3][0].set(3.000000, 0.000000, 0.000000);
        Jflight.obj[3][1].set(3.000000, -1.000000, -1.500000);
        Jflight.obj[3][2].set(3.000000, 0.000000, -2.000000);
        Jflight.obj[4][0].set(3.000000, -1.000000, -2.000000);
        Jflight.obj[4][1].set(3.000000, 2.000000, -2.000000);
        Jflight.obj[4][2].set(3.500000, 1.000000, -2.500000);
        Jflight.obj[5][0].set(1.000000, 0.000000, -6.000000);
        Jflight.obj[5][1].set(2.000000, 4.000000, -6.000000);
        Jflight.obj[5][2].set(2.000000, -2.000000, 0.000000);
        Jflight.obj[6][0].set(3.000000, 0.000000, -6.000000);
        Jflight.obj[6][1].set(2.000000, 4.000000, -6.000000);
        Jflight.obj[6][2].set(2.000000, -2.000000, 0.000000);
        Jflight.obj[7][0].set(2.000000, 1.000000, 0.000000);
        Jflight.obj[7][1].set(2.000000, -3.000000, 4.000000);
        Jflight.obj[7][2].set(2.000000, -3.000000, -2.000000);
        Jflight.obj[8][0].set(1.000000, 0.000000, 0.000000);
        Jflight.obj[8][1].set(0.000000, 0.000000, -1.000000);
        Jflight.obj[8][2].set(0.000000, 1.000000, 0.000000);
        Jflight.obj[9][0].set(0.000000, -2.000000, 0.000000);
        Jflight.obj[9][1].set(0.000000, 4.000000, 0.000000);
        Jflight.obj[9][2].set(-6.000000, -2.000000, 0.000000);
        Jflight.obj[10][0].set(0.000000, -3.000000, 1.500000);
        Jflight.obj[10][1].set(-2.000000, -3.000000, 0.000000);
        Jflight.obj[10][2].set(0.000000, 8.000000, 0.000000);
        Jflight.obj[11][0].set(-2.000000, 0.000000, 0.000000);
        Jflight.obj[11][1].set(-3.000000, 0.000000, -0.500000);
        Jflight.obj[11][2].set(-3.500000, 0.000000, 0.000000);
        Jflight.obj[12][0].set(-3.000000, 0.000000, 0.000000);
        Jflight.obj[12][1].set(-3.000000, -1.000000, -1.500000);
        Jflight.obj[12][2].set(-3.000000, 0.000000, -2.000000);
        Jflight.obj[13][0].set(-3.000000, -1.000000, -2.000000);
        Jflight.obj[13][1].set(-3.000000, 2.000000, -2.000000);
        Jflight.obj[13][2].set(-3.500000, 1.000000, -2.500000);
        Jflight.obj[14][0].set(-1.000000, 0.000000, -6.000000);
        Jflight.obj[14][1].set(-2.000000, 4.000000, -6.000000);
        Jflight.obj[14][2].set(-2.000000, -2.000000, 0.000000);
        Jflight.obj[15][0].set(-3.000000, 0.000000, -6.000000);
        Jflight.obj[15][1].set(-2.000000, 4.000000, -6.000000);
        Jflight.obj[15][2].set(-2.000000, -2.000000, 0.000000);
        Jflight.obj[16][0].set(-2.000000, 1.000000, 0.000000);
        Jflight.obj[16][1].set(-2.000000, -3.000000, 4.000000);
        Jflight.obj[16][2].set(-2.000000, -3.000000, -2.000000);
        Jflight.obj[17][0].set(-1.000000, 0.000000, 0.000000);
        Jflight.obj[17][1].set(0.000000, 0.000000, -1.000000);
        Jflight.obj[17][2].set(0.000000, 1.000000, 0.000000);
        Jflight.obj[18][0].set(3.000000, 0.000000, -2.000000);
        Jflight.obj[18][1].set(3.000000, 0.000000, -1.500000);
        Jflight.obj[18][2].set(3.000000, 7.000000, -2.000000);
    };
    // �A�v���b�g�̕\��
    // ���ۂ̓��쒆�͂�����ł͂Ȃ��Arun()�̕��ŕ\�������
    Jflight.prototype.paint = function (context) {
        this.draw(context);
    };
    // ��ʕ\��
    Jflight.prototype.draw = function (context) {
        // �o�b�N�o�b�t�@�N���A
        this.clear(context);
        // ���@�̕ϊ��s���O�̂��ߍČv�Z���Ă���
        this.plane[0].checkTrans();
        // �n�ʕ\��
        this.writeGround(context);
        // �@�̕\��
        this.writePlane(context);
        // �o�b�N�o�b�t�@��t�����g�ɃR�s�[
        this.flush();
        // �m���ɕ\�������悤��sync()��Ă�ł���
        // this.getToolkit().sync();
    };
    // ���C�����[�v
    Jflight.prototype.run = function (context) {
        //while (true) {
        // �X�y�[�X�L�[�������ꂽ�玩�����cOFF
        if (keyboard.pressed("space")) {
            this.autoFlight = false;
        }
        // �e�@��ړ�
        this.plane[0].move(this, this.autoFlight);
        for (var i = 1; i < Jflight.PMAX; i++) {
            this.plane[i].move(this, true);
        }
        // �J�����ʒu����@�ɃZ�b�g���ĕ\��
        this.camerapos.set(this.plane[0].pVel.x, this.plane[0].pVel.y, this.plane[0].pVel.z);
        this.draw(context);
        // ��莞�ԃE�F�C�g
        // try { Thread.sleep(10); } catch (InterruptedException e) { };
        //}
    };
    // �e�@�̂�\��
    // �e�ۂ�~�T�C��������ŕ\�����Ă���
    Jflight.prototype.writePlane = function (context) {
        //let p0 = new CVector3();
        //let p1 = new CVector3();
        //let p2 = new CVector3();
        var s0 = new CVector3();
        var s1 = new CVector3();
        var s2 = new CVector3();
        for (var i = 0; i < Jflight.PMAX; i++) {
            if (this.plane[i].use) {
                this.writeGun(context, this.plane[i]);
                this.writeAam(context, this.plane[i]);
                //���@�ȊO�̋@�̂�\��
                // �e�@�̂̃��[�N�p���W�ϊ��s���Čv�Z
                //this.plane[0].checkTransM(this.plane[i].aVel);
                var a = new THREE.Euler(this.plane[i].aVel.x, -this.plane[i].aVel.y, this.plane[i].aVel.z, 'YXZ');
                var m = new THREE.Matrix4();
                m.makeRotationFromEuler(a);
                m.transpose();
                if (i !== 0) {
                    for (var j = 0; j < 19; j++) {
                        // �e�@�̃��[�J�����W���烏�[���h���W�ɕϊ�
                        // ���{���̓A�t�B���ϊ��ł܂Ƃ߂ĕϊ�����ׂ�
                        // this.plane[0].change_ml2w(Jflight.obj[j][0], p0);
                        var p0 = Jflight.obj[j][0].clone();
                        p0.applyMatrix4(m);
                        // this.plane[0].change_ml2w(Jflight.obj[j][1], p1);
                        var p1 = Jflight.obj[j][1].clone();
                        p1.applyMatrix4(m);
                        // this.plane[0].change_ml2w(Jflight.obj[j][2], p2);
                        var p2 = Jflight.obj[j][2].clone();
                        p2.applyMatrix4(m);
                        p0.add(this.plane[i].pVel);
                        p1.add(this.plane[i].pVel);
                        p2.add(this.plane[i].pVel);
                        // ���[���h���W��A�X�N���[�����W�ɕϊ�
                        this.change3d(this.plane[0], p0, s0);
                        this.change3d(this.plane[0], p1, s1);
                        this.change3d(this.plane[0], p2, s2);
                        // �O�p�`�\��
                        this.drawPoly(context, s0, s1, s2);
                    }
                }
            }
        }
    };
    // �@�e��\��
    Jflight.prototype.writeGun = function (context, aplane) {
        var dm = new CVector3();
        var dm2 = new CVector3();
        var cp = new CVector3();
        for (var j = 0; j < Plane.BMAX; j++) {
            var bp = aplane.bullet[j];
            // use�J�E���^��0���傫����̂̂ݕ\��
            if (bp.use > 0) {
                // �e�ۂ̈ʒu�Ƃ��̑��x���烉�C����\��
                // �X�N���[���ɋ߂��ꍇ�A��������\��
                if (cp.z < 400) {
                    // 0.005�b��`0.04�b��̒e�ۈʒu����C���\��
                    dm.x = bp.pVel.x + bp.vVel.x * 0.005;
                    dm.y = bp.pVel.y + bp.vVel.y * 0.005;
                    dm.z = bp.pVel.z + bp.vVel.z * 0.005;
                    this.change3d(this.plane[0], dm, cp);
                    dm.x = bp.pVel.x + bp.vVel.x * 0.04;
                    dm.y = bp.pVel.y + bp.vVel.y * 0.04;
                    dm.z = bp.pVel.z + bp.vVel.z * 0.04;
                    this.change3d(this.plane[0], dm, dm2);
                    this.drawBline(context, cp, dm2);
                }
                // ���݈ʒu�`0.05�b��̒e�ۈʒu����C���\��
                this.change3d(this.plane[0], bp.pVel, cp);
                dm.x = bp.pVel.x + bp.vVel.x * 0.05;
                dm.y = bp.pVel.y + bp.vVel.y * 0.05;
                dm.z = bp.pVel.z + bp.vVel.z * 0.05;
                this.change3d(this.plane[0], dm, dm2);
                this.drawBlined(context, cp, dm2);
            }
            // �e�ۂ��������̏ꍇ�A���~�\��
            if (bp.bom > 0) {
                this.change3d(this.plane[0], bp.opVel, cp);
                this.fillBarc(cp);
                bp.bom--;
            }
        }
    };
    // �~�T�C���Ƃ��̉���\��
    Jflight.prototype.writeAam = function (context, aplane) {
        var dm = new CVector3();
        var cp = new CVector3();
        for (var j = 0; j < Plane.MMMAX; j++) {
            var ap = aplane.aam[j];
            // use�J�E���^��0���傫����̂̂ݕ\��
            if (ap.use >= 0) {
                // �~�T�C�����������łȂ���΁A�~�T�C���{�̂�\��
                if (ap.bom <= 0) {
                    dm.x = ap.pVel.x + ap.aVel.x * 4;
                    dm.y = ap.pVel.y + ap.aVel.y * 4;
                    dm.z = ap.pVel.z + ap.aVel.z * 4;
                    this.change3d(this.plane[0], dm, cp);
                    this.change3d(this.plane[0], ap.pVel, dm);
                    this.drawAline(cp, dm);
                }
                // �~�T�C���̉���\��
                // ���̍��W�̓����O�o�b�t�@�Ɋi�[����Ă���
                var k = (ap.use + Missile.MOMAX + 1) % Missile.MOMAX;
                this.change3d(this.plane[0], ap.opVel[k], dm);
                for (var m = 0; m < ap.count; m++) {
                    this.change3d(this.plane[0], ap.opVel[k], cp);
                    this.drawMline(context, dm, cp);
                    k = (k + Missile.MOMAX + 1) % Missile.MOMAX;
                    dm.set(cp.x, cp.y, cp.z);
                }
            }
            // �~�T�C�����������̏ꍇ�A���~�\��
            if (ap.bom > 0) {
                this.change3d(this.plane[0], ap.pVel, cp);
                this.fillBarc(cp);
            }
        }
    };
    // �n�ʂ�\��
    Jflight.prototype.writeGround = function (context) {
        var mx, my;
        var i, j;
        var p = new CVector3();
        // �n�ʃO���b�h�̑傫����v�Z
        var step = Jflight.FMAX * 2 / Jflight.GSCALE;
        // ���@�̃O���b�h�ʒu�ƃI�t�Z�b�g��v�Z
        var dx = (this.plane[0].pVel.x / step);
        var dy = (this.plane[0].pVel.y / step);
        var sx = dx * step;
        var sy = dy * step;
        // �e�O���b�h�_��X�N���[�����W�ɕϊ�
        my = -Jflight.FMAX;
        for (j = 0; j < Jflight.GSCALE; j++) {
            mx = -Jflight.FMAX;
            for (i = 0; i < Jflight.GSCALE; i++) {
                p.x = mx + sx;
                p.y = my + sy;
                p.z = this.gHeight(mx + sx, my + sy);
                this.change3d(this.plane[0], p, this.pos[j][i]);
                mx += step;
            }
            my += step;
        }
        // ����i�q��\��
        for (j = 0; j < Jflight.GSCALE; j++) {
            for (i = 0; i < Jflight.GSCALE - 1; i++) {
                this.drawSline(context, this.pos[j][i], this.pos[j][i + 1]);
            }
        }
        for (i = 0; i < Jflight.GSCALE; i++) {
            for (j = 0; j < Jflight.GSCALE - 1; j++) {
                this.drawSline(context, this.pos[j][i], this.pos[j + 1][i]);
            }
        }
    };
    // �n�ʂ̍�����v�Z
    Jflight.prototype.gHeight = function (_px, _py) {
        return 0;
    };
    // �n�ʂ̌X����v�Z
    Jflight.prototype.gGrad = function (_px, _py, p) {
        p.x = 0;
        p.y = 0;
    };
    return Jflight;
}(Applet3D));
// �萔�錾
Jflight.FMAX = 10000; // �t�B�[���h�̑傫��
Jflight.GSCALE = 16; // �t�B�[���h�̕�����
Jflight.PMAX = 4; // �@�̂̍ő吔
Jflight.G = -9.8; // �d�͉����x
Jflight.DT = 0.05; // �v�Z�X�e�b�v��
Jflight.obj = []; // �@�̂̌`��i�O�p�`�̏W���j
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
var Main;
(function (Main) {
    "use strict";
    var flight;
    /* canvas要素のノードオブジェクト */
    var canvas;
    // standard global variables
    var container;
    var scene;
    var camera;
    var renderer;
    // var stats: Stats;
    // var keyboard = new THREEx.KeyboardState();
    // var clock = new THREE.Clock();
    // custom global variables
    // var boomer: TextureAnimator; // animators
    // var man: Billboard;
    // var controls: THREE.OrbitControls;
    // functions
    function init() {
        canvas = document.getElementById("canvas");
        // scene
        scene = new THREE.Scene();
        // camera
        var SCREEN_WIDTH = 600; // window.innerWidth;
        var SCREEN_HEIGHT = 400; // window.innerHeight;
        var VIEW_ANGLE = 90;
        var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
        var NEAR = 0.1;
        var FAR = 100000;
        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        scene.add(camera);
        camera.position.z = SCREEN_HEIGHT / 2;
        camera.lookAt(scene.position);
        // RENDERER
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        container = document.getElementById("ThreeJS");
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
    Main.init = init;
    function animate() {
        requestAnimationFrame(animate);
        render();
        update();
    }
    Main.animate = animate;
    function update() {
        // var delta = clock.getDelta();
        /* 2Dコンテキスト */
        var context = canvas.getContext("2d");
        flight.run(context);
        // boomer.update(1000 * delta);
        // man.update(1000 * delta);
        // if (keyboard.pressed("z")) {
        // do something
        // }
        // controls.update();
        // stats.update();
        // man.quaternion(camera.quaternion);
        var m = new THREE.Matrix4();
        var elements = flight.plane[0].matrix.elements;
        m.elements[0] = elements[0];
        m.elements[4] = elements[2];
        m.elements[8] = -elements[1];
        m.elements[1] = elements[4];
        m.elements[5] = elements[6];
        m.elements[9] = -elements[5];
        m.elements[2] = elements[8];
        m.elements[6] = elements[10];
        m.elements[10] = -elements[9];
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
})(Main || (Main = {}));
Main.init();
Main.animate();
var Vector3Helper;
(function (Vector3Helper) {
    var result = new THREE.Vector3();
    function cross(vector1, vector2) {
        return result.crossVectors(vector1, vector2);
    }
    Vector3Helper.cross = cross;
})(Vector3Helper || (Vector3Helper = {}));
//# sourceMappingURL=jflight.js.map