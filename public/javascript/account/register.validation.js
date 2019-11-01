window.onload = function() {
    const passwordConf = document.getElementById('password-confirmation');
    const password = document.getElementById('password');
    const errSpan = document.getElementById('password-confirmation-error');
    const sendButton = document.getElementById('send-button');

    function validatePasswordConfirmation() {
        if (password.value === passwordConf.value) {
            errSpan.style.display = 'none';
            sendButton.disabled = '';
        } else {
            errSpan.style.display = 'block';
            sendButton.disabled = 'disabled';
        }
    }

    passwordConf.onkeyup = validatePasswordConfirmation;
    password.onkeyup = validatePasswordConfirmation;

    validatePasswordConfirmation();
}