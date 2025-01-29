import { Log, Sync } from "../util/process";
import * as A from "./ast";

type Decls = readonly (readonly A.TypeDecl[])[];

const disjointTag = 'kind';

export function* generate(decls: Decls): Sync<string, Log> {
    const flatDecls = decls.flat();
    return '1';
}
