// Firebase.gs
// Firebase 服務相關操作方法
class Firebase {
  constructor(project) {
    this.project = project;
  }

  // 取得 Firebase App Distribution 下載連結
  // 需要先到專案設定 -> Google Cloud Platform (GCP) 專案 綁定對應的 Firebase GCP Project 才能使用
  // 需要先到專案設定 -> Google Cloud Platform (GCP) 專案 綁定對應的 Firebase GCP Project 才能使用
  // 需要先到專案設定 -> Google Cloud Platform (GCP) 專案 綁定對應的 Firebase GCP Project 才能使用
  // Token 權限：
  // 部署的執行身份是存取網頁的使用者的話：看當前使用者本身，當前登入的使用者要有對應的 Firebase Project 權限
  // 部署的執行身份是我的話：看部署腳本的人本身，要有對應的 Firebase Project 權限
  
  fetchAppDistributionDownloadLink(run_id) {
    const baseUrl = `https://firebaseappdistribution.googleapis.com/v1/${this.project}/releases`;
    const filter = encodeURIComponent(`releaseNotes.text=*${run_id}*`);
    const url = `${baseUrl}?filter=${filter}`;

    const headers = {
      "Authorization": "Bearer " + ScriptApp.getOAuthToken()
    };

    const options = {
      method: "get",
      headers: headers,
      muteHttpExceptions: true
    };

    try {
      const response = UrlFetchApp.fetch(url, options);
      const code = response.getResponseCode();
      if (code !== 200) {
        console.warn(`Firebase API returned ${code}: ${response.getContentText()}`);
        return null;
      }

      const json = JSON.parse(response.getContentText());
      const releases = json.releases || [];
      if (releases.length === 0) {
        return null;
      }

      var result = [];
      releases.forEach(function(release){{
        const note = release.releaseNotes.text.trim().replace(/\r?\n/g, '<br/>');

        result.push(
          {
            "title": release.displayVersion+" ("+release.buildVersion+")",
            "url": release.testingUri,
            "note": note
          }
        )
      }});

      return result;

    } catch (err) {
      return null;
    }
  }
}