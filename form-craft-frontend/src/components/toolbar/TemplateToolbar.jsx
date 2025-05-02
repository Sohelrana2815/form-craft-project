import { FaTrash } from "react-icons/fa";
import { MdAddCircleOutline } from "react-icons/md";
import { Link } from "react-router";
// ------------------------------ IMPORT ----------------------------------//

const TemplateToolbar = ({ actionDisabled, onDelete }) => {
  return (
    <>
      {/* Toolbar */}
      <div className="bg-base-200 p-4 rounded-lg shadow-sm dark:bg-[#121212] dark:border">
        <div className="flex flex-wrap gap-3">
          {/* Role Controls */}
          <div className="flex gap-2">
            <Link to="/create-template">
              <button
                className="btn btn-sm bg-purple-600 text-white"
                title="Create New Template"
              >
                <MdAddCircleOutline className="text-xl" />
              </button>
            </Link>
          </div>

          {/* Delete */}
          <button
            onClick={onDelete}
            disabled={actionDisabled}
            title="Delete Template(s)"
            className="btn btn-sm bg-red-600 text-white border-stone-600"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </>
  );
};

export default TemplateToolbar;
