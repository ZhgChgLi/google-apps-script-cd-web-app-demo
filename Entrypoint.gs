// Entrypoint.gs
// doGet() Web 進入點
function doGet(e) {  
  const template = HtmlService.createTemplateFromFile('View_index');
  const title = "App 打包工具";
  const pageURL = cleanURL(ScriptApp.getService().getUrl());
  const currentPageID = safePageID(e.parameter.pageID);


  template.userEmail = Session.getActiveUser().getEmail();
  template.pageURL = pageURL;
  template.navigationLinks = navigationLinks;
  template.footerMessage = footerMessage;
  template.currentPageID = currentPageID;
  template.title = title;
  template.isStubData = iOSGitHub instanceof GitHubStub;
  return template.evaluate().setTitle(title);
};

// Helper:
function include(page) {
  return HtmlService.createHtmlOutputFromFile(page).getContent();
}

function safePageID(pageID) {
  if (navigationLinks.filter(item => !item.isExternal()).some(item => item.pageID == pageID)) {
    return pageID;
  }
  return null;
}

function cleanURL(pageURL) {
  return pageURL.split("?")[0].split("#")[0];
}