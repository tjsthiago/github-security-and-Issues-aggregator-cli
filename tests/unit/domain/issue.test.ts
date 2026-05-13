import { describe, it, expect } from 'vitest';
import { IssueNumber } from '../../../src/domain/value-objects/IssueNumber';
import { IssueTitle } from '../../../src/domain/value-objects/IssueTitle';
import { IssueUrl } from '../../../src/domain/value-objects/IssueUrl';
import { Issue } from '../../../src/domain/entities/Issue';

describe('IssueNumber', () => {
  it('should create a valid IssueNumber with positive integer', () => {
    const number = IssueNumber.create(42);
    expect(number.getValue()).toBe(42);
  });

  it('should throw when creating with zero', () => {
    expect(() => IssueNumber.create(0)).toThrow('positive integer');
  });

  it('should throw when creating with negative number', () => {
    expect(() => IssueNumber.create(-1)).toThrow('positive integer');
  });

  it('should throw when creating with non-integer', () => {
    expect(() => IssueNumber.create(42.5)).toThrow('positive integer');
  });

  it('should compare two IssueNumbers for equality', () => {
    const num1 = IssueNumber.create(42);
    const num2 = IssueNumber.create(42);
    const num3 = IssueNumber.create(43);

    expect(num1.equals(num2)).toBe(true);
    expect(num1.equals(num3)).toBe(false);
  });

  it('should convert to string', () => {
    const number = IssueNumber.create(42);
    expect(number.toString()).toBe('42');
  });
});

describe('IssueTitle', () => {
  it('should create a valid IssueTitle with non-empty string', () => {
    const title = IssueTitle.create('Fix bug in authentication');
    expect(title.getValue()).toBe('Fix bug in authentication');
  });

  it('should throw when creating with empty string', () => {
    expect(() => IssueTitle.create('')).toThrow('empty');
  });

  it('should throw when creating with whitespace-only string', () => {
    expect(() => IssueTitle.create('   ')).toThrow('empty');
  });

  it('should trim whitespace from title', () => {
    const title = IssueTitle.create('  Fix bug  ');
    expect(title.getValue()).toBe('Fix bug');
  });

  it('should compare two IssueTitles for equality', () => {
    const title1 = IssueTitle.create('Fix bug');
    const title2 = IssueTitle.create('Fix bug');
    const title3 = IssueTitle.create('Add feature');

    expect(title1.equals(title2)).toBe(true);
    expect(title1.equals(title3)).toBe(false);
  });

  it('should convert to string', () => {
    const title = IssueTitle.create('Fix bug');
    expect(title.toString()).toBe('Fix bug');
  });
});

describe('IssueUrl', () => {
  it('should create a valid IssueUrl with github.com URL', () => {
    const url = IssueUrl.create(
      'https://github.com/grupoboticario/repo/issues/42'
    );
    expect(url.getValue()).toBe('https://github.com/grupoboticario/repo/issues/42');
  });

  it('should throw when creating with invalid URL', () => {
    expect(() => IssueUrl.create('not a url')).toThrow('valid URL');
  });

  it('should throw when creating with non-github URL', () => {
    expect(() => IssueUrl.create('https://gitlab.com/repo/issues/42')).toThrow(
      'github.com'
    );
  });

  it('should trim whitespace from URL', () => {
    const url = IssueUrl.create(
      '  https://github.com/grupoboticario/repo/issues/42  '
    );
    expect(url.getValue()).toBe(
      'https://github.com/grupoboticario/repo/issues/42'
    );
  });

  it('should compare two IssueUrls for equality', () => {
    const url1 = IssueUrl.create('https://github.com/grupoboticario/repo/issues/42');
    const url2 = IssueUrl.create('https://github.com/grupoboticario/repo/issues/42');
    const url3 = IssueUrl.create('https://github.com/grupoboticario/repo/issues/43');

    expect(url1.equals(url2)).toBe(true);
    expect(url1.equals(url3)).toBe(false);
  });

  it('should convert to string', () => {
    const url = IssueUrl.create('https://github.com/grupoboticario/repo/issues/42');
    expect(url.toString()).toBe('https://github.com/grupoboticario/repo/issues/42');
  });
});

describe('Issue', () => {
  it('should create a valid Issue with all fields', () => {
    const issue = Issue.create(
      42,
      'Fix authentication bug',
      'https://github.com/grupoboticario/repo/issues/42',
      'This is a serious bug',
      ['critical', 'security'],
      ['alice', 'bob']
    );

    expect(issue.getId().getValue()).toBe(42);
    expect(issue.getTitle().getValue()).toBe('Fix authentication bug');
    expect(issue.getUrl().getValue()).toBe(
      'https://github.com/grupoboticario/repo/issues/42'
    );
    expect(issue.getBody()).toBe('This is a serious bug');
    expect(issue.getLabels()).toEqual(['critical', 'security']);
    expect(issue.getAssignees()).toEqual(['alice', 'bob']);
  });

  it('should create Issue with optional labels and assignees', () => {
    const issue = Issue.create(
      42,
      'Fix bug',
      'https://github.com/grupoboticario/repo/issues/42',
      'Bug description'
    );

    expect(issue.getLabels()).toEqual([]);
    expect(issue.getAssignees()).toEqual([]);
  });

  it('should return immutable copies of labels and assignees', () => {
    const issue = Issue.create(
      42,
      'Fix bug',
      'https://github.com/grupoboticario/repo/issues/42',
      'Description',
      ['label1'],
      ['assignee1']
    );

    const labels = issue.getLabels();
    const assignees = issue.getAssignees();

    labels.push('label2');
    assignees.push('assignee2');

    expect(issue.getLabels()).toEqual(['label1']);
    expect(issue.getAssignees()).toEqual(['assignee1']);
  });

  it('should compare two Issues by identity (number)', () => {
    const issue1 = Issue.create(
      42,
      'Title 1',
      'https://github.com/grupoboticario/repo/issues/42',
      'Body 1'
    );
    const issue2 = Issue.create(
      42,
      'Title 2',
      'https://github.com/grupoboticario/repo/issues/42',
      'Body 2'
    );
    const issue3 = Issue.create(
      43,
      'Title 1',
      'https://github.com/grupoboticario/repo/issues/43',
      'Body 1'
    );

    expect(issue1.equals(issue2)).toBe(true);
    expect(issue1.equals(issue3)).toBe(false);
  });

  it('should throw when creating with invalid number', () => {
    expect(() =>
      Issue.create(0, 'Title', 'https://github.com/grupoboticario/repo/issues/0', 'Body')
    ).toThrow();
  });

  it('should throw when creating with invalid title', () => {
    expect(() =>
      Issue.create(42, '', 'https://github.com/grupoboticario/repo/issues/42', 'Body')
    ).toThrow();
  });

  it('should throw when creating with invalid URL', () => {
    expect(() =>
      Issue.create(42, 'Title', 'not a url', 'Body')
    ).toThrow();
  });
});
