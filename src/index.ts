#!/usr/bin/env node
import { Command } from 'commander';
import { createCommand } from './modules/create.js';

const program = new Command();

program
  .name('boilerplate')
  .description('Create a Next.js boilerplate with auth, RBAC, and MySQL')
  .version('0.1.0');

program.addCommand(createCommand);

program.parseAsync(process.argv).catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});


