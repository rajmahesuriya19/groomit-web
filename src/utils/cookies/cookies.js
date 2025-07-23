import { Cookies } from 'react-cookie';

// Create an instance of the Cookies class to work with cookies
const cookies = new Cookies();

/**
 * Set a cookie with the specified name, value, and optional expiration time.
 * @param name - String. The name of the cookie.
 * @param value - String. The value to be stored in the cookie.
 * @param expire [expire=3600 * 1000 * 24] - Optional expiration time for the cookie in milliseconds (default is 24 hours).
 */
const set = (name, value, expire = 3600 * 1000 * 24) => {
  // Set the cookie with the given name and value
  // Also, set the expiration time and path for the cookie
  cookies.set(name, value, {
    expires: new Date(new Date().getTime() + expire), // Calculate the expiration time
    path: '/', // Set the cookie path to root '/'
  });
};

/**
 * Get the value of a cookie with the specified name.
 * @param name - String. The name of the cookie to retrieve.
 * @returns - String|Null. The value of the cookie if it exists, or null if the cookie is not found.
 */
const get = (name) => {
  // Retrieve the value of the cookie by name
  return cookies.get(name);
};

/**
 * Remove a cookie with the specified name.
 * @param name - String. The name of the cookie to remove.
 */
const remove = (name) => {
  // Remove the cookie with the given name and specify the path as '/'
  cookies.remove(name, {
    path: '/',
  });
};

/**
 * Remove all cookies stored by the application.
 */
const clean = () => {
  // Get a list of all cookies and remove each one with the specified path as '/'
  const cookiesList = cookies.getAll();
  Object.keys(cookiesList).forEach((cookieName) => {
    cookies.remove(cookieName, { path: '/' });
  });
};

// Export the 'set', 'get', 'remove', and 'clean' functions for use in other parts of the application
export const cookie = {
  get,
  set,
  remove,
  clean,
};
