export class ConvertDateUtility {
  private static MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  // 로컬 날짜로 변환
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

  // 시간 제외 날짜로 변환
  static convertDateWithoutTime(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    return new Date(year, month, day);
  }

  // 두 날짜 간 일수 차이 계산
  static calculateDaysBetweenDates(
    start: Date,
    end: Date,
    isWeekendsExcl: boolean = true,
    addOneDay: boolean = true,
  ): number {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const totalDays =
      Math.floor((endDate.getTime() - startDate.getTime()) / this.MILLISECONDS_PER_DAY) + Number(addOneDay);

    return isWeekendsExcl ? totalDays - this.calculateWeekendsBetweenDates(startDate, totalDays) : totalDays;
  }

  // 두 날짜 간 주말 일수 계산
  static calculateWeekendsBetweenDates(startDate: Date, totalDays: number): number {
    const weekends = Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(startDate.getTime() + index * this.MILLISECONDS_PER_DAY);
      return date.getDay() === 0 || date.getDay() === 6 ? 1 : 0;
    }).reduce((acc, day) => acc + day, 0);

    return weekends;
  }
}
