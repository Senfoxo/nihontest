const bugReportForm = document.getElementById("bugReportForm");
const customSelect = document.querySelector(".custom-select");
const selectedElement = customSelect.querySelector(".selected");
const optionsContainer = customSelect.querySelector(".options-container");
const options = optionsContainer.querySelectorAll(".option");

let selectedCategory = "";

selectedElement.addEventListener("click", () => {
  optionsContainer.classList.toggle("show");
  customSelect.classList.toggle("open");
});

options.forEach((option) => {
  option.addEventListener("click", () => {
    selectedCategory = option.dataset.value;
    selectedElement.textContent = option.textContent;
    optionsContainer.classList.remove("show");
    customSelect.classList.remove("open");
    console.log("Selected value:", selectedCategory);
  });
});

document.addEventListener("click", (event) => {
  if (!customSelect.contains(event.target)) {
    optionsContainer.classList.remove("show");
    customSelect.classList.remove("open");
  }
});

bugReportForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const bugType = document.getElementById("bugType").value;
  const category = selectedCategory;
  const userId = document.getElementById("userId").value;
  const description = document.getElementById("description").value;
  const steps = document.getElementById("steps").value;

  if (!bugType || !category || !userId || !description || !steps) {
    alert("Please fill in all fields.");
    return;
  }

  const bugReport = {
    bugType,
    category,
    userId,
    description,
    steps,
  };

  try {
    await sendBugReportToDiscord(bugReport);
    bugReportForm.reset();
    selectedElement.textContent = "Select a category";
    selectedCategory = "";
    alert("Bug report sent successfully!");
  } catch (error) {
    console.error("Error sending bug report:", error);
    alert("An error occurred while sending the bug report. Please try again.");
  }
});

async function sendBugReportToDiscord(bugReport) {
  const webhookUrl =
    "https://hkdk.events/u7suaefdu1b6qi";

  try {
    const payload = {
      content: "New Bug Report!",
      embeds: [
        {
          color: 0xcb0d3f,
          author: {
            name: "Bug Report",
            icon_url:
              "https://cdn.discordapp.com/emojis/1242122616521625690.webp?size=128&quality=lossless",
          },
          fields: [
            {
              name: "> <:person:1242123231243272347> | Reported By",
              value: `\`\`\`${bugReport.userId}\`\`\``,
              inline: false,
            },
            {
              name: "> <:bugtype:1242123919696072837> | Bug Type",
              value: `\`\`\`${bugReport.bugType}\`\`\``,
              inline: false,
            },
            {
              name: "> <:description:1242170075759251506> | Description",
              value: `\`\`\`${bugReport.description}\`\`\``,
              inline: false,
            },
            {
              name: "> <:steps:1242170077168537710> | Steps to Reproduce",
              value: `\`\`\`${bugReport.steps}\`\`\``,
              inline: false,
            },
            {
              name: "> <:category:1242124205403672748> | Category",
              value: `\`\`\`${bugReport.category}\`\`\``,
              inline: false,
            },
          ],
          footer: {
            text: "Bug Bounty Program | Nihon",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error data:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error sending bug report to Discord:", error);
    throw error;
  }
}