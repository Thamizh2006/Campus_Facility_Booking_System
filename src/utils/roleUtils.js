export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const getToken = () => {
  const user = getUser();
  return user?.token;
};

export const hasRole = (...roles) => {
  const user = getUser();
  return user && roles.includes(user.role);
};
