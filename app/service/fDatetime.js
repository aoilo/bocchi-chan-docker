const formatTime = () => {
    function dateToStr24HPad0(date, format) {
        if (!format) {
            format = 'YYYY/MM/DD hh:mm:ss'
        }
        date.setHours(date.getHours());
        format = format.replace(/YYYY/g, date.getFullYear());
        format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
        format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
        format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
        format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
        format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
        return format;
    }

    const t = dateToStr24HPad0(new Date(), 'YYYY/MM/DD hh:mm:ss');
    return t;
}

// console.log(formatTime())
module.exports.formatTime = formatTime