#!/usr/bin/env node

const { runCli } = require("../dist/util/cli");
const { main } = require("../dist/typegen/main");

runCli(main);