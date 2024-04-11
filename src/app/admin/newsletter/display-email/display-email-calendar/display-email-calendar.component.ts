import { Component } from '@angular/core';
import { NewsletterService } from "../../../../service/newsletter/newsletter.service";
import { MatDialog } from '@angular/material/dialog';
import { EmailPreviewComponent } from './email-preview/email-preview.component'; // Import your dialog component


@Component({
  selector: 'app-display-email-calendar',
  templateUrl: './display-email-calendar.component.html',
  styleUrls: ['./display-email-calendar.component.css']
})
export class DisplayEmailCalendarComponent {
  selectedView: 'list' | 'calendar' = 'calendar';
  emails!: any[]; // Change the type as per your data structure
  calendar: any[][] = [];

  selectedMonth: number = 0;
  currentYear: number = 0;
  currentDate!: Date;

  constructor(private newsletterService: NewsletterService,
              public dialog: MatDialog
  ) {}


  async ngOnInit() {
    this.currentDate = new Date();
    this.currentDate.setHours(0,0,0,0)
    await this.setCurrentMonth();
    this.loadEmails();
  }

  loadEmails() {
    const startDate = new Date(this.currentYear, this.selectedMonth, 1);
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() + 1 - startDate.getTimezoneOffset() / 60 / 24);
    const endDate = new Date(this.currentYear, this.selectedMonth + 1, 0);
    endDate.setHours(0, 0, 0, 0);
    endDate.setDate(endDate.getDate() + 1 - endDate.getTimezoneOffset() / 60 / 24);

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];


    this.newsletterService.getNewsletterEmailsByDateRange(formattedStartDate, formattedEndDate).subscribe(
      (emails) => {
        this.emails = emails;
        this.generateCalendar(this.selectedMonth, this.currentYear);
      },
      (error) => {
        console.error('Failed to load emails:', error);
      }
    );
  }

  setCurrentMonth() {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth();
    this.currentYear = currentDate.getFullYear();
  }

  generateCalendar(month: number, year: number) {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Adjust the first day of the week

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const currentMonthLastDay = lastDayOfMonth.getDate();

    const calendar: any[] = [];
    let week: any[] = [];

    // Fill empty slots with days from the previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevMonthDate = new Date(year, month - 1, prevMonthLastDay - i);
      week.push({ date: prevMonthDate, isCurrentMonth: false, today: false});
    }

    // Fill calendar with days from the current month
    for (let i = 1; i <= currentMonthLastDay; i++) {
      const currentDate = new Date(year, month, i);

      const isCurrentMonth = true;
      let today = false;
      if (this.currentDate.getTime() === currentDate.getTime()) {
        today = true;
      }
      week.push({ date: currentDate, isCurrentMonth, today });
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    // Fill remaining slots with days from the next month
    let nextMonthFirstDay = 1;
    while (week.length < 7) {
      const nextMonthDate = new Date(year, month + 1, nextMonthFirstDay);
      week.push({ date: nextMonthDate, isCurrentMonth: false, today: false });
      nextMonthFirstDay++;
    }
    calendar.push(week);
    console.log(calendar)

    this.calendar = calendar;
  }

  isSameDay(scheduleDate: string, date: Date): boolean {
    const schedule = new Date(scheduleDate);
    return (
      schedule.getFullYear() === date.getFullYear() &&
      schedule.getMonth() === date.getMonth() &&
      schedule.getDate() === date.getDate()
    );
  }

  changeMonth(direction: string) {
    if (direction === 'previous') {
      this.selectedMonth--;
      if (this.selectedMonth < 0) {
        this.selectedMonth = 11;
        this.currentYear--;
      }
    } else if (direction === 'next') {
      this.selectedMonth++;
      if (this.selectedMonth > 11) {
        this.selectedMonth = 0;
        this.currentYear++;
      }
    }
    /*this.generateCalendar(this.selectedMonth, this.currentYear);*/
    this.loadEmails();
  }

  getMonthName(month: number): string {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[month];
  }

  openEmailDialog(email: any) {
    const dialogRef = this.dialog.open(EmailPreviewComponent, {
      data: email
    });
  }



}
