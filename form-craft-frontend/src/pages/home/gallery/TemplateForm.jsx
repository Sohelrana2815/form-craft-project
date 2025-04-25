import { useParams } from "react-router";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const TemplateForm = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();

  const fetchTemplate = async () => {
    const response = await axiosPublic.get(`/templates/${id}`);
    return response.data;
  };

  const {
    data: template,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["template", id],
    queryFn: fetchTemplate,
  });
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;
  if (!template) return <p>No template found.</p>;

  return (
    <>


    
      <div className="hero bg-base-200">
        <div className="hero-content flex-col w-full">
          <form className="card bg-base-100 w-full md:w-2/3 shrink-0 shadow-2xl">
            <div className="card-body">
              <fieldset className="fieldset">
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="Email" />
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Password"
                />
                <div>
                  <a className="link link-hover">Forgot password?</a>
                </div>
                <button className="btn btn-neutral mt-4">Login</button>
              </fieldset>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TemplateForm;

// Template Form : {id}
// <div>
//   {/* Common fields */}
//   image, title, description, topic, tags,
// </div>
// <div>
//   {/* Custom question part */}
//   Short q1
//   Short q2
//   Short q3
//   Short q4
//   {/* des */}
//   long q1
//   long q2
//   long q3
//   long q4
//   {/* num */}
//   num q1
//   num q2
//   num q3
//   num q4
//   {/* checkbox */}
//   num q1
//   num q2
//   num q3
//   num q4
// </div>
