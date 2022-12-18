const showErrorMessage = (message, element) => {
    const div = document.createElement('div');
    div.classList.add('alert');
    element.appendChild(div);

    const span = document.createElement('span');
    span.textContent = message;
    span.classList.add('msg');
    div.appendChild(span);

    div.classList.add('show');
    div.classList.remove('hide');
    div.classList.add('showAlert');
    setTimeout(() => {
        div.classList.remove('show');
        div.classList.add('hide');
    }, 5000);
}

module.exports = showErrorMessage;
