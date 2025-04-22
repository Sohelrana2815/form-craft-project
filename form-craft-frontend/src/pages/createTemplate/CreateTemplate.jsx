import { FormProvider, useForm } from "react-hook-form";
import TitleDescriptionSection from "../../components/TitleDescriptionSection";
import ImageUploader from "../../components/ImageUploader";
import { Button } from "@mui/material";
import TopicSelector from "../../components/TopicSelector";
import TagsInput from "../../components/TagsInput";
import QuestionFields from "../../components/QuestionFields";

const CreateTemplate = () => {
  const methods = useForm();
  const onSubmit = async (data) => {
    try {
      console.log("Form Data:", data);
      // ফাইল অবজেক্ট দেখুন
      console.log("Selected Image File:", data.image ? data.image[0] : null);
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
        <QuestionFields />
        <Button type="submit" variant="contained">
          Save
        </Button>
      </form>
    </FormProvider>
  );
};

export default CreateTemplate;
