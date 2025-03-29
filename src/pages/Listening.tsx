
        try {
          await speakText(currentExercise.audio.transcript, 'it-IT');
        } catch (error) {
          console.error("Error playing audio:", error);
        }
