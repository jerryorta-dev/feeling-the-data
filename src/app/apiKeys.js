(function() {

    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

    // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

    // Create a safe reference to the apikeys object for use below.
    var apikeys = function(obj) {
        if (obj instanceof apikeys) return obj;
        if (!(this instanceof apikeys)) return new apikeys(obj);
        this._wrapped = obj;
    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = apikeys;
        }
        exports.apikeys = apikeys;
    } else {
        root.apikeys = apikeys;
    }

    // Current version.
    apikeys.VERSION = '1.0.0';



    apikeys.reference = {
        'zillowApiKey':'X1-ZWz1dshk18nnyj_76gmj',
        'truliaApiKey':'5kpnkmaued687936qm6y9chc',
        'indeedApiKey':'4600389599611799',
        'usaTodayApiKey':'474qrq8eh68cqa4hvw45tqfu',
        'censusDataApiKey':'f136a395509816b3bda96f6a1375b3960f27cbbb',
        'beaApiKey':'E5311C0F-5662-4934-B043-69BA533F9959'
        }

    // AMD registration happens at the end for compatibility with AMD loaders
    // that may not enforce next-turn semantics on modules. Even though general
    // practice for AMD registration is to be anonymous, underscore registers
    // as a named module because, like jQuery, it is a base library that is
    // popular enough to be bundled in a third party lib, but not be part of
    // an AMD load request. Those cases could generate an error when an
    // anonymous define() is called outside of a loader request.
    if (typeof define === 'function' && define.amd) {
        define('underscore', [], function() {
            return _;
        });
    }

}).call(this);