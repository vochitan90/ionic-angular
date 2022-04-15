import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  @Output()
  imagePick = new EventEmitter<string | File>();

  @Input() showPreview = false;
  selectedImage: string;
  userPicker = false;

  constructor(private platform: Platform) {}

  ngOnInit() {
    console.log('Mobile', this.platform.is('mobile'));
    console.log('Hybrid', this.platform.is('hybrid'));
    console.log('iOS', this.platform.is('ios'));
    console.log('Android', this.platform.is('android'));
    console.log('Desktop', this.platform.is('desktop'));

    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.userPicker = true;
    }
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }

    Camera.getPhoto({
      // quality: 50,
      // source: CameraSource.Prompt,
      // correctOrientation: true,
      // height: 320,
      // width: 200,
      // resultType: CameraResultType.Base64,

      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 70,
    })
      .then((image) => {
        this.selectedImage = `data:image/jpeg;base64,${image.base64String}`;
        this.imagePick.emit(this.selectedImage);
      })
      .catch((error) => {
        console.log(error);
        if (this.userPicker) {
          this.filePickerRef.nativeElement.click();
        }
      });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];

    if (!pickedFile) {
      return;
    }

    const fr = new FileReader();

    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    };

    fr.readAsDataURL(pickedFile);
  }
}
