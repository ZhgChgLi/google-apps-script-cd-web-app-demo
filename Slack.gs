// Slack.gs
// Slack 服務相關操作方法
class Slack {
  constructor(token) {
    this.token = token;
  }

  // 用 Email 反查 Slack UID (後續 GitHub Acitons Workflow 中發 Slack 通知要用)
  fetchUserID(email) {
    const result = this.slackRequest(`users.lookupByEmail?email=${encodeURIComponent(email)}`);
    return result?.user?.id || null;
  }

  // Core
  slackRequest(path, payload = null) {
    const isGet = typeof payload !== "object";
    const url = `https://slack.com/api/${path}`;
    const options = {
      method: isGet ? "get" : "post",
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "X-Slack-No-Retry": "1"
      },
      muteHttpExceptions: true
    };

    if (!isGet) {
      options.payload = JSON.stringify(payload);
    }

    try {
      const response = UrlFetchApp.fetch(url, options);
      const json = JSON.parse(response.getContentText());

      if (!json.ok) {
        throw new Error(`Slack API Error (${path}): ${json.error}`);
      }

      return json;

    } catch (err) {
      console.error(`Slack Request Failed [${path}]:`, err);
      throw new Error(`Slack request failed: ${err.message}`);
    }
  }
}