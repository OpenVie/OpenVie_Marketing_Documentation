
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

export default function ParametersViewer({
  parameters,
}: Props) {
  if (parameters.length === 0) {
    return (
      <p className="mt-2 text-sm text-slate-400">
        Endpoint này không khai báo parameters.
      </p>
    );
  }

  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-3">Parameter</th>
            <th className="p-3">Location</th>
            <th className="p-3">Type</th>
            <th className="p-3">Required</th>
            <th className="p-3">Description</th>
          </tr>
        </thead>

        <tbody>
          {(parameters as Parameter[]).map((param, index) => (
            <tr
              key={`${param.name}-${index}`}
              className="border-t border-slate-800"
            >
              <td className="p-3 font-mono text-cyan-400">
                {param.name ?? "—"}
              </td>

              <td className="p-3">
                {param.in ?? "—"}
              </td>

              <td className="p-3">
                {param.schema?.type ??
                  param.schema?.$ref?.split("/").pop() ??
                  "unknown"}
              </td>

              <td className="p-3">
                {param.required ? "Yes" : "No"}
              </td>

              <td className="p-3 text-slate-400">
                {param.description ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
