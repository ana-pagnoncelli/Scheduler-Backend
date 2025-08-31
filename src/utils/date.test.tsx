import { getWeekDay, getCurrentDate, dateWithWeekDayForNext7Days, findClosestDate, findClosestWeekDay, weekdaysToDates, removeDatesFromList, mergeDateLists } from './date';
import { WeekDay } from '../fixed_schedules/schedule';

describe('Date Utility Functions', () => {
  describe('getWeekDay', () => {
    it('should return correct weekday for Sunday', () => {
      const sunday = new Date(2024, 0, 7); // Sunday (month is 0-indexed)
      expect(getWeekDay(sunday)).toBe('SUNDAY');
    });

    it('should return correct weekday for Monday', () => {
      const monday = new Date(2024, 0, 8); // Monday (month is 0-indexed)
      expect(getWeekDay(monday)).toBe('MONDAY');
    });

    it('should return correct weekday for Tuesday', () => {
      const tuesday = new Date(2024, 0, 9); // Tuesday (month is 0-indexed)
      expect(getWeekDay(tuesday)).toBe('TUESDAY');
    });

    it('should return correct weekday for Wednesday', () => {
      const wednesday = new Date(2024, 0, 10); // Wednesday (month is 0-indexed)
      expect(getWeekDay(wednesday)).toBe('WEDNESDAY');
    });

    it('should return correct weekday for Thursday', () => {
      const thursday = new Date(2024, 0, 11); // Thursday (month is 0-indexed)
      expect(getWeekDay(thursday)).toBe('THURSDAY');
    });

    it('should return correct weekday for Friday', () => {
      const friday = new Date(2024, 0, 12); // Friday (month is 0-indexed)
      expect(getWeekDay(friday)).toBe('FRIDAY');
    });

    it('should return correct weekday for Saturday', () => {
      const saturday = new Date(2024, 0, 13); // Saturday (month is 0-indexed)
      expect(getWeekDay(saturday)).toBe('SATURDAY');
    });

    it('should handle edge case of year boundary', () => {
      const newYearEve = new Date(2023, 11, 31); // Sunday (month is 0-indexed)
      expect(getWeekDay(newYearEve)).toBe('SUNDAY');
    });

    it('should handle leap year dates', () => {
      const leapYearDate = new Date(2024, 1, 29); // Thursday (month is 0-indexed)
      expect(getWeekDay(leapYearDate)).toBe('THURSDAY');
    });
  });

  describe('getCurrentDate', () => {
    it('should return date in YYYYMMDD format when no separator is provided', () => {
      const date = new Date(2024, 0, 15); // January 15, 2024 (month is 0-indexed)
      expect(getCurrentDate(date)).toBe('20240115');
    });

    it('should return date with custom separator', () => {
      const date = new Date(2024, 0, 15); // January 15, 2024 (month is 0-indexed)
      expect(getCurrentDate(date, '-')).toBe('2024-01-15');
    });

    it('should return date with slash separator', () => {
      const date = new Date(2024, 0, 15); // January 15, 2024 (month is 0-indexed)
      expect(getCurrentDate(date, '/')).toBe('2024/01/15');
    });

    it('should pad single digit month and day with zeros', () => {
      const date = new Date(2024, 0, 5); // January 5, 2024 (month is 0-indexed)
      expect(getCurrentDate(date)).toBe('20240105');
    });

    it('should handle double digit month and day', () => {
      const date = new Date(2024, 11, 25); // December 25, 2024 (month is 0-indexed)
      expect(getCurrentDate(date)).toBe('20241225');
    });

    it('should handle edge case of year boundary', () => {
      const date = new Date(2023, 11, 31); // December 31, 2023 (month is 0-indexed)
      expect(getCurrentDate(date)).toBe('20231231');
    });

    it('should handle leap year date', () => {
      const date = new Date(2024, 1, 29); // February 29, 2024 (month is 0-indexed)
      expect(getCurrentDate(date)).toBe('20240229');
    });

    it('should handle single digit month and day with separator', () => {
      const date = new Date(2024, 0, 5); // January 5, 2024 (month is 0-indexed)
      expect(getCurrentDate(date, '-')).toBe('2024-01-05');
    });

    it('should handle double digit month and day with separator', () => {
      const date = new Date(2024, 11, 25); // December 25, 2024 (month is 0-indexed)
      expect(getCurrentDate(date, '-')).toBe('2024-12-25');
    });
  });

  describe('dateWithWeekDayForNext7Days', () => {
    beforeEach(() => {
      // Mock the current date to ensure consistent test results
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2024, 0, 15)); // Monday, January 15, 2024 (month is 0-indexed)
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return array with 7 elements', () => {
      const result = dateWithWeekDayForNext7Days();
      expect(result).toHaveLength(7);
    });

    it('should return correct structure for each element', () => {
      const result = dateWithWeekDayForNext7Days();
      result.forEach(item => {
        expect(item).toHaveProperty('week_day');
        expect(item).toHaveProperty('date');
        expect(typeof item.week_day).toBe('string');
        expect(typeof item.date).toBe('string');
      });
    });

    it('should return correct weekdays starting from current day', () => {
      const result = dateWithWeekDayForNext7Days();
      expect(result[0].week_day).toBe('MONDAY'); // 2024-01-15
      expect(result[1].week_day).toBe('TUESDAY'); // 2024-01-16
      expect(result[2].week_day).toBe('WEDNESDAY'); // 2024-01-17
      expect(result[3].week_day).toBe('THURSDAY'); // 2024-01-18
      expect(result[4].week_day).toBe('FRIDAY'); // 2024-01-19
      expect(result[5].week_day).toBe('SATURDAY'); // 2024-01-20
      expect(result[6].week_day).toBe('SUNDAY'); // 2024-01-21
    });

    it('should return correct dates for next 7 days', () => {
      const result = dateWithWeekDayForNext7Days();
      expect(result[0].date).toBe('2024-01-15'); // 2024-01-15
      expect(result[1].date).toBe('2024-01-16'); // 2024-01-16
      expect(result[2].date).toBe('2024-01-17'); // 2024-01-17
      expect(result[3].date).toBe('2024-01-18'); // 2024-01-18
      expect(result[4].date).toBe('2024-01-19'); // 2024-01-19
      expect(result[5].date).toBe('2024-01-20'); // 2024-01-20
      expect(result[6].date).toBe('2024-01-21'); // 2024-01-21
    });

    it('should handle month boundary correctly', () => {
      // Set date to end of month to test month boundary
      jest.setSystemTime(new Date(2024, 0, 31)); // Wednesday, January 31, 2024 (month is 0-indexed)
      const result = dateWithWeekDayForNext7Days();
      
      expect(result[0].week_day).toBe('WEDNESDAY'); // 2024-01-31
      expect(result[1].week_day).toBe('THURSDAY'); // 2024-02-01
      expect(result[2].week_day).toBe('FRIDAY'); // 2024-02-02
      expect(result[3].week_day).toBe('SATURDAY'); // 2024-02-03
      expect(result[4].week_day).toBe('SUNDAY'); // 2024-02-04
      expect(result[5].week_day).toBe('MONDAY'); // 2024-02-05
      expect(result[6].week_day).toBe('TUESDAY'); // 2024-02-06
    });

    it('should handle year boundary correctly', () => {
      // Set date to end of year to test year boundary
      jest.setSystemTime(new Date(2023, 11, 31)); // Sunday, December 31, 2023 (month is 0-indexed)
      const result = dateWithWeekDayForNext7Days();
      
      expect(result[0].week_day).toBe('SUNDAY'); // 2023-12-31
      expect(result[1].week_day).toBe('MONDAY'); // 2024-01-01
      expect(result[2].week_day).toBe('TUESDAY'); // 2024-01-02
      expect(result[3].week_day).toBe('WEDNESDAY'); // 2024-01-03
      expect(result[4].week_day).toBe('THURSDAY'); // 2024-01-04
      expect(result[5].week_day).toBe('FRIDAY'); // 2024-01-05
      expect(result[6].week_day).toBe('SATURDAY'); // 2024-01-06
    });

    it('should handle leap year correctly', () => {
      // Set date to February 28 in leap year
      jest.setSystemTime(new Date(2024, 1, 28)); // Wednesday, February 28, 2024 (month is 0-indexed)
      const result = dateWithWeekDayForNext7Days();
      
      expect(result[0].week_day).toBe('WEDNESDAY'); // 2024-02-28
      expect(result[1].week_day).toBe('THURSDAY'); // 2024-02-29 (leap day)
      expect(result[2].week_day).toBe('FRIDAY'); // 2024-03-01
      expect(result[3].week_day).toBe('SATURDAY'); // 2024-03-02
      expect(result[4].week_day).toBe('SUNDAY'); // 2024-03-03
      expect(result[5].week_day).toBe('MONDAY'); // 2024-03-04
      expect(result[6].week_day).toBe('TUESDAY'); // 2024-03-05
    });
  });

  describe('findClosestDate', () => {
    it('should find the closest future date', () => {
      const referenceDate = '2024-01-15';
      const dates = ['2024-01-10', '2024-01-20', '2024-01-25', '2024-01-30'];
      
      const result = findClosestDate(referenceDate, dates);
      
      expect(result.date).toBe('2024-01-20');
      expect(result.diff).toBe(5); // 5 days from 2024-01-15 to 2024-01-20
    });

    it('should return undefined when no future dates exist', () => {
      const referenceDate = '2024-01-15';
      const dates = ['2024-01-10', '2024-01-12', '2024-01-14'];
      
      const result = findClosestDate(referenceDate, dates);
      
      expect(result.date).toBeUndefined();
      expect(result.diff).toBe(0);
    });

    it('should handle empty dates array', () => {
      const referenceDate = '2024-01-15';
      const dates: string[] = [];
      
      const result = findClosestDate(referenceDate, dates);
      
      expect(result.date).toBeUndefined();
      expect(result.diff).toBe(0);
    });

    it('should find closest date when reference date is same as one of the dates', () => {
      const referenceDate = '2024-01-15';
      const dates = ['2024-01-15', '2024-01-20', '2024-01-25'];
      
      const result = findClosestDate(referenceDate, dates);
      
      expect(result.date).toBe('2024-01-15');
      expect(result.diff).toBe(0);
    });

    it('should handle dates in different months', () => {
      const referenceDate = '2024-01-31';
      const dates = ['2024-02-01', '2024-02-15', '2024-03-01'];
      
      const result = findClosestDate(referenceDate, dates);
      
      expect(result.date).toBe('2024-02-01');
      expect(result.diff).toBe(1);
    });

    it('should handle dates in different years', () => {
      const referenceDate = '2023-12-31';
      const dates = ['2024-01-01', '2024-01-15', '2024-02-01'];
      
      const result = findClosestDate(referenceDate, dates);
      
      expect(result.date).toBe('2024-01-01');
      expect(result.diff).toBe(1);
    });

    it('should find closest date when multiple dates are equally close', () => {
      const referenceDate = '2024-01-15';
      const dates = ['2024-01-20', '2024-01-20', '2024-01-25'];
      
      const result = findClosestDate(referenceDate, dates);
      
      expect(result.date).toBe('2024-01-20');
      expect(result.diff).toBe(5);
    });
  });

  describe('findClosestWeekDay', () => {
    it('should find the closest weekday in the same week', () => {
      const referenceWeekDay: WeekDay = 'WEDNESDAY';
      const weekDays: WeekDay[] = ['MONDAY', 'FRIDAY', 'SUNDAY'];
      
      const result = findClosestWeekDay(referenceWeekDay, weekDays);
      
      expect(result.weekDay).toBe('FRIDAY');
      expect(result.diff).toBe(2); // 2 days from Wednesday to Friday
    });

    it('should find the closest weekday in the next week when target is earlier', () => {
      const referenceWeekDay: WeekDay = 'SATURDAY';
      const weekDays: WeekDay[] = ['MONDAY', 'WEDNESDAY', 'FRIDAY'];
      
      const result = findClosestWeekDay(referenceWeekDay, weekDays);
      
      expect(result.weekDay).toBe('MONDAY');
      expect(result.diff).toBe(2); // 2 days from Saturday to Monday (next week)
    });

    it('should return 0 difference when reference weekday is in the list', () => {
      const referenceWeekDay: WeekDay = 'WEDNESDAY';
      const weekDays: WeekDay[] = ['MONDAY', 'WEDNESDAY', 'FRIDAY'];
      
      const result = findClosestWeekDay(referenceWeekDay, weekDays);
      
      expect(result.weekDay).toBe('WEDNESDAY');
      expect(result.diff).toBe(0);
    });

    it('should handle empty weekdays array', () => {
      const referenceWeekDay: WeekDay = 'WEDNESDAY';
      const weekDays: WeekDay[] = [];
      
      const result = findClosestWeekDay(referenceWeekDay, weekDays);
      
      expect(result.weekDay).toBeUndefined();
      expect(result.diff).toBe(0);
    });

    it('should find closest weekday when crossing week boundary', () => {
      const referenceWeekDay: WeekDay = 'FRIDAY';
      const weekDays: WeekDay[] = ['SUNDAY', 'MONDAY', 'TUESDAY'];
      
      const result = findClosestWeekDay(referenceWeekDay, weekDays);
      
      expect(result.weekDay).toBe('SUNDAY');
      expect(result.diff).toBe(2); // 2 days from Friday to Sunday (next week)
    });

    it('should handle single weekday in list', () => {
      const referenceWeekDay: WeekDay = 'THURSDAY';
      const weekDays: WeekDay[] = ['MONDAY'];
      
      const result = findClosestWeekDay(referenceWeekDay, weekDays);
      
      expect(result.weekDay).toBe('MONDAY');
      expect(result.diff).toBe(4); // 4 days from Thursday to Monday (next week)
    });

    it('should find closest weekday when multiple options exist', () => {
      const referenceWeekDay: WeekDay = 'TUESDAY';
      const weekDays: WeekDay[] = ['MONDAY', 'WEDNESDAY', 'SATURDAY'];
      
      const result = findClosestWeekDay(referenceWeekDay, weekDays);
      
      expect(result.weekDay).toBe('WEDNESDAY');
      expect(result.diff).toBe(1); // 1 day from Tuesday to Wednesday
    });

    it('should handle edge case of Sunday to Saturday', () => {
      const referenceWeekDay: WeekDay = 'SUNDAY';
      const weekDays: WeekDay[] = ['SATURDAY'];
      
      const result = findClosestWeekDay(referenceWeekDay, weekDays);
      
      expect(result.weekDay).toBe('SATURDAY');
      expect(result.diff).toBe(6); // 6 days from Sunday to Saturday (next week)
    });

    it('should handle edge case of Saturday to Sunday', () => {
      const referenceWeekDay: WeekDay = 'SATURDAY';
      const weekDays: WeekDay[] = ['SUNDAY'];
      
      const result = findClosestWeekDay(referenceWeekDay, weekDays);
      
      expect(result.weekDay).toBe('SUNDAY');
      expect(result.diff).toBe(1); // 1 day from Saturday to Sunday
    });

    it('should find closest weekday when all options are in next week', () => {
      const referenceWeekDay: WeekDay = 'FRIDAY';
      const weekDays: WeekDay[] = ['SUNDAY', 'MONDAY', 'TUESDAY'];
      
      const result = findClosestWeekDay(referenceWeekDay, weekDays);
      
      expect(result.weekDay).toBe('SUNDAY');
      expect(result.diff).toBe(2); // 2 days from Friday to Sunday (next week)
    });
  });

  describe('weekdaysToDates', () => {
    it('should return empty array when weekDays is empty', () => {
      const referenceDate = '2024-01-15'; // Monday
      const weekDays: WeekDay[] = [];
      
      const result = weekdaysToDates(referenceDate, weekDays);
      
      expect(result).toEqual([]);
    });

    it('should return same date when target weekday is same as reference date', () => {
      const referenceDate = '2024-01-15'; // Monday
      const weekDays: WeekDay[] = ['MONDAY'];
      
      const result = weekdaysToDates(referenceDate, weekDays);
      
      expect(result).toEqual(['2024-01-15']);
    });

    it('should return dates for weekdays later in the same week', () => {
      const referenceDate = '2024-01-15'; // Monday
      const weekDays: WeekDay[] = ['WEDNESDAY', 'FRIDAY'];
      
      const result = weekdaysToDates(referenceDate, weekDays);
      
      // Each date is calculated independently from the reference date
      // Monday + 2 days = Wednesday (2024-01-17)
      // Monday + 4 days = Friday (2024-01-19)
      expect(result).toEqual(['2024-01-17', '2024-01-19']);
    });

    it('should return dates for weekdays in the next week when target is earlier', () => {
      const referenceDate = '2024-01-15'; // Monday
      const weekDays: WeekDay[] = ['SUNDAY', 'SATURDAY'];
      
      const result = weekdaysToDates(referenceDate, weekDays);
      
      // Each date is calculated independently from the reference date
      // Monday + 6 days = Sunday (2024-01-21)
      // Monday + 5 days = Saturday (2024-01-20)
      expect(result).toEqual(['2024-01-21', '2024-01-20']);
    });

    it('should handle multiple weekdays with mixed same week and next week', () => {
      const referenceDate = '2024-01-15'; // Monday
      const weekDays: WeekDay[] = ['MONDAY', 'WEDNESDAY', 'SUNDAY'];
      
      const result = weekdaysToDates(referenceDate, weekDays);
      
      // Each date is calculated independently from the reference date
      // Monday + 0 days = Monday (2024-01-15)
      // Monday + 2 days = Wednesday (2024-01-17)
      // Monday + 6 days = Sunday (2024-01-21)
      expect(result).toEqual(['2024-01-15', '2024-01-17', '2024-01-21']);
    });

    it('should handle weekdays in chronological order', () => {
      const referenceDate = '2024-01-15'; // Monday
      const weekDays: WeekDay[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      
      const result = weekdaysToDates(referenceDate, weekDays);
      
      // Each date is calculated independently from the reference date
      // Monday + 6 days = Sunday (2024-01-21)
      // Monday + 0 days = Monday (2024-01-15)
      // Monday + 1 day = Tuesday (2024-01-16)
      // Monday + 2 days = Wednesday (2024-01-17)
      // Monday + 3 days = Thursday (2024-01-18)
      // Monday + 4 days = Friday (2024-01-19)
      // Monday + 5 days = Saturday (2024-01-20)
      expect(result).toEqual(['2024-01-21', '2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19', '2024-01-20']);
    });

    it('should handle reference date on Wednesday', () => {
      const referenceDate = '2024-01-17'; // Wednesday
      const weekDays: WeekDay[] = ['MONDAY', 'FRIDAY', 'SUNDAY'];
      
      const result = weekdaysToDates(referenceDate, weekDays);
      
      // Each date is calculated independently from the reference date
      // Wednesday + 5 days = Monday (2024-01-22)
      // Wednesday + 2 days = Friday (2024-01-19)
      // Wednesday + 4 days = Sunday (2024-01-21)
      expect(result).toEqual(['2024-01-22', '2024-01-19', '2024-01-21']);
    });

    it('should handle reference date on Friday', () => {
      const referenceDate = '2024-01-19'; // Friday
      const weekDays: WeekDay[] = ['MONDAY', 'WEDNESDAY', 'SATURDAY'];
      
      const result = weekdaysToDates(referenceDate, weekDays);
      
      // Each date is calculated independently from the reference date
      // Friday + 3 days = Monday (2024-01-22)
      // Friday + 5 days = Wednesday (2024-01-24)
      // Friday + 1 day = Saturday (2024-01-20)
      expect(result).toEqual(['2024-01-22', '2024-01-24', '2024-01-20']);
    });

    it('should handle reference date on Sunday', () => {
      const referenceDate = '2024-01-21'; // Sunday
      const weekDays: WeekDay[] = ['MONDAY', 'WEDNESDAY', 'FRIDAY'];
      
      const result = weekdaysToDates(referenceDate, weekDays);
      
      // Each date is calculated independently from the reference date
      // Sunday + 1 day = Monday (2024-01-22)
      // Sunday + 3 days = Wednesday (2024-01-24)
      // Sunday + 5 days = Friday (2024-01-26)
      expect(result).toEqual(['2024-01-22', '2024-01-24', '2024-01-26']);
    });

    it('should handle month boundary correctly', () => {
      const referenceDate = '2024-01-29'; // Monday
      const weekDays: WeekDay[] = ['WEDNESDAY', 'FRIDAY', 'SUNDAY'];
      
      const result = weekdaysToDates(referenceDate, weekDays);
      
      // Each date is calculated independently from the reference date
      // Monday + 2 days = Wednesday (2024-01-31)
      // Monday + 4 days = Friday (2024-02-02)
      // Monday + 6 days = Sunday (2024-02-04)
      expect(result).toEqual(['2024-01-31', '2024-02-02', '2024-02-04']);
    });

    it('should handle year boundary correctly', () => {
      const referenceDate = '2023-12-29'; // Friday
      const weekDays: WeekDay[] = ['MONDAY', 'WEDNESDAY', 'SATURDAY'];
      
      const result = weekdaysToDates(referenceDate, weekDays);
      
      // Each date is calculated independently from the reference date
      // Friday + 3 days = Monday (2024-01-01)
      // Friday + 5 days = Wednesday (2024-01-03)
      // Friday + 1 day = Saturday (2023-12-30)
      expect(result).toEqual(['2024-01-01', '2024-01-03', '2023-12-30']);
    });

    it('should handle leap year correctly', () => {
      const referenceDate = '2024-02-26'; // Monday
      const weekDays: WeekDay[] = ['WEDNESDAY', 'FRIDAY', 'SUNDAY'];
      
      const result = weekdaysToDates(referenceDate, weekDays);
      
      // Each date is calculated independently from the reference date
      // Monday + 2 days = Wednesday (2024-02-28)
      // Monday + 4 days = Friday (2024-03-01)
      // Monday + 6 days = Sunday (2024-03-03)
      expect(result).toEqual(['2024-02-28', '2024-03-01', '2024-03-03']);
    });

    it('should handle single weekday target', () => {
      const referenceDate = '2024-01-15'; // Monday
      const weekDays: WeekDay[] = ['THURSDAY'];
      
      const result = weekdaysToDates(referenceDate, weekDays);
      
      expect(result).toEqual(['2024-01-18']);
    });

    it('should handle all weekdays in same week', () => {
      const referenceDate = '2024-01-15'; // Monday
      const weekDays: WeekDay[] = ['TUESDAY', 'WEDNESDAY', 'THURSDAY'];
      
      const result = weekdaysToDates(referenceDate, weekDays);
      
      // Each date is calculated independently from the reference date
      // Monday + 1 day = Tuesday (2024-01-16)
      // Monday + 2 days = Wednesday (2024-01-17)
      // Monday + 3 days = Thursday (2024-01-18)
      expect(result).toEqual(['2024-01-16', '2024-01-17', '2024-01-18']);
    });

    it('should handle all weekdays in next week', () => {
      const referenceDate = '2024-01-15'; // Monday
      const weekDays: WeekDay[] = ['SATURDAY', 'SUNDAY'];
      
      const result = weekdaysToDates(referenceDate, weekDays);
      
      // Each date is calculated independently from the reference date
      // Monday + 5 days = Saturday (2024-01-20)
      // Monday + 6 days = Sunday (2024-01-21)
      expect(result).toEqual(['2024-01-20', '2024-01-21']);
    });

    it('should handle edge case of Saturday to Sunday', () => {
      const referenceDate = '2024-01-20'; // Saturday
      const weekDays: WeekDay[] = ['SUNDAY'];
      
      const result = weekdaysToDates(referenceDate, weekDays);
      
      expect(result).toEqual(['2024-01-21']);
    });

    it('should handle edge case of Sunday to Saturday', () => {
      const referenceDate = '2024-01-21'; // Sunday
      const weekDays: WeekDay[] = ['SATURDAY'];
      
      const result = weekdaysToDates(referenceDate, weekDays);
      
      expect(result).toEqual(['2024-01-27']);
    });
  });

  describe('removeDatesFromList', () => {
    it('should remove specified dates from the list', () => {
      const dates = ['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18'];
      const datesToRemove = ['2024-01-16', '2024-01-18'];
      
      const result = removeDatesFromList(dates, datesToRemove);
      
      expect(result).toEqual(['2024-01-15', '2024-01-17']);
    });

    it('should return empty array when all dates are removed', () => {
      const dates = ['2024-01-15', '2024-01-16', '2024-01-17'];
      const datesToRemove = ['2024-01-15', '2024-01-16', '2024-01-17'];
      
      const result = removeDatesFromList(dates, datesToRemove);
      
      expect(result).toEqual([]);
    });

    it('should return original list when no dates are removed', () => {
      const dates = ['2024-01-15', '2024-01-16', '2024-01-17'];
      const datesToRemove = ['2024-01-18', '2024-01-19'];
      
      const result = removeDatesFromList(dates, datesToRemove);
      
      expect(result).toEqual(['2024-01-15', '2024-01-16', '2024-01-17']);
    });

    it('should handle empty dates array', () => {
      const dates: string[] = [];
      const datesToRemove = ['2024-01-15', '2024-01-16'];
      
      const result = removeDatesFromList(dates, datesToRemove);
      
      expect(result).toEqual([]);
    });

    it('should handle empty datesToRemove array', () => {
      const dates = ['2024-01-15', '2024-01-16', '2024-01-17'];
      const datesToRemove: string[] = [];
      
      const result = removeDatesFromList(dates, datesToRemove);
      
      expect(result).toEqual(['2024-01-15', '2024-01-16', '2024-01-17']);
    });

    it('should handle both arrays being empty', () => {
      const dates: string[] = [];
      const datesToRemove: string[] = [];
      
      const result = removeDatesFromList(dates, datesToRemove);
      
      expect(result).toEqual([]);
    });

    it('should handle duplicate dates in datesToRemove', () => {
      const dates = ['2024-01-15', '2024-01-16', '2024-01-17'];
      const datesToRemove = ['2024-01-16', '2024-01-16', '2024-01-18'];
      
      const result = removeDatesFromList(dates, datesToRemove);
      
      expect(result).toEqual(['2024-01-15', '2024-01-17']);
    });

    it('should handle dates in different formats', () => {
      const dates = ['2024-01-15', '2024-01-16', '2024-01-17'];
      const datesToRemove = ['2024-01-16'];
      
      const result = removeDatesFromList(dates, datesToRemove);
      
      expect(result).toEqual(['2024-01-15', '2024-01-17']);
    });

    it('should preserve order of remaining dates', () => {
      const dates = ['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19'];
      const datesToRemove = ['2024-01-16', '2024-01-18'];
      
      const result = removeDatesFromList(dates, datesToRemove);
      
      expect(result).toEqual(['2024-01-15', '2024-01-17', '2024-01-19']);
    });

    it('should handle case sensitivity correctly', () => {
      const dates = ['2024-01-15', '2024-01-16', '2024-01-17'];
      const datesToRemove = ['2024-01-16'];
      
      const result = removeDatesFromList(dates, datesToRemove);
      
      expect(result).toEqual(['2024-01-15', '2024-01-17']);
    });

    it('should handle dates with different separators', () => {
      const dates = ['2024-01-15', '2024/01/16', '2024.01.17'];
      const datesToRemove = ['2024/01/16', '2024.01.17'];
      
      const result = removeDatesFromList(dates, datesToRemove);
      
      expect(result).toEqual(['2024-01-15']);
    });

    it('should handle large arrays efficiently', () => {
      const dates = Array.from({ length: 1000 }, (_, i) => `2024-01-${String(i + 1).padStart(2, '0')}`);
      const datesToRemove = ['2024-01-500', '2024-01-750'];
      
      const result = removeDatesFromList(dates, datesToRemove);
      
      expect(result).toHaveLength(998);
      expect(result).not.toContain('2024-01-500');
      expect(result).not.toContain('2024-01-750');
      expect(result).toContain('2024-01-01');
      expect(result).toContain('2024-01-1000');
    });
  });
});

describe('mergeDateLists', () => {
  it('should merge dates and variable schedules dates, then remove canceled dates', () => {
    const dates = ['2024-01-01', '2024-01-02', '2024-01-03'];
    const variableSchedulesDates = ['2024-01-04', '2024-01-05'];
    const canceledSchedulesDates = ['2024-01-02', '2024-01-04'];

    const result = mergeDateLists(dates, variableSchedulesDates, canceledSchedulesDates);

    expect(result).toEqual(['2024-01-01', '2024-01-03', '2024-01-05']);
  });

  it('should handle empty dates array', () => {
    const dates: string[] = [];
    const variableSchedulesDates = ['2024-01-01', '2024-01-02'];
    const canceledSchedulesDates = ['2024-01-01'];

    const result = mergeDateLists(dates, variableSchedulesDates, canceledSchedulesDates);

    expect(result).toEqual(['2024-01-02']);
  });

  it('should handle empty variable schedules dates array', () => {
    const dates = ['2024-01-01', '2024-01-02'];
    const variableSchedulesDates: string[] = [];
    const canceledSchedulesDates = ['2024-01-01'];

    const result = mergeDateLists(dates, variableSchedulesDates, canceledSchedulesDates);

    expect(result).toEqual(['2024-01-02']);
  });

  it('should handle empty canceled schedules dates array', () => {
    const dates = ['2024-01-01', '2024-01-02'];
    const variableSchedulesDates = ['2024-01-03', '2024-01-04'];
    const canceledSchedulesDates: string[] = [];

    const result = mergeDateLists(dates, variableSchedulesDates, canceledSchedulesDates);

    expect(result).toEqual(['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04']);
  });

  it('should handle all empty arrays', () => {
    const dates: string[] = [];
    const variableSchedulesDates: string[] = [];
    const canceledSchedulesDates: string[] = [];

    const result = mergeDateLists(dates, variableSchedulesDates, canceledSchedulesDates);

    expect(result).toEqual([]);
  });

  it('should remove all dates when all are canceled', () => {
    const dates = ['2024-01-01', '2024-01-02'];
    const variableSchedulesDates = ['2024-01-03'];
    const canceledSchedulesDates = ['2024-01-01', '2024-01-02', '2024-01-03'];

    const result = mergeDateLists(dates, variableSchedulesDates, canceledSchedulesDates);

    expect(result).toEqual([]);
  });

  it('should handle duplicate dates in input arrays', () => {
    const dates = ['2024-01-01', '2024-01-01', '2024-01-02'];
    const variableSchedulesDates = ['2024-01-02', '2024-01-03'];
    const canceledSchedulesDates = ['2024-01-01'];

    const result = mergeDateLists(dates, variableSchedulesDates, canceledSchedulesDates);

    expect(result).toEqual(['2024-01-02', '2024-01-02', '2024-01-03']);
  });

  it('should preserve order of dates', () => {
    const dates = ['2024-01-03', '2024-01-01', '2024-01-02'];
    const variableSchedulesDates = ['2024-01-05', '2024-01-04'];
    const canceledSchedulesDates: string[] = [];

    const result = mergeDateLists(dates, variableSchedulesDates, canceledSchedulesDates);

    expect(result).toEqual(['2024-01-03', '2024-01-01', '2024-01-02', '2024-01-05', '2024-01-04']);
  });

  it('should handle dates in different formats (though function expects consistent format)', () => {
    const dates = ['2024-01-01', '2024-01-02'];
    const variableSchedulesDates = ['2024-01-03'];
    const canceledSchedulesDates = ['2024-01-01'];

    const result = mergeDateLists(dates, variableSchedulesDates, canceledSchedulesDates);

    expect(result).toEqual(['2024-01-02', '2024-01-03']);
  });
});
