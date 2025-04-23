import { FormProvider, useForm } from "react-hook-form";
import TitleDescriptionSection from "../../components/TitleDescriptionSection";
import ImageUploader from "../../components/ImageUploader";
import { Button } from "@mui/material";
import TopicSelector from "../../components/TopicSelector";
import TagsInput from "../../components/TagsInput";

const CreateTemplate = () => {
  const methods = useForm();
  const onSubmit = async (data) => {
    try {
      console.log(data);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="p-4">
        <TitleDescriptionSection />
        <ImageUploader />
        <TopicSelector />
        <TagsInput />
        <Button type="submit" variant="contained">
          Save
        </Button>
      </form>
    </FormProvider>
  );
};

export default CreateTemplate;
