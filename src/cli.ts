#!/usr/bin/env node

import * as dotenv from 'dotenv';
import { loadEnvironment } from './infrastructure/config/env.js';
import { GitHubHttpClient } from './infrastructure/http/GitHubHttpClient.js';
import { GitHubIssueRepository } from './infrastructure/repositories/GitHubIssueRepository.js';
import { GitHubDependabotAlertRepository } from './infrastructure/repositories/GitHubDependabotAlertRepository.js';
import { FetchIssuesUseCase } from './application/use-cases/FetchIssuesUseCase.js';
import { FetchDependabotAlertsUseCase } from './application/use-cases/FetchDependabotAlertsUseCase.js';
import { AggregateIssuesToMarkdownUseCase } from './application/use-cases/AggregateIssuesToMarkdownUseCase.js';
import { AggregateAlertsToMarkdownUseCase } from './application/use-cases/AggregateAlertsToMarkdownUseCase.js';
import { FileReportWriter } from './infrastructure/FileReportWriter.js';
import { AppError } from './shared/errors/AppError.js';

// Load .env file
dotenv.config();

const command = process.argv[2];

async function main(): Promise<void> {
  try {
    // Check command first before loading environment
    if (!command || ![
      'fetch-issues',
      'fetch-dependabot-alerts',
      'aggregate-issues',
      'aggregate-alerts'
    ].includes(command)) {
      printUsage();
      process.exit(command ? 1 : 0);
    }

    // Load and validate environment
    const env = loadEnvironment();

    // Wire dependencies
    const httpClient = new GitHubHttpClient({ token: env.GITHUB_TOKEN });
    const issueRepository = new GitHubIssueRepository(
      httpClient,
      env.GITHUB_OWNER,
      env.GITHUB_REPO
    );
    const alertRepository = new GitHubDependabotAlertRepository(
      httpClient,
      env.GITHUB_OWNER,
      env.GITHUB_REPO
    );

    // Dispatch to command
    switch (command) {
      case 'fetch-issues': {
        const useCase = new FetchIssuesUseCase(issueRepository);
        const issues = await useCase.execute();
        console.log(`Found ${issues.length} open issues:`);
        issues.forEach((issue) => {
          console.log(`  #${issue.getId().getValue()} - ${issue.getTitle().getValue()}`);
        });
        break;
      }

      case 'fetch-dependabot-alerts': {
        const useCase = new FetchDependabotAlertsUseCase(alertRepository);
        const alerts = await useCase.execute();
        console.log(`Found ${alerts.length} active Dependabot alerts:`);
        alerts.forEach((alert) => {
          console.log(
            `  #${alert.getNumber().getValue()} - ${alert.getDependencyName()} (${alert.getSeverity().getValue()})`
          );
        });
        break;
      }

      case 'aggregate-issues': {
        const useCase = new AggregateIssuesToMarkdownUseCase(issueRepository);
        const markdown = await useCase.execute();
        const writer = new FileReportWriter();
        const outputPath = 'issues-report.md';
        await writer.write(outputPath, markdown);
        console.log(`✓ Issues report written to ${outputPath}`);
        break;
      }

      case 'aggregate-alerts': {
        const useCase = new AggregateAlertsToMarkdownUseCase(alertRepository);
        const markdown = await useCase.execute();
        const writer = new FileReportWriter();
        const outputPath = 'dependabot-report.md';
        await writer.write(outputPath, markdown);
        console.log(`✓ Dependabot alerts report written to ${outputPath}`);
        break;
      }
    }
  } catch (error) {
    if (error instanceof AppError) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    } else if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    } else {
      console.error('An unknown error occurred');
      process.exit(1);
    }
  }
}

function printUsage(): void {
  console.log(`
GitHub Issues & Dependabot Aggregator

Usage:
  node dist/cli.js <command>

Commands:
  fetch-issues                  Fetch and list all open issues
  fetch-dependabot-alerts       Fetch and list all active Dependabot alerts
  aggregate-issues              Generate issues report to issues-report.md
  aggregate-alerts              Generate Dependabot alerts report to dependabot-report.md

Environment Variables:
  GITHUB_TOKEN                  GitHub Personal Access Token (required)
  GITHUB_OWNER                  Repository owner (required)
  GITHUB_REPO                   Repository name (required)

For more information, see .env.example
  `);
}

main();
