// admin.js — handles adding new entries and committing to GitHub

async function addGuestToList(name, number) {
  const token = "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"; // 🔐 Replace this!
  const username = "echosvile";
  const repo = "SheDiamond-Approved-Attendance-List";
  const file = "list.json";

  const apiUrl = `https://api.github.com/repos/echosvile/SheDiamond-Approved-Attendance-List/contents/list.json`;
  console.log("📡 Connecting to:", apiUrl);

  try {
    const getRes = await fetch(apiUrl, {
      headers: { Authorization: `token ${token}` }
    });

    console.log("✅ GET response status:", getRes.status);

    if (!getRes.ok) {
      const errorText = await getRes.text();
      console.error("❌ Failed to fetch list.json:", errorText);
      alert("❌ Failed to fetch list.json. Check console.");
      return;
    }

    const getData = await getRes.json();
    const content = JSON.parse(atob(getData.content));
    const sha = getData.sha;

    console.log("📦 Current SHA:", sha);
    console.log("📒 Current list:", content);

    const updatedList = { [number]: name, ...content };
    const encoded = btoa(JSON.stringify(updatedList, null, 2));

    const commitBody = {
      message: `Added ${name} (${number})`,
      content: encoded,
      sha
    };

    console.log("📨 Commit payload:", commitBody);

    const commitRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(commitBody)
    });

    console.log("🔄 PUT response status:", commitRes.status);

    if (commitRes.ok) {
      alert(`✅ ${name} (${number}) added successfully.`);
    } else {
      const errorText = await commitRes.text();
      console.error("❌ Commit failed:", errorText);
      alert("❌ Failed to commit. Check console for details.");
    }

  } catch (err) {
    console.error("❌ JS error:", err);
    alert("❌ Error occurred. See console.");
  }
}
