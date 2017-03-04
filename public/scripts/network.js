(function() {
	let root = this
	
	let network = function(options){
		this.socket = io.connect(options.url)
		
		this.setEventListeners()
		
		this.socket.emit('init', null)
	}
	
	network.prototype = {
		status:(data) => {
			return data
		},
		key:(data) => {
			console.log(`We got a key! ${data}`)
			return data
		},
		
		setEventListeners: function() {
			this.socket.on('status', function(data) {
				this.status(data)
			}.bind(this))
			
			this.socket.on('key', function(data) {
				this.key(data)
			}.bind(this))
		}
	}
	
	root.network = network
}).call(this)