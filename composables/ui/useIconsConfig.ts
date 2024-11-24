export const useIconsConfig = () => {
  const {
    db: {
      Assets: { DigitalFormFieldTypes },
    },
  } = useAppConfig();
  const ICONS_ASSETS_FORMS_type = {
    [DigitalFormFieldTypes.TEXT]: {
      icon: "paragraph",
      size: "1.22rem",
      class: "opacity-40",
    },
    [DigitalFormFieldTypes.BOOLEAN]: {
      icon: "control-switch",
      size: "1.22rem",
      class: "opacity-40",
    },
    [DigitalFormFieldTypes.CHOICE]: {
      icon: "checklist",
      size: "1.22rem",
      class: "opacity-40",
    },
    [DigitalFormFieldTypes.FILES]: {
      icon: "$file",
      size: "1.22rem",
      class: "opacity-40",
    },
    [DigitalFormFieldTypes.RATING]: {
      icon: "$ratingEmpty",
      size: "1.22rem",
      class: "opacity-40",
    },
  };
  return {
    ICONS_ASSETS_FORMS_type,
  };
};
