import { devTokenAPI, getTokenAPI } from "@/http/portal";
export default async function(params) {
  if (process.env.NODE_ENV === "local") {
    let res = await devTokenAPI(params.username, params.password);
    return res.data;
  } else {
    try {
      let res = await getTokenAPI(params.username, params.password);
      return res.data;
    } catch (error) {
      console.error("令牌错误：", error);
    }
  }
}
