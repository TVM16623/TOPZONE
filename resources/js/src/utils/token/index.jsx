// Thao tác mới access token
// Lưu trong local storage

export default {
    get: function (name) {
        return localStorage.getItem(name);
    },
    set: function (name, value) {
        localStorage.setItem(name, value);
    },
    has: function (name) {
        const token = localStorage.getItem(name);
        return token !== null;
    },
    delete: function (name) {
        localStorage.removeItem(name);
    },
    getUser: function () {
        const user = JSON.parse(localStorage.getItem("user"));

        const user_obj = (typeof (user) === 'string') ? JSON.parse(user) : user;

        return user_obj;
    },
    deleteUser: function () {
        localStorage.removeItem("user");
    },
    setUser: function (value) {
        localStorage.setItem("user", JSON.stringify(value));
    },
    getEmailVerify: function () {
        const email = JSON.parse(localStorage.getItem("waitingVerificationEmail"));

        const email_obj = (typeof (email) === 'string') ? JSON.parse(email) : email;

        return email_obj;
    },
    setEmailVerify: function (value) {
        localStorage.setItem("waitingVerificationEmail", JSON.stringify(value));
    },
    deleteEmailVerify: function () {
        localStorage.removeItem("waitingVerificationEmail");
    },
}
