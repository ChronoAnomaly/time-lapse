(function () {

    function VKeyboard(strData, shiftStrData) {
        this.lcData = this.compile(strData);
        this.ucData = this.compile(shiftStrData);

        this.isShiftOn = false;
        this.lastSelectedInput = null;
        this.webView = null;

        var styleTxt = '.vkey{transition:all 300ms;}.vkey:active{transform:scale(.75);}';
        var styleEl = document.createElement('style');
        styleEl.innerHTML = styleTxt;
        document.body.appendChild(styleEl);
    }

    VKeyboard.prototype.setInputTarget = function (inputEl) {
        this.lastSelectedInput = inputEl;
    };

    VKeyboard.prototype.setWebViewInputTarget = function (wv) {
        this.webView = wv;
    };

    VKeyboard.prototype.compile = function (strData) {
        layout = [];

        //Enumerate each line on keyboard
        for (var i = 0; i < strData.length; i++) {

            //row = layoutStr[i]
            cells = strData[i].split(' ');
            keyData = [];

            for (var j = 0; j < cells.length; j++) {
                keyData.push({
                    value: cells[j],
                    label: this.getKeyText(cells[j]),
                });
            }

            layout.push(keyData);
        }

        return layout;
    };

    VKeyboard.prototype.getKeyText = function (key) {
        specials = {
            "{backspace}": '<i class="fa fa-chevron-left"></i>&nbsp;Backspace',
            "{shift}": "Shift",
            "{space}": "Space",
            "{clear}": "Clear",
            "{.com}": ".com",
            "{.edu}": ".edu",
            '{.net}': ".net"
        };

        if (key in specials) {
            return specials[key];
        } else {
            return key;
        }
    };


    VKeyboard.prototype.handleKeyPress = function (element) {
        var val = element.getAttribute('data-value');
        var stringInputs = ['{.edu}', '{.com}', '{.net}'];

        switch (val) {
            default:
                //Shortcut string values...
                if (stringInputs.indexOf(val) >= 0) {
                    val = val.replace('{', '').replace('}', '');
                }

                if (this.lastSelectedInput !== null) {
                    this.lastSelectedInput.value = this.lastSelectedInput.value + val;
                }

                if (this.webView !== null) {
                    this.webView.sendInputEvent({'type': 'char', 'keyCode': val});
                }
                break;
            case '{shift}':
                this.isShiftOn = !this.isShiftOn;
                this.toHTML();
                break;
            case '{clear}':
                if (this.lastSelectedInput !== null) {
                    this.lastSelectedInput.value = '';
                }
                break;
            case '{backspace}':
                if (this.lastSelectedInput !== null) {
                    var str = this.lastSelectedInput.value;
                    var minusOne = this.lastSelectedInput.value.substring(0, str.length - 1);
                    this.lastSelectedInput.value = minusOne;
                }

                if (this.webView !== null) {
                    this.webView.sendInputEvent({
                        type: "keyDown",
                        keyCode: '\u0008'
                    });

                    this.webView.sendInputEvent({
                        type: "keyUp",
                        keyCode: '\u0008'
                    });
                }
                break;
        }

        if (this.lastSelectedInput !== null) {
            this.lastSelectedInput.focus();
            var evt = new CustomEvent('change');
            this.lastSelectedInput.dispatchEvent(evt);
        }
    };


    VKeyboard.prototype.toHTML = function () {
        var self = this;
        var layout = this.lcData;

        if (this.isShiftOn) {
            layout = this.ucData;
        }

        var frag = document.createDocumentFragment();
        var keyboard = document.createElement('div');
        keyboard.classList.add('pp-keyboard');

        for (var r = 0; r < layout.length; r++) {
            var row = document.createElement('div');

            for (var c = 0; c < layout[r].length; c++) {
                (function () {
                    data = layout[r][c];

                    var button = document.createElement('button');
                    button.className = 'vkey';
                    button.setAttribute('data-value', layout[r][c].value);
                    button.innerHTML = layout[r][c].label;

                    if (['{shift}', '{backspace}', '{clear}'].indexOf(layout[r][c].value) >= 0) {
                        button.classList.add('pp-big');
                    }

                    //Overwrite space...
                    if (layout[r][c].value === '{space}') {
                        button.setAttribute('data-value', ' ');
                        button.classList.add('pp-spacebar');
                    }

                    button.addEventListener('click', function () {
                        self.handleKeyPress(button);
                    });

                    row.appendChild(button);
                })();
            }

            keyboard.appendChild(row);
        }

        //Clear and append new!
        this.root.innerHTML = '';
        frag.appendChild(keyboard);
        this.root.appendChild(frag);
    };

    VKeyboard.prototype.addInputListeners = function () {
        var self = this;

        var inputs = document.querySelectorAll('input');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('focus', function (e) {
                self.lastSelectedInput = this;
            });
        }
    };

    //Taken from: http://stackoverflow.com/questions/4715762/javascript-move-caret-to-last-character
    VKeyboard.prototype.moveCaretToEnd = function (el) {
        if (el !== null) {
            el.focus();
            var range = el.createTextRange();
            range.select();
        }
    };

    VKeyboard.prototype.addCSS = function () {
        var style = document.createElement('style');
        style.innerHTML = VKeyboard.CSS_STYLE;
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('type', 'text/css');

        document.querySelector('head').appendChild(style);
    };

    VKeyboard.prototype.attachToBody = function () {
        var root = document.createElement('div');
        root.classList.add('pp-keyboard');

        document.body.appendChild(root);
        this.root = root;
    };

    VKeyboard.prototype.setRoot = function (rootEl) {
        this.root = rootEl;
    };

    VKeyboard.CSS_STYLE = '';

    VKeyboard.STANDARD_LAYOUT_LC = [
        '1 2 3 4 5 6 7 8 9 0 - = \\ {backspace}',
        'q w e r t y u i o p [ ] {clear}',
        'a s d f g h j k l ; \'',
        '{shift} z x c v b n m , . / @',
        '{space}'
    ];

    VKeyboard.STANDARD_LAYOUT_UC = [
        '! @ # $ % ^ & * ( ) _ + | {backspace}',
        'Q W E R T Y U I O P { } {clear}',
        'A S D F G H J K L : "',
        '{shift} Z X C V B N M < > ? @',
        '{space}'
    ];

    VKeyboard.EMAIL_LAYOUT_LC = [
        '1 2 3 4 5 6 7 8 9 0 - = \\ {backspace}',
        'q w e r t y u i o p [ ] {clear}',
        'a s d f g h j k l ; \'',
        '{shift} z x c v b n m , . / @',
        '{space} {.com} {.edu} {.net}'
    ];

    VKeyboard.EMAIL_LAYOUT_UC = [
        '! @ # $ % ^ & * ( ) _ + | {backspace}',
        'Q W E R T Y U I O P { } {clear}',
        'A S D F G H J K L : "',
        '{shift} Z X C V B N M < > ? @',
        '{space} {.com} {.edu} {.net}'
    ];

    VKeyboard.KEYPAD_LAYOUT_UC = [
        '1 2 3',
        '4 5 6',
        '7 8 9',
        '0 {clear}'
    ];

    //Export to the real world!
    window.VKeyboard = VKeyboard;
})();