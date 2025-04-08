import { FaLock, FaTrash, FaUnlock } from "react-icons/fa";
const Toolbar = ({
  onDelete,
  deleteDisabled,
  onBlock,
  onUnblock,
  actionDisabled,
}) => {
  return (
    <>
      {/* Toolbar */}
      <div className="bg-base-200 max-w-sm m-6">
        <div className="flex items-center gap-4 p-3">
          {/* block */}
          <button
            onClick={onBlock}
            disabled={actionDisabled}
            className="flex items-center btn btn-sm bg-warning"
          >
            Block
            <FaLock />
          </button>
          {/* unblock */}
          <button
            onClick={onUnblock}
            disabled={actionDisabled}
            className="flex items-center btn btn-sm bg-green-500 text-white"
          >
            <FaUnlock />
          </button>
          {/* delete */}
          <button
            onClick={onDelete}
            disabled={deleteDisabled}
            className="flex items-center btn btn-sm bg-red-600 text-white"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </>
  );
};

export default Toolbar;
