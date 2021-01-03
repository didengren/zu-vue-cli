export const isActive = (_this, route) => {
  return route.path === _this.$route.path;
};

export const toLastView = (_this, visitedViews, view) => {
  const latestView = visitedViews.slice(-1)[0];
  if (latestView) {
    _this.$router.push(latestView.fullPath);
  } else {
    if (view.name === "Dashboard") {
      _this.$router.replace({
        path: "/redirect" + view.fullPath
      });
    } else {
      _this.$router.push("/");
    }
  }
};

/**
 * 单个tag关闭
 *
 * @param {object} view $store.state.tagsMod.visitedViews
 */
export function closeSelectedTag(view) {
  try {
    this.$store.dispatch("tagsMod/delView", view).then(({ visitedViews }) => {
      if (isActive(this, view)) {
        toLastView(this, visitedViews, view);
      }
    });
  } catch (error) {
    const _message = error.message;
    console.error(
      "closeSelectedTag报错:",
      _message,
      ~_message.indexOf("$store")
        ? "\n(→_→)傻瓜，快试试用call、apply方法！"
        : ""
    );
  }
}
