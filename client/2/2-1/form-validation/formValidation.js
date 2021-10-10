/////////////////////////////////////
//                                 //
//      The validator library      //
//                                 //
/////////////////////////////////////


// makeFormValidator is a function that returns an event handler (a function).
// The returned event handler will use the checkerFunctions as a set of functions to
// validate form fields, and the submitHandler to call if everything is valid.
const makeFormValidator = (checkerFunctions, submitHandler, errorReporter) => {
  // This function below is the actual form-validator that becomes an event handler
  // for form submissions.
  return event => {
    // This prevents the browser from sending the form-data to the server and
    // loading the server response as a new HTML page (replacing this one).
    event.preventDefault();

    const theForm        = event.target;
    const theErrorReport = document.getElementById('error-report');
    // Like querySelectorAll() and getElementsByClassName(), getElementsByTagName()
    // does not return a proper Array, but something called an HTMLCollection.
    // We can't call forEach, map, filter etc. directly on an HTMLCollection,
    // but after we convert it to a normal array using the Array.from() function,
    // we can call all the cool higher-order functions that are methods of arrays.
    const fieldsCollection = theForm.getElementsByTagName(`input`);
    const fieldsArray      = Array.from(fieldsCollection);

    console.log('---');

    const fieldsWithChecker = fieldsArray.filter(inputElement => {
      return checkerFunctions[inputElement.name] !== undefined;
    });

    const checkerResults = fieldsWithChecker.map(({ name, value }) => {
      const checker     = checkerFunctions[name];
      const checkResult = checker(value);

      return [name, checkResult];
    });

    const unsuccessfulChecks = checkerResults.filter(([, result]) => result !== true);

    unsuccessfulChecks.length === 0 ? submitHandler() : errorReporter(unsuccessfulChecks);
  };
};

/**
 * Checks if given zipcode is valid.
 *
 * @param value
 * @returns {boolean}
 */
const isZipcode = value => value.trim().search(/^[0-9]{4}\s*[A-Za-z]{2}$/) !== -1;

/**
 * Checks if the field is filled.
 *
 * @param value
 * @returns {boolean}
 */
const isRequired = value => value.trim() !== '' || 'Dit veld moet ingevuld worden';

/**
 * Checks if both checkers are true with given input.
 *
 * @param checker1
 * @param checker2
 * @returns {function(*=)}
 */
const checkBoth = (checker1, checker2) => value => checker1(value) && checker2(value);

/**
 * Makes a checker optional, which means it can either be empty or be true to the given checker.
 *
 * @param checker
 * @returns {function(*)}
 */
const optional = checker => value => value === '' || checker(value);

/**
 * Checks if the field length is less or equal than a given max length.
 *
 * @param maxLength
 * @returns {function(*): boolean}
 */
const hasMaxLength = maxLength => ({ length }) => length <= maxLength;

/**
 * Checks if the field length is more or equal than a given min length.
 *
 * @param minLength
 * @returns {function(*): boolean}
 */
const hasMinLength = minLength => ({ length }) => length >= minLength;

/**
 * Adds a message when a checker is false.
 *
 * @param checker
 * @param string
 * @returns {function(*=)}
 */
const message = (checker, string) => value => checker(value) || string;