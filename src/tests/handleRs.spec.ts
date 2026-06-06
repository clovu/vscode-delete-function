import { rust2ast } from 'pkg/delete_function_vsc';
import { describe, test, expect } from 'vitest';

describe("handle rust", () => {

    test("should delete function at focurs Position", () => {
        const code = `const TIPS: &[&str] = &[
        "Click on any AST node with a '+' to expand it",

        "Hovering over a node highlights the \
        corresponding location in the source code",

        "Shift click on an AST node to expand the whole subtree",
      ];

      pub fn print_tips() {
        for (i, tip) in TIPS.iter().enumerate() {
            println!("Tip {}: {}.", i, tip);
        }
      }
    `;
        const range = rust2ast(code, 10) ?? '{}';

        expect(JSON.parse(range)).toEqual(
            expect.objectContaining({
                "start": { "line": 9, "column": 6 }, "end": { "line": 13, "column": 7 }
            })
        )

    });
});
