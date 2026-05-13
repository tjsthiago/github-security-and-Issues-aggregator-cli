import { describe, it, expect } from 'vitest';
import { AlertNumber } from '../../../src/domain/value-objects/AlertNumber';
import { Severity } from '../../../src/domain/value-objects/Severity';
import { CveId } from '../../../src/domain/value-objects/CveId';
import { DependabotAlert } from '../../../src/domain/entities/DependabotAlert';

describe('AlertNumber', () => {
  it('should create a valid AlertNumber with positive integer', () => {
    const number = AlertNumber.create(123);
    expect(number.getValue()).toBe(123);
  });

  it('should throw when creating with zero', () => {
    expect(() => AlertNumber.create(0)).toThrow('positive integer');
  });

  it('should throw when creating with negative number', () => {
    expect(() => AlertNumber.create(-1)).toThrow('positive integer');
  });

  it('should throw when creating with non-integer', () => {
    expect(() => AlertNumber.create(123.5)).toThrow('positive integer');
  });

  it('should compare two AlertNumbers for equality', () => {
    const num1 = AlertNumber.create(123);
    const num2 = AlertNumber.create(123);
    const num3 = AlertNumber.create(124);

    expect(num1.equals(num2)).toBe(true);
    expect(num1.equals(num3)).toBe(false);
  });

  it('should convert to string', () => {
    const number = AlertNumber.create(123);
    expect(number.toString()).toBe('123');
  });
});

describe('Severity', () => {
  it('should create Severity with valid values', () => {
    const severities = ['critical', 'high', 'medium', 'low'];
    severities.forEach((sev) => {
      const severity = Severity.create(sev);
      expect(severity.getValue()).toBe(sev);
    });
  });

  it('should normalize to lowercase', () => {
    const severity = Severity.create('CRITICAL');
    expect(severity.getValue()).toBe('critical');
  });

  it('should throw with invalid severity', () => {
    expect(() => Severity.create('unknown')).toThrow('Severity must be one of');
  });

  it('should compare two Severities for equality', () => {
    const sev1 = Severity.create('critical');
    const sev2 = Severity.create('CRITICAL');
    const sev3 = Severity.create('high');

    expect(sev1.equals(sev2)).toBe(true);
    expect(sev1.equals(sev3)).toBe(false);
  });

  it('should convert to string', () => {
    const severity = Severity.create('critical');
    expect(severity.toString()).toBe('critical');
  });
});

describe('CveId', () => {
  it('should create CveId with valid CVE format', () => {
    const cveId = CveId.create('CVE-2024-12345');
    expect(cveId.getValue()).toBe('CVE-2024-12345');
    expect(cveId.hasValue()).toBe(true);
  });

  it('should create CveId with no value when undefined', () => {
    const cveId = CveId.create();
    expect(cveId.getValue()).toBeNull();
    expect(cveId.hasValue()).toBe(false);
  });

  it('should create CveId with no value when empty string', () => {
    const cveId = CveId.create('');
    expect(cveId.getValue()).toBeNull();
    expect(cveId.hasValue()).toBe(false);
  });

  it('should create CveId with no value when whitespace only', () => {
    const cveId = CveId.create('   ');
    expect(cveId.getValue()).toBeNull();
    expect(cveId.hasValue()).toBe(false);
  });

  it('should normalize to uppercase', () => {
    const cveId = CveId.create('cve-2024-12345');
    expect(cveId.getValue()).toBe('CVE-2024-12345');
  });

  it('should throw with invalid CVE format', () => {
    expect(() => CveId.create('not-a-cve')).toThrow('Invalid CVE format');
    expect(() => CveId.create('CVE-24-123')).toThrow('Invalid CVE format');
  });

  it('should compare two CveIds for equality', () => {
    const cve1 = CveId.create('CVE-2024-12345');
    const cve2 = CveId.create('cve-2024-12345');
    const cve3 = CveId.create('CVE-2024-54321');

    expect(cve1.equals(cve2)).toBe(true);
    expect(cve1.equals(cve3)).toBe(false);
  });

  it('should convert to string', () => {
    const cveId = CveId.create('CVE-2024-12345');
    expect(cveId.toString()).toBe('CVE-2024-12345');
  });

  it('should convert to N/A when no value', () => {
    const cveId = CveId.create();
    expect(cveId.toString()).toBe('N/A');
  });
});

describe('DependabotAlert', () => {
  it('should create a valid DependabotAlert with all fields', () => {
    const alert = DependabotAlert.create(
      123,
      '@angular/core',
      '<13.0.0',
      '13.0.0',
      'critical',
      'CVE-2024-12345',
      'https://github.com/advisories/GHSA-xxxx-yyyy-zzzz',
      'Angular contains a vulnerability in core'
    );

    expect(alert.getNumber().getValue()).toBe(123);
    expect(alert.getDependencyName()).toBe('@angular/core');
    expect(alert.getVulnerableVersionRange()).toBe('<13.0.0');
    expect(alert.getPatchedVersion()).toBe('13.0.0');
    expect(alert.getSeverity().getValue()).toBe('critical');
    expect(alert.getCveId().getValue()).toBe('CVE-2024-12345');
    expect(alert.getGhsaUrl()).toBe('https://github.com/advisories/GHSA-xxxx-yyyy-zzzz');
    expect(alert.getSummary()).toBe('Angular contains a vulnerability in core');
  });

  it('should create DependabotAlert with optional CVE', () => {
    const alert = DependabotAlert.create(
      123,
      '@angular/core',
      '<13.0.0',
      '13.0.0',
      'high',
      undefined,
      'https://github.com/advisories/GHSA-xxxx-yyyy-zzzz',
      'Angular vulnerability'
    );

    expect(alert.getCveId().hasValue()).toBe(false);
  });

  it('should compare two DependabotAlerts by identity (number)', () => {
    const alert1 = DependabotAlert.create(
      123,
      '@angular/core',
      '<13.0.0',
      '13.0.0',
      'critical',
      'CVE-2024-12345',
      'https://github.com/advisories/GHSA-xxxx-yyyy-zzzz',
      'Summary 1'
    );
    const alert2 = DependabotAlert.create(
      123,
      '@react/core',
      '<18.0.0',
      '18.0.0',
      'high',
      'CVE-2024-54321',
      'https://github.com/advisories/GHSA-xxxx-yyyy-zzzz',
      'Summary 2'
    );
    const alert3 = DependabotAlert.create(
      124,
      '@angular/core',
      '<13.0.0',
      '13.0.0',
      'critical',
      'CVE-2024-12345',
      'https://github.com/advisories/GHSA-xxxx-yyyy-zzzz',
      'Summary 1'
    );

    expect(alert1.equals(alert2)).toBe(true);
    expect(alert1.equals(alert3)).toBe(false);
  });

  it('should throw when creating with invalid number', () => {
    expect(() =>
      DependabotAlert.create(
        0,
        '@angular/core',
        '<13.0.0',
        '13.0.0',
        'critical',
        'CVE-2024-12345',
        'https://github.com/advisories/GHSA-xxxx-yyyy-zzzz',
        'Summary'
      )
    ).toThrow();
  });

  it('should throw when creating with invalid severity', () => {
    expect(() =>
      DependabotAlert.create(
        123,
        '@angular/core',
        '<13.0.0',
        '13.0.0',
        'unknown',
        'CVE-2024-12345',
        'https://github.com/advisories/GHSA-xxxx-yyyy-zzzz',
        'Summary'
      )
    ).toThrow();
  });

  it('should throw when creating with invalid CVE', () => {
    expect(() =>
      DependabotAlert.create(
        123,
        '@angular/core',
        '<13.0.0',
        '13.0.0',
        'critical',
        'not-a-cve',
        'https://github.com/advisories/GHSA-xxxx-yyyy-zzzz',
        'Summary'
      )
    ).toThrow();
  });
});
