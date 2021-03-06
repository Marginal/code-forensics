/*global require_src*/
var TimePeriodBuilder = require_src('models/time_interval/builder'),
    CFValidationError = require_src('models/validation_error');

describe('TimePeriodBuilder', function() {
  beforeEach(function() {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2015, 8, 23));
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  describe('validation', function() {
    it('throws an error if the from date is invalid', function() {
      expect(function() {
        new TimePeriodBuilder('DD-MM-YYYY')
        .from('15-14-2015')
        .to('13-02-2014')
        .build();
      }).toThrowError(CFValidationError);
    });

    it('throws an error if the to date is invalid', function() {
      expect(function() {
        new TimePeriodBuilder('DD-MM-YYYY')
        .from('15-04-2015')
        .to('32-05-2014')
        .build();
      }).toThrowError(CFValidationError);
    });

    it('throws an error if the to date is before than the from date', function() {
      expect(function() {
        new TimePeriodBuilder('DD-MM-YYYY')
        .from('15-04-2015')
        .to('13-02-2014')
        .build();
      }).toThrowError(CFValidationError);
    });
  });

  describe('with no start and end date given', function() {
    it('returns an array of one time period of one day', function() {
      var periods = new TimePeriodBuilder('DD-MM-YYYY')
        .split('eom')
        .build();

      expect(periods.length).toEqual(1);
      expect(periods[0].startDate.toISOString()).toEqual('2015-09-22T14:00:00.000Z');
      expect(periods[0].endDate.toISOString()).toEqual('2015-09-23T13:59:59.999Z');
      expect(periods[0].toString()).toEqual('23-09-2015_23-09-2015');
    });
  });

  describe('with no end date given', function() {
    it('returns an array of time periods ending with the current date', function() {
      var periods = new TimePeriodBuilder('DD-MM-YYYY')
        .from('15-04-2015')
        .split('eom')
        .build();

      expect(periods.length).toEqual(6);
      expect(periods[0].toString()).toEqual('15-04-2015_30-04-2015');
      expect(periods[1].toString()).toEqual('01-05-2015_31-05-2015');
      expect(periods[2].toString()).toEqual('01-06-2015_30-06-2015');
      expect(periods[3].toString()).toEqual('01-07-2015_31-07-2015');
      expect(periods[4].toString()).toEqual('01-08-2015_31-08-2015');
      expect(periods[5].toString()).toEqual('01-09-2015_23-09-2015');
    });
  });

  describe('with no time split given', function() {
    it('returns an array of one time period', function() {
      var periods = new TimePeriodBuilder('DD-MM-YYYY')
        .from('15-04-2015')
        .to('19-05-2015')
        .build();

      expect(periods.length).toEqual(1);
      expect(periods[0].startDate.toISOString()).toEqual('2015-04-14T14:00:00.000Z');
      expect(periods[0].endDate.toISOString()).toEqual('2015-05-19T13:59:59.999Z');
      expect(periods[0].toString()).toEqual('15-04-2015_19-05-2015');
    });
  });

  describe('with all parameters given', function() {
    it('returns an array of time periods', function() {
      var periods = new TimePeriodBuilder('DD-MM-YYYY')
        .from('15-04-2015')
        .to('18-05-2015')
        .split('2w')
        .build();

      expect(periods.length).toEqual(3);
      expect(periods[0].startDate.toISOString()).toEqual('2015-04-14T14:00:00.000Z');
      expect(periods[0].toString()).toEqual('15-04-2015_28-04-2015');
      expect(periods[1].toString()).toEqual('29-04-2015_12-05-2015');
      expect(periods[2].toString()).toEqual('13-05-2015_18-05-2015');
      expect(periods[2].endDate.toISOString()).toEqual('2015-05-18T13:59:59.999Z');
    });
  });
});
