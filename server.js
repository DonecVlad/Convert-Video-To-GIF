const fs = require('fs')
const express = require('express')
const multer = require('multer')
const upload = multer({ dest: require('os').tmpdir() })
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const ffmpeg = require('./ffmpeg')

let users = []

app.use(express.static(__dirname + '/public'))

server.listen(42046)

app.get('/', (req, res) => {
	res.sendFile('index.html', {root: __dirname })
})

io.on('connection', (socket) => {
	socket.on('init', () => {
		let u_id = helpers.generateID()
		
		users.push({socket:socket.id, id:u_id})
		socket.emit('key', u_id)
	})
	
	// Добавить обработчик ушедших пользователей
	// Следить за users, тут утечка памяти будет, лет через 200, но точно будет
	socket.on('disconnect', () => {
	})
})

app.post('/upload_video', upload.single('video'), (req, res) => {
	ffmpeg.getFPS(req.file.path).then(fps => {
		helpers.sendToUser(req.body.key, 'status', 'Получаем данные файла')
		this.currentID = helpers.generateID()
		return fps
	})
	.then(fps => {
		helpers.sendToUser(req.body.key, 'status', 'Генерируем GIF')
		return ffmpeg.generateGIF(req.file.path, fps, this.currentID)
	})
	.then(gifLink => {
		res.status(200).send(gifLink)
	})
})

let helpers = {
	generateID: () => {
		let S4 = () => {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
		}
		return (S4() + S4() + S4())
	},
	
	getSocketID: (user_id) => {
		for(let user of users) {
			if(user.id == user_id) return user.socket
		}
	},
	
	sendToUser: (user_id, chanel, msh) => {
		io.to(helpers.getSocketID(user_id)).emit('status', 'Получаем данные файла')
	}
}