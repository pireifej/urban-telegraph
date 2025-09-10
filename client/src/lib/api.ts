export async function fetchExternalArticles(timezone: string = "US/Eastern") {
  try {
    const response = await fetch("https://www.prayoverus.com:3000/getAllBlogArticles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tz: timezone }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching external articles:", error);
    throw error;
  }
}

export function getTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "US/Eastern";
  } catch {
    return "US/Eastern";
  }
}
