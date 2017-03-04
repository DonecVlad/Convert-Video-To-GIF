window.addEventListener('load', function() {
	let formData = new FormData()
	let dropZone = document.getElementById('drop_zone')
	let statusBlock = document.getElementById('statusBlock')
	let file = document.getElementById('videoFile')
	let xhr = new XMLHttpRequest()
	
	let socketKey = null
	
	network = new network({
		url:window.location.hostname
	})
	
	dropZone.addEventListener('dragover', function(event){
		event.stopPropagation()
		event.preventDefault()
		
		dropZone.classList.add('over_drop_zone')
	})
	
	dropZone.addEventListener('dragleave', function(event){
		event.stopPropagation()
		event.preventDefault()
		
		dropZone.classList.remove('over_drop_zone')
	})
	
	dropZone.addEventListener('drop', handleFileSelect, false)
	
	function handleFileSelect(event) {
		event.stopPropagation()
		event.preventDefault()
		
		formData.append('video', event.dataTransfer.files[0])
		upload()
	}
	
	document.getElementById('selectFile').addEventListener('click', function(){
		document.getElementById('selectFile').click()
	})
	
	file.addEventListener('change', function () {
		formData.append('video', file.files[0])
		upload()
	})
	
	function upload(){
		formData.append('key', socketKey)
		xhr.open('POST', '/upload_video', true)
		xhr.send(formData)
		
		formData = new FormData()
	}
	
	xhr.upload.addEventListener('loadstart', function(data){
		statusBlock.innerHTML = 'Загружаем файл'
		document.getElementById('progressBar').style.display = 'block'
		document.getElementById('statusBlock').style.display = 'block'
	})
	
	xhr.upload.addEventListener('progress', function(event){
		if(event.loaded == event.total){
			statusBlock.innerHTML = 'Загрузка файла завершена!'
		} else {
			document.getElementById('line').style.width = Math.round(event.loaded / event.total * 100) + '%'
		}
	})
	
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && xhr.status == 200) {
			let img = document.createElement('img')
			img.setAttribute('src', '/gifs/' + xhr.responseText)
			img.setAttribute('width', '660')
			document.getElementById('image').appendChild(img)
			
			document.getElementById('progressBar').style.display = 'none'
			document.getElementById('statusBlock').style.display = 'none'
		}
	}
	
	network.status = function(data) {
		statusBlock.innerHTML = data
	}
	
	network.key = function(data) {
		socketKey = data
	}
})