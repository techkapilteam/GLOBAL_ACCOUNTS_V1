import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavigationService, Module, SubModule, Screen } from '../../services/navigation.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  modules: Module[] = [];
  selectedModule: Module | null = null;
  selectedSubModule: SubModule | null = null;
  selectedScreen: Screen | null = null;
  sidebarCollapsed: boolean = false;
  username: string = '';
  expandedSubModules: Set<string> = new Set();

  constructor(
    private navigationService: NavigationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.modules = this.navigationService.getModules();
    this.username = this.authService.getUsername();

    this.navigationService.selectedModule$.subscribe(module => {
      this.selectedModule = module;
    });

    this.navigationService.selectedSubModule$.subscribe(subModule => {
      this.selectedSubModule = subModule;
    });

    this.navigationService.selectedScreen$.subscribe(screen => {
      this.selectedScreen = screen;
    });
  }

  selectModule(module: Module): void {
    this.navigationService.selectModule(module);
    this.expandedSubModules.clear();
  }

  toggleSubModule(subModule: SubModule): void {
    if (this.expandedSubModules.has(subModule.id)) {
      this.expandedSubModules.delete(subModule.id);
    } else {
      this.expandedSubModules.add(subModule.id);
    }
    this.navigationService.selectSubModule(subModule);
  }

  isSubModuleExpanded(subModuleId: string): boolean {
    return this.expandedSubModules.has(subModuleId);
  }

  selectScreen(screen: Screen): void {
    this.navigationService.selectScreen(screen);
    this.router.navigate([screen.route]);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
