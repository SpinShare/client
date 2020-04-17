// Protocol
if(process.argv.length > 1) {
    if(process.argv[1].includes("spinshare-song")) {
        let songId = process.argv[1].replace("spinshare-song://", "").replace("/", "");
        NavigateToSongDetail(songId);
    } else if(process.argv[1].includes("spinshare-user")) {
        let userId = process.argv[1].replace("spinshare-user://", "").replace("/", "");
        NavigateToUser(userId);
    }
}