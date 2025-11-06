const BASE_URL = "http://127.0.0.1:8000";

// ------------------ USERS ------------------

// Signup
export const signupUser = async (data) => {
  const res = await fetch(`${BASE_URL}/api/users/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Login
export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/api/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Get all users
export const getAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/api/users/all/`);
  return res.json();
};

// Get single user
export const getUser = async (id) => {
  const res = await fetch(`${BASE_URL}/api/users/${id}/`);
  return res.json();
};

// ------------------ JOBS ------------------

// Create a job
export const createJob = async (data, token) => {
  const res = await fetch(`${BASE_URL}/api/jobs/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Get all jobs
export const getAllJobs = async () => {
  const res = await fetch(`${BASE_URL}/api/jobs/all/`);
  return res.json();
};

// Get single job
export const getJob = async (id) => {
  const res = await fetch(`${BASE_URL}/api/jobs/${id}/`);
  if (!res.ok) throw new Error("Failed to fetch job");
  return res.json();
};

// ------------------ APPLICATIONS ------------------

// Apply for a job (public or logged-in)
export const createApplication = async (data, token) => {
  const formData = new FormData();
  formData.append("job", data.job);
  formData.append("cover_letter", data.cover_letter);
  if (data.resume) formData.append("resume", data.resume);

  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/api/applications/create/`, {
    method: "POST",
    headers,
    body: formData,
  });

  let responseData;
  try {
    responseData = await res.json();
  } catch (err) {
    const text = await res.text();
    console.error("Non-JSON response from server:", text);
    responseData = { error: "Invalid JSON response from server", raw: text };
  }

  if (!res.ok) throw responseData;
  return responseData;
};

// Get all applications
export const getAllApplications = async () => {
  const res = await fetch(`${BASE_URL}/api/applications/all/`);
  return res.json();
};

// Get single application
export const getApplication = async (id) => {
  const res = await fetch(`${BASE_URL}/api/applications/${id}/`);
  return res.json();
};

// Update an application
export const updateApplication = async (id, data) => {
  const formData = new FormData();
  if (data.cover_letter) formData.append("cover_letter", data.cover_letter);
  if (data.resume) formData.append("resume", data.resume);

  const res = await fetch(`${BASE_URL}/api/applications/${id}/`, {
    method: "PUT",
    body: formData,
  });

  let responseData;
  try {
    responseData = await res.json();
  } catch (err) {
    const text = await res.text();
    console.error("Non-JSON response from server:", text);
    responseData = { error: "Invalid JSON response from server", raw: text };
  }

  if (!res.ok) throw responseData;
  return responseData;
};

// Delete an application
export const deleteApplication = async (id) => {
  const res = await fetch(`${BASE_URL}/api/applications/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const text = await res.text();
    throw { error: "Failed to delete application", raw: text };
  }
  return { message: "Deleted successfully" };
};
