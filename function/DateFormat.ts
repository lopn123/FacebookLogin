export default function(data: Date) {
    let date = new Date(data);
    let month : string = (date.getMonth() + 1).toString();
    let day : string = date.getDate().toString();
    let hour : string = date.getHours().toString();
    let minute : string = date.getMinutes().toString();
    let second : string = date.getSeconds().toString();

    month = +month >= 10 ? month : '0' + month;
    day = +day >= 10 ? day : '0' + day;
    hour = +hour >= 10 ? hour : '0' + hour;
    minute = +minute >= 10 ? minute : '0' + minute;
    second = +second >= 10 ? second : '0' + second;

    return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}