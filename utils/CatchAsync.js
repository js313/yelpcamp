function wrapAsync(func) {
    return (req, res, next) => {
        func(req, res, next).catch(next)    //As you cannot .catch the callback in app.get
    }
}

module.exports = wrapAsync