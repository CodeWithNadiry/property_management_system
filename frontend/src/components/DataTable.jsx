import Button from "../components/Button";

const DataTable = ({
  title,
  data = [],
  columns = [],
  actions = [],
  isLoading = false,
  isError = false,
  onAdd,
}) => {
  if (isLoading) return <span>Loading {title}...</span>;
  if (isError) return <span>Error loading {title}</span>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        {onAdd && <Button onClick={onAdd}>Add {title}</Button>}
      </div>

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-300 text-gray-500 text-sm bg-gray-200">
              {columns.map((col) => (
                <th key={col.accessor} className="py-2">
                  {col.header}
                </th>
              ))}
              {actions.length > 0 && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length ? 1 : 0)}
                  className="py-10 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span>No {title.toLowerCase()} found</span>
                    {onAdd && (
                      <Button onClick={onAdd}>
                        Create your first {title.slice(0, -1)} {/* str.slice(startIndex, endIndex)*/}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-b border-zinc-200 hover:bg-gray-100">
                  {columns.map((col) => (
                    <td key={col.accessor} className="py-3">
                      {row[col.accessor]}
                    </td>
                  ))}

                  {actions.length > 0 && (
                    <td>
                      <div className="flex gap-2">
                        {actions.map((action) => (
                          <button
                            key={action.label}
                            onClick={() => action.onClick(row)}
                            className={`cursor-pointer ${action.className}`}
                            disabled={action.disabled}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
