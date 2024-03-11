console.log("Loading events.js...")

http.onload = function() {
	const response = http.readyState == http.DONE ? JSON.parse(http.response) : http.status
	const date     = new Date()
	
	if (response.chat_token) {	
		console.log(`Chat token response recieved! Chat token is: ${response.chat_token}`)
		localStorage.setItem("chat_token", response.chat_token)
		j.chat_token = response.chat_token
		j.interval   = setInterval(getNewChats, 1250)
	
		fade("in", "main_container", fade("out", "login_container", 250))
	} else if (response.chats) {
		const j_log = response.chats["jumpsplat120"]
		const a_log = response.chats["aiphos"]
		const html  = document.getElementById("default_chat").innerHTML
		
		if (j_log.length > 0 || a_log.length > 0) {
			console.log("Recived populated chat!")
			
			const a_time = a_log[a_log.length - 1] ? a_log[a_log.length - 1].t : 0
			const j_time = j_log[j_log.length - 1] ? j_log[j_log.length - 1].t : 0
			j.timecode = j_time > a_time ? j_time : a_time
			const chat_log = a_log.concat(j_log)
			chat_log.sort(function(a, b) {
				return a.t - a.b
			})
			
			chat_log.forEach(obj => {
				const channel   = obj.channel ? obj.channel : "from"
				const username  = obj.from_user
				
				const newline = `<p><span class="color_b">${getIngameTimestamp(obj.t)}</span> <span class="color_vv">${channel}</span> <span class ="color_${usernameColor(username)}">${username}</span><span class="color_b"> :::</span>${sanitizeString(obj.msg)}<span class="color_b">:::</span></p>`
				getEl("default_chat").insertAdjacentHTML("beforeend", newline)
			})
		}
		
		j.timecode += .5
	} else {
		console.log(response)
	}
}

function submit_pass() {
	if(event.key === "Enter") {		
		console.log(`Chat pass: ${event.target.value}`)
		
		fade("in", "loading_animation", fade("out", "chat_pass_container"))
		
		console.log("Sending token, awaiting response.")
		
		openConnection("get_token")
		sendData({ pass: event.target.value })
	}
}

function transitionend() {
	let el = event.target
	event.stopPropagation() //If I see one god damn bubble...
	
	if (el.classList.contains("invisible")) {
		el.classList.toggle("no-display")
	}
}

let initFadeables = document.getElementsByClassName("fadeable")

for (let i = 0; i < initFadeables.length; i++) {
	initFadeables[i].addEventListener("transitionend", transitionend)
}

initFadeables = null

document.onclick = function() {
	if (!j.splash) {
		runSplashscreen()
		j.splash = true
	}
}

console.log("events.js loaded!")