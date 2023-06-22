#!/usr/bin/env node
import { Command } from "commander"
import { cli } from "substreams-sink";
import { action, DEFAULT_ADDRESS, DEFAULT_PORT, DEFAULT_SCRAPE_INTERVAL, DEFAULT_CSV_ROOT, DEFAULT_FOLDER_GRANULAR, DEFAULT_FILE_GRANULAR } from "../index"
import { actionExportCsv, actionImportCsv } from "../src/csv"
import pkg from "../package.json";
import { DEFAULT_COLLECT_DEFAULT_METRICS, handleLabels } from "substreams-sink-prometheus";

const program = cli.program(pkg);
cli.run(program, pkg)
    .option('-p --port <int>', 'Listens on port number.', String(DEFAULT_PORT))
    .option('-a --address <string>', 'VictoriaMetrics address to connect.', DEFAULT_ADDRESS)
    .option('-i --scrape-interval <int>', 'Scrape Interval', String(DEFAULT_SCRAPE_INTERVAL))
    .option('-l --labels [...string]', "To apply generic labels to all default metrics (ex: --labels foo=bar)", handleLabels, {})
    .option('--collect-default-metrics <boolean>', "Collect default metrics", DEFAULT_COLLECT_DEFAULT_METRICS)
    .action(action)

const cmdCsv = program.command("csv")
// exportCSV
cmdCsv.addCommand(cli.run(program, pkg).name("export")
    .description("Export CSV")
    .option('-i --scrape-interval <int>', 'Scrape Interval', String(DEFAULT_SCRAPE_INTERVAL))
    .option('--csv-root <string>', 'CSV root', String(DEFAULT_CSV_ROOT))
    .option('--folder-granular <int>', `folder granular (default: ${DEFAULT_FOLDER_GRANULAR})`, String(DEFAULT_FOLDER_GRANULAR))
    .option('--file-granular <int>', `file granular (default: ${DEFAULT_FILE_GRANULAR})`, String(DEFAULT_FILE_GRANULAR))
    .action(actionExportCsv))

// importCSV
cmdCsv.command("import")
    .description("Import csv")
    .option('-p --port <int>', 'Listens on port number.', String(DEFAULT_PORT))
    .option('-a --address <string>', 'VictoriaMetrics address to connect.', DEFAULT_ADDRESS)
    .option('--csv-root <string>', 'CSV root', String(DEFAULT_CSV_ROOT))
    .option('-l --labels [...string]', "To apply generic labels to all default metrics (ex: --labels foo=bar)", handleLabels, {})
    .action(actionImportCsv)

program.showHelpAfterError();
program.parse();

