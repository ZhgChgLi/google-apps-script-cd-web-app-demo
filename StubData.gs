// Demo Project 專用，用 Stub Data 抽換去打真實的 API
// 真實專案不需要引入此檔案。
// 真實專案不需要引入此檔案。
// 真實專案不需要引入此檔案。
// StubData ref: https://docs.google.com/spreadsheets/d/16KEHxRgmMAI1dx7yP1sUAQpU1T8UyOhXRf7-18_l63E/edit?gid=1665166641

class SlackStub extends Slack {
  constructor(token) {
    super(token);
    this.rollback = false;
    this.stubable = new Stubable("slack");
  }

  // Core
  slackRequest(path, payload = null) {
    const stubKey = path;
    const stubData = this.stubable.read(stubKey);
    if (stubData) {
      return stubData;
    }
    
    if(!this.rollback) {
      return null;
    }

    const result = super.slackRequest(path, payload);
    this.stubable.write(stubKey, result);
    return result;
  }
}
//
class FirebaseStub extends Firebase {
  constructor(project) {
    super(project);
    this.rollback = false;
    this.stubable = new Stubable("firebase");
  }

  fetchAppDistributionDownloadLink(run_id) {
    const stubKey = "fetchAppDistributionDownloadLink"+run_id;
    const stubData = this.stubable.read(stubKey);
    if (stubData) {
      return stubData;
    }

    if(!this.rollback) {
      return null;
    }

    const result = super.fetchAppDistributionDownloadLink(run_id);
    this.stubable.write(stubKey, result);
    return result;
  }
}
//
class GitHubStub extends GitHub {
  constructor(token, repoPath) {
    super(token, repoPath);
    this.stubable = new Stubable("github");
    this.rollback = false;
  }

  fetchRuns(workflows) {
    const runs = super.fetchRuns(workflows).filter(run => run.conclusion == "success" || run.status == "in_progress");
    const m = Math.floor(Math.random() * (17 - 3 + 1)) + 3;
    for (let i = 0; i < runs.length; i++) {
      let run = runs[i];

      switch(run.id) {
        case 16148481495:
          run.name = "[CD-Deploy-Form] refs/heads/feature/dark-mode";
          break;
        case 16147623599:
          run.name = "[CD-Deploy-Form] refs/heads/fix/update-dependencies";
          break;
        case 16147048519:
          run.name = "[CD-Deploy-Form] refs/heads/chore/improve-performance";
          break;
        case 16146656361:
          run.name = "[CD-Deploy-Form] refs/heads/feature/login-api";
          break;
        case 16144761379:
          run.name = "[CD-Deploy-Form] refs/heads/fix/payment-gateway";
          break;

      }

      const mins = (i+1) * m;
      const created_at = new Date();
      created_at.setMinutes(created_at.getMinutes() - mins);
      created_at.setSeconds(created_at.getSeconds() - Math.floor(Math.random() * (57 - 12 + 1)) + 12);
      const end_at = new Date();
      run.created_at = Utilities.formatDate(created_at, "Asia/Taipei", "yyyy-MM-dd HH:mm:ss");

      const durationMillis = end_at.getTime() - created_at.getTime();
      run.durationMinutes = Math.round(durationMillis / 60000);
    }

    return runs;
  }

  dispatchWorkflow(jobYAML, branch, inputs) {
    return;
  }

  // Core
  githubRequest(method, url, payload = null, maxRetries = 3, retryDelayMs = 1000) {
    const stubKey = method+url;
    const stubData = this.stubable.read(stubKey);
    if (stubData) {
      return stubData;
    }

    if(!this.rollback) {
      return null;
    }

    const result = super.githubRequest(method, url, payload, maxRetries, retryDelayMs);
    this.stubable.write(stubKey, result);
    return result;
  }
}

class Stubable {
  constructor(type) {
    // https://docs.google.com/spreadsheets/d/16KEHxRgmMAI1dx7yP1sUAQpU1T8UyOhXRf7-18_l63E/edit?gid=1388240209#gid=1388240209
    const spreadsheet = SpreadsheetApp.openById("16KEHxRgmMAI1dx7yP1sUAQpU1T8UyOhXRf7-18_l63E");
    this.sheet = spreadsheet.getSheetByName("StubData");
    this.type = type;
  }

  write(key, value) {
    this.sheet.appendRow([
      this.type,
      key,
      JSON.stringify(value)
    ]);
  }

  read(key) {
    const data = this.sheet.getDataRange().getValues();
    const row = data.find(r => r[0] === this.type && r[1] === key);
    if (row) {
      return JSON.parse(row[2]);
    }
    return null;
  }

  static fetchStubAsanaTasks() {
    return [
      {
        "id": "App-101",
        "title": "新增使用者登入功能",
        "type": "Feature",
        "githubBranch": "feature/user-login"
      },
      {
        "id": "App-102",
        "title": "修正支付失敗後頁面閃退",
        "type": "Fix",
        "githubBranch": "fix/payment-crash"
      },
      {
        "id": "App-103",
        "title": "改善商品搜尋效能",
        "type": "Feature",
        "githubBranch": "feature/improve-search-performance"
      },
      {
        "id": "App-104",
        "title": "修正 Email 驗證無法寄送",
        "type": "Fix",
        "githubBranch": "fix/email-verification"
      },
      {
        "id": "App-105",
        "title": "開發訂單追蹤功能",
        "type": "Feature",
        "githubBranch": "feature/order-tracking"
      }
    ];
  }
}
