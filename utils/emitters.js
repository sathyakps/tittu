var Subject = require('rxjs').Subject;

const updateNewMessage = new Subject();

module.exports = { updateNewMessage };
