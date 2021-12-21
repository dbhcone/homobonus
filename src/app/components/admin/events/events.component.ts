import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EventformComponent } from './eventformcomponent';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { EventService } from 'src/app/services/event.service';
import { GeneralService } from 'src/app/services/general.service';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-events',
  styleUrls: ['./events.component.scss'],
  templateUrl: './events.component.html',
})
export class EventsComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'flyer',
    'title',
    'date',
    'time',
    'venue',
    'description',
    'edit',
    'delete',
    'settings',
    'portal'
  ];
  dataSource: MatTableDataSource<any>;
  subscription?: Subscription;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private dialog: MatDialog, private eventService: EventService, private general: GeneralService) {
    this.dataSource = new MatTableDataSource();
    this.fetchEvents();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchEvents(): void {
    this.eventService.getAllEvents().subscribe((res: any) => {
      console.log(res);

      this.dataSource.data = res.data.events;
    });
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateEventDialog(): void {
    const dialogRef = this.dialog.open(EventformComponent, {
      width: '500px',
      disableClose: true,
    });
    this.subscription = dialogRef.afterClosed().subscribe((result) => {
      console.log('dialog closed', result);
      this.fetchEvents();
    });
  }

  openEditEventDialog(data: any): void {
    data.heading = 'EDIT';
    const dialogRef = this.dialog.open(EventformComponent, {
      width: '500px',
      disableClose: true,
      data,
    });
    this.subscription = dialogRef.afterClosed().subscribe((result) => {
      console.log('dialog closed', result);
      this.fetchEvents();
    });
  }

  deleteEvent(_id: string) {
    this.eventService.deleteEvent(_id).subscribe(
      async (resp: any) => {
        console.log('Delete', resp);
        Swal.fire({ text: resp.message, icon: 'success' }).then((result) => {
          this.fetchEvents();
        });
      },
      (err) => {
        Swal.fire({
          title: `${err.error.status} - ${err.error.code}`,
          text: `${err.error.message}`,
        });
      }
    );
  }

  triggerDeleteEvent(_id: string) {
    Swal.fire({
      title: 'Delete Event - Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        this.deleteEvent(_id);
      } else {
        Swal.fire('Cancelled', 'Your data is safe :)', 'error');
      }
    });
  }

  displayFlyer(flyer?: any) {
    return `${flyer?.fileBaseUrl}/${flyer?.filename}`;
  }

  twelveHourTime(time: string) {
    return this.general.twelveHourTime(time);
  }
}
