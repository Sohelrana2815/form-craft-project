import { Link } from "react-router";
import useTemplates from "../../../hooks/useTemplates";

const GalleryTemplate = () => {
  const { data: templates, isLoading, isError, error } = useTemplates();

  if (isLoading) {
    return <p className="loading loading-dots loading-xl text-blue-700"></p>;
  }

  if (isError) {
    return <p>Error Loading users: {error.message}</p>;
  }

  const publicTemplates = templates.filter(
    (pTemplate) => pTemplate.accessType === "PUBLIC"
  );

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {publicTemplates.map((template) => (
        <Link key={template.id} to={`/templateForm/${template.id}`}>
          <div className="card bg-base-100 w-96 shadow-sm">
            <figure className="px-10 pt-10">
              <img
                src={template?.imageUrl}
                alt={template.title}
                className="rounded-xl"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{template.title}</h2>
              <p className="font-medium">Topic: {template.topic}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default GalleryTemplate;
