navigateTo({
      name: "status-message",
      params: {
        message: encodeURIComponent(
          JSON.stringify({
            props: {
              size: "large",
              color: "success",
              title: `#${lastPostAdded.value?.id} 👌🏻 Članak je uspešno sačuvan.`,
              // text: "limited gently solve dead sunlight knowledge",
            },
            action: {
              text: `📃 Otvori`,
              to: {
                name: "app-objave-oid",
                params: {
                  oid: lastPostAdded.value?.id,
                },
              },
            },
            icon: {
              icon: "$success",
              size: "10rem",
              color: "success",
              class: "",
            },
          })
        ),
      },
    });
    