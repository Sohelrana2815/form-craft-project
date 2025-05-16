import { FaPen } from "react-icons/fa6";
import { useRef } from "react";
import { FcSettings } from "react-icons/fc";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { LiaUserEditSolid } from "react-icons/lia";
const UserProfile = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [message, setMessage] = useState("");
  const imgFileRef = useRef(null);

  const editProfilePic = () => {
    imgFileRef.current.click(); // Open file system when icon is clicked
  };

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
            <div className="relative w-28 h-28 mx-auto">
              {/* Profile pic */}
              {user?.photoURL ? (
                <img
                  src={user?.photoURL}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover"
                />
              ) : (
                <div className="w-28 h-28 border rounded-full bg-neutral flex items-center justify-center border-primary">
                  {user ? (
                    <span className="text-white text-sm md:text-4xl">
                      {displayName.charAt(0)}
                    </span>
                  ) : (
                    <span>No User</span>
                  )}
                </div>
              )}

              {/* Hidden file input form img */}
              <input
                type="file"
                accept="image/*"
                ref={imgFileRef}
                className="hidden"
              />

              {/* Edit pen icon repositioned at the bottom-right */}
              <div
                onClick={editProfilePic}
                className="absolute right-0 bottom-0 transform translate-x-1/4 translate-y-1/4  bg-white rounded-full p-1 border border-gray-300"
              >
                <LiaUserEditSolid className="text-lg text-primary cursor-pointer" />
              </div>
            </div>

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
