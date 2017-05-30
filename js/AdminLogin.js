(function () {

    var adminButton = document.createElement('a');
    adminButton.style.display = 'block';
    adminButton.style.width = '25%';
    adminButton.style.height = '20%'
    //adminButton.style.border = '1px solid red';
    adminButton.style.position = 'absolute';
    adminButton.style.zIndex = 10000;
    adminButton.style.top = '0px';
    adminButton.style.right = '0px';

    var settings = JSON.parse(sessionStorage.getItem('settings'));
    var adminPass = settings['adminPassword'];
    var modal = new SimpleModal(null, {
        maxWidth: 300,
        zIndex:9999
    });

    modal.setBody('<div class="admin-login-box"><input type="password" class="admin-login-input"/><div class="vkeyboard admin-login-keypad"></div></div>');
    modal.setTitle('Admin Login');

    var vKeyboardRoot = modal.getBodyElement().querySelector('.vkeyboard');
    var vKeyboardInput = modal.getBodyElement().querySelector('input');

    var k = new VKeyboard(VKeyboard.KEYPAD_LAYOUT_UC, VKeyboard.KEYPAD_LAYOUT_UC, false);
    k.lastSelectedInput = null;
    k.setRoot(vKeyboardRoot);
    k.setInputTarget(vKeyboardInput);
    k.toHTML();


    vKeyboardInput.addEventListener('change', function (evt) {

        if (this.value.toString() === adminPass.toString()) {
            this.style.borderColor = 'darkgreen';
            this.style.background = 'darkgreen';
            this.style.color = '#FFF';
            this.disabled = true;
            window.location = 'edit_settings.html';
        }
        
    });


    adminButton.addEventListener('dblclick', function (evt) {
        evt.preventDefault();
        modal.show();
    });

    document.body.appendChild(adminButton);

})();