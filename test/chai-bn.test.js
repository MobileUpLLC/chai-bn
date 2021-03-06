const BN = require('bn.js');
const chai = require('chai');
const expect = chai.expect;

chai.should();
chai.use(require('../chai-bn')(BN));
chai.config.includeStack = true;

describe('chai-bn', function () {
  const actualMatchInvalidError = /to be an instance of BN/;
  const expectedMatchInvalidError = /to be an instance of BN or string/;

  const testerGenerator = function (functionNames) {
    return [
      function (a, b) {
        functionNames.forEach(functionName => {
          a.should.be.a.bignumber.that[functionName](b);
          expect(a).to.be.a.bignumber.that[functionName](b);
        });
      },

      function (a, b) {
        functionNames.forEach(functionName => {
          a.should.not.be.a.bignumber.that[functionName](b);
          expect(a).to.not.be.a.bignumber.that[functionName](b);
        });
      }
    ];
  };

  const argTypeChecker = function (tester, notTester) {
    it('fails when first argument is not BN', function () {
      const testCases = [
        ['10', '10'],
        [10, '10'],
        ['-10', '-10'],
        [-10, '-10'],
        ['123456789123456789123456789', '123456789123456789123456789'],
        [123456789123456789123456789, '123456789123456789123456789'],
        ['-123456789123456789123456789', '-123456789123456789123456789'],
        [-123456789123456789123456789, '-123456789123456789123456789'],
      ];

      testCases.forEach(([a, b]) => {
        (() => tester(a, b)).should.throw(actualMatchInvalidError);
        (() => notTester(a, b)).should.throw(actualMatchInvalidError);
      });
    });

    it('fails when second argument is not BN or string', function () {
      const testCases = [
        [new BN('10'), 10],
        [new BN('-10'), -10],
        [new BN('123456789123456789123456789'), 123456789123456789123456789],
        [new BN('-123456789123456789123456789'), -123456789123456789123456789],
      ];

      testCases.forEach(([a, b]) => {
        (() => tester(a, b)).should.throw(expectedMatchInvalidError);
        (() => notTester(a, b)).should.throw(expectedMatchInvalidError);
      });
    });
  };

  describe('equal/equals/eq', function () {
    const [tester, notTester] = testerGenerator(['equal', 'equals', 'eq']);

    it('asserts equality', function () {
      const testCases = [
        [new BN('10'), '10'],
        [new BN('10'), new BN('10')],

        [new BN('-10'), '-10'],
        [new BN('-10'), new BN('-10')],

        [new BN('123456789123456789123456789'), '123456789123456789123456789'],
        [new BN('123456789123456789123456789'), new BN('123456789123456789123456789')],

        [new BN('-123456789123456789123456789'), '-123456789123456789123456789'],
        [new BN('-123456789123456789123456789'), new BN('-123456789123456789123456789')],
      ];

      testCases.forEach(([a, b]) => {
        tester(a, b);
      });
    });

    it('asserts inequality', function () {
      const testCases = [
        [new BN('10'), '9'],
        [new BN('10'), new BN('9')],

        [new BN('-10'), '-9'],
        [new BN('-10'), new BN('-9')],

        [new BN('123456789123456789123456789'), '123456789123456789123456788'],
        [new BN('123456789123456789123456789'), new BN('123456789123456789123456788')],

        [new BN('-123456789123456789123456789'), '-123456789123456789123456788'],
        [new BN('-123456789123456789123456789'), new BN('-123456789123456789123456788')],
      ];

      testCases.forEach(([a, b]) => {
        notTester(a, b);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('above/gt/greaterThan', function () {
    const [tester, notTester] = testerGenerator(['above', 'gt', 'greaterThan']);

    it('asserts aboveness', function () {
      const testCases = [
        [new BN('15'), '10'],
        [new BN('15'), new BN('10')],

        [new BN('15'), '-10'],
        [new BN('15'), new BN('-10')],

        [new BN('-10'), '-15'],
        [new BN('-10'), new BN('-15')],

        [new BN('123456789123456789'), '123456789123'],
        [new BN('123456789123456789'), new BN('123456789123')],

        [new BN('123456789123456789'), '-123456789123'],
        [new BN('123456789123456789'), new BN('-123456789123')],

        [new BN('-123456789123'), '-123456789123456789'],
        [new BN('-123456789123'), new BN('-123456789123456789')],
      ];

      testCases.forEach(([a, b]) => {
        tester(a, b);
      });
    });

    it('asserts unaboveness', function () {
      const testCases = [
        [new BN('10'), '15'],
        [new BN('10'), new BN('15')],

        [new BN('-10'), '15'],
        [new BN('-10'), new BN('15')],

        [new BN('-15'), '-10'],
        [new BN('-15'), new BN('-10')],

        [new BN('15'), '15'],
        [new BN('15'), new BN('15')],

        [new BN('-15'), '-15'],
        [new BN('-15'), new BN('-15')],

        [new BN('123456789123'), '123456789123456789'],
        [new BN('123456789123'), new BN('123456789123456789')],

        [new BN('-123456789123'), '123456789123456789'],
        [new BN('-123456789123'), new BN('123456789123456789')],

        [new BN('-123456789123456789'), '-123456789123'],
        [new BN('-123456789123456789'), new BN('-123456789123')],
      ];

      testCases.forEach(([a, b]) => {
        notTester(a, b);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('least/gte', function () {
    const [tester, notTester] = testerGenerator(['gte']);

    it('asserts at least', function () {
      const testCases = [
        [new BN('15'), '10'],
        [new BN('15'), new BN('10')],

        [new BN('15'), '-10'],
        [new BN('15'), new BN('-10')],

        [new BN('-10'), '-15'],
        [new BN('-10'), new BN('-15')],

        [new BN('15'), '15'],
        [new BN('15'), new BN('15')],

        [new BN('-15'), '-15'],
        [new BN('-15'), new BN('-15')],

        [new BN('123456789123456789'), '123456789123'],
        [new BN('123456789123456789'), new BN('123456789123')],

        [new BN('123456789123456789'), '-123456789123'],
        [new BN('123456789123456789'), new BN('-123456789123')],

        [new BN('-123456789123'), '-123456789123456789'],
        [new BN('-123456789123'), new BN('-123456789123456789')],

        [new BN('123456789123456789'), '123456789123456789'],
        [new BN('123456789123456789'), new BN('123456789123456789')],

        [new BN('-123456789123456789'), '-123456789123456789'],
        [new BN('-123456789123456789'), new BN('-123456789123456789')],
      ];

      testCases.forEach(([a, b]) => {
        tester(a, b);
        a.should.be.a.bignumber.that.is.at.least(b);
        expect(a).to.be.a.bignumber.that.is.at.least(b);
      });
    });

    it('asserts not at least', function () {
      const testCases = [
        [new BN('10'), '15'],
        [new BN('10'), new BN('15')],

        [new BN('-10'), '15'],
        [new BN('-10'), new BN('15')],

        [new BN('-15'), '-10'],
        [new BN('-15'), new BN('-10')],

        [new BN('123456789123'), '123456789123456789'],
        [new BN('123456789123'), new BN('123456789123456789')],

        [new BN('-123456789123'), '123456789123456789'],
        [new BN('-123456789123'), new BN('123456789123456789')],

        [new BN('-123456789123456789'), '-123456789123'],
        [new BN('-123456789123456789'), new BN('-123456789123')],
      ];

      testCases.forEach(([a, b]) => {
        notTester(a, b);
        a.should.not.be.a.bignumber.that.is.at.least(b);
        expect(a).to.not.be.a.bignumber.that.is.at.least(b);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('below/lt/lessThan', function () {
    const [tester, notTester] = testerGenerator(['below', 'lt', 'lessThan']);

    it('asserts belowness', function () {
      const testCases = [
        [new BN('10'), '15'],
        [new BN('10'), new BN('15')],

        [new BN('-10'), '15'],
        [new BN('-10'), new BN('15')],

        [new BN('-15'), '-10'],
        [new BN('-15'), new BN('-10')],

        [new BN('123456789123'), '123456789123456789'],
        [new BN('123456789123'), new BN('123456789123456789')],

        [new BN('-123456789123'), '123456789123456789'],
        [new BN('-123456789123'), new BN('123456789123456789')],

        [new BN('-123456789123456789'), '-123456789123'],
        [new BN('-123456789123456789'), new BN('-123456789123')],
      ];

      testCases.forEach(([a, b]) => {
        tester(a, b);
      });
    });

    it('asserts unbelowness', function () {
      const testCases = [
        [new BN('15'), '10'],
        [new BN('15'), new BN('10')],

        [new BN('15'), '-10'],
        [new BN('15'), new BN('-10')],

        [new BN('-10'), '-15'],
        [new BN('-10'), new BN('-15')],

        [new BN('15'), '15'],
        [new BN('15'), new BN('15')],

        [new BN('-15'), '-15'],
        [new BN('-15'), new BN('-15')],

        [new BN('123456789123456789'), '123456789123'],
        [new BN('123456789123456789'), new BN('123456789123')],

        [new BN('123456789123456789'), '-123456789123'],
        [new BN('123456789123456789'), new BN('-123456789123')],

        [new BN('-123456789123'), '-123456789123456789'],
        [new BN('-123456789123'), new BN('-123456789123456789')],
      ];

      testCases.forEach(([a, b]) => {
        notTester(a, b);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('most/lte', function () {
    const [tester, notTester] = testerGenerator(['lte']);

    it('asserts at most', function () {
      const testCases = [
        [new BN('10'), '15'],
        [new BN('10'), new BN('15')],

        [new BN('-10'), '15'],
        [new BN('-10'), new BN('15')],

        [new BN('-15'), '-10'],
        [new BN('-15'), new BN('-10')],

        [new BN('15'), '15'],
        [new BN('15'), new BN('15')],

        [new BN('-15'), '-15'],
        [new BN('-15'), new BN('-15')],

        [new BN('123456789123'), '123456789123456789'],
        [new BN('123456789123'), new BN('123456789123456789')],

        [new BN('-123456789123'), '123456789123456789'],
        [new BN('-123456789123'), new BN('123456789123456789')],

        [new BN('-123456789123456789'), '-123456789123'],
        [new BN('-123456789123456789'), new BN('-123456789123')],

        [new BN('123456789123456789'), '123456789123456789'],
        [new BN('123456789123456789'), new BN('123456789123456789')],

        [new BN('-123456789123456789'), '-123456789123456789'],
        [new BN('-123456789123456789'), new BN('-123456789123456789')],
      ];

      testCases.forEach(([a, b]) => {
        tester(a, b);
        a.should.be.a.bignumber.that.is.at.most(b);
        expect(a).to.be.a.bignumber.that.is.at.most(b);
      });
    });

    it('asserts not at most', function () {
      const testCases = [
        [new BN('15'), '10'],
        [new BN('15'), new BN('10')],

        [new BN('15'), '-10'],
        [new BN('15'), new BN('-10')],

        [new BN('-10'), '-15'],
        [new BN('-10'), new BN('-15')],

        [new BN('123456789123456789'), '123456789123'],
        [new BN('123456789123456789'), new BN('123456789123')],

        [new BN('123456789123456789'), '-123456789123'],
        [new BN('123456789123456789'), new BN('-123456789123')],

        [new BN('-123456789123'), '-123456789123456789'],
        [new BN('-123456789123'), new BN('-123456789123456789')],
      ];

      testCases.forEach(([a, b]) => {
        notTester(a, b);
        a.should.not.be.a.bignumber.at.most(b);
        expect(a).to.not.be.a.bignumber.at.most(b);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('closeTo', function () {
    const tester = function (a, b, delta) {
      a.should.be.a.bignumber.closeTo(b, delta);
      expect(a).to.be.a.bignumber.closeTo(b, delta);
    };

    const notTester = function (a, b, delta) {
      a.should.be.a.bignumber.not.closeTo(b, delta);
      expect(a).to.be.a.bignumber.not.closeTo(b, delta);
    };

    it('asserts closeness', function () {
      const testCases = [
        [new BN('15'), '15', '0'],
        [new BN('15'), '10', '5'],
        [new BN('15'), '20', '5'],
        [new BN('-15'), '-15', '0'],
        [new BN('-15'), '-10', '5'],
        [new BN('-15'), '-20', '5'],
        [new BN('123456789123456789'), '123456789123456789', '0'],
        [new BN('123456789123456789'), '123456789123456780', '9'],
        [new BN('123456789123456789'), '123456789123456798', '9'],
        [new BN('-123456789123456789'), '-123456789123456789', '0'],
        [new BN('-123456789123456789'), '-123456789123456780', '9'],
        [new BN('-123456789123456789'), '-123456789123456798', '9'],
      ];

      testCases.forEach(([a, b, delta]) => {
        tester(a, b, delta);
        (() => notTester(a, b, delta)).should.throw;
      });
    });

    it('asserts not closeness', function () {
      const testCases = [
        [new BN('15'), '14', '0'],
        [new BN('15'), '9', '5'],
        [new BN('15'), '21', '5'],
        [new BN('-15'), '-16', '0'],
        [new BN('-15'), '-9', '5'],
        [new BN('-15'), '-21', '5'],
        [new BN('123456789123456789'), '123456789123456788', '0'],
        [new BN('123456789123456789'), '123456789123456779', '9'],
        [new BN('123456789123456789'), '123456789123456799', '9'],
        [new BN('-123456789123456789'), '-123456789123456788', '0'],
        [new BN('-123456789123456789'), '-123456789123456779', '9'],
        [new BN('-123456789123456789'), '-123456789123456799', '9'],
      ];

      testCases.forEach(([a, b, delta]) => {
        notTester(a, b, delta);
        (() => tester(a, b, delta)).should.throw;
      });
    });
  });

  describe('negative', function () {
    const tester = function (a) {
      a.should.be.a.bignumber.that.is.negative;
      expect(a).to.be.a.bignumber.that.is.negative;
    };

    const notTester = function (a) {
      a.should.not.be.a.bignumber.that.is.negative;
      expect(a).to.not.be.a.bignumber.that.is.negative;
    };

    it('asserts negativity', function () {
      const testCases = [
        new BN('-1'),
        new BN('-1234856789123456789'),
      ];

      testCases.forEach((a) => {
        tester(a);
      });
    });

    it('asserts unnegativity', function () {
      const testCases = [
        new BN('0'),
        new BN('1'),
        new BN('1234856789123456789'),
      ];

      testCases.forEach((a) => {
        notTester(a);
      });
    });

    it('fails when argument is not BN', function () {
      const testCases = [
        '-5',
        -5,
        '0',
        0,
        '5',
        5,
      ];

      testCases.forEach((a) => {
        (() => tester(a)).should.throw(actualMatchInvalidError);
        (() => notTester(a)).should.throw(actualMatchInvalidError);
      });
    });
  });

  describe('zero', function () {
    const tester = function (a) {
      a.should.be.a.bignumber.that.is.zero;
      expect(a).to.be.a.bignumber.that.is.zero;
    };

    const notTester = function (a) {
      a.should.not.be.a.bignumber.that.is.zero;
      expect(a).to.not.be.a.bignumber.that.is.zero;
    };

    it('asserts zeroness', function () {
      const testCases = [
        new BN('0'),
      ];

      testCases.forEach((a) => {
        tester(a);
      });
    });

    it('asserts unzeroness', function () {
      const testCases = [
        new BN('1'),
        new BN('-1'),
        new BN('123456789123456789'),
        new BN('-123456789123456789'),
      ];

      testCases.forEach((a) => {
        notTester(a);
      });
    });

    it('fails when argument is not BN', function () {
      const testCases = [
        '-5',
        -5,
        '0',
        0,
        '5',
        5,
      ];

      testCases.forEach((a) => {
        (() => tester(a)).should.throw(actualMatchInvalidError);
        (() => notTester(a)).should.throw(actualMatchInvalidError);
      });
    });
  });
});
