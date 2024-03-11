console.log(`Thank you for running jumpsplat120's hackmud web client!
Please report any issues to jumpsplat120#0001 on Discord.`)

console.log("Loading init.js...")

const http = new XMLHttpRequest()

const j = {
	timecode:   Date.now() / 1000 - 3,
	chat_token: localStorage.getItem("chat_token"),
	splash:     false
}

console.log("init.js loaded!")