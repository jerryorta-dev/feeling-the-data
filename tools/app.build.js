({
    appDir: "../dev",
    baseUrl: "app",
    dir: "../build",
//    fileExclusionRegExp: /^(r|build)\.js$/,
    optimize: "none",
    mainConfigFile: "../dev/app/requirejs-config.js",
    removeCombined: true,
    keepAmdefine: true,
    skipDirOptimize: false,
    modules: [
        {
            name: "requirejs-config"
        }
    ],
    optimizeCss: "none"
})