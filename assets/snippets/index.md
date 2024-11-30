
# redirect-@action:status
navigateTo({
      name: "status-message",
      params: {
        message: JSON.stringify({
          props: {
            size: "large",
            color: "success",
            title: "👌🏻 Obrazac je uspešno poslat.",
            // text: "limited gently solve dead sunlight knowledge",
          },
          action: {
            text: "📃 Pogledaj obrazac",
            to: {
              name: "teren-rid-pregled",
              params: { rid: lastSubmissionCreated.value.id },
            },
          },
          icon: {
            icon: "$complete",
            size: "8rem",
            color: "success",
            class: "",
          },
        }),
      },
    });
    
