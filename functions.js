console.log("Loading functions.js...")

function openConnection(to) {
	http.open("POST", "https://www.hackmud.com/mobile/" + to + ".json")
	http.setRequestHeader("Content-Type","application/json")
}

function sendData(obj) {
	http.send(JSON.stringify(obj))
}

function getEl(id) {
	return document.getElementById(id)
}

function getNewChats() {
	openConnection("chats")
	sendData({
		chat_token: j.chat_token,
		usernames: ["jumpsplat120", "aiphos"],
		after: j.timecode
	})
}

function saveItem(name, item) {
	localStorage.setItem(name, JSON.stringify(item))
}

function getItem(name) {
	return JSON.parse(localStorage.getItem(name))
}

function deleteItem(name) {
	localStorage.removeItem(name)
}

function getIngameTimestamp(time) {
	const timestamp = new Date(time * 1000)
	
	let hours   = timestamp.getHours() < 10 ? "0" + timestamp.getHours().toString() : timestamp.getHours().toString()
	let minutes = timestamp.getMinutes() < 10 ? "0" + timestamp.getMinutes().toString() : timestamp.getMinutes().toString()
	
	return hours + minutes
}

function sanitizeString(string) {
	
	string = JSON.stringify(string)

	let html_color = []
	let lastIndex
	
	for ( i = 0; i < 62 ;i++ ) {
		let ii, string
		
		ii = i
		
		string = "<span class=\"color_"
		
		//color_0 - color_9, color_a - color_z, color_aa - color_zz
		string += i > 35 ? (ii -= 26, ii.toString(36).repeat(2)) : ii.toString(36)
		
		string += "\">"
		
		html_color[i] = string
	}
		
	const hm = [
		/`0/g, /`1/g, /`2/g, /`3/g, /`4/g, /`5/g, /`6/g, /`7/g, /`8/g, /`9/g,
		/`a/g, /`b/g, /`c/g, /`d/g, /`e/g, /`f/g, /`g/g, /`h/g, /`i/g, /`j/g,/`k/g, /`l/g, /`m/g, /`n/g, /`o/g, /`p/g, /`q/g, /`r/g, /`s/g, /`t/g,/`u/g, /`v/g, /`w/g, /`x/g, /`y/g, /`z/g,
		/`A/g, /`B/g, /`C/g, /`D/g, /`E/g, /`F/g, /`G/g, /`H/g, /`I/g, /`J/g, /`K/g, /`L/g, /`M/g, /`N/g, /`O/g, /`P/g, /`Q/g, /`R/g, /`S/g, /`T/g, /`U/g, /`V/g, /`W/g, /`X/g, /`Y/g, /`Z/g,
		/\\n/g, /\\"/g, /\\t/g, /\\\\/g,
		/(\w+)\.(\w+)/g,
		/([a-zA-Z]+)( {0,2}):( {0,2})(true|false|-?\d+|".+")/g,
		/@\w+/g,
		/( |\b)((\d{0,3})(Q))?((\d{0,3})(T))?((\d{0,3})(B))?((\d{0,3})(M))?((\d{0,3})(K))?(\d{0,3})GC( |\b)/g ]
	const html = [
		...html_color,
		"<br>",
		"\"",
		"    ",
		"\\",
		"<span class=\"color_cc\">$1</span>.<span class=\"color_2\">$2</span>",
		"<span class=\"color_nn\">$1</span>$2:$3<span class=\"color_vv\">$4</span>",
		function(...args) {
			//replace @[name] with colored versions
			const match     = args[0]
			const usernames = JSON.parse(localStorage.getItem("usernames"))
			let name        = match.substring(1)
			
			name = usernames[name] ? `<span class=\"color_${usernames[name]}\">${name}<span>` : name
			
			return`@${name}`
		},
		function(...args) {
			//replace GC strings
			let newGC = ""
			
			newGC += args[1] ? args[1] : ""                                            //Determines starting of GC string, either space or word boundry
			newGC += "<span class=\"color_bb\">"                                       //Number color
			newGC += args[3] ? args[3] : ""                                            //Quadrillion numbers
			newGC += args[4] ? "<span class=\"color_dd\">" + args[4] + "</span>" : ""  //Quadrillion letter
			newGC += args[6] ? args[6] : ""                                             //Trillion numbers
			newGC += args[7] ? "<span class=\"color_vv\">" + args[7] + "</span>" : ""   //Trillion letter
			newGC += args[9] ? args[9] : ""                                             //Billion numbers
			newGC += args[10] ? "<span class=\"color_jj\">" + args[10] + "</span>" : "" //Billion letter
			newGC += args[12] ? args[12] : ""                                           //Million numbers
			newGC += args[13] ? "<span class=\"color_ll\">" + args[13] + "</span>" : "" //Million letter
			newGC += args[15] ? args[15] : ""                                           //Thousand numbers
			newGC += args[16] ? "<span class=\"color_nn\">" + args[16] + "</span>" : "" //Thousand letter
			newGC += args[17] ? args[17] : ""                                           //Hundred numbers
			newGC += "<span class=\"color_0\">GC</span></span>"                        //GC
			newGC += args[18] ? args[18] : ""                                           //Determines end of GC string, either space or word boundry
			
			return newGC
		}]
	
	//Remove initial quotes from stringifying
	string = string.substring(1).slice(0,-1)
	
	//Replace everything in arrays
	for (i = 0; i < hm.length ;i++ ) {
		const search  = hm[i]
		const replace = html[i]
		lastIndex = 0
		string = string.replace(search, replace)
	}
	
	//Close all after to make sure we don't use one of the color codes as a closing span
	string = string.replace(/`/g, "</span>")
	
	return string
}

function getNameColor() {
	let colors = ["jj", "ww", "2", "0", "k", "mm"]
	return colors[~~(colors.length * Math.random())]
}

function fade(_, el, after) {
	let	timeout, item
	
	//The first parameter doesn't do anything anymore. It used to define the fade direction but that's no longer needed when we are using .toggle(). It's left in as a way to specify the fade direction when calling this function, that way you're not left wondering which direction the intent to fade is for.
	timeout   = after + 250 || 250
	item      = getEl(el)
	
	item.classList.toggle("fadeable")
	
	setTimeout(_=>{
		if (item.classList.contains("invisible")) { item.classList.toggle("no_display") }
		setTimeout(_=>{ 
			item.classList.toggle("invisible")
			setTimeout(_=> {
				if (item.classList.contains("invisible")) { item.classList.toggle("no_display") }
				item.classList.toggle("fadeable")
			}, 250)
		}, 10)
	}, timeout)
	
	return timeout
}

function usernameColor(username) {
	usernames = getItem("usernames")
				
	usernames = usernames || {}
	usernames[username] = usernames[username] || getNameColor()
	
	saveItem("usernames", usernames)

	return usernames[username]
}

function newTab() {
	
}

function tabClick(me) {
	console.log(me)
}

function disconnect() {
	localStorage.clear()
	j.chat_token = null
}

function startup() {
		if (j.chat_token) {
			fade("in", "main_container")

			console.log(`Chat token exists in localStorage! -> ${j.chat_token}`)
			j.interval   = setInterval(getNewChats, 1250)
		} else if (j.splash) {
			fade("in", "login_container")
		}
}

function runSplashscreen() {
	const title_hack  = getEl("title_hack")
	const title_mud   = getEl("title_mud" )
	const splash_log  = getEl("splash_log")
	const log_element = splash_log.getElementsByTagName("span")
	
	const insert = (el, item) => el.insertAdjacentHTML("beforeend", item)
	const toggle = (el, item) => el.classList.toggle(item)
	
	const log   = [
		["initializing kernel.", ".", ".", " done.<br>"],
		["processing subsystems... done.<br>"],
		["activating hardline... done.<br>"],
		["locking in failsafes... done.<br>"],
		["testing one-time-keys... done.<br><br>"],
		["spinning up primary drives... done.<br>"],
		["secondary drives... done.<br><br>"],
		["eating cookies... done.<br><br>"],
		["initializing half-space entry points... done.<br><br>"],
		["loading api... done.<br><br>"],
		["refreshing cache... done.<br><br>"],
		["warming up primary user interface... done.<br><br>"],
		["loading splash animation..", ". done.<br><br>"]]
	const title = [
	   [["<br><span class=\"color_ss\">",
		 "                 █   █<br>",
		 "<br>",
		 "                █ █   █<br>",
		 "<br>",
		 "<br>",
		 "             <span class=\"color_bb\">█</span>    █<br>",
		 "               █<br>",
		 "<br>",
		 "            █<br>",
		 "<br>",
		 "         █  █<br>",
		 "               █<br>",
		 "       █     █<br>",
		 "          <span class=\"color_bb\">█</span><br>",
		 "         █ █<br>",
		 "    █<br>",
		 "      <span class=\"color_bb\">█</span><br>",
		 "  █      █<br>",
		 "<br>",
		 "  █ █   █<br>",
		 "<br>",
		 "   █ █<br>",
		 "█<br></span>"],
		["<br><span class=\"color_ss\">",
		 "                                    █   █<br>",
		 "                   <br>",
		 "                                   █ █   █<br>",
		 "                   <br>",
		 "                ◢  <br>",
		 "                                <span class=\"color_bb\">█</span>    █<br>",
		 "<span class=\"color_bb\">               ◢ █◤</span>               █<br>",
		 "                   <br>",
		 "               ◢               █<br>",
		 "<span class=\"color_bb\">	            ◢█ ◤  </span><br>",
		 "<span class=\"color_bb\">             ◢██◤  </span>         █  █<br>",
		 "<span class=\"color_bb\">            ◢ </span><span class=\"color_ss\">█</span>◤   </span>               █<br>",
		 "<span class=\"color_bb\">           ◢██◤    </span>       █     █<br>",
		 "<span class=\"color_bb\">          ◢██◤     </span>          <span class=\"color_bb\">█</span><br>",
		 "<span class=\"color_bb\">         ◢</span><span class=\"color_ss\">█</span>█◤  █   </span>         █ █<br>",
		 "<span class=\"color_bb\">   █    ◢██ ██◣ █  </span>    █<br>",
		 "<span class=\"color_bb\">       ◢████</span><span class=\"color_ss\">█</span>██◣   </span>      <span class=\"color_bb\">█</span><br>",
		 "<span class=\"color_bb\">      ◢ █◤  ◢█ ◤   </span>  █      █<br>",
		 "<span class=\"color_bb\">     ◢██◤  ◢██◤  █ </span><br>",
		 "<span class=\"color_bb\">    ◢██◤◢ ◢██◤     </span>  █ █   █<br>",
		 "<span class=\"color_bb\">     ◢◢            </span><br>",
		 "           █          █ █<br>",
		 "                     █</span>"],
		["                                <br><br><br>",
		 "                                                █ █   █<br>",
		 "                                <br>",
		 "                                <br>",
		 "                                             <span class=\"color_bb\">█</span>    █<br>",
		 "                                               █<br>",
		 "                                <br>",
		 "               <span class=\"color_bb\">◢</span>                            █<br>",
		 "	      ◢██◤                <br>",
		 "             ◢██◤                        █  █<br>",
		 "            ◢█<span class=\"color_bb\">█</span>                               █<br>",
		 "           ◢██◤  <span class=\"color_bb\">       ◤█</span><span class=\"color_ss\">█     </span>       █     █<br>",
		 "          ◢██◤                            <span class=\"color_ss\">█</span><br>",
		 "         ◢<span class=\"color_bb\">█</span>█◤    <span class=\"color_bb\">   ◤           </span>         █ █<br>",
		 "        ◢█████◣ <span class=\"color_bb\">█</span><span class=\"color_bb\">    ◢██ ███<span class=\"color_ss\">██</span>◤ </span>    █<br>",
		 "       ◢████<span class=\"color_bb\">█</span>██◣ <span class=\"color_bb\">         ◢██◤  </span>      <span class=\"color_ss\">█</span><br>",
		 "      ◢██◤  ◢<span class=\"color_bb\">█</span> ◤ <span class=\"color_bb\">  ◢█ ██<span class=\"color_ss\">█</span> ██◤◤  </span>  █      █<br>",
		 "     ◢██◤  ◢██◤  <span class=\"color_bb\"> ◢██◤  █ █◤    </span><br>",
		 "    ◢██◤◢ ◢██<span class=\"color_bb\">◤</span>   <span class=\"color_bb\">◢<span class=\"color_ss\">█</span>██ ███◤      </span>  █ █   █<br>",
		 "     ◢           <span class=\"color_bb\">         █     </span><br>",
		 "           <span class=\"color_bb\">█</span>     <span class=\"color_bb\">    ◤          </span>   █ █<br>",
		 "                                █<br><br>",
		 "                                  █"],
		["                                         <br><br>",
		 "                                                         █ █   █<br>",
		 "                                         <br>",
		 "                                         <br><br>",
		 "                                                      <span class=\"color_bb\">█</span>    █<br>",
		 "                                                        █<br>",
		 "                                         <br>",
		 "                                                     █<br>",
		 "	      ◢██◤                        <br>",
		 "             ◢██◤                                 █  █<br>",
		 "            ◢██◤                                       █<br>",
		 "           ◢██◤       ◤█<span class=\"color_bb\">█</span>      <span class=\"color_bb\">         </span>       █     █<br>",
		 "          ◢██◤               <span class=\"color_bb\">       ◢ </span>          <span class=\"color_ss\">█</span><br>",
		 "         ◢██◤   <span class=\"color_bb\">◤</span>           <span class=\"color_bb\">     ◢   </span>         █ █<br>",
		 "        ◢█████◣    ◢██<span class=\"color_bb\">█</span> ████◤<span class=\"color_bb\"> ◢█ ███<span class=\"color_ss\">█</span>█◤</span>    █<br>",
		 "       ◢███████◣        ◢██◤<span class=\"color_bb\"> ◢██◤  ██◤</span>      <span class=\"color_ss\">█</span><br>",
		 "      ◢██◤  ◢██◤  ◢███████◤<span class=\"color_bb\"> ◢█<span class=\"color_ss\">█</span>◤     </span>  █      █<br>",
		 "     ◢██◤  ◢██◤ ◢██◤  <span class=\"color_bb\">█</span>██◤<span class=\"color_bb\"> ◢█<span class=\"color_ss\">█</span>◤ ◢█ ◤</span><br>",
		 "    ◢██◤  ◢██◤ ◢<span class=\"color_bb\">█</span> ██████◤<span class=\"color_bb\"> ◢███<span class=\"color_ss\">█</span>◤██◤</span>  █ █   █<br>",
		 "                          █     <span class=\"color_bb\">   █     </span><br>",
		 "                     <span class=\"color_bb\">◤</span>          <span class=\"color_bb\">      <span class=\"color_ss\">█</span>  </span>   █ █<br>",
		 "                                <span class=\"color_bb\">  █      </span>█<br>",
		 "                                           █<br>"],
		["<br><br><br><br><br><br><br><br><br>",
		 "                                          <span class=\"color_ss\">█</span><br>",
		 "	      ◢██◤                             ◢██◤<br>",
		 "             ◢██◤                        <span class=\"color_bb\">     ◢█<span class=\"color_ss\">█</span>◤<br>",
		 "            ◢██◤                        <span class=\"color_bb\">      ██◤<br>", 
		 "           ◢██◤                        <span class=\"color_bb\">     ◢<span class=\"color_ss\">█</span>█◤<br>", 
		 "          ◢██◤                    <span class=\"color_bb\">█</span>   <span class=\"color_bb\">     ◢<span class=\"color_ss\">█</span>█◤<br>",
		 "         ◢██◤                         <span class=\"color_bb\">    ◢█ ◤<br>",
		 "        ◢█████◣    ◢████████◤ ◢<span class=\"color_bb\">█</span>██<span class=\"color_bb\">█</span>███◤<span class=\"color_bb\"> ◢██◤ ◢██◤<br>",
		 "       ◢███████◣        ◢██◤ ◢██◤ ◢██◤<span class=\"color_bb\"> ◢█ ███<span class=\"color_ss\">█</span>█◤<br>", 
		 "      ◢██◤  ◢██◤ ◢████████◤ ◢<span class=\"color_bb\">█</span>█◤     <span class=\"color_bb\"> ◢█<span class=\"color_ss\">█</span>███◣<br>", 
		 "     ◢██◤  ◢██◤ ◢██◤  ███◤ ◢█ ◤ ◢█<span class=\"color_bb\">█</span>◤<span class=\"color_bb\"> ◢██◤◥██<span class=\"color_ss\">█</span>◣<br>",
		 "    ◢██◤  ◢██◤ ◢████████◤ ◢█████<span class=\"color_bb\">█</span>█◤<span class=\"color_bb\"> <span class=\"color_ss\">◢</span>█    ◥ ██◣<br>",
		 "                                          <span class=\"color_ss\">█</span><br>", 
		 "                                  <span class=\"color_bb\">◢</span>   ◤    <br>",
		 "                                          ",
		 "                                          "],
		["<br><br><br><br><br><br><br><br><br>",
		 "                                            █<br>",
		 "	      ◢██◤                             ◢ █◤<br>",
		 "             ◢██◤                             ◢█<span class=\"color_bb\">█</span>◤<br>",
		 "            ◢██◤                              ██◤  █<br>", 
		 "           ◢██◤                             ◢<span class=\"color_bb\">█</span>█◤<br>", 
		 "          ◢██◤                             ◢<span class=\"color_bb\">█</span>█◤<br>",
		 "         ◢██◤                             ◢█ ◤<br>",
		 "        ◢█████◣    ◢████████◤ ◢███████◤ ◢██◤ ◢██◤<br>",
		 "       ◢███████◣        ◢██◤ ◢██◤ ◢██◤ ◢█ ███<span class=\"color_bb\">█</span>█◤<br>", 
		 "      ◢██◤  ◢██◤ ◢████████◤ ◢██◤      ◢█<span class=\"color_bb\">█</span>███◣<br>", 
		 "     ◢██◤  ◢██◤ ◢██◤  ███◤ ◢██◤ ◢██◤ ◢██◤◥██<span class=\"color_bb\">█</span>◣<br>",
		 "    ◢██◤  ◢██◤ ◢████████◤ ◢███████◤ <span class=\"color_bb\">◢</span>█    ◥ ██◣<br>",
		 "                                          <span class=\"color_bb\">█</span><br>", 
		 "                                          <br>",
		 "                                     █   "],
		["<br><br><br><br><br><br><br><br><br><br>              ◢██◤                            ◢██◤<br>",
          "             ◢██◤                            ◢██◤<br>",
          "            ◢██◤                            ◢██◤<br>",
          "           ◢██◤                            ◢██◤<br>",
          "          ◢██◤                            ◢██◤<br>",
          "         ◢██◤                            ◢██◤<br>",
          "        ◢█████◣    ◢████████◤ ◢███████◤ ◢██◤ ◢██◤<br>",
          "       ◢███████◣        ◢██◤ ◢██◤ ◢██◤ ◢███████◤<br>",
          "      ◢██◤  ◢██◤ ◢████████◤ ◢██◤      ◢█████◣<br>",
          "     ◢██◤  ◢██◤ ◢██◤  ███◤ ◢██◤ ◢██◤ ◢██◤◥███◣<br>",
          "    ◢██◤  ◢██◤ ◢████████◤ ◢███████◤ ◢██◤  ◥███◣<br>"]],
	   [["<span class=\"color_ss\">",
		 "                 █   █<br><br><br>",
		 "<br>",
		 "                █ █   █<br>",
		 "<br>",
		 "<br>",
		 "             <span class=\"color_bb\">█</span>    █<br>",
		 "               █<br>",
		 "<br>",
		 "            █<br>",
		 "<br>",
		 "         █  █<br>",
		 "               █<br>",
		 "       █     █<br>",
		 "          <span class=\"color_bb\">█</span><br>",
		 "         █ █<br>",
		 "    █<br>",
		 "      <span class=\"color_bb\">█</span><br>",
		 "  █      █<br>",
		 "<br>",
		 "  █ █   █<br>",
		 "<br>",
		 "   █ █<br>",
		 "█<br></span>"],
		["<br><span class=\"color_ss\">",
		 "                          █   █<br><br><br>",
		 "<br>",
		 "                         █ █   █<br>",
		 "<br>",
		 "<br>",
		 "                      <span class=\"color_bb\">█</span>    █<br>",
		 "                            █<br>",
		 "<br>",
		 "                                █<br>",
		 "<br>",
		 "                             █  █<br>",
		 "                        █<br>",
		 "                            █     █<br>",
		 "                   <span class=\"color_bb\">█</span><br>",
		 "                             █ █<br>",
		 "<span class=\"color_bb\">    ◢█ █◤ ◢█ █◤</span>    █<br>",
		 "<span class=\"color_bb\">   ◢██<span class=\"color_ss\">█</span>██ █<span class=\"color_ss\">██</span>◤</span>       <span class=\"color_bb\">█</span><br>",
		 "<span class=\"color_bb\">  ◢██◤◢█◤◢ █◤</span>   █      █<br>",
		 "<span class=\"color_bb\"> ◢<span class=\"color_ss\">█</span>█◤   ◢██◤</span> <br>",
		 "<span class=\"color_bb\">◢██◤   ◢██◤</span>   █ █   █<br>",
		 "             <span class=\"color_ss\">◢</span>  <br>",
		 "                   █ █<br>",
		 "                          █<br></span>"],
		["<br><span class=\"color_ss\">",
		 "                                          █   █<br><br><br>",
		 "<br>",
		 "                                           █ █   █<br>",
		 "<br>",
		 "<br>",
		 "                                       <span class=\"color_bb\">█</span>    █<br>",
		 "                                             █<br>",
		 "<br>",
		 "                                           █<br>",
		 "<br>",
		 "                                            █  █<br>",
		 "                                            █<br>",
		 "                           <span class=\"color_ss\">█</span>               █     █<br>",
		 "                        <span class=\"color_bb\">█</span><br>",
		 "                                  <span class=\"color_ss\">◢</span>          █ █<br>",
		 "    ◢███◤ ◢ ██◤ <span class=\"color_bb\">◢██◤   <span class=\"color_ss\">█</span>█◤</span>    █<br>",
		 "   ◢█<span class=\"color_bb\">█</span>███████◤ <span class=\"color_bb\">◢██◤  ◢██◤      <span class=\"color_bb\">█</span></span><br>",
		 "  ◢██◤◢█◤ <span class=\"color_bb\">█</span>█◤ <span class=\"color_bb\">◢ █◤  ◢█<span class=\"color_ss\">█</span></span>   █      █<br>",
		 " ◢██◤   ◢██◤ <span class=\"color_bb\">◢ ██ ██ █◤</span><br>",
		 "◢█<span class=\"color_bb\">█</span>◤   ◢██◤ <span class=\"color_bb\">◢█ █<span class=\"color_ss\">█</span>█ ██◤</span>  █ █   █<br>",
		 "                        <span class=\"color_ss\">█</span><br>",
		 "                          <span class=\"color_ss\">◢</span>              █ █<br>",
		 "                                     █<br></span>"],
		 ["<br><br><br><br><br><br>                                  <span class=\"color_ss\">█<br><br>                                <span class=\"color_ss\">█</span><br><br><br><br>",
		 "                                    <span class=\"color_ss\">█</span>   <span class=\"color_bb\">◢<span class=\"color_ss\">█</span>█◤</span><br>",
		 "                                       <span class=\"color_bb\">◢█ ◤</span><br>",
		 "                                      <span class=\"color_bb\">◢██◤</span><br>",
		 "                                     <span class=\"color_bb\">◢◢█◤</span><br>",
		 "                                    <span class=\"color_bb\">◢██◤</span><br>",
		 "                <span class=\"color_bb\">◢</span>                   <span class=\"color_bb\">◢█ █◤</span><br>",
		 "    ◢███◤ ◢███◤ ◢<span class=\"color_bb\">◢█◤  ◢██◤ ◢███ █████◤</span><br>",
		 "   ◢█████████◤ ◢██◤  ◢██◤ <span class=\"color_bb\">◢██◤  █ ██◤</span><br>",
		 "  ◢██◤◢█◤◢██◤ ◢██◤  ◢<span class=\"color_bb\">◢</span>█◤ <span class=\"color_bb\">◢██◤   ███◤</span><br>",
		 " ◢██◤   ◢██◤ ◢██ ██<span class=\"color_bb\">◢</span>██◤ <span class=\"color_bb\">◢██████ ██◤</span><br>",
		 "◢██◤   ◢██◤ <span class=\"color_bb\">◢</span>████ ███◤ <span class=\"color_bb\">◢██ ██◢◢██◤</span><br><br><br><br></span>"],
		 ["<br>           <span class=\"color_bb\">◢</span><br><br><br><br><br><br>                            <span class=\"color_ss\">█</span><br><br>                                             <span class=\"color_ss\">◢</span><br><br><br>",
		 "                                        ◢ █◤<br>",
		 "                                       ◢██◤<br>",
		 "                                       ██◤<br>",
		 "                                <span class=\"color_bb\">◢</span>    ◢██◤<br>",
		 "                                    ◢██◤<br>",
		 "                                   ◢██◤<br>",
		 "    ◢███◤ ◢███◤ ◢██◤  ◢██◤ ◢██ █<span class=\"color_bb\">◢</span>████◤<br>",
		 "   ◢█████████◤ ◢██◤  ◢██◤ ◢██◤  █ ██◤<br>",
		 "  ◢██◤◢█◤◢██◤ ◢██◤  ◢██◤ ◢██◤   ███◤<br>",
		 " ◢██◤   ◢██◤ ◢████████◤ ◢█████ ███◤<br>",
		 "◢██◤   ◢██◤ ◢████████◤ ◢██ ███<span class=\"color_bb\">◢</span>██◤<br><br>            <span class=\"color_bb\">◢</span><br><br>"],
		 ["<br><br><br><br><br><br><br><br><br><br><br><br>",
		 "                                        ◢██◤<br>",
		 "                                       ◢██◤<br>",
		 "                                      ◢██◤<br>",
		 "                                     ◢██◤<br>",
		 "                                    ◢██◤<br>",
		 "                                   ◢██◤<br>",
		 "    ◢███◤ ◢███◤ ◢██◤  ◢██◤ ◢█████████◤<br>",
		 "   ◢█████████◤ ◢██◤  ◢██◤ ◢██◤  ████◤<br>",
		 "  ◢██◤◢█◤◢██◤ ◢██◤  ◢██◤ ◢██◤   ███◤<br>",
		 " ◢██◤   ◢██◤ ◢████████◤ ◢█████████◤<br>",
		 "◢██◤   ◢██◤ ◢████████◤ ◢█████████◤<br><br><br><br>"]]
		]
	
	const left_title  = title[0]
	const right_title = title[1]
	
	let wait = 0
	
	toggle(getEl("click"), "no_display")
	getEl("startup_sound").play()
	saveItem("splash_viewed", true)
	
	for (let x = 0; log_element.length > x; x++) {
		for (let y = 0; log[x].length > y; y++) {
			wait += x == 0 ? 400 : x == log.length - 1 && y == log[x].length - 1 ? 1000 : Math.random() * 250
			setTimeout(_=> insert(log_element[x], log[x][y]), wait)
		}
	}
	
	for (let x = 0; left_title.length + right_title.length - 3 > x; x++) {
		wait += 125
		if (x < left_title.length) {
			setTimeout(_=> {
				splash_log.innerHTML = ""
				title_hack.innerHTML = ""
				for (let y = 0; left_title[x].length > y; y++) { insert(title_hack, left_title[x][y]) }
			}, wait)
		}
		const len = left_title.length - 3
		if (x >= len) {
			setTimeout(_=> {
				title_mud.innerHTML = ""
				for (let y = 0; right_title[x - len].length > y; y++) { insert(title_mud, right_title[x - len][y]) }
			}, wait)
		}
	}
	
	wait += 250
	setTimeout(_=> {
		toggle(title_hack, "title_right")
		toggle(title_mud, "title_left")
	}, wait)
	
	wait += 500
	setTimeout(_=> {
		toggle(getEl("title_video_left"), "invisible")
		toggle(getEl("title_video_right"), "invisible")
	}, wait)
	
	wait += 2000
	setTimeout(_=> {
		fade("out", "splash_screen_container")
		startup()
	}, wait)
}

console.log("functions.js loaded!")