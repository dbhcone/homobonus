import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventService } from 'src/app/services/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eventform',
  templateUrl: './eventform.component.html',
  styleUrls: ['./eventform.component.scss'],
})
export class EventformComponent implements OnInit {
  submitting = false;
  createEventForm;
  flyerFile: File | undefined;
  flyerSrc: string | undefined;

  photoFiles: File[] | undefined;
  photoSrcs: string[] | undefined;

  HEADING = 'CREATE A NEW EVENT';

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    public dialogRef: MatDialogRef<EventformComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
    this.createEventForm = fb.group({
      title: [
        data?.title || null,
        Validators.compose([Validators.required, Validators.minLength(5)]),
      ],
      date: [data?.date || null, Validators.required],
      time: [data?.time || null, Validators.required],
      // speaker: [null, Validators.required],
      capacity: [data?.capacity || null],
      venue: [data?.venue || null, Validators.required],
      flyer: [null, Validators.required],
      extraDetails: fb.array([]),
      description: [
        data?.description || null,
        Validators.compose([Validators.required, Validators.minLength(10)]),
      ],
      photos: [null],
    });
    if (this.data) {
      this.HEADING = 'EDIT EVENT DETAILS';
    }
  }

  ngOnInit(): void {}

  public get title(): AbstractControl | null {
    return this.createEventForm.get('title');
  }

  public get date(): AbstractControl | null {
    return this.createEventForm.get('date');
  }

  public get time(): AbstractControl | null {
    return this.createEventForm.get('time');
  }

  public get capacity(): AbstractControl | null {
    return this.createEventForm.get('capacity');
  }

  public get venue(): AbstractControl | null {
    return this.createEventForm.get('venue');
  }

  public get flyer(): AbstractControl | null {
    return this.createEventForm.get('flyer');
  }

  public get description(): AbstractControl | null {
    return this.createEventForm.get('description');
  }

  public get photos(): AbstractControl | null {
    return this.createEventForm.get('photos');
  }

  // public get extraDetails(): AbstractControl | null {
  //   return this.createEventForm.get('extraDetails');
  // }

  // Dynamic Extra details
  extraDetails(): FormArray {
    return this.createEventForm.get('extraDetails') as FormArray;
  }

  newDetail(): FormGroup {
    return this.fb.group({
      label: '',
      value: '',
    });
  }

  addDetail() {
    this.extraDetails().push(this.newDetail());
  }

  removeDetail(i: number) {
    this.extraDetails().removeAt(i);
  }

  onSubmit() {
    const formData = new FormData();
    const formValue = this.createEventForm.value;
    console.log('We are about submitting the form', formValue);
    this.submitting = true;
    for (const key in formValue) {
      if (Object.prototype.hasOwnProperty.call(formValue, key)) {
        let element = formValue[key];
        // check for event details
        if (key == 'extraDetails') {
          element = JSON.stringify(element);
        }
        formData.append(key, element);
      }
    }
    this.eventService.createEvent(formData).subscribe(
      async (resp: any) => {
        Swal.fire({
          icon: 'success',
          titleText: resp.message,
        }).then(() => {
          this.closeDialog();
        });
      },
      (err) => {
        this.submitting = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          titleText: err.error.message,
        });
      }
    );
  }

  onFileSelected(event: any) {
    this.flyerFile = <File>event.target.files[0];
    this.previewImage();
    this.createEventForm.patchValue({
      flyer: this.flyerFile,
    });
    this.createEventForm.get('flyer')?.updateValueAndValidity();
  }

  private previewImage() {
    const reader = new FileReader();
    if (this.flyerFile) {
      reader.readAsDataURL(this.flyerFile);
      reader.onload = () => {
        this.flyerSrc = reader.result as string;
      };
    }
  }

  onMultipleFilesSelected(event: any) {
    this.flyerFile = <File>event.target.files[0];
    this.previewMultipleImages();
    this.createEventForm.patchValue({
      photos: this.photoFiles,
    });
    this.createEventForm.get('flyer')?.updateValueAndValidity();
  }

  private previewMultipleImages() {
    const reader = new FileReader();
    if (this.flyerFile) {
      reader.readAsDataURL(this.flyerFile);
      reader.onload = () => {
        this.flyerSrc = reader.result as string;
      };
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
