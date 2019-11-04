async function deleteAd(id) {
    const requestInfo = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    };
    const res = await fetch('/ads/delete', requestInfo);
    if (res.status !== 200) {
        alert(`Erreur - ${res.status}`);
    }
    window.location.reload(false); 
}

function editAd(id) {
    // TODO
}

function attachEvents() {
    const deleteElmts = document.getElementsByClassName('delete');
    const editElmts = document.getElementsByClassName('edit');
    for (const elt of deleteElmts) {
        elt.addEventListener('click', e => deleteAd(e.currentTarget.value))
    }
    for (const elt of editElmts) {
        elt.addEventListener('click', e => editAd(e.currentTarget.value))
    }
}

window.addEventListener('load', attachEvents);