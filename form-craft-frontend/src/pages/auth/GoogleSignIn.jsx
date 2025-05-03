import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import useAxiosPublic from "../../hooks/useAxiosPublic";
const GoogleSignIn = () => {
  const { googleSignIn } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  // Path
  // Google Signin option
  const handleGoogleSignin = async () => {
    try {
      const userCredentials = await googleSignIn();
      const user = userCredentials.user;
      navigate("/");
      const checkResponse = await axiosPublic.post("/check-user", {
        name: user?.displayName,
        email: user?.email,
      });
      if (checkResponse.data.error) {
        throw new Error(checkResponse.data.error);
      }

      const userData = {
        name: user?.displayName,
        email: user?.email,
        uid: user?.uid,
      };

      await axiosPublic.post("/signup", userData);
    } catch (error) {
      console.error("Error while signin with google:", error);
    }
  };
  return (
    <>
      {/**Google sign in button */}
      <p className="text-center">OR</p>
      <div className="flex justify-center">
        <button
          onClick={handleGoogleSignin}
          type="button"
          className="flex items-center gap-x-2 btn w-full btn-outline"
        >
          <FcGoogle /> <span>Continue with google</span>
        </button>
      </div>
    </>
  );
};

export default GoogleSignIn;
