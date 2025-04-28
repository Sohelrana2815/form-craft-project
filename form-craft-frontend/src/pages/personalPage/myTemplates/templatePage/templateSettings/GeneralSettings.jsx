import { useParams } from "react-router";
import useTemplate from "../../../../../hooks/useTemplate";
import ReactMarkdown from "react-markdown";
const GeneralSettings = () => {
  const { id } = useParams();
  const { data: template, isLoading, isError, error } = useTemplate(id);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="max-w-5xl mx-auto p-4  border">
      <h2>ID: {id}</h2>
      <h2>Title: {template.title}</h2>
      <div className="prose mb-4">
        <ReactMarkdown>{template.description}</ReactMarkdown>
      </div>
      <div>Topic: {template.topic}</div>
      <div>
        Tags:
        {template.tags.map((tag, index) => (
          <span key={index}> #{tag}</span>
        ))}
      </div>
    </div>
  );
};

export default GeneralSettings;
