// import Axios from "axios";

const CLOUDINARY_UPLOAD_PRESET = 'vigb9ffx';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/jewelsite/image/upload';

const fileUpload = document.getElementById('file_upload');
const imgPreview = document.getElementById('imgPreview');
const imageUrlHidden = document.getElementById('imageUrlHidden')

fileUpload.addEventListener('change', function(event) {
    var file = event.target.files[0];
    var formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);  

    axios({
        url: CLOUDINARY_UPLOAD_URL,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
    }).then(function(res) {
        imageUrlHidden.value = res.data.secure_url
        imgPreview.src = res.data.secure_url
})
})
