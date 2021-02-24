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

export async function validateRegisterAgencyForm(formData) {
  let errors = {};
  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
    errors.email = "Please type a valid email";
  }

  if (!formData.name) {
    errors.name = "Name is required";
  }
  if (formData.locations.length === 0) {
    errors.location = "Please select atleast 1 location";
  }

  if (!formData.phone) {
    errors.phone = "Phone number is required";
  }
  return errors;
}
