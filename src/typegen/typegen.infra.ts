// This is only for debug

import { main } from "./main";

process.argv = ['', '', 'example/ast.ts'];
// process.argv = ['', '', 'example/foo.ts'];

main();
