/**
 * Spotify-style parameter definitions: stacked spine rows with mono names and
 * metadata chips — never a table grid.
 */

type Parameter = {
  name?: string;
  in?: string;
  description?: string;
  required?: boolean;
  schema?: {
    type?: string;
    format?: string;
    $ref?: string;
  };
};

type Props = {
  parameters: unknown[];
};

function refName(ref: string): string {
  return ref.replace(/^#\/components\/schemas\//, "");
}

function parameterType(parameter: Parameter): string {
  const schema = parameter.schema;
  if (!schema) return "unknown";
  if (schema.$ref) return refName(schema.$ref);
  if (schema.format && schema.format !== "uuid") return `${schema.type} (${schema.format})`;
  return schema.type ?? "unknown";
}

export default function ParametersViewer({ parameters }: Props) {
  if (parameters.length === 0) {
    return <p className="ov-viewer-empty">Endpoint không có tham số.</p>;
  }

  return (
    <ul className="ov-spine">
      {(parameters as Parameter[]).map((parameter, index) => (
        <li
          key={`${parameter.name}-${parameter.in}-${index}`}
          className="ov-spine-row ov-spine-grid"
        >
          <div>
            <code className="ov-spine-name">{parameter.name ?? "—"}</code>
            <div className="ov-spine-meta">
              <span className="ov-param-location">{parameter.in ?? "—"}</span>
              <span className="ov-param-type">{parameterType(parameter)}</span>
              {parameter.required ? <span className="ov-param-required">required</span> : null}
            </div>
          </div>
          <p className="ov-spine-description">{parameter.description ?? "—"}</p>
        </li>
      ))}
    </ul>
  );
}
