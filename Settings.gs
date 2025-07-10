// Settings.gs
// 設定網頁上方導航列超連結
// Internal Link: pageID, Text
//   pageID 會對應檔案 View_pageID.html
const navigationLinks = [
  NavigationLink.internal("iOS", "iOS"),
  NavigationLink.external("https://blog.zhgchg.li", "_blank", "Tech Blog"),
  NavigationLink.external("https://dev.zhgchg.li/ci-cd-%E5%AF%A6%E6%88%B0%E6%8C%87%E5%8D%97-%E4%B8%80-ci-cd-%E6%98%AF%E4%BB%80%E9%BA%BC-%E5%A6%82%E4%BD%95%E9%80%8F%E9%81%8E-ci-cd-%E6%89%93%E9%80%A0%E7%A9%A9%E5%AE%9A%E9%AB%98%E6%95%88%E7%9A%84%E9%96%8B%E7%99%BC%E5%9C%98%E9%9A%8A-%E5%B7%A5%E5%85%B7%E9%81%B8%E6%93%87-c008a9e8ceca", "_blank", "CI/CD 系列文章"),
  NavigationLink.external("https://github.com/ZhgChgLi/github-actions-ci-cd-demo", "_blank", "GitHub Actions Demo Repo"),
  NavigationLink.external("https://script.google.com/home/projects/1CBB39OMedqP9Ro1WSlvgDnMBin4-ksyhgly2h_KrbOuFiPHTalNgwHOp/edit", "_blank", "GAS Web App Source Code")
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

