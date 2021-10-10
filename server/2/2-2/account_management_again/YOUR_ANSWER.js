const pw = require('./promise-wrappers');

const _ = async () => {
  const writeUser = async ({ account, username }) => await pw.writeFileP(`accounts/${account}`, username);

  try {
    // Fetch users and parse to JSON.
    let users = await pw.readFileP('users.json');
    users     = JSON.parse(users);

    // Resolve all the writes
    await Promise.all(users.map(writeUser));

    // Log when done
    console.log('done');
  } catch (error) {
    console.error('Caught:', error);
  }
};

_();