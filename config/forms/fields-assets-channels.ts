import type { IConfigFields } from "@/types";
export const FIELDS = <Record<string, IConfigFields>>{
  name: {
    required: true,
    label: "Naziv",
    icon: {
      name: "tag",
      size: "1rem",
      props: {
        class: "me-1 opacity-20 translate-y-[2px]",
      },
    },
    props: {
      variant: "underlined",
      clearable: true,
    },
  },
  // location: {
  //   label: "Adresa, lokacija",
  //   icon: {
  //     name: "location",
  //     size: "1rem",
  //     props: {
  //       class: "me-1 opacity-20 translate-y-[3px]",
  //     },
  //   },
  // },
  // category: {
  //   type: "select",
  //   required: true,
  //   label: "Firma",
  //   icon: {
  //     name: "folder",
  //     size: ".92rem",
  //     props: {
  //       class: "me-2 opacity-30 translate-y-[2px]",
  //     },
  //   },
  //   props: {
  //     class: "mt-8",
  //   },
  // },
  // code: {
  //   label: "Šifra",
  //   icon: {
  //     name: "hashtag",
  //     size: "1rem",
  //     props: {
  //       class: "me-1 opacity-20 translate-y-[3px]",
  //     },
  //   },
  // },
  notes: {
    type: "textarea",
    label: "Opis",
    icon: {
      name: "$edit",
      size: "1rem",
      props: {
        class: "me-1 opacity-20 translate-y-1",
      },
    },
    props: {
      // placeholder: "",
      clearable: true,
      variant: "underlined",
    },
  },
};
