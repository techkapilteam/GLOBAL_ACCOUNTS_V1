import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationService, Screen } from '../../services/navigation.service';

@Component({
  selector: 'app-screen-view',
  imports: [CommonModule],
  templateUrl: './screen-view.component.html',
  styleUrl: './screen-view.component.css'
})
export class ScreenViewComponent implements OnInit {
  screenInfo: Screen | null = null;
  screenTitle: string = '';

  constructor(
    private route: ActivatedRoute,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.navigationService.selectedScreen$.subscribe(screen => {
      if (screen) {
        this.screenInfo = screen;
        this.screenTitle = screen.name;
      }
    });

    if (!this.screenInfo) {
      const urlSegments = this.route.snapshot.url;
      if (urlSegments.length > 0) {
        const lastSegment = urlSegments[urlSegments.length - 1].path;
        this.screenTitle = this.formatScreenName(lastSegment);
      }
    }
  }

  private formatScreenName(name: string): string {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
