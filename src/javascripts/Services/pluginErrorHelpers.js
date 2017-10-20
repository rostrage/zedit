ngapp.service('pluginErrorHelpers', function() {
    let referenceSignatures = ['REFR', 'PGRE', 'PMIS', 'ACHR', 'PARW', 'PBAR', 'PBEA', 'PCON', 'PFLA', 'PHZD'];

    this.isUDR = function(error) {
        return referenceSignatures.indexOf(error.signature) > -1;
    };

    this.isNavmeshError = function(error) {
        return error.signature === 'NAVM';
    };

    this.withErrorElement = function(error, callback, onException = console.log) {
        let element = xelib.GetElement(error.handle, error.path);
        try {
            try {
                return callback(element);
            } catch(exception) {
                onException(error, exception);
            }
        } finally {
            xelib.Release(element);
        }
    };
});