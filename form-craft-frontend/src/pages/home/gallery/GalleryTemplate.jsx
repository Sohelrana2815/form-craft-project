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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-5 gap-x-4 mt-10 max-w-6xl mx-auto p-4">
      {publicTemplates.map((template) => (
        <Link
          key={template.id}
          to={`/templateForm/${template.id}`}
          className="flex justify-center"
        >
          <div className="card bg-base-100 dark:bg-gray-800 h-64 shadow-sm border border-primary sm:w-full w-72">
            <figure className="px-10 pt-10 h-40 overflow-hidden">
              {template.imageUrl ? (
                <img
                  src={template.imageUrl}
                  alt={template.title}
                  className="rounded-xl w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-xl">
                  <span className="text-gray-500 dark:text-gray-300">
                    No Image
                  </span>
                </div>
              )}
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
