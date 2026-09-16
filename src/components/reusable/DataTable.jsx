// esto sirve para crear una tabla reutilizable en React, donde se pueden pasar las columnas y filas como props, y también se puede especificar una clave para cada fila y acciones opcionales para cada fila.
export default function DataTable({ columns, rows, rowKey = 'id', actions }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {actions ? <th>Acciones</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]}>
              {columns.map((col) => (
                <td key={col.key} data-label={col.label}>
                  {col.render ? col.render(row) : row[col.key] ?? '-'}
                </td>
              ))}
              {actions ? (
                <td data-label="Acciones">
                  <div className="actions">{actions(row)}</div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
