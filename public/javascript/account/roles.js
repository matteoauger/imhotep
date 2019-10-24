function sendChanges(userId, roleId) {
    fetch('/account/roles', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: userId, 
            role_id: roleId
        })
    })
    .then(res => {
        if (res.status !== 200) {
            throw new Error(`Failed ${res.status}`);
        }
    })
    .catch(err => {
        alert("Erreur " + err.status);
    });
}

function attachEvents() {
    const selects = document.querySelectorAll('select');

    selects.forEach(elt => {
        elt.addEventListener('change', e => sendChanges(elt.id, e.currentTarget.value))
    });
}

window.addEventListener('load', attachEvents);
