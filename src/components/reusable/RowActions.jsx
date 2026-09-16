import { Link } from 'react-router-dom';

export default function RowActions({ entity, basePath, onDelete }) {
  return (
    <>
      <Link
        className="btn btn-secondary btn-sm"
        to={`/${basePath}/${entity.id}`}
      >
        Ver
      </Link>
      <Link
        className="btn btn-secondary btn-sm"
        to={`/${basePath}/create?id=${entity.id}`}
      >
        Editar
      </Link>
      <button
        type="button"
        className="btn btn-danger btn-sm"
        onClick={() => onDelete(entity)}
      >
        Eliminar
      </button>
    </>
  );
}