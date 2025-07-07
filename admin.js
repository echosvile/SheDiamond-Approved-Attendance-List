
// admin.js — handles adding new entries and committing to GitHub

async function addGuestToList(name, number) {
  const token = "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"; // Replace this with your actual GitHub token
  const repo = "SheDiamond-Approved-Attendance-List";
  const username = "echosvile";
  const file = "list.json";

  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${file}`;

  try {
    // Get current list.json content and SHA
    const getRes = await fetch(apiUrl, {
      headers: { Authorization: `token ${token}` }
    });

    if (!getRes.ok) {
      const errorText = await getRes.text();
      console.error("GitHub GET Error:", errorText);
      alert("❌ GitHub rejected the request. Check your token and permissions.");
      return;
    }

    const getData = await getRes.json();
    const content = JSON.parse(atob(getData.content));
    const sha = getData.sha;

    // Insert new guest entry at the top
    const updatedList = { [number]: name, ...content };

    // Encode new list.json
    const encoded = btoa(JSON.stringify(updatedList, null, 2));

    // Commit back to GitHub
    const commitRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `Added ${name} to list.json`,
        content: encoded,
        sha
      })
    });

    if (commitRes.ok) {
      alert(`✅ ${name} (${number}) added successfully.`);
    } else {
      const putError = await commitRes.text();
      console.error("GitHub PUT Error:", putError);
      alert("❌ Failed to commit to GitHub.");
    }
  } catch (err) {
    alert("❌ Error occurred. Check console.");
    console.error(err);
  }
}

function handleSubmit() {
  const name = document.getElementById("name").value.trim();
  const number = document.getElementById("number").value.trim();
  if (!name || !number) {
    alert("Please enter both name and number.");
    return;
  }
  addGuestToList(name, number);
}
