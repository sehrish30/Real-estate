export async function uploadToCloudinary(image) {
  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", "realestate");
  data.append("cloud_name", "dtxrrhfqj");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dtxrrhfqj/image/upload",
    {
      method: "post",
      body: data,
      mode: "cors",
    }
  );
  const final = await res.json();
  return final.secure_url;
}
