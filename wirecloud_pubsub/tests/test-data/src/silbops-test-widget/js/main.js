/*jshint globalstrict:true */
/*global MashupPlatform*/

(function () {

    "use strict";

    var silbops_available = false;

    if (typeof MashupPlatform.SilboPS !== 'undefined') {
        silbops_available = true;
    }

    setTimeout(function () {
        if (silbops_available) {
            document.body.textContent = 'Success';
        } else {
            document.body.textContent = 'Failure';
        }
    }, 0);

})();
