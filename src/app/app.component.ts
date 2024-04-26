import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RaspService } from './services/rasp.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DatePipe],
})
export class AppComponent implements OnInit {
  title = 'timetable';
  firstInputValue!: string;
  secondInputValue!: string;
  installDate!: any;
  stationFrom = '';
  stationTo = '';
  format = 'json';
  from = 0;
  to = 0;
  date: string | null | undefined = '';
  transport_types: string | null = null;
  result: any = [];

  constructor(private datePipe: DatePipe, public raspService: RaspService) {}

  ngOnInit(): void {}

  toHandler(e: any): void {
    this.stationTo = e.target.value;
    this.raspService
      .getCodeStation(this.format, this.stationTo)
      .subscribe((data) => {
        this.to = data.body.suggests[0].point_key;
      });
  }

  fromHandler(e: any): void {
    this.stationFrom = e.target.value;
    this.raspService
      .getCodeStation(this.format, this.stationFrom)
      .subscribe((data) => {
        this.from = data.body.suggests[0].point_key;
      });
  }

  dateHandler(e: any): void {
    this.date = this.datePipe.transform(e.target.value, 'yyyy-MM-dd');
  }

  swapValues() {
    const temp = this.firstInputValue;
    this.firstInputValue = this.secondInputValue;
    this.secondInputValue = temp;
    this.stationFrom = this.firstInputValue;
    this.stationTo = this.secondInputValue;
    this.raspService
      .getCodeStation(this.format, this.stationFrom)
      .subscribe((data) => {
        this.from = data.body.suggests[0].point_key;
      });
    this.raspService
      .getCodeStation(this.format, this.stationTo)
      .subscribe((data) => {
        this.to = data.body.suggests[0].point_key;
      });
  }

  getCurrentDate(): void {
    const currentDate = new Date();
    this.installDate = this.datePipe.transform(currentDate, 'dd/MM/yyyy');
    this.date = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
  }

  instTummorowDate(): void {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    this.installDate = this.datePipe.transform(currentDate, 'dd/MM/yyyy');
    this.date = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
  }

  otherTranspHandler() {
    this.transport_types = null;
  }

  planeHandler() {
    this.transport_types = 'plane';
  }

  trainHandler() {
    this.transport_types = 'train';
  }

  subwayHandler() {
    this.transport_types = 'suburban';
  }

  autoHandler() {
    this.transport_types = 'bus';
  }

  findHandler() {
    if (this.transport_types) {
      this.raspService
        .getInfo(
          this.from,
          this.to,
          this.date,
          this.transport_types,
          '16eebf1a-50c9-4539-87f7-ef9d3811ea97'
        )
        .subscribe((data) => {
          this.result = data.body.segments;
        });
    } else {
      this.raspService
        .getInfoOthers(
          this.from,
          this.to,
          this.date,
          '16eebf1a-50c9-4539-87f7-ef9d3811ea97'
        )
        .subscribe((data) => {
          this.result = data.body.segments;
        });
    }
  }

  calculateDuration(arrival: string, departure: string): string {
    const arrivalDate = new Date(arrival);
    const departureDate = new Date(departure);
    const duration = arrivalDate.getTime() - departureDate.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} ч. ${minutes} мин.`;
  }
}
