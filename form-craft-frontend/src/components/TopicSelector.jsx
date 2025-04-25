import { Autocomplete, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const TopicSelector = () => {
  const axiosPublic = useAxiosPublic();

  const {
    control,
    // formState: { errors },
  } = useFormContext();
  const fetchTopics = async () => {
    const response = await axiosPublic.get("/topics");
    return response.data;
  };

  const {
    isLoading,
    isError,
    data: topics = [],
    error,
  } = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics,
  });
  const topic = topics.map((topicName) => topicName.name);
  if (isLoading) {
    return <p className="loading loading-dots loading-xl text-blue-700"></p>;
  }

  if (isError) {
    return <p>Error Loading users: {error.message}</p>;
  }
  return (
    <div className="my-4">
      <Controller
        name="topic"
        control={control}
        defaultValue=""
        // rules={{ required: "Topic is required" }}
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={topic}
            renderInput={(params) => (
              <TextField
                {...params}
                label={<span className="dark:text-gray-300">Topic</span>}
                variant="outlined"
              />
            )}
            onChange={(_, data) => field.onChange(data)}
          />
        )}
      />
      {/* {errors.topic && (
        <span className="text-red-600">{errors.topic.message}</span>
      )} */}
    </div>
  );
};

export default TopicSelector;
