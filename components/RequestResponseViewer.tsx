
import SchemaViewer from "@/components/SchemaViewer";

type MediaContent = {
  schema?: unknown;
  example?: unknown;
  examples?: Record<string, unknown>;
};

type RequestBody = {
  description?: string;
  required?: boolean;
  content?: Record<string, MediaContent>;
  $ref?: string;
};

type ApiResponse = {
  description?: string;
  content?: Record<string, MediaContent>;
  $ref?: string;
};

type Props = {
  requestBody?: unknown;
  responses?: Record<string, unknown>;
  schemas: Record<string, unknown>;
};

function MediaViewer({
  content,
  schemas,
}: {
  content?: Record<string, MediaContent>;
  schemas: Record<string, unknown>;
}) {
  if (!content || Object.keys(content).length === 0) {
    return (
      <p className="text-sm text-slate-400">
        Không khai báo nội dung dữ liệu.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(content).map(([mediaType, media]) => (
        <div
          key={mediaType}
          className="rounded-lg border border-slate-800 p-4"
        >
          <p className="mb-3 text-sm text-cyan-400">
            Content-Type: {mediaType}
          </p>

          {media.schema !== undefined && (
            <SchemaViewer
              name="Data Schema"
              schema={media.schema}
              schemas={schemas}
            />
          )}

          {media.schema === undefined && (
            <p className="text-sm text-slate-400">
              Không khai báo schema.
            </p>
          )}

          {media.example !== undefined && (
            <details className="mt-3">
              <summary className="cursor-pointer text-sm">
                Example
              </summary>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs">
                {JSON.stringify(media.example, null, 2)}
              </pre>
            </details>
          )}
        </div>
      ))}
    </div>
  );
}

export default function RequestResponseViewer({
  requestBody,
  responses,
  schemas,
}: Props) {
  const body = requestBody as RequestBody | undefined;

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Request Body</h3>

        {!body ? (
          <p className="text-sm text-slate-400">
            Endpoint này không khai báo Request Body.
          </p>
        ) : body.$ref ? (
          <p className="text-sm text-amber-300">
            Request Body tham chiếu: {body.$ref}
          </p>
        ) : (
          <>
            <p className="text-sm text-slate-400">
              Required: {body.required ? "Yes" : "No"}
            </p>

            {body.description && (
              <p className="text-sm text-slate-300">
                {body.description}
              </p>
            )}

            <MediaViewer
              content={body.content}
              schemas={schemas}
            />
          </>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Responses</h3>

        {Object.entries(responses ?? {}).map(([status, value]) => {
          const response = value as ApiResponse;

          return (
            <details
              key={status}
              className="rounded-lg border border-slate-800 bg-slate-950/50 p-4"
            >
              <summary className="flex cursor-pointer items-center gap-3">
                <span
                  className={`rounded px-3 py-1 text-xs font-bold ${
                    status.startsWith("2")
                      ? "bg-emerald-400/10 text-emerald-400"
                      : "bg-amber-400/10 text-amber-400"
                  }`}
                >
                  {status}
                </span>

                <span className="text-sm text-slate-200">
                  {response.description ?? "No description"}
                </span>
              </summary>

              <div className="mt-4 space-y-3">
                {response.$ref ? (
                  <p className="text-sm text-amber-300">
                    Response tham chiếu: {response.$ref}
                  </p>
                ) : (
                  <MediaViewer
                    content={response.content}
                    schemas={schemas}
                  />
                )}
              </div>
            </details>
          );
        })}
      </section>
    </div>
  );
}
