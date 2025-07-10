// 定義網頁上方導航連結物件結構
class NavigationLink {
  constructor(type, options) {
    this.linkType = type;
    Object.assign(this, options);
  }

  static internal(pageID, text) {
    return new NavigationLink("internal", { pageID, text });
  }

  static external(url, target, text) {
    return new NavigationLink("external", { url, target, text });
  }

  isExternal() {
    return this.linkType === "external";
  }

  isActive(currentPageID) {
    return currentPageID == this.pageID;
  }
}