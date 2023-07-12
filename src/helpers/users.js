export const saveUsersToLocalStorage = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};

export const getUsersFromLocalStorage = () => {
  const storedUsers = localStorage.getItem("users");
  return storedUsers ? JSON.parse(storedUsers) : [];
};
