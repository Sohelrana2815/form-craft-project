// import { useParams } from "react-router";
// import useTemplate from "../../../../../hooks/useTemplate";
// import { useForm } from "react-hook-form";
// import ReactMarkdown from "react-markdown";
// const EditTemplate = () => {
//   const { id } = useParams();
//   const { data: template, isError, isLoading, error } = useTemplate(id);
//   const {
//     register,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = useForm({
//     defaultValues: {
//       title: template?.title || "",
//     },
//   });

//   const onSubmit = (data) => {
//     console.log("Updating data", data);
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>{error.message}</div>;
//   if (!template) return <div>No template found...</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div>
//           <label className="label">
//             <span className="label-text">Template Title</span>
//           </label>
//           <input
//             type="text"
//             {...register("title")}
//             className="input input-bordered w-full"
//             defaultValue={template.title}
//           />
//           <button
//             type="submit"
//             className="btn btn-primary"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Saving ..." : "Save Changes"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditTemplate;