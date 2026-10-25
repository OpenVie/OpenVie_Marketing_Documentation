
type Schema = {
  type?: string;
  format?: string;
  description?: string;
  $ref?: string;
  items?: Schema;
  properties?: Record<string, Schema>;
  required?: string[];
};

type Props = {
  name: string;
  schema: unknown;
  schemas: Record<string, unknown>;
};

function getReferenceName(ref: string): string | null {
  const prefix = "#/components/schemas/";

  if (!ref.startsWith(prefix)) return null;

  return ref
    .slice(prefix.length)
    .replace(/~1/g, "/")
    .replace(/~0/g, "~");
}

function getType(schema: Schema): string {
  if (schema.$ref) {
    return getReferenceName(schema.$ref) ?? schema.$ref;
  }

  if (schema.type === "array") {
    return `array<${getType(schema.items ?? {})}>`;
  }

  return schema.type ?? "object";
}

function SchemaDetails({
  schema,
  schemas,
  visited,
}: {
  schema: Schema;
  schemas: Record<string, unknown>;
  visited: string[];
}) {
  // Giải quyết tham chiếu $ref
  if (schema.$ref) {
    const refName = getReferenceName(schema.$ref);

    if (!refName || !(refName in schemas)) {
      return (
        <p className="text-amber-400">
          Không tìm thấy schema: {schema.$ref}
        </p>
      );
    }

    // Tránh vòng lặp tham chiếu vô hạn
    if (visited.includes(refName)) {
      return (
        <p className="text-slate-400">
          Schema {refName} đã xuất hiện trong chuỗi tham chiếu.
        </p>
      );
    }

    return (
      <SchemaDetails
        schema={schemas[refName] as Schema}
        schemas={schemas}
        visited={[...visited, refName]}
      />
    );
  }

  const properties = Object.entries(schema.properties ?? {});
  const required = new Set(schema.required ?? []);

  if (properties.length === 0) {
    return (
      <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-300">
        {JSON.stringify(schema, null, 2)}
      </pre>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-3">Property</th>
            <th className="p-3">Type</th>
            <th className="p-3">Required</th>
            <th className="p-3">Description</th>
          </tr>
        </thead>

        <tbody>
          {properties.map(([property, detail]) => {
            const ref = detail.$ref ??
              (detail.type === "array"
                ? detail.items?.$ref
                : undefined);

            const refName = ref
              ? getReferenceName(ref)
              : null;

            const canExpand =
              refName !== null &&
              refName in schemas &&
              !visited.includes(refName);

            return (
              <tr
                key={property}
                className="border-t border-slate-800 align-top"
              >
                <td className="p-3 font-mono text-cyan-400">
                  {property}
                </td>

                <td className="p-3">
                  <div>{getType(detail)}</div>

                  {canExpand && refName && ref && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-cyan-400">
                        Xem schema {refName}
                      </summary>

                      <div className="mt-3 min-w-[500px]">
                        <SchemaDetails
                          schema={{ $ref: ref }}
                          schemas={schemas}
                          visited={visited}
                        />
                      </div>
                    </details>
                  )}
                </td>

                <td className="p-3">
                  {required.has(property) ? "Yes" : "No"}
                </td>

                <td className="p-3 text-slate-400">
                  {detail.description ?? "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function SchemaViewer({
  name,
  schema,
  schemas,
}: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-cyan-400">
        {name}
      </h3>

      <SchemaDetails
        schema={schema as Schema}
        schemas={schemas}
        visited={[name]}
      />
    </div>
  );
}
