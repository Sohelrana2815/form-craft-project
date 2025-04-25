import { FormProvider, useForm } from "react-hook-form";
import TitleDescriptionSection from "../../components/TitleDescriptionSection";
import ImageUploader from "../../components/ImageUploader";
import { Box, Button } from "@mui/material";
import TopicSelector from "../../components/TopicSelector";
import TagsInput from "../../components/TagsInput";
import QuestionSets from "../../components/questions/QuestionSets";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const CreateTemplate = () => {
  const axiosPublic = useAxiosPublic();
  const methods = useForm();
  const onSubmit = async (data) => {
    try {
      try {
        const postData = {
          title: data.title,
          description: data.description,
          imageUrl: data.image[0] ?? null,
          topic: data.topic,
          tags: data.tags,
          // Short questions
          shortQ1: data.shortQ1,
          showShortQ1: data.showShortQ1,
          shortQ2: data.shortQ2,
          showShortQ2: data.showShortQ2,
          shortQ3: data.shortQ3,
          showShortQ3: data.showShortQ3,
          shortQ4: data.shortQ4,
          showShortQ4: data.showShortQ4,

          // Multi-line questions
          desQ1: data.desQ1,
          showDesQ1: data.showDesQ1,
          desQ2: data.desQ2,
          showDesQ2: data.showDesQ2,
          desQ3: data.desQ3,
          showDesQ3: data.showDesQ3,
          desQ4: data.desQ4,
          showDesQ4: data.showDesQ4,

          // Numeric questions
          positiveInt1: data.positiveInt1,
          showPositiveInt1: data.showPositiveIntQ1,
          positiveInt2: data.positiveInt2,
          showPositiveInt2: data.showPositiveIntQ2,
          positiveInt3: data.positiveInt3,
          showPositiveInt3: data.showPositiveIntQ3,
          positiveInt4: data.positiveInt4,
          showPositiveInt4: data.showPositiveIntQ4,

          // Checkbox questions
          checkboxQ1Question: data.checkboxQ1?.question,
          checkboxQ1Option1: data.checkboxQ1?.option1,
          checkboxQ1Option2: data.checkboxQ1?.option2,
          checkboxQ1Option3: data.checkboxQ1?.option3,
          checkboxQ1Option4: data.checkboxQ1?.option4,

          checkboxQ2Question: data.checkboxQ2?.question,
          checkboxQ2Option1: data.checkboxQ2?.option1,
          checkboxQ2Option2: data.checkboxQ2?.option2,
          checkboxQ2Option3: data.checkboxQ2?.option3,
          checkboxQ2Option4: data.checkboxQ2?.option4,

          checkboxQ3Question: data.checkboxQ3?.question,
          checkboxQ3Option1: data.checkboxQ3?.option1,
          checkboxQ3Option2: data.checkboxQ3?.option2,
          checkboxQ3Option3: data.checkboxQ3?.option3,
          checkboxQ3Option4: data.checkboxQ3?.option4,

          checkboxQ4Question: data.checkboxQ4?.question,
          checkboxQ4Option1: data.checkboxQ4?.option1,
          checkboxQ4Option2: data.checkboxQ4?.option2,
          checkboxQ4Option3: data.checkboxQ4?.option3,
          checkboxQ4Option4: data.checkboxQ4?.option4,
        };

        // console.log(postData);

        const templateResponse = await axiosPublic.post("/templates", postData);
        console.log(postData);

        console.log("Template created successfully");
      } catch (error) {
        console.error("Submission failed:", error);
      }

      console.log("✅ Tags posted");
    } catch (error) {
      console.error("❌ Tag post failed:", error);
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
