export const setUserToLocalStorage = (user) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user to localStorage:", error);
  }
};

export const getUserFromLocalStorage = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error retrieving user from localStorage:", error);
    return null; // Return null to avoid breaking the app
  }
};

export const removeUserFromLocalStorage = () => {
  try {
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Error removing user from localStorage:", error);
  }
};
