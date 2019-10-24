function passwordsMatch() {

}

function validatePassword(evt) {
    let password = evt.currentTarget.value;

    if (password.length >= 8 && password.length <= 32) {
        // password valid
    } else {
        // password invalid
    }
}