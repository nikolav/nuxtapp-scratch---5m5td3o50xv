export const useNavigationUtils = () => {
  const showUserScreen = (uid: any) =>
    navigateTo({ name: "tim-uid", params: { uid } });
  return {
    showUserScreen,
  };
};
