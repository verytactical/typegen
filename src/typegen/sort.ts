import * as A from "./ast";

export function* sort(decls: A.TypeDecl[]) {
    decls.map(decl => {
        return [decl.name];
    })
}