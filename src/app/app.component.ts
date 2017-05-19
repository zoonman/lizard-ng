import {Component, OnInit} from '@angular/core';
import * as c3 from 'c3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})

export class AppComponent implements OnInit {
  title = 'App!';

  ngOnInit() {
    c3.generate({
      bindto: '#bmiGraph',
      data: {
        columns: [
          ['data1', 30, 200, 100, 400, 150, 250],
          ['data2', 50, 20, 10, 40, 15, 25]


        ]
      }
    });
  }
}


export class User {
  id: string;
  name: string;
  email: string;

}
