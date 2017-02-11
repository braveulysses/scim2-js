import { StringScanner } from 'strscan';

const OPERATORS = [
  'eq', 'ne', 'co', 'sw', 'ew', 'pr', 'gt', 'ge', 'lt', 'le'
];

/*
 * A simple SCIM 2 filter parser. It currently does not support filters
 * containing multiple expressions (i.e., filters with 'and' or 'or').
 */
class Filter {
  static _filterExpression(scanner) {
    const left = Filter._groupedExpression(scanner);
    scanner.skip(/\s+/);
    const operator = scanner.scan(new RegExp(OPERATORS.join('|')));
    if (operator) {
      if (operator === 'pr') {
        return {
          operator: operator,
          attrExp: left,
          valuePath: null
        };
      }
      return {
        operator: operator,
        attrExp: left,
        valuePath: Filter._filterExpression(scanner)
      };
    } else {
      return left;
    }
  }

  static _groupedExpression(scanner) {
    scanner.skip(/\s+/);
    if (scanner.skip(/\(/)) {
      const match = scanner.scanUntil(/\)/);
      if (match) {
        return match.slice(0, -1);
      }
    } else {
      return Filter._term(scanner);
    }
  }

  static _term(scanner) {
    const term = scanner.scan(/(\w|\.|:)+/);
    if (term) {
      return term;
    } else {
      const quotedString = Filter._quotedString(scanner);
      if (quotedString) {
        return quotedString;
      } else {
        return null;
      }
    }
  }

  static _quotedString(scanner) {
    const start = scanner.getPosition();
    if (scanner.scan(/"/)) {
      const match = scanner.scanUntil(/"/);
      if (match) {
        return match.slice(0, -1);
      } else {
        throw new Error(`unterminated quoted string (start: ${start})`);
      }
    }
  }

  static parse(filter) {
    const scanner = new StringScanner(filter);
    return Filter._filterExpression(scanner);
  }
}

export default Filter;