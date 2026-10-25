const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies?.[cookieName];

        if (!tokenCookieValue) {
            req.user = null;
            return next();
        }

        try {
            req.user = validateToken(tokenCookieValue);
        } catch (error) {
            console.log("Token error:", error.message);
            req.user = null;
        }

        return next();
    };
}

module.exports = { checkForAuthenticationCookie };