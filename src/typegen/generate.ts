import { Log, Sync } from "../util/process";
import * as A from "./ast";

type Decls = readonly (readonly A.TypeDecl[])[];

export function* generate(decls: Decls): Sync<string, Log> {
    return '1';
}