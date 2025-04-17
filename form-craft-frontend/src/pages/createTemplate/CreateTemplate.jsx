import { FormProvider, useForm } from "react-hook-form";
import TitleDescriptionSection from "../../components/TitleDescriptionSection";
import { Button } from "@mui/material";
import ImageUploader from "../../components/ImageUploader";

const CreateTemplate = () => {
  //   const { handleSubmit, control } = useForm();
  const methods = useForm(); // Take all methods once

  const onSubmit = (data) => {
    // const { title } = data;
    console.log("form data:", data);
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="p-4">
        <TitleDescriptionSection />
        <ImageUploader />
        <Button type="submit" variant="contained">
          Save
        </Button>
      </form>
    </FormProvider>
  );
};

export default CreateTemplate;
