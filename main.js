console.log("Loading main.js...")

disconnect()

j.splash = getItem("splash_viewed") ? (getEl("click").classList.toggle("no_display"), true) : false

startup()

console.log("main.js loaded!")