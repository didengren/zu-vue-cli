import Cookies from "js-cookie";

const TokenKey = `${process.env.VUE_APP_ICON_BRAND}-token`;
const CachedUser = "cached-user";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getCachedUser() {
  return Cookies.get(CachedUser);
}

export function setCachedUser(user) {
  return Cookies.set(CachedUser, user);
}

export function removeCachedUser() {
  return Cookies.remove(CachedUser);
}
