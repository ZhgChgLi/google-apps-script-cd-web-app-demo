// GitHub.gs
// GitHub 服務相關操作方法
class GitHub {
  constructor(token, repoPath) {
    this.token = token;
    this.repoPath = repoPath;
  }

  // 取得 Self-hosted Runner 列表
  // ref: https://docs.github.com/en/rest/actions/self-hosted-runners?apiVersion=2022-11-28#list-self-hosted-runners-for-an-organization
  fetchRunners() {
    const runners = this.githubRequest("GET", "https://api.github.com/repos/"+this.repoPath+"/actions/runners").runners || [];
    const sortedRunners = runners.sort((a, b) => {
      const getPriority = runner => {
        if (runner.status === "offline") return 2;
        return runner.busy ? 1 : 0;
      };

      return getPriority(a) - getPriority(b);
    });

    return sortedRunners ;
  }

  // 取得開啟中的 PR (只取 100 筆，夠多了吧？)
  // ref: https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-pull-requests
  fetchOpenPRs() {
    const response = this.githubRequest("GET", `https://api.github.com/repos/${this.repoPath}/pulls?state=open&per_page=100`);
    return response
  }

  // 取得 Action Workflows 執行紀錄、狀態、及正在執行的任務，並渲染好資料
  // ref: https://docs.github.com/en/rest/actions/workflows?apiVersion=2022-11-28#list-repository-workflows
  // ref: https://docs.github.com/en/rest/actions/workflow-jobs?apiVersion=2022-11-28#list-jobs-for-a-workflow-run
  fetchRuns(workflows) {
    const displayRunStatus = {
      "in_progress": '<span class="badge text-bg-primary">🏃‍♂️‍➡️執行中...</span>',
      "pending": '<span class="badge text-bg-primary">⌛️排隊中...</span>',
      "queued": '<span class="badge text-bg-primary">⌛️排隊中...</span>',
      "timed_out": '<span class="badge text-bg-danger">🥱已超時...</span>',
      "completed": "",
    }

    const displayRunConclusion = {
      "success": '<span class="badge text-bg-success">成功</span>',
      "failure": '<span class="badge text-bg-danger">執行失敗</span>',
      "startup_failure": '<span class="badge text-bg-danger">啟動失敗</span>',
      "cancelled": '<span class="badge text-bg-secondary">已取消</span>',
      "skipped": '<span class="badge text-bg-secondary">已跳過</span>',
    }

    let allRuns = workflows.flatMap(workflow => {
      const response = this.githubRequest("GET", `https://api.github.com/repos/${this.repoPath}/actions/workflows/${workflow}/runs?per_page=50`);
      return response.workflow_runs || [];
    });

    // 按 created_at 排序
    allRuns.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // 美化 & 計算進度
    const enhancedRuns = allRuns.map(run => {
      const createdAt = new Date(run.created_at);
      const createdAtLocal = Utilities.formatDate(createdAt, "Asia/Taipei", "yyyy-MM-dd HH:mm:ss");

      const displayStatus = displayRunStatus[run.status] ?? run.status;
      const displayConclusion = displayRunConclusion[run.conclusion] ?? run.conclusion;

      const durationMinutes = Math.round((new Date() - createdAt) / 60000);

      let completedSteps = [], currentStep = null, currentJobRunnerName = null, allSteps = [], progressPercent = 0;

      if (run.status === "in_progress") {
        const jobsResponse = this.githubRequest("GET", run.jobs_url);
        const jobs = jobsResponse.jobs || [];

        jobs.forEach(job => {
          job.steps.forEach(step => {
            allSteps.push(step);
            if (step.status === "in_progress") {
              currentStep = step.name;
              currentJobRunnerName = job.runner_name;
            } else if (step.status === "completed") {
              completedSteps.push(step);
            }
          });
        });

        progressPercent = allSteps.length ? (completedSteps.length / allSteps.length) * 100 : 0;
      }

      return {
        id: run.id,
        html_url: run.html_url,
        name: run.name,
        conclusion: run.conclusion,
        status: run.status,
        created_at: createdAtLocal,
        displayStatus,
        displayConclusion,
        durationMinutes,
        completedSteps,
        currentStep,
        currentJobRunnerName,
        allSteps,
        progressPercent
      };
    });

    return enhancedRuns;
  }

  // 觸發 GitHub Actions Workflow 工作
  // ref: https://docs.github.com/en/rest/actions/workflows?apiVersion=2022-11-28#create-a-workflow-dispatch-event
  dispatchWorkflow(jobYAML, branch, inputs) {
    const payload = {
      ref: branch,
      inputs: inputs
    };

    try {
      const url = `https://api.github.com/repos/${this.repoPath}/actions/workflows/${jobYAML}/dispatches`;
      this.githubRequest("post", url, payload);
    } catch (error) {
      if (error.message.includes("No ref found for")) {
        throw new Error(`❌ 找不到分支：${branch}`);
      } else if (error.message.includes("Unexpected inputs provided") || error.message.includes("Workflow does not have 'workflow_dispatch' trigger")) {
        throw new Error(`❌ 分支過舊，請更新 ${branch} 分支。`);
      } else {
        throw new Error(`❌ 請求失敗。\n${error.message}`);
      }
    }
  }
  
  // Core
  githubRequest(method, url, payload = null, maxRetries = 3, retryDelayMs = 1000) {
    const normalizedMethod = method.toLowerCase().trim();
    const headers = {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${this.token}`,
      "X-GitHub-Api-Version": "2022-11-28"
    };

    const options = {
      method: normalizedMethod,
      headers: headers,
      muteHttpExceptions: true, // 不要因 4xx/5xx throw，讓我們自己處理
      contentType: "application/json"
    };

    if (payload) {
      options.payload = JSON.stringify(payload);
    }

    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = UrlFetchApp.fetch(url, options);
        const statusCode = response.getResponseCode();
        const responseText = response.getContentText();

        if (statusCode >= 200 && statusCode < 300) {
          // 成功 → 回傳已解析的 JSON
          return JSON.parse(responseText || "{}");
        } else {
          // 非 2xx → 記錄錯誤並重試
          lastError = `Status: ${statusCode}, Response: ${responseText}`;
          Logger.log(`⚠️ Attempt ${attempt}: ${lastError}`);
        }
      } catch (error) {
        // 網路或 GAS 錯誤
        lastError = error.message;
        Logger.log(`⚠️ Attempt ${attempt} threw error: ${lastError}`);
      }

      if (attempt < maxRetries) {
        Logger.log(`🔁 Retrying in ${retryDelayMs} ms...`);
        Utilities.sleep(retryDelayMs);
      }
    }

    throw new Error(`❌ GitHub request failed after ${maxRetries} attempts. Last error: ${lastError}`);
  }
}