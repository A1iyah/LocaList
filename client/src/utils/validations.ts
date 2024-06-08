export const formRegisterValidation = (formData: any) => {
  let errors = "";

  const { name, username, email, password, confirmPassword } = formData;

  if (!email || !password || !name || !username || !confirmPassword) {
    errors = "All information must be filled.";
  } else if (!/^[A-Za-z\s]+$/.test(name)) {
    errors = "Name must contain letters only.";
  } else if (!/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    errors = "Invalid email address.";
  } else if (password.length < 6) {
    errors = "Password must be min 6 characters.";
  } else if (name.length < 2 || username.length < 2) {
    errors = "Name too short.";
  } else if (confirmPassword !== password) {
    errors = "Passwords don't match.";
  } else if (username.length > 20) {
    errors = "Username too long.";
  }

  return errors;
};
