const UsersRow = ({ user, idx, onSelect }) => {
  const { name, email, created_at } = user;

  // function will called when toggled checkboxes

  const handleCheckboxChange = (e) => {
    onSelect(e.target.checked);
  };

  return (
    <>
      {/* row 1 */}
      <tr>
        <td>{idx + 1}</td>
        <td>
          <label className="mr-2">
            <input
              onChange={handleCheckboxChange}
              type="checkbox"
              className="checkbox checkbox-sm"
            />
          </label>
          {name}
        </td>
        <td>{email}</td>
        <td>{created_at}</td>
      </tr>
    </>
  );
};

export default UsersRow;
