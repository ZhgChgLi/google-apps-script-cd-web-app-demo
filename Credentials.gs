// Slack Bot Token，用來反查 Email 對應的 Slack UID (需要 https://api.slack.com/scopes/users:read.email 權限)
// 或也可以發送通知訊息
const slackBotToken = "xoxb---";

// GitHub Token
// GitHub -> 帳號 -> Settings -> Developer Settings -> Fine-grained personal access tokens or Personal access tokens (classic)
// 如果不想依賴在某人的帳號上建議建立一支乾淨的團隊 GitHub 帳號，使用它的 Token
// 建議用 Fine-grained personal access tokens 比較安全，但有期限
// Fine-grained personal access tokens 需要的權限：
//   Repository permissions -> Actions (read/write)
//   Repository permissions -> Administration (read only)
const githubToken = "";