import { FormProvider, useForm } from "react-hook-form";
import TitleDescriptionSection from "../../components/TitleDescriptionSection";
import ImageUploader from "../../components/ImageUploader";
import { Box, Button } from "@mui/material";
import TopicSelector from "../../components/TopicSelector";
import TagsInput from "../../components/TagsInput";
import QuestionSets from "../../components/questions/QuestionSets";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
// -----------------------------------------------------//
// Upload img
const image_hosting_key = import.meta.env.VITE_IMG_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const CreateTemplate = () => {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const methods = useForm();
  // Onsubmit part
  const onSubmit = async (data) => {
    const imageFile = { image: data.image[0] };
    try {
      // // 1) Upload the image
      const imgRes = await axiosPublic.post(image_hosting_api, imageFile, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("image upload:", imgRes.data);

      if (!imgRes.data.success) {
        throw new Error("Image upload failed");
      }

      const { image, ...restOfData } = data;
      // 2) Build postData using the *image* response
      const postData = {
        ...restOfData,
        imageUrl: imgRes.data.data.display_url,
      };
      console.log(postData);

      // 3) Send template creation
      const templateRes = await axiosSecure.post("/templates", postData);
      console.log("template created:", templateRes.data);

      Swal.fire("Template created successfully!", "", "success");
    } catch (error) {
      console.error("Submission failed:", error);
      Swal.fire("Oops!", error.message, "error");
    }
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="md:p-10 p-4">
        <Box className="flex justify-end">
          <Button type="submit" variant="contained">
            {methods.formState.isSubmitting ? "Publishing..." : "Publish"}
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
