const music = document.querySelector("#music");
      const button = document.querySelector(".music-btn");

      if (
        music instanceof HTMLAudioElement &&
        button instanceof HTMLButtonElement
      ) {
        button.addEventListener("click", async () => {
          if (music.paused) {
            try {
              await music.play();
              button.textContent = "♫ Pause ⏸";
            } catch (error) {
              console.error("Music playback failed:", error);
            }
          } else {
            music.pause();
            button.textContent = "♫ Play a tune ▶";
          }
        });

        music.addEventListener("ended", () => {
          button.textContent = "♫ Play a tune ▶";
        });
      }
