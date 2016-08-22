var $ = require('jquery');

var isEditor = true;

function toggleMode(event) {
    $('#result')
        .removeClass()
        .addClass($(event.target).data('mode'));

    // clear previous state of all buttons
    $('#right_header > span.button')
        .removeClass('button_current');

    // set active state of current button
    $('#button_' + $(event.target).data('mode'))
        .toggleClass('button_current');
}

module.exports = toggleMode;
