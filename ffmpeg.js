const spawn = require('child_process').spawn
const Promise = require('bluebird')

exports.getFPS = (file) => {
	return new Promise(function(resolve, reject) {
		let answerParts = ''
		
		let ffprobe = spawn('ffprobe', ['-v', 'quiet', '-print_format', 'json', '-show_streams', file])
		
		ffprobe.stdout.on('data', (data) => {
			answerParts += data
		})
		
		ffprobe.on('close', (code) => {
			let metaData = {}
			try {
				metaData = JSON.parse(answerParts).streams[0]
			}
			catch(err) {
				reject(new Error('Cannot parse json'))
			}
			
			resolve(eval(metaData.r_frame_rate))
		})
		
		ffprobe.on('error', (err) => {
			reject(new Error('Cannot get metadata', err))
		})
	})
}

exports.generateGIF = (file, fps, sessionID, offset = '00:00', duration = 5) => {
	return new Promise(function(resolve, reject) {
		let ffmpeg = spawn('./toGIF', [file, `public/gifs/${sessionID}.gif`, fps < 30 ? fps : 30 , offset, duration])
		
		try {
			ffmpeg.on('close', () => {
				resolve(`${sessionID}.gif`)
			})
		}
		catch(err) {
			reject(new Error('Cannot conver file'))
		}
	})
}