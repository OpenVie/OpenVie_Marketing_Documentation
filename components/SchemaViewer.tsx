/**
 * Spotify-style schema rendering: a generated JSON example block followed by a
 * field spine — no schema tables.
 */

import { generateSample } from "@/lib/mock";

type Schema = {
  type?: string;
  format?: string;
  description?: string;
  $ref?: string;
  items?: Schema;
  properties?: Record<string, Schema>;
  required?: string[];
  enum?: unknown[];
};

type Props = {
  name: string;
  schema: unknown;
  schemas: Record<string, unknown>;
};

const REF_PREFIX = "#/components/schemas/";

function refNameOf(reference: string): string {
  return reference.replace(REF_PREFIX, "");
}

/** Deterministic JSON instance of the schema for the code block. */
function exampleFor(name: string, schema: unknown, schemas: Record<string, unknown>): string {
  let ref: string | null = null;
  const container = schema as Schema;

  if (container?.$ref) {
    ref = container.$ref;
  } else if (container?.items?.$ref) {
    ref = container.items.$ref;
  }

  let innerSchema: unknown = schema;
  if (ref) {
    const targetSchema = schemas[refNameOf(ref)];
    if (typeof targetSchema === "object" && targetSchema !== null) {
      innerSchema = targetSchema;
    }
  }

  const value = generateSample(innerSchema ?? {}, schemas, name);

  const pretty = JSON.stringify(value, null, 2);
  return pretty === "{}" ? "// schema trống hoặc không có thuộc tính khai báo\n{}" : pretty;
}

interface FieldRow {
  property: string;
  type: string;
  required: boolean;
  description: string;
}

function flattenFields(schema: Schema): FieldRow[] {
  const properties = Object.entries(schema.properties ?? {});
  const required = new Set(schema.required ?? []);

  return properties.map(([property, detail]) => {
    let type = detail.$ref
      ? refNameOf(detail.$ref)
      : detail.type ?? (detail.properties ? "object" : "any");

    if (detail.type === "array") {
      const itemType = detail.items?.$ref
        ? refNameOf(detail.items.$ref)
        : detail.items?.type ?? "any";
      type = `array<${itemType}>`;
    }

    return {
      property,
      type,
      required: required.has(property),
      description: detail.description ?? "—",
    };
  });
}

export default function SchemaViewer({ name, schema, schemas }: Props) {
  const target = (schema as Schema) ?? {};
  const fields = flattenFields(target);

  return (
    <section className="ov-json">
      <div className="ov-json-block">
        <div className="ov-json-head">
          <span>Response body <code>{name}</code></span>
          <span className="ov-json-note">sinh từ schema — mock tĩnh</span>
        </div>
        <pre className="ov-json-code"><code>{exampleFor(name, schema, schemas)}</code></pre>
      </div>

      {fields.length > 0 && (
        <ul className="ov-spine ov-spine-flush">
          {fields.map((field) => (
            <li key={field.property} className="ov-spine-row ov-spine-grid">
              <div>
                <code className="ov-spine-name">{field.property}</code>
                <div className="ov-spine-meta">
                  <span className="ov-param-type">{field.type}</span>
                  {field.required ? (
                    <span className="ov-param-required">required</span>
                  ) : null}
                </div>
              </div>
              <p className="ov-spine-description">{field.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
