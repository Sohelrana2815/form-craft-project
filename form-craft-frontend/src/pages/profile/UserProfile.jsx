import { FaPen } from "react-icons/fa6";

const UserProfile = () => {
  return (
    <div className="hero my-40">
      <div className="hero-content flex-col w-full">
        <div className="text-center lg:text-left">
          <h1 className="text-xl font-bold">Account Settings</h1>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl dark:bg-gray-700">
          <div className="card-body">
            <fieldset className="fieldset">
              <label className="label">Email</label>
              <input
                type="email"
                className="input dark:bg-black w-full"
                placeholder="Email"
              />
              <label className="label">Password</label>
              <input
                type="password"
                className="input dark:bg-black w-full"
                placeholder="Password"
              />
              <button type="submit" className="btn btn-neutral mt-4">
                <FaPen />
                Update
              </button>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
