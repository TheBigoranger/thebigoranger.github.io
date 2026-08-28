declare module "@retorquere/bibtex-parser" {
  export function parse(input: string): {
    entries: Array<{
      key: string;
      type: string;
      fields?: Record<string, unknown>;
    }>;
  };
}
