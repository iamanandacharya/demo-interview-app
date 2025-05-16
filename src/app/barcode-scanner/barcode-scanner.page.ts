import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.page.html',
  styleUrls: ['./barcode-scanner.page.scss'],
  standalone: false
})
export class BarcodeScannerPage implements OnInit {
  imageElement: any;
  capturedImage: string | null = null;
  constructor() { }

  ngOnInit() {
  }

  takePicture() {
    const takePicture = async () => {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri
      })

      // image.webPath will contain a path that can be set as an image src.
      // You can access the original file using image.path, which can be
      // passed to the Filesystem API to read the raw data of the image,
      // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
      var imageUrl = image.webPath;

      // Can be set to the src of an image now
      this.imageElement.src = imageUrl;
    };
  }
  async takePhotoAndSave() {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true, // Enable the user to edit the image
      resultType: CameraResultType.Uri, // Get the result as a file URI
      source: CameraSource.Camera, // Use the device's camera
    });
      this.imageElement = image.webPath;;

    if (image.webPath) {
      // Copy the image to the app's file system
      const savedImage = await Filesystem.copy({
        from: image.webPath,
        to: `photo_${Date.now()}.jpeg`, // Unique filename
        directory: Directory.Data,    // Save to the app's data directory
      });

      console.log('Saved image URI:', savedImage.uri);
      // Display the saved image (you'll need a way to show images in your UI)
      // Example for Ionic:
      // const img = document.createElement('img');
      // img.src = Capacitor.convertFileSrc(savedImage.uri);
      // document.body.appendChild(img);
        alert('Image saved successfully! Check console for URI')

    }
  } catch (error: any) {
    console.error('Error taking and saving photo:', error);
    if(error.message === 'User cancelled'){
        alert('User cancelled taking photo');
    }
  }
}
}
