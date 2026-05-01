//for extra work like error handling 
//better way to write try catch block
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};