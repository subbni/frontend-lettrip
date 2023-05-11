const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/v2/maps",
    createProxyMiddleware({
      target: "https://dapi.kakao.com",
      changeOrigin: true,
    })
  );
  //   app.use(
  //     createProxyMiddleware({
  //       target:
  //         "http://ec2-3-35-173-250.ap-northeast-2.compute.amazonaws.com:8080",
  //       changeOrigin: true,
  //     })
  //   );
};
