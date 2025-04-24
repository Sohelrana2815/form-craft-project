import { FormProvider, useForm } from "react-hook-form";
import TitleDescriptionSection from "../../components/TitleDescriptionSection";
import ImageUploader from "../../components/ImageUploader";
import { Box, Button } from "@mui/material";
import TopicSelector from "../../components/TopicSelector";
import TagsInput from "../../components/TagsInput";
import QuestionSets from "../../components/questions/QuestionSets";

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
      <form onSubmit={methods.handleSubmit(onSubmit)} className="md:p-10 p-4">
        <Box className="flex justify-end">
          <Button type="submit" variant="contained">
            Publish
          </Button>
        </Box>
        <TitleDescriptionSection />
        <ImageUploader />
        <TopicSelector />
        <TagsInput />
        <QuestionSets />
      </form>
    </FormProvider>
  );
};

export default CreateTemplate;
