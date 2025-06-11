const ImgUploadCode = () => {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Image_upload_to_cloudinary");
    data.append("cloud_name", "djmhyrvxd");
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/djmhyrvxd/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const uploadImageURL = await response.json();
    console.log(uploadImageURL.url);
  };
  return (
    <div>
      <input
        onChange={handleFileUpload}
        type="file"
        className="file-input file-input-neutral"
      />
    </div>
  );
};

export default ImgUploadCode;
