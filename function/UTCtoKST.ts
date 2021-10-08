export default function(curDate: Date) : Date
{
    const utc =
        curDate.getTime() +
        (curDate.getTimezoneOffset() * 60 * 1000);

    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const kr_cur = new Date(utc + (KR_TIME_DIFF));

    return kr_cur;
}