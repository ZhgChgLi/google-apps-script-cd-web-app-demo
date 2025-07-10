// 設定網頁上方導航列超連結
// Internal Link: pageID, Text
//   pageID 會對應檔案 View_pageID.html
const navigationLinks = [
  NavigationLink.internal("iOS", "iOS"),
  NavigationLink.external("https://blog.zhgchg.li", "_blank", "Tech Blog"),
];

// 底部版權訊息，可隨意更改
const footerMessage = "© "+Utilities.formatDate(new Date(), "GMT+8", "YYYY")+" <a href=\"https://zhgchg.li\" target=\"_blank\">zhgchg.li</a> All rights reserved. Powered by <a href=\"https://zhgchg.li\" target=\"_blank\">zhgchg.li</a>."

// iOS 相關設定
// GitHub Repo 路徑：org/repo
const iOSRepoPath = "ZhgChgLi/github-actions-ci-cd-demo";
// Firebase 專案路徑：
// Firebase -> 專案設定 -> 專案編號、應用程式 ID
const iOSFirebaseProject = "projects/專案編號/apps/應用程式 ID";
// 打包紀錄要顯示的 Action Workflows 有哪些
const iOSCDWorkflows = ["CD-Deploy.yml", "CD-Deploy-Form.yml"];


// === Init ===

// Demo 所需，所以用 Stub
// Demo 所需，所以用 Stub
// Demo 所需，所以用 Stub
const iOSGitHub = new GitHubStub(githubToken, iOSRepoPath);
const iOSFirebase = new FirebaseStub(iOSFirebaseProject);
const slack = new SlackStub(slackBotToken);

// 真實專案請用以下
// 真實專案請用以下
// 真實專案請用以下
// const iOSGitHub = new GitHub(githubToken, iOSRepoPath);
// const iOSFirebase = new Firebase(iOSFirebaseProject);
// const slack = new Slack(slackBotToken);

