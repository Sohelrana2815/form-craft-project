import { Link } from "react-router";
import useTemplates from "../../../hooks/useTemplates";
import svg from "../../../assets/no-template.webp";
import { truncateString } from "../../../components/utils/stringUtils";
const GalleryTemplate = () => {
  const { data: templates, isLoading, isError, error } = useTemplates();

  const maxLength = 20;

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-5 gap-x-4">
      {publicTemplates.map((template) => (
        <Link
          key={template.id}
          to={`/templateForm/${template.id}`}
          className="flex justify-center"
        >
          <div className="card bg-base-100 dark:bg-gray-800 h-64 md:h-72 shadow-sm border border-primary sm:w-full w-72">
            <figure className="px-5 pt-5 h-full overflow-hidden">
              {template.imageUrl ? (
                <img
                  src={template.imageUrl}
                  alt={template.title}
                  className="rounded-xl w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full  flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-xl">
                  <span className="text-gray-500 dark:text-gray-300">
                    No Image
                  </span>
                </div>
              )}
            </figure>
            <div className="card-body">
              <h2 className="card-title">
                {truncateString(template.title, maxLength)}
              </h2>
              <p className="font-medium">Topic: {template.topic}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default GalleryTemplate;
