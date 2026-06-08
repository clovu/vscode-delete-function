use proc_macro2::Span;
use serde::Serialize;
use syn::spanned::Spanned;
use wasm_bindgen::prelude::*;

#[derive(Serialize)]
pub struct RsPosition {
    pub line: usize,
    pub column: usize,
}

#[derive(Serialize)]
pub struct RsNode {
    pub name: String,
    pub start: RsPosition,

    pub end: RsPosition,
}

impl From<RsNode> for String {
    fn from(val: RsNode) -> Self {
        serde_json::to_string(&val).unwrap()
    }
}

#[wasm_bindgen]
#[derive(Serialize)]
pub struct Position {
    pub line: usize,
    pub column: usize,
}

#[wasm_bindgen]
impl Position {
    #[wasm_bindgen(constructor)]
    pub fn new(line: usize, column: usize) -> Self {
        Position { line, column }
    }
}

fn is_item_in_range(span: Span, position: &Position) -> bool {
    let start = span.start();
    let end = span.end();

    let after_start = position.line > start.line
        || position.line == start.line && position.column >= start.column;
    let before_end =
        position.line < end.line || position.line == end.line && position.column <= end.column;

    after_start && before_end
}

// impl RsNode for WasmDescribe {}
fn determine_range(span: Span, sig_ident: String, position: &Position) -> Option<RsNode> {
    let start = span.start();
    let end = span.end();

    if is_item_in_range(span, position) {
        let start = RsPosition {
            line: start.line,
            column: start.column,
        };
        let end = RsPosition {
            line: end.line,
            column: end.column,
        };

        return Some(RsNode {
            name: sig_ident.clone(),
            start,
            end,
        });
    }
    None
}

fn for_each_impl_items(items: Vec<syn::ImplItem>, position: &Position) -> Option<RsNode> {
    items.into_iter().find_map(|item| match item {
        syn::ImplItem::Fn(item) => {
            determine_range(item.span(), item.sig.ident.to_string(), position)
        }
        _ => None,
    })
}

#[wasm_bindgen]
pub fn rust2ast(code: &str, position: Position) -> Option<String> {
    let ast_result = syn::parse_str::<syn::File>(code);

    let Ok(ast) = ast_result else {
        return None;
    };

    ast.items
        .into_iter()
        .find_map(|item| match item {
            syn::Item::Fn(item) => {
                determine_range(item.span(), item.sig.ident.to_string(), &position)
            }
            syn::Item::Impl(item) if is_item_in_range(item.span(), &position) => {
                for_each_impl_items(item.items, &position)
            }
            _ => None,
        })
        .map(Into::into)
}

#[cfg(test)]
mod tests {
    use super::*;
    use syn::spanned::Spanned;

    fn first_item_span(code: &str) -> Span {
        syn::parse_str::<syn::File>(code)
            .expect("code should parse")
            .items
            .into_iter()
            .next()
            .expect("code should contain an item")
            .span()
    }

    fn indented_function_span() -> Span {
        first_item_span("  fn first() {\n      let value = 1;\n  }\n")
    }

    #[test]
    fn is_item_in_range_accepts_start_and_end_boundaries() {
        let span = indented_function_span();
        let start = span.start();
        let end = span.end();

        assert!(is_item_in_range(
            span,
            &Position {
                line: start.line,
                column: start.column,
            },
        ));
        assert!(is_item_in_range(
            span,
            &Position {
                line: end.line,
                column: end.column,
            },
        ));
    }

    #[test]
    fn is_item_in_range_accepts_any_column_on_inner_lines() {
        let span = indented_function_span();
        let start = span.start();
        let end = span.end();

        assert!(is_item_in_range(
            span,
            &Position {
                line: start.line + 1,
                column: 0,
            },
        ));
        assert!(is_item_in_range(
            span,
            &Position {
                line: start.line + 1,
                column: end.column + 8,
            },
        ));
    }

    #[test]
    fn is_item_in_range_rejects_positions_outside_the_span() {
        let span = indented_function_span();
        let start = span.start();
        let end = span.end();

        assert!(start.column > 0);
        assert!(!is_item_in_range(
            span,
            &Position {
                line: start.line,
                column: start.column - 1,
            },
        ));
        assert!(!is_item_in_range(
            span,
            &Position {
                line: end.line,
                column: end.column + 1,
            },
        ));
    }

    #[test]
    fn rust2ast_returns_function_containing_position() {
        let code = r#"
pub fn hello() {}

pub fn rust2ast(code: &str) -> String {
    code.to_string()
}
"#;

        let result = rust2ast(code, Position { line: 4, column: 8 });

        assert!(
            result
                .expect("position should match a function")
                .contains("\"name\":\"rust2ast\"")
        );
    }
}
