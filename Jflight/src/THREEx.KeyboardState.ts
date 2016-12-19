﻿// THREEx.KeyboardState.js keep the current state of the keyboard.
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
namespace THREEx {

    /**
     * - NOTE: it would be quite easy to push event-driven too
     *   - microevent.js for events handling
     *   - in this._onkeyChange, generate a string from the DOM event
     *   - use this as event name
    */
    export class KeyboardState {

        private static MODIFIERS = ["shift", "ctrl", "alt", "meta"];

        private static ALIAS: { [index: string]: number } = {
            "left": 37, "up": 38, "right": 39, "down": 40,
            "space": 32, "pageup": 33, "pagedown": 34, "tab": 9, "escape": 27,
        };


        private keyCodes: { [index: number]: boolean } = {};
        private modifiers: { [index: string]: boolean } = {};


        constructor(private domElement: Node = document) {
            //this.domElement = domElement || document;
            // to store the current state
            //this.keyCodes = {};
            //this.modifiers = {};

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
        public destroy() {
            // unbind keyEvents
            this.domElement.removeEventListener("keydown", this._onKeyChange, false);
            this.domElement.removeEventListener("keyup", this._onKeyChange, false);

            // unbind window blur event
            window.removeEventListener("blur", this._onBlur, false);
        }



        /**
         * query keyboard state to know if a key is pressed of not
         *
         * @param {String} keyDesc the description of the key. format : modifiers+key e.g shift+A
         * @returns {Boolean} true if the key is pressed, false otherwise
        */
        public pressed(keyDesc: string) {
            var keys = keyDesc.split("+");
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var pressed = false;
                if (KeyboardState.MODIFIERS.indexOf(key) !== -1) {
                    pressed = this.modifiers[key];
                } else if (Object.keys(KeyboardState.ALIAS).indexOf(key) !== -1) {
                    pressed = this.keyCodes[KeyboardState.ALIAS[key]];
                } else {
                    pressed = this.keyCodes[key.toUpperCase().charCodeAt(0)];
                }
                if (!pressed) {
                    return false;
                }
            };
            return true;
        }

        /**
         * return true if an event match a keyDesc
         * @param  {KeyboardEvent} event   keyboard event
         * @param  {String} keyDesc string description of the key
         * @return {Boolean}         true if the event match keyDesc, false otherwise
         */
        public eventMatches(event: KeyboardEvent, keyDesc: string) {
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
                } else if (key === "ctrl") {
                    pressed = (event.ctrlKey ? true : false);
                } else if (key === "alt") {
                    pressed = (event.altKey ? true : false);
                } else if (key === "meta") {
                    pressed = (event.metaKey ? true : false);
                } else if (aliasKeys.indexOf(key) !== -1) {
                    pressed = (event.keyCode === aliases[key] ? true : false);
                } else if (event.keyCode === key.toUpperCase().charCodeAt(0)) {
                    pressed = true;
                }
                if (!pressed) {
                    return false;
                }
            }
            return true;
        }

        private _onBlur = () => {
            for (var prop in this.keyCodes) {
                this.keyCodes[prop] = false;
            }
            for (var prop in this.modifiers) {
                this.modifiers[prop] = false;
            }
        }

        /**
         * to process the keyboard dom event
        */
        private _onKeyChange = (event: KeyboardEvent) => {
            // log to debug
            //console.log("onKeyChange", event, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)

            // update this.keyCodes
            var keyCode = event.keyCode;
            var pressed = event.type === "keydown" ? true : false;
            this.keyCodes[keyCode] = pressed;
            // update this.modifiers
            this.modifiers["shift"] = event.shiftKey;
            this.modifiers["ctrl"] = event.ctrlKey;
            this.modifiers["alt"] = event.altKey;
            this.modifiers["meta"] = event.metaKey;
        }
    }
}