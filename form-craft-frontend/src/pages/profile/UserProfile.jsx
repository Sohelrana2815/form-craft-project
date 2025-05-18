import { FaPen } from "react-icons/fa6";
import { useRef, useState } from "react";
import { FcSettings } from "react-icons/fc";
import useAuth from "../../hooks/useAuth";
import { updateProfile } from "firebase/auth";
import { LiaUserEditSolid } from "react-icons/lia";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import salesforce from "../../assets/salesforce.png";
// Image hosting configuration

const img_hosting_key = import.meta.env.VITE_IMG_HOSTING_KEY;
const img_hosting_api = `https://api.imgbb.com/1/upload?key=${img_hosting_key}`;

const UserProfile = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  // Show the img PREVIEW
  const [previewProfileImg, setPreviewProfileImg] = useState(user?.photoURL);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [message, setMessage] = useState("");
  // Use ref for <dialog>
  const dialogRef = useRef(null);
  const imgFileRef = useRef(null);

  const editProfilePic = () => {
    imgFileRef.current.click(); // Open file system when icon is clicked
  };
  // When a file is chosen, update the preview and save the file

  const fileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Profile picture image file:", file);
      setSelectedFile(file);
      setPreviewProfileImg(URL.createObjectURL(file));
    }
  };

  // This function handle the user form submission after update
  const userProfileUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;
    setProfileLoading(true);
    setMessage("");

    try {
      let imageUrl = user.photoURL;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        const uploadRes = await axiosPublic.post(img_hosting_api, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (!uploadRes.data.success) {
          throw new Error("Image upload failed");
        }

        imageUrl = uploadRes.data.data.display_url;
      }

      // Update profile regardless of image selection

      await updateProfile(user, {
        displayName,
        photoURL: imageUrl,
      });

      // Update local state
      setPreviewProfileImg(imageUrl);
      setSelectedFile(null);
      setMessage(
        <p className="text-green-500">Profile updated successfully!</p>
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage(error.message || "Could not update profile. Please try again");
    } finally {
      setProfileLoading(false);
    }
  };

  // Handling the open/close modal

  const openModal = () => dialogRef.current.showModal();
  const closeModal = () => dialogRef.current.close();

  return (
    <>
      <div className="hero  my-10">
        <div className="hero-content flex-col w-full">
          <div className="text-center lg:text-left">
            <h1 className="text-xl font-bold flex items-center gap-x-2">
              <FcSettings />
              Account Settings
            </h1>
          </div>
          <form
            onSubmit={userProfileUpdate}
            className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl dark:bg-gray-700"
          >
            <div className="card-body">
              <div className="relative w-28 h-28 mx-auto">
                {/* Show live preview if available; else fallback to user.photoURL; and then placeholder */}
                {previewProfileImg ? (
                  <img
                    src={previewProfileImg}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover"
                  />
                ) : user?.photoURL ? (
                  <img
                    src={user.photoURL}
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
                  onChange={fileChange}
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

      {/* Salesforce Form */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <img src={salesforce} alt="Salesforce.png" className="max-w-48" />
        <button className="btn btn-primary" onClick={openModal}>
          Create Salesforce Account
        </button>
      </div>

      {/* Daisy UI Modal */}

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box dark:bg-gray-800 dark:text-gray-300">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Salesforce Integration</h3>
            <button
              onClick={closeModal}
              className="btn btn-xs btn-outline hover:bg-red-500 hover:border-none hover:text-white rounded-none"
            >
              X
            </button>
          </div>
          <div className="py-4 space-y-4">
            <input
              type="text"
              placeholder="Company Name"
              className="input w-full dark:bg-gray-700 dark:placeholder-gray-300 focus:border-gray-500 focus:outline-none"
            />
            <input
              type="tel"
              placeholder="Phone"
              className="input w-full dark:bg-gray-700 dark:placeholder-gray-300 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
        {/* Dark Backdrop*/}

        <form
          method="dialog"
          className="modal-backdrop dark:bg-black dark:bg-opacity-70"
        >
          <button>Close</button>
        </form>
      </dialog>
    </>
  );
};

export default UserProfile;
