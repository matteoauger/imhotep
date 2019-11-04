/**
 * 
 * @param {function(object,object,function):any|Promise<any>} handler
 * @returns {function(object,object,function):Promise<any>} 
 */
function wrap(handler) {
    return async function(req, res, next) {
        try {
            return handler(req, res, next);
        } catch (next) {
            return next(next);
        }
    };
}

module.exports = wrap;