var lastCheckedRadio;

function handleZoom() {
    if (document.querySelector('input[type="radio"]:checked') == lastCheckedRadio) {
        lastCheckedRadio.checked = false;
        lastCheckedRadio = undefined;
    } else
        lastCheckedRadio = document.querySelector('input[type="radio"]:checked');
}