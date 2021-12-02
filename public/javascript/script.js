const file = document.querySelector('#file');
const photo = document.querySelector('#preImage');

file.addEventListener("change", () => {
    const files = file.files;
    if (!files || !files.length) {
      photo.src = "";
      return;
    }
    const firstFile = files[0];
    const objectURL = URL.createObjectURL(firstFile);
    photo.src = objectURL;
});