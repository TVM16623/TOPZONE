import moment from "moment/min/moment-with-locales";
import vi from "moment/locale/vi";
import React from "react";

moment.locale("vi", vi);

export default {
    FromNow: function ({ date }) {
        const [time, setTime] = React.useState(moment(date).fromNow());

        React.useEffect(() => {
            // console.log(date, moment(date).format("DD/MM/YYYY H:mm:ss"))
            const id = setInterval(() => setTime(moment(date).fromNow()), 1000);
            return () => clearInterval(id);
        }, []);

        return time;
    },
    format: function (time, d = "DD/MM/YYYY") {
        return moment(time).format(d);
    },
};
