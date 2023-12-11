export class ConvertDateUtility {
  static convertDatetimeLocalString(date: Date, option: {} = {}) {
    const { numberOnly } = { numberOnly: false, ...option };

    const formatOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const datetime = date.toLocaleString('ko-KR', formatOptions);
    return numberOnly ? datetime.replace(/\D/g, '') : datetime;
  }
}
