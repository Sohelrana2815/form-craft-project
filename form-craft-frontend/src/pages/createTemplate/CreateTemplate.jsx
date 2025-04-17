import { FormProvider, useForm } from "react-hook-form";
import TitleDescriptionSection from "../../components/TitleDescriptionSection";
import ImageUploader from "../../components/ImageUploader";
import { Button } from "@mui/material";
import TopicSelector from "../../components/TopicSelector";

const CreateTemplate = () => {
  const methods = useForm();
  const onSubmit = (data) => {
    console.log("form data:", data);
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="p-4">
        <TitleDescriptionSection />
        <ImageUploader />
        <TopicSelector />
        <Button type="submit" variant="contained">
          Save
        </Button>
      </form>
    </FormProvider>
  );
};

export default CreateTemplate;
