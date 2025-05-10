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
// ------------------------------ IMPORT ----------------------------------//
// Upload img
const image_hosting_key = import.meta.env.VITE_IMG_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const CreateTemplate = () => {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const methods = useForm();
  const onSubmit = async (data) => {
    try {
      let imageUrl = null; // Default value of imgUrl is null

      // If user select image then only upload it in the cloud

      if (data.image && data.image[0]) {
        const imgFile = { image: data.image[0] };
        // Upload to imgbb.com
        const imgRes = await axiosPublic.post(image_hosting_api, imgFile, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (!imgRes.data.success) {
          throw new Error("Failed to upload image");
        }

        // Url after upload the image file
        imageUrl = imgRes.data?.data?.display_url;
      }

      // Remove image property form data

      const { image, ...templateData } = data;

      // Create template with imgUrl or not (optional)

      const templateRes = await axiosSecure.post("/templates", {
        data: templateData,
        imageUrl: imageUrl, // Url or null
      });

      if (templateRes.data) {
        Swal.fire("Template created successfully!", "", "success");
      }
    } catch (error) {
      console.error("Error uploading image", error);
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
