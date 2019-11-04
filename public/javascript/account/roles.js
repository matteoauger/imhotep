async function sendChanges(userId, roleId) {
    const init = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: userId, 
            role_id: roleId
        })
    };
    const res = await fetch('/account/roles', init);
    if (res.status !== 200) {
        alert(`Erreur - ${res.status}`);
    }
}

function attachEvents() {
    const selects = document.querySelectorAll('select');

    selects.forEach(elt => {
        elt.addEventListener('change', e => sendChanges(elt.id, e.currentTarget.value))
    });
}

window.addEventListener('load', attachEvents);
