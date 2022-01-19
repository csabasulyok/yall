// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import yallAxiosConnect from '../src/yallaxios';

(async () => {
  /**
   * USING DEFAULT INSTANCE
   */

  // decorate default instance
  yallAxiosConnect(axios, {
    readLevel: 'info',
  });

  try {
    // should show info level message
    await axios.get('https://github.com/csabasulyok');
    // should show warning for not found
    await axios.get('https://github.com/fullynotexistent');
  } catch (e) {
    // do nothing
  }

  /**
   * USING CUSTOM INSTANCE
   */

  // create axios instance
  let instance = axios.create({
    baseURL: 'https://github.com',
  });

  // decorate instance with yall interceptors
  instance = yallAxiosConnect(instance, {
    readLevel: 'info',
  });

  try {
    // should show info level message
    await instance.get('/csabasulyok');
    // should show warning for not found
    await instance.get('/fullynotexistent');
  } catch (e) {
    // do nothing
  }
})();
