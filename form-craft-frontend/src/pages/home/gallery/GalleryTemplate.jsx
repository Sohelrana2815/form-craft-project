import { Link } from "react-router";
import useTemplates from "../../../hooks/useTemplates";
import svg from "../../../assets/no-template.webp";
const GalleryTemplate = () => {
  const { data: templates, isLoading, isError, error } = useTemplates();

  if (isLoading) {
    return <p className="loading loading-dots loading-xl text-blue-700"></p>;
  }

  if (isError) {
    return <p>Error Loading users: {error.message}</p>;
  }

  if (!templates.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          No template created yet.
        </p>
        <img src={svg} alt="No template" className="max-w-xs h-auto mx-auto" />
      </div>
    );
  }

  const publicTemplates = templates.filter(
    (pTemplate) => pTemplate.accessType === "PUBLIC"
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 mt-10 max-w-6xl mx-auto p-4">
      {publicTemplates.map((template) => (
        <Link key={template.id} to={`/templateForm/${template.id}`}>
          <div className="card bg-base-100 dark:bg-gray-800 max-w-xs h-64 shadow-sm border border-primary">
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
