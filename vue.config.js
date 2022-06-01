module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                productName: "SpinShare",
                appId: "re.spinsha.client",
                protocols: {
                    name: "spinshare-deeplink",
                    schemes: [
                        "spinshare",
                    ]
                },
                win: {    
                    icon: "build/icons_AppIcon.ico"
                },
                nsis: {
                    oneClick: false,
                    allowToChangeInstallationDirectory: true
                },
                mac: {
                    category: "public.app-category.music-games",
                    target: "dmg",
                    icon: "build/AppIcon.icns"
                },
                dmg: {
                    backgroundColor: "#222"
                },
                appImage: {

                }
            }
        }
    }
}
