const UsersRow = ({ user, idx }) => {
  const { name, email, created_at } = user;
  return (
    <>
      {/* row 1 */}
      <tr>
        <td>{idx + 1}</td>
        <td>
          <label className="mr-2">
            <input type="checkbox" className="checkbox checkbox-sm" />
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
