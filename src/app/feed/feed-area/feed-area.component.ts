import { Component, OnInit,} from '@angular/core';
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { Post_area } from 'src/app/service_models/api_service.model';
import { NgForm } from '@angular/forms';
import { posting_service } from 'src/app/services/services_post';
@Component({
  selector: 'app-feed-area',
  templateUrl: './feed-area.component.html',
  styleUrls: ['./feed-area.component.css'],
  providers:[Post_area]
})
export class FeedAreaComponent implements OnInit {
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  @ViewChild('myPond') myPond: any;
  @ViewChild("search")
  pondOptions = {
    class: 'my-filepond',
    multiple: true,
    allowImagePreview:true,
    imagePreviewMaxFileSize:5,
    imagePreviewHeight: 100,
    imageCropAspectRatio: '1:1',
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 100,
    labelIdle: 'Attachments',
  }
  
  pondHandleAddFile(event: any) {
    console.log('A file was added', event);
  }
  
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private Post_area_lc:Post_area,
    private posting_service_:posting_service  ) {

  }

  ngOnInit() {
    this.Post_area_lc.post_area_txt="";
    //set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }
  onSubmit(form : NgForm)
  {
    this.posting_service_.create_post(form.value).subscribe((res) => {
      console.log(res);

        });

  }
  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }
}