import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as Keycloak from 'keycloak-js';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(private _httpClient: HttpClient) {}
  private _url = 'http://localhost:7688/admin/realms/master/users';
  ngOnInit(): void {
    this._httpClient.get(this._url).subscribe(data => {
      console.log(data);
    });

    // let kc = Keycloak.getInstance("");
  }
}
