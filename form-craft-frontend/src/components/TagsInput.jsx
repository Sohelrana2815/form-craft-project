import { Autocomplete, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const TagsInput = () => {
  const axiosPublic = useAxiosPublic();
  const {
    control,
    // formState: { errors },
  } = useFormContext();

  const fetchTags = async () => {
    const response = await axiosPublic.get("/tags");
    return response.data;
  };

  const {
    isLoading,
    isError,
    data: tags = [],
    error,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  const tag = tags.map((tagName) => tagName.name);

  // Add tag event handler

  if (isLoading) {
    return <p className="loading loading-dots loading-xl text-blue-700"></p>;
  }
  if (isError) {
    return <p>Error Loading users: {error.message}</p>;
  }
  return (
    <div className="my-4">
      <Controller
        name="tags"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <Autocomplete
            {...field}
            multiple
            freeSolo
            options={tag}
            renderInput={(params) => (
              <TextField
                {...params}
                label={<span className="dark:text-gray-300">Tag(s)</span>}
                variant="outlined"
                placeholder="Select tag(s)"
              />
            )}
            onChange={(_, data) => field.onChange(data)}
          />
        )}
      />
    </div>
  );
};

export default TagsInput;
