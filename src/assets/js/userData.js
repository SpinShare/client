console.log("Initializing System.");

let systemOS = process.platform;
let tempDirLocation = app.getPath('temp');

let userShowExplicit = false;
let userGameDirectory = "";

// TODO: Mac/Linux Support
// TODO: Custom Dir
if(process.platform == "win32") {
    userGameDirectory = path.join(app.getPath("userData"), "../..", "LocalLow", "Super Spin Digital", "Spin Rhythm XD", "Custom");
} else {
    console.error("Unsupported system");
}