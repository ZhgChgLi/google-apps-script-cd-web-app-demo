// iOS 頁面邏輯處理相關方法
// 對應 View_iOS.html 中 JS 的呼叫 google.script.run.withSuccessHandler().XXX

// 撈取 GitHub Actions Workflow 紀錄，並使用 View_iOS_runs.html 渲染，回應 HTML 供顯示。
function iOSLoadRuns() {
  const template = HtmlService.createTemplateFromFile('View_iOS_Runs');
  const pageURL = ScriptApp.getService().getUrl();
  template.runs = iOSGitHub.fetchRuns(iOSCDWorkflows);
  template.pageURL = pageURL;
  template.loadedTime = Utilities.formatDate(new Date(), "GMT+8", "HH:mm:ss");
  return template.evaluate().getContent();
}

// 用給定的 run_id 去查看看在 Firebase App Distribution 有沒有相關紀錄，有則返回下載資訊連結。
function iOSLoadAppDistributionDownloadLink(run_id) {
  const link = iOSFirebase.fetchAppDistributionDownloadLink(run_id);
  return link;
}

// 撈取 Asana API 任務列表、GitHub API 開啟中 PR，並使用 View_iOS_Form.html 渲染，回應含表單內容的  HTML 供顯示。
function iOSLoadForm() {
  const template = HtmlService.createTemplateFromFile('View_iOS_Form');
  template.tasks = Stubable.fetchStubAsanaTasks();
  template.prs = iOSGitHub.fetchOpenPRs();
  return template.evaluate().getContent();
}

// 撈取 Self-hosted Runner 狀態，並使用 View_iOS_Runners.html 渲染，回應 HTML 供顯示。
function iOSLoadRunner() {
  const template = HtmlService.createTemplateFromFile('View_iOS_Runners');
  template.loadedTime = Utilities.formatDate(new Date(), "GMT+8", "HH:mm:ss");
  template.runners = iOSGitHub.fetchRunners();
  return template.evaluate().getContent();
}

// 觸發 Github Actions Workflow 執行工作，等同在 Repo GitHub Actions 上 Run workflow 表單觸發操作。
function iOSSubmitForm(form) {
  const email = Session.getActiveUser().getEmail();
  const branch = form["branch"];
  const buildNumber = form["buildNumber"];
  const versionNumber = form["versionNumber"];
  const releaseNote = form["releaseNote"];

  if (branch == null || branch == "") {
    throw new Error(`請填寫或選擇目標分支`);
  }

  iOSGitHub.dispatchWorkflow("CD-Deploy-Form.yml", branch, {
    "BUILD_NUMBER": buildNumber,
    "VERSION_NUMBER": versionNumber,
    "VERSION_NUMBER": versionNumber,
    "RELEASE_NOTE": releaseNote,
    "AUTHOR": email,
    "SLACK_USER_ID": slack.fetchUserID(email)
  });
  
  return {"ok":true, "message": "請求送出成功！"};
}