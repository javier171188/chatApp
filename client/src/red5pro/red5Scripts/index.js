import "../lib/red5pro/red5pro-sdk.min.js";

import '../lib/screenfull/screenfull.min.js';
import '../script/testbed-config.js';
import '../script/red5pro-utils.js';
import '../script/reachability.js';
import './adapter-latest.js';
import '../script/reachability.js';
import '../script/subscription-status.js';
//import '../script/publisher-status.js';

import "../conference-subscriber.js";
import "../device-selector-util.js";

import "../lib/es6/es6-promise.min.js";
import "../lib/es6/es6-bind.js";
import "../lib/es6/es6-array.js";
import "../lib/es6/es6-object-assign.js";
import "../lib/es6/es6-fetch.js";


(function (window) {
    var configuration = (function () {
        var conf = sessionStorage.getItem('r5proTestBed');
        try {
            return JSON.parse(conf);
        }
        catch (e) {
            console.error('Could not read testbed configuration from sessionstorage: ' + e.message);
        }
        return {}
    })();

    if (configuration.verboseLogging) {
        window.publisherLog = function (message) {
            console.log('[Red5ProRTMPPublisher:SWF] - ' + message);
        };
        window.subscriberLog = function (message) {
            console.log('[Red5ProRTMPSubscriber:SWF] - ' + message);
        };
    }

    if (configuration.authentication.enabled) {
        var node = document.createElement('div');
        node.classList.add('hint-block', 'auth-alert');
        var note = document.createElement('span');
        note.classList.add('strong');
        note.innerHTML = '*Authentication is Enabled*';
        var link = document.createElement('a');
        link.innerText = 'Click here to disable.';
        link.href = 'index.html';
        link.classList.add('auth-link');
        node.appendChild(note);
        node.appendChild(link);
        var testBody = document.getElementById('back-link-container').nextElementSibling;
        testBody.parentNode.insertBefore(node, testBody);
    }

})(window);
