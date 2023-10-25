export default function makeInputObjectFactory({ md5, sanitize }) {
  return Object.freeze({ inputObj })
  let localErrorMsgs = {};
  function inputObj({ params, errorMsgs }) {
    const {
      username,
      password,
      email,
      created = Date.now(),
      modified = Date.now()
    } = params;

    return Object.freeze({
      username: () => checkUsername({ username, errorMsgs }),
      password: () => checkPassword({ password, errorMsgs }),
      email: () => checkEmail({ email, errorMsgs }),
      created: () => created,
      modified: () => modified
    })
  }

  function checkEmail({ email, errorMsgs }) {

    // Regular expression pattern to match a valid email address
    {
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (emailPattern.test(email) == false) {
        throw new Error(`${errorMsgs}.Email`)
      }
      else {
        email = sanitize(email)
      }
    }
    return email
  }

  function checkUsername({ username, errorMsgs }) {
    checkRequiredParam({
      param: username,
      paramName: 'username',
      errorMsgs
    });
    username = sanitize(username);
    if (
      username.length <= 4 ||
      username.length >= 25 ||
      !username.match(/[a-z0-9_]/i) ||
      !username.split('')[0].match(/[a-z]/gi) ||
      username.split('')[username.length - 1] === '_'
    ) {
      throw new Error(`${errorMsgs}.ChangeUsername`)
    }
    else {
      return username
    }
  }

  function checkPassword({ password, errorMsgs }) {
    checkRequiredParam({
      param: password,
      paramName: 'password',
      errorMsgs
    });
    password = sanitize(password);
    password = hash({ param: password });
    return password;
  }

  function hash({ param }) {
    return md5(param);
  }

  function checkRequiredParam({ param, paramName, errorMsgs }) {
    if (!param || param === '')
      throw new Error(`${errorMsgs.MISSING_PARAMETER}${paramName}`)
    return;
  }
}