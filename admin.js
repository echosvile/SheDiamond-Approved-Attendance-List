// admin.js — handles adding new entries and committing to GitHub

async function addGuestToList(name, number) {
  const token = "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";
  const repo = "SheDiamond-Approved-Attendance-List";
  const username = "echosvile";
  const file = "list.json";

  const apiUrl = `https://api.github.com/repos/echosvile/SheDiamond-Approved-Attendance-List/contents/list.json`;

  try {
    // Get current list.json content and SHA
    const getRes = await fetch(apiUrl, {
      headers: { Authorization: `token ${token}` }
    });
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
      alert("❌ Failed to commit to GitHub.");
      console.error(await commitRes.text());
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
