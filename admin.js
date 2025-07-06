
window.onload = function () {
  async function addGuestToList(name, number) {
    const token = "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";
    const repo = "SheDiamond-Approved-Attendance-List";
    const username = "echosvile";
    const file = "list.json";

    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${file}`;

    try {
      const getRes = await fetch(apiUrl, {
        headers: { Authorization: `token ${token}` }
      });

      const getData = await getRes.json();
      const content = JSON.parse(atob(getData.content));
      const sha = getData.sha;

      const updatedList = { [number]: name, ...content };
      const encoded = btoa(JSON.stringify(updatedList, null, 2));

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

  window.handleSubmit = function () {
    const name = document.getElementById("name").value.trim();
    const number = document.getElementById("number").value.trim();
    if (!name || !number) {
      alert("Please enter both name and number.");
      return;
    }
    addGuestToList(name, number);
  };
};
