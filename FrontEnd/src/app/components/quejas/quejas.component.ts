import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import { ServicioService } from 'app/servicios/servicio.service';

@Component({
  selector: 'app-quejas',
  templateUrl: './quejas.component.html',
  styleUrls: ['./quejas.component.css']
})
export class QuejasComponent implements OnInit {

  constructor(private service: ServicioService) {
    this.reactiveForm = new FormGroup({
      recaptchaReactive: new FormControl(null, Validators.required)
    });
   }

  reactiveForm: FormGroup;
  siteKey: string = environment.site_key;


  ngOnInit() {
  }

  async resolved(captchaResponse: string, res) {
    console.log(`Resolved response token: ${captchaResponse}`);
    await this.sendTokenToBackend(captchaResponse); //declaring the token send function with a token parameter
  }

  sendTokenToBackend(tok){
    //calling the service and passing the token to the service
    this.service.sendToken(tok).subscribe(
      data => {
        console.log(data)
      },
      err => {
        console.log(err)
      },
      () => {}
    );
  }

}
