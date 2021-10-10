let theErrorReport;

window.onload = function initializeApp() {
  const theForm         = document.getElementById('try-out-form');
  theErrorReport        = document.getElementById('error-report');
  theErrorReport.hidden = true;

  // The form-validator uses functions to check if a field has valid input.
  // This object defines which checker functions work for which form fields.
  const theFormCheckers = {
    voornaam:   message(hasMaxLength(20), 'Lange voornamen passen niet op het vliegticket'),
    achternaam: hasMaxLength(20),
    postcode:   message(isZipcode, 'Dit moeten vier cijfers, en dan twee letters zijn'),
    huisnummer: message(isRequired, 'Wat jammer dat er geen huisnummer is :-(')
  };

  theForm.addEventListener('submit', makeFormValidator(theFormCheckers, handleFormSubmit, handleErrors));
};

function handleFormSubmit() {
  theErrorReport.hidden = true;
  alert('Alle velden zijn prima ingevuld!\nWe kunnen de data naar de server sturen...');
}

function handleErrors(checkerFailures) {
  theErrorReport.hidden = false;
  const errorList       = document.getElementById('error-messages');
  errorList.innerHTML   = '';

  checkerFailures.map(([name, failure]) => {
    return failure ? [name, failure] : [name, 'Dit veld is niet correct ingevuld'];
  }).map(([name, message]) => {
    return `<b>${name}:</b> ` + message;
  }).map(messageHtml => {
    const listItem     = document.createElement('li');
    listItem.innerHTML = messageHtml;
    return listItem;
  }).forEach(item => {
    errorList.appendChild(item);
  });
}