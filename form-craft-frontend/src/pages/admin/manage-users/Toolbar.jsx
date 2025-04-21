import { FaLock, FaRegUser, FaTrash, FaUnlock } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";

const Toolbar = ({
  onDelete,
  onBlock,
  onUnblock,
  onMakeAdmin,
  onMakeUser,
  actionDisabled,
  selectedUsers,
}) => {
  const hasAdmin = selectedUsers.some((user) => user.role === "admin");

  const allBlocked = selectedUsers.every((user) => user.isBlocked);

  return (
    <>
      {/* Toolbar */}
      <div className="bg-base-200 p-4 rounded-lg shadow-sm dark:bg-[#121212] dark:border">
        <div className="flex flex-wrap gap-3">
          {/* Role Controls */}
          <div className="flex gap-2">
            <button
              onClick={onMakeAdmin}
              disabled={actionDisabled || hasAdmin}
              className="btn btn-sm bg-purple-600 text-white"
            >
              <RiAdminLine />
              Make Admin
            </button>
            <button
              onClick={onMakeUser}
              disabled={actionDisabled || !hasAdmin}
              title="Remove admin role and make normal user"
              className="btn btn-sm bg-blue-600 text-white"
            >
              <FaRegUser />
            </button>
          </div>

          {/* Block/Unblock */}
          <div className="flex gap-2">
            <button
              onClick={onBlock}
              disabled={actionDisabled || allBlocked}
              className="btn btn-sm bg-red-600 text-white"
            >
              <FaLock />
              Block
            </button>
            <button
              title="Unblock"
              onClick={onUnblock}
              disabled={actionDisabled || !allBlocked}
              className="btn btn-sm bg-green-600 text-white"
            >
              <FaUnlock />
            </button>
          </div>

          {/* Delete */}
          <button
            title="Delete"
            onClick={onDelete}
            disabled={actionDisabled}
            className="btn btn-sm bg-gray-700 text-white"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </>
  );
};

export default Toolbar;
