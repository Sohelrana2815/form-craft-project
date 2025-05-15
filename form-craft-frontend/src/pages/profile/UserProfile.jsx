import { FaPen } from "react-icons/fa6";
import { FcSettings } from "react-icons/fc";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { updateProfile } from "firebase/auth";
const UserProfile = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [message, setMessage] = useState("");

  const profileUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;
    setProfileLoading(true);
    setMessage("");

    try {
      // Update user displayName from firebase
      await updateProfile(user, { displayName });
      setMessage("Display Name updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Could not update Display Name. Please try again");
    }

    setProfileLoading(false);
  };

  return (
    <div className="hero my-40">
      <div className="hero-content flex-col w-full">
        <div className="text-center lg:text-left">
          <h1 className="text-xl font-bold flex items-center gap-x-2">
            <FcSettings />
            Account Settings
          </h1>
        </div>
        <form
          onSubmit={profileUpdate}
          className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl dark:bg-gray-700"
        >
          <div className="card-body">
            {/* Profile pic */}
            {user?.photoURL ? (
              <div className="flex justify-center">
                <img src={user?.photoURL} className="rounded-full" />
              </div>
            ) : (
              <div className="border w-28 mx-auto md:h-28 rounded-full bg-gray-400 flex items-center justify-center">
                <span className="text-gray-600 text-sm md:text-base">
                  No Image
                </span>
              </div>
            )}

            <fieldset className="fieldset">
              <label className="label">Display Name</label>
              <input
                type="text"
                className="input dark:bg-black w-full pr-10 focus:border-[1px] focus:border-gray-300 focus:outline-none"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-neutral mt-4 dark:hover:bg-gray-900"
                disabled={profileLoading}
              >
                {profileLoading ? (
                  "Updating..."
                ) : (
                  <>
                    <FaPen />
                    Update
                  </>
                )}
              </button>
            </fieldset>
            {message && (
              <div className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
                {message}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
